import Phaser from 'phaser'

export default class extends Phaser.Group {

    constructor ({ game, x, y, length }) {
        super(game)

        this.enableBody = true

        let left = this.create(x, y, 'ledge_left')
        left.body.immovable = true
        x += 128

        for (let i = 0; i < length; i++) {
            let center = this.create(x, y, 'ledge_center')
            center.body.immovable = true
            x += 128
        }

        let right = this.create(x, y, 'ledge_right')
        right.body.immovable = true
    }
}
