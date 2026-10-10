// B, D181 final read: make four README status rows and one intro bullet true to the landed code. Each replacement must
// match exactly once, or nothing is written.
'use strict';
const fs = require('fs');
const f = 'C:/Users/nname/AppData/Local/Temp/b-d181-wt/README.md';
let t = fs.readFileSync(f, 'utf8');
const r = (a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) throw new Error(`expected 1 match, got ${n}: ${a.slice(0, 70)}`);
  t = t.replace(a, () => b);
};
r('Geometry and textures are identical to the export, and\n  the lighting gap is measured against real screenshots.',
  'Geometry and materials are the export\'s own (the painted\n  start and grid boxes are not drawn yet), and fixed reference views are ready for measuring the lighting gap against\n  real screenshots.');
r('| … lighting matched to AC+CSP, the gap measured | not yet | no look-match instrument (§5.3) |',
  '| … lighting matched to AC+CSP, the gap measured | not yet | the look-match instrument is built (`src/lookmatch/`, `scripts/lookmatch.js` · `test/lookmatch.test.js`), but no reference shots from AC exist yet, so the gap is not measured |');
r('| 1. Geometry and materials exactly what is exported | tested | `app/preview/trackmodel.js` builds the export\'s scene · `app/test/preview.test.js` |',
  '| 1. Geometry and materials exactly what is exported | tested, with two gaps | `app/preview/trackmodel.js` builds the export\'s scene · `app/test/aclook.test.js`: every mesh the preview draws has the export\'s name and material, but the painted start line, grid and pit boxes and the closing seam are not drawn yet (a visible todo) |');
r('| 3. The look-match instrument (screenshots vs renders, the difference tracked) | not yet | nothing built |',
  '| 3. The look-match instrument (screenshots vs renders, the difference tracked) | built, number not yet measured | `src/lookmatch/` (fixed reference views, a render in the preview\'s look, the difference as mean CIEDE2000), `scripts/lookmatch.js` · `test/lookmatch.test.js`. No reference shots from AC yet, so no difference is tracked |');
r('| Automatic mapping (along by distance, across by width), with tiling handles | tested | `src/texture/mapping.js` · `test/texture-mapping.test.js` |',
  '| Automatic mapping (along by distance, across by width), with tiling handles | built, not yet used | `src/texture/mapping.js` · `test/texture-mapping.test.js` tests the mapping itself, but the road mesh still maps textures along its centreline (`src/geom/mesh.js`), so the tiling handles are stored and not yet applied |');
fs.writeFileSync(f, t);
console.log('README: 5 replacements written');
