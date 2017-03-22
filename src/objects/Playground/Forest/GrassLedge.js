import Phaser from 'phaser'

export default class extends Phaser.Group {

    constructor ({ game, x, y, length }) {
        super(game)

        const width = 64;

        this.enableBody = true

        for (let i = 0; i < length; i++) {
            let block = this.create(x, y, 'grass_ledge')
            game.physics.arcade.enable(block)
            block.body.immovable = true
            x += width
        }
    }
}
