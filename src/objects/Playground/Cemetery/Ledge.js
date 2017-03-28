import Phaser from 'phaser'

export default class extends Phaser.Group {

    constructor (game, x, y, length) {
        super(game)

        const WIDTH = 54;
        this.enableBody = true

        let left = this.create(x, y, 'cemetery_ledge_left')
        left.body.immovable = true
        x += WIDTH

        for (let i = 0; i < length; i++) {
            let center = this.create(x, y, 'cemetery_ledge_center')
            center.body.immovable = true
            x += WIDTH
        }

        let right = this.create(x, y, 'cemetery_ledge_right')
        right.body.immovable = true
    }
}
