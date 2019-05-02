import { START_HEALTH } from "./Globals";

export default class UserInterface {

    constructor(scene, spriteManager) {
        this._scene = scene;
        this._spriteManager = spriteManager;
        this._scoreText = null;
        this._healthBar = null;
        //this._healthBarBacking = null;
        this._healthBarBorder = null;
        this._score = 0;
        this._health = START_HEALTH;
    }

    // ---------------------------------------------- public methods
    preload() {
        // loading bitmap font image
        this._scene.load.bitmapFont('pressStart', './../assets/fonts/font.png', './../assets/fonts/font.fnt');
    }

    setup() {
        // initialization
        this._score = 0;
        // add score bitmaptext
        this._scoreText = this._scene.add.bitmapText(16, 16, "pressStart", "0");

        // add health bar border
        this._healthBarBorder = this._spriteManager.addSprite(483, 18, "main", "misc/healthBorder");

        // // add health bar background
        // this._healthBarBacking = this._scene.add.graphics({x:485, y:22});
        // this._healthBarBacking.fillStyle(0xFFFFFF, 0.5);
        // this._healthBarBacking.fillRect(0, 0, 100, 15);
        // add health bar
        this._healthBar = this._scene.add.graphics({x:488, y:22});

        this._health = START_HEALTH;
        this._renderHealthBar();
    }

    updateScore(score) {
        this._score += score;
        this._scoreText.setText(this._score);
    }

    updateHealth(health) {
        this._health = health;
        this._renderHealthBar();
    }

    reset() {
        this._score = 0;
        this._health = START_HEALTH;
        this.updateScore(0);
        this._renderHealthBar();
    }

    // ----------------------------------------------- private methods
    _renderHealthBar() {
        this._healthBar.clear();
        let color = 0xFFFFFF;
        if (this._health <= 3) color = 0xAA0114;
        else if (this._health <= 5) color = 0xFFA500;
        
        this._healthBar.fillStyle(color, 1);
        this._healthBar.fillRect(0, 0, (this._health/START_HEALTH) * 94, 15);
    }


}