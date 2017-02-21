/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Noob Fighters'
    let banner = this.add.text(this.world.centerX, 40, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.players = [this.addPlayer(100), this.addPlayer(this.world.width - 100)]
  }

  addPlayer(width) {
      let player = this.game.add.existing(
          new Player({
              game: this,
              x: width,
              y: this.world.centerY,
              asset: 'dude'
          })
      )
      player.anchor.setTo(0.5)

      return player;
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.players[0], 32, 32)
    }
  }
}
