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
                'left': [0, 1, 2, 3],
                'right': [4, 5, 6, 7],
                'right_still': 4,
            },
        })
    }

    _addWeapon () {
        let weapon = this.game.add.weapon(5, 'blaster_bullet')

        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        weapon.bulletSpeed = 700
        weapon.fireRate = 1000
        weapon.trackSprite(this, 0, 0);

        return weapon;
    }
}
