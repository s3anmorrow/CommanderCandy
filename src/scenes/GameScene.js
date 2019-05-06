import Phaser from "phaser";

import { POINTS_FOR_KILL, POINTS_FOR_CANDY } from "../game/Globals";

import PlatformManager from "../managers/PlatformManager";
import AssetManager from "../managers/AssetManager";
import EnemyManager from "../managers/EnemyManager";
import UserInterface from "../game/UserInterface";
import Player from "../game/Player";
import Candy from "../game/Candy";

export default class GameScene extends Phaser.Scene {

    constructor(game) {
        super("game");

        this._game = game;
        this._player = null;
        this._cursors = null;
        this._bombs = null;
        this._gameOver = false;
        this._gameOn = true;
        
        // custom event dispatcher object - passed into to objects that need to dispatch
        this._emitter = new Phaser.Events.EventEmitter();

        // spritemanager handles all adding sprites to the game (animated or static)
        this._assetManager = new AssetManager(this);

        // constructing other managers and pass in Scene object / assetManager
        this._userInterface = new UserInterface(this, this._assetManager);
        this._platformManager = new PlatformManager(this, this._assetManager, this._emitter);
        this._player = new Player(this, this._assetManager, this._platformManager, this._emitter);
        this._candy = new Candy(this, this._assetManager, this._platformManager, this._emitter, this._player);
        this._enemyManager = new EnemyManager(this, this._assetManager, this._platformManager, this._emitter, this._player);
    }

    // ----------------------------------- scene methods
    // each scene has its own displaylist
    preload() {
        // manager object preload stage setup
        //this._assetManager.preload();
        this._userInterface.preload();
        this._platformManager.preload();
        this._player.preload();
        this._candy.preload();
        this._enemyManager.preload();
    }
  
    create() {
        // guaranteed all assets loaded when in this scene function

        // initialization
        this._gameOn = true;

        console.log("gameScene create");

        // register all animations of game for use
        this._assetManager.registerAnimation("main", "player-idle", 0, 1, "player/idle/pixil-frame-", true, 1);
        this._assetManager.registerAnimation("main", "player-walk-left", 0, 2, "player/walk-left/pixil-frame-", true);
        this._assetManager.registerAnimation("main", "player-walk-right", 0, 2, "player/walk-right/pixil-frame-", true);
        this._assetManager.registerAnimation("main", "player-jump", 0, 0, "player/jump/pixil-frame-", true);
        this._assetManager.registerAnimation("main", "player-killed", 0, 7, "player/killed/pixil-frame-", false, 8, 0);
        this._assetManager.registerAnimation("main", "player-shoot-left", 0, 0, "player/shoot-left/pixil-frame-", false, 1);
        this._assetManager.registerAnimation("main", "player-shoot-right", 0, 0, "player/shoot-right/pixil-frame-", false, 1);

        this._assetManager.registerAnimation("main", "enemy-idle", 0, 3, "enemy/idle/pixil-frame-", true, 5);
        this._assetManager.registerAnimation("main", "enemy-killed", 0, 7, "enemy/killed/pixil-frame-", false, 5, 0);

        this._assetManager.registerAnimation("main", "candy-idle", 0, 0, "candy/idle/pixil-frame-", false, 5);
        this._assetManager.registerAnimation("main", "candy-killed", 0, 14, "candy/killed/pixil-frame-", false, 12, 0);


        // other setups
        this._userInterface.setup();
        this._platformManager.setup();
        this._player.setup();
        this._candy.setup();
        this._enemyManager.setup();

        // setup keyboard controls
        this._cursors = this.input.keyboard.createCursorKeys();
        this._fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // setup game listeners - but first removes ones from previous game
        this._emitter.removeAllListeners();
        this._emitter.on("GameEvent", this._onGameEvent, this);
    }

    update() {
        if (!this._game.scene.isActive("game") || (!this._gameOn)) return;

        // monitor player movement
        if (this._cursors.left.isDown) this._player.moveLeft();
        else if (this._cursors.right.isDown) this._player.moveRight();
        else this._player.stop();

        // monitor player jump
        if (this._cursors.up.isDown) this._player.jump();

        // monitor player shooting
        if (this._fireKey.isDown) this._player.fire();

        // game object updates
        this._player.update();
    }

    //--------------------------------------------------------------- event handlers
    _onGameEvent(which) {

        console.log("game event! " + which);

        switch (which) {
            case "EnemyKilled":
                this._userInterface.updateScore(POINTS_FOR_KILL);
                break;
            case "CandyPickup":
                this._userInterface.updateScore(POINTS_FOR_CANDY);
                // move to next level
                this._platformManager.levelUp();
                this._enemyManager.levelUp();
                break;
            case "LevelReady":
                this._candy.release();
                this._player.release();
                break;
            case "PlayerHurt":
                this._userInterface.updateHealth(this._player.health);
                break;
            case "PlayerKilled":
                this._gameOn = false;
                break;
            case "GameOver":
                // stop the game
                this._game.scene.stop("game");
                this._game.scene.start("gameover");
                break;
        }
    }

}