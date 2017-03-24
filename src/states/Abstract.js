import Phaser from 'phaser'

export default class extends Phaser.State {
    /**
     * Add the progress bar during preload
     *
     * @private
     */
    _addPreloadProgressBar () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBg.anchor.setTo(0.5)

        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        this.loaderBar.anchor.setTo(0.5)

        this.load.setPreloadSprite(this.loaderBar)
    }
}
