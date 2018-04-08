
const AudioManager = (() => {

  const level1BG = new Audio("audio/01-main-theme-overworld.mp3")
  level1BG.loop = true
  level1BG.volume = 0.8
  
  const effects = {
    coin: new Audio("audio/Coin.wav"),
    die: new Audio("audio/Die.wav"),
    item: new Audio("audio/Item.wav"),
    powerup: new Audio("audio/Powerup.wav"),
    squish: new Audio("audio/Squish.wav"),
    break: new Audio("audio/Break.wav"),
    bump: new Audio("audio/Bump.wav"),
    jump: new Audio("audio/Jump.wav"),
    flagpole: new Audio("audio/Flagpole.wav"),
  }
  
  const isPlaying = (item) => {
    return (item.currentTime > 0 && !item.paused &&
            !item.ended && item.readyState > 2)
  }

  const playBG = () => {
    pauseBG()
    level1BG.currentTime = 0
    level1BG.play()
  }

  const pauseBG = () => {
    if (isPlaying(level1BG)) {
      level1BG.pause()
    }
  }

  const playSound = (effect) => {
    const sound = effects[effect]
    if (sound) {
      if (isPlaying(sound)) {
        sound.pause()
      }
      sound.currentTime = 0
      sound.play()
    }
  }

  return {
    isPlaying,
    playBG,
    pauseBG,
    playSound
  }
})()
