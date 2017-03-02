/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../objects/Player'
import Cemetery from '../objects/Playground/Cemetery'
import Hud from '../objects/Hud'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        Player.loadAssets(this.game, 'noobien')
        Player.loadAssets(this.game, 'noobacca')
        Cemetery.loadAssets(this.game)
    }

    create () {
        this._addPlayGround()
        this._addPlayers()
        this._addHud()
        this._initKeys()
        this._activatePlayers()
    }

    update() {
        this.game.physics.arcade.collide(this.players[0], this.players[1]);

        for (let id = 0; id < 2; id++) {
            let weapon = this.players[id].getWeapon();

            this.game.physics.arcade.overlap([this.players[1 - id]], weapon.bullets, this.hitPlayer, null, this);

            for (let obstacle of this.obstacles)
                this.game.physics.arcade.overlap(obstacle, weapon.bullets, this.hitObstacle);

            for (let obstacle of this.obstacles)
                this.game.physics.arcade.collide(this.players[id], obstacle);
        }
    }

    _activatePlayers () {
        for (let player of this.players) {
            player.activate()
        }
    }

    _deactivatePlayers () {
        for (let player of this.players) {
            player.deactivate()
        }
    }

    hitPlayer (player, bullet) {
        bullet.kill()
        player.playHitSound()

        let health = player.decreaseHealth(10)
        this.hud.updateHealth(player.id, health)

        if (health == 0) {
            this.module.onStop = function() {}
            this.module.stop()
            this._deactivatePlayers()
        }
    }

    hitObstacle (ledge, bullet) {
        bullet.kill()
    }

    _addPlayGround () {
        this.playGround = this.game.add.existing(
            new Cemetery({ game: this.game })
        )

        this.obstacles = this.playGround.getObstacles()
        this.playGround.startMusic()
    }

    _addPlayers () {
        let config = this.game.cache.getJSON("config")

        this.players = [
            this.game.add.existing(
                new Player({
                    game: this.game,
                    id: 0,
                    type: 'noobien',
                    x: 100,
                    y: this.world.height - 42/2 - 24,
                    keys: config["keys"]["p1"]
                })
            ),
            this.game.add.existing(
                new Player({
                    game: this.game,
                    id: 1,
                    type: 'noobacca',
                    x: this.world.width - 100,
                    y: this.world.height - 64/2 - 24,
                    keys: config["keys"]["p2"]
                })
            ),
        ]
    }

    _addHud () {
        this.hud = this.game.add.existing(
            new Hud({
                game: this.game,
                p1: 'Noobien',
                p1Health: this.players[0].getHealth(),
                p2: 'Noobacca',
                p2Health: this.players[1].getHealth(),
            })
        )
    }

    _initKeys () {
        // capture all letter, arrow and control keys, just to be sure
        this.game.input.keyboard.addKeyCapture([
            Phaser.KeyCode.Q, Phaser.KeyCode.W, Phaser.KeyCode.E, Phaser.KeyCode.R, Phaser.KeyCode.T, Phaser.KeyCode.Y, Phaser.KeyCode.U, Phaser.KeyCode.I, Phaser.KeyCode.O, Phaser.KeyCode.P,
            Phaser.KeyCode.A, Phaser.KeyCode.S, Phaser.KeyCode.D, Phaser.KeyCode.F, Phaser.KeyCode.G, Phaser.KeyCode.H, Phaser.KeyCode.J, Phaser.KeyCode.K, Phaser.KeyCode.L,
            Phaser.KeyCode.Z, Phaser.KeyCode.X, Phaser.KeyCode.C, Phaser.KeyCode.V, Phaser.KeyCode.B, Phaser.KeyCode.N, Phaser.KeyCode.M,
            Phaser.KeyCode.UP, Phaser.KeyCode.DOWN, Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT,
            Phaser.KeyCode.CONTROL,  Phaser.KeyCode.ALT, Phaser.KeyCode.SHIFT,
        ])

        this.game.input.keyboard.addCallbacks(this, this._keyDown, this._keyUp);
    }

    _keyDown (char) {
        for (let player of this.players)
            player.keyDown(char)
    }

    _keyUp (char) {
        for (let player of this.players)
            player.keyUp(char)
    }
}
