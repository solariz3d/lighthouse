// finish.js (D436, P): press Finish to start on the open TEST 10 (the undo copy's past[21], 20 pieces, 8,900 m) through the app's own press
// (app/core/closejob.js runClose, finish: true) on one tree; compare the result with the keeper's 09:25 save piece by piece; write the closed
// document, with the save's spawns and pitLane carried over, to OUT.   node finish.js <tree> <undo copy> <save copy> <OUT>
const fs = require('fs'), path = require('path'); const [T, UNDO, SAVE, OUT] = process.argv.slice(2);
const D = require(path.join(T, 'src/core/document.js')), { runClose } = require(path.join(T, 'app/core/closejob.js'));
const U = JSON.parse(fs.readFileSync(UNDO, 'utf8')); const open = D.parse(U.past[21]), saved = D.parse(fs.readFileSync(SAVE, 'utf8'));
console.log('open', open.pieces.length, 'pieces', open.pieces.reduce((a, p) => a + p.length, 0).toFixed(1), 'm, closed', !!open.closed);
const t0 = Date.now(); const res = runClose({ doc: open, finish: true }); const ms = Date.now() - t0;
console.log(JSON.stringify({ ms, report: res.report, routes: res.routes, window: res.window && res.window.pieces, phases: res.phases }));
const d = res.doc; let s = 0;
for (const [i, p] of d.pieces.entries()) { const q = saved.pieces[i]; const same = q ? (JSON.stringify(q) === JSON.stringify(p) ? 'same as save' : 'DIFFERS from save') : 'not in save'; console.log(String(i).padStart(3), p.id.padEnd(4), 'len', p.length.toFixed(2).padStart(8), 's', s.toFixed(1).padStart(8), same); s += p.length; }
console.log('pieces', d.pieces.length, 'total', s.toFixed(2), 'save total', saved.pieces.reduce((a, p) => a + p.length, 0).toFixed(2), 'serialize equal to save (pieces only):', JSON.stringify(d.pieces) === JSON.stringify(saved.pieces));
const outDoc = { ...d, spawns: saved.spawns, pitLane: saved.pitLane };
let text; try { text = D.serialize(outDoc); D.parse(text); } catch (e) { console.log('with the save spawns/pitLane:', e.message.slice(0, 200), '- writing without hotlap'); const sp = { ...saved.spawns }; delete sp.hotlap; text = D.serialize({ ...d, spawns: sp, pitLane: saved.pitLane }); D.parse(text); }
fs.writeFileSync(OUT, text); console.log('wrote', OUT);
