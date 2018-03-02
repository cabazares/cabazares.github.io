$(document).ready(() => {

  let countdownIntervat = setCountdown()


  // create world level 1
  const world = createLevel(1)

  // setup player
  const player = Mario($('#playArea'))

  // render 30 times a second
  setInterval(() => {
    player.render()

    world.render()
  }, 33)
})
