// ctl_rowaa_runner.js (pane E, D678 N3): controls for runner678.js's four-tree rounds and its round check, through ctl_runner_case.js (the boundary stubbed).
// R1 my hold 1 min old, 4 trees, N 2: 8 runs, in the order a, b, c, d, a, b, c, d, then "done".
// R2 my hold aged so round 1 fits by about 6 s and round 2 misses by about 6 s (each fake run sleeps 3 s): round 1's 4 runs, then STOPPED before round 2, 1 kept.
// R3 someone else's hold: STOPPED before round 1, no run.    R4 no hold at all: STOPPED before round 1, no run.    R5 2 trees, my hold 1 min old, N 1: 2 runs.
// usage: node ctl_rowaa_runner.js <new scratch dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const W = path.resolve(process.argv[2]);
if (fs.existsSync(W)) throw new Error(`${W} exists; give a new scratch dir`);
const trees = ['a', 'b', 'c', 'd'].map((l) => { const d = path.join(W, 'trees', l); fs.mkdirSync(path.join(d, 'app', 'test'), { recursive: true });
  fs.writeFileSync(path.join(d, 'app', 'test', 'drag-frame.test.js'), "const test = require('node:test');\ntest('row 9 ratio fake', () => new Promise((r) => setTimeout(r, 3000)));\n"); return [l, d]; });
const hold = (name, rec) => { const d = path.join(W, 'data', name); fs.mkdirSync(d, { recursive: true }); if (rec) fs.writeFileSync(path.join(d, 'heavy-run.hold'), JSON.stringify(rec)); return d; };
const ago = (ms) => new Date(Date.now() - ms).toISOString();
const run = (name, data, n, ts) => { const out = path.join(W, name); const t = Date.now();
  const r = spawnSync(process.execPath, [path.join(__dirname, 'ctl_runner_case.js'), data, out, String(n), ...ts.map(([l, d]) => `${l}=${d}`)], { encoding: 'utf8' });
  const rows = fs.existsSync(path.join(out, 'df.jsonl')) ? fs.readFileSync(path.join(out, 'df.jsonl'), 'utf8').trim().split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)) : [];
  const logs = fs.readFileSync(path.join(out, 'df.log'), 'utf8').trim().split(/\r?\n/).map((l) => l.slice(25)).filter((l) => /^STOPPED|^done|failed/.test(l));
  console.log(`${name}: exit ${r.status}, ${((Date.now() - t) / 1000).toFixed(1)} s; runs ${rows.map((x) => `${x.k}${x.label}`).join(' ') || 'none'}; ${logs.join(' | ')}; done file ${fs.existsSync(path.join(out, 'done'))}`); };
const mine = (ms) => ({ seat: 'e', cmd: 'E D678 N3: control', started: ago(ms) });
run('R1', hold('r1', mine(60000)), 2, trees);
run('R2', hold('r2', mine(74 * 60000 - 6000)), 3, trees);
run('R3', hold('r3', { seat: 'a', cmd: 'A D678 item 3', started: ago(60000) }), 2, trees);
run('R4', hold('r4', null), 2, trees);
run('R5', hold('r5', mine(60000)), 1, trees.slice(0, 2));
