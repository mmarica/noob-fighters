import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, id, type, x, y, keys }) {
        let orientation = id == 0 ? "right" : "left"
        let data = game.cache.getJSON("players")[type]

        super(game, x, y, data["sprite"]["asset"], data["sprite"][orientation]["frame"])

        this.keys = keys
        this.data = data
        this.health = 100
        this.speed = data["physics"]["speed"]

        this.id = id

        this.orientation = orientation
        this.anchor.setTo(0.5)

        this.game.physics.arcade.enable(this)

        this.body.gravity.y = this.data["physics"]["gravity"];
        this.body.collideWorldBounds = true

        this.animations.add('left', data["sprite"]["left"]["animation"], 10, true)
        this.animations.add('right', data["sprite"]["right"]["animation"], 10, true)

        this.weapon = this._addWeapon()

        this.weaponSound = this.game.add.audio(data["sfx"]["shoot"]);
        this.hitSound = this.game.add.audio(data["sfx"]["hurt"]);

        this.leftDown = false
        this.rightDown = false
    }

    create () {
    }

    update () {
        if (this.leftDown) {
            this.body.velocity.x = -(this.speed)
            this.animations.play('left')
            this.orientation = 'left'
        } else if (this.rightDown) {
            this.body.velocity.x = this.speed
            this.animations.play('right')
            this.orientation = 'right'
        } else {
            this.animations.stop();
            this.body.velocity.x = 0;
            this.frame = this.data["sprite"][this.orientation]["frame"]
        }
    }

    getWeapon () {
        return this.weapon
    }

    getHealth () {
        return this.health
    }

    decreaseHealth (amount) {
        this.health = Math.max(0, this.health - amount)
        return this.health
    }

    playHitSound () {
        this.hitSound.play()
    }

    keyDown(char) {
        if (char["code"] == this.keys["fire"]) {
            this.weapon.fireAngle = this.orientation == 'left' ? Phaser.ANGLE_LEFT : Phaser.ANGLE_RIGHT

            if (this.weapon.fire()) {
                this.weaponSound.play()
            }

            return true
        }

        if (char["code"] == this.keys["up"]) {
            if (this.body.touching.down) {
                this.body.velocity.y = -(this.data["physics"]["jump"]);
            }

            return true
        }

        if (char["code"] == this.keys["left"]) {
            this.leftDown = true
            return true
        }

        if (char["code"] == this.keys["right"]) {
            this.rightDown = true
            return true
        }

        return false
    }

    keyUp(char) {
        if (char["code"] == this.keys["left"]) {
            this.leftDown = false
            return true
        }

        if (char["code"] == this.keys["right"]) {
            this.rightDown = false
            return true
        }

        return false
    }

    _addWeapon () {
        let data = this.data["weapon"];
        let weapon = this.game.add.weapon(data["max"], data["asset"])

        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        weapon.bulletSpeed = data["speed"]
        weapon.fireRate = data["rate"]
        weapon.trackSprite(this, 0, 0)

        return weapon;
    }
}
