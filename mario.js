
let windowWidth = $(window).width()
let windowHeight = $(window).height()

$(window).on('resize', () => {
  windowWidth = $(window).width()
  windowHeight = $(window).height()
})

const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}

const Mario = (parent) => {
  const SPRITE_BASE_URL = 'images/mario/'
  const STATES = {
    STAND: 'stand',
    WALK: 'walk',
    JUMP: 'jump',
    DIE: 'die'
  }
  const POWER_STATES = {
    NORMAL: 'normal',
    SUPER: 'super',
    FIRE: 'fire'
  }
  const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right'
  }

  const jumpSpeed = 14.2
  const jumpVelocityLimit = 10
  const gravity = 0.8

  let isAnimating = false
  let width = 26
  let height = 32
  let speed = 6
  let state = STATES.STAND
  let power = POWER_STATES.NORMAL
  let direction = DIRECTION.RIGHT
  let startX = 80
  let startY = 64
  let prevX = 80
  let prevY = 0
  let x = 80
  let y = 64
  let velocityY = 0
  let onGround = true

  const doc = $(document)
  let walkInterval

  // animation handler
  let lastRender = Date.now()
  let elapsed = lastRender

  const walkFrameLength = 3
  let lastWalkFrame = lastRender

  const elem = $(`<div id="player">` +
                 `<div class="playerHead"></div>` +
                 `<div class="playerFoot"></div>` +
                 `</div>`)
  parent.append(elem)
  const head = elem.find('.playerHead')
  const foot = elem.find('.playerFoot')

  elem.css({
    left:x,
    bottom: y
  })

  // set new state for mario
  const setState = (newState) => {
    if (state === newState) {
      return
    }

    state = newState
    onChangeState()
  }

  // handle key presses
  const keyMap = {}
  let onkeydown, onkeyup
  onkeydown = onkeyup = (e) => {
    keyMap[e.keyCode] = e.type == 'keydown'
  }
  doc.on('keydown', onkeydown)
  doc.on('keyup', onkeyup)

  // on change state handler
  const onChangeState = () => {
    switch(state) {
      case STATES.WALK:
        if (power === POWER_STATES.NORMAL) {
          width = 26
          height = 32
          sprite = 'walk1.gif'
        } else {
          width = 32
          height = 64
          sprite = 'big_walk1.gif'
        }
      break

      case STATES.JUMP:
        if (power === POWER_STATES.NORMAL) {
          width = 34
          height = 32
          sprite = 'jump.gif'
        } else {
          width = 32
          height = 64
          sprite = 'big_jump.gif'
        }
      break

      case STATES.DIE:
        sprite = 'dead.gif'
        width = 30
        height = 28
      break

      case STATES.STAND:
      default:
        if (power === POWER_STATES.NORMAL) {
          width = 26
          height = 32
          sprite = 'stand.gif'
        } else {
          width = 32
          height = 64
          sprite = 'big_stand.gif'
        }
    }
    elem.css({
      'background-image': `url('${SPRITE_BASE_URL + sprite}')`,
      transform: `scaleX(${(direction === DIRECTION.RIGHT)? 1 : -1})`,
      width,
      height
    })
  }

  const onRender = () => {
    const now = Date.now()
    elapsed = now - lastRender
    lastRender = now

    // dont move to next walk frame
    if (!onGround) {
      lastWalkFrame = now
    }

    // animate
    const walkElapsed = now - lastWalkFrame
    if (state === STATES.WALK && walkElapsed > 50) {
      const lastFrame = parseInt(sprite.replace(/[^\d]+/g, ''))
      const newFrame = (lastFrame % walkFrameLength) + 1
      sprite = `walk${newFrame}.gif`
      sprite = (power === POWER_STATES.SUPER)? 'big_' + sprite : sprite
      sprite = (power === POWER_STATES.FIRE)? 'fire_' + sprite : sprite
      elem.css({
        'background-image': `url('${SPRITE_BASE_URL + sprite}')`
      })
      lastWalkFrame = now
    }
  }

  // render
  const render = () => {

    // dont do anything if dead already or is animating
    if (state === STATES.DIE || isAnimating) {
      return
    }

    // actions ----------------------------
    let hasActed = false
    if (keyMap[KEYS.LEFT]) {
      direction = DIRECTION.LEFT
      setState(STATES.WALK)
      x -= speed
      hasActed = true
    }

    if (keyMap[KEYS.RIGHT]) {
      direction = DIRECTION.RIGHT
      setState(STATES.WALK)
      x += speed
      hasActed = true
    }

    // handle jump anim
    if (keyMap[KEYS.UP] || !onGround) {
      setState(STATES.JUMP)
    }

    // handle jump
    if (keyMap[KEYS.UP] && onGround) {
      velocityY = jumpSpeed
      hasActed = true
    }
    else if(!keyMap[KEYS.UP] && velocityY > jumpVelocityLimit) {
      velocityY = jumpVelocityLimit
    }

    if (!hasActed && onGround) {
      setState(STATES.STAND)
    }
    // end actions ----------------------

    onRender()

    // collisions ----------------------------
    // left or right collision
    const platformCollision = elem.collision('.platform,.block')
    if (platformCollision.length) {
      x = prevX
    }

    // collision with ground
    const groundCollision = foot.collision('.platform,.block')
    onGround = groundCollision.length > 0
    if (groundCollision.length && state != STATES.JUMP) {
      // end drop
      const floor = groundCollision
      velocityY = 0
      y = parseInt(floor.css('bottom')) + floor.height()
    }

    // head collision
    const headCollision = head.collision('.block')
    if (headCollision.length) {
      // limit position
      const block = headCollision
      velocityY = 0
      y = parseInt(block.css('bottom')) - height - 2

      // tell block it was hit
      const hitBlock = blocks.filter(b => {
        return b.elem[0] === block[0]
      })[0]
      hitBlock.hit(power)
    }

    // check if killed enemy
    const enemyKills = foot.collision('.enemy')
    if (enemyKills.length) {
      const hitEnemy = enemies.filter(b => {
        return b.elem[0] === enemyKills[0]
      })[0]
      hitEnemy.die()

      // make mario jump after killing
      setState(STATES.JUMP)
      velocityY = jumpSpeed
    }

    // check collision with enemies
    const enemyHits = elem.collision('.enemy')
    if (!enemyKills.length && enemyHits.length && state !== STATES.DIE) {
      if (power === POWER_STATES.NORMAL) {
        die()
      } else {
        elem
        // small
        .animate({opacity:1}, 0, () => {
          elem.css({
            height: height - 32,
            'background-image': `url('${SPRITE_BASE_URL}stand.gif')`
          })
        })
        // big
        .animate({opacity:1}, 40, () => {
          elem.css({
            height,
            'background-image': `url('${SPRITE_BASE_URL}big_stand.gif')`
          })
        })
        // small
        .animate({opacity:1}, 40, () => {
          elem.css({
            height: height - 32,
            'background-image': `url('${SPRITE_BASE_URL}stand.gif')`
          })
        })
        // big
        .animate({opacity:1}, 40, () => {
          elem.css({
            height,
            'background-image': `url('${SPRITE_BASE_URL}big_stand.gif')`
          })
        })
        .animate({opacity:1}, 0, () => {
          power = POWER_STATES.NORMAL
          onChangeState()
        })
      }
    }

    const elementCollision = elem.collision('.element')
    if (elementCollision.length) {
      if (elementCollision.is('.mushroom') && power === POWER_STATES.NORMAL) {

        elementCollision.remove()
        isAnimating = true
        elem
        // big
        .animate({opacity:1}, 0, () => {
          elem.css({
            height: height + 32,
            'background-image': `url('${SPRITE_BASE_URL}big_stand.gif')`
          })
        })
        // small
        .animate({opacity:1}, 60, () => {
          elem.css({
            height,
            'background-image': `url('${SPRITE_BASE_URL}stand.gif')`
          })
        })
        // big
        .animate({opacity:1}, 60, () => {
          elem.css({
            height: height + 32,
            'background-image': `url('${SPRITE_BASE_URL}big_stand.gif')`
          })
        })
        // small
        .animate({opacity:1}, 60, () => {
          elem.css({
            height,
            'background-image': `url('${SPRITE_BASE_URL}stand.gif')`
          })
        })
        .animate({opacity:1}, 60, () => {
          power = POWER_STATES.SUPER
          onChangeState()
          isAnimating = false
        })
      }
    }

    // gravity --------------------
    // calc jump
    velocityY -= (!onGround)? gravity : 0
    y += velocityY

    if (y <= 0) {
      y = 0
      velocityY = 0.0
      die()
    }

    if (prevX !== x || prevY !== y) {
      elem.css({
        left: x,
        bottom: y
      })
    }

    // save previous values
    prevX = x
    prevY = y
  }

  // trigger on change state
  onChangeState()

  const die = () => {
    setState(STATES.DIE)
    isAnimating = true
    elem.animate({
      bottom: y
    }, 500).animate({
      bottom: y + 150
    }, 400).animate({
      bottom: -height
    }, 400, () => {
      reset()
    })
  }

  const reset = () => {
    // reset position to start of level
    x = startX
    y = startY
    prevX = x
    prevY = y
    direction = DIRECTION.RIGHT
    setState(STATES.STAND)
    isAnimating = false
  }

  const position = () => {
    return {
      x,
      y
    }
  }

  const setX = (newX) => {
    x = newX
  }

  const setY = (newY) => {
    y = newY
  }

  return {
    position,
    setX,
    setY,

    onChangeState,
    render
  }
}
