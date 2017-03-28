import Phaser from 'phaser'
import Ground from './Forest/Ground'
import RockLedge from './Forest/Ledge/RockLedge'
import GrassLedge from './Forest/Ledge/GrassLedge'

export default class extends Phaser.Group {
    constructor (game) {
        super(game)
        this.enableBody = true

        this._addBackground()
        this._addVisualElements()
        this._addSound()
    }

    /**
     * Get the list of positions for power-ups
     *
     * @returns {[]}
     */
    getPowerupSpots() {
        return [
            {x: 98, y: 286},
            {x: 1216, y: 286},
            {x: 1216, y: 470},
            {x: 400, y: 470},
            {x: 16, y: 620},
            {x: 996, y: 620},
            {x: 656, y: 648},
            {x: 16, y: 776},
            {x: 1264, y: 776},
        ]
    }

    /**
     * Get the list of obstacles
     *
     * @returns {[]}
     */
    getObstacles () {
        return [this.ground, ...this.rocks, ...this.rock_ledges, ...this.grass_ledges]
    }

    /**
     * Add the background
     *
     * @private
     */
    _addBackground() {
        let game = this.game

        // background image
        game.add.sprite(0, 0, 'forest_bg')

        // add the clouds
        this.clouds = [
            game.add.tileSprite(0, 70, 1280, 150, 'forest_clouds1'),
            game.add.tileSprite(0, 200, 1280, 116, 'forest_clouds2')
        ]

        // ... and make them move
        game.time.events.loop(50,
            function () {
                for (let i in this.clouds) {
                    this.clouds[i].tilePosition.x -= i * 0.5 + 0.3
                    this.clouds[i].tilePosition.x = this.clouds[i].tilePosition.x % this.clouds[i].width
                }
            },
            this
        );
    }

    /**
     * Add visual elements
     *
     * @private
     */
    _addVisualElements() {
        this.rocks = []
        this.rock_ledges = []
        this.grass_ledges = []

        this._level0()
        this._level1()
        this._level2()
        this._level3()
        this._level4()
    }

    /**
     * Ground level
     *
     * @private
     */
    _level0() {
        let game = this.game

        this.ground = game.add.existing(new Ground(game))

        // rock structure in the middle
        let coords = [
            [game.world.centerX - 64 * 2 + 32, game.world.height - 64 - 24],
            [game.world.centerX - 64 + 32, game.world.height - 64 - 24],
            [game.world.centerX + 32, game.world.height - 64 - 24],
            // upper...
            [game.world.centerX - 64 + 32, game.world.height - 128 - 24],
            [game.world.centerX + 32, game.world.height - 128 - 24],
            // upper...
            [game.world.centerX + 32, game.world.height - 192 - 24],
        ]

        for (let coord of coords) {
            let sprite = game.add.sprite(coord[0], coord[1], "forest_rock")
            game.physics.arcade.enable(sprite)
            sprite.body.immovable = true
            this.rocks.push(sprite)
        }
    }

    /**
     * First level above ground
     *
     * @private
     */
    _level1() {
        let game = this.game

        // left
        let ledge = game.add.existing(new RockLedge(game, 0, 620, 2))
        this.rock_ledges.push(ledge)

        // right
        ledge = game.add.existing(new RockLedge(game, 900, 620, 3))
        this.rock_ledges.push(ledge)
    }

    /**
     * Second level above ground
     *
     * @private
     */
    _level2() {
        let game = this.game

        // left
        let ledge = game.add.existing(new RockLedge(game, 300, 470, 3))
        this.rock_ledges.push(ledge)

        // right
        ledge = game.add.existing(new RockLedge(game,1152, 470, 2))
        this.rock_ledges.push(ledge)
    }

    /**
     * Third level above ground
     *
     * @private
     */
    _level3() {
        let game = this.game

        // left
        let ledge = game.add.existing(new GrassLedge(game, 64 * 4, 360, 1))
        ledge.horizontalMovement (0, 200, 50, "right")
        this.grass_ledges.push(ledge)

        // center
        ledge = game.add.existing(new GrassLedge(game, 640, 360, 2))
        ledge.verticalMovement (70, 100, 50, "down")
        this.grass_ledges.push(ledge)

        // right
        ledge = game.add.existing(new GrassLedge(game, 1100, 360, 1))
        ledge.horizontalMovement (200, 0, 50, "left")
        this.grass_ledges.push(ledge)
    }

    /**
     * Fourth level above ground
     *
     * @private
     */
    _level4() {
        let game = this.game

        // left
        let ledge = game.add.existing(new GrassLedge(game, 0, 286, 4))
        this.grass_ledges.push(ledge)

        // right
        ledge = game.add.existing(new GrassLedge(game, 1152, 286, 2))
        this.grass_ledges.push(ledge)
    }

    /**
     * Add ambient sound
     *
     * @private
     */
    _addSound() {
        let music = this.game.add.audio('forest_ambient')
        music.play('', 0, 0.2, true)
    }
}
