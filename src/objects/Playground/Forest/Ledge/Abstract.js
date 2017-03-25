import Phaser from 'phaser'

export default class extends Phaser.Group {

    constructor (game, x, y, blockWidth, blockKey, blockCount) {
        super(game)

        this.enableBody = true

        for (let i = 0; i < blockCount; i++) {
            let block = this.create(x, y, blockKey)
            game.physics.arcade.enable(block)
            block.body.immovable = true
            x += blockWidth
        }
    }
}
