# The slide's steering as one law: registered before code (2026-11-15 ~10:50 local, seat A)

Ruling: `exo_memory/loop/packet_m_line_A_2026-11-15.md`, "RULED at the ring for the side" (git-blob 4742072e), item 2.

## The law
While a body on the root slides (after a contact, until its heading meets its velocity within 3 degrees), its velocity changes each tick by
no more than `mu g dt`, straight along `(wanted - current)`, where `wanted = aim x the plan's speed` (zero when it is not going) and the part of
`(wanted - current)` pointing into the wall at its last contact is refused (removed). The speed is the new velocity's length; the slide is the
new velocity. The brake case (e040a87) and the turn at grip (3fb9f21) both go: braking is what this law does when the aim is behind, and
turning is what it does when the aim is to the side. At rest with the aim behind, the velocity grows straight toward the aim.

**Why one law and not the case (the ruling asks for a reason if the code keeps one):** none found. The least time to change a velocity by d
under an acceleration no larger than a is |d| / a, along d (the ruling's arithmetic); the case was an approximation of it.

## Checks, by name before the run
- **Check 2 and the brake row** as restated at 1851018 (the acceleration along wanted less current, no less than 0.9 of what grip allows, less
  the wall's part). Red at 1851018 on the tip's law: 54 of 118 and 15 of 15; the brake row 1 of 53 and none; from tick 773's state 58 of 90.
- **The grip falsifier, its measure restated by name (the bar unchanged, 1.001 of grip):** it measured the velocity's turn angle times its speed,
  a stand-in for the sideways acceleration. When a velocity passes through rest and points the other way, that stand-in reads several times grip
  at a speed under 0.05 m/s. It now reads what it stood for: `|velocity after - velocity before| x 240 / (mu g)` on a sliding tick with no new
  contact, no more than 1.001.
- Turned about by hand: 0, unchanged.
- Expected and may fail: the side row green; no bend slower than 4b03985's by more than 5 per cent; route contacts no worse than 31 and 6; off
  means off.
