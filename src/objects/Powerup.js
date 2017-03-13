import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, type, x, y, context }) {
        let data = game.cache.getJSON("players")[type]
        super(game, x, y, "powerup_" + type)

        this.type = type
        this.context = context
        this.anchor.setTo(0.5, 1)

        this.game.physics.arcade.enable(this)

        const types = ['appear', 'disappear', 'take_health', 'take_speed', 'take_damage', 'take_trap']
        this.sounds = []
        for (let type of types) {
            this.sounds[type] = this.game.add.audio("powerup_" + type);
        }

        this.sounds['appear'].play()

        this.timer = this.game.time.events.add(Phaser.Timer.SECOND * 10, this.expire, this);
    }

    expire () {
        this.sounds['disappear'].play()
        this.context.onPowerupExpire()
        this.kill()
    }

    static getRandomType (excludeSurprise) {
        const types = ['health', 'speed', /*'damage',*/ 'trap', 'surprise']

        while (true) {
            let type = types[Math.round(Math.random() * (types.length - 1))]

            if (excludeSurprise && type == "surprise")
                continue

            return type
        }
    }

    take (player) {
        this.game.time.events.remove(this.timer)
        
        let type = this.type

        if (this.type == 'surprise') {
            type = this.constructor.getRandomType(true)
            if (__DEV__) console.log('[power-up] surprise  => ' + type)
        }

        if (__DEV__) console.log('[power-up] taken ' + type)

        this.sounds["take_" + type].play()

        switch (type) {
            case "health":
                this.context.onPowerupTakeHealth(player)
                break

            case "speed":
                this.context.onPowerupTakeSpeed(player)
                break

            case "damage":
                this.context.onPowerupTakeDamage(player)
                break

            case "trap":
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
        game.load.audio('powerup_disappear', './assets/common/sounds/powerups/disappear.mp3?__version__');
        game.load.audio('powerup_take_health', './assets/common/sounds/powerups/take_health.mp3?__version__');
        game.load.audio('powerup_take_trap', './assets/common/sounds/powerups/take_trap.mp3?__version__');
        game.load.audio('powerup_take_speed', './assets/common/sounds/powerups/take_speed.mp3?__version__');
        game.load.audio('powerup_take_damage', './assets/common/sounds/powerups/take_damage.mp3?__version__');
    }
}
