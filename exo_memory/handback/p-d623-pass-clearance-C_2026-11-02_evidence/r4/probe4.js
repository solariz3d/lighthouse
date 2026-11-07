// probe2.js <worktree>: for candidate (length, turn deg) pieces, does the shell lay it, and what reds and ambers does the checker find (reason counts)?
'use strict';
const path = require('path');
const W = process.argv[2];
const { createCoreShell } = require(path.join(W, 'app/core/coreshell.js'));
const AD = require(path.join(W, 'src/core/adapter.js'));
const V = require(path.join(W, 'src/validate/index.js'));
const cands = [[20, 90], [20, 120], [25, 150], [30, 120], [40, 180], [50, 180], [20, 180], [15, 120]];
(async () => {
  for (const [L, deg] of cands) {
    const s = await createCoreShell({});
    s.extend({ length: L, turnDeg: deg });
    const st = s.getState(), d = st.history.present;
    if (!d.pieces.length) { console.log(L, deg, 'REFUSED', (st.message || '').slice(0, 40)); continue; }
    const { path: p, segments } = AD.toPath(d);
    const r = V.validate(p, segments, {});
    const tally = (xs) => { const m = {}; for (const x of xs || []) m[x.reason] = (m[x.reason] || 0) + 1; return JSON.stringify(m); };
    console.log(L, deg, 'laid', 'red', tally(r.red), 'amber', tally(r.amber));
  }
})().catch((e) => { console.error(e); process.exit(1); });
