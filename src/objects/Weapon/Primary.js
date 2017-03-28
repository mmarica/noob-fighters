import Phaser from 'phaser'

export default class extends Phaser.Weapon {

    constructor ({ game, data, player }) {
        super(game, game.world)
        this.player = player
        this.damagePercentage = 100;

        this.createBullets(data["max"], player.type + "_primary_bullet")
        this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        this.bulletSpeed = data["speed"]
        this.fireRate = data["rate"]
        this.damage = data["damage"]

        this.shootSound = this.game.add.audio(player.type + "_primary_shoot");
        this.trackSprite(player)
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

    getComputedDamage () {
        return Math.round(this.damage * this.damagePercentage / 100)
    }
}
