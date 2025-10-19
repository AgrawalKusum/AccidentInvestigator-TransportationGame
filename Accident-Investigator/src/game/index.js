import Phaser from "phaser";
import BootScene from "./scenes/BootScene.js";
import CaseScene from "./scenes/CaseScene.js";
import ResultScene from "./scenes/ResultScene.js";
import LevelScene from "./scenes/LevelScene.js";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  parent: "game-container",

  scale: {
    mode: Phaser.Scale.RESIZE,          // ✅ Dynamically adjusts to any window size
    autoCenter: Phaser.Scale.CENTER_BOTH, // ✅ Keeps everything centered
  },

  render: {
    pixelArt: false, // smoother scaling for images
    antialias: true,
    roundPixels: false,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  scene: [BootScene, LevelScene, CaseScene, ResultScene],
};

export default config;

