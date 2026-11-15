# p-m2-speed-plan-A: the root's speed plan and the mesh's room are built; walls fell from 9 to 2 and 0, but the gentle bend is not yet a banked turn

Pane A on D (Opus 5.5), ledger D676, packet `loop/packet_m2_speed_plan_A_2026-11-14.md` as amended (git-blob `45615d59`, 133 lines,
lighthouse `d1e1afed`; read whole, the "AMENDED 12:2x" and "CORRECTED 12:2x" sections holding), and the chair's read-only trace of
item 225. Written 2026-11-14 ~13:2x local. Every state claim is `checked:` (file or command) or `inferred:`. Evidence:
`p-m2-speed-plan-A_2026-11-14_evidence/` (`SHA256SUMS.txt`); registrations: `registration.md` (before any M2 code) and
`registration_amended.md` (after the first build's rows ran, before the amended code).

## First, as ruled: M1's wall falsifier stands as fired
M1's own falsifier (head-on wall ticks at most 1.25 times today's) fired, 9 against 6. **It was withdrawn as a bar by his words of 12:13,
and stays recorded as fired.** The row is amended by name to a report (below).

## The result in eight lines
1. **`a-m1-root` was pushed to the game's remote by name before M2 started** (`96d0336`, credential gate "allow", privacy scan 0 found,
   read back). M2's commits are on it locally: `23d63ac`, `ab096e4`, `ae374ef`, `4e66b99`, `85eb3f8`, `0ba17ea` (pushed at the end of this
   hand-back, below).
2. **R1 re-registered as ruled** (`23d63ac`): red on today's rule (3.167 and 2.529 times the law's bound), green on the law (0.999 of it).
3. **`nav::Query::open_along`, a nav-only commit with its own row** (`ab096e4`): red on a stub; a diagonal ray grazing a polygon corner stopped
   short in 8 of 1,598 rays and the query now casts on past it; nav_tests 33 of 33. **B can read that one commit.**
4. **The first plan, as registered (`4e66b99`), was not the cause:** walls rose 9 → 25; route 0's contact stayed (12 ticks) though the plan
   read its bend (15°) right; the half second before it showed why: the next point came 2.75 m ahead at 18° off at 8.8 m/s (≈ 17 m/s² against 9.81).
5. **Amended (`85eb3f8`), registered first:** the plan also caps the speed at what grip can turn to the next point on; the root never stops
   dead while going; and **his two ways at a hard corner behind `corner_feel`** (0 grip only, 1 also slowing for the bend: free to 22°, 0.30 of
   top at 90°).
6. **Walls:** head-on contacts on the ten routes **2 (way b) and 0 (way a)**, against M1's law alone 9 ticks and the first plan 25. W2's
   contact is gone. Crawl guard holds (1.049, 1.064).
7. **Red, and why:** the same cap reads a point a metre or less ahead, so it **brakes even a 15° bend to the creep speed** (G1 red, the
   opposite of his banked turn); the root still drops to 0 m/s at a few corners (H1 red); H2's registered bar came out at 0.00 s (a defect
   of my registration, below); W2's entry check compares against a body without its run-up.
8. **R2 holds** (md5 `fa938de4…` with the switch off; D's 20 kept runs replay identically on branch and main). **Do not switch the root on.**

## The switch (the night's rule: everything new lands behind its switch, off)
- **`root_law`** (`chase/speed.h`): 0 by default, the chase as it is; 1 makes the hunter the grip root, with the speed plan and the mesh's room.
  **`corner_feel`**: 0 by default (way b); 1 is way (a). Both are speed-model fields, so the one launch line is
  `launch.ps1 world --chase-speed "root_law=1"` (add `;corner_feel=1` for way a), on a build of `a-m1-root`. **Registered falsifiers fired
  in this lap (G1, H1, H2, above), so this ring is also the night's "a falsifier fired" ring.**

## R1, re-registered (the librarian's ruling 2)
checked: `…_evidence/r1_on_stub.txt`, `r1_on_law.txt` (the stub run used `b53be0f`'s `chaser.cpp`, rebuilt for the run and restored).
Derivation (registration.md §1): `Δacc_lat = s_new·Δω + ω_old·Δs`, so `|Δacc_lat| ≤ μg·dt/kTurnEase + ω_max(s_old)·|Δs|` (0.5745 m/s² a tick
at worst at 9 m/s, against the old bar's 0.9 there); on its feet also `|Δω| ≤ turn_slow·dt/kTurnEase`.

| | sideways peak | step, m/s² a tick | share of the bound | on its feet | old reading (rad/s a tick) |
|---|---|---|---|---|---|
| stub, told 9 | 31.10 | 1.6199 | **3.167** | 0 ticks | 0.1800 |
| stub, told 5.42 | 12.58 | 1.2938 | **2.529** | 0 ticks | 0.2385 |
| law, told 9 | 9.81 | 0.5612 | **0.999** | 0 ticks | 0.1043 |
| law, told 5.42 | 9.81 | 0.5110 | **0.999** | 0 ticks | 0.0960 |

The law runs at its own bound: the 0.1 % slack registered in the bar is what it sits inside.

## The nav query (`ab096e4`; touches only `nav/`)
checked: `…_evidence/nav_row_stub.txt` (red: 0 rays reached 6 m), `nav_row_query.txt`, `nav_all.txt` (33 of 33).
- **Correction to my registration, made before the first run of the query:** the registered "0.3 m beyond the edge, reach 0.3" could never
  pass (the edge itself is 0.3 m from that point). The row checks 0.25 m beyond with 0.1 m reach (`inferred:` the far side of a wall is at
  least about 0.6 m away, a body's radius off each face).
- **The query's first build failed its row honestly:** 1,590 of 1,598 flat rays were right; the 8 were all at 45°, each with a near-straight
  walk of about 2.4 m to the point found beyond (printed by a scratch diagnostic, removed before the commit). `inferred:` Detour's raycast stops
  where a diagonal grazes a polygon's corner exactly. Fixed in the query (cast on from 2 cm past a stop when the mesh is there within 5 cm,
  up to four times), not in the row. After: 1,586 of 1,586 flat rays right; 791 reached 6 m, 1,609 met an edge.

## The rows on the final build (`85eb3f8`; checked `…_evidence/am_chase_tests.txt`: chase_tests **89, 5 failed**)
Arms: **today** (the chase as it is), **way (b)** (`root_law=1`), **way (a)** (`root_law=1;corner_feel=1`).

| row | registered | today | way (b) | way (a) | verdict on the root |
|---|---|---|---|---|---|
| W1, report by bend (≤22° / 22–67° / ≥67°) | no bar (his words) | 6 ticks (1 contact) / 0 / 0 | 0 / 1 (1) / 1 (1) | 0 / 0 / 0 | report |
| W2, route 0's corner | no head-on within 3 m; entry ≤ 1.05 × grip | — | **0 ticks**; entry 8.87, plan 8.90, grip 8.00 | — | **red on the entry check only** |
| G1, routes (bends 5–22°) | no wall; lowest ≥ 0.8 × min(entry, grip) | 1 walled, 4 of 6 under | 0 walled, **3 of 6 under** | 0 walled, **3 of 6 under** | **red** |
| G1, scripted 15° / 22° | lowest ≥ 0.8 × min(entry, grip) | — | 4.64 / 2.79 from 9.20 | 4.64 / 2.79 | **red** |
| G2, the order 15 / 22 / 45 / 90 | never rises; 45 between | — | 4.64 / 2.79 / 1.57 / 1.33 | 4.64 / 2.79 / 1.49 / 1.43 | **holds** |
| H1 (W3 amended), the creep floor at hard corners and after walls; re-point | ≥ 1.2 m/s; ≤ 1e-4 rad | 4 routes under | **3 routes under**, lowest 0.00; re-point 0.000000 | **1 route under**, 0.00; 0.000000 | **red** (re-point held) |
| H2, back to half its top after a wall | ≤ 2 × the old body's longest | 1 contact, 0.00 s | 2 contacts, longest 0.78 s | none | **red: the bar is 0.00 s** |
| Crawl (time on / today ≤ 1.25) | | 77.11 s | 80.93 s (1.049) | 82.03 s (1.064) | holds |
| R1, R3, R4, off by default | as M1 | | R3 10 of 10; R4 chase `96f282aa8363d4d0` twice | | hold |

**What is right:** the cap on the turn to the next point is what the walls needed (25 → 2 and 0), W2's contact is gone, G2's order holds both
ways, no re-point anywhere, and it does not crawl.

**What is red, and the cause read for each:**
- **G1:** the plan asked **1.20–1.25 m/s (the creep speed) at every scripted bend, 15° included** (`…_evidence/am_chase_tests.txt`, the
  `way (b), 15 degrees: … the plan asked 1.25` lines). `inferred:` the cap is computed to the point it heads for, a metre or less ahead on a
  path with a point every metre, so a small offset from the line reads as a large angle at a short distance, and grip's radius to it is small.
  That is the same pure-pursuit-to-a-close-point mechanism that put route 0 into its wall, now braking instead of colliding. **The next change
  is to read the turn needed to rejoin the path some distance ahead (not a point under a metre away); not built, for a ruling.**
- **H1:** lows of 0.00 m/s remain (way b routes 0, 3, 8; way a route 5), and today's body has them too (routes 1, 2, 7, 9 under 1.2; route 9
  at 0.00). `inferred, not checked:` they come from the world, not the plan: a refused step sets the speed to 0 in one tick
  (`chaser.cpp`, the `else` of the snap; `refuse_brake` 0 by default), and neither the plan nor the floor can hold it. That is M3's ground
  (the world pushing back). A one-line counter in the walk would check it; not run.
- **H2:** my registered bar was "twice the old body's longest", and the old body has one contact on the ten routes, in which it never fell
  below half its top: its longest is 0.00 s, so the bar is 0.00 s and nothing could meet it. **A defect of my registration, not moved after
  the reading.** The root's 0.78 s is printed.
- **W2's entry check:** `inferred:` the row compares the entry speed with grip's speed for a body without its run-up (top 8.00), while the hunter
  carries its run-up (top_now ≈ 8.8). The contact, the thing W2 was for, is gone.

**What these rows would read if forward and sideways shared one limit (a friction circle; not built, as asked).** `inferred:` braking
while turning would be cut to what the circle leaves (at full grip sideways, none), so the plan's braking before a bend would have to start
earlier, and its 0.8 margin would be eaten at every corner that is braked into while turning; W1's contacts would rise from 2 and 0, G1 (whose
red is over-braking) would not improve, and H1 would be unchanged where its zeros are the world's.

## Both ways at a hard corner, for his eye (he picks; no bar chooses)
| | way (b): grip only, the wall takes the rest | way (a): also slows for the bend's size |
|---|---|---|
| ten routes' time | 80.93 s | 82.03 s |
| contacts at ≥67° / 22–67° | 1 / 1 | 0 / 0 |
| hard-corner lows (H1 per route) | 0.00 to 4.90 m/s | 0.00 to 4.08 m/s |
| scripted 45° / 90° lowest | 1.57 / 1.33 m/s | 1.49 / 1.43 m/s |

- **What grip alone could carry, beside what the plan asked** (scripted bends, 3 m of room, entry 9.20; `…_evidence/am_chase_tests.txt`):
  grip on the plan's reading of the room allows 9.20 at 15° and 22°, 8.43 at 45°, 5.42 at 90°; **the plan asked 1.20–1.25 at all four
  (way b) and 1.20–2.20 (way a)**, the turn-to-the-next-point cap again. The librarian's arithmetic (a 39 m radius available on the widest line
  at 45°, against 8.63 m needed at 9.2 m/s) says grip could carry most of a 45° bend; **my room formula (`room·cos(θ/2)/sin(θ/2)`, the 11-13
  registration's) gives only 7.24 m there on 3 m of room**, far less than the widest line. `inferred:` it reads the bend as an arc tangent to
  both legs, not the line a body can take across a corridor.
- **The film of the same 90° corner both ways: NOT DONE.** `--capture-corner` stages a scripted hunter on a fixed curve at 6 m/s
  (`game/world/offscreen_models.cpp`, checked by reading), and the only offscreen mode that runs the live chase (`--capture-run`'s last
  section) films the HUD and the results card. `--chase-speed` in the offscreen modes would change no frame, so step 2 was not built.
  `inferred:` the smallest real form is a corner mode that steps a live `chase::Chaser` with the model given through the real corner and poses
  the figure from it; it lives in `offscreen_models.cpp`, outside `chase/`, which I did not touch this lap.
- **The seed-1 trace** (`dz-chase run --policy line --level 3 --seed 1 --max 60 --image`): M1 off **caught at 23.6 s**, M1 root on 40.7 s,
  **M2 way (b) 51.7 s, way (a) 51.7 s** (checked: `…_evidence/am_trace_b.txt`, `am_trace_a.txt`). Pictures outside the repository:
  `G:\consonance-scratch\m1_traces\trace_seed1_line_brutal_m2_way_b.png` (sha256 `377bd1dc…`), `…_m2_way_a.png` (sha256 `6943201e…`), beside
  M1's two.
- **A live play with the root on** needs a build of `a-m1-root` (his clone at `e091beb` refuses `root_law` with exit 2):
  `powershell -NoProfile -ExecutionPolicy Bypass -File launch.ps1 world --chase-speed "root_law=1"` for way (b), and
  `--chase-speed "root_law=1;corner_feel=1"` for way (a). `inferred:` from L211's argument; not run, and not advised until G1 is green.

## R2, off means off (on `85eb3f8`)
checked: `…_evidence/am_sweep12.txt` md5 of the "survival, seconds" to "where chasers caught" lines: **`fa938de45995bd2d13b98ba28fae0c34`**;
`am_replays.txt` against main's `base_replays2.txt` (M1's evidence): **identical** (18 SAME, the same 2 `cab3530` runs DIFFERENT, with the same
fingerprints).

## R5, reported (96 seeds; normal `--levels 1 --max 300`, brutal `--levels 3 --max 600`; off from M1, the switch-off code unchanged since)
checked: `…_evidence/am_r5_*.txt`; M1's `r5_normal_off.txt`, `r5_brutal_off.txt`.

| | flee never caught | flee median | Line median | cutback median |
|---|---|---|---|---|
| normal, off (main) | 58 | 300.0 s | 32.0 s | 35.1 s |
| normal, M1 root | 55 | 300.0 s | 39.8 s | 35.2 s |
| normal, M2 way (b) | **68** | 300.0 s | **45.2 s** | 43.9 s |
| normal, M2 way (a) | 57 | 300.0 s | 38.3 s | 45.2 s |
| brutal, off | 2 | 186.4 s | 24.8 s | 28.4 s |
| brutal, M1 root | 1 | 141.6 s | 25.2 s | 31.7 s |
| brutal, M2 way (b) | 2 | 154.3 s | 25.0 s | 28.7 s |
| brutal, M2 way (a) | 0 | 142.5 s | 25.1 s | 26.8 s |

His 52 and 62 are D665's normal flee-never-caught counts; today's main reads 58. `inferred:` way (b)'s softer normal chase (68, Line +41 %) is the
over-braking at gentle bends (G1). Nothing tuned toward either number.

## The sprinter row (the hole the packet named): not touched. It is a lesser chaser's row; the root is the hunter's.

## Item 225, read only: the hunter changed floors without falling. **It took a drop link; it did not pass through the floor.**
Run `run-20261114-184949.txt` (seed 4, build `e091beb`), copied read-only to scratch from his clone; replayed headless by a scratch tool
(`…_evidence/trace225.cpp`, never committed; the game's own `replay_run`, every tick) after the pause, at 18:51, on `a-m1-root` with the
switch off (R2: off-means-off, so it plays as main). checked: the replay reports **SAME as the record** (37,069 ticks); the ticks from 149.0
to 150.5 s and every event are in `…_evidence/item225_trace_149.0_150.5.txt` (367 lines).

- **149.0083 s:** the hunter (#1) is moving at 1.44 m/s at y 3.54 (a floor above him; he is at y 0.00).
- **149.0125 to 149.9125 s, 217 ticks = 0.904 s** (the hunter's `drop_s` is 0.9, `chase/archetype.cpp:21`): it comes down **3.50 m**,
  from y 3.54 to 0.04, and moves **2.87 m** across. Its height follows the drop law of `cross()` (`chase/chaser.cpp`, the `Gait::Drop` branch:
  `y_from + (y_to − y_from)·t²`) **within 0.0103 m on every tick**, and its flat position a straight line from start to landing within 0.0195 m.
  That is the shape of a drop link and of nothing else in the chase; a pass through the floor would be a snap, or a mesh step with no such curve.
- **149.9125 to 150.3417 s, 103 ticks = 0.43 s:** it stands on his floor (the recovery after a drop; `inferred:` the `hunter_drop_recover_s`
  dial at that minute, not read from the run's dials).
- **150.3458 s:** it moves again, from 0.06 m/s, 12.72 m from him.
- **Why it can read as a cheat** (`inferred:`): through a link the chase reports speed **0** (`start_link` sets it), so a replay's speed column
  shows a hunter "nearly still" that is in fact falling; and the fall is the drop link's line, a straight 2.87 m across from the edge the mesh
  offered, not a body's fall from where it stepped off. Whether that line clears the ledge's own geometry cannot be read from positions alone:
  that is M3's first row, "a drop is a fall", not this lap's. Nothing was changed.

## Corrections, mine
- The registered nav check could not pass as written (above); changed before the query's first run, said here.
- The first G1/W3 machinery read a point's turn forward only and called 70° corners straight; changed to the chord reading before the plan
  was built (`ae374ef`'s message).
- **H2's bar is a registration defect** (0.00 s), left standing.
- **The amended rows were not all seen red before their code:** the amendment's two fixes were written before the amended rows ran, so G1,
  G2, H1 and H2 were first run on the fixed code; G1, H1 and H2 are red there anyway, G2's order was never seen red.
- **His words went into two test comments of the game's repository in my first amended commit; I rewrote them as pointers to the brief
  and amended that commit before it was pushed** (`b163e3c` → `85eb3f8`); `git show` of every branch commit since `e091beb` finds none of them.

## What is where
- dreamzone-3 `a-m1-root` (worktree `G:\consonance-scratch\a-m1-dz3`), tip `0ba17ea`; uncommitted scratch only in `game/CMakeLists.txt`
  (`replay_check`, `trace225`). Base worktree `G:\consonance-scratch\a-m1-base`.
- lighthouse `a-m1-lh`: the two registrations, this hand-back, evidence.
- His clone untouched since step 0 (`e091beb`).
