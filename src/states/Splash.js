import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

        this.game.load.spritesheet('explosion', './assets/common/images/explosion.png?__version__', 64, 64, 23);
        this.game.load.audio('explosion', './assets/common/sounds/explosion.wav?__version__');

        this.game.load.image('powerup_health', './assets/common/images/powerups/health.png?__version__');
        this.game.load.image('powerup_speed', './assets/common/images/powerups/speed.png?__version__');
        this.game.load.image('powerup_damage', './assets/common/images/powerups/damage.png?__version__');
        this.game.load.image('powerup_trap', './assets/common/images/powerups/trap.png?__version__');
        this.game.load.image('powerup_surprise', './assets/common/images/powerups/surprise.png?__version__');

        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        this.load.json('config', 'data/config.json?__version__')
        this.load.json('players', 'data/players.json?__version__')
    }

    create () {
        this.state.start('Game')
    }
}
