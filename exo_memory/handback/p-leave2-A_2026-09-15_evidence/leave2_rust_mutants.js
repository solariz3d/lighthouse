// P-LEAVE-2 — Rust mutants on a SCRATCH COPY of the crate (src-tauri without target, plus ui), built into a scratch
// target dir. The tracked tree is only read; every file under src-tauri/src is hashed before and after.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const REPO = 'C:/Users/nname/Desktop/lighthouse';
const HERE = __dirname;
const COPY = path.join(HERE, 'leave2_crate');
const TARGET = path.join(HERE, 'leave2_target');
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const SRC = path.join(REPO, 'consonance/src-tauri/src');
const hashes = () => Object.fromEntries(fs.readdirSync(SRC).filter((f) => fs.statSync(path.join(SRC, f)).isFile()).map((f) => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(SRC, f))).digest('hex')]));
const before = hashes();

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
if (!only) {
  fs.rmSync(COPY, { recursive: true, force: true });
  fs.cpSync(path.join(REPO, 'consonance/src-tauri'), path.join(COPY, 'consonance/src-tauri'), { recursive: true, filter: (s) => !/[\\/]src-tauri[\\/]target([\\/]|$)/.test(s) });
  fs.cpSync(path.join(REPO, 'consonance/ui'), path.join(COPY, 'consonance/ui'), { recursive: true });
  // tauri.conf.json bundles these; the build script fails without them (the first run's pre-flight refused to score).
  fs.mkdirSync(path.join(COPY, 'exo_memory'), { recursive: true });
  for (const f of ['consonance/README.md', 'consonance/GUIDE.md', 'exo_memory/SOURCE.md']) fs.copyFileSync(path.join(REPO, f), path.join(COPY, f));
  for (const d of ['cards', 'spread', 'research', 'record']) fs.cpSync(path.join(REPO, 'exo_memory', d), path.join(COPY, 'exo_memory', d), { recursive: true });
}
const PKG = path.join(COPY, 'consonance/src-tauri');

const run = () => {
  const out = spawnSync(CARGO, ['test', '--bin', 'consonance', '--', '--test-threads=1'], {
    cwd: PKG, encoding: 'utf8', env: { ...process.env, CARGO_TARGET_DIR: TARGET }, maxBuffer: 256 * 1024 * 1024, timeout: 3600 * 1000,
  });
  const text = (out.stdout || '') + (out.stderr || '');
  const m = text.match(/test result: \w+\. (\d+) passed; (\d+) failed/);
  const failed = text.split('\n').filter((l) => /^test .* \.\.\. FAILED/.test(l)).map((l) => l.replace(/^test /, '').replace(/ \.\.\. FAILED.*/, '').trim());
  return { compiled: !!m, passed: m ? +m[1] : -1, failed, err: m ? '' : (text.match(/^error.*$/m) || ['?'])[0] };
};

const MUTANTS = [
  ['R1 or_kill does not kill', 'sync_launch.rs', '        kill();\n', ''],
  ['R2 kill_replaced does not kill', 'sync_launch.rs', '        kill(&mut old);\n', ''],
  ['R3 waiter_args drops --app-started-at', 'sync_launch.rs', '        "--app-started-at".to_string(),\n        app_started_at.to_string(),\n', ''],
  ['R4 LEAVE_STARTED without appStartedAt', 'sync_launch.rs', '"image": APP_IMAGE, "appStartedAt": app_started_at, "at": started_at,', '"image": APP_IMAGE, "at": started_at,'],
  ['R5 LEAVE_RESULT without appStartedAt', 'sync_launch.rs', '            "appStartedAt": app_started_at,\n', ''],
  ['R6 main does not record the start time at launch', 'main.rs', '    let _ = app_started_at();\n', ''],
  ['R7 the waiter is told an empty start time', 'main.rs', 'std::process::id(), app_started_at()))', 'std::process::id(), ""))'],
  ['R8 the Leave writes an empty start time', 'main.rs', 'in_flight, find, app_started_at(), &now,', 'in_flight, find, "", &now,'],
  ['R9 a failed try_clone_reader leaves the child running', 'main.rs', 'try_clone_reader(), &mut || {\n        let _ = child.kill();\n', 'try_clone_reader(), &mut || {\n'],
  ['R10 a failed take_writer is a bare ? again', 'main.rs', 'let writer = sync_launch::or_kill(pair.master.take_writer(), &mut || {\n        let _ = child.kill();\n    })?;', 'let writer = pair.master.take_writer().map_err(|e| e.to_string())?;'],
  ['R11 insert_pane drops the replaced session unkilled', 'main.rs', '        let _ = old.killer.kill();\n', ''],
  ['SURVIVE-CONTROL reword a comment', 'main.rs', 'live claude.exe outside Panes and outside the count the close waits on.', 'live claude.exe outside Panes, outside the count the close waits on.'],
  ['SKIP-CONTROL an anchor that does not exist', 'main.rs', 'this anchor is not in main.rs', ''],
];

const log = (s) => { console.log(s); fs.appendFileSync(path.join(HERE, 'leave2_rust_mutants.out.txt'), s + '\n'); };
if (!only) fs.writeFileSync(path.join(HERE, 'leave2_rust_mutants.out.txt'), ''); else log('--- --only ' + only);

const base = run();
log(`BASELINE (unmutated copy): compiled=${base.compiled} passed=${base.passed} failed=${base.failed.length} [${base.failed.join(', ')}]`);
if (!base.compiled) { log('baseline did not compile — refusing to score ' + base.err); process.exit(2); }

for (const [name, file, anchor, repl] of MUTANTS) {
  if (only && !name.startsWith(only + ' ')) continue;
  const p = path.join(PKG, 'src', file);
  const orig = fs.readFileSync(p, 'utf8');
  const n = orig.split(anchor).length - 1;
  if (n !== 1) { log(`  NOT APPLIED  ${name}  (anchor found ${n} times)`); continue; }
  fs.writeFileSync(p, orig.replace(anchor, () => repl));
  let r;
  try { r = run(); } finally { fs.writeFileSync(p, orig); }
  if (!r.compiled) { log(`  NO BUILD     ${name}  (${r.err})`); continue; }
  const extra = r.failed.filter((t) => !base.failed.includes(t));
  log(extra.length ? `  CAUGHT       ${name}  (${extra.join(' | ')})` : `  SURVIVED     ${name}  (${r.passed} passed)`);
}
const after = hashes();
log(`tracked src unchanged: ${Object.keys(before).every((f) => before[f] === after[f]) && Object.keys(after).length === Object.keys(before).length}`);
