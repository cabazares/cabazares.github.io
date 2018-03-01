
const platformsBox = $('#platforms')
const platforms = []

const createPlatform = (left, bottom, width, height, type) => {
  type = type || 'floor1'
  width = width * 32
  height = height * 32
  const elem = $(
     `<div class="${type} platform"></div>`
  )
  elem.css({
    left,
    bottom,
    width,
    height
  })

  platforms.push(elem)
  $('#platforms').append(elem)

  return elem
}


const createLevel = (level) => {
  if (level == 1) {
    createPlatform(0, 0, 50, 2)
  }
}

const findFloor = (x) => {
  // get all platforms bounding box
  const boxes = platforms.map(p => p[0].getBoundingClientRect())
}
