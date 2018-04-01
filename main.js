
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

// determine if two elements has an overlap
const hasOverlap = (elemA, elemB, transX, transY) => {
  transX = transX || 0
  transY = transY || 0
  const domElemA = (elemA instanceof jQuery)? elemA[0] : elemA
  const domElemB = (elemB instanceof jQuery)? elemB[0] : elemB
  const rect1 = domElemA.getBoundingClientRect()
  const rect2 = domElemB.getBoundingClientRect()

  const left = rect1.left + transX
  const top = rect1.top - transY // subtract since axis origin is bottom left
  const width = rect1.width
  const height = rect1.height

  return boundsOverlap(left, top, width, height,
                       rect2.left, rect2.top, rect2.width, rect2.height)
}

// check if two rectangles overlap
const boundsOverlap = (x1, y1, w1, h1, x2, y2, w2, h2) => {
  return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2)
}

// get all elements from a list that overlap with a given element
const getOverlaps = (elem, items, transX, transY) => {
  return items.filter(p => {
    const item = (p.elem)? p.elem : p
    return hasOverlap(elem, item, transX, transY)? p : false
  })
}

const TILE_WIDTH = TILE_HEIGHT = 32

const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}

$(document).ready(() => {
  // set countdown
  if (window.location.href.indexOf('?') !== -1) {
    const deadline = '2018-04-03T17:00:00'
    let countdownInterval = setCountdown(deadline)
  }

  // create world level 1
  const world = World({
    playArea: $('#playArea'),
    clouds: $('#clouds'),
    platforms: $('#platforms'),
    backgrounds: $('#bg'),
    blocks: $('#blocks'),
    enemies: $('#enemies')
  })

  world.begin()

  MainLoop
    .setBegin(world.handleInput)
    .setUpdate(world.update)
    .setDraw(world.render)
    .start()

  // start game
  world.startGame()

})
