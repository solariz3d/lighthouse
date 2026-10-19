'use strict';
// D412 part 1 (O, 2026-10-19): one full T-180 suite under the heavy-run lock, holding BOTH slots (this tree + the non-git
// bucket, as A's D407 timing does), with TAP to a file and machine-wide busy cores sampled every second from os.cpus().
// Run with cwd = the worktree:  node <this> <evidence dir>
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const out = path.resolve(process.argv[2] || '.');
const WAIT = 3 * 60 * 60 * 1000;

const h1 = HR.hold({ cmd: 't180 O D412 part 1 full suite', maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
let h2;
try { h2 = HR.acquire({ cmd: 't180 O D412 part 1 full suite (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT }); }
catch (e) { process.stderr.write(e.message + '\n'); process.exit(3); }
process.on('exit', () => h2.release());
process.stderr.write(`held slots ${h1.slot} and ${h2.slot}\n`);

const snap = () => os.cpus().map((c) => { const t = c.times; return { idle: t.idle, total: t.user + t.nice + t.sys + t.idle + t.irq }; });
let prev = snap();
const t0 = Date.now();
const cpu = fs.createWriteStream(path.join(out, 'cpu.csv'));
cpu.write('t_s,busy_cores\n');
const samples = [];
const timer = setInterval(() => {
  const cur = snap();
  let busy = 0;
  cur.forEach((c, i) => { const dt = c.total - prev[i].total; if (dt > 0) busy += 1 - (c.idle - prev[i].idle) / dt; });
  prev = cur;
  samples.push(busy);
  cpu.write(`${((Date.now() - t0) / 1000).toFixed(1)},${busy.toFixed(3)}\n`);
}, 1000);

const tap = path.join(out, 'suite.tap');
const args = ['--test', '--test-concurrency=4', '--test-reporter=spec', '--test-reporter-destination=stdout',
  '--test-reporter=tap', `--test-reporter-destination=${tap}`,
  // node 24's TAP has no file path; this third reporter records the per-file events (see file-events-reporter.mjs)
  `--test-reporter=${require('url').pathToFileURL(path.join(__dirname, 'file-events-reporter.mjs')).href}`, `--test-reporter-destination=${path.join(out, 'events.jsonl')}`,
  'test/*.test.js', 'app/test/*.test.js'];
const spec = fs.createWriteStream(path.join(out, 'suite.spec.txt'));
const started = new Date().toISOString();
const ch = spawn(process.execPath, args, { cwd: process.cwd(), env: process.env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
ch.stdout.pipe(spec); ch.stderr.pipe(spec);
ch.on('exit', (code, signal) => {
  clearInterval(timer);
  const wall = Date.now() - t0;
  const avg = samples.reduce((a, b) => a + b, 0) / (samples.length || 1);
  const sorted = [...samples].sort((a, b) => a - b);
  const pct = (p) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] : null;
  const summary = { started, ended: new Date().toISOString(), wall_ms: wall, exit_code: code, signal, node: process.version,
    logical_cpus: os.cpus().length, cpu_samples: samples.length, busy_cores_avg: +avg.toFixed(2), busy_cores_p50: pct(0.5), busy_cores_p95: pct(0.95), busy_cores_peak: sorted[sorted.length - 1] ?? null,
    head: require('child_process').execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(), args };
  fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(summary, null, 2));
  cpu.end(); spec.end();
  process.stderr.write(JSON.stringify(summary) + '\n');
  process.exitCode = code ?? 1;
});
