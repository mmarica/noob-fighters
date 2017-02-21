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

      this.players = [
          this.game.add.existing(
              new Player({
                  game: this.game,
                  x: 100,
                  y: this.world.centerY,
                  keys: { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D }
              })
          ),
          this.game.add.existing(
              new Player({
                  game: this.game,
                  x: this.world.width - 100,
                  y: this.world.centerY,
                  keys: { 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT }
              })
          )
      ]

  }

  update() {
  }
}
