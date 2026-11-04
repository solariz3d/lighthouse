# D626: reversal joints. PARKED (state)

Seat: pane E (machine D), sibling-07b8a48f. Parked at the chair's 07:02 order ("PARK D626 … No T-180 work until D627 is collated and he has ruled. 0.4.39 stays held").

## 1. Where it is

- **Branch tip:** t180 `d624-e` at `7e5de8e` ("WIP: the bank's corners are rounded within each piece…"), on top of `4e6398c` (D624). Not pushed, no tag, no install.
  checked: `git -C C:/Users/nname/Desktop/worktrees/t180-e624 log -1 --format=%H` → `7e5de8e6e26bebb53cbb62428e8735a0e72ca91b`
- **Worktree:** `C:\Users\nname\Desktop\worktrees\t180-e624` (clean after the commit). Comparison trees: `t180-e624-base` (a005e1d, 0.4.38), `t180-e624-d624` (4e6398c).
- **Runs:** both killed at the park; my lock in `C:\Consonance\data\heavy-run.lock` removed after checking its pid was dead (twice: pids 49636 and 17648, both mine, seat a2122153).

## 2. What the WIP does (src/core/adapter.js, bankPlan and toSegments)

The cause of the joint bumps, two parts:
1. **ramp-end corners.** Each bank ramp starts and ends its roll over a 10–20 m rounding, so the roll's ACCELERATION peaked wherever a bank starts, stops, turns back or changes rate; on his ribbon up to 0.0585 °/m² (7.04× the 3 g bar at a wheel 10 m out at 170 m/s).
2. **the 2 m segment ease.** `src/geom/path.js` rolls each 2 m segment by a smoothstep, bringing the roll rate to rest at every segment end (a steady 0.36 °/m built as 0.225–0.495).

The fix, as committed:
- the bank plan rounds every corner over the bar with a quintic (value, rate, acceleration matched at both ends), grown until under the bar (≤ 500 m), **never across a pin**: pins are the joints AND the bank's own turning points inside a piece (rate sign flip, or the middle of a flat top);
- a corner that reaches several pins rounds each pin's sides; a corner inside a piece is first tried covering its whole zone;
- at every pin a window starts from at most the bar's acceleration (rate 0 at a turning point); a window that leaves the range of the bank it replaces by more than 0.1° is never used ("wild"), and two windows that cannot merge without overshooting are both dropped;
- road segments carry `rollRate0/1` so path.js uses its cubic Hermite (no 2 m ripple);
- the D624 roll carry stays as ruled.

## 3. Tests (all mine, new this lap unless marked AMENDED)

- `test/core_bank_corners.test.js` rows 1–10 (rows 7–10 added today: joints exact; an edit moves no bank past its two neighbours; turning points kept; no overshoot). The floor (a point may be held to more than the bar where its stretch between kept points cannot meet it) is counted per stretch between joints and turning points.
  checked: `node --test test/core_bank_corners.test.js` (before the commit) → 10 pass, 0 fail
- `test/core_joint_feel.test.js` (joint by joint, his ribbon and ELYSIUM: no step in what the centre feels, roll under the bar, no dip to zero, no 2 m ripple) and `test/core_roll_carry.test.js`: 7 pass, 0 fail. core_joint_feel was red on a005e1d (ribbon 10 of 11 joints, ELYSIUM 13 of 43; measured before the summary).
- Red-before seen today: row 2 without the zone fix (0.00954 °/m² at s 1320); rows 2 and 10 without the two guards (the dip case 0.0912; ELYSIUM p9 built -0.11° on a level piece); row 9 on the unpinned plan (a 5° bump built as 0.000°).
- **Mutation harness** `test/core_bank_corners_mutation.test.js`: **applied 13 / caught 13 / NOT APPLIED 0**, control green (`evidence/runs/mut.txt`).
- AMENDED (uncommitted before today, now in the WIP): `test/core_roll_carry.test.js` rows 2 and 4, `test/core_sculpt.test.js` spans from `AD.bankPlan` keys; reasons in the files.
- CHANGELOG entry "The bank no longer kinks…" rewritten to the final behaviour.

## 4. NOT done: the full shell-making run (the chair's rule 1, 06:42)

- Listed: every file with `createCoreShell` (`grep -rlE createCoreShell test app/test` → 72) joined with my touched set (121) → **159 files** (`evidence/runs/all-files.txt`); 155 at concurrency 4, then the 4 frame-timing files at concurrency 1 (`evidence/scripts/all.sh`).
- My hand-picked touched set had missed **38** of the 72 shell-making files.
- Killed at the park. Partial: the touched run reported 38 files with 0 `not ok`; the shell run 14 files with 0 `not ok` (`evidence/runs/*-partial.tap`). inferred: nothing about the other files; no verdict.
- Expected re-pins (inferred, not seen): the ELYSIUM AI-line pin, seals and export pins, since the built bank changes wherever a corner was over the bar.

## 5. Measured so far (final plan, `evidence/measures/`)

| track | worst vs bar-or-floor, base → fix | joints keeping their bank | turning points kept |
|---|---|---|---|
| his ribbon | 7.04× → 0.99× | 11 / 11 | (none) |
| ELYSIUM NEW (his save) | 1.40× → 1.31× (at p38's kept bump) | 45 / 45 | 2 / 2 |
| TEST 10 (his save) | 1.97× → 1.47× | 22 / 22 | 7 / 7 |
| CRAZY TEST | 0.04× → 0.04× | 12 / 12 | (none) |
| ELYSIUM fixture | 1.02× → 0.94× | 43 / 43 | (none) |

checked: `node peak.js <tree> <save>`, `node extrema.js …`, `node reach.js …` (scripts in `evidence/scripts/`; peak.js holds a point to the piece's floor, not the per-stretch one).

- **Felt at the joints (joints.js, wheel 10 m out):** ribbon worst jerk vs mid-piece 680× → 2.6×; ELYSIUM fixture: the fix's joint jerk is lower at 31 joints, the same at 12, higher at 0; largest 1.12e-2 → 1.35e-3 (`jerk-summary.txt`, `j-final-*.txt`). Its "reads like mid-piece" count: ribbon 1 → 4 of 11; the rest flag only the wheel's jerk, within 2.6× of mid-piece.
- **Corkscrew roll through the joints:** 0.01 °/m at the joint (base) → 0.33–0.36 (`plots/final-bankplot-ribbon.txt`).
- **The trade (the chair's ADDENDUM):** a piece's own end value moves **0** (all five tracks). An edit (+1° mid knot) moves at most its two neighbours: ≤ 0.0042° on ELYSIUM, 0.22° once on TEST 10 (p10 → p11) (`neighbour.txt`). The largest, ELYSIUM p26 → p27 by **3.0°**, is D624's carry: the same on 4e6398c, none on a005e1d.
- **What pinning costs:** where a stretch is too short, or a fitted track rolls hard from rest at a joint (TEST 10 p21: 0.68 °/m within 70 m of a level joint), the bank rolls as gently as that stretch allows. The earlier centred version met the bar there by moving joints up to 8.56°.
- **Turn and climb (kh/kv):** not carried through joints; it would move the route downstream and break lap closure (a trade to report, not decided).
- **Mesh at joints:** segment spacing uniform per piece; apron seams in his installed kn5: 48 shared pairs, 0 near-but-apart (measured before the summary).
- **Renders** in the scratch folder are of the earlier centred version and were NOT copied as evidence; they need redoing on the final plan.

## 6. Corrections (mine)

- All this lap, until 07:33, I checked for timing locks in `C:\Users\nname\Desktop\lighthouse\heavy-run*.lock` instead of `C:\Consonance\data\heavy-run*.lock`, which my own memory names. None of today's checks before a run could have seen a timing session. inferred: whether one was spoiled is unknown; whoever ran timing on machine D between ~11:00Z and 13:33Z may want to check its windows.
- The pinned plan, before today's fixes, erased bumps on his own saves (TEST 10 lost 4 of 7 extremes, ELYSIUM NEW 1 of 2, by ~2°). That would have shipped had the extremes not been measured.
- I first wrote row 8 as "no other piece moves", which the measure refuted (neighbours move slightly); rewritten as "no bank past its two neighbours".

## 7. Next (when D626 resumes)

1. Run `evidence/scripts/all.sh` (159 files, one slot, BelowNormal) to the end; amend re-pins by name with reasons.
2. Redo the renders at the circled joint on the final plan.
3. Squash or reword the WIP commit into plain commits; hand back the joint-by-joint measure, the cause and the fix.

NEXT: librarian file the park when this lands; E writes the D627 part 4b question set next.

---

## §resume (2026-11-03 11:05–13:30 local, at the chair's 11:05 order: the T-180 hold lifted)

### R1. The new tip

- **t180 `d624-e` at `0692d11`** ("Rounded bank corners keep a curve's lean, keep long drags fast, and re-pin what they change on purpose") on `7e5de8e` (the WIP) on `4e6398c`. **Not pushed.**
  checked: `git -C …/t180-e624 log -2 --format="%h %s"` → `0692d11 …`, `7e5de8e WIP: …`
- **For P's re-land:** the WIP message still says "WIP", so squash the two into one plain commit when landing (the scan below covers both).
- **Scans:** credential prefixes 0; "keeper" 0; private terms 0 of 72; room words 0 in what I added. The lap ids I first wrote in test comments were reworded, and the fixture record was renamed `manifest.bankcorners.json`.
  checked: `termscan.js` over the changed files → `terms 72, hits 0`; the room-word grep over the added lines → 0

### R2. The full shell-making run (rule 1), and what it found

**Run 1** (on 7e5de8e, 159 files: 155 at concurrency 4, then the 4 frame-timing files alone; `evidence/resume/runs/all-run1.log`):
- main pass: 2,050 tests, 1,954 pass, **83 fail**, 13 skipped;
- timing pass: 27 tests, 22 pass, 0 fail.

What the 83 were, and what I did:
1. **A REAL REGRESSION: 56 rows of `core_close_banks_lap`.** A Close-banked curve lost its lean at its exit (32.5° built at 15.1°). The rounding, centred at the bank's corner near the curve's end, re-laid the curve's last few hundred metres.
   - Fix: **where the road turns (|κh| > 1/600, D443's curved station), a rounding may move the bank by at most 4°.** A wider window is not used, and the corner keeps more of the document's own roll there.
   - The cap is 4°, not 5°: at 5° one row missed by 0.0 (33.4° against a bar of 33.4°), because the lean is read off the built path and the cap is on the bank. A degree is kept for that.
   - New row 11 in `core_bank_corners` (ELYSIUM: the bank moves at most 4° where the road turns) is red without the cap (4.92° at s 6404). New mutant **C14** catches it.
2. **Byte pins that moved only because every segment carried the new rate fields.** Fixed at the source: `rollRate0/1` are written only where the roll moves. With both rates 0 the Hermite IS the smoothstep, so a segment that doesn't roll is built and serialised exactly as before. That restored, byte for byte:
   - `core_jump` row 8;
   - `core_chord` cases 0 and 3;
   - seven of the nine D190 fixtures.
3. **Pins re-pinned on purpose, by name, each with its reason in the file:**
   - `core_chord` cases 1 and 2 (they bank faster than the bar);
   - the ELYSIUM AI line: not one of its 4,600 points moves (checked point for point, largest move 0.0000 m); its camber, normal and sides move where the bank is re-laid;
   - `core_adapter`'s smoothstep-bound row: read against the planned bank, 0.003 × the bound; against the document it is 2.55×, by design;
   - `core_cup` row 5: a rolling segment may carry the two rate keys;
   - the D190 fixtures F3 and F5, with a new record `test/fixtures/manifest.bankcorners.json`, "before" = the seal's. Its measure: no centre-line position moves, no segment changes in anything but its roll, roll up to 3.28° (F3) and 2.11° (F5). Rows 5a and 5b, and a new record row.
4. **Locality rows: the edit's effect reaches further. Amended by name under the 2026-11-02 ruling ("his ride wins over the sealed locality"). FOR HIS LOOK, because one is a tool he chose to be sharp:**
   - **zonegrab row 14m (Sharp grab, 30 m):** the centre line keeps the 30 m (29 m measured). On this 60°-banked road the grab also changes the bank, and that corner is rounded, so **the rims move up to 126 mm out to 53.5 m from the press** (a roll of at most 0.45°).
   - `core_sculpt_modes` value brush: bit for bit past the brushed piece; between W⁺ and the piece's end the roll moves by under 0.0001°.
   - `sculpt-drag-model` row 2: the drag window (what changed) is the brushed piece, not just the brush. It stays inside the piece, drawn from 25 chords, and the release still equals a fresh build.
5. **Mutation harnesses:**
   - their controls failed only because the rows above failed;
   - **M26 and KE6-2** (the cup and xsec harnesses, not mine) and **R9** and **C10** (mine) were NOT APPLIED: their anchored lines changed shape. Each is re-anchored on the line as it stands, the same mutation, noted in the file, and each is caught.

**Run 2** (on the fixed tree before the final commit, the same 159 files; `runs/all.log`):
- main pass: **2,045 tests, 2,030 pass, 2 fail**: `core_cup` row 5 and its harness's control (one cause, item 3 above). Since amended: `core_cup` 55/55.
- timing pass, with drag-frame moved into it (it is a frame-timing file): 35 tests, 28 pass, 2 fail, drag-frame rows 4 and 8. See R3.

**After the last code change** (the drag fast paths, R3), run again: the four harnesses plus core_cup → **200 tests, 200 pass**, 137 mutants applied and caught, the four controls green (`runs/last.log`). My corner harness: **applied 14 / caught 14 / NOT APPLIED 0** (C1–C14).
  checked: `grep -cE "^ok [0-9]+ - mutant C[0-9]+" last.tap` → 14 (scratch `d626/last.tap`; the log is `runs/last.log`)
  inferred: the full 159-file run was not repeated after the fast paths. They change no value (the 142 pinned and bank rows ran green after them), and only the five files above, plus the re-pinned ones, were re-run.

### R3. A second real regression, found by the solo timing run: long drags

- drag-frame row 4 (dragging a **20,000 m turn**) went from **p95 8–9 ms and 33–36 rebuilds a second (base, twice) to 97–104 ms and 6–7** (fix, twice) (`runs/drag.log`).
- Cause, measured (`scripts/prof.js`): a full build of a 20 km piece took 390 ms against the base's 207. `bankPlan` re-read the bank of a piece that never changes (90 ms), because its cache was keyed on the piece object and a drag makes a new one each step. The new roll rates were read for every segment end (about 90 ms).
- Fix:
  - the bank samples are kept by the BANK CHANNEL (its array, knots and length), and a constant bank is filled without reading;
  - roll rates are read only for a piece whose roll can move.
  - After: a full build 227 ms (base 207), `bankPlan` 0.4 ms.
- Re-timed alone, fix / base / fix (`runs/drag2.log`):
  - **row 4: 8 ms, 32.0 a second (fix); 8 ms, 36.0 (base); 8 ms, 32.7 (fix)**;
  - rows 1–3, 5–7 within their bars.
  - **Row 8** (a stretched edged piece, a known red on main): fix 7.1 ms against its 6.9 ms bar. The base passed it at 6.6 ms this time and failed it twice in run 1's timing. inferred: both sit at that bar; this run does not separate them.
  - Row 1 failed once on the fix with "the handle was not held" (page automation, not timing) and passed in the other fix run.

### R4. core_joint_feel, joint by joint, against mid-piece

- `test/core_joint_feel.test.js`: **green on his ribbon (as the panel lays his bank) and on the ELYSIUM fixture** (in run 2's main pass, and after; checked: `runs/all.log` lists no core_joint_feel failure; the file ran green with the bank files after the fast paths, 142/142). It was red on a005e1d: ribbon 10 of 11 joints, ELYSIUM 13 of 43 (§3).
- His actual save, read by `joints.js`, the wheel 10 m out (`measures/jerk-final2.txt`, `j-final2-*.txt`):

| track | joints | worst jerk at a joint / mid-piece | largest jerk at a joint |
|---|---|---|---|
| ribbon, base | 11 | 680× | 1.53e-2 |
| **ribbon, fix** | 11 | **2.6×** | **2.39e-4** |
| ELYSIUM fixture, base | 43 | 842× | 1.12e-2 |
| **ELYSIUM fixture, fix** | 43 | 842× (a joint inside flat road, its mid-piece ~0) | **1.35e-3** |

- The centre feels no step at any joint on either track (`centre U/L ok` in every joints.js row), and the turn and climb are not carried through joints (§5, a trade).

### R5. The trade he asked for (`measures/final2-*`)

- **A piece's own end value moves 0:** at every joint of five tracks (ribbon 11, ELYSIUM NEW 45, TEST 10 22, CRAZY TEST 12, the ELYSIUM fixture 43), the built bank equals the piece's end, worst 0.000000°.
- **One piece's edit** (its middle bank knot +1°) moves no bank past its two neighbours on any track. How much a neighbour moves:
  - ELYSIUM: at most 0.004°;
  - TEST 10: at most 0.22° (p10 → p11);
  - **3.0° on ELYSIUM p26 → p27, D624's carry** (the same on 4e6398c, 0 on a005e1d).
- **What the fix leaves:**
  - his ribbon: worst 0.99× the bar, 0 segment ends over it (base 7.04×);
  - ELYSIUM NEW: 1.31× (base 1.40×) at p38's kept bump;
  - TEST 10: **1.97×, the same as the base**. With the curve cap, a fitted curve's own fast roll is left as laid where the road turns.
  - Every turning point of the bank is kept (TEST 10 7/7, ELYSIUM NEW 2/2).

### R6. The renders for the librarian's page (`evidence/resume/renders/`)

- His ribbon save, behind joints 1750, 3950 and 4300, and from the side, base and fix, the same cameras (`final2-base-*`, `final2-fix-*`).
- **At 4300** the base's right edge creases at the joint (around x 880–930, y 450–470); the fix runs through as one curve. At 3950 the base's left edge kinks into the joint (x 650–700, y 350–390), and the fix does not.
- inferred: the joint he circled is 3950 or 1750 (§5 of the park; his lap time maps to s 6050 in both r2 replays, so I could not pin it down).

### R7. Corrections (mine)

- My pinned-joint plan, as parked, re-laid Close-banked curves (R2 item 1) and slowed long drags twelvefold (R3). Neither showed in any touched set; the full shell-making run and the solo timing run found them. That is the rule of 06:42, working.
- I first re-pinned the jump and two chord cases for new rate fields. That was the wrong layer: writing the fields only where the roll moves left them untouched, and I reverted those re-pins.

NEXT: librarian checks 0692d11 and the renders when this lands; P re-lands 0.4.39 with d624-e at 0692d11 (squash the WIP), then it is installed on the desktop for him to drive before any release.
