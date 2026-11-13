**CHECKPOINT on 2026-11-13 at 07:38 local, on L: the swarm is STILL RUNNING, at the keeper's word ("wait no let the swarm finish! I will stay after 8 if it needs to", 07:36). All 16 readers have finished; 15 of 16 second readers have returned and the sixteenth (02) wrote its section at 07:37; the Apply stage (three writers) and the Critic have not run yet.**

# Absolute sources: the state at this checkpoint, and how to go on if it is cut

Written by the Third Place seat, which launched the swarm at 06:25 at the keeper's word (run `wf_b79d39a2-287`,
36 agents, Opus 5.5). The record of why and how is `third_place/2026-11-13.md`. This file is rewritten when the
swarm finishes or is cut; its first line always says which.

## What is here

- `01_…md` to `16_…md`: one file a topic. Each has what was read, numbered findings (every one marked [read],
  [summary] or [inferred]), what it offers the game (marked [ours]), where it strains something the room holds, what
  could not be obtained, and what is not verified.
- Where a second reader finished, the file ends with "## Second reader, 2026-11-13". Wrong text is struck in place
  with the correction beside it, and the section's last line says how far the file can be trusted.
- `absolute-sources.workflow.js`: the swarm's script, copied here by the librarian.

## What is not here yet

`90_for_the_story_bible.md`, `91_for_abilities_room_and_rescue.md`, `92_risk_and_wording.md` and
`99_what_is_missing.md`. Until they exist, nothing in this folder has been applied to the story bible or to any
build path, and no critic has read it.

## The counts, as each agent returned them

From the run's journal on L (`node swarm_table.js journal.jsonl`; neither file is in the repository). These are the
agents' own counts. Nobody has recounted them.

| topic | findings | [read] | [summary] | offers | second reader: checked | ok | wrong | unsupported | downgraded |
|---|---|---|---|---|---|---|---|---|---|
| 01 memo_whole | 61 | 60 | 0 | 21 | 37 | 27 | 6 | 1 | 3 |
| 02 monroe_books | 60 | 73 | 6 | 14 | not returned at 07:37 | | | | |
| 03 gateway_toolkit | 60 | 60 | 0 | 21 | 39 | 35 | 3 | 1 | 0 |
| 04 army_and_institute | 60 | 56 | 3 | 13 | 79 | 73 | 4 | 1 | 1 |
| 05 the_absolute_lineage | 58 | 55 | 1 | 15 | 64 | 48 | 8 | 5 | 3 |
| 06 grief_of_the_child | 60 | 34 | 26 | 16 | 76 | 66 | 7 | 3 | 0 |
| 07 bonds_and_presence | 60 | 43 | 17 | 20 | 68 | 59 | 5 | 3 | 1 |
| 08 the_surviving_parent | 60 | 40 | 20 | 16 | 79 | 70 | 4 | 4 | 1 |
| 09 chase_dreams | 60 | 46 | 23 | 14 | 75 | 58 | 9 | 8 | 0 |
| 10 the_threshold_of_sleep | 60 | 45 | 15 | 20 | 78 | 62 | 7 | 9 | 0 |
| 11 the_edge_of_death | 60 | 44 | 15 | 15 | 67 | 54 | 10 | 2 | 1 |
| 12 story_in_the_walls | 60 | 50 | 7 | 22 | 35 | 28 | 5 | 1 | 0 |
| 13 beats_per_run | 60 | 55 | 0 | 10 | 56 | 45 | 8 | 1 | 2 |
| 14 names_and_the_law | 60 | 52 | 4 | 16 | 61 | 53 | 7 | 1 | 0 |
| 15 binaural_evidence | 60 | 42 | 18 | 13 | 66 | 59 | 5 | 2 | 0 |
| 16 horror_that_carries_love | 60 | 60 | 2 | 18 | 64 | 56 | 5 | 1 | 2 |
| total | 959 | 815 | 157 | 264 | 944 | 793 | 93 | 43 | 14 |

Some rows do not add up as returned (02, 09 and 16 report more marks than findings). The agents counted marks, and
a finding can carry more than one. Left as returned.

**Read this before building on anything here.** The second readers corrected about one checked claim in six (150 of
944). A claim no second reader reached has had no such check, and it is my inference, not a measurement, that it
errs about as often. A finding that is struck, or an offer marked as standing on a struck finding, is not to be
built on.

## If the run is cut before it finishes

1. A run cannot be resumed from another machine or another session. Run only the script's last two stages (Apply and
   Critic) against the committed files. The script's three paths at its top (`OUT`, `SCRATCH`, `EXO`) are L's.
2. **One gap to fix in the script first.** The story-bible writer is told to read the bible, the story build path
   and the design briefs, and is not told to read the keeper's picks of 2026-11-13
   (`briefs/dreamzone2_the_game.md`, item 183 and items 184 to 188). The librarian's letter
   `third_place/to_the_third_place_2026-11-13b.md` lists the picks that bear. One of them settles a call the writer
   is asked to lay out as open (how the father dies). If the run does finish here, `90_…` is to be read against
   those picks before it is used.
3. `14_names_and_the_law.md` is research and not legal advice, and says so.

## Two things seen at this checkpoint, each read by me in the file

- `03_gateway_toolkit.md`, F47, marked [read] and found OK by its second reader (V28): the Gateway Experience's
  Wave VIII ends on a track named "The Absolute". The finding quotes its manual: "As you make your way through a
  long hallway, you will find yourself in front of the final door."
- `01_memo_whole.md`, the second reader's last line: every quotation and number taken from the memo held up; the
  errors were in interpretation and in the story of where page 25 came from. It names F10, F21, F25 and F28 as the
  findings to re-read before building on them.
