export default class LifelineManager {
  constructor(scene, lifelines, onUseLifeline) {
    this.scene = scene;
    this.lifelines = lifelines;
    this.onUseLifeline = onUseLifeline;
    this.overlay = null;
  }

  open() {
    if (this.overlay) return;
    const { width, height } = this.scene.scale;

    const bg = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6).setInteractive();
    const panel = this.scene.add.rectangle(width / 2, height / 2, 420, 220, 0x071515)
      .setStrokeStyle(2, 0x00ff88);

    const title = this.scene.add.text(width / 2, height / 2 - 80, "LIFELINES", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#00FF88"
    }).setOrigin(0.5);

    const items = [];
    this.lifelines.forEach((life, i) => {
      const y = height / 2 - 40 + i * 55;
      const color = life.used ? 0x333333 : 0x001313;
      const rect = this.scene.add.rectangle(width / 2, y, 360, 40, color)
        .setStrokeStyle(1, 0x00ff88);
      const label = this.scene.add.text(width / 2 - 160, y - 12, `${life.name}${life.used ? " (USED)" : ""}`, {
        fontFamily: "monospace",
        fontSize: "13px",
        color: life.used ? "#777" : "#caffdd"
      });
      if (!life.used) {
        rect.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
          this.onUseLifeline(life.id);
        });
      }
      items.push(rect, label);
    });

    bg.on("pointerdown", () => this.close());
    this.overlay = this.scene.add.container(0, 0, [bg, panel, title, ...items]);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.destroy();
    this.overlay = null;
  }
}