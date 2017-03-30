import Phaser from 'phaser'

export default class extends Phaser.Group {
    /**
     * Constructor
     *
     * @param game Game object
     */
    constructor (game) {
        super(game)
        this.powerupSpots = []
    }

    /**
     * Get the list of positions for power-ups
     *
     * @returns {[]}
     */
    getPowerupSpots() {
        return this.powerupSpots
    }
}
