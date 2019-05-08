import Phaser from "phaser";

import { GRAVITY } from "../game/Globals";

export default class Candy {

    constructor(scene, assetManager, platformManager, emitter, player) {
        this._scene = scene;
        this._assetManager = assetManager;
        this._platformManager = platformManager;
        this._player = player;
        this._sprite = null;
        this._emitter = emitter;
        this._playerCandyCollider = null;
        this._sndPickup = null;
        this._sndPop = null;
    }

    // ----------------------------------------------- get/sets
    get sprite() {
        return this._sprite;
    }

    // ----------------------------------------------- public methods
    preload() {

    }

    setup() {
        // add sprite to game as physics sprite
        this._sprite = this._assetManager.addSprite(0, 0, "candy/idle/pixil-frame-0", "main", true);
        this._sprite.setActive(false);
        this._sprite.setVisible(false);

        // add sounds to scene
        this._sndPickup = this._assetManager.addSound("sndCandyPickup");
        this._sndPop = this._assetManager.addSound("sndCandyPop");

        // release initial candy after setup complete
        this.release();
    }

    release() {
        this._sprite.setActive(true);
        this._sprite.setVisible(true);
        this._sprite.anims.play("candy-idle", true);

        // setting x and y location of candy drop
        this._sprite.x = this._platformManager.candyX;
        this._sprite.y = this._platformManager.candyY;
        this._sprite.body.setGravityY(0);

        this._sprite.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // setup candy to collide with platforms
        this._platformManager.setupCollider(this._sprite);
        // setup collision detection between player and candy
        this._playerCandyCollider = this._scene.physics.add.overlap(this._player.sprite, this._sprite, this._pickup, null, this);
    }

    // ------------------------------------------------ private methods
    _pickup() {
        this._playerCandyCollider.destroy();
        this._sprite.setVelocity(0,0);
        this._sprite.setBounce(0);
        this._sprite.body.setGravityY(-GRAVITY);
        this._sprite.anims.play("candy-killed", true);

        // listen for end (have to play first)
        this._sprite.on("animationcomplete", () => {
            this._sprite.removeAllListeners();
            this._sprite.setActive(false);
            this._sprite.setVisible(false);
            this._sndPop.play();
            this._emitter.emit("GameEvent","CandyPickup");
        });

        this._sndPickup.play();
    }

}