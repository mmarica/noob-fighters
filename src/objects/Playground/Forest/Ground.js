import Phaser from 'phaser'

export default class extends Phaser.TileSprite {

    constructor ({ game }) {
        super(game, 0, game.world.height - 30, game.world.width, 30, 'ground')

        this.game.physics.arcade.enable(this)
        this.body.setSize(game.world.width, 24, 0, 10);
        this.body.immovable = true
    }
}
