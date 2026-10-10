// gap2.js (pane B, D282 ruling 3): the PANEL READOUT's turn (src/core/readout.js pieceReadout turnDeg, the integral of kh in the document) for the two
// Sharp pieces, against the heading change on the drawn path (gap.js's measure).   T180_ROOT=<export> node gap2.js
'use strict';
const path = require('path'); const ROOT = process.env.T180_ROOT;
const { createCoreShell } = require(path.join(ROOT, 'app/core/coreshell.js'));
const { createValidationController } = require(path.join(ROOT, 'app/validate-ui/panel.js'));
const PANEL = require(path.join(ROOT, 'app/core/panel.js'));
const { pieceReadout } = require(path.join(ROOT, 'src/core/readout.js'));
const DEG = Math.PI / 180;
(async () => { const rows = [];
  for (const [W, R, deg] of [[24, 22, -90], [45, 24.25, -90], [24, 22, 45], [24, 22, 135], [24, 22, 180]]) {
    const shell = await createCoreShell({ storage: null, autosaveMs: 0, brushFn: null }); const ctl = createValidationController(shell);
    shell.extend(PANEL.extendOptions({ length: 200, turn: 0, width: W, empty: true }));
    shell.extendSharp(PANEL.extendOptions({ length: 100 }), { deg, R, ramp: 4 });
    const doc = shell.getState().history.present; const rd = pieceReadout(doc, 1).turnDeg + pieceReadout(doc, 2).turnDeg;
    const S = ctl.state.path.samples, hd = (x) => Math.atan2(x.T[0], x.T[2]); let H = 0; const from = S.findIndex((x) => x.s >= 200);
    for (let i = from + 1; i < S.length; i++) { let d = (hd(S[i]) - hd(S[i - 1])) / DEG; while (d > 180) d -= 360; while (d < -180) d += 360; H += d; }
    rows.push({ W, R, deg, readout_turnDeg: +rd.toFixed(4), drawn_path_deg: +H.toFixed(4), gap_deg: +(rd - H).toFixed(4) }); }
  console.log(JSON.stringify(rows)); })();
