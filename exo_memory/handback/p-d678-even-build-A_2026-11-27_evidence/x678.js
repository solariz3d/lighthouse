// x678.js (pane A, D678, the 23:26Z order's item 1, the hand-back's section 5.1 rows X4 to X9): Even as built (A0) on the 28 cases of cand678.js, copied
// verbatim from it, with the window's ends cut (the tree's src/core/even.js, unchanged), and bcedaaf's Even beside it for X9.
//   node x678.js <builder tree: d678-even-a with item 1> <a bcedaaf tree (git archive)> > x678.out          (JSON lines, one per case x hold)
// Measured by the builder's fixture functions (test/even_fixtures.js of the tree), never Even's code, every 1 m:
//   wRun     max - min of w over the run;  wMar  the most w is off the value over the margins (the 20 m beyond each end of the run, clipped to the road)
//   k3       (B-, the run 200..440) K3 (centreOff) against the start
//   x4       outside the result's window: samples past one stored step of their channel (F.outsideChanges, every channel the piece carries), and the worst
//            channel in steps
//   x5       outside the result's window: the built centreline's position (adapter toPath, step 1, the same s) at most this far from the start's (m); both rims
//            across (rimAcross); the built bank (builtBank, rad)
//   joints   steps at the joints the window touches (dv over 1e-4, dm over 1e-3)
//   redsNew  the checker's reds in the window that the start lacks; redsVsB  the reds in the window that bcedaaf's Even on the same start lacks
// Prints numbers, counts and labels only.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]), TB0 = path.resolve(process.argv[3]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const AD = require(path.join(T, 'src/core/adapter.js'));
const TB = require(path.join(T, 'src/core/turnby.js'));
const { jointSteps } = require(path.join(T, 'src/core/continuity.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const EVS = { A0: require(path.join(T, 'src/core/even.js')) }, EVB = require(path.join(TB0, 'src/core/even.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);

// ── the cases: { id, fx, base (the road before any grab), start (what Even is given), run, holds } ──
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
  // the 15:5x first row: a run from the track's start
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
const maxOff = (f, lo, hi) => { let m = 0, at = null; for (const s of F.stations(Math.ceil(lo), Math.floor(hi))) { const e = Math.abs(f(s)); if (e > m) { m = e; at = s; } } return { m: R(m), at }; };
const jointsOwn = (doc, w0, w1) => jointSteps(doc, { channels: ['w', 'l', 'h'] }).filter((j) => j.s >= w0 - 1e-9 && j.s <= w1 + 1e-9 && (Math.abs(j.dv) > 1e-4 || Math.abs(j.dm) > 1e-3)).length;
const redsMemo = new WeakMap();
const redsOf = (d) => { let r = redsMemo.get(d); if (!r) redsMemo.set(d, (r = F.reds(d))); return r; };
const lacking = (after, before, a, b) => { const B = redsOf(before); return redsOf(after).filter((x) => x.s1 >= a && x.s0 <= b).filter((x) => !B.some((y) => y.reason === x.reason && x.s0 >= y.s0 - 2 && x.s1 <= y.s1 + 2)); };
/** X4: the worst channel outside [w0, w1], in stored steps, every 1 m (the offsets taken once per document). */
function worstSteps(after, before, w0, w1) {
  const oa = SC.pieceOffsets(after), ob = SC.pieceOffsets(before), read = (doc, o, ch, s) => { for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= o[i] - 1e-9 && s <= o[i] + P.length + 1e-9 && P.channels[ch]) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - o[i]))); } return NaN; };
  let worst = { ch: null, steps: 0, s: null };
  for (const s of F.stations(0, F.endOf(before))) {
    if (s >= w0 && s <= w1) continue;
    const i = before.pieces.findIndex((P, k) => P.type === 'road' && s >= ob[k] - 1e-9 && s <= ob[k] + P.length + 1e-9); if (i < 0) continue;
    for (const ch of Object.keys(before.pieces[i].channels)) { const d = Math.abs(read(after, oa, ch, s) - read(before, ob, ch, s)) / F.stepOf(ch); if (d > worst.steps) worst = { ch, steps: Math.round(d * 1000) / 1000, s }; }
  }
  return worst;
}
/** X5: outside [w0, w1], the built centreline, both rims across, and the built bank, against the start, every 1 m. */
function builtOutside(after, before, w0, w1) {
  const pa = AD.toPath(after, { step: 1 }).path.samples, pb = AD.toPath(before, { step: 1 }).path.samples, n = Math.min(pa.length, pb.length);
  let pos = 0, posAt = null;
  for (let k = 0; k < n; k++) { const s = pb[k].s; if (s >= w0 && s <= w1) continue; if (Math.abs(pa[k].s - s) > 1e-6) return { pos: 'stations differ' }; const a = pa[k].pos, b = pb[k].pos, d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); if (d > pos) { pos = d; posAt = s; } }
  let rim = 0, rimAt = null, bank = 0, bankAt = null;
  for (const s of F.stations(0, Math.floor(F.endOf(before)))) {
    if (s >= w0 && s <= w1) continue;
    for (const side of ['left', 'right']) { let d; try { d = Math.abs(F.rimAcross(after, s, side) - F.rimAcross(before, s, side)); } catch (e) { continue; } if (d > rim) { rim = d; rimAt = s; } }
    const db = Math.abs(F.builtBank(after, s) - F.builtBank(before, s)); if (db > bank) { bank = db; bankAt = s; }
  }
  return { pos: Number(pos.toPrecision(3)), posAt, rim: Number(rim.toPrecision(3)), rimAt, bank: Number(bank.toPrecision(3)), bankAt };
}

(async () => {
  const all = await cases();
  console.log(JSON.stringify({ cases: all.length, rows: all.reduce((n, c) => n + c.holds.length, 0) }));
  for (const c of all) {
    const { start, run } = c, off = SC.pieceOffsets(start), L = F.endOf(start), lo = off[run.from], hi = off[run.to] + start.pieces[run.to].length;
    for (const hold of c.holds) {
      const t0 = Date.now(), row = { cand: 'A0', case: c.id, fx: c.fx, hold, run: [lo, hi] };
      let res = null; try { res = EVS.A0.even(start, { ...run, value: 16, hold }); } catch (e) { row.refused = e.code || e.message.slice(0, 60); console.log(JSON.stringify(row)); continue; }
      const after = res.doc, { w0, w1 } = res.window; row.win = [R(w0), R(w1)];
      row.wRun = R(F.spread(F.stations(lo, hi).map((s) => F.at(after, 'w', s))));
      const mA = maxOff((s) => F.at(after, 'w', s) - 16, Math.max(0, lo - EVS.A0.EVEN_MARGIN_M), lo), mB = maxOff((s) => F.at(after, 'w', s) - 16, hi, Math.min(L, hi + EVS.A0.EVEN_MARGIN_M));
      row.wMar = mA.m >= mB.m ? mA : mB;
      if (c.fx !== 'flat' && lo === 200 && hi === 440) row.k3 = R(F.centreOff(after, start).off);
      row.x4 = { past: F.outsideChanges(after, start, w0, w1).length, worst: worstSteps(after, start, w0, w1) };
      row.x5 = builtOutside(after, start, w0, w1);
      row.joints = jointsOwn(after, w0, w1);
      row.redsNew = lacking(after, start, w0, w1).length;
      let b = null; try { b = EVB.even(start, { ...run, value: 16, hold }).doc; } catch (e) { row.redsVsB = `bcedaaf refused: ${e.code}`; }
      if (b) row.redsVsB = lacking(after, b, w0, w1).length;
      row.ms = Date.now() - t0;
      console.log(JSON.stringify(row));
    }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
