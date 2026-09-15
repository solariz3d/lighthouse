#!/usr/bin/env node
'use strict';
// tail-carry.mutants.js — run with: node dev/tail-carry.mutants.js [--only <id>]
//
//   --only <id>   run exactly one mutant; <id> is the number printed before each mutant (1-based, list order)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks one guard at a time
// and requires `tail-carry.test.js` to go RED for each break. A mutant that SURVIVES is a behaviour
// nothing watches — and on this tool nearly every one of those is a way for a conversation to be
// silently forked, truncated, or concatenated with a different future of itself on a machine the
// person running the command cannot see.
//
// **The first mutant in the list is the whole design.** Weakening the import gate from
// `size === offset` to `size >= offset` is not a typo someone might make — it is exactly what plan
// §8 bar (2) specifies. If that mutant survives, this file's central claim is unmeasured.
//
// THE LOCK AND THE TRIPWIRE ARE NOT CEREMONY — `close.mutants.js` carries the incident: a second
// run read its `original` off a first run's MUTATED file and its own `finally { restore() }` wrote
// the mutation back as the truth. The damage was permanent BECAUSE the cleanup ran.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'tail-carry.js');
const SUITE = path.join(__dirname, 'tail-carry.test.js');
const LOCK = path.join(__dirname, '.tail-carry.mutants.lock');

// ─────────────────────────────────────────────────────────────────────────────────────────────
// THE TRACKED SOURCE IS NEVER WRITTEN. (L059 §5, pane A, 2026-09-14.)
//
// This harness used to write each mutant INTO tail-carry.js and restore it in a `finally` and a SIGINT
// handler. That protects nothing a kill can reach: measured on L tonight, SIGTERM, SIGINT and
// `taskkill /F` from another process run no handler at all — not even `exit`. A run killed mid-mutant
// therefore leaves the mutant in the tracked file, and it happened: a timed-out background run left
// "a run that did not run exits 1" live in tail-carry.js at 02:02, found by the chair before landing.
// Third instance of one defect (lap-row.js 09-06, state-sync.js and tail-carry.js tonight).
//
// So each mutant is written into a COPY beside the real file — `.tail-carry.mutant-<pid>.js`, in this
// directory so every relative require and the main.rs lookup resolve exactly as they do for the real
// file — and the suite is pointed at the copy through TAIL_CARRY_UNDER_TEST. A kill at any instant
// leaves, at worst, an untracked copy and a lock naming a dead pid. The next run sweeps both. There is
// no restore step, because there is nothing to restore.
// ─────────────────────────────────────────────────────────────────────────────────────────────
const COPY = path.join(__dirname, `.tail-carry.mutant-${process.pid}.js`);
const COPY_RE = /^\.tail-carry\.mutant-(\d+)\.js$/;

/**
 * --only <id> (P-HARNESS, 2026-09-15): run exactly one mutant. <id> is the number printed before each mutant
 * (1-based, list order). Parsed BEFORE the lock, so a bad argument leaves nothing behind.
 */
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
if (onlyArg.error) { console.error(`tail-carry.mutants: ${onlyArg.error}`); process.exit(2); }

/** Is this pid a live process? `kill(pid, 0)` sends nothing; it only asks. EPERM means alive. */
function alive(pid) {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}

// A LOCK LEFT BY A KILLED RUN IS NOW THE EXPECTED CASE, not an anomaly — a kill runs no handler, so it
// never unlocks. A live holder still refuses this run. A dead holder's lock is taken over, and it is
// safe to take over for one reason only: the tracked source is re-checked against every mutant below
// before anything runs, and this harness cannot have written it.
try {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
} catch (e) {
  const holder = parseInt(String(fs.readFileSync(LOCK, 'utf8')).split(/\s/)[0], 10);
  if (Number.isInteger(holder) && alive(holder)) {
    console.error(`tail-carry.mutants: a live run (pid ${holder}) holds ${LOCK} — refusing to start.`);
    process.exit(2);
  }
  console.error(`tail-carry.mutants: taking over a lock left by pid ${holder}, which is not running (a killed run).`);
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`);
}

for (const f of fs.readdirSync(__dirname)) {
  const m = f.match(COPY_RE);
  if (m && Number(m[1]) !== process.pid && !alive(Number(m[1]))) {
    fs.unlinkSync(path.join(__dirname, f));
    console.error(`tail-carry.mutants: swept a copy left by killed run pid ${m[1]}: ${f}`);
  }
}

const original = fs.readFileSync(SRC, 'utf8');
function unlock() { try { fs.unlinkSync(LOCK); } catch (_) {} }
function dropCopy() { try { fs.unlinkSync(COPY); } catch (_) {} }

const MUTANTS = [
  // ── the design ──
  ['THE SPEC AS WRITTEN: the import gate accepts a destination that has moved (size >= offset)',
    '    if (size > pend.offset) {', '    if (false) {'],
  ['a fork is treated as an interrupted carry and repaired over',
    '      const isPrefixOfTail = extra <= row.tail.length && already.equals(row.tail.subarray(0, already.length));',
    '      const isPrefixOfTail = true;'],
  ['a repair happens without being named on the command line',
    "        row.verdict = repair.has(seat.sid) ? 'REPAIR' : 'INTERRUPTED';", "        row.verdict = 'REPAIR';"],
  ['the far machine\'s own conversation is replaced without being named',
    "      row.verdict = retireFar.has(seat.sid) ? 'RETIRE_THEN_FULL' : 'REFUSED';", "      row.verdict = 'RETIRE_THEN_FULL';"],

  ['an import writes into files the running app holds open',
    "    if (running) {\n      return no('Consonance is running', [", "    if (false) {\n      return no('Consonance is running', ["],
  ['an unanswerable "is the app up" lets an import through',
    "    if (running === null) return no('cannot tell whether Consonance is running'", "    if (false) return no('cannot tell whether Consonance is running'"],
  ['the app gate is applied to the EXPORT too, which only reads',
    "  if (o.mode === 'import' && apply) {", '  if (apply) {'],

  // ── identity ──
  ['the key is not compared, so a different conversation under the same sid is appended to',
    '    if (k.key !== entry.key) {', '    if (false) {'],
  ['the key is the first record rather than the first TIMESTAMPED record',
    "    if (o && typeof o.timestamp === 'string') return { key: sha256(Buffer.from(l, 'utf8')), line: l, why: null };",
    "    return { key: sha256(Buffer.from(l, 'utf8')), line: l, why: null };"],
  ['a half-read line can become an identity',
    '  const usable = head.length >= size ? lines : lines.slice(0, -1);', '  const usable = lines;'],
  ['the export stops checking the key against the agreed conversation',
    '    if (entry.key !== k.key) {', '    if (false) {'],

  // ── the ledger ──
  ['the ledger may disagree with itself about where the tail starts',
    '    if (entry.agreed && entry.agreed.offset !== pend.offset) {', '    if (false) {'],
  ['a ledger written by another version is read anyway',
    '  if (led.version !== LEDGER_VERSION) throw new Error(`ledger version ${led.version}, this tool speaks ${LEDGER_VERSION}`);',
    '  if (false) throw new Error(`ledger version ${led.version}, this tool speaks ${LEDGER_VERSION}`);'],
  ['an export overwrites a tail the other machine has not imported',
    "    if (entry && entry.pending && entry.pending.from !== machine) {", '    if (false) {'],
  ['a run that carries nothing still writes state onto the stick',
    "  if (!plan.rows.some((r) => r.verdict === 'TAIL' || r.verdict === 'FULL')) return done;", '  if (false) return done;'],

  // ── the bytes ──
  ['the tail on the stick is not checked against its own sha256',
    '    if (sha256(tail) !== pend.tailSha) {', '    if (false) {'],
  ['the tail\'s length is not checked against the span the ledger claims',
    '    if (tail.length !== pend.toOffset - pend.offset) {', '    if (false) {'],
  ['the rejoined file is not verified whole after the append',
    '    const ok = full === pend.fullSha && size === pend.toOffset;', '    const ok = true;'],
  ['a source that SHRANK is carried anyway',
    '    if (row.size < agreed.offset) {', '    if (false) {'],
  ['a rewritten history is exported as though it were an append',
    '    if (prefix !== agreed.prefixSha) {', '    if (false) {'],
  ['a source that grew DURING the read is written as if it had not',
    '    if (after.size !== row.size) {', '    if (false) {'],
  ['a missing destination is rebuilt from a delta',
    '      if (pend.offset === 0) { row.verdict = \'FULL\'; rows.push(row); continue; }',
    '      { row.verdict = \'FULL\'; rows.push(row); continue; }'],

  // ── the repair ──
  ['the pre-truncate copy is not kept',
    '      fs.copyFileSync(row.dest, asideTo);\n      fs.truncateSync(row.dest, pend.offset);',
    '      void asideTo;\n      fs.truncateSync(row.dest, pend.offset);'],
  // ── ONE RETIREMENT ADDRESS (P-STICK §2) ──
  ['THE OLD CONVENTION: --retire-far renames in place beside the live file instead of into the attic',
    "      asideTo = atticPath(plan.projectsRoot, slug, row.sid, 'retire-far', now);",
    '      asideTo = `${row.dest}.retired-${stamp(now)}`;'],
  ['the REPAIR copy is kept in place beside the live file instead of in the attic',
    "      asideTo = atticPath(plan.projectsRoot, slug, row.sid, 'pre-truncate', now);",
    '      asideTo = `${row.dest}.pre-truncate-${stamp(now)}`;'],
  ['the attic stamp is UTC ISO rather than the local YYYYMMDD-HHMMSS main.rs writes',
    '  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;',
    '  return stamp(now);'],

  // ── THE --json CONTRACT ──
  ['--json lets the human lines onto stdout',
    '  const human = (s) => (json ? io.stderr : io.stdout)(`${s}\\n`);', '  const human = (s) => io.stdout(`${s}\\n`);'],
  ['a bad argument under --json exits 2 with NO object on stdout',
    "      return finish({ code: EXIT.RAN_NOT, outcome: 'CANNOT_RUN', why: `unknown argument: ${a}` });",
    '      return EXIT.RAN_NOT;'],
  ['an unanticipated exception escapes as a stack trace and exit 1, with no object',
    "    res = { code: EXIT.CRASHED, outcome: 'CRASHED', why: String(e && e.message ? e.message : e) };",
    '    throw e;'],
  ['a run that did not run exits 1, indistinguishable from a seat refusing',
    "    return { ok: false, code: EXIT.RAN_NOT, outcome: outcome || 'CANNOT_RUN', why };",
    "    return { ok: false, code: 1, outcome: outcome || 'CANNOT_RUN', why };"],
  ['INTERRUPTED stops counting as a stop, so a rehearsal over it exits 0',
    "const STOPS = ['REFUSED', 'DIVERGED', 'INTERRUPTED', 'ABSENT_HERE'];", "const STOPS = ['REFUSED', 'DIVERGED', 'ABSENT_HERE'];"],
  ['a rehearsal that would carry reports NOTHING_TO_DO, so the app skips the --apply',
    "    const outcome = refused ? 'STOPPED' : (wouldCarry ? 'REHEARSED' : 'NOTHING_TO_DO');",
    "    const outcome = refused ? 'STOPPED' : 'NOTHING_TO_DO';"],
  ['STOPPED is named over FAILED, hiding the written-but-wrong seat',
    "  const outcome = bad ? 'FAILED' : refused ? 'STOPPED' : done.some((d) => d.ok) ? 'CARRIED' : 'NOTHING_TO_DO';",
    "  const outcome = refused ? 'STOPPED' : bad ? 'FAILED' : done.some((d) => d.ok) ? 'CARRIED' : 'NOTHING_TO_DO';"],
  ['a different conversation is REFUSED with no reason code, so the app must read prose',
    "        row.reason = 'OTHER_CONVERSATION';\n", '        void 0; // mutant: no reason\n'],
  ['retirable is always true, so the app retries --retire-far into a second refusal',
    '        row.retirable = pend.offset === 0;', '        row.retirable = true;'],
  ['an unread seat reports 0 bytes here instead of null',
    '    const row = { ...seat, src, verdict: null, why: null, offset: 0, size: null, bytes: 0, key: null };',
    '    const row = { ...seat, src, verdict: null, why: null, offset: 0, size: 0, bytes: 0, key: null };'],
  ['the row stops carrying this machine\'s first timestamp, ARRIVING\'s launch-born test input',
    '      localFirstTimestamp: lineTimestamp(r.keyLine),', '      localFirstTimestamp: null,'],
  ['the row drops exportedAt — a field that is sometimes missing',
    '      exportedAt: pend ? (pend.at || null) : null,\n', '      // mutant: exportedAt dropped\n'],
  ['the import row names the SOURCE path, not the file it judged',
    "      path: mode === 'export' ? r.src : r.dest,", '      path: r.src,'],

  ['atticPath stops counting and hands back a name that is already taken',
    '    if (!exists(p)) return p;', '    if (true) return base;'],

  // ── the gate ──
  ['the settle gate accepts a file that is being written right now',
    '    if (age < settleMs) { sleepSync(Math.min(settleMs - age + 5, settleMs)); continue; }', '    if (false) { continue; }'],
  ['a FUTURE mtime is waited out instead of refused',
    "    if (st.mtimeMs > now() + 1000) return { st: null, why: 'FUTURE_MTIME — the clock moved, or something is writing with a time we cannot reason about' };",
    '    if (false) return { st: null, why: 1 };'],
  ['the rehearsal writes after all', '  if (!apply) {', '  if (false) {'],

  // ── L059 §3 as re-ruled: A-2, the transfer set rewritten with the ledger ──
  ['A-2 UNDONE: the import rewrites the ledger but not the manifest — every arrival reads mismatched',
    '  done.transfer = writeTransferSet(stick, led, plan.machine);    // A-2: the import rewrites the manifest too',
    '  // mutant: import does not rewrite the manifest'],
  ['the export writes no transfer set at all',
    '  done.transfer = writeTransferSet(stick, led, machine);         // A-2: same step, after the ledger',
    '  // mutant: export writes no transfer set'],
  ['the manifest leaves out the pending tails',
    '  for (const s of Object.keys(led.seats).sort()) { const p = led.seats[s].pending; if (p && p.tailFile) rels.push(`${LEDGER_DIR}/${p.tailFile}`); }',
    '  void 0; // mutant: no tail members'],
  ['the HANDOFF reads something other than the ledger, so the same ledger renders different bytes',
    "  L.push(`Ledger as of ${at || 'no carry recorded'}. This file is rewritten every time the ledger is written.`);",
    '  L.push(`Ledger as of ${Math.random()}. This file is rewritten every time the ledger is written.`);'],
  ['a hand-written HANDOFF at the generated name is not checked before the seats are written',
    '    if (foreignHandoff(target)) {', '    if (false) {'],

  // ── A-3: one lock, every writer ──
  ['A-3 UNDONE: a writing run takes no ledger lock',
    '  const lock = apply ? takeLedgerLock(o.stick, { now, imageOf: o.imageOf }) : null;', '  const lock = null;'],
  ['a rehearsal takes the lock too, so a held lock blocks reading',
    '  const lock = apply ? takeLedgerLock(o.stick, { now, imageOf: o.imageOf }) : null;',
    '  const lock = true ? takeLedgerLock(o.stick, { now, imageOf: o.imageOf }) : null;'],
  ['a LIVE holder of the ledger lock is taken over as if it were stale',
    '      if (holderLive(held, o.imageOf)) {', '      if (false) {'],
  ['a holder that cannot be checked is treated as DEAD, letting a second writer through',
    '  if (img === undefined) return true;                                  // cannot tell: treat as alive',
    '  if (img === undefined) return false;'],
  ['pid reuse by another image counts as the live holder',
    "  return img !== null && img === String(rec.image || '').toLowerCase();", '  return img !== null;'],
  ['the ledger lock is never released', '    if (lock) lock.release();', '    void lock;'],
  ['a stale lock is taken over silently — staleLock is not reported',
    '    res.staleLock = lock && lock.stale ? lock.stale : null;', '    res.staleLock = null;'],
  ['the lock\'s directory is left behind by a run that carried nothing',
    '        if (madeDir) { try { fs.rmdirSync(dir); } catch (_) { /* not empty: something was carried */ } }',
    '        void madeDir;'],

  // ── --verify-set ──
  ['the OLDER layout (tonight\'s real stick) is not a stick',
    "    if (fs.existsSync(ledgerPath(stick))) { res.code = 0; res.layout = 'older'; return res; }",
    "    if (false) { res.code = 0; res.layout = 'older'; return res; }"],
  ['a member is checked by size only, so same-size different bytes verify',
    '    if (size !== m.bytes || hashRange(abs, 0, size) !== m.sha256) res.mismatched.push(rel);',
    '    if (size !== m.bytes) res.mismatched.push(rel);'],
  ['extra files fail the set, though tails are kept by design',
    '  res.code = res.missing.length || res.mismatched.length ? 1 : 0;',
    '  res.code = res.missing.length || res.mismatched.length || res.extra.length ? 1 : 0;'],
  ['a member path that escapes the stick is followed',
    '    if (!rel || (abs !== root && !abs.startsWith(root + path.sep))) { res.mismatched.push(rel); continue; }',
    '    if (!rel) { res.mismatched.push(rel); continue; }'],
  ['--verify-set silently combines with --import or --export',
    "    if (o.mode) return no('--verify-set is a reading on its own; it does not combine with --import or --export', []);",
    '    void 0; // mutant: combines'],

  // ── the killed import ──
  ['THE WEDGE: ALREADY_APPLIED is left unsettled, so a killed import blocks that seat\'s exports for good',
    '    if (SETTLES.includes(row.verdict)) {', '    if (false) {'],
  ['the row stops saying the ledger advanced (b258fc2)',
    '            advanced: d.ok === true },', '            advanced: false },'],
  ['an ALREADY_APPLIED seat is settled without re-verifying the file',
    // P-DIVERGED re-anchor: D-1 rewrote the settle's check to cover APPLIED_AND_GREW, and the old anchor went missing
    // (NOT APPLIED in the 90-mutant run on D, 2026-09-14). Same defect, the new line.
    '      const ok = (grew ? fileSize > pend.toOffset : fileSize === pend.toOffset) && full === pend.fullSha;', '      const ok = true;'],

  // ── E-3 ──
  ['E-3 UNDONE: no export records the incoming conversation\'s first timestamp',
    '    if (row.offset === 0 || !entry.firstTimestamp) entry.firstTimestamp = lineTimestamp(row.keyLine);', '    void 0; // mutant: no firstTimestamp'],
  ['R-4 UNDONE: a delta never fills a missing first timestamp — the real stick reads "unknown" for ever',
    '    if (row.offset === 0 || !entry.firstTimestamp) entry.firstTimestamp = lineTimestamp(row.keyLine);',
    '    if (row.offset === 0) entry.firstTimestamp = lineTimestamp(row.keyLine);'],
  ['R-4 broken the other way: a delta overwrites a first timestamp that is set',
    '    if (row.offset === 0 || !entry.firstTimestamp) entry.firstTimestamp = lineTimestamp(row.keyLine);',
    '    if (true) entry.firstTimestamp = lineTimestamp(row.keyLine);'],
  ['the import row reports this machine\'s first timestamp as the carried one',
    '      carriedFirstTimestamp: r.entry && r.entry.firstTimestamp ? r.entry.firstTimestamp : null,',
    '      carriedFirstTimestamp: lineTimestamp(r.keyLine),'],

  // ── the roster ──
  ['a seat main.rs no longer declares is silently dropped from the carry',
    '    if (!sid || !dir) return { seats: null, why: `${rs} no longer declares the ${name} seat where this tool reads it (sid:${!!sid} dir:${!!dir})` };',
    '    if (!sid || !dir) continue;'],

  // ── P-DIVERGED (L058, third use): --take-stick, D-1, D-7 and the three debts ──
  ['2.2: a DIVERGED seat is taken without being named',
    '      if (takeStick.has(seat.sid)) {',
    '      if (true) {'],
  ['2.2: an INTERRUPTED seat named for a take is taken instead of left INTERRUPTED',
    "        row.verdict = repair.has(seat.sid) ? 'REPAIR' : 'INTERRUPTED';",
    "        row.verdict = repair.has(seat.sid) ? 'REPAIR' : takeStick.has(seat.sid) ? 'RETIRE_THEN_APPEND' : 'INTERRUPTED';"],
  ['2.3: the take appends onto the fork without truncating — two futures concatenated',
    '      fs.truncateSync(row.dest, pend.offset);\n    }\n\n    fs.mkdirSync(path.dirname(row.dest), { recursive: true });',
    '      /* the take no longer truncates */\n    }\n\n    fs.mkdirSync(path.dirname(row.dest), { recursive: true });'],
  ['2.3: the take keeps no attic copy of this machine\'s future',
    '      fs.copyFileSync(row.dest, asideTo);\n      const liveSize = fs.statSync(row.dest).size;\n      if (fs.statSync(asideTo).size !== liveSize || hashRange(asideTo, 0, liveSize) !== hashRange(row.dest, 0, liveSize)) {',
    '      const liveSize = fs.statSync(row.dest).size;\n      if (false) {'],
  ['2.3: the attic copy is not read back before the truncate',
    '      if (fs.statSync(asideTo).size !== liveSize || hashRange(asideTo, 0, liveSize) !== hashRange(row.dest, 0, liveSize)) {',
    '      if (false) {'],
  ['2.3: the take files its copy under another tag than take-stick',
    "atticPath(plan.projectsRoot, slug, row.sid, 'take-stick', now)",
    "atticPath(plan.projectsRoot, slug, row.sid, 'taken', now)"],
  ['2.3: RETIRE_THEN_APPEND is planned but never applied (missing from DOES)',
    "  const DOES = ['APPEND', 'FULL', 'REPAIR', 'RETIRE_THEN_FULL', 'RETIRE_THEN_APPEND'];",
    "  const DOES = ['APPEND', 'FULL', 'REPAIR', 'RETIRE_THEN_FULL'];"],
  ['2.1: --take-stick is not parsed',
    "    else if (a === '--take-stick') o.takeStick.push(argv[++i]);\n",
    "    else if (a === '--take-stick-not-parsed') o.takeStick.push(argv[++i]);\n"],
  ['D-1 UNDONE: a seat holding the whole tail plus later turns reads DIVERGED (a take would truncate them)',
    '      if (size > pend.toOffset && hashRange(dest, 0, pend.toOffset) === pend.fullSha) {',
    '      if (false) {'],
  ['D-1 by length alone: a real fork longer than the tail reads APPLIED_AND_GREW',
    '      if (size > pend.toOffset && hashRange(dest, 0, pend.toOffset) === pend.fullSha) {',
    '      if (size > pend.toOffset) {'],
  ['D-1: APPLIED_AND_GREW is not settled under --apply',
    "  const SETTLES = ['ALREADY_APPLIED', 'APPLIED_AND_GREW'];",
    "  const SETTLES = ['ALREADY_APPLIED'];"],
  ['D-1: the settle re-verifies the whole file instead of the carried span',
    '      const size = grew ? pend.toOffset : fileSize;',
    '      const size = fileSize;'],
  ['D-7 UNDONE: RETIRE_THEN_APPEND is missing from CARRIES.import (its row says carries:false)',
    "'RETIRE_THEN_FULL', 'RETIRE_THEN_APPEND'] };",
    "'RETIRE_THEN_FULL'] };"],
  ['D-7 UNDONE: a DIVERGED row carries no bytes for the window',
    "    if (mode === 'import' && pend && r.verdict === 'DIVERGED') bytes =",
    '    if (false) bytes ='],
  ['2.4: takeable is true on every import row',
    "      takeable: mode === 'import' && r.verdict === 'DIVERGED' ? true : null,",
    "      takeable: mode === 'import' ? true : null,"],
  ['2.4: ownBytes on a fork counts from the tail\'s end instead of the shared prefix',
    "      if (r.verdict === 'DIVERGED' || r.verdict === 'RETIRE_THEN_APPEND') ownBytes = r.size - pend.offset;",
    "      if (r.verdict === 'DIVERGED' || r.verdict === 'RETIRE_THEN_APPEND') ownBytes = r.size - pend.toOffset;"],
  ['debt (a) UNDONE: a NOTHING_PENDING row does not read this machine\'s file ("unknown")',
    "row.verdict = 'NOTHING_PENDING'; readHere(row); rows.push(row);",
    "row.verdict = 'NOTHING_PENDING'; rows.push(row);"],
  ['debt (a) UNDONE for OURS: the reopen after this machine\'s own export shows "unknown"',
    "      row.why = `this tail was exported BY this machine (${machine}); it is for the other one`;\n      readHere(row);\n",
    "      row.why = `this tail was exported BY this machine (${machine}); it is for the other one`;\n      /* not read here */\n"],
  ['debt (b) UNDONE: this machine\'s own pending tail does not count as what the stick holds',
    '        row.size === entry.pending.toOffset && hashRange(src, 0, row.size) === entry.pending.fullSha) {',
    '        false) {'],
  ['debt (b) by length alone: a file rewritten at the same size reads as already on the stick',
    '        row.size === entry.pending.toOffset && hashRange(src, 0, row.size) === entry.pending.fullSha) {',
    '        row.size === entry.pending.toOffset) {'],
  ['debt (c) UNDONE: the HANDOFF promises APPEND for a delta it cannot see the far end of',
    "      : 'APPEND if that machine has written nothing of its own to this seat since the agreed state; DIVERGED if it has — the keeper chooses there';",
    "      : 'APPEND (a tail on the agreed state)';"],
];

// --only is checked against the list BEFORE anything runs: an id outside it is a refusal, never a run of zero
// mutants reported as clean.
if (onlyArg.only !== null && (onlyArg.only < 1 || onlyArg.only > MUTANTS.length)) {
  console.error(`tail-carry.mutants: --only ${onlyArg.only} is not a mutant; ids are 1..${MUTANTS.length}.`);
  unlock();
  process.exit(2);
}
const selected = MUTANTS.map((m, i) => [i + 1, ...m]).filter(([id]) => onlyArg.only === null || id === onlyArg.only);

const alreadyMutated = MUTANTS.filter(([, , to]) => original.includes(to));
if (alreadyMutated.length) {
  console.error('tail-carry.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.');
  for (const [name, , to] of alreadyMutated) console.error(`  ${name}\n    found: ${to}`);
  unlock();
  process.exit(2);
}

/** Run the suite against whatever is in COPY right now. true = the suite went red. */
function suiteRedOnCopy() {
  try {
    execFileSync(process.execPath, [SUITE], {
      stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8',
      env: { ...process.env, TAIL_CARRY_UNDER_TEST: COPY },
    });
    return false;
  } catch (_) { return true; }
}

let killed = 0;
let notApplied = 0;
const survivors = [];
try {
  // PRE-FLIGHT: the unmutated copy must be GREEN. If the suite is red for any other reason — a broken
  // seam, a missing file, a red test — every mutant below would read as "killed" without earning it.
  // That exact false 50/50 happened on 2026-09-09 (map/A.md, D056-1 run 1).
  fs.writeFileSync(COPY, original);
  if (suiteRedOnCopy()) {
    console.error('tail-carry.mutants: the suite is RED against an UNMUTATED copy — no mutant can be scored. Fix that first.');
    process.exitCode = 2;
  } else {
    for (const [id, name, from, to] of selected) {
      const hits = original.split(from).length - 1;
      if (hits !== 1) {
        notApplied++;
        survivors.push(`#${id} ${name}  — MUTATION DID NOT APPLY (${hits} matches): the anchor is gone or ambiguous, so this defect is unguarded and unmeasured`);
        console.log(`  ????  #${id} ${name}  (NOT APPLIED: anchor ${hits === 0 ? 'missing' : 'ambiguous'})`);
        continue;
      }
      // A FUNCTION replacement, never a string: a string replacement expands `$&`, `` $` `` and `$'`
      // inside the mutant text, which corrupted a test file in this lap (map/A.md, 2026-09-14).
      fs.writeFileSync(COPY, original.replace(from, () => to));
      if (suiteRedOnCopy()) { killed++; console.log(`  killed  #${id} ${name}`); }
      else { survivors.push(`#${id} ${name}`); console.log(`  SURVIVED  #${id} ${name}`); }
    }
  }
} finally {
  dropCopy();
  unlock();
}
if (process.exitCode === 2) process.exit(2);

// The tracked file must be byte-identical to what this run read. This harness never writes it, so a
// difference here is ANOTHER writer — the case that bit tonight — and it is reported, never "restored".
if (fs.readFileSync(SRC, 'utf8') !== original) {
  console.error('tail-carry.mutants: tail-carry.js CHANGED DURING THIS RUN, and not by this harness. Check git diff before trusting any count above.');
  process.exitCode = 3;
}

console.log('');
console.log(`tail-carry.mutants.js: ${killed} killed, ${survivors.length - notApplied} survived, ${notApplied} not applied, ${selected.length} run of ${MUTANTS.length} total${onlyArg.only !== null ? ` (--only ${onlyArg.only})` : ''}`);
if (survivors.length) {
  console.log('');
  console.log('  A SURVIVOR IS A BEHAVIOUR NOTHING WATCHES:');
  for (const s of survivors) console.log(`    ${s}`);
}
process.exit(process.exitCode === 3 ? 3 : survivors.length ? 1 : 0);
