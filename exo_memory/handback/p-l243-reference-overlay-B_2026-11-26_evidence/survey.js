// survey: every installed track's layouts, readAiLine as is, and the grid-tolerant read. Output names stay in scratch.
const fs = require('fs'), path = require('path');
const { readAiLine } = require(process.argv[2] + '/src/export/ailine.js');
const root = process.argv[3];
const rows = [];
for (const t of fs.readdirSync(root).sort()) {
  const td = path.join(root, t); if (!fs.statSync(td).isDirectory()) continue;
  const layouts = [];
  if (fs.existsSync(path.join(td, 'ai')) || fs.existsSync(path.join(td, 'ui', 'ui_track.json'))) layouts.push('');
  const uiDir = path.join(td, 'ui');
  if (fs.existsSync(uiDir)) for (const l of fs.readdirSync(uiDir)) if (fs.existsSync(path.join(uiDir, l, 'ui_track.json'))) layouts.push(l);
  for (const d of fs.readdirSync(td)) if (!layouts.includes(d) && fs.existsSync(path.join(td, d, 'ai'))) layouts.push(d);
  if (!layouts.length) layouts.push('');
  for (const l of layouts) {
    const ai = path.join(td, l, 'ai', 'fast_lane.ai');
    const ui = l ? path.join(td, 'ui', l, 'ui_track.json') : path.join(td, 'ui', 'ui_track.json');
    let uiLen = null; try { const j = JSON.parse(fs.readFileSync(ui, 'utf8').replace(/^﻿/, '')); uiLen = j.length; } catch (e) { uiLen = fs.existsSync(ui) ? 'unparsed' : null; }
    const r = { track: t, layout: l, ai: fs.existsSync(ai), uiLen };
    if (r.ai) {
      const b = fs.readFileSync(ai); r.bytes = b.length;
      try { const line = readAiLine(b); r.read = 'ok'; r.n = line.points.length; }
      catch (e) { r.read = e.code || e.message; }
      if (b.length >= 16) { const n = b.readInt32LE(4); const end = 16 + n * 20 + 4 + n * 72; if (b.length >= end + 4) { r.hasGrid = b.readInt32LE(end); r.after = b.length - end - 4; r.n = n; } }
    }
    rows.push(r);
  }
}
console.log(JSON.stringify(rows, null, 0).replace(/\},\{/g, '},\n{'));
