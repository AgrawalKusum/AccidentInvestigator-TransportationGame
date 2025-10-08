import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Preload the image normally
    this.load.image(
      "accidentScene",
      "images/WhatsApp Image 2025-10-08 at 22.19.38.jpeg"
    );
  }

  create() {
    const { width, height } = this.scale;

    // Add accident background immediately
    const bg = this.add.image(width / 2, height / 2, "accidentScene");
    bg.setDisplaySize(width, height);

    // Dark overlay for contrast
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);

    // Title text
    const title = this.add.text(width / 2, height / 2 - 50, "ACCIDENT INVESTIGATOR", {
      fontFamily: "monospace",
      fontSize: "28px",
      color: "#00FF88",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Loading text below title
    const loadingText = this.add.text(width / 2, height / 2 + 50, "Loading... 0%", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#00FF88",
    }).setOrigin(0.5);

    // Fade-in the title
    title.alpha = 0;
    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 800,
    });

    // Fake loading for 3 seconds
    let fakeProgress = 0;
    const totalSteps = 99;
    this.time.addEvent({
      delay: 30, // 30ms per step → 3s total
      repeat: totalSteps,
      callback: () => {
        fakeProgress++;
        loadingText.setText(`Loading... ${fakeProgress}%`);

        if (fakeProgress >= 100) {
          // After fake loading completes, go to CaseScene
          this.time.delayedCall(500, () => {
            this.scene.start("CaseScene");
          });
        }
      },
    });
  }
}