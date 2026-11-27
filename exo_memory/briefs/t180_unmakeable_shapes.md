# Brief: T-180, the shapes the builder cannot make yet, read from five reference tracks

Written 2026-11-26 (D) by the librarian, at his word. Nothing is built yet.

Five track names in his sentence are other authors' tracks. Their names stay out of this public repo, so each is
replaced by a stand-in, [T1] to [T5], and nothing else in the sentence is changed. The key is local only, in the
builder checkout's gitignored `reads/` (`reference_key_2026-11-26.local.md`). He knows which they are.

## His words (verbatim, 2026-11-26 12:48, on D, to the librarian)

"yes install, leave turbo off here for now. 3. yes do the fix, after that, I want you to do a comprehensive study of the
tracks, [T1], [T2], [T3], [T4], and [T5], for the purpose of finding sections of the tracks that the track builder cannot
currently make, and find a way to allow for it. We arent stealing any of the work or assets of the track maker, we are
simply using it as reference to understand how to let our system create the shapes in our own way. There are points in
each track that our system cannot currently make, that is what we must focus on, then, once research and planning and
been completed, we begin to incorporate our findings into the track builder system to support the shapes that we
currently cannot make, sound good? I am getting a full 8 hours sleep so feel free to go in, we have 50%  usage left for
the week and it expires tomorrow, so maybe we could do turbo mode"

## What it means, and what it does not

- **The target is the gaps.** Each track has sections the builder cannot lay today. Find them, name the shape class,
  then plan and build support for the classes, in the builder's own way.
- **Reference only.** No mesh, texture, layout data or equation of another author's track enters the builder repo or
  this repo. The reads stay local (`reads/` is gitignored). What enters the code is a general shape capability and our
  own test shapes that exercise it.
- **Order:** research, then plan, then build (his "once research and planning and been completed, we begin").

## Prior art on disk (open before re-deriving)

- The reads and fitted equations for all five already exist locally (key file above); four have `.equation.json`, [T5]
  has a read only.
- The track-equations skill (builder repo `.claude/skills/track-equations/`), plan `loop/plan_t180_equation_skill_2026-09-28.md`:
  read, fit, rebuild through the builder's core, compare.
- Gaps already found and worked: abrupt 90° turns (`loop/plan_t180_sharp_turns_2026-10-09.md`, [T1]'s post-jump turns);
  the banked S and the wall hairpin (`briefs/t180_banked_s_and_wall_hairpin.md`); the flowing bank
  (`loop/plan_t180_smooth_banked_turns_2026-11-24.md`, branch o-smooth-bank / p-flow-ai, not yet in main).
- The rule from this seat's 11-24 miss (`librarian/2026-11-24.md` 15:07): a "cannot" about the builder is written after
  the routes around it were tried; before that it is "this form did not".

## State

- 12:5x: research lap written (`loop/packet_t180_unmakeable_shapes_2026-11-26.md`), rung to the chair.

## His answers to the morning page (2026-11-26 23:00, on D, verbatim)

"1. yes. 2. Yes old tracks stay the same, it allows for new tracks to have the individual sides of width. 3. Well our track has
the underside thickness and side aprons, so it has to be different in that way than the study tracks, it cant get as close as
some of them, you know? 4. I guess when it goes all the around, it resets back to 0 but can still start to carry the extra
degrees into the new 360 you know? 5. Not sure, what is smoothness limit?"

- 1: install landing-1126-batch f3cd425.
- 2: build the stored right-side width (plan (b)); old tracks unchanged.
- 3: the overpass gap stays; our road has an underside and aprons, so it cannot pass as close as the study tracks.
- 4: the shown bank resets past a full turn, but the road keeps rolling into the next turn instead of unwinding (my reading,
  said back to him).
- 5: explained to him; no lap yet.

## 2026-11-27, on L

- 00:23 (L), his words: "back, there should be the relevant handoffs and points to start the work back up from where desktop left off", then "for track builder too". Read as: pick up both stopped builds on L. Packet `loop/packet_t180_resume_on_L_2026-11-27.md`. Checked on L after a fetch: `l-bankcarry-a` 2067c88, `d677-right-width-b` e41acb1, base `landing-1126-batch` f3cd425. Not on L: every scratch script under D's `G:\consonance-scratch\`, the [T5] read (so falsifier (b) stays owed to D), and the f3cd425 build (L still runs 0ab6cc8).
- Asked of him at 00:2x, unanswered: (a) typing on a head past a turn, the whole number or nearest-forward; (b) do Sculpt drags carry past a turn; (c) build and install f3cd425 on L.
- 00:27 (L), his words: "but i am confused, so you dont need the tracks right, because all of it has already been tested?" Answered: his saved tracks' open-and-save check is done (D: 27 of 27 and 406 of 406 on the right width; 26 of 26 on the bank), so D's copies are not needed for it. Not yet run anywhere: the old tracks' EXPORT comparison (L's own saved tracks serve) and falsifier (b), which needs the [T5] study data on D.
- 00:27 (L), his words, names bracketed by rule: "im talking about the ones of the study, they were [four reference track names]". Answered: the study is finished and its catalogue is on record, so tonight's two builds do not read the reference tracks. One check still wants one of them: falsifier (b) of the cross-section plan, on [T5], whose read and name key are on D. The reader itself is in the builder (tools/piecewise.cjs, in f3cd425), so the read could be made again on L if he wants it there.
- 00:31 (L), his words: "can you give me a comprehensive breakdown of the pieces that could not be made, and what our plan is moving forward to let the track builder system create it with the equations". Answered from `loop/catalogue_t180_unmakeable_shapes_2026-11-26.md` and its two amendments, with the state of each class as of D's handoff. Said as the librarian's lean, in no plan on disk: for class 1, put the study's steering into the app as a tool that follows the shadow track (figures behind it: steering reached 116 of 119 on [T3], 365 of 370 on [T4], 75 of 96 on [T1]); and first measure him aiming by eye against the overlay, which was never measured.
- 00:33 (L), his words: "okay lets do it". Read as yes to the plan forward as put to him: the install of f3cd425 on L, his by-eye measurement on class 1, and a plan (no build) for a tool that follows the shadow track. Packet `loop/packet_t180_class1_next_2026-11-27.md`. Still unanswered: (a) typed bank past a turn; (b) Sculpt drags past a turn.
- 01:06 (L), his words: "wait so gimme the questions in plain words". Seven put to him plainly, each with the librarian's lean marked as a lean: build the follow tool; is following a reference that closely still "reference"; how closely it follows; where its button sits; typed bank past a full turn; Sculpt drags past a full turn; mock pictures in the room repo.
- 01:11 (L), his words, whole: "1. We do not build it, merely generate the geometry of the track itself within the previewer. Any track in assetto corsa folder remember? It would be a way for people to just copy other tracks and i know other wouldnt like it, but you should be able to use it as reference or even to trace the real track the equation builds. 2. this is what I mean, it would be too op for the equations or function whatever to map their geometry perfectly, it must only act as a guide. 3. tight i guess. 4. Maybe it has its own window on the top that says track overlay, and you can choose from tracks you have already made and ones from the assetto corsa folder too. 5 literal. 6. keep rolling. we might have to do a refactor on the sculpting feature"
  - 1 and 2: the follow tool is NOT built (`loop/plan_t180_follow_tool_2026-11-27.md` stays on record, unbuilt). The shadow is a guide he traces by hand; nothing maps a reference into pieces. 3 is moot with it.
  - 4: a plan and a mock first for a "Track overlay" window at the top, listing his own made tracks and the Assetto Corsa folder's.
  - 5: typing stays literal, as built at l-bankcarry-a 2067c88. 6: Sculpt's bank drag carries past a turn (reverses his 10-06 rule for those drags). His remark on a Sculpt refactor is recorded, not ordered.
  - 7 (mock pictures in the room repo): unanswered; they stay out. Packet `loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md`.
- 01:28 (L), his words: "also, i think it would be cool to have a dev version of the builder, that can make the equation track from the reference it would be dope, and to test if it in a way can fix tracks, the original owner would still be the maker, but the builder smooths out the geometry in a way it cannot be done by hand, while keeping their design intent"
  - Read as (the librarian's reading, told to him): a dev build only he runs, never released; the shipped builder keeps the overlay as a guide only, as he answered at 01:11. An idea ("it would be cool"), so a plan first, no build. Prior art: `loop/plan_t180_follow_tool_2026-11-27.md` (closed for the shipped builder, reusable here). Checked: the builder has no dev switch at f3cd425. Packet `loop/packet_t180_dev_follow_and_smooth_2026-11-27.md`.
- 01:29 (L), his words: "once people learn to embrace AI more and the new concept of what ownership is involving into, it isnt stealing the track and making it better, its helping it get closer to the point it was always meant to be."
  - Beside his 01:11 "i know other wouldnt like it" and his 01:28 "the original owner would still be the maker". The librarian's answer to him, not his words: "meant to be" has one reader who can check it, the track's author shown both roads; and some roughness is design, so the measure has to tell a fought mesh from a chosen bump.
- 02:15 (L), his words: "when i meant smooth it, i meant the geometry itself. not the track and the bumps"
  - His correction of the librarian's 01:33 answer, which cautioned him against smoothing out bumps he had never proposed to touch. Requirement, as he states it: the dev tool smooths the modelled geometry (the mesh's facets and steps); the track's own shape, its bumps included, is kept.
- 02:20 (L), his words: "sounds good", to the reading at 02:16 (same track, bumps kept; the modelled geometry smoothed; a dev version only he runs; a plan first).
