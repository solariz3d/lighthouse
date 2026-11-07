// probe4.js <tree>: core_segcache row 1's track up to the tube, then the cup piece made with the core; where are s 0.86 km and 1.11 km, and what does passClearance find
'use strict';
const path = require('path'), T = process.argv[2];
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const TB = require(path.join(T, 'src/core/turnby.js')), AD = require(path.join(T, 'src/core/adapter.js'));
const { passClearance } = require(path.join(T, 'src/validate/passclear.js'));
const R = 180, Q = Math.PI * R / 2;
(async () => {
  const s = await createCoreShell({});
  s.extend({ length: 300, family: 'bowl' }); s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } });
  s.extend({ length: 300, first: { w: 40, t: 360 } });
  const d = TB.extendCorner(s.getState().history.present, { length: 300, first: { c: 60 } });
  const p = AD.toPath(d), S = p.path.samples, segs = AD.toSegments(d);
  const at = (km) => S.reduce((b, x) => Math.abs(x.s - km * 1000) < Math.abs(b.s - km * 1000) ? x : b);
  for (const km of [0.64, 0.86, 0.94, 0.96, 1.11, 1.24]) { const x = at(km); console.log(km, 's', x.s.toFixed(1), 'pos', x.pos.map((v) => v.toFixed(1)).join(','), 'T', x.T.map((v) => v.toFixed(2)).join(',')); }
  const f = passClearance(p.path, segs, {});
  console.log('findings', f.length);
  for (const g of f.slice(0, 4)) console.log(JSON.stringify({ s: +g.s.toFixed(1), u: +g.u.toFixed(2), otherS: +g.otherS.toFixed(1), otherU: +g.otherU.toFixed(2), gap: +g.gapM.toFixed(2), clip: g.clip, apron: g.apron, onApron: g.onApron }));
  process.exit(0);
})();
