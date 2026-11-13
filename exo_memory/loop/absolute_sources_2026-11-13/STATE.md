**COMPLETE as of 2026-11-13, 09:11 local, on D. The swarm itself ENDED at 08:03 on L at the keeper's word (he had to leave; "cant we just get another agent to criticize it when i get home?") with 16 readers, 16 second readers and the three applying writers finished (files 90, 91, 92) and the Critic cut. The Critic was then run fresh on D as one Opus 5.5 agent, started at 09:02 at the same word, and wrote `99_what_is_missing.md`. Nothing here has been applied to the bible or a build path.**

> **Added on D, 09:1x.** The sections below were written on L before the critic ran and are left as written; where they
> say `99_what_is_missing.md` does not exist or that one stage is left, this note supersedes them. The critic's task was
> the script's own, plus one list the script did not ask for (where files 90, 91 and 92 disagree with each other). It
> read all 21 files in the folder, made no outside request, and did not re-check the line numbers 90 to 92 cite in the
> room's own files. Three of its claims were spot-checked by this seat against the files and held (90's launch line that
> names a parent's death; 90 SB09 against the pick `story_lore-7`; 92 W20 citing 04 O5, which its second reader marked
> unsupported).

# Absolute sources: where the swarm ended, and the one stage left

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

- `90_for_the_story_bible.md`, `91_for_abilities_room_and_rescue.md`, `92_risk_and_wording.md`: the three applying
  files. Each maps the checked findings onto the room's files as offers, names the pick of the keeper's that bears,
  and lists what not to build on. `90` also lists 24 corrections the sources force on the room's own bible, build
  path and notes.

## What is not here

`99_what_is_missing.md`. No critic has read this folder. The applying files are offers: nothing in them has been
written into the story bible or any build path, and none was weighed against the code or play.

## The counts, as each agent returned them

From the run's journal on L (`node swarm_table.js journal.jsonl`; neither file is in the repository). These are the
agents' own counts. Nobody has recounted them.

| topic | findings | [read] | [summary] | offers | second reader: checked | ok | wrong | unsupported | downgraded |
|---|---|---|---|---|---|---|---|---|---|
| 01 memo_whole | 61 | 60 | 0 | 21 | 37 | 27 | 6 | 1 | 3 |
| 02 monroe_books | 60 | 73 | 6 | 14 | 60 | 55 | 1 | 1 | 3 |
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
| total | 959 | 815 | 157 | 264 | 1004 | 848 | 94 | 44 | 17 |

Some rows do not add up as returned (02, 09 and 16 report more marks than findings). The agents counted marks, and
a finding can carry more than one. Left as returned.

**Read this before building on anything here.** The second readers corrected 155 of the 1,004 claims they checked,
between one in six and one in seven. A claim no second reader reached has had no such check, and it is my inference, not a measurement, that it
errs about as often. A finding that is struck, or an offer marked as standing on a struck finding, is not to be
built on.

## The one stage left: a critic, on any machine

1. One agent does it. Its task is the last `agent(...)` call in `absolute-sources.workflow.js` (the prompt that
   begins "YOU ARE THE COMPLETENESS CRITIC"), with the rules block `COMMON` from the top of the same script. It
   reads every file in this folder and writes `99_what_is_missing.md`. The script's three paths (`OUT`, `SCRATCH`,
   `EXO`) are L's; a run cannot be resumed from another machine or session, so start that one agent fresh.
2. **The gap I feared in the script did not bite.** The story-bible writer was not told to read the keeper's picks
   of 2026-11-13, and it read them anyway: `90`'s header says it was read against item 183, and its section 3 cites
   his pick on how the father dies. The critic should still check `90` to `92` against item 183 and items 184 on.
3. `14_names_and_the_law.md` and `92_risk_and_wording.md` are research and not legal advice, and say so.

## Things seen in the files, each read by me

- `90_for_the_story_bible.md`, SB04 and section 2: the memo's page 24 gives the Father and the Son and breaks off
  mid-sentence at "serves the"; the Holy Spirit sentence is on page 25, the page missing from the CIA's copy until
  2021. The reading of that missing third as the love is marked [ours] there.

- `03_gateway_toolkit.md`, F47, marked [read] and found OK by its second reader (V28): the Gateway Experience's
  Wave VIII ends on a track named "The Absolute". The finding quotes its manual: "As you make your way through a
  long hallway, you will find yourself in front of the final door."
- `01_memo_whole.md`, the second reader's last line: every quotation and number taken from the memo held up; the
  errors were in interpretation and in the story of where page 25 came from. It names F10, F21, F25 and F28 as the
  findings to re-read before building on them.
