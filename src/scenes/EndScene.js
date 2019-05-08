import Phaser from "phaser";
import { GRAVITY, MUSIC_VOLUME } from "../game/Globals";

import AssetManager from "../managers/AssetManager";

export default class EndScene extends Phaser.Scene {

    constructor(game) {
        super("gameover");

        // initialization
        this._game = game;
        this._btnPlayAgain = null;
        this._assetManager = new AssetManager(this);
        this._sndButton = null;
        this._sndGameOver = null;
        this._music = null;
        this._spaceKey = null;
        this._gamepad = null;
        this._gamepadPresent = false;        
    }

    preload() {

    }

    create() {
        // add game objects to the scene
        this._assetManager.addImage(0, 0, "screenGameOver");
        
        this._enemy = this._assetManager.addSprite(300, 302, "enemy/idle/pixil-frame-0", "main", true);
        this._enemy.body.setGravityY(-GRAVITY);
        this._enemy.anims.play('enemy-idle', true);

        this._btnPlayAgain = this._assetManager.addSprite(240, 350, "btnPlayAgain").setInteractive();

        // setup controls
        this._spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.gamepad.once('down', function (pad, button, index) {
            console.log("Gamepad connected: " + pad.id);
            this._gamepad = pad;
            this._gamepadPresent = true;
        }, this);

        // add sounds to scene
        this._sndGameOver = this._assetManager.addSound("sndGameOver");
        this._sndButton = this._assetManager.addSound("sndButton");
        this._sndGameOver.play();

        // setup music
        this._music = this._assetManager.addSound("musicEnd", {
            volume: MUSIC_VOLUME,
            loop: true
        });
        this._music.play();

        // add event listners to button
        this._btnPlayAgain.on("pointerover", () => {
            this._btnPlayAgain.setTint(0xA9A9A9);
        });

        this._btnPlayAgain.on("pointerout", () => {
            this._btnPlayAgain.clearTint();
        });
    
        this._btnPlayAgain.on("pointerdown", this._restartGame, this);

    }

    update() {
        if (this._spaceKey.isDown) this._restartGame();
        if (this._gamepadPresent) {
            if ((this._gamepad.buttons[0].value == 1) || 
                (this._gamepad.buttons[1].value == 1) ||
                (this._gamepad.buttons[2].value == 1) ||
                (this._gamepad.buttons[3].value == 1) ||
                (this._gamepad.buttons[9].value == 1)) this._restartGame();
        }
    }

    // ----------------------------------------------- event handlers
    _restartGame() {
        // restart the game!
        this._music.stop();
        this._sndButton.play();
        this._game.scene.stop("gameover");
        this._game.scene.start("title");
    }
    
}