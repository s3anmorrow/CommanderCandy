import Phaser from "phaser";
import { GRAVITY ,MUSIC_VOLUME } from "../game/Globals";

import AssetManager from "../managers/AssetManager";

export default class GameScene extends Phaser.Scene {

    constructor(game) {
        super("title");
        // initialization
        this._game = game;
        this._btnStart = null;
        this._assetManager = new AssetManager(this);
        this._sndButton = null;
        this._music = null;
        this._spaceKey = null;
        this._gamepad = null;
        this._gamepadPresent = false;

        this.delayCounter = 0;
    }

    preload() {
        // the first preload of the assets!
        this._assetManager.preload();
    }

    create() {
        // initialization
        this.delayCounter = 0;

        // register all animations of game for use
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "player-idle", 
            startFrame: 0, 
            endFrame: 1, 
            prefix: "player/idle/pixil-frame-", 
            yoyo: true, 
            rate: 1
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "player-walk-left", 
            startFrame: 0, 
            endFrame: 2, 
            prefix: "player/walk-left/pixil-frame-", 
            yoyo: true
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "player-walk-right", 
            startFrame: 0, 
            endFrame: 2, 
            prefix: "player/walk-right/pixil-frame-", 
            yoyo: true
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "player-jump", 
            startFrame: 0, 
            endFrame: 0, 
            prefix: "player/jump/pixil-frame-"
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "player-killed", 
            startFrame: 0, 
            endFrame: 7, 
            prefix: "player/killed/pixil-frame-", 
            rate: 8,
            repeat: 0
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "player-shoot-left", 
            startFrame: 0, 
            endFrame: 0, 
            prefix: "player/shoot-left/pixil-frame-",
            rate: 1
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "player-shoot-right", 
            startFrame: 0, 
            endFrame: 0, 
            prefix: "player/shoot-right/pixil-frame-",
            rate: 1
        });
        // this._assetManager.registerAnimation({
        //     spritesheet: "main", 
        //     animation: "player-hurt", 
        //     startFrame: 0, 
        //     endFrame: 0, 
        //     prefix: "player/hurt/pixil-frame-",
        //     rate: 1
        // });

        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "enemy-idle", 
            startFrame: 0, 
            endFrame: 3, 
            prefix: "enemy/idle/pixil-frame-", 
            yoyo: true,
            rate: 5
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "enemy-killed", 
            startFrame: 0, 
            endFrame: 7, 
            prefix: "enemy/killed/pixil-frame-", 
            rate: 5,
            repeat: 0
        });

        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "candy-idle", 
            startFrame: 0, 
            endFrame: 0, 
            prefix: "candy/idle/pixil-frame-", 
            rate: 5
        });
        this._assetManager.registerAnimation({
            spritesheet: "main", 
            animation: "candy-killed", 
            startFrame: 0, 
            endFrame: 14, 
            prefix: "candy/killed/pixil-frame-", 
            rate: 12,
            repeat:0
        });

        // add game objects to the scene
        this._assetManager.addImage(0, 0, "screenTitle");
        this._btnStart = this._assetManager.addSprite(250, 485, "btnStart");
        this._btnStart.setInteractive();

        this._player = this._assetManager.addSprite(215, 248, "player/idle/pixil-frame-0", "main", true);
        this._player.body.setGravityY(-GRAVITY);
        this._player.anims.play('player-idle', true);

        this._enemy = this._assetManager.addSprite(391, 255, "enemy/idle/pixil-frame-0", "main", true);
        this._enemy.body.setGravityY(-GRAVITY);
        this._enemy.anims.play('enemy-idle', true);

        // setup controls
        this._spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.gamepad.once('down', function (pad, button, index) {
            console.log("Gamepad connected: " + pad.id);
            this._gamepad = pad;
            this._gamepadPresent = true;
        }, this);

        // setup sounds
        this._sndButton = this._assetManager.addSound("sndButton");
        this._music = this._assetManager.addSound("musicTitle", {
            volume: MUSIC_VOLUME,
            loop: true
        });
        this._music.play();

        // add event listners to button
        this._btnStart.on("pointerover", () => {
            this._btnStart.setTint(0xA9A9A9);
        });

        this._btnStart.on("pointerout", () => {
            this._btnStart.clearTint();
        });
    
        this._btnStart.on("pointerdown", this._startGame, this);
    }

    update() {
        // hack : gamepad button from EndScene gets detected here as well without a delay
        if (this.delayCounter > 50) {

            if (this._spaceKey.isDown) this._startGame();
            if (this._gamepadPresent) {
                if ((this._gamepad.buttons[0].value == 1) || 
                    (this._gamepad.buttons[1].value == 1) ||
                    (this._gamepad.buttons[2].value == 1) ||
                    (this._gamepad.buttons[3].value == 1) ||
                    (this._gamepad.buttons[9].value == 1)) this._startGame();
            }

        } else {
            this.delayCounter++;
        }
    }

    // -------------------------------------------- event handlers
    _startGame() {
        // start the game!
        this._music.stop();
        this._sndButton.play();
        this._game.scene.stop("title");
        this._game.scene.start("game");
    }
}