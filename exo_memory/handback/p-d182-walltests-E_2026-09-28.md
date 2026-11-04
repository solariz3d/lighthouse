# D182 · the walled-bowl behaviour tests, E's ten (pane E) · 2026-09-28, night

**Packet:** the chair's "YOUR share of the walled-bowl behaviour tests". C's measured fonts
(`p-d182-fonts-C_2026-09-28.md` §6b) default to NO wall, so ten tests of mine that leaned on a walled default fail. Each
is a behaviour test: name its inputs, never weaken it, and fix the CODE if one is a real failure. **Nothing is committed.
No AC launch.**

## 0 · The answer

- **All ten are GREEN on the tree the chair named** (A's staged vocabulary + C's two font diffs): the six files, **56/56**.
  So is **my whole ripple set of 18 files, 203/203**, on that tree.
- **The same six files are also 56/56 on A's vocabulary alone, and 56/56 on the shared checkout.** The fix holds under all
  three.
- **Every one of the ten is a BEHAVIOUR test.** None was a real failure: no code changed for this packet.
  - The jump landing under the new floor, which C inferred, is not a failure. The jump-default sweep and the "sculpted
    past clearance" test pass on the measured fonts.
  - They were already named in the ripple (`p-d182-ripple-E_2026-09-28.md` §2.1–2.3). The real item there, the 150 m
    landing search, was fixed in code then.

## 1 · The trees, exactly

- **"A + C":** a fresh copy of the shared checkout, then A's `apply_d182.js` (sha256 `cca6b88da2ae2556`, stage `vocab.js`
  `7ac2edb4f37029e8`, both unchanged since I froze them at 01:41), then C's `resolve-fonts.diff` (`72282ef9b33833f1`) and
  `vocab-fonts.staged.diff` (`98b6126f27f0a9d7`).
  - `git apply --ignore-whitespace` applied both cleanly. `patch -p1` had refused them on line endings only
    (`resolve.js` is CRLF in the checkout).
  - After them, `FONTS.bowl` = `{ width 31, wall 0, ψ 15.5° }` and `FONTS.flat` = `{ width 45, wall 0, ψ 3° }`.
- **"A only":** my ripple copy (A's stage, no C diffs).
- **"checkout":** the shared tree as it is.
- **Every run holds the heavy-run lock,** with `--max-old-space-size=4096` on node and in `NODE_OPTIONS`
  (`scratchpad/locked.js`).

## 2 · Why they failed, and the one change that names their inputs

**The first run on A + C** (`scratchpad/walls-run1.txt`, before any change): the six files, **56 tests, 48 pass, 8 fail.**
The other two of the chair's ten (both in `validate-ui-jumpdefault`) already passed, since the ripple had named them.

**What C's diff changes:** `resolve.js` `profileOf` now builds `bowl`, `half-pipe` and `flat` from the MEASURED floor, a dish
rising across the whole width, whatever the word's handles say. The wall is added only above that floor. So a test that
names `font: 'flat'` with `wall: 0` no longer gets a flat floor: it gets the measured ribbon, whose rim tilts about 3°.
And a named `bowl` with `wall: 8`, ψ 60° gets 8 m walls on a dish, not on the old flat 16 m floor.

That is why even the tests the ripple had ALREADY named still failed. For example, the bank now meets the 50° non-CSP limit
about 3° early, at the ribbon's rim.

**The change, in one place (`test/pre_d182_words.js`, THE CARRIER):**
- Where the running tree builds the measured fonts, a pre-D182 `bowl`/`half-pipe`/`flat` word is carried by `wall-ride`.
  That font is still built from its handles alone.
- `profileOf` builds a non-measured font as EXACTLY the pre-D182 profile: a flat floor of `width`, then walls of arc
  length `wall` rising to ψR/ψL, and none when `wall` is 0.
- **Only the font's LABEL differs; the surface is the old one.**
- **Detected, never assumed:** one probe word is resolved. A walled pre-D182 bowl gives five profile points, and a measured
  one more.
- **Checked on both kinds of tree:**
  - **on the checkout** (no measured build): the helper's documents are still **byte-identical** to a bare `appendWord`'s
    (6 sequences, both directions, all five fonts; 0 differ);
  - **on A + C:** the resolved profiles are exactly `u [−10, 0, 10], ψ 0` for a straight and `u [−16, −8, 0, 8, 16]`,
    ψ R 60° / L 15° for a left bowl.

**Three tests had chosen "60° walls" through the font picker** (`shell.setPicker('font', 'half-pipe')`), which now gives the
measured half-pipe with no wall. Each now `shell.adopt`s two pre-D182 half-pipe straights through the helper: a 16 m floor
and 8 m walls to 60°, "red for vanilla AC", as the test's own comment always said.

## 3 · The ten, each with its kind

| # | file | test | kind | what failed on A + C | what it names now |
|---|---|---|---|---|---|
| 1 | `app/test/handles.test.js` | the handle clamps at 50° of bank | behaviour | its named flat straights became the measured ribbon (the rim meets 50° first) | the carrier (via its `doc()` helper) |
| 2 | `app/test/handles.test.js` | handlesOf values and ranges | behaviour | the named bowl's wall/ψ handles no longer shape a measured floor | the carrier |
| 3 | `app/test/handles-panel.test.js` | a drag clamps at its bound (one undo step) | behaviour | the same as 1 (`shell.adopt` of named straights) | the carrier |
| 4 | `app/test/handles-panel.test.js` | no bound on an already-red word | behaviour | the font picker's half-pipe has no wall, so it is not red | two pre-D182 half-pipe straights (60° walls) |
| 5 | `test/validate_bounds.test.js` | bank for a non-CSP export, exactly 50° | behaviour | the same as 1 | the carrier (via its `doc()` helper) |
| 6 | `test/validate_bounds.test.js` | "A's handleInfo hook takes these bounds as its physics" | behaviour | the named words' bounds moved with the measured floor | the carrier |
| 7 | `app/test/validate-ui-panel.test.js` | the CSP switch re-validates for vanilla AC: a 60° wall turns red, and back | behaviour | the picker's half-pipe has no 60° wall | two pre-D182 half-pipe straights |
| 8 | `app/test/validate-ui-speed.test.js` | with the picker off, a geometry red still colours the map | behaviour | the same as 7 | two pre-D182 half-pipe straights, then an append |
| 9 | `app/test/validate-ui-jumpdefault.test.js` | a jump sculpted past clearance is red | behaviour | **did not fail**: named in the ripple (80 m gap, 0.7 m drop, −2° landing) | unchanged since the ripple |
| 10 | `app/test/validate-ui-jumpdefault.test.js` | the speed slider sweep | its subject IS the default jump; the old-default count was fixed in the ripple, and the 150 m landing search was fixed in CODE there | **did not fail** on the measured floor: the default jump still clears exactly where it should | unchanged since the ripple |

**No weakening:** every assertion of every test is as it was. What changed is only the document each builds, now named, and
the surface it gets is the one the test was written for.

## 4 · Results (all under the lock)

| run | tree | files | result | log |
|---|---|---|---|---|
| before | A + C | the six | 56 tests · 48 pass · **8 fail** | `walls-run1.txt` |
| after | A + C | the six | **56/56** | `walls-run2.txt` |
| after | A only | the six | **56/56** | `walls-run2-a.txt` |
| after | checkout | the six | **56/56** | `walls-run2-base.txt` |
| after | A + C | my 18 ripple files (the six + validate, validate_jumps, validate_raygap, validate-ui, -incval, -jumps, export_words, export-textures, doc-textures, export_csp, export_width, app export-csp) | **203/203** | `walls-run3.txt` |

**Not run:** the full suite on the A + C tree. That is C's landing run to own. §6b gives 28 fails, and 10 of them are these.

## 5 · Files (sha256, 16)

| file | sha |
|---|---|
| `test/pre_d182_words.js` | 26884e35dc237b45 (+ the carrier) |
| `app/test/handles-panel.test.js` | e7ea782fdc051a8e (test 4) |
| `app/test/validate-ui-panel.test.js` | c2880fe1276cb857 (test 7) |
| `app/test/validate-ui-speed.test.js` | 83972a7d2884c2e8 (test 8) |
| `app/test/handles.test.js` | 2ebd119a98579fdf (unchanged since the ripple; green through the carrier) |
| `test/validate_bounds.test.js` | 7c17c5943b330b47 (unchanged since the ripple; green through the carrier) |
| `app/test/validate-ui-jumpdefault.test.js` | 724444d600c5ee80 (unchanged since the ripple) |

## 6 · CHANGELOG entry (for B)
- **Changed (tests):** the tests that exercise walls, banks and bounds build their words explicitly as the pre-measured
  fonts (a flat floor, and 8 m walls to 60°). The measured fonts have no wall and a rising floor, and would otherwise
  change what those tests test.

## 7 · Two more, from A's §10.6 (the chair, 04:59, under the freeze)

| # | file | test | kind | what failed | the change |
|---|---|---|---|---|---|
| 11 | `app/test/markers-panel.test.js` | the panel drops the default layout on the first straight long enough | behaviour | the measured default straight is 48 m, and the default grid needs 67.4 m, so no straight was long enough | `shell.adopt` of NAMED 100 m straights (`test/pre_d182_words.js`), before and after, the same as each `place` did |
| 12 | `app/test/markers-panel.test.js` | once edited the layout is kept, and its markers ride along | behaviour | the same (its own comment says "w1 was 100 m") | three named 100 m straights; the drag to 140 m and its +40 m check unchanged |
| 13 | `test/fourier.test.js` | the loader opens the equation as a document … ends where the lap began | my own test | **A's copy predates my fix.** After M4's equal-chord correction the equation's length is M·c, and documents are quantised at 0.1 mm per word; the test compared with the synthetic 3,000 m exactly | fixed at 04:5x (M4 §1b): compare with `eq.lapM` within 0.1 mm per word, and the arc within 5 cm. **Now green on all three trees.** |
| 14 | `test/fourier.test.js` | privacy: no coefficient file is tracked | environment | **in a COPIED tree** (not a git work tree), `git ls-files` exits 128 | skips there, saying so. **In the real checkout it runs in full and passes.** The check is not weakened where it means something: a copy has nothing tracked |

**Results, under the lock** (`app/test/markers-panel.test.js` + `test/fourier.test.js`):
- **A + C:** 18 tests · 17 pass · 1 skipped (the privacy test, a copy) · 0 fail (`walls-run5.txt`);
- **A only:** the same (`walls-run5-a.txt`);
- **the checkout: 18/18** (`walls-run5-base.txt`).

**Files:** `app/test/markers-panel.test.js` sha256 `cf776c6f335f6278`; `test/fourier.test.js` `f9f1ba891b784026`.

**All twelve the chair routed are GREEN** (the ten in §3, plus 11 and 12 here). Items 13 and 14 were my own M4 test's, and
are green as well.
