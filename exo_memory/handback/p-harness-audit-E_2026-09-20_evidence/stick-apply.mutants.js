// Mutants for P-STICK-APPLIER-ZOMBIE, ON A COPY. dev/stick-apply.js is never edited: each mutant is written to
// dev/.stick-apply.mutant-<pid>.js (beside the source, so its relative requires resolve) and the suite is pointed at
// it through STICK_APPLY_UNDER_TEST. Tracked files are hashed before and after.
//
// The L061 rules, in the L061 order: R3 the list's SHAPE first; then THE DIRTY-SOURCE check (a replacement already in
// the source) BEFORE R2, the anchor audit — so a crashed run is never diagnosed as an edit; R1's aid prints what a
// survivor became. NOT APPLIED cannot occur once R2 passes, and the summary still prints the count.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const DEV = 'C:/Users/nname/Desktop/lighthouse/dev';
const SRC = path.join(DEV, 'stick-apply.js');
const SUITE = path.join(DEV, 'stick-apply.test.js');
const COPY = path.join(DEV, `.stick-apply.mutant-${process.pid}.js`);
const COPY_RE = /^\.stick-apply\.mutant-(\d+)\.js$/;

const MUTANTS = [
  // ── the wait ──
  ['REFUSE BECOMES STALE: a windowless ghost is read as gone, and the import runs underneath it',
    '          ghosts = seen;', '          seen = [];'],
  ['the early refusal never fires: every windowless ghost waits the full 600 s again',
    '        if (nowWindowless.size === seen.length && [...nowWindowless].every(',
    '        if (false && nowWindowless.size === seen.length && [...nowWindowless].every('],
  ['a WINDOWED app beside a windowless one no longer holds the wait',
    '        if (nowWindowless.size === seen.length && [...nowWindowless].every(',
    '        if ([...nowWindowless].every('],
  ['the grace becomes CUMULATIVE: a window in between no longer restarts it',
    '        for (const pid of [...windowlessSince.keys()]) if (!nowWindowless.has(pid)) windowlessSince.delete(pid);',
    '        void 0;'],
  ['"cannot tell" (null) is taken as gone',
    '      if (Array.isArray(seen) && seen.length === 0) break;',
    '      if (!seen || seen.length === 0) break;'],
  // ── the result ──
  ['the pid is not named in the sentence',
    "      const named = pids.length ? ` (pid ${pids.join(', ')})` : '';",
    "      const named = '';"],
  ['the parent pid is not recorded, so "grace too short" is uncheckable',
    '      app: { pids, windowless: ghosts ? pids : [], parentPid: k.ppid } };',
    '      app: { pids, windowless: ghosts ? pids : [], parentPid: null } };'],
  // ── the grace ──
  ['the default grace shrinks to 1 s',
    'const WINDOWLESS_GRACE_MS = 30 * 1000;', 'const WINDOWLESS_GRACE_MS = 1000;'],
  ['the default grace grows to the whole 600 s wait',
    'const WINDOWLESS_GRACE_MS = 30 * 1000;', 'const WINDOWLESS_GRACE_MS = 10 * 60 * 1000;'],
  // ── the probe ──
  ['the parser stops checking that the rows match the count',
    '  if (rows.length !== Number(head[1])) return null;', '  void head;'],
  ['the parser reads every process as windowed',
    "    out.push({ pid: Number(m[1]), alive: true, hasWindow: m[2] !== '0' });",
    '    out.push({ pid: Number(m[1]), alive: true, hasWindow: true });'],
  ['the default probe FAILS OPEN: a runner that throws reads as gone',
    '    return null;\n  }\n}', '    return [];\n  }\n}'],
  // ── the one I expect to SURVIVE, kept in on purpose ──
  ['EXPECTED SURVIVOR: the PowerShell query silences its errors, so a failed Get-Process reads as "OK 0" — gone',
    'Get-Process -ErrorAction Stop |', 'Get-Process -ErrorAction SilentlyContinue |'],
];

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const TRACKED = [SRC, SUITE, path.join(DEV, 'stick-waiter.js'), path.join(DEV, 'tail-carry.js')];
const before = Object.fromEntries(TRACKED.map((p) => [p, sha(p)]));

// sweep copies left by a killed run whose pid is gone
for (const f of fs.readdirSync(DEV)) {
  const m = COPY_RE.exec(f);
  if (!m) continue;
  let alive = true;
  try { process.kill(Number(m[1]), 0); } catch (_) { alive = false; }
  if (!alive) { fs.unlinkSync(path.join(DEV, f)); console.log(`swept a copy left by dead pid ${m[1]}`); }
}

const original = fs.readFileSync(SRC, 'utf8');

// R3 — shape
const malformed = MUTANTS.map((m, i) => [i + 1, m]).filter(
  ([, m]) => !Array.isArray(m) || m.length !== 3 || m.some((x) => typeof x !== 'string' || x === '') || m[1] === m[2]);
if (malformed.length) {
  console.error('THE MUTANT LIST IS MALFORMED — refusing to run.');
  for (const [id, m] of malformed) console.error(`  #${id} ${JSON.stringify(m).slice(0, 140)}`);
  process.exit(2);
}
// the dirty-source check, BEFORE R2 (L061, B's move)
const dirty = MUTANTS.map((m, i) => [i + 1, ...m]).filter(([, , , to]) => original.includes(to));
if (dirty.length) {
  console.error('THE SOURCE ALREADY CARRIES A MUTATION — refusing to run. Restore the file; do not re-point anchors.');
  for (const [id, name, , to] of dirty) console.error(`  #${id} ${name}\n      found: ${JSON.stringify(to)}`);
  process.exit(2);
}
// R2 — every anchor, whole list
const orphaned = MUTANTS.map((m, i) => [i + 1, m[0], m[1], original.split(m[1]).length - 1]).filter(([, , , h]) => h !== 1);
if (orphaned.length) {
  console.error(`${orphaned.length} ANCHOR(S) DO NOT MATCH stick-apply.js EXACTLY ONCE — refusing to run.`);
  console.error('  An edit rewrote the line, or the anchor was never unique.');
  for (const [id, name, anchor, hits] of orphaned) {
    console.error(`  #${id} ${name}\n      ${hits === 0 ? 'MISSING' : hits + ' MATCHES'} — anchor: ${JSON.stringify(anchor)}`);
  }
  process.exit(2);
}

const suiteRed = () => spawnSync(process.execPath, [SUITE], {
  encoding: 'utf8', timeout: 300000, env: { ...process.env, STICK_APPLY_UNDER_TEST: COPY },
}).status !== 0;

let killed = 0, notApplied = 0;
const survivors = [];
try {
  fs.writeFileSync(COPY, original);
  if (suiteRed()) {
    console.error('the suite is RED against an UNMUTATED copy — no mutant can be scored.');
    process.exitCode = 2;
  } else {
    for (const [i, [name, from, to]] of MUTANTS.entries()) {
      if (original.split(from).length - 1 !== 1) { notApplied++; console.log(`  NOT APPLIED #${i + 1} ${name} — anchor: ${JSON.stringify(from)}`); continue; }
      fs.writeFileSync(COPY, original.replace(from, () => to));
      if (suiteRed()) { killed++; console.log(`  killed    #${i + 1} ${name}`); }
      else {
        survivors.push(`#${i + 1} ${name}\n        anchor: ${JSON.stringify(from)}\n        became: ${JSON.stringify(to)}`);
        console.log(`  SURVIVED  #${i + 1} ${name}`);
      }
    }
    console.log(`\nstick-apply.mutants: ${MUTANTS.length} applied-or-not · ${killed} killed · ${survivors.length} survived · ${notApplied} not applied`);
    for (const s of survivors) console.log('  ' + s);
  }
} finally {
  try { fs.unlinkSync(COPY); } catch (_) {}
  const unchanged = TRACKED.every((p) => sha(p) === before[p]);
  console.log(`tracked files unchanged: ${unchanged}`);
  const left = fs.readdirSync(DEV).filter((f) => COPY_RE.test(f));
  console.log(`copies left in dev/: ${left.length}`);
}
