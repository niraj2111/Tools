// Simple p5.js sketch for the Tools repo
// - Moves orbs towards the mouse
// - Click to change color palette

let orbs = [];
let palettes = [
  ["#8bcaff", "#86efac", "#fde047", "#fca5a5", "#c4b5fd"],
  ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa"],
  ["#a5f3fc", "#93c5fd", "#d8b4fe", "#fecaca", "#fef08a"],
];
let paletteIdx = 0;

function setup() {
  const s = min(windowWidth - 40, 720);
  const c = createCanvas(s, s * 0.66);
  c.parent(document.querySelector('.wrap'));
  colorMode(HSL, 360, 100, 100, 1);
  resetSketch();
}

function resetSketch() {
  randomSeed(millis());
  noiseSeed(millis());
  orbs = [];
  const count = 60;
  for (let i = 0; i < count; i++) {
    orbs.push({
      x: random(width),
      y: random(height),
      r: random(6, 18),
      vx: 0,
      vy: 0,
      hue: random(360),
      c: colorFromPalette(i),
    });
  }
  background(240, 28, 10);
}

function colorFromPalette(i) {
  const p = palettes[paletteIdx % palettes.length];
  return p[i % p.length];
}

function windowResized() {
  const s = min(windowWidth - 40, 720);
  resizeCanvas(s, s * 0.66);
}

function draw() {
  background(240, 28, 10, 0.08);
  noStroke();

  for (const o of orbs) {
    const dx = (mouseX || width / 2) - o.x;
    const dy = (mouseY || height / 2) - o.y;
    const d = max(1, sqrt(dx * dx + dy * dy));

    // Soft attraction to mouse
    const force = 0.08;
    o.vx += (dx / d) * force;
    o.vy += (dy / d) * force;

    // Friction
    o.vx *= 0.95;
    o.vy *= 0.95;

    o.x += o.vx;
    o.y += o.vy;

    // Wrap around edges
    if (o.x < -20) o.x = width + 20;
    if (o.x > width + 20) o.x = -20;
    if (o.y < -20) o.y = height + 20;
    if (o.y > height + 20) o.y = -20;

    // Draw orb with slight glow
    const c = color(o.c);
    drawingContext.shadowColor = c.toString();
    drawingContext.shadowBlur = 14;
    fill(c);
    circle(o.x, o.y, o.r * 1.3);
  }

  // Title watermark
  drawingContext.shadowBlur = 0;
  noStroke();
  fill(0, 0, 100, 0.6);
  textSize(12);
  textAlign(RIGHT, BOTTOM);
  text("Tools • p5.js", width - 10, height - 8);
}

function mousePressed() {
  paletteIdx = (paletteIdx + 1) % palettes.length;
  // Update colors immediately
  for (let i = 0; i < orbs.length; i++) {
    orbs[i].c = colorFromPalette(i);
  }
}

