Cloth Simulation

What it is
- Verlet cloth with gravity, damping, stiffness, and constraint relaxation
- Drag points to move; hold 'c' while dragging to tear
- Tweakpane UI for parameters; SVG/PNG export buttons

How it works (simple)
- The cloth is a grid of small dots joined by short lines (like tiny springs).
- Each moment, the dots fall a bit (gravity) and slow down a bit (damping).
- Then the lines pull pairs of dots back to their normal spacing a few times, so it keeps a cloth shape (stiffness + iterations).
- The top row of dots is fixed in place, so the rest hangs down.
- Dragging moves nearby dots. Holding the 'c' key while dragging cuts nearby lines (tears the cloth).
- We draw the lines and dots; you can change colors, sizes, and visibility in the left panel.
- Changing canvas width/height resizes the drawing. Changing columns/rows/spacing rebuilds the cloth.

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
