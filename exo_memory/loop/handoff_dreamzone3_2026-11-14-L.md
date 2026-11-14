# Dreamzone 3 ("The Absolute"), handoff from L to D, 2026-11-14

Written by the librarian on L at 07:0x local, before the laptop closes at 08:00. THE CLOSE at the end is written last; where a
line above disagrees with it, THE CLOSE holds. It continues `loop/handoff_dreamzone3_2026-11-13-D.md`; what that file holds and
tonight did not touch is not repeated.

## His words that set tonight's work (verbatim; whole in `briefs/dreamzone2_the_game.md` at the item named)

- Item 220, 04:45, after playing 99b6045 on L: "the entity still isnt perfect where i want it, its physics still look unrealistic
  with how it does sharp turns, the body should orient itself where it is trying go, like a bird or a space ship banking into a
  turn ... it like loses all speed, repoints itself then goes, instead of like flowing through it still, same when the hunter
  gets close to the runner, they like let off for a second and stop before touching the runner. Other bug, sometimes when i
  look back, it messes with my sprint speed making me glitch, as well, the look back also causes this border of noise or
  graininess. I thought we fixed that"
- Item 221, 04:47: "i want a procedural animation system, that interacts with the environment in a realistc way like rockstars
  rage engine, we had these plans for a proc animation system but continued to build off of what we had instead of restarting
  with the research i swear."
- 05:36: "sounds good, so where were we with the proc system for animation physics etc"
- 05:48, to the plan put to him (A lands the grip law behind its switch; then C builds the lean): "go"

## Where the code is (checked 06:5x with `git ls-remote` and the clone on L)

- **dreamzone-3 origin/main is 145b698** (it was 99b6045 at D's close). Two landings on L tonight, both by the train:
  - **c205622**, A's `a-d673-close`: in overtime the Dark comes straight at a player within 10 m and no longer circles one who
    jukes (L209, landed by B; `handback/p-l209-a-landings-B_2026-11-14.md`).
  - **145b698**, A's L182 grip law behind nine dials, every one off (L210; `handback/p-l210-grip-A_2026-11-14.md`). Off means
    off: A's 12-seed md5 `fa938de4...` is equal before and after, his 20 kept runs replay 20 of 20, and the defaults are at
    `chase/speed.h:40-48` (read by me).
- **Waiting on the remote:** `origin/a-l210-merge` a62d66f (the run record, B's Park kit and A's two kit commits; red only on
  the kit's two rows); B's `gen-lap2-kit` fcf5c43 (holds 28c6879, the nav row re-registered); L211's branch (THE CLOSE).
- **D has built none of this.** Pull, then build, before anyone says what runs there.

## What was learned tonight that changes the plan (each with its file)

1. **The stall and re-point at a corner is the chase's movement law, stated as intended** (`chase/chaser.h:8-12`;
   `chase/chaser.cpp:331-343`, `:365-372`; opened by me at 99b6045). The drawn body does not cause it.
2. **The right lean is computed each tick and discarded.** `game/world/world_app.cpp:561` computes
   `atan(speed * turn / 9.81)`; `:609` replaces it with the drawn estimate, which gives 9.8 degrees where physics asks 45
   (`game/model_rig.cpp:504-516`; `game/tests/model_rig_tests.cpp:510-517`).
3. **The let-off before the touch has no traced cause on main** (`loop/physics_first_body_read_2026-11-14.md:78-85`).
4. **Public text on RAGE with Euphoria is press.** It places the physics at reactions on top of an animation system (same
   file, section 3). Three options for how far physics goes are in its section 4.
5. **The game cannot set a chase dial at launch** (`handback/p-l210-grip-A_2026-11-14.md:46-50`). L211 builds one argument.
6. **A's table of the six settings, what each shows and its known fault** (same file `:54-61`). `line_clearance` with
   `look_ahead` livelocks chasers at corners; both stay 0 (`:42`).
7. **The byte-identity value in the L182 hand-back (`599ab239...`) is stale; main's is `fa938de4...`** (same file `:10`).
8. **He had already picked grip as the hunter's one raised ability** (game brief item 168; `librarian/2026-11-13.md:706`). I
   put the fork to him at 05:1x as if that were open. The play settles how much grip; whether the root is rebuilt as a mass
   under a grip limit (option B) is his after it.
9. **The Third Place's new card names pursuit against interception** (`cards/watch-the-bearing.md:70-74`); the dial for it
   exists and is off (`lead_range`, `chase/speed.h:38`).

## PICK UP HERE (D), in this order, one pane at a time

**FIRST, AND OVER THE NUMBERED LIST BELOW: at 07:05 he said "i said plan and build the new system". The plan of record is
`loop/plan_new_system_2026-11-14.md`.** After item 1 (pull and build), the desktop starts its lap M1 (pane A, the root law, red
first) and then B1 (pane C, the lean from the root's own acceleration). Item 3 below (the corner-room lap) is STOPPED by that
plan: it patches the rule the new root replaces. Item 4 is B1. Do not ask him again whether to build it.

1. Pull both repositories. Build the game at main on D.
2. **His play of the six settings.** THE CLOSE says whether the launch argument landed and gives the lines. If it did not land,
   pane A lands its pushed branch first.
3. **Pane A, the corner-room lap as registered on D** (`handback/p-corner-room-A_2026-11-13.md`; `librarian/2026-11-13.md:696`,
   `:706`, `:907`). It resumes with the nav `open_along` commit red first. It is the sprinter row's fix (70 of 96 against 72 in
   the kit's world). Then the kit lands: `a-l210-merge` with B's 28c6879, by the train.
4. **Pane C, the lean lap** (L3 of `loop/path_of_record_animation_2026-11-13.md:41`, `:84-86`), now that the law is on main:
   the lean drawn from the simulation's per-tick number, sized `atan(min(a, mu g) / g)`, tipping about the feet (the chain
   pivots at the pelvis today, `game/model_rig.cpp:620-641`). Red today: the row that pins 9.8 degrees at 1 g, amended by name;
   and the lag from the turn's peak to the lean's peak, bar 0.05 s (`loop/physics_first_body_read_2026-11-14.md:188-191`).
   Filmed at grip 1.0, 1.3 and 2.0. Two accounts of today's drawn lean disagree (same file `:94-96`); C runs both first.
5. Pane A, the registered brutal arms g13, g16, g20.
6. **The look-back pair** (item 220): the sprint fault red first; the grainy edge filmed with the filter off and on. Not started.
7. The shared core after that, as the path of record orders it (`:105`): L5, L6, L9, L10, L11.

## For his eye

- Tonight's page of the seven traces, if it was built: THE CLOSE.
- The soft upper body, still waiting: https://claude.ai/artifact/HNhdMFQqBKvuBKwAqfSRFz
- The rest as D's handoff lists them (`loop/handoff_dreamzone3_2026-11-13-D.md:121-133`); none was answered tonight.

## Open with him

- **Flow or beatable.** Asked at 05:1x, not answered: the hunter loses speed at corners by design; if it should flow, what makes
  it beatable instead.
- How much grip, after the play. Whether option B is built, after the play.
- Carried, unanswered: `loop/handoff_dreamzone3_2026-11-13-D.md:121-133`, `:156-160`, `:210-211`.

## Not checked by me

A's two md5s and the 20 of 20 (its evidence files); A's numbers for each setting (its L170 and L182 hand-backs); the reader's
arithmetic port and its five outside pages; whether D's clone builds at 145b698.
