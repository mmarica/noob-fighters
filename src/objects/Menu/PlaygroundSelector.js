import Keyboard from '../Keyboard'
import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor(game, y, keys) {
        super(game)

        this.keys = keys

        // sizing and positioning constants
        this.WIDTH = 200
        this.HEIGHT = 125
        this.H_SPACING = 10
        this.V_MARGIN = 50
        this.STROKE = 4

        // playground types
        this.types = ["cemetery", "forest"]

        // playground names
        this.names = {
            cemetery: "Cemetery",
            forest: "Forest",
        }

        // compute position for the widget
        this.x = game.world.centerX - (this.WIDTH * this.types.length + this.H_SPACING * (this.types.length - 1)) / 2
        this.y = y

        // alternating colors for the selection rectangle
        this.alternatingColors = [0xfa6121, 0xffb739]
        this.alternatingColorsIndex = 0

        // select first playground by default
        this.selection = 0

        // sound to play when selection changes
        this.changeSelectionSound = this.game.add.audio("menu_playground_change")

        // add info about key bindings
        this._addKeys()

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
        this.selector.x = this.x + (this.WIDTH + this.H_SPACING) * this.selection - this.STROKE / 2
        this.selector.y = this.y + this.V_MARGIN - this.STROKE / 2
    }

    /**
     * Add info about key bindings
     * 
     * @private
     */
    _addKeys() {
        let x = this.game.world.centerX - (this.WIDTH * this.types.length + this.H_SPACING * (this.types.length - 1)) / 4
        let y = this.y

        let text = new Phaser.Text(this.game, x, y, Keyboard.getDisplayName(this.keys["previous"][0]) + ", " + Keyboard.getDisplayName(this.keys["previous"][1]))
        text.font = 'Arial'
        text.fontSize = 14
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)

        let sprite = this.game.add.sprite(x, y + 25, "menu_playground_left")
        sprite.anchor.setTo(0.5, 0)

        x = this.game.world.centerX + (this.WIDTH * this.types.length + this.H_SPACING * (this.types.length - 1)) / 4

        text = new Phaser.Text(this.game, x, y, Keyboard.getDisplayName(this.keys["next"][0]) + ", " + Keyboard.getDisplayName(this.keys["next"][1]))
        text.font = 'Arial'
        text.fontSize = 14
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)

        sprite = this.game.add.sprite(x, y + 25, "menu_playground_right")
        sprite.anchor.setTo(0.5, 0)
    }

    /**
     * Add playground images and names
     *
     * @private
     */
    _addPlaygrounds() {
        let x = this.x
        let y = this.y + this.V_MARGIN

        for (let type of this.types) {
            // image
            let sprite = this.game.add.sprite(x, y, "menu_playground_" + type)

            // name
            let text = new Phaser.Text(this.game, x + this.WIDTH / 2, y + this.HEIGHT + this.H_SPACING, this.names[type])
            text.font = 'Paytone One'
            text.fontSize = 16
            text.fill = '#fff'
            text.anchor.setTo(0.5, 0)
            this.game.add.existing(text)

            x += this.WIDTH + this.H_SPACING
        }
    }
}
