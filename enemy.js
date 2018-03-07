
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

  let parent = world.DOM.enemies
  let direction = DIRECTION.LEFT
  let state = STATES.WALK
  let sprite = `${type}.gif`
  let width = 32
  let height = 32
  let moveSpeed = 2
  x = (x != null)? x : windowWidth
  y = (y != null)? y : 64

  const elem = $(`<div class="${type} enemy collider">` +
                 `<div class="weakness"></div>` +
                 `</div>`)
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

  const die = () => {
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
  }

  const render = () => {
    if (state === STATES.DIE) {
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
  }

  if (parent) {
    parent.append(elem)
  }

  const enemy = {
    elem,
    die,
    render
  }
  world.enemies.push(enemy)

  return enemy
}
