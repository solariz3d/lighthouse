// P-LEAVE-3 rows 4 and 5 — mutants on a SCRATCH COPY of the crate. The tracked src/ is only read, and hashed before
// and after. Same harness as the P-LEAVE-2 lap (scratchpad/leave2_rust_mutants.js), a new mutant list.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const REPO = 'C:/Users/nname/Desktop/lighthouse';
const HERE = __dirname;
const COPY = path.join(HERE, 'leave3_crate');
const TARGET = path.join(HERE, 'leave3_target');
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const SRC = path.join(REPO, 'consonance/src-tauri/src');
const hashes = () => Object.fromEntries(fs.readdirSync(SRC).filter((f) => fs.statSync(path.join(SRC, f)).isFile()).map((f) => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(SRC, f))).digest('hex')]));
const before = hashes();

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
if (!only) {
  fs.rmSync(COPY, { recursive: true, force: true });
  fs.cpSync(path.join(REPO, 'consonance/src-tauri'), path.join(COPY, 'consonance/src-tauri'), { recursive: true, filter: (s) => !/[\\/]src-tauri[\\/]target([\\/]|$)/.test(s) });
  fs.cpSync(path.join(REPO, 'consonance/ui'), path.join(COPY, 'consonance/ui'), { recursive: true });
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
  ['R1 the keep-awake decision never fires', 'sync_launch.rs', '        (false, true) => Some(true),\n        (true, false) => Some(false),\n', ''],
  ['R2 the hold is taken with no seats live', 'sync_launch.rs', '        (false, true) => Some(true),', '        (false, _) => Some(true),'],
  ['R3 the hold is never released', 'sync_launch.rs', '        (true, false) => Some(false),\n', ''],
  ['R4 the DISPLAY is held too', 'main.rs', 'SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED)', 'SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED | windows::Win32::System::Power::ES_DISPLAY_REQUIRED)'],
  ['R5 the release keeps the system hold', 'main.rs', 'unsafe { SetThreadExecutionState(ES_CONTINUOUS) }', 'unsafe { SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED) }'],
  ['R6 the keep-awake thread does not stay alive', 'main.rs', '    let mut held = false;\n    loop {', '    let mut held = false;\n    if true {'],
  ['R7 the thread decides for itself instead of asking', 'main.rs', 'if let Some(hold) = sync_launch::keep_awake_transition(held, work) {', 'if let Some(hold) = (if seats > 0 { Some(true) } else { Some(false) }) {'],
  ['R8 the keep-awake thread is never started', 'main.rs', '            std::thread::spawn(move || keep_awake_thread(awake));', '            let _ = awake;'],
  ['R9 the block reason is created after the Leave starts', 'main.rs', '                if !critical {\n                    block_shutdown(hwnd);\n                }\n                std::thread::spawn(move || shutdown_leave(raw));', '                std::thread::spawn(move || shutdown_leave(raw));\n                if !critical {\n                    block_shutdown(hwnd);\n                }'],
  ['R10 every end of session is answered TRUE at once', 'main.rs', 'if critical { LRESULT(1) } else { LRESULT(0) }', 'LRESULT(1)'],
  ['R11 a forced end is answered FALSE (the app is killed instead)', 'main.rs', 'if critical { LRESULT(1) } else { LRESULT(0) }', 'if critical { LRESULT(0) } else { LRESULT(0) }'],
  ['R12 a second query starts a second Leave', 'main.rs', 'if !SHUTDOWN_LEAVING.swap(true, Ordering::SeqCst) {', 'if true {'],
  ['R13 the Leave runs ON the UI thread', 'main.rs', 'std::thread::spawn(move || shutdown_leave(raw));', 'shutdown_leave(raw);'],
  ['R14 the release is asked for before the Leave', 'main.rs', 'fn shutdown_leave(hwnd_raw: isize) {\n    plog("SHUTDOWN the OS is ending', 'fn shutdown_leave(hwnd_raw: isize) {\n    unsafe { let _ = windows::Win32::UI::WindowsAndMessaging::PostMessageW(Some(windows::Win32::Foundation::HWND(hwnd_raw as *mut std::ffi::c_void)), WM_LEAVE_DONE, windows::Win32::Foundation::WPARAM(0), windows::Win32::Foundation::LPARAM(0)); }\n    plog("SHUTDOWN the OS is ending'],
  ['R15 the block is released off the window thread', 'main.rs', '        WM_LEAVE_DONE => {\n            unsafe {\n                let _ = windows::Win32::System::Shutdown::ShutdownBlockReasonDestroy(hwnd);\n            }', '        WM_LEAVE_DONE => {'],
  ['R16 the watch is put on a window that is not the app', 'main.rs', 'app.get_webview_window("main")', 'app.get_webview_window("leave")'],
  ['R17 the watch is never installed', 'main.rs', '            watch_session_end(app.handle());', '            let _ = &app;'],
  ['R18 the shutdown Leave waits on the keeper bounds', 'main.rs', 'Ok(_) => leave_run(&app, LeaveBounds::SHUTDOWN),', 'Ok(_) => leave_run(&app, LeaveBounds::NORMAL),'],
  ['R19 the shutdown export bound is the 600 s one', 'main.rs', 'const SHUTDOWN_EXPORT_TIMEOUT: Duration = Duration::from_secs(20);', 'const SHUTDOWN_EXPORT_TIMEOUT: Duration = LEAVE_EXPORT_TIMEOUT;'],
  ['R20 the shutdown waits as long as the keeper close', 'main.rs', 'const SHUTDOWN: LeaveBounds = LeaveBounds { flight_polls: 10, seat_polls: 15,', 'const SHUTDOWN: LeaveBounds = LeaveBounds { flight_polls: SPAWN_FLIGHT_POLLS, seat_polls: SEAT_TEARDOWN_POLLS,'],
  ['R21 the keeper close takes the shutdown bounds', 'main.rs', 'std::thread::spawn(move || leave_run(&app, LeaveBounds::NORMAL));', 'std::thread::spawn(move || leave_run(&app, LeaveBounds::SHUTDOWN));'],
  ['R22 a shown string claims the app stops a restart', 'main.rs', '"Consonance is saving this session to the stick.\\0"', '"Consonance keeps your PC from restarting while it saves.\\0"'],
  ['R23 the hold is dropped when the Leave drains the seats', 'main.rs', 'let work = seats + usize::from(LEAVE_PHASE.load(Ordering::SeqCst) == LEAVE_RUNNING);', 'let work = seats;'],
  ['SURVIVE-CONTROL reword a comment', 'main.rs', '// no LEAVE record exists for that session. tao raises CloseRequested for WM_CLOSE only, so the app never heard it.', '// no LEAVE record exists for that session. tao raises CloseRequested for WM_CLOSE alone, so the app never heard it.'],
  ['SKIP-CONTROL an anchor that does not exist', 'main.rs', 'this anchor is not in main.rs', ''],
];

const log = (s) => { console.log(s); fs.appendFileSync(path.join(HERE, 'leave3_rust_mutants.out.txt'), s + '\n'); };
if (!only) fs.writeFileSync(path.join(HERE, 'leave3_rust_mutants.out.txt'), ''); else log('--- --only ' + only);

const base = run();
log(`BASELINE (unmutated copy): compiled=${base.compiled} passed=${base.passed} failed=${base.failed.length} [${base.failed.join(', ')}]`);
if (!base.compiled) { log('baseline did not compile — refusing to score ' + base.err); process.exit(2); }

let applied = 0, caught = 0;
for (const [name, file, anchor, repl] of MUTANTS) {
  if (only && !name.startsWith(only + ' ')) continue;
  const p = path.join(PKG, 'src', file);
  const orig = fs.readFileSync(p, 'utf8');
  const n = orig.split(anchor).length - 1;
  if (n !== 1) { log(`  NOT APPLIED  ${name}  (anchor found ${n} times)`); continue; }
  fs.writeFileSync(p, orig.replace(anchor, () => repl));
  let r;
  try { r = run(); } finally { fs.writeFileSync(p, orig); }
  const control = name.includes('CONTROL');
  if (!control) applied++;
  if (!r.compiled) { log(`  NO BUILD     ${name}  (${r.err})`); continue; }
  const extra = r.failed.filter((t) => !base.failed.includes(t));
  if (extra.length) { if (!control) caught++; log(`  CAUGHT       ${name}  (${extra.join(' | ')})`); }
  else log(`  SURVIVED     ${name}  (${r.passed} passed)`);
}
const after = hashes();
log(`applied ${applied} · caught ${caught} · tracked src unchanged: ${Object.keys(before).every((f) => before[f] === after[f]) && Object.keys(after).length === Object.keys(before).length}`);
