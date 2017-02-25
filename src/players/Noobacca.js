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
            animations: {
                'left': [0, 1, 2, 3, 4, 5],
                'right': [6, 7, 8, 9, 10, 11],
                'right_still': 6,
            },
        })
    }
}
