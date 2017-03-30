import Phaser from 'phaser'

export default class extends Phaser.Text {
    /**
     * Constructor
     *
     * @param game   Game object
     * @param player Player sprite
     * @param text   Text to display
     */
    constructor(game, player, text) {
        // position the text above the player
        let x = player.body.x + player.body.width / 2
        let y =  player.body.y - 40
        super(game, x, y, text)

        // apply text format
        this.fontSize = 15
        this.fill = "#fffaa9"
        this.stroke = "#000"
        this.strokeThickness = 2
        this.align = "center"
        this.anchor.setTo(0.5, 1)

        // add the movement and fading animation
        let tween = game.add.tween(this).to( { y: y - 50, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(
            function () {
                this.kill()
            }, this
        )
    }
}
