import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

        this.game.load.spritesheet('explosion', './assets/common/images/explosion.png#!version!#', 64, 64, 23);
        this.game.load.audio('explosion', './assets/common/sounds/explosion.wav#!version!#', 64, 64, 23);

        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        this.load.json('config', 'data/config.json#!version!#')
        this.load.json('players', 'data/players.json#!version!#')
    }

    create () {
        this.state.start('Game')
    }
}
