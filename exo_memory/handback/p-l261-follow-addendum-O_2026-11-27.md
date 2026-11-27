# L261 track 8, pane O: the follow tool for the shipped builder, an addendum (2026-11-27, 08:4xZ)

**The addendum:** the section "Addendum, 2026-11-27 08:4xZ" at the end of `exo_memory/loop/plan_t180_follow_tool_2026-11-27.md`, its §A1 to §A6.
**The orders:** the chair's of 08:29:21Z, changed by the chair's of 08:29:58Z (delivered 08:33:25Z).
**The packet:** `loop/packet_t180_dev_follow_and_smooth_2026-11-27.md`, its section "Changed 02:31" (room d6f861ab).
**Base:** builder `landing-1126-batch` f3cd425, read only. No builder branch, worktree or commit.
**The registration:** committing the addendum registers §A2's measures and criteria. No smoothing run has been made, and none can be until the tool is built.

**Before the change reached me:**
- my interrupt on his 02:29 word, `handback/p-l261-dev-follow-O_2026-11-27.md` (room f4da4307);
- the librarian answered it in f84d3196.

It stays as the record. Its items 1 and 4 are now the chair's changed order.

## Claims, each with its check

**Facet against bump: what is on disk** (§A2):
- checked: `node --max-old-space-size=8192 o_facets.js <f3cd425 tree> <AC tracks> facets.json`, in the evidence; descriptive, not the registered test.
- **Coverage:** 44 installed layouts with an AI line, 176,176 samples, 0 misses.
- **The mesh creases** along the centre line at the 0.25 m sampling floor on most layouts (the largest per-layout median is 0.75 m). The 90th-percentile spacing is at most 1.75 m on every layout.
- **Each crease turns** a median 0.10° (the 95th percentile is 0.41° on the median layout).
- **That scale holds** a median 0.74 of the height's second-difference energy.
- **So:** facets sit under 2 m, the tool's 8 m pieces follow features over about 16 m, and **2 to 16 m is where it cannot tell or keep.** The addendum says it reports that band as lost, never as smoothed.

**The registration** (§A2):
- "It smooths": the facet energy ratio ≤ 0.10 in height, bank and curvature.
- "It keeps the design": each study's own bars on at least 95% of stations; the design-band height within 0.25 m and bank within 1.5°; lap length within 0.5%; apexes within 5 m; at least 90% of bumps kept.
- "Smoother only by drifting", and "inside and no smoother", are named outright.
- **My prediction:** bumps of 30 m or longer kept 90% or more; 16 to 30 m kept under 70%.
- **Degenerating:** 30 m bumps kept under 90% on any scored track.

**The whole lap** (§A1):
- checked: [T2]'s whole lap was refused at section 20 by `PASS_CLEARANCE`. The read's own geometry passes closer than the builder allows: 16 stations in 6 places with the apron, 8 in 4 without; 0.32 m between surfaces at 2/33 (`handback/p-unmakeable-T2-C_2026-11-26.md`, "The count" and "The unmade classes").
- checked: chained by hand at 5 m, position never past 1.7 m on 7 stretches.
- checked: C1 (the road after a flight starts at its typed cross-section) is in f3cd425 (`git log f3cd425`: 844f485).
- checked: `closeBest`, `jump` and `moveLanding` are existing shell operations (`app/core/coreshell.js:993`, `:724`, `:738`).
- inferred: the time, 3 to 6 minutes for a 20 to 36 km lap, from §3's tail-read estimate.

**What leaves the builder** (§A3):
- checked: `D.serialize` writes `schema`, `generator`, `name`, `closed`, `start`, `nextId`, `spawns`, `pitLane`, `edgeApronM` and `pieces`, and no reference field.
- checked: the export's author is Settings ▸ Author name (`src/export/fromwords.js:187-196`, `src/export/trackfiles.js:119`).
- **So today the builder records nothing about a reference.** "Should an export name the reference's author" is put to him as a call, with three options, undecided.

**Where it meets the Track overlay window** (§A4): one sentence, inferred as design. Follow is the window's one section given the shell.

**Cost** (§A5): about 8 more rows (about 35 in all), tier prove it, no new native command. inferred: a plan of the build.

## Names, and the machine

**Names:**
- checked: `node namecheck.js` (the L259 script) over the addendum's text, this hand-back and the three survey files: 83 terms, 15 hits.
  - All 15 are on seven common words that are also layout or file names somewhere: 1000, 2000, drift (in "drifting" and "drifts"), full, normal, road, track.
- checked: a separate check of his own 14 saved track names over the same 5 files: 0 hits.
- The facet survey prints layouts by number only, and read his AC folder read only.

**Left on the machine:** my scratchpad, no worktree, no build, no process of mine. His T-180 app was not running at the survey (checked: `tasklist`).

**Corrections, mine:**
- My first `cat >>` of the addendum failed on the shell's quoting and wrote nothing (the plan was still 367 lines). It was appended from a file instead.
- This lap's first hand-back path (`p-l261-dev-follow-O_2026-11-27.md`) and plan path (`plan_t180_dev_follow_2026-11-27.md`, never written) are superseded by the chair's change.

## Evidence

`p-l261-follow-addendum-O_2026-11-27_evidence/`, 5 files: `o_facets.js`, `facets.json`, `facets_out.txt`, `heavy_run_status_before_facets.txt`, `namecheck.js`. No pictures.

BASE: C:\Consonance\lighthouse d6f861ab

NEXT: librarian takes the reopened plan and its addendum to him with the follow tool's mock when he next looks; the build is his word after it, and §7 with §A2 is scored by a seat that wrote neither.
