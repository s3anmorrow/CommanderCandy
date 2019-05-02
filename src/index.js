// references:
// https://phaser.io/tutorials/making-your-first-phaser-3-game/part7
// https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3

// texture packer online (crappy)
// https://www.codeandweb.com/free-sprite-sheet-packer
// free texture packer app
// http://free-tex-packer.com/

// pixel editors
// https://www.pixilart.com/draw#
// https://www.piskelapp.com/p/agxzfnBpc2tlbC1hcHByEwsSBlBpc2tlbBiAgKCmk5eKCAw/edit

// phaser 3 starting template with webpack
// https://github.com/photonstorm/phaser3-project-template

// for bitmapText font spritesheets
// http://kvazars.com/littera/

// design pattern used for phaser 3 game
// https://www.youtube.com/watch?v=bo3BNf3XDNc

import Phaser from "phaser";
import { DEBUG_MODE, BACKGROUND_COLOR } from "./game/Globals";
import TitleScene from "./scenes/TitleScene";
import GameScene from "./scenes/GameScene";
import EndScene from "./scenes/EndScene";

// configuration of the game
const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 600,
  height: 600,
  backgroundColor:BACKGROUND_COLOR,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: DEBUG_MODE
    }
  }
};
// construct the main Phaser game object
let game = new Phaser.Game(config);
// add scenes to the game
game.scene.add("title", new TitleScene(game));
game.scene.add("game", new GameScene(game));
game.scene.add("gameover", new EndScene(game));
game.scene.start("title");