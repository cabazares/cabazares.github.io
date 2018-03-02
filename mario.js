
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

const Mario = (elem) => {
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

  const jumpSpeed = 30
  const jumpVelocityLimit = 8
  const gravity = 0.6

  let width = 26
  let height = 32
  let speed = 6
  let state = STATES.STAND
  let power = POWER_STATES.NORMAL
  let direction = DIRECTION.RIGHT
  let x = 64
  let y = 0
  let velocityY = 0
  let onGround = true

  const doc = $(document)
  let walkInterval

  // animation handler
  let lastRender = Date.now()
  let elapsed = lastRender

  const walkFrameLength = 3
  let lastWalkFrame = lastRender

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
        sprite = 'walk1.gif'
        if (power = POWER_STATES.NORMAL) {
          width = 26
          height = 32
        } else {
          width = 32
          height = 64
        }

      break
      case STATES.JUMP:
        sprite = 'jump.gif'
        if (power = POWER_STATES.NORMAL) {
          width = 34
          height = 32
        } else {
          width = 32
          height = 64
        }

      break
      case STATES.STAND:
      default:
        sprite = 'stand.gif'
        if (power = POWER_STATES.NORMAL) {
          width = 26
          height = 32
        } else {
          width = 32
          height = 64
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
      elem.css({
        'background-image': `url('${SPRITE_BASE_URL + sprite}')`
      })
      lastWalkFrame = now
    }
  }

  // render
  const render = () => {

    // actions ----------------------------
    let hasActed = false
    if (keyMap[KEYS.LEFT]) {
      direction = DIRECTION.LEFT
      setState(STATES.WALK)
      x -= speed
      elem.css({left:x})
      hasActed = true
    }

    if (keyMap[KEYS.RIGHT]) {
      direction = DIRECTION.RIGHT
      setState(STATES.WALK)
      x += speed
      elem.css({left:x})
      hasActed = true
    }

    // handle jump anim
    if (keyMap[KEYS.UP] || !onGround) {
      setState(STATES.JUMP)
    }

    // handle jump
    if (keyMap[KEYS.UP] && onGround) {
      velocityY = jumpSpeed
      onGround = false
      hasActed = true
    }
    else if(velocityY > jumpVelocityLimit) {
      velocityY = jumpVelocityLimit
    }

    if (!hasActed && onGround) {
      setState(STATES.STAND)
    }
    // end actions ----------------------

    onRender()

    // check collision
    const enemyHits = elem.collision('.enemy')
    if (enemyHits.length) {
      console.log('kill mario')
      elem.remove()
    }
    const enemyKills = elem.collision('.weakness')
    if (enemyKills.length) {
      console.log('kill goomb')
    }

    // find floor
    const floor = findFloor(x)

    // gravity --------------------
    // calc jump
    velocityY -= gravity
    y += velocityY

    if (y <= 64) {
        y = 64
        velocityY = 0.0
        onGround = true
    }

    elem.css({
      bottom: y
    })
  }

  // trigger on change state
  onChangeState()


  return {
    onChangeState,
    render
  }
}
