# Packet for pane B: the runner seen from outside, starting with the look (B8)

Written by the librarian on D, 2026-11-15. Plan: `loop/plan_new_system_2026-11-14.md`, its last section (his word of 03:22).
This is a hard build in one respect only, what a real body does, and a visible one in every other. So it carries no new rows
to be seen failing first. It is judged by a look from outside, yours and then his.

**SOURCE: what produces this, and what limits it.**
- **What he saw:** the look law on his own body, from outside, in the clips of your films. His words are below. He did not say
  which part.
- **What I see in your outside frames, marked as mine** (the look-down film at frames 10, 50, 90, 130, 165; the flick film at
  48 to 96; the law off over the law on): looking down, the head and upper back bow forward and an arm stands out level from
  the body; in the flicks, at the chest's limit, the upper body is turned hard against the legs with the arms carried round.
- **What produces it, by reading your own registration** (`loop/registration_b7_look_B_2026-11-15.md:28-40`): the head takes
  the whole look, yaw and pitch, because the models have no eyes to turn; the row's shares of the pitch go to the neck and the
  upper spine; the chest, the shoulders and the arms turn about the neck as one piece.
- **What limits it:** nothing on file says how a person's eyes, head, chest and hips share a look to the side or down. The
  swarm's gaze file says its sources are thin there (`loop/animation_system_2026-11-13/scout_upper_body_and_gaze.md:62`) and
  that the head carries the gaze for want of eye bones (`:295`). The law's shares are partly our own numbers.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 229 and 163)

- "the runner body follows the look is sort of bugged when l ooking from third person, in reality the player wouldnt see the
  bug unless shadows which is still possible, so i want to make the runners animation perfect, since we might do peer to peer
  multiplayer in the end"
- "the torso doesnt like twist with the sideways look like a real persons body would bend turning to look, like, perhaps the
  head moves first when you look, then it moves the rest of the body underneath"

## What to do, in this order

1. **Look first, and name it.** With pane E's fixed outside camera (it is filming your two stretches again now; use its
   option once it is on the remote, or a camera fixed to the room), look at the law on beside the law off and write down, in
   plain words, each thing that reads wrong from outside. Before any change.
2. **Read how a body shares a look, once, and cite it.** How far the eyes alone carry a look to the side and down before the
   head turns; how much of the rest the head takes and how much the trunk; whether the upper back bends at all when a person
   looks at their own feet; what the arms do when the chest turns under a run. Each number that goes into the row is marked
   sourced, with its page, or ours.
3. **Change the row, not the law's shape, wherever a number is the cause.** The view may turn further than the drawn head: the
   eyes are not drawn, so the head need not carry the whole look. If the law itself has to change (how the arms follow the
   chest, for one), say what and why before the code.
4. **Film it for him:** the fixed outside camera, lit and labelled as lit, the game today beside the law as landed beside the
   law as changed, for the flicks and for the look down; first person beside it, with the camera on the head. Pane E makes the
   clips. Look at the outside frames yourself before you ring.

## What is kept, and nothing more is asked

- With the switch off every pose is main's, and his kept runs replay the same with it on: the rows you have.
- The twist, the guard and the limit as landed stay green, or you say which one a sourced number breaks and why.
- A chaser takes the same function and the same kind of row. If a number is right for a person and wrong for the hunter, it
  is two rows of one law.

## Registered with this packet

- **It failed on his terms if** it goes to him without an outside film from a fixed camera, or is called done on what the
  first-person view shows.
- **It is wrong if** a number of it lives in the function and not in a kind's row.

## Rules that hold

His game running holds nothing but the build of his own Dreamzone copy while a Dreamzone of his runs. No frame-time figure
while a game of his is up. Trees and builds on G:, through the lock's own wait. His words stay out of the game's repository.
One short hand-back: what you named, what you read, what you changed, where the film is.

## AMENDED at his word of 05:33 (game brief item 231): one film comes first, before step 1

**His words:** "the runner just doesnt look like a natural body moving, its buggy and glitchy, i feel like we might need to do
another pass on human biomechanics or whatever tf open source proc gen we could learn from"

**What produces it, read by me:** the runner's body is not drawn the way the hunter's is. The hunter's run is `gait_pose`,
"built from recorded runners' curves" (`loop/animation_system_2026-11-13/00_system.md:53-55`; `game/world/stage.cpp:286` at
48ad21d). The runner's is `Body::pose`, "hung from the camera's eye" (`00_system.md:55`, `:98`; `game/body.cpp:266`). The
design chose that when first person was the only view that counted.

**So, first, an experiment for his eye, nothing landed and nothing kept if it does not serve:**
- On one of his kept runs, draw the runner's model with the hunter's generator: `gait_pose` on the runner's own rest
  skeleton, at the runner's feet, with its heading, speed and the stride phase the camera already keeps. The shared lean on
  top if it is to hand. Nothing else.
- Film it from a fixed outside camera, lit and labelled as lit, beside the runner as it is today, same run, same stretch: a
  straight sprint, a turn, a stop and a start. And the first-person view from that body's eye beside today's.
- This is a scratch edit for a film, as your floor experiment was. No row, no switch, no branch to land.
- **Named before it is made, so the film cannot be read to taste afterwards:** if the runner drawn this way looks like a
  person running, the runner's generator is what changes and the look law is built on that body. If it does not, the
  generator is not the cause and the reading pass he names is the next step.

**Then steps 1 to 4 above, on whichever body his eye picks.**

**A narrow read rides with this lap, one reader, not a swarm:** the first pass held these only second-hand
(`scout_player_first_person.md:289`, `:307`): how games that draw one body for both views handle first person (what the eye
rides on, how the head is steadied, what is hidden); and how eyes, head, chest and hips share a look. Cite each page opened.

## DECIDED at his word of 06:56 (game brief item 234): the runner is built on the new system. The film is the first step of the build, not a test

**His words:** "also so when the runner runs, they move their hands too forward like they are poking something infront of them
rather than swinging their arms, and the legs dont even like care where theyre going ,i still feel like we are using the whole
old system LIKE WTF WHAT ABOUT THE NEW PROC GEN ANIMATION SYSTEM?"

**He is right, and the section above this one was the wrong weight.** It set a film to decide whether the runner's generator
changes. He has decided. What he describes is `Body::pose` exactly: hands held where the view can see them, legs hung under the
eye. Both lines of that section that begin "If the runner drawn this way" are withdrawn.

**R1, now, from the scratch build you already have:**
- Behind one switch, off, with a key in pane E's list: the runner's body is drawn by the shared generator. `gait_pose` on the
  runner's own rest skeleton, anchored at its feet where the simulation has them, its heading the way it travels, its stride
  from the clock that is now on main, its arms and legs from the generator's own curves, the shared lean on top.
- While it runs, walks or stands, nothing comes from `Body::pose`. For the states the generator has no pose for yet (say
  which: the slide, the ladder, the climb, the fall), today's pose stays and the change between the two is eased.
- First person with it on: the camera rides that body's eye, position only. Say what he then sees of his own arms.
- **Rows, only for what a look cannot show:** with the switch off every pose is main's; his kept runs replay the same with it
  on; one pose, two cameras is green with it on.
- **Judged by a look:** the film as asked above (fixed outside camera, lit, the runner today beside the runner on the
  generator: a sprint, a turn, a stop and a start), and his own eye in play with the key.

**Then, each its own lap, each on the new body:** the feet held where they land and the legs through turns; the look, reopened,
with its shares sourced; the states and their changes, leaving `Body::pose` one at a time. When the last state has left it,
`Body::pose` is removed.

**Registered:**
- **It failed on his terms if,** with the key on, the runner's hands still reach forward as it runs, or its legs do not follow
  where it goes.
- **It is wrong if** any lap from this line on adds to `Body::pose`.
