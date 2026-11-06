// usage: node agree.js <t180 tree>   D642 review of 212e78d: does the panel's shortest (shell.secondMinM → extend.secondMinM, which the panel's mark clamps and B's G8 move use)
// ever name a span the core's own check (extend.spanHolds, which changeLists asks on every extend) then refuses? For a spread of first ramps (the panel's rounded bank and
// the quintic) and bank-back targets, every span from the change's own minimum to the ceiling at 0.5 m: m = secondMinM; any span s >= m where spanHolds(s) is false is a place
// the panel could put a mark the core refuses. Also: is the rounding of the 1° grid ever looser than the exact change (a gridded span that holds where the exact one does not)?
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]), X = require(path.join(R, 'src/core/extend.js'));
const DEG = Math.PI / 180;
const out = [];
for (const [stepDeg, L, shape] of [[88.45, 1000, undefined], [66.14, 750, undefined], [30, 750, undefined], [60, 600, undefined], [88.45, 1000, null]]) {
  const base = { step: stepDeg * DEG, length: L, ...(shape === null ? { shape: null } : {}) };
  for (const tgt of [-88.45, -60, -30.3, -10, 0, 12.7, 45.5]) {
    if (Math.abs(tgt - stepDeg) < 1) continue;
    const a = stepDeg * DEG, b = tgt * DEG; let m; try { m = X.secondMinM('phi', a, b, base); } catch (e) { out.push({ stepDeg, L, shape, tgt, error: e.message.slice(0, 80) }); continue; }
    const pockets = [], early = []; let n = 0;
    for (let s = Math.floor(m * 2) / 2 - 30; s <= Math.min(L - 1, m + 120); s += 0.5) { if (s <= 0) continue; n++; const h = X.spanHolds('phi', a, b, base, s); if (s >= m - 1e-9 && !h) pockets.push(s); if (s < m - 1e-9 && h) early.push(s); }
    out.push({ stepDeg, L, shape: shape === null ? 'quintic' : 'rounded', tgt, shortest: +m.toFixed(2), spansChecked: n, refusedAtOrPastShortest: pockets.length ? `${pockets.length}: ${pockets.slice(0, 6).join(', ')}` : 0, holdsBelowShortest: early.length ? `${early.length} (from ${early[0]})` : 0 });
  }
}
console.log(JSON.stringify(out, null, 1));
