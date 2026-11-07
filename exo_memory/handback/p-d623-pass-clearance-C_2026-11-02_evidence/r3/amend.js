// amend.js <tree> [--write]: the four-quarter-turn laps built through the shell (X.extend(A); for 4: X.extend(B); X.extend(C);) are refused at a turn by the
// pass clearance; each becomes the same pieces made with the core (turnby.js extendCorner) and opened (adopt), with a comment line above citing the user.
// Exact counts per file are asserted; without --write it only reports. Line endings are kept (CRLF files stay CRLF).
'use strict';
const fs = require('fs'), path = require('path'), T = process.argv[2], WRITE = process.argv.includes('--write');
const WANT = {
  'app/test/core-readouts-carry.test.js': 1, 'app/test/core-shell.test.js': 3, 'app/test/core-spawndrag.test.js': 2, 'app/test/core-spawns-ui.test.js': 1,
  'app/test/core-spawns.test.js': 1, 'app/test/core-startline-creep.test.js': 1, 'app/test/preview-speed.test.js': 2, 'app/test/sculpt-frame.test.js': 2,
  'app/test/share-install.test.js': 1, 'test/core_segcache.test.js': 2, 'test/core_segcache_lift.test.js': 1, 'app/test/core-trackmenu.test.js': 1,
  'app/test/sculpt-tools.test.js': 2, 'app/test/guides.test.js': 1, 'app/test/preview-async.test.js': 1, 'app/test/export-isolated.test.js': 1,
};
const RE = /(\w+)\.extend\((\{[^;]*?\})\);(\s*)for \(let i = 0; i < 4; i\+\+\) \1\.extend\((\{[^;]*?\})\);(\s*)\1\.extend\((\{[^;]*?\})\);/g;
const NOTE = '// AMENDED BY NAME (2026-11-03, the pass clearance): this lap\'s circle comes back onto its own first straight, which the builder now refuses to lay (the user: "forbid building the track a little closer because of the bulk of the underside"); the same pieces made with the core (turnby.js extendCorner) and opened (adopt)';
let bad = 0;
for (const [rel, want] of Object.entries(WANT)) {
  const f = path.join(T, rel), src = fs.readFileSync(f, 'utf8'), eol = src.includes('\r\n') ? '\r\n' : '\n';
  const req = rel.startsWith('test/') ? '../src/core/turnby.js' : '../../src/core/turnby.js';
  const hits = [...src.matchAll(RE)];
  if (hits.length !== want) { bad++; console.log(`${rel}: ${hits.length} sites, want ${want}`); continue; }
  let out = '', at = 0;
  for (const m of hits) {
    const [all, X, A, w1, B, w2, C] = m, lineStart = src.lastIndexOf('\n', m.index) + 1, indent = src.slice(lineStart).match(/^[ \t]*/)[0];
    out += src.slice(at, lineStart) + indent + NOTE + eol + src.slice(lineStart, m.index);
    out += `{ const TB = require('${req}'); let d = TB.extendCorner(${X}.getState().history.present, ${A});${w1}for (let i = 0; i < 4; i++) d = TB.extendCorner(d, ${B});${w2}${X}.adopt(TB.extendCorner(d, ${C})); }`;
    at = m.index + all.length;
  }
  out += src.slice(at);
  console.log(`${rel}: ${hits.length} site(s) ${WRITE ? 'amended' : 'found'}`);
  if (WRITE) fs.writeFileSync(f, out);
}
if (bad) { console.log(`${bad} file(s) off their count; nothing more`); process.exit(1); }
