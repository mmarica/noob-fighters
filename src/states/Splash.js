import AbstractState from './Abstract'

export default class extends AbstractState {
    /**
     * Load common resources
     */
    preload() {
        this._addPreloadProgressBar()
        this.load.json('config', 'data/config.json?__version__')
        this.load.json('players', 'data/players.json?__version__')
    }

    /**
     * Go to the start menu when common resources are loaded
     */
    create() {
        this.state.start('Menu')
    }
}
