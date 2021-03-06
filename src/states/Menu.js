import AbstractState from './Abstract'
import AssetLoader from '../objects/AssetLoader'
import Phaser from 'phaser'
import PlaygroundSelector from '../objects/Menu/PlaygroundSelector'
import PlayerSelector from '../objects/Menu/PlayerSelector'
import Keyboard from '../objects/Keyboard'

export default class extends AbstractState {
    /**
     * Load assets
     */
    preload() {
        this._addPreloadProgressBar()

        AssetLoader.loadPlayerSelector()
        AssetLoader.loadPlaygroundSelector()

        this.keys = this.game.cache.getJSON("config")["keys"]
    }

    /**
     * Create the stage
     */
    create() {
        this._initKeyboard()
        this._addBackground()
        this._addHeader()
        this._addSelectors()
        this._addPlayersKeyInfo()
    }

    /**
     * Create the background
     *
     * @private
     */
    _addBackground() {
        let bg = this.game.add.bitmapData(1280, 800);
        var gradient = bg.context.createLinearGradient(0,0,0,500);
        gradient.addColorStop(0,"#333333");
        gradient.addColorStop(1,"#111111");
        bg.context.fillStyle = gradient;
        bg.context.fillRect(0,0,1280,800);
        this.game.add.sprite(0, 0, bg);
    }

    /**
     * Add playground and player selectors
     *
     * @private
     */
    _addSelectors() {
        let pgKeys = {
            "left": [this.keys["p1"]["left"], this.keys["p2"]["left"]],
            "right": [this.keys["p1"]["right"], this.keys["p2"]["right"]],
        }
        this.playgroundSelector = this.game.add.existing(new PlaygroundSelector(this.game, 230, pgKeys))

        this.p1Selector = this.game.add.existing(new PlayerSelector(this.game, 200, 200, this.keys["p1"], "left"))
        this.p2Selector = this.game.add.existing(new PlayerSelector(this.game, 1000, 200, this.keys["p2"], "right"))
    }

    /**
     * Display the key bindings for players
     *
     * @private
     */
    _addPlayersKeyInfo() {
        let text = "Player 1 keys"
            + "\nLeft: " + Keyboard.longName(this.keys["p1"]["left"])
            + "\nRight: " + Keyboard.longName(this.keys["p1"]["right"])
            + "\nJump: " + Keyboard.longName(this.keys["p1"]["up"])
            + "\nDown: " + Keyboard.longName(this.keys["p1"]["down"])
            + "\nPrimary: " + Keyboard.longName(this.keys["p1"]["fire_primary"])
            + "\nSecondary: " + Keyboard.longName(this.keys["p1"]["fire_secondary"])
        this._addPlayerKeysText(400, 480, text)

        text = "Player 2 keys"
            + "\nLeft: " + Keyboard.longName(this.keys["p2"]["left"])
            + "\nRight: " + Keyboard.longName(this.keys["p2"]["right"])
            + "\nJump: " + Keyboard.longName(this.keys["p2"]["up"])
            + "\nDown: " + Keyboard.longName(this.keys["p2"]["down"])
            + "\nPrimary: " + Keyboard.longName(this.keys["p2"]["fire_primary"])
            + "\nSecondary: " + Keyboard.longName(this.keys["p2"]["fire_secondary"])
        this._addPlayerKeysText(700, 480, text)

    }

    /**
     * Display text about keys for one player
     *
     * @param x       Horizontal position
     * @param y       Vertical position
     * @param message Text to display
     * @private
     */
    _addPlayerKeysText(x, y, message) {
        let text = new Phaser.Text(this.game, x, y, message)
        text.font = 'Arial'
        text.fontSize = 20
        text.padding.set(10, 5)
        text.fill = '#fff'
        this.game.add.existing(text)
    }

    /**
     * The text in the top
     *
     * @private
     */
    _addHeader() {
        let title = new Phaser.Text(this.game, this.game.world.centerX, 40, "Noob Fighters!")
        title.font = 'Russo One'
        title.fontSize = 80
        title.padding.set(10, 16)
        title.fill = '#58cfff'
        title.stroke = '#000000';
        title.strokeThickness = 5;
        title.anchor.setTo(0.5, 0)
        this.game.add.existing(title)

        let text = new Phaser.Text(this.game, this.game.world.centerX, 160, "Select both players to start")
        text.font = 'Arial'
        text.fontSize = 30
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)
    }

    /**
     * Update event handler
     */
    update() {
        // check if both players have been chosen, so we can start the ganme
        if (!this.p1Selector.isConfirmed() || !this.p2Selector.isConfirmed())
            return

        this.game.state.start("Game", true, false,
            [this.p1Selector.getSelected(), this.p2Selector.getSelected()],
            this.playgroundSelector.getSelected());
    }
}
