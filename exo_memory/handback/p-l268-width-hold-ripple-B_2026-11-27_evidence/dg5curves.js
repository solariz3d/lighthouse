// dg5curves.js (pane B, L268): drag-ghost row 5's documents (its own calls), on ONE tree: the placed pieces' hash (wd out), each corner's hash with w and wd out, its
// knots, and every channel but w sampled every metre (to JSON, for comparing two trees), and where each corner ends (x, y, heading).   usage: node dg5curves.js <tree> <out.json>
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto'), T = path.resolve(process.argv[2]);
const TB = require(path.join(T, 'src/core/turnby.js')), D = require(path.join(T, 'src/core/document.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
(async () => {
  const sh0 = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh0.extend({ length: 300 });
  sh0.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); sh0.extend({ length: 75, transition: 30, targets: { w: 25 } });
  const doc0 = sh0.exportDoc(), opts = [{ length: 1500, turnDeg: 33, targets: { phi: 0.1 } }, { length: 400, turnDeg: -75, climbDeg: 4 }, { length: 2200 }];
  const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
  const noWd = (P) => { const { wd, ...channels } = P.channels; return { ...P, channels }; }, noW = (P) => { const { w, ...channels } = noWd(P).channels; return { ...P, channels }; };
  const out = { placed: h(doc0.pieces.map(noWd)), corners: [] };
  for (const o of opts) {
    const d = TB.extendCorner(doc0, o), P = d.pieces.at(-1), samples = {};
    for (const ch of D.CHANNELS) if (ch !== 'w' && ch !== 'wd' && P.channels[ch]) { samples[ch] = []; for (let x = 0; x <= P.length; x += 1) samples[ch].push(D.channelValue(P, ch, x)); }
    const end = D.endState ? D.endState(d) : null;
    out.corners.push({ opts: o, noW: h(noW(P)), knots: P.knots.length, length: P.length, samples, end: end && end.kh ? { kh: end.kh.v, phi: end.phi.v } : null });
  }
  fs.writeFileSync(process.argv[3], JSON.stringify(out));
  console.log(`placed ${out.placed}; corners: ${out.corners.map((c) => `${c.noW} (${c.knots} knots, ${c.length} m)`).join('; ')}`);
})().catch((e) => { console.error(e); process.exit(1); });
