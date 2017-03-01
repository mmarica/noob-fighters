import Phaser from 'phaser'
import Ground from './Cemetery/Ground'
import Ledge from './Cemetery/Ledge'
import Crate from './Cemetery/Crate'

export default class extends Phaser.Group {

    constructor ({ game }) {
        super(game)
        this.enableBody = true

        game.add.sprite(0, 0, 'bg')

        this.ground = game.add.existing(
            new Ground({ game: game })
        )

        let height = 752
        const step = 130

        this.ledges = [
            game.add.existing(
                new Ledge({
                    game: game,
                    x: 0,
                    y: height - step,
                    length: 3
                })
            ),
            game.add.existing(
                new Ledge({
                    game: game,
                    x: game.world.width - 64 * 4 - 24,
                    y: height - step,
                    length: 3
                })
            ),
            game.add.existing(
                new Ledge({
                    game: game,
                    x: 310,
                    y: height - 2 * step,
                    length: 10
                })
            ),
            game.add.existing(
                new Ledge({
                    game: game,
                    x: 0,
                    y: height - 3 * step,
                    length: 2
                })
            ),
            game.add.existing(
                new Ledge({
                    game: game,
                    x: game.world.width - 64 * 13,
                    y: height - 3 * step,
                    length: 5
                })
            ),
            game.add.existing(
                new Ledge({
                    game: game,
                    x: game.world.width - 64 * 4 + 30,
                    y: height - 3 * step,
                    length: 2
                })
            ),
        ]

        this.crates = [
            game.add.existing(
                new Crate({
                    game: game,
                    x: game.world.centerX - 106 / 2,
                    y: game.world.height - 106 - 24,
                })
            ),
            game.add.existing(
                new Crate({
                    game: game,
                    x: 121,
                    y: game.world.height - 106 - 24 - step * 3 - 24,
                })
            ),
            game.add.existing(
                new Crate({
                    game: game,
                    x: game.world.width - 106 - 121,
                    y: game.world.height - 106 - 24 - step * 3 - 24,
                })
            ),
        ]
    }

    getObstacles () {
        return [this.ground, ...this.ledges, ...this.crates]
    }
}
