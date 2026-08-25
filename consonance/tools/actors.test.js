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
// RESOLVED 2026-08-24 and the declaration removed with it. This file carried a
// `JS-SUITE: EXPECTED-RED` marker from 2026-08-17: red on purpose until the alias worklist was
// curated "with board evidence only the keeper has". That evidence never existed — the seven
// remaining ids all died before the letter system was born — so the condition was uncompletable
// rather than merely unmet, and the exemption would have outlived its reason indefinitely.
// js-suite reports a declared-red file that goes green as CANARY SANG and fails the run, which
// is why the marker had to come out in the same commit that made the file green.
//
// SPLIT 2026-08-25, and this file is now the PORTABLE half. Everything here runs anywhere: it asks
// questions about the MODULE, against a fixture map built three lines below. What left is
// everything that asked a question about the RECORD — the assertions that read the live board,
// persist.log and letters.json — because on 2026-08-25 the desktop ran this file and got a hard red
// out of a healthy module: it HAS C:\Consonance\data, so the existsSync guards passed, and the
// board inside it is the desktop's own. A true check over the wrong universe, reporting red.
// Those assertions now live in `actors.evidence.test.js` under js-suite's MACHINE-BOUND class,
// which runs them where their corpus is and reports NOT-RUN with a reason everywhere else.
//
// KEEP THE LINE WHERE IT IS. A test belongs here if a second machine should be able to run it and
// get the same answer; it belongs there if the answer is a fact about one board.
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
const { canonical, census, sameActor, PRE_LETTER } = require('./actors.js');

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

// ── THE PRE-LETTER CLASS ─────────────────────────────────────────────────────────────────────
// The seven ids the canary was waiting on. `unresolved` said "this file does not know"; the file
// does know, and the tests below are about the difference between those two states. Note which
// direction they weight: almost all of them are still about REFUSING to merge, because a class
// that made the census tidy by folding a letterless pane into a neighbour would be the exact
// failure the module was written against, arriving through the door marked "fix".

test('a pre-letter id is CLASSIFIED, and is still never folded into a letter', () => {
  for (const id of Object.keys(PRE_LETTER)) {
    assert.deepStrictEqual(canonical(id), { actor: id, via: 'pre-letter' },
      `${id} must resolve to ITSELF — the class says "attributable to a pane id", not to a letter`);
    for (const letter of ['A', 'B', 'C']) {
      assert.ok(!sameActor(id, letter), `${id} must not become ${letter}`);
    }
  }
});

test('two rows from ONE pre-letter pane are one actor — the difference from unresolved', () => {
  // This is the whole gain, and it is worth stating as an assertion rather than a comment.
  // `sameActor` answers "known to be one actor", so two identical UNKNOWN strings stay `false`
  // (asserted above). A pre-letter id is known: it is a specific pane that specifically has no
  // letter. Same string, and now a real answer.
  const id = '66eee6ce-baef-4007-a9ea-38f2e8c73fa7';
  assert.ok(sameActor(id, id));
  assert.ok(!sameActor('sibling-de4ec539', 'sibling-de4ec539'));
});

test('census reports pre-letter as its own via, and stops calling them unknown', () => {
  const id = 'b8ea54e3-a319-4c67-bf67-335a80be86da';
  const c = census(['A', id, id, 'who-is-this']);
  const vias = new Map(c.vias);
  assert.strictEqual(vias.get('pre-letter'), 2);
  assert.deepStrictEqual(c.unresolved, [['who-is-this', 1]],
    'a pre-letter id must leave the unresolved list, and a genuine unknown must stay in it');
});

test('a RETROACTIVE BACKFILL wins: given a letter, an id stops being pre-letter', () => {
  // The one edit that would make this class a lie is someone writing a letter for one of these
  // ids. `canonical` consults the map first, so the table simply stops firing — asserted here in
  // a child process because the module caches its map on first read.
  const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'actors-backfill-'));
  fs.writeFileSync(path.join(dir2, 'letters.json'),
    JSON.stringify({ '061bc00e-5932-4e5a-854f-f34dd6c09c10': 'Z' }));
  const out = require('child_process').execFileSync(process.execPath, ['-e', `
    process.env.CONSONANCE_DATA = ${JSON.stringify(dir2)};
    const { canonical } = require(${JSON.stringify(path.join(__dirname, 'actors.js'))});
    console.log(JSON.stringify(canonical('061bc00e-5932-4e5a-854f-f34dd6c09c10')));
  `], { encoding: 'utf8' });
  assert.deepStrictEqual(JSON.parse(out), { actor: 'Z', via: 'uuid' },
    'the letters map must outrank the pre-letter table, or the class outlives its reason');
});
