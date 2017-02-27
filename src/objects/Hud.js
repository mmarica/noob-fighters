import Phaser from 'phaser'

const MARGIN = 40
const HBAR_Y = 80
const HBAR_WIDTH = 400
const HBAR_HEIGHT = 24
const HBAR_STROKE = 2

export default class extends Phaser.Group {

    constructor ({ game, p1, p2 }) {
        super(game)

        this.health = [100, 100]
        this.name = [p1, p2]
        this.playerName = []
        this.hbar = []

        for (let i = 0; i < 2; i++) {
            this.playerName.push(this._createPlayerName(i))
            this.hbar.push(this._createHealthBar(i))
            this._updateHealthBar(i)
        }

        this._addBanner()
    }

    _createPlayerName (id) {
        let x = id == 0 ? MARGIN :  this.game.world.width - MARGIN

        let playerName = new Phaser.Text(this.game, x, 50, this.name[id])
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
        let banner = new Phaser.Text(this.game, this.game.world.centerX, 20, 'NOOB FIGHTERS')
        banner.anchor.setTo(0.5, 0)
        banner.font = 'Paytone One'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#00c6ff'
        banner.smoothed = true
        this.add(banner)
    }

    decreaseHealth (id, amount) {
        this.health[id] =  Math.max(0, this.health[id] - amount)
        this._updateHealthBar(id)
    }
}