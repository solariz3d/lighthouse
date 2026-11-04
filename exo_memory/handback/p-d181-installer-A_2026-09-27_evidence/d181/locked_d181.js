// D181 A, one lock hold: (1) cargo test --lib, (2) the plain_path mutants IN PLACE on ac.rs (restored in a finally, sha
// checked), (3) the release build via src-tauri/release.cjs. Every step writes a line to progress.log as it starts and
// ends, so a stall is visible on disk (D160: a job that prints nothing is not running until something on disk says so).
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const HERE = __dirname, P = path.join(HERE, 'progress.log');
const say = (s) => { fs.appendFileSync(P, `${new Date().toISOString()} ${s}\n`); console.log(s); };
say('asking for the lock');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 D181 A: cargo test --lib + 2 ac.rs mutants (in place, restored) + release build, -j 4' });
say('lock held');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder', F = path.join(REPO, 'src-tauri/src/ac.rs');
const cargo = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const TEST_TARGET = path.join(HERE, '..', 'd165', 't180_target'), REL_TARGET = path.join(HERE, '..', 'd178', 'target');
const run = (label, exe, args, env, mins) => {
  say(`${label}: start`);
  const r = spawnSync(exe, args, { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, ...env }, timeout: mins * 60000, windowsHide: true });
  const out = (r.stdout || '') + (r.stderr || '');
  fs.writeFileSync(path.join(HERE, `${label}.txt`), out);
  const res = [...out.matchAll(/test result: (ok|FAILED)\. (\d+) passed; (\d+) failed; (\d+) ignored/g)].map((m) => m.slice(1).join(' '));
  say(`${label}: exit ${r.status}${r.error ? ' ' + r.error.code : ''} ${res.join(' | ')}`);
  return { status: r.status, out };
};
const t1 = run('cargo-test-lib', cargo, ['test', '-j', '4', '--manifest-path', 'src-tauri/Cargo.toml', '--target-dir', TEST_TARGET, '--lib'], {}, 30);
if (t1.status !== 0) { say('STOP: cargo test --lib did not pass; no mutants, no release'); process.exit(1); }
const M = [
  ['P1 plain_path keeps the verbatim prefix', 'let s = p.to_string_lossy().into_owned();', 'let s = String::new();'],
  ['P2 remember_ac_root skips plain_path', 'let abs = plain_path(fs::canonicalize(root)', 'let abs = (fs::canonicalize(root)'],
];
const orig = fs.readFileSync(F), sha = (b) => crypto.createHash('sha256').update(b).digest('hex'), before = sha(orig);
try {
  for (const [name, from, to] of M) {
    const src = orig.toString('utf8');
    if (src.split(from).length !== 2) { say(`NOT APPLIED ${name}`); continue; }
    fs.writeFileSync(F, src.replace(from, () => to));
    const r = run(`mutant-${name.slice(0, 2)}`, cargo, ['test', '-j', '4', '--manifest-path', 'src-tauri/Cargo.toml', '--target-dir', TEST_TARGET, '--lib', 'ac::'], {}, 20);
    fs.writeFileSync(F, orig);
    say(`${r.status === 0 ? 'SURVIVED' : /test result: FAILED/.test(r.out) ? 'caught' : 'NO RESULT (did not compile or run)'} ${name}`);
  }
} finally { fs.writeFileSync(F, orig); say(`ac.rs restored: sha256 ${sha(fs.readFileSync(F)) === before ? 'equal' : 'DIFFERENT'} (${before.slice(0, 8)})`); }
const rel = run('release', process.execPath, ['src-tauri/release.cjs'], { CARGO_TARGET_DIR: REL_TARGET, CARGO_BUILD_JOBS: '4' }, 40);
say(`done, release exit ${rel.status}`);
