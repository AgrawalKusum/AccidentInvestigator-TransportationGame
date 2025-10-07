import Phaser from "phaser";

export default class CaseScene extends Phaser.Scene {
  constructor() {
    super("CaseScene");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);
    this.add.text(200, 250, "CaseScene Loaded!", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#00FF88",
    });
  }
}