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
        this.hit = this.game.add.audio('hit');

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
                    id: 0,
                    x: 100,
                    y: this.world.height - 48 - 24,
                    keys: {
                        'up': Phaser.KeyCode.W,
                        'down': Phaser.KeyCode.S,
                        'left': Phaser.KeyCode.A,
                        'right': Phaser.KeyCode.D,
                        'fire': Phaser.KeyCode.B
                    },
                    orientation: 'right',
                })
            ),
            this.game.add.existing(
                new Player({
                    game: this.game,
                    x: this.world.width - 100,
                    y: this.world.height - 48 - 24,
                    id: 1,
                    keys: {
                        'up': Phaser.KeyCode.UP,
                        'down': Phaser.KeyCode.DOWN,
                        'left': Phaser.KeyCode.LEFT,
                        'right': Phaser.KeyCode.RIGHT,
                        'fire': Phaser.KeyCode.BACKWARD_SLASH
                    },
                    orientation: 'left',
                })
            ),
        ]

        this.weapons = []
        for (let i = 0; i < 2; i++) {
            this.weapons.push(this.players[i].getWeapon())
        }

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

        this.game.physics.arcade.overlap(this.weapons[1].bullets, [this.players[0]], this.hitPlayer, null, this);
        this.game.physics.arcade.overlap(this.weapons[0].bullets, [this.players[1]], this.hitPlayer, null, this);

        for (let player of this.players) {
            this.game.physics.arcade.collide(player, this.ground);

            for (let ledge of this.ledges)
                this.game.physics.arcade.collide(player, ledge);
        }
    }

    hitPlayer (player, bullet) {
        bullet.kill()
        this.hit.play()
        this.hud.decreaseHealth(player.id, 10)
    }
}
