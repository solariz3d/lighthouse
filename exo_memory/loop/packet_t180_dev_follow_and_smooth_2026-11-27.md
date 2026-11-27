# Packet (on L; roles, the chair picks the panes): a dev-only builder that makes the equation track from a reference, and a test of whether it can smooth a track

**His words,** 2026-11-27 01:28 on L (verbatim, also in `briefs/t180_unmakeable_shapes.md`, the 01:28 line):

> "also, i think it would be cool to have a dev version of the builder, that can make the equation track from the reference it
> would be dope, and to test if it in a way can fix tracks, the original owner would still be the maker, but the builder smooths
> out the geometry in a way it cannot be done by hand, while keeping their design intent"

**How it sits with his 01:11 answers** (same brief): the builder people get keeps the overlay as a guide only ("it must only
act as a guide"; "It would be a way for people to just copy other tracks and i know other wouldnt like it"). This packet is
a **dev version**, not that builder. The librarian's reading, told to him: a build only he runs, never released, never merged
to the builder's `main`. If a seat reads his words otherwise, say so in the hand-back before planning further.

**A plan only. No build.** His word after he has seen the plan.

## Prior art, on disk: do not work it out again

- `loop/plan_t180_follow_tool_2026-11-27.md` (367 lines): the tool itself, planned at f3cd425 and closed by his 01:11 answer
  for the shipped builder. Its §2 (what it reads), §3 (the steering, from the hand-backs), §4 (lengths and refusals), §5 (the
  classes that stay unmakeable), §6 (cost), §7 (the registered prediction P1 to P3 and D1 to D4) and §8 (D's steering
  scripts did not travel) stand as written. This packet asks for what a dev version changes, not for a second plan.
- `loop/catalogue_t180_unmakeable_shapes_2026-11-26.md` with its two amendments: what steering reached on the five studies
  ([T1] 75 of 96, [T2] 61 of 61 section by section and the whole lap refused, [T3] 116 of 119, [T4] 365 of 370, [T5] 21 of 71),
  and the seven classes.
- Checked by the librarian at f3cd425: the builder has **no dev switch today** (`git grep` for a dev flag over `app`, `src`
  and `src-tauri` finds only `main.rs:2`, the console attribute; `Cargo.toml` has no `[features]`).

## Track 8, the plan

1. **What "dev version" is, mechanically.** No switch exists. Weigh at least: a branch that is never merged, built and
   installed beside his app under its own name and data folder; or one build with a switch that the released build cannot
   turn on. Say for each what stops the tool reaching a release by accident, and which row or check holds that. No release
   and no merge to `main` in any option.
2. **The whole track, not a stretch.** The follow-tool plan lays a chosen stretch. He asks for "the equation track from the
   reference". Say what a whole lap needs beyond §3: closing the lap ([T2]'s whole lap was refused in its study; open its
   hand-back for why), the sections no route made, and what the tool reports for them instead of laying a wrong road.
3. **"Fix tracks": what smoother means, as numbers, before any run.** The claim to test is his: the equation road is
   smoother than the original while keeping its design. Name the measures on both roads over the same stations (candidates:
   peak and spread of curvature rate, of roll rate, of pitch rate; steps in width), and the measure of "design intent kept"
   (candidates: the study's own tolerances, position 5 m, direction 3°, bank 5°, width 1 m; lap length; where the apexes sit).
   - **Register before any run:** what result would mean "it smooths and keeps the design", and what would mean it does
     not: smoother only by drifting outside the tolerances, or inside them and no smoother.
   - Say plainly what the tool cannot smooth: the classes that stay unmakeable (2 until the right width lands, 3, 7).
4. **What leaves the dev build.** "the original owner would still be the maker": a road made this way is another author's
   design. Say what the dev build can write (a `.t180track` only, or an export a game can load), and what would carry the
   author's name with it. Whether such a road is ever given to its author or anyone else is his call, not the plan's; list
   it under his calls.
5. **Cost and tier**, as §6 of the follow-tool plan did, for the dev version only.
6. **Names:** [T1] to [T5] labels only; no other author's track name in the repo, the plan or a hand-back.

Hand-back to the librarian by `call_librarian`, claims marked checked or inferred.

## Added 01:31, after his 01:29 words (verbatim in the brief, the 01:29 line)

> "it isnt stealing the track and making it better, its helping it get closer to the point it was always meant to be."

For item 3, from the librarian (a reading, not his order): "what it was always meant to be" is a claim about the author's
intent, so the plan says how the test would tell **roughness the author fought** (mesh facets, a kink at a join between two
modelled stretches, a bank that steps) from **roughness the author chose** (a bump, a crest, a deliberate kink). Smoothing
the second is a change of design, not a repair. Say which measure separates them, or say that none on disk does.

## Corrected 02:16, by his word (verbatim in the brief, the 02:15 line)

> "when i meant smooth it, i meant the geometry itself. not the track and the bumps"

The 01:31 section above put "roughness the author chose" to him as a caution. He never proposed to touch it. Read item 3
as his requirement, not a doubt: **smooth the modelled geometry (facets, steps between modelled stretches); keep the track's
own shape, its bumps and crests included.** The plan still has to say how the tool keeps a bump while removing a facet
(what length scale or measure separates them, and what it does where it cannot tell), because that is what the requirement
asks of the build.
