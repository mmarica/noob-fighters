/* globals __DEV__ */
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

        this.musicKey = this.game.cache.getJSON("config")["keys"]["music"]
        this.musicIsPressed = false
        
        this.explosionSound = this.game.add.audio("explosion");

        this.powerup = null
    }

    create () {
        this._addPlayGround()
        this._addPlayers()
        this._addHud()
        this._initKeys()
        this._activatePlayers()
        if (!__DEV__) this.playGround.startMusic()
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
        this._hurtPlayer(player, 10)
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
        if (char["code"] == this.musicKey)
            if (!this.musicPressed) {
                this.musicPressed = true
                this.playGround.toggleMusic()
            }

        for (let player of this.players)
            player.keyDown(char)
    }

    _keyUp (char) {
        if (char["code"] == this.musicKey)
            this.musicPressed = false

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

    onSecondaryExplosion (bullet) {
        const radius = 130
        const damage = 25

        let explosion = this.game.add.sprite(bullet.body.x,bullet.body.y,"explosion")
        explosion.animations.add("explode", null ,50,false)
        explosion.anchor.setTo(0.5,0.5)
        let exp = explosion.animations.play("explode")
        exp.onComplete.add(function () {
            explosion.kill()
        }, explosion)
        this.explosionSound.play()

        for (let player of this.players) {
            let distance = this.game.physics.arcade.distanceBetween(bullet, player)

            if (distance < radius)
                this._hurtPlayer(player, Math.round(damage * (radius - distance) / radius))
        }

    }

    _hurtPlayer (player, damage) {
        player.playHitSound()

        let health = player.decreaseHealth(damage)
        this.hud.updateHealth(player.id, health)

        if (health == 0) {
            this._deactivatePlayers()
            this.camera.fade('#000000');
            this.camera.onFadeComplete.addOnce(this.gameOver, this, 0, 1 - player.id);
        }
    }

    _addPowerup () {
        if (this.powerup != null)
            return;

        let type = Powerup.getRandomType(false)

        let spot = this.powerupSpots[Math.round(Math.random() * (this.powerupSpots.length - 1))]

        let x = new Powerup({
            game: this.game,
            type: type,
            x: spot.x,
            y: spot.y,
            context: this
        })


        this.powerup = this.game.add.existing(x)
        this.powerup = this.game.add.existing(x)
    }

    onPowerupExpire () {
        this._startPowerupTimer()
    }

    onPowerupTakeHealth (player) {
        this._startPowerupTimer()

        let health = player.increaseHealth(20)
        this.hud.updateHealth(player.id, health)
    }

    onPowerupTakeSpeed (player) {
        this._startPowerupTimer()

        let amount = Math.round(player.speed * 1.3);
        player.speed += amount

        let event = this.game.time.events.add(Phaser.Timer.SECOND * 10, this.decreasePlayerSpeed, this, player, amount);
    }

    decreasePlayerSpeed (player, amount) {
        this._startPowerupTimer()
        player.speed -= amount
    }

    onPowerupTakeDamage (player) {
        this._startPowerupTimer()
        console.log('Not implemented!')
    }

    onPowerupTakeTrap (player) {
        this._startPowerupTimer()
        this._hurtPlayer(player, 20)
    }

    _startPowerupTimer () {
        this.powerup = null
        let seconds = 10 + Math.round(Math.random() * 10)
        console.log("[power-up] next in " + seconds + " seconds")
        let event = this.game.time.events.add(Phaser.Timer.SECOND * seconds, this._addPowerup, this);
    }
}
