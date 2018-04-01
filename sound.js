
const AudioManager = (() => {

  const level1BG = new Audio("audio/01-main-theme-overworld.mp3")
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
  }
  

  return {
    playBG: () => {
      if (!level1BG.paused && level1BG.duration > 0) {
        level1BG.pause()
      }
      level1BG.currentTime = 0
      level1BG.play()
    },
    pauseBG: () => {
      level1BG.pause()
    },
    playSound: (effect) => {
      const sound = effects[effect]
      if (sound) {
        sound.pause()
        sound.currentTime = 0
        sound.play()
      }
    }
  }
})()
