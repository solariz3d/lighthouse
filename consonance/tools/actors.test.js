// The property that matters here is NOT "everything resolves". It is "nothing resolves
// WRONGLY, and whatever didn't resolve is visible."
//
// An identity resolver fails in two directions and they are not symmetric. Leaving two names
// unmerged costs you a split count, which shows up as an obviously duplicated actor and gets
// noticed. Merging two names that are different actors attributes one party's work to another
// and is nearly invisible afterwards — the record simply reads as though they were the same
// person all along. So the tests below weight that way: most of them are about refusing to
// merge, and the census is required to publish its own failures.
//
//   node consonance/tools/actors.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const path = require('path');
const os = require('os');

// A fixture letters map, so these assertions do not depend on whichever panes exist today.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'actors-'));
fs.writeFileSync(path.join(dir, 'letters.json'), JSON.stringify({
  '0c0c0c0a-0000-4000-8000-000000000a01': 'C',
  '1582ff09-1500-4c10-8af7-f75c524d9613': 'A',
  '18916fe2-463d-4bef-a513-c577506d4c02': 'B',
}));
process.env.CONSONANCE_DATA = dir;
const { canonical, census, sameActor } = require('./actors.js');

test('a UUID resolves to its letter, and says it came from the map', () => {
  const r = canonical('18916fe2-463d-4bef-a513-c577506d4c02');
  assert.strictEqual(r.actor, 'B');
  assert.strictEqual(r.via, 'uuid');
});

test('a pane sees its own transcript lines as its own — the defect that started this', () => {
  // B's posts land under 'B'; B's transcript lines land under its UUID. The QUIET filter
  // asked "is this pane string equal to mine" and answered no, so B was withheld from B.
  assert.ok(sameActor('B', '18916fe2-463d-4bef-a513-c577506d4c02'));
  assert.ok(sameActor('C', '0c0c0c0a-0000-4000-8000-000000000a01'));
});

test('historical aliases resolve, and are marked as aliases rather than facts', () => {
  assert.deepStrictEqual(canonical('sibling-B'), { actor: 'B', via: 'alias' });
  assert.deepStrictEqual(canonical('main'), { actor: 'C', via: 'alias' });
  assert.deepStrictEqual(canonical('M'), { actor: 'C', via: 'alias' });
});

test('the control plane is NOT folded into whoever holds the chair', () => {
  // `chair` lines are written by the server — every verb and every refusal. Folding them into
  // the Main pane would attribute the audit trail to the party it audits.
  const r = canonical('chair');
  assert.strictEqual(r.actor, 'chair');
  assert.strictEqual(r.via, 'non-pane');
  assert.ok(!sameActor('chair', 'C'), 'chair must never equal the Main pane');
});

test('tooling writers stay their own actors', () => {
  assert.strictEqual(canonical('backfill').via, 'non-pane');
  assert.ok(!sameActor('backfill', 'C'));
});

test('an UNKNOWN id is returned unchanged and never folded into a neighbour', () => {
  const r = canonical('sibling-de4ec539');
  assert.strictEqual(r.actor, 'sibling-de4ec539', 'must pass through untouched');
  assert.strictEqual(r.via, 'unresolved');
  // the dangerous direction: an unknown must not be judged the same actor as anything
  assert.ok(!sameActor('sibling-de4ec539', 'B'));
  assert.ok(!sameActor('sibling-de4ec539', 'sibling-de4ec539'),
    'two unresolved ids are not confirmed the same actor even when the strings match — ' +
    'sameActor answers "known to be one actor", and an unknown is not known');
});

test('an unambiguous UUID prefix resolves — the board writes prefixes, not full ids', () => {
  // `chair injected (...) -> 1582ff09`. Exact matching resolved none of these, and the first
  // wiring into residue.js therefore changed no number at all.
  assert.deepStrictEqual(canonical('1582ff09'), { actor: 'A', via: 'uuid-prefix' });
  assert.ok(sameActor('1582ff09', 'A'), 'a prefix and its letter are one actor');
});

test('an AMBIGUOUS prefix stays unresolved rather than picking the first match', () => {
  // The failure mode that would be invisible afterwards. `1` matches every id here.
  const r = canonical('111111');
  assert.notStrictEqual(r.via, 'uuid-prefix');
  // and a genuinely shared prefix must not silently become one of its candidates
  assert.ok(!sameActor('111111', 'A'));
});

test('a bare letter only resolves if some pane actually holds it', () => {
  assert.strictEqual(canonical('A').via, 'letter');
  assert.strictEqual(canonical('Z').via, 'unresolved', 'no pane holds Z, so Z is not an actor');
});

test('census publishes what it could not resolve — the whole point', () => {
  const c = census(['A', 'chair', 'sibling-B', 'who-is-this', 'who-is-this', 'Z']);
  assert.strictEqual(c.total, 6);
  const un = new Map(c.unresolved);
  assert.strictEqual(un.get('who-is-this'), 2, 'unresolved ids are listed with their counts');
  assert.strictEqual(un.get('Z'), 1);
  const vias = new Map(c.vias);
  assert.strictEqual(vias.get('unresolved'), 3);
  assert.ok(c.actors.length > 0);
});

test('an absent letters map resolves nothing and claims nothing', () => {
  // Fail toward not-knowing. A resolver that invents identities when its map is missing is
  // worse than one that returns everything unresolved and says so.
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'actors-empty-'));
  const r = require('child_process').execFileSync(process.execPath, ['-e', `
    process.env.CONSONANCE_DATA = ${JSON.stringify(empty)};
    const { canonical } = require(${JSON.stringify(path.join(__dirname, 'actors.js'))});
    console.log(JSON.stringify(canonical('18916fe2-463d-4bef-a513-c577506d4c02')));
  `], { encoding: 'utf8' });
  assert.strictEqual(JSON.parse(r).via, 'unresolved');
});

test('the real board resolves with nothing left over', () => {
  // Not a fixture: the actual corpus, because a synthetic map agrees with the rule by
  // construction and only the corpus can disagree with it.
  const board = 'C:/Consonance/data/board.jsonl';
  if (!fs.existsSync(board)) return;                    // other machine: skip, do not fail
  const ids = [];
  for (const line of fs.readFileSync(board, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    try { ids.push(JSON.parse(line).pane); } catch { /* not a record */ }
  }
  const c = census(ids);
  assert.ok(c.actors.length < new Set(ids.map(String)).size,
    'the resolver must actually collapse something on the real board');
  assert.deepStrictEqual(c.unresolved, [],
    'unresolved ids on the live board: add them to ALIASES with a quoted line as evidence, ' +
    'or leave them — but this assertion is how you find out they appeared');
});
