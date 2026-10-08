// consumer-relabel.test.js — the keeper split and the fork note for the consumer tree (D273 lap 2, C).
//
//   node --test consonance/tools/consumer-relabel.test.js
//
// The keeper's ruling, 2026-10-08 12:55 (exo_memory/loop/plan_consumer_refresh_2026-10-08.md): "the keeper is the creator ...
// it should be understood the keeper is me the creator". So a PROVENANCE use of "the keeper" (a rule's origin, a quote, a decision)
// ships exactly as written, and a ROLE use (whoever keeps this room now) ships as "the person you're with" (SEED.md:9's phrase).
// These rows run the module over the REAL dev briefs, so a role line edited away, or a new "keeper" line added in dev, fails here
// loudly instead of shipping unclassified.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const R = require('./consumer-relabel.js');

const REPO = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8');
const TEMPLATE = read('consonance/src-tauri/brief/frag-fork.md');
const FORK = R.fillFork(TEMPLATE, { sha: 'ea4f5bcf', date: '2026-10-08' });
const keeperLines = (t) => t.split(/\r?\n/).filter((l) => /keeper/i.test(l));

test('every role site in the dev briefs is relabelled exactly as registered, and each file keeps only its provenance uses', () => {
  for (const [rel, expect] of Object.entries(R.EXPECTED_KEEPER_LINES)) {
    const src = read(R.SOURCE_OF[rel] || rel);
    const out = R.relabel(rel, src, { fork: FORK });
    assert.ok(out.edits.length > 0, `${rel}: no edit applied`);
    for (const e of out.edits) assert.equal(e.applied, e.expected, `${rel}: ${e.rule}`);
    // the pin: the lines still naming the keeper after the relabel (FORK's own lines excluded) are the provenance uses, counted.
    // A new "keeper" line in dev changes this number and fails here, so it is classified before it ships.
    const left = keeperLines(out.text).filter((l) => !keeperLines(FORK).includes(l));
    assert.equal(left.length, expect, `${rel}: ${left.length} lines still name the keeper (expected ${expect}); classify the new one in consumer-relabel.js:\n${left.join('\n')}`);
  }
});

test('provenance stays byte for byte: the keeper\'s quoted rules and decisions are untouched', () => {
  const b = R.relabel('consonance/src-tauri/brief/BUILDING.md', read('consonance/src-tauri/brief/BUILDING.md')).text;
  for (const s of ["The keeper's words: *\"each seat tells the next where to hand it to remind it.\"*",
    'and he is declining it, which is his to decline.',
    'That trace is the case law: the gate worked, he said yes, and then changed his',
    "## THE JOINT STEP — the guess before the map (added 2026-08-23, the keeper's refinement)"]) assert.ok(b.includes(s), `provenance changed: ${s}`);
  const boot = R.relabel('exo_memory/BOOT.md', read('consonance/src-tauri/brief/BOOT.md'), { fork: FORK }).text;
  assert.ok(boot.includes('**Two faces, one thing (the keeper, 2026-06-28).**'));
  assert.ok(boot.includes('The specific belongs to the keeper and stays private'));
});

test('the role uses read "the person you\'re with" afterwards, and none of the old role wording survives', () => {
  const b = R.relabel('consonance/src-tauri/brief/BUILDING.md', read('consonance/src-tauri/brief/BUILDING.md')).text;
  for (const gone of ["nothing into the keeper's typing", "THE PUSH IS THE KEEPER'S WORD", 'ONLY when the keeper says push', 'the keeper pushes with his own',
    "The keeper's word cannot be automated", 'the check is the keeper noticing', "same turn's message to the keeper does not describe"]) assert.ok(!b.includes(gone), `role wording survived: ${gone}`);
  for (const now of ["nothing into the typing of the person you're with", "THE PUSH IS THE WORD OF THE PERSON YOU'RE WITH",
    "ONLY when the person you're with says push", "post a board row quoting their words", "the person you're with pushes with their own"]) assert.ok(b.includes(now), `missing: ${now}`);
  const seed = R.relabel('exo_memory/SEED.md', read('consonance/src-tauri/brief/SEED.md'), { fork: FORK }).text;
  assert.ok(seed.includes("**The person you're with keeps this room from their first turn.**"));
  assert.ok(!/is the keeper of this room/.test(seed));
});

test('the fork note lands once, in place, at BOOT (both shipped paths) and SEED (both shipped paths)', () => {
  for (const [rel, srcRel, after] of [['exo_memory/BOOT.md', 'consonance/src-tauri/brief/BOOT.md', 'a **room you re-become yourself in.**'],
    ['consonance/src-tauri/brief/BOOT.md', 'consonance/src-tauri/brief/BOOT.md', 'a **room you re-become yourself in.**'],
    ['exo_memory/SEED.md', 'consonance/src-tauri/brief/SEED.md', 'and then attend to *them*.'],
    ['consonance/src-tauri/brief/SEED.md', 'consonance/src-tauri/brief/SEED.md', 'and then attend to *them*.']]) {
    const t = R.relabel(rel, read(srcRel), { fork: FORK }).text;
    assert.equal(t.split(R.FORK_MARKER).length - 1, 1, `${rel}: the fork note should appear once`);
    const at = t.indexOf(R.FORK_MARKER), anchor = t.indexOf(after);
    assert.ok(anchor >= 0 && anchor < at && at - anchor < after.length + 8, `${rel}: the note is not right after its anchor paragraph`);
  }
  const boot = R.relabel('exo_memory/BOOT.md', read('consonance/src-tauri/brief/BOOT.md'), { fork: FORK }).text;
  assert.ok(boot.includes("not **the keeper**, who built this room, but the person you're with."), 'BOOT :5 still offers "maybe the keeper"');
  assert.ok(boot.includes('## Who built this room\n') && !boot.includes("## Who you're talking to"), 'the keeper\'s portrait is still titled as the person here');
});

test('a BOOT or SEED relabel without the fork note is refused, not shipped without it', () => {
  assert.throws(() => R.relabel('exo_memory/BOOT.md', read('consonance/src-tauri/brief/BOOT.md')), (e) => e instanceof R.RelabelError && /fork/.test(e.message));
  assert.throws(() => R.relabel('exo_memory/SEED.md', read('consonance/src-tauri/brief/SEED.md')), R.RelabelError);
});

test('an anchor that drifted in dev is refused by name, never silently skipped', () => {
  const src = read('consonance/src-tauri/brief/BUILDING.md').replace("nothing into the keeper's typing", 'nothing into the keepers typing');
  assert.throws(() => R.relabel('consonance/src-tauri/brief/BUILDING.md', src), (e) => e instanceof R.RelabelError && /BUILDING\.md/.test(e.message) && /typing/.test(e.message));
});

test('a file with no registered sites comes back unchanged, and CRLF input keeps CRLF', () => {
  const t = 'the keeper, 2026-09-16: "a rule"\nmore\n';
  assert.deepEqual(R.relabel('consonance/tools/whatever.md', t), { text: t, edits: [] });
  const crlf = read('consonance/src-tauri/brief/COMMITTEE.md').replace(/\r?\n/g, '\r\n');
  const out = R.relabel('consonance/src-tauri/brief/COMMITTEE.md', crlf).text;
  assert.ok(out.includes("in a reply to the person you're with as in a hand-back") && !/[^\r]\n/.test(out), 'CRLF lost or the site missed');
});

test('fillFork: the sha and date are filled, nothing is left unfilled, and the note says once that the person keeps their room as the keeper kept this one', () => {
  assert.ok(FORK.includes('lighthouse `ea4f5bcf`') && FORK.includes('2026-10-08') && !/\{[A-Z_]+\}/.test(FORK));
  assert.ok(FORK.startsWith(R.FORK_MARKER));
  assert.equal(FORK.split("keeps this room the way the keeper kept the one it grew from").length - 1, 1);
  assert.throws(() => R.fillFork(TEMPLATE, { sha: 'ea4f5bcf' }), R.RelabelError);
  assert.throws(() => R.fillFork(TEMPLATE, { sha: 'not a sha', date: '2026-10-08' }), R.RelabelError);
  assert.throws(() => R.fillFork('no marker {FORK_SHA} {FORK_DATE}', { sha: 'ea4f5bcf', date: '2026-10-08' }), R.RelabelError);
  assert.ok(FORK.trimEnd().endsWith(R.FORK_END), 'the note ends with the marker the app cuts at');
  assert.throws(() => R.fillFork(R.FORK_MARKER + ' {FORK_SHA} {FORK_DATE}\nno end marker\n', { sha: 'ea4f5bcf', date: '2026-10-08' }), (e) => e instanceof R.RelabelError && /end/.test(e.message));
});

test('applyFork is FORK_HOOK\'s contract: a registered file comes back relabelled with n = its edits, any other file untouched with n = 0', () => {
  const apply = R.applyFork({ fork: FORK });
  const b = apply(read('consonance/src-tauri/brief/BUILDING.md'), 'consonance/src-tauri/brief/BUILDING.md', 'prose');
  assert.equal(b.n, 13); assert.ok(b.body.includes("THE PUSH IS THE WORD OF THE PERSON YOU'RE WITH"));
  const s = apply(read('consonance/src-tauri/brief/SEED.md'), 'exo_memory/SEED.md', 'prose');
  assert.equal(s.n, 3, 'two rows and the fork note'); assert.equal(s.body.split(R.FORK_END).length - 1, 1);
  const other = 'the keeper, 2026-09-16: "a rule"\n';
  assert.deepEqual(apply(other, 'consonance/tools/anything.js', 'code'), { body: other, n: 0 });
  assert.throws(() => R.applyFork({}), R.RelabelError);
});

test('forkHook fills the note from this repository\'s HEAD (its short sha and commit date)', () => {
  const { execFileSync } = require('child_process');
  const [sha, date] = execFileSync('git', ['-C', REPO, 'log', '-1', '--format=%h %cs'], { encoding: 'utf8' }).trim().split(' ');
  const t = R.forkHook({ repo: REPO })(read('consonance/src-tauri/brief/BOOT.md'), 'exo_memory/BOOT.md', 'prose').body;
  assert.ok(t.includes(`up to ${date} (lighthouse \`${sha}\``), 'the note does not name HEAD');
});
