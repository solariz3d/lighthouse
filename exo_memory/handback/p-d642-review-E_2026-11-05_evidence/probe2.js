// usage: node probe2.js <t180 tree>   D642 review: the corner candidate (shell.candidate with turnDeg, as the panel sends it), and how far the re-laid tail's roll moves (degrees)
'use strict';
const path = require('path'), R = path.resolve(process.argv[2]);
const { createCoreShell } = require(path.join(R, 'app/core/coreshell.js')), { createTrackModel } = require(path.join(R, 'app/preview/trackmodel.js'));
const DEG = Math.PI / 180;
const modelOf = (r) => { const tm = createTrackModel(); tm.update({ segments: r.segments, closed: !!r.closed, start: r.start }); return tm; };
async function placed(pieces) { const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); for (const o of pieces) s.extend({ family: 'bowl', ...o }); return s; }
(async () => {
  const out = [];
  for (const [ln, lo] of [['his 88.45 rounded over 1,000', { length: 1000, targets: { phi: 88.45 * DEG }, bankShape: 'rounded' }], ['corkscrew -90 over 250', { length: 250, targets: { phi: -90 * DEG } }]]) {
    for (const [nn, no] of [['straight 100', { length: 100 }], ['corner +90 over 400 (turnDeg)', { length: 400, turnDeg: 90 }], ['corkscrew on, -180 over 250', { length: 250, targets: { phi: -180 * DEG } }]]) {
      const s = await placed([{ length: 1000 }, lo]), st = s.getState(), P = st.resolved.segments, c = s.candidate(no);
      let first = -1, mx = 0, n = 0, len = 0, route = false;
      for (let j = 0; j < P.length; j++) { const a = P[j], b = c.segments[j]; if (JSON.stringify(a) === JSON.stringify(b)) continue; if (first < 0) first = j; n++; len += a.length; for (const f of ['roll0', 'roll1']) mx = Math.max(mx, Math.abs(a[f] - b[f])); for (const f of ['k0', 'k1', 'kp0', 'kp1', 'length']) if (a[f] !== b[f]) route = true; }
      let g; try { const x = modelOf(st.resolved).ghostFor(c); g = x.relaid === undefined ? 'copy-and-extend' : `re-laid from ${x.relaid}`; } catch (e) { g = 'REFUSED'; }
      out.push({ last: ln, next: nn, placedSegsRelaid: n, metres: len, maxRollChangeDeg: +(mx / DEG).toFixed(4), routeFieldsChanged: route, ghost: g });
    }
  }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
