import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    /**
     * Extract the winning player from parameters
     *
     * @param winningPlayerType
     */
    init (winningPlayerType) {
        let data = this.game.cache.getJSON("players")
        this.winningPlayer = data[winningPlayerType]["name"]
    }

    create () {
        this._addPlayerWins()
        this._addPressKeyToPlay()

        this.playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(this.playKeyDown, this)

        this.sound = this.game.add.audio("game_over")
        this.sound.play()
    }

    /**
     * Add winning player text
     *
     * @private
     */
    _addPlayerWins () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY, this.winningPlayer + " wins!")
        text.font = 'Russo One'
        text.fontSize = 80
        text.padding.set(10, 16)
        text.fill = '#fbff00'
        text.smoothed = true
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Add press key to play again text
     *
     * @private
     */
    _addPressKeyToPlay () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY + 80, "Press space for the menu")
        text.font = 'Russo One'
        text.fontSize = 20
        text.fill = '#fff'
        text.shadow = 2;
        text.smoothed = true
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Start to play again when pressing the key
     */
    playKeyDown () {
        this.game.state.start("Menu");
    }

}
