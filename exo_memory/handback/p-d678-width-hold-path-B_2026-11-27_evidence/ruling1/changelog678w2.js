// changelog678w2.js (pane B, D678 words only): F1's "from such a head" named outright ("at a head where the width is still changing"), the four lines rewrapped,
// CRLF kept. Run after changelog678w.js. usage: node changelog678w2.js <CHANGELOG.md>
'use strict';
const fs = require('fs'), f = process.argv[2];
let s = fs.readFileSync(f, 'utf8');
const L = (...lines) => lines.join('\r\n') + '\r\n';
const from = L('  metre at the joint (8.95 with a ramp of 1). When a bank, cup or edge is typed with its "early" box ticked in the same Extend from such a head, the',
  "  width goes past the head's the way it was heading by about a third of the head's change per metre times the early ramp's first step (0.94 m on a",
  '  30 m piece, 2.3 m on 100 m), stays there for about 10 m and comes back, within 1 mm by about 16 m: on a 30 m piece 47 mm after the wide brush and',
  '  0.52 m after the +4 m grab, on a 100 m piece 0.12 m and 1.30 m. A level head lays exactly as before, and a typed width still goes where it is typed.');
const to = L('  metre at the joint (8.95 with a ramp of 1). When a bank, cup or edge is typed with its "early" box ticked in the same Extend, at a head where the',
  "  width is still changing, the width goes past the head's the way it was heading by about a third of the head's change per metre times the early",
  "  ramp's first step (0.94 m on a 30 m piece, 2.3 m on 100 m), stays there for about 10 m and comes back, within 1 mm by about 16 m: on a 30 m piece",
  '  47 mm after the wide brush and 0.52 m after the +4 m grab, on a 100 m piece 0.12 m and 1.30 m. A level head lays exactly as before, and a typed',
  '  width still goes where it is typed.');
const n = s.split(from).length - 1;
if (n !== 1) { console.error(`the old text occurs ${n} times, not once; nothing written`); process.exit(1); }
fs.writeFileSync(f, s.replace(from, to));
console.log(`replaced; new line lengths ${to.split('\r\n').filter(Boolean).map((l) => l.length).join(', ')}`);
