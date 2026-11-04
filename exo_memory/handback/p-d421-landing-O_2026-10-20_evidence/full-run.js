'use strict';
// D421 landing (O, local-0.4.11): one full T-180 suite with the plain package.json command (node --test --test-concurrency=4 "test/*.test.js"
// "app/test/*.test.js"), plus a TAP copy for the per-mutant comparison, under the heavy-run lock holding BOTH slots, machine-wide busy
// cores sampled each second. Run with cwd = the worktree:  node <this> <out prefix>   → <prefix>.spec.txt, .tap, .cpu.csv, .summary.json
const fs = require('fs'), os = require('os'), { spawn, execSync } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const out = process.argv[2];
const WAIT = 3 * 60 * 60 * 1000;
HR.hold({ cmd: 't180 O D421 landing: full suite local-0.4.11', maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 't180 O D421 landing: full suite (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());

const snap = () => os.cpus().map((c) => { const t = c.times; return { idle: t.idle, total: t.user + t.nice + t.sys + t.idle + t.irq }; });
let prev = snap();
const t0 = Date.now(), samples = [];
const cpu = fs.createWriteStream(`${out}.cpu.csv`); cpu.write('t_s,busy_cores\n');
const timer = setInterval(() => {
  const cur = snap(); let busy = 0;
  cur.forEach((c, i) => { const dt = c.total - prev[i].total; if (dt > 0) busy += 1 - (c.idle - prev[i].idle) / dt; });
  prev = cur; samples.push(busy); cpu.write(`${((Date.now() - t0) / 1000).toFixed(1)},${busy.toFixed(3)}\n`);
}, 1000);
const args = ['--test', '--test-concurrency=4', '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${out}.tap`, 'test/*.test.js', 'app/test/*.test.js'];
const spec = fs.createWriteStream(`${out}.spec.txt`);
const started = new Date().toISOString();
const ch = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
ch.stdout.pipe(spec); ch.stderr.pipe(spec);
ch.on('exit', (code, signal) => {
  clearInterval(timer);
  const sorted = [...samples].sort((a, b) => a - b), avg = samples.reduce((a, b) => a + b, 0) / (samples.length || 1);
  const summary = { started, ended: new Date().toISOString(), wall_s: +((Date.now() - t0) / 1000).toFixed(1), exit_code: code, signal, node: process.version,
    head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(), busy_cores_avg: +avg.toFixed(2), busy_cores_peak: sorted[sorted.length - 1] ?? null, args };
  fs.writeFileSync(`${out}.summary.json`, JSON.stringify(summary, null, 2));
  cpu.end(); spec.end();
  console.log(JSON.stringify(summary));
  process.exitCode = code ?? 1;
});
