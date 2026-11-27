# D677 (b), the right side's own width: pane B, 2026-11-27, STOPPED (WIP)

- **The chair's order:** 05:00:54Z. Build plan (b) of `exo_memory/loop/plan_t180_cross_section_2026-11-26.md` (:134 on, route B2), tier PROVE IT.
- **Stopped** on the chair's interrupt of 05:09:31Z, delivered 05:29:05Z, at a safe point.
- **Branch:** `d677-right-width-b` in the builder. Tip `e41acb1d9a7d8515f6e8cf4bc93d7174924056d0` on base `f3cd425a4d49119137340c35de8a1b4dd3786d81` (landing-1126-batch).
  - Pushed. checked: `git ls-remote origin refs/heads/d677-right-width-b` → e41acb1, push-gate allow at 05:30:42Z.
  - No merge, no install.
- **Worktree:** `G:\consonance-scratch\b-wr`, clean after the commit.
- **Scratch:** `G:\consonance-scratch\b-wr-work`. A base worktree, `G:\consonance-scratch\b-wr-base`, sits detached at f3cd425 (from `C:\Users\nname\Downloads\t180-fresh`).

## What it is

**A new optional channel `wd`:** the right side's width less the width. The left half is w/2, the right half (w + wd)/2.
- It is written only by a piece flagged `split` that has some control point not 0 (`isWidthSplit`).
- A document with one is written as `t180b.core/7`.
- With no such piece, the text is today's, byte for byte.

**Deviation from the plan's letter: `wd`, not `wr`.** The plan named an absolute `wr`. I stored the difference, so that every existing editor of `w` keeps moving both sides with no change: Extend's width, Sculpt's brush, a landing's typed width, the Grab.
- The panel still shows and takes the right side's own width ("right width m"), converted against the width in force at each mark.
- *What would change my mind:* if the rim press (zonegrab) is built to write one side's width, an absolute `wr` would save it a conversion. Changing over then would mean a new schema.

## Rows: red first, then green

- **`test/core_right_width.test.js`, 15 rows:** core/7 round-trip; no split → today's schema; flagged with zero wd → today's schema; left 9.55 and right 11.3 with the path identical sample for sample; validator reasons unchanged; Extend splits, the width alone keeps the step, no split without wd; a mark and "early"; BAD_WIDTH and BAD_TUBE; the TEST export's mesh at 22.6/19.1; close converges and keeps wd; SPLIT_SEAM; Sharp's tightest right-hand radius 11.2 against 9.5; SPLIT_RUN; water spills at the right rim, −11.3; a wd brought back to 0 ends at 0.
- **`app/test/core-right-width-panel.test.js`, 5 rows:** the typed right width sent as its difference from the head's or the typed width; BAD_RIGHT_WIDTH; a change converted against the width at its mark; the start's ramp is the width's; the mounted field.
- **At base f3cd425: 19 of 20 red.** The 1 green is the no-split guard (row 2), green before as it must be. checked: `G:\consonance-scratch\b-wr-work\rows_base.txt`.
- **At the tip: 20 of 20 green.** checked: `rows_7.txt` (15/0) and `panel_1.txt` (5/0). The panel file was edited once after that run: a no-op `.slice(0, 1)` was removed from one row's input. inferred: still 5/0; not re-run.
- **The end-at-0 snap** (extend.js, `if (split) { … endAsked === 0 …`) was seen red by switching it off: 2 rows red, the close row and the end-at-0 row. checked: `rows_nosnap.txt`.

**Amendments to rows of my own, before they were green:**
- **Row 7's bar:** it compared wd's early ramp with er's, but er is a C2 channel. It now compares with the width's own early ramp (≤ 20 m, within 0.5 m).
- **Row 9:** the closed export did not close ("buildPath: closed loop does not close"), so the row uses the open TEST export. The mesh cells are `_body_<n>_<cell>`, so the row measures over a station range.
- **The Sharp row:** R 120 was refused SHARP_TOO_TIGHT on the R 400 road for a reason unrelated to wd. Rebuilt on a straight; it measures the tightest radius each way.

**An existing test amended, with the reason in its comment:**
- `app/test/drag-ghost.test.js` row 5 pins a hash of the in-memory pieces. Every road piece now carries a wd of 0s in memory, as it carries c, e, s, t and er, so the hash moved (c1db95d19d372697).
- checked: `G:\consonance-scratch\b-wr-work\pin.cjs`. With wd stripped, the hash is the old pin `e79334c4029711ec` exactly, and every wd is 0.
- The row now asserts both. checked: that row alone → 1/0.

## Old tracks: byte for byte

checked: `node G:\consonance-scratch\b-wr-work\bytes.cjs <tree> G:\consonance-scratch\b-wr-work <out>`. The inputs are copies of his 27 saved tracks and 16 undo sidecars, taken 05:07:04Z. His folder was never written to.
- **Tracks:** serialize(parse(text)) is the same, sha for sha, on the branch and at base for **27 of 27**.
  - 22 of 27 save as their own text on both.
  - The other 5 already change at base: two core/3 files are upgraded to core/4; one core/4 was saved compact and is re-laid out; one core/5 holds a value that is now rounded to its step; one is an older kind (schema 3, not a string) that both refuse BAD_DOC.
- **Undo:** 406 of 406 document steps save as their own text, and equal base, on both.
- **An older builder:** base f3cd425 refuses a core/7 text by name: "BAD_DOC … got t180b.core/7 (a newer file needs a newer builder)". checked: `oldreads.cjs`.

## The export

- **A new one-sided track:** a closed lap whose second quarter turn has wd 3.5, through the shell's `buildExport`, as the Export button runs it.
  - It closes, as core/7, and writes all 10 files. The kn5 was read back with `tools/kn5.cjs`, with the road taken from its 4 merged `1ROAD_pN_chunk_N` meshes.
  - Where the step is held: right/left **1.1845**, against 22.6/19.1 = 1.1832. On the first straight, 1.0000.
  - checked: `node G:\consonance-scratch\b-wr-work\lapexport.cjs G:/consonance-scratch/b-wr/ G:/consonance-scratch/b-wr-work`.
  - The lateral extents read 9.396 and 11.13 m, against the profile's 9.55 and 11.3. inferred: the bowl is curved, so its surface half-width is longer than its sideways reach; the ratio is the measure.
- **An old track's export is NOT yet compared.** `G:\consonance-scratch\b-sharp-work\mnm.js` (export file hashes per track) has not been run base against branch. NEXT step 2.

## Where I stopped, and what is left

1. **The full suite:** stopped part way, at about 1,160 passes. Its one red, drag-ghost row 5, was amended as above. The rest of the run is unread, so this is NOT a full-suite pass. Re-run it, under the lock: `G:\consonance-scratch\b-wr-work\suite.sh G:/consonance-scratch/b-wr <out>` (348 files, the mutation harnesses left out).
2. **The export of old tracks:** `node G:\consonance-scratch\b-sharp-work\mnm.js <tree> G:\consonance-scratch\b-wr-work\tracks <out.json>`, on b-wr-base and on b-wr. Every export hash must match.
3. **The mutation harnesses:**
   - `test/core_right_width_mutation.test.js`: 30 mutants over document, adapter, extend, close, piece, sharp, panel and coreshell. All apply exactly once (checked by a scratch script), and the harness has **not been run**.
   - The existing harnesses naming document.js and extend.js are not run either:
     - for document.js: core_cup, core_jump, core_piece, core_xsec;
     - for extend.js: core_bank_flow, core_cup, core_landing_xsec, core_ramp, core_smooth_ramps, core_xsec.
   - Report the results as applied / caught / NOT APPLIED.
4. **The plan's row 8:** E's midpoint measure on [T5]. **Falsifier (b): not run.** "E's 2964–3172 and 3172–3239, laid with a right-width step and nothing else changed, still miss pitch by more than 1.5×" needs E's [T5] tooling; I have not run it.
5. **Then:** the map line's update, the librarian, and a landing pane.

## Edges named, not changed

- A split piece followed by a legacy one gets no tail fade (the cross-section path).
- head.w is an end value, so while a width is still ramping, the panel's conversion of a typed right width is approximate.
- After a flight, the landing's sides are one width unless wd is typed.
- Saved pieces cannot carry wd: a run with one is refused, `SPLIT_RUN` (the piece format predates wd).
- The rim press and the brush do not touch wd. Neither does zonegrab; that is later work, as the plan says.
- `markers/place.js` `surfaceAt` extrapolates past either rim, as before.

## Corrections

- I first gave the Sharp row R 120 on the R 400 road, and it was refused SHARP_TOO_TIGHT, unrelated to wd. Rebuilt as above.
- An early export row used the closed export and a ±0.3 m slice, and found nothing. Rebuilt as above.
