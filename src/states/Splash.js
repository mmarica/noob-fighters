import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

        this.game.load.spritesheet('explosion', './assets/common/images/explosion.png', 64, 64, 23);
        this.game.load.audio('explosion', './assets/common/sounds/explosion.wav', 64, 64, 23);

        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        this.load.json('config', 'data/config.json')
        this.load.json('players', 'data/players.json')
    }

    create () {
        this.state.start('Game')
    }
}
