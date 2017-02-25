import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, id, x, y, asset, keys, orientation, animations }) {
        super(game, x, y, asset, orientation == 'left' ? 0 : animations['right_still'])

        this.rightStillFrame = animations['right_still']

        this.id = id

        this.orientation = orientation
        this.anchor.setTo(0.5)

        this.game.physics.arcade.enable(this)

        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;

        this.animations.add('left', animations['left'], 10, true);
        this.animations.add('right', animations['right'], 10, true);

        this.keys = this.game.input.keyboard.addKeys(keys);

        this.weapon = this._addWeapon()

        this.blaster = this.game.add.audio('blaster');
    }

    create () {
    }

    update () {
        if (this.keys.left.isDown)
        {
            this.body.velocity.x = -150;
            this.animations.play('left');
            this.orientation = 'left'
        }
        else if (this.keys.right.isDown)
        {
            this.body.velocity.x = 150;
            this.animations.play('right');
            this.orientation = 'right'
        }
        else
        {
            this.animations.stop();
            this.body.velocity.x = 0;
            this.frame = this.orientation == 'left' ? 0 : this.rightStillFrame
        }

        if (this.keys.fire.isDown)
        {
            this.weapon.fireAngle = this.orientation == 'left' ? Phaser.ANGLE_LEFT : Phaser.ANGLE_RIGHT
            if (this.weapon.fire()) {
                this.blaster.play()
            }
        }

        if (this.keys.up.isDown && this.body.touching.down)
        {
            this.body.velocity.y = -350;
        }
    }

    getWeapon () {
        return this.weapon
    }
}
