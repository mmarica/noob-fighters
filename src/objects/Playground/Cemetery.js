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
        this.clouds = [
            game.add.sprite(200, 200, 'clouds'),
            game.add.sprite(900, 650, 'clouds')
        ]

        this.startY = 752
        this.step = 130

        this.ledges = []
        this.crates = []

        this._level0()
        this._level1()
        this._level2()
        this._level3()
        this._level4()

        this.music = game.add.audio('ambiental')

        let soundList = ["laugh", "moan", "sirens", "twilightzone"]
        this.sounds = []
        for (let sound of soundList) {
            this.sounds.push(game.add.audio(sound))
        }

        this._setRandomSoundTimer()
        this.game.time.events.loop(50, this.moveClouds, this);
    }

    _setRandomSoundTimer () {
        const PAUSE = 10
        this.game.time.events.add(Phaser.Timer.SECOND * PAUSE, this.playRandomSound, this);
    }

    playRandomSound () {
        let sound = this.sounds[Math.round(Math.random() * (this.sounds.length - 1))]
        sound.play()
        sound.onStop.add(
            function () {
                this._setRandomSoundTimer()
            }
        , this);
    }

    // ground level
    _level0 () {
        let game = this.game

        this.ground = game.add.existing(
            new Ground({ game: game })
        )

        // bottom crates
        this.crates.push(
            game.add.existing(
                new Crate({
                    game: game,
                    x: game.world.centerX - 85,
                    y: game.world.height - 85 - 24,
                })
            )
        )
        this.crates.push(
            game.add.existing(
                new Crate({
                    game: game,
                    x: game.world.centerX,
                    y: game.world.height - 85 - 24,
                })
            )
        )

        // middle top crate
        this.crates.push(
            game.add.existing(
                new Crate({
                    game: game,
                    x: game.world.centerX - 85 / 2,
                    y: game.world.height - 85 - 24 - 85,
                })
            )
        )

        // left tombstone and bush
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

        // right tombstone and bush
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
    }

    // first level above ground
    _level1 () {
        let game = this.game

        // left ledge, bush and sign
        this.ledges.push(
            game.add.existing(
                new Ledge({
                    game: game,
                    x: 0,
                    y: this.startY - this.step,
                    length: 3
                })
            )
        )
        game.add.sprite(
            210,
            game.world.height - 41 - 24 - this.step - 24,
            'bush1'
        );
        game.add.sprite(
            20,
            game.world.height - 87 - 24 - this.step - 24,
            'sign1'
        );

        // right ledge, bush and sign
        this.ledges.push(
            game.add.existing(
                new Ledge({
                    game: game,
                    x: game.world.width - 64 * 4 - 24,
                    y: this.startY - this.step,
                    length: 3
                })
            )
        )
        game.add.sprite(
            game.world.width - 210 - 40 - 20,
            game.world.height - 41 - 24 - this.step - 24,
            'bush1'
        );
        game.add.sprite(
            game.world.width - 100,
            game.world.height - 93 - 24 - this.step - 24,
            'sign2'
        );
    }

    // second level above ground
    _level2 () {
        // middle left
        this.ledges.push(
            game.add.existing(
                new Ledge({
                    game: game,
                    x: 300,
                    y: this.startY - 2 * this.step,
                    length: 3
                })
            )
        )
        game.add.sprite(
            game.world.centerX - 53 / 2 - 180,
            game.world.height - 76 - 24 - 2 * this.step - 24,
            'tombstone2'
        );
        game.add.sprite(
            game.world.centerX - 40 / 2 - 210,
            game.world.height - 20 - 24 - 2 * this.step - 24,
            'bush2'
        );

        // middle right
        this.ledges.push(
            game.add.existing(
                new Ledge({
                    game: game,
                    x: 700,
                    y: this.startY - 2 * this.step,
                    length: 3
                })
            )
        )
        game.add.sprite(
            game.world.centerX - 53 / 2 + 180,
            game.world.height - 76 - 24 - 2 * this.step - 24,
            'tombstone2'
        );
        game.add.sprite(
            game.world.centerX - 40 / 2 + 210,
            game.world.height - 20 - 24 - 2 * this.step - 24,
            'bush2'
        );
    }

    // third level above ground
    _level3 () {
        let game = this.game

        // left ledge and crate
        this.ledges.push(
            game.add.existing(
                new Ledge({
                    game: game,
                    x: 0,
                    y: this.startY - 3 * this.step + 20,
                    length: 2
                })
            )
        )
        this.crates.push(
            game.add.existing(
                new Crate({
                    game: game,
                    x: 142,
                    y: game.world.height - 85 - 24 - this.step * 3 - 24 + 20,
                })
            )
        )

        // right ledge and crate
        this.ledges.push(
            game.add.existing(
                new Ledge({
                    game: game,
                    x: game.world.width - 64 * 4 + 30,
                    y: this.startY - 3 * this.step + 20,
                    length: 2
                })
            )
        )
        this.crates.push(
            game.add.existing(
                new Crate({
                    game: game,
                    x: game.world.width - 85 - 142,
                    y: game.world.height - 85 - 24 - this.step * 3 - 24 + 20,
                })
            )
        )
    }

    // fourth level above ground
    _level4 () {
        let game = this.game

        this.ledges.push(
            game.add.existing(
                new Ledge({
                    game: game,
                    x: game.world.width - 64 * 13,
                    y: this.startY - 3 * this.step - 35,
                    length: 5
                })
            )
        )

        game.add.sprite(
            game.world.centerX - 286 / 2,
            game.world.height - 239 - 24 - this.step * 3 - 24 - 35,
            'tree'
        );

        game.add.sprite(
            game.world.centerX - 48 / 2 - 50,
            game.world.height - 24 - 24 - this.step * 3 - 24 - 35,
            'skeleton'
        );
    }

    getPowerupSpots () {
        return [
            {x: this.game.world.centerX - 176, y: 326},
            {x: this.game.world.centerX + 160, y: 326},
            {x: 60, y: 381},
            {x: this.game.world.width - 60, y: 381},
            {x: 360, y: 491},
            {x: this.game.world.width - 360, y: 491},
            {x: 180, y: 621},
            {x: this.game.world.width - 180, y: 621},
            {x: this.game.world.centerX - 58, y: this.game.world.height - 108},
            {x: this.game.world.centerX + 58, y: this.game.world.height - 108},
            {x: 16, y: this.game.world.height -24},
            {x: this.game.world.width - 16, y: this.game.world.height -24},
        ]
    }

    getObstacles () {
        return [this.ground, ...this.ledges, ...this.crates]
    }

    static loadAssets (game) {
        game.load.image('bg', './assets/playgrounds/cemetery/images/bg.png?__version__')
        game.load.image('clouds', './assets/playgrounds/cemetery/images/clouds.png?__version__')
        game.load.image('ground', './assets/playgrounds/cemetery/images/ground.png?__version__')
        game.load.image('ledge_left', './assets/playgrounds/cemetery/images/ledge_left.png?__version__')
        game.load.image('ledge_center', './assets/playgrounds/cemetery/images/ledge_center.png?__version__')
        game.load.image('ledge_right', './assets/playgrounds/cemetery/images/ledge_right.png?__version__')
        game.load.image('crate', './assets/playgrounds/cemetery/images/crate.png?__version__')
        game.load.image('tree', './assets/playgrounds/cemetery/images/tree.png?__version__')
        game.load.image('bush1', './assets/playgrounds/cemetery/images/bush1.png?__version__')
        game.load.image('bush2', './assets/playgrounds/cemetery/images/bush2.png?__version__')
        game.load.image('skeleton', './assets/playgrounds/cemetery/images/skeleton.png?__version__')
        game.load.image('tombstone1', './assets/playgrounds/cemetery/images/tombstone1.png?__version__')
        game.load.image('tombstone2', './assets/playgrounds/cemetery/images/tombstone2.png?__version__')
        game.load.image('sign1', './assets/playgrounds/cemetery/images/sign1.png?__version__')
        game.load.image('sign2', './assets/playgrounds/cemetery/images/sign2.png?__version__')

        game.load.audio('ambiental', './assets/playgrounds/cemetery/sounds/ambiental.mp3?__version__');
        game.load.audio('laugh', './assets/playgrounds/cemetery/sounds/laugh.mp3?__version__');
        game.load.audio('moan', './assets/playgrounds/cemetery/sounds/moan.mp3?__version__');
        game.load.audio('sirens', './assets/playgrounds/cemetery/sounds/sirens.mp3?__version__');
        game.load.audio('twilightzone', './assets/playgrounds/cemetery/sounds/twilightzone.mp3?__version__');
    }

    startMusic () {
        this.music.play('', 0, 1, true)
    }

    stopMusic () {
        this.music.stop()
    }

    moveClouds () {
        for (let i in this.clouds) {
            this.clouds[i].x -= i * 0.5 + 0.3

            if (this.clouds[i].x < 0 - this.clouds[i].width)
                this.clouds[i].x = this.game.world.width
        }
    }
}
