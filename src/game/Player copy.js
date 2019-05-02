import { START_HEALTH, HEALTH_FOR_HIT, LASER_SPEED } from "./Globals";

export default class Player {

    constructor(scene, assetManager, platformManager, emitter) {
        this._scene = scene;
        this._assetManager = assetManager;
        this._platformManager = platformManager;
        this._emitter = emitter;
        this._sprite = null;
        this._laser = null;
        this._health = START_HEALTH;

        this._lastDirection = 1;
        

        this._state = Player.IDLE;
    }

    // ----------------------------------------------- get/sets
    get sprite() {
        return this._sprite;
    }

    get laserSprite() {
        return this._laser;
    }

    get health() {
        return this._health;
    }

    // ----------------------------------------------- public methods
    preload() {

    }

    setup() {
        // add sprite to game as physics sprite
        this._sprite = this._assetManager.addSprite(100, 450, "main", "player/pixil-frame-4", true);
        this._sprite.body.setGravityY(300);
        this._sprite.setBounce(0.2);
        this._sprite.setCollideWorldBounds(true);
        // setup collider between all platforms and the player
        this._platformManager.setupCollider(this._sprite);


        // group of laser bolts
        //this.bullets = this.physics.add.group();


        // add laser sprite to game
        this._laser = this._assetManager.addSprite(0, 1, "main", "laser/pixil-frame-0", true);
        //this._laser.displayWidth = 1;
        this._laser.body.setAllowGravity(false);
        this._laser.alpha = 0.6;
        this._laser.setActive(false);

        this._platformManager.setupCollider(this._laser, () => {this.killLaser();});
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
        if (this._state == Player.SHOOT) return;
        if (this._laser.active) return;

        this._state = Player.SHOOT;

        // fire in direction last moved
        if (this._lastDirection == 1) {
            this._laser.setVelocityY(0);
            this._laser.setVelocityX(LASER_SPEED);
        } else {
            this._laser.setVelocityY(0);
            this._laser.setVelocityX(-LASER_SPEED);
        }

        // position laser bolt with player
        this._laser.x = this._sprite.x;
        this._laser.y = this._sprite.y + 8;

        // bring player to top so laser is behind
        this._scene.children.bringToTop(this._sprite);

        // // make laser get longer while flying through air
        // this._laser.displayWidth = 1;
        // let tween = this._scene.tweens.addCounter({
        //     from: 0,
        //     to: 100,
        //     duration: 300,
        //     onUpdate: () => {
        //         this._laser.displayWidth = tween.getValue();
        //     }
        // });

        // make it visible and play animation
        this._laser.setActive(true);
        this._laser.visible = true;
        this._laser.anims.play("laser");
    }

    update() {
        // move laser sprite around with player
        //this._laser.x = this._sprite.x;
        //this._laser.y = this._sprite.y + 8;

        // check if laser off the stage
        if (this._laser.active) {
            if ((this._laser.x > 600) || (this._laser.x < 0)) {
                this.killLaser();
            }
        }
    }

    // reset() {
    //     this._health = START_HEALTH;
    //     this._lastDirection = 1;
    //     this._state = Player.IDLE;

    // }

    killLaser() {
        if (this._laser.active) {
            console.log("_killLaser");
            this._laser.setActive(false);
            //this._laser.disableBody(true, true);
            this._laser.visible = false;
            this._laser.x = -1000;
            this._state = Player.IDLE;
        }
    }

    hurtMe() {
        console.log("IT HURTS!!!");

        // remove health for enemy hit
        this._health -= HEALTH_FOR_HIT;

        // TODO - play animation of player getting hurt
        // TODO - make sprite recoil in opposite direction
        // TODO - disable collision momentarily

        this._emitter.emit("GameEvent","PlayerHurt");

        if (this._health <= 0) {
            this._killMe();
        }

    }

    // -------------------------------------------------- private methods
    _killMe() {
        console.log("IT KILLS!!!");

        // TODO - play animation of player getting hurt

        this._emitter.emit("GameEvent","PlayerKilled");
    }
}

// class constant hacking
Player.INIT = 0;
Player.IDLE = 1;
Player.LEFT = 2;
Player.RIGHT = 3;
Player.JUMP = 4;
Player.SHOOT = 5;