import Phaser from 'phaser'
import * as util from '../utils'

export default class extends Phaser.Sprite {
    /**
     * Constructor
     *
     * @param game Game object
     * @param type Type of power-up
     * @param x    Horizontal position
     * @param y    Vertical position
     */
    constructor (game, type, x, y) {
        super(game, x, y, "powerup_" + type)
        this.type = type

        this.anchor.setTo(0.5, 1)
        this.game.physics.arcade.enable(this)

        this.sounds = {
            appear: this.game.add.audio("powerup_appear"),
            disappear: this.game.add.audio("powerup_disappear"),
            take_health: this.game.add.audio("powerup_take_health"),
            take_speed: this.game.add.audio("powerup_take_speed"),
            take_damage: this.game.add.audio("powerup_take_damage"),
            take_trap: this.game.add.audio("powerup_take_trap"),
        }

        this.animations.add("default", null, 15, true)
        this.animations.play("default")
        this.sounds['appear'].play()
    }

    /**
     * Get powerup type
     *
     * @returns {string}
     */
    getType() {
        return this.type
    }

    /**
     * Disappear after the duration expired
     */
    expire() {
        this._disappear()
    }

    /**
     * Player took the powerup
     *
     * @param type Type of powerup
     */
    take(type) {
        this.sounds["take_" + type].play()
        this._disappear()
    }

    /**
     * Disappear sound and animation
     *
     * @private
     */
    _disappear() {
        this.sounds['disappear'].play()

        let disappear = this.game.add.sprite(this.body.x, this.body.y, "powerup_disappear")
        disappear.animations.add("poof", null, 15, false)

        let animation = disappear.animations.play("poof")
        animation.onComplete.add(function () {
            disappear.kill()
        }, disappear, this)
        this.kill()
    }
}
