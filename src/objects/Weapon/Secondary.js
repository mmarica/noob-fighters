import Phaser from 'phaser'
import * as util from '../../utils'

export default class extends Phaser.Weapon {

    constructor ({ game, data, player, onExplode }) {
        super(game, game.world)
        this.player = player
        this.onExplode = onExplode
        this.damagePercentage = 100;

        this.createBullets(data["max"], player.type + "_secondary_bullet")
        this.bulletCollideWorldBounds = true
        this.bulletKillType = Phaser.Weapon.KILL_LIFESPAN

        this.bulletSpeed = data["speed"]
        this.bulletGravity.y = data["gravity"]
        this.bulletLifespan = data["duration"]
        this.fireRate = data["rate"]
        this.damage = data["damage"]
        this.radius = data["radius"]

        this.shootSound = this.game.add.audio(player.type + "_secondary_shoot");
        this.explosionSound = this.game.add.audio(player.type + "_secondary_explode");
        this.explosionAnimationRate = data["sprite"]["animation"]["rate"]

        this.trackSprite(player)
        this.onKill.add(this._onExplode, this)
    }

    fire (angle) {
        this.fireAngle = angle

        if (super.fire()) {
            this.shootSound.play()
        }
    }

    setDamagePercentage (percentage) {
        this.damagePercentage = percentage
    }

    _onExplode (bullet) {
        let x = Math.round(bullet.body.x)
        let y = Math.round(bullet.body.y)
        let damage = Math.round(this.damage * this.damagePercentage / 100)
        let radius = this.radius

        util.log("secondary", "exploded at x: " + x + ", y: " + y + ", damage: " + damage + ", radius: " + radius)

        let sprite = this.game.add.sprite(x, y, this.player.type + "_secondary_explosion")
        sprite.animations.add("explode", null, this.explosionAnimationRate, false)
        sprite.anchor.setTo(0.5,0.5)

        this.explosionSound.play()
        let exp = sprite.animations.play("explode")
        exp.onComplete.add(function () {
            sprite.kill()
        }, sprite)

        let callback = this.onExplode.method.bind(this.onExplode.object)
        callback(x, y, damage, radius)
    }
}
