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
