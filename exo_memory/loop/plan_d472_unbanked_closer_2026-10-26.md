# D472: the last part of TEST 10's loop is not banked. Librarian, 2026-10-26

The keeper, 10:18: "the bump error is fixed, but i noticed the last part of the closed loop isnt banked, could be benign bug. As long as the bug that caused the bump error is fixed in the gen system we are good"

D471 closes on his drive: the bump is gone. This lap is the bank.

## What is on disk, checked by the librarian at 10:20

His save `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-TEST 10.t180track` (sha256 0c9ca763…5dfd, D471's smoothed save), read with node, per piece: max |phi| (bank) and the rough turn (mean kh × length, a sketch, not a measurement):

    p1–p17   banked where they turn (p2–p8 30–60°, p11–p17 10°); they carry the 'er' edge channel
    p18 2000 m  ~87° turn   bank 0     p19 2000 m  ~87° turn   bank 0
    p20  150 m  straight    bank 0
    p21  919 m  ~164° turn  bank 0     (kh up to 6.62e-3 /m, a ~151 m radius)
    p22  746 m  ~straight   bank 0
    p23  919 m  ~164° turn  bank 0     (the other way)

- p21–p23 have fractional knot spacing (19.978…, 19.631…), as a generated closer does. p18–p20 do not. inferred: p21–p23 are the closer, and p18–p20 are his own pieces or an earlier closer. Not checked which.
- None of p18–p23 has a non-zero phi, and none carries 'er'. So the "last part" is flat in the document itself, not only in the export.
- inferred: Finish to start banks a curved closer (D434, 0.75 of the balance bank), and plain Close may not. The save was last closed before 2026-10-22 09:25 (its pre-D471 write time), on whatever builder he had then.

## The plan: one part, pane C (check it, read-only on his files)

C has TEST 10's geometry warm from D471.

1. **Which tool laid p18–p23, and when.** Read the undo history (`eq-TEST 10.t180undo`, read only) and the backup save (`eq-TEST 10.t180track.before-d471`). Did the bank exist once and get zeroed by a later step (Smooth ramps in D471, a re-close, D467's bend bar)? Or were they laid flat?
2. **What 0.4.21 does now.** On a COPY of the save, in the v0.4.21 tree (`C:\Users\nname\Downloads\t180-wt-c471` is there):
   - (a) re-close with Build ▸ Close the loop;
   - (b) re-close with Finish to start;
   - report each closer's bank per piece.
3. **The verdict, one of three:**
   - **benign:** an old closer, and 0.4.21's Finish banks it. Then the fix is to re-lay his closer once, which is a route change on his track.
   - **a generator bug:** 0.4.21 still lays a curved closer flat on the path a user takes. Name the function and the file, with a red test row. No fix yet; the fix is its own order.
   - **by design:** a closer that is flat on purpose, for example because the bank plan refused it. Name the refusal and its reason.
4. **Hand-back:** the per-piece bank table for (1) and (2), the verdict, and the commands.

**Nothing is written to his tracks folder or AC. No install.** Tier: check it. It is read-only and its result is visible in the next step.

NEXT: chair dispatch D472 to C now; librarian rules when C's hand-back is in.

## Ruling, 10:27: benign (C, d472-c d0152896, `p-d472-C_2026-10-26.md`, read whole)

- **The cause.** p21–p23 were laid flat by Finish to start in undo step past[22], on 2026-10-22 before 09:25 local. That was a build without D434 (b782064, 20:42 the same day), when Finish did not bank yet. No bank was ever set on these pieces and then zeroed (E-hist.out, E-eq.out).
- **0.4.21 does it right.** Its Finish to start re-lays the same closer and banks p21/p23 at 63.6° (E-b.out). bankLap on the closed save as it stands gives the same bank, with nothing moved (E-c.out).
- **p18/p19 are flat by design.** They are a vertical loop: least road-up −1.000, against the level rule cos 30° at finish.js:488.
- **The gap C found, which is real.** On a lap that is already closed, nothing the user can press banks it: Close is disabled once closed (buildmenu.js:45). Anyone whose closer was laid before 0.4.19 has the keeper's flat end, and no button fixes it.
- **Noted, not ruled.** On the opened lap, the one-press Close picks a 1,147 m bend of p19–p20 over Finish's 2,584 m of new road that moves nothing (E-a.out, closejob.js order "new road only when no bend proves"). This is the same question as the keep-the-bend redesign still open with the keeper. It is held for that answer.

## D473, from this ruling: two parts, in parallel

**Part 1, pane A (prove it: writes his save and his AC track): bank his TEST 10 as it stands.**
- Builder and AC closed check.
- Back up `eq-TEST 10.t180track` beside itself as `.before-d473`, with a sha256 compare against 0c9ca763.
- Run 0.4.21's own bankLap on it in the v0.4.21 tree (C's E-c.out path): nothing moves; p21/p23 → 63.61°, p20/p22 eased. Write the result as his save. The route must be unmoved: compare kh/kv per piece, and expect them byte-equal.
- Then page-export it as "TEST 10" over t180b_test_10, after a backup of the folder. FINS must pass, and zuv must be 0.
- Hand-back: the per-piece bank before and after, the hashes, the backups.

**Part 2, pane E (check it): a Track menu command that banks a lap that is already closed.**
- Wire the existing core bankLap (finish.js) to a Track ▸ "Bank the lap" item. It is enabled on a closed lap and does nothing to the route. Its status line says what it banked, and says plainly when a piece is held back by the level rule.
- One test row: a closed lap with a flat closer gets banked, and the route is unmoved.
- CHANGELOG line. Rides the next release batch. No "keeper" in any text.

## D473 collated, 10:58 (A 4cc51409; E f21c94a3 / t180 a4bfe52; both read whole)

- **Part 1, accepted.** Verified on disk at 10:32: t180b_test_10.kn5 49d81c91…0992; save b6f62b8a…1a89, byte-equal to C's bankLap; backup .before-d473 0c9ca763. The route is unmoved (kh/kv byte-equal per piece), zuv 0.
- **Part 2, accepted for the next batch.** Branch d473-e a4bfe52 on v0.4.21: 7 files, +111/−7. Red first (s.bankLap not a function), then 13/13. Touched files 1371/1387: one fail is E's own list (fixtures.js is a CLI), and the drag-frame flake also fails 1 in 4 on the untouched base. The added lines have 0 "keeper", which I checked on the diff myself.
- **One fold-in for the landing, ruled:** Bank the lap writes a pre-bank backup first, as Smooth ramps does. It changes every curve on the lap, and Undo only lasts the session. Two lines, modelled on smoothRamps.
- **For the release review, not a fix order yet:** a second press on a looped lap banks p3 again by up to 1.9° (E §4). A command that is not idempotent reads as a bug to a user. The reviewer says whether it is bankPlan's straight-beside-a-loop case, and whether it needs its own lap.
- **Release:** held. By the batch rule, d473-e rides with whatever the keeper's new original track turns up today.

## D474 ruled, 11:52 (C, d474-c 494cec16, `p-d474-review-C_2026-10-26.md`, read whole)

- **The review is accepted.** d473-e a4bfe52 is correct on closed-only, route unmoved, one undo step, and the level-held pieces named on E's lap. These are checked, not inferred: E-twice.out, E-press.out.
- **Finding 1, real, ruled a fix before the batch ships.** A second press re-banks a piece whose bank stays under ROLL_FREE (5°):
  - `bankLapRun`'s `flat` set (finish.js:486), with `bankPlan`'s absolute targets (:233) added onto the existing phi by `banked()` (:350–351);
  - on E's looped lap p3 goes 1.06 → 1.92 → 2.78 → 3.65°, and stops at press 5;
  - it needs a piece next to a pinned joint (a loop, a ramp, his own bank, a pit or tube piece).
  - A user who presses twice sees the lap change, which is a bug in a command that says the route does not move and implies "done".
- **Finding 2, wording, ruled in.** On TEST 10 the status line leaves out his loop p18/p19, which the level rule holds back from a ~52° bank. `info.level` filters by `curved` (stored kh against 1/600), and his loop peaks at 1.571e-3. It should name the flat pieces that are not level and have a non-zero plan bank.

## D477, the landing fixes for d473-e: pane E (prove it: src/core/finish.js is core maths)
1. **Idempotent.** A second Bank the lap changes nothing, on every lap. C's red row `core-bank-lap-twice.test.js` (in d474-c's evidence folder) turns green, unedited. A second row on TEST 10's shape (a loop beside banked pieces) stays idempotent. The fix belongs in the core, so that closejob's single press keeps its output byte-equal. Test that equality.
2. **Status words** name the level-held pieces by the plan-bank test, not `curved`. A row on a loop whose stored kh is under 1/600.
3. **Pre-bank backup** before the write, modelled on smoothRamps (ruled at the D473 collation).
4. The mutation harness covering finish.js, whole. The touched files' tests. 0 "keeper" in the added lines.

## D477 read, 13:04 (P, t180 d477-p 2451dfb on a4bfe52, `p-d477-P_2026-10-26.md`, read §0–§3)

- **Idempotent, proven.** The plan is relative to the bank the lap already carries, and the press finds its own earlier press again. C's row is green unedited, plus a TEST 10-shape row. Press 2 and press 3 return the same doc on every public lap and on both private fixtures.
- **The single press is byte-equal to a4bfe52 through Close's press** on TEST 10 and TEST TRACK 10 (7478b828…, 1171b887…).
- **The status words name p18 and p19.** The pre-bank copy is in, and a failed copy refuses. The finish.js harness: 59/59/0. Touched files: 361/0.
- **One question before I accept §1.3.** The relative plan treats any bank under ROLL_FREE (5°) on a piece as the press's own and brings the total to the plan. On a bend's seam wobble that is right, and P's reading is accepted. But **a small bank he laid on purpose** (say 3° on a straight, or 3° on a gentle curve) would be read the same way, and on a straight the plan is 0. So the press might **flatten his own bank**. a4bfe52 added on top and kept it.
- **Order to P (prove it):** one row with a closed lap where a straight carries a deliberate 3° bank and a gentle curve carries a deliberate 3° bank, both under ROLL_FREE. Bank the lap must keep each of his banks: on the straight, unchanged; on the curve, at least his 3°, never less. If the current code flattens them, that is red, and P fixes it without breaking idempotence or closejob's byte-equality.
  - The same lap is the one R3 needed (an upright piece carrying bank curvature at a plan edge). If the row also catches R3, R3 goes back in the list. If it doesn't, P says why.
- **The batch** (d473-e + d477-p) waits on that row.

## D477 ruled, 13:44 (P cf03658 on 2451dfb, §6 read whole): accepted for the batch

- **My question was right, and it is fixed.** Row 7 was red on 2451dfb (his 3° straight was flattened) and green on a4bfe52. It is now green on cf03658:
  - his roll adds 0;
  - his straight is byte-equal except one tail point (+0.62°, D468's C2 roll-off, against +1.28° on a4bfe52);
  - his curve goes 3.00 → 7.45°, never below 3°.
- **How it tells his bank from the press's:** by the joint pins, which the press never writes. A piece is his when its joint-pinned points carry bank.
  - P recorded the three forms that failed, so they are not tried again.
  - Idempotence holds, and Close's press is byte-equal on both private fixtures (7478b828…, 1171b887…).
  - Harness 59/59/0, touched 362/0.
- **§1.3, ruled: accepted.** A seam wobble under 0.2° on the bent TEST 10 is not a bank he laid, so bringing the total to the plan is right there. Close's own press is unchanged.
- **R3 stays out of the list,** with P's reason. It is live only where an upright piece carries bank curvature at a plan edge, which no public builder lays. The record of it is §3/§6.
- **For the release review**, the edges P names:
  - a piece of his between two of his curved pieces, at relaxed joints, has no joint pins and is read as the press's;
  - a bank of his leaning against its turn is replaced, as a4bfe52 did.
  Both are rare. Both get a line in the release notes' known-limits, not a fix now.
- **The batch:** d473-e a4bfe52 + d477-p (2451dfb, cf03658) ride the next T-180 release together, held for whatever the keeper's new original track turns up. **D477 CLOSED.**
