import Phaser from 'phaser'
import Player from '../Player'

export default class extends Phaser.Group {
    constructor ({ game, x, y, keys }) {
        super(game)
        this.x = x
        this. y = y
        this.keys = keys

        // sizing / positioning constants
        this.WIDTH = 100
        this.HEIGHT = 100
        this.MARGIN = 4
        this.STROKE = 2
        this.TEXT_OFFSET = 20
        this.IMAGE_OFFSET = 28

        // select first player by default
        this.selection = 0

        this.playerData = game.cache.getJSON("players")
        let players = this.playerData

        // available player types
        this.types = []
        for (let type in players)
            this.types.push(type)

        // alternating colors for the selection rectangle
        this.selectionColors = [0xfa6121, 0xffb739]
        this.selectionColorIndex = 0

        // sound to play when selection changes
        this.changeSelectionSound = this.game.add.audio("menu_change")

        // add the players (image + name)
        this._addPlayers()

        // add the selection rectangle
        this._addSelector()
    }

    // get the selected player type
    getSelected () {
        return this.types[this.selection]
    }

    _addSelector () {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this._drawSelectionRectangle()

        // register the timer to alternate the colors
        this.game.time.events.loop(150, this._drawSelectionRectangle, this);

        // select the next player from the list when pressing the "down" key
        let downKey = this.game.input.keyboard.addKey(this.keys["down"]);
        downKey.onDown.add(
            function () {
                this.selection = Math.min(this.selection + 1, this.types.length - 1)
                this._updateSelectorPosition()
                this.changeSelectionSound.play()
            }, this)

        // select the previous player from the list when pressing the "up" key
        let upKey = this.game.input.keyboard.addKey(this.keys["up"]);
        upKey.onDown.add(
            function () {
                this.selection = Math.max(this.selection - 1, 0)
                this._updateSelectorPosition()
                this.changeSelectionSound.play()
            }, this)
    }

    // draw the selection rectangle, alternating the colors
    _drawSelectionRectangle () {
        this.selectionColorIndex = 1 - this.selectionColorIndex
        this.selector.lineStyle(this.STROKE, this.selectionColors[this.selectionColorIndex])
        this.selector.drawRect(0, 0, this.WIDTH + this.STROKE, this.HEIGHT + this.STROKE)
    }

    // move the selection rectangle on the currently selected item
    _updateSelectorPosition () {
        this.selector.x = this.x
        this.selector.y = this.y + (this.HEIGHT + this.MARGIN) * this.selection
    }

    // add player images and names
    _addPlayers () {
        let x = this.x
        let y = this.y

        for (let type of this.types) {
            let sprite = this.game.add.sprite(x + this.WIDTH / 2, y + this.HEIGHT - this.IMAGE_OFFSET, type + "_player")
            sprite.anchor.setTo(0.5, 1)
            this._addName(x + this.WIDTH / 2, y + this.HEIGHT - this.TEXT_OFFSET, this.playerData[type]["name"])
            y += this.HEIGHT + this.MARGIN
        }
    }

    // add the player name
    _addName (x, y, name) {
        let text = new Phaser.Text(this.game, x, y, name)
        text.font = 'Paytone One'
        text.fontSize = 11
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)
    }

    // load the assets
    static loadAssets (game) {
        let players = game.cache.getJSON("players")

        for (let type in players)
            Player.loadAssets(game, type)

        game.load.audio("menu_change", "./assets/menu/sounds/change.mp3?__version__");
    }
}
