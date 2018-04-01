
const World = (DOM) => {
  const doc = $(document)

  let platforms = []
  let enemies = []
  let blocks = []
  let elements = []
  const world = {
    DOM,
    platforms,
    enemies,
    blocks,
    elements,
    clouds
  }

  // setup player
  mario = Mario(world)
  const cloudFactory = CloudFactory(world)

  // game state
  let score = 0
  let coins = 0
  let timePassed = 0
  let isGameRunning = false
  let isLevelFinished = false
  let flagPosition = NaN

  // hud
  const bgElem = $('#bg')
  const timeHUD = $('#worldTime .time')
  const scoreHUD = $('#scoreBox .score')
  const coinsHUD = $('#scoreBox .coins')

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

    DOM.platforms.append(elem)

    platforms.push({
      elem,
      left,
      bottom,
      getX: () => left,
      getY: () => bottom,
      width,
      height
    })

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

  const begin = () => {
    cloudFactory.begin()

    resetLevel()
  }
  
  const resetLevel = () => {
    timePassed = 0

    // reset dom
    DOM.clouds.empty()
    DOM.platforms.empty()
    DOM.backgrounds.empty()
    DOM.blocks.empty()
    DOM.enemies.empty()

    // reset variables
    platforms = world.platforms = []
    enemies = world.enemies = []
    blocks = world.blocks = []
    elements = world.elements = []

    createLevel(1)

    AudioManager.playBG()
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

      // enemies over first hole
      Enemy('goomba', world, 2592, 320)
      Enemy('goomba', world, 2656, 320)

      // after second hole
      Enemy('goomba', world, 3200)
      Enemy('goomba', world, 3264)

      // after triangle coin area
      Enemy('koopa', world, 109 * 32)
      Enemy('goomba', world, 116 * 32)
      Enemy('goomba', world, 118 * 32)

      // before mountain block
      Enemy('goomba', world, 126 * 32)
      Enemy('goomba', world, 128 * 32)
      Enemy('goomba', world, 130 * 32)
      Enemy('goomba', world, 132 * 32)

      // before final mountain
      Enemy('goomba', world, 176 * 32)
      Enemy('goomba', world, 178 * 32)
    }
  }

  const activateEnemies = () => {
    // activate enemies that come in to the screen
    const scrollLeft = $window.scrollLeft()
    enemies.filter(e => {
      return !e.isActive() && e.getX() <= (scrollLeft + windowWidth)
    }).map(e => {
      e.activate()
    })
  }

  // handle key presses
  const keyMap = {}
  let onkeydown, onkeyup
  onkeydown = onkeyup = (e) => {
    keyMap[e.keyCode] = e.type == 'keydown'
  }
  doc.on('keydown', onkeydown)
  doc.on('keyup', onkeyup)

  const handleInput = () => {
    // send keypress status to elements
    mario.handleInput(keyMap)
  }

  const update = (delta) => {
    // pause game
    if (!isGameRunning) {
      return
    }
    timePassed += delta

    // win state -------------------------
    if (world.isLevelFinished()) {
      if (Math.random() <= 0.2) {
        createFireworks()
      }
    }

    // check win -------------------------
    const flagPosition = 6400
    const marioPos = mario.position()
    if (!world.isLevelFinished() && marioPos.x >= flagPosition) {
      const pole = $('#endFlag')
      const maxDist = pole.height() - 64
      const flag = $('#endFlag .flag')
      let distance = windowHeight - pole.position().top - marioPos.y - 32
      distance = (distance <= 0)? 0 : distance
      distance = (distance > maxDist)? maxDist : distance

      AudioManager.playSound('flagpole')
      flag.animate({
        top: distance
      }, 500, () => {
        $('#timerBox').remove()
        const congratsElem = $('<div id="congrats">')
        congratsElem.hide()
        $('body').append(congratsElem)
        congratsElem.slideDown()
      })
      world.finishLevel()
    }


    // update everything in the world
    mario.update()

    elements.forEach(e => {
      if (e.update) {
        e.update()
      }
    })

    cloudFactory.update()
  }

  const render = () => {
    // pause game
    if (!isGameRunning) {
      return
    }

    mario.render()
    cloudFactory.render()

    enemies.forEach(e => {
      if (!e.isActive()) {
        return
      }
      e.render()
    })

    elements.forEach(e => {
      if (e && e.render) {
        e.render()
      }
    })

    // scroll based on player position
    const scrollLeft = $window.scrollLeft()
    const scrollMax = (windowWidth * 0.5) + scrollLeft
    const playerX = mario.getX()
    if (playerX >= scrollMax) {
      const offset = (playerX - scrollMax)
      window.scrollTo(scrollLeft + offset, 0)

      activateEnemies()
    }
    const scrollMin = (windowWidth * 0.4) + scrollLeft
    if (playerX <= scrollMin && scrollLeft > 0) {
      const offset = scrollMin - playerX
      window.scrollTo(scrollLeft - offset, 0)
    }

    // update HUD
    const gameTime = Math.round(timePassed / 1000)
    timeHUD.text(gameTime)

    let scoreString = score.toString()
    if (scoreString.padStart) {
      scoreString = scoreString.padStart(6, "0")
    } else {
      scoreString = ("000000" + scoreString).slice(-6)
    }
    scoreHUD.text(scoreString)

    let coinsString = coins.toString()
    if (coinsString.padStart) {
      coinsString = coinsString.padStart(2, "0")
    } else {
      coinsString = ("00" + coinsString).slice(-2)
    }
    coinsHUD.text('x' + coinsString)
  }

  const createFireworks = () => {
    const scrollLeft = $(window).scrollLeft()
    const top = rand(windowHeight * 0.8, 50)
    const left = scrollLeft + rand(windowWidth)
    const firework = $(`<div class="effect fireworks"></div>`).css({
        top,
        left
    })
    parent.append(firework)

    setTimeout(() => {
      firework.remove()
    }, 200)

    return firework
  }

  const collectCoin = () => {
    coins += 1
  }

  const addScore = (x, y, points=100) => {
    const floatText = $(`<div class="floatScore">${points}</div>`)
    floatText.css({
      left: x,
      bottom: y
    })
    bgElem.append(floatText)
    floatText.animate({
      bottom: y + TILE_HEIGHT * 2
    }, 1000, () => {
      floatText.remove()
    })

    score += points
  }

  Object.assign(world, {
    isGameRunning: () => isGameRunning,
    startGame: () => {
      mario.reset()
      activateEnemies()
      isGameRunning = true
    },
    pauseGame: () => {
      isGameRunning = false
    },
    isLevelFinished: () => isLevelFinished,
    finishLevel: () => {
      isLevelFinished = true
    },

    mario,
    begin,
    resetLevel,

    collectCoin,
    addScore,

    handleInput,
    update,
    render
  })

  return world
}

// ------------------------------------------------------

const CloudFactory = (world) => {

  const parent = world.DOM.clouds
  const clouds = []

  const createCloud = (onScreen) => {
    const scrollLeft = $window.scrollLeft()
    const top = rand(windowHeight * 0.4, TILE_HEIGHT * 2)
    const left = (onScreen)? rand (windowWidth) : scrollLeft + windowWidth
    const cloud = $(`<div class="bg cloud cloud${rand(3)}"></div>`).css({
        top,
        left
    })
    cloud.top = top
    cloud.left = left
    cloud.width = cloud.css('width')
    parent.append(cloud)
    clouds.push(cloud)

    return cloud
  }

  const begin = () => {
    const onScreen = true
    createCloud(onScreen)
    createCloud(onScreen)
    createCloud(onScreen)
  }

  const update = (delta) => {
    // chance to create cloud
    if (Math.random() <= 0.003) {
      createCloud()
    }
  }

  const render = () => {
    // move clouds
    clouds.forEach(cloud => {
      cloud.left = cloud.left - rand(1, 0)
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
    begin,
    update,
    render
  }
}
