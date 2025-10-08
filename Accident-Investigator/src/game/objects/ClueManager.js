export default class ClueManager {
  constructor(scene, clues, x = 20, y = 100, width = scene.scale.width - 40) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.width = width;
    this.clues = clues;
  }

  render() {
    this.container.removeAll(true);
    const gap = 12;
    const totalGap = gap * (this.clues.length - 1);
    const boxW = Math.max(120, Math.floor((this.width - totalGap) / this.clues.length));
    const boxH = 60;

    this.clues.forEach((clue, i) => {
      const x = i * (boxW + gap);
      const rect = this.scene.add.rectangle(x + boxW / 2, boxH / 2, boxW, boxH, 0x071515)
        .setStrokeStyle(2, 0x00ff88);
      const text = this.scene.add.text(x + 10, 10, clue.text, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#caffdd",
        wordWrap: { width: boxW - 20 }
      });
      this.container.add([rect, text]);
    });
  }

  removeFalseClue() {
    const idx = this.clues.findIndex(c => !c.truth);
    if (idx !== -1) this.clues.splice(idx, 1);
    this.render();
  }

  addNewClue(newClue) {
    this.clues.push(newClue);
    this.render();
  }
}