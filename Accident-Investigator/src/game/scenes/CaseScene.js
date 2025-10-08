import Phaser from "phaser";
import ClueManager from "../objects/ClueManager.js";
import LifelineManager from "../objects/LifelineManager.js";
import AnswerManager from "../objects/AnswerManager.js";
import { createRetroText } from "../objects/UIHelpers.js";
import cases from "../../data/cases.json";

export default class CaseScene extends Phaser.Scene {
  constructor() {
    super("CaseScene");
  }

  preload() {
    // Preload accident scene background image
    this.load.image("accidentScene", "images/accident.jpg"); // <-- update path
  }

  create() {
  const { width, height } = this.scale;
  const currentCase = cases[0];

  this.score = 0;
  this.lifelines = [
    { id: "eliminate", name: "Eliminate False Clue", used: false },
    { id: "newclue", name: "Get New Clue", used: false },
    { id: "identify", name: "Identify Wrong Answer", used: false }
  ];

  // Add background image
  this.background = this.add.image(width / 2, height / 2, "accidentScene");
  this.background.setDisplaySize(width, height);

  // Create the case title in the center with bigger font
  const introTitle = this.add.text(width / 2, height / 2, currentCase.title, {
    fontFamily: "monospace",
    fontSize: "40px",
    color: "#00FF88",
    fontStyle: "bold",
  }).setOrigin(0.5);

  // Hide other UI initially
  this.clueManager = new ClueManager(this, [...currentCase.clues]);
  this.answerManager = new AnswerManager(this, [...currentCase.causes], currentCase.correctCause, 
    (result, pts) => this.handleResult(result, pts));
  this.lifelineManager = new LifelineManager(this, this.lifelines, id => this.useLifeline(id));
  this.lifelineBtn = createRetroText(this, width - 120, 50, "Lifelines", 14, "#00FF88");
  this.lifelineBtn.setInteractive({ useHandCursor: true }).setVisible(false);

  this.scoreText = createRetroText(this, width - 20, 20, `Score: ${this.score}`, 14, "#00FF88", 1);
  this.scoreText.setVisible(false);

  // Animate the title to top-left after 3 seconds
  this.time.delayedCall(3000, () => {
  this.tweens.add({
    targets: introTitle,
    x: width / 2,           // horizontally centered
    y: 40,                  // leave some space below top for score/lifeline
    fontSize: "16px",       // shrink font
    duration: 1000,
    onComplete: () => {
      introTitle.setOrigin(0.5, 0); // keep horizontally centered, top-aligned vertically
      // reveal other UI
      this.clueManager.render();
      this.answerManager.render();
      this.lifelineBtn.setVisible(true);
      this.scoreText.setVisible(true);
    }
  });
});
}


  useLifeline(id) {
    const life = this.lifelines.find(l => l.id === id);
    if (!life || life.used) return;

    life.used = true;
    this.score -= 3;
    this.scoreText.setText(`Score: ${this.score}`);
    this.lifelineManager.close();

    if (id === "eliminate") this.clueManager.removeFalseClue();
    if (id === "newclue") this.clueManager.addNewClue({ text: "CCTV shows vehicle ran red", truth: true });
    if (id === "identify") this.answerManager.disableWrongAnswer();
  }

  handleResult(result, pts) {
    if (pts) {
      this.score += pts;
      this.scoreText.setText(`Score: ${this.score}`);
    }
    if (result === "correct") {
      this.add.text(200, 250, "Correct!", { fontFamily: "monospace", fontSize: "14px", color: "#00FF88" });
    } else if (result === "wrong_final") {
      this.add.text(200, 250, "Wrong. Try next case.", { fontFamily: "monospace", fontSize: "14px", color: "#FF4444" });
    }
  }
}