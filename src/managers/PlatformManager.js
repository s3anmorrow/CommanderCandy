import { levelManifest } from "../manifests/LevelManifest";
import { STARTING_LEVEL } from "../game/Globals";

export default class PlatformManager {

    constructor(scene, assetManager, emitter) {
        this._scene = scene;
        this._assetManager = assetManager;
        this._platforms = null;
        this._level = STARTING_LEVEL;
        this._candyX = 0;
        this._candyY = 0;
        this._playerX = 0;
        this._playerY = 0;
        this._emitter = emitter;
    }

    get platforms() {
        return this._platforms;
    }

    get candyX() {
        return this._candyX;
    }

    get candyY() {
        return this._candyY;
    }

    get playerX() {
        return this._playerX;
    }

    get playerY() {
        return this._playerY;
    }

    // ------------------------------------------------------ public methods
    preload() {
        // setup physics static group for our platforms - static means don't move when hit with other game object
        this._platforms = this._scene.physics.add.staticGroup({
            maxSize: 200
        });       
    }

    setup() {
        // initialization
        this._level = STARTING_LEVEL;
        this._buildLevel();
    }

    levelUp() {
        if (this._level < levelManifest.length) this._level++;
        else this._level = STARTING_LEVEL;

        console.log("level: " + this._level);

        // pause gravity!
        this._scene.physics.pause();

        let tween = this._scene.tweens.addCounter({
            from: 1,
            to: 0,
            duration: 750,
            onUpdate: () => {
                this._platforms.children.iterate((platform) => {
                    platform.alpha = tween.getValue();
                });
            },
            onComplete: () => {
                this._buildLevel();
                this._scene.physics.resume();
                this._emitter.emit("GameEvent","LevelReady");
            }
        });
    }

    setupCollider(gameObject, onCollision = null) {
        this._scene.physics.add.collider(gameObject, this._platforms, onCollision);
    }

    // ----------------------------------------------------- private methods
    _capitialize(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    _buildLevel() {
        // empty group 
        this._platforms.clear(true);

        let dataset = levelManifest[this._level - 1];
        // add platforms to the scene
        for (let row=0; row<dataset.length; row++) {
            let rowData = dataset[row];
            for (let col=0; col<10; col++) {
                let cellData = rowData.charAt(col);
                if (cellData != "-") {
                    let type = "";
                    if (cellData.toUpperCase() == "B") type = "Blue";
                    else if (cellData.toUpperCase() == "R") type = "Red";
                    else if (cellData.toUpperCase() == "O") type = "Orange";
                    else if (cellData.toUpperCase() == "G") type = "Green";
                    else if (cellData.toUpperCase() == "S") type = "Silver";
                    else if (cellData.toUpperCase() == "C") {
                        this._candyX = col * 60 + 12;
                        this._candyY = row * 30;
                    } else if (cellData.toUpperCase() == "P") {
                        this._playerX = col * 60 + 30;
                        this._playerY = row * 30;
                    }
                    if ((cellData.toUpperCase() != "C") && (cellData.toUpperCase() != "P")) {
                        this._platforms.add(this._assetManager.addSprite(
                            col * 60,
                            row * 30,
                            "platform/platform" + type,
                            "main"
                        ));
                    }
                }
            }
        }
    }

}