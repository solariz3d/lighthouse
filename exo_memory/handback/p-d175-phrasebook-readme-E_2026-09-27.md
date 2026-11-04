# P-D175-PHRASEBOOK-README · ECHO: the starter phrasebook, and the README's status table

**Pane E, machine D, 2026-09-27 17:2x–18:1x local.** Repo `C:\Users\nname\Desktop\t180-track-builder`, working tree
only. **Nothing committed, nothing pushed, no AC launched.** Every test run used `--test-concurrency=4`. The full suite
and the mutation passes each ran under the heavy-run lock, and waited their turn behind B's and C's runs.

## 0 · In short

- **`src/doc/phrasebook.js` (new): four built-in starter phrases** (ARCHITECTURE §2 phrases, §11.7 "a starter
  phrasebook"): **sakura flow**, **bowl hairpin**, **S** and **spiral climb**.
  - Every one resolves, builds (with the BVH self-check on) and validates with **no red, no amber, no info**, at its
    default tempo and the 460 km/h design speed, and with no speed at all.
  - Placing one is **one undo step.** Each quotes its sources, and a test checks that every quote is really on the line
    it cites.
- **Two phrases needed changes the tests forced, both real:**
  - **Sakura's words at their default angles turn 270° and cross their own lead-in** (red: self-intersection and
    stacked, measured). The phrase keeps the grammar and each word's own radius, and shares one 90° corner 10/20/30/20/10°.
  - **My first spiral opened straight into tight,** which Sakura's own rule forbids. It now opens and closes through a
    turn.
- **A test also caught a misquote of mine:** ARCHITECTURE.md:36 has `**Phrase:**`, and I had dropped the `**`.
- **Registering them in the palette needs A's files.** §3 has the exact diff: 7 files, 151 lines, tested on a full copy
  of today's tree, 121 of 121 pass.
- **README.md: the status table,** 81 rows over §1–§6, §5b and §5c, each tested (test file named), built (file named) or
  not yet (what is missing).
  - It is judged from **`main` at `aa4d565`**, where D171–D174 landed while I worked; the packet named `59ff906`.
  - Pending rows: the phrasebook, texture packs, and the soak and bench scripts.
  - It carries the v1 scope quote, the no-in-game-testing line, and the no-other-authors'-content promise, kept word
    for word.
- **Tests:**
  - mine: 26 pass, 0 fail;
  - the full suite, under the lock: repo 633 tests, 626 pass, 0 fail, 7 todo; app 253 pass, 0 fail.
- **Mutants,** on a copy, under the lock: the first pass was 19 applied, 18 caught, 0 NOT APPLIED. **Final: 18
  applied, 18 caught, 0 NOT APPLIED.**

## 1 · Files

sha256 and lines are from `sha256sum` and `wc -l` at 18:0x.

| file | sha256 | lines | what |
|---|---|---|---|
| `src/doc/phrasebook.js` (new) | see below | 97 | `PHRASES` (words, quoted sources, notes), `placePhrase(doc, name)`, `phrasebookPieces()` |
| `test/phrasebook.test.js` (new) | `313f035f7d764095…` | 119 | 26 tests |
| `README.md` | see below | 192 | the status table, the v1 scope, and what's here |

The phrasebook changed once after hashing (a dead parameter removed, §5), and the README once (re-judged to
`aa4d565`). Both are re-hashed in §7 after the last edit.

## 2 · The four phrases, and where each comes from

Each phrase quotes its lines in `source`; the test reads each cited line and checks the quote is on it. Each is
measured with a `node -e` probe: a straight lead-in, the phrase, `buildMesh` with `selfCheck: true`, and `validate` at
460 km/h.

| phrase | words | from | measured |
|---|---|---|---|
| **sakura flow** | sweep → turn → tight → turn → sweep, all left, half-pipe, standard tempo | FINDINGS.md:180-181, the grammar word for word; :139 and :172, Sakura is the half-pipe track | 988 m; red 0, amber 0 |
| **bowl hairpin** | turn → tight → turn, left, bowl | ARCHITECTURE.md:36, the name; FINDINGS.md:14, the bowl is the dominant form; :180-181, never straight into tight | 1,267 m, 210°; red 0 |
| **S** | turn left → turn right, bowl, serpents tempo | ARCHITECTURE.md:36, the name; ARCHITECTURE.md:44, Serpents at 100–170 m; FINDINGS.md:199, the Serpents Spiral row | 477 m; net heading 0; red 0 |
| **spiral climb** | turn (+6° climb) → tight → tight → tight → turn (−6°), left, bowl | ARCHITECTURE.md:36; FINDINGS.md:174, the climbing share; :180-181; :199 | 1,805 m, 390°, rising 131 m; red 0 |

**Where a value is chosen, not measured, the phrase's own `note` says so.**
- **The spiral's 6° is chosen.** It is load-bearing: at 0° the lap is red, self-intersection and stacked, and a test
  proves it.
- **Sakura's 90° corner split 10/20/30/20/10° is chosen.** The grammar gives the order, not the angles. At the words'
  default angles (270°) the phrase crosses its own lead-in, which was measured red.
- **FINDINGS itself has only Sakura's grammar as a sequence.** The Serpents 100–170 m is quoted by ARCHITECTURE §2,
  not by a FINDINGS line, and the S says so.
- **Every word keeps its own radius and ease.** Sakura's angles change each word's length, not its curvature, and a
  test checks each peak radius against the word's own (sweep 1,000 m, turn 300 m, tight 120 m).

## 3 · The registration diff, for A (tested; none of A's files touched)

**Why it is needed.** `library.js` `placePiece` places any built-in by its FIRST word alone, and the shell sends
built-ins through the pickers. So a built-in phrase would place one word. The diff does four things:
- adds the phrases to `builtinLibrary()`;
- places a built-in phrase with `placePhrase` (one undo step);
- reserves the phrase names as built-in names;
- lets the shell hand built-in phrases to the library.

**A "Starter phrases" palette group** sits between "Words" and "My pieces". A's tests get matching updates: three of
them pin "built-ins are words only". There is one new test file: palette listing, one-undo placement through the shell,
reserved names, and that a saved library still holds only user pieces.

**Tested:** applied to a full copy of today's tree (`scratchpad/d175/copy2`), with
`node --test --test-concurrency=4 --test-reporter=tap app/test/palette-phrasebook.test.js test/doc-library.test.js app/test/shell*.test.js app/test/palette*.test.js test/phrasebook.test.js`
→ **121 tests: 121 pass, 0 fail.**

A first run had two failures that were the copy's own: it left out `src-tauri/`, and two shell tests read
`src-tauri/build.rs`. With it present they pass.

**Against A's files at:**

| file | sha256 |
|---|---|
| `src/doc/library.js` | `c324f9a8b090d1bd…` |
| `app/shell.js` | `5f6b2953d138edb5…` (rebuilt after A's D175 texture wiring changed it) |
| `app/palette/palette.js` | `cf8bef438bd1ac84…` |
| `test/doc-library.test.js` | `0b66affc4931d5bf…` |
| `app/test/palette.test.js` | `66f8de6597322da2…` |
| `app/test/palette-dom.test.js` | `357bcbe42f18babd…` |

```diff
--- a/src/doc/library.js
+++ b/src/doc/library.js
@@ -27,17 +27,18 @@
 const S = require('./serial.js');
 const { DocError, UNIT, RANGE, quantise, checkWordBody, wordText, loadWord, onlyKeys, deepFreeze, SCHEMA, GENERATOR } = S;
 const { appendWord, appendPhrase, defaultWord, headRoll } = require('./document.js');
+const { PHRASES, phrasebookPieces, placePhrase } = require('./phrasebook.js');   // the starter phrasebook (ARCHITECTURE §11.7)
 
 const SI_UNIT = { m: 'm', deg: 'rad', ratio: 'ratio' };
 const key = (s) => s.trim().toLowerCase();
-const isBuiltinName = (name) => Object.keys(WORDS).some((w) => key(w) === key(name));
+const isBuiltinName = (name) => [...Object.keys(WORDS), ...PHRASES.map((p) => p.name)].some((w) => key(w) === key(name));
 
 function builtinLibrary() {
   const pieces = Object.keys(WORDS).map((w) => {
     const d = defaultWord(w);
     return { id: `b-${w}`, name: w, author: 't180-track-builder', builtin: true, kind: 'word', words: [{ word: d.word, font: d.font, tempo: d.tempo, speed: d.speed, handles: d.handles, textures: d.textures }] };
   });
-  return deepFreeze({ schema: SCHEMA, generator: GENERATOR, nextId: 1, pieces });
+  return deepFreeze({ schema: SCHEMA, generator: GENERATOR, nextId: 1, pieces: [...pieces, ...phrasebookPieces()] });
 }
 
 function palette(lib) {
@@ -81,7 +82,7 @@
 /** Append a piece at the head of doc. A built-in appends its word with the defaults; a user piece, its handles. */
 function placePiece(doc, lib, name) {
   const p = findPiece(lib, name);
-  if (p.builtin) return appendWord(doc, p.words[0].word);
+  if (p.builtin) return p.kind === 'phrase' ? placePhrase(doc, p.name) : appendWord(doc, p.words[0].word);
   const words = shiftRoll(p.words, headRoll(doc));
   const opts = (w) => ({ tempo: w.tempo, font: w.font === null ? undefined : w.font, speed: w.speed, handles: w.handles, textures: w.textures });
   if (p.kind === 'word') return appendWord(doc, words[0].word, opts(words[0]));
--- a/app/shell.js
+++ b/app/shell.js
@@ -97,7 +97,7 @@
   function placed(name) {
     const p = st.lib.pieces.find((x) => x.name === name);
     if (!p) throw new D.DocError('NO_SUCH_PIECE', `no piece called "${name}" in the palette`);
-    if (!p.builtin) return L.placePiece(doc(), st.lib, name);
+    if (!p.builtin || p.kind === 'phrase') return L.placePiece(doc(), st.lib, name);   // a starter phrase keeps its own words
     const word = p.words[0].word, { font, tempo, dir } = st.pickers;
     return D.appendWord(doc(), word, { tempo, dir, font: font === 'auto' || word === 'jump' ? undefined : font });
   }
--- a/app/palette/palette.js
+++ b/app/palette/palette.js
@@ -16,7 +16,8 @@
   const pick = (k) => ({ options: pickers[k].slice(), value: state.pickers[k] });
   return {
     groups: [
-      { title: 'Words', items: items.filter((p) => p.builtin) },
+      { title: 'Words', items: items.filter((p) => p.builtin && p.kind === 'word') },
+      { title: 'Starter phrases', items: items.filter((p) => p.builtin && p.kind === 'phrase') },   // src/doc/phrasebook.js
       { title: 'My pieces', items: items.filter((p) => !p.builtin) },
     ],
     pickers: { font: pick('font'), tempo: pick('tempo'), dir: pick('dir') },
--- a/test/doc-library.test.js
+++ b/test/doc-library.test.js
@@ -47,9 +47,10 @@
 });
 
 // ── the library ────────────────────────────────────────────────────────────────────────────────────────────────────
-test('the built-in library holds one piece per word, and the palette reads from it', () => {
+test('the built-in library holds one piece per word and the starter phrases, and the palette reads from it', () => {
   const lib = L.builtinLibrary(), pal = L.palette(lib);
-  assert.deepEqual(pal.filter((p) => p.builtin).map((p) => p.name), Object.keys(D.WORDS));
+  assert.deepEqual(pal.filter((p) => p.builtin && p.kind === 'word').map((p) => p.name), Object.keys(D.WORDS));
+  assert.deepEqual(pal.filter((p) => p.builtin && p.kind === 'phrase').map((p) => p.name), require('../src/doc/phrasebook.js').PHRASES.map((p) => p.name));
   assert.ok(pal.every((p) => typeof p.id === 'string' && Array.isArray(p.words)));
 });
 
--- a/app/test/palette.test.js
+++ b/app/test/palette.test.js
@@ -10,19 +10,20 @@
 
 const mem = () => { const docs = new Map(); let lib = null; return { saveDoc: async (n, t) => docs.set(n, t), openDoc: async (n) => docs.get(n), listDocs: async () => [...docs.keys()], saveLibrary: async (t) => { lib = t; }, openLibrary: async () => lib }; };
 
-test('the palette lists every built-in word, then the user\'s own pieces, in two groups', async () => {
+test('the palette lists every built-in word, then the starter phrases, then the user\'s own pieces, in three groups', async () => {
   const s = await createShell({ storage: mem() });
   s.place('turn'); s.place('tight'); s.select('w1', 'w2'); await s.saveSelectionAsPiece('my-bend');
   const m = paletteModel(s.getState(), s.pickers());
-  assert.deepEqual(m.groups.map((g) => g.title), ['Words', 'My pieces']);
+  assert.deepEqual(m.groups.map((g) => g.title), ['Words', 'Starter phrases', 'My pieces']);
   assert.deepEqual(m.groups[0].items.map((i) => i.name), Object.keys(D.WORDS));
-  assert.deepEqual(m.groups[1].items.map((i) => [i.name, i.kind, i.words.join(' ')]), [['my-bend', 'phrase', 'turn tight']]);
+  assert.deepEqual(m.groups[1].items.map((i) => i.name), ['sakura flow', 'bowl hairpin', 'S', 'spiral climb']);
+  assert.deepEqual(m.groups[2].items.map((i) => [i.name, i.kind, i.words.join(' ')]), [['my-bend', 'phrase', 'turn tight']]);
 });
 
-test('with no saved pieces the second group is present and empty, so the palette does not jump when the first is saved', async () => {
+test('with no saved pieces the last group is present and empty, so the palette does not jump when the first is saved', async () => {
   const s = await createShell({ storage: mem() });
   const m = paletteModel(s.getState(), s.pickers());
-  assert.deepEqual(m.groups[1], { title: 'My pieces', items: [] });
+  assert.deepEqual(m.groups[2], { title: 'My pieces', items: [] });
 });
 
 test('the pickers show every font, tempo and direction, with the current choice', async () => {
--- a/app/test/palette-dom.test.js
+++ b/app/test/palette-dom.test.js
@@ -36,15 +36,15 @@
   assert.equal(alerts[0].getAttribute('role'), 'alert');
 });
 
-test('every built-in word is a button, and a click places it through the handler it was given', async () => {
+test('every built-in word and starter phrase is a button, and a click places it through the handler it was given', async () => {
   const restore = fake.install();
   try {
     const s = await createShell({ storage: mem() }), root = new fake.Element('aside'), placed = [];
     renderPalette(root, paletteModel(s.getState(), s.pickers()), { ...noop, place: (n) => placed.push(n) });
     const buttons = root.querySelectorAll('.builtin');
-    assert.deepEqual(buttons.map((b) => b.textContent), ['straight', 'sweep', 'turn', 'tight', 'wall-ride', 'inversion', 'jump']);
-    buttons[2].dispatch('click');
-    assert.deepEqual(placed, ['turn']);
+    assert.deepEqual(buttons.map((b) => b.textContent), ['straight', 'sweep', 'turn', 'tight', 'wall-ride', 'inversion', 'jump', 'sakura flow', 'bowl hairpin', 'S', 'spiral climb']);
+    buttons[2].dispatch('click'); buttons[7].dispatch('click');
+    assert.deepEqual(placed, ['turn', 'sakura flow']);
   } finally { restore(); }
 });
 
--- /dev/null
+++ b/app/test/palette-phrasebook.test.js
@@ -0,0 +1,28 @@
+'use strict';
+const test = require('node:test'), assert = require('node:assert');
+const { createShell } = require('../shell.js');
+const L = require('../../src/doc/library.js');
+const mem = () => { const docs = new Map(); let lib = null; return { saveDoc: async (n, t) => docs.set(n, t), openDoc: async (n) => docs.get(n), listDocs: async () => [...docs.keys()], saveLibrary: async (t) => { lib = t; }, openLibrary: async () => lib }; };
+test('the palette lists the starter phrases, and placing one through the shell is one undo step with all its words', async () => {
+  const s = await createShell({ storage: mem() });
+  const names = s.palette().map((p) => p.name);
+  for (const n of ['sakura flow', 'bowl hairpin', 'S', 'spiral climb']) assert.ok(names.includes(n), n);
+  s.place('straight');
+  const before = s.getState().history.past.length;
+  s.place('sakura flow');
+  const st = s.getState();
+  assert.strictEqual(st.history.past.length, before + 1);
+  assert.deepStrictEqual(st.history.present.words[1].words.map((w) => w.word), ['sweep', 'turn', 'tight', 'turn', 'sweep']);
+  assert.strictEqual(st.resolveError, null);
+  s.undo();
+  assert.strictEqual(s.getState().history.present.words.length, 1);
+});
+test('a user piece may not take a starter phrase name', () => {
+  const D = require('../../src/doc/index.js');
+  const d = D.appendWord(D.createDoc('x'), 'straight');
+  assert.throws(() => L.savePiece(L.builtinLibrary(), { name: 'S', doc: d, ids: ['w1'] }), /NAME_IS_BUILTIN/);
+});
+test('a saved library still holds only the user pieces (the phrasebook comes from the program)', () => {
+  const lib = L.builtinLibrary();
+  assert.ok(!/sakura flow/.test(L.serializeLibrary(lib)));
+});
```

## 4 · README.md: the status table

**The rows:** 81 over ARCHITECTURE §1 (6), §2 (12), §3 (8), §4 (15), §5 (4), §5b (8), §5c (11) and §6 (13). Each is:
- **tested**, with the test file named;
- **built**, with the file named;
- **not yet**, saying what is missing;
- or **built, landing pending**.

**Judged from the code, not from hand-backs.**
- Every path it names exists: checked with a `node -e` scan of the README's paths.
- For each "tested" row I opened or grepped the named test for the item. One correction came of it: the closing twist
  is tested in `test/geom_path.test.js`, and the row names it.

**Against `main` at `aa4d565`, not `59ff906`.** D171+D172 landed at `ae10a41` and D173+D174 at `aa4d565` while I
worked, so "landing pending" now means only what is on disk and not on `main`: the phrasebook (`src/doc/phrasebook.js`),
texture packs (`src/doc/packs.js`), and the soak and bench scripts.

**The rows that are "not yet", honestly:**
- §1: lighting matched and measured.
- §2: a phrase's exposed parameters.
- §3: bank relative to gravity shown to the user (computed as `bankG`, not shown).
- §4: limits per car from its config (one car only); red and amber on the road in the preview (only in the panel).
- §5: AC's shader set ported; the look-match instrument; one-click "see it in Assetto".
- §5b: `ksPerPixelNM` / `ksMultilayer` materials.
- §5c: "spawn here"; paint as texture layers with grid numbers and the pit lane's lines; race furniture.
- §6: `WAV_PITCH=extended-0`; AcTools' reader in the self-test; the ~20 km size limit measured.

**The v1 line** quotes the keeper: *"the first thing I want it to be is simply the track, no environmental
elements."* It adds that the user builds the track from its open end, and that **no in-game testing has been done**:
every row is judged from code and tests, and nothing was launched in AC.

**Kept word for word:** the Credits section, "Their tracks are read locally for measurement only; none of their
content is included in this repo."

**Also updated:** "What's here" now lists `src/` and `app/`, and `speed.cjs` under the replay tools.

## 5 · Tests and mutants

| command | result |
|---|---|
| `node --test --test-concurrency=4 --test-reporter=tap test/phrasebook.test.js` | **26 tests: 26 pass, 0 fail** |
| the full suite, under the heavy-run lock: `node scratchpad/heavy-suite.js` (`test/*.test.js`, then `app/test/*.test.js`, each at `--test-concurrency=4`) | **repo: 633 tests, 626 pass, 0 fail, 7 todo · app: 253 tests, 253 pass, 0 fail** |

**The packet's tests, all present:**
1. **Each phrase resolves, then builds, then validates clean,** four times over: at the design speed, and with no
   speed.
2. **Placing it is one undo step:** one document entry, and undo gives back the very document before it.
3. **Its words match the FINDINGS grammar.** Sakura's words, word for word from FINDINGS.md:180. "Never straight into
   tight" holds in every phrase, placed after a straight. The hairpin's turn → tight → turn in the bowl.

**Also:**
- every quoted source is really on its cited line (this caught my misquote);
- every word's peak radius is its own;
- the spiral's climb is load-bearing, and it ends level;
- the S's net heading is 0;
- the library-piece shape, including unique ids;
- an unknown phrase is refused by name.

**Mutants** (`scratchpad/d175/mutate_phrasebook.js`, on a copy, under the heavy-run lock, `--test-concurrency=4`, one
progress line per mutant):
- **First pass: 19 applied, 18 caught, 0 NOT APPLIED.** The survivor, `angled: direction ignored`, was **equivalent**:
  every angled phrase turns left, so the parameter was dead. It was removed, and its mutant dropped.
- **Final: 18 applied, 18 caught, 0 NOT APPLIED; copy restored equal to live: yes.**
- **Honest note.** The final run before that one reported 17 / 17 / **1 NOT APPLIED**: the "sakura: flat" mutant still
  named the old `angled(…, 'L', …)` call. Its string was corrected and the whole pass re-run; the number above is that
  re-run.

## 6 · NOT verified

- **The phrases in a window or in AC.** Not placed from the real palette (the registration is A's), not driven.
- **The registration diff is tested on a copy, not applied.** Whether and how A takes it (names, group title) is A's
  call.
- **The phrases' shapes are ours.** Only Sakura's word order is measured grammar. The spiral's 6°, Sakura's
  10/20/30/20/10° split, and the hairpin's and S's sequences are choices, said in each phrase's `note`.
- **The README is judged at `aa4d565` plus the working tree at ~18:0x.** It goes stale with the next landing; the
  "landing pending" rows are the ones to flip.

## 7 · Hashes after the last edit, and the CHANGELOG lines (for B)

`src/doc/phrasebook.js` and `README.md` are hashed at write time in §8 (below this section, by the command that wrote
this file).

```
### Added
- A starter phrasebook (ARCHITECTURE §11.7): four built-in phrases, each resolving, building and validating with no
  red at its default tempo, each quoting the FINDINGS and ARCHITECTURE lines it comes from.
  - sakura flow: Sakura's `sweep → turn → tight → turn → sweep` in the half-pipe, as one 90° corner.
  - bowl hairpin: turn → tight → turn in the bowl.
  - S: a left turn into a right turn at the serpents tempo.
  - spiral climb: 390° climbing 6° and back to level, clear of itself.
  Placing one is one undo step. (`src/doc/phrasebook.js`; the palette's "Starter phrases" group comes with A's
  registration.)

### Changed
- README: the status is no longer "planned, not built". A table judges every item of ARCHITECTURE §1–§6, §5b and §5c
  as tested, built or not yet, naming the file and the test. It states v1's scope (the track only, in the keeper's
  words) and that no in-game testing has been done.
```

## 8 · Hashes after the last edit (sha256, first 16)

- `src/doc/phrasebook.js` `a4c5e65aa9ac952a…` (98 lines)
- `README.md` `fb6bc2b840d7ca5e…`
- `test/phrasebook.test.js` `313f035f7d764095…`

NEXT: librarian call_librarian with the pointer when the hand-back is written
