

const Block = (type, world, x, y) => {
  const SPRITE_BASE_URL = 'images/tiles/'
  const STATES = {
    ACTIVE: 'active',
    EMPTY: 'empty'
  }

  const width = 32
  const height = 32

  let sprite = `brick.gif`
  let state = STATES.ACTIVE
  let parent = world.DOM.blocks

  let elem = $(`<div class="hittable block ${type}"></div>`)
  parent.append(elem)

  const setSprite = () => {
    if (type === 'brick') {
      let sprite = `brick.gif`
    } else if (['coin', 'mushroom'].includes(type)) {
      if (state === STATES.ACTIVE) {
        sprite = `question_block.gif`
      } else {
        sprite = `empty_block.gif`
      }
    }

    elem.css({
      'background-image': `url('${SPRITE_BASE_URL + sprite}')`,
      left: x * 32,
      bottom: y * 32
    })
  }

  setSprite()

  let animating = false

  const hit = (power) => {
    if (animating || state !== STATES.ACTIVE) {
      AudioManager.playSound('bump')
      return
    }

    const left = parseInt(elem.css('left'))
    const bottom = parseInt(elem.css('bottom'))

    // move up a bit
    if (type === 'brick') {
      if (power === 'normal') {
        AudioManager.playSound('break')

        const offset = 5
        animating = true
        elem.animate({
          bottom: bottom + offset
        }, 50).animate({
          bottom
        }, () => {
          animating = false
        })
      } else {
        elem.remove()
        const brokenTopLeft = $('<div class="effect brokenBrick topLeft"></div>')
        const brokenTopRight = $('<div class="effect brokenBrick topRight"></div>')
        const brokenBottomLeft = $('<div class="effect brokenBrick bottomLeft"></div>')
        const brokenBottomRight = $('<div class="effect brokenBrick bottomRight"></div>')
        const pieces = [brokenTopLeft, brokenTopRight, brokenBottomLeft, brokenBottomRight]
        pieces.map((piece, index) => {
          parent.append(piece)
          const rightSide = (index & 1)
          const bottomSide = (index & 2)
          const px = (x * 32) + (rightSide? 16 : 0)
          const py = 16 + (y * 32) - ((index & 2)? 16 : 0)
          piece.css({
            left: px,
            bottom: py
          }).animate({
            left: px + (64 * (rightSide? 1 : -1)),
            bottom: py + 96 - (bottomSide? 32 : 0)
          }, 100).animate({
            left: px + (128 * (rightSide? 1 : -1)),
            bottom: -16
          }, 200, () => {
            piece.remove()
          })
        })
      }
    }
    else if (type === 'coin' || type === 'mushroom') {
      const offset = 5
      animating = true
      elem.animate({
        bottom: bottom + offset
      }, 50, () => {
        state = STATES.EMPTY
        setSprite()
      }).animate({
        bottom
      }, 'linear', () => {
        animating = false
      })
    }

    if (type === 'coin') {
      AudioManager.playSound('coin')
      // animate coin
      const coin = $('<div class="effect coin"></div>')
      parent.append(coin)
      coin.css({
        left: left + 8,
        bottom: bottom + 32
      }).animate({
        bottom: bottom + 128
      }).animate({
        bottom: bottom + 32
      }, () => {
        coin.remove()

        // add to coin count
        world.addScore(left, bottom + TILE_HEIGHT * 2)
        world.collectCoin()
      })
    } else if (type === 'mushroom') {
      AudioManager.playSound('item')
      if (world.mario.isSmall()) {
        world.elements.push(Mushroom(world, left, bottom + 32 + 1))
      } else {
        world.elements.push(Flower(world, left, bottom + 32))
      }
    }
  }

  const block = {
    elem,
    left: x * 32,
    bottom: y * 32,
    getX: () => x * 32,
    getY: () => y * 32,
    width,
    height,

    hit
  }
  world.blocks.push(block)

  return block
}

const Flower = (world, x, y) => {
  const elem = $(`<div class="flower element collider"></div>`)
  let parent = world.DOM.blocks
  parent.append(elem)

  const width = 32
  const height = 32

  // animate entrance
  elem.css({
    left: x,
    bottom: y,
    height: 0
  }).animate({
    height: 32
  }, 500)

  return {
    elem,
    left: x,
    bottom: y,
    getX: () => left,
    getY: () => bottom,
    width,
    height
  }
}

const Mushroom = (world, x, y) => {
  const SPRITE_BASE_URL = 'images/tiles/'
  const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right'
  }

  let parent = world.DOM.blocks
  let prevX = x
  let prevY = y
  let isAnimating = true
  let direction = DIRECTION.RIGHT
  let sprite = `mushroom.gif`
  let width = 32
  let height = 32
  let moveSpeed = 2
  let fallSpeed = 5
  const elem = $(`<div class="mushroom element collider"></div>`)
  elem.css({
    'background-image': `url('${SPRITE_BASE_URL + sprite}')`,
    width,
    height
  })

  const move = () => {
    elem.css({
      left: x,
      bottom: y
    })
  }

  move()

  // animate entrance
  elem.css({
    height: 0
  }).animate({
    height: height
  }, 500, () => {
    isAnimating = false
  })

  const update = (delta) => {
    if (isAnimating) {
      return
    }

    const collidable = world.platforms.concat(world.blocks)

    // move horizontal
    const transX = (direction === DIRECTION.LEFT)? -moveSpeed : moveSpeed
    const collisions = getOverlaps(elem, collidable, transX, 0)
    if (collisions.length) {
      const hit = collisions[0]
      const hitX = hit.getX()
      // move mushroom to side
      x = (x >= hitX)? hitX + hit.width - width - 1 : hitX - width - 1
      
      // change direction
      direction = (direction === DIRECTION.LEFT)? DIRECTION.RIGHT : DIRECTION.LEFT
    }
    else {
      x += (direction === DIRECTION.LEFT)? -moveSpeed : moveSpeed
    }

    // try gravity
    const platforms = getOverlaps(elem, collidable, transX, -fallSpeed)
    if (!platforms.length) {
      y += -fallSpeed
    }
  }

  const render = () => {
    if (isAnimating) {
      return
    }

    move()
    prevX = x
    prevY = y
  }

  if (parent) {
    parent.append(elem)
  }

  return {
    elem,
    getX: () => left,
    getY: () => bottom,
    width,
    height,

    update,
    render
  }
}
