// P-LEAVE §2.3 (as re-ruled §2.7) mutants on a SCRATCH REPLICA — the shared checkout is never written.
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ctrl-leave-'));
const files = ['dev/stick-waiter.js', 'dev/stick-waiter.test.js', 'dev/stick-apply.js', 'dev/tail-carry.js', 'dev/place-conversations.js',
  'consonance/tools/state-sync.js', 'consonance/tools/state-manifest.js', 'consonance/src-tauri/tauri.conf.json',
  'consonance/src-tauri/icons/128x128.png', 'consonance/src-tauri/src/sync_launch.rs', 'consonance/src-tauri/src/main.rs'];
for (const f of files) { const d = path.join(root, f); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(path.join(REPO, f), d); }
const SUITE = path.join(root, 'dev/stick-waiter.test.js');
const run = () => { try { return cp.execFileSync(process.execPath, [SUITE], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }); } catch (e) { return String(e.stdout); } };
const pre = run();
console.log('pre-flight', (pre.match(/\d+ passed, \d+ failed/) || ['no summary'])[0]);
if (!/ 0 failed/.test(pre)) { console.log('PRE-FLIGHT RED — nothing scored'); fs.rmSync(root, { recursive: true, force: true }); process.exit(2); }

const cases = [
  ['b: a finished Leave is not stood down on (falls to c/d — the waiter exports after the app\'s own save)',
    '      } else if (leaveResult) {', '      } else if (false) {'],
  ['c: no wait for the orphan\'s ledger lock (today\'s retry path writes the ledger a second time — F2)',
    '        const waited = waitForLeaveCarry(leaveStarted, k, () => ++polls <= k.maxPolls);',
    '        const waited = { lines: [] };'],
  ['c: the wait trusts the pid alone — any live pid holding the lock is waited on',
    '    const live = !!rec && Number.isInteger(rec.pid) && k.pidAnswers(rec.pid) && carry.holderLive(rec, k.imageOf);',
    '    const live = !!rec && Number.isInteger(rec.pid) && k.pidAnswers(rec.pid);'],
  ['c: "cannot tell" the holder\'s image is taken as gone, and the export runs past a live orphan',
    '    const live = !!rec && Number.isInteger(rec.pid) && k.pidAnswers(rec.pid) && carry.holderLive(rec, k.imageOf);',
    '    const live = !!rec && Number.isInteger(rec.pid) && k.pidAnswers(rec.pid) && k.imageOf(rec.pid) === String(rec.image).toLowerCase();'],
  ['D-4: case b leaves the LEAVE_RESULT in place',
    '        removeLeave(leaveResultPath, app);\n', '        /* not removed */\n'],
  ['D-4: case c removes LEAVE_STARTED BEFORE its export',
    "        const find = findStick(k.volumeRoots());\n        const why = `Consonance stopped during",
    "        removeLeave(leaveStartedPath, app);\n        const find = findStick(k.volumeRoots());\n        const why = `Consonance stopped during"],
  ['D-4: case c never removes LEAVE_STARTED',
    '          : exportWithNotice(find, o.data, k, runExport, tally, { why, waited: waited.lines });\n        removeLeave(leaveStartedPath, app);',
    '          : exportWithNotice(find, o.data, k, runExport, tally, { why, waited: waited.lines });\n        /* LEAVE_STARTED kept */'],
  ['D-4: the removal does not check the pid, and takes a newer app\'s file',
    '  if (cur && cur.pid === app.pid) { try { fs.unlinkSync(p); }', '  if (cur) { try { fs.unlinkSync(p); }'],
  ['D-4: the waiter removes STALE (other-pid) LEAVE files in case d',
    "        const why = 'Consonance closed without saving",
    "        for (const q of [leaveResultPath, leaveStartedPath]) { try { fs.unlinkSync(q); } catch (_) {} }\n        const why = 'Consonance closed without saving"],
  ['D-7: the image is compared raw — "consonance.exe" never equals "consonance"',
    '  if (imageName(rec.image) !== app.image) return null;', '  if (rec.image !== app.image) return null;'],
  ['D-7: the pid is not checked — any LEAVE file under the image is this app\'s',
    '  if (!rec || rec.pid !== app.pid) return null;', '  if (!rec) return null;'],
  ['D-7: the image is not checked at all — the right pid under another image counts',
    '  if (imageName(rec.image) !== app.image) return null;', '  /* no image check */'],
  ['D-9: case b returns before the adoption check',
    "        last = { code: 0, outcome: 'STOOD_DOWN_LEAVE' };\n", "        last = { code: 0, outcome: 'STOOD_DOWN_LEAVE' };\n        removeLeave(leaveResultPath, app); return { ...last, ...tally };\n"],
  ['D-9: case a returns before the adoption check',
    "        last = { code: 0, outcome: 'STOOD_DOWN' };\n", "        return { code: 0, outcome: 'STOOD_DOWN', ...tally };\n"],
  ['order: LEAVE_STARTED is read before LEAVE_RESULT (a finished Leave is re-done as a fallback)',
    '      } else if (leaveResult) {', '      } else if (leaveResult && !leaveStarted) {'],
  ['order: a LEAVE file is honoured before a live applier',
    "      if (started && started.script === 'stick-apply.js' && carry.holderLive(started, k.imageOf)) {",
    "      if (!leaveResult && started && started.script === 'stick-apply.js' && carry.holderLive(started, k.imageOf)) {"],
  ['fallback: the notices no longer say they are the fallback',
    "k.notify('Consonance — fallback save to the stick', body, statusPath)", "k.notify('Consonance — the stick', body, statusPath)"],
  ['fallback: case c\'s notice does not say the app stopped during its own save',
    '`Consonance stopped during its own save to the stick', '`Consonance closed during the stick'],
  ['fallback: case d\'s notice does not say the app closed without saving itself',
    "'Consonance closed without saving to the stick itself", "'Consonance closed without its window"],
];

const p = path.join(root, 'dev/stick-waiter.js');
const orig = fs.readFileSync(p, 'utf8');
let killed = 0, survived = 0, na = 0;
for (const [name, from, to] of cases) {
  const n = orig.split(from).length - 1;
  if (n !== 1 || orig.includes(to)) { na++; console.log(`????      ${name}: anchor ${n}${orig.includes(to) ? ', replacement already present' : ''}`); continue; }
  fs.writeFileSync(p, orig.replace(from, () => to));
  const out = run();
  fs.writeFileSync(p, orig);
  const red = out.split('\n').filter((l) => l.startsWith('  FAIL')).map((l) => l.slice(7));
  red.length ? killed++ : survived++;
  console.log(`${red.length ? 'killed  ' : 'SURVIVED'}  ${name} — ${red.length} red${red.length ? ': ' + red.slice(0, 2).join(' | ') : ''}`);
}
console.log(`\n${killed} killed · ${survived} survived · ${na} not applied · ${cases.length} total`);
fs.rmSync(root, { recursive: true, force: true });
