# M1, the hunter's root as a mass under a grip limit: the law, registered before code

Pane A on D, ledger D676, packet `loop/packet_m1_root_law_A_2026-11-14.md`. Written 2026-11-14 ~11:2x local, before any line of
the root was written. Code read at the game's main `e091beb` (worktree `G:\consonance-scratch\a-m1-dz3`, branch `a-m1-root`); the
packet's line numbers were read at 99b6045; **at e091beb the same rules sit lower** (checked: `chase/chaser.cpp` read whole, 584
lines, and `git show 99b6045:chase/chaser.cpp` grepped). Both are given below. *(Correction: the first commit of this page,
29bdc58b, said they "still match"; that was written before the grep and was wrong.)*

## The switch
- A new speed-model field, `root_law` (chase/speed.h): **0, the default, is the chase as it is; 1 makes the HUNTER a mass under a grip
  limit.** Only `Run::hunter_body()` raises it on a body; `make_body` leaves every body at 0, so the lesser chasers and the dark one
  (whose body is `make_body` of its own limits, `run.cpp` `dark_body`) do not change. It is read like every other speed field: from
  `dz-chase --speed`, `dz-world --chase-speed` (L211), and the run record's `[speed]` section, so a run played with it replays with it.
- With 0 nothing new is called and nothing new is hashed (R2).

## The law, from path to acceleration (one tick, 1/240 s, on the mesh, going)
What it keeps from today's step: the path following (which point it heads for, links, stairs, the foot of a link), the sway
(D664), the snap to the mesh, scrapes and head-on wall hits, the run-up (speed.h), and every gait other than `Mesh`.

1. **Where it steers.** `err` = the angle from its heading to its aim, the aim as today (the next path point, swayed).
2. **How fast it wants to go.** `want = min(cap, sqrt(seen² + 2·brake·room))` as today, but the speed a corner allows is from grip:
   `through = min(cap, sqrt(μ·g·R))`, `R = kCornerRoom·cos(θ/2)/sin(θ/2)` with θ the summed turn of the corner within 3 m (D665's
   reading, unchanged) and `kCornerRoom` the 0.9 m it is today. **The room is today's; only the law that turns a radius into a speed
   changes** (how much room a corner leaves is the corner-room lap's question, stopped by the plan; named here as the first thing
   that keeps the speed lost at a corner what it is). μ is `grip_mu` (L182's field, default 1.0), g 9.81.
3. **The acceleration it asks for** is the one that takes its velocity to `want` along the aim in τ = 0.08 s (`kTurnTau`, today's
   pursuit gain): with `s` its speed,
   - forward: `a_f* = (want·cos err − s) / τ`
   - sideways: `a_l* = want·sin err / τ`, and when the aim is behind it (cos err < 0) `a_l* = ±want / τ` toward the aim's side.
   A point to the side therefore asks it to brake and turn at once; nothing caps its speed for facing away, the acceleration does.
4. **The limits on what it gets.**
   - forward: `a_f` in `[−brake, accel]` (its body's, as today), and never below `−s/dt` (it does not run backwards).
   - sideways: its turn rate `ω` (radians a second) goes toward `a_l* / max(s, 0.5)`, and **`|ω|` is at most
     `ω_max(s) = min(turn_slow, μ·g / max(s, 0.5))`**: so the sideways acceleration `ω·s` is **never more than μ·g**, and at a walk
     its turning on its feet is the body's standstill rate (`turn_slow`, 360°/s for the hunter). The speed-dependent rate
     `turn_fast` is not used: at speed, grip is the limit.
   - **`ω` changes by at most `ω_max(s)·dt / 0.08` a tick** (`kTurnEase`, today's ease): it takes 0.08 s to come to its full
     turn, so its heading's rate has no step. At 9 m/s and μ 1 that is 0.057 rad/s a tick.
   - The order in a tick: `s += a_f·dt`; then `ω` eased and clamped to `ω_max` of the NEW speed; then `heading += ω·dt`; then it
     moves `s·dt` along the new heading. **Its heading is its direction of travel; it never re-points on the spot at speed.**
5. **What it carries for whoever reads it** (pane C's B1 lean is the reader): `acc_lat = ω·s` and `acc_fwd`, the change in speed
   over the tick (walls included), in metres a second squared, and a count of the ticks the root stepped it.
6. **Not going** (held, or at its path's end): `a_f = −brake`, `ω` eases to 0.

Plain float arithmetic: `+ − × ÷`, `sqrt` (correctly rounded by IEEE 754) and the chase's own `det_sin`, `det_cos`, `det_atan2`.
No `pow`, no physics library. Deterministic on one build and across machines with the same compiler settings, like the rest of the chase.

## Which old rules the hunter stops using with the switch on (line numbers at e091beb; the packet's, at 99b6045, in brackets)
- `chase/chaser.cpp:411-420` (`:331-343`), the cap while facing away (a speed whose turning circle reaches the aim): replaced by step 3, where a
  sideways aim asks for braking through the acceleration itself.
- `:426-437` (`:351-358`), the rate-limited heading (`turn_rate(now, speed)`, the `turn_fast`/`turn_slow` blend and the L182 turning laws):
  replaced by step 4's grip-limited turn.
- `:448-451` (`:369-372`), the turn drag (`turn_drag`, a share of speed lost per radian): not applied; a turn costs speed only through the braking
  step 3 asks for. **The run-up's bleed on that line is kept** (it is the speed model's run-up, not the turning law).
- `corner_speed` and `speed_for_radius` (`:236-242` and `:47-58`; at 99b6045 `:174-180` and `:47-58`): replaced by
  step 2's `sqrt(μ g R)`. `kCornerRoom` itself is kept.
- Kept for every other body and for the hunter with the switch off: all of them, unchanged.

## Sources
- The law's shape, `V = min(V_o, sqrt(μ g R))`: L182's H2 (`chase/SPEED_MODEL.md`, `chase/chaser.cpp:215-226` `law_min_radius`),
  "the sources' shape (greyhound: no limb-force slowdown, grip-bound)"; μ's meaning from Wilson et al. 2013 as read in full on L
  (`handback/p-l182-lines-A_2026-11-12_evidence/wilson2013_read_report.md`): **1.3 is a lower bound for wild cheetahs' brief
  lateral peaks; nothing read supports a value for a body this size at 9 to 13 m/s.** The default stays 1.0 (the friction bound).
- The option this builds: `loop/physics_first_body_read_2026-11-14.md:199-222` (option B), and its envelope `:98-102` (grip radius
  at 9.2 m/s: 8.6 m at μ 1.0, 6.6 at 1.3, 4.3 at 2.0).
- Separate forward and sideways limits, as the packet states them ("sideways part can never exceed `grip_mu` times g, and whose
  forward part stays within its acceleration and braking"). **Ours, and named as a choice:** a friction circle (the two combined
  under μ·g) is the stricter physics; the hunter's braking (14 m/s² at the dial's default, 1.43 g) already exceeds μ g at 1.0, so a
  circle would also change its straight-line braking. Not in M1.

## What this law does not fix (said before code, so it can be held to it)
- **The speed lost at a corner stays set by the planner's braking**, and the room it assumes is today's 0.9 m: at μ 1.0 a 90°
  corner allows `sqrt(9.81 × 0.9) ≈ 2.97 m/s`, slower than the turn-rate law's speed for the same radius. `inferred:` the hunter
  with the switch on brakes to a lower speed at sharp corners than it does now and arcs through them instead of pivoting. **Its
  catch numbers may fall** (R5 reports them; not a bar).
- Walls still take speed as today (M3 is the world pushing back).
- The let-off before the touch (fault 2) is not touched (M4, arrival).

## Its falsifiers, registered with the rows (the packet's R1-R5, with the numbers this law makes checkable)
- **R1** (scripted 90° corner, 3 m radius, entered at 9 m/s; the law alone, the aim the next point of a scripted path as the
  game's step chooses it): falsified if on any tick `|acc_lat| > μ·g·(1 + 1e-4)`, or the heading rate changes by more than
  **0.1 rad/s from one tick to the next**, or the heading moves by more than `ω·dt` (a re-point). Run two ways: told to keep 9 m/s
  (the worst case: it must swing wide, not exceed grip), and told the grip speed for the radius (`sqrt(μ g 3) = 5.42 m/s`), where
  it must also stay within 0.5 m of the arc. Red today: the row's stub is today's turning rule in the same harness.
- **R2:** falsified if the 12-seed md5 with the switch off differs from today's main's (re-measured first), or fewer than all of
  D's kept runs replay (his 20 kept runs are on L; D's `game/runs` holds 20 of his D runs, and those are what D can replay).
- **R3:** falsified if the route on which SLIP stalled (L170: 30.1 m short at a mesh gap) does not arrive with the root on, or if any
  of the ten L170 corner routes that arrives with the switch off does not arrive with it on.
- **R4:** falsified if two runs with the root on, same seed and settings, differ in any fingerprint.
- **R5:** reported only.
- **This law is wrong for the game** (an answer the packet allows) if, on the ten L170 corner routes, its head-on wall hits are
  above 1.25 times today's (the margin I registered for the corner-room lap): grip without a better planner would then put the
  hunter into walls.
