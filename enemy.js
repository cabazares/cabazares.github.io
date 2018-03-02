
const Enemy = (type, parent, x, y) => {
  const SPRITE_BASE_URL = 'images/enemies/'

  const STATES = {
    WALK: 'walk',
    DIE: 'die'
  }
  const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right'
  }

  let direction = DIRECTION.LEFT
  let state = STATES.WALK
  let sprite = `${type}.gif`
  let width = 32
  let height = 32
  let moveSpeed = 2
  x = (x != null)? x : windowWidth
  y = (y != null)? y : 64

  const elem = $(`<div class="goomba enemy collider">` +
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

  const render = () => {
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

    // FIXME: loop back
    if (x < -width) {
      x = windowWidth
    }
  }

  if (parent) {
    parent.append(elem)
  }

  return {
    elem,
    render
  }
}
