import Phaser from 'phaser'
import * as util from '../../utils'

export default class extends Phaser.Weapon {
    /**
     * Constructor
     *
     * @param game       Game object
     * @param data       Weapon data from players.json
     * @param playerType Player type
     * @param onExplode  Callback for explode event
     */
    constructor(game, data, playerType, onExplode) {
        super(game, game.world)
        this.data = data
        this.playerType = playerType
        this.onExplode = onExplode

        this._initialize()
        this._addSounds()
    }

    /**
     * Set damage percentage
     *
     * @param percentage Damage percentage
     */
    setDamagePercentage(percentage) {
        this.damagePercentage = percentage
    }

    /**
     * Fire the weapon
     *
     * @param orientation Player orientation: left or right
     */
    fire(orientation) {
        this.fireAngle = orientation == 'left' ? 225 : -45

        if (super.fire())
            this.shootSound.play()
    }

    /**
     * Initialize weapon
     *
     * @private
     */
    _initialize() {
        let data = this.data

        this.damagePercentage = 100;
        this.createBullets(data["max"], this.playerType + "_secondary_bullet")

        this.bulletSpeed = data["speed"]
        this.bulletGravity.y = data["gravity"]
        this.bulletLifespan = data["duration"]
        this.fireRate = data["rate"]
        this.damage = data["damage"]
        this.radius = data["radius"]

        this.bulletCollideWorldBounds = true
        this.bulletKillType = Phaser.Weapon.KILL_LIFESPAN

        // add explosion event handler
        this.onKill.add(this._onExplode, this)
    }

    /**
     * Add shoot and explosion sounds
     *
     * @private
     */
    _addSounds() {
        this.shootSound = this.game.add.audio(this.playerType + "_secondary_shoot");
        this.explosionSound = this.game.add.audio(this.playerType + "_secondary_explode");
    }

    /**
     * Explode event handler
     *
     * @param bullet The bullet object
     * @private
     */
    _onExplode(bullet) {
        let x = Math.round(bullet.body.x + bullet.body.width / 2)
        let y = Math.round(bullet.body.y + bullet.body.height / 2)
        let damage = Math.round(this.damage * this.damagePercentage / 100)
        let radius = this.radius

        util.log("secondary", "exploded at x: " + x + ", y: " + y + ", damage: " + damage + ", radius: " + radius)

        // play explosion sound
        this.explosionSound.play()

        // add explosion animation
        let sprite = this.game.add.sprite(x, y, this.playerType + "_secondary_explosion")
        sprite.animations.add("explode", null, this.data["sprite"]["animation"]["rate"], false)
        sprite.anchor.setTo(0.5, 0.5)
        let exp = sprite.animations.play("explode")
        exp.onComplete.add(function () {
            sprite.kill()
        }, sprite)

        // execute callback for explosion event
        let callback = this.onExplode.method.bind(this.onExplode.object)
        callback(x, y, damage, radius)
    }
}
