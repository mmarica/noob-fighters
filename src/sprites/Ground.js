import Phaser from 'phaser'

export default class extends Phaser.TileSprite {

    constructor ({ game }) {
        super(game, 0, game.world.height - 48, game.world.width, 48, 'ground')

        this.game.physics.arcade.enable(this)
        this.body.immovable = true
    }
}
