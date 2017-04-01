import Phaser from 'phaser'
import SecondaryWeapon from './Weapon/Secondary'
import PrimaryWeapon from './Weapon/Primary'
import FadingText from './FadingText'
import * as util from '../utils'

export default class extends Phaser.Sprite {

    constructor (game, id, type, x, y) {
        let data = game.cache.getJSON("players")[type]
        let orientation = id == 0 ? "right" : "left"

        super(game, x, y, type + "_player", data["sprite"][orientation]["frame"])

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
        this.animations.add('left', util.animationFramesFromRange(leftAnimation), leftAnimation['rate'], true)

        let rightAnimation = data["sprite"]["right"]["animation"]
        this.animations.add('right', util.animationFramesFromRange(rightAnimation), rightAnimation['rate'], true)

        this.hitSound = this.game.add.audio(type + "_hurt");

        this._addWeapons()

        this.goingLeft = false
        this.goingRight = false

        this.tintIndex = 0
        this._defaultTint()

        this.game.time.events.loop(60, this.switchTint, this);
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

    hurt(amount) {
        util.log("player " + (this.id + 1),  "taken damage: " + amount)
        this.game.add.existing(new FadingText(this.game, this, "-" + amount + " HP"))

        this.hitSound.play()

        if (this._isActive)
            this.health = Math.max(0, this.health - amount)

        return this.health
    }

    firePrimary() {
        if (this._isActive)
            this.primaryWeapon.fire(this.orientation)
    }

    fireSecondary() {
        if (this._isActive)
            this.secondaryWeapon.fire(this.orientation)
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

    /**
     * Add primary and secondary weapons
     *
     * @private
     */
    _addWeapons() {
        this.primaryWeapon = this.game.add.existing(new PrimaryWeapon(this.game, this.data["weapons"]["primary"], this.type))
        this.primaryWeapon.trackSprite(this)

        this.secondaryWeapon = this.game.add.existing(new SecondaryWeapon(this.game, this.data["weapons"]["secondary"], this.type))
        this.secondaryWeapon.trackSprite(this)
    }

    _stopAnimation () {
        this.animations.stop();
        this.body.velocity.x = 0;
        this.frame = this.data["sprite"][this.orientation]["frame"]
    }

    boostHealth(amount) {
        util.log("player " + (this.id + 1), "health + " + amount)
        this.game.add.existing(new FadingText(this.game, this, "+" + amount + " HP"))

        if (this._isActive)
            this.health = Math.min(100, this.health + amount)

        return this.health
    }

    boostSpeed(duration, percentage) {
        util.log("player " + (this.id + 1), "speed +" + percentage + "% for " + duration + " seconds")
        this.game.add.existing(new FadingText(this.game, this, "+" + percentage + "% speed\n(" + duration + " sec)"))

        this.speed = Math.round(this.defaultSpeed * (100 + percentage) / 100)
        this.game.time.events.add(Phaser.Timer.SECOND * duration, this._boostSpeedExpired, this);
        this._speedTint()

    }

    _boostSpeedExpired() {
        util.log("player " + (this.id + 1), "speed back to normal")
        this.speed = this.defaultSpeed
        this._defaultTint()
    }

    boostDamage(duration, percentage) {
        util.log("player " + (this.id + 1), "damage +" + percentage + "% for " + duration + " seconds")
        this.game.add.existing(new FadingText(this.game, this, "+" + percentage + "% damage\n(" + duration + " sec)"))

        this._setDamagePercentage(100 + percentage)
        this.game.time.events.add(Phaser.Timer.SECOND * duration, this._boostDamageExpired, this);
        this._damageTint()
    }

    _boostDamageExpired() {
        util.log("player " + (this.id + 1), "damage back to normal")
        this._setDamagePercentage(100)
        this._defaultTint()
    }

    switchTint () {
        this.tintIndex = 1 - this.tintIndex
        this.tint = this.tintIndex == 1 ? this.tintColor : 0xFFFFFF
    }

    _setDamagePercentage(percentage) {
        this.primaryWeapon.setDamagePercentage(percentage)
        this.secondaryWeapon.setDamagePercentage(percentage)
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
}
