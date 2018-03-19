
const Mario = (world) => {
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
  let speed = 4
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

  const parent = world.DOM.playArea
  const elem = $(`<div id="player">` +
                 `<div class="playerhead"></div>` +
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
          sprite = (isFire())? 'fire_walk1.gif' : 'big_walk1.gif'
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
          sprite = (isFire())? 'fire_jump.gif' : 'big_jump.gif'
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
          sprite = (isFire())? 'fire_stand.gif' : 'big_stand.gif'
        }
    }

    // switch css class
    elem.removeClass(Object.values(POWER_STATES).filter(x => x !== power))
    elem.addClass(power)

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

  const createFireworks = () => {
    const scrollLeft = $(window).scrollLeft()
    const top = rand(windowHeight * 0.8, 50)
    const left = scrollLeft + rand(windowWidth)
    const firework = $(`<div class="effect fireworks"></div>`).css({
        top,
        left
    })
    parent.append(firework)

    setTimeout(() => {
      firework.remove()
    }, 200)

    return firework
  }


  // render
  const render = () => {

    // dont do anything if dead already or is animating
    if (state === STATES.DIE || isAnimating) {
      return
    }

    if (world.isLevelFinished()) {
      // chance to create cloud
      if (Math.random() <= 0.2) {
        createFireworks()
      }
    }

    // check win -------------------------
    const flagPosition = 6400
    if (!world.isLevelFinished() && x >= flagPosition) {
      const pole = $('#endFlag')
      const maxDist = pole.height() - 64
      const flag = $('#endFlag .flag')
      let distance = windowHeight - pole.position().top - y - 32
      distance = (distance <= 0)? 0 : distance
      distance = (distance > maxDist)? maxDist : distance
      flag.animate({
        top: distance
      }, 500, () => {
        $('#timerBox').remove()
        const congratsElem = $('<div id="congrats">')
        congratsElem.hide()
        $('body').append(congratsElem)
        congratsElem.slideDown()
      })
      world.finishLevel()
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

    // collision with ground
    const groundCollision = getOverlaps(foot,
                                        world.platforms.concat(world.blocks))
    onGround = groundCollision.length > 0
    if (groundCollision.length && state != STATES.JUMP) {
      // end drop and set position to follors position
      const floor = groundCollision[0]
      velocityY = 0
      y = floor.getY() + floor.height
    }

    // check if head hit any block
    const headCollision = getOverlaps(head, world.blocks)
    if (headCollision.length) {
      // limit position
      headCollision.map((block, i) => {
        if (i === 0) { // only move mario down once
          velocityY = 0
          // minus 2 here to immediately remove collision
          y = block.getY() - height - 2
        }

        // tell block it was hit
        block.hit(power)
      })
    }

    //  left or right collision
    /*
    const platformCollision = getOverlaps(elem,
                                          world.platforms.concat(world.blocks))
    if (platformCollision.length) {
      platformCollision.map((platform, i) => {
        const rects = getRects(elem, platform.elem)
        // if mario is on the left of the platform, push back
        x += (rects.rect1.left < rects.rect2.left)? -1 : 1
      })
    }
    */


    // check if killed enemy
    const enemyKills = getOverlaps(foot, world.enemies)
    if (enemyKills.length) {
      enemyKills.map(e => e.die())

      // make mario jump after killing
      setState(STATES.JUMP)
      velocityY = jumpSpeed
    }

    // check collision with enemies
    const enemyHits = getOverlaps(elem, world.enemies)
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

    const elementCollision = getOverlaps(elem, world.elements)
    if (elementCollision.length) {
      elementCollision.map(element => {
        if (element.elem.is('.mushroom') && power === POWER_STATES.NORMAL) {
          element.elem.remove()
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
        else if (element.elem.is('.flower') && !isFire()) {
          element.elem.remove()
          isAnimating = true
          elem
          .animate({opacity:1}, 60, () => {
            power = POWER_STATES.FIRE
            onChangeState()
            isAnimating = false
          })
        }
      })
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

  const getX = () => {
    return x
  }
  const setX = (newX) => {
    x = newX
  }

  const getY = () => {
    return y
  }
  const setY = (newY) => {
    y = newY
  }

  const isSmall = () => {
    return power === POWER_STATES.NORMAL
  }

  const isFire = () => {
    return power === POWER_STATES.FIRE
  }


  const mario = {
    position,
    getX,
    setX,
    getY,
    setY,
    isSmall,

    onChangeState,
    render
  }

  return mario
}
