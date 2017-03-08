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

        this.load.image('loaderBg', './assets/common/images/splash/loader-bg.png#!version!#')
        this.load.image('loaderBar', './assets/common/images/splash/loader-bar.png#!version!#')
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
