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
