import Phaser from 'phaser'
import Ground from './Cemetery/Ground'
import Ledge from './Cemetery/Ledge'
import Crate from './Cemetery/Crate'
import ProTracker from 'proTracker'

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

    static loadAssets (game) {
        game.load.image('bg', './assets/playgrounds/cemetery/images/bg.png')
        game.load.image('ground', './assets/playgrounds/cemetery/images/ground.png')
        game.load.image('ledge_left', './assets/playgrounds/cemetery/images/ledge_left.png')
        game.load.image('ledge_center', './assets/playgrounds/cemetery/images/ledge_center.png')
        game.load.image('ledge_right', './assets/playgrounds/cemetery/images/ledge_right.png')
        game.load.image('crate', './assets/playgrounds/cemetery/images/crate.png')
        game.load.image('tree', './assets/playgrounds/cemetery/images/tree.png')
        game.load.image('bush1', './assets/playgrounds/cemetery/images/bush1.png')
        game.load.image('bush2', './assets/playgrounds/cemetery/images/bush2.png')
        game.load.image('skeleton', './assets/playgrounds/cemetery/images/skeleton.png')
        game.load.image('tombstone1', './assets/playgrounds/cemetery/images/tombstone1.png')
        game.load.image('tombstone2', './assets/playgrounds/cemetery/images/tombstone2.png')
        game.load.image('sign1', './assets/playgrounds/cemetery/images/sign1.png')
        game.load.image('sign2', './assets/playgrounds/cemetery/images/sign2.png')
        game.load.binary('music', './assets/playgrounds/cemetery/sounds/music.mod', this.modLoaded, this);
    }

    modLoaded (key, data) {
        this.musicBuffer = new Uint8Array(data)
        return this.musicBuffer
    }

    startMusic () {
        this.module = new ProTracker()
        this.module.onReady = function() {
            this.play()
        };
        this.module.onStop = function() {
            this.play()
        };

        this.module.buffer = this.musicBuffer;
        this.module.parse();
    }

    stopMusic () {
        this.module.onStop = function() {}
        this.module.stop()
    }
}
