import Phaser from "phaser";

import AssetManager from "../managers/AssetManager";

export default class GameScene extends Phaser.Scene {

    constructor(game) {
        super("title");
        // initialization
        this._game = game;
        this._btnStart = null;
        this._assetManager = new AssetManager(this);
    }

    preload() {
        // the first preload of the assets!
        this._assetManager.preload();
    }

    create() {
        // register all animations
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
        this._player.body.setGravityY(-300);
        this._player.anims.play('player-idle', true);

        this._enemy = this._assetManager.addSprite(391, 255, "enemy/idle/pixil-frame-0", "main", true);
        this._enemy.body.setGravityY(-300);
        this._enemy.anims.play('enemy-idle', true);

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this._test = this._assetManager.addSound("test");
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // add event listners to button
        this._btnStart.on("pointerover", () => {
            this._btnStart.setTint(0xA9A9A9);
        });

        this._btnStart.on("pointerout", () => {
            this._btnStart.clearTint();
        });
    
        this._btnStart.on("pointerdown", () => {

            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            this._test.play();
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            // start the game!
            this._game.scene.stop("title");
            this._game.scene.start("game");
        });
    }

    update() {

    }
}