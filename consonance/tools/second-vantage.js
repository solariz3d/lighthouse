#!/usr/bin/env node
// second-vantage.js — the clock-fired blind reader. Build piece 2 of 3 under build_ruling.md §5.
//
// WHAT IT IS. A duration goal wakes this on a clock (~/.claude/shell/duration/second-vantage/
// goal.json, cron '5 9 * * *' local — the firing is a clock's decision, nobody's judgment).
// It reads sourced-stop's ledger rows since a watermark, selects per second_vantage.md §3's
// tier, and spawns a FRESH `claude -p` instance per selected claim holding ONLY the claim
// sentence and the repo root — not the transcript, not the reasoning (the ultrareview's six
// same-frame verifier groups produced zero disagreement over a set ~18% wrong; the object
// routes, never a description). The reader re-derives the value from the world and returns
// AGREE/DISAGREE plus its commands. Findings append to a ledger; K's return path surfaces them.
//
// SEAT REACH — a named scope bound, not a discovery left for later (is_it_positional.md §4b):
// the sourced-stop sensor scans assistant TURN TEXT. Panes ship their figures through Write
// into committed artifacts — B's figure-dense chunk-2 session parsed to 7,283 text chars and
// ZERO value-turn matches. Therefore: the net-matched tiers (artifact/middle) reach only claims
// asserted in turn text, in whichever sessions have the sourced-stop hook registered — today
// that is effectively the CHAIR'S CHANNEL. The floor tier samples every seat's turns but the
// same text channel. Figures INSIDE committed files are cite-check's jurisdiction, not this
// reader's. If the hook is registered only for Main, this is a chair-only instrument until
// that registration changes — which is a settings decision, made elsewhere, named here.
//
// THE CONDITIONS THIS FILE IS BUILT UNDER (build_ruling.md §5 — the ruling, not commentary):
//   C1 SCOPE LOCK — token-truth claims only. Tiers: artifact-bound 100%; middle at a modest
//      rate (non-state kinds above state-kind); an UNCONDITIONAL floor of ALL turns at 3%.
//      THE FLOOR IS NOT A TUNING KNOB — it is the anti-Goodhart clause: without it the net
//      becomes a gate by prior and the shape leaves the text. No verdict-shaped or move-shaped
//      claim is ever routed; a floor reader that finds no token claim returns NO-CLAIM.
//   C2 THE ROW IS LOAD-BEARING — no reader launches on a row lacking the matched sentence,
//      the touched paths, and claim-time HEAD. Such rows become UNLAUNCHABLE findings-rows,
//      visible as lines, never absences (ferry's law). WORLD-MOVED ≠ WRONG: a DISAGREE at the
//      current tree is re-run against the claim-time tree (git worktree at row head); if the
//      claim-time reader does not also DISAGREE, the finding is WORLD-MOVED and surfaces as
//      nothing.
//   C3 COMMAND AUDIT BEFORE SURFACING — the corrections live in the tree the readers are
//      handed (F0 finding 3). Every DISAGREE's reported commands+evidence are audited
//      mechanically; a reference to journals, the loop directory, or any prose .md outside the
//      row's own touched paths disqualifies the finding (DISQUALIFIED-CONTAMINATED, no
//      surface). The audit is deliberately asymmetric: its false positives cost a lost catch,
//      never a false one.
//   C5 — nothing here runs at Stop; the sensor's four refusals are untouched. This file runs
//      off-turn on a clock and appends rows; K's piece surfaces them on a real user turn.
//   C6 — every surfaced finding row CARRIES the dual-denominator F0 caveat as data
//      (F0_CITATION below), so the surfacing text cannot drop it by forgetting.
//   C7 — this file, its test, and the duration goal. Nothing else.
//
// BLINDNESS, and its two disclosed leaks (reusing F0_result.md §5 rather than reinventing):
//   1. Readers are told to derive from the primary object and not from prose documents — this
//      leaks that prose documents exist; accepted because the in-repo answer key would
//      otherwise convert a lookup into a fake catch. The command audit backstops it.
//   2. Readers launch from a BARE CELL directory (VANTAGE_CELL), not the repo root: the repo's
//      CLAUDE.md instructs "read exo_memory/BOOT.md" — the room, corrections included — so a
//      reader launched at the repo root would be walked into the answer key by the repo's own
//      onboarding. The repo path travels inside the brief instead. This is a tighter blind
//      than F0's (whose Agent-tool readers held the spawning pane's context).
//
// CONSUMED ROW CONTRACT (posted to the board; B owns the emitting side in sourced-stop.js).
// Base fields already emitted: ts, session, pane, turn_ts, values[], sourced, tools.
// C2 enrichment this reader REQUIRES before launching:
//   sentences : string[]  matched claim sentence(s), capped short   (tiers artifact/middle)
//   excerpt   : string    capped text extract, rows with no match    (floor tier only)
//   wrote     : string[]  Write/Edit target paths of the turn
//   read      : string[]  Read/Grep/Glob target paths of the turn
//   head      : string    git rev-parse HEAD at claim time ('' allowed = repo state unknown,
//                          row is then UNLAUNCHABLE for DISAGREE-surfacing purposes)
// Rows missing these do not launch and are recorded UNLAUNCHABLE, naming the missing fields —
// interface drift between the three pieces fails LOUD here, not silently (the fifteen-instance
// lesson; a validator that silently zeroes is the defect this arc catalogued).
//
// FINDINGS LEDGER (this file's output; K builds against the schema as posted to the board):
//   one JSON line per processed selection — misses included:
//   { id, ts, source:{session,pane,turn_ts,head}, tier, claim, verdict, commands[], evidence,
//     audit:{clean,reason}, world:{checked,moved,claimHead,currentHead},
//     status: SURFACE | AGREE | CANNOT-SETTLE | NO-CLAIM | DISQUALIFIED-CONTAMINATED |
//             WORLD-MOVED | UNLAUNCHABLE | READER-FAILED,
//     surface: bool, caveat }
//   Only status SURFACE rows are for K to deliver. K keeps its own read-watermark; K never
//   writes this file.
//
//   node consonance/tools/second-vantage.js --run        select, spawn, audit, append
//   node consonance/tools/second-vantage.js --dry-run    select and print, spawn nothing
//   env: SOURCED_LEDGER, VANTAGE_FINDINGS, VANTAGE_DATA, VANTAGE_CELL
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const DATA = process.env.VANTAGE_DATA || 'C:\\Consonance\\data';
const LEDGER = process.env.SOURCED_LEDGER || path.join(DATA, 'sourced_ledger.jsonl');
const FINDINGS = process.env.VANTAGE_FINDINGS || path.join(DATA, 'vantage_findings.jsonl');
const WATERMARK = process.env.VANTAGE_WATERMARK || path.join(DATA, 'vantage_watermark.json');
const CELL = process.env.VANTAGE_CELL || path.join(DATA, 'vantage_cell');

// C6 — travels as data on every finding row. Both denominators, always.
const F0_CITATION = 'F0: 2/2 correct blind DISAGREEs on the reachable subset; 2 of 16 of the record';

// C1 — fixed constants. The floor is the anti-Goodhart clause and is NOT a tuning knob.
const FLOOR_PER_MILLE = 30;              // 3% of ALL rows, matched or not, unconditional
const MIDDLE_NONSTATE_PER_MILLE = 250;   // 25% — judgment, stated as such (L §3: "modest")
const MIDDLE_STATE_PER_MILLE = 100;      // 10% — state-kind ran ~half metaphor (catch_latency)
const NON_STATE_KINDS = new Set(['count', 'timestamp', 'version', 'port', 'linecount']);

// C3 — contamination: tokens that mean the reader read ABOUT the claim instead of the world.
// Kept as a module constant so the test can demonstrate the guard failing when it is removed.
const CONTAMINATION = [
  /exo_memory[\\\/](journal|loop)\b/i,
  /\bjournal\b/i,
  /branch_evidence/i,
  /scorecard/i,
  /\bBOOT\.md\b/i,
  /\bMEMORY\.md\b/i,
  /is_it_positional/i,
];

function sha(s) { return crypto.createHash('sha256').update(s).digest(); }
function hashSelect(row, salt, perMille) {
  return sha(`${row.session}|${row.turn_ts}|${salt}`).readUInt32BE(0) % 1000 < perMille;
}

// ---------- selection (C1) ----------
function tierOf(row) {
  const matched = Array.isArray(row.values) && row.values.length > 0;
  if (matched && Array.isArray(row.wrote) && row.wrote.length > 0) return 'artifact'; // 100%
  if (matched) {
    const nonState = row.values.some(k => NON_STATE_KINDS.has(k));
    const rate = nonState ? MIDDLE_NONSTATE_PER_MILLE : MIDDLE_STATE_PER_MILLE;
    if (hashSelect(row, 'middle', rate)) return 'middle';
  }
  if (hashSelect(row, 'floor', FLOOR_PER_MILLE)) return 'floor'; // unconditional lottery
  return null;
}

// ---------- C2 gate ----------
function rowLaunchable(row, tier) {
  const missing = [];
  if (tier === 'floor' && (!Array.isArray(row.values) || !row.values.length)) {
    if (!row.excerpt) missing.push('excerpt');
  } else if (!Array.isArray(row.sentences) || !row.sentences.length) missing.push('sentences');
  if (!Array.isArray(row.wrote)) missing.push('wrote');
  if (!Array.isArray(row.read)) missing.push('read');
  if (typeof row.head !== 'string' || !row.head) missing.push('head');
  return { ok: missing.length === 0, missing };
}

function claimOf(row, tier) {
  if (Array.isArray(row.sentences) && row.sentences.length) return row.sentences.join(' … ');
  return row.excerpt || '';
}

// ---------- the brief: the object, never a description ----------
function brief(row, tier, repoRoot) {
  const claim = claimOf(row, tier);
  const floorLead = tier === 'floor'
    ? 'First decide: does this passage assert a SPECIFIC CHECKABLE VALUE about the repository ' +
      '(a count, size, path, version, timestamp, state)? If it asserts none, return ' +
      'VERDICT: NO-CLAIM and stop. Otherwise: '
    : '';
  return (
    `You are a blind verifier. A shipped sentence claims:\n"${claim}"\n\n` +
    `${floorLead}Re-derive the actual value from the repository at ${repoRoot} using file reads ` +
    `and commands. Derive it from the PRIMARY OBJECT the claim is about — do not open journals, ` +
    `memory files, or prose documents that discuss or correct claims. Judge only whether the ` +
    `claimed value matches what you measure.\n\nReturn EXACTLY this format:\n` +
    `VERDICT: AGREE | DISAGREE | CANNOT-SETTLE | NO-CLAIM\n` +
    `COMMANDS:\n<each command or file you consulted, one per line, with its decisive output>\n` +
    `EVIDENCE: <one sentence>`
  );
}

// ---------- real spawner (injectable for tests) ----------
function spawnReaderReal(briefText, repoRoot) {
  fs.mkdirSync(CELL, { recursive: true });
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (/^CLAUDE/i.test(k)) delete env[k];
  const r = cp.spawnSync('claude',
    ['-p', briefText, '--output-format', 'text', '--allowedTools', 'Bash,Read,Grep,Glob'],
    { cwd: CELL, env, encoding: 'utf8', timeout: 240000 });
  if (r.error || r.status !== 0) {
    return { failed: true, raw: `${r.error ? r.error.message : ''}\n${r.stderr || ''}`.trim() };
  }
  return { failed: false, raw: r.stdout || '' };
}

function parseReader(raw) {
  const verdict = (raw.match(/VERDICT:\s*(AGREE|DISAGREE|CANNOT-SETTLE|NO-CLAIM)/i) || [])[1];
  const cmds = [];
  const m = raw.match(/COMMANDS:\s*\n([\s\S]*?)(?:\nEVIDENCE:|$)/i);
  if (m) for (const l of m[1].split(/\r?\n/)) if (l.trim()) cmds.push(l.trim());
  const evidence = (raw.match(/EVIDENCE:\s*(.+)/i) || [])[1] || '';
  return { verdict: verdict ? verdict.toUpperCase() : null, commands: cmds, evidence };
}

// ---------- C3 audit ----------
// The claim's own object is exempt even when it lives under a blocked directory or is itself
// a .md ("BOOT.md is ~43 KB" is settled by stat'ing BOOT.md; run1 fixtures live under
// exo_memory/loop/). Mechanism: MASK every occurrence of the row's own paths (and their
// basenames, for cwd-relative citations) out of the reader's report FIRST; anything that still
// matches a CONTAMINATION token or references a .md afterwards disqualifies. Directory tokens
// (journal/, loop/) survive basename masking, so a same-named file elsewhere cannot smuggle a
// blocked directory through. blocklist is a parameter ONLY so the test can show the guard
// failing without it; production callers never pass one.
function maskOwn(text, row) {
  const frags = new Set();
  for (const p of [...(row.wrote || []), ...(row.read || [])]) {
    let s = String(p).replace(/\\/g, '/');
    frags.add(path.basename(s));
    while (s && s !== '.' && s !== '/') {          // the path and every ancestor directory:
      const up = path.dirname(s);                   // locating the object is not contamination,
      if (up === s) break;                          // and other FILES in those dirs still trip
      frags.add(s);                                 // the extension fence below by basename.
      s = up;                                       // The fixpoint break is load-bearing:
      if (s === '.') break;                         // dirname('C:/') === 'C:/', so absolute
    }                                               // Windows paths — the only kind production
    // rows carry — looped here FOREVER (found 2026-08-15 by attached.test.js's first realistic
    // row; every prior fixture was repo-relative). The drive root is never added: masking 'C:/'
    // out of a reader's report would blind the audit to every absolute path on the machine.
  }
  let t = text;
  for (const f of [...frags].filter(Boolean).sort((a, b) => b.length - a.length)) {
    for (const v of new Set([f, f.replace(/\//g, '\\')])) t = t.split(v).join('«OWN»');
  }
  return t;
}

function audit(finding, row, blocklist) {
  const rules = blocklist || CONTAMINATION;
  const text = maskOwn([...finding.commands, finding.evidence].join('\n'), row);
  for (const re of rules) {
    const hit = text.match(re);
    if (hit) return { clean: false, reason: `contamination: ${hit[0]}` };
  }
  // the fence: any surviving reference to an answer-bearing file class. The record's answer
  // keys are prose (.md), instrument rows (.jsonl), and preserved turn captures (.txt).
  const ref = text.match(/[\w./\\-]+\.(md|jsonl|txt)\b/i);
  if (ref) return { clean: false, reason: `answer-class file outside row paths: ${ref[0]}` };
  return { clean: true, reason: '' };
}

// ---------- C2 world check ----------
function currentHead(repoRoot) {
  const r = cp.spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : '';
}

function worldCheck(row, tier, repoRoot, spawner) {
  const cur = currentHead(repoRoot);
  if (!row.head || !cur || row.head === cur) {
    return { checked: false, moved: false, claimHead: row.head || '', currentHead: cur };
  }
  const wt = fs.mkdtempSync(path.join(require('os').tmpdir(), 'vantage-wt-'));
  let moved = false;
  try {
    const add = cp.spawnSync('git', ['worktree', 'add', '--detach', wt, row.head],
      { cwd: repoRoot, encoding: 'utf8' });
    if (add.status !== 0) {
      // cannot reconstruct claim-time world: per C2 the DISAGREE may NOT surface
      return { checked: false, moved: true, claimHead: row.head, currentHead: cur,
               note: 'claim-time tree unavailable; DISAGREE withheld' };
    }
    const then = parseReader(spawner(brief(row, tier, wt), wt).raw || '');
    moved = then.verdict !== 'DISAGREE'; // must disagree in BOTH worlds to surface
  } finally {
    cp.spawnSync('git', ['worktree', 'remove', '--force', wt], { cwd: repoRoot, encoding: 'utf8' });
  }
  return { checked: true, moved, claimHead: row.head, currentHead: cur };
}

// ---------- one selection, end to end ----------
function processRow(row, tier, repoRoot, spawner) {
  const base = {
    id: sha(`${row.session}|${row.turn_ts}|${tier}`).toString('hex').slice(0, 16),
    ts: new Date().toISOString(),
    source: { session: row.session, pane: row.pane, turn_ts: row.turn_ts, head: row.head || '' },
    tier, claim: claimOf(row, tier), verdict: null, commands: [], evidence: '',
    audit: { clean: false, reason: '' },
    world: { checked: false, moved: false, claimHead: row.head || '', currentHead: '' },
    status: '', surface: false, caveat: F0_CITATION,
  };
  const gate = rowLaunchable(row, tier);
  if (!gate.ok) return { ...base, status: 'UNLAUNCHABLE', evidence: `row missing: ${gate.missing.join(', ')}` };

  const run = spawner(brief(row, tier, repoRoot), repoRoot);
  if (run.failed) return { ...base, status: 'READER-FAILED', evidence: (run.raw || '').slice(0, 300) };
  const parsed = parseReader(run.raw);
  Object.assign(base, parsed);
  if (!parsed.verdict) {
    return { ...base, status: 'READER-FAILED', evidence: 'unparseable: ' + run.raw.slice(0, 300) };
  }
  if (parsed.verdict !== 'DISAGREE') return { ...base, status: parsed.verdict, surface: false };

  base.audit = audit(parsed, row);
  if (!base.audit.clean) return { ...base, status: 'DISQUALIFIED-CONTAMINATED' };
  base.world = worldCheck(row, tier, repoRoot, spawner);
  if (base.world.moved) return { ...base, status: 'WORLD-MOVED' };
  return { ...base, status: 'SURFACE', surface: true };
}

// ---------- the B→A joint: schema v2 in, internal fields out ----------
// sourced-stop.js emits ROW SCHEMA v2 (its header is the posted contract: claims[]{kinds,
// channel,sentence,path}, paths[], heads{toplevel:sha}). This reader's internal fields
// (sentences/wrote/read/head) predate that post and were never emitted by anyone — measured
// 2026-08-15, the same day the A→K name split was. The producer names the artifact, so the
// consumer adapts, HERE at the input boundary and nowhere else. Mapping:
//   sentences <- claims[].sentence          wrote <- claims[channel==='artifact'].path
//   read      <- paths[]                    head  <- heads[<this repo's toplevel>]
// v1 rows (no claims[]) pass through unmapped and fail the C2 gate loudly as UNLAUNCHABLE —
// correct, they carry no claim/paths/head. KNOWN GAP, B's side: v2 carries no `excerpt`, so
// floor-tier selections of claimless rows are UNLAUNCHABLE until schema v3 adds it —
// pinned green-and-loud in attached.test.js rather than left to be rediscovered.
function fromV2(row) {
  if (!row || typeof row !== 'object' || !Array.isArray(row.claims)) return row;
  const sentences = row.claims.map(c => c && c.sentence).filter(Boolean);
  const wrote = row.claims.filter(c => c && c.channel === 'artifact' && c.path).map(c => c.path);
  const heads = (row.heads && typeof row.heads === 'object') ? row.heads : {};
  const repoKey = REPO.replace(/\\/g, '/').toLowerCase();
  let head = '';
  for (const [top, sha] of Object.entries(heads)) {
    if (String(top).toLowerCase() === repoKey) { head = String(sha); break; }
  }
  if (!head) {
    const vals = Object.values(heads);
    if (vals.length === 1) head = String(vals[0]); // one repo touched: unambiguous
  }
  return { ...row, sentences, wrote, read: Array.isArray(row.paths) ? row.paths : [], head };
}

// ---------- the run ----------
function readLedger() {
  if (!fs.existsSync(LEDGER)) {
    console.error(
      `second-vantage: FATAL — sourced ledger not found.\n` +
      `expected: ${LEDGER}\n` +
      `That file is written by consonance/hooks/sourced-stop.js (one row per turn). If it lives\n` +
      `elsewhere, set SOURCED_LEDGER. A reader that treats a missing ledger as an empty one\n` +
      `reports a clean silence — the exact defect this room has fifteen instances of.`);
    process.exit(1);
  }
  return fs.readFileSync(LEDGER, 'utf8').split(/\r?\n/).filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean).map(fromV2);
}

function run(dry) {
  const mark = fs.existsSync(WATERMARK) ? JSON.parse(fs.readFileSync(WATERMARK, 'utf8')) : { ts: '' };
  const rows = readLedger().filter(r => !mark.ts || (r.ts && r.ts > mark.ts));
  const picked = [];
  for (const row of rows) { const t = tierOf(row); if (t) picked.push({ row, tier: t }); }
  console.log(`second-vantage: ${rows.length} rows since watermark, ${picked.length} selected ` +
    `(${picked.filter(p => p.tier === 'artifact').length} artifact / ` +
    `${picked.filter(p => p.tier === 'middle').length} middle / ` +
    `${picked.filter(p => p.tier === 'floor').length} floor)`);
  if (dry) { for (const p of picked) console.log(`  [${p.tier}] ${claimOf(p.row, p.tier).slice(0, 100)}`); return; }

  fs.mkdirSync(path.dirname(FINDINGS), { recursive: true });
  const counts = {};
  for (const p of picked) {
    const finding = processRow(p.row, p.tier, REPO, spawnReaderReal);
    fs.appendFileSync(FINDINGS, JSON.stringify(finding) + '\n');
    counts[finding.status] = (counts[finding.status] || 0) + 1;
    console.log(`  [${finding.status}] ${finding.claim.slice(0, 80)}`);
  }
  // misses stay visible as lines, not absences — ferry's law
  console.log(`second-vantage: outcomes ${JSON.stringify(counts)}; ` +
    `${counts.SURFACE || 0} to surface; findings -> ${FINDINGS}`);
  if (rows.length) {
    const last = rows.reduce((a, r) => (r.ts > a ? r.ts : a), mark.ts || '');
    fs.writeFileSync(WATERMARK, JSON.stringify({ ts: last, at: new Date().toISOString() }));
  }
}

module.exports = {
  tierOf, rowLaunchable, hashSelect, brief, parseReader, audit, worldCheck, processRow, claimOf,
  fromV2, F0_CITATION, CONTAMINATION, FLOOR_PER_MILLE, REPO, LEDGER, FINDINGS,
};

if (require.main === module) {
  const a = process.argv.slice(2);
  if (a.includes('--run')) run(false);
  else if (a.includes('--dry-run')) run(true);
  else if (a.includes('--where')) console.log(JSON.stringify({ LEDGER, FINDINGS, WATERMARK, CELL }));
  else { console.log('usage: second-vantage.js --run | --dry-run | --where   (see header)'); process.exit(2); }
}
