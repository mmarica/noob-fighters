import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {

    init () {}

    preload () {}

    create () {
        this._addBanner()
        this._addPressKeyToPlay()
        this._addP1Keys()
        this._addP2Keys()

        this.playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(this.playKeyDown, this)
    }

    update() {}

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

    _addPressKeyToPlay () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY - 120, "Press space to play")
        text.font = 'Russo One'
        text.fontSize = 20
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    _addP1Keys () {
        let x = 300
        let y = this.game.world.centerY - 50
        const SPACING = 35;

        this._addPlayerText(x, y, "Player 1 keys\nLeft: Z\nRight: C\nJump: S\nPrimary: Left CTRL\nSecondary: Left SHIFT")
    }

    _addP2Keys () {
        let x = this.game.world.centerX + 140
        let y = this.game.world.centerY - 50
        const SPACING = 35;

        this._addPlayerText(x, y, "Player 2 keys\nLeft: Left ARROW\nRight: Right ARROW\nJump: Up ARROW\nPrimary: Right CTRL\nSecondary: Right SHIFT")
    }

    _addPlayerText (x, y, message) {
        let text = new Phaser.Text(this.game, x, y, message)
        text.font = 'Russo One'
        text.fontSize = 20
        text.padding.set(10, 5)
        text.fill = '#fff'
        this.game.add.existing(text)
    }

    playKeyDown () {
        this.game.state.start("Game");
    }

}
