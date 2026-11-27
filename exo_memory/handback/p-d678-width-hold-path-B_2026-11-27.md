# D678 Track 1, pane B: the width hold must not move the path

- **Order:** the chair's D678 (2026-11-27T16:57:21Z), Track 1 of `exo_memory/loop/packet_t180_width_hold_path_2026-11-27.md` (room 72f9015c).
- **Tier:** PROVE IT.
- **Base:** `C:\Users\nname\Downloads\t180-fresh`, c2591bf900089bbf7af5098b0017e8252b1af80d (`origin/l264-extend-holds-width-b`).
- **My worktree:** `G:\consonance-scratch\b-hold`, branch `l264-extend-holds-width-b`. Scratch is `G:\consonance-scratch\b-hold-work`.
- **The finding:** E's read, `handback/p-d678-ripple-read-E_2026-11-27.md` §5 F4.
- **The repair (added after the runs):** 346e2a051db61762224718e0c1417c86fd451f20 on `l264-extend-holds-width-b`, 8 files by name, pushed. `git ls-remote`
  shows origin's branch at 346e2a0. No build, no install, no merge to builder main. My scratch trees `b-hold-c2591bf`, `b-hold-c522ea6` and
  `b-hold-e112a14` stay registered as detached worktrees of t180-fresh for Track 2's comparisons. They hold no links. `git worktree remove <path>`
  takes each one out.

## 0. Registration, written before any run (this section is not edited after the first run; corrections go below it)

### The document's quantum

`src/core/document.js:65` at c2591bf (checked: `sed -n 65p`):
`DEC = { m: 4, kh: 9, kv: 9, phi: 9, w: 4, r: 6, h: 4, l: 4, c: 6, e: 6, s: 6, t: 6, er: 6, wd: 4, rad: 9 }`.

Every stored number is rounded to one step of 10^−DEC:

| what | step |
|---|---|
| the turn kh and the climb kv | 1e-9 rad per m |
| the bank phi | 1e-9 rad |
| the width w, the right width wd, the hill h, the swerve l | 1e-4 m |
| the rise r, the cup c, the edges e and er, the edge start s, the tube t | 1e-6 |
| a length or a knot | 1e-4 m |

**What insertion does to that quantum (inferred, from the code; measured below).**
- `insertKnot` (document.js:710) re-rounds the three control points around each new knot to their step. One insertion moves a curve by at most half a step: the basis sums to 1.
- The hold inserts up to three knots into one span: R/4, R/2 and 3R/4 (sub 4; R itself is already a knot on a plain piece). With sub 8 it inserts seven.
- Their supports overlap, so the arithmetic bounds the move at 1.5 steps (3.5 with sub 8), not at one.
- **So the one-step bar in row 1 is not guaranteed; it is measured.** If rounding alone breaks it, I say by how much and stop, as the packet says.

### The direction as I will build it, with one amendment stated before the build

**The direction:** in `extend`, lay every channel on the piece's own knots exactly as from a level head. The width in that lay is e112a14's fitted hold, a placeholder. Then insert the hold's knots by `D.insertKnots` and lay the width alone on them.
- The width is laid as c2591bf lays it: the held pair as `roadPiece` sets it on those knots, the rest by `rampControl`.
- This is the last step before the bank check, so nothing else is laid on the hold's knots.

**Amendment, Turn by.** Turn by, Climb by and the corner list re-solve the turn after `extend` returns. Their solve reads the piece's knots: `symmetricEase` reads the knot averages, and both the least-norm step and the corner list's insertion read the columns. So inserting inside `extend` would still move their turn.
- For them, `extend` lays the piece without the hold (an internal option).
- The solve runs on the level head's knots.
- The hold is inserted after the solve, and after the corner list's knots.

**Sharp needs no amendment (inferred).**
- Its turn is laid inside `extend` (kh's short ramp, `rampControl` on the piece's own knots).
- Its solve reads the curve, not the knots: `turnWeights` integrates kh at the adapter's 2 m stations.

**Finish (prediction: it fails row 1 under this direction).**
- `finishToStart` lays by `extend` and `extendTurnBy`, then `close()` bends its window by a least-norm step over the window's control points.
- The first new piece still carries the hold's knots when `close` runs, so `close`'s step has more columns there than from a level head.
- Moving the hold past `close` would discard `close`'s own width correction on that piece, because `close` joins the width at the seam (close.js:268). **That is not attempted.**
- If Finish fails, the report is "the direction fails row 1 for Finish, by this much". It is not forced.

### Rows

**Row 1, the path.**
- **Heads:** E's five from `chan678.js`: a level head, E1, E4, E6, and a grab of +4 at end−3, r 5.
- **Callers:** the nine that lay a piece: Extend, Turn by 45, Turn by −90 over 200, a corner of 30 with an extra 20 from 50, Sharp −60 R40 ramp 8, Sharp 90 R150 ramp 4, Sharp −60 R40 ramp 1, Jump's take-off, and Level. All go through the shell with the panel's `extendOptions`, as E laid them.
- **For every held head × caller:**
  - (a) The new pieces' count and lengths equal the level head's.
  - (b) Every channel but w, on every new piece, sampled every 0.01 m, is within one step of that channel's DEC of the same caller from the level head on the same tree, and of e112a14 from the same head.
  - (c) The end point is within 1e-4 m of both: the last sample of `toPath` at step 0.25, as `endpos678.js` reads it.
  - (d) The joint is `null`, and the piece ends at the head's width with slope 0.
- **Finish:** the same, on E's six Finish heads on E's lap (`d678.js`: a level head, a brush of +1.37 at end−5 r20, +5 at end−30 r40, a grab of +2 at end−10 r20, +2 at end−0 r10, and −2 at end−2 r5). It is measured first at c2591bf, as the baseline E did not take, then on the repair.

**Red at c2591bf first:** a row in `app/test/core-width-hold.test.js`. After a width brush, Turn by −90 over 200 ends where it ends from a level head, within 1e-4 m, and its turn is within one step. Red at c2591bf (E: 31.7 cm), then green.

**Row 2, the width: c2591bf's to the digit.**
- The bar: the 8 table rows of `ripple268.js` (E1 to E8, Extend as shown over 100 m), committed in `handback/p-l268-width-hold-ripple-B_2026-11-27_evidence/`.
- Each row's w must have the same knots and the same control points as c2591bf's, exactly, and therefore the same printed line (swing, where, over 1 mm until, the end, the joint, the largest |w″|).
- I also count the script's other sections (lengths, sweep, extra). Those counts are information, not the bar.
- **Predicted to hold (inferred):** on a plain piece the hold's last knot is the first even knot, so inserting R/4, R/2 and 3R/4 gives c2591bf's knot vector exactly.
- **Predicted NOT the same:** Sharp's held width, where c2591bf's merged knot list kept different even knots. Not in the bar; it is reported.

**Row 3, bytes.**
- A level head lays the same bytes as at c522ea6, for the nine callers above.
- His saved tracks and undo steps re-save the same on c522ea6, c2591bf and the repair (`bytes.cjs`; copies only, taken 2026-11-27T05:07:04Z, in `G:\consonance-scratch\b-wr-work`).

### What fails the direction

- **Row 1 not met for the F4 callers** (Turn by, the corner list, Sharp), after the amendment above. Rounding alone breaking it counts, by how much.
- **Or row 2 lost in order to meet it.**
- **Then I say which, and stop.** "The direction fails row 1 for Finish" is a predicted result here, and it is reported, not forced.

**The unwelcome outcome, in the words that would make it true:** "Inserting the hold's knots after the turn is laid still moves the end point of Turn by −90 over 200 by more than 1e-4 m." That would mean the path depends on the knot vector through something other than the curve, such as the adapter's stations.

## 1. Results

All runs are on synthetic roads (ripple268's plain road, E's heads and E's lap) and on copies of his saved tracks, by number. The scripts are in
`p-d678-width-hold-path-B_2026-11-27_evidence/`; outputs are in `G:\consonance-scratch\b-hold-work\`, and every figure below was re-run on the final code by
`final678.sh` (log `final678.log`).

### 1.0 Corrections, first (§0 stands as written; these are below it)

1. **The registered order was not kept for Finish.** §0 said Finish would be measured at c2591bf first. I ran the repair first, then the baselines. The runs
   are deterministic, so the numbers do not depend on the order, but it is not the order registered.
2. **A control was added after the first run.** Row 1 as registered compares against the level head. In the first run, 7 of 36 rows failed, all from the
   steep grab head (+4 at end−3, r 5). That head is not a level head with only its width changing: the grab leaves its own turn slope 1.35 steps of kh off
   the level head's, the same at e112a14 (`heads678.js`). So I added a second comparison, against the same head with only its width made level (its last
   two w control points set equal), named "vsFlat" below. It was not registered; both comparisons are reported.
3. **§0's reason for not moving the hold past `close` is wrong.** §0 said moving it would discard `close`'s own width correction on the first new piece.
   Measured (`closew678.js`): `close` leaves that piece's width exactly as `layHold` lays it, on all of E's lap heads (figure in 1.4). `close` joins the width
   at the seam, which is the far end of the window. So that route is open; it was not attempted, as registered. It is in §2.
4. **I removed a line on too little evidence, and the wider set refuted it.** After the first runs I removed `layHold`'s reset of the width's first two
   control points, because `ripple268`'s 110 rows laid the same width without it (`resetcheck678.js`), and I called it equivalent in the mutation harness.
   Re-run on the final code, E's `d678.js` laid a different width in **64 of 610** rows (`noreset678.txt`: 5 of 61 for each of Extend, the two
   Turn bys, the corner list, Jump and Level; Sharp ramp 8 7, R150 ramp 4 11, ramp 1 16, R22 0; Finish 1 of 6). The insertion carries the placeholder's pair onto the new first knot
   and rounds it a second time: one step of w at the second point where sampled (`resetstep678.js`, 3 of 6 sampled rows). Sharp ramp 1 then left the head
   3.2e-4 per m off the head's width slope, where the stored width allows 2.0e-4. **The reset is back**, with a row that reads it
   (`core-width-hold.test.js`, the held-pair row) and a mutant for it (D11). The row-1 output is identical with and without it: the path never depended on it.
5. **The first tier run was stopped by me.** It started on the code without the reset, and my edit restoring it landed while its rows were running, so its
   result would describe neither version. I stopped it: its processes were checked by id and creation time first (3 stopped, the other 13 of its tree gone by
   the check), then its task id. **Stopping its `bash.exe` did not stop the script:** when the rows run died (exit 127 at 17:44:01Z) it started the
   harness phase, which TaskStop ended 1 s later (exit 127, an empty TAP; heavy-run's own line says it took over my stale slot-1 lock). No harness ran and
   no temporary copy was left (none in %TEMP% from today). Kept in `tier/aborted_1732/`. The tier was re-run in full on the final code (1.6).

### 1.1 Row 1, the path

`final_row1.txt` (`row1_678.js <repair> <e112a14> finish`). Steps are of each channel's DEC; the end is the last sample of `toPath` at step 0.25.

**Against the level head, as registered: 29 of 36 met.** The 7 not met are all the steep grab's head:

| caller | kh vs the level head | vs e112a14 from the same head |
|---|---|---|
| Extend, Jump, Level | 135 steps at 100 m | 0 |
| Turn by 45 | 4.99 steps | within 0.554 |
| Turn by −90 over 200 | 5.484 | within 0.554 |
| the corner list | 5.375 | within 0.554 |
| Sharp ramp 8 | 1.021 | within 0.554 |

**E1, E4 and E6 (the brush heads and the +2 grab):** every caller within 0.636 steps of the level head and of e112a14, every end within 3e-6 m, every joint
null. The worst per caller: Extend 0.529, Turn by 45 0.386, Turn by −90/200 0.636, the corner list 0.366, Sharp ramp 8 0.472, Sharp R150 ramp 4 0.183,
Sharp ramp 1 0.125, Jump 0.529, Level 0.529. Sharp 90 R22 ramp 4 is refused SHARP_TOO_TIGHT on every tree.

**Against the width-only level head (vsFlat, added): 36 of 36**, largest 0.636 steps, ends within 3e-6 m; the steep grab under Extend, Jump and Level: 0.

**The rounding bound.** §0 inferred up to 1.5 steps from insertion (3.5 with sub 8). Measured worst: 0.636 steps. The one-step bar is met.

**c2591bf, the baseline** (`row1_c259_vs_e112.txt`), reproduces E's F4:

| caller | kh apart | end apart |
|---|---|---|
| Turn by 45 | 69,950.7 steps | 0.033035 m |
| Turn by −90 over 200 | 188,881.957 | 0.317334 m |
| the corner list | 39,547.583 | 0.01878 m |
| Sharp R40 ramp 8 | lengths 40.2238 vs 40.3629 | 0.139082 m |
| Sharp R150 ramp 4 | lengths 234.2583 vs 234.3479 | 0.08967 m |
| Sharp ramp 1 | 3,787,044.438 | 0 |

**Red first:** `app/test/core-width-hold.test.js`, three path rows (Turn by −90 over 200, the corner list, Sharp −60 R40 ramp 8) red at c2591bf
(`rows_red_c2591bf.txt`: "kh is 1.89e-4 from the level head's", "kh is 3.95e-5", "piece 1: the same length"), the guard green; on the repair the file is
13 of 13 (`rows_final.txt`; the held-pair row of correction 4 included).

### 1.2 Finish: the direction fails row 1 for Finish, by this much (predicted in §0)

`final_fin.txt` and `final_row1.txt` FINISH ROWS (5 of 5 brushed lap heads differ). The difference is confined to the first new piece, which carries the
hold's knots (50 against the level head's 47):

| new piece | length (level / held) | bank apart | turn apart |
|---|---|---|---|
| 1 | 942 / 942 | 0.9651° at 72.53 m (the piece banks to 63.657°) | 180 steps at 7.90 m |
| 2 | 364 / 364 | 0.0001° | 3 steps |
| 3 | 943 / 943 | 0.0001° | 8 steps |

Ends within 6.4e-5 m; against e112a14, the same magnitudes. c2591bf was worse: lengths 942/363/942 against level 942/364/943, bank apart 1.3509°, 0.1203°
and 0.6289°, turn 277,429.7, 1,469 and 14,426 steps.

Cause, inferred from the code: Finish's `bankPlan` and `cupHome` read control points at their Greville positions, and `close`'s least-norm step reads the
columns, so 3 more knots in that piece change both. Not forced, as registered.

### 1.3 Row 2, the width: c2591bf's to the digit

`final_r268.json` (`ripple268w.js`, ripple268 plus a hash of the knots and w):
- **The bar, the 8 table rows: 8 of 8** the same knots and control points as c2591bf, and so the same printed line.
- All 110 rows (table 8, lengths 16, sweep 80, extra 6): **110 of 110**.
- The rest of each piece (every channel but w) is the same in table 1 of 8, lengths 2 of 16, sweep 0 of 80, extra 5 of 6: by design, it is now laid as from a
  level head.
- **Sharp's held width differs from c2591bf's, as §0 predicted**, because its piece is the level length again (40.3629 m, not 40.2238): figures in 1.5.

### 1.4 Row 3, bytes

- **A level head:** nine callers plus Finish lay the same bytes as c522ea6, **10 of 10** (`final_row3.txt`).
- **His copies** (taken 2026-11-27T05:07:04Z): 27 tracks, 1 refused on parse on every tree (t27, BAD_DOC), 10 closed, 16 open, **0 of 16 with a width
  still changing at the head**. Extend and Turn by 45 at those heads: **32 of 32** the same bytes.
- **Re-save** (`bytes.cjs`): 27 tracks and 16 undo files (406 steps), every recorded hash the same on c522ea6, c2591bf and the repair: **1306 of 1306**
  (`final_bytes.json`). On each tree: 22 of 27 tracks re-save byte-identical to the file, 1 throws, 406 of 406 undo steps the same.
- **`close` and the hold** (correction 3, `final_closew.txt`): on E's 5 brushed lap heads, Finish's first new piece (942 m, 50 knots, hold 19.625 m)
  as closed against `layHold` laid again on it: **0 control-point differences in 5 of 5**; the knots the same. (On the code without the reset it was 1 step
  of w at index 2 on one head: the twice-rounded pair, correction 4.)

### 1.5 Sharp (F1): not changed here; what a longer hold would cost

`final_sharphold.txt` (`sharphold678.js`: `extend.js` loaded in memory with the one `holdR` line replaced, so the hold is F times Sharp's own, or Extend's
20 m; no file written). Sharp's hold is the first span of its 2 m spacing: 1.922 m on the R40 pieces. **A longer hold never moves the road:** every end
within 1e-7 m of F 1's.

After the steep grab (+4 at end−3, r 5): swing past the head's width, the last metre over 1 mm off ("settle"), and the largest |w″| per m:

| Sharp | F 1 (the repair) | F 2 | F 4 | Extend's 20 m |
|---|---|---|---|---|
| −60 R40 ramp 8 | −310.41 mm, 1.71 m, 4.6927 | −490.26 mm, 2.66 m, 3.1702 | −1069 mm, 5.42 m, 1.646 | −1112.4 mm, 7.75 m, 1.5852 |
| 90 R150 ramp 4 | −328.97 mm, 1.35 m, 4.4337 | −552.3 mm, 2.75 m, 3.0222 | −556.2 mm, 5.45 m, 3.0035 | −556.2 mm, 11.37 m, 3.0035 |
| −60 R40 ramp 1 | −184.16 mm, 0.72 m, 7.1537 | −320.25 mm, 1.28 m, 4.4875 | −417.1 mm, 2.75 m, 3.8559 | −417.1 mm, 7.65 m, 3.8559 |

After E4 on ramp 8: −28.12 mm, 1.45 m, 0.4248 at F 1; −44.39 mm, 2.4 m, 0.2871 at F 2; −96.9 mm, 4.99 m, 0.1492 at F 4.

**What a longer hold on Sharp would cost:** the bend falls on ramp 8 (4.69, 3.17, 1.65 per m at F 1, 2, 4; slower than 1/F), but the swing and the settle grow: twice the hold lowers the bend by
32 to 37% and swings 58 to 74% further, settling 0.56 to 1.4 m later. On ramp 4 and ramp 1 the bend stops falling at about 3.0 and 3.86 per m from F 4 on,
while the swing and settle keep growing. Inferred, not measured: Sharp's own turn-ramp knots in the first metres (0.75 to 1 m apart) set that floor,
because the width is laid on the piece's knots. E's e112a14 figure (4.51) was not re-measured here.

### 1.6 The tier and the mutation harnesses

The tier was run on the final code (with the reset) by `tier678.sh`, under heavy-run at BelowNormal: the rows, then the harnesses.

**Rows** (the 194 files that execute `extend.js` or `turnby.js`, `tier_rows_files.txt`), 17:50:47Z to 18:09:02Z:

    checked: tier_rows_summary.txt (from tier-rows.tap) → tests 2244, pass 2220, fail 1, skipped 21, todo 2

The 2 todo are rows marked TODO in their own files (D642's first-drag timing and built 1's bank re-rounding); they are not fails. The 1 fail was
**drag-ghost row 5**, a pinned hash (fixed below).

**Harnesses** (the 9 that name `extend.js` or `turnby.js`, `tier_harness_files.txt`), 18:09:02Z to 18:23:12Z, counted per harness by
`harcount678b.js` (`harcount_tier.txt`):

| harness | applied / caught / NOT APPLIED |
|---|---|
| core_bank_flow_mutation | 45 / 45 / 0 |
| core_cup_mutation | 48 / 48 / 0 |
| core_landing_xsec_mutation | 18 / 18 / 0 |
| core_ramp_mutation | 105 / 105 / **1** (EX12) |
| core_right_width_mutation | 35 / 35 / 0 |
| core_smooth_ramps_mutation | 18 / 18 / 0 |
| core_turnby_mutation | 22 / 22 / 0 |
| core_width_hold_mutation | 13 / **12** / 0 (D9 NOT CAUGHT) |
| core_xsec_mutation | 67 / 67 / 0 |
| **all** | **371 / 370 / 1**, and 1 NOT CAUGHT; 15 controls and crash stand-ins, all pass |

**Three things the tier found, all mine, all fixed:**
1. **EX12 NOT APPLIED** (`core_ramp_mutation.test.js:157`). Its anchor was `easedPiece`'s old line, `return extend(doc, { ...o, bankCheck: false });`,
   which this change rewrote into the `{ doc, hold }` return. The anchor moved to the new line (`doc: extend(doc, { ...o, bankCheck: false, widthHold:
   'later' })` → the same without `bankCheck: false`), which occurs once in `turnby.js`. The mutant is the same one: the eased piece's extend checks its bank.
   A comment says why. The `'plan'` call is left as it is, because it returns the hold before any check runs.
2. **D9 NOT CAUGHT** (the corner list lays the hold before its corners' knots go in). It is not equivalent. `d9check678.js` patches it in memory and
   lays a corner of 30 with an extra 20 from F m: from 2, 5, 8, 10 and 12 m the path moves 0.148, 0.110, 0.103, 0.0673 and 0.0654 m at the end
   (kh up to 3.8e5 steps), where the real code stays within 0.752 steps and 3.4e-7 m. From 15 m on it is within a step, and the row's only case was from
   50 m. **The corner-list path row gained a case from 10 m** (inside the hold) beside the one from 50 m (`d9check678.txt`).
3. **drag-ghost row 5's pinned hash** (`app/test/drag-ghost.test.js`), AMENDED by name, with the reason in the file. It hashes three corners laid by
   `extendCorner` from a head whose width still widens 0.0839 per m. At L268 the hold's knots moved those corners' other channels, and the pin
   was taken then (5e302d1023e4f078). Now `dg5curves678.js` against c522ea6 and e112a14 shows the corners' other channels are those trees' again as
   curves: every channel but w within 0.685 of a step, sampled every 0.05 m, and each end within 6.3e-6 m (L268's moved the 400 m corner's end
   12.5 cm). The bytes are not c522ea6's, because each corner keeps the hold's 3 inserted knots (77/22/112 against 74/19/109). So the pin is now
   015881f53acdbc5f. The placed pieces' own pin (24bcdf657190c0cd) is unchanged on every tree (`dg5curves678.txt`).

The two changed row files after the fixes: 20 of 20 (`rows_final2.txt`).

**The re-run** covered the two harnesses that read a changed file: `core_width_hold_mutation`, which runs `core-width-hold.test.js`, and
`core_ramp_mutation`, whose EX12 changed. It ran under heavy-run at BelowNormal (`rerun678.sh`), 18:27:29Z to 18:30:31Z:

    checked: rerun_harnesses.tap, harcount_rerun.txt → tests 123, pass 123, fail 0
             core_width_hold_mutation  applied 13 / caught 13 / NOT APPLIED 0   (D9 caught, D11 caught)
             core_ramp_mutation        applied 106 / caught 106 / NOT APPLIED 0  (EX12 caught by "row (2|3|11):")

No source file changed after the tier began: extend.js was last written at 17:45:09Z and turnby.js at 17:11:03Z, against the tier's 17:50:47Z start.
After the tier, only three test files changed (core-width-hold, drag-ghost, and the ramp harness), and no harness reads drag-ghost. So the other 7
harnesses and the 194 row files ran on the code that lands. **Whole, on the code that lands: 9 harnesses, applied 372 / caught 372 / NOT APPLIED 0**
(the tier's 371 + EX12, and D9 now caught).

### 1.7 Track 2's check, run ahead: what the delta read will see

E's `d678.js` and `cmp678.js` (from E's evidence folder, unchanged) on c2591bf and on the final code: `d678_c259.json` and `final_d678.json`. The c2591bf run
equals E's `d678_after.json`. The final run equals my first run with the reset (byte-identical JSON but the tree path). The width columns compared row by row
(swing, where, factor, over 1 mm, over 1e-9, the end, the joint, |w″| at both steps):

| caller (held rows) | the same as c2591bf | differ |
|---|---|---|
| Extend | 60 | 0 |
| Turn by 45 | 60 | 0 |
| Turn by −90 over 200 | 60 | 0 |
| the corner list | 60 | 0 |
| Sharp −60 R40 ramp 1 | 60 | 0 |
| Jump, Level | 60 each | 0 |
| **Sharp −60 R40 ramp 8** | 0 | **60** |
| **Sharp 90 R150 ramp 4** | 0 | **60** |

**So Track 2's "the width columns must be the same" will not read 0 differences: 120 Sharp rows differ, as §0 predicted.** The cause is that the Sharp
piece is the level length again (40.2238 → 40.3629 m; 234.2583 → 234.3479 m), so its hold R is 1.922, not 1.9154, and its knots move. The size:
- ramp 8: swing moved at most 1.054 mm (0.34% of that row; at most 1.39% of any row's swing); largest |w″| 4.707 → 4.6927; over 1 mm until 0–1.7 → 0–1.71 m.
- R150 ramp 4: at most 0.121 mm (0.22%); largest |w″| 4.4353 → 4.4337; over 1 mm until 0–1.38 → 0–1.38 m.
- every row ends at the head's width, level, with no joint problem.

Level heads: the same bytes in every caller (9 of 9); refused on both: 61 (Sharp R22). **Finish:** the first new piece's hold figures (swing, settle, bend)
are c2591bf's in 5 of 5; the pieces themselves differ (their other channels, and the lengths 942/363/942 → 942/364/943, which are the level lap's).

### 1.8 F5, recorded, not ordered

E's F5: a typed width from a still-changing head ends 1.3 mm off level, older than both commits. Not measured or changed here.

## 2. Verdict, and what is open

**The direction holds for the callers the ruling names, and fails for Finish, as registered.**
- **Row 1:** met for Turn by, the corner list and Sharp (and Extend, Jump, Level) against the same head with its width level: 36 of 36, within 0.636
  steps, ends within 3e-6 m. Against the registered level head: 29 of 36; the 7 are the steep grab's head, whose own turn differs (correction 2).
  The rounding bound was met with room: 0.636 steps where §0 allowed up to 1.5.
- **Row 2:** met. 8 of 8 table rows, and 110 of 110 rows, c2591bf's width to the digit.
- **Row 3:** met. Level heads 10 of 10; his copies 32 of 32 lays and 1306 of 1306 re-save hashes.
- **Finish:** fails row 1, by up to 0.97° of bank and 180 steps of turn in its first new piece, ends within 6.4e-5 m. Smaller than c2591bf's (1.35°, and
  a metre of length). Not forced.
- **The tier (1.6):** rows 2244 tests, 2220 pass, 1 fail (drag-ghost row 5's pin, amended by name), 21 skipped, 2 todo. The 9 harnesses on the code that
  lands: applied 372 / caught 372 / NOT APPLIED 0, after EX12's anchor moved and the corner-list row gained its case from 10 m (D9).

**Open, for the chair's call (not done here):**
1. **Finish could meet row 1 by laying its hold after `close`.** §0 ruled this out for a reason that measured false (correction 3). It would need Finish
   to lay its pieces with `widthHold: 'later'` and lay the hold after `close` and before the bank-as-built check. Not tried; no prediction of its result.
2. **Sharp's bend after a steep grab** (1.5): the trade a longer hold buys.
3. **Track 2 needs its bar restated for Sharp:** the 120 Sharp rows differ from c2591bf by design (1.7). The bar that fits is "the width columns the same
   for every caller but Sharp ramp 8 and R150 ramp 4, and those within 1.1 mm of swing, ending level".
4. **F5** stays recorded.

**The unwelcome outcome registered in §0 did not happen:** inserting the hold's knots after the turn is laid left the end of Turn by −90 over 200
within 7e-6 m of the level head's on every head (3e-6 m on the brushed ones, and from the width-only level head), not more than 1e-4 m away
(`final_row1.txt`, endFromLevelM).

## 3. Ruling 1: Finish, one bounded try (added to this file, 2026-11-27)

- **Order:** the chair's ruling 1 (2026-11-27T18:35:02Z); the packet's "Amended 12:4x" (lighthouse 1d5e863a, `packet_t180_width_hold_path_2026-11-27.md:49-`).
- **Base:** 346e2a051db61762224718e0c1417c86fd451f20 on `l264-extend-holds-width-b`, in my worktree `G:\consonance-scratch\b-hold`. The reference tree is
  a detached worktree at 346e2a0, `G:\consonance-scratch\b-hold-346e2a0`, added for this.
- **Tier:** PROVE IT. One attempt. If it misses, it is reverted and Finish stays as at 346e2a0, with one CHANGELOG sentence.

### 3.0 Registration, written before any run of the try (not edited after the first run; corrections go below it)

**The quantum** is §0's: every stored number is rounded to one step of 10^−DEC (`document.js:65`), so "one step" below is that channel's step.

**The build, all of it, in one attempt:**
1. `finish.js` `lay()`: the first new piece laid from the head is laid with `widthHold: 'later'`. That piece is Turn by's, or the straight's, or the
   roll straight's when the roll goes first (`search`'s `base`). The pieces after it are laid as now.
2. `turnby.js` `extendBy`: with `opts.widthHold === 'later'` it returns the solved piece without `withHold`. `extendList` is not changed: Finish
   does not call it, and the width-hold harness's D10 anchors its line.
3. `finish.js`: once the route has closed (`closeBanked` or `metAsLaid`, converged), the hold is laid on the first new piece. It is the hold extend plans
   from the same head for a piece of that length (`extend(doc, { length, widthHold: 'plan' })`, null for a level head), laid by `layHold`, and the
   document is checked and frozen. This comes before `rollPeak`, `roadHold`, `closerLoad` and `cupPeak` read the lap.

**"Before the bank-as-built check", as I read it here.** Finish runs no bank-as-built check on the closed lap. The ones that exist are turnby's `checked`
inside `extendTurnBy` and extend's own, and they run as each piece is laid, before close. With this build they read the first piece without the hold.
The hold then changes no channel but w, beyond re-rounding (inferred: Boehm insertion moves each point by at most half a step, not measured here). The
checks Finish runs on the closed lap come after the hold. This is a reading of the ruling, stated so it can be corrected.

**Rows, as the amendment writes them, with what I measure each by:**
- **F-1, the path and the bank.** From E's five brushed lap heads (brush +1.37 end−5 r20, brush +5 end−30 r40, grab +2 end−10 r20, grab +2 end−0 r10,
  grab −2 end−2 r5: `closew678.js`'s and `row1_678.js`'s), Finish's three new pieces equal the level lap's (E's lap with no brush). That means the same
  number of pieces, the same lengths, and every channel but w and wd within one step, sampled every 0.01 m (`row1_678.js` finish mode, `compare`).
  w and wd are left out because the brushed head's own width differs. The ends are within 1e-4 m (as row 1).
- **F-2, the width.** The first piece's width is still layHold's: `closew678.js` reads 0 control-point differences in 5 of 5. *Added by me:* that
  check re-lays the hold with the same formula step 3 uses, so it is close to true by construction. The stronger reading is that the first piece's knots
  and its w control points equal 346e2a0's, where the hold was laid before close, on all 5.
- **F-3, a level head gives the same bytes.** `row3_678.js` part (1), Finish and the nine callers from level heads, read against the 346e2a0 tree. Also
  Finish at each open head of his copies (`G:\consonance-scratch\b-wr-work\tracks`, numbered), on both trees: the same bytes, or the same refusal.
- **F-4, the lap still closes.** On every head of F-1 the result is closed and passes `checkDoc`. The residual gap is under close's own 1 mm, with the
  same plan word and window as the level lap.
- *Added by me:* pieces 2 and 3 have the level lap's knot counts. If the first piece's placeholder width does not end level, the second piece gets its
  own hold, and this row would show it.

**What fails the try:** any of F-1 to F-4 not met by this one attempt. Then it is reverted, with no second attempt.

**Predicted:** met. With the level knots in place, close, the bank plan and the cup read what they read from the level lap. In close's Newton step the
width's seam row reads only w columns (inferred from `close.js` `valueChannels`, not checked), so the least-norm step on the path's columns is the level
lap's. **Where it could miss:**
- (a) close couples w to the other channels in a way I have not seen;
- (b) close's convergence test reads the width's seam row, so a brushed head takes one more Newton step, which moves the path within close's tolerance
  but by more than a step;
- (c) the placeholder does not end level, so the second piece takes a hold of its own;
- (d) the insertion after close re-rounds piece 1's bank or turn by more than a step.

**The unwelcome outcome, in the words that would make it true:** "With the hold laid after close, Finish from a brushed lap head still lays its first
piece's bank more than one step from the level lap's."

**Default to refuted.** My bias: this route was my own open item 1, and I want it to work. The rows above are mechanical so that my wanting does not
score them.

**Not exercised by these rows:** the roll-first order (E's lap needs no roll), and his tracks with a head still changing (none of his 16 open heads is).

**Tests and runs:**
- A row red at 346e2a0, then green: Finish from E's brush +1.37 lap head against the level lap, the bank and turn within a step, and the first piece
  holding the head's width.
- Mutants in `core_width_hold_mutation.test.js`: F1, the first piece laid with its hold again; F2, the hold never laid after close; F3, `extendBy`
  ignores `'later'`.
- The harnesses that name the changed files: `app/test/core-close-mutation.test.js` (it names `src/core/finish.js`), `core_width_hold_mutation`,
  `core_turnby_mutation` and `core_ramp_mutation`. Then the 194 row files that execute extend.js or turnby.js (finish.js requires turnby.js), all under
  heavy-run at BelowNormal.

### 3.1 The verdict: missed in one attempt, reverted, pushed

**F-1 was not met:** three of E's five heads miss it, the three Sculpt grabs. F-2, F-3 and F-4, and the knots row I added, were met. Per the ruling the
try is reverted, and Finish is as at 346e2a0. Builder `l264-extend-holds-width-b` 346e2a0 → **1074d5d**, which adds one CHANGELOG sentence and changes
no code. It is pushed.

    checked: git -C G:\consonance-scratch\b-hold diff 346e2a0 HEAD --stat → CHANGELOG.md | 6 ++++-- (1 file)
    checked: git ls-remote origin refs/heads/l264-extend-holds-width-b → 1074d5d8dbd730051fad6da250e91594e4ac9457 = HEAD

The sentence, after Finish's exception in the width-hold entry: *"One try at laying that hold only once the lap is closed (D678) was measured against
the bar set for it beforehand and missed it (after a grab with Sculpt, by more than a step of bank, as Finish from the same head with its width level
also does), so it was not kept and Finish stays as described here."*

The registered unwelcome outcome is true, in its own words, for the three grab heads. With the hold laid after close, Finish from those heads lays its
first piece's bank 496.667, 264.717 and 496.667 steps from the level lap's. From the two brush heads it is 0.594 steps.

### 3.2 The build as tried (the whole of it is kept as a patch)

`..._evidence/ruling1/try_346e2a0.patch`, 109 lines; `git apply` re-lays it on 346e2a0.
- `finish.js`: `lay()` takes `fromHead`. The first piece laid from the head gets `widthHold: 'later'`, whether that piece is Turn by's, the straight's or
  the roll's. Under roll-first, `search`'s roll base gets it too.
- `finish.js` `holdAfterClose(doc, closed, k)`: `extend(doc, { length, widthHold: 'plan' })` + `layHold` on piece k, then `checkDoc` and freeze. It is
  called after `if (!res.converged) …` and before `rollPeak`.
- `turnby.js` `extendBy`: under `'later'` it returns `r.doc`, without `withHold`. `extendList` is unchanged.
- core-close-mutation's N2 anchor occurred once. The other anchors were not on changed lines. Syntax checked, and the file is CRLF.

### 3.3 The rows, as registered (the try against the detached worktree at 346e2a0)

**F-1, the three new pieces against the level lap's**, every channel but w and wd, sampled every 0.01 m (`row1_try.txt`, the `{"finish": …}` lines,
`vsLevel`):

| head | largest difference, in steps | where | end from the level lap's | F-1 |
|---|---|---|---|---|
| brush +1.37 end−5 r20 | kh 0.847, phi 0.594 | kh, piece 0 at 13.25 m | 7e-6 m | met |
| brush +5 end−30 r40 | kh 0.847, phi 0.594 | kh, piece 0 at 13.25 m | 7e-6 m | met |
| grab +2 end−10 r20 | **phi 1196.479**, kh 1.127 | phi, piece 1 at 67.06 m | 2.8e-5 m | **not met** |
| grab +2 end−0 r10 | **phi 1196.479**, kh 1.57 | phi, piece 1 at 67.06 m | 1.5e-5 m | **not met** |
| grab −2 end−2 r5 | **phi 1196.479**, kh 1 | phi, piece 1 at 67.06 m | 2.9e-5 m | **not met** |

1196.479 steps of phi is 1.2e-6 rad, about 6.9e-5°. Against 346e2a0 (`vsRef`), the try moved piece 0's bank by up to 16,845,017 steps (0.9651°) toward
the level lap's, on all five. For the bank, it did what it was built to do.

**F-2, the width:**
- `closew_try.txt`: 0 control-point differences, 5 of 5.
- `fincheck_try.txt`: the first piece's knots (50) and its w control points equal 346e2a0's, 5 of 5.

**F-3, level heads and his copies:**
- `f3_row3.txt`: level heads give the same bytes, 10 of 10 (nine callers and Finish).
- Of his 27 copies, 1 is refused on parse, 10 are closed and 16 are open, 0 of them with a width still changing. Extend and Turn by lay the same bytes,
  32 of 32.
- `f3_finbytes.txt`: under Finish, 16 of 16 give the same bytes or the same refusal: 11 laid, 5 refused, each with the same code and message hash.
- Both ran under heavy-run at BelowNormal, 556 s and 591 s (`f3run.log`).

**F-4, the lap closes** (`fincheck_try.txt`): 5 of 5 closed and passing `checkDoc`. The gap is 0.0051 to 0.0303 mm, the plan LSL and the window [6,7,8],
the level lap's.

**Added, the knots:** pieces 2 and 3 have 18 and 47 knots, the level lap's, 5 of 5. So risk (c), the placeholder not ending level, did not happen; nor did
(d). Of (a) to (d), none was the cause (§3.4).

**The other callers did not move:** row 1 again reads 36 rows with 7 fails (`row1_try.txt`, "ROWS 36, fail 7"), Track 1's 29 of 36 against the
registered level head. `inferred:` they are the same 7 (the steep grab head), because the try changes `extendBy` only under `'later'`, which only Finish
passes.

### 3.4 Why the grab heads miss: the comparator, not the hold (a diagnostic run after the first result; not registered)

`finflat678.js` compares each head with the same head made width-level: its last piece's last two w control points set equal, so its slope is 0.
- (1) The grabbed head document against the level lap: the head piece has 8, 7 and 13 knots where the level lap has 2, and kh within 0.519, 0.549 and
  0.382 steps. The brushed heads are the same as the level lap.
- (2) On the try, Finish from the head against Finish from the same head width-level: **5 of 5 within 0.847 steps** (kh) and 0.594 (phi), pieces 2 and 3
  the same. This is the hold's own effect after close.
- (4) Finish from the width-level head against the level lap: the grabs differ by 496.667, 264.717 and 496.667 steps of phi in piece 0, and 1196.479 in
  piece 1, the same as with the slope. The brushes are the same.
- At 346e2a0, (4) is the same to the digit (`finflat_346e2a0.txt`). A width-level head takes no hold (`holdW` is undefined at slope 0), so this is Finish
  carrying the grab's own turn on, on both trees.
- c522ea6, which has no hold code, cannot serve as a control. Finish from the brush +5 head refuses there (BAD_WIDTH: the slope carried over 942 m runs
  the width negative; `finflat_c522ea6.txt`).

Read plainly, the bar failed on a bundle: the try, plus a comparator that a grab head cannot meet under any width code. This reading does not re-score
the try. Under this ruling the bar was the bar.

### 3.5 Tests, harnesses, tier

None run for the commit: 1074d5d's code is 346e2a0's byte for byte, and its tier is §1.6. The registered test row and mutants F1 to F3 were not written,
because the try is not kept.

**The credential and key scan of the commit's diff and message:**
- Token, key and password patterns: 0. The email's local part: 0. "keeper": 0.
- The key's names (`keycheck678r1.js`, which takes the names from the key at run time and prints none): 0 hits; the control, the key itself, has 21.
- In this file's evidence scripts there are 5 part-hits. All are one six-letter part of a key name that is the ordinary word in "BelowNormal" and
  `PRIORITY_BELOW_…` (`keywhere678r1.js` prints them masked). No name occurs.

### 3.6 Corrections

1. **My registration had the wrong comparator for three of its five heads, and I held the fact that showed it.** §2 correction 2 had found that a grab
   head is not a level head with only its width changing. I still registered E's grab heads against the unbrushed lap. The registered bar was missed
   and is reported as missed. I did not re-score it against the width-level head.
2. `row1_678.js`'s finish mode prints "FINISH ROWS 5, fail 5" because its `ok` also asks for 346e2a0 (`vsRef`) within a step, and that is what the try
   is built to move. F-1 reads `vsLevel` alone.
3. grep crashed during the email check (`grep.exe.stackdump` in the worktree at 13:07:59 local, mine, removed) and printed an empty count. The count was
   re-run in node: 0.
4. Five diagnostic runs (row1, finflat ×3, fincheck with closew) went outside heavy-run. Each was a single process at BelowNormal, 14 to 99 s. The F-3
   runs went through it.

### 3.7 For the chair (no second attempt is made here)

- If the bar for Finish should be "the same head with its width made level", the try met it 5 of 5 (§3.4 (2)), with F-2 to F-4 as above. Re-applying it
  is `git apply` of the patch, and that is a new ruling's call.
- For Track 2's reader: Finish is as at 346e2a0. The CHANGELOG at 1074d5d says so.
