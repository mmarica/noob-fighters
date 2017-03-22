import Phaser from 'phaser'
import PlaygroundSelector from '../objects/Menu/PlaygroundSelector'
import PlayerSelector from '../objects/Menu/PlayerSelector'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    preload  () {
        PlayerSelector.loadAssets(this.game)
        PlaygroundSelector.loadAssets(this.game)
    }

    create () {
        this._addBackground()
        this._addBanner()
        this._addPressKeyToPlay()
        this._addPlaygroundSelector()
        this._addP1Selector()
        this._addP2Selector()
        this._addP1Keys()
        this._addP2Keys()

        let playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        playKey.onDown.add(this.playKeyDown, this)
    }

    /**
     * Create the background gradient
     *
     * @private
     */
    _addBackground () {
        var myBitmap = this.game.add.bitmapData(1280, 800);
        var grd=myBitmap.context.createLinearGradient(0,0,0,500);
        grd.addColorStop(0,"#333333");
        grd.addColorStop(1,"#111111");
        myBitmap.context.fillStyle=grd;
        myBitmap.context.fillRect(0,0,1280,800);
        this.game.add.sprite(0, 0, myBitmap);
    }

    /**
     * Add playground selector
     *
     * @private
     */
    _addPlaygroundSelector () {
        this.playgroundSelector = this.game.add.existing(new PlaygroundSelector({
            game: this.game,
            y: 200,
            keys: {
                left: [Phaser.Keyboard.Z, Phaser.Keyboard.LEFT],
                right: [Phaser.Keyboard.C, Phaser.Keyboard.RIGHT],
            }
        }))
    }

    /**
     * Add player 1 selector
     *
     * @private
     */
    _addP1Selector () {
        this.p1Selector = this.game.add.existing(new PlayerSelector({
            game: this.game,
            x: 200,
            y: 200,
            keys: {
                up: Phaser.Keyboard.S,
                down: Phaser.Keyboard.X
            }
        }))
    }

    /**
     * Display the key bindings for player one
     *
     * @private
     */
    _addP1Keys () {
        this._addPlayerText(400, 400, "Player 1 keys\nLeft: Z\nRight: C\nJump: S\nDown: X\nPrimary: Left CTRL\nSecondary: Left SHIFT")
    }

    /**
     * Add player 2 selector
     *
     * @private
     */
    _addP2Selector () {
        this.p2Selector = this.game.add.existing(new PlayerSelector({
            game: this.game,
            x: 1000,
            y: 200,
            keys: {
                up: Phaser.Keyboard.UP,
                down: Phaser.Keyboard.DOWN,
            }
        }))
    }

    /**
     * Display the key bindings for player two
     *
     * @private
     */
    _addP2Keys () {
        this._addPlayerText(700, 400, "Player 2 keys\nLeft: Left ARROW\nRight: Right ARROW\nJump: Up ARROW\nDown: Down ARROW\nPrimary: Right CTRL\nSecondary: Right SHIFT")
    }

    /**
     * Common method for displaying text
     *
     * @param x
     * @param y
     * @param message
     * @private
     */
    _addPlayerText (x, y, message) {
        let text = new Phaser.Text(this.game, x, y, message)
        text.font = 'Arial'
        text.fontSize = 20
        text.padding.set(10, 5)
        text.fill = '#fff'
        this.game.add.existing(text)
    }

    /**
     * The game banner in the middle (just a text title, for the moment)
     *
     * @private
     */
    _addBanner () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, 40, "Noob Fighters!")
        text.font = 'Russo One'
        text.fontSize = 80
        text.padding.set(10, 16)
        text.fill = '#58cfff'
        text.stroke = '#000000';
        text.strokeThickness = 5;
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)
    }

    /**
     * Display the key for starting to play
     *
     * @private
     */
    _addPressKeyToPlay () {
        let text = new Phaser.Text(this.game, this.game.world.centerX, 140, "Choose your players and playground, then  press space to play")
        text.font = 'Arial'
        text.fontSize = 20
        text.fill = '#fff'
        text.anchor.setTo(0.5, 0)
        this.game.add.existing(text)
    }

    /**
     * Start game when pressing the play key
     */
    playKeyDown () {
        let types = [
            this.p1Selector.getSelected(),
            this.p2Selector.getSelected(),
        ]

        let map = this.playgroundSelector.getSelected()
        this.game.state.start("Game", true, false, types, map);
    }

}
