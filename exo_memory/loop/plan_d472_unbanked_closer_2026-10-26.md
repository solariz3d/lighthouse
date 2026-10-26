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
