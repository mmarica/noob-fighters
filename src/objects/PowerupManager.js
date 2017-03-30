import Phaser from 'phaser'
import Powerup from './Powerup'
import * as util from '../utils'

export default class {
    /**
     * Constructor
     *
     * @param game    Game object
     * @param players List of players objects
     * @param spots   List of possible power-up spot
     */
    constructor (game, players, spots) {
        this.game = game
        this.players = players
        this.spots = spots

        this.config = this.game.cache.getJSON("config")["power-ups"]

        this.types = []
        for (let type in this.config["types"])
            this.types.push(type)

        this.powerup = null
        this.onTake = new Phaser.Signal()
        this._startTimer()
    }

    /**
     * Start the timer for the next powerup to appear
     *
     * @private
     */
    _startTimer() {
        let interval = this.config["appear"]["interval"]
        let variation = this.config["appear"]["interval_variation"]
        let seconds = interval + Math.round(Math.random() * variation)

        util.log("power-up", "next in " + seconds + " seconds")
        this.timer = this.game.time.events.add(Phaser.Timer.SECOND * seconds, this._addPowerup, this);
    }

    /**
     * Stop the powerup timer
     *
     * @private
     */
    _stopTimer() {
        this.game.time.events.remove(this.timer)
    }

    /**
     * Check if a player touched the powerup
     */
    checkPlayersOverlapping() {
        // if no power-up is on the screen, abort
        if (this.powerup == null)
            return;

        for (let player of this.players)
            this.game.physics.arcade.overlap(player, this.powerup, this._take, null, this)
    }

    /**
     * Powerup expire event handler
     *
     * @private
     */
    _expire() {
        this._stopTimer()

        util.log("power-up", "expired")
        this.powerup.expire()
        this.powerup = null

        this._startTimer()
    }

    /**
     * Powerup taken by player event handler
     *
     * @param player  Player object
     * @param powerup Powerup object
     * @private
     */
    _take(player, powerup) {
        this._stopTimer()

        let type = powerup.getType()

        // if it's a surprise powerup, it will have the behavior of another one, randomly chosen
        if (type == 'surprise') {
            type = this._getRandomType(true)
            util.log("power-up", "surprise  => " + type)
        }

        util.log("power-up", "taken: " + type)
        powerup.take(type)
        this.powerup = null
        this._startTimer()

        // notify the registered event handlers
        this.onTake.dispatch(player, type, this.config["types"][type])
    }

    /**
     * Add a powerup on the screen
     *
     * @private
     */
    _addPowerup() {
        // if a power-up is already on the screen, abort
        if (this.powerup != null)
            return;

        // generate a random type
        let type = this._getRandomType(false)

        // choose a spot as farthest from the players as possible
        let spots = []
        for (let spot of this.spots) {
            let distance1 = Math.round(this.game.physics.arcade.distanceToXY(this.players[0], spot.x, spot.y))
            let distance2 = Math.round(this.game.physics.arcade.distanceToXY(this.players[1], spot.x, spot.y))
            spots.push({
                distance: Math.min(distance1, distance2),
                x: spot.x,
                y: spot.y,
            })
        }

        // sort spots by distance
        spots.sort(function (x, y) {
            return x.distance < y.distance ? 1 : -1
        })
        let spot = spots[0]

        this.powerup = this.game.add.existing(new Powerup(this.game, type, spot.x, spot.y))

        let duration = this.config["appear"]["duration"]
        util.log("power-up", "appeared for " + duration + " seconds: " + type)
        this.timer = this.game.time.events.add(Phaser.Timer.SECOND * duration, this._expire, this);
    }

    /**
     * Get a random powerup type
     *
     * @param excludeSurprise If true, the result will not be "surprise"
     * @returns {string}
     * @private
     */
    _getRandomType(excludeSurprise) {
        while (true) {
            let type = this.types[Math.round(Math.random() * (this.types.length - 1))]

            if (excludeSurprise && type == "surprise")
                continue

            return type
        }
    }
}
