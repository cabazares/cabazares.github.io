
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

  const jumpSpeed = 13
  const jumpVelocityLimit = 6
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

  const elem = $(`<div id="player">` +
                 `<div class="playerHead"></div>` +
                 `<div class="playerFoot"></div>` +
                 `</div>`)
  parent.append(elem)
  const head = elem.find('.playerHead')
  const foot = elem.find('.playerFoot')

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
      y = parseInt(block.css('bottom')) - height
    }

    // check collision with enemies
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
    velocityY -= (!onGround)? gravity : 0
    y += velocityY

    if (y <= 64) {
        y = 64
        velocityY = 0.0
    }

    elem.css({
      bottom: y
    })
  }

  // trigger on change state
  onChangeState()


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
