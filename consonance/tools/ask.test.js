/* Tests for ask.js.
 *
 * The load-bearing properties are NOT "it lists asks". They are the four things that, if any one of
 * them breaks, turn this into the instrument it was built to replace:
 *
 *   1. --line carries the goal's OWN WORDS. A channel that says "a question is waiting" and not
 *      WHICH question has rebuilt session-start.js's knocker, which renders `[DRIFT-FOUND]` and
 *      calls it a channel. This is the whole packet, so it is tested twice — once that the fact
 *      survives, once that a store carrying only a category is REFUSED rather than summarised.
 *   2. Clearing is a closed vocabulary. PENDING-CONDITIONS invented [PARTIAL] mid-flight and both
 *      parties published 7/7 over a 5/7. An unrecognised marker must fail loudly, never round to
 *      cleared.
 *   3. The tool never writes to the store. Write and clear are separate parties or the channel is
 *      an archive again.
 *   4. Silence is distinguishable from death. An empty queue and an uncalled tool produce the same
 *      stdout, and chain-status.js has been in the second state since it was written with nothing
 *      saying so.
 *
 * Run: node ask.test.js     (or via js-suite)
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const A = require('./ask.js');

const DAY = 86400000;
const NOW = Date.parse('2026-08-28T00:00:00Z');

const block = (id, goal, asked, question, status) =>
  `### ${id} — ${goal}, asked ${asked}\n` +
  `**Source:** somewhere:1\n` +
  `**Question:** ${question}\n` +
  `**Status:** ${status}\n`;

const REAL_Q = 'Narrow the interest list in goal.json to what the feeds have, or widen the feed list in server.js:227-234 to cover the interests?';

function tmpStore(text) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ask-'));
  const p = path.join(d, 'ASK.md');
  fs.writeFileSync(p, text);
  return p;
}

/* ── 1. the fact, not the category ──────────────────────────────────────────────────────────── */

test('--line carries the goal\'s own words, not just a count', () => {
  const st = A.parseStore(block('ASK-001', 'daily-news-digest', '2026-08-25', REAL_Q, 'OPEN'));
  const ln = A.line(st, NOW);
  assert.ok(ln, 'expected a line');
  // The distinctive middle of the question must survive into the line. Not "contains a question
  // mark", not "is long" — the actual words the goal chose.
  assert.ok(ln.includes('widen the feed list'), `line dropped the fact: ${ln}`);
  assert.ok(ln.includes('daily-news-digest'), 'line dropped which goal asked');
});

test('a store carrying a CATEGORY instead of a question is refused, not summarised', () => {
  // This is the failure mode being replaced, injected directly. session-start.js renders
  // "[DRIFT-FOUND]" and that is what a stub looks like. The line must not quietly emit a count.
  const st = A.parseStore(block('ASK-009', 'drift-watch', '2026-08-01', '[DRIFT-FOUND]', 'OPEN'));
  const ln = A.line(st, NOW);
  assert.ok(ln, 'expected a line even in the refusal case — silence would read as an empty queue');
  assert.ok(/HAS NO USABLE QUESTION TEXT/.test(ln), `expected an explicit refusal, got: ${ln}`);
  assert.ok(!/^ask: 1 open · oldest \d+d · drift-watch: "\[DRIFT-FOUND\]"/.test(ln),
    'the tool passed a category through as though it were the fact');
});

test('the refusal floor is enforced at MIN_FACT_CHARS, not merely documented', () => {
  const justUnder = 'x'.repeat(A.MIN_FACT_CHARS - 1);
  const justOver = 'y'.repeat(A.MIN_FACT_CHARS + 1);
  const under = A.line(A.parseStore(block('ASK-001', 'g', '2026-08-01', justUnder, 'OPEN')), NOW);
  const over = A.line(A.parseStore(block('ASK-001', 'g', '2026-08-01', justOver, 'OPEN')), NOW);
  assert.ok(/HAS NO USABLE QUESTION TEXT/.test(under), 'below the floor must refuse');
  assert.ok(!/HAS NO USABLE QUESTION TEXT/.test(over), 'above the floor must render');
  assert.ok(over.includes(justOver), 'above the floor, the text itself must appear');
});

test('a long question is truncated but keeps enough to be a fact', () => {
  const long = REAL_Q + ' ' + REAL_Q + ' ' + REAL_Q;
  const ln = A.line(A.parseStore(block('ASK-001', 'g', '2026-08-01', long, 'OPEN')), NOW);
  assert.ok(ln.includes('…'), 'expected truncation marker');
  assert.ok(ln.includes('Narrow the interest list'), 'truncation ate the head of the question');
  assert.ok(A.trimFact(long).length <= A.LINE_FACT_BUDGET + 1, 'budget not respected');
});

/* ── 2. the closed vocabulary ───────────────────────────────────────────────────────────────── */

test('OPEN, ANSWERED and DECLINED are the only recognised states', () => {
  assert.strictEqual(A.classify('OPEN'), 'OPEN');
  assert.strictEqual(A.classify('[ANSWERED 2026-08-28 — narrowed goal.json:4]'), 'ANSWERED');
  assert.strictEqual(A.classify('[DECLINED 2026-08-28 — not doing this]'), 'DECLINED');
});

test('an unrecognised marker is UNREADABLE and is NOT counted as cleared', () => {
  // The exact shape that produced a published 7/7 over a 5/7 one directory over.
  const st = A.parseStore(block('ASK-007', 'g', '2026-08-01', REAL_Q, '[PARTIAL 2026-08-28 — half of it]'));
  assert.strictEqual(st.asks.length, 0, '[PARTIAL] must not enter the ask set');
  assert.strictEqual(st.unreadable.length, 1, '[PARTIAL] must be counted as unreadable');
  assert.match(st.unreadable[0].reason, /unrecognised Status/);
});

test('a cleared marker without a reason is refused — clearing must say what was decided', () => {
  const st = A.parseStore(block('ASK-008', 'g', '2026-08-01', REAL_Q, '[ANSWERED 2026-08-28 — ]'));
  assert.strictEqual(st.asks.length, 0, 'an empty reason must not clear an ask');
  assert.strictEqual(st.unreadable.length, 1);
});

test('a block with no Status line is unreadable, never silently open or cleared', () => {
  const st = A.parseStore('### ASK-010 — g, asked 2026-08-01\n**Question:** ' + REAL_Q + '\n');
  assert.strictEqual(st.asks.length, 0);
  assert.strictEqual(st.unreadable.length, 1);
  assert.match(st.unreadable[0].reason, /no Status line/);
});

test('unreadable blocks do not silently vanish from the open count', () => {
  const st = A.parseStore(
    block('ASK-001', 'g', '2026-08-01', REAL_Q, 'OPEN') +
    block('ASK-002', 'g', '2026-08-01', REAL_Q, '[PARTIAL]')
  );
  assert.strictEqual(A.openAsks(st, NOW).length, 1);
  assert.strictEqual(st.unreadable.length, 1, 'the second block must be visible as unreadable');
});

/* ── 3. write and clear are separate parties ────────────────────────────────────────────────── */

test('reading and rendering never modify the store', () => {
  const text =
    block('ASK-001', 'daily-news-digest', '2026-08-25', REAL_Q, 'OPEN') +
    block('ASK-002', 'drift-watch', '2026-08-17', REAL_Q, '[ANSWERED 2026-08-28 — done]');
  const p = tmpStore(text);
  const before = fs.readFileSync(p, 'utf8');
  const beforeStat = fs.statSync(p).mtimeMs;
  const st = A.load(p);
  A.line(st, NOW);
  A.openAsks(st, NOW);
  assert.strictEqual(fs.readFileSync(p, 'utf8'), before, 'the store was modified by a read');
  assert.strictEqual(fs.statSync(p).mtimeMs, beforeStat, 'the store mtime moved on a read');
  assert.strictEqual(st.asks.length, 2);
  assert.strictEqual(A.openAsks(st, NOW).length, 1);
});

/* ── 4. silence is distinguishable from death ───────────────────────────────────────────────── */

test('an empty queue renders no line at all', () => {
  const st = A.parseStore(block('ASK-001', 'g', '2026-08-01', REAL_Q, '[DECLINED 2026-08-28 — no]'));
  assert.strictEqual(A.line(st, NOW), null);
});

test('--why tells a chosen silence from a missing store', () => {
  const missing = A.load(path.join(os.tmpdir(), 'ask-does-not-exist-' + Date.now(), 'ASK.md'));
  assert.strictEqual(missing.missing, true);
  assert.match(A.whySilent(missing, NOW), /missing channel, not an empty one/);

  const cleared = A.parseStore(block('ASK-001', 'g', '2026-08-01', REAL_Q, '[ANSWERED 2026-08-28 — ok]'));
  assert.match(A.whySilent({ ...cleared, missing: false }, NOW), /every ask in the store is marked/);
});

test('--why refuses to call a queue empty when blocks are unreadable', () => {
  const st = { ...A.parseStore(block('ASK-001', 'g', '2026-08-01', REAL_Q, '[PARTIAL]')), missing: false };
  assert.strictEqual(A.line(st, NOW), null);
  assert.match(A.whySilent(st, NOW), /UNREADABLE.*not evidence of an empty queue/s);
});

test('the wiring check finds a caller when one exists, and reports UNWIRED when none does', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ask-wire-'));
  fs.writeFileSync(path.join(d, 'nothing.js'), '// a hook that calls something else\n');
  assert.strictEqual(A.wiring([d]).wired, false, 'must not invent a caller');

  fs.writeFileSync(path.join(d, 'hook.js'), 'exec("node consonance/tools/ask.js --line")\n');
  const w = A.wiring([d]);
  assert.strictEqual(w.wired, true);
  assert.ok(w.callers.some(p => p.endsWith('hook.js')));
});

test('the wiring check does not count the tool, its own tests, or .bak files as callers', () => {
  // Every one of these mentions ask.js and none of them CALLS it. A self-satisfying wiring check
  // is the same species as a falsifier that reads the ledger it writes into.
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ask-wire2-'));
  fs.writeFileSync(path.join(d, 'ask.test.js'), 'require("./ask.js")\n');
  fs.writeFileSync(path.join(d, 'hook.js.bak-20260817-121017'), 'node ask.js --line\n');
  assert.strictEqual(A.wiring([d]).wired, false, 'a test or a .bak must not read as a live caller');
});

/* ── ageing and ordering ────────────────────────────────────────────────────────────────────── */

test('the oldest open ask is the one the line names', () => {
  const st = A.parseStore(
    block('ASK-002', 'newer-goal', '2026-08-25', 'A question that is comfortably long enough to clear the fact floor', 'OPEN') +
    block('ASK-001', 'older-goal', '2026-07-27', 'An older question that is also comfortably long enough to clear it', 'OPEN')
  );
  const open = A.openAsks(st, NOW);
  assert.strictEqual(open[0].id, 'ASK-001', 'age ordering broken — the uncomfortable question sinks');
  assert.ok(A.line(st, NOW).includes('older-goal'));
});

test('age is computed in whole days from the asked date', () => {
  assert.strictEqual(A.ageDays('2026-08-28', NOW), 0);
  assert.strictEqual(A.ageDays('2026-08-27', NOW), 1);
  assert.strictEqual(A.ageDays('2026-07-27', NOW), 32);
  assert.strictEqual(A.ageDays('not-a-date', NOW), null);
});

test('an unparseable asked-date does not crash the line or claim an age', () => {
  const st = A.parseStore('### ASK-001 — g, asked 2026-13-45\n**Question:** ' + REAL_Q + '\n**Status:** OPEN\n');
  // The heading regex requires a well-formed-looking date; a nonsense month yields no block at all
  // rather than a block with a fabricated age. Either outcome is acceptable; a fabricated age is not.
  const open = A.openAsks({ ...st, missing: false }, NOW);
  for (const a of open) assert.ok(a.age === null || Number.isInteger(a.age));
});

/* ── the candidate scan is inference and says so ────────────────────────────────────────────── */

test('candidates are read from cron logs and are never auto-filed', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ask-cand-'));
  const g = path.join(d, 'some-goal');
  fs.mkdirSync(g);
  fs.writeFileSync(path.join(g, 'system-cron.log'),
    '2026-08-01T05:00:00Z [START] System cron firing wakeup for some-goal\n' +
    '2026-08-01T05:01:00Z [OUTPUT]\n' +
    'A thing happened and it is fine.\n' +
    'This one is your call, not mine.\n' +
    '2026-08-01T05:01:00Z [END] Wakeup completed exit=0\n');
  const c = A.candidates(d);
  assert.strictEqual(c.reachable, true);
  assert.strictEqual(c.rows.length, 1, 'expected exactly the keeper-directed line');
  assert.strictEqual(c.rows[0].goal, 'some-goal');
  assert.strictEqual(c.rows[0].date, '2026-08-01', 'candidate must carry the fire it came from');
  // and it did not become an ask
  const store = A.parseStore('');
  assert.strictEqual(store.asks.length, 0);
});

test('an unreachable duration dir reports unreachable, never "zero candidates"', () => {
  const c = A.candidates(path.join(os.tmpdir(), 'ask-no-such-dir-' + Date.now()));
  assert.strictEqual(c.reachable, false, 'a failed scan must not be reported as an empty one');
  assert.strictEqual(c.rows.length, 0);
});

/* ── the shipped store is real freight, not a fixture ───────────────────────────────────────── */

// CHECKABLE PROVENANCE — what ASK.md:41 actually specifies: `<path>:<line> — where the sentence
// actually is`. Until 2026-08-31 this test accepted only /system-cron\.log|pending\// — the cron-log
// paths of the six ORIGINAL asks — so every ask sourced to a repo file (ASK-007 onward) failed it,
// and only ASK-007 was ever named because the loop threw on the first. Widened to: a path carrying a
// line number, OR a commit sha (7–40 hex with at least one digit, so a hex-looking word such as
// "defaced" does not pass). A BARE PATH STAYS RED — a file with no line is the un-checkable form
// this gate exists to refuse. Both directions are asserted on fixtures in the next test.
// (L019 P-CLOSEOUT, pane Around, 2026-08-31.)
const CHECKABLE_PROVENANCE = /[^\s`'"()]+\.[A-Za-z0-9]+:\d+|\b(?=[0-9a-f]*\d)[0-9a-f]{7,40}\b/;
const provenanceFailures = (asks) => asks
  .filter((a) => !(a.source && CHECKABLE_PROVENANCE.test(a.source)))
  .map((a) => a.id + ': ' + a.source);

test('the shipped ASK.md parses, is non-empty, and every open ask clears the fact floor', () => {
  const st = A.load(A.STORE);
  assert.strictEqual(st.missing, false, 'exo_memory/ASK.md is missing');
  const open = A.openAsks(st, Date.now());
  assert.ok(open.length > 0, 'the store shipped with no open asks — the channel has no freight');
  assert.strictEqual(st.unreadable.length, 0, `shipped store has unreadable blocks: ${JSON.stringify(st.unreadable)}`);
  const thin = open.filter((a) => A.trimFact(a.question).length < A.MIN_FACT_CHARS).map((a) => a.id);
  assert.deepStrictEqual(thin, [], 'these asks carry a category, not a question');
  // every failure named at once — a loop that throws on the first reports one of N
  assert.deepStrictEqual(provenanceFailures(open), [],
    'open asks with no checkable provenance (ASK.md:41 wants path:line; a sha also checks)');
  assert.ok(!/HAS NO USABLE QUESTION TEXT/.test(A.line(st, Date.now())));
});

test('provenance gate, BOTH directions: path:line and a sha pass; a bare path, a timestamp, a hex-looking word do not', () => {
  const Q = 'Is this a real question with enough words in it to clear the fact floor of the store, quoted verbatim from a goal?';
  const block = (n, source) => '### ASK-9' + n + ' — fixture, asked 2026-08-30\n**Source:** ' + source + '\n**Question:** ' + Q + '\n**Status:** OPEN\n\n';
  const st = A.parseStore(
    block(1, '`exo_memory/loop/univ_amendment_registration_2026-08-29.md:241` (§6.1)') +                    // path:line in the repo — ASK-007's real shape
    block(2, '`~/.claude/shell/duration/daily-news-digest/system-cron.log:1109` (2026-08-25T05:31:13Z)') +   // the original cron-log shape
    block(3, '`2fc006c` gitignored the directory') +                                                          // a sha alone
    block(4, '`exo_memory/loop/cant_lose_repair_registration_2026-08-29.md` (the break-attempt is in-file)') + // BARE PATH — red
    block(5, 'asked at 2026-08-25T05:31:13Z in the librarian pane') +                                           // a timestamp is not a location — red
    block(6, 'see the defaced record, obviously') +                                                              // hex-looking word, no digit — red
    block(7, '`consonance/tools/actors.evidence.test.js` red at HEAD'));                                      // bare path, no line, no sha — red
  const open = A.openAsks(st, Date.now());
  assert.strictEqual(open.length, 7, 'fixture store did not parse to seven open asks');
  const failures = provenanceFailures(open).map((s) => s.split(':')[0]);
  assert.deepStrictEqual(failures, ['ASK-94', 'ASK-95', 'ASK-96', 'ASK-97'],
    'exactly the un-checkable sources fail, and every one of them is named, not just the first');

  // and the thing that was wrong: the pre-2026-08-31 regex rejected ASK-007's real shape
  const PRE = /system-cron\.log|pending\//;
  assert.ok(!PRE.test(open[0].source), 'the old regex rejected a repo path:line — the over-fit this test replaced');
  assert.ok(PRE.test(open[1].source) && CHECKABLE_PROVENANCE.test(open[1].source), 'the original cron-log shape still passes');
});
