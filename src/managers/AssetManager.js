import { assetManifest } from "../manifests/AssetManifest";

export default class AssetManager {

    constructor(scene) {
        this._scene = scene;        
    }

    // ------------------------------------------------------ public methods
    preload() {
        this._scene.load.path = './assets/';

        for (let data of assetManifest) {
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

    addSprite(x, y, frameID, spritesheetID = undefined, physics = false) {
        // adding sprite based on loaded image
        if (spritesheetID == undefined) return this._scene.add.sprite(x, y, frameID).setOrigin(0, 0);

        // adding sprite based on spritesheet frames
        if (physics) return this._scene.physics.add.sprite(x, y, spritesheetID, frameID).setOrigin(0, 0);
        else return this._scene.add.sprite(x, y, spritesheetID, frameID).setOrigin(0, 0);
    }

    addImage(x, y, imageID) {
        return this._scene.add.image(x, y, imageID).setOrigin(0, 0);
    }

    addSound(soundID) {
        return this._scene.sound.add(soundID);
    }

}