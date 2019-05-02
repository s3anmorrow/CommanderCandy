import Phaser from "phaser";

import { STARTING_ENEMY_INTERVAL, ENEMY_INTERVAL_DECREASE } from "./../game/Globals";

export default class EnemyManager {

    constructor(scene, assetManager, platformManager, emitter, player) {
        this._scene = scene;
        this._assetManager = assetManager;
        this._platformManager = platformManager;
        this._player = player;
        this._enemies = null;
        this._emitter = emitter;
        this._enemyDelay = STARTING_ENEMY_INTERVAL;
    }

    // ----------------------------------------------- public methods
    preload() {
        // physics group of all enemy sprites
        this._enemies = this._scene.physics.add.group();
    }

    setup() {
        // initialization
        this._enemyDelay = STARTING_ENEMY_INTERVAL;

        // create object pool of enemies
        for (let n=0; n<50; n++) {
            // pick random x location of bomb to be released away from the player
            let x = (this._player.sprite.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            // add sprite to game as physics sprite
            this._sprite = this._assetManager.addSprite(x, -30, "enemies/pixil-frame-0", "main", true);
            this._sprite.setActive(false);
            this._sprite.setVisible(false);

            // add new enemy sprite to group
            this._enemies.add(this._sprite);
        }

        // start timer to release enemies into game
        this._startTimer();
        // initial release
        this.release();
    }

    release() {
        // pick random x location of bomb to be released away from the player
        let x = (this._player.sprite.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let enemy = this._enemies.get(x, -30);
        if (enemy) {
            enemy.anims.play("enemyWaddle");
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);

            // setup collider with platforms
            this._platformManager.setupCollider(enemy);
            // setup collider with player
            enemy.playerCollider = this._scene.physics.add.collider(enemy, this._player.sprite, (enemy, player) => {
                if (enemy.active) this._player.hurtMe();
            });
            // setup collider with player's bullet
            enemy.bulletCollider = this._scene.physics.add.collider(enemy, this._player.laserSprite, (enemy, bullet) => {
                if ((enemy.active) && (bullet.active)) this.killMe(enemy, bullet);
            });   
        }

        console.log("----object pool test--------------");
        for (let testy of this._enemies.children.entries) {
            console.log(testy.active);
        }

    }

    killMe(enemy, bullet) {
        enemy.setActive(false);
        enemy.setVisible(false);
        enemy.bulletCollider.destroy();
        this._player.killLaser();
        // an enemy has been killed!
        this._emitter.emit("GameEvent","EnemyKilled");
    }

    levelUp() {
        // decrease delay between enemy drops
        this._enemyDelay -= ENEMY_INTERVAL_DECREASE;
        this._startTimer();
    }

    // ------------------------------------------------ private methods
    _startTimer() {
        this._scene.time.removeAllEvents();
        this._scene.time.addEvent({
            delay: this._enemyDelay,
            loop: true,
            callback: this.release,
            callbackScope: this
        });
    }

    // TODO add maximum number of enemies added - but increase with level up


}