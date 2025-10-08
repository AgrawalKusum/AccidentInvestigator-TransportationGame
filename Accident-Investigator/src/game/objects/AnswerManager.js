import Phaser from "phaser";

export default class AnswerManager {
  constructor(scene, causes, correctCause, onResult) {
    this.scene = scene;
    this.causes = causes;
    this.correctCause = correctCause;
    this.onResult = onResult; // callback: (result, scoreChange)
    this.disabled = new Set();
    this.attempts = 0;
    this.container = scene.add.container(0, 320);
  }

  render() {
    this.container.removeAll(true);

    const btnW = this.scene.scale.width - 100;
    const btnH = 50;
    const gap = 12;
    const startX = 50;

    this.causes.forEach((cause, i) => {
      const y = i * (btnH + gap);
      const rect = this.scene.add.rectangle(
        startX + btnW / 2,
        y + btnH / 2,
        btnW,
        btnH,
        0x001313
      ).setStrokeStyle(2, 0x00ff88);
      const text = this.scene.add.text(startX + 16, y + 15, cause, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#caffdd",
      });

      if (this.disabled.has(i)) {
        rect.setFillStyle(0x222222);
        text.setColor("#777");
        rect.disableInteractive();
      } else {
        rect.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
          this.handleAnswer(i);
        });
      }

      const cont = this.scene.add.container(0, y, [rect, text]);
      cont.setData("index", i);
      this.container.add(cont);
    });
  }

  handleAnswer(index) {
    if (this.disabled.has(index)) return;

    const selected = this.causes[index];
    const correct = this.correctCause;
    this.attempts++;

    if (selected === correct) {
      const points = this.attempts === 1 ? 10 : 5;
      this.onResult("correct", points);
    } else if (this.attempts >= 2) {
      this.onResult("wrong_final", -5);
      this.disableAll();
    } else {
      this.onResult("wrong_retry", 0);
    }
  }

  disableWrongAnswer() {
    // randomly disable one incorrect answer
    const wrong = this.causes
      .map((cause, idx) => ({ cause, idx }))
      .filter(obj => obj.cause !== this.correctCause && !this.disabled.has(obj.idx));
    if (wrong.length === 0) return;
    const pick = Phaser.Utils.Array.GetRandom(wrong);
    this.disabled.add(pick.idx);
    this.render();
  }

  disableAll() {
    this.causes.forEach((_, idx) => this.disabled.add(idx));
    this.render();
  }
}