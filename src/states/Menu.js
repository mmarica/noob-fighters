import Phaser from 'phaser'
import PlayerSelector from '../objects/Menu/PlayerSelector'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    preload  () {
        PlayerSelector.loadAssets(this.game)
    }

    create () {
        this._addBanner()
        this._addPressKeyToPlay()
        this._addP1Selector()
        this._addP2Selector()
        this._addP1Keys()
        this._addP2Keys()

        let playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        playKey.onDown.add(this.playKeyDown, this)
    }

    /**
     * Add player 1 selector
     *
     * @private
     */
    _addP1Selector () {
        this.p1Selector = this.game.add.existing(new PlayerSelector({
            game: this.game,
            x: 200,
            y: 250,
            keys: {
                up: Phaser.Keyboard.S,
                down: Phaser.Keyboard.X,
            }
        }))
    }

    /**
     * Display the key bindings for player one
     *
     * @private
     */
    _addP1Keys () {
        this._addPlayerText(400, 280, "Player 1 keys\nLeft: Z\nRight: C\nJump: S\nPrimary: Left CTRL\nSecondary: Left SHIFT")
    }

    /**
     * Add player 2 selector
     *
     * @private
     */
    _addP2Selector () {
        this.p2Selector = this.game.add.existing(new PlayerSelector({
            game: this.game,
            x: 1000,
            y: 250,
            keys: {
                up: Phaser.Keyboard.UP,
                down: Phaser.Keyboard.DOWN,
            }
        }))
    }

    /**
     * Display the key bindings for player two
     *
     * @private
     */
    _addP2Keys () {
        this._addPlayerText(700, 280, "Player 2 keys\nLeft: Left ARROW\nRight: Right ARROW\nJump: Up ARROW\nPrimary: Right CTRL\nSecondary: Right SHIFT")
    }

    /**
     * Common method for displaying text
     *
     * @param x
     * @param y
     * @param message
     * @private
     */
    _addPlayerText (x, y, message) {
        let text = new Phaser.Text(this.game, x, y, message)
        text.font = 'Russo One'
        text.fontSize = 20
        text.padding.set(10, 5)
        text.fill = '#fff'
        this.game.add.existing(text)
    }

    /**
     * The game banner in the middle (just a text title, for the moment)
     *
     * @private
     */
    _addBanner () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, 120, "Noob Fighters!")
        text.font = 'Russo One'
        text.fontSize = 80
        text.padding.set(10, 16)
        text.fill = '#fbff00'
        text.smoothed = true
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Display the key for starting to play
     *
     * @private
     */
    _addPressKeyToPlay () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, 190, "Choose your players and press space to play")
        text.font = 'Russo One'
        text.fontSize = 20
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Start game when pressing the play key
     */
    playKeyDown () {
        let types = [
            this.p1Selector.getSelected(),
            this.p2Selector.getSelected(),
        ]
        this.game.state.start("Game", true, false, types);
    }

}
