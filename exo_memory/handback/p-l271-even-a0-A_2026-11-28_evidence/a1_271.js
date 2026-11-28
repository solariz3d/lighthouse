// a1_271.js (pane A, L271 item 1, a design probe, nothing built): A0 against A1, the reading kept only where its ends support it, on the 28 cases of the D678 table
// (cand678.js's cases and measures, copied) and two counter-roads. Registered before the run in handback/p-l271-even-a0-A_2026-11-28.md, section 1.2.
//   node a1_271.js <builder tree: 298eaf6 (git archive)> <B's even.js (d678-even-b 6aaec86)> > a1_271.out
// The candidates are the tree's src/core/even.js with textual edits (a1_cands.js, pasted below), each anchor exactly once, compiled in place:
//   A0   unchanged (298eaf6)
//   A1B  the window's ends read by endState (at rest within 1 mm at 10, 20 and 30 m beyond; an end with no road beyond is an EDGE); the road read only where the
//        ends support it (readSupported, per channel w and l): both at rest and agreeing within 1 cm (eased); or one at rest and the other a moving end with road
//        beyond whose value heads toward the rest value over the 10 m inward (or is already within 1 mm of it), or an edge within 1 cm of it (the rest value). Otherwise the FALLBACK: B's line,
//        the kept edge where it is now at the new width, fitted over the whole window (fitChannel, copied verbatim from d678-even-b); the height as A0.
//   A1R  the same reading; the fallback is a refusal by name (EVEN_UNREAD), nothing changed.
// Measured by the builder's fixture functions only (test/even_fixtures.js), as cand678.js. Prints numbers, counts and labels only.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), Module = require('module');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]), BSRC = fs.readFileSync(path.resolve(process.argv[3]), 'utf8');
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
// B's one fit, copied verbatim from d678-even-b's even.js at run time (the function whole, up to its closing brace at column 0)
const FITB = (() => { const i = BSRC.indexOf('function fitChannel('), j = BSRC.indexOf('\n}\n', i); if (i < 0 || j < 0) throw new Error("B's fitChannel not found"); return BSRC.slice(i, j + 3); })();
const READ = `const REST_AT_M = [10, 20, 30];
function endState(doc, off, ch, x, dir, L) {
  const v = valueAt(doc, off, ch, x); let n = 0;
  for (const d of REST_AT_M) { const z = x + dir * d; if (z < 0 || z > L) continue; n++; if (Math.abs(valueAt(doc, off, ch, z) - v) > REST_M) return { kind: 'moving', v }; }
  return { kind: n ? 'rest' : 'edge', v };
}
function readSupported(doc, off, win, L) {
  const x0 = win.w0, x1 = win.w1, fns = {};
  for (const ch of ['w', 'l']) {
    const a = endState(doc, off, ch, x0, -1, L), b = endState(doc, off, ch, x1, 1, L);
    let f = null;
    if (a.kind === 'rest' && b.kind === 'rest') { if (Math.abs(a.v - b.v) <= EVEN_AGREE_M) f = easeOf(doc, off, ch, win); }
    else if (a.kind === 'rest' || b.kind === 'rest') {
      const [r, o, xo, dir] = a.kind === 'rest' ? [a, b, x1, 1] : [b, a, x0, -1];
      const inward = valueAt(doc, off, ch, Math.min(L, Math.max(0, xo - dir * REST_SPAN_M)));
      const ok = o.kind === 'edge' ? Math.abs(o.v - r.v) <= EVEN_AGREE_M : Math.abs(inward - r.v) <= Math.abs(o.v - r.v) + REST_M;
      if (ok) { const v = r.v; f = () => v; }
    }
    if (!f) return null;
    fns[ch] = f;
  }
  return fns;
}
function restOf(`;
const SETTLE_L = "const c1 = freeze(D.checkDoc({ ...d1, pieces: SC.settle(d1, 'l', resL).pieces }));";
const CANDS = {
  A0: [],
  A1B: [['function restOf(', READ], [RW, 'var rd271 = readSupported(doc, off, win, L); const one = !!rd271, rw = rd271 && rd271.w, rl = rd271 && rd271.l;'],
    ['function fitHeight(', FITB + '\nfunction fitHeight('],
    [SETTLE_L, "const resL2 = side && !rd271 ? fitChannel(d1, 'l', (s) => { const x = Math.min(L, Math.max(0, s)); return valueAt(doc, off, 'l', x) + rim0(x) - rim1(x); }, win) : resL;\n  const c1 = freeze(D.checkDoc({ ...d1, pieces: SC.settle(d1, 'l', resL2).pieces }));"]],
  A1R: [['function restOf(', READ], [RW, "const rd = readSupported(doc, off, win, L), one = !!rd, rw = rd && rd.w, rl = rd && rd.l;\n    if (!rd) refuse('EVEN_UNREAD', 'the road under this stretch cannot be read from its ends');"]],
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
  // L271's counter-roads (registered with A1): the road's own width changes inside the run with no bump, and the ends read as A1 accepts
  WC5: [{ length: 200, turn: 0, width: 12 }, { length: 60, turn: 30, width: 12 }, { length: 60, turn: 30, width: 12 }, { length: 60, turn: 30, width: 9 }, { length: 60, turn: 30, width: 9 }, { length: 150, turn: 0, width: 9 }],
  WC6: [{ length: 100, turn: 0, width: 12 }, { length: 100, turn: 0, width: 12 }, { length: 60, turn: 30, width: 12 }, { length: 60, turn: 30, width: 18 }, { length: 60, turn: 30, width: 18 }, { length: 60, turn: 30, width: 12 }, { length: 150, turn: 0, width: 12 }],
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
const DONE = new Set((process.argv[4] ? fs.readFileSync(process.argv[4], 'utf8').split(/\r?\n/) : []).filter((l) => l.startsWith('{"cand"')).map((l) => { const r = JSON.parse(l); return `${r.cand}|${r.case}|${r.fx}|${r.hold}`; }));

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
