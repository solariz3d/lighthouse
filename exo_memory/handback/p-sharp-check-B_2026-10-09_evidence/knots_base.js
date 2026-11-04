// knots.js (pane B, D280 part 2, for the NEW abrupt-turn type): does a denser knot spacing on the turn piece let a SHORT transition draw
// correctly? core extend() takes `knotM` (src/core/extend.js:27, document.js:57). Same harness as tight90.js (t180 main 22c46a0, read-only
// export; the app's core shell and validation controller at full speed). One piece does the whole 90: ramp in over `tr`, hold 1/R, ramp
// out to 0 over the last `tr` (the targets path: kh -1/R reached by tr, then a SECOND piece of 0 length? no: two core calls, as a new type
// would make them), then a 100 m straight with turn 0 and the same short ramp.
//   node knots.js
'use strict';
const path = require('path');
const ROOT = process.env.T180_ROOT;
const { createCoreShell } = require(path.join(ROOT, 'app/core/coreshell.js'));
const { createValidationController } = require(path.join(ROOT, 'app/validate-ui/panel.js'));
const PANEL = require(path.join(ROOT, 'app/core/panel.js'));
const DEG = Math.PI / 180;
async function trial(W, R, tr, knotM) {
  const shell = await createCoreShell({ storage: null, autosaveMs: 0, brushFn: null });
  const ctl = createValidationController(shell);
  let refused = null;
  const step = (o) => { const b = shell.getState().history.present; shell.extend(o); if (shell.getState().history.present === b) refused = refused || shell.getState().message; };
  step(PANEL.extendOptions({ length: 200, turn: 0, width: W, empty: true }));
  const L = (Math.PI / 2) * R;   // arc length for 90 deg at R; each short ramp adds about tr/2 of R-turning between the two pieces
  step({ length: L, targets: { kh: -1 / R }, transition: tr, knotM });
  step({ length: 100, targets: { kh: 0 }, transition: tr, knotM });
  const res = ctl.state.result, S = ctl.state.path.samples, s0 = 200, s1 = 200 + L + 100;
  const inT = S.filter((x) => x.s >= s0 - 5 && x.s <= s1), kh = (x) => Math.hypot(x.kvec[0], x.kvec[2]);
  let km = 0; for (const x of inT) km = Math.max(km, kh(x));
  const fst = (f) => (inT.find((x) => kh(x) >= f * km) || {}).s, lst = (f) => ([...inT].reverse().find((x) => kh(x) >= f * km) || {}).s;
  const hd = (x) => Math.atan2(x.T[0], x.T[2]); const a = S.find((x) => x.s >= s0 - 1), b = [...S].reverse().find((x) => x.s <= s1);
  let dh = (hd(b) - hd(a)) / DEG; while (dh > 180) dh -= 360; while (dh < -180) dh += 360;
  // straight after: the heading change over the last 50 m of the exit straight
  const z0 = S.find((x) => x.s >= s1 - 50); let dz = (hd(b) - hd(z0)) / DEG; while (dz > 180) dz -= 360; while (dz < -180) dz += 360;
  const near = (xs) => [...new Set((xs || []).filter((f) => { const lo = f.s0 != null ? f.s0 : f.s, hi = f.s1 != null ? f.s1 : lo; return hi >= s0 - 5 && lo <= s1; }).map((f) => f.reason))];
  return { W, R, tr, knotM, refused, dh: +dh.toFixed(2), Rmin: km ? +(1 / km).toFixed(2) : null, entry_10_90: +(fst(0.9) - fst(0.1)).toFixed(1), exit_90_10: +(lst(0.1) - lst(0.9)).toFixed(1),
    last50m_heading_change: +dz.toFixed(3), red: near(res.red), amber: near(res.amber) };
}
(async () => {
  const out = [];
  for (const [W, R] of [[45, 24.25], [45, 30], [24, 22], [24, 15]]) for (const [tr, knotM] of [[20, 20], [4, 20], [4, 4], [4, 2], [8, 4], [2, 1]]) {
    try { out.push(await trial(W, R, tr, knotM)); } catch (e) { out.push({ W, R, tr, knotM, threw: e.code || e.message }); }
  }
  console.log(JSON.stringify({ base: '22c46a0', trials: out }, null, 1));
})();
