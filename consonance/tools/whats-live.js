// TRIGGER #3 — is the thing you are about to reason about the thing that is actually running?
//
// THE GROOVE THIS GUARDS, measured rather than felt. One session, 2026-07-28/29, five
// confident claims all wrong the same way — a measurement taken on something ADJACENT to the
// artifact the claim was about:
//
//   1. Context gauge read 599% of budget. The denominator was invented; nothing here can read
//      the model's real window.
//   2. "Six dreams, two weeks dark." Read the repo's `dreams/` pool, which was RETIRED on
//      2026-07-15. The live dreams are in the instance directories: 24 of them, through 07-24.
//   3. Wired a resolver into residue.js and the before/after was byte-identical. The board
//      writes 8-char prefixes; the map holds full UUIDs. Nothing had run.
//   4. "The fix is 18 seconds short of being live." Compared against target/debug, while the
//      app runs target/release. It had been live for hours.
//   5. "catch-ledger is miscounting." It does not key on board pane ids at all.
//
// Four of the five are one question — IS THIS THE LIVE ONE — and the room's own law says
// naming a groove installs nothing. Carrier-drift was named in the map and re-ran three times
// inside two hours with the entry at the top of the log. Only a thing that fails installs it.
//
// So this answers the question instead of deriving it, and goes RED when the answer is "no".
//
// WHAT IT CANNOT DO: judge whether a claim is about the right artifact. It knows the small set
// of live/stale pairs that have actually bitten in this system and checks those. A sixth pair
// nobody has been burned by yet is not in here, and the honest response to that is to add it
// after it bites rather than to guess at it now.
//
//   node consonance/tools/whats-live.js           exit 1 if anything running is stale
//   node consonance/tools/whats-live.js --warn    report only
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const DATA = process.env.CONSONANCE_DATA || 'C:/Consonance/data';
const INSTANCES = 'C:/Consonance/instances';

const sh = (cmd, args) => {
  try { return execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 24 }).trim(); }
  catch { return ''; }
};
const mtime = p => { try { return fs.statSync(p).mtimeMs; } catch { return 0; } };
const when = ms => ms ? new Date(ms).toISOString().replace('T', ' ').slice(0, 19) : '—';

/** Which executable the running app is ACTUALLY using — asked of the process, never inferred
 *  from which profile happens to exist on disk. This is finding 4, made unaskable. */
function runningApp() {
  const out = sh('powershell', ['-NoProfile', '-Command',
    "$p = Get-Process -Name consonance -ErrorAction SilentlyContinue | Select-Object -First 1; " +
    "if ($p) { $p.Path + '|' + $p.StartTime.ToString('o') }"]);
  if (!out.includes('|')) return null;
  const [exe, started] = out.split('|');
  return { exe, started: Date.parse(started), built: mtime(exe) };
}

/** Newest commit touching the Rust sources, so "is the binary stale" is a comparison against
 *  the source of truth rather than against another build artifact. */
function newestSourceCommit() {
  const ts = sh('git', ['-C', REPO, 'log', '-1', '--format=%at', '--', 'consonance/src-tauri/src']);
  const hash = sh('git', ['-C', REPO, 'log', '-1', '--format=%h %s', '--', 'consonance/src-tauri/src']);
  return { ts: ts ? +ts * 1000 : 0, hash };
}

/** Dreams: the repo pool was retired 2026-07-15 and the live ones live per-instance. Finding 2
 *  was reading the retired copy and reporting its age as the system's. */
function dreams() {
  const pool = path.join(REPO, 'dreams');
  const poolCount = fs.existsSync(pool) ? fs.readdirSync(pool).filter(f => f.endsWith('.md')).length : 0;
  let live = 0, newest = 0, where = '';
  try {
    for (const inst of fs.readdirSync(INSTANCES)) {
      const d = path.join(INSTANCES, inst, 'dreams');
      if (!fs.existsSync(d)) continue;
      for (const f of fs.readdirSync(d)) {
        if (!f.endsWith('.md')) continue;
        live++;
        const m = mtime(path.join(d, f));
        if (m > newest) { newest = m; where = path.join(inst, 'dreams', f); }
      }
    }
  } catch { /* other machine */ }
  return { poolCount, live, newest, where };
}


/** The staleness rule, pure so both directions can be tested. Kept separate from the process
 *  and filesystem reads because an untested RED path is an alarm stuck off, which is the same
 *  failure as an alarm stuck on and harder to notice. */
function staleness({ srcTs, hash, built, started, profile }) {
  const red = [];
  if (srcTs && built && srcTs > built) {
    red.push('the running ' + profile + ' binary predates ' + hash + ' — that commit is NOT live');
  }
  if (built && started && built > started) {
    red.push('the binary on disk is newer than the running process — rebuilt but not restarted');
  }
  return red;
}

function check() {
  const rows = [], red = [];
  const app = runningApp();
  const src = newestSourceCommit();

  if (!app) {
    rows.push(['app', 'NOT RUNNING', 'nothing to be stale against']);
  } else {
    const profile = /[\\/]release[\\/]/i.test(app.exe) ? 'release'
                  : /[\\/]debug[\\/]/i.test(app.exe) ? 'debug' : 'unknown';
    rows.push(['app exe', profile, app.exe]);
    rows.push(['app built', when(app.built), 'the binary the PROCESS is running']);
    rows.push(['app started', when(app.started), '']);
    rows.push(['newest rust', when(src.ts), src.hash]);
    red.push(...staleness({ srcTs: src.ts, hash: src.hash, built: app.built, started: app.started, profile }));
    // finding 4 in one line: name the profile that is NOT running, so nobody checks it
    const other = profile === 'release' ? 'debug' : 'release';
    const otherExe = app.exe.replace(new RegExp(`([\\\\/])${profile}([\\\\/])`, 'i'), `$1${other}$2`);
    if (fs.existsSync(otherExe)) {
      rows.push([`${other} exe`, when(mtime(otherExe)), 'EXISTS AND IS NOT RUNNING — do not measure this one']);
    }
  }

  const d = dreams();
  rows.push(['dreams live', String(d.live), d.where ? `newest ${when(d.newest)} — ${d.where}` : '']);
  if (d.poolCount) {
    rows.push(['dreams pool', String(d.poolCount), 'RETIRED 2026-07-15 — not the live set, do not read its age']);
  }

  for (const [f, label] of [['board.jsonl', 'board'], ['letters.json', 'letters']]) {
    const p = path.join(DATA, f);
    rows.push([label, fs.existsSync(p) ? when(mtime(p)) : 'ABSENT', p]);
  }

  return { rows, red, app };
}

function main(argv) {
  const { rows, red } = check();
  console.log('whats-live — the artifact that is RUNNING, not the one that looks like it\n');
  const w = Math.max(...rows.map(r => r[0].length));
  for (const [k, v, note] of rows) console.log(`  ${k.padEnd(w)}  ${String(v).padEnd(20)} ${note}`);
  if (red.length) {
    console.log('\n  RED:');
    for (const r of red) console.log(`    · ${r}`);
    console.log('\n  A claim about behaviour is a claim about the running artifact. Rebuild or');
    console.log('  restart before reasoning from source.');
  } else {
    console.log('\n  Nothing stale: what is running matches what is committed.');
  }
  console.log('\n  What this cannot do: tell you whether YOUR claim is about the right artifact.');
  console.log('  It knows the live/stale pairs that have actually bitten here and checks those.');
  return argv.includes('--warn') ? 0 : (red.length ? 1 : 0);
}

module.exports = { check, staleness, runningApp, newestSourceCommit, dreams };

if (require.main === module) process.exit(main(process.argv.slice(2)));
