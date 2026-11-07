// row5.js: test/export_finalscene.test.js row 5 builds its hand-made defects on the full skin, one node per cell (run from the worktree root); CRLF kept
'use strict';
const fs = require('fs'), F = 'test/export_finalscene.test.js';
let s = fs.readFileSync(F, 'utf8').replace(/\r\n/g, '\n');
const ed = (a, b) => { const k = s.split(a).length - 1; if (k !== 1) throw new Error(`${k} of ${JSON.stringify(a.slice(0, 70))}`); s = s.replace(a, () => b); };
ed(`const pitLap = () => memo.pit || (memo.pit = (() => {
  const doc = lap('scene pit lap'), lane = { side: 'L', leave: { word: doc.pieces[0].id, along: 40 }, rejoin: { word: doc.pieces[0].id, along: 360 }, offsetM: 12, width: 8, divergeM: 80, mergeM: 80, speedKmh: 80 };
  return exportDoc(doc, {}, { pitLane: lane });
})());
`, `// AMENDED BY NAME (2026-11-02, the light hull, src/export/lighthull.js): \`full\` builds the same lap with the full skin, one node per 2 m cell (lightHull: false), which
// row 5's hand-made defects are cut from: "this cell's skin" sunk, "this cell and the one before" pressed. With the light hull a cell's node is a piece of up to 100 m.
const pitLap = (full = false) => memo[full ? 'pitFull' : 'pit'] || (memo[full ? 'pitFull' : 'pit'] = (() => {
  const doc = lap('scene pit lap'), lane = { side: 'L', leave: { word: doc.pieces[0].id, along: 40 }, rejoin: { word: doc.pieces[0].id, along: 360 }, offsetM: 12, width: 8, divergeM: 80, mergeM: 80, speedKmh: 80 };
  return exportDoc(doc, full ? { lightHull: false } : {}, { pitLane: lane });
})());
`);
ed(`function cleanScene() { const b = pitLap(); return`, `function cleanScene(full = false) { const b = pitLap(full); return`);
ed(`a wide lane end refuses', () => {
  const { b, scene } = cleanScene(), opt = { path: b.path, segments: b.segments, lane: b.pitLane, open: false };
  const road = meshNamed(scene, /^1ROAD_p\\d+_body_0_40$/)`, `a wide lane end refuses', () => {
  // AMENDED BY NAME (the light hull): the defects are cut from the full skin, a node per cell (see pitLap); rows 1 and 7 read the light one clean
  const { b, scene } = cleanScene(true), opt = { path: b.path, segments: b.segments, lane: b.pitLane, open: false };
  const road = meshNamed(scene, /^1ROAD_p\\d+_body_0_40$/)`);
fs.writeFileSync(F, s.replace(/\n/g, '\r\n'));
console.log('row 5 amended');
