// B, D181 final read: merge the landing's missing entries into A's [0.2.1] section (no duplicates), and correct the one
// overclaim in it. Each anchor must match exactly once, or nothing is written.
'use strict';
const fs = require('fs');
const f = 'C:/Users/nname/AppData/Local/Temp/b-d181-wt/CHANGELOG.md';
let t = fs.readFileSync(f, 'utf8');
const r = (a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) throw new Error(`expected 1 match, got ${n}: ${a.slice(0, 70)}`);
  t = t.replace(a, () => b);
};
// 1. the AC-look line: "exactly" overclaims while the paint and the closing seam are not drawn
r('from Content Manager\'s Custom Showroom under the Ms-PL, whose licence is in `app/preview/`) and exactly the materials\n  and textures the export writes, under one stated reference light (14:00 sun). L switches to a colour per placed word.',
  'from Content Manager\'s Custom Showroom under the Ms-PL, whose licence is in `app/preview/`) and the materials and\n  textures the export writes, under one stated reference light (14:00 sun). L switches to a colour per placed word. Not\n  drawn yet: the painted start line, grid and pit boxes, and the closing seam.');
// 2. Added: the look-match views and the Export test seam; then a Changed section before Fixed
r('  AC" carries it too.\n\n### Fixed\n',
  '  AC" carries it too.\n' +
  '- Look-match reference views (ARCHITECTURE §5.3): fixed cameras on two reference tracks (`src/lookmatch/views.json`),\n' +
  '  rendered in the builder\'s look (`node scripts/lookmatch.js render`), and the difference measured as mean CIEDE2000\n' +
  '  (`node scripts/lookmatch.js diff`). The number stays unmeasured until reference shots from AC exist; renders of\n' +
  '  other authors\' tracks are never written into the repository.\n' +
  '- A test seam for the Export dialog (`T180_TEST_EXPORT_FOLDER`, read only from the app\'s launch environment), so the\n' +
  '  installed app\'s Export can be checked end to end. Normal use always gets the native folder dialog.\n' +
  '\n### Changed\n\n' +
  '- While a handle is dragged, only the dragged word and the word after it are re-checked on every frame. The rest of\n' +
  '  the track is shown as "not checked yet" (never as clear) and is checked in full the moment the handle is let go,\n' +
  '  with exactly the result a full check gives. On the 40 km benchmark track (`node --expose-gc scripts/bench.js --km 40\n' +
  '  --seed 17`, one run on a shared machine) placing a word takes 30 ms, a drag step 26–44 ms and a full revalidate\n' +
  '  0.17 s, all inside their budgets (100 ms, 50 ms, 1 s), against 1,000 ms, 1.3–3.7 s and 5.9 s before 0.2.0.\n' +
  '- Validation\'s red and amber list reads in plain words ("two roads are stacked less than 2 m apart here"); the rule\n' +
  '  and its source are in the tooltip.\n' +
  '- The starter phrases are ordered sakura flow, S, bowl hairpin, spiral climb, so clicking them in turn builds a track\n' +
  '  with no red (in the old order the spiral climb crossed the sakura flow\'s road).\n' +
  '- The 3D preview\'s cross lines fade with distance (from overhead they darkened the whole road), and the background is\n' +
  '  darker than the fog, so surfaces facing away from the sun no longer merge into it.\n' +
  '\n### Fixed\n');
// 3. Fixed: the soak's phrase crash and the mutation harness verdict
r('- The Install to AC tooltip read "content<tab>racks": a `\\t` had become a tab.\n',
  '- The Install to AC tooltip read "content<tab>racks": a `\\t` had become a tab.\n' +
  '- The soak no longer crashes on a track that contains a starter phrase (it sculpted a phrase as if it were a word).\n' +
  '- The geometry mutation harness judges each mutant by its named test run alone, from that test\'s own result, so a heavy\n' +
  '  test file failing under machine load can no longer hide a catch.\n');
fs.writeFileSync(f, t);
console.log('CHANGELOG: 3 edits written');
