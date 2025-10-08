import Phaser from "phaser";
import LifelineManager from "../objects/LifelineManager.js";
import AnswerManager from "../objects/AnswerManager.js";
import { createRetroText } from "../objects/UIHelpers.js";
import cases from "../../data/cases.json";

export default class CaseScene extends Phaser.Scene {
  constructor() {
    super("CaseScene");
  }

  preload() {
    this.load.image("accidentScene", "images/accident.jpg");
  }

  create() {
    const { width, height } = this.scale;
    const currentCase = cases[0];

    this.score = 0;
    this.lifelines = [
      { id: "eliminate", name: "Eliminate False Clue", used: false },
      { id: "newclue", name: "Get New Clue", used: false },
      { id: "identify", name: "Identify Wrong Answer", used: false },
    ];

    // --- Background ---
    const bg = this.add.image(width / 2, height / 2, "accidentScene");
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);

    // --- Scene Title ---
    const titleText = currentCase.title.replace("Case 1", "Scene 1");
    const title = this.add.text(width / 2, height / 2, titleText, {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "32px",
      color: "#00FFCC",
      fontStyle: "bold",
      stroke: "#003333",
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: "#00FFFF", blur: 15, fill: true },
      align: "center",
      wordWrap: { width: width - 100 },
    }).setOrigin(0.5);

    // --- Initial Fade-in ---
    title.alpha = 0;
    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 800,
      ease: "Sine.easeInOut",
    });

    // --- Managers ---
    this.answerManager = new AnswerManager(
      this,
      [...currentCase.causes],
      currentCase.correctCause,
      (result, pts) => this.handleResult(result, pts)
    );
    this.lifelineManager = new LifelineManager(
      this,
      this.lifelines,
      (id) => this.useLifeline(id)
    );

    // --- Score & Lifeline Boxes (Top-Right) ---
    this.scoreBox = this.add.rectangle(width - 100, 40, 150, 40, 0x1e1e3e, 0.9)
      .setStrokeStyle(2, 0x00FFCC);
    this.scoreText = this.add.text(this.scoreBox.x, this.scoreBox.y, `Score: ${this.score}`, {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#00FFCC",
      align: "center",
    }).setOrigin(0.5);

    this.lifelineBox = this.add.rectangle(width - 100, 90, 150, 40, 0x1e1e3e, 0.9)
      .setStrokeStyle(2, 0x00FFCC)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.lifelineManager.open());

    this.lifelineText = this.add.text(this.lifelineBox.x, this.lifelineBox.y, "Lifelines", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#00FFCC",
      align: "center",
    }).setOrigin(0.5);

    this.scoreBox.alpha = 0;
    this.scoreText.alpha = 0;
    this.lifelineBox.alpha = 0;
    this.lifelineText.alpha = 0;

    // --- Transition Title & Reveal Clues/Culprits ---
    this.time.delayedCall(500, () => {
      this.tweens.add({
        targets: title,
        x: width / 2,
        y: 30,
        fontSize: "20px",
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          title.setOrigin(0.5, 0);

          this.tweens.add({
            targets: [this.scoreBox, this.scoreText, this.lifelineBox, this.lifelineText],
            alpha: { from: 0, to: 1 },
            duration: 600,
          });

          // --- Clues ---
          const clueHeading = this.add.text(width / 2, 100, "CLUES", {
            fontFamily: "Orbitron, sans-serif",
            fontSize: "28px",
            color: "#00FFCC",
            fontStyle: "bold",
          }).setOrigin(0.5);

          let clueStartY = 160; // spacing below heading
          const clueSpacingY = 100;
          currentCase.clues.forEach((clue, i) => {
            const clueBox = this.add.rectangle(width / 2, clueStartY + i * clueSpacingY, 360, 60, 0x1a3b1a, 0.8)
              .setStrokeStyle(2, 0x00FFCC);

            this.add.text(clueBox.x, clueBox.y, clue.text, {
              fontFamily: "monospace",
              fontSize: "18px",
              color: "#00FFCC",
              wordWrap: { width: 340, useAdvancedWrap: true },
              align: "center"
            }).setOrigin(0.5);
          });

          // --- Culprits ---
          const culpritHeading = this.add.text(width / 2, clueStartY + currentCase.clues.length * clueSpacingY + 50, "CULPRITS", {
            fontFamily: "Orbitron, sans-serif",
            fontSize: "26px",
            color: "#00FFCC",
            fontStyle: "bold",
          }).setOrigin(0.5);

          let culpritStartY = culpritHeading.y + 50;
          const culpritSpacingY = 80;
          this.culpritBoxes = [];
          currentCase.causes.forEach((cause, i) => {
            const culpritBox = this.add.rectangle(width / 2, culpritStartY + i * culpritSpacingY, 400, 50, 0x4b1a1a, 0.85)
              .setStrokeStyle(2, 0x00FFCC)
              .setInteractive({ useHandCursor: true });

            const culpritText = this.add.text(culpritBox.x, culpritBox.y, cause, {
              fontFamily: "monospace",
              fontSize: "20px",
              color: "#00FFCC",
              align: "center",
            }).setOrigin(0.5);

            culpritBox.on("pointerover", () => {
              if (culpritBox.fillColor !== 0x5555ff)
                culpritBox.setFillStyle(0xFF8844, 0.85);
            });
            culpritBox.on("pointerout", () => {
              if (culpritBox.fillColor !== 0x5555ff)
                culpritBox.setFillStyle(0x4b1a1a, 0.85);
            });

            culpritBox.on("pointerdown", () => {
              this.culpritBoxes.forEach(box => box.setFillStyle(0x4b1a1a, 0.85));
              culpritBox.setFillStyle(0x5555ff, 0.85);
              this.answerManager.checkAnswer(cause);
            });

            this.culpritBoxes.push(culpritBox);
          });
        },
      });
    });
  }

  useLifeline(id) {
    const life = this.lifelines.find((l) => l.id === id);
    if (!life || life.used) return;

    life.used = true;
    this.score -= 3;
    this.scoreText.setText(`Score: ${this.score}`);
    this.lifelineManager.close();

    if (id === "newclue") {
      const width = this.scale.width;
      const clueY = 160 + this.culpritBoxes.length * 100 + 80;
      const clueBox = this.add.rectangle(width / 2, clueY, 360, 60, 0x1a3b1a, 0.8).setStrokeStyle(2, 0x00FFCC);
      this.add.text(clueBox.x, clueBox.y, "CCTV shows vehicle ran red light", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#00FFCC",
        wordWrap: { width: 340, useAdvancedWrap: true },
        align: "center"
      }).setOrigin(0.5);
    }
  }

  handleResult(result, pts) {
    if (pts) {
      this.score += pts;
      this.scoreText.setText(`Score: ${this.score}`);
    }

    const feedbackColor = result === "correct" ? "#00FFCC" : "#FF4444";
    const feedbackText = result === "correct" ? "✅ Correct!" : "❌ Wrong. Try the next scene.";

    const feedback = this.add.text(
      this.scale.width / 2,
      this.scale.height - 80,
      feedbackText,
      { fontFamily: "monospace", fontSize: "20px", color: feedbackColor, align: "center" }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      alpha: { from: 1, to: 0 },
      duration: 1200,
      delay: 800,
      onComplete: () => feedback.destroy(),
    });
  }
}
