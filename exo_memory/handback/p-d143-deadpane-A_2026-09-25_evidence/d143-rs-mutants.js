// D137 Rust mutants, each on a COPY of consonance/src-tauri (shared target dir for speed), under the heavy-run lock.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
require(path.join(REPO, 'consonance/tools/heavy-run.js')).hold({ cmd: 'D143-A pane_exit mutants' });
const SRC = path.join(REPO, 'consonance/src-tauri');
const LIVE = path.join(SRC, 'src/main.rs');
const before = fs.readFileSync(LIVE, 'utf8');
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const PX = path.join(SRC, 'src/pane_exit.rs');
const beforePx = fs.readFileSync(PX, 'utf8');
const M = [
  // [name, file (relative to src-tauri), from, to]
  ['R1 the once is not kept (every exit reopens)', 'src/pane_exit.rs', 'if auto_reopened.insert(pane.to_string()) { ExitAction::ReopenOnce } else { ExitAction::ExitedAgain }', '{ auto_reopened.insert(pane.to_string()); ExitAction::ReopenOnce }'],
  ['R2 an intentional end counts as a crash', 'src/pane_exit.rs', '    if !still_ours {\n        return ExitAction::Intentional;\n    }\n', ''],
  ['R3 a committee pane is reopened like a seat', 'src/pane_exit.rs', '    if !fixed_seat {\n        return ExitAction::Prompt;\n    }\n', ''],
  ['R4 liveness ignores the pid (a reopened seat reads dead)', 'src/pane_exit.rs', 'Some(e) if current_pid.is_some() && e.pid == current_pid =>', 'Some(e) =>'],
  ['R5 liveness always awake', 'src/pane_exit.rs', '        Some(e) if current_pid.is_some() && e.pid == current_pid => Liveness::Exited { code: e.code, at_ms: e.at_ms },\n', ''],
  ['R6 on_pane_exit ignores whose child it was', 'src/main.rs', '.get(pane).is_some_and(|s| s.pid == pid)', '.get(pane).is_some()'],
  ['R7 on_pane_exit reopens without the ReopenOnce guard', 'src/main.rs', '    if action != pane_exit::ExitAction::ReopenOnce {\n        return;\n    }\n    let Some(cwd) = cwd', '    let Some(cwd) = cwd'],
  ['R8 keep-warm pings an exited child', 'src/main.rs', '            _ if exited => {\n                if let Ok(mut m) = app.state::<KeepWarmLastSkip>().0.lock() { m.insert(pane.clone(), KEEP_WARM_EXITED); }\n            }\n', ''],
  ['R9 the keep-warm row ignores the exit', 'src/main.rs', '    if exited {\n        return keep_warm_missed_row(short, role, since_start, Some(KEEP_WARM_EXITED));\n    }\n', ''],
  ['R10 the waiter never reports the exit', 'src/main.rs', '        on_pane_exit(&app, &pane_id, pid, code);\n', ''],
  ['R11 the second exit says it is reopening', 'src/pane_exit.rs', 'after its one automatic reopen; not reopened automatically a second time', 'after its one automatic reopen; reopening it once more'],
  ['R12 a Leave does not stop the reopen', 'src/main.rs', '        && LEAVE_PHASE.load(Ordering::SeqCst) == LEAVE_IDLE\n', ''],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { if (e.name === 'target') continue; const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to] of M) {
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd143m-'));
  const root = path.join(top, 'consonance/src-tauri');
  copyDir(SRC, root);
  copyDir(path.join(REPO, 'consonance/ui'), path.join(top, 'consonance/ui'));
  for (const f of ['README.md', 'GUIDE.md']) fs.copyFileSync(path.join(REPO, 'consonance', f), path.join(top, 'consonance', f));
  for (const d of ['cards', 'spread', 'research', 'record']) copyDir(path.join(REPO, 'exo_memory', d), path.join(top, 'exo_memory', d));
  fs.copyFileSync(path.join(REPO, 'exo_memory/SOURCE.md'), path.join(top, 'exo_memory/SOURCE.md'));
  fs.mkdirSync(path.join(top, 'dev'), { recursive: true });
  fs.copyFileSync(path.join(REPO, 'dev/stick-waiter.js'), path.join(top, 'dev/stick-waiter.js'));
  const f = path.join(root, rel), src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(CARGO, ['test', '--bin', 'consonance', 'pane_exit'], { cwd: root, encoding: 'utf8', env: { ...process.env, CARGO_TARGET_DIR: path.join(os.tmpdir(), 'd143m-target') }, timeout: 1800000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = /test result: \w+\. (\d+) passed; (\d+) failed/.exec(out);
  if (!m) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-400)); continue; }
  if (+m[2] > 0) { t.caught++; console.log('caught  ', name, `(${m[2]} red)`); } else { t.survived.push(name); console.log('SURVIVED', name, `(${m[1]} passed)`); }
}
console.log(`${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${fs.readFileSync(LIVE, 'utf8') === before && fs.readFileSync(PX, 'utf8') === beforePx ? 'unchanged' : 'CHANGED'}`);
