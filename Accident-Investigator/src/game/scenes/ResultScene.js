import Phaser from "phaser";
export default class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }
  create() {
    this.add.text(300, 250, "ResultScene Loaded!", { color: "#fff" });
  }
}
