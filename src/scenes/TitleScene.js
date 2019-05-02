import Phaser from "phaser";

import SpriteManager from "../managers/SpriteManager";

export default class GameScene extends Phaser.Scene {

    constructor(game) {
        super("title");
        // initialization
        this._game = game;
        this._btnStart = null;
        this._spriteManager = new SpriteManager(this);
    }

    preload() {
        // the first preload of the assets!
        this._spriteManager.preload();
    }

    create() {

        console.log("title create");

        // add game objects to the scene
        this._spriteManager.addImage(0, 0, "screenTitle");
        this._btnStart = this._spriteManager.addSprite(250, 500, "btnStart");
        this._btnStart.setInteractive();

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this._test = this._spriteManager.addSound("test");
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // add event listners to button
        this._btnStart.on("pointerover", () => {
            this._btnStart.setTint(0xA9A9A9);
        });

        this._btnStart.on("pointerout", () => {
            this._btnStart.clearTint();
        });
    
        this._btnStart.on("pointerdown", () => {

            this._test.play();

            // start the game!
            this._game.scene.stop("title");
            this._game.scene.start("game");
        });
    }

    update() {

    }
}