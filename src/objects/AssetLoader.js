import * as util from '../utils'
import PlaygroundManager from './PlaygroundManager'

export default class {
    static setGame (game) {
        this.game = game
    }

    /**
     * Load assets for specified player type
     *
     * @param type Player type
     */
    static loadPlayer(type) {
        if (this._isLoaded("player_" + type))
            return

        let game = this.game
        let player = game.cache.getJSON("players")[type]

        game.load.spritesheet(type + "_player" , "./assets/players/" + type + "/images/player.png?__version__", player["sprite"]["width"], player["sprite"]["height"])
        game.load.audio(type + "_hurt", "./assets/players/" + type + "/sounds/hurt.mp3?__version__");

        //primary weapon
        game.load.image(type + "_primary_bullet", "./assets/players/" + type + "/images/primary_bullet.png?__version__")
        game.load.audio(type + "_primary_shoot", "./assets/players/" + type + "/sounds/primary_shoot.mp3?__version__");

        let sw = player["weapons"]["secondary"]

        //secondary weapon
        game.load.image(type + "_secondary_bullet", "./assets/players/" + type + "/images/secondary_bullet.png?__version__")
        game.load.spritesheet(type + "_secondary_explosion", "./assets/players/" + type + "/images/secondary_explosion.png?__version__", sw["sprite"]["width"], sw["sprite"]["height"]);
        game.load.audio(type + "_secondary_shoot", "./assets/players/" + type + "/sounds/secondary_shoot.mp3?__version__");
        game.load.audio(type + "_secondary_explode", "./assets/players/" + type + "/sounds/secondary_explode.mp3?__version__");
    }

    /**
     * Load assets for specified playground type
     *
     * @param type Playground type
     */
    static loadPlayground(type) {
        if (this._isLoaded("playground_" + type))
            return

        let game = this.game

        switch (type) {
            case "cemetery":
                game.load.image('cemetery_bg', './assets/playgrounds/cemetery/images/bg.png?__version__')
                game.load.image('cemetery_clouds', './assets/playgrounds/cemetery/images/clouds.png?__version__')
                game.load.image('cemetery_ground', './assets/playgrounds/cemetery/images/ground.png?__version__')
                game.load.image('cemetery_ledge_left', './assets/playgrounds/cemetery/images/ledge_left.png?__version__')
                game.load.image('cemetery_ledge_center', './assets/playgrounds/cemetery/images/ledge_center.png?__version__')
                game.load.image('cemetery_ledge_right', './assets/playgrounds/cemetery/images/ledge_right.png?__version__')
                game.load.image('cemetery_crate', './assets/playgrounds/cemetery/images/crate.png?__version__')
                game.load.image('cemetery_tree', './assets/playgrounds/cemetery/images/tree.png?__version__')
                game.load.image('cemetery_bush1', './assets/playgrounds/cemetery/images/bush1.png?__version__')
                game.load.image('cemetery_bush2', './assets/playgrounds/cemetery/images/bush2.png?__version__')
                game.load.image('cemetery_skeleton', './assets/playgrounds/cemetery/images/skeleton.png?__version__')
                game.load.image('cemetery_tombstone1', './assets/playgrounds/cemetery/images/tombstone1.png?__version__')
                game.load.image('cemetery_tombstone2', './assets/playgrounds/cemetery/images/tombstone2.png?__version__')
                game.load.image('cemetery_sign1', './assets/playgrounds/cemetery/images/sign1.png?__version__')
                game.load.image('cemetery_sign2', './assets/playgrounds/cemetery/images/sign2.png?__version__')
                game.load.audio('cemetery_ambient', './assets/playgrounds/cemetery/sounds/ambient.mp3?__version__');
                game.load.audio('cemetery_laugh', './assets/playgrounds/cemetery/sounds/laugh.mp3?__version__');
                game.load.audio('cemetery_sirens', './assets/playgrounds/cemetery/sounds/sirens.mp3?__version__');
                game.load.audio('cemetery_twilightzone', './assets/playgrounds/cemetery/sounds/twilightzone.mp3?__version__');
                break

            case "forest":
                game.load.audio('forest_ambient', './assets/playgrounds/forest/sounds/ambient.mp3?__version__');
                game.load.image('forest_bg', './assets/playgrounds/forest/images/bg.png?__version__')
                game.load.image('forest_ground', './assets/playgrounds/forest/images/ground.png?__version__')
                game.load.image('forest_clouds1', './assets/playgrounds/forest/images/clouds1.png?__version__')
                game.load.image('forest_clouds2', './assets/playgrounds/forest/images/clouds2.png?__version__')
                game.load.image('forest_rock', './assets/playgrounds/forest/images/rock.png?__version__')
                game.load.image('forest_rock_ledge', './assets/playgrounds/forest/images/rock_ledge.png?__version__')
                game.load.image('forest_grass_ledge', './assets/playgrounds/forest/images/grass_ledge.png?__version__')
                break

            case "moon":
                game.load.image('moon_bg', './assets/playgrounds/moon/images/bg.png?__version__')
                game.load.image('moon_ground', './assets/playgrounds/moon/images/ground.png?__version__')
                game.load.image('moon_rock', './assets/playgrounds/moon/images/rock.png?__version__')
                break
        }

    }

    /**
     * Load assets for player selector widget
     */
    static loadPlayerSelector() {
        if (this._isLoaded("player_selector"))
            return

        let game = this.game
        let players = game.cache.getJSON("players")

        for (let type in players)
            game.load.spritesheet(type + "_player" , "./assets/players/" + type + "/images/player.png?__version__", players[type]["sprite"]["width"], players[type]["sprite"]["height"])

        game.load.image('menu_player_up', './assets/menu/images/up.png?__version__')
        game.load.image('menu_player_down', './assets/menu/images/down.png?__version__')
        game.load.audio("menu_player_change", "./assets/menu/sounds/change.mp3?__version__");
        game.load.audio("menu_player_confirm", "./assets/menu/sounds/confirm.mp3?__version__");
    }

    /**
     * Load assets for playground selector widget
     */
    static loadPlaygroundSelector() {
        if (this._isLoaded("playground_selector"))
            return

        let game = this.game
        let manager = new PlaygroundManager(this.game)
        let types = manager.getTypes()

        for (let type of types)
            game.load.spritesheet("menu_playground_" + type, "./assets/menu/images/playground_" + type + ".png?__version__", 200, 125);

        game.load.image('menu_playground_left', './assets/menu/images/left.png?__version__')
        game.load.image('menu_playground_right', './assets/menu/images/right.png?__version__')
        game.load.audio("menu_playground_change", "./assets/menu/sounds/change.mp3?__version__");
    }

    /**
     * Load assets for power-ups
     */
    static loadPowerups() {
        if (this._isLoaded("powerups"))
            return

        let game = this.game

        game.load.spritesheet('powerup_health', './assets/powerups/images/health.png?__version__', 32, 32);
        game.load.spritesheet('powerup_speed', './assets/powerups/images/speed.png?__version__', 32, 32);
        game.load.spritesheet('powerup_damage', './assets/powerups/images/damage.png?__version__', 32, 32);
        game.load.spritesheet('powerup_trap', './assets/powerups/images/trap.png?__version__', 32, 32);
        game.load.spritesheet('powerup_surprise', './assets/powerups/images/surprise.png?__version__', 32, 32);
        game.load.spritesheet('powerup_disappear', './assets/powerups/images/disappear.png?__version__', 32, 32);
        game.load.audio('powerup_appear', './assets/powerups/sounds/appear.mp3?__version__');
        game.load.audio('powerup_disappear', './assets/powerups/sounds/disappear.mp3?__version__');
        game.load.audio('powerup_take_health', './assets/powerups/sounds/take_health.mp3?__version__');
        game.load.audio('powerup_take_trap', './assets/powerups/sounds/take_trap.mp3?__version__');
        game.load.audio('powerup_take_speed', './assets/powerups/sounds/take_speed.mp3?__version__');
        game.load.audio('powerup_take_damage', './assets/powerups/sounds/take_damage.mp3?__version__');
    }

    /**
     * Check if assets have been loaded for specified entity
     *
     * @param name Entity name
     * @returns {boolean}
     * @private
     */
    static _isLoaded(name) {
        if (!this._loaded || this._loaded.indexOf(name) == -1) {
            util.log("loader", "loading assets: " + name)
            this._setAsLoaded(name)
            return false
        }

        util.log("loader", "assets already loaded: " + name)
        return true
    }

    /**
     * Mark assets as loaded for specified entity
     *
     * @param name Entity name
     * @returns {boolean}
     * @private
     */
    static _setAsLoaded(name) {
        if (!this._loaded)
            this._loaded = []

        this._loaded.push(name)
    }

    /**
     * Mark assets as not loaded for specified entity
     *
     * @param name Entity name
     * @returns {boolean}
     * @private
     */
    static _unsetAsLoaded(name) {
        if (this._loaded.indexOf(name) == -1)
            return
    }
}