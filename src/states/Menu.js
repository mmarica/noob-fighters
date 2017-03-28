import AbstractState from './Abstract'
import AssetLoader from '../objects/AssetLoader'
import Phaser from 'phaser'
import PlaygroundSelector from '../objects/Menu/PlaygroundSelector'
import PlayerSelector from '../objects/Menu/PlayerSelector'
import Keyboard from '../objects/Keyboard'
import * as util from '../utils'

export default class extends AbstractState {
    preload() {
        this._addPreloadProgressBar()

        AssetLoader.loadPlayerSelector()
        AssetLoader.loadPlaygroundSelector()

        this.keys = game.cache.getJSON("config")["keys"]
    }

    create() {
        this._addBackground()
        this._addHeader()
        this._addSelectors()
        this._addPlayersKeyInfo()
        this._initKeyboard()
    }

    /**
     * Create the background gradient
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
            "previous": [this.keys["p1"]["left"], this.keys["p2"]["left"]],
            "next": [this.keys["p1"]["right"], this.keys["p2"]["right"]],
        }
        this.playgroundSelector = this.game.add.existing(new PlaygroundSelector(this.game, 200, pgKeys))

        let p1Keys = {
            "previous": this.keys["p1"]["up"],
            "next": this.keys["p1"]["down"],
            "confirm": [
                this.keys["p1"]["fire_primary"],
                this.keys["p1"]["fire_secondary"],
            ],
        }
        this.p1Selector = this.game.add.existing(new PlayerSelector(this.game, 200, 200, p1Keys, "left"))

        let p2Keys = {
            "previous": this.keys["p2"]["up"],
            "next": this.keys["p2"]["down"],
            "confirm": [
                this.keys["p2"]["fire_primary"],
                this.keys["p2"]["fire_secondary"],
            ],
        }
        this.p2Selector = this.game.add.existing(new PlayerSelector(this.game, 1000, 200, p2Keys, "right"))
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
        this._addPlayerKeysText(400, 450, text)

        text = "Player 2 keys"
            + "\nLeft: " + Keyboard.longName(this.keys["p2"]["left"])
            + "\nRight: " + Keyboard.longName(this.keys["p2"]["right"])
            + "\nJump: " + Keyboard.longName(this.keys["p2"]["up"])
            + "\nDown: " + Keyboard.longName(this.keys["p2"]["down"])
            + "\nPrimary: " + Keyboard.longName(this.keys["p2"]["fire_primary"])
            + "\nSecondary: " + Keyboard.longName(this.keys["p2"]["fire_secondary"])
        this._addPlayerKeysText(700, 450, text)

    }

    /**
     * Displaying player keys
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

        let text = new Phaser.Text(this.game, this.game.world.centerX, 140, "Select both players to start")
        text.font = 'Arial'
        text.fontSize = 20
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)
    }

    /**
     * Initialize the keyboard binding
     *
     * @private
     */
    _initKeyboard() {
        this.keyboard = new Keyboard({
            game: game,
            onKeyDown: {
                object: this,
                method: this._onKeyDown,
            },
            onKeyUp: {
                object: this,
                method: function () {},
            },
        })
    }

    _onKeyDown(char) {
        switch (char["code"]) {
            // player 1 selector keys
            case this.keys["p1"]["up"]:
                this.p1Selector.previous()
                break

            case this.keys["p1"]["down"]:
                this.p1Selector.next()
                break

            case this.keys["p1"]["fire_primary"]:
            case this.keys["p1"]["fire_secondary"]:
                this.p1Selector.confirm()
                this.checkGameStart()
                break

            // player 2 selector keys
            case this.keys["p2"]["up"]:
                this.p2Selector.previous()
                break

            case this.keys["p2"]["down"]:
                this.p2Selector.next()
                break

            case this.keys["p2"]["fire_primary"]:
            case this.keys["p2"]["fire_secondary"]:
                this.p2Selector.confirm()
                this.checkGameStart()
                break

            // playground selector keys
            case this.keys["p1"]["left"]:
            case this.keys["p2"]["left"]:
                this.playgroundSelector.previous()
                break

            case this.keys["p1"]["right"]:
            case this.keys["p2"]["right"]:
                this.playgroundSelector.next()
                break
        }
    }

    /**
     * Check if both player have been chosen, so we can start the ganme
     */
    checkGameStart() {
        if (!this.p1Selector.isConfirmed() || !this.p2Selector.isConfirmed())
            return

        this.game.state.start("Game", true, false,
            [this.p1Selector.getSelected(), this.p2Selector.getSelected()],
            this.playgroundSelector.getSelected());
    }
}
