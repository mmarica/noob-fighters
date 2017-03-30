import Phaser from 'phaser'
import AbstractPlayground from '../Abstract/Playground'
import Ground from './Moon/Ground'
import Ledge from './Moon/Ledge'

export default class extends AbstractPlayground {
    /**
     * Constructor
     *
     * @param game Game object
     */
    constructor (game) {
        super(game)

        this._addBackground()
        this._addVisualElements()
        this._addPowerupSpots()
    }

    /**
     * Add positions for power-ups
     */
    _addPowerupSpots() {
        this.powerupSpots = [
            {x: 98, y: 781},
            {x: 1216, y: 781},
        ]
    }

    /**
     * Get the list of obstacles
     *
     * @returns {[]}
     */
    getObstacles () {
        return [this.ground, ...this.rocks, ...this.ledges]
    }

    /**
     * Add visual elements
     *
     * @private
     */
    _addVisualElements() {
        this.rocks = []
        this.ledges = []

        this._level0()
        this._level1()
        this._level2()
    }

    /**
     * Ground level
     *
     * @private
     */
    _level0() {
        let game = this.game

        this.ground = game.add.existing(new Ground(game))
    }

    /**
     * First level above ground
     *
     * @private
     */
    _level1() {
        let game = this.game

        // left
        let ledge = game.add.existing(new Ledge(game, 250, 620, 5))
        this.ledges.push(ledge)

        // left
        ledge = game.add.existing(new Ledge(game, game.world.width - 250 - 32 * 5, 620, 5))
        this.ledges.push(ledge)
    }

    /**
     * Second level above ground
     *
     * @private
     */
    _level2() {
        let game = this.game

        // middle
        let ledge = game.add.existing(new Ledge(game, game.world.centerX - 32 * 1.5, 470, 3))
        ledge.verticalMovement (200, 150, 80, "down")
        this.ledges.push(ledge)
    }

    /**
     * Add the background
     *
     * @private
     */
    _addBackground() {
        let game = this.game

        // background image
        game.add.sprite(0, 0, 'moon_bg')
    }
}
