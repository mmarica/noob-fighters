import Phaser from 'phaser'
import Player from './Player'

export default class extends Player {

    constructor ({ game, id, x, y, keys, orientation }) {
        super({
            game: game,
            id: id,
            x: x,
            y: y,
            asset: 'alien',
            keys: keys,
            orientation: orientation,
            animations: {
                'left': [0, 1, 2, 3, 4],
                'right': [5, 6, 7, 8, 9],
                'right_still': 5,
            },
        })

        this.weaponSound = this.game.add.audio('alien_shoot');
        this.hitSound = this.game.add.audio('alien_hit');
    }

    _addWeapon () {
        let weapon = this.game.add.weapon(5, 'alien_projectile')

        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        weapon.bulletSpeed = 700
        weapon.fireRate = 1000
        weapon.trackSprite(this, 0, 0);

        return weapon;
    }
}
