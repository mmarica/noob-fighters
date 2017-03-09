import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, type, x, y, context }) {
        let data = game.cache.getJSON("players")[type]
        super(game, x, y, "powerup_" + type)

        this.type = type
        this.context = context
        this.anchor.setTo(0.5, 1)

        this.game.physics.arcade.enable(this)

        this.appearSound = this.game.add.audio("powerup_appear");
        this.appearSound.play()

        this.game.time.events.add(Phaser.Timer.SECOND * 8, this.expire, this);
    }

    expire () {
        this.context.onPowerupExpire()
        this.kill()
    }

    static getRandomType (excludeSurprise) {
        const types = ['health', 'speed', 'damage', 'trap', 'surprise']

        while (true) {
            let type = types[Math.round(Math.random() * (types.length - 1))]

            if (excludeSurprise && type == "surprise")
                continue

            return type
        }
    }

    take (player) {
        let type = this.type

        if (this.type == 'surprise') {
            type = this.constructor.getRandomType(true)
            if (__DEV__) console.log('[power-up] surprise  => ' + type)
        }

        switch (type) {
            case "health":
                if (__DEV__) console.log('[power-up] taken health')
                this.context.onPowerupTakeHealth(player)
                break

            case "speed":
                if (__DEV__) console.log('[power-up] taken speed')
                this.context.onPowerupTakeSpeed(player)
                break

            case "damage":
                if (__DEV__) console.log('[power-up] taken damage')
                this.context.onPowerupTakeDamage(player)
                break

            case "trap":
                if (__DEV__) console.log('[power-up] taken trap')
                this.context.onPowerupTakeTrap(player)
                break
        }

        this.kill()
    }

    update () {
    }

    static loadAssets (game) {
        game.load.image('powerup_health', './assets/common/images/powerups/health.png?__version__');
        game.load.image('powerup_speed', './assets/common/images/powerups/speed.png?__version__');
        game.load.image('powerup_damage', './assets/common/images/powerups/damage.png?__version__');
        game.load.image('powerup_trap', './assets/common/images/powerups/trap.png?__version__');
        game.load.image('powerup_surprise', './assets/common/images/powerups/surprise.png?__version__');
        game.load.audio('powerup_appear', './assets/common/sounds/powerups/appear.mp3?__version__');
    }
}
