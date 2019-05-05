import Phaser from "phaser";
import { START_HEALTH, HEALTH_FOR_HIT, BULLET_SPEED, DELAY_BETWEEN_BULLETS, BULLET_MAX } from "./Globals";

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
        this._health = START_HEALTH;
        this._reloaded = true;
        this._bulletCount = 0;
        window.clearInterval(this._immuneTimer);
        window.clearInterval(this._bulletTimer);

        // add sprite to game as physics sprite
        this._sprite = this._assetManager.addSprite(100, 450, "player/idle/pixil-frame-0", "main", true);
        this._sprite.body.setGravityY(300);
        this._sprite.setBounce(0.2);
        this._sprite.setCollideWorldBounds(true);
        // setup collider between all platforms and the player
        this._platformManager.setupCollider(this._sprite);

        for (let n=0; n<3; n++) {
            // add bullet sprites to game
            let bullet = this._assetManager.addSprite(-1000, 0, "misc/bullet", "main", true);
            bullet.setActive(false);
            // add new bullet sprite to group
            this._bullets.add(bullet);
            // setup collider
            this._platformManager.setupCollider(bullet, (b,p) => {this.removeBullet(b);});
        }
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
        }
        this._sprite.anims.play('player-jump', true);
    }

    fire() {

        console.log("FIRE: " + this._bulletCount + " : " + this._reloaded);

        if ((!this._reloaded) || (this._bulletCount >= BULLET_MAX)) return;
        this._reloaded = false;
        this._bulletCount++;

        // get bullet from pool and position where player is
        let bullet = this._bullets.get(this._sprite.x + 15, this._sprite.y + 30);
        if (bullet) {
            bullet.body.setAllowGravity(false);
            // fire in direction last moved
            if (this._lastDirection == 1) {
                bullet.setVelocityY(0);
                bullet.setVelocityX(BULLET_SPEED);
            } else {
                bullet.setVelocityY(0);
                bullet.setVelocityX(-BULLET_SPEED);
            }
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
            //this._reloaded = true;
        }
    }

    hurtMe() {
        if (this._immune) return;

        console.log("IT HURTS!!!");

        this._immune = true;

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

    // -------------------------------------------------- private methods
    _killMe() {
        console.log("IT KILLS!!!");

        // TODO - play animation of player getting hurt
        this._scene.physics.pause();
        //this._sprite.anims.stop();
        this._sprite.anims.play('player-killed', true);

        this._emitter.emit("GameEvent","PlayerKilled");
    }

    // TODO still has issue of player being bumped below platforms

}