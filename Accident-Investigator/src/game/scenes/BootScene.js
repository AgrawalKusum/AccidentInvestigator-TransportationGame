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
  }

  create() {
    const { width, height } = this.scale;

    // Create background
    const bg = this.add.image(width / 2, height / 2, "accidentScene");

    // --- ✅ RESPONSIVE BACKGROUND SCALING ---
    const bgScaleX = width / bg.width;
    const bgScaleY = height / bg.height;
    const scale = Math.max(bgScaleX, bgScaleY); // cover entire screen
    bg.setScale(scale).setScrollFactor(0);

    // --- Overlay for contrast ---
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);

    // --- Title text ---
    const title = this.add.text(width / 2, height / 2 - 70, "ACCIDENT INVESTIGATOR", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: `${Math.min(width * 0.05, 42)}px`, // responsive font
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
    }).setOrigin(0.5);

    // --- Loading text ---
    const loadingText = this.add.text(width / 2, height / 2 + 40, "Loading... 0%", {
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
    }).setOrigin(0.5);

    // --- Subtle fade-in animation ---
    this.tweens.add({
      targets: title,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: "Sine.easeInOut",
    });

    // --- Fake loading ---
    let fakeProgress = 0;
    const totalSteps = 99;

    this.time.addEvent({
      delay: 30,
      repeat: totalSteps,
      callback: () => {
        fakeProgress++;
        loadingText.setText(`Loading... ${fakeProgress}%`);

        // Add pulsing effect to loading text
        loadingText.setScale(1 + 0.02 * Math.sin(fakeProgress / 2));

        if (fakeProgress >= 100) {
          this.time.delayedCall(500, () => {
            // Smooth fade-out transition
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
              this.scene.start("CaseScene");
            });
          });
        }
      },
    });
  }
}
