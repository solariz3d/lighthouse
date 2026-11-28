// why271.js (pane A, L271 item 1, plan only): WHY A0 misreads, read from its own code. For each case, Even's own restOf / moving / easeOf (src/core/even.js of the
// tree, compiled in place with one line appended that exports them; no other change) are run on the track Even levels (its window's reaches cut, as even() does),
// and print: which branch the reading took at each window end, the values it read, the reference road it built (dStar) against the road before any grab, and the
// kept edge Even laid against that reference and against the road before any grab, over the run, every 1 m. Numbers and labels only.
//   node why271.js <builder tree: d678-even-a 298eaf6> > why271.out
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), Module = require('module');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const TB = require(path.join(T, 'src/core/turnby.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const EVF = path.join(T, 'src/core/even.js');
const EV = (() => { const m = new Module(EVF, module); m.filename = EVF; m.paths = Module._nodeModulePaths(path.dirname(EVF)); m._compile(fs.readFileSync(EVF, 'utf8') + '\nmodule.exports._probe = { restOf, moving, easeOf, valueAt, levelTo, rimReader, refineEnds, REST_SPAN_M, REST_M, EVEN_AGREE_M };\n', EVF); return m.exports; })();
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

const WANT = new Set(['start 0..1, untouched|flat', 'start 0..1, a grab at 30|flat', 'row 175..475|flat', 'row 145..505|B-', 'WC3|flat', 'T1|flat', 'T2b|flat']);
(async () => {
  const P = EV._probe, all = (await cases()).filter((c) => WANT.has(`${c.id}|${c.fx}`));
  for (const c of all) {
    const { start, base, run } = c;
    const W0 = EV.evenWindow(start, run), cut = P.refineEnds(start, W0.off, W0.L, W0.lo, W0.hi, EV.EVEN_MARGIN_M + EV.EVEN_RAMP_M), W = cut === start ? W0 : EV.evenWindow(cut, run);
    const { off, L, lo, hi, win } = W, x0 = win.w0, x1 = win.w1;
    const ends = {};
    for (const ch of ['w', 'l']) {
      const z = (x, dir) => { const y = x + dir * P.REST_SPAN_M; return y < 0 || y > L ? x - dir * P.REST_SPAN_M : y; };
      const end = (x, dir) => ({ at: R(x), cmp: R(z(x, dir)), v: R(P.valueAt(cut, off, ch, x)), vCmp: R(P.valueAt(cut, off, ch, z(x, dir))), moving: P.moving(cut, off, ch, x, dir, L) });
      const f = P.restOf(cut, off, ch, win, L), a = end(x0, -1), b = end(x1, 1);
      ends[ch] = { near: a, far: b, branch: a.moving === b.moving ? 'eased between the ends' : `the end at rest (${a.moving ? 'far' : 'near'}) for the whole window`, read: [R(f(x0)), R(f(x1))], agree: Math.abs(f(x0) - f(x1)) <= P.EVEN_AGREE_M, fn: f };
    }
    const one = ends.w.agree && ends.l.agree;
    const dStar = one ? P.levelTo(cut, { w: ends.w.fn, l: ends.l.fn }, win) : cut;
    const stations = F.stations(Math.ceil(lo), Math.floor(hi));
    const worst = (f) => { let m = 0, at = null; for (const s of stations) { const e = Math.abs(f(s)); if (e > m) { m = e; at = s; } } return { m: R(m), at }; };
    const row = { case: c.id, fx: c.fx, run: [lo, hi], window: [R(x0), R(x1)], w: { ...ends.w, fn: undefined }, l: { ...ends.l, fn: undefined }, oneRoad: one, reference: one ? 'the road read from the ends (dStar)' : 'where it is now (the ends disagree)' };
    row.refWidthVsBefore = worst((s) => F.at(dStar, 'w', s) - F.at(base, 'w', s));
    row.beforeWidthOverRun = { atLo: R(F.at(base, 'w', lo)), atMid: R(F.at(base, 'w', (lo + hi) / 2)), atHi: R(F.at(base, 'w', hi)) };
    row.holds = {};
    for (const hold of c.holds) {
      const out = EV.even(start, { ...run, value: 16, hold }).doc;
      row.holds[hold] = { refEdgeVsBefore: worst((s) => F.rimAcross(dStar, s, hold) - F.rimAcross(base, s, hold)), laidVsRef: worst((s) => F.rimAcross(out, s, hold) - F.rimAcross(dStar, s, hold)), laidVsBefore: worst((s) => F.rimAcross(out, s, hold) - F.rimAcross(base, s, hold)), laidVsNow: worst((s) => F.rimAcross(out, s, hold) - F.rimAcross(start, s, hold)) };
    }
    console.log(JSON.stringify(row));
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
