import Phaser from 'phaser'
import AbstractPlayground from '../Abstract/Playground'
import Ground from './Cemetery/Ground'
import Ledge from './Cemetery/Ledge'
import Crate from './Cemetery/Crate'
import * as util from '../../utils'

export default class extends AbstractPlayground {
    /**
     * Constructor
     *
     * @param game Game object
     */
    constructor(game) {
        super(game)

        this._addBackground()
        this._addVisualElements()
        this._addSounds()
        this._addPowerupSpots()
    }

    /**
     * Add positions for power-ups
     */
    _addPowerupSpots() {
        this.powerupSpots = [
            {x: game.world.centerX - 176, y: 326},
            {x: game.world.centerX + 160, y: 326},
            {x: 60, y: 381},
            {x: game.world.width - 60, y: 381},
            {x: 360, y: 491},
            {x: game.world.width - 360, y: 491},
            {x: 180, y: 621},
            {x: game.world.width - 180, y: 621},
            {x: game.world.centerX - 58, y: game.world.height - 108},
            {x: game.world.centerX + 58, y: game.world.height - 108},
            {x: 16, y: game.world.height -24},
            {x: game.world.width - 16, y: game.world.height -24},
        ]
    }

    /**
     * Get the list of obstacles
     *
     * @returns {[]}
     */
    getObstacles() {
        return [this.ground, ...this.ledges, ...this.crates]
    }

    /**
     * Add the background
     *
     * @private
     */
    _addBackground() {
        let game = this.game

        // background image
        game.add.sprite(0, 0, 'cemetery_bg')

        // add the clouds
        this.clouds = [
            game.add.sprite(200, 200, 'cemetery_clouds'),
            game.add.sprite(900, 650, 'cemetery_clouds')
        ]

        // ... and make them move
        game.time.events.loop(50,
            function () {
                for (let i in this.clouds) {
                    this.clouds[i].x -= i * 0.5 + 0.3

                    if (this.clouds[i].x < 0 - this.clouds[i].width)
                        this.clouds[i].x = game.world.width
                }
            },
            this
        );
    }

    /**
     * Add visual elements
     *
     * @private
     */
    _addVisualElements() {
        this.ledges = []
        this.crates = []
        this.startY = 752
        this.step = 130

        this._level0()
        this._level1()
        this._level2()
        this._level3()
        this._level4()
    }

    /**
     * Ground level
     *
     * @private
     */
    _level0() {
        let game = this.game

        this.ground = game.add.existing(new Ground(game))

        // bottom crates
        this.crates.push(game.add.existing(new Crate(game, game.world.centerX - 85, game.world.height - 85 - 24)))
        this.crates.push(game.add.existing(new Crate(game, game.world.centerX, game.world.height - 85 - 24)))

        // middle top crate
        this.crates.push(game.add.existing(new Crate(game, game.world.centerX - 85 / 2, game.world.height - 85 - 24 - 85)))

        // left tombstone and bush
        game.add.sprite(20, game.world.height - 55 - 24, 'cemetery_tombstone1')
        game.add.sprite(0, game.world.height - 20 - 24, 'cemetery_bush2')

        // right tombstone and bush
        game.add.sprite(game.world.width - 54 - 20, game.world.height - 55 - 24, 'cemetery_tombstone1')
        game.add.sprite(game.world.width - 40, game.world.height - 20 - 24,'cemetery_bush2')
    }

    /**
     * First level above ground
     *
     * @private
     */
    _level1() {
        let game = this.game

        // left ledge, bush and sign
        this.ledges.push(game.add.existing(new Ledge(game, 0, this.startY - this.step, 3)))
        game.add.sprite(210, game.world.height - 41 - 24 - this.step - 24, 'cemetery_bush1')
        game.add.sprite(20, game.world.height - 87 - 24 - this.step - 24, 'cemetery_sign1')

        // right ledge, bush and sign
        this.ledges.push(game.add.existing(new Ledge(game, game.world.width - 64 * 4 - 24, this.startY - this.step, 3)))
        game.add.sprite(game.world.width - 210 - 40 - 20, game.world.height - 41 - 24 - this.step - 24, 'cemetery_bush1')
        game.add.sprite(game.world.width - 100, game.world.height - 93 - 24 - this.step - 24, 'cemetery_sign2')
    }

    /**
     * Second level above ground
     *
     * @private
     */
    _level2() {
        let game = this.game

        // middle left
        this.ledges.push(game.add.existing(new Ledge(game, 300, this.startY - 2 * this.step, 3)))
        game.add.sprite(game.world.centerX - 53 / 2 - 180, game.world.height - 76 - 24 - 2 * this.step - 24, 'cemetery_tombstone2')
        game.add.sprite(game.world.centerX - 40 / 2 - 210, game.world.height - 20 - 24 - 2 * this.step - 24, 'cemetery_bush2')

        // middle right
        this.ledges.push(game.add.existing(new Ledge(game, 700, this.startY - 2 * this.step, 3)))
        game.add.sprite(game.world.centerX - 53 / 2 + 180, game.world.height - 76 - 24 - 2 * this.step - 24, 'cemetery_tombstone2')
        game.add.sprite(game.world.centerX - 40 / 2 + 210, game.world.height - 20 - 24 - 2 * this.step - 24, 'cemetery_bush2')
    }

    /**
     * Third level above ground
     *
     * @private
     */
    _level3() {
        let game = this.game

        // left ledge and crate
        this.ledges.push(game.add.existing(new Ledge(game, 0, this.startY - 3 * this.step + 20, 2)))
        this.crates.push(game.add.existing(new Crate(game, 142, game.world.height - 85 - 24 - this.step * 3 - 24 + 20)))

        // right ledge and crate
        this.ledges.push(game.add.existing(new Ledge(game, game.world.width - 64 * 4 + 30, this.startY - 3 * this.step + 20, 2)))
        this.crates.push(game.add.existing(new Crate(game, game.world.width - 85 - 142, game.world.height - 85 - 24 - this.step * 3 - 24 + 20)))
    }

    /**
     * Fourth level above ground
     *
     * @private
     */
    _level4() {
        let game = this.game

        this.ledges.push(game.add.existing(new Ledge(game, game.world.width - 64 * 13, this.startY - 3 * this.step - 35, 5)))
        game.add.sprite(game.world.centerX - 286 / 2, game.world.height - 239 - 24 - this.step * 3 - 24 - 35, 'cemetery_tree')
        game.add.sprite(game.world.centerX - 48 / 2 - 50, game.world.height - 24 - 24 - this.step * 3 - 24 - 35, 'cemetery_skeleton')
    }

    /**
     * Add ambient and random sounds
     *
     * @private
     */
    _addSounds() {
        let game = this.game

        let music = game.add.audio('cemetery_ambient')
        music.play('', 0, 0.2, true)

        let soundList = ["cemetery_laugh", "cemetery_sirens", "cemetery_twilightzone"]
        this.sounds = []
        for (let sound of soundList) {
            this.sounds.push(game.add.audio(sound))
        }

        this._startRandomSoundTimer()
    }

    /**
     * Register the timer to play a random sound
     *
     * @private
     */
    _startRandomSoundTimer() {
        const PAUSE = 10
        util.log("cemetery", "next sound in " + PAUSE + " seconds")
        this.game.time.events.add(Phaser.Timer.SECOND * PAUSE, this._playRandomSound, this);
    }

    /**
     * Play a random sound from the list
     *
     * @private
     */
    _playRandomSound() {
        let sound = this.sounds[Math.round(Math.random() * (this.sounds.length - 1))]
        util.log("cemetery", "playing sound " + sound.key)

        sound.play('', 0, 0.4)
        sound.onStop.addOnce(
            function (sound) {
                util.log("cemetery", "finished playing sound " + sound.key)
                this._startRandomSoundTimer()
            },
            this,
            sound
        );
    }
}
