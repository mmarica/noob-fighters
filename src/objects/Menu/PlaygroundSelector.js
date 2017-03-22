import Phaser from 'phaser'
import Player from '../Player'

export default class extends Phaser.Group {
    constructor ({ game, y, keys }) {
        super(game)

        this.WIDTH = 200
        this.HEIGHT = 125
        this.MARGIN = 10
        this.STROKE = 2
        this.types = ["cemetery", "forest"]
        this.names = {
            cemetery: "Cemetery",
            forest: "Forest",
        }

        this.x = game.world.centerX - (this.WIDTH * this.types.length + this.MARGIN * (this.types.length - 1)) / 2
        this. y = y
        this.keys = keys

        this.selection = 1


        this._addSelector()
        this._addPlaygrounds()
    }

    _addSelector () {
        this.selector = this.game.add.graphics()
        this._updateSelectorPosition()
        this.selector.lineStyle(this.STROKE, 0xFFFFFF)
        this.selector.beginFill(0x000000)
        this.selector.drawRect(0, 0, this.WIDTH + this.STROKE, this.HEIGHT + this.STROKE)

        for (let key of this.keys["left"]) {
            let leftKey = this.game.input.keyboard.addKey(key);
            leftKey.onDown.add(this.pressedLeft, this)
        }

        for (let key of this.keys["right"]) {
            let rightKey = this.game.input.keyboard.addKey(key);
            rightKey.onDown.add(this.pressedRight, this)
        }
    }

    pressedLeft () {
        this.selection = Math.max(this.selection - 1, 0)
        this._updateSelectorPosition()
    }

    pressedRight () {
        this.selection = Math.min(this.selection + 1, this.types.length - 1)
        this._updateSelectorPosition()
    }

    _updateSelectorPosition () {
        this.selector.x = this.x + (this.WIDTH + this.MARGIN) * this.selection - 1
        this.selector.y = this.y - 1
    }

    _addPlaygrounds () {
        let x = this.x
        let y = this.y

        for (let type of this.types) {
            let sprite = this.game.add.sprite(x, y, "menu_playground_" + type)

            this._addPlaygroundName(x + this.WIDTH / 2, y + this.HEIGHT + 25, this.names[type])

            x += this.WIDTH + this.MARGIN
        }
    }

    _addPlaygroundName (x, y, name) {
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
        let types = ["cemetery", "forest"]

        for (let type of types)
            game.load.spritesheet("menu_playground_" + type, "./assets/menu/images/playground_" + type + ".png?__version__", 200, 125);
    }
}
