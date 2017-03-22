import Phaser from 'phaser'

export default class extends Phaser.Group {
    constructor ({ game, y, keys }) {
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
        this.selectionColors = [0xff7200, 0x5e2400]
        this.selectionColorIndex = 0

        // compute position and save keys
        this.x = game.world.centerX - (this.WIDTH * this.types.length + this.MARGIN * (this.types.length - 1)) / 2
        this. y = y
        this.keys = keys

        // select second playground by default
        this.selection = 1

        // add the playgrounds (image + name)
        this._addPlaygrounds()

        // add the selection rectangle
        this._addSelector()
    }

    // get the selected playground type
    getSelected () {
        return this.types[this.selection]
    }

    // add the selector to the stage and bind the keys
    _addSelector () {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this._drawSelectionRectangle()

        // register the timer to alternate the colors
        this.game.time.events.loop(150, this._drawSelectionRectangle, this);

        // select the previous playground from the list when pressing one of the "left" keys
        for (let key of this.keys["left"]) {
            let leftKey = this.game.input.keyboard.addKey(key);
            leftKey.onDown.add(
                function () {
                    this.selection = Math.max(this.selection - 1, 0)
                    this._updateSelectorPosition()
                }, this)
        }

        // select the next playground from the list when pressing one of the "right" keys
        for (let key of this.keys["right"]) {
            let rightKey = this.game.input.keyboard.addKey(key);
            rightKey.onDown.add(
                function () {
                    this.selection = Math.min(this.selection + 1, this.types.length - 1)
                    this._updateSelectorPosition()
                }, this)
        }
    }

    // draw the selection rectangle, alternating the colors
    _drawSelectionRectangle () {
        this.selectionColorIndex = 1 - this.selectionColorIndex
        this.selector.lineStyle(this.STROKE, this.selectionColors[this.selectionColorIndex])
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
        let playerName = new Phaser.Text(this.game, x, y, name)
        playerName.font = 'Paytone One'
        playerName.fontSize = 16
        playerName.fill = '#fff'
        playerName.anchor.setTo(0.5, 0)
        this.game.add.existing(playerName)
    }

    // load the assets
    static loadAssets (game) {
        let types = ["cemetery", "forest"]

        for (let type of types)
            game.load.spritesheet("menu_playground_" + type, "./assets/menu/images/playground_" + type + ".png?__version__", 200, 125);
    }
}
