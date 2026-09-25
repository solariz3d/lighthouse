#!/usr/bin/env node
'use strict';
// state-sync.mutants.js — run with: node state-sync.mutants.js [--only <id>]
//
//   --only <id>   run exactly one mutant; <id> is the number printed before each mutant (1-based, list order)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This file makes the claim
// checkable: it breaks state-sync.js one guard at a time and requires state-sync.test.js to go
// RED for each break. A mutant that SURVIVES is a behaviour nothing is watching — and on this
// tool every one of those behaviours is a way for a bad state set to arrive at the desktop
// reporting success, which is the single failure the packet named.
//
// Each mutation is a real defect someone could plausibly write, not a syntax scramble: a guard
// inverted, a comparison weakened, a refusal downgraded to a warning.
//
// THE TRACKED SOURCES ARE NEVER WRITTEN (P-HARNESS, pane A, 2026-09-15). This file used to write each
// mutant into state-sync.js or state-manifest.js and restore from memory at the end and on SIGINT. A kill
// from outside runs no handler on this machine, and on 2026-09-15 00:42–01:20 a run left `void b` live in
// the tracked state-sync.js (pid 21068). See THE COPIES below.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'state-sync.js');
const CHECKER = path.join(__dirname, 'state-manifest.js');
const SUITE = path.join(__dirname, 'state-sync.test.js');
const LOCK = path.join(__dirname, '.state-sync.mutants.lock');

// TWO TARGETS, ADDED D056-1. The manifest's own validation moved into `state-manifest.js`
// (`classErrorsFor`) so the checker and the transport could not drift, and the new guards there —
// a rule may not carry a `precondition`, an `on_arrival` must name a transform that exists, a
// transform must declare what it points at outside the root — are the mechanism that replaced a
// comment. Leaving them unmutated would have measured everything about this packet except the
// part it exists for. A mutant names its file; the default is state-sync.js.
const FILES = { 'state-sync.js': SRC, 'state-manifest.js': CHECKER };

// ─────────────────────────────────────────────────────────────────────────────────────────────
// THE COPIES — the pattern of dev/tail-carry.mutants.js (L059 §5).
//
// Each mutant is written into a COPY of its target beside the real file — `.state-sync.mutant-<pid>.js`
// or `.state-manifest.mutant-<pid>.js`, in this directory so every sibling require and the REPO root resolve
// exactly as they do for the real file — and state-sync.test.js is pointed at that copy through
// STATE_SYNC_UNDER_TEST or STATE_MANIFEST_UNDER_TEST. A kill at any instant leaves, at worst, an untracked
// copy and a lock naming a dead pid; the next run sweeps both. There is no restore step.
//
// THE ONE LOAD PATH NO POINTER REACHES, measured before the pointers were placed (state-sync.test.js header):
// the tracked state-sync.js's own `require('./state-manifest.js')`. A state-manifest.js mutant is run through
// the suite's direct require and its spawned CLI, but NOT through state-sync.js. Rewriting that require in the
// state-sync COPY would reach it, but state-sync.test.js asserts the source holds the literal
// `require('./state-manifest.js')`, so every manifest mutant would become a false kill (B's read, 2026-09-15).
// So a manifest mutant whose only witness is
// that internal path reads SURVIVED (loudly), never killed. All five manifest guards are tested through the
// suite's direct `classErrorsFor` calls today.
//
// A LOCK, because this file damaged the source through an overlap once (2026-09-09, A): the second run read
// its `original` off a file the first had mutated and restored THAT. Copies remove the damage, and the lock
// still keeps two runs from measuring against each other. A lock left by a KILLED run is the expected case
// now (a kill never unlocks): a live holder refuses, a dead holder's lock is taken over.
// ─────────────────────────────────────────────────────────────────────────────────────────────
const COPIES = {
  'state-sync.js': path.join(__dirname, `.state-sync.mutant-${process.pid}.js`),
  'state-manifest.js': path.join(__dirname, `.state-manifest.mutant-${process.pid}.js`),
};
const POINTER = { 'state-sync.js': 'STATE_SYNC_UNDER_TEST', 'state-manifest.js': 'STATE_MANIFEST_UNDER_TEST' };
const COPY_RE = /^\.(state-sync|state-manifest)\.mutant-(\d+)\.js$/;

/** Is this pid a live process? `kill(pid, 0)` sends nothing; it only asks. EPERM means alive. */
function alive(pid) {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}

/** --only <id>: parsed BEFORE the lock, so a bad argument leaves nothing behind. */
function parseOnly(argv) {
  // The ONLY argument this harness takes is one --only <id>. Anything else — a repeated --only, a typo such as
  // --onyl, a stray word — is refused, because an ignored argument runs a different set of mutants than the one
  // asked for and says nothing (found 2026-09-15: `--only 3 --only 4` silently ran #3 alone).
  if (argv.length === 0) return { only: null };
  if (argv[0] !== '--only' || argv.length > 2) return { error: `the only argument is one --only <id>; got: ${argv.join(' ')}` };
  const v = argv[1];
  if (v === undefined || !/^\d+$/.test(v)) return { error: `--only needs a mutant id (a positive integer); got ${v === undefined ? 'nothing' : v}` };
  return { only: Number(v) };
}
const onlyArg = parseOnly(process.argv.slice(2));
if (onlyArg.error) { console.error(`state-sync.mutants: ${onlyArg.error}`); process.exit(2); }
// ONE HEAVY RUNNER PER TREE (L098, heavy-run.js): wait for any other heavy run of this tree, and say whom.
require('./heavy-run.js').hold({ cmd: 'state-sync.mutants' });

try {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
} catch (e) {
  const holder = parseInt(String(fs.readFileSync(LOCK, 'utf8')).split(/\s/)[0], 10);
  if (Number.isInteger(holder) && alive(holder)) {
    console.error(`state-sync.mutants: a live run (pid ${holder}) holds ${LOCK} — refusing to start.`);
    process.exit(2);
  }
  console.error(`state-sync.mutants: taking over a lock left by pid ${holder}, which is not running (a killed run).`);
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`);
}

for (const f of fs.readdirSync(__dirname)) {
  const m = f.match(COPY_RE);
  if (m && Number(m[2]) !== process.pid && !alive(Number(m[2]))) {
    fs.unlinkSync(path.join(__dirname, f));
    console.error(`state-sync.mutants: swept a copy left by killed run pid ${m[2]}: ${f}`);
  }
}

const original = fs.readFileSync(SRC, 'utf8');

function unlock() { try { fs.unlinkSync(LOCK); } catch (_) { /* already gone */ } }
function dropCopies() { for (const p of Object.values(COPIES)) { try { fs.unlinkSync(p); } catch (_) { /* already gone */ } } }

const MUTANTS = [
  ['quiescence gate never fires', 'if (age < settleMs) {', 'if (false && age < settleMs) {'],
  ['a future mtime is accepted', 'if (a.mtimeMs > Date.now() + 1000) {', 'if (false) {'],
  ['the second read is not compared', 'if (!buf.equals(buf2)) continue;', 'if (false) continue;'],
  ['mtime is not compared after the reads', 'if (c.size !== a.size || c.mtimeMs !== a.mtimeMs) continue;', 'if (c.size !== a.size) continue;'],
  ['a short read is accepted', 'if (buf.length !== a.size) continue;', 'if (false) continue;'],
  ['an unstable path warns instead of aborting the push', 'if (refused.length) {', 'if (false) {'],
  ['the 100 MB cap is not enforced', 'if (over.length) {', 'if (false) {'],
  ['an unplaced path is tolerated', 'if (c.unplaced.length) {', 'if (false) {'],
  ['a forbidden path is tolerated', 'if (c.violations.length) {', 'if (false) {'],
  ['a manifest class error is tolerated', 'if (m.errors.length) {', 'if (false) {'],
  ['verify accepts any sha256', 'if (got !== f.sha256) {', 'if (false) {'],
  ['verify accepts any size', 'if (st.size !== f.bytes) {', 'if (false) {'],
  ['verify treats a missing file as present', "        path: f.path, kind: 'ABSENT',", '        path: f.path, kind: (failures.length = failures.length, undefined) || undefined,'],
  ['an unverifiable remote counts as private', "if (priv.state !== 'private') {", 'if (false) {'],
  ['install overwrites without keeping what it displaces', 'fs.writeFileSync(b, cur);', 'void b;'],
  // NOT `installed = true` -> `installed = true; void 0;`, which was in the first pass and is a
  // NO-OP: it changes no behaviour, so it can only ever "survive", and a mutation that cannot fail
  // measures nothing. This one is a real defect — a pull that installs without being asked.
  ['a bare --pull installs into the data dir anyway', 'if (doInstall) {', 'if (true) {'],
  ['a non-fast-forward is merged anyway', "const ff = gitTry(STATE, ['merge', '--ff-only', `origin/${br}`]);",
    "const ff = gitTry(STATE, ['merge', `origin/${br}`]);"],
  ['.gitattributes is not written, so CRLF conversion is live', "if (cur !== want) { fs.writeFileSync(ga, want); written.push('.gitattributes'); }",
    "if (false) { fs.writeFileSync(ga, want); written.push('.gitattributes'); }"],
  ['the index records no hashes at all', "const entry = { path: t.rel, bytes: r.buf.length, sha256: sha256(r.buf), attempts: r.attempts };",
    "const entry = { path: t.rel, bytes: r.buf.length, sha256: 'x'.repeat(64), attempts: r.attempts };"],
  ['STAYS and REGENERATES travel too', "if (r.class === 'TRAVELS' && p.kind === 'file')", "if (p.kind === 'file')"],
  ['nothing-changed is decided on the clock, so every push commits', 'if (same) {', 'if (false) {'],

  // ── the reconciliation (P-INSTALL-NAMES, L055) ──
  // Every one of these is a way for `--install` to say a set arrived when it did not, which is the
  // sentence that was actually printed on 2026-09-09 and believed.
  // Re-anchored D133: D114 (a81d339, 2026-09-22) gave the call a third argument, so this row had read NOT APPLIED since —
  // the same guard, on the line it lives on now.
  ['the reconciliation is not run at all — the install\'s own count stands as the claim',
    '    rec = reconcileInstall(DATA, v, { state: STATE, merged: new Set((r.installedByUnion || []).map((m) => m.path)) });',
    '    rec = { ok: r.wrote + r.skipped === v.index.files.length, missing: [], claimed: v.index.files.length, present: r.wrote + r.skipped, read_at: null, data_dir: DATA };'],
  ['a shortfall prints loudly and exits 0 anyway — the option this packet refused',
    '    if (!rec.ok) {', '    if (false) {'],
  ['the reconciliation always says ok', '    ok: missing.length === 0, missing,', '    ok: true, missing,'],
  ['`present` is taken from the claim rather than from what was read at the destination',
    '    claimed: v.index.files.length, present: v.index.files.length - missing.length,',
    '    claimed: v.index.files.length, present: v.index.files.length,'],
  ['a truncated file at the destination is accepted',
    "    if (st.size !== f.bytes) {\n      missing.push({\n        path: f.path, kind: 'SIZE',",
    "    if (false) {\n      missing.push({\n        path: f.path, kind: 'SIZE',"],
  ['right-length-wrong-bytes at the destination is accepted',
    "    if (got !== f.sha256) {\n      missing.push({\n        path: f.path, kind: 'CONTENT',",
    "    if (false) {\n      missing.push({\n        path: f.path, kind: 'CONTENT',"],
  ['a directory standing where a file should be is accepted', '    if (!st.isFile()) {', '    if (false) {'],
  // Re-anchored D056-1: `installTree` now compares the destination against `want` (the bytes this
  // machine is entitled to, transformed or not) rather than against the index hash, because a
  // transformed file is supposed to differ from the index. The guard is the same one; the line it
  // lives on changed, and a mutant left pointing at the old line would have reported NOT-APPLIED,
  // which proves nothing about a behaviour that is still there.
  ['already-identical files are not counted, so `installed N` stays unreadable',
    '      if (cur.equals(want)) { skipped++; continue; }',
    '      if (cur.equals(want)) { continue; }'],
  // ── D133: the push's divergence gate, and the relation line ──
  ['D133 the divergence gate never refuses',
    '  if (diverged.length) {\n    return done(refuse(divergenceRefusal(diverged, DATA), 1)',
    '  if (false) {\n    return done(refuse(divergenceRefusal(diverged, DATA), 1)'],
  ['D133 the gate is skipped on a dry run',
    '  if (diverged.length) {\n    return done(refuse(divergenceRefusal(diverged, DATA), 1)',
    '  if (diverged.length && !dryRun) {\n    return done(refuse(divergenceRefusal(diverged, DATA), 1)'],
  ['D133 files are written into the state tree BEFORE the gate (the first build\'s order)',
    '    bufs.set(t.rel, r.buf);\n',
    "    bufs.set(t.rel, r.buf);\n    if (!dryRun) { const d0 = path.join(destRoot, t.rel.split('/').join(path.sep)); fs.mkdirSync(path.dirname(d0), { recursive: true }); fs.writeFileSync(d0, r.buf); }\n"],
  ['D133 counted as a SET: a line here covers every copy of it there', '    if (n > 0) have.set(l, n - 1);', '    if (n > 0) {}'],
  ['D133 a partial last line here counts as a row', "  for (const l of LU.completeLines(localBuf, 0).lines) have.set(l, (have.get(l) || 0) + 1);",
    "  for (const l of localBuf.toString('utf8').split('\\n')) have.set(l, (have.get(l) || 0) + 1);"],
  ['D133 no file is gated', "    if (installModeFor(t.rel, rules) !== 'fast-forward') continue;", '    if (true) continue;'],
  ['D133 a missing state copy is treated as divergence',
    "    try { stateBuf = fs.readFileSync(path.join(stateDataRoot, t.rel.split('/').join(path.sep))); } catch (_) { continue; }",
    "    try { stateBuf = fs.readFileSync(path.join(stateDataRoot, t.rel.split('/').join(path.sep))); } catch (_) { out.push({ path: t.rel, state_only_lines: 1, first_state_only_line: 1, state_lines: 0 }); continue; }"],
  ['D133 the push/pull line is the old unconditional "in sync"', "  console.log('  ' + syncRelation(st).line);",
    "  console.log('  in sync: ' + st.machines.map((m) => `${m.machine} ${m.commit || 'never'}`).join(' · '));"],
  ['D133 any machine row counts as authoring the head', "  if (mine && same(mine.commit, st.head)) return { state: 'IN_SYNC'", "  if (mine) return { state: 'IN_SYNC'"],
  ['D133 DIVERGED does not outrank the heads', '  if (diverged && diverged.length) {\n    return { state: \'DIVERGED\'', '  if (false) {\n    return { state: \'DIVERGED\''],
  ['D133 a short and a long hash of one commit read as different commits', '(a.startsWith(b) || b.startsWith(a))', '(a === b)'],
  ['D133 --status does not compare rows', '  const st = writeStatus(DATA, STATE, diverged);', '  const st = writeStatus(DATA, STATE, null);'],
  ['the record carries the shortfall but not the paths, so the launcher gets a count again',
    '        why: shortfallWhy(rec), failures: rec.missing, missing: rec.missing,',
    '        why: shortfallWhy(rec), failures: rec.missing, missing: [],'],
  ['the shortfall reason names no path', "    + named.slice(0, 3).join('; ')", "    + ''"],
  ['the report prints the kind but not the path — 46 all over again',
    '    console.error(`    ${m.kind.padEnd(10)} ${m.path}`);',
    '    console.error(`    ${m.kind.padEnd(10)}`);'],

  // ── the arriving roster (D056-1) ──
  // Every one of these is a way for the migrate to land a roster that spawns four seats into a
  // directory that is not there, which is what happened on 2026-09-09 and cost four seats with no
  // log line. The last five are in the CHECKER, because the guard this packet replaced a comment
  // with is only worth what its own failure modes are worth.
  ['no arrival transform runs at all — the roster arrives as a copy, which is the bug',
    '    const t = transformFor(f.path, ctx.rules);', '    const t = null;'],
  ['the foreign cwd is adopted verbatim — 0 of 4 resolve, exactly as measured',
    "    let cwd = was && typeof was.cwd === 'string' && underRoot(was.cwd, ctx.instances) ? was.cwd : null;",
    "    let cwd = typeof r.cwd === 'string' ? r.cwd : null;"],
  ['the destination\'s own record is ignored, so every install re-mints and nothing converges',
    "    let cwd = was && typeof was.cwd === 'string' && underRoot(was.cwd, ctx.instances) ? was.cwd : null;",
    '    let cwd = null;'],
  ['the roster promises directories that are never created',
    '        if (row && row.cwd) fs.mkdirSync(row.cwd, { recursive: true });',
    '        void row;'],
  ['the minted dir is not a sibling, so role_for_kept resumes the seat as human',
    '    const cand = path.join(root, `sibling-${flat.slice(0, n)}`);',
    '    const cand = path.join(root, `kept-${flat.slice(0, n)}`);'],
  ['the transform UNIONS instead of replacing — the roster doubles every round trip',
    "    buf: Buffer.from(JSON.stringify(rows, null, 2) + '\\n', 'utf8'),",
    "    buf: Buffer.from(JSON.stringify(rows.concat(prior.filter((p) => p && !arrivedIds.has(p.pane))), null, 2) + '\\n', 'utf8'),"],
  ['an absent home defaults to THIS machine — E\'s F4 residual, and it doubles the roster',
    '    const home = r.home || (was && was.home) || ctx.pushedBy;',
    '    const home = machineTag();'],
  ['the label is dropped, so an adopted seat comes back unnamed',
    "    const row = { pane: r.pane, cwd, label: typeof r.label === 'string' ? r.label : '' };",
    "    const row = { pane: r.pane, cwd, label: '' };"],
  ['a transformed path is never reconciled — the transform is unguarded after it runs',
    '    if (t && t.verify) {', '    if (false) {'],
  ['the postcondition accepts a roster that will not parse — read_kept() reads that as ZERO panes',
    '  const d = readJsonArray(destBuf);\n  if (d.err) {',
    '  const d = readJsonArray(destBuf);\n  if (false) {'],
  ['the postcondition accepts a cwd that does not resolve',
    '      return { ok: false, why: `${r.pane}: cwd does not resolve on this machine: ${r.cwd}` };',
    '      st = { isDirectory: () => true };'],
  ['the postcondition does not check that the adopted ids are the arriving set',
    '  if (got.length !== want.length || want.some((p, i) => got[i] !== p)) {', '  if (false) {'],
  ['a transform that REFUSES is installed anyway',
    '      if (r.err) {', '      if (false) {'],

  ['the checker tolerates a `precondition` — the comment that cannot fail, kept',
    '    if (r.precondition) {', '    if (false) {', 'state-manifest.js'],
  ['the checker tolerates an on_arrival nothing implements',
    '      if (!VALID_ARRIVAL.includes(r.on_arrival)) {', '      if (false) {', 'state-manifest.js'],
  ['the checker tolerates a transform on a rule that never arrives',
    "      if (r.class !== 'TRAVELS') {", '      if (false) {', 'state-manifest.js'],
  ['the checker tolerates a transform that declares no out-of-root target',
    '      if (!outOfRoot.some((e) => e.handled_by === r.on_arrival)) {', '      if (false) {', 'state-manifest.js'],
  ['the checker tolerates an UNDECIDED out-of-root target with no decider — an omission with a label',
    "    if (e.class === 'UNDECIDED' && !e.decided_by) {", '    if (false) {', 'state-manifest.js'],
  // L091 (pane C) — every launch leaves a trip row in sync-completion.json's `trips`
  ['a launch OVERWRITES the trip log instead of appending (the D112 debt, back)',
    '  const out = { ...rec, trips: trips.concat([tripOf(rec)]) };', '  const out = { ...rec, trips: [tripOf(rec)] };'],
  ['a record written before trips existed is dropped instead of becoming the first trip',
    '      trips = Array.isArray(prev.trips) ? prev.trips : [tripOf(prev)];', '      trips = Array.isArray(prev.trips) ? prev.trips : [];'],
  ['an unreadable previous file is erased SILENTLY (no trips_note)',
    '  if (note) out.trips_note = note;', '  if (false) out.trips_note = note;'],
  ['a trip row carries the per-line lists instead of the counts trip-check reads',
    '  refused: (r.refused || []).map((x) => ({ path: x.path, kind: x.kind, local_only: x.local_only, incoming_only: x.incoming_only })),', '  refused: r.refused || [],'],
];

/** Every target's pristine bytes, read once, before anything is written. */
const ORIGINALS = { 'state-sync.js': original, 'state-manifest.js': fs.readFileSync(CHECKER, 'utf8') };
const fileOf = (m) => m[3] || 'state-sync.js';

// --only is checked against the list BEFORE anything runs: an id outside it is a refusal, never a run of
// zero mutants reported as clean.
if (onlyArg.only !== null && (onlyArg.only < 1 || onlyArg.only > MUTANTS.length)) {
  console.error(`state-sync.mutants: --only ${onlyArg.only} is not a mutant; ids are 1..${MUTANTS.length}.`);
  unlock();
  process.exit(2);
}

// THE TRIPWIRE ON `original` ITSELF. If a tracked source already carries one of our own replacements,
// someone left a mutation in it (an older in-place run, or another writer). This harness no longer writes
// either file, so it cannot repair that — it refuses, and names what it found.
const alreadyMutated = MUTANTS.filter((m) => ORIGINALS[fileOf(m)].includes(m[2]));
if (alreadyMutated.length) {
  console.error('state-sync.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.');
  for (const m of alreadyMutated) console.error(`  ${m[0]}\n    found in ${fileOf(m)}: ${m[2]}`);
  console.error('  Restore the file from git before running this again.');
  unlock();
  process.exit(2);
}

/** Run the suite with BOTH pointers on their copies. true = the suite went red. */
function suiteRedOnCopies() {
  try {
    execFileSync(process.execPath, [SUITE], {
      stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8',
      env: { ...process.env, [POINTER['state-sync.js']]: COPIES['state-sync.js'], [POINTER['state-manifest.js']]: COPIES['state-manifest.js'] },
    });
    return false;
  } catch (_) { return true; }
}

let killed = 0;
let notApplied = 0;
const survivors = [];
const selected = MUTANTS.map((m, i) => [i + 1, m]).filter(([id]) => onlyArg.only === null || id === onlyArg.only);
try {
  // PRE-FLIGHT: both unmutated copies, both pointers set, and the suite must be GREEN. If it is red for any
  // other reason, every mutant below would read as "killed" without earning it (the false 50/50, 2026-09-09).
  for (const f of Object.keys(COPIES)) fs.writeFileSync(COPIES[f], ORIGINALS[f]);
  if (suiteRedOnCopies()) {
    console.error('state-sync.mutants: the suite is RED against UNMUTATED copies — no mutant can be scored. Fix that first.');
    process.exitCode = 2;
  } else {
    for (const [id, m] of selected) {
      const [name, from, to] = m;
      const file = fileOf(m);
      const src = ORIGINALS[file];
      const hits = src.split(from).length - 1;
      if (hits === 0) {
        notApplied++;
        survivors.push(`#${id} ${name}  — MUTATION DID NOT APPLY: the anchor is gone from ${file}, so this defect is unguarded and unmeasured`);
        console.log(`  ????  #${id} ${name}  (NOT APPLIED: anchor missing in ${file})`);
        continue;
      }
      // Kept from the in-place harness, and said out loud: an anchor that occurs more than once mutates its FIRST
      // occurrence (three of this list's anchors do, measured 2026-09-15). The port keeps that measurement.
      const note = hits > 1 ? `  (first of ${hits} matches in ${file})` : '';
      // One mutant, one copy: the OTHER copy is reset to its original before every run.
      for (const f of Object.keys(COPIES)) fs.writeFileSync(COPIES[f], f === file ? src.replace(from, () => to) : ORIGINALS[f]);
      if (suiteRedOnCopies()) { killed++; console.log(`  killed  #${id} ${name}${note}`); }
      else { survivors.push(`#${id} ${name}${note}`); console.log(`  SURVIVED  #${id} ${name}${note}`); }
    }
  }
} finally {
  dropCopies();
  unlock();
}
if (process.exitCode === 2) process.exit(2);

// Both tracked files must be byte-identical to what this run read. This harness never writes them, so a
// difference is ANOTHER writer — reported, never "restored".
for (const [name, p] of Object.entries(FILES)) {
  if (fs.readFileSync(p, 'utf8') !== ORIGINALS[name]) {
    console.error(`state-sync.mutants: ${name} CHANGED DURING THIS RUN, and not by this harness. Check git diff before trusting any count above.`);
    process.exitCode = 3;
  }
}

console.log('');
console.log(`state-sync.mutants.js: ${killed} killed, ${survivors.length - notApplied} survived, ${notApplied} not applied, ${selected.length} run of ${MUTANTS.length} total${onlyArg.only !== null ? ` (--only ${onlyArg.only})` : ''}`);
if (survivors.length) {
  console.log('');
  console.log('  A SURVIVOR IS A BEHAVIOUR NOTHING WATCHES. Each of these can be broken and the suite');
  console.log('  still reports green:');
  for (const s of survivors) console.log(`    ${s}`);
}
process.exit(process.exitCode === 3 ? 3 : survivors.length ? 1 : 0);
