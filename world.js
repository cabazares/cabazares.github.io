
const World = (DOM) => {
  const platforms = []
  const enemies = []
  const blocks = []
  const elements = []
  const world = {
    DOM,
    platforms,
    enemies,
    blocks,
    elements
  }

  const cloudFactory = CloudFactory(world)

  // level state
  let isLevelFinished = false
  let flagPosition = NaN

  const createPlatform = (left, bottom, width, height, type) => {
    type = type || 'floor1'
    width = width * 32
    height = height * 32
    const elem = $(
       `<div class="${type} platform"></div>`
    ).css({
      left,
      bottom,
      width,
      height
    })

    platforms.push(elem)
    DOM.platforms.append(elem)

    return elem
  }

  const createBGElem = (type, left, bottom) => {
    bottom = (bottom != null)? bottom : 64
    return $(`<div class="${type} bg"></div>`).css({
      bottom,
      left
    })
  }

  const createBackground = (level, parent) => {
    if (level === 1) {
      parent
      // create hills
      .append(createBGElem('largeHill', 0))
      .append(createBGElem('smallHill', 548))
      .append(createBGElem('largeHill', 1562))
      .append(createBGElem('smallHill', 2082))
      .append(createBGElem('largeHill', 3128))
      .append(createBGElem('smallHill', 3630))
      .append(createBGElem('largeHill', 4684))
      .append(createBGElem('smallHill', 5184))
      .append(createBGElem('largeHill', 6208))
      .append(createBGElem('smallHill', 6620))

      // bushes
      .append(createBGElem('bush3', 408))
      .append(createBGElem('bush1', 790))
      .append(createBGElem('bush2', 1364))
      .append(createBGElem('bush3', 1942))
      .append(createBGElem('bush1', 2342))
      .append(createBGElem('bush2', 2912))
      .append(createBGElem('bush3', 3500))
      .append(createBGElem('bush1', 3886))
      .append(createBGElem('bush2', 4462))
      .append(createBGElem('bush1', 5120))
      .append(createBGElem('bush1', 5412))
      .append(createBGElem('bush1', 6550))
    }
  }

  const createLevel = (level) => {
    if (level === 1) {
      createBackground(level, DOM.backgrounds)

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
      world.DOM.platforms.append($(`
        <div id="endFlag">
          <div class="flag"></div>
          <div class="pole"></div>
          <div class="top"></div>
        </div>
      `))

      // blocks
      Block('coin', world, 17, 5)
      Block('brick', world, 21, 5)
      Block('mushroom', world, 22, 5)
      Block('brick', world, 23, 5)
      Block('coin', world, 24, 5)
      Block('brick', world, 25, 5)
      Block('coin', world, 23, 9)

      // bricks over first hole
      Block('brick', world, 79, 5)
      Block('mushroom', world, 80, 5)
      Block('brick', world, 81, 5)
      Block('brick', world, 82, 9)
      Block('brick', world, 83, 9)
      Block('brick', world, 84, 9)
      Block('brick', world, 85, 9)
      Block('brick', world, 86, 9)
      Block('brick', world, 87, 9)
      Block('brick', world, 88, 9)
      Block('brick', world, 89, 9)

      // bricks after first hole
      Block('brick', world, 93, 9)
      Block('brick', world, 94, 9)
      Block('brick', world, 95, 9)
      Block('coin', world, 96, 9)
      Block('brick', world, 96, 5)
      Block('brick', world, 102, 5)
      Block('brick', world, 103, 5)

      // triangle coin area
      Block('coin', world, 108, 5)
      Block('coin', world, 111, 5)
      Block('coin', world, 114, 5)
      Block('mushroom', world, 111, 9)

      // before block mountain
      Block('brick', world, 120, 5)
      Block('brick', world, 123, 9)
      Block('brick', world, 124, 9)
      Block('brick', world, 125, 9)

      Block('brick', world, 130, 9)
      Block('coin', world, 131, 9)
      Block('coin', world, 132, 9)
      Block('brick', world, 133, 9)
      Block('brick', world, 131, 5)
      Block('brick', world, 132, 5)

      // before end
      Block('brick', world, 170, 5)
      Block('brick', world, 171, 5)
      Block('coin', world, 172, 5)
      Block('brick', world, 173, 5)

      // create enemies
      Enemy('goomba', world, 900)
      Enemy('goomba', world, 1332)
      Enemy('goomba', world, 1600)
      Enemy('goomba', world, 1632)
    }
  }

  const render = () => {
    cloudFactory.render()

    enemies.forEach(e => {
      e.render()
    })

    elements.forEach(e => {
      if (e && e.render) {
        e.render()
      }
    })
  }

  Object.assign(world, {
    ...world,
    createLevel,
    isLevelFinished: () => isLevelFinished,
    finishLevel: () => {
      isLevelFinished = true
    },
    render
  })

  return world
}

// ------------------------------------------------------

const CloudFactory = (world) => {

  const parent = world.DOM.clouds
  const clouds = []

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
      const scrollLeft = $window.scrollLeft()
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
