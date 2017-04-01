import Phaser from 'phaser'
import SecondaryWeapon from './Weapon/Secondary'
import PrimaryWeapon from './Weapon/Primary'
import FadingText from './FadingText'
import * as util from '../utils'

export default class extends Phaser.Sprite {
    /**
     * Constructor
     *
     * @param game Game object
     * @param id   Player id: 0 or 1
     * @param type Player type
     * @param x    Horizontal position
     * @param y    Vertical position
     */
    constructor (game, id, type, x, y) {
        let data = game.cache.getJSON("players")[type]
        let orientation = id == 0 ? "right" : "left"

        super(game, x, y, type + "_player", data["sprite"][orientation]["frame"])

        this.id = id
        this.type = type
        this.orientation = orientation
        this.data = data

        this._initialize()
        this._addWeapons()
    }

    /**
     * Initialize the player
     *
     * @private
     */
    _initialize() {
        let data = this.data

        // body stuff
        this.game.physics.arcade.enable(this)
        this.body.gravity.y = data["physics"]["gravity"];
        this.body.collideWorldBounds = true
        this.anchor.setTo(0.5)

        // various properties
        this.health = 100
        this.name = data["name"]
        this.defaultSpeed = data["physics"]["speed"]
        this.speed = this.defaultSpeed
        this._isActive = false
        this.goingLeft = false
        this.goingRight = false

        // add animations
        let leftAnimation = data["sprite"]["left"]["animation"]
        this.animations.add('left', util.animationFramesFromRange(leftAnimation), leftAnimation['rate'], true)
        let rightAnimation = data["sprite"]["right"]["animation"]
        this.animations.add('right', util.animationFramesFromRange(rightAnimation), rightAnimation['rate'], true)

        // power-up tinting
        this.tintIndex = 0
        this._defaultTint()
        this.game.time.events.loop(
            60,
            function() {
                this.tintIndex = 1 - this.tintIndex
                this.tint = this.tintIndex == 1 ? this.tintColor : 0xFFFFFF
            },
            this
        );

        // sound to play when being hurt
        this.hitSound = this.game.add.audio(this.type + "_hurt");
    }

    /**
     * Update handler
     */
    update() {
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

    /**
     * Activate the players (so they can move, shoot, etc)
     */
    activate() {
        this._isActive = true
    }

    /**
     * Deactivate the players (so they cannot move, shoot, etc)
     */
    deactivate() {
        this._isActive = false
        this._stopAnimation()
    }

    getHealth() {
        return this.health
    }

    hurt(amount) {
        if (this._isActive) {
            util.log("player " + (this.id + 1),  "taken damage: " + amount)
            this.game.add.existing(new FadingText(this.game, this, "-" + amount + " HP"))
            this.hitSound.play()
            this.health = Math.max(0, this.health - amount)
        }

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
        if (this._isActive) {
            util.log("player " + (this.id + 1), "health + " + amount)
            this.game.add.existing(new FadingText(this.game, this, "+" + amount + " HP"))
            this.health = Math.min(100, this.health + amount)
        }

        return this.health
    }

    boostSpeed(duration, percentage) {
        if (!this._isActive)
            return

        util.log("player " + (this.id + 1), "speed +" + percentage + "% for " + duration + " seconds")
        this.game.add.existing(new FadingText(this.game, this, "+" + percentage + "% speed\n(" + duration + " sec)"))

        this.speed = Math.round(this.defaultSpeed * (100 + percentage) / 100)
        this.game.time.events.add(Phaser.Timer.SECOND * duration,
            function () {
                util.log("player " + (this.id + 1), "speed back to normal")
                this.speed = this.defaultSpeed
                this._defaultTint()
            },
            this
        );
        this._speedTint()
    }

    boostDamage(duration, percentage) {
        if (!this._isActive)
            return

        util.log("player " + (this.id + 1), "damage +" + percentage + "% for " + duration + " seconds")
        this.game.add.existing(new FadingText(this.game, this, "+" + percentage + "% damage\n(" + duration + " sec)"))

        this._setDamagePercentage(100 + percentage)
        this.game.time.events.add(Phaser.Timer.SECOND * duration, function() {
                util.log("player " + (this.id + 1), "damage back to normal")
                this._setDamagePercentage(100)
                this._defaultTint()
            },
            this
        );
        this._damageTint()
    }

    /**
     * Apply the damage percentage to the weapons
     *
     * @param percentage Damage percentage
     * @private
     */
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
