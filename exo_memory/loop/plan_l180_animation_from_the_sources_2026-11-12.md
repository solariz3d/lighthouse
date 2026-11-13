# L180: the animation rework, built from the sources, in his order (his items 146–155). Librarian, on L, 2026-11-12 03:3x local

**Supersedes** L177b (`plan_l177b_research_lean_2026-11-12.md`) and L178 (`plan_l178_animation_rework_2026-11-12.md`). Both are kept as traces.
**Sources (the spec):**
- `handback/p-l176-openanim-C_2026-11-12.md` (Overgrowth code, ozz, Holden);
- `handback/p-l179-valve-anim-C_2026-11-12.md` (Valve SDK 2013, Booth);
- `handback/p-l179-talks-C_2026-11-12.md` (Rosen via techarthub; Days Gone press).

**His picks (brief 155):**
- the lean is both, tilt first;
- sliding, the hunter faces you;
- the climb uses Overgrowth's grips.

**Rules:**
- Every step names its source line. A step with no source is marked **ours** and goes to him before it is built.
- Learn from, never copy. Valve's SDK is study only.
- Each step's test is registered and red on the base first.
- Every replay keeps both fingerprints: picture only, except where a step says otherwise.

## Lap 1, C, now (the hunter; `game/world/world_app.cpp`, `game/model_rig.cpp`, `game/world/stage.cpp`)
1. **Remove L173's chain** (the turn-rate unpicking, dead zone, two springs and the 100°/s clamp in `ease_poses`, landed in c83f8dc).
2. **Tilt from acceleration:**
   - Source: Overgrowth `aschar.as:7921-7940`, `:4236-4241` (Apache-2.0), and Rosen's step 3 "Acceleration tilt".
   - Velocity plus low-passed acceleration gives the target tilt, then the drawn tilt eases toward it. The constants are in seconds at 240 Hz (about 0.16 s and 0.08 s as read).
   - It leans back when braking and forward when starting.
   - Springs by half-life (Holden `spring.h`, MIT), no hard clamp.
   - If D664's sway still rocks it: a soft knee in the picture (L176 §1). Its source is A's to change, so flag it.
3. **Head and facing with eased ends:**
   - Source: Valve `NextBotPlayerBody.cpp:296-315`: a capped rate, a sine ease-out inside about 45°, a 0.25 s ease-in, pitch at half. Valve `multiplayer_animstate.cpp:1793-1823`: a proportional slow-down inside 60°, never overshooting.
   - The look is spread over 3–4 spine joints (ozz `sample_look_at.cc:106-160`, MIT).
   - The yaw is eased as a direction (Holden; Overgrowth `interpdirection.as:25-41`).
- **Tests (registered, red on c83f8dc):**
  - L173's row kept: sign changes on straights ≤ 0.5/s; lean rate ≤ 120°/s; corners reach full lean.
  - **The timing row** `the_hunters_lean_peaks_at_or_before_its_turn_does` (from C's L177 branch f33783f; c83f8dc measures +0.60 s on his run and +0.56 s on the bot's): the lag must be **shorter than on c83f8dc in both runs**. The number is recorded. His eye is the bar for "into the turn".
  - Look: no step in the head's turn rate above 200°/s within one frame, at a look's start or end (C's half 1 §3); the head reaches a held target.
  - Yaw: no drawn yaw goes the long way round a scripted 180° reversal.
- **Land as L173:** exclusive hold, ctest, both selftests, stamp, scan, push-gate, push.
- **Show him:** the lean-over-his-run chart with the turn rate on the same axis, and captures.
- Hand-back `p-l180-lap1-C`.

## Lap 2, C (after lap 1 lands)
4. **Per-chaser stride variation:** a few numbers seeded per chaser id (stride rate, swing, tilt gain). Sources: Valve `NextBotBodyInterface.h:73` (`ENTINDEX_PLAYBACK_RATE`); Days Gone (press).
5. **Feet with memory:**
   - Source: Overgrowth `movementobject.cpp:2619-2660`: each foot's ground height is clamped to ±0.1 m per frame and eased, and the foot is tilted to the ground's normal.
   - `soften` near full reach (ozz `ik_two_bone_job.h:93-96`).
   - Test: no drawn foot moves more than 0.1 m vertically in one frame on stairs.
6. **Stumbles and flinches as additive gestures:** a weight with a smoothstep in and out over its own clock (Valve `BaseAnimatingOverlay.cpp:162-188`). Only where the chase already has an event: overshoot, wall hit, stun.

## Lap 3, when A's SLIP lands (velocity ≠ heading; L170)
7. **The slide, facing you:**
   - The drawn facing holds toward the player at a capped rate.
   - The legs run along the velocity: a procedural move_x / move_y blend in `gait_pose`.
   - Sources: Valve `NextBotGroundLocomotion.cpp:1413-1438` (facing), `:157-181` (velocity against side friction) and `multiplayer_animstate.cpp:1566-1620` (move_x / move_y).
   - The tilt from lap 1 stays and stacks (his pick).
   - Test: the slip angle (A's instrument) shows in the drawn pose; his eye on the look-back.

## B, after L174 lands (the player's body; `game/body.cpp`, `game/body.h`)
8. **The climb by grips:**
   - Hands and feet staggered (phases 0, 0.5, 0.1, 0.6), each limb moving on a sine arc.
   - Weight is borne in a valley, and the body sits at the grips' weighted mean.
   - Each hand probes the ledge and remembers its grip.
   - Source: Overgrowth `ledgegrab.as:29-111`, `:139-145`, `:197-215`, `:248-293` (Apache-2.0). It plugs into `HandOverride` (`game/body.h:93`).
9. **The glance as a weighted spine chain** that carries the shoulders with the view (ozz look-at). **Ours:** the camera inside its own body (no source covers it); B's L174 method decides it.
10. **The feet as step 5**, under the camera.

## Not in this plan
- **Clips**, by his pick.
- **Active ragdolls** (Techland): needs a physics body per chaser; out of scope.

## Ruling on lap 1 (his, 03:5x, brief 157), after `handback/p-l180-lap1-C_2026-11-12.md` (WIP `l180-lap1` 4b30a43)
- **The source stays as written.** No lengthened half-lives and no knee.
- **The rate bar:** L173's 120°/s was the librarian's own number, set against 3,460°/s flips. It becomes **≤ 300°/s per frame** (ours, marked ours in the row). That is about twice the source's real-corner peak (144°/s) and an order under the flip class.
  - **First,** C traces the two non-corner excursions (19.34 s at 213°/s; 30.65 s standing) to their cause.
  - If they are a defect, fix it. If they are the source's off-feet decay (Overgrowth `:7927-7928`), say so with the line.
- **The straights flip row** (≤ 0.5/s; his run 0.68/s) becomes **L182's pass condition**. Its cause is D664's sway, in `chase/`. In lap 1 it is **reported, not gating**: the row stays in the suite, marked pending L182 by name.
- **Land lap 1** as L173 did, then show him stills and the charts, and the build.

## L182 (A, after L170 lands): take D664's sway out of the chase
- **Source:** A's L169 I4 (`handback/p-l169-code-A_2026-11-12.md`). NextBot has no path randomisation; L4D's variety is avoidance, the unoptimised path and animation. "The keeper's 'alive' does not come from randomness."
- **It changes the chase:**
  - the catch rates are measured (A's paired method, a price bar registered first);
  - the replays of old runs must still replay. Gate the change behind a version or dial (`wander` 0), the "0 = today's behaviour" rule, so his kept runs keep their fingerprints.
- **Pass:** L180's straights row, ≤ 0.5 flips/s on the bot's run under the new chase.

## Lap 1 landed: add21fe (librarian checked: origin/main = HEAD = add21fe; `launch.ps1 world -Check` → "up to date")
- **L182 grows by two causes C traced** (`handback/p-l180-lap1-C_2026-11-12.md`, "Landing"). Both are in `chase/`, so they are A's.
  - **A scraped step turns the velocity in one tick:** `chaser.cpp:394-418`, his run at 19.34 s, 213°/s.
  - **A refused step zeroes the speed in one tick:** `chaser.cpp:418-421`, at 30.65 s. The tilt pitches the hunter back to about −30° for about 0.3 s (estimated by C).
  - The sourced tilt draws them as written. The fix is the chase's: no instant velocity changes, under the same replay gating as the sway.

## L182 widened by his item 164 (04:18): the chase's lines. A, after L170 measures. Every step sourced.
His words: "gets caught on walls and door ways too much … able to turn way too fast keeping speed, it needs to find better lines to keep speed, not abusing little speed scrub on turning".
1. **A line with clearance, looking ahead** (A's L-I1):
   - Sources: NextBot's `m_minLookAheadRange` (`NextBotPathFollow.cpp:463-523`); DetourCrowd `optimizePathVisibility` / `calcSmoothSteerDirection` (`DetourPathCorridor.cpp:310-352`, `DetourCrowd.cpp:104-133`, zlib); Booth's slides 12-14 and 28.
   - The chaser aims down the path, off the corner's inside edge, so it enters wide and carries speed out. It no longer hugs the inside and scrapes.
2. **Pushed off walls before touching** (A's I3): NextBot `Avoid` (`NextBotPathFollow.cpp:874-1083`), two feelers left and right that rotate the goal away from a blocked side.
3. **A real turning limit at speed:**
   - A body at speed v cannot turn tighter than its sideways grip allows. Take the limit of speed against curve radius from a **cited human curve-running study**, for example Chang & Kram 2007, J Exp Biol 210, "Limitations to maximum running speed on flat curves". The pane reads it; the librarian has not.
   - The hunter's catch power then comes from the **line**, not from turning on the spot with a small scrub.
   - **Check against L170's P3** (`corner_floor_speed`, a floor on corner speed). P3 raises the speed held through a corner. **If P3 lands, it must not raise the turn rate at speed beyond the cited limit.** Read P3's arms with that in mind.
4. **The sway out, and no instant velocity changes** (as above, from his item 157 and C's L180 trace), behind a version or dial so kept runs still replay.
- **Tests (red first):**
  - wall contacts per minute (scrapes, refused steps) fall against the control in both 150-seed blocks;
  - the largest turn rate at each speed stays inside the cited curve-running limit;
  - the catch rate is reported against L170's bars, as a price, not a target: his complaint is how it moves, and the catch is read alongside.
  - His eye on a run is the last bar.

## Correction 2026-11-13 03:2x (C caught it, `handback/p-l191-arm-shape-C_2026-11-13.md`, last section)
- **Lap 2 step 4 cited Valve `NextBotBodyInterface.h:73` (`ENTINDEX_PLAYBACK_RATE`) for per-chaser variation. That flag is declared and never used in the public SDK** (C grepped 3,569 files at e1f1fd4).
- **What Valve does use:** a random rate per entity: `npc_antliongrub.cpp:627-628` ("Add some variation because we are often in large bunches", `RandomFloat(0.8, 1.2)`) and `npc_fastzombie.cpp:1642-1646` (0.9 to 1.1). The stride variation cites those.
