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

## 7. Row 1 split into the law's three rows (the chair's ruling of 07:11:48Z; registered before any of them runs)

**The ruling.** The law stays. Row 1 becomes the three things the law does, read on his seven kept runs of 2026-11-14 (copies in
`G:\consonance-scratch\b-lookback-runs`) by `dz-world --look-check`. The chair's words for each row are kept as given; my
operational reading is given beside each one.

**Shared by all three, unchanged from 4afa6b6:**
- **A quick turn:** a run of ticks where the view's yaw rate is at least 3 rad/s.
- **Its window:** from its first quick tick to 40 ticks after its last.
- **Its lag:** the shoulders' peak tick less the view's peak tick.
- **The shoulders' yaw:** read from the drawn ShoulderL→ShoulderR line.

1. **THE SPRING.** "On turns that begin with the shoulders within 2 degrees of the view and that do not reach the limit, the shoulders'
   peak is at least 3 ticks after the view's. Red on main."
   - **Under it:** at the tick before the turn's first quick tick, |shoulders − view| ≤ 2 degrees; and over the window, the shoulders
     never trail the view by 50 degrees less 0.01 rad or more (the existing "at the limit" test).
   - **Asserted:** every such turn has a lag ≥ 3 ticks.
   - **Red on main:** the same check with the law off (`--look-check-off`, body_look = 0). Row 4 pins that body as main's to the
     digest. With the law off the shoulders are the view's, so the lag is 0 on every turn.
2. **THE LIMIT.** "The chest is never more than 50 degrees behind the view, and the hips never more than 45."
   - **Asserted, on every tick of the run:** |the law's chest − view| ≤ 50 degrees + 1e-3 rad, and |drawn hips − view| ≤ 45 degrees +
     1e-3 rad (as 4afa6b6 reads them).
3. **THE FOLLOWER.** "At every tick of every quick turn, whatever came before it, the shoulders turn toward where the view is, or not
   at all. Never away from it."
   - **On every tick k of every turn's window:** let d be the shoulders' change, wrap(s[k] − s[k−1]), and g the gap, wrap(view[k] −
     s[k−1]).
   - **Asserted:** the tick moves AWAY when d·sign(g) < −1e-4 rad (0.0057 degrees, the band for "not at all"). The count of such ticks
     is 0.
   - **Printed:** the count of ticks judged.

**Printed first, before any verdict:** how many of the 864 turns fall under each row. All 864 fall under rows 2 and 3, so the count that
moves is row 1's.

**The unwelcome outcomes, named now:**
- **The chair's:** if fewer than a third (fewer than 288 of 864) fall under row 1, the spring is barely tested on his play. I ring then,
  before going on.
- **Mine, a prediction, from the law's code:** row 3 may go RED. The chest's spring carries a velocity (`chest_rate`,
  `game/body_look.cpp:40-43`). When the view reverses and crosses back past the shoulders, that velocity carries them on, away from
  the view, for a few ticks before it turns. If row 3 is red, I print where it fails (reversal or not) and ring. I do not tune the
  spring, which is NOT TAKEN by the ruling.

**Not taken (the ruling):** a slower spring, no limit, or stopping the lap.

**Where it runs:** the gym bot's row in body_tests stays the report the 06:06Z ruling made it, with the limit asserted. The three rows
are read by `--look-check` on his runs.

## 8. The chair's ruling of 08:16:51Z: the peak measure withdrawn, two prints, the twist, the guard, row 3 restated (registered before any runs)

**Withdrawn:** the peak-timing measure, as the swarm's row and as row 1 of §7. It reads late on a body with no lag. The 755 of
4afa6b6 and the 106 of 106 of 697570d are set aside; neither is claimed. The spring row of §7 is withdrawn with it. The limit of §7
(row 2) stands.

Everything below is read by `dz-world --look-check` / `--look-check-off` on his seven kept runs (copies in
`G:\consonance-scratch\b-lookback-runs`), **the law off first, then on, run by run**.
- **The shoulders' yaw** is the drawn ShoulderL→ShoulderR line, as before. **The chest** in the rows below is that drawn yaw, so that
  the law off has a reading.
- **A quick run:** a maximal run of ticks whose view yaw rate is at least 3 rad/s.

**P1, turn lengths and gaps (printed, not judged):** for every quick run, its length in ticks and the gap in ticks to the next quick
run's first tick. Summed: the count of quick runs, and the count of gaps under 40 ticks, with the median gap.

**P2, main's late peaks (printed, not judged):** with the law off, and on the turns of §7, for those the withdrawn measure called late:
how many have the shoulders' peak after the turn's last quick tick.

**THE AGREEMENT RULE, set now:** the librarian's reading "agrees" when BOTH hold:
- at least a quarter of all gaps in P1 are under 40 ticks;
- more than half of main's late turns in P2 have their peak after the last quick tick.

If it agrees, **a turn is quick runs whose gaps are each under 40 ticks, merged**. The turn runs from the first run's first tick to the
last run's last tick, and its window to 40 ticks past that. If it does not agree, a turn is one quick run with its 40-tick window, as
in §7. The counts are printed both ways, and **the rows' verdicts below are read on the segmentation the rule picks**; the other is
printed beside them.

**T, THE TWIST (the row that reads his words).** In every turn:
- the chest's largest angle from the view over the turn's window (max |shoulders − view|) is **at least min(¼ × the view's turn, 10
  degrees)**, where the view's turn is the largest |view − view at the tick before the turn's first quick tick| over its quick ticks;
- **or the chest is at its limit** (the window's largest angle ≥ 50 degrees less 0.01 rad, the §7 test).
- **The quarter and the 10 degrees are the librarian's, marked ours.**
- **Control, printed first:** with the law off, the chest's largest angle from the view over every turn of every run; it must read 0.0
  degrees (to 0.05).
- **Failing turns** are printed with their starting gap (|shoulders − view| at the tick before) and the chest's rate there (the
  shoulders' yaw change into that tick, deg/s). Nothing is tuned to them.

**G, THE GUARD (green on main):**
- **When:** at every tick where the view has stayed within 1 degree of its present yaw for the previous 94 ticks. Ninety-four is six
  of the spring's own time constant: tau = 1/omega = chest_follow / 2 = 0.065 s (`game/body_look.cpp:40`), so 6 tau = 0.39 s = 93.6
  ticks at 1/240 s, rounded up.
- **Asserted:** the chest (drawn shoulders) is within 2 degrees of the view.
- **Printed:** the ticks judged and the worst.
- Read with the law off and on; the law off must be green.

**R3, ROW 3 RESTATED.** The §7 wording ("never away") contradicts the spring; it stays red in the record and is not judged again.
- **New wording:** on every tick of a turn's window where the shoulders move away from the view (as in §7: d·sign(g) < −1e-4 rad), they
  move away by LESS than on the tick before. That means the shoulders moved the same way on the tick before, and |d now| < |d before|.
- **An away tick whose tick before moved the other way or not at all, or moved less, counts as GROWING.**
- **Printed:** the largest whole excursion away at one reversal (the sum of |d| over a consecutive run of away ticks), and the count of
  growing ticks.
- **THE UNWELCOME OUTCOME, NAMED NOW (the chair's):** an away motion that grows. For instance, on the tick the limit lets go, the
  carried rate is stale: `game/body_look.cpp:45` clamps the chest at the limit but leaves `chest_rate` as it was. That is a fault in the
  law. **If any tick grows, I ring at once** with the ticks printed, before going on.

**Kept:** row 2, the limit (chest 50, hips 45).

**Then:** merge main ae74f0c into b7-look-b (697570d), and the rest of the lap.
- **The films include a burst of his own flicks from a kept run:** the law off beside on, first person beside outside.
- Pane O lands it; body_look stays off.
