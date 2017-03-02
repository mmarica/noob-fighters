import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, id, type, x, y, keys }) {
        let data = game.cache.getJSON("players")[type]
        let orientation = id == 0 ? "right" : "left"

        super(game, x, y, data["sprite"]["asset"], data["sprite"][orientation]["frame"])

        this.health = 100
        this._isActive = false
        this.id = id
        this.orientation = orientation
        this.keys = keys
        this.data = data

        this.speed = data["physics"]["speed"]
        this.game.physics.arcade.enable(this)
        this.body.gravity.y = data["physics"]["gravity"];
        this.body.collideWorldBounds = true

        this.anchor.setTo(0.5)
        this.animations.add('left', data["sprite"]["left"]["animation"], 10, true)
        this.animations.add('right', data["sprite"]["right"]["animation"], 10, true)

        this.weaponSound = this.game.add.audio(data["sfx"]["shoot"]);
        this.hitSound = this.game.add.audio(data["sfx"]["hurt"]);

        this.weapon = this._addWeapon()

        this.fireIsPressed = false
        this.upIsPressed = false
        this.leftIsPressed = false
        this.rightIsPressed = false
    }

    create () {
    }

    update () {
        if (this.leftIsPressed) {
            if (this._isActive) {
                this.body.velocity.x = -(this.speed)
                this.animations.play('left')
                this.orientation = 'left'
            }
        } else if (this.rightIsPressed) {
            if (this._isActive) {
                this.body.velocity.x = this.speed
                this.animations.play('right')
                this.orientation = 'right'
            }
        } else {
            this.animations.stop();
            this.body.velocity.x = 0;
            this.frame = this.data["sprite"][this.orientation]["frame"]
        }
    }

    activate () {
        this._isActive = true
    }

    deactivate () {
        this._isActive = false
    }

    getWeapon () {
        return this.weapon
    }

    getHealth () {
        return this.health
    }

    decreaseHealth (amount) {
        if (this._isActive)
            this.health = Math.max(0, this.health - amount)

        return this.health
    }

    playHitSound () {
        this.hitSound.play()
    }

    keyDown(char) {
        switch (char["code"]) {
            case this.keys["fire"]:
                if (!this.fireIsPressed) {
                    this.fireIsPressed = true;

                    if (this._isActive) {
                        this.weapon.fireAngle = this.orientation == 'left' ? Phaser.ANGLE_LEFT : Phaser.ANGLE_RIGHT

                        if (this.weapon.fire()) {
                            this.weaponSound.play()
                        }
                    }
                }

                break;

            case this.keys["up"]:
                if (!this.upIsPressed) {
                    this.upIsPressed = true;

                    if (this._isActive && this.body.touching.down) {
                        this.body.velocity.y = -(this.data["physics"]["jump"]);
                    }
                }
                break;

            case this.keys["left"]:
                this.leftIsPressed = true
                break;

            case this.keys["right"]:
                this.rightIsPressed = true
                break;
        }
    }

    keyUp(char) {
        switch (char["code"]) {
            case this.keys["fire"]:
                this.fireIsPressed = false;
                break;

            case this.keys["up"]:
                this.upIsPressed = false;
                break;

            case this.keys["left"]:
                this.leftIsPressed = false
                break;

            case this.keys["right"]:
                this.rightIsPressed = false
                break;
        }
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