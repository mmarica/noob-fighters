import AbstractState from './Abstract'
import Phaser from 'phaser'
import * as util from '../utils'

export default class extends AbstractState {
    /**
     * Extract the winning player from parameters
     *
     * @param id
     * @param type
     */
    init (id, type) {
        let data = this.game.cache.getJSON("players")
        this.winningPlayer = "P" + (id + 1) + " " + data[type]["name"]
    }

    preload  () {
        this._addPreloadProgressBar()
    }

    create () {
        this._addBackground()
        this._addPlayerWins()
        this._addPressKeyToPlay()

        this.playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(this.playKeyDown, this)

        this.sound = this.game.add.audio("game_over")
        this.sound.play()
    }

    /**
     * Create the background gradient
     *
     * @private
     */
    _addBackground () {
        var myBitmap = this.game.add.bitmapData(1280, 800);
        var grd=myBitmap.context.createLinearGradient(0,0,0,500);
        grd.addColorStop(0,"#333333");
        grd.addColorStop(1,"#111111");
        myBitmap.context.fillStyle=grd;
        myBitmap.context.fillRect(0,0,1280,800);
        this.game.add.sprite(0, 0, myBitmap);
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
        text.fill = '#fa6121'
        text.stroke = '#000000';
        text.strokeThickness = 5;
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
        text.font = 'Arial'
        text.fontSize = 20
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Start to play again when pressing the key
     */
    playKeyDown () {
        this.game.sound.stopAll()
        this.game.state.start("Menu");
    }

}
