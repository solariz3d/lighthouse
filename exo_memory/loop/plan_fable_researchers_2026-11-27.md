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

**His word, 05:28:** "maybe use opus researchers for this one, save the fable ones for the big job after". Read as go, on Opus. He did not choose installed, head or both: the librarian's stated default is run, the cars as installed (tag v0.12.0) with a column for what the head changes. Started as one workflow: four readers, a writer, a checker.

## His question, 05:52, and the librarian's proposal (05:53): one vector, why a fast car goes through a road

> "when do you think we should activate the fable researchers? we need to target a potent vector"

**The vector proposed:** what happens, step by step, when a car at these speeds goes through a road, and what a road can do
about it. Four things from tonight point at this one root:
- his 05:43 words (the car moves too fast for the game to keep up); as a figure, 0.81 m per 333 Hz step at 970 km/h against a 0.5 m box;
- the Type A (`research/t180_cars_body_against_box_2026-11-27.md`: a body 0.59 m outside the one collision mesh, drawn 0.10 m low);
- online play differing, worst on loops and corkscrews (his 05:41 words; no data);
- the car author's own answer to it being smaller, slower cars (his 05:43 words).

**What is already on disk, so nobody works it out again:** the builder's limits are measured outcomes, not a model:
`src/validate/limits.js:8-75` (chassis 40 g, sustained 55 g for 0.5 s, proven 90 g); `src/export/catch.js:1-12` (a second road
surface under the road, built after a replay in which a car held 56 to 62 g on seven passes and on the eighth "went through
the road 0.4 s after its peak, 2.2 m in three frames"; the road is "one zero-thickness surface (CSP's soft block, MAX_DEPTH 4)").
Checked by the librarian: no file in the builder's docs or README models the engine's collision step.

**Five readers, one writer, one checker (Fable), each reader a different door to the same question:**
| | reads | gives |
|---|---|---|
| V1 | how the game and the shader patch test a car's box, mesh and tyres against a track each step: the patch's own config files on this machine, the collision library's manual, public sources | the step-by-step mechanism, and the conditions under which a body passes a surface |
| V2 | the record's own cases: every time a car went through a road in the builder's findings and replay reads | each case re-read per step (depth per step against clearance); the scoring set for the model |
| V3 | what a road alone can do against it: thickness, catch layers, triangle size, facing, a physics surface that differs from the drawn one; from physics-engine practice and other fast-vehicle games | measures the builder could apply at export, each with what it costs |
| V4 | loops and corkscrews: how fast the road's facing turns per step at speed, against the builder's roll-rate lines | the geometric quantity that should predict clipping there |
| V5 | online: what is fixed or forced for the driver's own car on a server; then the design of the local-server pair of laps | what could differ, and the experiment that would show it |
| then | the writer states one per-step model and REGISTERS what it predicts for V2's cases before scoring it against them; the checker reopens the citations | |

**When:** nothing has to finish first; it uses no pane and no heavy-run slot beyond light replay reads. Waits on his go.
R1 to R6 above stay held; R5 (how other editors make things even) is being answered by the Sculpt Even plan.

**His word, 05:55:** "what about now?Its like as soon as we have a plan new info pops up lmfa". Read by the librarian as go, and told to him so. Nothing that arrived since the proposal (the Sculpt Even measurement) bears on the vector. One change before the start, for the new-info problem itself: the modeller does NOT see the record's cases (V2); it states the model and its rule from V1, V3, V4 and V5 alone, and a separate scorer then applies the rule to V2's cases. Nine agents: five readers, a modeller, a scorer, a writer, a checker. Started 05:55 as one workflow; output `research/t180_why_a_car_goes_through_a_road_2026-11-27.md`.

**Corrected, 05:58: his 05:55 line was not a go.** His word at 05:58: "lmfao it wasnt lmfao but if it works it works, i was under the impression A pane might have given us new information". The librarian misread a question as an order and started the workflow on it. It stays running by his 05:58 word. Answer to what he asked: pane A's results since the proposal are about the Sculpt Even tool and do not bear on this vector.

## His offer, 06:19, and the librarian’s proposal (06:21): a second run, a model that can be RUN

> "we could do another run of fable researchers again, we have the usage, 9 and a half hours till reset and we still have 24% weekly usage left"

**Why the first model failed, read from its own note:** it was reasoned, not run. It put the whole load on the floor box and used a depth as the point of no return; the record contradicted both (`research/t180_why_a_car_goes_through_a_road_2026-11-27.md`, Answer first 2 to 4). What the record does hold is a separator with no mechanism: the box’s sink rate (`handback/p-d563-wheel-under-O_2026-10-30.md:409-423`).

**The vector proposed:** a tick-by-tick simulation of the soft road contact, written from the open-source collision library’s own code, to see whether "a fast sink breaks, a slow sink holds" comes out of the contact itself, and where the line sits.
- Two builders, each alone, each from the library’s source and the road block the editor exports (`src/export/trackfiles.js:27-36`): one mass, the floor box, the springs and tyres as given, 333 Hz. Neither is shown any recorded outcome.
- **Registered before any run, by the librarian:** the simulation counts as reproducing the record only if, with nothing tuned on the cases, on the softer setting (0.0002) a pass sinking at 0.63 m/s or less holds and one at 1.66 m/s or more goes through, AND on the stiffer setting (0.00005) a pass at 65 g holds. If the two builders disagree with each other, neither is believed.
- If it reproduces: it is then asked what the two untested road settings and the offline-only box extension would do, as predictions for a lap to score.
- If it does not: that is the finding (the game’s own build of the library differs from the public one where it matters), and the next step is data, not more reasoning.
- A scorer, a writer, a checker as before. About seven agents.

**Checked by the librarian before proposing:** his game documents are under `OneDriveDocumentsAssetto Corsa`; the replay folder on L holds 10 files, 48 MB, so a wide re-read of replays is not available on this machine (the 30 October passes were read on D). He has no `cfgextensiongeneral.ini` of his own, so the patch’s defaults apply offline: both offline-only protections are on for him offline [inferred from the absence of an override].

**When:** after pane B’s timing session hands back (it holds both run slots and needs a quiet machine; the first study overlapped its first minutes, posted to the board). **Waits on his go, said as a go.**

**His word, 06:23: "go"**, to the librarian’s "say go and I’ll start it once B is done". The second run is ordered. It starts when pane B’s timing session has handed back and the two pane packets have gone to the chair; if usage runs short before the reset, the researchers are cut before the builds (the librarian’s condition, told to him at 06:21).

**Started 06:53** (workflow wf_7dea3e80): THREE builders, not two (the usage is there, and two of three agreeing reads better than two of two), each blind to outcomes and writing into `research/t180_soft_contact_simulation_2026-11-27_evidence/sim{A,B,C}/`; a scorer who reads the record and the bar above; a writer; a checker who re-runs the code. Six agents. Any run over five seconds goes through heavy-run at below-normal priority. Output `research/t180_soft_contact_simulation_2026-11-27.md`.

**Result, 07:09: the bar was not met.** `research/t180_soft_contact_simulation_2026-11-27.md`: all three simulations fail part (b) (runs sinking at 2.56 to 10.08 m/s hold; the record breaks at 1.66), part (a) is shown by one builder only, part (c) holds but with the box under the road where the record has it clear. All three put the way through at a depth of 0.25 m; the record’s breaks began at 13 to 16 cm (the checker). So the public library’s contact does not carry the separator. No third reasoning run is proposed. Next is data: laps.

---

## A third run, proposed on D at 13:3x (not started; waits on a go said as a go)

**His words, 13:33 (D):** "we have 12% left of our usage that resets in 2 hours, we have enough to do another fable research
party on the right vector".

**The vector: in his own replays on this desktop, what separates a pass where the car goes under the road from one that holds?**
- Why this one: both of last night's runs were reading and simulation, and both failed bars registered first (the blind model
  11 of 26; the simulations break only past 0.25 m). The L handoff's conclusion: "the next step on clipping is laps, not
  reading, and the replays are on D" (`loop/handoff_t180_2026-11-27-L.md`). The one thing that has held is the sink-rate
  separator, and it rests on 5 held passes and 2 broken (`handback/p-d563-wheel-under-O_2026-10-30.md:409-423`).
- What D has, counted at 13:3x with `blackbox/ui/acreplay.js`: 98 replays that parse, 1,294,134 frames; 25 on 12 builder-made
  tracks (576 MB), 8 on the car's own test track, 65 on 17 other tracks. 81 are the Mach 6; none is a Type A.

**Registered before any run:**
- **P1, the sink-rate separator (from H563):** of passes where the car's box reaches 11 cm under the surface, the ones that hold
  cross that depth at 0.63 m/s or slower and the ones that break at 1.66 m/s or faster. *It fails* if more than one new pass in
  five sits on the wrong side, or if most new passes cross between the two figures (then it separates nothing).
- **P2, the roll (new, from `handback/p-d678-even-banked-probe3-A_2026-11-27.md`, inferred there and unmeasured):** breaks are
  commoner where the car is far from the road's roll axis while the road rolls fast (distance x roll acceleration x speed
  squared). *It fails* if breaks are no commoner in the top quarter of that load than in the rest.
- **What "broke" means is fixed from H563's definition before any replay is opened**, and written at the head of the census.
- **The degenerating outcome:** if all the replays hold fewer than about ten broken passes, nothing can be separated, and the
  finding is how rare a break is in his own driving (N in so many km), said plainly.

**The shape (seven agents):** one census builder (the event finder from H563's scripts and the replay parser; builder-made
tracks first, where the surface is known exactly; it reports which replays it could not cover and why); three modellers, each
blind to the others and given only half the passes; one scorer on the half they did not see, with P1 and P2 beside their rules;
a writer; a checker that wrote none of it and re-runs one script. Runs on this machine go through heavy-run, labelled "not a
timing session". Output: `research/t180_what_separates_a_break_2026-11-27.md` with its scripts beside it. Other authors' track
names stay out; replays are read, never copied into the repo.

**What it cannot settle:** the Type A (no replay), and online against offline (every replay here is his own session).

**His words, 13:35 (D):** "could be good, i swear on one of our tracks or a track cant remember, maybe [T1], i recorded
like half of the t-180s in a lap time replay with telemetry already". Not a go.

**Checked at 13:3x (the same parser, every replay on D):** they are here. On the night of 2026-10-30 to 10-31, on one of his
own builder-made tracks and its stiffer-road copy, single-car replays of the Augury, Demo (2), Gigerbon, GRX (3), Hangul and
Krysha (2), plus a GRX and a Mach 6 Active on two test tracks; earlier, 2 Talon and 1 Gladiator replays on other tracks. Nine
T-180 kinds besides the Mach 6, 15 replays. None is the Type A or the Fumee. They are from the night of the H563 study, so
some of its seven passes may be these cars; the census says which.

**So a third registration, P3, the cars:** the per-car study found one collision box, one tyre, one spring and one mass for
all 14 (`research/t180_cars_clipping_potential_2026-11-27.md`). If that is the whole story, then on the same track, at the same
sink speed, no car breaks more often than another. *It fails* if one car breaks at a sink speed where the others hold, on at
least three passes; then something that differs between cars (thrust, wheel placement, the fin) is doing it, and the study
names which differs for that car.

**13:50 (D), his words:** "i got a recording of elysium type a, and even a [T1] type a where it shows a perfect clip on
the corkscrew that sends me to the shadow realm". Not a go.

**Checked at 13:5x (the same parser; names bracketed here):** three new replays, all the Type A.
- On his own builder-made track, the one the other cars drove: 190.6 s, 12,706 frames (sha256 the third listed in the note of
  this time). One reset at t 20.02 s. Which of its drops are breaks needs the road's surface; not read by me.
- On [T1], two saves of one session (25.95 and 25.97 MB): 67.7 s, 4,511 frames. The car goes over the top of the corkscrew
  inverted (its up axis reads -1.00 at t 63.93 s, 56 m above where it entered), comes down the far side, and between t 64.56
  and 64.65 s loses 54 km/h in under 0.09 s (397 to 343 km/h); from t 65.0 it falls at a steady 335 km/h, tumbling, with no
  further change of speed, to the end of the file (158 m of drop). So the last contact is at about t 64.6 s. Where the road is
  at that frame is the census's first job.
- Speeds on the same two tracks, every replay: the Type A's are the Mach 6's (p95 519 km/h on [T1] against the Mach 6's 493 to
  565 over 16 replays; 820 km/h on his own track against 797 to 875). So "the Type A is faster" is not what these show.
  *Caught before it was said:* my first print multiplied the parser's speed, already in km/h, by 3.6.

**So the run now has a Type A break on a fast roll, the case P2 is about, and P3 has its missing car.** The Type A line under
"what it cannot settle" above is struck by this entry; online against offline still stands.


*Corrected 15:1x (D) by the librarian: in his two quoted lines above (13:35 and 13:50) another author's track name is replaced by its stand-in [T1], as in `briefs/t180_unmakeable_shapes.md`; nothing else in his sentences is changed. The two earlier commits of this file (3a9804fb, 2a214f81) carry the name and are not pushed.*
