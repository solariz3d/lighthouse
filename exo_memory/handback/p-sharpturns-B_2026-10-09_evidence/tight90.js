// tight90.js (pane B, D280 part 2): the tightest 90-degree turn the builder places at width 45, FOUND BY TRYING, through the app's own
// core shell and validation controller, on a read-only export of t180 main 22c46a0 (git archive into this scratchpad; the shared checkout
// is mid-edit and is not touched). Nothing is written anywhere but stdout.
//   node tight90.js
// For each radius R: a 200 m straight at width 45, then a turn piece, then a 100 m exit with turn 0, then validation at the app default
// (full speed: an open track at MACH6.vmaxKmh). Two ways to make the turn:
//   UI   the panel's own extendOptions(): turn rate t = 100*(180/pi)/R deg/100 m, "at start" ticked (a 20 m ease), length chosen so the
//        heading change is 90 degrees; the exit piece is turn 0 "at start" (another 20 m ease). Exactly what a person can type today.
//   CORE extend() called directly with a SHORT transition (2 m) on both ends, to see what the 20 m knot spacing does to an abrupt entry.
// Measured on the built path (the controller's own stations, 2 m): the heading change, the minimum radius (1/max|kvec| horizontal), the
// 10-90% entry and exit lengths of |kvec|, the reds/ambers inside the turn, and any refusal.
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, 't180@main');
const { createCoreShell } = require(path.join(ROOT, 'app/core/coreshell.js'));
const { createValidationController } = require(path.join(ROOT, 'app/validate-ui/panel.js'));
const PANEL = require(path.join(ROOT, 'app/core/panel.js'));
const { MACH6 } = require(path.join(ROOT, 'src/validate/limits.js'));
const DEG = Math.PI / 180, W = 45;

async function trial(R, mode) {
  const shell = await createCoreShell({ storage: null, autosaveMs: 0, brushFn: null });
  const ctl = createValidationController(shell);
  const t = 100 / DEG / R;   // deg per 100 m for radius R
  const say = (x) => (shell.getState().message || '');
  let refused = null;
  const step = (opts) => { const before = shell.getState().history.present; shell.extend(opts); if (shell.getState().history.present === before) refused = refused || say(); };
  // 1. a 200 m straight at width 45, turn 0, from the start (empty track: the typed values are the first piece's start)
  step(PANEL.extendOptions ? PANEL.extendOptions({ length: 200, turn: 0, width: W, empty: true }) : { length: 200, targets: { kh: 0, w: W }, first: { kh: 0, w: W } });
  let Lturn;
  if (mode === 'UI') {
    // at start: rate reached by 20 m (mean half the rate over that ramp) then held; exit ramp back to 0 over 20 m adds half its 20 m.
    // heading = t/100 * (L - 10) + t/100 * 10 = t * L / 100 -> L = 9000 / t for 90 degrees (the exit's 10 m-equivalent included)
    Lturn = 9000 / t;
    step(PANEL.extendOptions({ length: Lturn, turn: -t, atStart: { turn: true } }));
    step(PANEL.extendOptions({ length: 100, turn: 0, atStart: { turn: true } }));
  } else {
    const tr = 2; Lturn = (Math.PI / 2) * R;   // arc length at R, the 2 m ramps negligible
    step({ length: Lturn, targets: { kh: -1 / R }, transition: tr });
    step({ length: 100, targets: { kh: 0 }, transition: tr });
  }
  const st = ctl.state, res = st.result, p = st.path;
  if (!p || !p.samples) return { R, mode, refused, error: 'no path' };
  const S = p.samples, s0 = 200, s1 = 200 + Lturn + 100;
  const inTurn = S.filter((x) => x.s >= s0 - 5 && x.s <= s1);
  const kh = (x) => Math.hypot(x.kvec[0], x.kvec[2]);
  let kmax = 0, kAt = 0; for (const x of inTurn) if (kh(x) > kmax) { kmax = kh(x); kAt = x.s; }
  const first = (frac) => (inTurn.find((x) => kh(x) >= frac * kmax) || {}).s;
  const lastx = (frac) => ([...inTurn].reverse().find((x) => kh(x) >= frac * kmax) || {}).s;
  const head = (x) => Math.atan2(x.T[0], x.T[2]);
  const a = S.find((x) => x.s >= s0 - 1), b = [...S].reverse().find((x) => x.s <= s1);
  let dh = (head(b) - head(a)) / DEG; while (dh > 180) dh -= 360; while (dh < -180) dh += 360;
  // a finding carries s0..s1 (a span) or s (a point): kept when it overlaps the turn (corrected: the first run filtered on f.s alone and dropped every span)
  const near = (xs) => (xs || []).filter((f) => { const lo = f.s0 != null ? f.s0 : f.s, hi = f.s1 != null ? f.s1 : lo; return hi >= s0 - 5 && lo <= s1; }).map((f) => f.reason + (f.worst != null ? '(' + (+f.worst).toFixed(2) + ')' : ''));
  const uniq = (xs) => [...new Set(xs)];
  return { R, mode, rate_deg_per_100m: +t.toFixed(2), turn_piece_m: +Lturn.toFixed(1), refused,
    heading_change_deg: +dh.toFixed(2), Rmin_realised_m: kmax ? +(1 / kmax).toFixed(2) : null, peak_at_s: kAt,
    entry_10_90_m: first(0.9) != null && first(0.1) != null ? +(first(0.9) - first(0.1)).toFixed(1) : null,
    exit_90_10_m: lastx(0.1) != null && lastx(0.9) != null ? +(lastx(0.1) - lastx(0.9)).toFixed(1) : null,
    maxN_g: res && res.lines ? +Math.max(...res.lines.filter((l) => l.s >= s0 && l.s <= s1).map((l) => l.fN_g)).toFixed(1) : null, maxLat_g: res && res.lines ? +Math.max(...res.lines.filter((l) => l.s >= s0 && l.s <= s1).map((l) => Math.abs(l.fLat_g))).toFixed(1) : null,
    speed_kmh: res && res.speed && res.speed[0] ? Math.round(res.speed[0].v * 3.6) : null,
    red: uniq(near(res && res.red)), amber: uniq(near(res && res.amber)), lapOrLift: res && res.lap ? res.lap.reason || res.lap.ok : null };
}

(async () => {
  const out = [];
  for (const mode of ['UI', 'CORE']) for (const R of [200, 100, 60, 45, 35, 30, 25, 23, 22.5, 22, 20, 15]) {
    try { out.push(await trial(R, mode)); } catch (e) { out.push({ R, mode, threw: e.code || e.message }); }
  }
  console.log(JSON.stringify({ base: '22c46a0', width: W, vmaxKmh: MACH6.vmaxKmh, trials: out }, null, 1));
})();
