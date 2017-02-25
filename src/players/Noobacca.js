import Phaser from 'phaser'
import Player from './Player'

export default class extends Player {

    constructor ({ game, id, x, y, keys, orientation }) {
        super({
            game: game,
            id: id,
            x: x,
            y: y,
            asset: 'noobacca',
            keys: keys,
            orientation : orientation,
            animations: {
                'left': [0, 1, 2, 3, 4, 5],
                'right': [6, 7, 8, 9, 10, 11],
                'right_still': 6,
            },
        })
    }

    _addWeapon () {
        let weapon = this.game.add.weapon(5, 'energy_bullet')

        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        weapon.bulletSpeed = 1000
        weapon.fireRate = 1000
        weapon.trackSprite(this, 0, 0);

        return weapon;
    }
}
