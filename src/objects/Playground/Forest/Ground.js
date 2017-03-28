import Phaser from 'phaser'

export default class extends Phaser.TileSprite {

    constructor (game) {
        super(game, 0, game.world.height - 30, game.world.width, 30, 'forest_ground')

        this.game.physics.arcade.enable(this)
        this.body.immovable = true

        // make the body smaller than the sprite so that players do not float above the grass
        this.body.setSize(game.world.width, 24, 0, 10);
    }
}
