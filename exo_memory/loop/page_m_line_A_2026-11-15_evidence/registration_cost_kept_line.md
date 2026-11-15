# The cost: the line kept between plans, a cold line spread over ticks by a count. Registered before code (2026-11-15 ~11:00 local, seat A)

Ruling: `exo_memory/loop/packet_m_line_A_2026-11-15.md`, "RULED at the ring for the side" (git-blob 4742072e), item 3.

## What is built
- **The line's state is kept on the chaser** between plans: per path point its place on the string, its normal, its bounds and its offset.
- **A warm plan** (the chaser had a line): the new string's samples take their first offsets from the line it had (the nearest point of the
  old line within 1 m, projected on the sample's normal and clamped to its bounds), then a fixed count of passes (40) in the plan.
- **A cold plan** (no line before, or the first plan): the body follows the string (offsets zero), and the line's passes are spread over the
  ticks that follow, a fixed count a tick (100), never by the clock, until 600 are done or a pass moves nothing more than 1 mm; then the line is
  put on the path at once and its corner rooms read again.
- The per-tick passes run in `root_line_tick`, called once a tick for a body on the root.

## The gate and the checks (by name, before the run)
- **The gate: no plan_to over 1,000 us, and no tick's `root_line_tick` over 1,000 us**, mean and largest printed (the cost row reads both).
- The side row stays green at replans; no bend slower than 4b03985's (or the one law's, if it lands first) by more than 5 per cent; route
  contacts no worse than 31 and 6; off means off (md5 fa938de4..., the kept runs); and **a run with the root on replays the same twice** (a new
  row: the 22 degree bend walked twice, the same exit tick and the same lowest to the bit).
- **What would show the lever wrong:** a warm line that differs from a cold one made to the end by more than the room (0.2 m) at any point, on
  the three bends at their second plan (printed).
