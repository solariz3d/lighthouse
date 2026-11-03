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
