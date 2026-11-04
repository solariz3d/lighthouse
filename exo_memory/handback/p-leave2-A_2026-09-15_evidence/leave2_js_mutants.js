// P-LEAVE-2 (a) — D-8 mutants of dev/stick-waiter.js, on a REPLICA in the scratchpad. The tracked tree is only READ
// (copied from), and every tracked file the replica copies is hashed before and after the run.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const REPO = 'C:/Users/nname/Desktop/lighthouse';
const R = path.join(__dirname, 'leave2_replica');
const COPIES = [
  'dev/stick-waiter.js', 'dev/stick-waiter.test.js', 'dev/stick-apply.js', 'dev/tail-carry.js', 'dev/place-conversations.js',
  'consonance/tools/state-sync.js', 'consonance/tools/state-manifest.js',
  'consonance/src-tauri/tauri.conf.json', 'consonance/src-tauri/src/sync_launch.rs',
];
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before = Object.fromEntries(COPIES.map((f) => [f, sha(path.join(REPO, f))]));

fs.rmSync(R, { recursive: true, force: true });
for (const f of COPIES) { fs.mkdirSync(path.dirname(path.join(R, f)), { recursive: true }); fs.copyFileSync(path.join(REPO, f), path.join(R, f)); }
fs.cpSync(path.join(REPO, 'consonance/src-tauri/icons'), path.join(R, 'consonance/src-tauri/icons'), { recursive: true });

const W = path.join(R, 'dev/stick-waiter.js');
const ORIGINAL = fs.readFileSync(W, 'utf8');
const run = () => {
  const out = spawnSync(process.execPath, ['stick-waiter.test.js'], { cwd: path.join(R, 'dev'), encoding: 'utf8', timeout: 300000 });
  const text = (out.stdout || '') + (out.stderr || '');
  const m = text.match(/(\d+) passed, (\d+) failed/);
  return { passed: m ? +m[1] : -1, failed: m ? +m[2] : -1, fails: text.split('\n').filter((l) => /^\s*FAIL /.test(l)).map((l) => l.trim().slice(5, 95)) };
};

const pre = run();
console.log(`PRE-FLIGHT (unmutated replica): ${pre.passed} passed, ${pre.failed} failed`);
if (pre.failed !== 0 || pre.passed < 1) { console.log('pre-flight is not green — refusing to score'); process.exit(2); }

const MUTANTS = [
  ['J1 leaveFor: the start-time check removed',
    "  if (typeof app.startedAt !== 'string' || typeof rec.appStartedAt !== 'string' || rec.appStartedAt !== app.startedAt) return null;\n", ''],
  ['J2 leaveFor: the start times are not compared (only their presence)',
    "|| rec.appStartedAt !== app.startedAt) return null;", ') return null;'],
  ['J3 leaveFor: an unknown start time on either side is not refused (only compared)',
    "if (typeof app.startedAt !== 'string' || typeof rec.appStartedAt !== 'string' || rec.appStartedAt !== app.startedAt) return null;",
    'if (rec.appStartedAt !== app.startedAt) return null;'],
  ['J4 removeLeave: removes a same-pid file whatever its start time',
    'cur.pid === app.pid && cur.appStartedAt === app.startedAt)', 'cur.pid === app.pid)'],
  ['J5 adoption: keeps the FIRST session\'s start time for the adopted session',
    '      app.startedAt = null;\n', ''],
  ['J6 parseArgs: --app-started-at read but not kept',
    "else if (a === '--app-started-at') o.appStartedAt = need();", "else if (a === '--app-started-at') need();"],
  ['J7 app record: start time not carried from argv',
    'startedAt: o.appStartedAt };', 'startedAt: null };'],
  ['J8 parseArgs: --app-started-at unknown again (the old build)',
    "      else if (a === '--app-started-at') o.appStartedAt = need();\n", ''],
  ['J9 R-1: an unknown start time says "stopped" again',
    'const unknown = startTimeUnknown(leaveResultPath, app) || startTimeUnknown(leaveStartedPath, app);', 'const unknown = null;'],
  ['J10 R-1: a waiter with no start time is not "unknown"',
    "  if (typeof app.startedAt !== 'string') return 'this waiter does not know", "  if (false) return 'this waiter does not know"],
  ['J11 R-1: a record with no start time is not "unknown"',
    "  if (typeof rec.appStartedAt !== 'string') return 'the record carries", "  if (false) return 'the record carries"],
  ['J12 R-1: a KNOWN, different start time is called NOT CONFIRMED too',
    "  if (typeof rec.appStartedAt !== 'string') return 'the record carries no start time (written by an older build)';\n  return null;",
    "  return 'the record carries no start time (written by an older build)';"],
  ['J13 R-1: only LEAVE_RESULT is looked at for an unknown start time',
    'startTimeUnknown(leaveResultPath, app) || startTimeUnknown(leaveStartedPath, app);', 'startTimeUnknown(leaveResultPath, app);'],
  ['J14 R-3: the no-record sentence says "stopped" again',
    "'Consonance closed without a close record for this session, so this is the fallback save.'",
    "'Consonance closed without saving to the stick itself (it was stopped before its close window could run), so this is the fallback save.'"],
  ['SURVIVE-CONTROL: reword a comment', "a newer app with a reused pid writing the same name is not it.", 'a newer app reusing the pid under the same name is not it.'],
  ['SKIP-CONTROL: an anchor that does not exist', 'this anchor is not in the waiter', 'x'],
];

const rows = [];
for (const [name, anchor, repl] of MUTANTS) {
  const n = ORIGINAL.split(anchor).length - 1;
  if (n !== 1) { rows.push(`  NOT APPLIED  ${name}  (anchor found ${n} times)`); continue; }
  const mutated = ORIGINAL.replace(anchor, () => repl);
  if (mutated === ORIGINAL) { rows.push(`  NOT APPLIED  ${name}  (the mutant is the source)`); continue; }
  fs.writeFileSync(W, mutated);
  const r = run();
  fs.writeFileSync(W, ORIGINAL);
  rows.push(r.failed > 0 ? `  CAUGHT       ${name}  (${r.failed}: ${r.fails.join(' | ')})` : `  SURVIVED     ${name}  (${r.passed} passed)`);
}
console.log(rows.join('\n'));
const after = Object.fromEntries(COPIES.map((f) => [f, sha(path.join(REPO, f))]));
console.log(`tracked sources unchanged: ${COPIES.every((f) => before[f] === after[f])}`);
const post = run();
console.log(`POST (replica restored): ${post.passed} passed, ${post.failed} failed`);
