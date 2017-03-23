import Phaser from 'phaser'
import SecondaryWeapon from './Weapon/Secondary'
import PrimaryWeapon from './Weapon/Primary'

export default class extends Phaser.Sprite {

    constructor ({ game, id, type, x, y, context }) {
        let data = game.cache.getJSON("players")[type]
        let orientation = id == 0 ? "right" : "left"

        super(game, x, y, type + "_player", data["sprite"][orientation]["frame"])

        this.context = context
        this.health = 100
        this._isActive = false
        this.id = id
        this.type = type
        this.name = data["name"]
        this.orientation = orientation
        this.data = data

        this.defaultSpeed = data["physics"]["speed"]
        this.speed = this.defaultSpeed
        this.game.physics.arcade.enable(this)
        this.body.gravity.y = data["physics"]["gravity"];
        this.body.collideWorldBounds = true

        this.anchor.setTo(0.5)

        let leftAnimation = data["sprite"]["left"]["animation"]
        this.animations.add('left', this._getAnimationFrames(leftAnimation), leftAnimation['rate'], true)

        let rightAnimation = data["sprite"]["right"]["animation"]
        this.animations.add('right', this._getAnimationFrames(rightAnimation), rightAnimation['rate'], true)

        this.hitSound = this.game.add.audio(type + "_hurt");

        this._addPrimaryWeapon()
        this._addSecondaryWeapon()

        this.goingLeft = false
        this.goingRight = false

        this.tintIndex = 0
        this._defaultTint()

        this.game.time.events.loop(60, this.switchTint, this);
    }

    create () {
    }

    update () {
        if (this.goingLeft) {
            if (this._isActive) {
                this.body.velocity.x = -(this.speed)
                this.animations.play('left')
                this.orientation = 'left'
            }
        } else if (this.goingRight) {
            if (this._isActive) {
                this.body.velocity.x = this.speed
                this.animations.play('right')
                this.orientation = 'right'
            }
        } else {
            this._stopAnimation()
        }
    }

    activate () {
        this._isActive = true
    }

    deactivate () {
        this._isActive = false
        this._stopAnimation()
    }

    getPrimaryWeapon () {
        return this.primaryWeapon
    }

    getSecondaryWeapon () {
        return this.secondaryWeapon
    }

    getName () {
        return this.name
    }

    getHealth () {
        return this.health
    }

    hurt (amount) {
        console.log("[player " + (this.id + 1) + "] taken damage: " + amount)
        this.hitSound.play()

        if (this._isActive)
            this.health = Math.max(0, this.health - amount)

        return this.health
    }

    setDamagePercentage (percentage) {
        this.primaryWeapon.setDamagePercentage(percentage)
        this.secondaryWeapon.setDamagePercentage(percentage)
    }

    firePrimary () {
        if (this._isActive)
            this.primaryWeapon.fire(this.orientation == 'left' ? Phaser.ANGLE_LEFT : Phaser.ANGLE_RIGHT)
    }

    fireSecondary () {
        if (this._isActive)
            this.secondaryWeapon.fire(this.orientation == 'left' ? 225 : -45)
    }

    jump () {
        if (this._isActive && this.body.touching.down)
            this.body.velocity.y = -(this.data["physics"]["jump"]);
    }

    startLeft () {
        this.goingLeft = true
    }

    stopLeft () {
        this.goingLeft = false
    }

    startRight () {
        this.goingRight = true
    }

    stopRight () {
        this.goingRight = false
    }

    _addPrimaryWeapon () {
        this.primaryWeapon = this.game.add.existing(
            new PrimaryWeapon({
                game: this.game,
                data: this.data["weapons"]["primary"],
                player: this,
            })
        )
    }

    _addSecondaryWeapon () {
        this.secondaryWeapon = this.game.add.existing(
            new SecondaryWeapon({
                game: this.game,
                data: this.data["weapons"]["secondary"],
                player: this,
                onExplode: {
                    object: this.context,
                    method: this.context.onSecondaryExplosion,
                },
            })
        )
    }

    _getAnimationFrames (animation) {
        let frames = []

        for (let i = 0; i < animation["count"]; i++)
            frames.push(i +  animation["start"])

        return frames
    }

    _stopAnimation () {
        this.animations.stop();
        this.body.velocity.x = 0;
        this.frame = this.data["sprite"][this.orientation]["frame"]
    }

    boostHealth (amount) {
        console.log("[player " + (this.id + 1) + "] health + " + amount)

        if (this._isActive)
            this.health = Math.min(100, this.health + amount)

        return this.health
    }

    boostSpeed (duration, percentage) {
        console.log("[player " + (this.id + 1) + "] speed +" + percentage + "% for " + duration + " seconds")
        this.speed = Math.round(this.defaultSpeed * (100 + percentage) / 100)
        let event = this.game.time.events.add(Phaser.Timer.SECOND * duration, this.boostSpeedExpired, this);
        this._speedTint()
    }

    boostSpeedExpired () {
        console.log("[player " + (this.id + 1) + "] speed back to normal")
        this.speed = this.defaultSpeed
        this._defaultTint()
    }

    boostDamage (duration, percentage) {
        this._damageTint()
        console.log("[player " + (this.id + 1) + "] damage +" + percentage + "% for " + duration + " seconds")
        this.setDamagePercentage(100 + percentage)
        let event = this.game.time.events.add(Phaser.Timer.SECOND * duration, this.boostDamageExpired, this);
    }

    boostDamageExpired () {
        this._defaultTint()
        console.log("[player " + (this.id + 1) + "] damage back to normal")
        this.setDamagePercentage(100)
    }

    switchTint () {
        this.tintIndex = 1 - this.tintIndex
        this.tint = this.tintIndex == 1 ? this.tintColor : 0xFFFFFF
    }

    _defaultTint () {
        this.tintColor = 0xFFFFFF
    }

    _damageTint () {
        this.tintColor = 0xFF4444
    }

    _speedTint () {
        this.tintColor = 0x44FF44
    }

    static loadAssets (game, type) {
        let data = game.cache.getJSON("players")[type]

        game.load.spritesheet(type + "_player" , "./assets/players/" + type + "/images/player.png?__version__", data["sprite"]["width"], data["sprite"]["height"])
        game.load.audio(type + "_hurt", "./assets/players/" + type + "/sounds/hurt.mp3?__version__");

        PrimaryWeapon.loadAssets(game, type)
        SecondaryWeapon.loadAssets(game, type)
    }
}
