import Phaser from "phaser";

export default class EndScene extends Phaser.Scene {

    constructor(game) {
        super("gameover");

        // initialization
        this._game = game;
        this._btnPlayAgain = null;
    }

    preload() {
        this.load.image('screenGameOver', './assets/statics/screenGameOver.png');
        this.load.image('btnPlayAgain', './assets/statics/btnPlayAgain.png');
    }

    create() {
        // add game objects to the scene
        this.add.image(0, 0, 'screenGameOver').setOrigin(0, 0);
        this._btnPlayAgain = this.add.sprite(230, 500, 'btnPlayAgain').setOrigin(0, 0).setInteractive();

        // add event listners to button
        this._btnPlayAgain.on("pointerover", () => {
            this._btnPlayAgain.setTint(0xA9A9A9);
        });

        this._btnPlayAgain.on("pointerout", () => {
            this._btnPlayAgain.clearTint();
        });
    
        this._btnPlayAgain.on("pointerdown", () => {
            // start the game!
            this._game.scene.stop("gameover");
            this._game.scene.start("title");
        });

    }

    update() {

    }
    
}