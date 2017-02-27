/* globals __DEV__ */
import Phaser from 'phaser'
import Noobacca from '../players/Noobacca'
import Alien from '../players/Alien'
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
        const step = 130

        this.ledges = [
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 0,
                    y: height - step,
                    length: 3
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.world.width - 64 * 4 - 24,
                    y: height - step,
                    length: 3
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 310,
                    y: height - 2 * step,
                    length: 10
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: 0,
                    y: height - 3 * step,
                    length: 2
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.world.width - 64 * 12,
                    y: height - 3 * step,
                    length: 3
                })
            ),
            this.game.add.existing(
                new Ledge({
                    game: this.game,
                    x: this.world.width - 64 * 4 + 30,
                    y: height - 3 * step,
                    length: 2
                })
            ),
        ]

        this.players = [
            this.game.add.existing(
                new Alien({
                    game: this.game,
                    id: 0,
                    x: 100,
                    y: this.world.height - 48 - 24,
                    keys: {
                        'up': Phaser.KeyCode.R,
                        'down': Phaser.KeyCode.F,
                        'left': Phaser.KeyCode.D,
                        'right': Phaser.KeyCode.G,
                        'fire': Phaser.KeyCode.Q
                    },
                    orientation: 'right',
                })
            ),
            this.game.add.existing(
                new Noobacca({
                    game: this.game,
                    id: 1,
                    x: this.world.width - 100,
                    y: this.world.height - 64 - 24,
                    keys: {
                        'up': Phaser.KeyCode.UP,
                        'down': Phaser.KeyCode.DOWN,
                        'left': Phaser.KeyCode.LEFT,
                        'right': Phaser.KeyCode.RIGHT,
                        'fire': Phaser.KeyCode.CLOSED_BRACKET
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
