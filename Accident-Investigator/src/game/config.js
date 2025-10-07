import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import CaseScene from "./scenes/CaseScene";
import ResultScene from "./scenes/ResultScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#222",
  parent: "game-container",   // This div will be in React
  scene: [BootScene, CaseScene, ResultScene]
};

export default config;
