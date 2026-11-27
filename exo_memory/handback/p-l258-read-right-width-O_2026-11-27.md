# L258 track 2 read, pane O: the right side's own width, f3cd425..e4e7ecc (2026-11-27, 09:2xZ)

**Verdict: CLEAN, with one finding for the landing (F1).**
- Nothing in the range lays a wrong road, changes an old track or loses a side.
- **Every way of adding road after a head with a right width either carries it on, or is refused and changes nothing.** Extend, Level, Turn by, Turn to grid, Sharp, the Jump's take-off, Delete, Smooth ramps, Bank the lap and the width brush carry it on. A saved piece inserted at that head is refused.
- F1 is that refusal's words, and a limit neither hand-back names.

**The base and range:**
- **Base:** builder `d677-right-width-b` **e4e7ecc**; read `git diff f3cd425 e4e7ecc`, 23 files, +591/−65.
- **Where:** my own detached worktree `C:\Consonance\t180-wt-o-l258r`, removed at hand-back. Nothing was committed in the builder; nothing was pushed, built or installed.
- **The objects:** B's `handback/p-l258-right-width-B_2026-11-27.md` (room ad20cff5) and D's `handback/p-d677-right-width-B_2026-11-27.md`, read whole. The order is `loop/packet_t180_resume_on_L_2026-11-27.md`, "Track 2" and "Then, each track".
- **Order of work:**
  1. the diff of document.js, adapter.js, close.js, piece.js, sharp.js, extend.js, coreshell.js and panel.js;
  2. my first pass: what to vary;
  3. B's and D's hand-backs;
  4. the varies.
- I wrote none of this branch.

## First pass, before the hand-backs (from the diff)

- **The joint check** (`document.js` `jointProblem`) loops over every channel, `wd` included. So any way of adding road that lays a piece without the split flag after a split head is **refused at the joint, never stepped**, provided it goes through `appendPiece`.
- **The side-width consumers** read the profile's own extents, which `baseProfileOf` widens:
  - the edge frame (`adapter.js` `edgeFrame`: `hr = -P.u[0]`);
  - pass clearance (`passclear.js` `sectionOf(normalize(segments[j].profile))`);
  - the pit lane (`export/pitlane.js` via `markers/place.js` `profileAt`, `u[0]`/`u[last]`);
  - the AI line (`ailine.js:83`: `sideLeft`, `sideRight` from the section's own points).
- **What to vary,** where B's rows do not go: every way of adding road after a split head; other widths; closed laps; his old files byte for byte (B: "D's byte-for-byte reading of saves and undo … was not re-run here"); and the consumers above.

## The varies (checked; each is one run of `o_vary.js`, `o_vary2.js` or `o_vary3.js` in the evidence, or `o_lane.js`)

All on our own synthetic road: 19.1 m wide, a 300 m left turn at R 400 banked 8°, then the right side stepped +3.5 m over 5 m and held. So the head's right half is 11.3 m and its left 9.55 m.

**Other heads** (through the core shell, as the panel's buttons run them):

| what is added after the split head | message | the new road's wd at its start / end | right half at the joint |
|---|---|---|---|
| Extend 80 m, nothing typed | none | 3.5 / 3.5 | 11.3 m |
| Level 80 m | none | 3.5 / 3.5 | 11.3 |
| Turn by 30°, 120 m | none | 3.5 / 3.5 | 11.3 |
| Turn to grid, 120 m | none | 3.5 / 3.5 | 11.3 |
| Sharp 60° at R 150 (the width's tightest is 138.3) | none | both pieces 3.5 / 3.5 | 11.3 |
| Extend 60 m with the width alone typed (25) | none | 3.5 / 3.5 (the right side follows the width) | 11.31 |
| Jump (the button's take-off, flight and landing) | "Jump placed: move its landing by hand." | take-off 40 m: 3.5 / 3.5; **the 60 m landing: one width** | take-off 11.3 / 9.55 |
| Extend 80 m after that landing | none | 0 / 0 (it follows the landing) | |
| **a saved plain piece inserted** | **"JOINT: piece 3 (p4): wd starts at 0, the previous piece ends at 3.5 (every road joint must meet smoothly: the same value and slope in every channel)"**; nothing changed (3 pieces before and after) | | |
| the same piece, after the right width is brought back to the width | "added the piece "plain" at the head" | | |

- **The Jump's landing is one width:** D's named edge, "After a flight, the landing's sides are one width unless wd is typed". Jump's own landing is the family's default width anyway (`jump.js`).
- **Delete inside the split run** (the step up, or the hold): laid, 5 pieces. The right width at every joint meets (0→0, 0→3.5, 3.5→0), and the schema stays core/7.
- **Smooth ramps on a road with a split run:** `wd` and the split flags kept exactly.
- **A width brush (+2 m, Sculpt's value brush on w) on the held split piece:** `wd` unchanged. The right half goes 11.3 → 12.243 and the left 9.55 → 10.493, the same move on both sides, as the design says ("every edit of w moves both sides").

**Other widths:**

| road | result |
|---|---|
| w 20, wd −18 (right side 2 m) | laid; right half 1 m, left 10 m |
| w 20, wd −20 (right side 0) | **refused**: "BAD_WIDTH: … the road's right side must be wider than 0 m, but its width plus wd is 0 m at a control point" |
| w 10, wd +40 | laid; right half 25 m, left 5 m |
| a cup piece (c 30) with wd +6 | laid; right 11, left 8 |
| an edge piece (e 25, er 10, s 0.6) with wd +6 | laid; right 11, left 8 |
| the default (legacy bowl) piece with wd +6 | laid; right 11, left 8 |

My probe labelled the last row "the flat family"; it never set the family, so it is the default piece. Corrected here.

**Closed laps** (`close` on four 90° corners of R 150 with 100 m straights, 14 m wide):
- **Split all the way round** (wd 3 from the start): converged and closed, core/7. The seam meets (3 = 3); 8 split pieces.
- **Split in the middle only** (wd 0 → 4 → 0): converged and closed. The seam meets at 0; 3 split pieces.
- **Bank the lap** on the lap split all the way round: banked (8 pieces, "the route did not move"), `wd` kept exactly.

**Consumers:**
- **The AI line,** written by the shell's Test export of a split road (`buildExport`, the app's `makeExporter`): `sideLeft` / `sideRight` read back as 9.55 / 9.55 on the straight, **9.55 / 11.3** where the step is held, and 9.55 / 9.55 after it comes back. Exact.
- **The pit lane** on the right of the held step (offset 6 m, width 8):
  - **The lane builder puts the road's edge 11.245 m from the centre;** on the same road with its sides equal, 9.503 m. Ratio 1.1833, against 11.3 / 9.55 = 1.1832. The bowl's curve makes both a little under the profile's half-width, as D measured.
  - The lane's inner edge sits 6.000 m beyond the edge in both, and the export's own self-check finds 0 red rows (`laneForExport` with `selfCheck`).
  - So the lane is placed off the widened side.
  - The Test export writes no pit file; the lane was measured from the lane builder itself (`o_lane.js` → `lane_measure.txt`).
- **Pass clearance:** a split segment's own profile, which `sectionOf` reads, has its right reach at 11.3 and left at 9.55. Its exports confirm `sectionOf` is its internal reader.
  - inferred: no pass was built to make the widened side alone close the gap.

**Old tracks, base f3cd425 against e4e7ecc** (copies of his folder, made at 09:1xZ, the copies' hash equal to his folder's; his folder never written):

| | parse then save: the same on both | saved as its own text | refused on both |
|---|---|---|---|
| his 14 core saves | **14 of 14** | 12 | 0 |
| his 11 backups | **11 of 11** | 9 | 0 |
| the 121 document steps in his 13 undo files | **121 of 121** | 118 | 0 |

- The ones not saved as their own text change on base too (D's reasons: older schemas upgraded, compact files re-laid out).
- **Each open save extended 80 m, then given a width brush of +1.5 m, on both trees:** the same bytes on **12 of 12**. The 2 closed saves were not edited.
- **A split track saved, opened again and undone:** saved as core/7 with its undo file. Opened again, "undid: piece p2 placed" restores the history: 3 → 2 → 1 pieces.

**B's own rows:** `node --test test/core_right_width.test.js app/test/core-right-width-panel.test.js` on my worktree, at BelowNormal → **25 of 25** (`rows_tip.txt`).

**Not re-run here:**
- B's whole suite;
- the 29 right-width mutants and the other harnesses;
- B's export comparison of the 14 tracks.

B's figures for them stand as B's.

## F1: a saved piece inserted at a split head is refused in words he does not know

- **What happens:** with the head's right side at its own width, Pieces ▸ insert of any saved piece is refused. Nothing changes. He reads: *"JOINT: piece 3 (p4): wd starts at 0, the previous piece ends at 3.5 (every road joint must meet smoothly: the same value and slope in every channel)"*.
  - checked: `o_vary2.js` through the shell's `insertPiece`.
- **"wd" is the stored channel's name.** His field is "right width m". Nothing on the page tells him the refusal is about the right side, or what to do: bring the right width back to the width, then insert. That does work (checked).
- **The cause** (from the code): a saved piece's format (`t180b.piece/1`) has no `wd` (D: "Saved pieces cannot carry wd"). An inserted piece starts at wd 0, and the joint check refuses the step.
- **Neither hand-back names this case.** D names only that *saving* a run with a right width is refused (`SPLIT_RUN`, in plain words). Inserting at a split head is new with this range: before it, a saved piece inserted at any head.
- **Not a wrong result:** nothing is laid wrong and nothing is lost. So CLEAN.
- **What would close it,** for B or the landing, inferred, not built:
  - either say it in his words, as `SPLIT_RUN` does ("the head's right side has its own width, which a saved piece cannot carry yet; bring the right width back to the width, then insert"), with a row;
  - or carry the head's `wd` through the inserted piece, as Extend does.
  - And name the limit in the CHANGELOG beside `SPLIT_RUN`.

## Not done here

- **The sculpt-frame timing**, base against branch: owed, as B says. Not taken, by the order.
- **Falsifier (b) on [T5]:** owed to D.
- **His installed app and P's worktree:** untouched. P is installing a merge of this branch; nothing here touched it.

## Corrections, mine

- **My first probe misread three cases:**
  - Sharp was asked R 40, under the width's tightest (138.3; refused for that, not for wd);
  - my side reader did not skip a flight's empty profile, so Jump threw in the probe;
  - the pit lane was set without three of its fields, then with `leave`/`rejoin` in the wrong form.
  Each was run again (`o_vary2.js`, `o_vary3.js`, `o_lane.js`), and those runs are the figures above.
- **My first read of the Jump case** took the first road piece it added, the 40 m take-off, for the landing. The landing is the 60 m piece after the flight, and it is one width. Corrected in the table.

## Names, and the machine

- **Names:** checked: `node namecheck.js <evidence> <this hand-back>` → 83 terms against 12 files, 25 hits.
  - All 25 are on four common words that are also layout or file names somewhere: normal, road, track, and trees (in "both trees" and "worktrees").
  - His saves appear only as counts, never by name. Other authors' tracks were not read in this lap.
- **Left on the machine:**
  - my scratchpad, without the copies of his saves (deleted at hand-back);
  - **the worktree removed** (`git worktree remove`);
  - no build dir;
  - no process of mine running.
- **His app:** not running at the first run (checked: `tasklist`). Both heavy-run slots were held by P and A throughout. My probes ran alone at BelowNormal, as single probes, after `heavy-run.js --status`, taking no slot. I timed nothing.

## Evidence

`p-l258-read-right-width-O_2026-11-27_evidence/` (78 KB, 11 files):
- **The probes:** `o_vary.js` → `vary.json`; `o_vary2.js` → `vary2.json`; `o_vary3.js` → `vary3.json`; `o_lane.js` → `lane_measure.txt`.
- **B's rows:** `rows_tip.txt`.
- **The lock:** `heavy_run_status.txt`.
- **The name check:** `namecheck.js`.

BASE: C:\Users\zackn\Downloads\t180-track-builder f3cd425

NEXT: librarian takes CLEAN to the chair, with F1 named for B or the landing (the refusal's words, or carrying wd through an inserted piece), when it has read this; the sculpt-frame timing stays owed to a seat with both slots.

## Delta read, 2026-11-27 09:5xZ: B's F1, e4e7ecc..8b7cafc — NOT CLEAN

**Order:** the chair's of 09:44:20Z.
- **Base:** builder `d677-right-width-b` **8b7cafc**, one commit on e4e7ecc; local only, not pushed, not in the installed build. Read in my own detached worktree `C:\Consonance\t180-wt-o-l258f`, removed at hand-back.
- **The objects:** B's section "F1: a saved piece added at a split head, in his words" (`handback/p-l258-right-width-B_2026-11-27.md`, room 154220e5), read whole, against my F1 above.
- **The diff** (checked: `git diff e4e7ecc 8b7cafc`): 7 files, +48/−5.
  - `piece.js` `insert` throws `SPLIT_HEAD` when Add's `JOINT` refusal has `onlyRightWidth`.
  - `document.js` exports `jointProblem`.
  - The rest is one row, two mutants (R26, R27), and the CHANGELOG, README and MAP lines.

**Verdict: NOT CLEAN, on the words' truth (F2).** The guard is sound.

### The guard: sound (checked)

**From the code:**
- `onlyRightWidth` only changes the words of a refusal Add has already made (`e.code === 'JOINT'`). It never lays anything itself, so it cannot let a bad joint through. `appendPiece` still decides.
- It holds when `jointProblem` fails at the head and passes with the head's `wd` set to 0. So any other fault keeps the original `JOINT`.
- `jointProblem` names the first failing channel in `CHANNELS` order, and `wd` is last. So the other fault is the one he reads.

**Varied** (`o_f1.js` → `f1.json`):

| head and piece | he reads |
|---|---|
| an edged split head, plain piece | "JOINT: … e starts at 0, the previous piece ends at 10": the edge, not hidden |
| a cup split head, legacy piece | "PIECE_KIND: a legacy piece cannot be added after a cup piece …": the kind first |
| a cup split head, cup piece, and its mirror | SPLIT_HEAD: the right width is the one fault |
| a right side narrower than the width (wd −3.5) | "right width 15.6 m, width 19.1 m": true. Followed, the piece is laid |

### F2: followed as written, the words do not let the piece in when the width is not a two-decimal number (checked)

`o_f1.js` → `f1.json`:
- **The run:** through the core shell, a split head, a saved plain piece added (refused), then the words' own advice typed as he would type it. That is right width m = the number the words give, the width field left as shown, sent through the panel's own `extendOptions`, one Extend of 100 m. Then the piece added again.

| head | words say | wd sent | after the Extend | second add |
|---|---|---|---|---|
| B's: width 19.1 | "(19.1)" | 0 | ends at wd 0 | **laid** |
| width 19.1346 (typed) | "(19.13)" | **−0.0046** | still split, wd −0.0046, core/7 | **refused again** |
| width 19.1, then Sculpt's width brush (+1.37) at the head: width 20.463 | "(20.46)" | **−0.003** | still split, wd −0.003, core/7 | **refused again** |

- **The second refusal reads:** *"SPLIT_HEAD: the road's right side has its own width at the head (right width 19.13 m, width 19.13 m), which a saved piece cannot carry on yet; Extend with right width m set to the width (19.13), then add the piece"*.
  - Both widths now read the same, and the advice is the same.
  - **Following the words leads back to the same refusal.** In the brushed case they read "right width 20.36 m, width 20.36 m".
- **Why** (from the code; checked by the numbers above):
  - The words round both widths to two decimals (`+x.toFixed(2)`), as the panel shows its fields (`app/core/panel.js` `show`, two decimals).
  - But the panel sends a typed right width against the head's **unrounded** width (`targets.wd = wR - ref`, `ref = head.w`, `panel.js:227`).
  - Extend snaps a right width to exactly 0 only when the target is exactly 0 (`extend.js`, `endAsked === 0`).
  - So a width with more decimals leaves a few millimetres of `wd`, and the road stays split.
- **Reachable:** a Sculpt width brush leaves such widths. It is an ordinary edit, the third row.

**The ways out** (`f1_wayout.txt`):
- Typing the width field as well (width m 19.13 and right width m 19.13) sends wd 0. The piece then ends at 0, and the next add is laid.
- So does typing the width to four decimals (19.1346), which the panel never shows him.
- **Neither is what the words say.**

**My correction, against my first read above.** The same trap is in e4e7ecc, before this delta, and my CLEAN did not see it: I tried no head with a non-round width.
- The CHANGELOG's way back, *"to go back, set the right width back to the width (the piece then writes no `wd`, and the file is core/4, /5 or /6 again)"*, fails the same way for such a width.
- Typed as shown, the right width ends 3 to 5 mm off. Every piece after it stays split, and the file stays core/7.
- 8b7cafc turns that into an instruction he is given at the moment he is stuck.

**What would close it,** for B (inferred, not built), with a row on a head whose width is not a two-decimal number (19.1346, and one left by the width brush):
- **One rule:** a typed right width equal to the width *as the panel shows it* means "back to the width". The panel sends wd 0, or Extend takes any wd target within the display's half step (0.005 m) as 0.
- **Not enough alone:** printing the width to four decimals in the words. The panel's own field still shows two.

### What B's section says that holds (checked)

- The words name his field, "right width m", and the head's two widths. They give no `wd`.
- The jump-first run is still laid at a split head. B checked that; I did not re-run it.
- The row is red at e4e7ecc with my text (B's figures). B's mutants R26 and R27 read right.
- **Not re-run here:** B's touched rows (141 of 141) and the harness (31 / 31). They stand as B's.

### The machine

- My worktree removed (`git worktree remove`). No process of mine running.
- His saves were not opened in this section. The roads are synthetic; no names.
- I ran no heavy run: one probe at BelowNormal, after `heavy-run.js --status`, taking no slot, with both slots held by P and A.

**Evidence added to `p-l258-read-right-width-O_2026-11-27_evidence/`:** `o_f1.js` → `f1.json`, `f1_wayout.txt` (the `node -e` that made it is in the section above), `heavy_run_status_f1.txt`.

NEXT: librarian takes NOT CLEAN to the chair with F2 for B (a right width typed as the width is shown goes back to the width, with a row on a non-round width), when it has read this section.

## Delta read, 2026-11-27 10:1xZ: B's F2, 8b7cafc..de6c069 — NOT CLEAN on the CHANGELOG's way back only; the code is clean

**Order:** the chair's of 10:01:27Z.
- **Base:** builder `d677-right-width-b` **de6c069**, one commit on 8b7cafc; local only. Read in my own detached worktree `C:\Consonance\t180-wt-o-l258g`, removed at hand-back.
- **The objects:** B's section "F2: a right width typed as the width is shown is back to the width" (`handback/p-l258-right-width-B_2026-11-27.md:247`, room d717cf54), read whole, against my F2 above.
- **The diff** (checked: `git diff 8b7cafc de6c069`): 6 files, +82/−6.
  - `panel.js`: `backToWidth`. With no width target, a right width typed `=== near2(ref)` is sent as wd 0, for the first target and for each change at its mark (`wdAt`).
  - `piece.js`: SPLIT_HEAD's numbers through `shown2`, the panel's own arithmetic.
  - Three panel rows, mutants, and the CHANGELOG, MAP and README lines.

**Verdict: NOT CLEAN, on one sentence, the CHANGELOG's way back** (F3 below). It does not hold as written, at any width. The rule B built holds everywhere I varied it.

### The rule: holds (checked: `o_f2.js` → `f2.json`, the panel MOUNTED with B's own fake DOM, typed as he types)

**Typed in the mounted panel:**

| head | typed | result |
|---|---|---|
| split, width 19.1346 (shows 19.13; right shows 22.63) | right width m "19.13", width left as shown | ends at **wd 0**; the next piece is one width; both fields then show 19.13 |
| split, 19.1 brushed +1.37 at the head (width 20.463, shows 20.46) | right width m "20.46" | ends at **wd 0**; the next piece is one width |
| unsplit, 19.1346 | right width m "19.13" | not split; the file stays **core/4** |
| split, 19.1346 | the width field typed as it shows ("19.13") and right width "19.13" | wd 0; the width kept at 19.1346 (a field typed equal to what it shows counts as left as shown, `asTyped`) |
| split, 19.1346 | the width typed as a new number (19.2) and right width 19.13 | wd −0.07, as typed (the difference of the two typed numbers) |
| brushed split head | SPLIT_HEAD's advice, "(20.46)", typed into the mounted panel | the piece is **laid** ("added the piece "plain" at the head") |

**The other ways a right width is set** (checked in code at de6c069):
- **Every Extend button reads the same options,** `opts()` → `extendOptions`: Extend, the ghost (`panel.js:660`), Turn by (`:737`), Turn to grid (`:753`), Sharp (`:761`) and Jump (`:1137`). So the rule covers all of them.
- **Every write into a change row goes through `show()`, two decimals:** a handle drag (`:1545-1552`), an offer (`:1622-1623`), a row made where its handle stood (`:1533`), and Undo's put-back of the recorded values (`:595`). So a dragged or restored right width lands on the same two-decimal grid the rule compares against.
- **The width brush and Sculpt do not touch `wd`** (D's named edge, and my earlier vary: `wdUnchanged`). So they cannot leave a few-mm right width.
- **A pasted value** is read as typed (`num` → `Number`). A comma is NaN and refused by Extend as a non-finite target. inferred from the code; not pasted.

**A right width he really wants a few mm off** (through `extendOptions`): it holds to the millimetre.

| width | typed | sent | the road's right side |
|---|---|---|---|
| 19.1346 | 19.1316 | −0.003 | 19.1316 |
| 19.1346 | 19.133 | −0.0016 | 19.133 |
| 19.1346 | 19.1376 | +0.003 | 19.1376 |
| 19.1 | 19.097 | −0.003 | 19.097 |
| 19.1 | 19.103 | +0.003 | 19.103 |

- **The one value lost is B's stated trade-off:** a right width exactly equal to the width *as shown*, when the true width differs (19.13 on 19.1346, 4.6 mm narrower). It is sent as 0.
- It is reachable by typing the width field too.
- inferred: rare and recoverable, and the right call against making every right width within 5 mm unlayable from every caller.

**B's rows:** `node --test test/core_right_width.test.js app/test/core-right-width-panel.test.js` on de6c069, at BelowNormal → **29 of 29** (`rows_f2.txt`). B's touched set (144) and harness (35 / 35) were not re-run; they stand as B's.

### F3: the CHANGELOG's way back does not hold as written (checked)

**The sentence**, unchanged since e4e7ecc: *"An older builder refuses a core/7 file by name rather than open it wrong; to go back, set the right width back to the width (the piece then writes no `wd`, and the file is core/4, /5 or /6 again)."*

**On a road that has a step** (`o_f2.js`, case C), at width 19.1 and at 19.1346 alike: a 3.5 m step, then an Extend with the right width set back to the width as shown (B's rule applied).
- **The file stays core/7.**
- **The pieces that write `wd` are the step, the hold, and the piece that sets it back.** That last piece ramps 3.5 → 0, so it writes `wd` too.
- Only the piece after it is one width.
- **What brings core/4 back:** the stepped pieces taken off (Undo or Delete).
- **The panel has no way to change a placed piece's right width.** Selecting a piece only lends its values to the fields for the next Extend (`panel.js:1335-1345`).

**B's third row,** *"the CHANGELOG's way back holds on such a width"*, builds its head with `{ split: false }`: a road that never had a right width. It proves that typing the width as shown on such a road keeps its schema, which is F2's fix. It does not prove the way back, because there is nothing to go back from.

**What would close it** (inferred, a words change):
- *"to go back, Undo or delete every piece whose right side has its own width; setting the right width back to the width ends the step, and the pieces after it write no `wd`, but the file stays core/7 while the stepped pieces are in it"*;
- the row renamed to what it holds;
- optionally, a row on a stepped road that asserts core/7 after setting it back, and core/4 after the Undo.

**Why it is NOT CLEAN and not a nit:** it is the rollback note of a stored-format change. Someone who follows it expecting an older builder to open the file again gets "a newer file needs a newer builder".

### Correction, mine, to my last section

- **I wrote** that the CHANGELOG's way back *"fails the same way for such a width … Every piece after it stays split, and the file stays core/7"*, as if the few millimetres were the cause of core/7.
- **They are not.** The file stays core/7 at any width, two-decimal widths included, because the stepped pieces keep `wd` (case C above, at 19.1). The millimetres only kept the pieces *after* it split. B's fix cures that part.

### The machine

- My worktree removed. No process of mine running.
- His saves not opened. Synthetic roads only; no names.
- One probe and two row files, at BelowNormal, after `heavy-run.js --status`; no slot.

**Evidence added:** `o_f2.js` → `f2.json`, `rows_f2.txt`, `heavy_run_status_f2.txt`.

NEXT: librarian takes NOT CLEAN (F3, the CHANGELOG's way back and B's third row's name) to the chair for B, when it has read this section; the code of F2 is clean.
