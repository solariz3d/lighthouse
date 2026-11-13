# Plan: an all-out swarm for the animation system (every entity and the player). Librarian, on D, 2026-11-13 14:5x local

**His words** (verbatim in `briefs/lighthouse_the_room.md` and `briefs/dreamzone2_the_game.md`):
- 14:45: "we have just over an hour with tons of usage to spare, we should do one more swarm run on the next phase we get or are
  guided towards"; 14:46: "hold off for a minute though until we get more shit".
- 14:49: "I have a better idea, spend the last of our usage on an all out swarm to create not just an animation system for the hunter,
  but a system that will helps us make very elegant animations for the rest of the entities and even the player character. We can do
  all the research of real open source shit and real techniques. you got the planning better than I do"
- The same ambition, two days ago (item 156): "kinetic linking, making the whole body work as one. We need to make that but better
  for all entities and even the player character".
- His method for the hunter (item 217, 14:43): a good measure of a human sprint, then tweaks that look uncanny "in a realistic way
  that obeys physics". His catch at 14:32 (item 215): "we did do tons of research, remember".

## Why it starts from the record

The room holds about twenty-five animation hand-backs and twelve plans from 11-11 to 11-13 (L161, L169 to L177, L179 to L193, L195,
L200, L205, D659, D672). Twice today a seat answered him without opening them (items 214 and 215). So the swarm's first phase is six
ground readers who map what is decided, built, already read at source and still owed. Every scout reads those six files first and
is told to add only what they do not hold.

## What it is

Forty-seven agents. Output: `loop/animation_system_2026-11-13/`.

| phase | agents | model | what |
|---|---|---|---|
| Ground | 6 | Opus | his words; the open sources and talks already read; physics and the first-person body; locomotion laws, the kit and the yardstick; the code as built; the constraints, assets and roster |
| Scout | 18 | Opus | one aspect each, open-source code and measured studies read at source, licences quoted |
| Second reader | 18 | Sonnet | one adversarial reader per scout file, corrections struck in place |
| System and build path | 2 | Opus | the system's design; the ordered laps across panes with each lap's first failing row |
| Check | 2 | Opus | a second reader for each of those two files |
| Critic | 1 | Opus | the registered tests, the re-derivation count, what is unread, the stop rule |

The eighteen aspects: animation runtimes; Overgrowth's procedural method; motion matching; open motion data and licences; inverse
kinematics and foot planting; secondary motion and physics; gaits for arbitrary bodies; turning, banking, stops and starts; the
upper body and gaze; the uncanny by physics; the player's first-person body; traversal (climb, ladder, drop, chute); authoring and
tuning tools; evaluation and the yardstick; performance and determinism; models and skeletons for the lesser kinds; states and
transitions; shipped games' systems with public breakdowns.

It reads and designs. It builds nothing, runs no game and no bench (his game is on the card), installs nothing, messages no seat.

## Registered before it runs

- **It did nothing if** its build path's first three laps could have been written this morning from the room's own hand-backs (the
  critic judges this against the ground files) **and** no lap has a first failing row on a recorded case of his.
- **It re-derived if** more than a quarter of the findings in the system file are already in the room's hand-backs or the brief's
  items. The critic counts them, with line numbers on both sides.
- **It broke his rule of item 153 if** any mechanism in the system file has no source and is not marked as ours.
- **The size, said first** (today's lesson, `map/M.md` 14:16): this has no cost in tokens or minutes to recover. Its size is that
  animation has taken most of the game's laps this week, one feature at a time, and each new entity kind would repeat them. What the
  system can save is those repeats. If the next entity to get a model still needs its own from-scratch laps, the saving did not
  happen. That is read at the first lesser kind that gets a body.
- **The stop rule stands:** no further level unless a named question's answer changes what gets built.
- **His eye decides elegant and creepy.** The system may only make the clips he is shown fewer, fairer and faster to make.

## SCORED, 16:2x (the librarian)

**The run:** `wf_97e6d3cb-d71`, 47 agents, 0 errors, 13,206,663 tokens, 3,098 tool uses, 83 minutes. Files in
`loop/animation_system_2026-11-13/` (lighthouse 61a25e9a). Read whole by this seat: `00_critic.md`; of `00_build_path.md`, its
second reader's summary, tally and two lists (:868-984); of `00_system.md`, the head of its second reader's section (:588-600). The
bodies of the system, the build path, the ground files and the scouts were NOT read by me.

**The registered clauses:**
- **"It did nothing if …": did not fire.** The third lap (the whole-body lean by physics) is on no hand-back; each of the first three
  laps names a red row on his kept run `run-20261112-204506`. Said beside it by the critic: no red row was run (`00_critic.md:125-147`).
- **"It re-derived if more than a quarter …": FIRED.** 31 of 56 findings in the system file were already in the room's hand-backs
  or the brief, 55% (`00_critic.md:149-198`). Only 8 of the 31 were worked out again by a scout; the rest are the landed base, cited.
  And the build path's second reader found worse: 14 of its 29 laps were already written, aim and mechanism, in the build paths of
  this morning, which the swarm's build path never cites (`00_build_path.md:870-878`, `:945-949`).
- **"It broke his rule of item 153 if …": FIRED.** Five mechanisms in the system file have no source and are not marked ours
  (`00_critic.md:200-212`).
- **The size** is read at the first lesser kind that gets a body, as registered.

**The fault in the brief, mine.** The ground phase was built from two listings (`handback/` and `loop/plan_l1*`). It left out
`loop/buildpath_*_2026-11-13.md`: fifteen build paths written on L this morning, entity_bodies, player_body, movement and
chase_entities among them. I amended one of them myself today (`buildpath_world_gen`). A third of the swarm's build path redoes
them.

**What the swarm found that the room did not hold** (`00_critic.md:214-230`, each to be shown before it is believed):
1. The hunter's drawn lean in a corner is about a sixth of what its speed and the bend ask, and its feet stay under its hips. Read
   from the code; not yet in a clip.
2. The hips' skin follows the chest's small share of the bank because of how one bone is aimed; pane C suspected it on 11-12; a
   remedy with no new joint, which would also stand the waist upright on straights unless that is kept.
3. The hunter's stride is timed by drawn frames, so it differs at 144 and 360 frames a second and keeps cycling while paused.
4. The hunter is drawn standing through drops and ladders; ladders have no rungs; the dark one is drawn by nothing in overtime.
5. Sourced numbers, each from few studies: landing depth, feet held where they land, the torso in a bank, the head at a run.
6. The clip tool saves one frame in twelve and records neither build nor run.

**A ruling of mine that the swarm's critic overturns** (`00_critic.md:46-52`, `:70`; checked by me at
`handback/p-l182-lines-A_2026-11-12.md:14-17` and on the remote): the grip law he picked in item 168 IS BUILT. Pane A built it on
11-12 as L182 (`c357bbd`; branches `origin/l182-hawk` and `origin/l182-lines`): `turn_law` 3 gives the hunter
`min(V, sqrt(mu g R))` with one dial `grip_mu`, every dial off by default, three grip arms registered and their sweeps not run. At
15:4x I ruled it be built as a new lap and told him it "has never been built". Withdrawn: what is owed is its registered sweeps, its
landing behind its dial, and his word on switching it on.

**The four open questions the critic names** (`00_critic.md:232-248`), each his call or his eye: whether the grip law is on when the
lean ships; which gravity the kid's lean uses; which lesser kind gets a body first; whether the picture physics fits the frame.

**Taken from it, and no more yet:**
- The critic's five checks before anything is built from the folder (`00_critic.md:250-261`).
- The first laps, in their corrected forms: a fair clip tool (E), the pelvis framed by the hips' line with its pitch kept (C), the
  whole-body lean about the feet with the chain on top (C). They follow the laps already in flight.
- **Owed before more is dispatched:** one path of record, made by setting this build path beside the fifteen of this morning, lap
  by lap. That is this seat's work and it is not done.
