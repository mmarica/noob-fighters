import Phaser from 'phaser'

export default class {
    constructor ({ game, onKeyDown, onKeyUp }) {
        this.game = game
        this.onKeyDown = onKeyDown
        this.onKeyUp = onKeyUp

        this.keyStates = []

        this.game.input.keyboard.addCallbacks(this, this._onKeyDown, this._onKeyUp);
    }

    _onKeyDown (char) {
        let keyIsDown = char["code"] in this.keyStates && this.keyStates[char["code"]] == true

        if (!keyIsDown) {
            this.keyStates[char["code"]] = true
            this.onKeyDown.method.bind(this.onKeyDown.object)(char)
        }
    }

    _onKeyUp (char) {
        let keyIsDown = char["code"] in this.keyStates && this.keyStates[char["code"]] == true

        if (keyIsDown) {
            this.keyStates[char["code"]] = false
            this.onKeyUp.method.bind(this.onKeyDown.object)(char)
        }
    }
}

