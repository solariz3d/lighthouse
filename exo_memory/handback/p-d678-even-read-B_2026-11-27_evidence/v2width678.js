// v2width678.js (pane B, D678 Track 2, the Even read, registration 1.3 V2): a road whose width changes across the window, Even typed to 16 m on the run 200..440.
//   node v2width678.js <builder tree, 437590e>
// Roads made as A's row core_even.test.js:101 makes its own (TB.extendCorner with the panel's extendOptions, each piece's width typed), Even through the shell's
// typed path (evenRun: what the Even button runs), the left rim held and then the right. No grab: the start IS the road, so the held rim's bar is against it.
// Measured by the builder's fixture functions: the run's width spread; the held rim against the start over the run (the gate's 0.01 m; A's own bar on WC1 0.1 m);
// the same over the margins (180..200, 440..460) beside the untouched-road control's figure from V1; F4 outside; F5 joints; and Even's rule, replicated.
'use strict';
const path = require('path');
const os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const TB = require(path.join(T, 'src/core/turnby.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e5) / 1e5 : x);

function road(name, list) {
  let d = D.createDoc(name);
  for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, ...(p.width === undefined ? {} : { width: p.width }), turnAs: 'corner' }));
  return Object.freeze(d);
}
const TURN = (w) => [1, 2, 3, 4].map(() => ({ length: 60, turn: 30, width: w }));
const ROADS = {
  'WC0 flat (control)': [{ length: 200, turn: 0, width: 12 }, ...TURN(12), { length: 150, turn: 0, width: 12 }],
  'WC1 31 into 12 (A)': [{ length: 200, turn: 0 }, ...TURN(12), { length: 150, turn: 0, width: 12 }],
  'WC2 exit at 20': [{ length: 200, turn: 0, width: 12 }, ...TURN(12), { length: 150, turn: 0, width: 20 }],
  'WC3 last two at 18': [{ length: 200, turn: 0, width: 12 }, { length: 60, turn: 30, width: 12 }, { length: 60, turn: 30, width: 12 }, { length: 60, turn: 30, width: 18 }, { length: 60, turn: 30, width: 18 }, { length: 150, turn: 0, width: 18 }],
  'WC4 rise before': [{ length: 150, turn: 0, width: 12 }, { length: 50, turn: 0, width: 20 }, ...TURN(20), { length: 150, turn: 0, width: 20 }],
};
const maxOff = (a, b, side, lo, hi) => { let m = 0, at = null; for (const s of F.stations(lo, hi)) { const e = Math.abs(F.rimAcross(a, s, side) - F.rimAcross(b, s, side)); if (e > m) { m = e; at = s; } } return { m, at }; };
function ruleOf(doc, w0, w1) {
  const L = F.endOf(doc), out = {}; let agree = true;
  const moving = (ch, x, dir) => { const y = x + dir * 10, z = y < 0 || y > L ? x - dir * 10 : y; return Math.abs(F.at(doc, ch, z) - F.at(doc, ch, x)) > 1e-3; };
  for (const ch of ['w', 'l']) {
    const ma = moving(ch, w0, -1), mb = moving(ch, w1, 1), rule = ma === mb ? 'eased' : ma ? 'rest@w1' : 'rest@w0';
    const f0 = rule === 'eased' ? F.at(doc, ch, w0) : F.at(doc, ch, ma ? w1 : w0), f1 = rule === 'eased' ? F.at(doc, ch, w1) : f0;
    if (Math.abs(f0 - f1) > 0.01) agree = false;
    out[ch] = `${rule} (${R(f0)}..${R(f1)})`;
  }
  out.agree = agree; return out;
}

(async () => {
  for (const [name, list] of Object.entries(ROADS)) {
    const d = road(name, list), run = F.runPieces(d), win = EV.evenWindow(d, { from: run.from, to: run.to }).win;
    const ctl = { w150: R(F.at(d, 'w', 150)), w200: R(F.at(d, 'w', 200)), w440: R(F.at(d, 'w', 440)), w490: R(F.at(d, 'w', 490)), len: F.endOf(d) };
    const rule = ruleOf(d, win.w0, win.w1);
    for (const hold of ['left', 'right']) {
      const sh = await F.shellOn(d); let said = null, err = null;
      try { sh.evenRun({ value: '16', hold, from: run.from, to: run.to }); said = sh.getState().message; } catch (e) { err = e.message; }
      const after = F.present(sh), row = { road: name, hold, run: [run.from, run.to], win: [win.w0, win.w1], ctl, laid: after !== d, said: (said || err || '').slice(0, 160), rule };
      if (after !== d) {
        const w = F.stations(200, 440).map((s) => F.at(after, 'w', s)), ru = maxOff(after, d, hold, 200, 440), m1 = maxOff(after, d, hold, 180, 200), m2 = maxOff(after, d, hold, 440, 460), mu = m1.m >= m2.m ? m1 : m2;
        Object.assign(row, { wSpread: R(F.spread(w)), heldRun: R(ru.m), heldRunAt: ru.at, heldMar: R(mu.m), heldMarAt: mu.at, outside: F.outsideChanges(after, d).length, joints: F.jointBreaks(after).length });
      }
      console.log(JSON.stringify(row));
    }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
