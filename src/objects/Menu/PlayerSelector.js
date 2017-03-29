import * as util from '../../utils'
import Keyboard from '../Keyboard'
import Phaser from 'phaser'

// sizing and positioning constants
const WIDTH = 100
const HEIGHT = 100
const MARGIN = 4
const STROKE = 2
const TEXT_OFFSET = 20
const IMAGE_OFFSET = 28

export default class extends Phaser.Group {
    /**
     * Constructor
     *
     * @param game         Game object
     * @param x            Horizontal position
     * @param y            Vertical position
     * @param keys         Key bindings
     * @param keysPosition Where to display the key bindings: left or right
     */
    constructor (game, x, y, keys, keysPosition) {
        super(game)
        this.x = x
        this.y = y
        this.keys = keys
        this.keysPosition = keysPosition

        this._initialize()
        this._addKeyInfo()
        this._addSelector()
        this._addPlayers()
        this._updateSelectorPosition()
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
            this.playerSprites[current].animations.stop()
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
            this.playerSprites[current].animations.stop()
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
            this.playerSprites[this.selection].animations.stop()
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
     * Initialize some properties
     *
     * @private
     */
    _initialize() {
        let game = this.game

        // select first player by default
        this.selection = 0
        this.confirmed = false

        this.playerData = game.cache.getJSON("players")

        // available player types
        this.types = []
        for (let type in this.playerData)
            this.types.push(type)
        
        // sound to play when selection changes
        this.changeSelectionSound = game.add.audio("menu_player_change")

        // sound to play when confirming the player selection
        this.confirmSound = game.add.audio("menu_player_confirm")
    }

    /**
     * Add selection rectangle
     *
     * @private
     */
    _addSelector() {
        let game = this.game

        // alternating colors for the selection rectangle
        this.alternatingColors = [0xfa6121, 0xffb739]
        this.alternatingColorsIndex = 0

        // color of the selection rectangle background
        this.selectionBgColor = 0x001821

        // color of selection rectangle after a player is chosen
        this.selectedColor = 0x198500

        this.selector = game.add.graphics()
        this._drawSelectionRectangle()

        // register the timer to alternate the colors
        this.selectionTimer = game.time.events.loop(150, this._drawSelectionRectangle, this);
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

        this.selector.lineStyle(STROKE, color)
        this.selector.beginFill(this.selectionBgColor);
        this.selector.drawRect(0, 0, WIDTH + STROKE, HEIGHT + STROKE)
    }

    /**
     * Move the selection rectangle on the currently selected item
     *
     * @private
     */
    _updateSelectorPosition() {
        this.selector.x = this.x
        this.selector.y = this.y + (HEIGHT + MARGIN) * this.selection
        this.playerSprites[this.selection].animations.play("walk")
    }

    /**
     * Add info about key bindings
     *
     * @private
     */
    _addKeyInfo() {
        let game = this.game

        let xMul = this.keysPosition == "left" ? 1 : -1
        let textAlign = this.keysPosition == "left" ? "right" : "left"
        let textAnchor = this.keysPosition == "left" ? 1 : 0

        let x = this.x
        if (this.keysPosition == "right")
            x += WIDTH

        // key for previous item
        let y = this.y

        let text = new Phaser.Text(game, x - xMul * 40, y + 75, Keyboard.shortName(this.keys["previous"]))
        text.font = 'Arial'
        text.fontSize = 14
        text.fill = '#fff'
        text.align = textAlign
        text.anchor.setTo(textAnchor, 0)
        game.add.existing(text)

        let sprite = game.add.sprite(x - xMul * 25, y, "menu_player_up")
        sprite.anchor.setTo(0.5, 0)

        // keys for confirmation
        y = this.y + (HEIGHT * this.types.length + MARGIN * (this.types.length - 1)) / 2
        text = new Phaser.Text(game, x - xMul * 40, y, "Confirm:\n" + Keyboard.shortName(this.keys["confirm"][0]) + "\n" + Keyboard.shortName(this.keys["confirm"][1]))
        text.font = 'Arial'
        text.fontSize = 14
        text.fill = '#fff'
        text.align = textAlign
        text.anchor.setTo(textAnchor, 0.5)
        game.add.existing(text)

        // key for next item
        y = this.y + HEIGHT * this.types.length + MARGIN * (this.types.length - 1)

        text = new Phaser.Text(game, x - xMul * 40, y - 75, Keyboard.shortName(this.keys["next"]))
        text.font = 'Arial'
        text.fontSize = 14
        text.fill = '#fff'
        text.align = textAlign
        text.anchor.setTo(textAnchor, 1)
        game.add.existing(text)

        sprite = game.add.sprite(x - xMul * 25, y, "menu_player_down")
        sprite.anchor.setTo(0.5, 1)
    }

    /**
     * Add player images and names
     *
     * @private
     */
    _addPlayers() {
        let game = this.game

        let x = this.x
        let y = this.y

        this.playerSprites = []

        for (let i in this.types) {
            let type = this.types[i]
            // image
            let sprite = game.add.sprite(x + WIDTH / 2, y + HEIGHT - IMAGE_OFFSET, type + "_player")
            sprite.anchor.setTo(0.5, 1)
            this.playerSprites.push(sprite)

            let data = this.playerData[type]["sprite"]["left"]["animation"]
            sprite.animations.add('walk', util.animationFramesFromRange(data), data['rate'], true)

            // name
            let text = new Phaser.Text(game, x + WIDTH / 2, y + HEIGHT - TEXT_OFFSET, this.playerData[type]["name"])
            text.font = 'Paytone One'
            text.fontSize = 11
            text.fill = '#fff'
            text.anchor.setTo(0.5, 0)
            game.add.existing(text)

            y += HEIGHT + MARGIN
        }
    }
}
