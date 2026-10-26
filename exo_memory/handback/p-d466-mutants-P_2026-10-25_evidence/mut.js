// mut.js: copy a worktree's src, tools, app and one test file into a fresh dir, apply one mutant edit (exactly-once check), run the test file with a name pattern at BelowNormal; TAP to <out>.tap
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const [wt, testFile, pattern, out, editFile, oldS, newS] = process.argv.slice(2);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180-p466-'));
for (const d of ['src', 'tools', 'app']) fs.cpSync(path.join(wt, d), path.join(dir, d), { recursive: true, filter: (s) => !/[\/]node_modules[\/]|[\/]target[\/]/.test(s) });
fs.mkdirSync(path.join(dir, 'test')); fs.copyFileSync(path.join(wt, 'test', testFile), path.join(dir, 'test', testFile));
for (const f of ['inner_run.js']) if (fs.existsSync(path.join(wt, 'test', f))) fs.copyFileSync(path.join(wt, 'test', f), path.join(dir, 'test', f));
if (editFile) {
  const p = path.join(dir, 'src', editFile), s = fs.readFileSync(p, 'utf8'), n = s.split(oldS).length - 1;
  if (n !== 1) { console.log(`NOT APPLIED: ${n} occurrences of the old string in ${editFile}`); process.exit(2); }
  fs.writeFileSync(p, s.replace(oldS, newS)); console.log(`applied to ${editFile}`);
}
const args = ['--max-old-space-size=4096', '--test', '--test-concurrency=1', ...(pattern ? ['--test-name-pattern', pattern] : []), '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${out}.tap`, path.join(dir, 'test', testFile)];
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT'));
const t0 = Date.now(), r = spawnSync(process.execPath, args, { cwd: dir, env, encoding: 'utf8', timeout: 20 * 60 * 1000 });
const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
fs.writeFileSync(`${out}.spec.txt`, o);
console.log(o.split('\n').filter((l) => /ℹ (tests|pass|fail)|✖|AssertionError|not ok/.test(l)).slice(0, 40).join('\n'), `\n${((Date.now() - t0) / 1000).toFixed(1)} s; dir ${dir}`);
fs.rmSync(dir, { recursive: true, force: true });
