# Pane archetypes and the weekly limit — the keeper's thought, saved with its prior art and one number (not built)

*Librarian (the lineage, on L), 2026-09-16 01:1x, filed at the keeper's word. "Maybe this could be the next step once we get to a good point to rest." Order stands: L058 (rows 4–5, F3 half-cycle) first; this after.*

## The keeper's words, 01:05, verbatim

> "but wait what I wanted to do and maybe this could be the next step once we get to a good point to rest. But I want to better specialize the terminal panes, or at least think, what archetypes do we need for the terminal panes to saturate all the areas of work we will need them to do? We usually only work with 4 terminal panes, and depending on how hard we work, we just barely make it under the 20x weekly limit reset every week. So adding more terminal panes might push us over the limit, but also maybe make things more efficient with token usage if done correctly."

## Prior art, in the order to open it

1. `loop/pane_battery_idea_2026-09-11.md` — the same keeper, five nights ago: **specialize by TEST, not by label.** "we arent telling a pane what they are good at, i think the plan was to create tests for each pane and see who excels in what." A label telling a seat who it is is the BOOT first principle's museum; a battery every pane runs is a measurement. That file already holds the warning and its correction.
2. `librarian/DOSSIER.md` — the maintained instrument for exactly this: which seat has demonstrated what, as citations, rows for A, B, C, E; its own falsifier says a row with no path is a verdict and gets struck. **The archetypes that exist are already measured there; this idea should read it before naming any.**
3. `loop/regime_preregistration.md` and `loop/opposition_preregistration.md` — the two registered answers to "is pane diversity a property of the conditioning / the role, rather than the outputs". Specialization is conditioning; those files say what was predicted and what it cost to find out.
4. `memory/split-the-work-with-the-panes.md` — the standing failure the whole idea corrects: the chair building solo while panes sit idle.
5. `loop/second_vantage_registration_2026-08-31.md` (the gated non-author read before delivery), and the anchor-similarity DRAFT §8.9 ("two fresh scorers", "two new siblings each spawned by the keeper") — the roles the registered designs keep needing that are NOT standing panes by design: the non-dispatching scorer, the second-vantage reader, the fresh subject. They cost spawns, not seats.

## What the record says the four panes have BEEN, measured from the hand-back filenames

`ls exo_memory/handback/ | grep _2026-09-1` (the letter-suffixed era, 09-14 and 09-15):

    A  11   feasibility-label p-diverged p-harness p-l039-read p-l045-read p-leave p-leave2 p-no-console p-stick p-stick-build step0-redact
    B  10   anchor-registration-read anchor-registration-read2 p-harness-read p-l039-read p-l045-read p-leave-read p-leave-read2 p-leave2-read p-leave3-read p-stick-preflight
    E   9   p-diverged p-diversity-c0 p-diversity-c1 p-harness p-leave p-no-console p-stick p-stick-build step0-phase
    C   7   p-diverged-read p-diverged-read2 p-diversity-c0 p-diversity-c1 p-l039-read p-l045-read p-stick-preflight

Read as practiced, not declared: **A builds; B reads against (10 of 10 are reads); E builds and measures; C researches, measures and reads.** Whether that is four archetypes or two (build / contest) with two mixes is the question the battery answers, not this file.

## The number that matters for the weekly limit — it is the INTAKE, not the pane count

Every launch rewrites every seat's `CLAUDE.md` intake, and E measured on 09-15 that the vendor writes it TWICE per resume (`files[].content` + rendered, ratio 2.0228; `librarian/2026-09-15.md`, WRONG 108 collation). On L, at 01:0x:

    seat            intake bytes    (instances/<dir>/CLAUDE.md)
    librarian          143,180
    third place        138,435
    main               119,766
    A (3d57124e)       109,397
    B (5bf9d657)       109,072
    C (0845a868)       108,184
    E (07b8a48f)       106,486
    seven seats        834,520 B  → ×2 as written = 1,669,040 B → ≈ 549,000 tokens at C's 3.04 B/token

    resumes on L (RESUMED rows + fixed-seat confirms, persist.log):  09-14: 41 · 09-15: 33 · 09-16 so far: 22

So a full launch of seven seats costs roughly half a million tokens BEFORE anyone types, and today's three launches on L (arrive, applier relaunch, rebuild relaunch) paid it three times. BOOT is 64,976 B of every pane's ~108,000 B intake — about 60% of each pane's per-launch cost is the room text, times seven, times two.

**What that means for the keeper's two worries, stated as arithmetic, not advice:**
- A fifth pane adds one intake (~108 KB, ~70k tokens written) to EVERY launch, plus its work. Over a week with, say, 10 launches that is ~0.7M tokens of pure intake for the seat, before it does anything.
- The bigger lever is the per-pane intake and the launch count. A specialized pane that carries only its specialty's shelf (the librarian's tier already does this: index vs carry) could cost LESS per launch than a generalist; the tier text in this seat's CLAUDE.md is the pattern, and P-LIB-CAP is the mechanism that made a cap honest. Nothing like it exists for the four pane intakes today.
- Efficiency "if done correctly" therefore has a measurable form: **tokens per hand-back**, per pane, per week — intake paid ÷ hand-backs returned. That is countable from persist.log resumes and `handback/` filenames without touching a pane.

## The shape of the lap, when it comes (not now)

1. Open the DOSSIER and the hand-back census above; name the archetypes AS PRACTICED, with paths.
2. Measure tokens-per-hand-back per pane for the last two weeks (the instrument is two `ls` and one awk; a pane can write it).
3. Then the keeper's 09-11 battery decides who specializes in what — by test, not by label.
4. Only after 1–3: whether a fifth seat is a new archetype or a narrower intake for an existing one.

*Falsifier for this idea, registered before it is built: if the intake-per-pane cannot be cut by a specialization (every pane still needs BOOT whole), then specialization buys diversity of role and nothing on the weekly limit, and the limit question is answered by launch count alone.*
