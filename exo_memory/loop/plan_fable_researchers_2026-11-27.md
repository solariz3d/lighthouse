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

## Revised 05:15, at his word: "wait lets plan again how to use the researchers right if we figured new shit out"

**What is new since the table above** (each with its file):
- R3 as written is mostly answered: pane A's prototype brings a run to a value with 0.0000 m of spread
  (`loop/plan_t180_sculpt_even_2026-11-27.md`, sections 1 and 2). What that plan leaves open is not the mathematics: the
  ramp's length (its call 3, "30 m as a first guess"), a closed lap's seam, and the ROUTE "even", a hand-bent turn made a
  true arc (its call 8).
- A's read of other editors reached three pages; one was refused (the same plan, section 5).

**The librarian's reading, to be confirmed by him, not a finding:** three open things are one question asked three times.
The follow tool (a measured road into clean pieces), "smooth the geometry, keep the bumps", and a hand-bent turn made
even are each "from a rough curve to the clean one it was meant to be". If so, the researchers are best spent on that one
question from different sides, and less on scattered ones.

| | question | feeds | change |
|---|---|---|---|
| R1 | A measured or hand-shaped line into the fewest straights, arcs and easing curves inside a tolerance, and where one element ends and the next begins | the follow tool; class 1's open cause; the route "even" (A's call 8) | sharpened: now also his own hand-bent turns |
| R2 | Modelled roughness against designed shape, as scales and as a number | the follow tool's addendum and its registered smoothing test | kept |
| R3 | How long an easing has to be: the rules road, rail and ride designers use for how fast a bend, a bank or a width may change at a given speed | the ramp length in Even (A's call 3); the bank's ramps (`loop/plan_t180_smooth_banked_turns_2026-11-24.md`) | REPLACES the mathematics question |
| R4 | Timing tests that sit at their limits | the timing rows read by hand at every landing | kept |
| R5 | How spline road and track editors let a user make things even, constrain them and snap them, and what their users complain of | a Sculpt refactor (`handback/p-l260-sculpt-carry-A_2026-11-27.md`, "For a refactor of Sculpt"); goes past A's three pages | NEW |
| R6 (optional) | What authors and communities ask of derived work | his open call on naming a reference's author | was R5 |

Still nothing started. Asked of him: whether the playdough picture was about the SHAPE of the curve as well as its width
(it decides whether R1 covers his own turns), and which of these he wants.

## Added 05:16, at his word: R0, the car itself, first

> "do you even understand how a t-180s works from the opensource ohyeah github repo? Maybe we should get a refresher"

**What the room holds, checked by a grep:** no. The record names the car's public repository 25 times
(`github.com/ohyeah2389/Assetto-T-180`) and holds the TRACK side (`research/t180_track_mathematics_2026-09-28.md`,
`research/t180_be_like_water_2026-09-28.md`). No file in the room or in the builder at c522ea6 says how the car works from
its source. A physics note of 2026-09-29 survives only inside an evidence snapshot.

**R0, started now, one researcher:** read the car's repository and the car as installed on L, and write
`research/t180_car_how_it_works_2026-11-27.md`: how it drives, what it asks of a track, its numbers with file and line at
a named commit, the patch features it leans on, its licence, and what our plans assume about it that the source does not
carry. R3 (how long an easing has to be) waits on it. R1, R2, R4, R5 and R6 still wait on his yes.

**His word, 05:18:** "then once we learn more about the cars, thats when we can be closer to asking the right questions, surpirsing to me we got this far without it". So R1 to R6 are HELD, not just unanswered: the questions are redrafted with him after R0's note is in, from what the car's source says.

## CORRECTION, 05:23: "What the room holds: no" was wrong

I grepped the room's research folder and the builder's README and docs, and told him the car's source had never been read.
The builder's checker carries it: `src/validate/limits.js` at c522ea6, `MACH6` (lines 8 to 75). Its downforce ray
(`:42`: 0.4 m up, 1.0 m ahead, 1.0 m long, full within 0.5, none at 0.9) and its downforce (`:48`: 200 N per m/s, 850 kg) are
said there to be read from the installed car's `script.lua`, and they equal the researcher's figures for v0.12.0. The same
file holds limits measured from his own replays (chassis 40 g, proven 90 g, sustained 55 g, top speed 970 km/h).
**So: the builder knew the car as installed; this seat did not know the builder knew.** What R0 adds is in the note's
last section, "Against the builder's own car model".

## His idea, 05:26: study each T-180 for differences in clipping potential

> "but one thing we could do that could be briliant, use the researchers to study each t-180 to see potential differences in clipping potential"

**Where it meets the record:** the builder's limits are written per car and filled for one. `src/validate/limits.js:2-3` at
c522ea6: "Per car, from its open config …; the Mach 6 is the only car FINDINGS measured, so it is the default." His idea
fills the other rows.

**Scouted by the librarian in the clone (sha 4262dedf), before planning:**
- The repository holds 14 T-180s (7 by the repository's author, one of them with no data folder; 7 by a second author),
  2 + 1 prototypes and one other car, over one shared `Source/base`.
- **No T-180 has its own bottom box, suspension file or tyre file.** The box that meets the road is the base's
  (`Source/base/data/colliders.ini`: centre 0, 0.2, 0; size 2.0, 0.5, 3.0). The six installed collision meshes I sized are
  all 12,929 B, so probably one mesh (not hashed yet).
- **What differs per car is in small add-on files:** `car.addon.ini` (13 cars), `power.lut` (12), `drivetrain.ini` (10),
  `final.rto` (10), `suspensions.addon.ini` (7), `aero.addon.ini` (6), and `car_config.lua` (13: thrust, drift helper
  angles, one or two turbines, jack size).

**So the split is by quantity across all 14 cars, not one researcher per car** (they share one base; a per-car reader would
re-read the same base 14 times). Every car gets a row in every table.

| | reads, for all 14 | gives |
|---|---|---|
| C1 | what can touch the road: the box, the collision mesh (hash each installed one), tyre radius, and every per-car suspension and car add-on | how low each car sits and how far it can sink, against the Mach 6 |
| C2 | what presses the car down and what resists: mass, springs, bump stops, the scripted downforce's per-car cases, the aero add-ons | the load at which each should reach its stops, against the Mach 6 |
| C3 | what makes it fast: power, gearing, turbines, thrust | each car's speed potential against the Mach 6, since load on a given curve grows with speed squared |
| C4 | installed against the repository, car by car (versions, the readable installed files; `data.acd` is not unpacked) | which figures above are what he actually drives |
| then | one writer joins the four tables into `research/t180_cars_clipping_potential_2026-11-27.md`, ranks the cars, and registers a prediction per car; a checker reopens every cited line | |

**The limit, said before it runs:** the source gives POTENTIAL. The Mach 6's 40 g and 47 g were measured from his replay
(`limits.js`, `chassisG`). For the other 13 the note can only predict a shift from the Mach 6; a lap of his in that car on
a track he has already measured is what would score it.

Six agents in all. Waits on his go, and on one choice: the cars as installed (v0.12.0), the head, or both.
