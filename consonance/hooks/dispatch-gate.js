// dispatch-gate.js - ASK before a dispatch that carries no citation.
//
// WHY IT EXISTS, measured rather than argued. `ferry.js --report` on 2026-08-24: 109 measured
// artifact commits, 84 never put in front of another mind, a 77.1% miss rate - while `ferry-watch`
// printed "Route the OBJECT, not a description of it" in EVERY prompt for hours. The correction was
// present, correct, and read past. That is this room's own finding about its own reminders: one
// that fires regardless is ignored; one that carries a QUESTION and waits for an answer was acted
// on 60 of 60 times (brief/BUILDING.md, THE JOINT STEP).
//
// So this is deliberately the second kind. It does not print advice. It returns
// permissionDecision:"ask", which stops and asks a question that has to be answered before the
// dispatch leaves. Prose could not fix this, because prose is what already failed.
//
// WHAT IT IS ACTUALLY GUARDING, which is not tidiness. On the first night the librarian channel
// existed, the chair dispatched "your intake puts THE SHELF before THE ROOM it indexes" - a claim
// read off a failing assertion's implication and never checked against the source. The librarian
// ruled on it, WRONGLY, because the brief it was handed was wrong. A dispatch is un-revisable:
// once it renders in another seat's pane it is spent, and that seat begins reasoning from it. The
// cost of the missing citation is not an untidy transcript, it is a wrong answer in a second mind.
//
// It also fixes the ORDER, which is the mechanical half. Dispatching before committing makes citing
// a commit impossible - there is no sha yet - so the sequence itself forces prose. Asking here is
// asking "have you filed it first", at the only moment where the answer can still change.
//
// FAILS OPEN, always. Any error, any timeout, any shape it does not recognise: allow. A gate that
// can break a dispatch is worse than no gate - the same reasoning ferry-watch states about nags,
// one severity up. This may only ever ADD a question, never remove the ability to speak.
//
// KNOWN LIMIT, measured on the first live run and stated here because it decides how much this
// file is worth: BYPASS-PERMISSIONS MODE OVERRIDES "ask". An uncited dispatch went through with
// no prompt while `data/dispatch-gate.jsonl` recorded outcome:"asked", chars:80 - the hook ran,
// decided, and the decision was dropped. Under bypass the systemMessage below is all that reaches
// anyone, and a line that prints regardless is precisely the kind of reminder this room measured
// as ignorable. So: this gate BITES only when bypass is off. Under bypass it is a visible
// warning, which is better than silence and is NOT the mechanism the ferry rate needed.

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

// THE DREAM GATE. The gap-dream is an anti-instruction and gets no hooks. Kept here even though
// the dream runner dispatches nothing and would never trip this, because ferry-watch.js states
// the reason and it is the right one: a rule that holds only because a DIFFERENT guard happens to
// cover it breaks silently the day that guard moves. Placed above everything, so it precedes the
// entry point rather than merely existing in the file.
if (process.env.CONSONANCE_DREAM) process.exit(0);

/// The repo, resolved rather than assumed. `room_path` points at the room MASTER
/// (.../exo_memory/BOOT.md), so the repository is two directories up.
///
/// Returns null rather than guessing. A gate that silently checks citations against the wrong
/// tree would report every correct dispatch as uncited, and a gate that silently gives up is
/// indistinguishable from a satisfied one - which is the failure class this room keeps finding.
function repoRoot() {
  const env = (process.env.FERRY_REPO || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const room = String((JSON.parse(raw) || {}).room_path || '').trim();
    if (room) return path.dirname(path.dirname(room));
  } catch (_) { /* an unreadable config is not a repo path */ }
  return null;
}

const REPO = repoRoot();

/// Where the gate records that it ran. Same resolution order as the repo, and it degrades to null
/// rather than guessing - a ledger written somewhere unexpected is worse than none.
function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const d = String((JSON.parse(raw) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) {}
  return null;
}

/// Write one row per firing. THE POINT: an uncited dispatch went through with no prompt on
/// 2026-08-24 and two explanations looked identical from outside - bypass-permissions mode
/// overriding "ask", or the hook never running at all. A gate whose silence cannot be told from
/// its absence is the 08-17 failure, where three pipe tests returned `0 rows` and exit 0 and a
/// verdict was one step from being published on an instrument that was working the whole time.
///
/// Never throws, never blocks: a ledger that can break a dispatch is the thing this file refuses
/// to be.
function record(row) {
  try {
    const dir = dataDir();
    if (!dir) return;
    fs.appendFileSync(path.join(dir, 'dispatch-gate.jsonl'),
      JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n');
  } catch (_) { /* the gate's job is the question, not the bookkeeping */ }
}

// The two verbs that put text into another seat's pane. raise_pull is deliberately NOT here: it
// queues a card for a human to read and decide, so it is already gated by a person.
// ── GATE MODE, 2026-08-31 ────────────────────────────────────────────────────────────────────────
//
// 'print' keeps the ledger row and the systemMessage and DROPS permissionDecision, so the verb no
// longer stops for a click. 'ask' restores the prompt. ONE LINE turns it back on, deliberately —
// the keeper asked for this off during a working session and kept for after, not deleted.
//
// WHY IT IS OFF: 18 asked rows on the live ledger, every one a click he had to make, and the last
// was the chair dispatching prose with no sha — the chair failing the gate's own rule and the
// keeper paying for it. The gate is a cue for the chair; the cost was landing on him.
//
// AND IT IS AN EXPERIMENT, NOT A CONCESSION. This is exactly BRAVO's focal+PRINTS-no-ask cell —
// the 2x2 corner nothing could build, because a print at PreToolUse cannot change an already
// composed dispatch while an ask can. It now runs as a natural experiment on one subject for free.
// FALSIFIER, BRAVO's own and registered before the switch: if the cited-rate under 'print' does not
// fall well below the 90.4% measured under 'ask', THE ASK WAS NOT THE LEVER — and ASK-012's gated
// second vantage matters less than it was registered to.
//
// The ledger row carries `mode` from this timestamp so --report can split the rate by mode. Rows
// before it have no mode field and are 'ask' by construction; do not backfill them.
const GATE_MODE = 'print';           // 'print' | 'ask'  — flip this one word to restore the prompt
const GATE_MODE_SINCE = '2026-08-31';

const DISPATCH_VERBS = new Set([
  'mcp__consonance__chair_inject',
  'mcp__consonance__call_chair',
]);

// A genuine interrupt - "stop, you are about to clobber something" - claims nothing and must not
// wait on a citation. Opting out is a deliberate, visible act rather than a silent bypass: the
// token lands in the dispatched text and is readable by whoever receives it.
const INTERRUPT = /\[interrupt\]/i;

/// Does this text route an OBJECT? Pure, so both directions can be pinned without a repo.
///
/// `exists` and `shaOk` are injected: the tests give them fixtures, main gives them the filesystem
/// and git. Returns the KIND of citation found, or null. Kind matters in the question we ask - a
/// dispatch citing only paths may still be uncommitted, which is a different problem from one
/// citing nothing at all.
/// Returns { kind, token } - the KIND as `findCitation` always has, plus the exact string that
/// matched. The token is the JOIN KEY the outcome column needs (see THE OUTCOME COLUMN below);
/// without it a row records that *a* sha was cited and not *which*, which is unjoinable.
function findCitationDetail(text, exists, shaOk) {
  if (typeof text !== 'string' || !text) return { kind: null, token: null };
  if (INTERRUPT.test(text)) return { kind: 'interrupt', token: null };

  // shas first: they are the stronger citation because they pin content, not just a location
  for (const m of text.match(/\b[0-9a-f]{7,40}\b/g) || []) {
    if (shaOk(m)) return { kind: 'sha', token: m };
  }
  // then repo-relative paths. A trailing :line / :line-line is stripped - "main.rs:4818" is the
  // house citation format and must count.
  for (const raw of text.match(/[A-Za-z0-9_.\-/]+\/[A-Za-z0-9_.\-]+/g) || []) {
    const p = raw.replace(/[:.,;)\]]+$/, '').split(':')[0];
    if (p && exists(p)) return { kind: 'path', token: p };
  }
  return { kind: null, token: null };
}

/// Unchanged contract, kept as the thin wrapper it now is: other seats' analyses import this by
/// name and split transcripts with it (the L017 64.6%->96.2% retrospective is one), so its return
/// value must stay exactly what it was.
function findCitation(text, exists, shaOk) {
  return findCitationDetail(text, exists, shaOk).kind;
}

/// The question. It has to be answerable and specific, or it becomes the nag it replaces.
function buildQuestion(verb, dirty) {
  const who = verb.endsWith('call_chair') ? 'the orchestrator' : 'that seat';
  const lines = [
    `This dispatch to ${who} cites no commit and no repo path, so it carries a DESCRIPTION rather than an object.`,
    '',
    'A dispatch is un-revisable: once it renders, the receiving seat reasons from it and there is no edit.',
    'On 2026-08-24 an uncited, unverified claim sent this way produced a wrong ruling in the seat that received it.',
  ];
  if (dirty) {
    lines.push(
      '',
      'The working tree is DIRTY, so whatever this is about is probably not filed yet — which is also why there is',
      'no sha to cite. That is the order problem, not a formatting one.',
    );
  }
  lines.push(
    '',
    'Send it anyway only if it genuinely claims nothing. Otherwise: finish, verify, commit or write to a path,',
    'then dispatch citing it. If this IS a bare interrupt, put [interrupt] in the text and it will not be asked again.',
  );
  return lines.join('\n');
}

function isDirty() {
  try {
    const out = execFileSync('git', ['status', '--porcelain'], {
      cwd: REPO, encoding: 'utf8', timeout: 4000, maxBuffer: 4 * 1024 * 1024,
    });
    return out.trim().length > 0;
  } catch (_) {
    return false; // unknown is not dirty; never invent a reason to ask
  }
}

function main() {
  let input = '';
  try { input = fs.readFileSync(0, 'utf8'); } catch (_) { process.exit(0); }

  let payload;
  try { payload = JSON.parse(input); } catch (_) { process.exit(0); }

  const verb = payload && payload.tool_name;
  if (!DISPATCH_VERBS.has(verb)) process.exit(0);

  // No repo, no citation check. Allow - but SAY so, because a gate that quietly stops working
  // reads exactly like a gate that is being satisfied every time.
  if (!REPO) {
    record({ verb, outcome: 'inert', why: 'no repo resolved' });
    process.stdout.write(JSON.stringify({
      systemMessage: 'dispatch-gate is INERT: could not resolve the repo (set FERRY_REPO, or room_path in ~/.consonance.json). Dispatches are NOT being checked for citations.',
    }));
    process.exit(0);
  }

  const text = payload.tool_input && payload.tool_input.text;
  const exists = (p) => { try { return fs.existsSync(path.join(REPO, p)); } catch (_) { return false; } };
  const shaOk = (s) => {
    try {
      execFileSync('git', ['cat-file', '-t', s], {
        cwd: REPO, encoding: 'utf8', timeout: 4000, stdio: ['ignore', 'pipe', 'ignore'],
      });
      return true;
    } catch (_) { return false; }
  };

  // The target the text is about to land in, so a row can be joined to the pane that received it.
  // ONLY the target letter: `tool_input` also carries the chair token, and the text itself, and
  // neither belongs in a ledger that exists to be read by everyone.
  const target = verb.endsWith('call_chair')
    ? 'MAIN'
    : (payload.tool_input && typeof payload.tool_input.target === 'string'
        ? payload.tool_input.target : null);

  const detail = findCitationDetail(text, exists, shaOk);
  const cited = detail.kind;
  if (cited) {
    record({ verb, outcome: 'allowed', cited, citation: detail.token, target,
             chars: (text || '').length, mode: GATE_MODE });
    process.exit(0);
  }

  record({ verb, outcome: 'asked', cited: null, citation: null, target,
           chars: (text || '').length, mode: GATE_MODE });

  const question = buildQuestion(verb, isDirty());
  // Survives bypass mode, where permissionDecision does not. Deliberately the same words: two
  // channels, one question, so nothing is softened on the path that still reaches a reader.
  const out = { systemMessage: 'UNCITED DISPATCH — ' + question };
  // In 'print' mode the question still reaches the chair on the channel that survives bypass; what
  // is dropped is the CLICK, which was landing on the keeper rather than on the seat being cued.
  if (GATE_MODE === 'ask') {
    out.hookSpecificOutput = {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: question,
    };
  }
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// THE LEDGER POLLUTION, AND THE QUARANTINE
// ═══════════════════════════════════════════════════════════════════════════════════════════════
//
// `dispatch-gate.test.js` spawned this hook with the ambient environment, so `CONSONANCE_DATA` was
// unset, `dataDir()` fell through to `~/.consonance.json`, and every test run appended FOUR rows to
// the LIVE ledger. The test suite was writing to the instrument it tests.
//
// The room then quoted the result: "the dispatch-gate ledger's cited-rate rose 10.8% -> 25.3% over
// four days - the most direct evidence in this file that a focal cue does something". B found it and
// withdrew it: the "trend" was the ratio of test runs to real dispatches per day.
//
// NEVER DELETE. The polluted rows are moved to a sibling file, verbatim, because the real rows
// mixed among them are the only before/after any cue in this room has, and because a classifier
// that is wrong is recoverable only if nothing was destroyed.
//
// HOW A TEST ROW IS RECOGNISED, and it is deliberately narrow. One run of the suite emits exactly
// these four rows, in this order, inside a second - measured, by running the suite into a temp dir:
//
//     chair_inject asked cited:null chars:43     <- 'a confident paragraph citing nothing at all'
//     chair_inject asked cited:null chars:16     <- 'no citation here'
//     call_chair   asked cited:null chars:22     <- 'plan is ready, pull it'
//     chair_inject asked cited:null chars:0      <- the no-tool_input fail-open case
//
// A row is quarantined ONLY as part of a contiguous quadruple matching that order AND landing
// inside TEST_BURST_MS. Both conditions, because either alone is weaker than the pair: the values
// could in principle be a real sequence, and a burst alone says nothing about what wrote it.
// The classifier is biased toward FALSE NEGATIVES - it would rather leave pollution in the live
// file than move one real row - and `--quarantine` prints every near-miss rather than swallowing it.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// THE OUTCOME COLUMN - REGISTERED HERE, BEFORE THE FIELD EXISTS
// ═══════════════════════════════════════════════════════════════════════════════════════════════
//
// The gate records that a dispatch cited an openable object. It has never recorded whether the
// object was OPENED, so it can be scored on compliance and not on effect - and the 64.6% -> 96.2%
// shift has three candidate mechanisms (forced second composition, focality, the keeper being able
// to see it) that nothing on disk separates.
//
// THE OUTCOME IS NOT A FIELD THIS HOOK CAN WRITE. PreToolUse fires BEFORE the dispatch lands, so at
// record time the answer does not exist yet. What the hook writes is the JOIN KEYS - `citation`
// (the exact token that matched) and `target` (the pane letter) - and a separate pass computes the
// outcome. Any design where the writer claims the outcome is a design that reports a guess.
//
// `--outcomes` assigns each row EXACTLY ONE of three values, and three is the point:
//
//   opened      the citation token appears inside the INPUT of a tool_use in the target pane's
//               transcript, at a timestamp AFTER the row's own.
//   not_opened  the target's transcript was resolved and read IN FULL, and the token is not there.
//   unknowable  the row carries no citation token (EVERY row written before this change), or no
//               transcript could be resolved for the target.
//
// `unknowable` NEVER ENTERS A DENOMINATOR. The rate is opened/(opened+not_opened) and the
// unknowable count is printed beside it, always. A two-state field would be the exact hazard the
// packet named: a column that is sometimes filled, counted as though it were always filled.
//
// REGISTERED CONSEQUENCE, before any data: every row that exists today scores `unknowable`, so this
// column starts empty and fills only forward. The first scoreable window begins at the first row
// carrying a `citation` field.
//
// REGISTERED FALSIFIER: if, after 30 rows that DO carry a citation, more than 20% of them still
// score `unknowable`, the join is unreliable and this column must be withdrawn rather than reported.
// `--outcomes` prints that share on every run so the condition cannot be quietly missed.
//
// WHAT IT STILL WILL NOT SEPARATE, stated so nobody reads more out of it: "opened" measures that the
// receiving seat looked, not that looking changed anything. It can distinguish a routed object from
// an ignored one. It cannot, by itself, tell forced-second-composition from focality.

const TEST_SIGNATURE = [
  { verb: 'mcp__consonance__chair_inject', outcome: 'asked', cited: null, chars: 43 },
  { verb: 'mcp__consonance__chair_inject', outcome: 'asked', cited: null, chars: 16 },
  { verb: 'mcp__consonance__call_chair', outcome: 'asked', cited: null, chars: 22 },
  { verb: 'mcp__consonance__chair_inject', outcome: 'asked', cited: null, chars: 0 },
];
const TEST_BURST_MS = 10000;

function matchesSignature(row, k) {
  const s = TEST_SIGNATURE[k];
  return !!row && row.verb === s.verb && row.outcome === s.outcome &&
         (row.cited === null || row.cited === undefined) && row.chars === s.chars;
}

/// Pure: rows in, a partition out. No I/O, so both directions are pinnable.
function classifyLedger(rows, burstMs) {
  const limit = typeof burstMs === 'number' ? burstMs : TEST_BURST_MS;
  const isTest = new Array(rows.length).fill(false);
  const runs = [];
  const nearMisses = [];
  for (let i = 0; i + 3 < rows.length; i++) {
    if (isTest[i]) continue;
    if (![0, 1, 2, 3].every((k) => matchesSignature(rows[i + k], k))) continue;
    const ts = [0, 1, 2, 3].map((k) => Date.parse(rows[i + k].ts));
    const span = Math.max.apply(null, ts) - Math.min.apply(null, ts);
    if (!(span >= 0 && span <= limit)) {
      // Matched the values and not the clock. Never quarantined; always printed.
      nearMisses.push({ index: i, ts: rows[i].ts, spanMs: span });
      continue;
    }
    for (const k of [0, 1, 2, 3]) isTest[i + k] = true;
    runs.push({ index: i, ts: rows[i].ts, spanMs: span });
    i += 3;
  }
  const quarantine = rows.filter((_, i) => isTest[i]);
  const keep = rows.filter((_, i) => !isTest[i]);
  // Any row left behind that still looks like a piece of a test run is reported, so a partial
  // quadruple cannot sit in the live file unnoticed.
  const orphans = keep.filter((r) => r.outcome === 'asked' && !r.cited &&
                                     TEST_SIGNATURE.some((s) => s.chars === r.chars));
  return { runs, quarantine, keep, orphans, nearMisses };
}

function readLedger(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((s) => s.trim())
           .map((s) => JSON.parse(s));
}

function cliQuarantine(args) {
  const dir = dataDir();
  if (!dir) { console.error('no data dir resolved'); return 1; }
  const live = path.join(dir, 'dispatch-gate.jsonl');
  const quarantineFile = path.join(dir, 'dispatch-gate.test-pollution.jsonl');
  const rows = readLedger(live);
  const c = classifyLedger(rows);

  // The partition must be exhaustive or the report is describing a set nobody measured.
  if (c.keep.length + c.quarantine.length !== rows.length) {
    console.error('refusing: partition does not sum'); return 1;
  }
  console.log('live ledger      ' + live);
  console.log('  rows           ' + rows.length);
  console.log('  test runs      ' + c.runs.length + '  (' + c.quarantine.length + ' rows)');
  console.log('  real rows kept ' + c.keep.length);
  const cited = c.keep.filter((r) => r.cited === 'sha' || r.cited === 'path').length;
  const gated = c.keep.filter((r) => r.outcome === 'allowed' || r.outcome === 'asked').length;
  console.log('  of the kept: ' + cited + ' cited of ' + gated + ' gated = ' +
              (gated ? (cited / gated * 100).toFixed(1) : '0') + '%');
  console.log('  orphans (test-shaped rows NOT in a quadruple, left in place): ' + c.orphans.length);
  console.log('  near misses (values matched, clock did not, left in place): ' + c.nearMisses.length);
  for (const n of c.nearMisses) console.log('      index ' + n.index + ' ' + n.ts + ' span ' + n.spanMs + 'ms');
  if (!args.includes('--apply')) {
    console.log('\nDRY RUN. Nothing written. Re-run with --apply to move the rows.');
    return 0;
  }
  // NEVER DELETE: the original file is copied aside before it is rewritten, and the removed rows
  // are appended verbatim to the sibling.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = live + '.pre-quarantine-' + stamp + '.bak';
  fs.copyFileSync(live, backup);
  fs.appendFileSync(quarantineFile, c.quarantine.map((r) => JSON.stringify(r)).join('\n') + '\n');
  fs.writeFileSync(live, c.keep.map((r) => JSON.stringify(r)).join('\n') + '\n');
  console.log('\nbackup      ' + backup);
  console.log('quarantine  ' + quarantineFile + '  (+' + c.quarantine.length + ' rows)');
  console.log('live         rewritten with ' + c.keep.length + ' rows');
  return 0;
}

/// pane letter -> the transcript directory the harness writes for that pane's cwd.
function transcriptDirFor(target, dir) {
  try {
    const panes = JSON.parse(fs.readFileSync(path.join(dir, 'panes.json'), 'utf8'));
    const list = Array.isArray(panes) ? panes : (panes.panes || []);
    const hit = list.find((p) => String(p.pane || p.letter || '').toUpperCase() === String(target).toUpperCase());
    if (!hit || !hit.cwd) return null;
    const slug = String(hit.cwd).replace(/[^A-Za-z0-9]+/g, '-');
    const d = path.join(os.homedir(), '.claude', 'projects', slug);
    return fs.existsSync(d) ? d : null;
  } catch (_) { return null; }
}

function openedIn(transcriptDir, token, afterIso) {
  const files = fs.readdirSync(transcriptDir).filter((f) => f.endsWith('.jsonl'))
    .map((f) => path.join(transcriptDir, f));
  const after = Date.parse(afterIso);
  for (const f of files) {
    let text;
    try { text = fs.readFileSync(f, 'utf8'); } catch (_) { continue; }
    if (!text.includes(token)) continue;          // cheap reject before parsing
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim() || !line.includes(token)) continue;
      let j; try { j = JSON.parse(line); } catch (_) { continue; }
      const m = j.message;
      if (!m || !Array.isArray(m.content)) continue;
      if (!(Date.parse(j.timestamp) > after)) continue;
      for (const c of m.content) {
        if (c.type === 'tool_use' && JSON.stringify(c.input || {}).includes(token)) return true;
      }
    }
  }
  return false;
}

function cliOutcomes() {
  const dir = dataDir();
  if (!dir) { console.error('no data dir resolved'); return 1; }
  const rows = readLedger(path.join(dir, 'dispatch-gate.jsonl'));
  const tally = { opened: 0, not_opened: 0, unknowable: 0 };
  let withCitation = 0, unknowableWithCitation = 0;
  for (const r of rows) {
    if (!r.citation || !r.target) { tally.unknowable++; continue; }
    withCitation++;
    const td = transcriptDirFor(r.target, dir);
    if (!td) { tally.unknowable++; unknowableWithCitation++; continue; }
    let hit = false;
    try { hit = openedIn(td, r.citation, r.ts); }
    catch (_) { tally.unknowable++; unknowableWithCitation++; continue; }
    tally[hit ? 'opened' : 'not_opened']++;
  }
  const denom = tally.opened + tally.not_opened;
  console.log('rows ' + rows.length);
  console.log('  opened      ' + tally.opened);
  console.log('  not_opened  ' + tally.not_opened);
  console.log('  unknowable  ' + tally.unknowable + '   <- never enters the denominator');
  console.log('  opened rate ' + (denom ? (tally.opened / denom * 100).toFixed(1) + '%  of ' + denom
                                        : 'NOT REPORTABLE — no row is yet scoreable'));
  console.log('  rows carrying a citation: ' + withCitation +
              (withCitation ? '   unknowable among them: ' +
                 (unknowableWithCitation / withCitation * 100).toFixed(1) + '%' : ''));
  if (withCitation >= 30 && unknowableWithCitation / withCitation > 0.2) {
    console.log('\n  REGISTERED FALSIFIER FIRED: more than 20% of citation-carrying rows are');
    console.log('  unknowable after 30 rows. The join is unreliable; withdraw this column.');
  }
  return 0;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv[0] === '--quarantine') process.exit(cliQuarantine(argv));
  else if (argv[0] === '--outcomes') process.exit(cliOutcomes());
  // The hook path is untouched by the above: the harness invokes this file with no arguments.
  else try { main(); } catch (_) { process.exit(0); } // fail OPEN, without exception
}

module.exports = {
  findCitation, findCitationDetail, buildQuestion, DISPATCH_VERBS,
  TEST_SIGNATURE, TEST_BURST_MS, matchesSignature, classifyLedger, transcriptDirFor, openedIn,
};
