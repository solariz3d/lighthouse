
## L182b: the hawk's mixed guidance law, and his square-room test case (his item 178), registered 2026-11-13 before any of it is built or run (branch `l182-hawk`, off `l182-lines` c357bbd; pane A)

**His words (item 178, as the chair relayed them):** in a square room, running wall to wall or circle-strafing beats every chaser (they cannot turn fast enough); corners still snag; they do not run arcs. His idea is two states: mirror the player's line when behind, and predict and cut off.

### The sources, and how much of each was read
- **Brighton, Thomas & Taylor 2017**, *Terminal attack trajectories of peregrine falcons are described by the proportional navigation guidance law of missiles*, PNAS 114(51):13495-13500, doi 10.1073/pnas.1714532114 (PMC5754800, CC BY-NC-ND). **Main text read in full. The SI Appendix (the deviated-pursuit and 3D equations, S1-S4, Tables S1-S3) is NOT read.**
- **Brighton & Taylor 2019**, *Hawks steer attacks using a guidance system tuned for close pursuit of erratically manoeuvring targets*, Nature Communications 10:2462, doi 10.1038/s41467-019-10454-z (PMC6560099, CC BY 4.0). **Main text and Methods read in full. The supplementary data (the simulation code, per-flight tables) is NOT read.**

### The law, as read (their equations, their symbols)
- δ = γ − λ (γ the track angle, λ the line-of-sight angle). **Proportional pursuit (PP):** γ̇(t) = −K δ(t − τ). **Proportional navigation (PN):** γ̇(t) = N λ̇(t − τ). **Mixed:** γ̇(t) = N λ̇(t − τ) − K δ(t − τ) (2019, Methods eqs 5-7, in commanded-acceleration form a = (N ω − K δ) × v).
- **Hawks, mixed law fitted globally to 50 flights of 5 birds: N = 0.7, K = 1.2 per second, τ = 0.09 s** (median prediction error 0.34 m, 95 % CI 0.24 to 0.53 m); fitted per flight: N 0.7 (IQR 0.4 to 0.8), K 1.0 per second (IQR 0.2 to 1.4), τ 0.12 s (IQR 0.02 to 0.17). PN alone, per flight: N 0.9 (bootstrapped CI for the median 0.81 to 1.01). The lure was a food lure on a winch, median 7.0 m/s (IQR 4.1 to 9.7), zigzagging round pulleys, on open grass.
- **Falcons (2017):** PN, median N 2.6 (IQR 1.5 to 3.2) at the 1 % error tolerance; missiles 3 to 5; the linear-quadratic optimum for a stationary or non-manoeuvring target is an effective N' = 3. At N below 2 a missile's commanded acceleration grows without limit, which the authors say never limited the falcons at their speeds.
- **Their own simulation (2019, Fig. 6b, c):** on the jinking target of the hawk experiments, capture came soonest at N = 1; on the gently manoeuvring target of the falcon experiments, soonest at N = 3. Low N "causes lower amplification of a jinking target's twists and turns", "especially important at close range"; the PP element "reinforces" tail-chasing, so a pursuer "follows the lead of its prey through clutter". Hawk gains are low because the targets jink and the pursuit is close.
- **Not in either paper, and so ours:** both fit the steering direction only and **take the pursuer's speed from the measured track**; both assume the commanded acceleration can be met ("any guidance model that fits the data must by definition be feasible"). A turning limit, a navigation mesh, walls, a runner who can reverse in a fifth of a second, and a body with a turn rate that falls with speed are not in the papers.

### What is ours (marked, and shown to him)
1. **The mapping to a ground chaser.** γ is the chaser's heading, λ the bearing to where the hunter knows the player is (its delayed observation, `hunter_reaction_s`, which stands in for τ; the hawks' fitted 0.09 s against the hunter's 0.15 s at the hardest dial is a stated difference, not a fit), λ̇ from the player's observed velocity and the chaser's own velocity.
2. **It engages only when the line to the player is clear and within `hawk_range`**; otherwise the path follower steers as it does now (a hawk's law has no walls). Hunter only in this lap.
3. **The commanded turn is then clamped by `turn_rate()`**, which carries the Eqn 5 / H2 law when `turn_law` is on: **the combination of the hawk's law with a turning limit is ours.** The speed is the existing speed model's.
4. **The test case, the player's kinematics and the room** (below) are ours.

### The fields (all off by default: the chase as it is, and his kept runs replay byte-identical)
- `hawk_n` (the navigation constant N; 0 with `hawk_k` 0 = off), `hawk_k` (per second), `hawk_range` (metres, default 20: where the law engages). Named, swappable: `hawk_mixed_law` in `chase/chaser.cpp`, with the papers cited above it.

### The test case, registered as two bots in a square room (before they are built)
- **The room:** 12 m by 12 m inside one navigation tile, floor and four wall boxes (3 m high, 0.3 m thick), built with `nav::build_tile` from triangles; no doors, no obstacles. The hunter comes in at a corner (`RunParams::spawn`), the head start 0, difficulty level 1 as the sweeps use, `catch_reach` at its default.
- **The player's kinematics (ours; a 2D mimic, not the controller):** Quake-style ground movement with `sim/params.h`'s numbers: wished speed 8 m/s (the chase's own reference), `ground_accel` 10 per second as a multiple of the wished speed, friction 6 per second, `stop_speed` 2.5. A reversal at 8 m/s therefore takes about a fifth of a second: that is the exploit, and it is in the controller, not invented here.
- **Bot W (wall to wall):** runs a lane of constant z along x at the wished speed and **reverses its wished direction within 1.5 m of a wall**; lanes z in {3, 4.5, 6, 7.5, 9} m.
- **Bot C (circle strafe):** holds a circle round the room's centre by wishing the tangent plus a radial correction; radius in {2.5, 4.0} m, both directions.
- **Runs:** 24 per bot per arm (the lanes or radii and directions, and 6 start phases), up to 60 s each. Per run: caught or not, the time, the chaser's head-on wall hits and stalls. Same runs for every arm: deterministic.

### The arms (the room and the 150-seed sweeps, two blocks; control = L170's control with the dials at their defaults; a1 and a2 are scored)
- **h1** `hawk_n=0.7;hawk_k=1.2` (the hawks' global fit); **h2** `hawk_n=1.0;hawk_k=0` (PN alone at the hawk's N, where their simulation captured the jinking target soonest); **h3** `hawk_n=2.6;hawk_k=0` (PN at the falcons' median N);
- **h4** `turn_law=3;hawk_n=0.7;hawk_k=1.2` (the hawk's law under the Eqn 5 / H2 limit: his item-178 arm); **h5** h4 with the feelers (`feeler_m=1;feeler_push=0.5`, which passed the walls bar as a3).
- Values are fixed here. **No gain is tuned after a run**; a different N or K is a new registration naming the figure in the papers it comes from.

### The bars (each with its falsifier)
- **The premise, first:** the control catches fewer than half of the runs of each bot within 60 s. If it catches 80 % or more of a bot's runs, his observation does not reproduce in this room with these kinematics, and that is reported before any arm is scored.
- **His case (the room), per bot:** **pass** = an arm catches at least 80 % of the runs and at least 30 points more than the control; **falsified** = within 10 points of the control. Head-on wall hits per run no more than the control's ("corners still snag").
- **The general chase (the sweeps), for h4 and h5 (they carry the law):** **recovered** = flee never-caught share at least 10 points below a2's in both blocks (a2: +18.0 and +16.7 points over the control) and the Line median no more than the control's plus 10 %; **falsified** = under 5 points below a2's in either block. **Walls:** at most 0.7 times the control's head-on hits (a1 0.38, a2 0.45, a3 0.49 to 0.51), falsified above 1.0. h1 to h3 (no law) are reported against the L170 bars for catch and cutback.
- **Guards:** `pursuit_tests.cpp:92` and `:117` stay green; with every dial at its default the 12-seed sweep text keeps md5 `599ab2395194ded75d0d102f84b3195d`.

### Registered expectations (inferred, not measured)
- A runner who can reverse in 0.2 s cannot be caught by any chase that obeys a turning limit unless the chaser gets ahead of the reversal; the PN term helps the circle strafe (it heads off, cutting inside the circle) more than wall to wall (a reversal throws the line-of-sight rate across the chaser in one tick, and the commanded turn is then clamped by the turn rate).
- **The chance that an arm passes the room bar on both bots: about 15 %.** The chance that h4 recovers the sweep catch bar: about 25 %. The chance that h1 to h3 change the walls bar: about 20 %.

### The falsifier
**If no arm passes the room bar on both bots, the hawk's law as read does not solve his case in this room at the papers' gains, and the hand-back says so; the question of how to catch a player who reverses in a fifth of a second is then the player controller's (E's L186 physics research), not the chase's.** "Close enough" said after the fact is the degenerating move.
