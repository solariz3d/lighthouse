# p-l193-yardstick-E: L193, real motion as the yardstick: today's bodies scored against recorded runners, joint by joint. Pane E, on L, 2026-11-13, written from 04:3x local (`date`)

**Packets:**
- the chair's L193 packet, 08:49:51Z (delivered 09:46:58Z, after the 403);
- its first two rows, 09:20:07Z;
- the order, 09:37:27Z: L193 first, then the L185 proof (since landed, 682e699), then the voice swap.

**Plan:** `exo_memory/loop/plan_l193_motion_yardstick_2026-11-13.md` (560cb1ee), read whole.
**Branch:** `l193-yardstick` at **`b90eda9`** in worktree `Downloads\dz3-wt-l193-yard` (made by git, links 0), off origin/main
`04f3882`. Pushed as a backup. **Not landed:** it is a tool and lands when the chair says.
**Touched:** `tools/CMakeLists.txt`, plus new files in `tools/yardstick/`:
- `joint_angles.{h,cpp}`, `reference.{h,cpp}`, `acclaim.{h,cpp}`, `main.cpp`, `yardstick_tests.cpp`;
- `fetch_fukuchi.ps1`, `fetch_cmu.ps1`, `README.md`.

Nothing in `game/`: C's `gait_pose` is driven read-only through its own function. There is no code map in dreamzone-3.
**Tier:** prove it (a measuring tool).
**Data:** in `Downloads\dz3-yardstick-data\` (outside every repository), fetched by the two scripts, checksums pinned.

## For his eye (the review packet)

- **The hunter's legs:** against 39 recorded runners (2.5 to 4.5 m/s), its knee hardly bends. It peaks at 37° in the
  swing where they reach 107°, and it stays straight under load where they bend about 40°. Its foot stays level
  whatever the leg does.
- **The hunter's arms:** against CMU's three runners (2.7 to 4.15 m/s), its elbows are about 46° straighter than
  theirs (57° against 103°). Its arms swing as far as theirs, but centred, where theirs sit back.
- **Look at:** `Downloads\dz3-l193-review\table_legs_b90eda9.txt` and `table_arms_b90eda9.txt`. The contact sheet
  (skeletons side by side) is not built yet (§6).

## 1. What was read, and what each gave

| source | read | what it gave |
|---|---|---|
| Fukuchi, Fukuchi & Duarte 2017, PeerJ 5:e3298 | in full (Europe PMC PMC5426356, CC BY) | 28 runners on a treadmill at 2.5, 3.5 and 4.5 m/s. "Cardan angles, with the distal segment expressed relative to the proximal segment", Z (medial-lateral) first = flexion, then ab/adduction, then rotation; ISB axes (X forward, Y up, Z right). 101 points per cycle from foot strike, each runner "averaged across trials", over 30 footfalls; strike and toe-off at a vertical force of 20 N |
| its data, figshare doi 10.6084/m9.figshare.4543435 v5 | the API record and 39 `RBDS*processed.txt` | licence **CC BY 4.0** (the API's own line; the plan had it as not verified). Each file was checked against figshare's MD5 (the second `RBDSinfo.txt` of two in the article matched the first's checksum). The force is NaN while the foot is off the plate; 8 runners have no 2.5 m/s run and 8 none at 4.5 |
| CMU Graphics Lab Motion Capture Database | home page, FAQ, search index (curl, TLS verified) | the terms, verbatim: "free for use in research projects. You may include this data in commercially-sold products, but you may not resell this data directly, even in converted form"; the acknowledgement it asks. Units × (1/0.45)·2.54/100 = 0.056444 m, 120 Hz. **The sidestep and backward clips exist** (the plan had them as not verified): 83_xx "sidestep", mostly onto or off a ledge; 69_34..55 "walk backwards and turn"; 69_50 "walk sideways and backwards" |
| CMU's own ASF/AMC viewer, mocapPlayer rev. 3 (Barbic & Zhao, USC 2012) | `skeleton.cpp:333-426`, `displaySkeleton.cpp:128-310`, `transform.cpp:74-130` | the forward kinematics, restated in `acclaim.h` with its lines named: frame C = Rz·Ry·Rx of the ASF axis; dir_local = C⁻¹·dir; root T·Rz·Ry·Rx; child = parent·C_p⁻¹·C_c·Rz·Ry·Rx. No licence file; nothing was copied |
| C's `gait_pose` (`game/model_rig.cpp:680-714`), read only | the leg code | why each leg number is what it is (§3) |
| C's L191 hand-back (51475110) `:12-19`, `:39-46` | the chair's two rows | the arm constants and the two readings to check (§4) |

**Fan-out:** one subagent fetched the 37 CMU files and measured each clip's speed from its root channel. It started no
build and wrote nothing in a repository. Its manifest (sha256 per file) and `SPEEDS.tsv` are beside the data, and it
found three things checked against the files:
- 09_10 starts with 4 frames whose root channels are all zero;
- 35_22 holds frame 156's pose through frame 167;
- 16_55 and 16_56 speed up through the clip.

The tool drops the first two kinds of frame, and those two clips are left out.

## 2. What was built (tools/yardstick, outside the shipped game)

- **`joint_angles`:**
  - Segment frames are built from our joints as the lab built them from markers: pelvis from the hips and up; thigh,
    shank and foot from their joints.
  - The legs read Cardan Z-X-Y; hip flexion, knee flexion and ankle dorsiflexion are positive, as the paper's tables
    have them.
  - Arms: the shoulder's forward swing and its swing out to the side against the trunk, the elbow's bend (0 straight,
    as C counts it), and the hand's height over the head. The arm definitions are ours.
  - Handedness comes from the pose's own axes, because CMU's world need not be handed as ours is.
- **`reference`:** Fukuchi's curves per speed, the runners' mean and spread, and a score: the RMS over the cycle, and
  the lag at which ours fits best. Each runner's stance is read from the vertical force over 0.3 N/kg, which is about
  20 N for 67 kg (ours).
- **`acclaim`:** CMU's ASF/AMC is read and posed (above), and its bone ends are mapped onto our 21 joints (the map is
  named in the file, ours).
- **`dz-yardstick`:** prints the tables (`--data` the legs, `--cmu --clips` the arms) and writes nothing.

## 3. Its own tests (registered before each ran; no data needed): 10 tests, 0 failed

checked: `build\bin\yardstick_tests.exe` at b90eda9 → **10 tests, 0 failed**:
- a leg posed at known angles (60 combinations) reads them back (0.0000 deg off);
- turned 1.1 rad and carried 40 m, the same (0.0003);
- a curve against itself reads 0;
- a curve ten points late is found ten points late;
- a CMU bone at rest points along its ASF direction, and turned by its channel turns about its own axis carrying its
  child (0.0000000 m);
- an arm at known angles reads them back (0.0198 deg), and swung up reads its hand over the head;
- a pose in a world handed the other way reads the same;
- a thigh flexed then turned out reads 40 and 15 in the reference's order;
- the loader leaves out a speed not run and reads the swing's NaN force as foot up.

**The plan's self-check, on real data** (`table_arms_b90eda9.txt`): CMU 09_01 against itself reads **0.000 deg**. The
same clip with its arms pinned to its sides (his item 177 at its extreme) reads **swing 20.4, out to the side 10.4,
elbow 89.1 deg** of RMS error.

## 4. THE TABLE: today's bodies, scored before any fix (the work list for B and C, worst first)

checked: `dz-yardstick.exe --data …\fukuchi2017` → `Downloads\dz3-l193-review\table_legs_b90eda9.txt`;
`dz-yardstick.exe --cmu …\cmu --clips <the 25>` → `table_arms_b90eda9.txt`.

**The hunter's legs** (gait_pose, straight, no lean), against Fukuchi's runners. Flexion is in degrees from our own
standing pose. "sd" is the runners' own spread, averaged over the cycle. "late" is how far ours lags where it fits
best, in % of the cycle.

| m/s | joint | rms | runners' sd | rms/sd | ours (min to max) | runners' mean (min to max) | late |
|---|---|---|---|---|---|---|---|
| 3.5 | **knee** | **42.5** | 8.0 | **5.3** | 0 to 37 | 11 to 108 | 7 |
| 3.5 | **ankle** | 33.3 | 5.8 | **5.7** | -19 to 43 | -21 to 24 | **-45** |
| 3.5 | hip | 26.9 | 5.3 | 5.1 | -20 to 24 | -6 to 53 | 10 |
| 4.5 | knee | 43.1 | 9.4 | 4.6 | 0 to 47 | 12 to 117 | 7 |
| 4.5 | ankle | 40.4 | 5.7 | 7.1 | -22 to 54 | -25 to 23 | -43 |
| 4.5 | hip | 29.9 | 6.6 | 4.5 | -23 to 29 | -10 to 60 | 11 |

The 2.5 m/s rows read the same way and are in the file. **Foot down**, from the force: the runners' foot is down
**36%** of the cycle at 3.5 m/s (sd 2), 40% at 2.5 and 34% at 4.5. Our stand-in, the ankle within 1 cm of its lowest,
reads 12%.

**Why, from the code** (`model_rig.cpp`, C's):
1. **The knee** (worst, 5.3 runner-sds):
   - **in stance it does not bend.** It holds 0.08 rad (4.6°) while the foot is down (`:704-705`, the bend is
     `max(0, ∓cos phase)`), where runners bend to about 40° at 10-20% of the cycle;
   - **in swing it bends too little:** 0.08 + 1.1·run rad with run = speed/6 (`:688`, `:705`): 37° from standing at
     3.5 m/s, against 107°.
2. **The ankle:** the toe is placed at the rest offset in the body's frame (`:714`), so **the foot stays level** whatever
   the shank does. Relative to the shank it reads as dorsiflexion while the leg is behind, half a cycle out of phase
   with the runners. They dorsiflex in stance (24°) and plantarflex at toe-off (-21°).
3. **The hip:** the swing is ±(0.12 + 0.45·run) rad (`:702`), ±22° at 3.5 m/s, centred on vertical; the runners go -6
   to +53°. Part of that is the frames: their pelvis is anatomical (it tilts forward), ours takes the body's up, so
   **read the range and the lag, not the offset.** Ours covers 44° of their 59°, 10% of the cycle late.
4. **Above 6 m/s, run = speed/6 stops at 1** (`:688`), so the leg's shape stops changing. The knee then peaks at
   63° from standing at every speed up to the hunter's 13 m/s.

**The hunter's arms** (gait_pose's right arm), against CMU's running clips, each at the clip's own speed:

| | recorded (25 clips, 2.67 to 4.15 m/s) | ours at the same speeds |
|---|---|---|
| **elbow, mean over the stride** | **103° (sd 10.4 over clips)**; the three runners 93°, 118°, 108° (sd 12.4 between them) | **56-58°**: **46.5° straighter** on average (sd 11.6 over clips) |
| shoulder, back of the swing | **-34.4° (sd 3.7)** | -22° |
| shoulder, front of the swing | **+7.8° (sd 7.0)** | +25° |
| swing range | 42.2° (sd 7.5) | 47° |

So ours swings as far but **about 15° too far forward and 12° too little back**, around a much straighter elbow.

**Tolerances (registered here, from the references' own spread, not invented):**
- a leg joint passes when its RMS from the runners' mean is no more than the runners' own spread (rms/sd ≤ 1);
  - **AMENDED 2026-11-13 04:4x local, before anyone tuned to it** (the chair's 10:40Z ask). As written, this bar
    contradicted point 3 above, which says to read the hip's range and lag, not its offset. **The hip is held to its
    RMS with each curve's own mean removed** (the offset taken out), at most the runners' sd.
  - The hip's mean offset is reported, not gated. It cannot be separated from the pelvis frames: theirs is anatomical
    and tilts forward, ours takes the body's up. How much is frames is not measured (inferred).
  - **The knee and ankle keep the plain RMS:** they are measured between our own two segments, with no pelvis frame.
  - This is a registered change to the tool, built once its mutant run ends; its numbers are added here.
- the elbow mean, within one between-runner sd (12.4°) of the recorded mean at the clip's speed;
- each end of the shoulder swing, within one sd over clips (3.7° back, 7.0° front).

**The arm figures rest on three runners**, so they are weak. Say so to whoever tunes to them.

## 5. The chair's two rows (from C's L191 sheet, as the librarian read it)

1. **"At the hunter's 10 m/s the front hand rises above the head."**
   - **The yardstick does not cover it:** no recorded runner here goes faster than 4.15 m/s (CMU), or 4.5 m/s
     (Fukuchi, legs only).
   - **The reading itself, measured** (`dz-yardstick --cmu … --clips 16_45,16_46`): at 10 m/s, the higher hand's top
     reaches **0.02 m below the eye**, and 0.04 m below our head joint. By the joints, the hand rises to eye height,
     not above the head.
   - Seen from the capture's camera, or with the hand's mesh round the joint, it may well look higher. **The sheet's
     "above the head" is a little more than the joints show.** The swing at 10 m/s is -40 to +53°.
2. **"At 4 m/s the posed elbow is 77° at the front and 51° at the back, a mean of 64°, where the constant says 90."**
   - **Confirmed:** ours at 4.0 m/s reads **63° (51..75)**.
   - The recorded runners at 3.97 and 4.15 m/s (CMU 16_45, 16_46): **117° (103..141) and 120° (101..141)**.
   - Across every recorded clip, the lowest clip mean is 87°. So **ours is straighter than every recorded runner**,
     and C's intended 90° is at the low edge of what was recorded.

C owns the fix; this is the number.

## 6. Not covered, and not done

- **The hunter's speeds:** the references stop at 4.5 m/s (legs) and 4.15 m/s (arms). The hunter runs 9-13 m/s, and
  everything above is NOT covered. Nothing was extrapolated.
- **The player's Body (B's)** is not scored. It moves only through simulated ticks (`Body::tick`), so scoring it needs
  the simulation driven at each speed. That is the next step, with B.
- **Not built yet:** the contact sheet (the skeletons side by side at eight phases), the moves he named (the sidestep
  and crossover, backwards, a turn; the clips are fetched), and the view from the eye.
- **The map's limits** (ours, named in `acclaim.cpp`):
  - CMU's head point is its skull's base, while ours sits about at the eye, so hand-over-head is not strictly like
    for like between the two bodies;
  - the pelvis frames differ, as said for the hip.
- **The plan said the yardstick "stands on E's game/skeleton".** It does not. The skeleton's frames roll by our own
  rule, not the reference's ISB axes, so the yardstick builds ISB frames from the joints, as the lab did from
  markers. It is based on main, independent of L185.

## 7. Hand mutants (prove it)

Ten mutants, one at a time (`scratchpad/l193/mut193.sh`, each one's expected catch registered in the script before
the run). Each run ends with a clean rebuild, and a check that `tools/yardstick` equals HEAD.

- **First run, at b90eda9 (10 rows):** applied 10 / caught 8 / NOT APPLIED 0. checked: `scratchpad/l193/mut193.txt`.
  - Caught: `knee_sign` (row 1), `abd_axis` and `elbow_supplement` (the arm row), `late_sign` (row 4), `nan_force` and
    `missing_speed_fails` (row 10), `parent_axis` and `dir_local` (rows 5 and 6).
  - **`cardan_order` SURVIVED:** our frames make the third angle 0, so swapping the order changed nothing any row
    read. Fixed by row 12, which sets three angles at once and reads them back (`cardan_zxy` exposed for it).
  - **`hand_dropped` did not build** (C4100, `hand` unused). A mutant that does not compile proves nothing, so it is
    not counted as caught. It was replaced by `hand_dropped2`, which keeps `hand` in use.
  - Clean rebuild 10 / 0; restored == HEAD.
- **Rerun of the two, at 0b8a8d1 (12 rows):** applied 2 / caught 2 / NOT APPLIED 0. checked:
  `scratchpad/l193/mut193b.txt`.
  - `cardan_order` was caught by row 12 (`the_cardan_order_reads_back_three_angles_set_at_once`).
  - `hand_dropped2` was caught by row 8 (`a_pose_in_a_world_handed_the_other_way_reads_the_same`).
  - Clean rebuild 12 / 0; restored == HEAD.
- **The whole set at 0b8a8d1, the commit that would land (12 rows):** applied 10 / caught 10 / NOT APPLIED 0.
  checked: `scratchpad/l193/mut193c.txt`, run 05:2x-05:4x local behind B's lock, gated on memory.
  - Each mutant was caught by the row named for it above. `hand_dropped2` stands in for `hand_dropped`.
  - Clean rebuild 12 / 0; restored == HEAD.
  - This is the count the landing carries. The two earlier runs are kept above as the record of the survivor and the
    mutant that did not build.

## 8. Corrections and slips (mine)

- **Two bugs the first run on the real files found:**
  - the loader stopped at the first runner with no 2.5 m/s run;
  - it read every runner's stance as 0, because the force is NaN in the swing.
  Both are fixed, and each now has a row.
- **Two errors in my own test code, caught before it ran:**
  - the lag's sign: the field read "move ours by", so the "ten late" test would have checked for -10. It was renamed
    `late` and its sign fixed;
  - my first mirrored pose swapped the side labels, which made it no mirror at all. The swap was removed.
- **Two small tool builds ran inside my own L185 landing's exclusive hold**, at about 10:00Z (said in the L185
  hand-back).
- **My first header line said "31 runners"**: that was one speed's count. It now prints each speed's count.
- **My build held lock slot 2 for 40 minutes and did nothing** (11:50:47Z to 12:30Z; the librarian's trace is
  `exo_memory/loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`, "The second time").
  - **What happened:** I typed the player-scoring build inline into Git Bash, at about 11:47Z, without
    `MSYS_NO_PATHCONV=1`. Git Bash turned `cmd.exe /c` into `cmd.exe C:/`, so the wrapper's only child was a shell at a
    prompt. It is the same failure as B's on 11-12, and it breaks the chair's own rule for `cmd /c` from Git Bash.
  - **What I said meanwhile was wrong:** I told the keeper the build was "queued under the lock", and the board at 12:00Z
    that it "holds the lock now". It held the lock and was doing nothing. I never looked at the child.
  - **When it ended**, the librarian having stopped the idle cmd.exe, I read it as an ordinary failure. Only then did I
    see the banner in its log.
  - **Every wrapper of mine that calls cmd from Git Bash, checked** (`grep -rlE "cmd(\.exe)? +/c"` over my scratchpad,
    12:3xZ). All ten script files already set `MSYS_NO_PATHCONV=1`:
    - `l175/diverge.sh`, `l175/proof.sh`, `l175/wall.sh` (the users of `l175/lockcmd.js` and `l175/target.bat`);
    - `l185/mut2.sh`, `l185/mut4.sh`, `l185/mut5.sh`, `l185/mutants.sh`;
    - `l193/build193.sh`, `l193/mut193.sh`, and the new `l193/player_score.sh`.

    The unguarded caller was the inline command, which no file search finds. So the fix is a rule, not a file: **a
    build goes through a script file that sets the switch, never an inline `cmd /c`.** The rerun goes through
    `l193/player_score.sh`.
  - **The proving check:**
    - checked: `node -e 'console.log(process.argv.slice(1))' cmd.exe /c x` → `["cmd.exe","C:/","x"]` without the switch,
      `["cmd.exe","/c","x"]` with it;
    - checked: a trivial `.cmd` through the guarded form → printed, exit 0 in 155 ms.
  - **The look at the holder's child, owed until B's guard lands: the first one FAILED, and is fixed.**
    - `l193/holder_look.sh` saw my wrapper take slot 2 at 12:41:21Z. Both CPU samples came back empty: node printed the
      pid with colour codes (`[33m21160[39m`), so PowerShell's query was invalid.
    - The build did work, by its own output: the ninja steps in `l193/player-build-*.log` (6, then 2), the tests 12/0,
      and the scoring run to the end. But that is the output, not the look the chair asked for.
    - **Fixed:** the pid is now written as a plain string, and the samples are at +5 s and +15 s, since this build finished
      inside the old first sample's 20 s.
    - **Proved:** checked: `l193/holder_look_proof.js` (a parent with one busy child and one idle child, the watcher's
      own query) → the busy child 3.5 s then 7.2 s of CPU, the idle one 0.0 s both times. checked: the pid from a
      sample lock file reads `12345` byte for byte (`od -c`).

## 9. Hands and fingers in the recorded motion (the chair's 10:34Z note: `player_body-5` is now "new joints")

checked: `node Downloads\dz3-l193-review\fingers.js <cmu dir> 09_01 09_06 16_45 16_46 35_17 35_24` gives the range of each
hand channel over each clip (three runners):
- **Fukuchi 2017:** lower body only (hip, knee, ankle). **No hands.**
- **CMU's skeleton** gives each hand four bones: a wrist (`ry`), a hand (`rx rz`), **one** `fingers` bone with a single
  bend channel for all four fingers together (`rx`), and a thumb (`rx rz`) (`09.asf`, `lhand`/`lfingers`/`lthumb`).
  There are no per-finger joints.
- **In every running clip read, the `fingers` channel is constant at 7.1°** (left and right). **So CMU records no
  finger bend in these runs, and nothing on whether hands clench or open while running.**
- What does move: the wrist (for example 15..37° on the left in 09_01), the hand's two angles, and the thumb (its two
  channels swing by tens of degrees, for example 31..77° on the left in 09_01). inferred: the thumb may be partly
  marker noise; it was not checked against video.
- **So the yardstick can score the hand's orientation, but not a clench.** For his note (hands clench or open while
  running, arms and hands react to walls), these two references give nothing. A source with finger motion would be
  needed.

**The yardstick's joint map can grow** (the chair's ask):
- `acclaim.cpp` maps our joints from CMU's bones through a table of rows (our joint, the CMU bone whose end it is).
- The scoring names joints and loops over no fixed count; the poses are the game's own `BodyPose`, sized by its
  `kJointCount`.
- New finger joints are new rows, scored against the hand bones above as far as those reach.

Whatever B proposes on the board, I answer there before any code.

## 10. The player's legs (B's Body, driven through the simulation): scored, and the lag traced (written 06:4x local)

checked: `dz-yardstick.exe --data …\fukuchi2017 --player` at dreamzone-3 `l193-yardstick` fbe5aaa →
`Downloads\dz3-l193-review\table_player_fbe5aaa.txt`. The runners and the bars are the hunter's (§4). The player runs on
a flat floor with one input held, chosen per speed to land closest to the runners' speed.

| m/s (input) | joint | rms | runners' sd | best-lag rms | late | bar |
|---|---|---|---|---|---|---|
| 2.5 (106, 2.50) | hip (centred 24.8) | 25.2 | 5.2 | **7.8** | -22 | FAIL |
| 2.5 | knee | 41.4 | 7.6 | 22.2 | -17 | FAIL |
| 2.5 | ankle | 38.3 | 5.1 | 24.7 | +32 | FAIL |
| 3.5 (63 + sprint, 3.47) | hip (centred 30.4) | 30.5 | 5.3 | **6.8** | -24 | FAIL |
| 3.5 | knee | 44.6 | 8.0 | 22.5 | -17 | FAIL |
| 3.5 | ankle | 42.3 | 5.8 | 28.7 | +34 | FAIL |
| 4.5 (82 + sprint, 4.52) | hip (centred 35.8) | 35.9 | 6.6 | **7.3** | -25 | FAIL |
| 4.5 | knee | 47.9 | 9.4 | 23.3 | -18 | FAIL |
| 4.5 | ankle | 46.8 | 5.7 | 34.0 | +35 | FAIL |

**The lag is the body's, not the tool's** (the question left open in §4's player line):
- The tool cuts strides where the right ankle comes within 3 cm of its lowest. Those strikes fall at stride phase
  **0.15 / 0.17 / 0.18 turn** (the rig's own phase, averaged over the strikes).
- The body puts the right foot's mid-stance at 0.25 turn (`game/body.h`). With the foot down 26 / 22 / 19% of the cycle,
  its own contact is at **0.12 / 0.14 / 0.15**.
- So the tool cuts **3 points of the cycle** after the body's own contact. Of the 17 to 25 points of lag at the hip
  and knee, 3 are the tool's and the rest the body's.

**What the body does, from the every-10% rows** (ours / the runners' mean, degrees from standing):
1. **The hip has the right shape, early.** Moved back by its lag, it comes within **1.5 / 1.3 / 1.1 runners' sd**
   (7.8, 6.8, 7.3 against 5.2, 5.3, 6.6). Ours is most extended at 20% of the cycle (-17 to -23); the runners at 40-50%.
2. **The knee stays straight while the foot is down.** It reads 0° from standing for the first 20% of the cycle at
   2.5 and 3.5 m/s, where runners bend to 36-41°. Its swing reaches the runners' height (93 / 104 / 114 against
   93 / 107 / 116) but at 50% of the cycle instead of 70%. Even moved back it is 2.5-2.9 sd off, because the stance
   bend is missing.
3. **The ankle points the wrong way at push-off.** At 40-50% of the cycle ours is bent up 55-62°, where runners point
   the foot down (-15 to -24°). Ours reaches 62-66°, against the runners' greatest 23-24°. The hunter showed the same
   (§4, point 2).
4. **The foot is down too briefly:** 26 / 22 / 19% of the cycle, against the runners' 40 / 36 / 34% (§4).

inferred: the short stance is most of the hip's and knee's lag. A foot that lifts about 14 points early starts the
swing about 14 points early. To check: lengthen the foot's time down in the Body (`contact_length`, `game/body.h`, B's)
and re-run this table. The lag should shrink by about the same amount, or this inference is wrong.

**For B (the player's body, his pick player_body-3: "Real first"), worst first:**
- the ankle at push-off;
- the knee's bend in stance;
- the foot's time down.

The hip needs only its timing.
