import Phaser from 'phaser'
import Ground from './Forest/Ground'
import RockLedge from './Forest/RockLedge'
import GrassLedge from './Forest/GrassLedge'

export default class extends Phaser.Group {

    constructor ({ game }) {
        super(game)
        this.enableBody = true

        game.add.sprite(0, 0, 'bg')
        this.clouds = [
             game.add.tileSprite(0, 70, 1280, 150, 'clouds1'),
             game.add.tileSprite(0, 200, 1280, 116, 'clouds2')
        ]

        this.rocks = []
        this.rock_ledges = []
        this.grass_ledges = []

        this._level0()
        this._level1()
        this._level2()
        this._level3()
        this._level4()

        this.music = game.add.audio('ambiental')

        this.game.time.events.loop(50, this.moveClouds, this);
    }

    // ground level
    _level0 () {
        let game = this.game

        this.ground = game.add.existing(
            new Ground({ game: game })
        )

        // rock structure in the middle
        let coords = [
            [game.world.centerX - 64 * 2 + 32, game.world.height - 64 - 24],
            [game.world.centerX - 64 + 32, game.world.height - 64 - 24],
            [game.world.centerX + 32, game.world.height - 64 - 24],
            // upper...
            [game.world.centerX - 64 + 32, game.world.height - 128 - 24],
            [game.world.centerX + 32, game.world.height - 128 - 24],
            // upper...
            [game.world.centerX + 32, game.world.height - 192 - 24],
        ]

        for (let coord of coords) {
            let sprite = this.game.add.sprite(coord[0], coord[1], "rock1")
            this.game.physics.arcade.enable(sprite)
            sprite.body.immovable = true
            this.rocks.push(sprite)
        }
    }

    _level1 () {
        // left
        let ledge = this.game.add.existing(new RockLedge({
            game: game,
            x: 0,
            y: 620,
            length: 2
        }))
        this.rock_ledges.push(ledge)

        // right
        ledge = this.game.add.existing(new RockLedge({
            game: game,
            x: 900,
            y: 620,
            length: 3
        }))
        this.rock_ledges.push(ledge)
    }

    _level2 () {
        // left
        let ledge = this.game.add.existing(new RockLedge({
            game: game,
            x: 300,
            y: 470,
            length: 3
        }))
        this.rock_ledges.push(ledge)

        // right
        ledge = this.game.add.existing(new RockLedge({
            game: game,
            x: 1152,
            y: 470,
            length: 2
        }))
        this.rock_ledges.push(ledge)
    }

    _level3 () {
        // left
        let ledge = this.game.add.existing(new GrassLedge({
            game: game,
            x: 64 * 4,
            y: 360,
            length: 1
        }))
        this.grass_ledges.push(ledge)

        // center
        ledge = this.game.add.existing(new GrassLedge({
            game: game,
            x: 640,
            y: 360,
            length: 2
        }))
        this.grass_ledges.push(ledge)

        // right
        ledge = this.game.add.existing(new GrassLedge({
            game: game,
            x: 940,
            y: 360,
            length: 1
        }))
        this.grass_ledges.push(ledge)
    }

    _level4 () {
        // left
        let ledge = this.game.add.existing(new GrassLedge({
            game: game,
            x: 0,
            y: 260,
            length: 4
        }))
        this.grass_ledges.push(ledge)

        // right
        ledge = this.game.add.existing(new GrassLedge({
            game: game,
            x: 1152,
            y: 260,
            length: 2
        }))
        this.grass_ledges.push(ledge)
    }

    getPowerupSpots () {
        return [
            {x: 98, y: 260},
            {x: 1216, y: 260},
            {x: 974, y: 360},
            {x: 674, y: 360},
            {x: 290, y: 360},
            {x: 1216, y: 470},
            {x: 400, y: 470},
            {x: 16, y: 620},
            {x: 996, y: 620},
            {x: 656, y: 648},
            {x: 16, y: 776},
            {x: 1264, y: 776},
        ]
    }

    getObstacles () {
        return [this.ground, ...this.rocks, ...this.rock_ledges, ...this.grass_ledges]
    }

    static loadAssets (game) {
        game.load.audio('ambiental', './assets/playgrounds/forest/sounds/ambiental.mp3?__version__');
        game.load.image('bg', './assets/playgrounds/forest/images/bg.png?__version__')
        game.load.image('ground', './assets/playgrounds/forest/images/ground.png?__version__')
        game.load.image('clouds1', './assets/playgrounds/forest/images/clouds1.png?__version__')
        game.load.image('clouds2', './assets/playgrounds/forest/images/clouds2.png?__version__')
        game.load.image('rock1', './assets/playgrounds/forest/images/rock1.png?__version__')
        game.load.image('rock_ledge', './assets/playgrounds/forest/images/rock_ledge.png?__version__')
        game.load.image('grass_ledge', './assets/playgrounds/forest/images/grass_ledge.png?__version__')
    }

    startMusic () {
        this.music.play('', 0, 0.2, true)
    }

    stopMusic () {
        this.music.stop()
    }

    moveClouds () {
        for (let i in this.clouds) {
            this.clouds[i].tilePosition.x -= i * 0.5 + 0.3
            this.clouds[i].tilePosition.x = this.clouds[i].tilePosition.x % this.clouds[i].width
        }
    }
}
