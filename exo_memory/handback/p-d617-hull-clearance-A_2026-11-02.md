# D617: the hull keeps clear of another pass (seat A, 2026-11-02): STOPPED for a decision, nothing committed

Branch **d617-a** off public main `a005e1d` (v0.4.38), worktree `t180-wt-a617`. **No commit.** Two uncommitted files are in the worktree (the WARN row's work
in progress, §4). The clearance zone's work is saved as patches in the evidence, not in the tree. EV = `exo_memory/handback/p-d617-hull-clearance-A_2026-11-02_evidence/`.

## 1. The answer

**The fix the order describes can't be made cleanly at this crossing without changing the hull shape he approved, so it's a decision for the chair and him.**

- At p38/p41 on his track (and p38/p40 on the tracked 10-22 fixture), the lower pass's apron lies within a metre or two **under p38's own plank**, along about
  6 m. **inferred:** the hull's drawn part that cuts it is mostly the RUN under the plank. That is apron.js's Hermite curve from the plank's tip down to a skin
  edge 2 to 3 m deep, and since D604 it leaves the tip heading down. Before D604 the join ran from the plank's outer row nearly flat into a skin 0.5 m down,
  which is why the 0.4.34 export crossed in only 3 pairs.
- To clear that apron, the run must stay within about a metre of the plank. With today's run rules that **folds**: the final-scene check reports
  "the underside skin folds 179.8° across the road" in p38 and p40 wherever I lifted a cell that far (§3).
- And part of the crossing sits beside **p38's own plank (physics) crossing p41's apron** (the 0.88 m overlap queued for the pass-clearance item). There, lifting
  the hull makes it worse: cell s 22665 has 6 crossings at full depth and 9 at the floor (§3).

The choices, each his call:
- (a) let the run under a plank stay shallow where another pass lies under it: a local outline like before D604, not one tip-to-tip sweep there;
- (b) resolve the planks' own overlap first (the pass-clearance item), then lift the hull where it still needs to;
- (c) accept it as drawn-only, and ship the WARN row alone so it's said, not hidden (once §4's two faults are fixed).

## 2. What was measured (read-only on his tracks; node exports of his ELYSIUM copy and the tracked fixture)

`probe617.js <tree> <doc>` builds the export and counts drawn × other-piece physics triangle pairs, piece by name (`EV/runs/probe-*.txt`):

| | his ELYSIUM | the tracked fixture (10-22) |
|---|---|---|
| 0.4.38 (base) | **38**: UNDERSKIN p38 × APRON p41 33, UNDERSKIN p40 × APRON p38 5 | **51**: p38 × ROAD p40 24, × APRON p41 10, × APRON p40 6; p40 × APRON p38 11 |
| physics against physics, near p38 (`probephys617.js`, `phys2-*.txt`) | APRON p38 × APRON p41, 4 + 4 | APRON p38 × ROAD p40 4, × APRON p40 5, and the reverse 4 + 5 |
| with the clearance zone, last version (fix3) | 35 | 48, and one 179.8° fold warned |

Every drawn crossing lies within 6 m of a physics-on-physics crossing (bins in m):
- his ELYSIUM, base: <1: 6, 1–2: 8, 2–4: 11, 4–6: 11, >6: 2;
- his ELYSIUM, fix3: <1: 12, 1–2: 8, 2–4: 6, 4–6: 9;
- the fixture, base: 10 / 11 / 10 / 10 / 10;
- the fixture, fix3: 20 / 9 / 8 / 9 / 2.

Where the piercing vertices sit (`where617.js`, `where-*.txt`):
- **his ELYSIUM:** within 4 m of p38's edge, the hull at 2.2–3.0 m deep, the other surface 1.5–2.1 m down the hang.
- **the fixture:** another pass's surface is 0.6 m down the hang at p38's edge, closer than p38's own plank drops (0.93 m).

## 3. The clearance zone I built, and why it is not committed (`EV/wip/zone-wip.patch`)

- **Where it lives:** `underskin.js clearanceZone`. It finds rows near another pass (a station over 25 m away, `bvh.js`'s rule), and scores a hull factor f per cell.
- **What it scores:** the skin's own triangles and apron.js's own run (`apronOf`) at f, pushed 0.15 m down, against the other pass's road and planks, and whether the run folds.
- **How f is chosen:** bisection to the deepest clear f, eased back over 30 m along the road.
- **How it reaches the export:** `hullScaleAt` takes it, so the skin, the runs and the lane outline follow, and `hullClear: false` keeps the old depth for comparison.

Results:
- his ELYSIUM: one cell clears at 0.755 with no fold. Its neighbour s 22665 gets worse when lifted.
- the fixture: one cell is lifted to 0.45 and the check then warns a 179.8° fold. My own fold test (spans turning past 90°) missed it, and the check found it.

**Correction, my own:**
- The first versions cast rays from 32 columns and missed the apron's thin tip between them, which is why the second used the hull's own triangles.
- I also first modelled the run as the straight chord. It is a curve that dips below the chord at the tip.

## 4. The WARN row (`finalscene.js`, kind `through`): close, not ready (`EV/wip/through-row-wip.patch`)

What it does: drivable faces' stations are filed per 4 m cell. A drawn face is tested against drivable faces more than 25 m away along the lap. Each finding
says how far the drawn face stands out on the drivable side.

- **Row 13 (the tracked ELYSIUM, p38's hull through p40):** red on a005e1d ("nothing found"), green on d617-a. `EV/runs/rows1213-*.tap`.
- **Row 12 (a synthetic two-pass track): still red, for two reasons:**
  - (1) **false positive:** one long light-hull triangle at p2's end has its centre at s 863. It touches p3's apron at s 893–895, 0 to 14 mm out, on the same
    pass 30 m on. The fix: a station per drawn vertex, and a floor on "standing out".
  - (2) it **misses** the crossing my prototype found there (p1/p2's hull run × p3's apron, s 284–316). I haven't explained that yet.
- Not run yet: the heap ceiling (`finalscene_heap`, 3 GB), the finalscene mutants, the touched set.

**Correction, my own (the test track):**
- My prototype gave each face the station of the nearest path sample in 3D. Under a wide road's edge that can be the other pass's, so its first "10
  crossings" were the upper pass's run touching its own plank.
- Fixed by searching only the mesh's own piece's samples, as the check does. The crossing that remains on that track is the LOWER pass's run cut by the
  upper apron: the apron-over-apron class, not the hull's depth.
- I never got a synthetic two-pass track that reproduces the upper hull cutting down through another pass's surface with no physics crossing.
- ELYSIUM's own counts were by mesh name and are unaffected.

## 5. Not done, and the state left

- No commit, no push, no install, no renders. Nothing was written to his tracks or AC folders.
- `t180-wt-a617` holds the WARN row's uncommitted work (`src/export/finalscene.js`, `test/export_finalscene.test.js`).
- The temporary base worktree I made (`t180-wt-a617base`) is removed. Its one change was my copied test file.
- His track copy read: `G:\Consonance-tools\scratch-A-d609\his\elysium.t180track`.
- **inferred:** adding his newer ELYSIUM as a public fixture, which the order's "33 → 0" test would need, publishes his track. Not done; his call.

SOURCES: the order D617; my D616 hand-back; the runs in EV.

---

# Resumed, 2026-11-03 (after the keeper's word: the hull stays as it is; the WARN row is the export half of the pass-clearance rule): COMMITTED

**t180 `235621c` on d617-a**, a single commit on top of C's `72fff66` (d623-c). Not pushed. §1 to §3 above are superseded: the hull's shape is unchanged, and nothing
from the clearance zone (`EV/wip/zone-wip.patch`) is in the commit. EV runs from this resume are in `EV/runs623/`, and the scripts in `EV/scripts/`.

## 6. What landed in 235621c (5 files)

- `src/export/finalscene.js`, kind `through` (a WARN): a drawn face (the skin, the hull's side) that passes through the road or apron of ANOTHER pass.
  - **The pass test:** another pass means every corner's station, walked from the face's own, is more than 25 m (PASS_M) along the road from the drivable face's.
  - **The stand-out:** measured over the drivable face itself (the drawn face clipped to its prism), not over its plane. Under THROUGH_MIN_M, 10 mm, a face only grazes and is not said.
- `src/export/fromwords.js`: the export calls C's `passClearance(path, segments, { apronM })` from `src/validate/passclear.js`. It calls the function and does not copy its maths.
  - It groups the stations into stretches (6 m along, 30 m on the other pass) and warns `clearance: …` once per stretch, at that stretch's worst.
  - It returns them as `clearance`. Nothing is refused.
- Tests: `export_finalscene` rows 12 to 15, and mutants F21 to F28 in `finalscene_mutation`. CHANGELOG: one Added entry, under C's.

## 7. Row 12's false positive and miss (the order's two faults)

- **False positive (s 863):** a long light-hull triangle's CENTRE station made it another pass's against p3's apron 30 m on, 0 to 14 mm out.
  - Fixed by each corner's own station plus the 10 mm floor, and by measuring the stand-out over the drivable face (the infinite plane read 179 mm for that 5 mm graze).
- **The miss was mine, not the check's.** My prototype's piece regex had lost its backslash, so it gave faces the 3D-nearest station.
  - Under a wide road edge that is the other pass's station, so p3's run touching its own plank read as a crossing.
  - With the regex fixed (`[0-9]`), the prototype and the check agree: only the s 863 false positive was ever there.

## 8. Checks

checked: `EV/runs623/t623.log` → the 64 touched files plus C's `test/passclear.test.js`, one at a time under one heavy-run slot, BelowNormal, hidden, on the rebased tree:
- **61 files: 800 tests, 799 pass, 0 fail, 1 todo (the existing one).** This includes the five not run before (`export-author` (test and app), `overwrite`, `share-install`,
  `sharedpath`, `shell-dist`), `finalscene_heap` (ELYSIUM under the 3 GB heap: D614's bar) and `export_finalscene` (then 14/14).
- **4 files red, and they are red on C's 72fff66 without my change:**

| file | on d617-a | on clean 72fff66 (control) |
|---|---|---|
| `app/test/export-isolated.test.js` | 5/8 | 5/8, same rows 1, 2, 4b |
| `app/test/export-isolated-page.test.js` | 0/3 | 0/3 |
| `app/test/mutation.test.js` | 24/108 | 24/108; its control fails on aclook, preview, look and render_proof |
| `app/test/export-isolated-mutation.test.js` | 12/13 | not run on the control |

checked: `EV/runs623/export-isolated.tap` (the control: an export's bytes are no longer b6969da's, `a5eef6d3…` expected, `c41cdb11…` actual), `EV/runs623/ctl.log`.
- inferred: `export-isolated-mutation`'s one failure is its control, which fails on the same three byte rows (its message names them). **These are C's to answer.** The byte pin and the preview tests all move with 72fff66.

checked: `EV/runs623/final.log` → `export_finalscene` **15/15**; `finalscene_mutation` **34/34: applied 32 / caught 32 / NOT APPLIED 0** (F1 to F20, F21 to F28, W1 to W4, plus the two controls).

## 9. Correction, my own: four of my mutants were not caught on the first harness run

checked: `EV/runs623/finalscene_mutation.first.tap` → 30/34. F22, F23, F24 and F26 were NOT CAUGHT. The harness had never been run on them before this resume (§4 of the stop listed it as not run).
- **F23 (THROUGH_MIN_M 2):** row 13 read `b.sceneCheck` from the export, and the export loads the real `finalscene.js`, not the mutant's copy (FINALSCENE_FILE reaches only rows that call the check themselves).
  - Fixed: row 13 now calls the check under test on the welded scene.
- **F22 (centre station alone), F24 (PASS_M 1), F26 (stand-out over the whole plane):** row 12 had no case where these choices change the answer.
  - New **row 15**, three hand-made faces on the two passes, each beside a control that IS said:
    - a 120 m face with two corners on its own pass's road;
    - a face 4 mm out over the road face it crosses and 50 mm over that face's plane further on;
    - a road face filed under the piece before (its station 15 m back).
  - checked: `EV/runs623/mut4.tap` → all four caught; then the full run in §8.

## 10. Cost (one run each on a busy machine: single readings, not medians)

checked: `EV/runs623/cost623.txt` (`EV/scripts/cost623.js` → `cost617.js`, node, his copies under G:\Consonance-tools\scratch-A-d609\his, read only, and the tracked fixture). Every one: **refuse 0**.

| track | export | check, d617-a | check, 0.4.38 | passClearance | through | clearance |
|---|---|---|---|---|---|---|
| ELYSIUM (his) | 74.7 s | 14.07 / 15.55 s | 12.02 / 13.34 s | 2.51 / 2.53 s | 2 (p38 847 mm, p40 517 mm) | 2 |
| CRAZY TEST | 36.7 s | 7.16 / 7.30 | 5.77 / 5.60 | 0.85 / 0.84 | 0 | 1 |
| TEST 10 | 19.4 s | 3.91 / 3.91 | 3.27 / 3.34 | 0.62 / 0.59 | 1 (p5) | 4 |
| fixture 10-22 | 85.0 s | 14.52 / 14.18 | 12.36 / 11.70 | 2.61 / 2.50 | 2 | 2 |

- inferred: on ELYSIUM the warning adds about 2.1 s (the `through` row) plus 2.5 s (C's rule) to a 75 s export, so about 6%. The process held 5.5 GB rss. The heap bar is row 1 of `finalscene_heap`, green in §8.

## 11. State left

- d617-a = `235621c` (one commit on `72fff66`), worktree `t180-wt-a617` clean. My copy of C's uncommitted file is gone; the commit uses C's committed one.
  - C's copy differed from 72fff66's: the seam rule, `clip` kept per station, and the same-pass reach. So I re-ran everything on the rebased tree; nothing from the earlier run is carried.
- Temporary worktree `t180-wt-a617c` (the control) is removed. None of my processes are running. Nothing was written to his tracks or AC folders. No push, no install.
- Memory was ≥38.8 GB free throughout (the runner's floor was 8 GB, and it never stopped).

SOURCES (resume): the order of 2026-11-03 05:24Z; EV/runs623/*; EV/scripts/*; git log/show on t180 d617-a and 72fff66.

## §12. Rebased onto C's 9dac829, 2026-11-03

- t180 d617-a is now **d3cf1ee** (parent 9dac829), one commit; it replaces 235621c. Not pushed.
  checked: `git log -2 --format="%h %p %s"` → d3cf1ee 9dac829 …; 9dac829 72fff66 …
- The rebase was clean: C's commit and mine share no file, and my patch is byte-identical.
  checked: `diff <(git diff 72fff66 235621c) <(git diff 9dac829 d3cf1ee)` → no output
  checked: `git diff --quiet fcf70e3 9dac829` → same tree, as the order said
- One slot, hidden, BelowNormal, concurrency 1, acs.exe checked first (run623.js):
  - test/export_finalscene.test.js: 15/15 pass, 0 fail, 132 s
  - test/finalscene_mutation.test.js: 34/34 pass, 423 s; **applied 32 / caught 32 / NOT APPLIED 0** (the 2 other rows are the controls)
  checked: `_evidence/runs9dac/r9dac.log`; `grep -c "applied, and caught"` on `_evidence/runs9dac/finalscene_mutation.tap` → 32; `grep -c "NOT APPLIED"` → 0
- Lowest free memory 38.1 GB; the 8 GB stop never fired. heavy-run warned C:\ has 46.3 GB free (under its 50 GB line); I did not run the janitor (not ordered).
- The four app files were not re-run here; they are C's, reported green on 9dac829, not checked by me.
