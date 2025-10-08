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

  create() {
    const { width } = this.scale;
    const currentCase = cases[0];

    this.score = 0;
    this.lifelines = [
      { id: "eliminate", name: "Eliminate False Clue", used: false },
      { id: "newclue", name: "Get New Clue", used: false },
      { id: "identify", name: "Identify Wrong Answer", used: false }
    ];

    createRetroText(this, 20, 20, currentCase.title, 16);
    this.scoreText = createRetroText(this, width - 20, 20, `Score: ${this.score}`, 14, "#00FF88", 1);

    this.clueManager = new ClueManager(this, [...currentCase.clues]);
    this.clueManager.render();

    this.answerManager = new AnswerManager(this, [...currentCase.causes], currentCase.correctCause, (result, pts) => this.handleResult(result, pts));
    this.answerManager.render();

    this.lifelineManager = new LifelineManager(this, this.lifelines, id => this.useLifeline(id));

    // Lifeline button
    this.lifelineBtn = createRetroText(this, width - 120, 50, "Lifelines", 14, "#00FF88");
    this.lifelineBtn.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.lifelineManager.open());
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