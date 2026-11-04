// bar.js (C, D467 bar re-read): for a Bend on a closed lap, the start-pieces close taken RAW (no bar) and the three numbers part 3 compares, by tree T (4f59790):
//   drag     the largest move of any piece, before the drag → the open lap (barMiss's `drag`)
//   outside  the largest move of a piece NOT in the window, before → the raw result (barMiss's `outside`)
//   window   the largest move of a window piece, before → the raw result (what mutant B3 adds to `outside`)
// then barMiss's own verdict, and B3's verdict (outside taken over every piece). B3 is equivalent only if the two verdicts never differ.
// Reads only.   node bar.js <tree> <case> <s0> <r> <delta>...   case: lap | curvedMid | <path to a save>
'use strict';
const fs = require('fs'), path = require('path');
const [T, kind, s0, rr, ...deltas] = process.argv.slice(2), r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), CJ = r('app/core/closejob.js'), { createCoreShell } = r('app/core/coreshell.js');
const R = 180, Q = (Math.PI * R) / 2;
async function build() {
  const s = await createCoreShell({ autosaveMs: 0 });
  if (kind === 'lap') { s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close(); }
  else if (kind === 'curvedMid') {   // sculpt-tools.test.js curvedMidLap, built the same way
    s.extend({ length: 300, family: 'bowl', targets: { kh: 1 / 600 } }); for (const len of [Q, Q]) s.extend({ length: len, transition: 40, targets: { kh: 1 / R } });
    s.extend({ length: 500, transition: 40, targets: { kh: 0 } }); for (const len of [Q, Q]) s.extend({ length: len, transition: 40, targets: { kh: 1 / R } });
    s.extend({ length: 200, transition: 40, targets: { kh: 1 / 600 } }); s.close();
  } else if (kind === 'wash') {   // sculpt-wash.test.js closedTrack: a 400 m straight, a half turn, a 400 m straight, a half turn
    s.extend({ length: 400, family: 'bowl' }); s.extend({ length: Math.PI * R, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 400, transition: 40, targets: { kh: 0 } }); s.extend({ length: Math.PI * R, transition: 40, targets: { kh: 1 / R } }); s.close();
  } else s.adopt(D.parse(fs.readFileSync(kind, 'utf8')));
  return s;
}
const mx = (xs) => xs.reduce((m, x) => Math.max(m, x.maxM), 0);
(async () => {
  for (const dl of deltas) {
    const s = await build(), base = s.getState().history.present;
    s.beginBrush({ tool: 'bend', s0: +s0, r: +rr }); s.brushTo(+dl);
    const open = s.getState().history.present, win = s.getState().brush.changedPieces, road = open.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0);
    const first = road[0], last = road[road.length - 1], tag = `${path.basename(kind)} s0 ${s0} r ${rr} ${dl} window ${JSON.stringify(win)}`;
    if (win.includes(first) || win.includes(last)) { console.log(`${tag}: at the seam, no start try`); continue; }
    let raw; try { raw = CJ.runClose({ doc: open, window: [first, last] }); } catch (e) { console.log(`${tag}: raw start close refused ${e.code}`); continue; }
    if (!raw.converged) { console.log(`${tag}: raw start close did not converge`); continue; }
    const W = new Set(win), dc = CJ.displacementOf(base, raw.doc), drag = mx(CJ.displacementOf(base, open));
    const outside = mx(dc.filter((x) => !W.has(x.piece))), inWin = mx(dc.filter((x) => W.has(x.piece)));
    const verdict = CJ.barMiss(open, raw.doc, { base, edited: win });
    const p3 = outside > drag + 1e-6, b3 = Math.max(outside, inWin) > drag + 1e-6;
    console.log(`${tag}: drag ${drag.toFixed(2)} | outside ${outside.toFixed(2)} | window ${inWin.toFixed(2)} | part3 ${p3 ? 'MISS' : 'pass'} | B3 ${b3 ? 'MISS' : 'pass'}${p3 !== b3 ? '  <-- B3 DIFFERS' : ''} | barMiss: ${verdict === null ? 'PASS (taken)' : verdict}`);
  }
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
