import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, x, y, keys, orientation }) {
        super(game, x, y, 'dude', 4)

        this.orientation = orientation
        this.anchor.setTo(0.5)

        this.game.physics.arcade.enable(this)

        this.body.bounce.y = 0.2;
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;

        this.animations.add('left', [0, 1, 2, 3], 10, true);
        this.animations.add('right', [5, 6, 7, 8], 10, true);
        this.setOrientationFrame()

        this.keys = this.game.input.keyboard.addKeys(keys);
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
            this.setOrientationFrame()
        }

        if (this.keys.up.isDown) //&& this.players[0].body.touching.down
        {
            this.body.velocity.y = -350;
        }
    }

    setOrientationFrame () {
        this.frame = this.orientation == 'left' ? 0 : 5
    }

}
