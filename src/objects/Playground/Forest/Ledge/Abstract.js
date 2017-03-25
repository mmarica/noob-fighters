import Phaser from 'phaser'

export default class extends Phaser.Group {

    constructor (game, x, y, blockWidth, blockKey, blockCount) {
        super(game)

        this.origX = x
        this.origY = y
        this.enableBody = true
        this.hSpeed = 0
        this.vSpeed = 0

        for (let i = 0; i < blockCount; i++) {
            let block = this.create(x, y, blockKey)
            block.body.immovable = true
            x += blockWidth
        }
    }

    horizontalMovement (leftDistance, rightDistance, speed, startDirection) {
        this.minX = this.origX - leftDistance
        this.maxX = this.origX + rightDistance
        this.hSpeed = speed
        this.hDirection = startDirection

        for (let block of this.children)
            this.game.physics.arcade.enable(block)
    }

    verticalMovement (upDistance, downDistance, speed, startDirection) {
        this.minY = this.origY - upDistance
        this.maxY = this.origY + downDistance
        this.vSpeed = speed
        this.vDirection = startDirection

        for (let block of this.children)
            this.game.physics.arcade.enable(block)
    }

    update () {
        if (this.vSpeed > 0) {
            if (this.vDirection == "up" && this.children[0].y <= this.minY)
                this.vDirection = "down"

            if (this.vDirection == "down" && this.children[0].y >= this.maxY)
                this.vDirection = "up"

            for (let block of this.children)
                block.body.velocity.y = this.vDirection == "up" ? -this.vSpeed : this.vSpeed
        }

        if (this.hSpeed > 0) {
            if (this.hDirection == "left" && this.children[0].x <= this.minX)
                this.hDirection = "right"

            if (this.hDirection == "right" && this.children[0].x >= this.maxX)
                this.hDirection = "left"

            for (let block of this.children)
                block.body.velocity.x = this.hDirection == "left" ? -this.hSpeed : this.hSpeed
        }
    }
}
