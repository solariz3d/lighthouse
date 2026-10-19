'use strict';
// D412 part 2 (a) (O, 2026-10-19): one mutant of app/test/core-mutation.test.js, timed in its parts, measure only.
// Replays runMutant()'s steps (core-mutation.test.js:105-131 at b306309) with a timer on each: the copy, the patch, the inner
// run; counts what the inner run executes; and, as a preview of option 1 only, the same inner run narrowed by
// --test-name-pattern to the mutant's caughtBy. The harness itself is not changed or run.
//   cwd = the t180 worktree:  node <this> <out dir>
const fs = require('fs'), os = require('os'), path = require('path'), vm = require('vm'), { spawnSync } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const out = path.resolve(process.argv[2]);
const ROOT = process.cwd();
const HARNESS = path.join(ROOT, 'app', 'test', 'core-mutation.test.js');
const WAIT = 2 * 60 * 60 * 1000;

// the harness's own lists, read from its source, not retyped (the file is CRLF); parsed BEFORE the lock, so a parse failure holds no slot
const src = fs.readFileSync(HARNESS, 'utf8');
const TESTS = vm.runInNewContext(src.match(/const TESTS = (\[[^\]]*\]);/)[1]);
const end = src.search(/\];\r?\n\r?\nfunction runMutant/);
const MUTATIONS = vm.runInNewContext('(' + src.slice(src.indexOf('const MUTATIONS = [') + 'const MUTATIONS = '.length, end + 1) + ')');
const APP_DIRS = vm.runInNewContext(src.match(/for \(const d of (\[[^\]]*\])\) fs\.cpSync\(path\.join\(ROOT, 'app', d\)/)[1]);
if (!Array.isArray(MUTATIONS) || !MUTATIONS.length || !Array.isArray(TESTS) || !Array.isArray(APP_DIRS)) throw new Error('could not read the harness lists');
if (process.argv.includes('--parse-only')) { console.log(MUTATIONS.length, TESTS, APP_DIRS); process.exit(0); }

HR.hold({ cmd: 't180 O D412 part 2a one-mutant timing', maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 't180 O D412 part 2a one-mutant timing (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());

const pick = (re) => MUTATIONS.find((m) => re.test(m.id));
const cases = [
  { id: 'control', file: 'core/panel.js', from: null, to: null, caughtBy: null },
  pick(/^R1 /), pick(/^C\d+ /), pick(/^P1 /),
];
const sizeOf = (d) => { let n = 0, b = 0; for (const e of fs.readdirSync(d, { withFileTypes: true, recursive: true })) if (e.isFile()) { n++; b += fs.statSync(path.join(e.parentPath ?? e.path, e.name)).size; } return { files: n, bytes: b }; };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function inner(app, extra) {
  const t = process.hrtime.bigint();
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=spec', '--test-concurrency=4', ...extra, ...TESTS.map((x) => path.join(app, 'test', x))],
    { env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT')), encoding: 'utf8', timeout: 600000 });
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  const num = (k) => { const m = o.match(new RegExp(`ℹ ${k} (\\d+)`)); return m ? Number(m[1]) : null; };
  const failed = [...new Set(o.split('\n').filter((l) => /^✖ /.test(l) && !/^✖ failing tests:/.test(l)).map((l) => l.slice(2)))];
  return { ms, status: r.status, tests: num('tests'), pass: num('pass'), fail: num('fail'), skipped: num('skipped'), failed };
}

const rows = [];
console.log(`harness: ${MUTATIONS.length} mutations, TESTS ${JSON.stringify(TESTS)}, app dirs ${JSON.stringify(APP_DIRS)}`);
for (const m of cases) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180b-core-mut-o-')), app = path.join(dir, 'app');
  try {
    let t = process.hrtime.bigint();
    for (const d of APP_DIRS) fs.cpSync(path.join(ROOT, 'app', d), path.join(app, d), { recursive: true });
    fs.mkdirSync(path.join(app, 'test'));
    for (const x of TESTS) fs.copyFileSync(path.join(ROOT, 'app', 'test', x), path.join(app, 'test', x));
    fs.cpSync(path.join(ROOT, 'src'), path.join(dir, 'src'), { recursive: true });
    fs.cpSync(path.join(ROOT, 'tools'), path.join(dir, 'tools'), { recursive: true });
    const copyMs = Number(process.hrtime.bigint() - t) / 1e6;
    const size = sizeOf(dir);
    let applied = true, n = 1;
    if (m.from !== null) {
      const f = m.root === 'src' ? path.join(dir, 'src', m.file) : path.join(app, m.file), s = fs.readFileSync(f, 'utf8');
      n = s.split(m.from).length - 1; applied = n === 1;
      if (applied) fs.writeFileSync(f, s.replace(m.from, () => m.to));
    }
    const whole = inner(app, []);
    const caught = m.caughtBy ? whole.failed.some((l) => l.includes(m.caughtBy)) : null;
    const narrow = m.caughtBy ? inner(app, [`--test-name-pattern=${esc(m.caughtBy)}`]) : null;
    t = process.hrtime.bigint(); fs.rmSync(dir, { recursive: true, force: true }); const rmMs = Number(process.hrtime.bigint() - t) / 1e6;
    const row = { id: m.id, copy_ms: +copyMs.toFixed(0), copied_files: size.files, copied_mb: +(size.bytes / 1e6).toFixed(1), applied, n,
      inner_ms: +whole.ms.toFixed(0), inner_tests: whole.tests, inner_pass: whole.pass, inner_fail: whole.fail, inner_skipped: whole.skipped, caught,
      narrow_ms: narrow && +narrow.ms.toFixed(0), narrow_tests: narrow && narrow.tests, narrow_fail: narrow && narrow.fail,
      narrow_caught: narrow ? narrow.failed.some((l) => l.includes(m.caughtBy)) : null, rm_ms: +rmMs.toFixed(0) };
    rows.push(row); console.log(JSON.stringify(row));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
fs.writeFileSync(path.join(out, 'one-mutant.json'), JSON.stringify({ at: new Date().toISOString(), head: spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(), node: process.version, mutations: MUTATIONS.length, tests: TESTS, rows }, null, 1));
