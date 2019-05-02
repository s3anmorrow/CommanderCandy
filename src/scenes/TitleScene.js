import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {

    constructor(game) {
        super("title");
        // initialization
        this._game = game;
        this._btnStart = null;
    }

    preload() {
        this.load.image('screenTitle', './assets/statics/screenTitle.png');
        this.load.image('btnStart', './assets/statics/btnStart.png');
    }

    create() {

        console.log("title create");

        // add game objects to the scene
        this.add.image(0, 0, 'screenTitle').setOrigin(0, 0);
        this._btnStart = this.add.sprite(250, 500, 'btnStart').setOrigin(0, 0).setInteractive();

        // add event listners to button
        this._btnStart.on("pointerover", () => {
            this._btnStart.setTint(0xA9A9A9);
        });

        this._btnStart.on("pointerout", () => {
            this._btnStart.clearTint();
        });
    
        this._btnStart.on("pointerdown", () => {


            
            // start the game!
            this._game.scene.stop("title");
            this._game.scene.start("game");
        });
    }

    update() {

    }
}