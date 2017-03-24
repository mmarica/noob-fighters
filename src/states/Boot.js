import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
    init () {
        this.stage.backgroundColor = '#000'
        this.fontsReady = false
        this.fontsLoaded = this.fontsLoaded.bind(this)
    }

    preload () {
        WebFont.load({
            google: {
                families: ['Paytone One', 'Russo One']
            },
            active: this.fontsLoaded
        })

        let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
        text.anchor.setTo(0.5, 0.5)

        this.load.image('loaderBg', './assets/common/images/loader-bg.png?__version__')
        this.load.image('loaderBar', './assets/common/images/loader-bar.png?__version__')
    }

    create () {
        // capture all letter, arrow and control keys, just to be sure
        this.game.input.keyboard.addKeyCapture([
            Phaser.KeyCode.Q, Phaser.KeyCode.W, Phaser.KeyCode.E, Phaser.KeyCode.R, Phaser.KeyCode.T, Phaser.KeyCode.Y, Phaser.KeyCode.U, Phaser.KeyCode.I, Phaser.KeyCode.O, Phaser.KeyCode.P,
            Phaser.KeyCode.A, Phaser.KeyCode.S, Phaser.KeyCode.D, Phaser.KeyCode.F, Phaser.KeyCode.G, Phaser.KeyCode.H, Phaser.KeyCode.J, Phaser.KeyCode.K, Phaser.KeyCode.L,
            Phaser.KeyCode.Z, Phaser.KeyCode.X, Phaser.KeyCode.C, Phaser.KeyCode.V, Phaser.KeyCode.B, Phaser.KeyCode.N, Phaser.KeyCode.M,
            Phaser.KeyCode.UP, Phaser.KeyCode.DOWN, Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT,
            Phaser.KeyCode.CONTROL,  Phaser.KeyCode.ALT, Phaser.KeyCode.SHIFT,
        ])
    }

    render () {
        if (this.fontsReady) {
            this.state.start('Splash')
        }
    }

    fontsLoaded () {
        this.fontsReady = true
    }

}
