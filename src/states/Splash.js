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
        this.load.spritesheet('alien', './assets/images/alien.png', 64, 32)
        this.load.spritesheet('noobacca', './assets/images/noobacca.png', 36, 64)
        this.load.image('bg', './assets/images/bg.png')
        this.load.image('ground', './assets/images/playground/cemetery/ground.png')
        this.load.image('ledge_left', './assets/images/playground/cemetery/ledge_left.png')
        this.load.image('ledge_center', './assets/images/playground/cemetery/ledge_center.png')
        this.load.image('ledge_right', './assets/images/playground/cemetery/ledge_right.png')
        this.load.image('crate', './assets/images/playground/cemetery/crate.png')
        this.load.image('tree', './assets/images/playground/cemetery/tree.png')
        this.load.image('bush1', './assets/images/playground/cemetery/bush1.png')
        this.load.image('bush2', './assets/images/playground/cemetery/bush2.png')
        this.load.image('skeleton', './assets/images/playground/cemetery/skeleton.png')
        this.load.image('tombstone1', './assets/images/playground/cemetery/tombstone1.png')
        this.load.image('tombstone2', './assets/images/playground/cemetery/tombstone2.png')
        this.load.image('sign1', './assets/images/playground/cemetery/sign1.png')
        this.load.image('sign2', './assets/images/playground/cemetery/sign2.png')
        this.load.image('alien_projectile', './assets/images/alien_projectile.png')
        this.load.image('noobacca_projectile', './assets/images/noobacca_projectile.png')
        this.game.load.audio('alien_shoot', 'assets/audio/alien_shoot.mp3');
        this.game.load.audio('noobacca_shoot', 'assets/audio/noobacca_shoot.mp3');
        this.game.load.audio('alien_hit', 'assets/audio/alien_hit.mp3');
        this.game.load.audio('noobacca_hit', 'assets/audio/noobacca_hit.mp3');

        this.game.load.json('config', 'data/config.json')
        this.game.load.json('players', 'data/players.json')
    }

    create () {
        this.state.start('Game')
    }
}
