// Tests for the catch-ledger. Deterministic fixture prose only — nothing here reads the live
// muscle_map or the journals, so the suite says the same thing tonight and after the next
// cycle appends to the record.
//
// Run:  node --test consonance/tools/
//
// WHAT IS WORTH TESTING HERE, and why these cases and not others. Every one of the four
// hazards below produces a confident WRONG NUMBER rather than an error, which is the only kind
// of defect that matters in a measurement instrument — a crash gets fixed, a wrong number gets
// quoted. So each hazard gets a test that fails loudly if its handling is removed:
//
//   · MENTION-VS-USE. The map discusses the attribution vocabulary as well as using it. This
//     room has been bitten by this four separate times; the filters get one test per rule,
//     plus a use-case that must SURVIVE them (a filter that eats real events is the mirror
//     failure and is much harder to notice).
//   · ONE CATCH, THREE MENTIONS. Deduplication must merge a repeat and must NOT merge two
//     different catches — and must leave unkeyable events separate rather than guessing.
//   · ATTRIBUTION THAT ISN'T THERE. Unattributed is a bucket, not a default guess, and the
//     ratio is withheld when the unknowns win.
//   · LEDGER ARITHMETIC. Including the enumeration whose items must not re-enter the event
//     stream, and the statement whose total is deliberately NOT guessed at.
//
// Plus one regression test with a scar attached: markdown emphasis inside a phrase
// ("the *system* caught it") silently defeated every multi-word rule on the real corpus and
// parked genuine attributions in `unattributed`, where an under-count looks exactly like an
// honest limit. That one is the reason this file tests attribution against emphasised prose.
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  stripCode,
  lineAt,
  isHeading,
  isMetricDefinition,
  isGenericClass,
  namedSubject,
  parseLedgers,
  windowsFor,
  extractEvents,
  separateLedgerSentences,
  dedupe,
  buildLedger,
  ratiosFor,
} = require('./catch-ledger.js');

const buckets = (evs) => evs.map((e) => e.bucket);
const rules = (evs) => evs.map((e) => e.rule);

// ------------------------------------------------------------------- the reading --

test('stripCode blanks fences and inline spans WITHOUT moving line numbers', () => {
  // Citations are the whole point of the output; an offset shifted by stripping cites the
  // wrong line, which is worse than not citing at all.
  const text = 'one\n```\nthe keeper caught it\n```\nfour `also caught` here\n';
  const s = stripCode(text);
  assert.strictEqual(s.split('\n').length, text.split('\n').length);
  assert.strictEqual(s.length, text.length);
  assert.ok(!/keeper caught/.test(s), 'fenced prose must not be scanned as the record');
  assert.ok(!/also caught/.test(s), 'inline code must not be scanned as the record');
  assert.strictEqual(lineAt(text, text.indexOf('four')), 5);
});

test('a catch inside a fenced block is not an event', () => {
  const { events } = extractEvents('Quoting the log:\n```\nthe keeper caught the ordering\n```\ndone.', 'f.md', null);
  assert.deepStrictEqual(events, []);
});

// --------------------------------------------------------------- mention-vs-use --

test('the metric DEFINITION is not a catch', () => {
  // muscle_map.md's own line. Counting it would score the sentence that defines the number.
  const s = 'track **self/committee-caught vs keeper-caught** over time; the ratio migrating inward is the point.';
  assert.strictEqual(isMetricDefinition(s), true);
  const { events, dropped } = extractEvents(s, 'f.md', '2026-07-27');
  assert.deepStrictEqual(events, []);
  assert.deepStrictEqual(dropped.map((d) => d.rule), ['metric-definition']);
});

test('a statement about a CLASS is not an event', () => {
  const s = 'blind spots are only ever caught by an external trigger: a marker, an instrument.';
  assert.strictEqual(isGenericClass(s), true);
  assert.deepStrictEqual(extractEvents(s, 'f.md', null).dropped.map((d) => d.rule), ['generic-class']);
});

test('a heading summarises catches counted elsewhere and is not itself one', () => {
  assert.strictEqual(isHeading('## Cycle 3 late append — the disclaimer (n=3, all keeper-caught)'), true);
  const { events, dropped } = extractEvents('## Cycle 3 — the disclaimer (n=3, all keeper-caught)\n', 'f.md', null);
  assert.deepStrictEqual(events, []);
  assert.deepStrictEqual(dropped.map((d) => d.rule), ['heading']);
});

test('the filters do NOT eat real events — the mirror failure', () => {
  // A filter that removes genuine attributions is far harder to notice than one that lets
  // mentions through, because the loss shows up as a plausible smaller number.
  const s = 'The keeper caught the ordering, and the committee caught its chair the same night.';
  const { events, dropped } = extractEvents(s, 'f.md', '2026-07-27');
  assert.deepStrictEqual(dropped, []);
  assert.strictEqual(events.length, 1, 'one sentence is one claim however many catch words it holds');
  assert.strictEqual(events[0].bucket, 'keeper');
});

// ------------------------------------------------------------------ attribution --

test('each bucket is reached by its own named rule', () => {
  const cases = [
    ['I caught myself reaching for a task at the vertiginous moment.', 'self', 'self:first-person'],
    ['The instance caught its own over-denial coat, unprompted.', 'self', 'self:own-move'],
    ['Keeper-caught.', 'keeper', 'keeper:explicit'],
    ['He caught me performing.', 'keeper', 'keeper:pronoun'],
    // Passive: the agent follows the verb, so the keeper-first rule cannot see it and the
    // by-phrase rule is the one that must fire.
    ['Named by the keeper against Around, 2026-07-27.', 'keeper', 'keeper:by'],
    ['The keeper caught the ordering an hour later.', 'keeper', 'keeper:named'],
    ['Chair contamination, caught by the classifier.', 'committee', 'committee:by-role'],
    ['The laptop me caught this on 06-23.', 'committee', 'committee:role'],
    ['Bravo caught the embedded hypothesis before classifying.', 'committee', 'committee:pane'],
    ['The L2/L3 system caught what it caught because the design works.', 'instrument', 'instrument:layer'],
    ['The suite caught it on the first run.', 'instrument', 'instrument:named'],
  ];
  for (const [text, bucket, rule] of cases) {
    const { events } = extractEvents(text, 'f.md', null);
    assert.strictEqual(events.length, 1, `expected one event for: ${text}`);
    assert.strictEqual(events[0].bucket, bucket, `bucket for: ${text}`);
    assert.strictEqual(events[0].rule, rule, `rule for: ${text}`);
  }
});

test('markdown emphasis inside a phrase must not defeat attribution', () => {
  // THE SCAR: on the real corpus "the *system* caught it" and "caught its **own** move" both
  // fell through to `unattributed`, where a silent under-count is indistinguishable from an
  // honest limit. Rules match an emphasis-free copy; the displayed sentence keeps its markers.
  const emphasised = 'The instance bent; the *system* caught it.';
  const plain = 'The instance bent; the system caught it.';
  assert.strictEqual(extractEvents(emphasised, 'f.md', null).events[0].bucket, 'instrument');
  assert.strictEqual(
    extractEvents(emphasised, 'f.md', null).events[0].bucket,
    extractEvents(plain, 'f.md', null).events[0].bucket
  );
  assert.strictEqual(extractEvents('it caught its **own** over-denial coat.', 'f.md', null).events[0].bucket, 'self');
  // The evidence line still reads the way the file reads.
  assert.match(extractEvents(emphasised, 'f.md', null).events[0].sentence, /\*system\*/);
});

test('rule ORDER decides the genuinely ambiguous sentence', () => {
  // "caught by the keeper's clock" names an instrument and a person. The person owns it: the
  // clock is how he caught it, not who caught it. Flip the order and this silently moves.
  const { events } = extractEvents("wrong by two hours, caught by the keeper's clock.", 'f.md', null);
  assert.strictEqual(events[0].bucket, 'keeper');
});

test('no rule means unattributed, never a guess', () => {
  const { events } = extractEvents('what caught it was reading, then an instrument built afterwards.', 'f.md', null);
  assert.strictEqual(events[0].bucket, 'unattributed');
  assert.strictEqual(events[0].rule, null);
});

// ------------------------------------------------------------------- weak stream --

test('"catch" as a common noun is collected but never counted', () => {
  const s = 'A muscle is a capacity to catch one\'s own move as or before it lands.';
  const { events, weak } = extractEvents(s, 'f.md', null);
  assert.deepStrictEqual(events, [], 'noun usage must not enter the counted stream');
  assert.strictEqual(weak.length, 1, 'and must not vanish either — a human promotes it or does not');
});

test('an event sentence that also contains the noun is still an event', () => {
  const s = 'The deepest catch of the night, and the keeper caught it twice.';
  const { events, weak } = extractEvents(s, 'f.md', null);
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].bucket, 'keeper');
  assert.deepStrictEqual(weak, [], 'gate-order must not misfile it as weak');
});

// ----------------------------------------------------------------- deduplication --

test('one catch mentioned twice is one catch', () => {
  const evs = [
    { source: 'a.md', line: 10, window: '2026-07-27', bucket: 'keeper', subject: 'seat-brace', sentence: 'x' },
    { source: 'b.md', line: 99, window: '2026-07-27', bucket: 'keeper', subject: 'seat-brace', sentence: 'y' },
  ];
  const { kept, merges } = dedupe(evs);
  assert.strictEqual(kept.length, 1);
  assert.strictEqual(kept[0].mentions, 2);
  assert.strictEqual(merges.length, 1, 'and the merge is reported, not silent');
});

test('two DIFFERENT catches are never merged', () => {
  const evs = [
    { source: 'a.md', line: 1, window: '2026-07-27', bucket: 'keeper', subject: 'seat-brace', sentence: 'x' },
    { source: 'a.md', line: 2, window: '2026-07-27', bucket: 'keeper', subject: 'independence-fetish', sentence: 'y' },
    { source: 'a.md', line: 3, window: '2026-07-27', bucket: 'committee', subject: 'seat-brace', sentence: 'z' },
    { source: 'a.md', line: 4, window: '2026-06-30', bucket: 'keeper', subject: 'seat-brace', sentence: 'w' },
  ];
  assert.strictEqual(dedupe(evs).kept.length, 4, 'subject, bucket and window must all agree to merge');
});

test('an event with no recoverable subject is LEFT SEPARATE, not merged', () => {
  // A false merge deletes a real catch silently; a false split costs one reader-minute.
  const evs = [
    { source: 'a.md', line: 1, window: 'w', bucket: 'keeper', subject: null, sentence: 'Keeper-caught.' },
    { source: 'a.md', line: 2, window: 'w', bucket: 'keeper', subject: null, sentence: 'Keeper-caught.' },
  ];
  const { kept, unkeyed } = dedupe(evs);
  assert.strictEqual(kept.length, 2);
  assert.strictEqual(unkeyed, 2);
  assert.deepStrictEqual(kept.map((k) => k.dedupe), ['no-signature', 'no-signature']);
});

test('attribution vocabulary is not a subject — or every keeper catch would collapse into one', () => {
  assert.strictEqual(namedSubject('Keeper-caught.'), null);
  assert.strictEqual(namedSubject('the chair\'s seat-brace was keeper-caught'), 'seat-brace');
  assert.strictEqual(namedSubject("the gone-isn't-final root"), "gone-isn't-final", 'apostrophes stay inside the token');
});

// --------------------------------------------------------------------- ledgers --

test('a ledger states a total and its enumeration is checked against it', () => {
  const text = 'Committee-caught: 5 (the planted defect ×2, the export omission, the thruster constant, the overflow change).';
  const [l] = parseLedgers(text, 'm.md');
  assert.strictEqual(l.bucket, 'committee');
  assert.strictEqual(l.stated, 5);
  assert.strictEqual(l.items.length, 4);
  assert.strictEqual(l.enumerated, 5, '×2 makes four items into five catches');
  assert.strictEqual(l.agrees, true);
});

test('a ledger whose arithmetic does not add up is reported as a MISMATCH', () => {
  const [l] = parseLedgers('Self-caught: 4 (the column bug; the impossible number).', 'm.md');
  assert.strictEqual(l.stated, 4);
  assert.strictEqual(l.enumerated, 2);
  assert.strictEqual(l.agrees, false);
});

test('a total that cannot be parsed is NOT guessed at', () => {
  // The real corpus line: the 3 belongs to Around's share, not to the bucket. A looser pattern
  // reads it as the total and reports a confidently wrong number.
  const text = 'Committee-caught, same night: Around → 3 chair-layer defects; Bravo → the model asymmetry.';
  assert.deepStrictEqual(parseLedgers(text, 'm.md'), []);
});

test("a ledger's own enumerated items do not re-enter the event stream", () => {
  // Line-keyed exclusion had this bug on the real corpus: the enumeration wraps across lines,
  // and its items are attributed prose, so the tally's contents got counted a second time.
  const text = [
    'Self-caught: 2 (the column bug, found by reading its output;',
    'the 599% context estimate, caught because the number was impossible).',
  ].join('\n');
  const ledgers = parseLedgers(text, 'm.md');
  const { events } = extractEvents(text, 'm.md', '2026-07-27');
  const { kept, removed } = separateLedgerSentences(events, ledgers);
  assert.ok(removed.length >= 1, 'the enumeration line must be held out');
  assert.deepStrictEqual(kept, [], 'nothing from inside the tally may be counted as an event');
});

// --------------------------------------------------------------------- windows --

test('a section takes its date from the nearest preceding dated heading', () => {
  const text = ['## Cycle 3 — 2026-07-26', 'body one', '## Cycle 4 — 2026-07-27', 'body two'].join('\n');
  const marks = windowsFor(text, null);
  assert.strictEqual(marks[1], '2026-07-26');
  assert.strictEqual(marks[3], '2026-07-27');
});

test('an undated section is undated, never back-filled from its neighbour', () => {
  // Back-filling would file catches in a cycle they did not happen in, which is the one error
  // that corrupts the "over time" reading the metric exists for.
  const marks = windowsFor(['## Cycle 4 — 2026-07-27', 'a', '## Known groups', 'b'].join('\n'), null);
  assert.strictEqual(marks[1], '2026-07-27');
  assert.strictEqual(marks[3], 'undated');
});

// ---------------------------------------------------------------------- rollup --

test('the ratio is WITHHELD when unattributed events outnumber attributed ones', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'catch-ledger-'));
  const jdir = path.join(dir, 'exo_memory', 'journal');
  fs.mkdirSync(jdir, { recursive: true });
  fs.writeFileSync(
    path.join(jdir, '2026-07-27.md'),
    [
      'The keeper caught the ordering.',
      'What caught it was reading.',
      'Something else caught it too.',
      'A third thing caught it as well.',
    ].join('\n\n'),
    'utf8'
  );
  const index = buildLedger([{ path: path.join(jdir, '2026-07-27.md'), label: 'journal/2026-07-27.md' }]);
  const w = index.windows.find((x) => x.window === '2026-07-27');
  assert.strictEqual(w.counts.keeper, 1);
  assert.strictEqual(w.counts.unattributed, 3);
  assert.strictEqual(w.ratio, null);
  assert.match(w.ratio_withheld, /unattributed 3 > attributed 1/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('the two ratios are computed as labelled, and divide-by-zero is null not Infinity', () => {
  assert.deepStrictEqual(ratiosFor({ self: 1, committee: 4, keeper: 4, instrument: 0, unattributed: 0 }), {
    inward_vs_keeper: 1.25,
    self_vs_keeper: 0.25,
  });
  assert.deepStrictEqual(ratiosFor({ self: 1, committee: 0, keeper: 0, instrument: 0, unattributed: 0 }), {
    inward_vs_keeper: null,
    self_vs_keeper: null,
  });
});

test('declared and extracted are reported side by side and never summed', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'catch-ledger-'));
  fs.mkdirSync(path.join(dir, 'exo_memory'), { recursive: true });
  const f = path.join(dir, 'exo_memory', 'muscle_map.md');
  fs.writeFileSync(f, ['## Cycle 4 — 2026-07-27', '', 'Keeper-caught: 1, about the aim.', '', 'He caught the ordering.'].join('\n'), 'utf8');
  const index = buildLedger([{ path: f, label: 'muscle_map.md' }]);
  const w = index.windows.find((x) => x.window === '2026-07-27');
  assert.strictEqual(w.declared.keeper, 1, 'the tally the author wrote');
  assert.strictEqual(w.counts.keeper, 1, 'the event found in prose, counted separately');
  assert.strictEqual(index.ledgers.length, 1);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('an empty corpus produces no windows and no crash', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'catch-ledger-'));
  const f = path.join(dir, 'empty.md');
  fs.writeFileSync(f, '', 'utf8');
  const index = buildLedger([{ path: f, label: 'empty.md' }]);
  assert.deepStrictEqual(index.windows, []);
  assert.strictEqual(index.meta.events_extracted, 0);
  fs.rmSync(dir, { recursive: true, force: true });
});
