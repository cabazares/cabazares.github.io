
const platforms = []
const enemies = []
const blocks = []
const elements = []

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

const createBackground = (level, parent) => {
  if (level === 1) {
    // create hills
    parent
    .append($('<div class="largeHill bg"></div>').css({
      bottom: 64,
      left: 0
    }))
    .append($('<div class="smallHill bg"></div>').css({
      bottom: 64,
      left: 548
    }))
    .append($('<div class="largeHill bg"></div>').css({
      bottom: 64,
      left: 1562
    }))

    // bushees
    .append($('<div class="bush3 bg"></div>').css({
      bottom: 64,
      left: 408
    }))
    .append($('<div class="bush1 bg"></div>').css({
      bottom: 64,
      left: 790
    }))
    .append($('<div class="bush2 bg"></div>').css({
      bottom: 64,
      left: 1364
    }))
    .append($('<div class="bush3 bg"></div>').css({
      bottom: 64,
      left: 1942
    }))
  }
}

const createLevel = (level) => {
  const cloudFactory = CloudFactory($('#clouds'))

  if (level === 1) {
    createBackground(level, $('#bg'))

    // create platforms
    createPlatform(0, 0, 100, 2)
    // pipe
    createPlatform(932, 64, 2, 2, 'pipe')
    createPlatform(1248, 64, 2, 3, 'pipe')
    createPlatform(1502, 64, 2, 4, 'pipe')
    createPlatform(1852, 64, 2, 4, 'pipe')

    // blocks
    const blocksBox = $('#blocks')
    blocks.push(Block('coin', blocksBox, 17, 5))
    blocks.push(Block('brick', blocksBox, 21, 5))
    blocks.push(Block('mushroom', blocksBox, 22, 5))
    blocks.push(Block('brick', blocksBox, 23, 5))
    blocks.push(Block('coin', blocksBox, 24, 5))
    blocks.push(Block('brick', blocksBox, 25, 5))
    blocks.push(Block('coin', blocksBox, 23, 9))

    // create enemies
    enemies.push(Enemy('goomba', $('#enemies'), 900))
    enemies.push(Enemy('goomba', $('#enemies'), 1332))
  }

  const render = () => {
    cloudFactory.render()

    enemies.forEach(e => {
      e.render()
    })

    elements.forEach(e => {
      e.render()
    })
  }

  return {
    platforms,
    enemies,
    render
  }
}

// ------------------------------------------------------

const findFloor = (x) => {
  // get all platforms bounding box
  const boxes = platforms.map(p => p[0].getBoundingClientRect())
}


// ------------------------------------------------------

const rand = (limit, start) => {
  start = start | 1
  return Math.floor((Math.random() * limit) + start)
}

const CloudFactory = (parent) => {

  const clouds = []

  const createCloud = () => {
    const scrollLeft = $(window).scrollLeft()
    const cloud = $(`<div class="bg cloud cloud${rand(3)}"></div>`).css({
        top: rand(350, 50),
        left: scrollLeft + windowWidth
    })
    parent.append(cloud)
    clouds.push(cloud)

    return cloud
  }

  const render = () => {
    // chance to create cloud
    if (Math.random() <= 0.003) {
      createCloud()
    }

    // move clouds
    clouds.forEach(cloud => {
      cloud.css({
        left: parseInt(cloud.css('left')) - rand(2, 0)
      })
    })

    // remove cloud
    clouds.forEach(cloud => {
      const scrollLeft = $(window).scrollLeft()
      if (parseInt(cloud.css('left')) <= scrollLeft - parseInt(cloud.css('width'))) {
        cloud.remove()
        clouds.splice(clouds.indexOf(cloud), 1)
      }
    })
  }

  return {
    clouds,
    render
  }
}
