import AbstractState from './Abstract'
import Phaser from 'phaser'

export default class extends AbstractState {
    /**
     * Extract state parameters and build the game over message
     *
     * @param p1Name   Name of player 1
     * @param p1Health Health of player 1
     * @param p2Name   Name of player 2
     * @param p2Health Health of player 2
     */
    init(p1Name, p1Health, p2Name, p2Health) {
        if (p1Health == p2Health) {
            this.message = "Draw game.\nYou both are really big noobs!"
            return
        }

        if (p1Health == 0) {
            this.message = p2Name + (p1Name == p2Name ? " (right)" : "") + " wins!\n" + p1Name + (p1Name == p2Name ? " (left)" : "") + " is the big noob now."
            return
        }

        this.message = p1Name + (p1Name == p2Name ? " (left)" : "") + " wins!\n" + p2Name + (p1Name == p2Name ? " (right)" : "") + " is the big noob now."
    }

    /**
     * Load assets
     */
    preload() {
        this._addPreloadProgressBar()
        this.game.load.audio('game_over', './assets/common/sounds/game_over.mp3?__version__');
    }

    /**
     * Scene initialization stuff
     */
    create() {
        this._addBackground()
        this._addMainMessage()
        this._addPressKeyForMenu()
        this._registerMenuKey()
        this._playGameOverSound()
    }

    /**
     * Add the background
     *
     * @private
     */
    _addBackground() {
        var myBitmap = this.game.add.bitmapData(1280, 800);
        var grd=myBitmap.context.createLinearGradient(0,0,0,500);
        grd.addColorStop(0,"#333333");
        grd.addColorStop(1,"#111111");
        myBitmap.context.fillStyle=grd;
        myBitmap.context.fillRect(0,0,1280,800);
        this.game.add.sprite(0, 0, myBitmap);
    }

    /**
     * Add the game over message to the scene
     *
     * @private
     */
    _addMainMessage() {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY - 50, this.message)
        text.font = 'Russo One'
        text.fontSize = 50
        text.padding.set(10, 16)
        text.fill = '#fa6121'
        text.align = 'center'
        text.stroke = '#000000';
        text.strokeThickness = 5;
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Add press key to go to menu text
     *
     * @private
     */
    _addPressKeyForMenu() {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY + 80, "Press space for the menu")
        text.font = 'Arial'
        text.fontSize = 30
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    /**
     * Register the key for going back to the start menu
     *
     * @private
     */
    _registerMenuKey() {
        this.playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(
            function () {
                this.game.sound.stopAll()
                this.game.state.start("Menu");
            },
            this
        )
    }

    /**
     * Play the game over sound
     *
     * @private
     */
    _playGameOverSound() {
        let sound = this.game.add.audio("game_over")
        sound.play()
    }
}
