import AbstractState from './Abstract'
import AssetLoader from '../objects/AssetLoader'
import PlaygroundManager from '../objects/PlaygroundManager'
import Player from '../objects/Player'
import Hud from '../objects/Hud'
import PowerupManager from '../objects/PowerupManager'
import * as util from '../utils'

export default class extends AbstractState {
    /**
     * Extract the players and playground types from parameters
     *
     * @param playerTypes    Player types
     * @param playgroundType Playground type
     */
    init(playerTypes, playgroundType) {
        this.playerTypes = playerTypes
        this.playgroundType = playgroundType
    }

    /**
     * Load assets
     */
    preload() {
        this._addPreloadProgressBar()

        for (let type of this.playerTypes)
            AssetLoader.loadPlayer(type)

        AssetLoader.loadPlayground(this.playgroundType)
        AssetLoader.loadPowerups()
    }

    /**
     * Create the scene
     */
    create() {
        this._initKeyboard()
        this._addPlayGround()
        this._addPlayers()
        this._addPowerups()
        this._addHud()
        this._activatePlayers()
    }

    /**
     * Add the playground to the scene
     *
     * @private
     */
    _addPlayGround() {
        let manager = new PlaygroundManager(this.game)
        this.playGround = this.game.add.existing(manager.create(this.playgroundType))
        this.obstacles = this.playGround.getObstacles()
        this.powerupSpots = this.playGround.getPowerupSpots()
    }

    /**
     * Add the players to the scene
     *
     * @private
     */
    _addPlayers() {
        let data = this.game.cache.getJSON("players")
        let startPositions = [
            [100, ],
            [, this.world.height - data[this.playerTypes[1]]["sprite"]["height"] / 2 - 24],
        ]

        let keys = this.game.cache.getJSON("config")["keys"]
        this.players = []

        for (let id = 0; id < 2; id++) {
            let x = id == 0 ? 100 : this.world.width - 100
            let y = this.world.height - data[this.playerTypes[id]]["sprite"]["height"] / 2 - 24
            let player = this.game.add.existing(new Player(this.game, id, this.playerTypes[id], x, y, keys["p" + (1 + 1 * id)]))
            this.players.push(player)

            player.secondaryWeapon.onExplode.add(this.onSecondaryExplosion, this)
        }
    }

    /**
     * Event handler for the secondary weapon explosion
     *
     * @param x      Horizontal position of the explosion
     * @param y      Vertical position of the explosion
     * @param damage Secondary weapon max damage
     * @param radius Secondary weapon explosion radiu
     */
    onSecondaryExplosion(x, y, damage, radius) {
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

    /**
     * Start the power-up manager
     *
     * @private
     */
    _addPowerups() {
        this.powerupManager = new PowerupManager(this.game, this.players, this.playGround.getPowerupSpots())
        this.powerupManager.onTake.add(this.onTakePowerup, this)
    }

    /**
     * Handler for taking power-up
     *
     * @param player Player object
     * @param type   Power-up type
     * @param config Power-up configuration data
     * @private
     */
    onTakePowerup(player, type, config) {
        switch (type) {
            case "health":
                this.hud.updateHealth(player.id, player.heal(config["amount"]))
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

    /**
     * Add the HUD to the scene
     *
     * @private
     */
    _addHud() {
        this.hud = this.game.add.existing(
            new Hud(this.game,
                this.players[0].name, this.players[0].getHealth(),
                this.players[1].name, this.players[1].getHealth()
            )
        )
    }

    /**
     * Activate the players
     *
     * @private
     */
    _activatePlayers() {
        for (let player of this.players)
            player.activate()
    }

    /**
     * Update event handler
     */
    update() {
        // collide players to one another
        this.game.physics.arcade.collide(this.players[0], this.players[1]);

        for (let id = 0; id < 2; id++) {
            // check if the player touches the power-up (if on screen)
            this.powerupManager.checkPlayersOverlapping()

            // check if primary weapon bullet hits player
            let primaryWeapon = this.players[id].primaryWeapon
            this.game.physics.arcade.overlap(
                [this.players[1 - id]],
                primaryWeapon.bullets,
                function(player, bullet) {
                    bullet.kill()

                    let damage = this.players[1 - player.id].primaryWeapon.getComputedDamage()
                    this.hud.updateHealth(player.id, player.hurt(damage))
                },
                null,
                this
            )

            // check if primary weapon bullet hit an obstacle
            for (let obstacle of this.obstacles)
                this.game.physics.arcade.overlap(
                    obstacle,
                    primaryWeapon.bullets,
                    function(ledge, bullet) {
                        bullet.kill()
                    }
                )

            // check collision between player and obstacles
            for (let obstacle of this.obstacles)
                this.game.physics.arcade.collide(this.players[id], obstacle)

            // check collision between player and secondary weapon bullets
            let secondaryWeapon = this.players[id].secondaryWeapon
            for (let player of this.players)
                this.game.physics.arcade.collide(player, secondaryWeapon.bullets)

            // check collision between obstacles and secondary weapon bullets
            for (let obstacle of this.obstacles)
                this.game.physics.arcade.collide(obstacle, secondaryWeapon.bullets)
        }

        // if at least one player has 0 HP, game over!
        for (let player of this.players)
            if (player.getHealth() == 0) {
                this._deactivatePlayers()
                this.camera.fade('#000000');
                this.camera.onFadeComplete.addOnce(
                    function() {
                        // go to the game over screen
                        this.game.sound.stopAll()
                        this.game.state.start("GameOver", true, false, this.players[0].name, this.players[0].getHealth(), this.players[1].name, this.players[1].getHealth());
                    },
                    this
                );
                break
            }
    }

    /**
     * Deactivate the players
     *
     * @private
     */
    _deactivatePlayers() {
        for (let player of this.players)
            player.deactivate()
    }
}
