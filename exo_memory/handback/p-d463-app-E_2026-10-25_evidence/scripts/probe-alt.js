// probe-share.js (D463, pane E): how much of a Bend survives the re-close on sculpt-tools.test.js's lap, at the seam and away from it
'use strict';
const W = 'C:/Users/nname/Downloads/t180-wt-e463/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const CJ = require(W + 'app/core/closejob.js');
const realClose = (args) => { try { return { out: CJ.runClose(args), ms: 0 }; } catch (e) { if (e && e.name === 'CoreError') return { refused: { code: e.code || null, message: e.message } }; throw e; } };
const R = 180, Q = (Math.PI * R) / 2;
const share = (base, open, closed, idx, ch) => { let num = 0, den = 0; for (const i of idx) { const b = base.pieces[i].channels[ch], o = open.pieces[i].channels[ch], c = closed.pieces[i].channels[ch]; if (!b || !o || !c || b.length !== o.length || o.length !== c.length) return null; for (let k = 0; k < b.length; k++) { const d = o[k] - b[k]; num += (c[k] - b[k]) * d; den += d * d; } } return den ? num / den : null; };
(async () => {
  for (const [s0, rate] of [[150, 3e-4], [150, -1.9e-3], [60, 3e-4], [450, 3e-4], [700, 3e-4]]) {
    const calls = [];
    const runner = { start(args) { calls.push(args.window ? 'w' + JSON.stringify(args.window) : 'whole'); return { promise: Promise.resolve(realClose(args)), cancel() {} }; } };
    const s = await createCoreShell({ autosaveMs: 0, closeRunner: runner });
    s.extend({ length: 300, family: 'bowl' });
    for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } });
    s.extend({ length: 60, transition: 40, targets: { kh: 0 } });
    s.close();
    const base = s.getState().history.present;
    s.beginBrush({ tool: 'bend', s0, r: 80 }); s.brushTo(rate);
    const open = s.getState().history.present, win = s.getState().brush.changedPieces;
    const N = open.pieces.length, road = open.pieces.map((P, i) => (P.type === "road" ? i : -1)).filter((i) => i >= 0), lastR = road[road.length - 1], firstR = road[0]; for (const w of [[lastR], [firstR], [firstR, lastR]].map((w) => w.filter((i) => !win.includes(i))).filter((w) => w.length)) { const r = realClose({ doc: open, window: w }); console.log("   alt window", JSON.stringify(w), r.refused ? "REFUSED " + r.refused.message.slice(0, 90) : "converged " + r.out.converged + " share " + share(base, open, r.out.doc, win, "kh") + " " + r.out.report); } s.endBrush(); const a = await s.brushRelease();
    console.log(`s0 ${s0} rate ${rate}: window ${JSON.stringify(win)} tries ${calls.join(' ')} closed ${a.history.present.closed} share kept ${share(base, open, a.history.present, win, 'kh')} msg: ${(a.message || '').slice(0, 120)}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
