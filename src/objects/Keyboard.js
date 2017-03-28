export default class {
    constructor(game, onKeyDown, onKeyUp) {
        this.game = game
        this.onKeyDown = onKeyDown
        this.onKeyUp = onKeyUp

        this.keyStates = []

        // register handlers for key down and key up events
        this.game.input.keyboard.addCallbacks(this, this._onKeyDown, this._onKeyUp);
    }

    /**
     * Handler for key down event
     *
     * @param char The key
     * @private
     */
    _onKeyDown(char) {
        let keyIsDown = char["code"] in this.keyStates && this.keyStates[char["code"]] == true

        if (!keyIsDown) {
            this.keyStates[char["code"]] = true
            this.onKeyDown.method.bind(this.onKeyDown.object)(char)
        }
    }

    /**
     * Handler for key up event
     *
     * @param char The key
     * @private
     */
    _onKeyUp(char) {
        let keyIsDown = char["code"] in this.keyStates && this.keyStates[char["code"]] == true

        if (keyIsDown) {
            this.keyStates[char["code"]] = false
            this.onKeyUp.method.bind(this.onKeyDown.object)(char)
        }
    }

    /**
     * Get the short name corresponding to a keyboard code
     *
     * @param code Character code
     * @returns {*}
     */
    static shortName(code) {
        let list = this._fixedList()

        if (code in list)
            return list[code]["short"]

        if (code.substring(0, 3) == "Key")
            return code.substring(3)

        return code
    }

    /**
     * Get the long name corresponding to a key code
     *
     * @param code Character code
     * @returns {*}
     */
    static longName(code) {
        let list = this._fixedList()

        if (code in list)
            return list[code]["long"]

        if (code.substring(0, 3) == "Key")
            return code.substring(3)

        return code
    }

    /**
     * Get the list of key code => short/long name correspondence
     *
     * @param code Character code
     * @returns {*}
     */
    static _fixedList() {
        return {
            ControlLeft: {
                short: "LCTRL",
                long: "Left CTRL",
            },
            ControlRight: {
                short: "RCTRL",
                long: "Right CTRL",
            },
            ShiftLeft: {
                short: "LSHIFT",
                long: "Left SHIFT",
            },
            ShiftRight: {
                short: "RSHIFT",
                long: "Right SHIFT",
            },
            ArrowLeft: {
                short: "Left",
                long: "Left ARROW",
            },
            ArrowRight: {
                short: "Right",
                long: "Right ARROW",
            },
            ArrowUp: {
                short: "Up",
                long: "Up ARROW",
            },
            ArrowDown: {
                short: "Down",
                long: "Down ARROW",
            },
        }
    }
}

