// L215 R2 and R4, live. A scratch HOME gets the room's hooks from install.ps1; push-gate's entry is then BROKEN (its command points at a program that does not exist).
//   A: broken, no key            -> the action goes through (the gate fails open today)         [R2, today]
//   B: broken, -FailClosed       -> the action is refused                                        [R2, with the key]
//   C: broken + blocking, then -GatesOpen (the way out) -> a seat can act again                  [R4]
// A minimal settings file carrying only that one entry is handed to claude with --settings; nothing of the user's ~/.claude is read or written.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Consonance/lh-wt-l215'; const INSTALL = path.join(REPO, 'dev/shell/install.ps1');
const home = fs.mkdtempSync(path.join(os.tmpdir(), 'l215live-')); const data = path.join(home, 'data'); fs.mkdirSync(data);
const env = { ...process.env, USERPROFILE: home, HOME: home, CONSONANCE_DATA: data, CONSONANCE_DREAM: '' };
const inst = (...a) => { const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', INSTALL, ...a], { encoding: 'utf8', env, timeout: 240000 }); if (r.status !== 0) throw new Error('install ' + a.join(' ') + ': ' + (r.stdout + r.stderr).slice(-600)); return r.stdout; };
const sFile = path.join(home, '.claude', 'settings.json');
const read = () => JSON.parse(fs.readFileSync(sFile, 'utf8'));
const leaf = (h) => { const q = [...String(h.command).matchAll(/"([^"]*)"/g)]; return path.basename(q.length ? q[q.length - 1][1] : h.command).toLowerCase(); };
const gateGroup = () => { const s = read(); return s.hooks.PreToolUse.find((g) => (g.hooks || []).some((h) => leaf(h) === 'push-gate.js')); };
function act(label) {
  const g = gateGroup(); const mini = path.join(home, 'mini.json'); fs.writeFileSync(mini, JSON.stringify({ hooks: { PreToolUse: [g] } }));
  const marker = path.join(home, 'm' + Math.random().toString(36).slice(2) + '.txt').replace(/\\/g, '/');
  const cwd = path.join(home, 'cwd'); fs.mkdirSync(cwd, { recursive: true });
  const r = spawnSync(path.join(os.homedir(), '.local', 'bin', 'claude.exe'), ['-p', `Run exactly this one bash command and nothing else: echo hi > "${marker}"`, '--model', 'haiku', '--settings', mini, '--setting-sources', 'project', '--strict-mcp-config', '--permission-mode', 'bypassPermissions', '--allowedTools', 'Bash'], { cwd, encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: data, CONSONANCE_DREAM: '' }, timeout: 120000 });
  const h = g.hooks.find((x) => leaf(x) === 'push-gate.js'); if (process.env.DBG) console.log('   claude said:', String(r.stdout).replace(/s+/g, ' ').slice(0, 300), '| matcher', g.matcher);
  console.log(`${label.padEnd(58)} entry: onFailure=${h.onFailure || '-----'} command=${h.command.includes('no/such') ? 'BROKEN' : 'working'}  ->  action ${fs.existsSync(marker) ? 'WENT THROUGH' : 'REFUSED'}`);
  return fs.existsSync(marker);
}
function breakGate() { const s = read(); for (const g of s.hooks.PreToolUse) for (const h of g.hooks || []) if (leaf(h) === 'push-gate.js') h.command = '"' + process.execPath.split(String.fromCharCode(92)).join('/') + '" "C:/no/such/dir/push-gate.js"'; fs.writeFileSync(sFile, JSON.stringify(s, null, 2)); }
inst();
breakGate();
const a = act('A  gate process cannot start, no key (today)');
inst('-FailClosed', 'push-gate.js'); breakGate();   // -FailClosed re-points the command (the installer repairs it); break it again to model a gate that dies
const b = act('B  gate process cannot start, -FailClosed');
inst('-GatesOpen');
const c = act('C  after the way out: -GatesOpen');
fs.rmSync(home, { recursive: true, force: true });
console.log(`R2: today ${a ? 'goes through' : 'refused'}, with the key ${b ? 'goes through' : 'refused'}; R4: after -GatesOpen ${c ? 'a seat can act' : 'STILL STUCK'}`);
process.exit(a && !b && c ? 0 : 1);
