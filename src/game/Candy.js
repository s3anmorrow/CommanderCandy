import Phaser from "phaser";

export default class Candy {

    constructor(scene, spriteManager, platformManager, emitter, player) {
        this._scene = scene;
        this._spriteManager = spriteManager;
        this._platformManager = platformManager;
        this._player = player;
        this._sprite = null;
        this._emitter = emitter;
        this._playerCandyCollider = null;
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
        this._sprite = this._spriteManager.addSprite(0, 0, "pickups/candy", "main", true);
        this._sprite.setActive(false);
        this._sprite.setVisible(false);
        // release initial candy after setup complete
        this.release();
    }

    release() {
        this._sprite.setActive(true);
        this._sprite.setVisible(true);

        // randomization sets
        // pick random x location of bomb to be released away from the player
        let x = (this._player.sprite.x < 300) ? Phaser.Math.Between(300, 600) : Phaser.Math.Between(0, 400);
        this._sprite.x = x;
        this._sprite.y = -30;

        this._sprite.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // setup candy to collide with platforms
        this._platformManager.setupCollider(this._sprite);
        // setup collision detection between player and candy
        this._playerCandyCollider = this._scene.physics.add.overlap(this._player.sprite, this._sprite, this._pickup, null, this);
    }

    // ------------------------------------------------ private methods
    _pickup() {
        // TODO play animation of candy being picked up

        this._playerCandyCollider.destroy();
        this._sprite.setActive(false);
        this._sprite.setVisible(false);
        this.release();
        this._emitter.emit("GameEvent","CandyPickup");
    }

}