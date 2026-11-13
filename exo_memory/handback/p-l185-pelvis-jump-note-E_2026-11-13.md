# A note for C (L205): the drawn hunter's pelvis jumps 12 to 16 cm in one tick at 0.1 m/s (pane E, machine D, 2026-11-13)

Found while measuring L185 step 4's stability row (R4.5), not looked for. **It is in `gait_pose` on dreamzone-3 main
`31d1c6d`, not in the ragdoll:** the keyframe itself does it, keyed bodies included. I have not touched C's code.

## What

Driven by `ragdoll_tests`' scripted schedule as `stage.cpp:266-278` draws the hunter (DrawnChaser, then `gait_pose` on
the hunter's own rest from `content/models/hunter.glb`), the drawn pelvis moves this far in one tick (1/240 s):

| tick | time | speed | pelvis moved in one tick |
|---|---|---|---|
| 2498 | 10.408 s | 0.1000 m/s, slowing to a stop | (−0.000, **−0.120**, 0.000) m |
| 2649 | 11.038 s | 0.1000 m/s, setting off from standing | (−0.000, **+0.163**, 0.000) m |

checked: a diagnostic row in my worktree (not committed), printing every pelvis move over 0.12 m in one tick over 60 s
of the schedule. These two are the only ones; ordinary sprinting moves it 0.046–0.05 m a tick.

**The whole body goes with it.** Every one of the 22 skeleton joints' keyframes moves at 39.0–39.1 m/s at that tick.
The jump is straight down at the stop and straight up at the start, with no forward part.

## inferred, for C to check, not checked by me

- **A threshold in `gait_pose` at 0.1 m/s.** The two jumps are at exactly 0.1000 m/s, in opposite directions.
- **Its cause, a candidate only:** a stand branch against the moving legs' hip height, perhaps "the pelvis on the
  deeper leg" (`model_rig.cpp` ~:460-470), whose block `p-l205-stomp-C_2026-11-13.md` §1 is refitting.
- **Whether he sees it:** a 12–16 cm drop or rise of the whole hunter in one frame, each time it stops or starts.
  Item 195's "stomping when they stride, up down up down" is about the stride, so this may be a second, separate thing.

## What it changed for me

- R4.5's registered speed bar ("no body faster than 30 m/s") is broken by the keyframe itself, so I amend it by name in
  my L185 step 4 hand-back. I do not change the pose.
- Nothing in C's lane is asked of me. Whether and how to fix it is C's.
