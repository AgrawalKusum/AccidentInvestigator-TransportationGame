import Phaser from "phaser";
import BootScene from "./scenes/BootScene.js";
import CaseScene from "./scenes/CaseScene.js";
import ResultScene from "./scenes/ResultScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  parent: "game-container",   // This div will be in React
  scene: [BootScene, CaseScene]
};

export default config;
