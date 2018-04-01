
const Mario = (world) => {
  const SPRITE_BASE_URL = 'images/mario/'
  const STATES = {
    STAND: 'stand',
    WALK: 'walk1',
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

  const jumpSpeed = 1.55
  const jumpVelocityLimit = 11.5
  const velocityLimit = 3
  const gravity = 0.8

  let isAnimating = false
  let width = 26
  let height = 32
  let speed = 0.8
  let state = STATES.STAND
  let power = POWER_STATES.NORMAL
  let direction = DIRECTION.RIGHT
  let startX = 80
  let startY = 64
  let prevX = 80
  let prevY = 0
  let x = 80
  let y = 64
  let velocityX = 0
  let velocityY = 0
  let jumpUp = false
  let onGround = true

  let walkInterval

  // animation related variables
  let lastRender = Date.now()
  let elapsed = lastRender

  const walkFrameLength = 3
  let lastWalkFrameIndex = 1
  let lastWalkFrame = lastRender

  // dom elements
  const parent = world.DOM.playArea
  const elem = $(`<div id="player"></div>`)
  parent.append(elem)

  // set initial values for DOM
  elem.css({
    left:x,
    bottom: y
  })

  // set new state for mario
  const setState = (newState, newDir=direction) => {
    if (state === newState && newDir === direction) {
      return
    }

    direction = newDir
    state = newState
    onChangeState()
  }

  // set new power state for mario
  const setPowerState = (newPowerState, newDir=direction) => {
    if (power === newPowerState && newDir === direction) {
      return
    }

    direction = newDir
    power = newPowerState
    onChangeState()
  }


  // set css classes for mario based on state and power
  const onChangeState = () => {
    // switch css class for state
    const classesToRemove = Object.values(STATES).filter(x => x !== state)
    classesToRemove.push('walk2', 'walk3')
    elem.removeClass(classesToRemove)
    elem.addClass(state)

    // switch css class for power
    elem.removeClass(Object.values(POWER_STATES).filter(x => x !== power))
    elem.addClass(power)

    elem.css({
      transform: `scaleX(${(direction === DIRECTION.RIGHT)? 1 : -1})`,
    })
  }

  // animate walk frames for mario
  const animateFrames = () => {
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
      const newFrame = (lastWalkFrameIndex % walkFrameLength) + 1
      elem.removeClass(`walk${lastWalkFrameIndex}`)
      elem.addClass(`walk${newFrame}`)
      lastWalkFrameIndex = newFrame
      lastWalkFrame = now
    }
  }

  // animate growing big
  const animateGrowBig = (callback) => {
    isAnimating = true
    return elem
    // big
    .animate({opacity:1}, 0, () => {
      elem.addClass('super')
    })
    // small
    .animate({opacity:1}, 60, () => {
      elem.removeClass('super')
    })
    // big
    .animate({opacity:1}, 60, () => {
      elem.addClass('super')
    })
    // small
    .animate({opacity:1}, 60, () => {
      elem.removeClass('super')
    })
    .animate({opacity:1}, 60, () => {
      isAnimating = false
      if (callback) {
        callback()
      }
    })
  }

  const animateTurnSmall = (callback) => {
    isAnimating = true
    return elem
    // small
    .animate({opacity:1}, 0, () => {
      elem.removeClass('super')
    })
    // big
    .animate({opacity:1}, 40, () => {
      elem.addClass('super')
    })
    // small
    .animate({opacity:1}, 40, () => {
      elem.removeClass('super')
    })
    // big
    .animate({opacity:1}, 40, () => {
      elem.addClass('super')
    })
    .animate({opacity:1}, 0, () => {
      isAnimating = false
      if (callback) {
        callback()
      }
    })
  }

  const handleInput = (keyMap) => {
    // dont do anything if dead already or is animating
    if (state === STATES.DIE || isAnimating) {
      return
    }

    let hasActed = false
    if (keyMap[KEYS.LEFT]) {
      setState(STATES.WALK, DIRECTION.LEFT)
      if (velocityX > 1) {
        velocityX = 1
      }
      velocityX -= (Math.abs(velocityX) < velocityLimit)? speed : 0
      hasActed = true
    }

    if (keyMap[KEYS.RIGHT]) {
      setState(STATES.WALK, DIRECTION.RIGHT)
      if (velocityX < -1) {
        velocityX = -1
      }
      velocityX += (Math.abs(velocityX) < velocityLimit)? speed : 0
      hasActed = true
    }

    // handle jump
    if (keyMap[KEYS.UP] && onGround) {
      velocityY += jumpSpeed
      jumpUp = true
      AudioManager.playSound('jump')
    } else if (keyMap[KEYS.UP] && jumpUp) {
      if (velocityY + jumpSpeed <= jumpVelocityLimit) {
        velocityY += jumpSpeed
      } else {
        jumpUp = false
      }
      hasActed = true
    }
    else if(!keyMap[KEYS.UP] && velocityY > jumpVelocityLimit) {
      velocityY = jumpVelocityLimit
    }

    if (!hasActed && onGround && velocityX === 0.0) {
      setState(STATES.STAND)
    }
  }

  const update = (delta) => {
    // dont do anything if dead already or is animating
    if (state === STATES.DIE || isAnimating) {
      return
    }

    // move vertical ------------------------------------
    const colliders = world.platforms.concat(world.blocks)

    // check if jumping up
    jumpUp = (jumpUp && velocityY > 0 && velocityY > gravity)

    // calc jump
    velocityY -= (!onGround)? gravity : 1
    let collisions = getOverlaps(elem, colliders, 0, velocityY)

    if (collisions.length) {
      const hit = collisions[0]
      if (y > hit.getY() && velocityY < 0) {
        // if hit floor // set y to top of floor
        y = hit.getY() + hit.height + 1
        onGround = true
      }
      // if hit head
      // also check y positions to prevent bug where
      // we get hit on characther change size due to jump
      else if (y < hit.getY()) {
        let currentHeight = TILE_HEIGHT
        currentHeight *= (state === STATES.NORMAL)? 1 : 2
        const newY = hit.getY() - currentHeight - 2

        // tell block it was hit
        if (hit.hit) {
          hit.hit(power)
        }
        jumpUp = false
      }
      velocityY = 0.0
    } else {
      onGround = false
      y += velocityY
    }

    
    // move horizontal ------------------------------------
    // reduce velocity if on ground
    if (onGround && direction === DIRECTION.LEFT && velocityX < 0) {
      velocityX += 0.1
    } else if (onGround && direction === DIRECTION.RIGHT && velocityX > 0) {
      velocityX -= 0.1
    }

    // check if can move
    collisions = getOverlaps(elem, colliders, velocityX, 0)
    if (collisions.length) {
      const hit = collisions[0]
      const hitX = hit.getX()
      //x = (x >= hitX)? hitX + hit.width - width - 1 : hitX - width - 1
      velocityX = 0.0
    } else {
      x += velocityX
    }


    // collision with world elements
    collisions = getOverlaps(elem, world.elements)
    if (collisions.length) {
      collisions.map(element => {
        if (element.elem.is('.mushroom') && power === POWER_STATES.NORMAL) {
            element.elem.remove()
            AudioManager.playSound('powerup')
            animateGrowBig(() => {
              setPowerState(POWER_STATES.SUPER)
              let currentHeight = TILE_HEIGHT
              currentHeight *= (state === STATES.NORMAL)? 1 : 2
              world.addScore(x, y + currentHeight, 1000)
            })
        }
        else if (element.elem.is('.flower') && !isFire()) {
          element.elem.remove()
          isAnimating = true
          elem
          .animate({opacity:1}, 60, () => {
            setPowerState(POWER_STATES.FIRE)
            isAnimating = false
          })
        }
      })
    }


    // check if collide with enemy
    const enemyKills = getOverlaps(elem, world.enemies)
    if (enemyKills.length) {
      if (velocityY < 0) {
        enemyKills.map(e => e.die())
        AudioManager.playSound('squish')

        // add score
        let currentHeight = TILE_HEIGHT
        currentHeight *= (state === STATES.NORMAL)? 1 : 2
        world.addScore(x, y + currentHeight)

        // make mario jump after killing
        setState(STATES.JUMP)
        velocityY = jumpSpeed * 10
      } else if (!isAnimating) {
        if (power === POWER_STATES.NORMAL) {
          die()
        } else {
          animateTurnSmall(() => {
            setPowerState(POWER_STATES.NORMAL)
          })
        }
      }
    }

    // die if fall off screen
    if (y <= 0) {
      setTimeout(reset, 100)
    }

    // round off velocityX
    if (Math.abs(velocityX) <= 0.001) {
      velocityX = 0
    }

  }

  // render
  const render = () => {
    if (!onGround && state !== STATES.DIE) {
      setState(STATES.JUMP)
    } else if (state !== STATES.DIE) {
      setState((velocityX)? STATES.WALK : STATES.STAND)
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

    animateFrames()
  }

  const die = () => {
    AudioManager.pauseBG()
    AudioManager.playSound('die')
    setState(STATES.DIE)
    isAnimating = true
    elem.animate({
      bottom: y
    }, 500).animate({
      bottom: y + 150
    }, 400).animate({
      bottom: -height
    }, 400, () => {
      setTimeout(reset, 2000)
    })
  }

  const reset = () => {
    // reset position to start of level
    x = startX
    y = startY
    velocityX = 0
    velocityY = 0
    prevX = x
    prevY = y
    direction = DIRECTION.RIGHT
    state = STATES.STAND
    power = POWER_STATES.NORMAL
    onChangeState()
    isAnimating = false
    AudioManager.playBG()
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

    reset,   

    handleInput,
    update,
    render
  }

  return mario
}
