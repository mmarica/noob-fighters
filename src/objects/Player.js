import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, id, type, x, y, keys, context }) {
        let data = game.cache.getJSON("players")[type]
        let orientation = id == 0 ? "right" : "left"

        super(game, x, y, type + "_player", data["sprite"][orientation]["frame"])

        this.health = 100
        this._isActive = false
        this.id = id
        this.type = type
        this.name = data["name"]
        this.orientation = orientation
        this.keys = keys
        this.data = data

        this.speed = data["physics"]["speed"]
        this.game.physics.arcade.enable(this)
        this.body.gravity.y = data["physics"]["gravity"];
        this.body.collideWorldBounds = true

        this.anchor.setTo(0.5)

        let leftAnimation = data["sprite"]["left"]["animation"]
        this.animations.add('left', this._getAnimationFrames(leftAnimation), leftAnimation['rate'], true)

        let rightAnimation = data["sprite"]["right"]["animation"]
        this.animations.add('right', this._getAnimationFrames(rightAnimation), rightAnimation['rate'], true)

        this.primaryWeaponSound = this.game.add.audio(type + "_primary_shoot");
        this.secondaryWeaponSound = this.game.add.audio(type + "_secondary_shoot");
        this.hitSound = this.game.add.audio(type + "_hurt");

        this.primaryWeapon = this._addPrimaryWeapon()
        this.secondaryWeapon = this._addSecondaryWeapon()

        this.firePrimaryIsPressed = false
        this.fireSecondaryIsPressed = false
        this.upIsPressed = false
        this.leftIsPressed = false
        this.rightIsPressed = false

        this.context = context
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
            case this.keys["fire_primary"]:
                if (!this.firePrimaryIsPressed) {
                    this.firePrimaryIsPressed = true;

                    if (this._isActive) {
                        this.primaryWeapon.fireAngle = this.orientation == 'left' ? Phaser.ANGLE_LEFT : Phaser.ANGLE_RIGHT

                        if (this.primaryWeapon.fire()) {
                            this.primaryWeaponSound.play()
                        }
                    }
                }

                break;

            case this.keys["fire_secondary"]:
                if (!this.fireSecondaryIsPressed) {
                    this.fireSecondaryIsPressed = true;

                    if (this._isActive) {
                        this.secondaryWeapon.fireAngle = this.orientation == 'left' ? 225 : -45

                        if (this.secondaryWeapon.fire()) {
                            this.secondaryWeaponSound.play()
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
            case this.keys["fire_primary"]:
                this.firePrimaryIsPressed = false;
                break;

            case this.keys["fire_secondary"]:
                this.fireSecondaryIsPressed = false;
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

    _addPrimaryWeapon () {
        let data = this.data["weapons"]["primary"];
        let weapon = this.game.add.weapon(data["max"], this.type + "_primary_bullet")

        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        weapon.bulletSpeed = data["speed"]
        weapon.fireRate = data["rate"]
        weapon.trackSprite(this, 0, 0)

        return weapon;
    }

    _addSecondaryWeapon () {
        let data = this.data["weapons"]["secondary"];
        let weapon = this.game.add.weapon(data["max"], this.type + "_secondary_bullet")
        weapon.bulletCollideWorldBounds = true

        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN
        weapon.bulletSpeed = data["speed"]
        weapon.bulletGravity.y = 500
        weapon.bulletLifespan = 1500
        weapon.bulletRotateToVelocity
        weapon.fireRate = data["rate"]
        weapon.trackSprite(this, 0, 0)

        weapon.onKill.add(this.secondaryExplode, this, weapon)

        return weapon;
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

    static loadAssets (game, type) {
        let data = game.cache.getJSON("players")[type]

        game.load.spritesheet(type + "_player" , "./assets/players/" + type + "/images/player.png", data["sprite"]["width"], data["sprite"]["height"])
        game.load.image(type + "_primary_bullet", "./assets/players/" + type + "/images/primary_bullet.png")
        game.load.image(type + "_secondary_bullet", "./assets/players/" + type + "/images/secondary_bullet.png")
        game.load.audio(type + "_primary_shoot", "./assets/players/" + type + "/sounds/primary_shoot.mp3");
        game.load.audio(type + "_secondary_shoot", "./assets/players/" + type + "/sounds/secondary_shoot.mp3");
        game.load.audio(type + "_hurt", "./assets/players/" + type + "/sounds/hurt.mp3");
    }

    secondaryExplode (bullet) {
        this.context.onSecondaryExplosion(bullet)
    }
}
