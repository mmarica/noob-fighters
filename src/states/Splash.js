import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        //
        // load your assets here
        //
        this.load.spritesheet('dude', './assets/images/dude.png', 32, 48)
        this.load.image('bg', './assets/images/bg.png')
        this.load.image('ground', './assets/images/ground.png')
        this.load.image('ledge_left', './assets/images/ledge_left.png')
        this.load.image('ledge_center', './assets/images/ledge_center.png')
        this.load.image('ledge_right', './assets/images/ledge_right.png')
    }

    create () {
        this.state.start('Game')
    }

}
