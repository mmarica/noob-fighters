import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor ({ game, x, y }) {
        super(game)
        this.x = x
        this.y = y

        // sizing and positioning constants
        this.WIDTH = 100
        this.HEIGHT = 100
        this.MARGIN = 4
        this.STROKE = 2
        this.TEXT_OFFSET = 20
        this.IMAGE_OFFSET = 28

        // select first player by default
        this.selection = 0
        this.confirmed = false

        this.playerData = game.cache.getJSON("players")

        // available player types
        this.types = []
        for (let type in this.playerData)
            this.types.push(type)

        // alternating colors for the selection rectangle
        this.alternatingColors = [0xfa6121, 0xffb739]
        this.alternatingColorsIndex = 0

        // color of the selection rectangle background
        this.selectionBgColor = 0x001821

        // color of selection rectangle after a player is chosen
        this.selectedColor = 0x198500

        // sound to play when selection changes
        this.changeSelectionSound = this.game.add.audio("menu_player_change")

        // sound to play when confirming the player selection
        this.confirmSound = this.game.add.audio("menu_player_confirm")

        this._addSelector()
        this._addPlayers()
    }

    /**
     * Select the previous player from the list
     */
    previous() {
        if (this.confirmed)
            return

        let current = this.selection
        this.selection = Math.max(this.selection - 1, 0)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    /**
     * Select the next player from the list
     */
    next() {
        if (this.confirmed)
            return

        let current = this.selection
        this.selection = Math.min(this.selection + 1, this.types.length - 1)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    /**
     * Confirm the current player selection
     */
    confirm() {
        if (!this.confirmed) {
            this.confirmed = true
            this.game.time.events.remove(this.selectionTimer)
            this._drawSelectionRectangle()
            this.confirmSound.play()
        }
    }

    /**
     * Check if the player type has been chosen
     *
     * @returns {boolean|*}
     */
    isConfirmed() {
        return this.confirmed
    }

    /**
     * Get the selected player type
     */
    getSelected() {
        return this.types[this.selection]
    }

    /**
     * Add selection rectangle
     *
     * @private
     */
    _addSelector() {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this._drawSelectionRectangle()

        // register the timer to alternate the colors
        this.selectionTimer = this.game.time.events.loop(150, this._drawSelectionRectangle, this);
    }

    /**
     * Draw the selection rectangle, alternating the colors
     *
     * @private
     */
    _drawSelectionRectangle() {
        let color = undefined

        if (this.confirmed) {
            color = this.selectedColor
        } else {
            this.alternatingColorsIndex = 1 - this.alternatingColorsIndex
            color = this.alternatingColors[this.alternatingColorsIndex]
        }

        this.selector.lineStyle(this.STROKE, color)
        this.selector.beginFill(this.selectionBgColor);
        this.selector.drawRect(0, 0, this.WIDTH + this.STROKE, this.HEIGHT + this.STROKE)
    }

    /**
     * Move the selection rectangle on the currently selected item
     *
     * @private
     */
    _updateSelectorPosition() {
        this.selector.x = this.x
        this.selector.y = this.y + (this.HEIGHT + this.MARGIN) * this.selection
    }

    /**
     * Add player images and names
     *
     * @private
     */
    _addPlayers() {
        let x = this.x
        let y = this.y

        for (let type of this.types) {
            // image
            let sprite = this.game.add.sprite(x + this.WIDTH / 2, y + this.HEIGHT - this.IMAGE_OFFSET, type + "_player")
            sprite.anchor.setTo(0.5, 1)

            // name
            let text = new Phaser.Text(this.game, x + this.WIDTH / 2, y + this.HEIGHT - this.TEXT_OFFSET, this.playerData[type]["name"])
            text.font = 'Paytone One'
            text.fontSize = 11
            text.fill = '#fff'
            text.anchor.setTo(0.5, 0)
            this.game.add.existing(text)

            y += this.HEIGHT + this.MARGIN
        }
    }
}
