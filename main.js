$(document).ready(() => {

  let countdownIntervat = setCountdown()




  // create world level 1
  createLevel(1)


  // setup player
  const player = Mario($('#player'))
  // render player 60 times a second
  setInterval(() => {
    player.render()
  }, 33)
})
