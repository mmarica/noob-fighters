import Phaser from 'phaser'
import Player from '../Player'

export default class extends Phaser.Group {
    constructor ({ game, x, y, keys }) {
        super(game)
        this.x = x
        this. y = y
        this.keys = keys

        this.selection = 0

        this.playerData = game.cache.getJSON("players")
        let players = this.playerData

        this.types = []
        for (let type in players)
            this.types.push(type)

        this._addSelector()
        this._addPlayers()
    }

    _addSelector () {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this.selector.lineStyle(2, 0xFFFFFF)
        this.selector.beginFill(0x000000)
        this.selector.drawRect(0, 0, 100, 100)

        let downKey = this.game.input.keyboard.addKey(this.keys["down"]);
        downKey.onDown.add(this.pressedDown, this)

        let upKey = this.game.input.keyboard.addKey(this.keys["up"]);
        upKey.onDown.add(this.pressedUp, this)
    }

    pressedDown () {
        this.selection = Math.min(this.selection + 1, this.types.length - 1)
        this._updateSelectorPosition()
    }

    pressedUp () {
        this.selection = Math.max(this.selection - 1, 0)
        this._updateSelectorPosition()
    }

    _updateSelectorPosition () {
        const HEIGHT = 100
        this.selector.x = this.x
        this.selector.y = this.y + HEIGHT * this.selection
    }

    _addPlayers () {
        let x = this.x
        let y = this.y
        const WIDTH = 100
        const HEIGHT = 100

        for (let type of this.types) {
            let sprite = this.game.add.sprite(x + WIDTH / 2, y + HEIGHT - 28, type + "_player")
            sprite.anchor.setTo(0.5, 1)

            this._addPlayerName(x + WIDTH / 2, y + HEIGHT - 3, this.playerData[type]["name"])

            y += HEIGHT
        }
    }

    _addPlayerName (x, y, name) {
        let playerName = new Phaser.Text(this.game, x, y, name)
        playerName.font = 'Russo One'
        playerName.fontSize = 10
        playerName.fill = '#fff'
        playerName.shadow = 2;
        playerName.smoothed = true
        playerName.anchor.setTo(0.5, 1)
        this.game.add.existing(playerName)
    }

    /**
     * Get the selected player type
     */
    getSelected () {
        return this.types[this.selection]
    }

    static loadAssets (game) {
        let players = game.cache.getJSON("players")

        for (let type in players)
            Player.loadAssets(game, type)
    }
}
