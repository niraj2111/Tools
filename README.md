## Tools — Graphics Tools and Templates

This repo hosts custom graphics tools and a starter template for making new ones with p5.js, Tweakpane (UI), and SVG export.

### Run locally

Serve the folder with a simple static server and open the URL in your browser:

- Python (built-in):
  - `python3 -m http.server 5500`
  - Open `http://localhost:5500/index.html` (or a specific tool’s `index.html`)

- Node (optional):
  - `npx serve .` (or `pnpm dlx serve .`)
  - Open the printed URL

- VS Code extension:
  - Install "Live Server" and choose "Open with Live Server" on an `index.html`

### Create a new tool (recommended)

Use the built-in template (p5 + Tweakpane + SVG export):

1) Run the scaffold script

```
scripts/new-tool.sh "My First Tool" my-first-tool
```

If you omit the slug, it will be derived from the title.

2) Start a server and open the new tool

```
python3 -m http.server 5500
# then open http://localhost:5500/tools/my-first-tool/index.html
```

3) Edit `tools/my-first-tool/sketch.js` — put your drawing in `drawArtwork(g)` so both canvas and SVG exports work.

### Template location

- `templates/p5-tweakpane-svg/` — HTML + JS scaffold with:
  - p5.js for drawing, instance mode
  - Tweakpane for UI controls
  - p5.js-svg for SVG export (vector)

### Minimal example at root

- `index.html` and `sketch.js` — a very simple p5 sketch for quick testing.

