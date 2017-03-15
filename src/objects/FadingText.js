import Phaser from 'phaser'

export default class extends Phaser.Text {

    constructor ({ game, player, text }) {
        let x = player.body.x + player.body.width / 2
        let y =  player.body.y - 40
        super(game, x, y, text)

        this.anchor.setTo(0.5, 0)

        this.fontSize = 15
        this.fill = "#fffaa9"
        this.stroke = "#000"
        this.strokeThickness = 2
        this.anchor.setTo(0.5, 0)

        let tween = game.add.tween(this).to( { y: y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(
            function () {
                this.kill()
            }, this
        )
    }
}
