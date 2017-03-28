import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor(game, y) {
        super(game)

        // sizing and positioning constants
        this.WIDTH = 200
        this.HEIGHT = 125
        this.MARGIN = 10
        this.STROKE = 4

        // playground types
        this.types = ["cemetery", "forest"]

        // playground names
        this.names = {
            cemetery: "Cemetery",
            forest: "Forest",
        }

        // alternating colors for the selection rectangle
        this.alternatingColors = [0xfa6121, 0xffb739]
        this.alternatingColorsIndex = 0

        // compute position for the widget
        this.x = game.world.centerX - (this.WIDTH * this.types.length + this.MARGIN * (this.types.length - 1)) / 2
        this.y = y

        // select first playground by default
        this.selection = 0

        // sound to play when selection changes
        this.changeSelectionSound = this.game.add.audio("menu_playground_change")

        // add the playgrounds (image + name)
        this._addPlaygrounds()

        // add the selection rectangle
        this._addSelector()
    }

    /**
     * Select the previous playground from the list
     */
    previous() {
        let current = this.selection
        this.selection = Math.max(this.selection - 1, 0)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    /**
     * Select the next playground from the list
     */
    next() {
        let current = this.selection
        this.selection = Math.min(this.selection + 1, this.types.length - 1)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    /**
     * Get the selected playground type
     */
    getSelected() {
        return this.types[this.selection]
    }

    /**
     * Add the selector to the stage
     *
     * @private
     */
    _addSelector () {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this._drawSelectionRectangle()

        // register the timer to alternate the colors
        this.game.time.events.loop(150, this._drawSelectionRectangle, this);
    }

    /**
     * Draw the selection rectangle, alternating the colors
     *
     * @private
     */
    _drawSelectionRectangle() {
        this.alternatingColorsIndex = 1 - this.alternatingColorsIndex
        this.selector.lineStyle(this.STROKE, this.alternatingColors[this.alternatingColorsIndex])
        this.selector.drawRect(0, 0, this.WIDTH + this.STROKE, this.HEIGHT + this.STROKE)
    }

    /**
     * Move the selection rectangle on the currently selected item
     *
     * @private
     */
    _updateSelectorPosition() {
        this.selector.x = this.x + (this.WIDTH + this.MARGIN) * this.selection - this.STROKE / 2
        this.selector.y = this.y - this.STROKE / 2
    }

    /**
     * Add playground images and names
     *
     * @private
     */
    _addPlaygrounds() {
        let x = this.x
        let y = this.y

        for (let type of this.types) {
            // image
            let sprite = this.game.add.sprite(x, y, "menu_playground_" + type)

            // name
            let text = new Phaser.Text(this.game, x + this.WIDTH / 2, y + this.HEIGHT + this.MARGIN, this.names[type])
            text.font = 'Paytone One'
            text.fontSize = 16
            text.fill = '#fff'
            text.anchor.setTo(0.5, 0)
            this.game.add.existing(text)

            x += this.WIDTH + this.MARGIN
        }
    }
}
