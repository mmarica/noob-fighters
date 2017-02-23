/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Ground from '../sprites/Ground'
import Ledge from '../sprites/Ledge'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        game.add.sprite(0, 0, 'bg')

        this.ground = this.game.add.existing(
            new Ground({
                game: this.game
            })
        )

        this.ledges = [
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 200,
                    y: 580,
                    length: 5
                })
            )
        ]

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
        for (let player of this.players) {
            this.game.physics.arcade.collide(player, this.ground);

            for (let ledge of this.ledges)
                this.game.physics.arcade.collide(player, ledge);
        }
    }

    addBanner () {
        const bannerText = 'Noob Fighters'
        let banner = this.add.text(this.world.centerX, 40, bannerText)
        banner.font = 'Bangers'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#00c6ff'
        banner.smoothed = true
        banner.anchor.setTo(0.5)
    }
}
