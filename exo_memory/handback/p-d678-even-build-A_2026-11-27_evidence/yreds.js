// yreds.js <B tree> <A0 tree>: the reds B adds against the start on the three B- rows where y678b counted one (T2b right, W8 right, row 145..505 left): each red's
// reason and stretch, whether A0 on the same start has a red of that reason there, and where it sits (the run, a margin, a ramp). Synthetic fixtures only.
'use strict';
const path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]), TA = path.resolve(process.argv[3]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const EV = require(path.join(T, 'src/core/even.js')), EVA = require(path.join(TA, 'src/core/even.js'));
const R = (x) => Math.round(x * 100) / 100;
const ROW = (a, b) => { const o = []; for (let s = a; s <= b; s += 30) o.push(s); return o; };
const near = (x, list) => list.some((y) => y.reason === x.reason && x.s0 >= y.s0 - 2 && x.s1 <= y.s1 + 2);
(async () => {
  const rows = [];
  { const sh = await F.startOf(F.fixture('B-'), 'T2b'); rows.push(['T2b', F.present(sh), 'right']); }
  { const sh = await F.startOf(F.fixture('B-'), 'W8'); rows.push(['W8', F.present(sh), 'right']); }
  { const sh = await F.shellOn(F.fixture('B-')); for (const s of ROW(145, 505)) F.grab(sh, s, 16); rows.push(['row 145..505', F.present(sh), 'left']); }
  for (const [id, st, hold] of rows) {
    const run = F.runPieces(st), r = EV.even(st, { ...run, value: 16, hold }), a = EVA.even(st, { ...run, value: 16, hold }).doc, { lo, hi, w0, w1 } = r.window;
    const rs = F.reds(st), rb = F.reds(r.doc), ra = F.reds(a);
    const added = rb.filter((x) => x.s1 >= w0 && x.s0 <= w1).filter((x) => !near(x, rs));
    for (const x of added) {
      const where = x.s1 < lo - 20 || x.s0 > hi + 20 ? 'a ramp' : x.s1 < lo || x.s0 > hi ? 'a margin' : 'the run';
      console.log(JSON.stringify({ row: `${id} B- ${hold}`, reason: x.reason, s: [R(x.s0), R(x.s1)], where, a0HasIt: near(x, ra), startRedsInWindow: rs.filter((y) => y.s1 >= w0 && y.s0 <= w1).length }));
    }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
