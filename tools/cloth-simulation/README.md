Cloth Simulation

What it is
- Verlet cloth with gravity, damping, stiffness, and constraint relaxation
- Drag points to move; hold 'c' while dragging to tear
- Tweakpane UI for parameters; SVG/PNG export buttons

Run
- Serve the repo (e.g., `python3 -m http.server 5500`)
- Open `http://localhost:5500/tools/cloth-simulation/index.html`

Controls
- 'r' to reset cloth
- 'c' + drag to tear (or enable "Tear while dragging" in UI)

Edit
- `sketch.js`: adjust physics or rendering. Cloth is defined by `POINTS` and `CONSTRAINTS` arrays. Rendering happens in `drawCloth(g)`.

Export
- SVG: vector output via p5.js-svg (lines + circles)
- PNG: current frame; increase `PNG scale` for higher resolution

