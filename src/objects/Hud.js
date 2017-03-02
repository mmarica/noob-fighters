import Phaser from 'phaser'

const MARGIN = 40
const HBAR_Y = 8
const NAME_MARGIN = 8
const HBAR_WIDTH = 400
const HBAR_HEIGHT = 24
const HBAR_STROKE = 2

export default class extends Phaser.Group {

    constructor ({ game, p1, p1Health, p2, p2Health }) {
        super(game)

        this.health = [p1Health, p2Health]
        this.name = [p1, p2]
        this.playerName = []
        this.hbar = []

        for (let i = 0; i < 2; i++) {
            this.hbar.push(this._createHealthBar(i))
            this.playerName.push(this._createPlayerName(i))
            this._updateHealthBar(i)
        }

        this._addBanner()
    }

    _createPlayerName (id) {
        let x = id == 0 ? MARGIN + NAME_MARGIN :  this.game.world.width - MARGIN - NAME_MARGIN

        let playerName = new Phaser.Text(this.game, x, NAME_MARGIN, this.name[id])
        playerName.font = 'Russo One'
        playerName.fontSize = 20
        playerName.fill = '#fff'
        playerName.shadow = 2;
        playerName.smoothed = true
        playerName.anchor.setTo(id == 0 ? 0 : 1, 0)

        return this.add(playerName)
    }

    _createHealthBar (id) {
        return this.add(game.add.graphics())
    }

    _updateHealthBar (id) {
        // compute the horizontal position depending on player id
        let x = id == 0 ? MARGIN + HBAR_STROKE : this.game.world.width - MARGIN - HBAR_WIDTH - 2 * HBAR_STROKE

        // delete the current healtbar
        let hbar = this.hbar[id];
        hbar.clear()

        // create the "empty health" container
        hbar.lineStyle(HBAR_STROKE, 0xFFFFFF);
        hbar.beginFill(0x000000);
        hbar.drawRect(x, HBAR_Y, HBAR_WIDTH + 2 * HBAR_STROKE, HBAR_HEIGHT + 2 * HBAR_STROKE);

        // draw the actual health
        hbar.lineStyle(0);
        hbar.beginFill(0xFF0000);
        hbar.drawRect(x + HBAR_STROKE, HBAR_Y + HBAR_STROKE, HBAR_WIDTH * this.health[id] / 100, HBAR_HEIGHT);

    }

    _addBanner () {
        let banner = new Phaser.Text(this.game, this.game.world.centerX, -10, 'NOOB FIGHTERS')
        banner.anchor.setTo(0.5, 0)
        banner.font = 'Paytone One'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#00c6ff'
        banner.smoothed = true
        this.add(banner)
    }

    updateHealth (id, value) {
        this.health[id] =  value
        this._updateHealthBar(id)
    }
}