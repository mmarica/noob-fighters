import Phaser from 'phaser'
import Player from './Player'

export default class extends Player {

    constructor ({ game, id, x, y, keys, orientation }) {
        super({
            game: game,
            id: id,
            x: x,
            y: y,
            asset: 'noobacca',
            keys: keys,
            orientation : orientation,
        })
    }
}
