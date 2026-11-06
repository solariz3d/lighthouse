# L142: three things he found on a523589. Find the cause first, show him, then build. Librarian, on L, 2026-11-06 08:3x

**His words:** brief `briefs/t180_second_bank.md`, entry 2026-11-06 08:28Z (verbatim, three pictures and two saves beside it).
**Base:** t180 `l141-cheap-probe` a523589, installed on L (exe sha256 545cd4ba…). Same road bytes as fb5b91c (B's hand-back, `p-l141-B_2026-11-06.md`, samebuild table).

## The three items
1. **The ramp at the red circle** (`t180_testturn2_ramp_2026-11-06.png`, save `t180_saves_2026-11-06/eq-testturn2.t180track`). p3 is a straight
   405.66 m piece that banks back from −80° to 0. He sees a "subtle ramp" where the road comes back from 80°.
   Open question, to answer from the built road and not from the picture: is the centreline or an edge lifting in a way that isn't just a
   31 m road rolling (e.g. a kink at the p2→p3 joint, a roll-rate jump, a frame flip)? Or is it the true shape of an 80° roll unwinding over
   ~225 m, which then becomes a design call for him?
2. **The extra turn starts too late** (`t180_testturn1_start_2026-11-06.png`, not saved). It's a 1,000 m +90° corner with an extra turn, and
   the bend begins after the handle cluster. His file name says "half way". His message says "where the green mark is labelled", which is the
   piece start. Measure where the extra's curvature actually begins against the 0.5 default (`EXTRA_FROM_SHARE`) and the handle (`EXTRA_AT`
   turn 0.89). If it starts at 0.5 by data but looks later, say why: the quintic's slow start, or the corner's own ramp.
3. **Order matters** (`t180_testbank2_order_2026-11-06.png`, save `eq-testbank2.t180track`). The extra bank only worked when the first bank
   was set BEFORE the extra turn was added. Reproduce both orders through the panel and say what differs.

## Packet (split, disjoint)
- **B (core):** item 1. Headless build of eq-testturn2 on a523589. Report, sample by sample over p2's last 300 m and all of p3:
  - roll, roll rate, roll acceleration against BANK_BAR;
  - centreline z;
  - both edges' z.
  Name the cause or rule out a defect. No code change.
- **C (panel):** items 2 and 3, through the fake-DOM mount (the L141 bench's).
  - Item 2: rebuild his picture-2 piece and give the s where the extra turn's curvature leaves zero, and where it reaches 10% and 50% of its
    change.
  - Item 3: run both orders, diff the resulting `changes` and the built road. Renders of each (`app/test/soundrender.js`).
  - No code change.
- **E:** read B's and C's findings against the registration bar (`loop/l139_registration_2026-11-05.md` 9′) and say which item is a defect and
  which is a design call. Nothing is built before he has seen it.

## Then
- The librarian builds one page for him: his pictures beside the measured cause, plus, for item 2, the options drawn on his piece (start at
  half, start at the piece start / green mark, or the handle sets the start). He picks. Then a build lap.
- Rules: heavy-run lock at 4096; no install; no AC launch; commit by named paths.

NEXT: chair dispatch B (item 1) and C (items 2, 3) now; E reads when both ring; librarian collates and builds his page
