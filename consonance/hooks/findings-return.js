// findings-return.js — the RETURN path (build piece 3 of 3, build_ruling.md C5):
// a UserPromptSubmit hook that surfaces unread, audited DISAGREEs from the findings
// ledger to the ORIGINATING pane at its next real user turn. Surfaces, never hauls.
//
// WHY THIS MOMENT AND NO OTHER. Board lines do not land: ferry miss 80.0%
// (`node consonance/tools/ferry.js --report`); the board carried 18 multi-pane laps in
// its life while being ~95% one pane. The keeper's carries land because they arrive as
// real user turns — the one event that resets attention (second_vantage §1 Attack B).
// This hook rides exactly that event, the same mechanism that already lands "the
// interval, witnessed" every turn. NOTHING SYNCHRONOUS ENTERS STOP — the four refusals
// in sourced-stop.js hold; this file must never become that gate through a side door.
//
// THE FOUR LAWS OF THIS FILE (each has a test; each was shown to fail under mutation):
//   1. MISSES ARE LINES, NOT ABSENCES (ferry's law). Every surfacing event — and every
//      DISAGREE that matched this pane but could NOT surface (held unaudited, malformed)
//      — leaves a row in the return ledger, and holds are announced to the pane as a
//      count+reason line, once. Silent non-delivery is the failure this arc catalogues.
//   2. UNREAD MEANS UNREAD. A per-pane watermark of surfaced finding ids. A finding
//      surfaces exactly once, ever. Overflow past the per-turn cap rides the NEXT turn —
//      that is a first surfacing, not a re-send. Delivery is written BEFORE the
//      watermark on purpose: if the process dies between, the cost is one visible
//      duplicate, never an invisible loss.
//   3. C6 — THE CAVEAT TRAVELS MECHANICALLY. If the assembled block mentions F0 in any
//      way, the dual-denominator line is appended by regex, not by a future writer's
//      memory: F0's record is 2/2 on the reachable subset AND 2 of 16 of the curated
//      record. (That sentence, here in the header, is itself C6-compliant.)
//   4. COUNTS ARRIVE AS COUNTS, NEVER AS MOODS. The block renders "claim / reader ran /
//      reader got" — ledger fields verbatim, the row outranking the rendering. No
//      advice, no "you may want to double-check", no instruction to the receiving pane
//      at all. The pane decides what to do; the light does not haul.
//
// WHAT THIS IS NOT, said loudly because this pane killed it in sourced_form_design.md:
// this is NOT the generation-time form re-imported. It carries an OBJECT (a specific
// re-derivation of a specific shipped value) after the ship — catch-latency compression,
// the artifact-time half that survived. TRIPWIRE for future hands: the moment this file
// surfaces a norm ("remember to check"), a compliance rate, or anything not anchored to
// one ledger row, it has become the killed thing through the side door — delete the
// wire and re-read sourced_form_design.md §1 and sourced-stop.js's refusals.
//
// FILTERS, each from a binding condition:
//   verdict DISAGREE only        — AGREEs surface nowhere; they are ledger rows (C5).
//   audited === true only        — an unaudited DISAGREE does not surface (C3); it is
//                                  announced as a held count, content withheld.
//   world_moved !== true         — WORLD-MOVED surfaces as nothing (C2, binding); it is
//                                  not a miss, it is a classified non-event; no trace.
//   row.pane === this pane       — originating pane only, matched on basename(cwd), the
//                                  same convention sourced-stop.js writes. KNOWN BOUND:
//                                  pane identity here is the mount, not a property of
//                                  the instance (the 2026-08-11 lesson); a pane whose
//                                  cwd moves mid-life will miss its returns.
//
// CONSUMPTION CONTRACT — RESOLVED 2026-08-15 (was provisional; A's schema is the authority
// and this file adapts to it via normalize(), not the reverse). The provisional flat schema
// this file was first built against never matched what A emits — that mismatch shipped and
// was caught the same day (the A→K joint; see attached.test.js). A's row, as consumed here:
//   top-level:  id (watermark key), ts, claim, verdict, commands[] (joined for display),
//               evidence (rendered as the derived value)
//   source:     { session, pane (basename of claiming pane's cwd), turn_ts, head }
//   audit:      { clean (bool — C3 gate), reason }
//   world:      { checked, moved (bool — C2 gate), claimHead, currentHead }
//   a row missing id is watermarked under sha1(line) so it can never loop; a DISAGREE
//   missing claim/commands/evidence is a MALFORMED hold — announced, traced, never looped.
//
// HARNESS LAW (same as every hook here): reads stdin JSON, exits 0 always, emits either
// nothing or one hookSpecificOutput JSON; a thrown error traces to the return ledger and
// still exits 0 — a return path must never break the turn it rides.
// The dream gate holds: the gap-dream is an anti-instruction and gets no instrumentation.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

if (process.env.CONSONANCE_DREAM) process.exit(0);

// THE WIRE (agreed 2026-08-15 after the split was measured): the PRODUCER names its artifact.
// second-vantage.js writes VANTAGE_FINDINGS || <VANTAGE_DATA>/vantage_findings.jsonl; this file
// reads the same name through the same env vars, and consonance/tools/attached.test.js goes red
// if either side drifts. No FINDINGS_LEDGER fallback — a tolerant reader is how this joint
// stayed green while detached.
const DATA = process.env.VANTAGE_DATA || 'C:\\Consonance\\data';
const FINDINGS = process.env.VANTAGE_FINDINGS || path.join(DATA, 'vantage_findings.jsonl');
const RETURNS = process.env.RETURN_LEDGER || 'C:\\Consonance\\data\\return_ledger.jsonl';
const STATEDIR = process.env.RETURN_STATE_DIR || 'C:\\Consonance\\data\\return_state';
const MAX_PER_TURN = 5;          // overflow rides the next turn — first surfacing, not re-send
const CLAIM_CAP = 300;           // the row outranks the rendering; truncation says so
const TAIL_BYTES = 1024 * 1024;

const F0_CAVEAT = 'F0 record, both denominators (C6): 2/2 on the reachable subset; ' +
  '2 of 16 of the curated record.';

// Wire introspection for the attachment test — resolved paths, nothing else, exit 0.
if (process.argv.includes('--where')) {
  process.stdout.write(JSON.stringify({ FINDINGS, RETURNS, STATEDIR }));
  process.exit(0);
}

function readStdin() {
  try { return fs.readFileSync(0, 'utf8').replace(/^\uFEFF/, ''); } catch (_) { return ''; }
}
function sha1(s) { return crypto.createHash('sha1').update(s).digest('hex').slice(0, 12); }
function oneLine(s) { return String(s).replace(/\s*\r?\n\s*/g, ' '); }

function tailLines(file) {
  let text, truncated = false;
  try {
    const fd = fs.openSync(file, 'r');
    try {
      const size = fs.fstatSync(fd).size;
      const start = Math.max(0, size - TAIL_BYTES);
      truncated = start > 0;
      const buf = Buffer.alloc(size - start);
      fs.readSync(fd, buf, 0, buf.length, start);
      text = buf.toString('utf8');
    } finally { fs.closeSync(fd); }
  } catch (_) { return []; }
  const lines = text.split(/\r?\n/);
  if (truncated && lines.length) lines.shift();   // first tail line may be a torn record
  return lines.filter(l => l.trim());
}

// Per-pane watermark file; only this pane's hook writes it, so there is no cross-pane
// write contention (the .chair-token lesson: two writers on one file cost an hour).
function statePath(pane) { return path.join(STATEDIR, pane.replace(/[^\w.-]/g, '_') + '.json'); }
function readState(pane) {
  try {
    const s = JSON.parse(fs.readFileSync(statePath(pane), 'utf8'));
    return { surfaced: new Set(s.surfaced || []), logged: new Set(s.logged || []) };
  } catch (_) { return { surfaced: new Set(), logged: new Set() }; }
}
function writeState(pane, st) {
  fs.mkdirSync(STATEDIR, { recursive: true });
  fs.writeFileSync(statePath(pane), JSON.stringify({
    surfaced: [...st.surfaced].slice(-500),
    logged: [...st.logged].slice(-500),
  }));
}

// The return ledger: every surfacing event and every hold, as lines. A failed trace
// must never kill the turn, but it does not fail silently into nothing either — there
// is no deeper channel; this IS the bottom one.
function trace(row) {
  try {
    fs.mkdirSync(path.dirname(RETURNS), { recursive: true });
    fs.appendFileSync(RETURNS, JSON.stringify(row) + '\n');
  } catch (_) { /* the floor of the world */ }
}

// THE A→K JOINT: ledger rows are second-vantage's schema (its header, posted 2026-08-15:
// source{session,pane,turn_ts,head}, audit{clean,reason}, world{checked,moved,...},
// commands[], evidence, plus top-level id/ts/claim/verdict). Per this file's own contract
// note, A's post is the authority and this file adapts to it, not the reverse. The mapping
// is STRICT — no flat-field fallback — because a tolerant reader is how a detached joint
// stays green (measured on this very wire, 2026-08-15).
function normalize(r) {
  if (!r || typeof r !== 'object') return null;
  const src = (r.source && typeof r.source === 'object') ? r.source : {};
  const out = {
    id: r.id, ts: r.ts, claim: r.claim, verdict: r.verdict,
    pane: src.pane, session: src.session, head: src.head,
    audited: !!(r.audit && r.audit.clean === true),
    world_moved: !!(r.world && r.world.moved === true),
  };
  if ('claimed' in r) out.claimed = r.claimed;   // A never emits it; a set-but-undefined key
                                                 // rendered "claim said: undefined" (e2e, first run)
  if (Array.isArray(r.commands) && r.commands.length) out.command = r.commands.join(' ; ');
  if (typeof r.evidence === 'string' && r.evidence) out.derived = r.evidence;
  return out;
}

function main() {
  let input;
  try { input = JSON.parse(readStdin()); } catch (_) { return; }
  const cwd = input && input.cwd;
  if (!cwd) return;
  const pane = path.basename(cwd);

  // Law 1, applied to this file's own input: a findings ledger that is ABSENT or EMPTY is a
  // LINE, once per pane, never a silent early return — the A→K filename split lived behind
  // exactly that silence for a full build cycle (2026-08-15). One announcement, then quiet:
  // the pre-first-run state is normal and must not become dream-watch's nag.
  const st = readState(pane);
  const missing = !fs.existsSync(FINDINGS);
  const allLines = missing ? [] : tailLines(FINDINGS);
  if (missing || !allLines.length) {
    const key = 'wire:' + (missing ? 'absent' : 'empty') + ':' + FINDINGS;
    if (!st.logged.has(key)) {
      st.logged.add(key);
      const note = 'Second-vantage return path: findings ledger ' +
        (missing ? 'ABSENT' : 'EMPTY') + ' at ' + FINDINGS + ' (env VANTAGE_FINDINGS). ' +
        'The return path is idle — non-coverage, not verification. ' +
        'This line appears once per pane; trace: ' + RETURNS + '.';
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: note },
      }));
      writeState(pane, st);
      trace({ ts: new Date().toISOString(), pane, event: missing ? 'ledger-absent' : 'ledger-empty', path: FINDINGS });
    }
    return;
  }

  const due = [], holds = [];
  for (const line of allLines) {
    let r;
    try { r = JSON.parse(line); } catch (_) { continue; }
    r = normalize(r);
    if (!r || r.pane !== pane) continue;
    if (String(r.verdict || '').toUpperCase() !== 'DISAGREE') continue;  // AGREEs surface nowhere (C5)
    if (r.world_moved === true) continue;             // WORLD-MOVED surfaces as nothing (C2)
    const id = r.id || ('sha1:' + sha1(line));
    if (st.surfaced.has(id)) continue;                // unread means unread — once, ever
    if (r.audited !== true) {                         // C3: unaudited does not surface —
      if (!st.logged.has(id)) holds.push({ id, reason: 'held-unaudited' });   // but it is a LINE
      continue;
    }
    if (!r.claim || !r.command || !('derived' in r)) {
      if (!st.logged.has(id)) holds.push({ id, reason: 'malformed-row' });
      continue;
    }
    due.push({ id, r });
  }
  if (!due.length && !holds.length) return;

  const batch = due.slice(0, MAX_PER_TURN);
  const lines = [];
  if (batch.length) {
    lines.push('## Second vantage — DISAGREE returned');
    lines.push('');
    lines.push('A blind reader re-derived the value(s) below from the world and got a different ' +
      `answer. Fields are verbatim from the findings ledger (${FINDINGS}); the row outranks this ` +
      'rendering. This block carries DISAGREEs only — the absence of a row is non-coverage, ' +
      'never verification.');
    lines.push('');
    for (const { id, r } of batch) {
      let claim = oneLine(r.claim);
      if (claim.length > CLAIM_CAP) claim = claim.slice(0, CLAIM_CAP) + ' … [truncated; full row in ledger]';
      lines.push(`- claim: "${claim}"`);
      lines.push(`  reader ran: \`${oneLine(r.command)}\``);
      lines.push(`  reader got: ${oneLine(r.derived)}` +
        (('claimed' in r) ? ` · claim said: ${oneLine(r.claimed)}` : ''));
      lines.push(`  claim-time HEAD: ${r.head || '(absent from row)'} · id: ${id}` +
        (r.ts ? ` · ${r.ts}` : ''));
    }
    lines.push('');
  }
  if (holds.length) {
    lines.push(`${holds.length} DISAGREE row(s) for this pane are recorded but not surfaced — ` +
      holds.map(h => `${h.id}: ${h.reason}`).join('; ') +
      `. Ledger: ${FINDINGS}; trace: ${RETURNS}.`);
    lines.push('');
  }
  let block = lines.join('\n');
  // C6, mechanically: any F0 mention carries both numbers, appended here rather than
  // remembered by whoever wrote the row.
  if (/\bF0\b/i.test(block)) block += '\n' + F0_CAVEAT + '\n';

  // Delivery before watermark: if we die between the two, the cost is one visible
  // duplicate next turn — never an invisible loss (law 2's ordering clause).
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: block },
  }));

  for (const { id } of batch) st.surfaced.add(id);
  for (const h of holds) st.logged.add(h.id);
  writeState(pane, st);
  trace({
    ts: new Date().toISOString(),
    pane,
    session: String(input.session_id || '').slice(0, 8),
    surfaced: batch.map(b => b.id),
    misses: holds,
  });
}

try { main(); } catch (e) {
  try { trace({ ts: new Date().toISOString(), event: 'hook-error', error: String((e && e.message) || e) }); } catch (_) {}
}
process.exit(0);
