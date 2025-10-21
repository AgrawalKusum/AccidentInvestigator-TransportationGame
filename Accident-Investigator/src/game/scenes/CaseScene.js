import Phaser from "phaser";
import LifelineManager from "../objects/LifelineManager.js";
import AnswerManager from "../objects/AnswerManager.js";
import cases from "../../data/cases.json";

export default class CaseScene extends Phaser.Scene {
  constructor() {
    super("CaseScene");
  }

  preload() {
    this.load.image("accidentScene", "images/WhatsApp Image 2025-10-08 at 22.36.49.jpeg");
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
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

    // --- Scene Title ---
    const title = this.add.text(width / 2, 40, "Clues & Culprits", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "32px",
      color: "#00FFCC",
      fontStyle: "bold",
      stroke: "#003333",
      strokeThickness: 4,
    }).setOrigin(0.5);

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

    // --- Score & Lifeline UI ---
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

    // --- Clues Section ---
    const clueHeading = this.add.text(width / 2, 130, "CLUES", {
      fontFamily: "Orbitron, sans-serif",
      fontSize: "28px",
      color: "#00FFCC",
      fontStyle: "bold",
    }).setOrigin(0.5);

    let clueStartY = 180;
    const clueSpacingY = 100;

    currentCase.clues.forEach((clue, i) => {
      this.createCard(width / 2, clueStartY + i * clueSpacingY, 380, 70, 0x1a3b1a, clue.text);
    });

    // --- Culprits Section ---
    const culpritHeading = this.add.text(
      width / 2,
      clueStartY + currentCase.clues.length * clueSpacingY + 50,
      "CULPRITS",
      {
        fontFamily: "Orbitron, sans-serif",
        fontSize: "26px",
        color: "#00FFCC",
        fontStyle: "bold",
      }
    ).setOrigin(0.5);

    let culpritStartY = culpritHeading.y + 50;
    const culpritSpacingY = 80;
    this.culpritBoxes = [];

    currentCase.causes.forEach((cause, i) => {
      const culpritCard = this.createCard(
        width / 2,
        culpritStartY + i * culpritSpacingY,
        420,
        60,
        0x4b1a1a,
        cause,
        true
      );

      const cardBg = culpritCard.list[0];
      cardBg.on("pointerdown", () => {
        this.culpritBoxes.forEach(card => card.list[0].setFillStyle(0x4b1a1a, 0.9));
        cardBg.setFillStyle(0x5555ff, 0.9);
        this.answerManager.checkAnswer(cause);
      });

      this.culpritBoxes.push(culpritCard);
    });

    // --- Back Button ---
    const backBtn = this.add.rectangle(80, 40, 120, 40, 0x1a65ac, 0.8).setInteractive();
    const backText = this.add.text(80, 40, "← Back", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#FFFFFF",
    }).setOrigin(0.5);
    backBtn.on("pointerdown", () => this.scene.start("AccidentScene"));
  }

  createCard(x, y, width, height, color, text, interactive = false) {
    const card = this.add.container(x, y);
    const cardBg = this.add.graphics();
    cardBg.fillStyle(color, 0.95);
    cardBg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);
    cardBg.lineStyle(2, 0x00FFCC);
    cardBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 15);

    const txt = this.add.text(0, 0, text, {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#00FFCC",
      wordWrap: { width: width - 40 },
      align: "center",
    }).setOrigin(0.5);

    card.add([cardBg, txt]);

    if (interactive) {
      cardBg.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
      cardBg.on("pointerover", () => this.tweens.add({ targets: card, scale: 1.05, duration: 150 }));
      cardBg.on("pointerout", () => this.tweens.add({ targets: card, scale: 1.0, duration: 150 }));
    }

    return card;
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
      const clueY = 180 + this.culpritBoxes.length * 100 + 80;
      this.createCard(width / 2, clueY, 380, 70, 0x1a3b1a, "CCTV footage shows the truck ran a red light.");
    }
  }

  handleResult(result, pts) {
    if (pts) {
      this.score += pts;
      this.scoreText.setText(`Score: ${this.score}`);
    }

    const feedbackColor = result === "correct" ? "#00FFCC" : "#FF4444";
    const feedbackText = result === "correct" ? "✅ Correct!" : "❌ Wrong. Try again.";

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
