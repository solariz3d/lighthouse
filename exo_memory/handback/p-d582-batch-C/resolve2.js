// resolve2.js <worktree> [lapPin openPin]: D582, the d572-e merge: export-isolated.test.js's pin conflict. With no pins: the HEAD side is kept so row 1
// can print the merged tree's pair. With pins: one amended-by-name comment for both causes (the firm road's ini line and the edge apron) and the new PIN.
'use strict';
const fs = require('fs'), path = require('path');
const [, , wt, lap, open] = process.argv;
const p = path.join(wt, 'app/test/export-isolated.test.js'), s = fs.readFileSync(p, 'utf8'), EOL = s.includes('\r\n') ? '\r\n' : '\n';
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
let n = 0;
const out = s.replace(re, (m, ours) => {
  n++;
  if (!lap) return ours;
  return [
    '// AMENDED BY NAME (2026-10-31, the merge of the firm road and the edge apron): both pins moved from ab7ea68c80621a84 / b59349993f6e9440 (the firm',
    '// road alone) and from ace32da6e9890964 / bfb1bda31e289ce1 (the apron alone) to the values below, because the merged exporter writes both: data/surfaces.ini\'s',
    '// soft block with SOFT_CFM=0.00005 (src/export/trackfiles.js) and an edge apron outside the road\'s open edges (src/export/apron.js). Each alone was proven the',
    '// only cause of its own move against 9f3a7040bf4356e9 / a257c20e84e68897; the pair below was read with PRINT_D437B=1 on the merged tree.',
    `const PIN = { lap: 'sha256 ${lap} files 10', open: 'sha256 ${open} files 11' };`,
    '',
  ].join(EOL);
});
if (n !== 1) throw new Error('blocks ' + n);
fs.writeFileSync(p, out); console.log(lap ? 'pins written' : 'HEAD side kept for the print');
