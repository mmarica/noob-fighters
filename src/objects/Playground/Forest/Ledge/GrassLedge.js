import Phaser from 'phaser'
import AbstractLedge from './Abstract'

export default class extends AbstractLedge {

    constructor ({ game, x, y, blockCount }) {
        super(game, x, y, 64, 'forest_grass_ledge', blockCount)
    }
}
