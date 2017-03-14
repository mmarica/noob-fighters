import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

        this.game.load.audio('game_over', './assets/common/sounds/game_over.mp3?__version__');

        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        this.load.json('config', 'data/config.json?__version__')
        this.load.json('players', 'data/players.json?__version__')
    }

    create () {
        this.state.start('Menu')
    }
}
