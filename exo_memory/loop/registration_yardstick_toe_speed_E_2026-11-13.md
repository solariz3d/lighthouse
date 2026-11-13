# Registration: the yardstick's first end-point measure, the fastest toe over the running speed (pane E, machine D, 2026-11-13, before any code)

Ruling: the chair's D675 item 2, "A MEASURE FOR THE YARDSTICK, REGISTERED BEFORE CODE: THE FASTEST TOE OVER THE RUNNING
SPEED, with the runner's band 2.20 to 2.37 ... Tier: PROVE IT. Say in the registration what would show the measure wrong,
and how the model's toe joint is mapped to the marker." It answers his item 217 ("a good metric for a really human
looking sprint") with one more number. The yardstick (`tools/yardstick/`, `dz-yardstick`) scores joint ANGLES today; this
is its first measure of an end point's SPEED.

Base: dreamzone-3 main `b08f25e`. The yardstick is as landed; checked: `git log FETCH_HEAD -- tools/yardstick` → the
last change to it is `26d4c72`. Branch: `yardstick-toe-e`, a new worktree. Nothing of `l185-skeleton` is in it.

## 0. Amendments by name, ruled 2026-11-13 23:16Z (the chair, D675: "GO, WITH TWO AMENDMENTS"), written before any code

**AMENDMENT 1, LIKE FOR LIKE.**
- Ours is compared with the runner ONLY AT THE SAME CUT-OFF: ours at 10 Hz against the runner at 10 Hz, and so on.
- The UNFILTERED reading of ours is printed BESIDE and NEVER COMPARED. A filter lowers a peak, so an unfiltered pose
  against a filtered marker reads high by construction.
- The unwelcome outcome "the gait law itself whips" (section 7) is read at EACH of the three cut-offs. It holds ONLY IF
  ALL THREE exceed the runner's figure at the same speed by more than 0.1.
- Sections 1, 4 and 7 below are amended to this.

**AMENDMENT 2, ONE RUNNER IS SAID WHEREVER THE BAND IS PRINTED.**
- 2.20 to 2.37 is FOUR TRIALS OF ONE RUNNER (JA1), not a population's range.
- The tool prints "one runner (JA1)" beside the band. The hand-back, and anything passed to C or to him, says so.
- NO sentence of the form "outside the human range" is drawn from it.
- Where this document says "the runner's band" below, read "one runner's (JA1) four trials".

**Also ruled:** the new worktree's build tree goes on `G:\consonance-scratch`.

## 0b. AMENDMENT 3 by name, ruled 2026-11-13 23:43Z (the chair, D675 item 1), written before its code

**Why.** C measured where the hunter's toe JOINT sits against the runner's toe marker
(`handback/p-d675-toe-ratio-C_2026-11-13.md:25-26`, lighthouse `3f111619`):
- the joint is 0.213 m forward and 0.108 m down from the ankle, 0.239 m from it;
- the marker is 0.193–0.196 m forward and 0.044 m down, 0.200 m from it.

So the joint is about a fifth farther out on the lever. My falsifier 2 checked only the horizontal reach, and passed
(0.426 against the ball's 0.297). It could not see the joint being 6 cm lower and 4 cm farther out than the marker.

**The amendment.**
- **The compared point** is the hunter's point at the marker's own place on the foot, C's construction (`:34`): in the
  standing (rest) pose, 0.195 m forward and 0.044 m down from the Ankle joint.
  - It is held in the foot's frame: `u` along Ankle to Toe, and `n`, the perpendicular in the foot's plane about the
    side axis.
  - It is carried with each pose: `P = Ankle + a·u + b·n`, with `a` and `b` fixed from the rest pose.
- **The side axis:** the pose's `right`; in the rest pose, HipL to HipR. Forward is `right × up`.
- **The toe joint** is printed beside, never compared (as the unfiltered reading is, under AMENDMENT 1).
- **The verdict:** "the gait law itself whips" is read from the compared point, at each cut-off, all three, as under
  AMENDMENT 1.
- **C's figures at the marker's place,** 15 Hz: 2.66, 2.54, 2.38 and 2.26 at 3.53, 5.19, 6.97 and 9.47 m/s. By them the
  outcome holds at three speeds and not at 9.47.

**New rows, red before the code:**
9. **The compared point stands where it was put:**
   - in the hunter's rest pose it sits 0.195 m forward and 0.044 m down from the Ankle, within 1 mm;
   - in a foot turned 30° about the side axis it keeps its distance from the Ankle (within 0.1 mm) and its angle to
     Ankle–Toe (within 0.01°), so it is carried rigidly with the foot.
10. **Two seats' constructions agree:** ours at the compared point, 15 Hz, reads C's 2.66, 2.54, 2.38 and 2.26 within
    0.03 at the four speeds.
11. **The verdict is taken from the compared point, not the joint:** `compared(r)` returns the marker point's ratios.
    For a reading where the joint is over the runner by more than 0.1 and the marker point is not, "whips" is false.

**New hand mutants,** each must turn a row red:
- the compared point fixed in the world's axes, not the foot's (row 9);
- "down" taken as up (row 9);
- the verdict taken from the joint (row 11).

**Falsifier 5:** this amendment's construction is wrong if row 10 misses, that is if two seats building the same point
from the same words disagree by more than 0.03. Then neither figure is yet a measurement.

**Unwelcome outcome, said before the run:** "the joint was the whip". The compared point reads inside 0.1 of JA1 at more
speeds than the joint did. Then part of what was reported as the gait law whipping (my hand-back of 17:3x) was the joint's
longer lever, and the hand-back's sentence is corrected by this run.

## 1. The measure

For a body running straight at a steady speed:
- **The toe's speed** is its 3D speed in the world, in m/s.
- **The running speed** is the body's horizontal speed: the pelvis centre's travel over the time, for the runner; the speed
  the gait is posed at, for ours.
- **The measure** is the fastest toe speed over the stretch read, divided by the running speed.

Both bodies are read the same way:
- velocity is the central difference of position;
- it is read at three cut-offs of the same zero-lag filter (a 2nd-order Butterworth run forward and back) at 10, 15 and
  25 Hz, and also unfiltered for ours;
- the fastest of either toe counts;
- (AMENDMENT 1) ours is compared with the runner only at the same cut-off; ours unfiltered is printed beside and never
  compared.

## 2. The reference

- **Data:** the SimTK "runningspeeds" package, Dorn, Schache & Pandy 2012, subject JA1: `RunningDataModels.zip`, sha256
  `380ac4b69a5e99a97756eaf4df83ac0fe76d675fb485ac2dfcb2143c645324f0`, 2,802,028 bytes. These are the bytes of the
  spot-check (`handback/p-spotcheck-sprintref-E_2026-11-13.md:23`) and of the toe read
  (`handback/p-l185-toe-ratio-E_2026-11-13.md`).
- **Trials:** four running trials at 3.53, 5.19, 6.97 and 9.47 m/s, by the pelvis.
- **Learn from, never use,** as the yardstick's README holds:
  - a new `fetch_simtk.ps1 -Zip <path> -Out <dir>` checks that sha256 and unpacks outside the repository;
  - it takes a local zip, because where SimTK's download needs a sign-in is not settled here;
  - nothing of it is committed or shipped.
- **Reading it:** a C3D reader in C++, `tools/yardstick/c3d.cpp`, written from the C3D format's own description (c3d.org,
  "The C3D File Format User Guide"). It reads Intel files (processor 84) only and refuses anything else, naming it. It
  is not a port of either sprint reader's scripts.
- **The runner's figures the reader must reproduce:** from the independent JavaScript reader (`toe.js`), toe over
  running speed.

| speed | 10 Hz | 15 Hz | 25 Hz |
|---|---|---|---|
| 3.53 | 2.37 | 2.37 | 2.37 |
| 5.19 | 2.21 | 2.21 | 2.22 |
| 6.97 | 2.25 | 2.26 | 2.26 |
| 9.47 | 2.20 | 2.24 | 2.24 |

  The band is **2.20 to 2.37** across speeds and cut-offs: **one runner (JA1), four trials** (AMENDMENT 2).

## 3. Ours, and how the toe joint maps to the marker

- **Ours:** the hunter as the yardstick already poses it, from `content/models/hunter.glb`'s own rest, standing straight
  at no lean and no look.
  - It runs at a held speed v: `gait_pose(rest, feet, heading 0, v, phase)`.
  - `feet` is carried forward at v·t, and the phase turns at `v · gait_phase_per_metre(rest, v)` per second, as the game
    turns it (`game/world/stage.cpp:269`).
  - Read at 240 samples a second over four strides, after one stride to settle.
- **Speeds:**
  - the runner's four;
  - the hunter's own 9, 11 and 12.6 m/s, each printed **NOT COVERED** past 9.47 (no recorded runner there).
- **The mapping:**
  - **Our ToeL / ToeR ↔ the runner's LTOE / RTOE.** The marker is on the shoe's toe. Our Toe sits 6 cm past the ball
    (`game/model_rig.h:57`, `rest_from_bones`).
  - **Cross-check, the ball:** the midpoint of P1MT and P5MT, the metatarsal heads. Measured today it reads within 0.04 of
    the toe marker at every speed and cut-off: 2.36/2.35, 2.18/2.18, 2.25/2.25 and 2.20/2.23 at 10/25 Hz. So the measure
    does not hang on exactly where on the forefoot the joint sits.
  - **The end-point control, the ankle:** our AnkleL / AnkleR ↔ LMAL / RMAL, the lateral malleoli. The runner reads 1.89
    to 2.10. It is printed beside the toe, so a toe that behaves like an ankle shows.

## 4. What it prints

- One table: for each speed, the runner's toe, ball and ankle ratios and ours, at the three cut-offs, with the runner's
  band beside them.
  - Each of ours is set against the runner's at the same cut-off only (AMENDMENT 1).
  - Ours unfiltered is in its own column, headed "beside, not compared".
  - The band's line reads "2.20 to 2.37, one runner (JA1), four trials" (AMENDMENT 2).
- The speed at which ours peaks.
- Which toe peaks, and at which point of the stride.

There is no pass or fail on the game: like the angle measures, it is a yardstick, read by people. Its own tests are what
pass or fail (section 5).

## 5. Its own tests (`yardstick_tests`), registered red before the code

1. **A point at a known velocity:** a point moving at 3 m/s straight reads 3.00 m/s at every cut-off, and its ratio over
   a running speed of 3 reads 1.00.
2. **A known swing:** a point on a circle of radius r turning at ω, carried at v, reads a fastest speed of v + ωr within
   1% at 240 samples a second unfiltered.
3. **The filter:** a sine whose frequency is under each cut-off keeps its amplitude within 2%. One at twice the 10 Hz
   cut-off is cut to under 30% at 10 Hz.
4. **The C3D reader on a file made by the test:** a written Intel C3D with one known marker path reads back to 0.1 mm.
   A file marked with another processor is refused, naming it.
5. **Ours twice:** the hunter's ratio at 5.19 m/s read twice is equal bit for bit.
6. **The runner, when the data is present** (`--simtk <dir>`, NOT MEASURED when absent, never a pass):
   - the C++ reader's toe ratios equal `toe.js`'s table above within 0.01 at every speed and cut-off;
   - the ball within 0.01 of the ball figures above.
7. **(AMENDMENT 1) The whip verdict needs all three cut-offs:**
   - ours above the runner by more than 0.1 at 10 and 15 Hz but not at 25 Hz gives no "whips";
   - above at all three gives "whips";
   - ours unfiltered far above with the three filtered inside gives no "whips".
8. **(AMENDMENT 2) The band's printed line names one runner:** the table's band line contains "one runner (JA1)" and
   does not contain "human range".

**Hand mutants** (prove it), each must turn a row red:
- the C3D scale factor ignored;
- the frame rate taken as 240 not 250;
- the running speed taken as the named speed not the pelvis's;
- the filter run forward only;
- our phase advanced at a fixed rate instead of `gait_phase_per_metre`;
- `feet` not carried, so the body treads in place: the ratio collapses toward the swing alone.

## 6. What would show the measure wrong (falsifiers, before the run)

1. **Two readers disagree.** If the C++ reader's runner ratios differ from `toe.js`'s by more than 0.02 at any speed,
   one of the readers is wrong, and the band is not yet a measurement.
2. **The mapping is wrong** if our rest Toe lies behind the ball of the foot:
   - in the rest pose, measured along the foot from our Ankle, our Toe must sit further forward than the runner's P1MT/P5MT
     midpoint sits from LMAL, as a fraction of the runner's ankle-to-toe-marker length (read from the static trial);
   - if ours is nearer the ankle than that, the joint is not a forefoot point and the measure compares unlike things.
3. **One runner is not a band** if, within a single trial, the two toes' fastest ratios differ by more than 0.15. The
   per-speed figure is then the stride's, not the runner's, and is printed as such.
4. **The carry is wrong** if ours, at v with the swing frozen (one pose carried), does not read exactly 1.00.

## 7. The unwelcome outcomes, in the words that would make them true

- **"The gait law itself whips":** `gait_pose` on a straight at the runner's speeds reads more than 0.1 above the
  runner's figure at the same speed, at the same cut-off, AT EACH OF 10, 15 AND 25 Hz (AMENDMENT 1: it holds only if all
  three exceed; ours unfiltered does not count). Then the hunter's 2.8 is not a ragdoll or chase artefact; it is in the
  procedural gait, and on main. Said as "above one runner (JA1)", never as "outside the human range" (AMENDMENT 2).
- **"The yardstick cannot see the whip":** `gait_pose` reads inside the runner's band at every covered speed. Then the
  2.8 comes from something the yardstick does not draw: the chase's lean, the eased pose, the keyed foot in the chase's
  turns, or the speed at the peak's tick not being 11. In that case this measure, as registered, cannot answer C's
  question, and I will say so rather than widen it.
- **"The toe marker is the wrong point":** falsifier 2 fires.

## 8. My bias

I raised the toe observation, and I would like the 2.8 to be real. The toe-ratio read was my own reader, so falsifier 1
is the guard against that: a second reader, in a different language, from the format's own description.

## 9. Not in this measure

- The player's body.
- The arms' end points (the hands): the same machinery would read them, but they are not asked for.
- Any speed past 9.47 m/s, which is printed and marked NOT COVERED.
- Any change to the game: this is `tools/yardstick/` only.
