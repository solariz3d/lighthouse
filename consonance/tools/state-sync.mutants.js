#!/usr/bin/env node
'use strict';
// state-sync.mutants.js — run with: node state-sync.mutants.js
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
// The source is restored from an in-memory copy at the end and on any throw, including SIGINT.

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

// A LOCK, BECAUSE THIS FILE ALREADY DAMAGED THE SOURCE ONCE (2026-09-09, A).
//
// Two runs overlapped. The second read its `original` off a file the first had already mutated,
// and its own `finally { restore() }` then wrote THAT back as the truth — so a mutation survived
// the pass, the suite went red for the rest of the night, and another seat reported the redness as
// mine before I noticed. The defect was permanent precisely because the repair step ran.
//
// This is the shared-write class the room has now measured three times (`git add -A` capturing
// another seat's file; `git commit` taking the shared index at 38ae5c2). Same shape, one file over:
// a tool that mutates a path nobody else is expected to be holding, with nothing enforcing it.
//
// `wx` fails if the lock exists — no check-then-create window. A stale lock after a crash must be
// removed BY HAND and the source checked against git first, because a crash is exactly the case
// where the restore did not run.
try {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
} catch (e) {
  console.error(`state-sync.mutants: another run holds ${LOCK}`);
  console.error('  Refusing to start. A second run reads its "original" from the first run\'s');
  console.error('  MUTATED source and then restores that as the truth — measured, 2026-09-09.');
  console.error('  If no run is live, check state-sync.js against git BEFORE deleting the lock.');
  process.exit(2);
}

const original = fs.readFileSync(SRC, 'utf8');

function unlock() { try { fs.unlinkSync(LOCK); } catch (_) { /* already gone */ } }

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
  ['the reconciliation is not run at all — the install\'s own count stands as the claim',
    '    rec = reconcileInstall(DATA, v);',
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
];

/** Every target's pristine bytes, read once, before anything is written. */
const ORIGINALS = { 'state-sync.js': original, 'state-manifest.js': fs.readFileSync(CHECKER, 'utf8') };
const fileOf = (m) => m[3] || 'state-sync.js';

function restore() {
  for (const [name, p] of Object.entries(FILES)) fs.writeFileSync(p, ORIGINALS[name]);
}
process.on('SIGINT', () => { restore(); unlock(); process.exit(130); });

// THE TRIPWIRE ON `original` ITSELF. If the source we just read already carries one of our own
// replacements, a previous pass did not clean up, `original` is not original, and restoring it
// would make yesterday's mutation permanent — which is exactly what happened once.
const alreadyMutated = MUTANTS.filter((m) => ORIGINALS[fileOf(m)].includes(m[2]));
if (alreadyMutated.length) {
  restore.skip = true;
  console.error('state-sync.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.');
  for (const m of alreadyMutated) console.error(`  ${m[0]}\n    found in ${fileOf(m)}: ${m[2]}`);
  console.error('  Restore the file from git before running this again. Restoring from here');
  console.error('  would write the mutation back as the truth.');
  unlock();
  process.exit(2);
}

let killed = 0;
const survivors = [];
try {
  for (const m of MUTANTS) {
    const [name, from, to] = m;
    const file = fileOf(m);
    const src = ORIGINALS[file];
    if (!src.includes(from)) {
      survivors.push(`${name}  — MUTATION DID NOT APPLY: the anchor is gone from ${file}, so this defect is unguarded and unmeasured`);
      console.log(`  ????  ${name}  (anchor missing in ${file})`);
      continue;
    }
    fs.writeFileSync(FILES[file], src.replace(from, to));
    let red = false;
    try {
      execFileSync(process.execPath, [SUITE], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
    } catch (_) { red = true; }
    fs.writeFileSync(FILES[file], src); // put this target back before the next mutant picks another
    if (red) { killed++; console.log(`  killed  ${name}`); }
    else { survivors.push(name); console.log(`  SURVIVED  ${name}`); }
  }
} finally {
  restore();
  unlock();
}

console.log('');
console.log(`state-sync.mutants.js: ${killed} killed, ${survivors.length} survived, ${MUTANTS.length} total`);
if (survivors.length) {
  console.log('');
  console.log('  A SURVIVOR IS A BEHAVIOUR NOTHING WATCHES. Each of these can be broken and the suite');
  console.log('  still reports green:');
  for (const s of survivors) console.log(`    ${s}`);
}
process.exit(survivors.length ? 1 : 0);
