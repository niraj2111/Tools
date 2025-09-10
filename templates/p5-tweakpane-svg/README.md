Template: p5.js + Tweakpane + SVG export

Quick start
- Open `index.html` via a local web server (see repo root README for options)
- Tweak parameters in the left panel
- Click "Export SVG" (vector) or "Export PNG"

Customize
- Replace `__TOOL_TITLE__` with your tool's name
- Replace `__TOOL_SLUG__` with a short-kebab-case id
- Edit `sketch.js` to draw your own scene inside `drawArtwork(g)`

Notes
- SVG export uses `p5.js-svg`; drawing commands should be compatible with both canvas and SVG renderers
- For complex effects not available in SVG (filters, blend modes), you can keep SVG export simple or fall back to PNG

