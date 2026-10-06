// READ ONLY: the tie rule of f13cded's selectPiece on the keeper's real closed laps (his app-data tracks folder is only read)
const fs = require('fs'), path = require('path'); const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/'; const D = require(W + 'src/core/document.js');
const dir = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'tracks'); const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^eq-.*\.t180track$/.test(f)) : [];
const road = (P) => (P.type === 'road' ? P.length : 0);
const rule = (lens, from, to) => { const len = (a, b) => lens.slice(a, b + 1).reduce((x, y) => x + y, 0), total = len(0, lens.length - 1); return total - len(from + 1, to - 1) < len(from, to); };   // C's expression, verbatim in floating point
let laps = 0, pairs = 0, ties = 0, flips = 0; const examples = [];
for (const f of files) { let d; try { d = D.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; } if (!d.closed) continue; laps++;
  const lens = d.pieces.map(road), T = lens.map((v) => Math.round(v * 1e4)), n = lens.length; let lt = 0, lf = 0;
  for (let from = 0; from < n; from++) for (let to = from + 1; to < n; to++) { pairs++; const s = (a, b) => T.slice(a, b + 1).reduce((x, y) => x + y, 0), inI = s(from, to), wrI = s(0, n - 1) - s(from + 1, to - 1); if (inI === wrI) { ties++; lt++; if (rule(lens, from, to)) { flips++; lf++; if (examples.length < 3) examples.push({ file: f, from, to, inside: inI / 1e4 }); } } }
  console.log(`${f}: ${n} pieces, exact ties ${lt}, of which the rule would take the WRONG (across the line) way: ${lf}`); }
console.log(`closed laps ${laps}, piece pairs ${pairs}, exact ties ${ties}, flipped by floating point ${flips}`); console.log(JSON.stringify(examples));
