// READ ONLY: on the keeper's TEST 1 (46 pieces, closed): for every shift-click pair (i, j), what the OLD rule (inside i..j) saved and what the NEW rule (short way) selects and can save
const fs = require('fs'), path = require('path'); const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/'; const D = require(W + 'src/core/document.js'), PC = require(W + 'src/core/piece.js');
const d = D.parse(fs.readFileSync(path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'tracks', 'eq-TEST 1.t180track'), 'utf8')); const n = d.pieces.length;
const road = (P) => (P.type === 'road' ? P.length : 0), len = (a, b) => d.pieces.slice(a, b + 1).reduce((x, P) => x + road(P), 0), total = len(0, n - 1);
const ok = (f, t) => { try { PC.saveRun(d, f, t, { name: 'x' }); return true; } catch (e) { return e.code; } };
let pairs = 0, wraps = 0, oldSaveable = 0, newSaveable = 0, lost = 0, gained = 0; const codes = {};
for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { pairs++; const inside = ok(i, j), wrap = total - len(i + 1, j - 1) < len(i, j), now = wrap ? ok(j, i) : inside; if (wrap) wraps++; if (inside === true) oldSaveable++; if (now === true) newSaveable++; if (inside === true && now !== true) { lost++; codes[now] = (codes[now] || 0) + 1; } if (inside !== true && now === true) gained++; }
console.log(`TEST 1: ${n} pieces, ${pairs} shift-click pairs; the short way is across the line for ${wraps} of them`);
console.log(`saveable before (the inside run): ${oldSaveable}; saveable now (the short way): ${newSaveable}; SAVEABLE BEFORE AND NOT NOW: ${lost} ${JSON.stringify(codes)}; saveable now and not before: ${gained}`);
console.log('the kinds of the pieces either side of the line:', JSON.stringify([d.pieces[n - 1], d.pieces[0]].map((P) => ({ id: P.id, kind: D.kindOf(P), edge: !!P.edge }))));
