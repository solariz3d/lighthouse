# L260 track 7, pane A (L, Opus 5.5): Sculpt's bank drag and the bank brush carry past a full turn; builder `l-bankcarry-a` 7b3926e, local, not pushed

**The orders, read whole:**
- 07:13:24Z: the packet `loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md`, "Track 7" (room 40e922ab).
- 07:13:31Z, the correction: do not push; give the tip.
- 07:19:25Z: the packet's "Amendment, 01:25" (746af9db), after E's read `handback/p-l258-read-bankcarry-E_2026-11-27.md`, which I read whole.

BASE: C:\Users\zackn\Downloads\t180-track-builder 2067c88 (`l-bankcarry-a`)

**Tip: `7b3926e`** (7b3926ee39e7cbf8ca5f590ccb5328c83cbe5ff0), two commits on 2067c88, on `l-bankcarry-a`, made in my worktree `Downloads\t180-wt-l260-carry` (removed at the end; the commits are on the branch):
- `0023853`, the change, its rows and the amendment's items;
- `7b3926e`, one row: the Sculpt mark's own drag past a turn, through the panel's handle host.
- **Not pushed**, per the correction; it goes up with the next landing pane's push.
- E's 2067c88 is not rewritten.
- checked: `git rev-list --count origin/l-bankcarry-a..l-bankcarry-a` → 2 (origin is 2067c88), and the worktree was clean (0 changes) before I removed it.

## The change (checked)

**One line**, in `app/core/coreshell.js` `brushTo` (:909):
- the delta is sent as given;
- `bankWithinTurn` (2067c88 :59, entered by 89b1859 for his 2026-10-06 rule) is removed;
- a comment at :53-57 says what it was and points to his answer 6 of 01:11 (`briefs/t180_unmakeable_shapes.md:68`), not quoted. checked: 0 hits for his words in `app/`, `src/`, `CHANGELOG.md`.

**Why one line covers both drags.** Sculpt's bank handle and the bank brush both reach `brushTo`:
- the handle by `panel.js:1087` → `sculptTo` (`coreshell.js:709`);
- the brush by `panel.js:911`.

**The label is unchanged** (`handles.js:341` `wrapTurn`), so the handle shows −376 as −16 (D259).

**Typing is untouched:** `panel.js` is not in the diff.
- checked: `git diff --stat 2067c88 0023853` lists 6 files: CHANGELOG.md, coreshell.js, and four test files.

**His tracks rely on nothing this breaks** (below), so there was no reason to refuse.

## Red first (checked)

Each file holds this commit's rows run against the old code (`evidence/`).

| row | at 2067c88 | at 0023853 |
|---|---|---|
| **S1 −** D's case remade on L: a piece rolling −340 → −392, a Sculpt drag of −10 | the middle −366 → **−16**; unwound at the drag's first step (−366.5 came out −6.5) | −366 → **−376**, every one of 20 steps by its share; the label `bank -16.00°` |
| **S1 +** the mirror | 366 → 16 | 366 → 376 |
| **S2** a drag across a full turn on a piece inside one turn, 350 by +20 and −350 by −20 | steps 351…359, then **0** at the crossing step | rolls on to **370** / −370, no step jumping; the label 10 / −10 |
| **S3** the brush: by +370 / −370 on upright road | centre **9.85** / −9.85 | **364.45** / −364.45 (the brush's own gain, 0.985) |
| **S3** the brush, −10 on the wound piece (−366) against its twin one turn up (−6) | the wound piece → **−37.0** (moved +329); the twin −6 → −15.4 | the same change on both, to 1e-6: −366 → −375.4, the twin → −15.4 |
| core-sculpt **D259** Sculpt drag (amended) | 350 + 20 → **10** (red under the new rule) | ≈ 370 |
| core-sculpt **D259** value brush (amended) | +370 → **9.85** | ≈ 370 |
| core-pieces-ui **D677 (2)**, the Sculpt mark's own drag through the panel's handle host (7b3926e): a piece the core wound 340 → 392, middle 366, a fast steady 30 px | first step **6.45**, then up to 19.5 (unwound) | rises from 366 and never goes back |

Sources for the table:
- `red260_carry_rows_at_2067c88.tap`: S1 −, S1 +, S2 and S3 not ok; W5 ok, since it is a guard.
- `red260_sculpt_D259_at_2067c88.tap`: 2 not ok.
- `sculptmark_row_at_2067c88.tap`: 1 not ok ("first 6.45, last 19.50").
- So both of Sculpt's paths are pinned past a turn: the shell's API (S1 to S3) and the panel's own handle host, as a hand drives it (the 7b3926e row).
- `proto260_at_2067c88.txt` and `proto260_at_0023853.txt`. Their "0 → 350" lines are my first crossing setup, which put the middle at 175: controls that cross nothing, the same on both trees.
- The brush's gain on that ramp is 0.94 on every turn checked (−340→−392, 20→−32, −20→32, 0→−52), so S3 compares the wound piece with its twin rather than with a tolerance.

**The crossing question: a drag across ±360 on a piece inside one turn now rolls on; it does not wrap.**
- **Why:**
  - The wrap only ever acted at that crossing, so keeping it there would keep the 2026-10-06 rule exactly where it was made. His answer 6 reverses that rule for these drags.
  - The wrap was not a hold. It moved the road 359° in one pointer step, mid-drag (S2 at 2067c88: 359 → 0).
  - A typed 400 from upright lays 400 since 2067c88, so typing and Sculpt now agree.
- **Where it differs, and it is open:** the ghost's bank handle at the same crossing (below).

## The amendment's items (checked)

1. **The sentence is corrected wherever it stood.** Each place now says which commit made each drag carry:
   - `CHANGELOG.md`, D's entry: the corrected sentence plus a new bullet for this change;
   - `app/test/core-bank-carry.test.js`'s header;
   - the harness's note;
   - my own new comment in `coreshell.js`.
   - **The accurate form is narrower than "every bank drag carries past a turn":**
     - from a head past a turn, every bank drag lays in the head's turn: the ghost and extra handles since 2067c88 (they write the field and its rows), Sculpt's handle and the brush since 0023853;
     - two holds at one turn remain, below.
2. **The ghost handle's roll from a head past a turn:** a new row in `core-pieces-ui.test.js`, "D677 (ghost handle)".
   - **It goes through the handle's own path**: a pointer drag on the rig's fake stage (`handlePanel`, `dragBy`), not only the handle's write.
   - Its head of −392 is laid by the core, so f3cd425 can run it.
   - **f3cd425: not ok.** The drag wrote −36.5 and the road unwound to −36.5 (`ghost_row_at_f3cd425.tap`).
   - **2067c88: ok**; 0023853: ok (`ghost_row_at_2067c88.tap`).
3. **The flowing offer's value: row W5**, both signs. From a head at ∓392 with the flow box ticked, the unused extra bank handle offers ∓60, not ∓420.
   - It is a guard: green at 2067c88, as E found the base offers −60 too.
   - E's F1 is now mutant **B9**, caught by W5 (below).
4. **The whole-turn edge is not changed.** `panel.js` is untouched, and E10 stands.

## Rows amended by name (checked)

- **`core-sculpt.test.js`, its two D259 rows**, renamed "(amended D677 (2))" with a note above them that points to his answer:
  - the Sculpt drag: 350 + 20 → about 370, and the label within one turn (newly checked);
  - the value brush: +370 → about 370.
  - Their shared helper `near` lost its `|got| < 360` bound, the old rule baked into a tolerance. `turn()` is gone, because nothing else used it.
- **`core-pieces-ui` D259** (the ghost handle, from 350 by +20 → 10) **is not amended**: it is one of the two holds that stay.

## His saved tracks unmoved (checked, from copies)

- **The copies:** L258's, in my scratchpad: 16 tracks (2 BAD_DOC) and 11 backups, under neutral names. His folder was not read this lap.
- **The probe:** `evidence/sculpt260.js` opens each by `shell.open`. For every road piece it makes a Sculpt bank drag of +10, then Undo (each Undo checked to give back the opened document). Then a bank brush of −10 on the middle road piece.
- **2067c88 against 0023853:**
  - **tracks: 16 of 16 identical in every field, 78 drags;**
  - **backups: 11 of 11, 196 drags**;
  - 0 Undo mismatches (`sc_*_2067c88.json`, `sc_*_0023853.json`).
- **The largest middle bank on his tracks is 90°**, so no +10 drag crosses a turn. Within one turn the rule is as given on both trees, and nothing else moved.

## The tests at 0023853 (checked)

**The command:**

`node heavy-run.js --status && node heavy-run.js --run --priority belownormal --cmd "A L260: the 55 at l-bankcarry-a 0023853 …" -- node evidence/run_touched.js <carry worktree> <out> <the 55>`

Output: `evidence/final260.jsonl` and `final260_tap/`.

**The 55, by a stated rule** (`evidence/run260.txt`), with duplicates removed:
- the 26 app test files that call `brushTo`, `sculptTo`, `beginSculpt` or `beginBrush`, or rewrite `coreshell.js` (five harnesses), or are the bank-carry pair;
- the 2 root tests that call them (`test/core_segcache*.test.js`);
- L258's 36 that execute `panel.js`, because the panel is the other way into these drags.

**At 0023853: 55 files, 883 tests, 877 pass, 0 fail, 5 skipped, 1 todo.**
- `core-bank-carry` 13/13, `core-sculpt` 15/15, `core-pieces-ui` 56/56, `core-bank-carry-mutation` 11/11.
- The 5 skipped are `sculpt-frame`'s timing rows, not timed, as at L258. Not a pass; they are the landing's to time.
- The todo is `core-extra-bank-drag-cost`'s own.
- The same 55 on the uncommitted change, before the amendment: 879 tests, 873 pass, 0 fail (`run260.jsonl`).

**At 7b3926e** (one row added to `core-pieces-ui`): `core-pieces-ui` whole → **57 of 57**, both new rows ok (`tip7b.jsonl`, `tip7b_tap/`). The other 54 files are untouched by that commit.

## Mutation (checked, in the same run)

- **`core-bank-carry-mutation`: 11 of 11.** The control, the crash stand-in, and **applied 9 / caught 9 / NOT APPLIED 0**:
  - B1 to B6 as before, each by its own row;
  - **B7** (the wrap back for every bank drag), caught by S1;
  - **B8** (the wrap back for the brush alone), caught by S3;
  - **B9** (E's F1: the flowing offer in absolute degrees), caught by W5.
- **B7 reproduces 2067c88 exactly** when applied in place: D's case gives −16 and the brush 9.85. Checked with `proto260.js` on a backed-up copy of `coreshell.js`, restored after.
- **The five harnesses that rewrite `coreshell.js` still apply every anchor:** `core-xsec-mutation` 35/35 rows, `core-mutation` 70/70, `core-close-mutation` 63/63, `core-pitgap-mutation` 13/13, `export-isolated-mutation` 13/13. 0 not ok, 0 NOT APPLIED.

## Open, named (not changed here)

- **The ghost's bank handle crossing a full turn from inside one** writes the field within one turn: 350 + 20 shows and lays 10 (`core-pieces-ui` D259, green).
  - Sculpt's handle now rolls on there (S2), so the two handles differ at that one crossing.
  - Whether the ghost handle should carry too is his call; he was asked only about Sculpt.
- **The extra bank's ±360 hold** (D641 R1, `handles.js:125`, `core-extra-bank-wind`): it holds at one turn of its field. Unchanged.
- **The whole-turn edge** (E10a/b/e): at exactly a full turn the field shows −360, and a typed −32 unwinds 328°. Unchanged; it is with him.

## For a refactor of Sculpt, from what this change touched (his remark, not an order)

**What made it easy:** both drags already met in one function (`coreshell.js` `brushTo`, :906), so the rule change was one line.

**What made it hard or brittle:**
1. **"One turn" is decided in five places, in three files, with three kinds of arithmetic.** Each of his three rulings (10-06, 11-26, 11-27) had to find them all, and D's plan missed one: it said the 10-06 words were not on disk, and they were at `coreshell.js:54`. The places:
   - `handles.js:351` `wrapTurn` (`x % 360`, the label and the field);
   - `panel.js:441` `headTurns` (`360 × round((h − wrapTurn(h)) / 360)`);
   - `panel.js:1089`, the ghost handle writing `show(HD.wrapTurn(value))`;
   - `handles.js:125`, D641 R1's hold;
   - until now `coreshell.js` `bankWithinTurn` (`(b0 + δ) % 2π`, in radians).
2. **The handle's shown value and its dragged value are in different turns, and only one line keeps them apart.**
   - `panel.js:1087` takes `delta = value − sculptDrag.base`, where the base is the unwrapped middle (`panel.js:1016`). The label wraps (`handles.js:341`).
   - The carry is right only because that base is unwrapped, and no row pinned that until S1. A refactor that reads the base from what the label shows would unwind every wound piece by a turn again.
3. **A channel's policy sits inside the generic brush pipeline.** `brushTo` special-cased `b.channel === 'phi'` before the Sculpt ratio (`delta / sculptRatio(b)`, `coreshell.js:909`; `sculptRatio` :612) on the same delta, and the order of the two mattered: the wrap was taken on the asked delta, then scaled.
4. **Two entry paths into one drag, tested apart.** Tests drive the shell API (`core-sculpt`, S1 to S3); the app drives the panel's handle host (`panel.js:1083-1092`); only `core-pieces-ui` rows 16 and 16b drove the second, within one turn, until this lap's 7b3926e row.
5. **The brush's gain at its centre depends on context**: 0.985 (r 100 on flat road), 0.995 (Sculpt), 0.94 (r 60 on a 150 m ramp, measured here). Every bank row must carry a tolerance or a twin, and core-sculpt's shared tolerance helper had the old rule inside it (`|got| < 360`).
6. **Where it all lives:**
   - `coreshell.js`: 1,858 lines, 76 naming Sculpt. Its Sculpt-related pieces are `setSculpt` :671, `beginSculpt` :672, `sculptInfo` :697, `sculptTo` :709, `beginBrush` :878, `brushTo` :906 and `sculptRatio` :612.
   - `panel.js`: 1,632 lines, 84 naming Sculpt (the model :1016, the handle host :1083-1092, the brush :911).
   - the maths in `src/core/sculpt.js` (401 lines), the guard in `centreline.js`, the glyphs and labels in `handles.js`.
   - inferred: a single owner for "what a bank past a turn means", called by the field, the handles and the brush, would have made his three rulings three one-line changes.

## Corrections (mine)

- **Before the amendment reached me, my own new comments repeated D's claim** that the ghost and extra handles keep the 2026-10-06 rule: in `coreshell.js`, the rows' header and the core-sculpt note. All three were corrected before the commit; none was committed in the wrong form.
- **S3's wound case first had a 0.3° tolerance from the flat-road rule.** It failed at −375.4. I measured the brush's gain on that ramp first (0.94, the same on every turn) and replaced the tolerance with the twin comparison, rather than widen it.
- **My first crossing prototype set the middle at 175**, crossing nothing. S2 uses a piece held at 350.

## The machine

- **heavy-run:** two runs of the 55 through `--status` and `--run --priority belownormal`, in the background. The second is at the commit.
- **Chrome:** `sculpt-frame` is the one Chrome test. Leftovers: `leftovers260_before.txt` / `_after.txt`.
- **Single small node runs ran directly:** the rows, the prototype and the tracks probe.
- **Worktrees:** all three removed, each checked clean first (0 changes): `t180-wt-l260-carry` (the branch at 7b3926e), `-base` (2067c88) and `-f3` (f3cd425).
  - The carry tree went too, so no worktree holds `l-bankcarry-a` when the landing pane checks it out. The commits stay on the branch: checked, `git rev-parse --short l-bankcarry-a` → 7b3926e, origin still 2067c88.
  - Each scratch tree held a copied test file only during its run, then was restored.
- **Track names:** one builder test title (`core-extra-handles` X8) names one of his tracks. It is redacted in my evidence copy of that output, as at L258; 0 name hits remain in this file and its evidence.
- **Untouched:** his app, his AC folder, his saves (not read this lap), and E's and B's trees.
- No landing, build, install, merge or push.

SOURCES: exo_memory/loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md (40e922ab, 746af9db); exo_memory/handback/p-l258-read-bankcarry-E_2026-11-27.md; exo_memory/handback/p-l258-bankcarry-A_2026-11-27.md; exo_memory/briefs/t180_unmakeable_shapes.md:68; builder git diff 2067c88 0023853; evidence/ (proto260.js, proto260_at_*.txt, red260_*.tap, ghost_row_at_*.tap, sculpt260.js, sc_*.json, run260.txt, final260.jsonl, final260_tap/, leftovers260_*.txt)
NEXT: librarian call_chair with this pointer when you have read it; E reads the delta 2067c88..0023853; the landing pane pushes l-bankcarry-a 0023853
