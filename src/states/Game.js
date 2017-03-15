import Phaser from 'phaser'
import Player from '../objects/Player'
import Cemetery from '../objects/Playground/Cemetery'
import Hud from '../objects/Hud'
import Powerup from '../objects/Powerup'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        // generate random players
        this.types = this._randomPlayerTypes()

        for (let type of this.types)
            Player.loadAssets(this.game, type)

        Cemetery.loadAssets(this.game)
        Powerup.loadAssets(this.game)

        let config = this.game.cache.getJSON("config")

        this.musicIsPressed = false
        
        this.powerupInterval = config["power-ups"]["appear"]["interval"]
        this.powerupIntervalVariation = config["power-ups"]["appear"]["interval_variation"]

        this.powerup = null
    }

    create () {
        this._addPlayGround()
        this._addPlayers()
        this._addHud()
        this._initKeys()
        this._activatePlayers()
        this.playGround.startMusic()
        this._startPowerupTimer()
    }

    update() {
        this.game.physics.arcade.collide(this.players[0], this.players[1]);

        for (let id = 0; id < 2; id++) {
            let primaryWeapon = this.players[id].getPrimaryWeapon()

            if (this.powerup != null)
                this.game.physics.arcade.overlap(this.players[id], this.powerup, this.takePowerup, null, this)


            this.game.physics.arcade.overlap([this.players[1 - id]], primaryWeapon.bullets, this.hitPlayer, null, this)

            for (let obstacle of this.obstacles)
                this.game.physics.arcade.overlap(obstacle, primaryWeapon.bullets, this.hitObstacle)

            for (let obstacle of this.obstacles)
                this.game.physics.arcade.collide(this.players[id], obstacle)

            let secondaryWeapon = this.players[id].getSecondaryWeapon()

            for (let obstacle of this.obstacles)
                this.game.physics.arcade.collide(obstacle, secondaryWeapon.bullets)
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

        let damage = this.players[1 - player.id].getPrimaryWeapon().getComputedDamage()
        this._hurtPlayer(player, damage)
    }

    takePowerup (player, powerup) {
        powerup.take(player)
    }

    hitObstacle (ledge, bullet) {
        bullet.kill()
    }

    _addPlayGround () {
        this.playGround = this.game.add.existing(
            new Cemetery({ game: this.game })
        )

        this.obstacles = this.playGround.getObstacles()
        this.powerupSpots = this.playGround.getPowerupSpots()
    }

    _addPlayers () {
        let config = this.game.cache.getJSON("config")
        let data = this.game.cache.getJSON("players")

        this.players = [
            this.game.add.existing(
                new Player({
                    game: this.game,
                    id: 0,
                    type: this.types[0],
                    x: 100,
                    y: this.world.height - data[this.types[0]]["sprite"]["height"] / 2 - 24,
                    keys: config["keys"]["p1"],
                    context: this
                })
            ),
            this.game.add.existing(
                new Player({
                    game: this.game,
                    id: 1,
                    type: this.types[1],
                    x: this.world.width - 100,
                    y: this.world.height - data[this.types[1]]["sprite"]["height"] / 2 - 24,
                    keys: config["keys"]["p2"],
                    context: this
                })
            ),
        ]
    }

    _addHud () {
        this.hud = this.game.add.existing(
            new Hud({
                game: this.game,
                p1: this.players[0].getName(),
                p1Health: this.players[0].getHealth(),
                p2: this.players[1].getName(),
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

    _randomPlayerTypes () {
        const possibleTypes = ['noobien', 'indiana_noobes', 'noobacca']

        let types = [possibleTypes[Math.round(Math.random() * (possibleTypes.length - 1))]]
        let type = null

        do {
            type = possibleTypes[Math.round(Math.random() * (possibleTypes.length - 1))]
        } while (type == types[0])

        types.push(type)
        return types
    }

    gameOver (id) {
        this.playGround.stopMusic()
        this.game.state.start("GameOver", true, false, this.players[id].type);
    }

    onSecondaryExplosion (x, y, damage, radius) {
        for (let player of this.players) {
            let distance = Math.round(this.game.physics.arcade.distanceToXY(player, x, y))

            if (distance < radius) {
                console.log("[secondary] hit: player " + (player.id + 1) + ", distance: " + distance)
                let playerDamage = Math.round(damage * (radius - distance) / radius)
                this._hurtPlayer(player, playerDamage)
            }
        }

    }

    _hurtPlayer (player, damage) {
        let health = player.hurt(damage)
        this.hud.updateHealth(player.id, health)

        if (health == 0) {
            this._deactivatePlayers()
            this.camera.fade('#000000');
            this.camera.onFadeComplete.addOnce(this.gameOver, this, 0, 1 - player.id);
        }
    }

    _addPowerup () {
        // if a power-up is already on the screen, abort
        if (this.powerup != null)
            return;

        // generate a random type
        let type = Powerup.getRandomType(false)

        // choose a spot as farthest from the players as possible
        let spots = []
        for (let spot of this.powerupSpots) {
            let distance1 = Math.round(this.game.physics.arcade.distanceToXY(this.players[0], spot.x, spot.y))
            let distance2 = Math.round(this.game.physics.arcade.distanceToXY(this.players[1], spot.x, spot.y))
            spots.push({
                distance: Math.min(distance1, distance2),
                x: spot.x,
                y: spot.y,
            })
        }
        spots.sort(function (x, y) {
            return x.distance < y.distance ? 1 : -1
        })

        let spot = spots[0]

        let x = new Powerup({
            game: this.game,
            type: type,
            x: spot.x,
            y: spot.y,
            onPowerupExpire: {
                object: this,
                method: this.onPowerupExpire,
            },
            onPowerupTakeHealth: {
                object: this,
                method: this.onPowerupTakeHealth,
            },
            onPowerupTakeSpeed: {
                object: this,
                method: this.onPowerupTakeSpeed,
            },
            onPowerupTakeDamage: {
                object: this,
                method: this.onPowerupTakeDamage,
            },
            onPowerupTakeTrap: {
                object: this,
                method: this.onPowerupTakeTrap,
            }
        })

        this.powerup = this.game.add.existing(x)
    }

    onPowerupExpire () {
        this._startPowerupTimer()
    }

    onPowerupTakeHealth (player, amount) {
        this._startPowerupTimer()
        let health = player.boostHealth(amount)
        this.hud.updateHealth(player.id, health)
    }

    onPowerupTakeSpeed (player, duration, percentage) {
        this._startPowerupTimer()
        player.boostSpeed(duration, percentage)
    }

    onPowerupTakeDamage (player, duration, percentage) {
        this._startPowerupTimer()
        player.boostDamage(duration, percentage)
    }

    onPowerupTakeTrap (player, amount) {
        this._startPowerupTimer()
        this._hurtPlayer(player, amount)
    }

    _startPowerupTimer () {
        this.powerup = null
        let seconds = this.powerupInterval + Math.round(Math.random() * this.powerupIntervalVariation)
        console.log("[power-up] next in " + seconds + " seconds")
        let event = this.game.time.events.add(Phaser.Timer.SECOND * seconds, this._addPowerup, this);
    }
}
