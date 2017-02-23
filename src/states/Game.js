/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Ground from '../sprites/Ground'
import Ledge from '../sprites/Ledge'
import Hud from '../objects/Hud'

export default class extends Phaser.State {
    init () {}

    preload () {}

    create () {
        this.game.add.sprite(0, 0, 'bg')

        this.ground = this.game.add.existing(
            new Ground({ game: this.game })
        )

        let height = 752
        const step = 160

        this.ledges = [
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 0,
                    y: height - step,
                    length: 1
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.world.width - 128 * 3,
                    y: height - step,
                    length: 1
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 200,
                    y: height - 2 * step,
                    length: 5
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 0,
                    y: height - 3 * step,
                    length: 0
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.world.width - 128 * 6,
                    y: height - 3 * step,
                    length: 0
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.world.width - 128 * 2,
                    y: height - 3 * step,
                    length: 0
                })
            ),
        ]

        this.players = [
            this.game.add.existing(
                new Player({
                    game: this.game,
                    x: 100,
                    y: this.world.height - 48 - 24,
                    keys: { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D },
                    orientation: 'right',
                })
            ),
            this.game.add.existing(
                new Player({
                    game: this.game,
                    x: this.world.width - 100,
                    y: this.world.height - 48 - 24,
                    keys: { 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT },
                    orientation: 'left',
                })
            ),
        ]

        this.hud = this.game.add.existing(
            new Hud({
                game: this.game,
                p1: 'Noobacca',
                p2: 'Jean-Noob Piccard',
            })
        )
    }

    update() {
        this.game.physics.arcade.collide(this.players[0], this.players[1]);

        for (let player of this.players) {
            this.game.physics.arcade.collide(player, this.ground);

            for (let ledge of this.ledges)
                this.game.physics.arcade.collide(player, ledge);
        }
    }
}
