# Plan: a small gathering of Fable researchers, for his yes or his changes (the librarian, L, 2026-11-27 05:12)

**His words,** 05:11: "we have tons of usage to use, do you think you wanna do a small gathering of fable researchers to help
in some way? Lets plan on how they help first" (verbatim in `briefs/lighthouse_the_room.md`). Nothing is started by this file.

## Prior art

- His offer of 2026-11-25 00:47 (`briefs/lighthouse_the_room.md:429`) and what came of it:
  `research/running_only_the_tests_a_change_needs_2026-11-25.md`, `research/same_shape_elsewhere_2026-11-25.md`.
- Pane E's four reader subagents, 2026-11-26, and the caveat it recorded about how pages were read:
  `research/clean_ui_design_sources_2026-11-26.md` ("How each source was read").

## The rule for choosing a question

A researcher gets a question only where (a) a decision of his or a plan of ours is open and waits on it, and (b) the answer
is in sources outside the room, not in our code. A pane measures the code; a researcher reads the world.

## The questions (one researcher each; all disjoint)

| | question | the open thing it feeds | not to repeat |
|---|---|---|---|
| R1 | Recovering a designed road from a measured one: how surveyors and road or rail engineers fit straights, arcs and easing curves to a measured centreline, with the fewest pieces, inside a tolerance | the follow tool (`loop/plan_t180_follow_tool_2026-11-27.md`, its sections 3 and 7) and class 1 of the catalogue, whose cause is open | the plan's own steering and its figures |
| R2 | Telling modelled roughness from designed shape: how road-profile and curve-fairing work separates scales (what counts as a facet, what as a bump), and what "smoother, same road" is as a measured number | the follow tool's addendum A1 to A6 (facets under 2 m, design over 16 m, a gap between) and its registered smoothing test | the addendum's facet survey |
| R3 | Bringing a stretch of a spline to one even value with smooth ends: the mathematics (a flat-topped window, a fit to a target under a fairness measure) and what it does at the joints | `briefs/t180_sculpt_even.md` and pane A's plan | pane A's read of how other EDITORS present it (A has that) |
| R4 | Timing tests that sit at their limits: how large projects gate on speed without a red on every loaded run (same-run comparison, repeated samples, a statistical bar) | every landing here reads two or three timing rows by hand (D642 row 1, drag-frame row 8, release-frame row 1) | `research/running_only_the_tests_a_change_needs_2026-11-25.md` |
| R5 (optional) | What track authors and their communities ask of work derived from a track: licences, readme terms, credit | his open call on whether a save or export names the reference's author (`loop/plan_t180_follow_tool_2026-11-27.md`, section 10, A3) | his own view, which is recorded and is his |

Left out on purpose: the replay crash (dropped by him at 04:56); the exported AI line (a fix is on a branch;
`briefs/t180_export_ai_line.md`).

## What each one hands back

- One file, `exo_memory/research/<topic>_2026-11-27.md`, at most about 150 lines: the answer first; then each source with
  its address, what was opened, and the sentence it rests on; then what was looked for and NOT found.
- A last section, "What this changes": which line of which plan or brief it bears on, and whether it agrees or disagrees.
- Registered before reading: for each question, the answer that would change the plan, written at the top of the file.

## Rules they work under

- No name of his, no word of his, no project name and no other author's track name in any search or fetched address.
- Cite only what was opened. A page read through a fetch tool's summary is marked as that.
- The room's repos are read only; they write their one file and nothing else. No commit; the librarian commits.
- A checker reads the notes after: it opens each cited source again and marks every claim the source does not carry.

## Who runs them, and what it costs

- The librarian starts them as its own subagents on Fable, in the background, and reads only each file's first lines;
  the builder panes are not interrupted and no heavy-run slot is used.
- Cost: not measured. A guess of the librarian's: four or five researchers and one checker, some millions of tokens
  together. The usage ledger will say after.
- Each note goes to the pane whose plan it feeds, through the chair, as a pointer.
