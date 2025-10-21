import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Load background image
    this.load.image(
      "accidentScene",
      "images/WhatsApp Image 2025-10-08 at 22.19.38.jpeg"
    );

    // Preload other assets if needed (like button backgrounds for LevelScene)
    this.load.image("level-bg", "images/level-bg.png");
    this.load.image("level-btn", "images/level-btn.png");
  }

  create() {
    const { width, height } = this.scale;

    // --- Background ---
    const bg = this.add.image(width / 2, height / 2, "accidentScene");
    const bgScaleX = width / bg.width;
    const bgScaleY = height / bg.height;
    const scale = Math.max(bgScaleX, bgScaleY);
    bg.setScale(scale).setScrollFactor(0);

    // --- Overlay for contrast ---
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);

    // --- Title text ---
    const title = this.add
      .text(width / 2, height / 2 - 70, "ACCIDENT INVESTIGATOR", {
        fontFamily: "Orbitron, sans-serif",
        fontSize: `${Math.min(width * 0.05, 42)}px`,
        color: "#00FFCC",
        fontStyle: "bold",
        stroke: "#001100",
        strokeThickness: 3,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#00ffaa",
          blur: 20,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // --- Loading text ---
    const loadingText = this.add
      .text(width / 2, height / 2 + 40, "Loading... 0%", {
        fontFamily: "monospace",
        fontSize: `${Math.min(width * 0.03, 24)}px`,
        color: "#00FFAA",
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#004433",
          blur: 10,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // --- Fade-in title ---
    this.tweens.add({
      targets: title,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: "Sine.easeInOut",
    });

    // --- Fake loading animation ---
    let fakeProgress = 0;
    const totalSteps = 99;

    this.time.addEvent({
      delay: 30,
      repeat: totalSteps,
      callback: () => {
        fakeProgress++;
        loadingText.setText(`Loading... ${fakeProgress}%`);

        // Pulse animation for text
        loadingText.setScale(1 + 0.02 * Math.sin(fakeProgress / 2));

        if (fakeProgress >= 100) {
          this.time.delayedCall(500, () => {
            // Smooth fade-out
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
              // 🟢 Go to Level Selection instead of CaseScene
              this.scene.start("LevelScene");
            });
          });
        }
      },
    });
  }
}


