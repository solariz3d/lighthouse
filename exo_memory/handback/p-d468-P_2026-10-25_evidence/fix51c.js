'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
{ const p = W + 'src/core/close.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n'; const L = s.split(EOL);
  const i = L.findIndex((l) => l.includes('converged = done(m) && ms.gapM < 1e-3;')), j = L.findIndex((l) => l.startsWith('  const cupNote = opts.cupRowLeftOut'));
  const k = L[j].indexOf('   // '); if (k < 0) throw new Error('no trailing comment on the cupNote line');
  const com = L[j].slice(k).trim(); L[j] = L[j].slice(0, k); L.splice(i, 0, '  // converged: ' + com.slice(3)); fs.writeFileSync(p, L.join(EOL)); console.log('close.js: the closeTol comment moved from the cupNote line to above the converged statement'); }
{ const p = W + 'test/core_close_banks_lap.test.js'; let s = fs.readFileSync(p, 'utf8'); const b = String.fromCharCode(92);
  const o = `about ${b}${b}d+% past its smoothness limit at one point ${b}${b}(p${b}${b}d+${b}${b})/`, n = `about ${b}d+% past its smoothness limit at one point ${b}(p${b}d+${b})/`;
  if (s.split(o).length === 2) { s = s.replace(o, n); fs.writeFileSync(p, s); console.log('row 20: regex escapes fixed'); } else console.log('row 20: regex as expected (' + s.split(n).length + ')'); }
