import Phaser from 'phaser'

export default class extends Phaser.Group {

    constructor (game, x, y, blockWidth, blockKey, blockCount) {
        super(game)

        this.origX = x
        this.origY = y
        this.enableBody = true
        this.speed = 0

        for (let i = 0; i < blockCount; i++) {
            let block = this.create(x, y, blockKey)
            block.body.immovable = true
            x += blockWidth
        }
    }

    horizontalMovement (leftDistance, rightDistance, speed, startDirection) {
        this.minX = this.origX - leftDistance
        this.maxX = this.origX + rightDistance
        this.speed = speed
        this.direction = startDirection

        for (let block of this.children)
            this.game.physics.arcade.enable(block)
    }

    update () {
        if (this.direction == "left" && this.children[0].x <= this.minX)
            this.direction = "right"

        if (this.direction == "right" && this.children[0].x >= this.maxX)
            this.direction = "left"

        for (let block of this.children)
            block.body.velocity.x = this.direction == "left" ? -this.speed : this.speed
    }
}
