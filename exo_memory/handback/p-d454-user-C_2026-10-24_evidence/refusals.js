// refusals.js: lines ADDED since caa62c1a, in the dev sources of shipped code files, that look like a refusal message a person or seat sees.
'use strict';
const os = require('os'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const repo = process.argv[2];
const G = require(repo + '/consonance/tools/gen-consumer.js');
const shipped = G.collect().filter((f) => !f.missing && !G.EXCLUDE[f.from] && /\.(js|rs|ps1|ts)$/.test(f.from) && !/\.test\.|mutants|[\\/]tests?[\\/]/.test(f.from));
const RE = /refus|REFUSED|denied|\bdeny\b|blocked|BLOCK|permissionDecision|decision:\s*['"]block|not delivered|gate[:\]]/;
let n = 0;
for (const f of shipped) {
  const r = spawnSync('git', ['-C', repo, 'diff', '-U0', 'caa62c1a', 'HEAD', '--', f.from], { encoding: 'utf8', maxBuffer: 1 << 28 });
  let ln = 0;
  for (const l of r.stdout.split('\n')) {
    const h = l.match(/^@@ -\S+ \+(\d+)/); if (h) { ln = +h[1]; continue; }
    if (l.startsWith('+++')) continue;
    if (l.startsWith('+')) { if (RE.test(l) && /['"`]/.test(l) && !/^\+\s*(\/\/|\/\*|\*|#|\/\/\/)/.test(l)) { n++; console.log(`${f.from}:${ln} ${l.slice(1).trim().slice(0, 260)}`); } ln++; }
  }
}
console.log('candidates', n, 'shipped code files', shipped.length);
