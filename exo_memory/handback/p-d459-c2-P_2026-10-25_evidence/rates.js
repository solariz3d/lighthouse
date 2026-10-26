// rates.js: per piece, the fastest change per metre of phi (°/m), c, e, er, and the validator's 20 m-chord roll rate proxy (max |phi(s+10) - phi(s-10)| / 20), on a save
'use strict';
const fs = require('fs'), path = require('path'); const [T, F] = process.argv.slice(2); const D = require(path.join(T, 'src/core/document.js'));
const doc = D.parse(fs.readFileSync(F, 'utf8')); const DEG = Math.PI / 180;
for (const P of doc.pieces) { const o = {}; for (const ch of ['phi', 'c', 'e', 'er']) { let m = 0, chord = 0; for (let s = 0; s <= P.length; s += 1) { const a = D.valuesAt(P, Math.max(0, s - 0.5))[ch], b = D.valuesAt(P, Math.min(P.length, s + 0.5))[ch]; m = Math.max(m, Math.abs(b - a)); if (s >= 10 && s + 10 <= P.length) chord = Math.max(chord, Math.abs(D.valuesAt(P, s + 10)[ch] - D.valuesAt(P, s - 10)[ch]) / 20); } o[ch] = ch === 'phi' ? [m / DEG, chord / DEG] : [m, chord]; }
  if (Object.values(o).some((v) => v[0] > 1e-6)) console.log(P.id.padEnd(4), 'L', String(P.length).padStart(5), ...['phi', 'c', 'e', 'er'].map((ch) => `${ch} ${o[ch][0].toFixed(3)}/${o[ch][1].toFixed(3)}`)); }
