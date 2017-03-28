import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor ({ game, x, y }) {
        super(game)
        this.x = x
        this. y = y

        // sizing and positioning constants
        this.WIDTH = 100
        this.HEIGHT = 100
        this.MARGIN = 4
        this.STROKE = 2
        this.TEXT_OFFSET = 20
        this.IMAGE_OFFSET = 28

        // select first player by default
        this.selection = 0
        this.chosen = false

        this.playerData = game.cache.getJSON("players")

        // available player types
        this.types = []
        for (let type in this.playerData)
            this.types.push(type)

        // alternating colors for the selection rectangle
        this.alternatingColors = [0xfa6121, 0xffb739]

        // color of the selection rectangle background
        this.selectionBgColor = 0x001821

        // color of selection rectangle after a player is chosen
        this.selectedColor = 0x198500

        // select first player by default
        this.selectionColorIndex = 0

        // sound to play when selection changes
        this.changeSelectionSound = this.game.add.audio("menu_player_change")

        // sound to play when choosing the player is
        this.chooseSound = this.game.add.audio("menu_player_choose")

        this._addSelector()
        this._addPlayers()
    }

    // select the previous player from the list
    previous () {
        if (this.chosen)
            return

        let current = this.selection
        this.selection = Math.max(this.selection - 1, 0)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    // select the next player from the list
    next () {
        if (this.chosen)
            return

        let current = this.selection
        this.selection = Math.min(this.selection + 1, this.types.length - 1)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    // choose the currently selected player
    choose () {
        if (!this.chosen) {
            this.chosen = true
            this.game.time.events.remove(this.selectionTimer)
            this._drawSelectionRectangle()
            this.chooseSound.play()
        }
    }

    isChosen () {
        return this.chosen
    }

    // get the selected player type
    getSelected () {
        return this.types[this.selection]
    }

    // add selection rectangle
    _addSelector () {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this._drawSelectionRectangle()

        // register the timer to alternate the colors
        this.selectionTimer = this.game.time.events.loop(150, this._drawSelectionRectangle, this);
    }

    // draw the selection rectangle, alternating the colors
    _drawSelectionRectangle () {
        let color = undefined

        if (this.chosen) {
            color = this.selectedColor
        } else {
            this.selectionColorIndex = 1 - this.selectionColorIndex
            color = this.alternatingColors[this.selectionColorIndex]
        }

        this.selector.lineStyle(this.STROKE, color)
        this.selector.beginFill(this.selectionBgColor);
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
}
