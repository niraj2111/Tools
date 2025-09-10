// __TOOL_TITLE__ — p5 + Tweakpane + SVG export template
// Instance-mode p5 so we can render to both screen and SVG graphics.

(function () {
  const PARAMS = {
    width: 960,
    height: 540,
    bg: '#0f1226',
    stroke: '#8bcaff',
    fill: '#86efac',
    filled: false,
    count: 120,
    speed: 0.8,
    thickness: 1.5,
    // Export
    pngScale: 1,
  };

  // UI
  const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
  pane.addBinding(PARAMS, 'width', { min: 240, max: 1920, step: 10 });
  pane.addBinding(PARAMS, 'height', { min: 240, max: 1920, step: 10 });
  pane.addBinding(PARAMS, 'bg');
  pane.addBinding(PARAMS, 'stroke');
  pane.addBinding(PARAMS, 'fill');
  pane.addBinding(PARAMS, 'filled');
  pane.addBinding(PARAMS, 'count', { min: 1, max: 1000, step: 1 });
  pane.addBinding(PARAMS, 'speed', { min: 0, max: 5, step: 0.01 });
  pane.addBinding(PARAMS, 'thickness', { min: 0.2, max: 10, step: 0.1 });
  pane.addBinding(PARAMS, 'pngScale', { min: 1, max: 4, step: 1, label: 'PNG scale' });

  const btnSVG = document.getElementById('btn-export-svg');
  const btnPNG = document.getElementById('btn-export-png');

  // Core drawing routine that works on either the p5 instance or a p5.Graphics (SVG) target.
  function drawArtwork(g) {
    const W = g.width || PARAMS.width;
    const H = g.height || PARAMS.height;
    g.push();
    g.background(PARAMS.bg);
    g.stroke(PARAMS.stroke);
    g.strokeWeight(PARAMS.thickness);
    if (PARAMS.filled) {
      g.fill(PARAMS.fill);
    } else {
      g.noFill();
    }

    // Simple radial waves pattern, deterministic per frame.
    const cx = W / 2;
    const cy = H / 2;
    const rMax = Math.min(W, H) * 0.42;
    const t = (Date.now() % 100000) / 1000 * PARAMS.speed;

    for (let i = 0; i < PARAMS.count; i++) {
      const f = i / PARAMS.count;
      const a = f * Math.PI * 2 + t * 0.6;
      const r = rMax * (0.3 + 0.7 * Math.abs(Math.sin(a * 1.7)));
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const size = 2 + 10 * (0.5 + 0.5 * Math.sin(a * 3.1 + t));
      g.circle(x, y, size);
    }
    g.pop();
  }

  // p5 instance
  const app = new p5((p) => {
    p.setup = () => {
      const c = p.createCanvas(PARAMS.width, PARAMS.height);
      c.parent(document.getElementById('sketch'));
      p.pixelDensity(window.devicePixelRatio || 1);
    };

    p.windowResized = () => {
      // Keep canvas size bound to parameters; edit in UI if needed.
    };

    p.draw = () => {
      drawArtwork(p);
    };
  });

  // Recreate canvas on dimension change
  pane.on('change', (ev) => {
    if (ev.presetKey === 'width' || ev.presetKey === 'height' || ev.target?.key === 'width' || ev.target?.key === 'height') {
      app.resizeCanvas(PARAMS.width, PARAMS.height);
    }
  });

  // Exports
  btnSVG.addEventListener('click', () => {
    // Create an offscreen SVG graphics, draw once, and save.
    const svg = app.createGraphics(PARAMS.width, PARAMS.height, SVG);
    drawArtwork(svg);
    // Save as vector
    app.save(svg, `${'__TOOL_SLUG__'}-${Date.now()}.svg`);
    svg.remove();
  });

  btnPNG.addEventListener('click', () => {
    const { width, height, pngScale } = PARAMS;
    if (pngScale === 1) {
      app.saveCanvas(`__TOOL_SLUG__-${Date.now()}`, 'png');
      return;
    }
    // Render to a higher-res offscreen canvas and save as PNG.
    const off = app.createGraphics(width * pngScale, height * pngScale);
    off.push();
    off.scale(pngScale, pngScale);
    drawArtwork(off);
    off.pop();
    // Convert to image and save
    const img = off.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = img;
    a.download = `__TOOL_SLUG__-${Date.now()}@${pngScale}x.png`;
    a.click();
    off.remove();
  });
})();

