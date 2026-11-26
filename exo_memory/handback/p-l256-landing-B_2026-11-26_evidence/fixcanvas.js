// fixcanvas.js (pane B, L256 step 2, l251): C's "drawn on a canvas" words, stale since L251 made the windows page elements. Exact replacements, each expected
// a given number of times in its file; any other count stops the script before anything is written. usage: node fixcanvas.js <tree>
'use strict';
const fs = require('fs'), path = require('path');
const T = process.argv[2];
const THEMES = ['aqua', 'aurora', 'glass', 'skyline', 'skyline-night'];
const edits = [
  ['app/index.html', [
    ["the small windows on the view (a mark's label, a handle's readout), drawn on a canvas, read these (app/core/markwindow.js)",
     "the small windows on the view (a mark's label, a handle's readout; page elements over the view since L251, drawn on a canvas before) read these (app/core/markwindow.js)", 1],
    ['(.5), a plain number the canvas reads */', '(.5), a plain number markwindow.js reads (parseFloat) */', 1]]],
  ...THEMES.map((t) => [`app/themes/${t}.css`, [
    ["handle's readout, drawn on a canvas, so set here as tokens that app/core/markwindow.js reads.",
     "handle's readout (page elements over the view since L251, drawn on a canvas before), set here as tokens that app/core/markwindow.js reads.", 1],
    ['these are\n   canvas tokens and move no box.', 'these are\n   the windows\' look only and move no box.', 1],
    ...(t === 'aqua' || t === 'aurora' ? [['because the canvas reads it as one)', 'because markwindow.js reads it as one)', 1]] : [])]]),
  ['app/test/markwindow.test.js', [['It is a plain number, since the canvas reads it with parseFloat', 'It is a plain number, since markwindow.js reads it with parseFloat', 1]]],
  ['CHANGELOG.md', [
    ['Drawn on the canvas from theme tokens (app/core/markwindow.js), so where the windows go and what hover and drag do are unchanged; a canvas cannot blur what is behind it, so the windows have no backdrop blur.',
     'Set from theme tokens (app/core/markwindow.js), so where the windows go and what hover and drag do are unchanged. They were drawn on the canvas, which cannot blur what is behind it; since L251 (below) they are page elements and blur it.', 1]]],
];
const out = [];
for (const [rel, reps] of edits) {
  const p = path.join(T, rel), raw = fs.readFileSync(p, 'utf8'), crlf = raw.includes('\r\n');
  let t = crlf ? raw.replace(/\r\n/g, '\n') : raw;
  for (const [from, to, want] of reps) {
    const n = t.split(from).length - 1;
    if (n !== want) { console.error(`STOP ${rel}: ${JSON.stringify(from.slice(0, 60))} found ${n}, want ${want}`); process.exit(9); }
    t = t.split(from).join(to);
  }
  out.push([p, crlf ? t.replace(/\n/g, '\r\n') : t, rel, reps.length, crlf]);
}
for (const [p, t, rel, k, crlf] of out) { fs.writeFileSync(p, t); console.log(`${rel}: ${k} replacement(s)${crlf ? ' (CRLF kept)' : ''}`); }
