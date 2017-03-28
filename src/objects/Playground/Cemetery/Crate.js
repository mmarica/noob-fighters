import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor (game, x, y) {
        super(game, x, y, 'cemetery_crate')

        this.game.physics.arcade.enable(this)
        this.body.immovable = true
    }
}
