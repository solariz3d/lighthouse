// cand678.js (pane A, D678, the librarian's 15:4x item 2 and its 15:5x rows): the kept edge's candidates on ONE table.
//   node cand678.js <builder tree: d678-even-a after the repair round's item 1> > cand.out          (JSON lines, one per candidate x case x hold)
//   node cand678.js <tree> <rows already written> > cand2.out   (resume: the rows in that file are not run again)
// The candidates are Even itself (src/core/even.js of the tree) with ONE textual change each, loaded in place of the file (Module._compile at its own path, so
// its requires are the tree's); the anchor of each change must occur exactly once or the run stops. Registered in the hand-back, section 4.1, before any run:
//   A0  the rule as built (the tree's file, unchanged)
//   A   the rule as built, mended: each window end read at the nearest place outward, within 100 m, where w AND l are at rest (within 1 mm at 10, 20 and 30 m
//       further out); both ends read and agreeing within 1 cm: the kept edge on that road, bumps taken out; otherwise kept where it is now. The middle as built.
//   B   no guess about the past: the kept edge (or the middle) kept where it IS; the width changes and the other edge moves (the centre's height only rises or
//       falls with the sideways move, in the plane of the road as built; a hill or a swerve he made stays)
//   C   no guess, smoothed: the kept edge laid on the road eased between where it is at the window's two ends (no rest rule, no agree rule). The middle as built.
// Measured by the builder's fixture functions (test/even_fixtures.js), never Even's code, every 1 m:
//   wRun     max - min of w over the run;  wMar  the most w is off the value over the margins (the 20 m at the value beyond each end)
//   keptNow  the kept edge against where it is now (the road Even was given), over the whole window;  keptNowRun  the same over the run
//   keptRoad the kept edge against the road before any grab or stroke (the untouched road), over the run
//   ripK, ripO  over the run, max - min of (the edge after - the untouched road's edge): how uneven the kept edge and the other edge are left
//   moveMax  the largest move of either edge against where it was, over the window, and which
//   mid      (middle kept) the most the middle moved across (l) and up (h) over the run
//   outside  samples (w, l, h, bank every 1 m) or whole pieces outside the window's own reach that changed;  joints  steps at the joints the window touches
//   redsNew  the checker's reds in the window that the start lacks;  k3  (B-, the run 200..440) A's K3 against the start
// Prints numbers, counts and labels only.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), Module = require('module');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const TB = require(path.join(T, 'src/core/turnby.js'));
const { jointSteps } = require(path.join(T, 'src/core/continuity.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const EVF = path.join(T, 'src/core/even.js'), SRC = fs.readFileSync(EVF, 'utf8');
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);

function patched(edits) {
  let s = SRC;
  for (const [a, b] of edits) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`anchor found ${n} times: ${a.slice(0, 80)}`); s = s.replace(a, () => b); }
  const m = new Module(EVF, module); m.filename = EVF; m.paths = Module._nodeModulePaths(path.dirname(EVF)); m._compile(s, EVF); return m.exports;
}
const RW = "const rw = restOf(doc, off, 'w', win, L), rl = restOf(doc, off, 'l', win, L), one = [rw, rl].every((f) => Math.abs(f(w0) - f(w1)) <= EVEN_AGREE_M);";
const MEND = `const REACH_M = 100, REST_AT = [10, 20, 30];
function atRestM(doc, off, x, dir, L) {
  let n = 0;
  for (const d of REST_AT) { const z = x + dir * d; if (z < 0 || z > L) continue; n++; for (const ch of ['w', 'l']) if (Math.abs(valueAt(doc, off, ch, z) - valueAt(doc, off, ch, x)) > REST_M) return false; }
  return n > 0;
}
function readRoadM(doc, off, win, L) {
  const find = (x, dir) => { for (let k = 0; k <= REACH_M; k++) { const y = x + dir * k; if (y < 0 || y > L) return null; if (atRestM(doc, off, y, dir, L)) return y; } return null; };
  const y0 = find(win.w0, -1), y1 = find(win.w1, 1); if (y0 === null || y1 === null) return null;
  const a = (ch) => valueAt(doc, off, ch, y0), b = (ch) => valueAt(doc, off, ch, y1);
  if (Math.abs(a('w') - b('w')) > EVEN_AGREE_M || Math.abs(a('l') - b('l')) > EVEN_AGREE_M) return null;
  const ease = (u, v) => (s) => u + (v - u) * SC.smootherstep(Math.min(1, Math.max(0, (s - win.w0) / (win.w1 - win.w0))));
  return { w: ease(a('w'), b('w')), l: ease(a('l'), b('l')) };
}
function restOf(`;
const CANDS = {
  A0: [],
  A: [['function restOf(', MEND], [RW, 'const rd = readRoadM(doc, off, win, L), one = !!rd, rw = rd && rd.w, rl = rd && rd.l;']],
  B: [['dStar = one ? levelTo(doc, { w: rw, l: rl }, win) : doc;', 'dStar = doc;'],
    ["const fh = easeOf(doc, off, 'h', win), fl = easeOf(doc, off, 'l', win);", "const fh = (s) => valueAt(doc, off, 'h', s), fl = (s) => valueAt(doc, off, 'l', s);"]],
  C: [[RW, "const rw = easeOf(doc, off, 'w', win), rl = easeOf(doc, off, 'l', win), one = true;"]],
};

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
const rip = (f, lo, hi) => R(F.spread(F.stations(Math.ceil(lo), Math.floor(hi)).map(f)));
function outsideOwn(after, before, w0, w1) {
  const off = SC.pieceOffsets(before); let n = 0;
  before.pieces.forEach((P, p) => { const e = p + 1 < before.pieces.length ? off[p + 1] : off[p] + (P.length || 0); if ((e < w0 || off[p] > w1) && after.pieces[p] !== P) n++; });
  for (const s of F.stations(0, F.endOf(before))) { if (s >= w0 && s <= w1) continue; for (const ch of ['w', 'l', 'h', 'phi']) if (!Object.is(F.at(after, ch, s), F.at(before, ch, s))) n++; }
  return n;
}
const jointsOwn = (doc, w0, w1) => jointSteps(doc, { channels: ['w', 'l', 'h'] }).filter((j) => j.s >= w0 - 1e-9 && j.s <= w1 + 1e-9 && (Math.abs(j.dv) > 1e-4 || Math.abs(j.dm) > 1e-3)).length;
// The start's reds, once per case (added 22:10Z, after the first 67 rows: they computed them once per ROW, 8 times a case, and the run had slowed to about a row a
// minute). The same function and the same filter as F.redsLacked (test/even_fixtures.js), so a row's redsNew is unchanged.
const startReds = new WeakMap();
function redsLackedOnce(after, before, a, b) {
  let B = startReds.get(before); if (!B) startReds.set(before, (B = F.reds(before)));
  return F.reds(after).filter((x) => x.s1 >= a && x.s0 <= b).filter((x) => !B.some((y) => y.reason === x.reason && x.s0 >= y.s0 - 2 && x.s1 <= y.s1 + 2));
}
// RESUME (optional third argument): a file of rows already written; a row whose candidate, case, road and hold are in it is not run again.
const DONE = new Set((process.argv[3] ? fs.readFileSync(process.argv[3], 'utf8').split(/\r?\n/) : []).filter((l) => l.startsWith('{"cand"')).map((l) => { const r = JSON.parse(l); return `${r.cand}|${r.case}|${r.fx}|${r.hold}`; }));

(async () => {
  const EVS = Object.fromEntries(Object.entries(CANDS).map(([k, e]) => [k, patched(e)]));
  const all = await cases();
  console.log(JSON.stringify({ cases: all.length, rows: all.reduce((n, c) => n + c.holds.length, 0) * Object.keys(EVS).length, candidates: Object.keys(EVS) }));
  for (const c of all) {
    const { start, base, run } = c, off = SC.pieceOffsets(start), lo = off[run.from], hi = off[run.to] + start.pieces[run.to].length;
    const { win } = EVS.A0.evenWindow(start, run), { w0, w1 } = win;
    for (const hold of c.holds) for (const [k, EV] of Object.entries(EVS)) {
      if (DONE.has(`${k}|${c.id}|${c.fx}|${hold}`)) continue;
      const row = { cand: k, case: c.id, fx: c.fx, hold, run: [lo, hi], win: [R(w0), R(w1)] };
      let res = null; try { res = EV.even(start, { ...run, value: 16, hold }); } catch (e) { row.refused = e.code || e.message.slice(0, 60); console.log(JSON.stringify(row)); continue; }
      const after = res.doc, other = hold === 'left' ? 'right' : 'left';
      row.wRun = R(F.spread(F.stations(lo, hi).map((s) => F.at(after, 'w', s))));
      row.wMar = maxOff((s) => F.at(after, 'w', s) - 16, Math.max(w0, win.lo), lo).m >= maxOff((s) => F.at(after, 'w', s) - 16, hi, Math.min(w1, win.hi)).m ? maxOff((s) => F.at(after, 'w', s) - 16, Math.max(w0, win.lo), lo) : maxOff((s) => F.at(after, 'w', s) - 16, hi, Math.min(w1, win.hi));
      const edge = (d, side) => (s) => F.rimAcross(d, s, side);
      if (hold !== 'centre') {
        row.keptNow = maxOff((s) => edge(after, hold)(s) - edge(start, hold)(s), w0, w1);
        row.keptNowRun = maxOff((s) => edge(after, hold)(s) - edge(start, hold)(s), lo, hi);
        row.keptRoad = maxOff((s) => edge(after, hold)(s) - edge(base, hold)(s), lo, hi);
        row.ripK = rip((s) => edge(after, hold)(s) - edge(base, hold)(s), lo, hi);
        row.ripO = rip((s) => edge(after, other)(s) - edge(base, other)(s), lo, hi);
      } else {
        row.mid = { l: maxOff((s) => F.at(after, 'l', s) - F.at(start, 'l', s), lo, hi), h: maxOff((s) => F.at(after, 'h', s) - F.at(start, 'h', s), lo, hi) };
        row.ripL = rip((s) => edge(after, 'left')(s) - edge(base, 'left')(s), lo, hi); row.ripR = rip((s) => edge(after, 'right')(s) - edge(base, 'right')(s), lo, hi);
      }
      const mv = ['left', 'right'].map((side) => ({ side, ...maxOff((s) => edge(after, side)(s) - edge(start, side)(s), w0, w1) }));
      row.moveMax = mv[0].m >= mv[1].m ? mv[0] : mv[1];
      row.outside = outsideOwn(after, start, w0, w1); row.joints = jointsOwn(after, w0, w1);
      row.redsNew = redsLackedOnce(after, start, w0, w1).length;
      if (c.fx !== 'flat' && lo === 200 && hi === 440) row.k3 = R(F.centreOff(after, start).off);
      console.log(JSON.stringify(row));
    }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
