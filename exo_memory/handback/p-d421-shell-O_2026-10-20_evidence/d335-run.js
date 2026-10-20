'use strict';
// D421 (P's review §2 item 5): what a Sculpt handle LANDS at on a run window, against D335's one-piece case. A bank (phi) handle drag asking +0.2 rad on a one-piece window,
// a two-piece run and a three-piece run, read where the handles read it: sculptInfo().values (since item 5 a run reads at its centre; before it, at its middle piece's middle). Run from the t180 worktree.
const path = require('path');
const { createCoreShell } = require(path.resolve('app/core/coreshell.js'));
const D = require(path.resolve('src/core/document.js'));
const R = 180, Q = (Math.PI * R) / 2, ASK = 0.2;
(async () => {
  const out = [];
  for (const [from, to] of [[2, 2], [1, 2], [1, 3]]) {
    const s = await createCoreShell({ autosaveMs: 0 });
    s.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } });
    s.setSculpt(true); s.selectPiece(from); if (to !== from) s.selectPiece(to, { extend: true });
    const info0 = s.sculptInfo(), v0 = info0.values.phi * Math.PI / 180;   // what the handles show (a run reads at its centre since item 5)
    if (from === to) s.beginSculpt({ channel: 'phi' }); else s.beginSculpt({ channel: 'phi', from, to });
    s.sculptTo(ASK); s.endSculpt();
    const v1 = s.sculptInfo().values.phi * Math.PI / 180;
    out.push({ window: from === to ? `one piece (${from})` : `run ${from}-${to}`, handlePiece: info0.index, asked: ASK, landed: +(v1 - v0).toFixed(6), share: +((v1 - v0) / ASK).toFixed(4), message: s.getState().message });
  }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
