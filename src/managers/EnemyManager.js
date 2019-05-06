import Phaser from "phaser";

import { STARTING_ENEMY_INTERVAL, ENEMY_INTERVAL_DECREASE, STARTING_MAX_ENEMIES, MAX_ENEMIES_INCREASE } from "./../game/Globals";

export default class EnemyManager {

    constructor(scene, assetManager, platformManager, emitter, player) {
        this._scene = scene;
        this._assetManager = assetManager;
        this._platformManager = platformManager;
        this._player = player;
        this._enemies = null;
        this._emitter = emitter;
        this._enemyDelay = STARTING_ENEMY_INTERVAL;
        this._maxEnemies = STARTING_MAX_ENEMIES;
        this._enemyCount = 0;
    }

    // ----------------------------------------------- public methods
    preload() {
        // physics group of all enemy sprites
        this._enemies = this._scene.physics.add.group();
    }

    setup() {
        // initialization
        this._enemyDelay = STARTING_ENEMY_INTERVAL;
        this._maxEnemies = STARTING_MAX_ENEMIES;
        this._enemyCount = 0;

        // create object pool of enemies
        for (let n=0; n<50; n++) {
            // pick random x location of enemy to be released away from the player
            let x = (this._player.sprite.x < 300) ? Phaser.Math.Between(50, 550) : Phaser.Math.Between(0, 400);

            // add sprite to game as physics sprite
            let enemy = this._assetManager.addSprite(-1000, -50, "enemy/idle/pixil-frame-0", "main", true);
            enemy.setActive(false);
            enemy.setVisible(false);
            enemy.killed = false;

            // add new enemy sprite to group
            this._enemies.add(enemy);

            // make no gravity by default
            enemy.body.setAllowGravity(false);
        }

        // start timer to release enemies into game
        this._startTimer();
        // initial release
        this.release();
    }

    release() {
        if (this._enemyCount >= this._maxEnemies) return;

        // pick random x location of bomb to be released away from the player
        let x = (this._player.sprite.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let enemy = this._enemies.get(x, -30);
        if (enemy) {
            enemy.anims.play("enemy-idle", true);
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setActive(true);
            enemy.alpha = 1;
            enemy.setVisible(true);
            enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
            enemy.body.setAllowGravity(true);

            // setup collider with platforms
            this._platformManager.setupCollider(enemy);
            // setup collider with player
            enemy.playerCollider = this._scene.physics.add.collider(enemy, this._player.sprite, (e, p) => {
                if ((e.active) && (!e.killed)) this._player.hurtMe();
            });

            // setup collider with player's bullet
            enemy.bulletCollider = this._scene.physics.add.collider(enemy, this._player.bulletsGroup, (e, b) => {
                if ((e.active) && (b.active) && (!e.killed)) this.killMe(e, b);
            });  
            
            this._enemyCount++;
        }

        console.log("----object pool test--------------");
        for (let testy of this._enemies.children.entries) {
            console.log(testy.active);
        }
    }

    killMe(enemy, bullet) {
        enemy.killed = true;

        // remove the bullet
        this._player.removeBullet(bullet);

        // disabling enemy for death animation
        enemy.setVelocity(0,0);
        enemy.setBounce(0);
        enemy.bulletCollider.destroy();

        // play killed animation
        enemy.anims.play("enemy-killed", true);

        // listen for end (have to play first)
        enemy.on("animationcomplete", () => {
            // tween to fade out enemy
            let tween = this._scene.tweens.addCounter({
                from: 1,
                to: 0,
                duration: 500,
                onUpdate: () => { enemy.alpha = tween.getValue(); },
                onComplete: () => {
                    enemy.x = -1000;
                    enemy.setActive(false);
                    enemy.setVisible(false);
                    enemy.killed = false;
                }
            });
            
            enemy.removeAllListeners();
            enemy.setCollideWorldBounds(false);            
            enemy.body.setAllowGravity(false);
            // decrease number of enemies
            this._enemyCount--;
            // an enemy has been killed!
            this._emitter.emit("GameEvent","EnemyKilled");
        });
        
        // restart the timer
        this._startTimer();
    }

    levelUp() {
        // decrease delay between enemy drops
        this._enemyDelay -= ENEMY_INTERVAL_DECREASE;
        this._maxEnemies += MAX_ENEMIES_INCREASE;
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
}