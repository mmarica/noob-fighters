import Phaser from 'phaser'
import AbstractLedge from '../../Abstract/Ledge'

export default class extends AbstractLedge {
    /**
     * Constructor
     *
     * @param game       Game object
     * @param x          Horizontal position
     * @param y          Vertical position
     * @param blockCount Number of blocks in the ledge
     */
    constructor(game, x, y, blockCount) {
        super(game, x, y, 32, 'moon_rock', blockCount)
    }
}
