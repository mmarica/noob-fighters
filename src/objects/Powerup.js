import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, type, x, y, onPowerupExpire, onPowerupTakeHealth, onPowerupTakeSpeed, onPowerupTakeDamage, onPowerupTakeTrap }) {
        super(game, x, y, "powerup_" + type)
        this.type = type

        this.onPowerupExpire = onPowerupExpire
        this.onPowerupTakeHealth = onPowerupTakeHealth
        this.onPowerupTakeSpeed = onPowerupTakeSpeed
        this.onPowerupTakeDamage = onPowerupTakeDamage
        this.onPowerupTakeTrap = onPowerupTakeTrap

        this.anchor.setTo(0.5, 1)
        this.game.physics.arcade.enable(this)

        let data = game.cache.getJSON("config")["power-ups"]
        this.appearDuration = data["appear"]["duration"]
        this.healthAmount = data["health"]["amount"]
        this.speedDuration = data["speed"]["duration"]
        this.speedPercentage = data["speed"]["percentage"]
        this.damageDuration = data["damage"]["duration"]
        this.damagePercentage = data["damage"]["percentage"]
        this.trapAmount = data["trap"]["amount"]

        const types = ['appear', 'disappear', 'take_health', 'take_speed', 'take_damage', 'take_trap']
        this.sounds = []
        for (let type of types) {
            this.sounds[type] = this.game.add.audio("powerup_" + type);
        }

        this.animations.add("default", null, 15, true)
        this.animations.play("default")
        this.sounds['appear'].play()

        console.log('[power-up] appeared for ' + this.appearDuration + ' seconds: ' + type)
        this.timer = this.game.time.events.add(Phaser.Timer.SECOND * this.appearDuration, this.expire, this);
    }

    expire () {
        console.log('[power-up] expired')
        this.sounds['disappear'].play()
        this._disappearAnimation()

        this.onPowerupExpire.method.bind(this.onPowerupExpire.object)()
        this.kill()
    }

    _disappearAnimation() {
        let disappear = this.game.add.sprite(this.body.x, this.body.y, "powerup_disappear")
        disappear.animations.add("poof", null, 15, false)
        let animation = disappear.animations.play("poof")
        animation.onComplete.add(function () {
            disappear.kill()
        }, disappear, this)
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
        this.game.time.events.remove(this.timer)
        
        let type = this.type

        if (this.type == 'surprise') {
            type = this.constructor.getRandomType(true)
            console.log('[power-up] surprise  => ' + type)
        }

        console.log('[power-up] taken: ' + type)

        this.sounds["take_" + type].play()

        switch (type) {
            case "health":
                this.onPowerupTakeHealth.method.bind(this.onPowerupTakeHealth.object)(player, this.healthAmount)
                break

            case "speed":
                this.onPowerupTakeSpeed.method.bind(this.onPowerupTakeSpeed.object)(player, this.speedDuration, this.speedPercentage)
                break

            case "damage":
                this.onPowerupTakeDamage.method.bind(this.onPowerupTakeDamage.object)(player, this.damageDuration, this.damagePercentage)
                break

            case "trap":
                this.onPowerupTakeTrap.method.bind(this.onPowerupTakeTrap.object)(player, this.trapAmount)
                break
        }

        this._disappearAnimation()
        this.kill()
    }

    update () {
    }

    static loadAssets (game) {
        game.load.spritesheet('powerup_health', './assets/powerups/images/health.png?__version__', 32, 32);
        game.load.spritesheet('powerup_speed', './assets/powerups/images/speed.png?__version__', 32, 32);
        game.load.spritesheet('powerup_damage', './assets/powerups/images/damage.png?__version__', 32, 32);
        game.load.spritesheet('powerup_trap', './assets/powerups/images/trap.png?__version__', 32, 32);
        game.load.spritesheet('powerup_surprise', './assets/powerups/images/surprise.png?__version__', 32, 32);
        game.load.spritesheet('powerup_disappear', './assets/powerups/images/disappear.png?__version__', 32, 32);
        game.load.audio('powerup_appear', './assets/powerups/sounds/appear.mp3?__version__');
        game.load.audio('powerup_disappear', './assets/powerups/sounds/disappear.mp3?__version__');
        game.load.audio('powerup_take_health', './assets/powerups/sounds/take_health.mp3?__version__');
        game.load.audio('powerup_take_trap', './assets/powerups/sounds/take_trap.mp3?__version__');
        game.load.audio('powerup_take_speed', './assets/powerups/sounds/take_speed.mp3?__version__');
        game.load.audio('powerup_take_damage', './assets/powerups/sounds/take_damage.mp3?__version__');
    }
}
