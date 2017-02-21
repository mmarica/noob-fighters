/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        game.add.sprite(0, 0, 'bg')
        this.addGround()

        this.players = [
            this.game.add.existing(
                new Player({
                    game: this.game,
                    x: 100,
                    y: this.world.centerY,
                    keys: { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D },
                    orientation: 'right',
                })
            ),
            this.game.add.existing(
                new Player({
                    game: this.game,
                    x: this.world.width - 100,
                    y: this.world.centerY,
                    keys: { 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT },
                    orientation: 'left',
                })
            )
        ]

        this.addBanner()
    }

    update() {
        for (var player of this.players) {
            this.game.physics.arcade.collide(player, this.ground);
        }
    }

    addBanner () {
        const bannerText = 'Noob Fighters'
        let banner = this.add.text(this.world.centerX, 40, bannerText)
        banner.font = 'Bangers'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#00c6ff'
        banner.smoothed = false
        banner.anchor.setTo(0.5)
    }

    addGround ()
    {
        this.ground = this.game.add.tileSprite(0, this.world.height - 48, 1280, 48, 'ground')
        this.game.physics.arcade.enable(this.ground)
        this.ground.body.immovable = true
    }
}
