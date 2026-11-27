// sfrun.js (pane B, L266, timing 2): sculpt-frame.test.js, whole file, at f3cd425 and c66b503 alternately, f3cd425 first, N runs each. Its rows 1-4 time only while
// BOTH heavy-run slots are held by a live process and one is this run's (the row's own bothSlots()), so this runs in one slot while idle.js holds the other.
// Before every run: wait while his game runs; then the other slot must be MY idle holder (its cmd says "held IDLE on purpose"), waited for up to 30 min, or the
// session stops there and says so; a snapshot (quiet.js); then the file, CONSONANCE_DATA naming the lock folder. A run whose timed rows were skipped stops the session
// (a timing that did not time is not a sample). Writes <out>/sf.done at the end, however it ends, so the idle holder lets go.
// usage: node sfrun.js <tree f3cd425> <tree c66b503> <out dir> <N>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const Q = require('./quiet.js');
const [aDir, bDir, out, nArg] = process.argv.slice(2), N = Number(nArg);
const FILE = 'app/test/sculpt-frame.test.js', jl = path.join(out, 'sf.jsonl'), done = path.join(out, 'sf.done');
const log = (s) => { const l = `${new Date().toISOString()} ${s}`; console.log(l); fs.appendFileSync(path.join(out, 'sf.log'), l + '\n'); };
const sha = (d) => spawnSync('git', ['-C', d, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
function otherIsMyIdle() {
  const L = Q.locks(), slots = [L['heavy-run.lock'], L['heavy-run.2.lock']];
  const mine = slots.filter((s) => s && s.mine && s.alive).length, idle = slots.filter((s) => s && !s.mine && s.alive && /held IDLE on purpose/.test(s.cmd || '')).length;
  return { ok: mine === 1 && idle === 1 && !L['heavy-run.3.lock'], L };
}
try {
  const trees = [[sha(aDir), aDir], [sha(bDir), bDir]];
  log(`start: ${trees.map(([s]) => s).join(' / ')}, ${N} runs each, alternated; my token ${process.env.CONSONANCE_HEAVY_RUN_TOKEN ? 'set' : 'NOT SET'}; CONSONANCE_DATA ${process.env.CONSONANCE_DATA}`);
  outer: for (let k = 1; k <= N; k++) for (const [label, dir] of trees) {
    const waited = Q.waitGame(log);
    let o = otherIsMyIdle(); const w0 = Date.now();
    while (!o.ok && Date.now() - w0 < 30 * 60000) { Q.sleepSync(5000); o = otherIsMyIdle(); }
    if (!o.ok) { log(`STOPPED before ${k} ${label}: the other slot is not my idle holder: ${JSON.stringify(o.L)}`); break outer; }
    const snap = Q.snapshot();
    const tap = path.join(out, `sf-${String(k).padStart(2, '0')}-${label}.tap`), fd = fs.openSync(tap, 'w'), t0 = Date.now();
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=tap', FILE], { cwd: dir, stdio: ['ignore', fd, fd], env: { ...process.env, CONSONANCE_DATA: Q.DATA } });
    fs.closeSync(fd);
    const text = fs.readFileSync(tap, 'utf8');
    const rows = [...text.matchAll(/^(not ok|ok) \d+ - (row \w+)[^\n]*/gm)].map((m) => ({ row: m[2], ok: m[1] === 'ok', skip: /# SKIP/.test(m[0]) }));
    const row = { timing: 'sculpt-frame', k, sha: label, start: new Date(t0).toISOString(), seconds: +((Date.now() - t0) / 1000).toFixed(1), exit: r.status, rows, waitedGameS: waited, snap };
    fs.appendFileSync(jl, JSON.stringify(row) + '\n');
    log(`${k} ${label}: ${rows.map((x) => `${x.row} ${x.skip ? 'SKIP' : x.ok ? 'ok' : 'FAIL'}`).join(', ')}; ${row.seconds} s; busy ${snap.busyPct}%`);
    if (rows.some((x) => x.skip && x.row !== 'row 5')) { log(`STOPPED: the timed rows were skipped at ${k} ${label} (see its TAP for the reason)`); break outer; }
  }
  log('done');
} finally { fs.writeFileSync(done, new Date().toISOString() + '\n'); }
