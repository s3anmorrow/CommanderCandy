import Phaser from "phaser";
import { START_HEALTH, HEALTH_FOR_HIT, BULLET_SPEED, DELAY_BETWEEN_BULLETS, BULLET_MAX, GRAVITY } from "./Globals";

export default class Player {

    constructor(scene, assetManager, platformManager, emitter) {
        this._scene = scene;
        this._assetManager = assetManager;
        this._platformManager = platformManager;
        this._emitter = emitter;
        this._sprite = null;
        this._bullets = null;
        this._health = START_HEALTH;
        this._immune = false;
        this._reloaded = true;
        this._bulletCount = 0;
        this._lastDirection = 1;
        this._bulletTimer = null;
        this._immuneTimer = null;
        this._sndJump = null;
        this._sndHurt = null;
        this._sndKilled = null;
        this._sndShoots = null;
    }

    // ----------------------------------------------- get/sets
    get sprite() {
        return this._sprite;
    }

    get bulletsGroup() {
        return this._bullets;
    }

    get health() {
        return this._health;
    }

    // ----------------------------------------------- public methods
    preload() {
        // group of bullets
        this._bullets = this._scene.physics.add.group();
    }

    setup() {
        // initialization
        this._immune = false;
        this._bounceFlag = false;
        this._health = START_HEALTH;
        this._reloaded = true;
        this._bulletCount = 0;
        window.clearInterval(this._immuneTimer);
        window.clearInterval(this._bulletTimer);

        // add sprite to game as physics sprite
        this._sprite = this._assetManager.addSprite(
            this._platformManager.playerX, 
            this._platformManager.playerY, 
            "player/idle/pixil-frame-0", "main", true);
        this._sprite.body.setGravityY(GRAVITY);
        this._sprite.setBounce(0.2);
        this._sprite.setCollideWorldBounds(true);
        this._sprite.alpha = 1;

        // setup collider between all platforms and the player
        this._scene.physics.add.collider(this._sprite, this._platformManager.platforms);

        for (let n=0; n<3; n++) {
            // add bullet sprites to game
            let bullet = this._assetManager.addSprite(-1000, 0, "misc/bullet", "main", true);
            bullet.setActive(false);
            // add new bullet sprite to group
            this._bullets.add(bullet);
            // setup collider
            this._platformManager.setupCollider(bullet, (b,p) => {this.removeBullet(b);});
        }

        // add sounds to scene
        this._sndJump = this._assetManager.addSound("sndPlayerJump");
        this._sndHurt = this._assetManager.addSound("sndPlayerHurt");
        this._sndShoots = this._assetManager.addSound("sndPlayerShoots");
        this._sndKilled = this._assetManager.addSound("sndPlayerKilled");

    }

    moveLeft() {
        this._sprite.setVelocityX(-160);
        this._lastDirection = 0;
        this._sprite.anims.play('player-walk-left', true);
    }

    moveRight() {
        this._sprite.setVelocityX(160);
        this._lastDirection = 1;
        this._sprite.anims.play('player-walk-right', true);
    }

    stop() {
        this._sprite.setVelocityX(0);
        this._sprite.anims.play('player-idle', true);
    }

    jump() {
        if (this._sprite.body.touching.down) {
            this._sprite.setVelocityY(-330);
            this._sndJump.play();
        }
        this._sprite.anims.play('player-jump', true);
    }

    fire() {

        console.log("FIRE: " + this._bulletCount + " : " + this._reloaded);

        // adjustments depending on direction player is shooting
        let bulletX, bulletY, bulletSpeed;
        if (this._lastDirection == 1) {
            this._sprite.anims.play('player-shoot-right', true);
            bulletSpeed = BULLET_SPEED;
            bulletX = 30;
            bulletY = -2;
        } else {
            this._sprite.anims.play('player-shoot-left', true);
            bulletSpeed = -BULLET_SPEED;
            bulletX = -38;
            bulletY = -3;
        }

        if ((!this._reloaded) || (this._bulletCount >= BULLET_MAX)) return;
        this._reloaded = false;
        this._bulletCount++;

        // get bullet from pool and position where player is
        let bullet = this._bullets.get(this._sprite.x + bulletX, this._sprite.y + bulletY);
        if (bullet) {
            bullet.body.setAllowGravity(false);
            // fire in direction last moved
            bullet.setVelocityY(0);
            bullet.setVelocityX(bulletSpeed);
            // bring player to top so laser is behind
            this._scene.children.bringToTop(this._sprite);
            // make it visible and play animation
            bullet.setActive(true);
            bullet.visible = true;

            // hack : using the old reliable setInterval to get this done
            window.clearInterval(this._bulletTimer);
            this._bulletTimer = window.setInterval(() => {
                this._reloaded = true;
                window.clearInterval(this._bulletTimer);
            }, DELAY_BETWEEN_BULLETS);

            this._sndShoots.play();
        }
    }

    update() {
        // check if any bullets off the stage
        this._bullets.children.each((bullet) => {
            if (bullet.active) {
                if ((bullet.x > 600) || (bullet.x < 0)) {
                    this.removeBullet(bullet);
                }
            }
        });

        // hack : fixing issue with player being bumped below the bottom platforms
        if (this._sprite.y > 543) this._sprite.y = 543;
    }

    removeBullet(bullet) {
        if (bullet.active) {
            console.log("_removeBullet");
            bullet.setActive(false);
            bullet.x = -1000;
            bullet.setVelocityX(0);
            bullet.visible = false;

            this._bulletCount--;
        }
    }

    hurtMe() {
        if (this._immune) return;

        console.log("IT HURTS!!!");
        
        this._immune = true;

        // play animation
        //this._sprite.anims.play('player-hurt', true);
        // remove health for enemy hit
        this._health -= HEALTH_FOR_HIT;

        // player recoils
        let which = Phaser.Math.Between(1, 2);
        if (this._sprite.body.touching.left) {
            this._sprite.x += 10;
        } else if (this._sprite.body.touching.right) {
            this._sprite.x -= 10;
        } else if (this._sprite.body.touching.up) {
            if (which == 1) this._sprite.x += 5;
            else this._sprite.x -= 5;
        } else if (this._sprite.body.touching.down) {
            if (which == 1) this._sprite.x += 5;
            else this._sprite.x -= 5;
        }

        // TODO - play animation of player getting hurt
        
        this._sndHurt.play();
        this._emitter.emit("GameEvent","PlayerHurt");

        if (this._health <= 0) {
            this._killMe();
        } else {
            window.clearInterval(this._immuneTimer);
            this._immuneTimer = window.setInterval(() => {
                this._immune = false;
                window.clearInterval(this._immuneTimer);
            }, 500);
        }
    }

    release() {
        this._sprite.x = this._platformManager.playerX;
        this._sprite.y = this._platformManager.playerY;
    }

    // -------------------------------------------------- private methods
    _killMe() {
        console.log("IT KILLS!!!");
        
        this._scene.physics.pause();

        this._sprite.anims.play('player-killed', true);
        this._emitter.emit("GameEvent","PlayerKilled");

        this._sprite.on("animationcomplete", () => {
            this._sprite.removeAllListeners();
            this._sndKilled.play();

            // tween to fade out enemy
            let tween = this._scene.tweens.addCounter({
                from: 1,
                to: 0,
                duration: 1500,
                onUpdate: () => { this._sprite.alpha = tween.getValue(); },
                onComplete: () => {
                    this._sndKilled.play();
                    this._emitter.emit("GameEvent","GameOver");
                }
            });
        });

        this._sndKilled.play();
    }

    // TODO: still has issue of player being bumped below platforms
    // TODO: hurt animation for player

}