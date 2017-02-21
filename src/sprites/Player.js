import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, key }) {
    super(game, x, y, key)
    this.anchor.setTo(0.5)
  }

  update () {
  }

}
