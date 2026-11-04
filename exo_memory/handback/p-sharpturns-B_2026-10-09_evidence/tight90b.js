// tight90b.js (pane B, D280 part 2): three follow-ups to tight90.js, same harness (t180 main 22c46a0, read-only export; the app's core shell
// and validation controller at their default, full speed).
//   node tight90b.js
// (1) the green/red boundary at width 45, R 23.0 .. 25.0 in 0.25 m, "at start" (the UI's tightest form);
// (2) the same sweep at width 24 (Thunderhead's own width at its post-jump turns), R 10 .. 25;
// (3) the DEFAULT turn (no "at start"): the rate eases over the WHOLE piece, so a 90-degree piece of length L needs rate t = 2*90*100/L
//     (the smoothstep's mean is 1/2) and ENDS still turning at t; the exit piece is turn 0 with "at start". L = 750 m is the keeper's piece.
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, 't180@main');
const { createCoreShell } = require(path.join(ROOT, 'app/core/coreshell.js'));
const { createValidationController } = require(path.join(ROOT, 'app/validate-ui/panel.js'));
const PANEL = require(path.join(ROOT, 'app/core/panel.js'));
const DEG = Math.PI / 180;

async function run(W, turnOpts, Lturn) {
  const shell = await createCoreShell({ storage: null, autosaveMs: 0, brushFn: null });
  const ctl = createValidationController(shell);
  let refused = null;
  const step = (o) => { const b = shell.getState().history.present; shell.extend(o); if (shell.getState().history.present === b) refused = refused || shell.getState().message; };
  step(PANEL.extendOptions({ length: 200, turn: 0, width: W, empty: true }));
  step(PANEL.extendOptions(turnOpts));
  step(PANEL.extendOptions({ length: 100, turn: 0, atStart: { turn: true } }));
  const res = ctl.state.result, S = ctl.state.path.samples, s0 = 200, s1 = 200 + Lturn + 100;
  const inT = S.filter((x) => x.s >= s0 - 5 && x.s <= s1), kh = (x) => Math.hypot(x.kvec[0], x.kvec[2]);
  let km = 0, kAt = 0; for (const x of inT) if (kh(x) > km) { km = kh(x); kAt = x.s; }
  const fst = (f) => (inT.find((x) => kh(x) >= f * km) || {}).s, lst = (f) => ([...inT].reverse().find((x) => kh(x) >= f * km) || {}).s;
  const hd = (x) => Math.atan2(x.T[0], x.T[2]); const a = S.find((x) => x.s >= s0 - 1), b = [...S].reverse().find((x) => x.s <= s1);
  let dh = (hd(b) - hd(a)) / DEG; while (dh > 180) dh -= 360; while (dh < -180) dh += 360;
  // the exit: heading change over the 100 m exit piece itself, and whether the road is straight at its end
  const e0 = S.find((x) => x.s >= 200 + Lturn), e1 = [...S].reverse().find((x) => x.s <= s1);
  let dhExit = (hd(e1) - hd(e0)) / DEG; while (dhExit > 180) dhExit -= 360; while (dhExit < -180) dhExit += 360;
  const near = (xs) => [...new Set((xs || []).filter((f) => { const lo = f.s0 != null ? f.s0 : f.s, hi = f.s1 != null ? f.s1 : lo; return hi >= s0 - 5 && lo <= s1; }).map((f) => f.reason))];
  return { W, Lturn: +Lturn.toFixed(1), refused, dh: +dh.toFixed(2), Rmin: km ? +(1 / km).toFixed(2) : null, peak_s: +kAt.toFixed(1),
    entry_10_90: +(fst(0.9) - fst(0.1)).toFixed(1), exit_90_10: +(lst(0.1) - lst(0.9)).toFixed(1), exit_piece_heading_change: +dhExit.toFixed(2),
    maxN_g: +Math.max(...res.lines.filter((l) => l.s >= s0 && l.s <= s1).map((l) => l.fN_g)).toFixed(1), red: near(res.red), amber: near(res.amber) };
}
const atStartTurn = (W, R) => { const t = 100 / DEG / R; return run(W, { length: 9000 / t, turn: -t, atStart: { turn: true } }, 9000 / t).then((r) => ({ R, ...r })); };

(async () => {
  const out = { boundary_w45: [], sweep_w24: [], default_turns: [] };
  for (let R = 23; R <= 25.001; R += 0.25) out.boundary_w45.push(await atStartTurn(45, +R.toFixed(2)));
  for (const R of [25, 20, 15, 13, 12, 11, 10]) out.sweep_w24.push(await atStartTurn(24, R));
  for (const L of [750, 300, 100, 60]) { const t = 2 * 90 * 100 / L; out.default_turns.push({ L, rate_deg_per_100m: +t.toFixed(2), ...(await run(45, { length: L, turn: -t }, L)) }); }
  console.log(JSON.stringify({ base: '22c46a0', ...out }, null, 1));
})();
