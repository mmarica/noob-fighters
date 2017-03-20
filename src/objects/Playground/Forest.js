import Phaser from 'phaser'
import Ground from './Forest/Ground'

export default class extends Phaser.Group {

    constructor ({ game }) {
        super(game)
        this.enableBody = true

        game.add.sprite(0, 0, 'bg')
        this.clouds = [
             game.add.tileSprite(0, 70, 1280, 150, 'clouds1'),
             game.add.tileSprite(0, 200, 1280, 116, 'clouds2')
        ]

        this._level0()

        this.music = game.add.audio('ambiental')

        this.game.time.events.loop(50, this.moveClouds, this);
    }

    // ground level
    _level0 () {
        let game = this.game

        this.ground = game.add.existing(
            new Ground({ game: game })
        )
    }

    getPowerupSpots () {
        return [
            {x: 16, y: this.game.world.height -24},
            {x: this.game.world.width - 16, y: this.game.world.height -24},
        ]
    }

    getObstacles () {
        return [this.ground]
    }

    static loadAssets (game) {
        game.load.audio('ambiental', './assets/playgrounds/forest/sounds/ambiental.mp3?__version__');
        game.load.image('bg', './assets/playgrounds/forest/images/bg.png?__version__')
        game.load.image('ground', './assets/playgrounds/forest/images/ground.png?__version__')
        game.load.image('clouds1', './assets/playgrounds/forest/images/clouds1.png?__version__')
        game.load.image('clouds2', './assets/playgrounds/forest/images/clouds2.png?__version__')
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
