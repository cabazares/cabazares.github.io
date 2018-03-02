

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

  let animating = false

  const hit = () => {
    if (animating || state !== STATES.ACTIVE) {
      return
    }


    const left = parseInt(elem.css('left'))
    const bottom = parseInt(elem.css('bottom'))

    // move up a bit
    if (type === 'brick') {
      const offset = 5
      animating = true
      elem.animate({
        bottom: bottom + offset
      }, 50).animate({
        bottom
      }, () => {
        animating = false
      })
    }
    else if (type === 'question') {
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
    }
  }

  return {
    elem,
    hit
  }
}
