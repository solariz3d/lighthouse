// mutgi.js (D454, B): break the consumer .gitignore one way at a time; the E §7 row must go red. Restores gen-consumer.js byte for byte.
'use strict';
const fs = require('fs'), crypto = require('crypto'), { spawnSync } = require('child_process');
const F = 'consonance/tools/gen-consumer.js', orig = fs.readFileSync(F), src = orig.toString('utf8'), sha = (b) => crypto.createHash('sha256').update(b).digest('hex'), H0 = sha(orig);
const M = [
  ['G1 the .gitignore is not generated', (s) => s.replace("    '.gitignore': CONSUMER_GITIGNORE,\n", '')],
  ['G2 the target/ rule dropped', (s) => s.replace("  'consonance/src-tauri/target/',\n", '')],
  ['G3 a rule that ignores shipped files (*.md)', (s) => s.replace("  'consonance/src-tauri/gen/',\n", "  'consonance/src-tauri/gen/',\n  '*.md',\n")],
];
let a = 0, c = 0, na = 0;
try {
  for (const [name, f] of M) {
    const m = f(src); if (m === src) { na++; console.log('NOT APPLIED  ' + name); continue; }
    a++; fs.writeFileSync(F, m);
    const r = spawnSync(process.execPath, ['--test', '--test-name-pattern=E §7', 'consonance/tools/gen-consumer.test.js'], { encoding: 'utf8', maxBuffer: 1 << 26 });
    if (r.status !== 0) c++; console.log((r.status !== 0 ? 'caught       ' : 'NOT CAUGHT   ') + name);
    fs.writeFileSync(F, orig);
  }
} finally { fs.writeFileSync(F, orig); }
console.log(`applied ${a} / caught ${c} / NOT APPLIED ${na}; restored sha256 ${sha(fs.readFileSync(F)) === H0 ? 'equal' : 'DIFFERS'}`);
