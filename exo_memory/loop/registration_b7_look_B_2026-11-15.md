# Registration: B7, the body follows the look, one law for every body (pane B, D677, before any code)

**Packet.** `exo_memory/loop/packet_b7_body_follows_look_B_2026-11-14.md` (90 lines, read whole). Tier: **prove it**, raised from the
packet's "check it" by the chair's word of 04:48Z. Base: dreamzone-3 main `6034143`. Branch `b7-look-b` in
`G:\consonance-scratch\dz3-lookback-b`.

## 1. What is there today (read at 6034143)

- **The player's body** is built in ONE frame, the aim's yaw: `Body::pose` (`game/body.cpp:232-240`) sets `ahead` and `right` from
  `player.yaw`, and the head, the trunk, the hips and the feet all hang from it. The view's pitch reaches no joint (the packet's grep,
  E's finding).
- **A chaser's look:** `GaitMotion::look`, the head's look less the heading, spread by `chain_pose` (`game/model_rig.cpp:601-618`).
  The chest takes `kLookChestShare` (0.4225), the upper spine `kLookSpineShare` (0.65, in the palette, `:333-337`) and the head all of
  it, at once. The chaser's springs (`kTrunkFollowTime` 0.13 s, `kHeadFollowTime` 0.22 s) carry its tilt, not its look.
- **My parked WIP `a60944d`'s look half** gives the player's three yaws: the head is the aim; the chest follows the aim on the trunk
  spring; the hips turn toward the travel, held within 45 degrees of the eyes at 720 degrees a second; backwards, they face the aim. It
  lived inside `Body::pose`, for the player alone. It is taken as a source of numbers, not as code.

## 2. The one function (game/body_look.h, game/body_look.cpp, beside body_lean.h)

- **The row:** `LookRow`. Every number is one field of it:
  - the chest's spring time;
  - the chest's lag limit (50 degrees);
  - the hips' limit (45 degrees) and rate (720 degrees a second);
  - the upper spine's share of the head-to-chest gap;
  - for pitch, the neck's share and the upper spine's share.
- **The rows for kinds:** `kPlayerLook` and `kChaserLook`, each field marked sourced or ours.
- **The law:** `BodyLook::step(look_yaw, travel_yaw, moving, pitch, row, dt)` returns `LookPose`:
  - **head_yaw:** the look, at once.
  - **chest_yaw:** follows the look on a critically damped spring of the row's time, never more than the lag limit behind it.
  - **hips_yaw:** toward the travel when moving (facing the look when the travel is backwards), held where they are when standing.
    Always within the hips' limit of the eyes, turned at no more than the rate.
  - **spine_yaw:** between the chest and the head by the row's share.
  - **head_pitch and spine_pitch:** the row's shares of the look's pitch, about the neck pivot (`BodyBuild::eye_to_neck` 0.13,
    `neck_back` 0.09).
- **Applied by one pose function, `look_pose(BodyPose&, const LookPose&, …)`:**
  - the chest, the shoulders and the arms turn about the neck by chest less hips;
  - the hips turn about the pelvis by hips less travel frame, and the legs reach again to the feet where they are, so the feet do
    not skate;
  - the head turns and pitches about the neck, and the drawn eye moves with it.
- **The two callers:**
  - **The player:** `Body::tick` steps the law from the aim (`after.yaw`), the travel (velocity) and the view's pitch, and applies
    `look_pose` to its pose. The pose stays built in the aim frame, so with the switch off nothing in `Body::pose` changes.
  - **A chaser:** where `world_app.cpp` builds its `GaitMotion`, the law is stepped from the chaser's own look (yaw + look), its
    heading and pitch 0. `chain_pose` takes the law's chest and head yaws in place of `kLookChestShare × look` and `look`.
- **One switch:** a world setting `body_look`, 0 by default, read where `body_lean` is read (`world_app.cpp`). With it off, no caller
  steps the law, and every pose is main's to the bit.
- **The camera:** not moved. The rig's eye is where it was. The drawn eye moves with the pitch, and the gap from the camera to the
  drawn eye at 60 degrees down is printed. Pane C's dial (B1b point 4) decides whether the camera rides it.

## 3. Rows, red first on main

1. **The head first:** on the gym's bot run, the law's look stepped by its aim.
   - **Asserted:** in each quick turn (the view's yaw rate past 3 rad/s), the drawn shoulders' yaw rate peaks at least 3 ticks after
     the view's, and the hips stay within 45 degrees of the eyes on every tick.
   - **Non-vacuity:** the count of turns judged is printed, with at least 5.
   - **Red on main:** the shoulders' yaw is the view's on every tick, a lag of 0.
   - **His kept run:** a first-person burst of one is printed beside it, not asserted.
2. **Looking down, the pose:**
   - **Asserted:** standing and at a run, at 60 degrees down, the drawn eye lies on the arc about the neck that the row's neck share
     gives (within 1 cm), and from the drawn eye along the pitched view the toes lie inside the view's vertical half-angle.
   - **Red on main:** the drawn eye does not move.
   - **The picture:** the collar's share and the toes in the picture are measured by `--capture-fpbody`'s coverage (L174's measure),
     with the capture's camera riding the drawn eye. With the game's camera kept where it is, what he sees is printed and filmed.
3. **One function:** `git grep` finds one definition of `BodyLook::step` and `look_pose`, called from `body.cpp` and from the chaser's
   pose (two call sites); `kLookChestShare` is not used when the switch is on.
4. **Off means off:**
   - with the switch off, the gym bot run's poses equal main's joint for joint on every tick (0 ticks differ);
   - the world self-test is unchanged;
   - his kept runs' fingerprints are unchanged.
5. **Nothing in the simulation reads the eye:** with the switch ON, his kept runs replay the same (the seven of 2026-11-14). If one
   does not, I stop and ring.
6. **`--pair-check` green** on a kept run with the switch on.
7. **The glance behind:** the four look-back rows (game_tests "glance", "look_back") stay green.

**Mutants (tier prove it):**
- the law's spring removed (the chest = the look);
- the hips' limit removed;
- the switch ignored (always on);
- the chaser's caller reverting to `kLookChestShare`.

## 4. Falsifiers, before the run

- **This lap is wrong if** the player's body and a chaser end with two look functions, or a number of it lives in the function and not
  in a kind's row (the packet's).
- **The unwelcome outcome:** with the camera kept where it is, the bent neck and chest put the body's own collar or chin in front of the
  view. If so, it is said with the frames, and the dial is his to turn (the packet's).
- **Mine:** if row 1 is GREEN on main (the shoulders already lag), the row is wrong and I stop.

## 5. Kept apart from pane C (same files tonight)

- I add `game/body_look.*`.
- I edit only:
  - in `game/body.cpp` and `body.h`, the switch, the state and the one call in `Body::tick`;
  - in `game/model_rig.*`, the one line of `chain_pose` that reads the look, and a field of `GaitMotion`;
  - in `game/world/world_app.cpp`, the two call sites;
  - in `game/world/world_settings.h`, one `X` line.
- Main is merged before the ring, and my own conflicts are mine to resolve.

## 6. My bias

The WIP is mine, and I want its numbers to hold. Row 1's bar (3 ticks) is the swarm's, not mine.
