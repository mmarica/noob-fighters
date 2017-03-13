import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {

    init () {}

    preload () {}

    create () {
        this._addBanner()
        this._addPressKeyToPlay()

        this.playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(this.playKeyDown, this)
    }

    update() {}

    _addBanner () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY, "Noob Fighters!")
        text.font = 'Russo One'
        text.fontSize = 80
        text.padding.set(10, 16)
        text.fill = '#fbff00'
        text.smoothed = true
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    _addPressKeyToPlay () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY + 80, "Press space to play")
        text.font = 'Russo One'
        text.fontSize = 20
        text.fill = '#fff'
        text.shadow = 2;
        text.smoothed = true
        text.anchor.setTo(0.5, 0.5)
        this.game.add.existing(text)
    }

    playKeyDown () {
        this.game.state.start("Game");
    }

}
