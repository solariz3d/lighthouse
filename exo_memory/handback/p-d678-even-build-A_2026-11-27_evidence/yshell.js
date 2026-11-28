// yshell.js <B tree>: the figures behind the shell rows the one fit unpinned, through the real core shell exactly as the rows drive it (the run's right-edge handle
// dragged to 16 m, the left edge held): F2 (the span across, the outer edge's spread, the inner edge's spread as it was) and F3 (the inner edge off where it was)
// from T1 and T2b on flat; K2 (the held edge off where it was) and K3 (centreInPlane) from W8 on Bhold, B- and B-0. Synthetic fixtures only; numbers and labels.
'use strict';
const path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const R = (x) => Math.round(x * 1e4) / 1e4;
function evenDrag(sh, { from, to }, hold, value) {
  sh.selectPiece(from); if (to !== from) sh.selectPiece(to, { extend: true });
  sh.beginSculpt({ tool: 'even', hold }); const b = sh.getState().brush; if (!b || b.mode !== 'even') throw new Error(`the drag did not open: ${sh.getState().message}`);
  sh.sculptTo(value - b.value0); sh.endSculpt();
}
const off = (d, st, side, S) => { let m = 0, at = null; for (const s of S) { const e = Math.abs(F.rimAcross(d, s, side) - F.rimAcross(st, s, side)); if (e > m) { m = e; at = s; } } return { m: R(m), at }; };
(async () => {
  for (const start of ['T1', 'T2b']) {
    const sh = await F.startOf(F.fixture('flat'), start), st0 = F.present(sh); evenDrag(sh, F.runPieces(st0), 'left', 16);
    const d = F.present(sh), S = F.stations(F.RUN.lo, F.RUN.hi);
    console.log(JSON.stringify({ row: `F2/F3 flat ${start}`, across: R(F.spread(S.map((s) => F.rimAcross(d, s, 'left') - F.rimAcross(d, s, 'right')))), outer: R(F.spread(S.map((s) => F.rimAcross(d, s, 'right')))), innerAsItWas: R(F.spread(S.map((s) => F.rimAcross(st0, s, 'left')))), inner: off(d, st0, 'left', S), k3: R(F.centreInPlane(d, st0).off) }));
  }
  for (const fx of ['Bhold', 'B-', 'B-0']) {
    const sh = await F.startOf(F.fixture(fx), 'W8'), st0 = F.present(sh); evenDrag(sh, F.runPieces(st0), 'left', 16);
    if (sh.whenEvenChecked) await sh.whenEvenChecked();
    const d = F.present(sh), S = F.stations(F.RUN.lo, F.RUN.hi);
    console.log(JSON.stringify({ row: `K2/K3 ${fx} W8`, held: off(d, st0, 'left', S), k3: R(F.centreInPlane(d, st0).off) }));
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
