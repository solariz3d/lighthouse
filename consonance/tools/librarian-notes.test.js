/* librarian-notes.test.js — the seat's notes must be somewhere that is both WRITTEN and READ.
 *
 * WHAT THIS PREVENTS, because it already happened. Until 2026-08-23 the Librarian brief told the
 * seat to write its notes to `notes/`, resolved against its instance directory — outside the repo.
 * 154 lines and 10,669 bytes of ledger, restore point and registered-falsifier scoring accumulated
 * there with 0 of them in any commit, invisible to `ferry.js`, unreachable from the desktop, and
 * gone the moment that directory is cleaned.
 *
 * The dangerous property is not the loss. It is that a seat writing into a place nothing reads
 * produces output IDENTICAL to a seat that had nothing to say -- and the seat's own falsifier is
 * scored on exactly that signal ("if a season passes and no journal entry says a thing was opened
 * because the librarian named it, this seat is decorative"). A broken notes path would therefore
 * have read as evidence FOR shutting the seat off. That is wrong in the dangerous direction.
 *
 * So the three places that must agree are pinned here: the brief tells the seat where to write,
 * corpus_shelf() decides what a fresh wake carries, and corpus-age.js measures capacity over the
 * same set. Any one of them drifting silently breaks the loop.
 *
 * Run: node consonance/tools/librarian-notes.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..');
const BRIEF = path.join(REPO, 'consonance', 'src-tauri', 'brief', 'LIBRARIAN.md');
const MAIN_RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const NOTES_DIR = path.join(REPO, 'exo_memory', 'librarian');

const read = (p) => fs.readFileSync(p, 'utf8');

test('the notes directory exists in the repo and is not empty', () => {
  assert.ok(fs.existsSync(NOTES_DIR), 'exo_memory/librarian/ is missing');
  // AN OPTIONAL MACHINE SUFFIX IS PART OF THE NAME. The desktop librarian's first wake wrote
  // `2026-08-25.desktop.md` rather than appending to the laptop's `2026-08-25.md` (81,697 bytes
  // that day) — P-TWO-WRITERS' cheap candidate, avoiding a loud add/add on one file two machines
  // both want. `/^\d{4}-\d{2}-\d{2}\.md$/` could not see it, so the seat's own notes were
  // invisible to the guard that exists to prove it has a restore point.
  //
  // THE FAILURE MODE, STATED CORRECTLY, because the hand-back stated it wrong and the difference
  // is the whole distinction this repo runs on. The seat reported that a desktop-only future
  // would leave "the guard's universe empty and the suite green." It would not: `dated.length`
  // would be 0 and the assertion below would go RED. Loudly, which is the good failure. What the
  // old regex actually cost was narrower and still worth fixing — the guard could not COUNT the
  // desktop's notes, so it verified the laptop's restore point and called that the seat's.
  const dated = fs.readdirSync(NOTES_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}(\.[a-z0-9-]+)?\.md$/.test(f));
  assert.ok(dated.length > 0, 'no dated notes present — the seat has no restore point to carry');
});

test('the brief points the seat at exo_memory/librarian/, not at an instance-local notes/', () => {
  const brief = read(BRIEF);
  assert.ok(brief.includes('exo_memory/librarian/') || brief.includes('exo_memory' + String.fromCharCode(92) + 'librarian'),
    'the brief does not name the repo notes directory');
  // The specific regression: an unqualified `notes/` sends the seat outside the repo.
  assert.ok(!brief.includes('Notes go to ' + String.fromCharCode(96) + 'notes/' + String.fromCharCode(96)),
    'the brief still sends notes to an instance-local notes/ — outside the repo, unreadable by anyone else');
});

test('corpus_shelf() carries the librarian directory, so a fresh wake holds its own last notes', () => {
  const src = read(MAIN_RS);
  const order = src.match(/let order: \[\(&str, bool, bool\); \d+\] = \[([\s\S]*?)\];/);
  assert.ok(order, 'could not find corpus_shelf order[] in main.rs');
  assert.ok(order[1].includes('"librarian"'),
    'the shelf does not carry exo_memory/librarian/ — the seat would have to go looking for its own notes');
});

test('the librarian directory is carried NEWEST-FIRST — an inheritance is the most recent one', () => {
  const src = read(MAIN_RS);
  const order = src.match(/let order: \[\(&str, bool, bool\); \d+\] = \[([\s\S]*?)\];/);
  assert.match(order[1], /\("librarian",\s*true,\s*true\)/,
    'librarian must be (newest-first, carried): it is the seat\'s own restore point');
});

test('the declared arity of order[] matches the number of entries in it', () => {
  // A stale `; 9]` against 10 entries does not compile, but the reverse -- adding an entry and
  // bumping the count without adding the directory -- is a silent no-op. Count them.
  const src = read(MAIN_RS);
  const m = src.match(/let order: \[\(&str, bool, bool\); (\d+)\] = \[([\s\S]*?)\];/);
  const declared = parseInt(m[1], 10);
  const actual = (m[2].match(/\(\s*"[^"]*"\s*,\s*(?:true|false)\s*,\s*(?:true|false)\s*\)/g) || []).length;
  assert.strictEqual(actual, declared, 'order[] declares ' + declared + ' entries but contains ' + actual);
});

test('corpus-age.js measures the same set the shelf carries', () => {
  // If the tool and the shelf disagree, the capacity headline under-reports pressure on the seat
  // while looking authoritative -- the failure direction that matters.
  // RE-POINTED 2026-09-02 (BRAVO, L033): this read `const CARRIED` out of corpus-age.js by regex.
  // That single list is now two -- CARRY_TIERS and INDEX_TIERS -- because the shelf stopped
  // carrying map/, journal/ and loop/ on 2026-08-24 and the tool had gone on counting them as
  // carried. Reads the EXPORT rather than the source text, so a rename cannot break it again.
  const { corpusSize, CARRY_TIERS } = require('./corpus-age.js');
  assert.ok(Array.isArray(CARRY_TIERS) && CARRY_TIERS.length, 'corpus-age.js exports no CARRY_TIERS');
  assert.ok(CARRY_TIERS.includes('librarian'),
    'corpus-age.js does not count exo_memory/librarian/ but the shelf carries it');
  assert.ok(corpusSize().bytes > 0, 'corpusSize() returned nothing');
});

test('the notes are actually tracked by git — the whole point of the move', () => {
  const { execFileSync } = require('node:child_process');
  const out = execFileSync('git', ['ls-files', 'exo_memory/librarian'],
    { cwd: REPO, encoding: 'utf8' });
  assert.ok(out.trim().length > 0,
    'exo_memory/librarian/ is untracked — the notes are still invisible to ferry.js and to every other machine');
});
