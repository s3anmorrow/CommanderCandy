import Phaser from "phaser";
import { START_HEALTH, HEALTH_FOR_HIT, BULLET_SPEED } from "./Globals";

export default class Player {

    constructor(scene, assetManager, platformManager, emitter) {
        this._scene = scene;
        this._assetManager = assetManager;
        this._platformManager = platformManager;
        this._emitter = emitter;
        this._sprite = null;
        this._bullet = null;
        this._health = START_HEALTH;
        this._immune = false;

        this._lastDirection = 1;
    }

    // ----------------------------------------------- get/sets
    get sprite() {
        return this._sprite;
    }

    get laserSprite() {
        return this._bullet;
    }

    get health() {
        return this._health;
    }

    // ----------------------------------------------- public methods
    preload() {

    }

    setup() {
        // initialization
        this._immune = false;
        this._health = START_HEALTH;

        // add sprite to game as physics sprite
        this._sprite = this._assetManager.addSprite(100, 450, "player/pixil-frame-4", "main", true);
        this._sprite.body.setGravityY(300);
        this._sprite.setBounce(0.2);
        this._sprite.setCollideWorldBounds(true);
        // setup collider between all platforms and the player
        this._platformManager.setupCollider(this._sprite);


        // group of laser bolts
        //this.bullets = this.physics.add.group();


        // add laser sprite to game
        this._bullet = this._assetManager.addSprite(0, 1, "misc/bullet", "main", true);
        this._bullet.body.setAllowGravity(false);
        this._bullet.setActive(false);
        this._bullet.x = -1000;

        this._platformManager.setupCollider(this._bullet, () => {this.killLaser();});
    }

    moveLeft() {
        this._sprite.setVelocityX(-160);
        this._sprite.anims.play('walk', true);
        this._lastDirection = 0;
    }

    moveRight() {
        this._sprite.setVelocityX(160);
        this._sprite.anims.play('walk', true);
        this._lastDirection = 1;
    }

    stop() {
        this._sprite.setVelocityX(0);
        this._sprite.anims.play('walk');
    }

    jump() {
        if (this._sprite.body.touching.down) {
            this._sprite.setVelocityY(-330);
            this._sprite.anims.play('walk');
        }
    }

    fire() {
        if (this._bullet.active) return;

        // fire in direction last moved
        if (this._lastDirection == 1) {
            this._bullet.setVelocityY(0);
            this._bullet.setVelocityX(BULLET_SPEED);
        } else {
            this._bullet.setVelocityY(0);
            this._bullet.setVelocityX(-BULLET_SPEED);
        }

        // position laser bolt with player
        this._bullet.x = this._sprite.x;
        this._bullet.y = this._sprite.y + 6;
        // bring player to top so laser is behind
        this._scene.children.bringToTop(this._sprite);

        // make it visible and play animation
        this._bullet.setActive(true);
        this._bullet.visible = true;
    }

    update() {
        // check if laser off the stage
        if (this._bullet.active) {
            if ((this._bullet.x > 600) || (this._bullet.x < 0)) {
                this.killLaser();
            }
        }
    }

    killLaser() {
        if (this._bullet.active) {
            console.log("_killLaser");
            this._bullet.setActive(false);
            //this._laser.disableBody(true, true);
            this._bullet.visible = false;
            this._bullet.x = -1000;
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
            this._scene.time.delayedCall(500, () => {
                this._immune = false;
                console.log("no immune anymore");
            });
        }

    }

    // -------------------------------------------------- private methods
    _killMe() {
        console.log("IT KILLS!!!");

        // TODO - play animation of player getting hurt

        this._emitter.emit("GameEvent","PlayerKilled");
    }
}