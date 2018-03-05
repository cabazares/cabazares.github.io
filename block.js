

const Block = (type, parent, x, y) => {
  const SPRITE_BASE_URL = 'images/tiles/'
  const STATES = {
    ACTIVE: 'active',
    EMPTY: 'empty'
  }

  let sprite = `brick.gif`
  let state = STATES.ACTIVE

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
      return
    }

    const left = parseInt(elem.css('left'))
    const bottom = parseInt(elem.css('bottom'))

    // move up a bit
    if (type === 'brick') {
      if (power === 'normal') {
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
      })
    } else if (type === 'mushroom') {
      elements.push(Mushroom(parent, left, bottom + 32))
    }
  }

  return {
    elem,
    hit
  }
}

const Mushroom = (parent, x, y) => {
  const SPRITE_BASE_URL = 'images/tiles/'
  const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right'
  }

  let prevX = x
  let prevY = y
  let isAnimating = true
  let direction = DIRECTION.RIGHT
  let sprite = `mushroom.gif`
  let width = 32
  let height = 32
  let moveSpeed = 3
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
    height
  }, 500, () => {
    isAnimating = false
  })

  const render = () => {
    if (isAnimating) {
      return
    }

    if (direction === DIRECTION.LEFT) {
      x -= moveSpeed
    } else {
      x += moveSpeed
    }
    move()

    const pipeCollides = elem.collision('.pipe')
    if (pipeCollides.length) {
      direction = (direction === DIRECTION.LEFT)? DIRECTION.RIGHT : DIRECTION.LEFT
    }

    // try gravity
    y -= 7
    elem.css({bottom: y})
    if (elem.collision('.platform,.block').length) {
      y += 7
      elem.css({bottom: y})
    }

    prevX = x
    prevY = y
  }

  if (parent) {
    parent.append(elem)
  }

  return {
    render
  }
}
