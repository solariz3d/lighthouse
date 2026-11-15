# Packet for pane B: the body follows the look (laps L19 and L23 of the path of record, as one lap for every body)

Written by the librarian on D, the night of 2026-11-14, after pane B's floor experiment left it with no lap open. Plan:
`loop/plan_new_system_2026-11-14.md`, the section at the collation of E1 (this lap is named there). Night's order:
`loop/night_order_2026-11-14-D.md`. Tier: check it, with the rows below. Behind one switch, off.

**SOURCE: what produces this, and what limits it.**
- **What draws the player's body:** `game/body.cpp`. One yaw drives the head, the chest and the hips together
  (`body.cpp:225-230`, the swarm's cite), and the view's pitch reaches nothing: `grep -n pitch game/body.h game/body.cpp` on
  his clone at 6034143 prints nothing (run by me), which is pane E's finding in `handback/p-d677-e1-E_2026-11-14.md:26-29`.
- **What a chaser has already:** its look is spread down the spine by ozz's rule (`game/model_rig.h:104-108`, `:129`), for
  yaw. So half of this exists for one kind of body and none of it for the other.
- **What limits it:** the first-person camera stands at the drawn eye. Anything that moves the drawn head moves what he
  sees, unless the camera is kept where it is. Pane C is building the dial for that tonight
  (`loop/packet_b1b_lean_limits_C_2026-11-14.md`, point 4).

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 159, 163, 227)

- "the player animation needs to look smooth from first person perspective, when the player looks down at their legs and
  body/arms, they should move how a real person would, looking down at the side, the legs and feet criss crossing eachother,
  walking backwards"
- "the torso doesnt like twist with the sideways look like a real persons body would bend turning to look, like, perhaps
  the head moves first when you look, then it moves the rest of the body underneath"
- "its not just for the hunter, but all mobs we will make and even the players character animations as seen from first person
  view, but also consistent from the outside as well."

## Read first, before code

- The swarm's two laps, whole, with the second reader's brackets: `loop/animation_system_2026-11-13/00_build_path.md:584-603`
  (L19) and `:642-651` (L23), its rules at `:135-158`, and the second reader's lines `:911`, `:915`, `:983`.
- Your own parked look, `l188-wip-look` a60944d: the path of record says it is not to land as it is, and the swarm takes
  only its look half.
- Pane E's four differences between the two views (`handback/p-d677-e1-E_2026-11-14.md:13-31`), and its row, now on main:
  `dz-world --pair-check RUN`.

## What to build, as one function for every body

1. **One look law, in a file of its own** beside `game/body_lean.h`: it takes where the body looks, less where it travels
   (yaw), and how far up or down (pitch), and a kind's row, and gives what each of the head, the upper spine, the chest and
   the hips takes of it, and when.
   - **Yaw, the head first:** the head takes the look at once; the chest follows on a spring; the hips follow the travel and
     stay within a limit of the eyes. The numbers the swarm gives (the trunk's spring of the first game, the hips within
     45 degrees and 720 degrees a second, the chest's lag capped at 50 degrees) are a start, each marked as sourced or ours.
   - **Pitch, about the neck:** looking down turns the head about the game's own neck pivot (`eye_to_neck` 0.13 down,
     `neck_back` 0.09, the swarm's `:643-644`), and a share of it bends the upper spine. A person looking at their own feet
     bends at the neck first.
2. **The player's body calls it** from its own tick. **A chaser calls the same function** where its look is spread today;
   with the switch on, the chaser's own spread is not used. A kind's shares and rates are one row.
3. **One switch for every body,** a world setting, off. With it off every pose is main's to the bit.
4. **The view.** The drawn eye moves with the pitch. The camera does not follow it unless pane C's dial says so: with the
   dial at 0 the camera's position and direction are today's, to the bit. Say in the hand-back what the dial's setting is
   called once pane C has rung it; until then, keep the camera where it is and print the gap from the camera to the drawn eye
   at 60 degrees down.

## Rows, registered before code, each with main's drawing as its control

- **The head first** (the swarm's red for L19): on the gym's bot run and on a first-person burst of a kept run of his, the
  drawn shoulders peak after the view by at least 3 ticks while the hips stay within 45 degrees. Red on main: one yaw drives
  all three.
- **Looking down** (the swarm's red for L23, by pane E's tool): standing and at a run, 60 degrees down, the collar's share
  of the picture falls and the toes come into it, with the camera riding the eye. Red on main. With the camera kept where it
  is, print what he sees instead; that one is for his eye.
- **One function:** the player's body and a chaser take their look from the same function, checked as pane C checked the
  lean (a grep of the callers and one definition).
- **One pose, two cameras still holds:** `--pair-check` green on a kept run with the switch on.
- **Off means off:** with the switch off, the gym run's rig differs from main's on 0 ticks.
- **Nothing in the simulation reads the eye** (the second reader's open question at `:983`): his kept runs replay the same
  with the switch on. If one does not, stop and ring; then the look is not picture only.
- **The glance behind is untouched:** the rows of the look back you landed tonight stay green.

## For his eye

With pane E's pair film (`dz-world --capture-pair`, on main): a quarter turn of the view at a jog while looking 45 degrees
down, and a look straight down while standing and while running, first person beside outside, main beside this lap. Pane E
is adding a film light tonight; use it if it is on the remote when you film, and say which you used.

## Registered with this packet

- **This lap is wrong if** the player's body and a chaser end with two look functions, or if any number of it lives in the
  function and not in a kind's row.
- **The unwelcome outcome, named now:** with the camera kept where it is, the bent neck and chest put the body's own collar
  or chin in front of the view. Then say so with the frames; the answer is the dial, and it is his to turn.

## Rules that hold

- Pane C is in the same files tonight for B1b (`game/body.cpp`, `game/model_rig.*`, `game/world/world_app.cpp`,
  `game/world/world_settings.h`). Branch from the game's main 6034143, keep to your own function and its call sites, and
  merge main before you ring. Whoever lands second resolves its own conflicts.
- Trees and builds on G:. `node consonance/tools/heavy-run.js --status` before a heavy run. His words stay out of the game's
  repository. His run files are copied. Pane O lands it. One hand-back with its digest and a `BASE:` line, rung once.
