// Mutants for P-SECOND-INSTANCE-TEXT, on a COPY: a git worktree of HEAD in the scratchpad with the live main.rs copied
// in and its own CARGO_TARGET_DIR. The live checkout's main.rs is hashed before and after.
// L061 order: shape -> dirty source -> anchors (R2) -> mutate. A survivor prints what it became.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const LIVE = 'C:/Users/nname/Desktop/lighthouse';
const S = __dirname;
const WT = path.join(S, 'wt-second-instance');
const TARGET = path.join(S, 'target-seal-mutants');
const CARGO = 'C:/Users/nname/.cargo/bin/cargo.exe';
const REL = 'consonance/src-tauri/src/main.rs';

const M = [
  ['THE DEFECT BACK: an unconditional "use the window you already have"',
    'If a Consonance window is open, use that one. To pick up new code, close it completely \\\n        first, then launch once.',
    'Use the window you already have. To pick up new code, close it completely \\\n        first, then launch once.'],
  ['the condition dropped from the first window sentence', 'If a Consonance window is open, use that one.', 'A Consonance window is open, use that one.'],
  ['Task Manager no longer named', 'open \\\n        Task Manager, end consonance.exe', 'open \\\n        the process list, end consonance.exe'],
  ['consonance.exe no longer named', 'Task Manager, end consonance.exe, then launch once.', 'Task Manager, end the app, then launch once.'],
  ['the two-MCP-servers reason removed', 'because two instances mean two MCP \\\n        servers.', 'because it is not allowed.'],
  ['a non-ASCII dash creeps into the text', 'give it a minute - a copy', 'give it a minute \u2014 a copy'],
  ['the wait removed: kill first', 'If no Consonance window is open, give it a minute - a copy that is starting up or \\\n        closing down has no window yet. If none appears, a copy',
    'If no Consonance window is open, a copy'],
  ['the dialog stops using the pinned text (the old words inlined back)',
    // two lines, because the second alone also appears in the ASCII test and the audit refused it as ambiguous
    '    use windows::Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_ICONWARNING, MB_OK};\n    let (title, body) = second_instance_message();',
    '    use windows::Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_ICONWARNING, MB_OK};\n    let (title, body) = ("Consonance - already running", "Consonance is already running. Use the window you already have.");'],
];

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const liveMain = path.join(LIVE, REL);
const before = sha(liveMain);
const original = fs.readFileSync(liveMain, 'utf8').replace(/\r\n/g, '\n');

const bad = M.filter((m) => m.length !== 3 || m.some((x) => typeof x !== 'string' || !x) || m[1] === m[2]);
if (bad.length) { console.error('MALFORMED', bad); process.exit(2); }
const dirty = M.filter((m) => original.includes(m[2]));
if (dirty.length) { console.error('THE SOURCE ALREADY CARRIES A MUTATION — restore it, do not re-point anchors', dirty.map((d) => d[0])); process.exit(2); }
const orphan = M.map((m, i) => [i + 1, m[0], m[1], original.split(m[1]).length - 1]).filter(([, , , h]) => h !== 1);
if (orphan.length) {
  for (const [id, name, a, h] of orphan) console.error(`#${id} ${name}: ${h === 0 ? 'MISSING' : h + ' MATCHES'} — anchor: ${JSON.stringify(a)}`);
  process.exit(2);
}

const run = (cmd, args, opts) => spawnSync(cmd, args, Object.assign({ encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }, opts));
if (!fs.existsSync(WT)) {
  const r = run('git', ['-C', LIVE, 'worktree', 'add', '--detach', WT, 'HEAD']);
  if (r.status !== 0) { console.error(r.stderr); process.exit(2); }
}
const WT_MAIN = path.join(WT, REL);
const CRATE = path.join(WT, 'consonance', 'src-tauri');
const env = { ...process.env, CARGO_TARGET_DIR: TARGET };
const score = () => {
  const r = run(CARGO, ['test', '--bin', 'consonance', 'second_instance_tests', '--', '--test-threads=1'], { cwd: CRATE, env, timeout: 3600000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = /test result: (ok|FAILED)\. (\d+) passed; (\d+) failed/.exec(out);
  if (!m) return { state: 'NO RESULT', out };
  const failed = [...out.matchAll(/test second_instance_tests::(\w+) \.\.\. FAILED/g)].map((x) => x[1]);
  return { state: m[1] === 'ok' ? 'green' : 'red', passed: +m[2], failed: +m[3], names: failed };
};

let killed = 0, notApplied = 0;
const survivors = [];
try {
  fs.writeFileSync(WT_MAIN, original);
  const t0 = Date.now();
  const pre = score();
  console.log(`pre-flight (unmutated copy): ${pre.state} ${pre.passed ?? ''}/${pre.failed ?? ''} in ${Math.round((Date.now() - t0) / 1000)} s`);
  if (pre.state !== 'green') { console.error((pre.out || '').slice(-3000)); process.exitCode = 2; }
  else {
    for (const [i, [name, from, to]] of M.entries()) {
      if (original.split(from).length - 1 !== 1) { notApplied++; console.log(`  NOT APPLIED #${i + 1} ${name} — anchor: ${JSON.stringify(from)}`); continue; }
      fs.writeFileSync(WT_MAIN, original.replace(from, () => to));
      const r = score();
      if (r.state === 'red') { killed++; console.log(`  killed    #${i + 1} ${name}   (${r.names.join(', ')})`); }
      else if (r.state === 'green') {
        survivors.push(`#${i + 1} ${name}\n      anchor: ${JSON.stringify(from)}\n      became: ${JSON.stringify(to)}`);
        console.log(`  SURVIVED  #${i + 1} ${name}`);
      } else { console.log(`  NO RESULT #${i + 1} ${name} — did not compile; NOT counted as killed\n${(r.out || '').slice(-1200)}`); }
    }
    console.log(`\nsecond-instance mutants: ${M.length} listed · ${killed} killed · ${survivors.length} survived · ${notApplied} not applied`);
    for (const s of survivors) console.log('  ' + s);
  }
} finally {
  fs.writeFileSync(WT_MAIN, original);
  console.log(`live main.rs unchanged: ${sha(liveMain) === before}`);
}
