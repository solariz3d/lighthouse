// y678.js (pane A, D678, the 23:26Z order's item 3, the hand-back's section 6.1 rows Y1 to Y5): B as built (d678-even-b's src/core/even.js) on the 28 cases of
// cand678.js (copied verbatim through x678.js), with d678-even-a's A0 beside it for the reds.
//   node y678.js <builder tree: d678-even-b> <builder tree: d678-even-a> > y678.out          (JSON lines, one per case x hold)
// Measured by the builder's fixture functions (test/even_fixtures.js of the B tree), never Even's code, every 1 m unless named:
//   y1       (an edge kept) the kept edge across (rimAcross) at most this far from the start's, over the run; y1win the same over the result's window
//   y1q      (an edge kept) the same read on the cross-section every 0.25 m (the offset plus Even's rim reader; a second figure, not the bar)
//   y2       (the middle kept) l and h, every 1 m of the track, the most either is off the start's, in stored steps
//   y3       (B-, any run) K3 against the start: the centre's height off the start's moved in the plane of the road as built (F.centreInPlane)
//   wRun     max - min of w over the run;  wMar  the most w is off the value over the margins
//   x4       outside the result's window: samples past one stored step of their channel (F.outsideChanges)
//   joints   steps at the joints the window touches (dv over 1e-4, dm over 1e-3)
//   redsNew  the checker's reds in the window that the start lacks;  redsVsA0  the reds in the window that A0 on the same start lacks
// Prints numbers, counts and labels only. Synthetic fixtures only.
'use strict';
const path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]), TA = path.resolve(process.argv[3]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const TB = require(path.join(T, 'src/core/turnby.js'));
const { jointSteps } = require(path.join(T, 'src/core/continuity.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const EV = require(path.join(T, 'src/core/even.js')), EVA = require(path.join(TA, 'src/core/even.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);

// ── the cases, verbatim from x678.js ──
function road(list) { let d = D.createDoc('wc'); for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, ...(p.width === undefined ? {} : { width: p.width }), turnAs: 'corner' })); return Object.freeze(d); }
const TURN = (w) => [1, 2, 3, 4].map(() => ({ length: 60, turn: 30, width: w }));
const WC = {
  WC0: [{ length: 200, turn: 0, width: 12 }, ...TURN(12), { length: 150, turn: 0, width: 12 }],
  WC1: [{ length: 200, turn: 0 }, ...TURN(12), { length: 150, turn: 0, width: 12 }],
  WC2: [{ length: 200, turn: 0, width: 12 }, ...TURN(12), { length: 150, turn: 0, width: 20 }],
  WC3: [{ length: 200, turn: 0, width: 12 }, { length: 60, turn: 30, width: 12 }, { length: 60, turn: 30, width: 12 }, { length: 60, turn: 30, width: 18 }, { length: 60, turn: 30, width: 18 }, { length: 150, turn: 0, width: 18 }],
  WC4: [{ length: 150, turn: 0, width: 12 }, { length: 50, turn: 0, width: 20 }, ...TURN(20), { length: 150, turn: 0, width: 20 }],
};
const ROW = (a, b) => { const o = []; for (let s = a; s <= b; s += 30) o.push(s); return o; };
async function made(fx, steps) { const base = F.fixture(fx), sh = await F.shellOn(base); steps(sh); return { base, start: F.present(sh) }; }
async function cases() {
  const out = [], LR = ['left', 'right'];
  const add = (id, fx, base, start, run, holds = LR) => out.push({ id, fx, base, start, run: run || F.runPieces(start), holds });
  add('start 0..1, untouched', 'flat', F.fixture('flat'), F.fixture('flat'), { from: 0, to: 1 });
  { const m = await made('flat', (sh) => F.grab(sh, 30, 16)); add('start 0..1, a grab at 30', 'flat', m.base, m.start, { from: 0, to: 1 }); }
  for (const fx of ['flat', 'B-']) for (const st of ['T1', 'T2b', 'W1', 'W8']) { const sh = await F.startOf(F.fixture(fx), st); add(st, fx, F.fixture(fx), F.present(sh)); }
  for (const [id, list] of Object.entries(WC)) { const d = road(list); add(id, 'flat', d, d); }
  { const m = await made('flat', (sh) => { for (const s of ROW(175, 475)) F.grab(sh, s, 16); }); add('row 175..475', 'flat', m.base, m.start); }
  for (const fx of ['flat', 'B-']) { const m = await made(fx, (sh) => { for (const s of ROW(145, 505)) F.grab(sh, s, 16); }); add('row 145..505', fx, m.base, m.start); }
  for (const fx of ['flat', 'B-']) { const m = await made(fx, (sh) => F.grab(sh, 145, 16)); add('a grab at 145', fx, m.base, m.start); }
  { const m = await made('flat', (sh) => F.grab(sh, 560, 16)); add('to the head 4..5, a grab at 560', 'flat', m.base, m.start, { from: 4, to: 5 }); }
  { const m = await made('flat', (sh) => F.grab(sh, 320, 16)); add('one piece 2, a grab at 320', 'flat', m.base, m.start, { from: 2, to: 2 }); }
  for (const fx of ['flat', 'B-']) { const m = await made(fx, (sh) => F.widthStroke(sh, 470, 16)); add('a width stroke at 470', fx, m.base, m.start); }
  for (const fx of ['flat', 'B-']) for (const [ch, id] of [['height', 'a hill at 320'], ['lateral', 'a swerve at 320']]) {
    const m = await made(fx, (sh) => { sh.setSculpt(false); sh.beginBrush({ mode: 'local', channel: ch, s0: 320, r: 30 }); if (!sh.getState().brush) throw new Error(`${id}: ${sh.getState().message}`); sh.brushTo(2); sh.endBrush(); sh.setSculpt(true); });
    add(id, fx, m.base, m.start, null, ['centre']);
  }
  return out;
}

// ── the measures ──
const maxOff = (f, a, b, step = 1) => { let m = 0, at = null; for (const s of F.stations(a, b, step)) { let e; try { e = Math.abs(f(s)); } catch (x) { continue; } if (e > m) { m = e; at = s; } } return { m: R(m), at }; };
const jointsOwn = (doc, w0, w1) => jointSteps(doc, { channels: ['w', 'l', 'h'] }).filter((j) => j.s >= w0 - 1e-9 && j.s <= w1 + 1e-9 && (Math.abs(j.dv) > 1e-4 || Math.abs(j.dm) > 1e-3)).length;
const redsMemo = new WeakMap();
const redsOf = (d) => { let r = redsMemo.get(d); if (!r) redsMemo.set(d, (r = F.reds(d))); return r; };
const lacking = (after, before, a, b) => { const B = redsOf(before); return redsOf(after).filter((x) => x.s1 >= a && x.s0 <= b).filter((x) => !B.some((y) => y.reason === x.reason && x.s0 >= y.s0 - 2 && x.s1 <= y.s1 + 2)); };

(async () => {
  const all = await cases();
  console.log(JSON.stringify({ cases: all.length, rows: all.reduce((n, c) => n + c.holds.length, 0) }));
  for (const c of all) {
    const { start, run } = c, off = SC.pieceOffsets(start), L = F.endOf(start), lo = off[run.from], hi = off[run.to] + start.pieces[run.to].length;
    for (const hold of c.holds) {
      const t0 = Date.now(), row = { cand: 'B', case: c.id, fx: c.fx, hold, run: [lo, hi] };
      let res = null; try { res = EV.even(start, { ...run, value: 16, hold }); } catch (e) { row.refused = e.code || e.message.slice(0, 60); console.log(JSON.stringify(row)); continue; }
      const after = res.doc, { w0, w1 } = res.window; row.win = [R(w0), R(w1)];
      if (hold !== 'centre') {
        const edge = (s) => F.rimAcross(after, s, hold) - F.rimAcross(start, s, hold);
        row.y1 = maxOff(edge, Math.ceil(lo), Math.floor(hi)); row.y1win = maxOff(edge, Math.ceil(w0), Math.floor(w1));
        const side = hold === 'left' ? 1 : -1, ra = EV._internal.rimReader(start, side), rb = EV._internal.rimReader(after, side);
        row.y1q = maxOff((s) => (F.at(after, 'l', s) + rb(s)) - (F.at(start, 'l', s) + ra(s)), lo, hi, 0.25);
      } else {
        let wl = 0, wh = 0; for (const s of F.stations(0, Math.floor(L))) { wl = Math.max(wl, Math.abs(F.at(after, 'l', s) - F.at(start, 'l', s))); wh = Math.max(wh, Math.abs(F.at(after, 'h', s) - F.at(start, 'h', s))); }
        row.y2 = { l: R(wl / F.stepOf('l')), h: R(wh / F.stepOf('h')) };
      }
      if (c.fx !== 'flat') row.y3 = R(F.centreInPlane(after, start).off);
      row.wRun = R(F.spread(F.stations(lo, hi).map((s) => F.at(after, 'w', s))));
      const mA = maxOff((s) => F.at(after, 'w', s) - 16, Math.ceil(Math.max(0, lo - EV.EVEN_MARGIN_M)), Math.floor(lo)), mB = maxOff((s) => F.at(after, 'w', s) - 16, Math.ceil(hi), Math.floor(Math.min(L, hi + EV.EVEN_MARGIN_M)));
      row.wMar = mA.m >= mB.m ? mA : mB;
      row.x4 = F.outsideChanges(after, start, w0, w1).length;
      row.joints = jointsOwn(after, w0, w1);
      row.redsNew = lacking(after, start, w0, w1).length;
      let a = null; try { a = EVA.even(start, { ...run, value: 16, hold }).doc; } catch (e) { row.redsVsA0 = `A0 refused: ${e.code}`; }
      if (a) row.redsVsA0 = lacking(after, a, w0, w1).length;
      row.ms = Date.now() - t0;
      console.log(JSON.stringify(row));
    }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
