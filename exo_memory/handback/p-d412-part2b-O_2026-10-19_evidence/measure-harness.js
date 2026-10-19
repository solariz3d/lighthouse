'use strict';
// D412 part 2 (b) pre-measure (O, 2026-10-19): one mutant of a mutation harness, timed whole and narrowed, using the harness's OWN
// runMutant. The harness source is loaded with node:test stubbed (its tests register, none run) and child_process.spawnSync wrapped
// (timed, its summary read). One injection: `...(globalThis.__EXTRA || [])` before the inner run's '--test-concurrency=' argument, so
// the same runMutant can run narrowed. The harness file on disk is not changed.
//   cwd = the t180 worktree:  node <this> <harness path> <mutant id regex> <out json>
const fs = require('fs'), path = require('path'), Module = require('module');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const [harnessArg, idRe, outFile] = process.argv.slice(2);
const harness = path.resolve(harnessArg);
const src = fs.readFileSync(harness, 'utf8');
const hits = src.split("'--test-concurrency=").length - 1;
if (hits !== 1) throw new Error(`expected one inner '--test-concurrency=' in ${harness}, found ${hits}`);
const body = src.replace("'--test-concurrency=", "...(globalThis.__EXTRA || []), '--test-concurrency=") + '\n;globalThis.__H = { runMutant, MUTATIONS };';

let last = null;
const cp = require('child_process');
const wrappedCp = { ...cp, spawnSync(cmd, args, opts) {
  const t = process.hrtime.bigint(), r = cp.spawnSync(cmd, args, opts), ms = Number(process.hrtime.bigint() - t) / 1e6;
  const o = String((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '');
  const num = (k) => { const m = o.match(new RegExp(`ℹ ${k} (\\d+)`)); return m ? Number(m[1]) : null; };
  if (Array.isArray(args) && args.includes('--test')) last = { ms, tests: num('tests'), suites: num('suites'), pass: num('pass'), fail: num('fail') };
  return r;
} };
const stub = Object.assign(() => {}, { describe() {}, it() {}, before() {}, after() {}, beforeEach() {}, afterEach() {}, test() {}, skip() {}, todo() {} });
const realRequire = Module.createRequire(harness);
const req = (id) => (id === 'node:test' || id === 'test') ? stub : (id === 'child_process' || id === 'node:child_process') ? wrappedCp : realRequire(id);
const mod = { exports: {} };
new Function('require', 'module', 'exports', '__dirname', '__filename', body)(req, mod, mod.exports, path.dirname(harness), harness);
const { runMutant, MUTATIONS } = globalThis.__H;
const m = MUTATIONS.find((x) => new RegExp(idRe).test(x.id));
if (!m) throw new Error(`no mutant matches ${idRe}`);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

HR.hold({ cmd: `t180 O D412 2b pre-measure ${path.basename(harness)}`, maxWaitMs: 2 * 60 * 60 * 1000 });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: `t180 O D412 2b pre-measure (second slot)`, env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: 2 * 60 * 60 * 1000 });
process.on('exit', () => h2.release());

function timed(label, mm, extra) {
  globalThis.__EXTRA = extra; last = null;
  const t = process.hrtime.bigint();
  let r, err = null; try { r = runMutant(mm); } catch (e) { err = String(e.message).slice(0, 300); }
  const total = Number(process.hrtime.bigint() - t) / 1e6;
  const row = { label, total_ms: +total.toFixed(0), inner_ms: last && +last.ms.toFixed(0), copy_and_rest_ms: last && +(total - last.ms).toFixed(0),
    tests: last && last.tests, suites: last && last.suites, fail: last && last.fail, applied: r && r.applied, caught: r && r.caught, error: err };
  console.log(JSON.stringify(row)); return row;
}
const control = { ...m, id: 'control', from: null, to: null, caughtBy: '(no test is named this)' };
const narrow = [`--test-name-pattern=${esc(m.caughtBy)}`];
const rows = [
  timed('control whole', control, []),
  timed(`mutant whole: ${m.id}`, m, []),
  timed(`mutant narrowed: ${m.id}`, m, narrow),
  timed('control narrowed to the mutant\'s caughtBy', { ...control, caughtBy: m.caughtBy }, narrow),
];
fs.writeFileSync(outFile, JSON.stringify({ at: new Date().toISOString(), harness: path.relative(process.cwd(), harness), mutations: MUTATIONS.length, mutant: m.id, caughtBy: m.caughtBy, tests: m.tests || null, rows }, null, 1));
