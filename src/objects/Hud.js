import Phaser from 'phaser'

const MARGIN = 40
const HBAR_Y = 8
const NAME_MARGIN = 8
const HBAR_WIDTH = 400
const HBAR_HEIGHT = 24
const HBAR_STROKE = 2

export default class extends Phaser.Group {
    /**
     * Constructor
     *
     * @param game     Game object
     * @param p1Name   Player one's name
     * @param p1Health Player one's health
     * @param p2Name   Player two's name
     * @param p2Health Player two's health
     */
    constructor (game, p1Name, p1Health, p2Name, p2Health) {
        super(game)
        this.health = [p1Health, p2Health]
        this.name = [p1Name, p2Name]

        this._addHealthBars()
        this._addBanner()
    }

    /**
     * Update the health value for the specified player
     *
     * @param id    The player id
     * @param value The value for health
     */
    updateHealth(id, value) {
        this.health[id] =  value
        this._updateHealthBar(id)
    }

    /**
     * Add the health bars
     *
     * @private
     */
    _addHealthBars() {
        this.hbar = []

        for (let id = 0; id < 2; id++) {
            let hbar = this.add(game.add.graphics())
            this.hbar.push(hbar)
            this._updateHealthBar(id)
            this._addPlayerName(id)
        }
    }

    /**
     * Add the banner
     *
     * @private
     */
    _addBanner() {
        let banner = new Phaser.Text(this.game, this.game.world.centerX, -10, 'NOOB FIGHTERS')
        banner.anchor.setTo(0.5, 0)
        banner.font = 'Paytone One'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#58cfff'
        banner.stroke = '#050087'
        banner.strokeThickness = 3
        banner.smoothed = true
        this.add(banner)
    }

    /**
     * Add player name
     *
     * @param id The player id
     * @private
     */
    _addPlayerName(id) {
        let x = id == 0 ? MARGIN + NAME_MARGIN :  this.game.world.width - MARGIN - NAME_MARGIN

        let playerName = new Phaser.Text(this.game, x, NAME_MARGIN, this.name[id])
        playerName.font = 'Russo One'
        playerName.fontSize = 20
        playerName.fill = '#fff'
        playerName.shadow = 2
        playerName.smoothed = true
        playerName.anchor.setTo(id == 0 ? 0 : 1, 0)

        this.add(playerName)
    }

    /**
     * Update the specified health banner to reflect the health value
     *
     * @param id The player id
     * @private
     */
    _updateHealthBar(id) {
        // compute the horizontal position depending on player id
        let x = id == 0 ? MARGIN + HBAR_STROKE : this.game.world.width - MARGIN - HBAR_WIDTH - 2 * HBAR_STROKE

        // delete the current healtbar
        let hbar = this.hbar[id]
        hbar.clear()

        // create the "empty health" container
        hbar.lineStyle(HBAR_STROKE, 0xFFFFFF)
        hbar.beginFill(0x000000)
        hbar.drawRect(x, HBAR_Y, HBAR_WIDTH + 2 * HBAR_STROKE, HBAR_HEIGHT + 2 * HBAR_STROKE)

        // draw the actual health
        hbar.lineStyle(0)
        hbar.beginFill(0xFF0000)
        hbar.drawRect(x + HBAR_STROKE, HBAR_Y + HBAR_STROKE, HBAR_WIDTH * this.health[id] / 100, HBAR_HEIGHT)
    }
}