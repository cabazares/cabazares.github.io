
const Enemy = (type, world, x, y) => {
  const SPRITE_BASE_URL = 'images/enemies/'

  const STATES = {
    WALK: 'walk',
    DIE: 'die'
  }
  const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right'
  }
  const parent = world.DOM.enemies

  let isActive = false
  let direction = DIRECTION.LEFT
  let state = STATES.WALK
  let sprite = `${type}.gif`
  let width = 32
  let height = (type === 'koopa')? 48 : 32
  let moveSpeed = 1
  x = (x != null)? x : windowWidth
  y = (y != null)? y : 64

  // prevent overlap on floor
  y += 1

  const gravity = -4

  const foot = $(`<div class="foot"></div>`)
  const elem = $(`<div class="${type} enemy collider">` +
                 `</div>`)
  elem.css({
    'background-image': `url('${SPRITE_BASE_URL + sprite}')`,
    width,
    height,
    left: x,
    bottom: y
  })
  elem.append(foot)

  const die = () => {
    if (type === 'goomba') {
      state = STATES.DIE
      elem.remove()
      const deadElem = $('<div></div>').css({
        position: 'absolute',
        left: x,
        bottom: y,
        width,
        height: height / 2,
        'background-image': `url('${SPRITE_BASE_URL}dead_${sprite}')`,
      })
      parent.append(deadElem)
      setTimeout(() => {deadElem.remove()}, 1000)
    } else if (type === 'koopa') {
      elem.remove()
      const shell = $('<div class="shell"></div>').css({
        position: 'absolute',
        left: x,
        bottom: y,
        width,
        height: height / 2,
        'background-image': `url('${SPRITE_BASE_URL}shell_${sprite}')`,
      })
      parent.append(shell)
    }
  }

  const render = () => {
    if (state === STATES.DIE || !isActive) {
      return
    }

    // calculate next X move
    const goingLeft = direction === DIRECTION.LEFT
    const transX = goingLeft? -moveSpeed : moveSpeed

    // get overlaps with foot
    const platform = getOverlaps(foot, world.platforms.concat(world.blocks))
    const block = getOverlaps(elem, world.platforms.concat(world.blocks), transX)


    if (block.filter(e => platform.indexOf(e) < 0).length === 0) {
      x += transX
    } else {
      direction = (goingLeft)? DIRECTION.RIGHT : DIRECTION.LEFT
    }

    if (platform.length) {
      const floor = platform[0]
      y = floor.getY() + floor.height
    } else {
      y += gravity
    }

    if (y <= -height) {
      die()
    }

    elem.css({
      left: x,
      bottom: y
    })
  }

  if (parent) {
    parent.append(elem)
  }

  const enemy = {
    isActive: () => isActive,
    activate: () => {
      isActive = true
    },
    getX: () => x,
    getY: () => y,

    elem,
    die,
    render
  }
  world.enemies.push(enemy)

  return enemy
}
