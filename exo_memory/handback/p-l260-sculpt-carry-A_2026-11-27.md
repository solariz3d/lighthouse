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
   - *(Added at the 02:38 amendment, as E asked.)* **A third frame: the dragged value was also CLAMPED** to the bank kind's ±720 (`handles.js:54`, applied in `targetFor` :325 and in the wheel :622 at 7b3926e), while the base it is measured from was not. Past ±720 the drag stopped, and on a piece past it the first step moved the road against the drag. So the handle's value lived in three frames at once: wrapped in the label, unwrapped in the base, clamped in the drag. Fixed for Sculpt's bank handle only (below, "Amendment 02:38"); the ghost's bank handle shares the kind and keeps the clamp.
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

---

## Amendment 02:38 (2026-11-27, L261 dispatch of 08:35:39Z): Sculpt's bank handle carries past ±720 too; builder `l-bankcarry-a` e7b9128, local, not pushed

**The orders, read whole:**
- the packet's "Amendment, 02:38" (`exo_memory/loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md:81`, 945af22e);
- E's read of 2067c88..7b3926e (`exo_memory/handback/p-l260-read-sculpt-carry-E_2026-11-27.md`, 6f7cc01c), with its table and its cases (`…_evidence/e260_rows.part.js`, `h_tip.txt`);
- the chair's 09:38:51Z order to rerun the void timing run.

**Tip: `e7b9128`** (e7b91287d8e2b8b6d3e6c55bf72c2d5f4a548c63): one commit on 7b3926e, on `l-bankcarry-a`, made in my worktree `Downloads\t180-wt-l261-carry` (removed after; the commit is on the branch).
- `git diff --stat 7b3926e e7b9128`: 5 files, +84/−16 (`CHANGELOG.md`, `app/core/handles.js`, `app/core/panel.js`, `app/test/core-bank-carry-mutation.test.js`, `app/test/core-pieces-ui.test.js`).
- **Not pushed by me.** checked: `git rev-parse --short origin/l-bankcarry-a` → **7b3926e** (2067c88 when L260 closed; someone's push and a fetch have landed since). So e7b9128 is one commit ahead of origin.
- Evidence for this section: `…_evidence/l261/`.

### Item 1, the choice: no range on Sculpt's bank handle, not "drive it by its travel" (checked)

**What changed:**
- `app/core/handles.js` `rangeOf(K, ctx)` (:332): a handle's value is held in its kind's range, unless the model passes `ctx.range === false` for that handle. `targetFor` (:325) and the wheel (:628) clamp to it. Before, both clamped to `K.min, K.max` directly.
- `app/core/panel.js:1018`, the Sculpt model: its `ctx` for `'bank'` adds `range: false`. Width and cup keep their ranges.

**Why this one, and not driving it by travel:**
- **It is the brush's rule.** The brush has no range, and the core lays any bank.
- **The panel's arithmetic needs no change.** It stays `delta = value − base` (`panel.js:1087`), with the base being the unwrapped middle. With no clamp, `value − base` is the travel (rounded to 0.01, as it was inside ±720).
- **Driving by travel would need a second protocol.** The handle reports an absolute value to the host (`host.apply(h, value)`), and the label, the readout and the drag tick read that value. Driving by travel would mean the handle reporting travel instead, for this one model.
- **It reaches two gestures E's table does not list.**
  - The wheel has its own clamp (`handles.js:622` at 7b3926e).
  - The arrow keys go through `targetFor`.
  - Driving the drag by travel would have left the wheel's clamp in place.
- **Nothing else moves:**
  - The ghost's model (`panel.js:973`) passes no `range`, so its bank handle keeps ±720 (item 2).
  - The extra bank kinds keep their own ±360 (`handles.js:125`, D641 R1). `range` is read only where a model sets it.

### Item 3, red first through the panel's handle host (checked)

The rows: `app/test/core-pieces-ui.test.js` rows 720a to 720e, built on E's cases. The helper `woundSculpt` (:1124) builds the wound pieces with E's 900 m lead. The drags use `followMark`, the pointer stepping 1 px a millisecond along the mark's current screen axis, 30 steps.

**What each drag row asserts:**
- **The first step moves the road with the drag.** This is the order's "fail if the first step moves the road against the drag".
- **Every step, including the first one from the middle, is one pixel's share: 0.45°.** So a jump, a hold or a step back each fails.

Commands:
- Red: `node --test --test-name-pattern "row 720" app/test/core-pieces-ui.test.js` on the rows with 7b3926e's code (`l261/red720_at_7b3926e.txt`, 08:41:35Z).
- Green: the same rows, plus the file's other D677 rows, on the change (`l261/green720_change.txt`).

| row | the piece (its middle), the gesture | at 7b3926e (red) | on the change (green) |
|---|---|---|---|
| 720a | held at 710, up 30 px across 720 | step 23 moved 0.100 (719.90 → 720.00), then held at 720 | 710 → 723.5, every step 0.45 |
| 720b | 700 → 760 (730), up 30 px | first step 730 → 720.0000000080687, against the drag, then 720 | 730 → 743.5 |
| 720c | 700 → 760 (730), down 30 px | step 1 moved 10.000 (730 → 720 at once), then 21 steps at 720, ending 716.5 | 730 → 716.5, every step 0.45 |
| 720d | −700 → −760 (−730), down 30 px | first step −730 → −720.0000000080687, against the drag, then −720 | −730 → −743.5 |
| 720e | 700 → 760 (730), a wheel notch up, then down | up: 720.0000000080687 | up 730.01, down 730 |
| 720g (guard) | the ghost, the field typed 710, its bank handle up 30 px | stops at 720, field `0` (green) | the same (green) |

- **The arrow keys: checked by a probe, not a row.** The probe is `l261/arrow_probe.part.js`, appended to a copy of `core-pieces-ui` and deleted after. While the 730 mark is held, ArrowUp, ArrowUp, ArrowDown, then release:
  - at 7b3926e's code: 720, 720, 720, released 720;
  - on the change: 730.01, 730.02, 730.01, released 730.01.
  - The arrows share `targetFor`'s line with the drag rows (mutant B11), so I did not add a row for them.
- 7b3926e's code for the red run and the probe: the two code files were swapped in from `git show 7b3926e:…`, then restored from a backup. Checked: `git diff --stat` was the same before and after.

### Item 2, the ghost's bank handle is not changed (checked)

- `panel.js` changes in one line, the Sculpt model's `ctx`. The ghost's model (`:973`) and the ghost's write into the field (`:1089`) are untouched.
- **Row 720g pins the ghost's ±720.** From a typed 710, a drag up 30 px stops at 720 and writes `0` into the field. It was green at 7b3926e and is green on the change.
  - The mutant that lifts the range for every bank handle (B13) is caught by it.
  - Whether the ghost carries is his to rule on. The row is a guard, not a ruling.

### Item 4, the CHANGELOG (checked by reading the diff)

**The entry "A Sculpt bank drag and the bank brush carry past a full turn too":**
- It now says Sculpt's bank handle also stopped at ±720 until a read measured it. It says what that did (a piece held at 710 stopped at 720; on a piece at 730 the first step of a drag, an arrow or a wheel notch moved the road to 720, against an outward drag) and that it now has no range, as the brush has none.
- **The holds it names after this, three:**
  - the ghost handle crossing a full turn from inside one (350 + 20 lays 10);
  - the extra bank handle's hold at one turn of its field;
  - the ghost's bank handle's ±720 (from a typed 710, a drag up stops at 720).
- Each of the three is pinned by a green row (`core-pieces-ui` D259; `core-extra-bank-wind` D641; 720g).
- **Not named, because it is not a drag's hold:** the whole-turn edge (E10). It is a typed value, and it stays with him.
- "To go back, revert the commit" now reads "the commits".
- His words are not quoted, and no track name appears: checked, `git diff 7b3926e` has 0 hits for "keep rolling" and 0 for his 27 track names (`l261/namecheck.js`).

### Item 5, the refactor list

Point 2 of "For a refactor of Sculpt" above gains the clamp, marked as added here: the handle's value lived in three frames at once (wrapped in the label, unwrapped in the base, clamped in the drag).

### Item 6, the tier (checked)

**The files that reach the touched code, by a stated rule:**
- The rule is `l261/rule261.js` (output `l261/rule261.txt`). It lists every test file under `app/test` and `test` whose static require closure reaches `app/core/handles.js` or `app/core/panel.js` (57), or that reads or mutates either file's text (9 more). That is 66 of 384.
- `core-pitgap-mutation`, whose inner rows (`core-pitgap`) are on the list, makes **67** (`l261/tier261.txt`).

**The command:** `node heavy-run.js --status && node heavy-run.js --run --priority belownormal --cmd "A L261: the 67 …" -- node run_touched.js <carry worktree> <out> <the 67>`, in the background, started 09:01:48Z. Output: `l261/final261.jsonl` and `l261/final261_tap/`.

**The tree it ran:** the working tree whose content is e7b9128, except one line added afterwards to the harness's copy list (`app/testhook`). The harness was rerun on that line (below).

**67 files, 986 tests, 977 pass, 2 fail, 6 skipped, 1 todo** (1,302 s of runs).
- **The rows:**
  - `core-pieces-ui` 63/63;
  - `core-bank-carry` 13/13;
  - `core-sculpt` 15/15;
  - `core-extra-bank-wind` 3/3;
  - `handles` 45/45;
  - `handle-step` 6/6.
- **The other harnesses, every anchor applied:**
  - `core-close-mutation` 63/63;
  - `core-mutation` 70/70;
  - `core-xsec-mutation` 35/35;
  - `core-pitgap-mutation` 13/13;
  - `core_early_turn_climb_mutation` 7/7;
  - `core_landing_xsec_mutation` 20/20.
- **Fail 1, the bank-carry harness's CONTROL.** Row 18c: "Cannot find module '../testhook/probe.js'". My copy list lacked `app/testhook`. That run's mutant verdicts are void. Fixed in e7b9128, and rerun green (below).
- **Fail 2, `core-extra-bank-drag-cost` row 1 (D642), a timing ratio.** It is red at 7b3926e too, under the same load (below).
- **Skipped:**
  - `sculpt-frame`'s 5 timing rows, not timed, as at L260;
  - `turn_corner` row 4, which wants one of his saves copied in. I made no copy: his saves were not opened this lap.
- **Todo:** `core-extra-bank-drag-cost` row 2's own.

**The rerun** (`l261/dragcost261.js`, through `--status && --run --priority belownormal`, ran 09:41:12–09:42:56Z):
- **The bank-carry harness: 15 of 15** (`l261/harness261.tap`, 89.6 s).
  - The CONTROL, running all three files whole on the copy, is green.
  - The crash stand-in reads NOT TESTED.
  - **Applied 13, caught 13, NOT APPLIED 0.** The failures per mutant:

    | mutant | B1 | B2 | B3 | B4 | B5 | B6 | B7 | B8 | B9 | B10 | B11 | B12 | B13 |
    |---|---|---|---|---|---|---|---|---|---|---|---|---|---|
    | failed of run | 2/3 | 1/2 | 2/3 | 1/2 | 1/2 | 1/2 | 2/3 | 1/2 | 2/3 | 4/5 | 4/5 | 1/1 | 1/1 |

  - **B10 and B11 run 5 rows, not 4.** The pattern "row 720[a-d]" also matches 720g, whose title says "row 720a's fix". The 4 failures are the 4 drag rows; the guard passed, as it should.
- **The new mutants:**

  | mutant | the edit | caught by |
  |---|---|---|
  | B10 | the Sculpt model no longer lifts its bank range (`panel.js`) | rows 720a-d |
  | B11 | `targetFor` clamps to the kind's range whatever the model says | rows 720a-d |
  | B12 | the wheel clamps to the kind's range whatever the model says | row 720e |
  | B13 | every bank handle loses its range, the ghost's too | row 720g |

- **D642 row 1, alternated in one job, change then base** (`l261/dragcost261.txt`; the bar is the rolling drag's p95 within 2× the early drag's):

  | run | tree | rolling p95 / early p95 | ratio | row 1 |
  |---|---|---|---|---|
  | 09:41:12Z | the change | 12.7 / 6.3 ms | 2.03 × | fail |
  | 09:41:17Z | 7b3926e | 13.2 / 6.2 ms | 2.13 × | fail |
  | 09:41:22Z | the change | 10.9 / 5.4 ms | 2.02 × | fail |
  | 09:41:27Z | 7b3926e | 11.4 / 5.8 ms | 1.97 × | pass |

  - checked: **red at the base too**, in the same job and under the same load.
  - inferred: noise at the bar, not this change.
    - The extra bank's drag passes the change only through one `rangeOf` call per move (its model sets no `range`).
    - At L251 this row was red at a base and green on a rerun.
    - Both trees straddle 2× here: change mean 2.03, base mean 2.05.
  - The other machine work at the time: P's whole suite or B's F1 mutants in the other slot.

### His saved tracks

- **inferred: unaffected.** The change binds only where a Sculpt bank value passes ±720.
- His largest middle bank is 90°, and no track or backup is wound past a turn. Both were checked at L260 (`sc_*.json`) and at L258.
- Not re-run this lap: the order's tier did not ask for it, and his saves were not opened.

### Corrections (mine)

1. **My hand-back above and the CHANGELOG at 0023853 missed a hold.** They said Sculpt's handle and the brush "now send the change as given" and named two holds at one turn. Sculpt's bank handle also held at ±720, and I never dragged past it. E found it through the handle host. The CHANGELOG is corrected; the sentence above stays as written, as a trace.
2. **My first version of the rows did not fail on 720c at 7b3926e.** The inward drag's first step was a 10° jump the drag's own way, and the drag still ended where its travel took it. I added the per-step share check, and then it was red.
3. **I ran inside B's exclusive timing hold.** The hold was `12fb81f6`, since 08:41:47Z, and I did not read `heavy-run --status` first.
   - The runs: the 9-row green run (about 08:41:52–08:42:03Z), the two arrow probes (about 08:42:20–08:42:25Z) and the static rule scan (about 08:44Z).
   - The red run ended at 08:41:35Z, before the hold.
   - I said so on the board at once, so B can drop those windows. After that, I waited out the hold with a no-op run, whose wait was heavy-run's own; the hold was gone at 09:01:43Z.
4. **My first timing rerun never ran. This is the chair's catch** (09:38:51Z; trace `exo_memory/loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`, aff290b4).
   - I launched it as `heavy-run … -- cmd /c dragcost.cmd`. Git Bash turned `/c` into `C:/`, so cmd sat as an idle interactive shell.
   - It held slot 2 from 09:24:34Z until the librarian stopped it at 09:38:02Z, about 13.5 minutes, delaying B's F1 run. Its task notification said "completed", and its figures are void: there were none.
   - My second try ran `node` directly, but behind `--status | tail -3 &&`, which takes tail's exit code, so the gate could not stop it. It was waiting with no slot when I stopped it (TaskStop) and relaunched with `--status &&` and a `node` program.
   - checked: at 09:39:22Z the wrapper (pid 10204, BelowNormal) was waiting; the run's four timestamped results show it ran.
5. **The NEXT line closing the L260 section names 0023853** ("E reads the delta 2067c88..0023853; the landing pane pushes l-bankcarry-a 0023853"). The tip was 7b3926e by then: the tip line at the top of this file and my ring said so. The line is left as written.
6. **The heredoc changed my backslashes twice** (a rule script and the redaction script). Both failed loudly and were rewritten. Between the failed redaction and the fixed one, unredacted TAP copies sat in the uncommitted evidence folder for about a minute; never committed. checked: 2 redacted (the `core-extra-handles` X8 title, as at L258 and L260), then 0 name hits over `l261/`.

### The machine

- **Worktrees:** `t180-wt-l261-carry` (the branch, e7b9128) and `t180-wt-l261-base` (7b3926e, detached, for the timing A/B), both checked clean (0 changes), then removed.
  - No worktree holds `l-bankcarry-a`: checked, `git rev-parse --short l-bankcarry-a` → e7b9128.
- **heavy-run:**
  - the 67 (09:01:48–09:23:48Z, in the free slot, beside P's landing work in the other);
  - the rerun (09:41Z);
  - both in the background at BelowNormal.
  - The small row runs and the probes ran directly, three of them inside B's hold (correction 3).
- **Chrome:** `sculpt-frame` is the one Chrome test in the 67. Leftovers: 0 tab proxies and 0 orphan browsers, before and after (`l261/leftovers261_before.txt`, `_after.txt`; tab proxies UNCALIBRATED, the control made none).
- **Untouched:** his app, his AC folder, his saves (not opened this lap), the ghost handle, and E's, B's and P's trees.
- **Track names:** this section, its evidence and its map line have 0 hits for his 27 track names (`l261/namecheck.js`).
  - `exo_memory/map/A.md` at HEAD already held 2 hits, in older entries, not this lap's.
  - I did not open which name or entry they are (they may be common words), and did not edit them. Flagged for the librarian.
- No landing, build, install, merge or push.

SOURCES: exo_memory/loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md:81 (945af22e); exo_memory/handback/p-l260-read-sculpt-carry-E_2026-11-27.md (6f7cc01c) and its evidence (e260_rows.part.js, h_tip.txt); exo_memory/loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md (aff290b4); builder git diff 7b3926e e7b9128; evidence/l261/ (red720_at_7b3926e.txt, green720_change.txt, arrow_probe.part.js, arrow_7b3926e.txt, arrow_change.txt, rule261.js, rule261.txt, tier261.txt, final261.jsonl, final261_tap/, dragcost261.js, dragcost261.txt, harness261.tap, leftovers261_*.txt, namecheck.js, redact.js)
NEXT: librarian call_chair with this pointer when you have read it; E reads the delta 7b3926e..e7b9128; the landing pane pushes l-bankcarry-a e7b9128
