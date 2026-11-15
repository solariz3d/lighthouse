# The third try on the base cb9049c: the 45 degree read, the unshared throat, the cost gate. Registered before code (2026-11-15 ~09:45 local, seat A)

Ruling: `exo_memory/loop/packet_m_line_A_2026-11-15.md`, "RULED at the ring before a third try" (git-blob 7a82accd). Three things, no more.

## 1. The 45 degree read (done, no change): `r45.txt`
The body stops by the brake's reversal: sliding with its velocity pointing away from the aim (heading -86 swinging to -176 while the aim is
+44 to +20), the brake from tick 841 brings it to rest at tick 871 (`slide_brake` 2), and it creeps off the other way. It is 0.66 m off a line
whose bend there has a 0.84 m radius at the minimum room (0.20 m); the plan asks the creep speed. inferred: the contact that set the slide
is before the printed window; the line pinned through a narrow, sharp place asks a radius the body cannot hold.

## 2. The side by the unshared throat
The throats on the string within 25 m ahead (free width under 1.0 m), taken in order of narrowness (at most 3, one per 1 m of path): for each,
a search avoiding it; **the first whose avoiding search finds a way that does not pass it is the throat the two ways do not share**, and the
two lines are compared there as before. A throat both ways pass (the doorway at x -72) gives no way round and is skipped.

## 3. The cost under a quarter of a tick: which levers
Measured (`tp.txt`): of one line's 1,367 to 1,533 us, the 2 x 125 widths are 163 to 241 us; **the 600 relaxation passes are about 1,200 us.**
So: **(a) fewer passes:** over-relaxation (factor 1.8) with a stop when no offset moves more than 1 mm in a pass, at most 200 passes;
**(b) a horizon:** the line is made over the first 30 m of the path only and the rest stays the string (replanned every 0.5 s, the body
covers no more than 4.6 m between plans). Not spread over ticks and not warm-started (both would need state across plans; kept for later if
(a) and (b) do not reach it).

## Rows (the base's, plus the gate), red first on cb9049c
- **The cost row becomes a gate, by name** (ruling item 3): every plan_to no more than 1,000 us, mean and largest printed. Red on cb9049c
  (largest 4,976 us).
- **The side row** (registered before): at the 22 degree bend the open gap is crossed and the doorway at x -75 never neared, at replans.
  Red on cb9049c.
- The bends row, the room row, the routes row: unchanged; their figures printed beside the base's. **Not to get worse than the base by more
  than 5 per cent** on any bend's time (my registered bar for this try: fewer passes and a horizon must not cost the line its shape).
- Off means off as always.
