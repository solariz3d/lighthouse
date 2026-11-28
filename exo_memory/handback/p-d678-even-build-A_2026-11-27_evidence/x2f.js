// x2f.js: X2f of the hand-back's 5.1 (D678 item 1), measured: on the flat fixture, untouched, Even 200..440 to 16 with the left or the right edge kept, how far the
// kept edge moved from the start over both 20 m margins (180..200, 440..460), every 1 m, read by the fixtures' own measure (F.rimAcross), never Even's code.
// usage: node x2f.js <tree>     prints one JSON line per (fixture, hold): the worst move, where, and the move at 180, 200, 440, 460
'use strict';
const path = require('path');
const TREE = process.argv[2];
const F = require(path.join(TREE, 'test', 'even_fixtures.js'));
const EV = require(path.join(TREE, 'src', 'core', 'even.js'));
const inMargins = (s) => (s >= F.WIN.lo && s <= F.RUN.lo) || (s >= F.RUN.hi && s <= F.WIN.hi);
for (const fx of ['flat', 'B-']) for (const hold of ['left', 'right']) {
  const base = F.fixture(fx), r = EV.even(base, { ...F.runPieces(base), value: 16, hold });
  const move = (s) => F.rimAcross(r.doc, s, hold) - F.rimAcross(base, s, hold);
  let worst = 0, at = null;
  for (const s of F.stations(F.WIN.lo, F.WIN.hi).filter(inMargins)) { const m = Math.abs(move(s)); if (m > worst) { worst = m; at = s; } }
  const r4 = (x) => Math.round(x * 1e4) / 1e4;
  console.log(JSON.stringify({ fx, hold, worst: r4(worst), at, at180: r4(move(180)), at200: r4(move(200)), at440: r4(move(440)), at460: r4(move(460)), pass: worst <= 0.01 }));
}
