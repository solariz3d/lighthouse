# Dreamzone 3 ("The Absolute"), handoff 2026-11-13 (L, written 07:2x local; the close is at about 08:00 and is filled in at the end)

Written by the librarian on L. The desktop picks up from this file, from `briefs/dreamzone2_the_game.md` (his words, items 1 to 190;
items 183 to 190 are today's) and from each pane's "WHERE IT STOPS" section named below. The run's carrier is
`loop/plan_13h_run_2026-11-13.md`; its sections (e) and (f) route his answers.

## Where the code is

- **dreamzone-3 `main` = `origin/main` = `31d1c6d` at the close** (see THE CLOSE at the end; it was `cc8eea8` when this section was first written at 13:15Z). The
  launcher on L says up to date.
- **Landed on 2026-11-13, in order:** L191 the arm shape (04f3882); L188 step 1 the player's feet (8dda6d9); L185 steps 1+2 the
  skeleton and ragdoll, nothing visible (682e699); generator Lap 1 the measure and the pin, with the parallel suites (c9d520e);
  then one train batch (cc8eea8): the drop harness (L189), **Lap R the run record's format** (L197), **his arm pick V1** (L195) and
  the motion yardstick (L193).
- **Landings go through the landing train** (`consonance/tools/landing-train.js`; `handback/p-l194-landing-train-B_2026-11-13.md`).
  A pane marks a branch READY; someone must start the train (no owner yet).
  - **OWED ON L (added 2026-11-14 04:1xZ by pane B on D, at the chair's D675 word):** once lighthouse `train-exit3-b` lands, add to L's
    `C:\Consonance\data\landing-train.config.dreamzone-3.json` the one key `"reread": ["build\\bin\\dz-world.exe", "--selftest"]`.
    Until then a world self-test exit 3 (machine-bound reds only) stays red in the train, as before. The config is not on D. Why:
    `handback/p-train-exit3-B_2026-11-14.md` §6.

## Branches in flight (each pane's own "WHERE IT STOPS" section is the master; the shas here were read at 13:15Z)

| lane | branch on origin | state when read | the pane's file |
|---|---|---|---|
| C, the hunter's legs (L200) | `l200-legs-on-cc8eea8` 2746681 | green on the yardstick's bars by C's line; in final checks | `handback/p-l200-legs-C_2026-11-13.md` |
| C, the run's frame and the late timer | `d673-frame` (rebases on A's overtime landing) | not started today; two timer stills drawn | `handback/p-run-frame-timer-mock-C_2026-11-13.md` |
| A, the overtime chase (one difficulty, 10 minutes, Parks close) | `a-d673-overtime` 9cf6b1d | rebasing on cc8eea8 | `handback/p-d673-overtime-A_2026-11-13.md` |
| A, the turning law, the hawk and the exploit search (L182) | `l182-hawk` ee55947 | the search finds the circle strafe and not wall to wall; A is replaying HIS recorded run | `handback/p-l182-lines-A_2026-11-12.md`, last sections |
| B, the Park kit (generator Lap 2) with the door rate at 0.15 | `d665-variety-b` 151aead, merged locally for its check | checks running | `handback/p-gen-lap1-measure-B_2026-11-13.md` and B's next |
| B, the fist with new finger joints (L188 step 2) | `l188-step2` b676860 | waits on a joint list agreed with E | B's hand-back |
| E, the hunter's footsteps: timing and mix (L192) | `l192-footsteps` d8f77ba | green, not landed; the voice is being replaced | `handback/p-l192-footsteps-E_2026-11-13.md` |
| E, the hunter's voice (L199) | offline renders only, nothing in the repo | second pass: a recorded, multi-hit footfall over stomp one's boom | `handback/p-l199-voices-E_2026-11-13.md`, section 8 on |

## His decisions today (all verbatim in the brief)

- **101 of 102 answers on the decision page** (item 183; the page: https://claude.ai/artifact/Cu4oEJHEmeeQyW9jpVGPU1; its store is
  copied into item 183 by `loop/his_calls_to_brief_2026-11-13.js`). Only `sound-5` is open.
- **The title: "The Absolute"** (item 188). Nothing is renamed yet; C carries the title text as one constant with its next landing in
  `game/world`. No exe, shortcut or repository is renamed.
- **One difficulty, brutal; a run is 10 minutes** (`frontdoor_onboarding-2`).
- **The arms: V1** (item 186), landed.
- **The hunter's sound:** deep and heavy (item 184); stomp one is the best so far, "but its still sounding like a drum more than loud
  heavy footsteps of a monster" (item 190).
- **Sound sources:** Sonniss and credited items allowed; a GPL synth may be used offline (`sound-7`, `sound-8`).
- **The door rate goes to 0.15; pool rooms as a fifth interior; the generator's new structure moves up** (`world_gen-3`, `-1`, `-0`).

## A request of his for D to build (item 191, 07:20)

- "make the flashlight beam tighten button F". Today the beam tightens while a separate focus action is held (`game/world/stage.cpp:686-690`) and F turns the hand light on and off (`game/world/hud.cpp:355`). Proposed, ours, to confirm with him: a tap of F is on and off, holding F tightens. Small; red first; the controls list in `hud.cpp` changes with it.
- **The timer wording: taken as 2, "It is coming" with the countdown** (his "2 is fine, its coming"). Confirm if in doubt; the other reading is that 2 answered where he tested the exploit.

## His pick of the hunter’s voice, for D to build (item 192, 07:28)

- "recorded heavy hits, three to a step, is almost perfect, good for now": footfall one of E’s second pass (F3c in `handback/p-l199-voices-E_2026-11-13.md`, section 8b): stomp one’s boom, shortened, under recorded heavy impacts (Kenney, CC0), three hits to a step at 0, 45 and 105 ms, five takes in rotation, a 20 ms gap before each landing.
- E on D: move it from the offline tools (`l199-offline-tools` 92be868, parked, never lands) into `audio/` on `l192-footsteps` (d8f77ba), red first; the takes and a CREDITS line with them; then the game wiring C approved; then land through the train. The clip he judged is on L only.

## His next ask in sound, for D (item 193, 07:28)

- "we just need to make the player steps better now". E on D, after the hunter’s voice is in the game: the player’s own footsteps by the same method (recorded contact, more than one hit to a step from the running sources, takes in rotation, by surface if the sources allow), with the bar kept that the hunter still clears his steps on at least 7 of 14 footfalls at 12 to 20 m. A clip for his ear before anything lands.

## Open with him

1. **The late timer's words:** "in 45.8 s it comes for you itself", or "It is coming 0:45.8". Both stills are on L only (below).
2. **Does the flashlight take one of the six ability slots** (item 40 against his note on `abilities-4`).
3. **"Parks close in overtime":** built as Parks no longer protecting, with the geometry kept. He has not said whether he meant
   them sealed.
5. **Sprint speeds:** his two notes differ (10 and 12 m/s at 10:21Z; 8 and 10 m/s at 11:31Z). Taken as the later.

## Research that landed today (read the file before building from it)

- `loop/research_learning_hunter_2026-11-13.md`, `loop/research_ambush_out_of_reach_2026-11-13.md`,
  `loop/research_lowpoly_realism_2026-11-13.md`, `loop/research_fp_hands_flip_fov_2026-11-13.md` (four Sonnet scouts; routed in the
  run plan, section (c)).
- `research/heavy_footsteps_low_bass_read_2026-11-13.md` (E's).
- **Two swarms, whose state at the close is written at the end of this file:** `loop/absolute_sources_2026-11-13/` (the Third
  Place's; the sources behind the story) and `loop/sprint_reference_2026-11-13/` (mine; recorded sprinting above 4.5 m/s, to
  extend the yardstick toward the hunter's speed).

## The sprint reference landed at 07:37 (the librarian’s swarm; read it before C builds above 4.5 m/s)

- `loop/sprint_reference_2026-11-13/00_reference.md` (tables by speed, a csv block a tool can read, section 6 for the builders) and `00_check.md` (the second reader: about 675 numbers checked, 0 wrong).
- **Full joint curves above 4.5 m/s come from one runner only** (the Dorn, Schache and Pandy data, 3.5 to 9.5 m/s; angles computed by the reader from the markers, marked inferred). The other five sources give touchdown and toe-off angles or timing. Nothing above about 11.6 m/s.
- **Not spot-checked by the librarian** against the sources (no time before the close). D does that first; then E adds the curves to the yardstick as a second reference tier, and C’s legs above 4.5 m/s are scored against it.

## The yardstick's work list (the hunter and the player against recorded runners)

- The hunter: `handback/p-l193-yardstick-E_2026-11-13.md`, section 4. C's L200 is the fix.
- The player: the same file, section 10. The same three faults. B takes C's law when L200 lands (the chair's lap L204).
- Nothing above 4.5 m/s is covered until the sprint reference is read and checked.

## On L only (does not travel; named so D does not look for it)

- Review folders under `C:\Users\zackn\Downloads\`: `dreamzone-3-l195-arm-variants\` (the arm sheet, clips, both timer stills),
  `dz3-l199-review\` (the two-voice and heavy-stomp clips), `dz3-l193-review\` (the yardstick's tables),
  `dreamzone-3-l188-review\`, `dreamzone-3-lap1-review\` (the four biome pages).
- The yardstick's recorded data: `Downloads\dz3-yardstick-data\` (fetched by scripts in `tools/yardstick`; D fetches its own).
- His recorded runs: `Downloads\dreamzone-3\game\runs\` on L (the wall-to-wall run is `run-20261113-082347`).
- Every pane's scratchpad.

## PICK UP HERE (D)

1. Read each pane's "WHERE IT STOPS (L, 13:5xZ)" section and the close below.
2. Land what was green and READY at the close, through the train.
3. C: L200 the legs, then the frame with the timer line he picks and the title constant.
4. A: the overtime chase; then the exploit search rebuilt from his recorded run (the run file is on L; ask for it to be carried
   if D needs it, or record a new one on D).
5. E: the stomp's second pass for his ear; then the voice goes into `audio/` on `l192-footsteps` and lands with the wiring C approved.
6. B: the Park kit with the door rate; then the idle-holder guard live; then the fist's joints with E.

## THE CLOSE (filled in at about 08:00 local)

**Written at 13:41Z (07:41 local) by the librarian. Where a line above disagrees with this section, this section is the later one.**

- **dreamzone-3 `main` = `origin/main` = `31d1c6d`** (checked: `git fetch`, `git log origin/main`; the launcher on L says up to date). The last train batch landed at 13:40:07Z: **the hunter's legs** (L200, `l200-legs-on-cc8eea8` 2746681, merge 7aa8634) and **the overtime chase** (L203, `a-d673-overtime` 37a2f29, merge 31d1c6d).
- **What he sees on that build, by the panes' own lines:**
  - the hunter's knee bends about 40 degrees under its weight and folds to about 106 to 119 degrees in swing; its foot rolls; at its own 9 to 13 m/s the shapes are ours (`handback/p-l200-legs-C_2026-11-13.md`);
  - at 10 minutes the hunter and the lesser chasers walk off, no Park protects, and one dark creature in the hunter's shape comes from behind; being caught by it or falling is the save. Its speed is an untuned first guess. Nothing on screen warns of it yet: C's frame and timer line are not built (`handback/p-d673-overtime-A_2026-11-13.md`, the landing section).
- **Parked and pushed, NOT landed:**
  - B, the Park kit with his door rate 0.15: `gen-lap2-kit` c9ad588. Four suites red and the world self-test 50 of 52; A has not yet answered what the run record carries for a changed generator (`handback/p-gen-lap2-kit-B_2026-11-13.md`, WHERE IT STOPS).
  - B, the idle-holder guard: lighthouse `l202-idle-guard` 901d3c39, green (101 of 101; mutants 5 of 5), not merged, because it goes live for every seat when it lands (`handback/p-l202-idle-holder-guard-B_2026-11-13.md`).
  - C: `l180-lap2-rest` 55d1451 (step 1 green); V2 and V3 on `l195-arm-variants` bba95c4.
  - E: `l192-footsteps` d8f77ba (timing and mix, green, not READY); `l199-offline-tools` 92be868 (never lands).
  - A: `l182-lines` c357bbd, `l182-hawk` ee55947.
- **A's open items for D** (its landing section): the brutal overtime sweep that should set the dark one's speed; 18 mutants of the overtime rules and 13 of Lap R's; the brutal arms of L182; a stale registered sum (599ab239) whose mover is a named bisect; one record line for C (`r.world.run_length_s`).
- **The two swarms:** mine is landed and committed (6a241ea3, `loop/sprint_reference_2026-11-13/`). The Third Place's is STILL RUNNING at his word (item 194; "I will stay after 8 if it needs to"); its checkpoint is committed (abf2390d) with `loop/absolute_sources_2026-11-13/STATE.md`. Its end, and my collation of it, are written below this line when it lands.


## Added 07:47: his eye on the build of 31d1c6d (item 195)

- **His words:** "the newest build, it is getting there, but now its like, they are stomping when they stride like up down up down up down in a weird goofy way".
- **For C on D, first thing in the hunter lane:** the legs above 4.5 m/s are a jog's shape played at a sprint's step rate. Take the knee's yield after landing (12 to 17 degrees at 9 m/s) and the stance share (22 to 27 %) from `loop/sprint_reference_2026-11-13/00_reference.md`, after its numbers are spot-checked. Add a row, red first: the hips' rise and fall over a stride at each speed stays within the recorded runner's (the SimTK markers give the pelvis height from 3.5 to 9.5 m/s; E's yardstick can read it). Then a clip for his eye before it lands.
- **Not established:** that the knee's yield is the whole cause. The foot's new roll and the 1 cm rise in flight are the other two changes L200 made; C separates them with the row before changing anything.

## Added 08:05: the Third Place's swarm ended (its pointer, 14:04Z)

- `loop/absolute_sources_2026-11-13/STATE.md` (git-blob 22786fa7… at the ring) says what finished and what was cut. Sixteen topic files, each with its second reader's section, and three applying files: `90_for_the_story_bible.md`, `91_for_abilities_room_and_rescue.md`, `92_risk_and_wording.md`. **The Critic stage was cut at 08:03 at his word and has no file.** Committed and pushed by the Third Place (d4db6e67).
- **NOT collated by the librarian on L** (he was leaving). On D: read `STATE.md`, spot-check a sample of the [read] marks, run the Critic stage from the script beside it (`absolute-sources.workflow.js`) if he wants it, and route what bears on the build. The story and lore judgement stays with the Third Place and him.
