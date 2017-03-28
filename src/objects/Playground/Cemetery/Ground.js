import Phaser from 'phaser'

export default class extends Phaser.TileSprite {

    constructor ({ game }) {
        super(game, 0, game.world.height - 24, game.world.width, 24, 'cemetery_ground')

        this.game.physics.arcade.enable(this)
        this.body.immovable = true
    }
}
