import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        // cemetery playground
        this.load.image('bg', './assets/playgrounds/cemetery/images/bg.png')
        this.load.image('ground', './assets/playgrounds/cemetery/images/ground.png')
        this.load.image('ledge_left', './assets/playgrounds/cemetery/images/ledge_left.png')
        this.load.image('ledge_center', './assets/playgrounds/cemetery/images/ledge_center.png')
        this.load.image('ledge_right', './assets/playgrounds/cemetery/images/ledge_right.png')
        this.load.image('crate', './assets/playgrounds/cemetery/images/crate.png')
        this.load.image('tree', './assets/playgrounds/cemetery/images/tree.png')
        this.load.image('bush1', './assets/playgrounds/cemetery/images/bush1.png')
        this.load.image('bush2', './assets/playgrounds/cemetery/images/bush2.png')
        this.load.image('skeleton', './assets/playgrounds/cemetery/images/skeleton.png')
        this.load.image('tombstone1', './assets/playgrounds/cemetery/images/tombstone1.png')
        this.load.image('tombstone2', './assets/playgrounds/cemetery/images/tombstone2.png')
        this.load.image('sign1', './assets/playgrounds/cemetery/images/sign1.png')
        this.load.image('sign2', './assets/playgrounds/cemetery/images/sign2.png')

        // noobien player type
        this.load.spritesheet('noobien_player', './assets/players/noobien/images/player.png', 65, 32)
        this.load.image('noobien_primary_bullet', './assets/players/noobien/images/primary_bullet.png')
        this.game.load.audio('noobien_primary_shoot', './assets/players/noobien/sounds/primary_shoot.mp3');
        this.game.load.audio('noobien_hurt', './assets/players/noobien/sounds/hurt.mp3');

        // noobacca player type
        this.load.spritesheet('noobacca_player', './assets/players/noobacca/images/player.png', 35, 64)
        this.load.image('noobacca_primary_bullet', './assets/players/noobacca/images/primary_bullet.png')
        this.game.load.audio('noobacca_primary_shoot', './assets/players/noobacca/sounds/primary_shoot.mp3');
        this.game.load.audio('noobacca_hurt', './assets/players/noobacca/sounds/hurt.mp3');

        this.game.load.json('config', 'data/config.json')
        this.game.load.json('players', 'data/players.json')
    }

    create () {
        this.state.start('Game')
    }
}
