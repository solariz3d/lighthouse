// d642run.js (pane B, L266, timing 1): core-extra-bank-drag-cost.test.js (D642), whole file, one fresh process a run (its row 1 times the FIRST drag in the process),
// at 7b3926e and e7b9128 alternately, 7b3926e first, N runs each. Every run: wait while his game runs, a snapshot of the machine (quiet.js), the TAP kept, and one JSON
// line with row 1's own diagnostic (rolling p95, early p95, the ratio) and its verdict against the row's 2x bar. Run by heavy-run --run --exclusive.
// usage: node d642run.js <tree 7b3926e> <tree e7b9128> <out dir> <N>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const Q = require('./quiet.js');
const [aDir, bDir, out, nArg] = process.argv.slice(2), N = Number(nArg);
const FILE = 'app/test/core-extra-bank-drag-cost.test.js', jl = path.join(out, 'd642.jsonl');
const log = (s) => { const l = `${new Date().toISOString()} ${s}`; console.log(l); fs.appendFileSync(path.join(out, 'd642.log'), l + '\n'); };
const sha = (d) => spawnSync('git', ['-C', d, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
const trees = [[sha(aDir), aDir], [sha(bDir), bDir]];
log(`start: ${trees.map(([s]) => s).join(' / ')}, ${N} runs each, alternated; my token ${process.env.CONSONANCE_HEAVY_RUN_TOKEN ? 'set' : 'NOT SET'}`);
for (let k = 1; k <= N; k++) for (const [label, dir] of trees) {
  const waited = Q.waitGame(log), snap = Q.snapshot();
  const tap = path.join(out, `d642-${String(k).padStart(2, '0')}-${label}.tap`), fd = fs.openSync(tap, 'w'), t0 = Date.now();
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=tap', FILE], { cwd: dir, stdio: ['ignore', fd, fd] });
  fs.closeSync(fd);
  const text = fs.readFileSync(tap, 'utf8'), m = text.match(/rolling \(first drag\) p95 ([\d.]+) ms a move, early p95 ([\d.]+) ms: ([\d.]+) ×/);
  const line = (text.match(/^(not ok|ok) 1 - D642: dragging the extra bank back toward level[^\n]*/m) || [null])[0];
  const row = { timing: 'D642 row 1', k, sha: label, start: new Date(t0).toISOString(), seconds: +((Date.now() - t0) / 1000).toFixed(1), exit: r.status, rolling: m ? +m[1] : null, early: m ? +m[2] : null, ratio: m ? +m[3] : null, bar: 2, verdict: line ? (line.startsWith('ok') ? (/# TODO/.test(line) ? 'todo' : 'pass') : (/# TODO/.test(line) ? 'todo' : 'fail')) : 'no row 1', waitedGameS: waited, snap };
  fs.appendFileSync(jl, JSON.stringify(row) + '\n');
  log(`${k} ${label}: ratio ${row.ratio} (rolling ${row.rolling}, early ${row.early}) ${row.verdict}; busy ${snap.busyPct}%`);
}
log('done');
