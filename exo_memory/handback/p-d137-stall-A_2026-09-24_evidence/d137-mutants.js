// D137 Rust mutants, each on a COPY of consonance/src-tauri (shared target dir for speed), under the heavy-run lock.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
require(path.join(REPO, 'consonance/tools/heavy-run.js')).hold({ cmd: 'D137-A ring_reply mutants' });
const SRC = path.join(REPO, 'consonance/src-tauri');
const LIVE = path.join(SRC, 'src/main.rs');
const before = fs.readFileSync(LIVE, 'utf8');
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const M = [
  ['R1 an unrendered ring says delivered', '        _ => format!("written to {dest} — UNCONFIRMED (no render yet; verify before treating as delivered)"),', '        _ => format!("delivered to {dest} (rendered in its pane — not proof it was read)"),'],
  ['R2 call_chair replies off the write, not the render', '            ring_reply("Main", receipt)', '            ring_reply("Main", Receipt::Received)'],
  ['R3 call_librarian replies off the write, not the render', '            ring_reply("the librarian", receipt)', '            ring_reply("the librarian", Receipt::Received)'],
  ['R4 call_chair skips the gate', '    if let Some(queued) = gate_or_queue(app, MAIN_SID, &msg, &preview) {\n        return queued;\n    }\n', ''],
  ['R5 call_chair builds its own delivered string again', '            ring_reply("Main", receipt)', '            match receipt { Receipt::Received => "delivered to Main (rendered in its pane — not proof it was read)".to_string(), _ => ring_reply("Main", receipt) }'],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { if (e.name === 'target') continue; const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, from, to] of M) {
  // the build resolves ../ui, ../README.md, ../GUIDE.md and ../../exo_memory/{cards,spread,research,record,SOURCE.md},
  // so the copy keeps the repo's shape around src-tauri
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd137m-'));
  const root = path.join(top, 'consonance/src-tauri');
  copyDir(SRC, root);
  copyDir(path.join(REPO, 'consonance/ui'), path.join(top, 'consonance/ui'));
  for (const f of ['README.md', 'GUIDE.md']) fs.copyFileSync(path.join(REPO, 'consonance', f), path.join(top, 'consonance', f));
  for (const d of ['cards', 'spread', 'research', 'record']) copyDir(path.join(REPO, 'exo_memory', d), path.join(top, 'exo_memory', d));
  fs.copyFileSync(path.join(REPO, 'exo_memory/SOURCE.md'), path.join(top, 'exo_memory/SOURCE.md'));
  const f = path.join(root, 'src/main.rs'), src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(CARGO, ['test', '--bin', 'consonance', 'ring_reply'], { cwd: root, encoding: 'utf8', env: { ...process.env, CARGO_TARGET_DIR: path.join(os.tmpdir(), 'd137m-target') }, timeout: 1800000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = /test result: \w+\. (\d+) passed; (\d+) failed/.exec(out);
  if (!m) { if (/error\[E/.test(out)) { t.caught++; console.log('caught  ', name, '(compile)'); } else { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); } continue; }
  if (+m[2] > 0) { t.caught++; console.log('caught  ', name, `(${m[2]} red)`); } else { t.survived.push(name); console.log('SURVIVED', name, `(${m[1]} passed)`); }
}
console.log(`${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live file ${fs.readFileSync(LIVE, 'utf8') === before ? 'unchanged' : 'CHANGED'}`);
