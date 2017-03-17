import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    create () {
        this._addBanner()
        this._addPressKeyToPlay()
        this._addP1Keys()
        this._addP2Keys()

        let playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        playKey.onDown.add(this.playKeyDown, this)
    }

    /**
     * The game banner in the middle (just a text title, for the moment)
     *
     * @private
     */
    _addBanner () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY - 200, "Noob Fighters!")
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
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY - 120, "Press space to play")
        text.font = 'Russo One'
        text.fontSize = 20
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Display the key bindings for player one
     *
     * @private
     */
    _addP1Keys () {
        let x = 300
        let y = this.game.world.centerY - 50
        this._addPlayerText(x, y, "Player 1 keys\nLeft: Z\nRight: C\nJump: S\nPrimary: Left CTRL\nSecondary: Left SHIFT")
    }

    /**
     * Display the key bindings for player two
     *
     * @private
     */
    _addP2Keys () {
        let x = this.game.world.centerX + 140
        let y = this.game.world.centerY - 50
        this._addPlayerText(x, y, "Player 2 keys\nLeft: Left ARROW\nRight: Right ARROW\nJump: Up ARROW\nPrimary: Right CTRL\nSecondary: Right SHIFT")
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
     * Start game when pressing the play key
     */
    playKeyDown () {
        this.game.state.start("Game");
    }

}
