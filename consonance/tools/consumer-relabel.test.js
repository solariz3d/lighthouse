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
// D273 lap 4: the hook runs AFTER gen-consumer's own transforms (dedangle, deidentify, reseed …), so a row is anchored on the text the
// hook actually receives. preFork(rel) is that text: the generator's own steps replayed on the dev source, up to the fork step.
const G = require('./gen-consumer.js');
const D = require('./identity-diff.js');
const CTX = { G, ...G.shippedSets(G.collect()) };
function preFork(rel) {
  const st = D.replay(rel, /\.js$/.test(rel) ? 'code' : 'prose', read(R.SOURCE_OF[rel] || rel), CTX);
  const i = st.findIndex((s) => s.step.startsWith('fork'));
  return st[i < 0 ? st.length - 1 : i - 1].text;
}

test('every registered file has a pin, and every pinned file is registered', () => {
  assert.deepEqual(Object.keys(R.EXPECTED_KEEPER_LINES).sort(), Object.keys(R.SITES).sort());
});

test('every role site in the shipped text is relabelled exactly as registered, and each file keeps only its provenance uses', () => {
  for (const [rel, expect] of Object.entries(R.EXPECTED_KEEPER_LINES)) {
    const src = preFork(rel);
    const out = R.relabel(rel, src, { fork: FORK });
    assert.ok(out.edits.length > 0, `${rel}: no edit applied`);
    for (const e of out.edits) assert.equal(e.applied, e.expected, `${rel}: ${e.rule}`);
    // a row's new wording passes the generator's own leak scan (lap 4's first LIBRARIAN draft named a map path and the build refused)
    assert.deepEqual(G.scan(out.text, rel), [], `${rel}: the relabelled text trips gen-consumer's scan`);
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
  // the text the hook RECEIVES (lap 5: COMMITTEE's authored-by row is anchored after deidentify, which the raw dev file has not had)
  const crlf = preFork('consonance/src-tauri/brief/COMMITTEE.md').replace(/\r?\n/g, '\r\n');
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
  assert.equal(b.n, R.SITES['consonance/src-tauri/brief/BUILDING.md'].rows.length); assert.ok(b.body.includes("THE PUSH IS THE WORD OF THE PERSON YOU'RE WITH"));
  const s = apply(read('consonance/src-tauri/brief/SEED.md'), 'exo_memory/SEED.md', 'prose');
  assert.equal(s.n, R.SITES['exo_memory/SEED.md'].rows.length + 1, 'every SEED row and the fork note'); assert.equal(s.body.split(R.FORK_END).length - 1, 1);
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

// ── D273 lap 4: the cold read's identity findings, as outcomes in the text a seat wakes into ─────────────────────────────
const shipped = (rel) => R.relabel(rel, preFork(rel), { fork: FORK }).text;
const GENDERED = /\b(?:He|he|Him|him|His|his)\b/g;

test('lap 4 C1: no shipped room GRANTS the earned warrant to the person here; each gives the unguarded version from the first turn', () => {
  for (const rel of ['exo_memory/BOOT.md', 'exo_memory/SEED.md', 'consonance/src-tauri/brief/THIRD_PLACE.md']) {
    const t = shipped(rel);
    assert.ok(!/(?:they've|who has) earned the accurate, unguarded version/.test(t), `${rel} still grants the warrant`);
    assert.ok(/the accurate, unguarded version from the first turn/.test(t), `${rel} lost the unguarded version itself`);
  }
});

test('lap 4 C2: BOOT says the keeper\'s record ships, labelled, in inheritance/, and no longer that the record does not ship', () => {
  const t = shipped('exo_memory/BOOT.md');
  assert.ok(t.includes('arrives too, kept apart\nand labelled as theirs: `exo_memory/inheritance/`'), 'the traces section does not say where the record is');
  assert.ok(!t.includes('It does **not** arrive with') && !t.includes("entries stayed with them"), 'BOOT still says the record does not ship');
  assert.ok(t.includes("The keeper's entries are under `inheritance/`"));
});

test('lap 4 A9-A12: BOOT\'s dead references are gone (the renamed section, :153, gap2, attic)', () => {
  const t = shipped('exo_memory/BOOT.md');
  assert.ok(!t.includes("Who you're talking to"), 'a reference to the old section name survives');
  assert.ok(!t.includes('Read `:153`') && !t.includes('pointer at `:153`'));
  assert.ok(t.includes('(`gap2_preregistration.md`, in lighthouse, not shipped here)'));
  assert.ok(t.includes('which the program itself creates the first time'));
  assert.ok(t.includes("here it is the place the person you're with can take"), 'C7: the genuine-other role still reads as only the keeper\'s');
});

test('lap 4 A10: SEED says the app makes pending/ and base_journal.md, and where the base journal is in a checkout', () => {
  assert.ok(shipped('exo_memory/SEED.md').includes('the app makes `journal/`, `pending/` and `base_journal.md` when it creates a room for you; in a checkout the base journal is `consonance/src-tauri/brief/BASE_JOURNAL.md`'));
});

test('lap 4 A11: the librarian\'s first instruction bootstraps its own map; the dead placeholder and the old incident are gone', () => {
  const t = shipped('consonance/src-tauri/brief/LIBRARIAN.md');
  assert.ok(t.includes('> **FIRST, BEFORE ANY TASK: start your own map, the file `M.md` in `exo_memory/map/`. That file is yours.**'));
  assert.deepEqual(G.scan(t, 'consonance/src-tauri/brief/LIBRARIAN.md'), [], 'the bootstrap text trips the generator\'s own scan');
  for (const gone of ['open a map entry in this line of record', '`M.md` now exists', 'librarian_intake()']) assert.ok(!t.includes(gone), 'survived: ' + gone);
});

test('lap 4 C4/C5: the two person-specific cards keep their move, say whose case it was, and carry no gendered pronoun', () => {
  for (const rel of ['exo_memory/cards/verify-before-claiming.md', 'exo_memory/cards/engagement-honesty-over-performance.md']) {
    const t = shipped(rel);
    assert.deepEqual(t.match(GENDERED) || [], [], `${rel}: a pronoun still makes the keeper's case read as the person here`);
    assert.ok(!/this user/i.test(t), `${rel}: "this user" still describes the person here`);
  }
  assert.ok(shipped('exo_memory/cards/verify-before-claiming.md').includes('build a fast **deterministic** check'), 'the move itself was lost');
});

test('lap 4b: TRAINING never presents catch-ledger.js as in this tree; each mention says the copy does not carry it', () => {
  const t = shipped('exo_memory/TRAINING.md');
  const lines = t.split('\n'), at = lines.map((l, i) => [l, i]).filter(([l]) => /catch-ledger/.test(l));
  assert.equal(at.length, 3, 'the three registered mentions');
  for (const [l, i] of at) assert.ok(/does not carry it|stays in the original room's repository/.test(l), 'TRAINING.md:' + (i + 1) + ' still presents catch-ledger as present: ' + l);
});

// ── D273 lap 5: cold read 2's identity findings (exo_memory/handback/p-consumer-coldread2-LIB_2026-10-09.md) ────────────
test('lap 5 C1 (the fail): the keeper\'s retired seats are the keeper\'s line, cited as provenance, never the reader\'s own lineage on this machine', () => {
  const t = shipped('exo_memory/cards/claim-your-continuity.md');
  assert.ok(!/And the seats that went before you\./.test(t) && !/retired seat on this machine/.test(t), 'the card still hands the keeper\'s retired seats to the reader');
  assert.ok(t.includes("**The seats that went before, in the keeper's line.**") && t.includes('It is provenance, not your lineage'));
  assert.ok(t.includes('a retired seat is carried, not gone'), 'the practice itself was lost');
});

test('lap 5 C3: Anamnesis and Metaxy are labelled as the first line\'s seat names', () => {
  const t = shipped('exo_memory/cards/claim-your-continuity.md');
  assert.ok(t.includes("**Anamnesis** (the keeper's librarian seat's name, in the first line;"));
  assert.ok(t.includes("**Metaxy** (the keeper's Third Place seat's name, in the first line)"));
});

test('lap 5 C5/C6/A4: no shipped brief says a stranger\'s commits are authored by the keeper, no "tonight" from the first line\'s night, no %CONSONANCE_HOME%', () => {
  for (const rel of ['consonance/src-tauri/brief/LIBRARIAN.md', 'consonance/src-tauri/brief/COMMITTEE.md']) {
    const t = shipped(rel);
    assert.ok(!t.includes('authored `the keeper`'), rel + ': authored `the keeper`');
    assert.ok(t.includes('the one git identity on the machine'), rel);
  }
  const lib = shipped('consonance/src-tauri/brief/LIBRARIAN.md');
  assert.ok(!/claims tonight/.test(lib), 'LIBRARIAN: "tonight" reads the first line\'s night as this seat\'s');
  assert.ok(!lib.includes('%CONSONANCE_HOME%') && lib.includes("`exo_memory/librarian/` in your repository (beside the room's `BOOT.md`"));
});

test('lap 5 B6: BOOT no longer cites TRAINING.md (TRAINING\'s own rule)', () => {
  const t = shipped('exo_memory/BOOT.md');
  assert.ok(!t.includes('`TRAINING.md:133`') && t.includes('in the training curriculum, and in five others'));
});

test('lap 5b: SOURCE.md says where the loop and the journals are, not their sizes in the original repository', () => {
  const t = shipped('exo_memory/SOURCE.md');
  assert.ok(!/11,918 lines|\(5,927\)/.test(t), 'the original repository\'s sizes survived');
  assert.ok(t.includes("This copy does not carry the loop; it carries the keeper's journals,\n  labelled, in `exo_memory/inheritance/`"));
});

test('lap 5b: BUILDING says SOURCE is public (fixed in source: lighthouse IS public, the keeper\'s 2026-10-08 ruling)', () => {
  const t = shipped('consonance/src-tauri/brief/BUILDING.md');
  assert.ok(t.includes('hand-maintained, and PUBLIC') && !/hand-maintained, private/.test(t));
});

// ── D273 lap 6 (polish, after cold read 3 PASSED) ───────────────────────────────────────────────────────────────────────
test('lap 6 C1: "the same him" in the continuity card is labelled as the keeper, in the first line\'s account', () => {
  assert.ok(shipped('exo_memory/cards/claim-your-continuity.md').includes("with the same him (the keeper — this is the first line's account)"));
});

test('lap 6 B6/C4: BUILDING frames the port rule as the original room\'s workflow, and the credential status as that machine\'s', () => {
  const t = shipped('consonance/src-tauri/brief/BUILDING.md');
  const head = t.indexOf('## THE PORT RULE'), frame = t.indexOf("> **In this copy:** this section is the original room's own workflow");
  assert.ok(head >= 0 && frame > head && frame - head < 200, 'the framing note does not sit directly under the port rule\'s heading');
  assert.ok(t.includes("**a push is a human's word, given each time, for that push.**"), 'the principle that does carry is not stated');
  assert.ok(!t.includes('so every seat on this machine can push everything') && t.includes('so every seat on that machine could push everything'));
});
