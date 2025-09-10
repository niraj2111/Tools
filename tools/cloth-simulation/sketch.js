// Cloth Simulation — p5 + Tweakpane + SVG/PNG Export
// Instance-mode p5 integration with a simple verlet cloth, drag/tear, and exports.

(function () {
  const PARAMS = {
    // Canvas
    width: 400,
    height: 600,
    bg: '#ffffff',
    // Cloth params
    cols: 30,
    rows: 30,
    spacing: 10,
    gravity: 0.15,
    iterations: 2,
    damping: 0.995,
    stiffness: 0.4, // 0=very stretchy, 1=stiff
    // Rendering
    showPoints: true,
    showLines: true,
    lineColor: '#9aa4b2',
    pointColor: '#e7e9f0',
    lineWeight: 1,
    pointSize: 3,
    // Interaction
    dragRadius: 10,
    tearRadius: 3,
    tearMode: false, // if true, dragging tears without holding 'c'
    // Export
    pngScale: 1,
  };

  // UI
  const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
  const fCanvas = pane.addFolder({ title: 'Canvas', expanded: false });
  const bindWidth = fCanvas.addInput(PARAMS, 'width', { min: 240, max: 1920, step: 1 });
  const bindHeight = fCanvas.addInput(PARAMS, 'height', { min: 240, max: 1920, step: 1 });
  fCanvas.addInput(PARAMS, 'bg');

  const fCloth = pane.addFolder({ title: 'Cloth', expanded: true });
  const bindCols = fCloth.addInput(PARAMS, 'cols', { min: 2, max: 200, step: 1 });
  const bindRows = fCloth.addInput(PARAMS, 'rows', { min: 2, max: 200, step: 1 });
  const bindSpacing = fCloth.addInput(PARAMS, 'spacing', { min: 2, max: 40, step: 1 });
  fCloth.addInput(PARAMS, 'gravity', { min: 0, max: 2, step: 0.01 });
  fCloth.addInput(PARAMS, 'iterations', { min: 1, max: 20, step: 1 });
  fCloth.addInput(PARAMS, 'damping', { min: 0.9, max: 1, step: 0.0005 });
  fCloth.addInput(PARAMS, 'stiffness', { min: 0, max: 1, step: 0.01 });
  fCloth.addButton({ title: 'Reset Cloth' }).on('click', () => resetCloth());

  const fRender = pane.addFolder({ title: 'Render', expanded: false });
  fRender.addInput(PARAMS, 'showLines');
  fRender.addInput(PARAMS, 'showPoints');
  fRender.addInput(PARAMS, 'lineColor');
  fRender.addInput(PARAMS, 'pointColor');
  fRender.addInput(PARAMS, 'lineWeight', { min: 0.5, max: 5, step: 0.5 });
  fRender.addInput(PARAMS, 'pointSize', { min: 1, max: 10, step: 1 });

  const fInteract = pane.addFolder({ title: 'Interaction', expanded: false });
  fInteract.addInput(PARAMS, 'dragRadius', { min: 1, max: 40, step: 1 });
  fInteract.addInput(PARAMS, 'tearRadius', { min: 1, max: 40, step: 1 });
  fInteract.addInput(PARAMS, 'tearMode', { label: 'Tear while dragging' });

  const fExport = pane.addFolder({ title: 'Export', expanded: false });
  fExport.addInput(PARAMS, 'pngScale', { min: 1, max: 4, step: 1, label: 'PNG scale' });

  const btnSVG = document.getElementById('btn-export-svg');
  const btnPNG = document.getElementById('btn-export-png');

  // Cloth data (numeric, no p5.Vector dependency)
  let POINTS = [];
  let CONSTRAINTS = [];

  function resetCloth() {
    POINTS = [];
    CONSTRAINTS = [];
    const { cols, rows, spacing } = PARAMS;
    // Points
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = PARAMS.width / 2 - (cols * spacing) / 2 + x * spacing;
        const py = 50 + y * spacing;
        const locked = y === 0;
        POINTS.push({ x: px, y: py, px: px, py: py, locked });
      }
    }
    // Constraints (horizontal + vertical)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (x < cols - 1) CONSTRAINTS.push({ a: i, b: i + 1, rest: spacing });
        if (y < rows - 1) CONSTRAINTS.push({ a: i, b: i + cols, rest: spacing });
      }
    }
  }

  function updateCloth() {
    const { gravity, damping, iterations, stiffness } = PARAMS;
    // Verlet integration with gravity
    for (const p of POINTS) {
      if (!p.locked) {
        const vx = (p.x - p.px) * damping;
        const vy = (p.y - p.py) * damping;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + gravity;
      }
    }
    // Relax constraints
    for (let k = 0; k < iterations; k++) {
      for (const c of CONSTRAINTS) {
        const p1 = POINTS[c.a];
        const p2 = POINTS[c.b];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy) || 1;
        const diff = ((dist - c.rest) / dist) * 0.99;
        const offx = dx * 0.5 * stiffness * diff;
        const offy = dy * 0.5 * stiffness * diff;
        if (!p1.locked) { p1.x += offx; p1.y += offy; }
        if (!p2.locked) { p2.x -= offx; p2.y -= offy; }
      }
    }
  }

  function drawCloth(g) {
    const { showLines, showPoints, lineColor, pointColor, lineWeight, pointSize } = PARAMS;
    g.background(PARAMS.bg);
    if (showLines) {
      g.stroke(lineColor);
      g.strokeWeight(lineWeight);
      for (const c of CONSTRAINTS) {
        const p1 = POINTS[c.a];
        const p2 = POINTS[c.b];
        g.line(p1.x, p1.y, p2.x, p2.y);
      }
    }
    if (showPoints) {
      g.noStroke();
      g.fill(pointColor);
      for (const p of POINTS) {
        g.circle(p.x, p.y, pointSize);
      }
    }
  }

  function dragAt(mx, my) {
    const r2 = PARAMS.dragRadius * PARAMS.dragRadius;
    for (const p of POINTS) {
      const dx = mx - p.x;
      const dy = my - p.y;
      if (dx*dx + dy*dy <= r2) {
        p.x = mx;
        p.y = my;
      }
    }
  }

  function tearAt(mx, my) {
    const r2 = PARAMS.tearRadius * PARAMS.tearRadius;
    for (let i = CONSTRAINTS.length - 1; i >= 0; i--) {
      const c = CONSTRAINTS[i];
      const p1 = POINTS[c.a];
      const p2 = POINTS[c.b];
      const midx = (p1.x + p2.x) * 0.5;
      const midy = (p1.y + p2.y) * 0.5;
      const dx = mx - midx;
      const dy = my - midy;
      if (dx*dx + dy*dy <= r2) {
        CONSTRAINTS.splice(i, 1);
      }
    }
  }

  // p5 instance
  const app = new p5((p) => {
    p.setup = () => {
      const c = p.createCanvas(PARAMS.width, PARAMS.height);
      c.parent(document.getElementById('sketch'));
      resetCloth();
    };

    p.draw = () => {
      updateCloth();
      drawCloth(p);
    };

    p.mouseDragged = () => {
      const tearHeld = p.keyIsDown(67); // 'c'
      if (PARAMS.tearMode || tearHeld) tearAt(p.mouseX, p.mouseY);
      else dragAt(p.mouseX, p.mouseY);
    };

    p.mousePressed = () => {
      // For parity with original code, no-op or could toggle behavior here
    };

    p.keyPressed = () => {
      if (p.key === 'r' || p.key === 'R') resetCloth();
      if (p.key === 's' || p.key === 'S') exportSVGOnce();
    };
  });

  // React to parameter changes explicitly
  bindWidth.on('change', () => { app.resizeCanvas(PARAMS.width, PARAMS.height); resetCloth(); });
  bindHeight.on('change', () => { app.resizeCanvas(PARAMS.width, PARAMS.height); resetCloth(); });
  bindCols.on('change', resetCloth);
  bindRows.on('change', resetCloth);
  bindSpacing.on('change', resetCloth);

  // Exports
  function exportSVGOnce() {
    const svg = app.createGraphics(PARAMS.width, PARAMS.height, 'svg');
    drawCloth(svg);
    app.save(svg, `cloth-simulation-${Date.now()}.svg`);
    svg.remove();
  }

  btnSVG.addEventListener('click', exportSVGOnce);

  btnPNG.addEventListener('click', () => {
    const { width, height, pngScale } = PARAMS;
    if (pngScale === 1) {
      app.saveCanvas(`cloth-simulation-${Date.now()}`, 'png');
      return;
    }
    const off = app.createGraphics(width * pngScale, height * pngScale);
    off.push();
    off.scale(pngScale, pngScale);
    drawCloth(off);
    off.pop();
    const img = off.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = img;
    a.download = `cloth-simulation-${Date.now()}@${pngScale}x.png`;
    a.click();
    off.remove();
  });
})();
