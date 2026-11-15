# M2b, the root for every kind: registered before code

Pane A on D, ledger D677, the packet's "M2b" section. Written ~19:2x local, after M2c (`3c57cf7`) and before any line of M2b.

## What the root reads, today (checked by reading `chase/chaser.cpp` `root_tick`, `root_plan_speed`, `root_aim_point`, `grip_point_speed`, `step`)
Only `Body` fields: `top` (with the run-up), `accel`, `brake`, `turn_slow`, `grip_mu`, `corner_feel`, `root_law`, and the path. **No line of
the root's path names a kind.** The body is made from the kind's row (`chase/archetype.cpp`, `Limits`) by `make_body`; every number but grip
already comes from that row. **Mass is not read** (the root's law is in accelerations: grip as a multiple of g, gain and braking in m/s²), so
no mass field is added; said here rather than added unread.

## The change
- **Grip into the kind's row:** `Limits::grip` (0 = the speed model's `grip_mu`, as today). Every row is 0, so **the hunter's numbers do not
  move**, nor any kind's.
- **The switch, kind by kind:** a speed-model field `root_kinds`, one bit per kind by its number in `chase::Kind` (Sprinter 2, Interceptor 4,
  Pack 8, Crawler 64, Dark 128; the hunter stays `root_law`'s, M1's switch, and bit 1 means the same). Every kind off by default (0).
  `apply_root(Body&, const SpeedModel&, Kind)` raises `root_law` and `corner_feel` on a body when its kind's bit is set; it is called where each
  body is made (`hunter_body`, `dark_body`, `add_lesser`, the climber's). It names a kind only as a bit's number; the root itself does not.

## Rows (red first where they can be; printed)
- **Off means off:** md5 `fa938de45995bd2d13b98ba28fae0c34` and D's kept runs, as on main.
- **The hunter unchanged:** with `root_law=1`, a fingerprint of every position and speed on the ten routes and of the four scripted bends'
  readings is the same after M2b as at `3c57cf7` (the value printed at `3c57cf7` first, then written into the row).
- **The sprinter on the root:** R1's law-bound row run with the sprinter's numbers (its acceleration, braking, standstill turn rate, grip);
  the ten routes walked by the sprinter on the root, as a report. Red first: before M2b no sprinter's body can be put on the root from a run.
- **A new kind is a row:** a test makes a kind from a `Limits` row of its own (no Kind of its own, no line of the root's files), puts it on
  the root and walks the ten routes; its sideways acceleration never above its own grip, and every route that body walks off the root it
  walks on it. The test's diff touches no root file.
- **The sprinter row** (`chase/tests/body_tests.cpp`, `a_sprinter_that_does_not_brake_for_corners…`): printed with the sprinter on the root in
  main's world. **Said before the run:** the row compares a sprinter with `corner_care` 0 against one with 1, and care is not a root input, so
  under the root its two arms are one body; the print shows that and moves no bar. The kit's world (`a-l210-merge`) is printed only if
  its merge onto this branch builds without a conflict in a file of mine; otherwise said and not forced.
- **R5, a report:** normal and brutal with every kind on the root (`root_law=1;root_kinds=206`), beside main's 58 and 2.
- **M2b is wrong if** a second kind on the root needs a line of code that names it.
