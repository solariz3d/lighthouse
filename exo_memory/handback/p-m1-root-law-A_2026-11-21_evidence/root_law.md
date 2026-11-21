# The hunter's root law (M1), registered BEFORE code. Pane A, machine L, 2026-11-21. Game tree: dreamzone-3 at c2af9d9, branch `m1-root-law`.

Lap: `loop/packet_m1_root_law_A_2026-11-14.md`, with `loop/packet_m1_on_L_A_2026-11-21.md`. His decision stands (11-14 07:05, "i said plan and build the new system").
This page is written and committed before any game code is changed. Line numbers are `chase/chaser.cpp` at c2af9d9 (G1: the tree had no `chase/` change since 0efb3e4).

## The law, from path to acceleration (per simulation tick, dt = 1/240 s, plain float arithmetic with `det_sin`/`det_cos`/`det_atan2`, no physics library)
State of the hunter: position `pos`, flat velocity `vel` (m/s), and for the picture `heading` and `turn`. **Heading is the direction of `vel`** whenever the speed is at least `kRootVmin` = 1.0 m/s; below that the velocity direction is not defined, so the heading turns toward the aim at no more than the body's own `turn_slow`, and `vel` is put along it.

1. **Path to aim (unchanged from the old stepper):** the next path point with the seeded sway, as `c.leg` selects it (`:272-330`). The planner's `want` speed (what the stretch allows, braking for the end of the path, a link foot, or a corner) is unchanged in its form (`:331-342`); **only the corner term is replaced** (rule 5).
2. **Forward:** `speed` moves toward `want` by at most `accel*dt` up and `brake*dt` down, as the old stepper's speed does (`:374-376`). On a straight the two models therefore agree.
3. **Sideways:** the angle `err` from the velocity direction to the aim asks for a turn rate `err / 0.2 s` (`kRootTau`); the sideways acceleration that makes it is `a_s = speed * turn_rate`, **clamped to +-grip_mu*g** (g = 9.81 m/s^2; `grip_mu` is `Body::grip_mu`, default 1.0), and **its change per tick limited to grip_mu*g / 0.08 s * dt** (`kRootEase` = the old `kTurnEase`, `:36`), so it ramps and never steps. The velocity direction is rotated by `a_s*dt/speed`; the speed is not changed by turning. **No turn drag, no facing-away cap.**
4. **Walls and the mesh:** unchanged for M1. The velocity carries the body into the existing mesh snap (`:476-531`); a scrape takes momentum as the SLIP path does (`:518`); a head-on hit stops it as now. M3 is the lap that makes the world push back.
5. **Corner speed under the law (replaces `corner_speed`/`speed_for_radius` for the hunter):** the same corner room the old rule reads (`kCornerRoom` 0.9 m, `:15`) gives the same radius `R = 0.9 / tan(angle/2)` (`corner_speed`, `:236-242`); the fastest speed that takes that radius under the grip is `sqrt(grip_mu * g * R)`, never below `kCreep` (1.2 m/s, `:16`) and never above the stretch's cap. The planner brakes for it exactly as it does today (`corner_care`, `brake`).

Constants, all named in the code: `kRootTau` 0.2 s, `kRootEase` 0.08 s, `kRootVmin` 1.0 m/s, g 9.81.

## The switch
`SpeedModel::root_law` (0 off, 1 on), read by `Run::hunter_body()` only. **Off until he says so.** It rides the record's `[speed]` section like every speed field, and a launch reads it from `--chase-speed "root_law=1"` (`game/world/main.cpp`, not `--world`: `--world` sets world settings, this is the chase's model; checked at registration time by reading `chase/speed.h` and `main.cpp:415`; the exact line is confirmed in the hand-back). The other chasers (sprinter, interceptor, pack, dark) are built by `make_body` and `dark_body` and are not given it.

## Which of the old rules the hunter stops using when the switch is on (printed with the old and new lines in the hand-back)
- the cap while facing away (`:351-358`, the `off > 0.05` block);
- the rate-limited heading and its easing (`:365-373`, `kTurnTau`/`kTurnEase`, `turn_rate`);
- the turn drag (`:~384-387`, `turn_drag` on the angle turned);
- `corner_speed` and `speed_for_radius` (`:47-58`, `:236-242`) for the hunter's corner term.
Kept: the planner, the path, the senses, `corner_care`, the run-up (`run_up`), the wall and mesh code, `Chaser`'s fields (new: `root_as`, the last sideways acceleration, in m/s^2, for the tests and the lean report).

## The fingerprint with the switch off
`hash_into` adds the velocity and `root_as` only when the body's `root_law` is on (the SLIP precedent, `:~584`), so every legacy fingerprint is unchanged.

## What R1-R5 will be read against (registered before the run)
- **R1 (red first):** a scripted 90 degree corner of 3 m radius (found on a real mesh by a deterministic scan; the path is the arc with 12 m of straight either side), entered at 9 m/s. On every tick the sideways acceleration (|speed x heading rate|, from the positions and headings the stepper leaves) is at most grip_mu*g (+0.05 for float), and the per-tick change of the heading rate stays under 0.3 rad/s. **Red today** means: with the stub in place and `root_law` ignored, the same row fails on the acceleration bound.
- **R2 (off means off):** the 12-seed sweep md5 and his 20 kept runs, measured before any edit at c2af9d9, are the bar; with the switch off after the change both must be identical.
- **R3 (red first, floor):** the L170 route where sideways carry stalled 30.1 m short at a floor gap (`handback/p-l170-chase-A_2026-11-12.md:11-15`, `:74`) arrives with the law on. If the route cannot be rebuilt from that hand-back, R3 is reported as NOT RUN with the reason (stated before the run).
- **R4:** the same run twice gives the same fingerprints.
- **R5 (reported, not a bar):** never-caught and the Line median, NORMAL and brutal, switch off and on, beside his 52 and 62.

## Failure lines (carried from the plan, verbatim)
- "This plan failed if the first lap dispatched after it adds to the old turning rules, or to a switch on them, and no seat says so before code." This lap adds a new stepper beside the old one and changes the old rules in no way except to skip them for the hunter when the new switch is on: said here, before code.
- "It failed on his terms if, after M1 to M3, he plays it and still names the stop, pivot and go at a corner. Then the root law is wrong, not under-tuned, and M1's row was the wrong row."

## Known limit, said before the run
At a standstill the heading follows the aim at `turn_slow` (so a hunter that has been stopped by a wall still re-points to go); the law gives no corner a pivot because the corner speed it asks for is above `kCreep` and the heading follows the velocity above 1 m/s. A U-turn at speed brakes along its own line, since the sideways force is capped: that is the physics the law states, not a defect to patch.

## AMENDMENTS AFTER CODE (added the same lap, 2026-11-21; the text above is unchanged and is what was registered before code)
1. **Rule 5 gained a second half (said here, not hidden):** the planner's "facing away" cap (`chaser.cpp` old :412-417, new :471-480) is kept under the law but reads the GRIP's turning circle, `sqrt(grip_mu g R)` with R = distance / (2 sin(angle off)), not the old turn-rate circle. Without it the first run (R1 row a) orbited an aim point that lay inside the turning circle for 2.6 s. The registered page said "no facing-away cap"; that was wrong for a mass under a grip limit.
2. **Rule 3's ease is on the heading RATE, not the force:** at 2 m/s the force ramp of 0.08 s meant a rate step of 0.3 rad/s in a tick, which broke R1's continuity bar; the rate's own ramp (`grip / (9 m/s x 0.08 s)` per second) holds it. At 9 m/s the two are the same.
3. **R1's row a was amended after its first green:** "the law really turned it hard" went from > 0.5 g to > 0.2 g, plus "it braked from 9 m/s" (the lowest speed in the corner under 6 m/s). Neither is a registered bar (the bars are the grip bound and the continuity bar); both are non-vacuity checks. Row c (turned 1 rad off its line, where the clamp binds: 0.9 to 1.05 g) was written after the law, not red first.
