

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
    } else if (type === 'question') {
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

  const hit = () => {

  }

  return {
    elem,
    hit
  }
}
