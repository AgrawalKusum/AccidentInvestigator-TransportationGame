export function createRetroText(scene, x, y, text, size = 14, color = "#00FF88", origin = 0) {
  return scene.add.text(x, y, text, {
    fontFamily: "monospace",
    fontSize: `${size}px`,
    color
  }).setOrigin(origin);
}

export function createOutlinedBox(scene, x, y, w, h, fill = 0x001313, stroke = 0x00ff88) {
  return scene.add.rectangle(x, y, w, h, fill).setStrokeStyle(2, stroke);
}