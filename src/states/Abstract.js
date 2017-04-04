import Phaser from 'phaser'
import Keyboard from '../objects/Keyboard'

export default class extends Phaser.State {
    /**
     * Add the progress bar during preload
     *
     * @private
     */
    _addPreloadProgressBar () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBg.anchor.setTo(0.5)

        let image = this.game.cache.getImage('loaderBar')
        this.loaderBar = this.add.sprite(this.game.world.centerX - image.width / 2, this.game.world.centerY, 'loaderBar')
        this.loaderBar.anchor.setTo(0, 0.5)
        this.load.setPreloadSprite(this.loaderBar)
    }

    /**
     * Initialize the keyboard object
     *
     * @private
     */
    _initKeyboard()
    {
        this.game.keyboard = new Keyboard(this.game)
    }

    /**
     * Display FPS is in dev mode
     */
    render() {
        if (__DEV__)
            this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00")
    }
}
