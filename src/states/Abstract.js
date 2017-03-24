import Phaser from 'phaser'
import * as util from '../utils'

export default class extends Phaser.State {
    /**
     * Add the progress bar during preload
     *
     * @private
     */
    _addPreloadProgressBar () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        util.centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)
    }
}
