// stale.js (pane B, D237b): the tree is memoised per PATH OBJECT, and the track model extends / sculpts an OPEN track's path IN PLACE (path.js extendPath, rebuildPathFrom).
// Drive the real shell + track model on an open track, plan with the mirror on after each edit (as preview.js does: guidePlan({ bounds: track.bounds, path: track.path })),
// and compare its gap with one measured on a FRESH tree of the same centreline (buildIndex) and with a brute force.   node stale.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]) + '/';
const { createCoreShell } = require(T + 'app/core/coreshell.js'), { createTrackModel } = require(T + 'app/preview/trackmodel.js'), G = require(T + 'app/preview/guides.js');
const brute = (pts, closed, c, kind) => { const segs = []; for (let i = 0; i + 1 < pts.length; i++) segs.push([pts[i], pts[i + 1]]); if (closed && pts.length > 2) segs.push([pts[pts.length - 1], pts[0]]);
  const d2 = (p, a, b) => { const d = [0, 1, 2].map((k) => b[k] - a[k]), w = [0, 1, 2].map((k) => p[k] - a[k]), dd = d[0] ** 2 + d[1] ** 2 + d[2] ** 2, t = dd > 0 ? Math.max(0, Math.min(1, (w[0] * d[0] + w[1] * d[1] + w[2] * d[2]) / dd)) : 0; return (w[0] - d[0] * t) ** 2 + (w[1] - d[1] * t) ** 2 + (w[2] - d[2] * t) ** 2; };
  const stride = Math.max(1, Math.ceil(pts.length / 4000)); let max = 0, sum = 0, n = 0; for (let i = 0; i < pts.length; i += stride) { const m = G.mirrorPoint(pts[i], c, kind); let b = Infinity; for (const [a, bb] of segs) b = Math.min(b, d2(m, a, bb)); const g = Math.sqrt(b); max = Math.max(max, g); sum += g; n++; } return { max, mean: sum / n }; };
(async () => {
  const s = await createCoreShell({ brushFn: null }), tm = createTrackModel(), rows = [];
  const step = (label) => {
    const r = tm.update(s.getState().resolved), p = r.path, plan = G.guidePlan({ bounds: r.bounds, path: p, mode: 'off', mirror: 'x' });
    const pts = p.samples.map((x) => x.pos.slice()), c = plan.centre, fresh = G.buildIndex ? G.mirrorGap(pts, !!p.closed, c, 'x', G.buildIndex(pts, !!p.closed)) : G.mirrorGap(pts, !!p.closed, c, 'x'), b = brute(pts, !!p.closed, c, 'x');
    rows.push({ label, how: r.how, samePathObject: rows.length ? p === step.last : null, samples: pts.length, plan: [+plan.gap.max.toFixed(3), +plan.gap.mean.toFixed(3)], freshTree: [+fresh.max.toFixed(3), +fresh.mean.toFixed(3)], brute: [+b.max.toFixed(3), +b.mean.toFixed(3)], STALE: Math.abs(plan.gap.max - b.max) > 1e-6 || Math.abs(plan.gap.mean - b.mean) > 1e-6 });
    step.last = p;
  };
  s.extend({ length: 300 }); step('first piece');
  s.extend({ length: 200, transition: 40, targets: { kh: 1 / 120 } }); step('extend: a turn');
  s.extend({ length: 250, transition: 40, targets: { kh: 0 } }); step('extend: a straight');
  s.beginBrush({ mode: 'rate', channel: 'phi', s0: 400, r: 60 }); s.brushTo(0.02); s.endBrush(); step('brush (sculpt)');
  console.log(JSON.stringify(rows, null, 1));
  console.log(`STALE rows: ${rows.filter((x) => x.STALE).length} of ${rows.length}`);
})().catch((e) => { console.error(e); process.exit(1); });
