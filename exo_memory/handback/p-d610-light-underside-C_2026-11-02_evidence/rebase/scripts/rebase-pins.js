// rebase-pins.js: the light hull's pin amendments onto 6f0969e's export-isolated tests (run from the worktree root); each replacement exactly once, CRLF kept.
'use strict';
const fs = require('fs');
const ed = (f, a, b) => {
  let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
  const k = s.split(a).length - 1; if (k !== 1) throw new Error(`${f}: ${k} of ${JSON.stringify(a.slice(0, 80))}`);
  s = s.replace(a, () => b); fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s);
};
ed('app/test/export-isolated.test.js', `const PIN = { lap: 'sha256 d89c835f5f103a8c files 10', open: 'sha256 4e1404430764e540 files 11' };\n`,
`// AMENDED BY NAME (2026-11-02, the light hull: the user, 07:01, "does the new apron and undertrack make more geometry to lag assetto?"): both pins moved, the lap
// from d89c835f5f103a8c and the open TEST export from 4e1404430764e540 (6f0969e). The hull's bottom is redrawn with fewer triangles (src/export/lighthull.js),
// each kept vertex the full skin's own. Compared with 6f0969e node by node (test/fixtures/kn5nodes.js): every physics node, the paint, the planks, the lane and the
// outline are the same bytes and every material record is; only drawn skins moved (the lap: UNDERSKIN_p1_chunk_0, _p1_chunk_1, _p3_chunk_2, and the chunk
// that started at p5 now starts at p4, UNDERSKIN_p4_chunk_3 for UNDERSKIN_p5_chunk_3; the open: UNDERSKIN_p1_chunk_0, _p2_chunk_1, _p3_chunk_2); of each export's
// files only the kn5 changed, and the counts are the same.
const PIN = { lap: 'sha256 a5eef6d390282bc0 files 10', open: 'sha256 8c49973d829104e6 files 11' };
`);
ed('app/test/export-isolated-page.test.js', `const PIN = { lap: 'sha256 d89c835f5f103a8c files 10', open: 'sha256 4e1404430764e540 files 11' };`,
`// AMENDED BY NAME (2026-11-02, the light hull): both pins moved with export-isolated.test.js row 1's (lap d89c835f5f103a8c to a5eef6d390282bc0, open
// 4e1404430764e540 to 8c49973d829104e6), which says why
const PIN = { lap: 'sha256 a5eef6d390282bc0 files 10', open: 'sha256 8c49973d829104e6 files 11' };`);
console.log('pins amended');
