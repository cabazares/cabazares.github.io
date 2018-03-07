
// set up some globals
let $window = $(window)
let windowWidth = $window.width()
let windowHeight = $window.height()

$window.on('resize', () => {
  windowWidth = $(window).width()
  windowHeight = $(window).height()
})

const rand = (limit, start) => {
  start = start | 1
  return Math.floor((Math.random() * limit) + start)
}

const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}

$(document).ready(() => {
  // set countdown
  const deadline = '2018-03-12T15:00:00'
  let countdownIntervat = setCountdown(deadline)

  // create world level 1
  const world = World({
    playArea: $('#playArea'),
    clouds: $('clouds'),
    platforms: $('#platforms'),
    backgrounds: $('#bg'),
    blocks: $('#blocks')
  })

  world.createLevel(1)

  // setup player
  player = Mario(world)

  // render 30 times a second
  setInterval(() => {
    player.render()
    world.render()

    // scroll based on playet position
    const scrollLeft = $window.scrollLeft()
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
  }, 1000 / 24)
})
