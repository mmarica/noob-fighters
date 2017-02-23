import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor ({ game, p1, p2 }) {
        super(game)

        this._addBanner()
        this._addPlayerStatus(p1, 1)
        this._addPlayerStatus(p2, 2)
    }

    create () {
    }

    _addBanner () {
        let banner = new Phaser.Text(this.game, this.game.world.centerX, 40, 'Noob Fighters')
        banner.font = 'Bangers'
        banner.padding.set(10, 16)
        banner.fontSize = 40
        banner.fill = '#00c6ff'
        banner.smoothed = true
        this.add(banner)
    }

    _addPlayerStatus (name, id) {
        const health_witdh  = 200
        const margin = 40

        let x = id == 1 ? margin :  this.game.world.width - margin

        let playerName = new Phaser.Text(this.game, x, 40, name)
        playerName.font = 'Bangers'
        playerName.fontSize = 20
        playerName.fill = '#fcff00'
        playerName.stroke = '#c600ff';
        playerName.strokeThickness = 3;
        playerName.smoothed = true
        playerName.anchor.setTo(id == 1 ? 0 : 1, 0)
        this.add(playerName)
    }
}