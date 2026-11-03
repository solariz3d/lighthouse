// bullets.js <worktree> <rev> [<rev>...]: every "- " bullet line of CHANGELOG.md at each rev is present verbatim in the worktree's CHANGELOG.md. Counts.
'use strict';
const { execFileSync } = require('child_process'), fs = require('fs');
const W = process.argv[2], now = fs.readFileSync(W + '/CHANGELOG.md', 'utf8').split(/\r?\n/);
const have = new Set(now); let bad = 0;
for (const rev of process.argv.slice(3)) {
  const lines = execFileSync('git', ['-C', W, 'show', rev + ':CHANGELOG.md'], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 26 }).split(/\r?\n/).filter((l) => /^\s*- /.test(l));
  const miss = lines.filter((l) => !have.has(l)); bad += miss.length;
  console.log(`${rev}: ${lines.length} bullet lines, missing ${miss.length}${miss.length ? ': ' + miss.map((l) => l.slice(0, 50)).join(' | ') : ''}`);
}
console.log(`merged file: ${now.filter((l) => /^\s*- /.test(l)).length} bullet lines; missing in all ${bad}`); process.exit(bad ? 1 : 0);
