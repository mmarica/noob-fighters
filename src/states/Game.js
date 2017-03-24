import AbstractState from './Abstract'
import Phaser from 'phaser'
import Player from '../objects/Player'
import Cemetery from '../objects/Playground/Cemetery'
import Forest from '../objects/Playground/Forest'
import Hud from '../objects/Hud'
import Powerup from '../objects/Powerup'
import FadingText from '../objects/FadingText'
import Keyboard from '../objects/Keyboard'
import * as util from '../utils'

export default class extends AbstractState {
    init (types, map) {
        this.types = types
        this.map = map
    }

    preload () {
        this._addPreloadProgressBar()

        for (let type of this.types)
            Player.loadAssets(this.game, type)

        switch (this.map) {
            case "cemetery":
                Cemetery.loadAssets(this.game)
                break;

            case "forest":
                Forest.loadAssets(this.game)
                break;
        }

        Powerup.loadAssets(this.game)

        let config = this.game.cache.getJSON("config")

        this.keys = config["keys"]

        this.powerupInterval = config["power-ups"]["appear"]["interval"]
        this.powerupIntervalVariation = config["power-ups"]["appear"]["interval_variation"]
        this.powerup = null
    }

    create () {
        this._addPlayGround()
        this._addPlayers()
        this._addHud()
        this._initKeyboard()
        this._activatePlayers()
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
            for (let player of this.players)
                this.game.physics.arcade.collide(player, secondaryWeapon.bullets)

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
        switch (this.map) {
            case "cemetery":
                this.playGround = this.game.add.existing(
                    new Cemetery({ game: this.game })
                )
                break;

            case "forest":
                this.playGround = this.game.add.existing(
                    new Forest({ game: this.game })
                )
                break;
        }

        this.obstacles = this.playGround.getObstacles()
        this.powerupSpots = this.playGround.getPowerupSpots()
        this.playGround.startMusic()
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

    _initKeyboard () {
        this.keyboard = new Keyboard({
            game: game,
            onKeyDown: {
                object: this,
                method: this._onKeyDown,
            },
            onKeyUp: {
                object: this,
                method: this._onKeyUp,
            },
        })
    }

    _onKeyDown (char) {
        for (let id in this.players) {
            let pid = "p" + (1 * id + 1)
            let keys = this.keys[pid]

            switch (char["code"]) {
                case keys["fire_primary"]:
                    this.players[id].firePrimary()
                    break;

                case keys["fire_secondary"]:
                    this.players[id].fireSecondary()
                    break;

                case keys["up"]:
                    this.players[id].jump()
                    break;

                case keys["left"]:
                    this.players[id].startLeft()
                    break;

                case keys["right"]:
                    this.players[id].startRight()
                    break;
            }
        }
    }

    _onKeyUp (char) {
        for (let id in this.players) {
            let pid = "p" + (1 * id + 1)
            let keys = this.keys[pid]

            switch (char["code"]) {
                case keys["left"]:
                    this.players[id].stopLeft()
                    break;

                case keys["right"]:
                    this.players[id].stopRight()
                    break;
            }
        }
    }

    gameOver (id) {
        this.playGround.stopMusic()
        this.game.sound.stopAll()
        this.game.state.start("GameOver", true, false, id, this.players[id].type);
    }

    onSecondaryExplosion (x, y, damage, radius) {
        for (let player of this.players) {
            let distance = Math.round(this.game.physics.arcade.distanceToXY(player, x, y))

            if (distance < radius) {
                console.log("[secondary] hit: player " + (player.id + 1) + ", distance: " + distance)
                let playerDamage = Math.round(damage * (radius - distance) / radius)
                playerDamage = Math.max(1, playerDamage)
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

        this.game.add.existing(new FadingText({
            game: this.game,
            player: player,
            text: "-" + damage + " HP"
        }))
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

        this.game.add.existing(new FadingText({
            game: this.game,
            player: player,
            text: "+" + amount + " HP"
        }))
    }

    onPowerupTakeSpeed (player, duration, percentage) {
        this._startPowerupTimer()
        player.boostSpeed(duration, percentage)

        this.game.add.existing(new FadingText({
            game: this.game,
            player: player,
            text: "+" + percentage + "% speed"
        }))
    }

    onPowerupTakeDamage (player, duration, percentage) {
        this._startPowerupTimer()
        player.boostDamage(duration, percentage)

        this.game.add.existing(new FadingText({
            game: this.game,
            player: player,
            text: "+" + percentage + "% damage"
        }))
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
