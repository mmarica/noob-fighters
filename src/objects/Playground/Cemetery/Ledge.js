import Phaser from 'phaser'

export default class extends Phaser.Group {

    constructor ({ game, x, y, length }) {
        super(game)

        const width = 54;

        this.enableBody = true

        let left = this.create(x, y, 'ledge_left')
        left.body.immovable = true
        x += width

        for (let i = 0; i < length; i++) {
            let center = this.create(x, y, 'ledge_center')
            center.body.immovable = true
            x += width
        }

        let right = this.create(x, y, 'ledge_right')
        right.body.immovable = true
    }
}
