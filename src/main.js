import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import MenuState from './states/Menu'
import GameState from './states/Game'
import GameOverState from './states/GameOver'

import config from './config'

class Game extends Phaser.Game {

    constructor () {
        const docElement = document.documentElement
        const width = config.gameWidth
        const height = config.gameHeight

        super(width, height, Phaser.CANVAS, 'content', null)

        this.state.add('Boot', BootState, false)
        this.state.add('Splash', SplashState, false)
        this.state.add('Menu', MenuState, false)
        this.state.add('Game', GameState, false)
        this.state.add('GameOver', GameOverState, false)

        this.state.start('Boot')
    }
}

window.game = new Game()
