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
                    x: game.world.centerX - 92 / 2,
                    y: game.world.height - 92 - 24,
                })
            ),
            game.add.existing(
                new Crate({
                    game: game,
                    x: 134,
                    y: game.world.height - 92 - 24 - step * 3 - 24,
                })
            ),
            game.add.existing(
                new Crate({
                    game: game,
                    x: game.world.width - 92 - 134,
                    y: game.world.height - 92 - 24 - step * 3 - 24,
                })
            ),
        ]

        game.add.sprite(
            game.world.centerX - 286 / 2,
            game.world.height - 239 - 24 - step * 3 - 24,
            'tree'
        );

        game.add.sprite(
            game.world.centerX - 48 / 2 - 50,
            game.world.height - 24 - 24 - step * 3 - 24,
            'skeleton'
        );

        game.add.sprite(
            20,
            game.world.height - 55 - 24,
            'tombstone1'
        );

        game.add.sprite(
            0,
            game.world.height - 20 - 24,
            'bush2'
        );

        game.add.sprite(
            game.world.width - 54 - 20,
            game.world.height - 55 - 24,
            'tombstone1'
        );

        game.add.sprite(
            game.world.width - 40,
            game.world.height - 20 - 24,
            'bush2'
        );
        game.add.sprite(
            game.world.width - 40,
            game.world.height - 20 - 24,
            'bush2'
        );

        game.add.sprite(
            210,
            game.world.height - 41 - 24 - step - 24,
            'bush1'
        );

        game.add.sprite(
            game.world.width - 210 - 40 - 20,
            game.world.height - 41 - 24 - step - 24,
            'bush1'
        );

        game.add.sprite(
            game.world.centerX - 55 / 2,
            game.world.height - 55 - 24 - 2 * step - 24,
            'tombstone1'
        );

        game.add.sprite(
            game.world.centerX - 53 / 2 - 240,
            game.world.height - 76 - 24 - 2 * step - 24,
            'tombstone2'
        );

        game.add.sprite(
            game.world.centerX - 40 / 2 - 270,
            game.world.height - 20 - 24 - 2 * step - 24,
            'bush2'
        );

        game.add.sprite(
            game.world.centerX - 53 / 2 + 240,
            game.world.height - 76 - 24 - 2 * step - 24,
            'tombstone2'
        );

        game.add.sprite(
            game.world.centerX - 40 / 2 + 270,
            game.world.height - 20 - 24 - 2 * step - 24,
            'bush2'
        );

        game.add.sprite(
            20,
            game.world.height - 87 - 24 - step - 24,
            'sign1'
        );

        game.add.sprite(
            game.world.width - 100,
            game.world.height - 93 - 24 - step - 24,
            'sign2'
        );
    }

    getObstacles () {
        return [this.ground, ...this.ledges, ...this.crates]
    }
}
