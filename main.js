$(document).ready(() => {

  let windowWidth = $(window).width()
  let windowHeight = $(window).height()

  // set countdown
  let countdownIntervat = setCountdown()


  // create world level 1
  const world = createLevel(1)

  // setup player
  const player = Mario($('#playArea'))

  // render 30 times a second
  setInterval(() => {
    player.render()

    world.render()

    // scroll based on playet position
    const scrollLeft = $(window).scrollLeft()
    const scrollMax = (windowWidth * 0.8) + scrollLeft
    const playerX = player.position().x
    if (playerX >= scrollMax) {
      const offset = (playerX - scrollMax)
      window.scrollTo(scrollLeft + offset, 0)
    }
    const scrollMin = (windowWidth * 0.2) + scrollLeft
    if (playerX <= scrollMin && scrollLeft > 0) {
      const offset = scrollMin - playerX
      window.scrollTo(scrollLeft - offset, 0)
    }
  }, 33)
})
