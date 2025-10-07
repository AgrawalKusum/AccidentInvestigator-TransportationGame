import Phaser from "phaser";
export default class CaseScene extends Phaser.Scene {
  constructor() {
    super("CaseScene");
  }
  create() {
    this.add.text(300, 250, "CaseScene Loaded!", { color: "#fff" });
  }
}