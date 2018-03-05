
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
    .append($('<div class="smallHill bg"></div>').css({
      bottom: 64,
      left: 2082
    }))
    .append($('<div class="largeHill bg"></div>').css({
      bottom: 64,
      left: 3128
    }))
    .append($('<div class="smallHill bg"></div>').css({
      bottom: 64,
      left: 3630
    }))
    .append($('<div class="largeHill bg"></div>').css({
      bottom: 64,
      left: 4684
    }))
    .append($('<div class="smallHill bg"></div>').css({
      bottom: 64,
      left: 5184
    }))
    .append($('<div class="largeHill bg"></div>').css({
      bottom: 64,
      left: 6208
    }))
    .append($('<div class="smallHill bg"></div>').css({
      bottom: 64,
      left: 6620
    }))

    // bushes
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
    .append($('<div class="bush1 bg"></div>').css({
      bottom: 64,
      left: 2342
    }))
    .append($('<div class="bush2 bg"></div>').css({
      bottom: 64,
      left: 2912
    }))
    .append($('<div class="bush3 bg"></div>').css({
      bottom: 64,
      left: 3500
    }))
    .append($('<div class="bush1 bg"></div>').css({
      bottom: 64,
      left: 3886
    }))
    .append($('<div class="bush2 bg"></div>').css({
      bottom: 64,
      left: 4462
    }))
    .append($('<div class="bush1 bg"></div>').css({
      bottom: 64,
      left: 5120
    }))
    .append($('<div class="bush1 bg"></div>').css({
      bottom: 64,
      left: 5412
    }))
    .append($('<div class="bush1 bg"></div>').css({
      bottom: 64,
      left: 6550
    }))
  }
}

const createLevel = (level) => {
  const cloudFactory = CloudFactory($('#clouds'))

  if (level === 1) {
    createBackground(level, $('#bg'))

    // create platforms
    createPlatform(0, 0, 70, 2)
    createPlatform(2336, 0, 15, 2)
    createPlatform(2912, 0, 64, 2)
    createPlatform(5024, 0, 55, 2)
    // pipe
    createPlatform(932, 64, 2, 2, 'pipe')
    createPlatform(1248, 64, 2, 3, 'pipe')
    createPlatform(1502, 64, 2, 4, 'pipe')
    createPlatform(1852, 64, 2, 4, 'pipe')
    createPlatform(5280, 64, 2, 2, 'pipe')
    createPlatform(5792, 64, 2, 2, 'pipe')

    // box mountain
    createPlatform(4352, 64, 4, 1, 'box')
    createPlatform(4384, 96, 3, 1, 'box')
    createPlatform(4416, 128, 2, 1, 'box')
    createPlatform(4448, 160, 1, 1, 'box')
    createPlatform(4544, 160, 1, 1, 'box')
    createPlatform(4544, 128, 2, 1, 'box')
    createPlatform(4544, 96, 3, 1, 'box')
    createPlatform(4544, 64, 4, 1, 'box')

    // box mountain 2
    createPlatform(4800, 64, 5, 1, 'box')
    createPlatform(4832, 96, 4, 1, 'box')
    createPlatform(4864, 128, 3, 1, 'box')
    createPlatform(4896, 160, 2, 1, 'box')
    createPlatform(5024, 160, 1, 1, 'box')
    createPlatform(5024, 128, 2, 1, 'box')
    createPlatform(5024, 96, 3, 1, 'box')
    createPlatform(5024, 64, 4, 1, 'box')

    // end mountain
    createPlatform(32 * 183, 32 * 2, 9, 1, 'box')
    createPlatform(32 * 184, 32 * 3, 8, 1, 'box')
    createPlatform(32 * 185, 32 * 4, 7, 1, 'box')
    createPlatform(32 * 186, 32 * 5, 6, 1, 'box')
    createPlatform(32 * 187, 32 * 6, 5, 1, 'box')
    createPlatform(32 * 188, 32 * 7, 4, 1, 'box')
    createPlatform(32 * 189, 32 * 8, 3, 1, 'box')
    createPlatform(32 * 190, 32 * 9, 2, 1, 'box')

    // flag
    createPlatform(32 * 200, 64, 1, 1, 'box')
    $('#platforms').append($(`
      <div id="endFlag">
        <div class="pole"></div>
        <div class="top"></div>
      </div>
    `))

    // blocks
    const blocksBox = $('#blocks')
    blocks.push(Block('coin', blocksBox, 17, 5))
    blocks.push(Block('brick', blocksBox, 21, 5))
    blocks.push(Block('mushroom', blocksBox, 22, 5))
    blocks.push(Block('brick', blocksBox, 23, 5))
    blocks.push(Block('coin', blocksBox, 24, 5))
    blocks.push(Block('brick', blocksBox, 25, 5))
    blocks.push(Block('coin', blocksBox, 23, 9))

    // bricks over first hole
    blocks.push(Block('brick', blocksBox, 79, 5))
    blocks.push(Block('coin', blocksBox, 80, 5))
    blocks.push(Block('brick', blocksBox, 81, 5))
    blocks.push(Block('brick', blocksBox, 82, 9))
    blocks.push(Block('brick', blocksBox, 83, 9))
    blocks.push(Block('brick', blocksBox, 84, 9))
    blocks.push(Block('brick', blocksBox, 85, 9))
    blocks.push(Block('brick', blocksBox, 86, 9))
    blocks.push(Block('brick', blocksBox, 87, 9))
    blocks.push(Block('brick', blocksBox, 88, 9))
    blocks.push(Block('brick', blocksBox, 89, 9))

    // bricks after first hole
    blocks.push(Block('brick', blocksBox, 93, 9))
    blocks.push(Block('brick', blocksBox, 94, 9))
    blocks.push(Block('brick', blocksBox, 95, 9))
    blocks.push(Block('coin', blocksBox, 96, 9))
    blocks.push(Block('brick', blocksBox, 96, 5))
    blocks.push(Block('brick', blocksBox, 102, 5))
    blocks.push(Block('brick', blocksBox, 103, 5))

    // triangle coin area
    blocks.push(Block('coin', blocksBox, 108, 5))
    blocks.push(Block('coin', blocksBox, 111, 5))
    blocks.push(Block('coin', blocksBox, 114, 5))
    blocks.push(Block('coin', blocksBox, 111, 9))

    // before block mountain
    blocks.push(Block('brick', blocksBox, 120, 5))
    blocks.push(Block('brick', blocksBox, 123, 9))
    blocks.push(Block('brick', blocksBox, 124, 9))
    blocks.push(Block('brick', blocksBox, 125, 9))

    blocks.push(Block('brick', blocksBox, 130, 9))
    blocks.push(Block('coin', blocksBox, 131, 9))
    blocks.push(Block('coin', blocksBox, 132, 9))
    blocks.push(Block('brick', blocksBox, 133, 9))
    blocks.push(Block('brick', blocksBox, 131, 5))
    blocks.push(Block('brick', blocksBox, 132, 5))

    // before end
    blocks.push(Block('brick', blocksBox, 170, 5))
    blocks.push(Block('brick', blocksBox, 171, 5))
    blocks.push(Block('coin', blocksBox, 172, 5))
    blocks.push(Block('brick', blocksBox, 173, 5))

    // create enemies
    enemies.push(Enemy('goomba', $('#enemies'), 900))
    enemies.push(Enemy('goomba', $('#enemies'), 1332))
    enemies.push(Enemy('goomba', $('#enemies'), 1600))
    enemies.push(Enemy('goomba', $('#enemies'), 1632))
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
  const $window = $(window)

  const createCloud = () => {
    const scrollLeft = $window.scrollLeft()
    const top = rand(350, 50)
    const left = scrollLeft + windowWidth
    const cloud = $(`<div class="bg cloud cloud${rand(3)}"></div>`).css({
        top,
        left
    })
    cloud.top = rand(350, 50)
    cloud.left = scrollLeft + windowWidth
    cloud.width = cloud.css('width')
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
      cloud.left = cloud.left - rand(2, 0)
      cloud.css({
        left: cloud.left
      })
    })

    // remove cloud
    clouds.forEach(cloud => {
      const scrollLeft = $(window).scrollLeft()
      if (cloud.left <= scrollLeft - cloud.width) {
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
