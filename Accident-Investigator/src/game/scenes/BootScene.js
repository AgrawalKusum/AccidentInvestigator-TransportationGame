import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // preload assets here if needed
  }

  create() {
    this.add.text(300, 250, "BootScene Loaded!", { color: "#fff" });
    this.scene.start("CaseScene"); // move to next scene if defined
  }
}
