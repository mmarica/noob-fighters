/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Noob Fighters'
    let banner = this.add.text(this.world.centerX, 40, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

      this.players = [this.addPlayer(100), this.addPlayer(this.world.width - 100)]

      this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  addPlayer(width) {
      let player = this.game.add.existing(
          new Player({
              game: this.game,
              x: width,
              y: this.world.centerY,
              key: 'dude'
          })
      )

      this.game.physics.arcade.enable(player);

      player.body.bounce.y = 0.2;
      player.body.gravity.y = 300;
      player.body.collideWorldBounds = true;

       player.animations.add('left', [0, 1, 2, 3], 10, true);
       player.animations.add('right', [5, 6, 7, 8], 10, true);

      return player;
  }

  update() {
      this.players[0].body.velocity.x = 0;

      if (this.cursors.left.isDown)
      {
          this.players[0].body.velocity.x = -150;
          this.players[0].animations.play('left');
      }
      else if (this.cursors.right.isDown)
      {
          this.players[0].body.velocity.x = 150;
          this.players[0].animations.play('right');
      }
      else
      {
          this.players[0].animations.stop();
          this.players[0].frame = 4;
      }

      if (this.cursors.up.isDown) //&& this.players[0].body.touching.down
      {
          this.players[0].body.velocity.y = -350;
      }
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.players[0], 32, 32)
    }
  }
}
