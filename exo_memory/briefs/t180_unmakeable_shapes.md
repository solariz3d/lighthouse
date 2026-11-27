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
- 02:29 (L), his words: "make it just the regular version, i just realized it should be for everyone, its no different than putting someone elses work in blender to see how they did it, its not like someone will take tracks, just learn how to make them from the references"
  - Reverses his 01:11 answers 1 and 2 for the tool that lays pieces from a reference: it goes in the regular builder. No dev version. `loop/plan_t180_follow_tool_2026-11-27.md` is reopened; packet `loop/packet_t180_dev_follow_and_smooth_2026-11-27.md`, the 02:31 section.
- 02:40 (L), his words: "builder is closed btw". 02:43: "wait so time to test". 02:45: "yes", to the librarian's "Installing replaces your app, so it needs your word. If you say yes now, I'll order the build and install as soon as both are read, and tell you when it's on the laptop."
  - His word for ONE test install on L of `l-bankcarry-a` and `d677-right-width-b` together, once both are read. Not a release, not a merge to `main`. Packet `loop/packet_t180_test_install_on_L_2026-11-27.md`.
- 02:52 (L), his word: "go", in answer to the librarian's "Still owed before I give the go: pane A's 720° fix and pane E's read of it, and pane B's hand-back on the right-side width and a read of that."
  - Read as, and told to him: install now what is ready; the reads follow. Packet `loop/packet_t180_test_install_on_L_2026-11-27.md`, the section "Changed 02:55".
- 04:04 (L), his words: "lemme know when it is ready for me to test"
  - Read as, and told to him: yes to a second test install on L (the ±720 fix, the SPLIT_HEAD words, the way back on a non-round width) once the last read is in; tell him when it is on the laptop. Packet `loop/packet_t180_test_install_2_on_L_2026-11-27.md`.
- 04:19 (L), his words: "what is the width brush taper"; 04:21: "1 i think right?"
  - In answer to the librarian's two options (1: Extend holds the width as the tooltip promises; 2: the narrowing carries on and the tooltip is reworded). Read as option 1, for the width. "Taper" was the librarian's word, explained to him. Packet `loop/packet_t180_extend_holds_width_after_brush_2026-11-27.md`. Asked of him, open: the same for the bank after a bank brush.
- 04:29 (L), his words: "what should i test first in a list"; 04:31: "i am re exporting [one of his own tracks] rn to drive in game" (the track's name is bracketed here, as names are in this repo; the rest is verbatim)
  - State: the second test build (landing-1127-l263 c522ea6) is installed; he is driving an export from it. The quiet-machine timing lap waits until he is out of the game.
- 04:46 (L), his words: "wtf my assetto crashed before i could save the lap replay, but it drove the same"
  - State: the export from the second test build drove the same as before (his word). The crash is traced in `loop/stall_trace_game_crash_low_commit_2026-11-27.md`; not the track, by the game's log.
- 04:49 (L), his words: "the same bug sometimes rarely happens on my desktop too with more ram 64gb, so idk if its that, ever since i started to race t-180s on assetto it has always been a rare transient problem with the replays, could be big to some how patch for the community but good luck finding that"
  - State: the librarian's memory cause is refuted (trace file, its CORRECTION section). The fault is in Custom Shaders Patch 0.2.11 at the replay switch. Not builder work; a census of D's crash reports is the next step if he wants it.
- 04:51 (L), his words: "i have a feeling all of csp is a shitshow of human slop lmfao but it works"
- 04:54 (L), his words: "do you think there could be a fix we make for it? Its like for the version we use, or rather, the version the newest t-180s work on, soon there will be an update to t-180s from the creator, but we will deal with that when the time comes"
  - State: answered as a lean (trace file, "His question"); the census of D's crash reports goes into the L to D handoff. Not builder work, no lap ordered.
- 04:56 (L), his words: "its okay forget it for now" (the replay crash; nothing owed, the census does not go to D)

## His words, 2026-11-27 05:41 and 05:42 (L): online physics

- 05:39: "you would be wrong for the type a, it clips the worst from people have said."
- 05:41: "also one problem i havent even mentioned that is a mountain potentially, for some reason, the physics in online server is different than offline, and clipping can be worse on loops and corkscrews. We have no data to go off of for that though"
- 05:42: "But with how good the tracks are in offline, it is more than safe to assume it will still be better than handmade tracks in online servers"

**State, 05:42 (the librarian's, checked unless marked):**
- The record holds nothing on it: no brief, research note or T-180 hand-back names online play (grep of `briefs`, `research`, `loop/*t180*`, `handback`). The builder at c522ea6 has no word of it in `src`, `app`, `docs` or the README. Every limit in `src/validate/limits.js` was measured offline.
- The car's source has no online switch: no script line at the tag or the head tests for an online session. [inferred] So a difference online comes from the game, the shader patch or the server, not from the car's script choosing to act differently.
- One lead, not a finding: the installed shader patch's own defaults (`assettocorsa\extension\config\general.ini:100`) say of its raycasting engine option "Intel Embree is in experimental stage currently and not available online", and another physics option (`:175`) "Affects offline races only. For online races option can be enabled by a server configuration." So some physics options are settable offline and fixed or off online. Which he runs offline was not read (he has no `cfg\extension\general.ini` of his own at the path tried).
- Two outside searches (generic terms) found release notes saying finished physics experiments cannot be turned off online, and nothing on loops or corkscrews.
- **How data could be made, not ordered:** the game ships its own server program; one car, one track, driven offline and then on a server on his own machine, two replays, read with the builder's replay tools section by section.
- Not started. His 05:42 word parks it.

## His words, 2026-11-27 05:43 (L): why it hits these cars, and the next update

> "the reason it affects t-180s is because they move so fast compared to average speed the engine was made to sustain. Its like a time thing, car moves too fast for the game to keep up, so ohyeah said that next update, cars will be slower and smaller sscaling, which means the tracks will be bigger and as well need a rescaling to give the same proportions we are used to"

**State, 05:43 (the librarian's, checked unless marked):**
- **His "time thing", as figures.** The car's script runs "every physics tick (333 Hz)" (`Source/base/data/script.lua:183`). Distance per tick: 0.08 m at 100 km/h, 0.50 m at 600, **0.81 m at 970** (the builder's top speed, `limits.js` `vmaxKmh`). The floor box is 0.5 m tall and the downforce ray 1.0 m long at the tag. [inferred] At top speed the car moves further in one tick than its box is tall.
- **The smaller, slower cars are not in the public repository yet.** At its only branch (`main`, 4262dedf, 2026-11-26) the wheelbase 3.43, track 1.8, tyre radius 0.395, box 2.0 x 0.5 x 3.0 and mass 850 are the tag's, and the Mach 6's thrust multiplier is 3.15 against the tag's 1.5. No commit subject in the last 60 names a scale. So what he was told is ahead of what is published.
- **The builder has no rescale** (grep of `src`, `app`, README at c522ea6 for a scale tool: 0 hits). Every `MACH6` limit in `src/validate/limits.js` is in metres, km/h or g for today's car.
- [inferred] If lengths and speeds both scale by k, the load on a curve (speed squared over radius) scales by k too, so a rescaled track with a proportionally slower car asks less of the car.
- Not ordered. His 04:54 word on the update stands: "we will deal with that when the time comes".
- 2026-11-27 05:44 (L), to "the smaller, slower cars are not in the public repository yet": "yes bc the update itsnt out yet"
