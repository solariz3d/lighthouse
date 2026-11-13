# Registration: L180 lap 2's rest (pane C), written before any code

Pane C (seat 0845a868), 2026-11-13, 10:50Z. Lane C item 3 of `loop/plan_13h_run_2026-11-13.md:191-194`; its steps are
`loop/plan_l180_animation_from_the_sources_2026-11-12.md:41-47`. Files: `game/model_rig*` and its tests, plus the
stage's per-hunter state (`game/world/stage.*`, beside `hunter_phase_`), which E's L192 wiring also touches (:269); I
say on the board before I edit stage.cpp. L195 has priority whenever its ruling comes. Each step lands alone.

## A correction to the plan, before it is built on

The plan's test for the feet (`:46`) is **"no drawn foot moves more than 0.1 m vertically in one frame on stairs"**. The
source does not do that. Overgrowth (`og_movementobject.cpp:2627-2631`, Apache-2.0, read):

    old_foot_offset[j] = min(ground_height + 0.1f, max(ground_height - 0.1f, old_foot_offset[j]));
    ground_height = mix(ground_height, old_foot_offset[j], (float)pow(0.8, num_frames));

The remembered height is clamped to **within 0.1 m of the new ground**, then eased toward it by 0.8 per tick. That caps
the foot's **lag** at 0.1 m, not its **movement in a frame**: when the ground under a foot rises 0.3 m, the drawn foot
moves 0.22 m in that frame (to 0.08 m short). The tick: `num_frames` counts game ticks (`:1795`,
`velocity * timestep * num_frames`), and `og_aschar.as:7925` turns a velocity change into an acceleration as
`* 120.0f / ts.frames()`, so a tick is 1/120 s (**inferred** from that line; the timer's own setting is not in the
fetched files). At 0.8 a tick the half-life is 26 ms.

## Step 1: feet with memory

- **Source:** the two lines above, per foot, the ease's frames taken as elapsed seconds x 120 (our frame rate is not
  fixed). The foot's tilt to the floor's normal (`:2647-2656`) is **not** in this step: our floor probe returns a height
  only (`GaitMotion::floor`), and a normal is a change to the probe.
- **Red first, on main:** with a floor that rises one stair step (0.18 m) under the drawn hunter's front foot between
  two frames 1/144 s apart, the drawn ankle on the frame after the step is **short of the new floor by
  0.1 x 0.8^(120/144) = 0.083 m, within 0.005**. Main draws it on the floor at once (short by 0), so the row is red.
- **The bound that holds by construction, checked too:** over a whole staircase at the hunter's 10 m/s, the drawn foot is
  never more than 0.1 m from its floor.
- **Falsifier, written now:** the step is degenerating if, to make the row pass, I need any number not in the two
  lines above, or if the memory makes the hunter's foot visibly float (more than 0.1 m off a floor) in the clip.
- **The yardstick:** E's L193 scores bodies against recorded motion on the flat; memory changes nothing on the flat, so
  it should score the same before and after. If it is landed by then, I run it and say the number; if not, I say so.

## Step 2: per-chaser stride variation

- **Source:** what Valve does use (the plan's `ENTINDEX_PLAYBACK_RATE` is declared and never used; C's L191 hand-back):
  a random rate per entity, `npc_fastzombie.cpp:1642-1646` (0.9 to 1.1) and `npc_antliongrub.cpp:627-628` (0.8 to 1.2,
  "Add some variation because we're often in large bunches"). I take the fast zombie's 0.9-1.1: it runs at people.
- **Red first:** two chaser ids give stride rates that differ, each within 0.9-1.1 of the law's, and the same id gives the
  same rate every time (seeded by id, not by the frame). Main gives one rate to all.
- **Only the first hunter is a model today** (`stage.cpp:262-283`); the others are boxes. So on screen this changes one
  hunter's cadence by up to 10%. Said now so nobody expects a crowd to look different.

## Step 3: stumbles as additive gestures

- **Source:** Valve's overlay fade (`BaseAnimatingOverlay.cpp:162-188`, read at L192): a gesture's weight rises and falls
  over its own clock as `3w^2 - 2w^3`.
- **Only on the chase's own events:** a refused step (`chaser.cpp:419-423` at main 682e699) and a scrape (`:415`; the field `chaser.h:98`),
  which C traced at L180 lap 1. The gesture's shape (what the trunk and head do, how long) has no readable source; it
  will be marked OURS and shown to him as a clip before it lands.
- **Red first:** on a refused step the drawn trunk pitches by the gesture, its weight 0 before the event, rising and
  falling by the smoothstep, 0 again after it; with no event, no gesture.

## The unwelcome outcome, in the words that would make it true

"The feet with memory look worse on his stairs than the feet without it, so step 1 is reverted." If his eye says so,
it is reverted, whatever the row says.
