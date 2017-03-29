import Phaser from 'phaser'

export default class extends Phaser.Weapon {
    /**
     * Constructor
     *
     * @param game       Game object
     * @param data       Weapon data from players.json
     * @param playerType Player type
     */
    constructor (game, data, playerType) {
        super(game, game.world)

        this.damagePercentage = 100;

        this.createBullets(data["max"], playerType + "_primary_bullet")
        this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        this.bulletSpeed = data["speed"]
        this.fireRate = data["rate"]
        this.damage = data["damage"]

        this.shootSound = this.game.add.audio(playerType + "_primary_shoot");
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
        this.fireAngle = orientation == 'left' ? Phaser.ANGLE_LEFT : Phaser.ANGLE_RIGHT

        if (super.fire())
            this.shootSound.play()
    }

    /**
     * Get the weapon damage with the damage percentage applied to it
     *
     * @returns {number}
     */
    getComputedDamage() {
        return Math.round(this.damage * this.damagePercentage / 100)
    }
}
