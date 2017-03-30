import AbstractState from './Abstract'
import AssetLoader from '../objects/AssetLoader'
import PlaygroundManager from '../objects/PlaygroundManager'
import Player from '../objects/Player'
import Hud from '../objects/Hud'
import PowerupManager from '../objects/PowerupManager'
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
            AssetLoader.loadPlayer(type)

        AssetLoader.loadPlayground(this.map)
        AssetLoader.loadPowerups()

        let config = this.game.cache.getJSON("config")

        this.keys = config["keys"]

        this.powerupInterval = config["power-ups"]["appear"]["interval"]
        this.powerupIntervalVariation = config["power-ups"]["appear"]["interval_variation"]
        this.powerup = null
    }

    create () {
        this._addPlayGround()
        this._addPlayers()
        this._addPowerups()
        this._addHud()
        this._initKeyboard()
        this._activatePlayers()
    }

    _addPowerups() {
        this.powerupManager = new PowerupManager(this.game, this.players, this.playGround.getPowerupSpots())
        this.powerupManager.onTake.add(this._onTakePowerup, this)
    }

    update() {
        this.game.physics.arcade.collide(this.players[0], this.players[1]);

        for (let id = 0; id < 2; id++) {
            let primaryWeapon = this.players[id].getPrimaryWeapon()

            this.powerupManager.checkPlayersOverlapping()

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

        for (let player of this.players)
            if (player.getHealth() == 0) {
                this._deactivatePlayers()
                this.camera.fade('#000000');
                this.camera.onFadeComplete.addOnce(
                    this.gameOver, this, 0,
                    this.players[0].getName(), this.players[0].getHealth(),
                    this.players[1].getName(), this.players[1].getHealth()
                );

                break
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
        this.hud.updateHealth(player.id, player.hurt(damage))
    }

    hitObstacle (ledge, bullet) {
        bullet.kill()
    }

    _addPlayGround () {
        let manager = new PlaygroundManager(this.game)
        this.playGround = this.game.add.existing(manager.create(this.map))
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

    /**
     * Add the HUD
     *
     * @private
     */
    _addHud() {
        this.hud = this.game.add.existing(
            new Hud(this.game,
                this.players[0].getName(), this.players[0].getHealth(),
                this.players[1].getName(), this.players[1].getHealth()
            )
        )
    }

    _initKeyboard () {
        this.keyboard = new Keyboard(this.game)
        this.keyboard.onDown.add(this._onKeyDown, this)
        this.keyboard.onUp.add(this._onKeyUp, this)
    }

    /**
     * Handler for key down event
     *
     * @param char The key
     * @private
     */
    _onKeyDown(char) {
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

    /**
     * Handler for key up event
     *
     * @param char The key
     * @private
     */
    _onKeyUp(char) {
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

    gameOver(p1Name, p1Health, p2Name, p2Health) {
        this.game.sound.stopAll()
        this.game.state.start("GameOver", true, false, p1Name, p1Health, p2Name, p2Health);
    }

    onSecondaryExplosion (x, y, damage, radius) {
        for (let player of this.players) {
            let distance = Math.round(this.game.physics.arcade.distanceToXY(player, x, y))

            if (distance < radius) {
                util.log("secondary", "hit: player " + (player.id + 1) + ", distance: " + distance)
                let playerDamage = Math.round(damage * (radius - distance) / radius)
                playerDamage = Math.max(1, playerDamage)
                this.hud.updateHealth(player.id, player.hurt(playerDamage))
            }
        }
    }

    _onTakePowerup(player, type, config) {
        switch (type) {
            case "health":
                this.hud.updateHealth(player.id, player.boostHealth(config["amount"]))
                break

            case "speed":
                player.boostSpeed(config["duration"], config["percentage"])
                break

            case "damage":
                player.boostDamage(config["duration"], config["percentage"])
                break

            case "trap":
                this.hud.updateHealth(player.id, player.hurt(config["amount"]))
                break
        }
    }
}
