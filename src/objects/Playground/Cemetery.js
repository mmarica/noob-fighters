import Phaser from 'phaser'
import Ground from './Cemetery/Ground'
import Ledge from './Cemetery/Ledge'

export default class extends Phaser.Group {

    constructor ({ game }) {
        super(game)
        this.enableBody = true

        this.game.add.sprite(0, 0, 'bg')

        this.ground = this.game.add.existing(
            new Ground({ game: this.game })
        )

        let height = 752
        const step = 130

        this.ledges = [
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 0,
                    y: height - step,
                    length: 3
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.game.world.width - 64 * 4 - 24,
                    y: height - step,
                    length: 3
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 310,
                    y: height - 2 * step,
                    length: 10
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 0,
                    y: height - 3 * step,
                    length: 2
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.game.world.width - 64 * 12,
                    y: height - 3 * step,
                    length: 3
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.game.world.width - 64 * 4 + 30,
                    y: height - 3 * step,
                    length: 2
                })
            ),
        ]
    }

    getObstacles () {
        return [this.ground, ...this.ledges]
    }
}
