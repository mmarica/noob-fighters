import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor ({ game, y }) {
        super(game)

        // sizing constants
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
        this.selectionColorIndex = 0

        // compute position
        this.x = game.world.centerX - (this.WIDTH * this.types.length + this.MARGIN * (this.types.length - 1)) / 2
        this. y = y

        // select second playground by default
        this.selection = 1

        // sound to play when selection changes
        this.changeSelectionSound = this.game.add.audio("menu_playground_change")

        // add the playgrounds (image + name)
        this._addPlaygrounds()

        // add the selection rectangle
        this._addSelector()
    }

    // select the previous playground from the list
    previous () {
        let current = this.selection
        this.selection = Math.max(this.selection - 1, 0)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    // select the next playground from the list
    next () {
        let current = this.selection
        this.selection = Math.min(this.selection + 1, this.types.length - 1)

        if (current != this.selection) {
            this._updateSelectorPosition()
            this.changeSelectionSound.play()
        }
    }

    // get the selected playground type
    getSelected () {
        return this.types[this.selection]
    }

    // add the selector to the stage
    _addSelector () {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this._drawSelectionRectangle()

        // register the timer to alternate the colors
        this.game.time.events.loop(150, this._drawSelectionRectangle, this);
    }

    // draw the selection rectangle, alternating the colors
    _drawSelectionRectangle () {
        this.selectionColorIndex = 1 - this.selectionColorIndex
        this.selector.lineStyle(this.STROKE, this.alternatingColors[this.selectionColorIndex])
        this.selector.drawRect(0, 0, this.WIDTH + this.STROKE, this.HEIGHT + this.STROKE)
    }

    // move the selection rectangle on the currently selected item
    _updateSelectorPosition () {
        this.selector.x = this.x + (this.WIDTH + this.MARGIN) * this.selection - this.STROKE / 2
        this.selector.y = this.y - this.STROKE / 2
    }

    // add playground images and names
    _addPlaygrounds () {
        let x = this.x
        let y = this.y

        for (let type of this.types) {
            let sprite = this.game.add.sprite(x, y, "menu_playground_" + type)
            this._addName(x + this.WIDTH / 2, y + this.HEIGHT + this.MARGIN, this.names[type])
            x += this.WIDTH + this.MARGIN
        }
    }

    // add the playground name
    _addName (x, y, name) {
        let text = new Phaser.Text(this.game, x, y, name)
        text.font = 'Paytone One'
        text.fontSize = 16
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)
    }
}
