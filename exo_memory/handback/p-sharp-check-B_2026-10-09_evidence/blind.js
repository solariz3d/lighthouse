// blind.js (pane B, D282 part 2): the BLIND check of E's Sharp against the registration exo_memory/loop/sharp_turn_registration_2026-10-09.md
// (committed e45ed2e7 / 28b89a92 before E's code). B's own harness (d280/knots.js's method), on a read-only git archive of t180 8639987.
// Only the interface is used: shell.extendSharp(opts, { deg, R, ramp }) (app/core/coreshell.js) and src/core/sharp.js tightestSharp. E's tests are not read.
//   T180_ROOT=<export> node blind.js <out dir>
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = process.env.T180_ROOT, OUTDIR = process.argv[2];
const { createCoreShell } = require(path.join(ROOT, 'app/core/coreshell.js'));
const { createValidationController } = require(path.join(ROOT, 'app/validate-ui/panel.js'));
const PANEL = require(path.join(ROOT, 'app/core/panel.js'));
const D = require(path.join(ROOT, 'src/core/document.js'));
const SH = require(path.join(ROOT, 'src/core/sharp.js'));
const DEG = Math.PI / 180;

// an in-memory store with the methods save/open use (D272: the undo history beside the track)
const memStore = () => { const docs = new Map(), undo = new Map(); return { saveDoc: async (n, t) => { docs.set(n, t); }, openDoc: async (n) => docs.get(n), listDocs: async () => [...docs.keys()],
  saveUndo: async (n, t) => { undo.set(n, t); }, openUndo: async (n) => undo.get(n), backupDoc: async (n) => n + '.bak' }; };

/** The registered track: 200 m straight at width W; Sharp(deg, R, ramp 4); a 100 m Straight as the app's Straight makes it (turn 0, climb 0, at start). */
async function build({ W, deg, R, ramp = 4, store = null, straight = true }) {
  const shell = await createCoreShell({ storage: store, autosaveMs: 0, brushFn: null });
  const ctl = createValidationController(shell);
  shell.extend(PANEL.extendOptions({ length: 200, turn: 0, width: W, empty: true }));
  const before = D.serialize(shell.getState().history.present);
  shell.extendSharp(PANEL.extendOptions({ length: 100 }), { deg, R, ramp });
  const after = shell.getState().history.present, refused = D.serialize(after) === before ? (shell.getState().message || 'unchanged, no message') : null;
  if (!refused && straight) shell.extend(PANEL.extendOptions({ length: 100, turn: 0, climb: 0, atStart: { turn: true, climb: true } }));
  return { shell, ctl, refused, before };
}

/** The registered measures on the controller's own path (2 m stations): H, E50, entry/exit 10-90%, red/amber overlapping [195, end]. */
function measure({ shell, ctl }, deg) {
  const res = ctl.state.result, S = ctl.state.path.samples, s0 = 200, end = S[S.length - 1].s;
  const hd = (x) => Math.atan2(x.T[0], x.T[2]);
  const unwrap = (a) => { while (a > 180) a -= 360; while (a < -180) a += 360; return a; };
  // H over the turn, unwrapped station to station (a 180 degree corner must not alias)
  let H = 0; const from = S.findIndex((x) => x.s >= s0); for (let i = from + 1; i < S.length; i++) H += unwrap((hd(S[i]) - hd(S[i - 1])) / DEG);
  const last = S[S.length - 1], b50 = S.find((x) => x.s >= end - 50);
  const E50 = Math.abs(unwrap((hd(last) - hd(b50)) / DEG));
  const inT = S.filter((x) => x.s >= s0 - 5), kh = (x) => Math.hypot(x.kvec[0], x.kvec[2]);
  let km = 0; for (const x of inT) km = Math.max(km, kh(x));
  const fst = (f) => inT.find((x) => kh(x) >= f * km).s, lst = (f) => [...inT].reverse().find((x) => kh(x) >= f * km).s;
  const near = (xs) => [...new Set((xs || []).filter((f) => { const lo = f.s0 != null ? f.s0 : f.s, hi = f.s1 != null ? f.s1 : lo; return hi >= s0 - 5 && lo <= end; }).map((f) => f.reason))];
  // the readout's turn (what the doc says the Sharp pieces turn) vs the drawn path, if the shell exposes a readout; else null
  return { H: +H.toFixed(4), H_err: +(Math.abs(H) - Math.abs(deg)).toFixed(4), E50: +E50.toFixed(4), entry: +(fst(0.9) - fst(0.1)).toFixed(1), exit: +(lst(0.1) - lst(0.9)).toFixed(1),
    Rmin: km ? +(1 / km).toFixed(2) : null, red: near(res.red), amber: near(res.amber) };
}
const pass1 = (m, deg) => Math.abs(Math.abs(m.H) - Math.abs(deg)) <= 0.05 && m.E50 <= 0.01 && m.entry <= 8 && m.exit <= 8 && !m.red.length && !m.amber.length;

(async () => {
  const out = { root: ROOT };
  // S1, S2
  for (const [k, W, R] of [['S1', 24, 22], ['S2', 45, 24.25]]) {
    const b = await build({ W, deg: -90, R }); const m = b.refused ? null : measure(b, -90);
    out[k] = { W, R, deg: -90, refused: b.refused, ...m, pass: !!m && pass1(m, -90) };
    if (k === 'S1') fs.writeFileSync(path.join(OUTDIR, 'S1.t180track'), D.serialize(b.shell.getState().history.present));
  }
  // S3: angles at R 22, W 24 (H and E50 scored; red/amber reported)
  out.S3 = [];
  for (const deg of [45, 90, 135, 180]) { const b = await build({ W: 24, deg, R: 22 }); const m = b.refused ? null : measure(b, deg); out.S3.push({ deg, refused: b.refused, ...m, pass: !!m && Math.abs(Math.abs(m.H) - deg) <= 0.05 && m.E50 <= 0.01 }); }
  // S4: refusals as registered
  const refusal = async (W, R, anchor, tol) => {
    const b = await build({ W, deg: -90, R, straight: false });
    const nums = (b.refused || '').match(/\d+(?:\.\d+)?(?= ?m\b)/g) || [];
    const named = nums.map(Number).find((x) => x > 5 && x < 100);
    return { W, R, refused: b.refused, unchanged: !!b.refused && D.serialize(b.shell.getState().history.present) === b.before, named_m: named == null ? null : named,
      pass: !!b.refused && D.serialize(b.shell.getState().history.present) === b.before && named != null && Math.abs(named - anchor) <= tol };
  };
  out.S4a = await refusal(45, 24.0, 24.25, 0.25);
  out.S4b = await refusal(24, 14, 15, 0.5);
  out.S4_reported = [];
  for (const [W, R] of [[45, 24.25], [24, 15]]) { const b = await build({ W, deg: -90, R, straight: false }); out.S4_reported.push({ W, R, accepted: !b.refused, msg: b.refused }); }
  // the 13.4 m line (the librarian's ruling 2): R 13.4 green at W 24, a little below refused naming about 13.4; and the core's own tightestSharp
  out.W24_limit = { tightestSharp_core: null, trials: [] };
  { const sh = await createCoreShell({ storage: null, autosaveMs: 0, brushFn: null }); sh.extend(PANEL.extendOptions({ length: 200, turn: 0, width: 24, empty: true }));
    try { out.W24_limit.tightestSharp_core = SH.tightestSharp(sh.getState().history.present, PANEL.extendOptions({ length: 100 }), { angle: -90 * DEG, ramp: 4 }); } catch (e) { out.W24_limit.tightestSharp_core = 'threw ' + (e.code || e.message); } }
  for (const R of [13.5, 13.4, 13.3, 13.2, 13.0]) {
    const b = await build({ W: 24, deg: -90, R }); const m = b.refused ? null : measure(b, -90);
    out.W24_limit.trials.push({ R, refused: b.refused, ...(m ? { H: m.H, E50: m.E50, entry: m.entry, exit: m.exit, red: m.red, amber: m.amber, green: !m.red.length && !m.amber.length } : {}) });
  }
  // S6: save, reopen in a fresh shell, identical; one Undo steps back over the Sharp (two pieces as one step)
  { const store = memStore(); const b = await build({ W: 24, deg: -90, R: 22, store, straight: false });
    const docText = D.serialize(b.shell.getState().history.present), pathPos = JSON.stringify(b.ctl.state.path.samples.map((x) => x.pos));
    await b.shell.save('SHARP S6');
    const s2 = await createCoreShell({ storage: store, autosaveMs: 0, brushFn: null }); const c2 = createValidationController(s2);
    await s2.open('SHARP S6');
    const reText = D.serialize(s2.getState().history.present), rePos = JSON.stringify(c2.state.path.samples.map((x) => x.pos));
    s2.undo(); const undone = D.serialize(s2.getState().history.present);
    out.S6 = { identical_doc: reText === docText, identical_path: rePos === pathPos, undo_returns_pre_sharp: undone === b.before, pieces_after_open: s2.getState().history.present.pieces.length,
      pass: reText === docText && rePos === pathPos && undone === b.before, msg: s2.getState().message || null }; }
  console.log(JSON.stringify(out, null, 1));
})();
