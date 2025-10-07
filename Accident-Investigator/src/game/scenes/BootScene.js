import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x111111);

    const title = this.add.text(width / 2, height / 2 - 40, "ACCIDENT INVESTIGATOR", {
      fontFamily: "monospace",
      fontSize: "28px",
      color: "#00FF88",
    });
    title.setOrigin(0.5);

    const prompt = this.add.text(width / 2, height / 2 + 20, "PRESS ANY KEY TO START", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#00FF88",
    });
    prompt.setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard.once("keydown", () => {
      this.scene.start("CaseScene");
    });
  }
}
