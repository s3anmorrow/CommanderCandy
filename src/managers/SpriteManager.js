import { spriteManifest } from "../manifests/spriteManifest";

export default class SpriteManager {

    constructor(scene) {
        this._scene = scene;
    }

    // ------------------------------------------------------ public methods
    preload() {
        for (let data of spriteManifest) {
            if (data.type == "image") {
                // loading static image
                this._scene.load.image(data.id, data.src);
            } else if (data.type == "sprite") {
                // for tecture packer spritesheets need to load multiatlas (a spritesheet which all sprites aren't same size)
                this._scene.load.multiatlas(data.id, data.src);
            } else if (data.type == "sound") {
                // loading sound effect
                this._scene.load.audio(data.id, data.src);  
            }
        }
    }

    registerAnimation(spritesheetID, animationID, startFrame, endFrame, prefix = "", doesLoop = false) {
        // create an animation sequence called walk from spritesheet with defined frames
        this._scene.anims.create({
            key: animationID,
            frames: this._scene.anims.generateFrameNames(spritesheetID,{
                start:startFrame, end:endFrame,
                zeroPad: 0,
                prefix: prefix, suffix: ''
            }),
            frameRate: 10,
            yoyo:doesLoop,
            repeat: -1
        });
    }

    addSprite(x, y, spritesheetID, frameID, physics = false) {
        if (physics) return this._scene.physics.add.sprite(x, y, spritesheetID, frameID);
        else return this._scene.add.sprite(x, y, spritesheetID, frameID);
    }

    addSound(soundID) {
        return this.sound.add(soundID);
    }

}