# Critic: the animation-system swarm against its own registration (2026-11-13)

1. Both design files plan against a main that moved: the stomp fix (their step 0) landed on origin/main d002b65 at 15:41.
2. Test "did nothing": does not fire. L1 and L2 were on the record in aim this morning; L3 was not; all three name a red
   on his kept run run-20261112-204506, but no red row in either file was ever run.
3. Test "re-derived": fires as written. 31 of 56 findings I counted in the system file were already in the hand-backs or
   the brief (55%); only 8 of those 31 were worked out again by a scout, the rest are cited from the ground files.
4. Test "item 153": fires. At least four mechanisms in the system file have no source and are not marked [ours].
5. Stop rule: four open questions change what gets built; the biggest is whether the grip law is on when L3 ships.

Critic, read-only, 2026-11-13. Marks: [read] I opened it (path:line); [summary] from a swarm file or a secondary
account; [inferred] mine; [ours] a proposal. Short names: SYS `00_system.md`, BP `00_build_path.md`, GC/GL/GP/GR/GS/GW
the ground files, S-xxx the scouts as SYS names them, all in this folder. `hb/` = `exo_memory/handback/`, `brief` =
`exo_memory/briefs/dreamzone2_the_game.md`. Game code: dreamzone-3, local `main` 31d1c6d and `origin/main` d002b65,
read with `git show`; branch `origin/l182-hawk`. Nothing built or run; no outside request made.

## 1. Errors still standing after the second readers

- **E1. Both files are written against a stale main.** Local `main` is 31d1c6d [read: `git log -1 main`], but
  `origin/main` is d002b65, "Merge l205-stomp-c (C, L205) by pane E, landing", 15:41 [read: `git log -1 origin/main`],
  and ccc65ab is an ancestor of it [read: `git merge-base --is-ancestor`]. d8ef536 (o-run-frame) landed before it
  [read: `git log --first-parent 31d1c6d..origin/main`]. So BP's "Step 0: the stomp fix lands" (BP:154-157) is done,
  and BP and SYS were written at 16:06-16:07 [read: `ls -la`]. The brief already says so: "The game's main `d002b65`
  holds the run's frame and the stomp fix" [read: brief:1617]. Cited lines drift: `world_app.cpp:534` is now :560 and
  :582 is :608 [read: `git show origin/main:game/world/world_app.cpp`]. The facts behind them still hold on d002b65:
  the frame-summed phase (`stage.cpp:269`), the first-hunter rule (:283), the tilt target (`model_rig.cpp:510`), the
  pelvis aim (:244), the bank shares (`model_rig.h:134-136`), Dark's 0 slots (`figures.h:28`) [read, origin/main].
- **E2. L8's P3 red now belongs to main.** BP:382-388's second reader moved the 105-108 mm toe sink to the branch only;
  the branch's roll code is now on origin/main (`model_rig.cpp:815`, `:836`, `motion.legs.roll`) [read]. P3's red must
  be re-measured on d002b65, not "after step 0 lands".
- **E3. SYS contradicts itself on where L3's lean is made.** SYS:57-60 says L3 is "one roll and one pitch of the whole
  body about its feet". SYS:263 says "L3's lateral target becomes atan(min(|a|, mu g)/g) behind a switch" inside
  `DrawnChaser::step`. That target feeds the chain, which turns hips and trunk about the PELVIS: `p[j] = pelvis +
  tilted(...)` [read: 31d1c6d `game/model_rig.cpp:626`, :629], and the feet move only the 10 cm offset (:428-435)
  [read]. A new tilt target therefore cannot give a lean about the feet. SYS's second reader flagged the missing
  argument (SYS:263) but not this. BP's second reader reached the same mechanism for BP's L3 (BP:230-243) [summary].
- **E4. SYS registers a head row that changes the hunter's head before his call.** SYS:413 lists `at_a_run_the_head_
  turns_about_a_quarter_as_far_as_the_shoulders`, bar 0.12-0.39, "red today: 0.55 by construction". Building it green
  moves the hunter off 0.55. SYS:206 keeps "`head_yaw_share` 0.55 until his clip", BP:819-821 makes it his call 6 with
  0.55 kept, and BP:738-739 leaves it out of the path [read, all three]. The row should be a report, not a gate.
- **E5. BP says L2's mechanism is new; it was on the record.** BP:112-113: "The conclusion was C's note of 11-12; the
  mechanism is new". C's note already names the cause: "spine_01 and spine_02 share one aim with the pelvis bone
  (`standard_aims`, Pelvis to Chest)" [read: hb/p-l180-lap2-C_2026-11-12.md:121-122]. What is new is the remedy (frame
  the pelvis bone by the hips' line, no new joint), which disagrees with C's "Splitting them needs new joints in
  `game/body.h`" (:123-124) [read]. BP's second reader repeats the error (BP:894) [read].
- **E6. SYS's second reader calls a non-gap "the one gap that blocks a lap"** (SYS:593, and SYS:185-188). On the l182
  branches the human law H1 never allows more than 1 g sideways: `return std::max(r_eqn, v * v / g);` [read:
  origin/l182-hawk `chase/chaser.cpp:246`], so the turn rate is capped at speed / (v^2/g) (:252) [read], and
  lateral acceleration v x rate <= g [inferred, arithmetic]. With `turn_law` 3 every lesser kind is H1 (:210) [read],
  so atan(min(a, 1 g)/g) equals atan(a/g) for them and no per-kind mu is needed. The gap is real only with the law off,
  as on main today, where the sim asks up to about 2.1 g [summary: S-turn:16-21]. That is a question (section 9), not a
  missing value.
- **E7. Mark errors in SYS: proposals cited as [read].** SYS:110-114 cites the picture-only rules as [read:
  S-perf:171-196]; the scout heads them "### 3a. One picture clock ... [ours, ...]" and "### 3b ... [ours]" [read:
  scout_performance_and_determinism.md:171, :183]. SYS:474-475 and SYS:178 cite the drop order and tiers as [read:
  S-perf:198-221, :218-221]; the scout heads that section "[ours unless marked]" and marks T3, T4 ours (:198, :208-209)
  [read]. SYS:266 cites "shares become angles IN SPACE" as [read: S-turn:442-444]; those lines are S-turn's second
  reader's list of mechanisms with no source (scout_turning_and_transients.md:440-444) [read].
- **E8. BP's L3 report line keeps the test skeleton.** BP:266-268 gives the outside foot "0.70 m out at 45 degrees
  with a 0.984 m leg"; SYS's second reader recomputed 0.85-0.96 m at the hunter's 1.196 m (SYS:202-205) [read]. BP's
  number is the test skeleton's, which BP:130-131 itself says is not the hunter [read].
- **E9. The L185 physics commits are not where the brief says.** brief:1601 names "branch `l185-skeleton` 2767855";
  2767855, 2373283 and 8d41f04 are absent from this repository [read: `git cat-file -e`], and `origin/l185-skeleton` is
  b226b95 [read]. BP:66-70's note holds; SYS:71 ("Built green on E's local clone only") is right.

## 2. Where the two files disagree, and which the primary supports

| topic | SYS | BP | primary I opened | supports |
|---|---|---|---|---|
| who owns mu | the sim; the picture holds none (SYS:180-181) | "a per-kind number read by the picture" (BP:248-249); mu in the kind table (BP:334) | one dial `grip_mu`, H2 only (origin/l182-hawk `chase/speed.h:41`, `run.cpp:309`); H1 capped at 1 g (`chaser.cpp:246`) [read] | SYS on ownership; BP's picture mu of 1.0 is redundant once the law is on [inferred] |
| L3's composition | target inside `DrawnChaser` (SYS:263) vs roll about feet (SYS:57-60) | roll by law minus drawn tilt about `feet` (BP:221-222) | chain pivots at the pelvis (`model_rig.cpp:626`, :629) [read] | neither as written; BP's second reader's "roll by the law about the feet, chain on top" (BP:240) |
| transition half-life | 0.1 s, Holden's demo (SYS:154) | 0.06 s, the player's settle time (BP:445) | `kSettleTime` 0.06 s [summary: GC:171]; Holden's 0.1 s is mocap at 60 Hz [summary: S-mm:170] | neither is sourced for a chaser; his eye (BP:462 shows both) |
| hunter's head share | row gating 0.12-0.39 (SYS:413) and 0.55 kept (SYS:206) | 0.55 kept, his call 6 (BP:819-821) | brief:1154, the record of his pick, "its head stays humanlike" [read] | BP; the primary does not settle 0.55 against 0.26 |
| first lesser kind | the interceptor worked as the example (SYS:211-224) | interceptor by default (BP:809-818) | the morning path put the sprinter first (`loop/buildpath_entity_bodies_2026-11-13.md:50-55`); his pick "Decide kind by kind" (brief:1272, per GW:568) [read; summary] | neither; it is his |
| kept runs | "his 16" via GR (SYS:373-374) | 20 in `game/runs`, git-ignored (BP:47-52) | 40 files in `game/runs`, `.txt` and `.dzr` pairs; run-20261112-204506 among them [read: `ls`] | BP's second reader |
| step 0 | "after it lands" (SYS:286-287) | lands next (BP:154-157) | landed, d002b65 [read: git] | neither |
| L2's novelty | "pelvis framed by its hips' line" (SYS:269) | "mechanism is new" (BP:112-113) | p-l180-lap2-C:121-125 [read] | the cause is on record; the remedy is new |

## 3. Claims a build would rest on that have one source only

All [summary] from the scout files after their second readers, unless marked.
- L3: the trunk's bank share 0.89 rests on Churchill 2011 alone, seven sprinters on one bend of unstated radius
  (S-turn:111-114, :1-6). The grip 1.33 is a press figure for a cheetah (GL:125-126); the 1.31 a/g is one inference
  from one greyhound abstract (S-turn:133-136). The sim's 2.1 g is one reading of main's dials (S-turn:16-21).
- L2: the remedy rests on one rule, the room's own `game/skeleton.cpp:75-80` [read], which carries no outside source;
  its comment cites a 2.8 cm measurement of L185 step 2 [read: :76-78].
- L8: the 20 mm slide bar rests on Pražák 2011's abstract only (S-eval:79-85); the 5 mm sink bar on PhysDiff alone
  (S-eval:96-99).
- L9: the lock's 0.20 m release and 0.015 m reach buffer rest on one demo, Holden's `controller.cpp`, whose floor is
  y = 0 (S-ik:134-148); the slide it fixes was swept on limb lengths that are not the hunter's (BP:415-416).
- L17: rotation-only head hold rests on pigeons standing on a moving perch (S-head:106-112); the 0.91 rad reach on one
  game's head clamp (S-head:199).
- L19: the hips' 45 degrees and 720 degrees a second come through a WIP commit, Valve "via the WIP, not opened"
  (SYS:233).
- L27: the landing depth rests on Verniba 2017 alone, and only to 0.44 m (S-trav:180-188, :277); the return spring on
  Overgrowth's crouch alone (S-og:89-92).
- L29: the stalk rests on Spoor & Belterman 1986, one hyena paper (S-gait:248); the rise to upright on a lizard source
  with the mass the other way (S-gait:306-312).
- The head share 0.26 rests on Pontzer 2009 at 3.0 m/s only (S-head:14-16, :74-75).
- Costs: GPU per vertex from one measure of two models (GR:24-27); picture physics from one Jolt benchmark chart of
  another scene (SYS:440-450).
- "Numbers do not decide the look": one study of text-to-motion, not game locomotion (SYS:399-401).

## 4. What is still unread or untested

- No red row in either file was run. Every "red today" is a reading or arithmetic (BP:16; SYS:403) [read].
- Two rows cannot be run red on main as written: L5 and L6 need the renderer (BP:317-322, :350-354) [read]. L3's row
  needs `LeanFrame` to keep the posed joints first (BP:242-243) [read; the struct is at origin/main
  `world_app_tests.cpp:909`].
- Nothing was timed: no CPU pose cost, no picture-physics cost (R4.7 never ran), no GPU cost of a third body (SYS:423,
  :440-450) [read].
- With the grip law on, replays are not bit-identical across C libraries: "std::pow is used, so with the law on a run is
  not bit-identical across libms" [read: origin/l182-hawk `chase/chaser.cpp:240`]. Neither file names this for L4.
- Which gravity the player's lean uses: the world rises at 23.4 and falls at 37.5 m/s^2 (SYS:237-240) [summary];
  `fall_gravity_mult` 1.6 [read: origin/main `sim/params.h:61`].
- Unread primaries named by the files: Usherwood & Wilson 2005 and Wilson 2013 in full (BP:785-786), a landing study
  above 0.44 m (BP:787-788), any ladder gait study (BP:789-790), Hildebrand (BP:791-792), Valve's hip numbers (SYS:233).
- No human band for C2, C3, C4 (SYS:354-355); no measured human lean near 42 degrees (BP:119-120) [read].
- The registered "size" test is already missed on paper: L16 touches files outside BP's own bar (BP:846-847) [read].
- E's clone (L185 steps 4-5), the GLBs, the kept runs' contents (no count of drops, wall stops, overtime) [summary:
  BP:861-862].
- Does the sim read the picture's eye (L23)? The chase computes its own: `player_eye(p)` = position + 1.65 m [read:
  origin/main `chase/run.cpp:98`]. So L23 cannot reach the chase through that path [inferred]; G1 still owed.

## 5. The registered tests: "did nothing"

**Could BP's first three laps have been written this morning from the room's own hand-backs?**
- L1 FAIR-CLIP: yes in aim. The faults were filed this morning: "The look-back passes do not show the hunter" [read:
  hb/p-l195-arm-variants-C_2026-11-13.md:110]; clips "at 12 frames a second" [read: hb/p-l205-stomp-C_2026-11-13.md:105].
  The ruling to film "at full frame rate and lit" came at 14:4x [read: brief:1606]. New: the code facts (every 12th
  frame of a 1/144 s step, no manifest, no refusal) [summary: S-auth:409-410].
- L2 PELVIS-FRAME: yes, conclusion and cause, since 11-12: "the pelvis mesh, weighted to the pelvis bone, banks at the
  trunk's 0.35 and not the hips' 1.0. Unchecked by eye." [read: hb/p-l180-lap2-C_2026-11-12.md:125-126]. New: the
  remedy without new joints, and its side effect (the lost forward pitch, BP:194-201) [read].
- L3 BODY-LEAN: no. Its aim entered the record only this afternoon, as two seats' readings: the Third Place's at 14:34
  and the librarian's under item 217 [read: brief:1597, :1611]. No animation hand-back has the comparison: 0 files hit
  "atan(mu", "atan(a/g", "whole-body lean", "feet under the hips" among the 158 hand-backs of 11-11 to 11-13 [read:
  grep]. The morning entity path has no lean lap at all [read: `loop/buildpath_entity_bodies_2026-11-13.md:50-66`].

**Does each lap have a first failing row on a recorded case of his?** Each of L1, L2 and L3 names his kept run
`run-20261112-204506` [read: BP:174, :206, :253], which exists in `game/runs` [read: `ls`], with the lean hook
`DZ_LEAN_RUN` at origin/main `world_app_tests.cpp:1035` [read]. L4 names "his kept run's inputs" (BP:291). But every
such red is by reading; none was run, and L1's needs the D3D12 capture tool [summary: BP:174-178].

**Verdict:** the falsifier needs both halves; neither holds for all three laps, so it does not fire. Said without
softening: two of the three opening laps were on the record in aim by this morning, and the swarm's own proof that its
laps fail first on his case is still unrun.

## 6. The re-derivation count

Set: every statement of fact in SYS (not a proposal) that a lap depends on, one per finding; 56 in all [ours, as
the method]. "On record" = in an animation hand-back of 11-11 to 11-13 or the brief. Record lines I opened are [read];
those I take from a ground file's citation are [summary].

**On record, 31:**

| # | SYS line | finding | record line |
|---|---|---|---|
| 1 | 62-63 | the chain poses the hunter only | hb/p-l180-lap2-C:33 [summary GC:70-71; grep read] |
| 2 | 65-66 | the player inertializes, first order | hb/p-l161-body-C:60 [read] |
| 3 | 68-69 | floor probe and hip sink; player's held foot | hb/p-l161-body-C:47 [read]; hb/p-l169-anim-C:131 [read] |
| 4 | 71 | picture physics green on E's clone only | hb/p-l185-steps4-5-E:12 [summary GP:5]; brief:1601 [read] |
| 5-13 | 143-151 | stride law; Fukuchi legs; Dorn and two hip laws; Bruening arms; twist 6.5/14.28; ozz look spread; Valve rates; Overgrowth tilt; follow springs | p-l187:29-33; p-l200:72-74; p-l205:32-35; p-l191:25, :33-36; p-l180-lap2:150-157; p-l180-lap1:22, :18-19, :11-12; p-l180-lap2:129-170 [summary GL, GS] |
| 14 | 157 | climb by Overgrowth's grips, staggered phases, sine arcs | hb/p-l176-openanim-C:136 [read]; brief:1113 [summary GW:331-334] |
| 15 | 170 | head bank -0.30, first game | brief:1591 [read] |
| 16 | 174 | take-off knee 15 or 25 | brief:1588 [read]; p-l205:46-51 [summary GL:111] |
| 17 | 175 | soft key tau; hands 13 cm | brief:1601 [read]; p-l185-steps4-5-E:36 [summary GP:90] |
| 18 | 177, 241 | the player's steps do not use Alexander's law | p-l187:263 [summary GL:79-80] |
| 19 | 247-249 | T3 needs a spine joint | brief:1154 [read] |
| 20 | 250 | T4 may read ordinary | p-l187:159 [summary GL:161] |
| 21 | 328, 353 | the yardstick cannot score above 4.5 m/s or a bend | p-l193:196-201 [summary GL:212-213] |
| 22 | 373-374 | 14 old kept runs miss their fingerprints | p-l185-steps4-5-E:108 [summary GR:51-53] |
| 23 | 277 | capture at 12 a second; look-behind shows walls | p-l195:110, p-l205:105, brief:1601 [read] |
| 24 | 452 | two models +0.39 / +0.48 ms | p-d663-loader-C:134-139 [summary GR:24-27] |
| 25 | 423 | nothing per character was ever timed; R4.7 not run | p-l185-steps4-5-E:120-128 [summary GP:259] |
| 26 | 488 | MPFB assets CC0 | hb/p-d659-blender-A:203 [read]; p-d659-models-E:132 [summary GR:101] |
| 27 | 518 | LAFAN1 never usable | p-l176-openanim-C:24 [summary GS:191] |
| 28 | 534-536 | motion matching left out for want of data | p-l169-anim-C:144 [summary GS:74-75] |
| 29 | 539-540 | running stays kinematic; motors stopped red | p-l183:45-46; p-l185-step4-E:16-18 [summary GP:72, :158] |
| 30 | 180-188 | one grip dial, H2 only | hb/p-l182-lines-A:20, :83 [read] |
| 31 | 269 | the pelvis bone banks at the trunk's 0.35 | hb/p-l180-lap2-C:121-126 [read]; brief:1596 [read] |

**Not on record, 25** (SYS line): frame-summed stride differs by rate and runs paused (50-52); drawn lean a sixth of
the law, feet under the hips (59-60); any MPFB model posed by one Rig, from code (73); reduced-rate posing loses
pixel history (114); Holden's lock edges (152); reach buffer 0.015 m (153); half-life 0.1 s (154); Verniba (155);
Overgrowth's crouch spring (156); Churchill 0.89 (169); Pontzer 0.26 (171); rotation-only bird hold (172); hip height
1.196 m (193-195); the lean at mu 1.0/1.33 (199-201); the player's `3 + 9 x pace` lean, from code (236); Dark drawn by
nothing (251-252); 2.1 g (364-367); L3 also leans the human base (361-363); 17 ms translational hold (339-340);
the 72% study (399-401); Pražák 21 mm (317-318); the Jolt pile figure (440-443); CREDITS names no animation source
(509-513); ladders with no rungs (557-558); drawn standing through a drop (412). Greps for their key terms over the
158 hand-backs and the brief return 0 for Churchill, Verniba, Spoor, Pražák, PhysDiff, pigeon, 1.196, "no rungs",
MotionCritic [read: grep]; the others are code facts no hand-back states [inferred from the same greps].

**Share: 31 of 56, 55%.** Above the registered quarter, so the test fires. Two facts beside it, kept apart from the
verdict: ten of the 31 are the landed laws SYS re-states on purpose as its base (rows 5-13, 15); without them it is 21
of 46, 46%, still above. And only 8 of the 31 were worked out again by a scout instead of cited from a ground file
(rows 2, 3, 14, 18, 19, 28, 29, 31) [read: SYS's own cites at those lines], 14% of 56. The registered word is
"re-derived"; what the count measures is mostly restatement with a citation [inferred].

## 7. The rule of item 153: mechanisms with no source not marked [ours]

The registered test fires. Unmarked in SYS after its second reader's in-place notes:
1. L3 rolls the WHOLE body about the feet, the pelvis taking 1.0 of the lean (SYS:57-60). Physics fixes only the line
   from the feet to the centre of mass; SYS's second reader lists it (SYS:648-649) but put no note at :57-60 [read].
2. The picture-only rules P1-P5, cited [read] at SYS:110-114, are the scout's [ours] (E7).
3. The tiers, the 10% rank hysteresis and the drop order, cited [read] at SYS:178 and :474-475 (E7).
4. "Shares become angles IN SPACE" (SYS:266), cited [read] to a list of unsourced mechanisms (E7).
5. The pelvis framed by its hips' line (SYS:269): its only source is the room's own `skeleton.cpp:75-80` [read], a rule
   made for a skeleton that has a lower spine joint to carry the trunk; `Rig::palette` has none [summary: BP:194-201].
Marked in place by SYS's second reader and so not counted: the L5 trigger and position decay (SYS:154), `head_hold`'s
re-fix (:172), `rhythm` (:167), the pack clock (:249-250), the shimmy timing (:157), the Dark box slot (:272), the
parse-error line (:126-129), g for the player (:237-240), the "main lever" (:445-450) [read].

## 8. What the owner should hear, in ten lines

1. Found: the hunter's drawn lean in a corner is about a sixth of what its speed and the bend ask, and its feet stay
   under its hips. That may be much of why the corner reads human. Found by reading the code; not yet shown in a clip.
2. Found: the hips' skin follows the chest's small share of the bank because of how one bone is aimed. C suspected it
   on 11-12; the swarm found a fix with no new joint, which would also stand the waist upright on straights unless kept.
3. Found: the hunter's stride is timed by the screen's frames, so it differs at 144 and 360 Hz and keeps running paused.
4. Found: the hunter is drawn standing through drops and ladders, ladders have no rungs to grip, and the dark one is
   drawn by nothing in overtime.
5. Found, at the papers and code: numbers for landing depth, for feet held where they land, for the torso in a bank
   (one study), for the head at a run (measured only to 3 m/s), and that a bird holds its head's turn, not its place.
6. Found: the clip tool saves one frame in twelve and records no build or run; the first lap fixes that before any clip.
7. Not new: over half of what the system states was already in the room's own hand-backs, mostly cited, not redone.
8. Not settled: whether the grip law is switched on (it decides how far the hunter may lean), which gravity the kid's
   lean uses, which lesser kind gets a body first, and the hunter's head at a sprint. Each is his call or his eye's.
9. Not settled: no cost of the extra bodies or of the arm physics was measured, and no failing row was run.
10. Already done: the stomp fix landed on main at 15:41, so the plan's first step is behind it.

## 9. The stop rule: open questions whose answer changes what gets built

- **Q1. Is the grip law on (`turn_law` 3) when L3 ships?** On: the hunter's lean is capped by its one dial, every
  lesser kind is held under 1 g by H1 (`chaser.cpp:246`) [read], L3 needs no per-kind mu and L4 lands before L3. Off:
  the sim asks up to about 2.1 g [summary: S-turn:16-21]; the drawn lean must either pass 60 degrees or lag the path,
  and BP's per-kind picture mu (BP:248) must be built or dropped. Cheapest answer: his call 4 (BP:806-808), one word.
- **Q2. Which g does the kid's lean use?** 9.81 against the world's 23.4 rising and 37.5 falling [summary: SYS:237-240].
  At 9.8 m/s^2 sideways that is 45, 23 or 15 degrees [inferred, arithmetic]. It sets L21's whole size. Cheapest: one
  first-person bend clip at two values, his eye.
- **Q3. Which lesser kind first?** Interceptor: L15-L17 as written, the cue is a head setting. Sprinter: its model exists
  outside the repository [summary: GR:90-91], but its cue needs a pitch channel nobody sourced [summary: S-model:247-251],
  so L17 becomes a new joint lap. Cheapest: ask him with both defaults side by side (BP:816-818).
- **Q4. Does the picture physics fit the frame?** If R4.7 on the shared world with four active bodies is small, L12
  ships for the hunter and the T1 pair; if not, physics stays on the hunter alone and tier A loses it. Cheapest: one
  `DZ_BENCH=1` run of R4.7 on a quiet machine [summary: GP:195], when he is not playing.
Not stop questions, because the primary already answers them: L3's composition (roll by the law about the feet, chain
on top; E3) and L2's pitch (keep it; BP:194-201).

## 10. Five checks before building anything from this folder

1. Re-base every cite to origin/main d002b65; re-measure L8's P3 sink there; drop step 0 [read: E1, E2].
2. Rewrite L3 once, in one file: roll by the capped law about `feet`, chain on top; the row's denominator names its mu
   and law; strike SYS:263's tilt-target form and BP's per-kind picture mu unless Q1 answers "off" [read: E3, E6].
3. Run every "red today" row on the base and print its number before code; move L5's and L6's code first where a test
   cannot reach it; extend `LeanFrame` for L3 [read: BP:317-322, :350-354; origin/main `world_app_tests.cpp:909`].
4. Copy the kept runs into each worktree (they are git-ignored) and name the set replayed (20 now); for L4 add that
   with the law on a run is not bit-identical across libms (`chaser.cpp:240`) [read].
5. Settle the section 2 table (mu, half-life, the head row as a report, first kind, kept runs) and mark section 7's five
   mechanisms [ours] before a builder reads either file; add CREDITS lines for fitted CC BY sources, Fukuchi first
   [summary: SYS:509-513].

## What I did not open

- Any outside source, paper, licence text or web page: every outside claim above is as the scouts and their second
  readers left it.
- The scout files' bodies, except S-perf:86-94 and :171-221 and S-turn:440-450; of each scout's second-reader section I
  read the opening and method lines only, not every row.
- GW beyond lines 1-40 and 300-789; the hand-backs except the lines cited [read]; the morning build paths beyond
  `buildpath_entity_bodies:1-3, :40-66` and a grep of three others; `third_place/`; `animation-system.workflow.js`.
- Game code beyond the lines cited; E's clone; the worktrees; the GLBs; the kept runs' contents.
- Nothing built, run or timed. One `git fetch --dry-run` was issued while checking branches; it printed nothing and
  changes nothing.
