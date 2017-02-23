import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, id, x, y, keys, orientation }) {
        super(game, x, y, 'dude', orientation == 'left' ? 0 : 5)

        this.id = id

        this.orientation = orientation
        this.anchor.setTo(0.5)

        this.game.physics.arcade.enable(this)

        this.body.bounce.y = 0.2;
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;

        this.animations.add('left', [0, 1, 2, 3], 10, true);
        this.animations.add('right', [5, 6, 7, 8], 10, true);

        this.keys = this.game.input.keyboard.addKeys(keys);

        this.weapon = this.game.add.weapon(5, 'bullet')
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        this.weapon.bulletSpeed = 400
        this.weapon.fireRate = 1000
        this.weapon.trackSprite(this, 0, 0);

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
            this.frame = this.orientation == 'left' ? 0 : 5
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
