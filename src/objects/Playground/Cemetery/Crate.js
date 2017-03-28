import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    /**
     * Constructor
     *
     * @param game Game object
     * @param x    Horizontal position
     * @param y    Vertical position
     */
    constructor(game, x, y) {
        super(game, x, y, 'cemetery_crate')

        this.game.physics.arcade.enable(this)
        this.body.immovable = true
    }
}
