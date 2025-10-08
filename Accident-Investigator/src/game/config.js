import Phaser from "phaser";
import BootScene from "./scenes/BootScene.js";
import CaseScene from "./scenes/CaseScene.js";

const config = {
  type: Phaser.AUTO,
  width: 1024,            // logical width (for layout calculations)
  height: 768,            // logical height
  backgroundColor: "#000000",
  parent: "game-container",

  //Key scaling options
  scale: {
    mode: Phaser.Scale.FIT,   // makes canvas fit the parent container
    autoCenter: Phaser.Scale.CENTER_BOTH, // centers it
    width: 1024,
    height: 768,
    min: {
      width: 800,
      height: 600
    },
    max: {
      width: 1600,
      height: 1200
    }
  },

  scene: [BootScene, CaseScene]
};

export default config;
