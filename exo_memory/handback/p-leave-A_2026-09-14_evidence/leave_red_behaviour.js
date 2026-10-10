// Red-first, by BEHAVIOUR: the new test file against 9e29daf's stick-waiter.js (the tree before this lap) with ONLY the two LEAVE constants added.
// The plain red-first run could not discriminate: most new tests threw on the missing constant before asserting.
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'leave-red-'));
const files = ['dev/stick-waiter.test.js', 'dev/stick-apply.js', 'dev/tail-carry.js', 'dev/place-conversations.js',
  'consonance/tools/state-sync.js', 'consonance/tools/state-manifest.js', 'consonance/src-tauri/tauri.conf.json',
  'consonance/src-tauri/icons/128x128.png', 'consonance/src-tauri/src/sync_launch.rs', 'consonance/src-tauri/src/main.rs'];
for (const f of files) { const d = path.join(root, f); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(path.join(REPO, f), d); }
let head = cp.execFileSync('git', ['-C', REPO, 'show', '9e29daf:dev/stick-waiter.js'], { encoding: 'utf8' });
head += "\nmodule.exports.LEAVE_STARTED = 'stick-leave.started.json';\nmodule.exports.LEAVE_RESULT = 'stick-leave.result.json';\n";
fs.writeFileSync(path.join(root, 'dev/stick-waiter.js'), head);
let out;
try { out = cp.execFileSync(process.execPath, [path.join(root, 'dev/stick-waiter.test.js')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }); }
catch (e) { out = String(e.stdout); }
const lines = out.split('\n');
for (const l of lines) if (/^  (ok|FAIL) .*P-LEAVE/.test(l)) console.log(l.slice(0, 160));
console.log(lines.filter((l) => /passed, \d+ failed/.test(l)).join(''));
fs.rmSync(root, { recursive: true, force: true });
