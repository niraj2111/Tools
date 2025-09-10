## Tools — p5.js Sketch

This repo will host custom graphics tools. For now, it contains a minimal p5.js sketch you can run locally.

### Run locally

Because browsers block some local file access, serve the folder with a simple static server and open the URL in your browser.

- Using Python (built-in on most systems):
  - `python3 -m http.server 5500`
  - Open `http://localhost:5500` and click `index.html`

- Using Node (if you prefer):
  - `npx serve .` (or `pnpm dlx serve .`)
  - Open the printed local URL

- VS Code extension:
  - Install "Live Server" and choose "Open with Live Server" on `index.html`

### Files

- `index.html` — loads p5.js from CDN and `sketch.js`
- `sketch.js` — simple animated orbs that follow the mouse; click to change palette

### Next ideas

- Add UI toggles for parameters (speed, count, palettes)
- Export frames or capture GIFs
- Create separate folders for each tool/sketch

