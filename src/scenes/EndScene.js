import Phaser from "phaser";

import SpriteManager from "../managers/SpriteManager";

export default class EndScene extends Phaser.Scene {

    constructor(game) {
        super("gameover");

        // initialization
        this._game = game;
        this._btnPlayAgain = null;
        this._spriteManager = new SpriteManager(this);
    }

    preload() {

    }

    create() {
        // add game objects to the scene
        this._spriteManager.addImage(0, 0, "screenGameOver");
        this._btnPlayAgain = this._spriteManager.addSprite(230, 500, "btnPlayAgain").setInteractive();

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