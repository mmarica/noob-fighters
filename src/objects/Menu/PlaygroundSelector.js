import Keyboard from '../Keyboard'
import PlaygroundManager from '../PlaygroundManager'
import Phaser from 'phaser'

// sizing and positioning constants
const WIDTH = 200
const HEIGHT = 125
const H_SPACING = 10
const V_MARGIN = 50
const STROKE = 4

export default class extends Phaser.Group {
    /**
     * Constructor
     *
     * @param game Game object
     * @param y    Vertical position
     * @param keys Key bindings
     */
    constructor(game, y, keys) {
        super(game)
        this.y = y
        this.keys = keys

        this._initialize()
        this._addKeyInfo()
        this._addPlaygrounds()
        this._addSelector()
        this._initKeys()
    }

    /**
     * Initialize some properties
     *
     * @private
     */
    _initialize() {
        // select first playground by default
        this.selection = 0

        // playground names and types
        let manager = new PlaygroundManager(this.game)
        this.names = manager.getList()
        this.types = manager.getTypes()

        // compute horizontal position for the widget
        this.x = this.game.world.centerX - (WIDTH * this.types.length + H_SPACING * (this.types.length - 1)) / 2

        // sound to play when selection changes
        this.changeSelectionSound = this.game.add.audio("menu_playground_change")
    }

    /**
     * Add a handler for key down event
     *
     * @private
     */
    _initKeys() {
        this.game.keyboard.onDown.add(
            function(char) {
                let current = this.selection

                switch (char["code"]) {
                    // playground selector keys
                    case this.keys["left"][0]:
                    case this.keys["left"][1]:
                        this.selection = Math.max(this.selection - 1, 0)

                        if (current != this.selection) {
                            this._updateSelectorPosition()
                            this.changeSelectionSound.play()
                        }
                        break

                    case this.keys["right"][0]:
                    case this.keys["right"][1]:
                        this.selection = Math.min(this.selection + 1, this.types.length - 1)

                        if (current != this.selection) {
                            this._updateSelectorPosition()
                            this.changeSelectionSound.play()
                        }
                        break
                }
            },
            this
        )
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
    _addSelector() {
        // alternating colors for the selection rectangle
        this.alternatingColors = [0xfa6121, 0xffb739]
        this.alternatingColorsIndex = 0

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
        this.selector.lineStyle(STROKE, this.alternatingColors[this.alternatingColorsIndex])
        this.selector.drawRect(0, 0, WIDTH + STROKE, HEIGHT + STROKE)
    }

    /**
     * Move the selection rectangle on the currently selected item
     *
     * @private
     */
    _updateSelectorPosition() {
        this.selector.x = this.x + (WIDTH + H_SPACING) * this.selection - STROKE / 2
        this.selector.y = this.y + V_MARGIN - STROKE / 2
    }

    /**
     * Add info about key bindings
     * 
     * @private
     */
    _addKeyInfo() {
        let x = this.game.world.centerX - (WIDTH * this.types.length + H_SPACING * (this.types.length - 1)) / 4
        let y = this.y

        let text = new Phaser.Text(this.game, x, y, Keyboard.longName(this.keys["left"][0]) + ", " + Keyboard.longName(this.keys["left"][1]))
        text.font = 'Arial'
        text.fontSize = 14
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)

        let sprite = this.game.add.sprite(x, y + 25, "menu_playground_left")
        sprite.anchor.setTo(0.5, 0)

        x = this.game.world.centerX + (WIDTH * this.types.length + H_SPACING * (this.types.length - 1)) / 4

        text = new Phaser.Text(this.game, x, y, Keyboard.longName(this.keys["right"][0]) + ", " + Keyboard.longName(this.keys["right"][1]))
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
        let y = this.y + V_MARGIN

        for (let type of this.types) {
            // image
            let sprite = this.game.add.sprite(x, y, "menu_playground_" + type)

            // name
            let text = new Phaser.Text(this.game, x + WIDTH / 2, y + HEIGHT + H_SPACING, this.names[type])
            text.font = 'Paytone One'
            text.fontSize = 16
            text.fill = '#fff'
            text.anchor.setTo(0.5, 0)
            this.game.add.existing(text)

            x += WIDTH + H_SPACING
        }
    }
}
