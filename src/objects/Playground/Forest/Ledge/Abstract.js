import Phaser from 'phaser'

export default class extends Phaser.Group {
    /**
     * Constructor
     *
     * @param game       Game object
     * @param x          Horizontal position
     * @param y          Vertical position
     * @param blockWidth Width of one block
     * @param blockKey   Sprite key to use for blocks
     * @param blockCount Number of blocks in the ledge
     */
    constructor(game, x, y, blockWidth, blockKey, blockCount) {
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

    /**
     * Add horizontal movement
     *
     * @param leftDistance   How much to left from the current position
     * @param rightDistance  How much to right from the current position
     * @param speed          Movement speed
     * @param startDirection Direction in which to start moving: left or right
     */
    horizontalMovement(leftDistance, rightDistance, speed, startDirection) {
        this.minX = this.origX - leftDistance
        this.maxX = this.origX + rightDistance
        this.hSpeed = speed
        this.hDirection = startDirection

        for (let block of this.children)
            this.game.physics.arcade.enable(block)
    }

    /**
     * Add horizontal movement
     *
     * @param upDistance     How much to go up from the current position
     * @param downDistance   How much to go down from the current position
     * @param speed          Movement speed
     * @param startDirection Direction in which to start moving: up or down
     */
    verticalMovement(upDistance, downDistance, speed, startDirection) {
        this.minY = this.origY - upDistance
        this.maxY = this.origY + downDistance
        this.vSpeed = speed
        this.vDirection = startDirection

        for (let block of this.children)
            this.game.physics.arcade.enable(block)
    }

    /**
     * Manage the movements of the ledge (if enabled)
     */
    update() {
        // vertical movement
        if (this.vSpeed > 0) {
            if (this.vDirection == "up" && this.children[0].y <= this.minY)
                this.vDirection = "down"

            if (this.vDirection == "down" && this.children[0].y >= this.maxY)
                this.vDirection = "up"

            for (let block of this.children)
                block.body.velocity.y = this.vDirection == "up" ? -this.vSpeed : this.vSpeed
        }

        // horizontal movement
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
