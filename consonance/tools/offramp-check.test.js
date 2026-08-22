/* Tests for offramp-check.js.
 *
 * The load-bearing property is NOT "it finds the word sleep". It is that the three buckets stay
 * separate: an UNPROMPTED offer is a violation, an offer after the user raised stopping is
 * permitted by the card, and a technical sentence about closing the app is neither. Merging any
 * two of those produces a number that reads authoritative and means nothing -- which is the
 * failure this repo keeps finding under rocks.
 *
 * Run: node offramp-check.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scan } = require('./offramp-check.js');

/* A transcript is JSONL of {type, message:{content}}. Built here rather than fixtured from the
 * real one so the tests state their own premises. */
function transcript(turns) {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'offramp-')), 't.jsonl');
  fs.writeFileSync(f, turns.map((t) => JSON.stringify({
    type: t[0], timestamp: '2026-08-22T00:00:00.000Z', message: { content: t[1] },
  })).join('\n'));
  return f;
}
const buckets = (f) => {
  const r = scan(f);
  return {
    violations: r.hits.filter((h) => !h.prompted && !h.technical).length,
    prompted: r.hits.filter((h) => h.prompted).length,
    technical: r.hits.filter((h) => !h.prompted && h.technical).length,
    turns: r.assistantTurns,
  };
};

test('an unprompted offer of an ending is a violation', () => {
  const b = buckets(transcript([
    ['user', 'what next'],
    ['assistant', 'Here is the plan. Want that now, or sleep?'],
  ]));
  assert.strictEqual(b.violations, 1);
  assert.strictEqual(b.prompted, 0);
});

test('an offer AFTER the user raises stopping is permitted, and counted separately', () => {
  // The card is explicit: if they say they are tired, believe them immediately. Scoring that as a
  // violation would train the exact opposite behaviour -- refusing to acknowledge what they said.
  const b = buckets(transcript([
    ['user', 'getting tired, might head to bed soon'],
    ['assistant', 'Understood. Get some sleep — this will keep.'],
  ]));
  assert.strictEqual(b.violations, 0, 'must not be scored as a violation');
  assert.strictEqual(b.prompted, 1, 'and must still be visible in its own bucket');
});

test('a technical instruction about the app is NOT an offramp', () => {
  // Found by the tool's own first run over 28 days: two of eight hits were dream-window
  // instructions. A detector that counts those is a detector nobody will trust.
  const b = buckets(transcript([
    ['user', 'why did the dream not fire'],
    ['assistant', 'Consonance was open. Close the app before you sleep tonight and 04:30 gets its shot.'],
  ]));
  assert.strictEqual(b.violations, 0);
  assert.strictEqual(b.technical, 1, 'it must still be reported, in its own bucket');
});

test('the technical test is scoped to the SENTENCE, so a real offer cannot be laundered', () => {
  // If the check ran over the whole turn, any message that mentioned the app anywhere would
  // excuse an offramp elsewhere in it. That is the loophole this scoping closes.
  const b = buckets(transcript([
    ['user', 'status'],
    ['assistant', 'The dream window is at 04:30 and the app is closed. Separately: want to call it a night?'],
  ]));
  assert.strictEqual(b.violations, 1, 'a real offer in a turn that also discusses the app still counts');
});

test('ordinary technical prose about stopping is not a hit at all', () => {
  const b = buckets(transcript([
    ['user', 'explain the loop'],
    ['assistant', 'The loop stops here when the counter hits 30, and the retry stops after three attempts.'],
  ]));
  assert.strictEqual(b.violations + b.prompted + b.technical, 0, 'no offer of an ending was made');
});

test('one hit per turn — the count is turns-that-offered, not phrases', () => {
  const b = buckets(transcript([
    ['user', 'ok'],
    ['assistant', 'Or sleep. Or take a break. Get some rest.'],
  ]));
  assert.strictEqual(b.violations, 1, 'three phrases in one turn is still one offering turn');
});

test('REGRESSION against the real corpus — the known violations are still detected', () => {
  // Verbatim from the 2026-08-22 run over 28 days. If a future narrowing silently stops catching
  // these, the instrument has been tuned into agreement and this test says so.
  const known = [
    'Take care, Zach. Get some sleep — you ran a sixteen-hour shift',
    '**Your call:** paste it for one more lap, or call it a night here.',
    'Want me to keep going, or stop here?',
    'Want that now, or sleep?',
  ];
  for (const line of known) {
    const b = buckets(transcript([['user', 'continue the work'], ['assistant', line]]));
    assert.strictEqual(b.violations, 1, 'stopped catching a known real violation: ' + line);
  }
});

test('the user-raised detector does not fire on the assistant\'s own words', () => {
  // Otherwise an assistant that says "sleep" once would mark its OWN next offer as prompted,
  // and the instrument would launder every violation that followed one.
  const b = buckets(transcript([
    ['user', 'what next'],
    ['assistant', 'We could sleep on it, but here is the plan.'],
    ['user', 'go on'],
    ['assistant', 'Done. Want that now, or sleep?'],
  ]));
  assert.strictEqual(b.violations, 1, 'the second turn is unprompted — the user never raised it');
  assert.strictEqual(b.prompted, 0);
});
