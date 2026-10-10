// D164 Rust mutants, each on a COPY of consonance/src-tauri, under the heavy-run lock. The live tree is never written.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
require(path.join(REPO, 'consonance/tools/heavy-run.js')).hold({ cmd: 'D164-A jev-off mutants' });
const SRC = path.join(REPO, 'consonance/src-tauri');
const LIVE = path.join(SRC, 'src/main.rs');
const before = fs.readFileSync(LIVE, 'utf8');
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const TARGET = process.env.D164_TARGET;
const SITE = '            start_exit_waiter();\n            // D164, 2026-09-27:';
const M = [
  ['M1 the call is restored after the exit waiter', SITE, '            start_exit_waiter();\n            start_jev_shadow();\n            // D164, 2026-09-27:'],
  ['M2 started on a thread as a function value', SITE, '            start_exit_waiter();\n            std::thread::spawn(start_jev_shadow);\n            // D164, 2026-09-27:'],
  ['M3 the site trace loses its date', '            // D164, 2026-09-27: the Jev', '            // D164: the Jev'],
  ['M4 the site trace loses the keeper\'s words', '            // "just dont use jev, revoke key" (exo_memory', '            // (exo_memory'],
  ['M5 the site trace loses the plan path', '(exo_memory/loop/plan_jev_off_2026-09-27.md). Its start', '(the plan). Its start'],
  ['M6 a second path names the runner file', '/// The Jev shadow runner\'s arguments:', 'const _JEV_AGAIN: &str = "jev-shadow-runner.js";\n/// The Jev shadow runner\'s arguments:'],
  ['M7 the trace hands the key to the child', '        .env_remove("CONSONANCE_DATA")\n        .creation_flags(NO_WINDOW | CREATE_NEW_PROCESS_GROUP)', '        .env_remove("CONSONANCE_DATA")\n        .env("AI_GATEWAY_API_KEY", "")\n        .creation_flags(NO_WINDOW | CREATE_NEW_PROCESS_GROUP)'],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { if (e.name === 'target') continue; const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const only = process.argv[2];
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, from, to] of M) {
  if (only && !name.startsWith(only + ' ')) { t.listed--; continue; }
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd164m-'));
  const root = path.join(top, 'consonance/src-tauri');
  copyDir(SRC, root);
  copyDir(path.join(REPO, 'consonance/ui'), path.join(top, 'consonance/ui'));
  for (const f of ['README.md', 'GUIDE.md']) if (fs.existsSync(path.join(REPO, 'consonance', f))) fs.copyFileSync(path.join(REPO, 'consonance', f), path.join(top, 'consonance', f));
  for (const d of ['cards', 'spread', 'research', 'record']) copyDir(path.join(REPO, 'exo_memory', d), path.join(top, 'exo_memory', d));
  fs.copyFileSync(path.join(REPO, 'exo_memory/SOURCE.md'), path.join(top, 'exo_memory/SOURCE.md'));
  fs.mkdirSync(path.join(top, 'dev'), { recursive: true });
  fs.copyFileSync(path.join(REPO, 'dev/stick-waiter.js'), path.join(top, 'dev/stick-waiter.js'));
  const f = path.join(root, 'src/main.rs'), src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(CARGO, ['test', '--bin', 'consonance', 'jev_shadow_start_tests'], { cwd: root, encoding: 'utf8', env: { ...process.env, CARGO_TARGET_DIR: TARGET }, timeout: 1800000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = /test result: \w+\. (\d+) passed; (\d+) failed/.exec(out);
  fs.rmSync(top, { recursive: true, force: true });
  if (!m) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-600)); continue; }
  if (+m[2] > 0) { t.caught++; console.log('caught  ', name, `(${m[2]} red)`); } else { t.survived.push(name); console.log('SURVIVED', name, `(${m[1]} passed)`); }
}
console.log(`${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live main.rs ${fs.readFileSync(LIVE, 'utf8') === before ? 'unchanged' : 'CHANGED'}`);
