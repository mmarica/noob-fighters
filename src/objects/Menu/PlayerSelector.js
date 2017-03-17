import Phaser from 'phaser'
import Player from '../Player'

export default class extends Phaser.Group {
    constructor ({ game, x, y, keys }) {
        super(game)
        this.x = x
        this. y = y
        this.keys = keys
    }

    /**
     * Get the selected player type
     */
    getSelected () {
        return 'noobacca'
    }

    static loadAssets (game) {
    }
}
