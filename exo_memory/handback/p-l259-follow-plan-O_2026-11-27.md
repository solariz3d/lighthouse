# L259 track 5, pane O: the plan for a tool that follows the shadow track (2026-11-27, 07:0xZ)

**The plan:** `exo_memory/loop/plan_t180_follow_tool_2026-11-27.md`.
**The mock:** six pictures in `p-l259-follow-plan-O_2026-11-27_evidence/`, `mock_0_window.jpg` to `mock_5_sketch.png`.
**Order:** the chair's of 06:35:27Z.
**Packet:** `loop/packet_t180_class1_next_2026-11-27.md` (room 127cc407), "Track 5". A plan only.

**Base:** builder `landing-1126-batch` f3cd425, read only.
- read with `git show`, and a `git archive` of `src`, `tools` and `app` into my scratchpad;
- no builder worktree, branch or commit. B's `d677-right-width-b` was not touched.

**Verdict: not refused. Build it with the join and the ghost, on his word after the mock.** The plan's §1 weighs it, with the evidence against kept.

## Claims, each with its check

**What it reads: both Line and Road.**
- checked: `node --expose-gc --max-old-space-size=8192 o_follow_survey.js <f3cd425 tree> <AC content/tracks> survey.json`
  → 61 layouts, 46 with an AI line, 44 read; Line alone serves on **6 of 44**.
  - The rule was registered before the run: `registration.md` (sha256 `30bb4769…c3b45c`, 06:45:33Z). `registration.log` holds both files' hashes, and the evidence copies match them.
- **checked: they agree in the middle of the distribution.** The median per-layout side-midpoint is 0.38 m off the mesh centre, and the width 0.60 m off.
- **checked: they part in the tails.** At p95 the medians are 5.53 m and 14.19 m. Layouts failing each bar: centre 38, width 38, bank 5.
- **checked, per side** (`o_follow_survey_sides.js` → `survey_sides.json`, descriptive, not a decision): the mesh runs more than 2 m past the AI side on 5,398 of 28,690 side readings (18.8%), and stops more than 2 m short on 102 (0.4%).
- inferred: those runs past the AI side are pit mouths, run-off and other layouts' roads. Road counts all three as track by design.
- inferred: the design that follows (plan §2): Line for the stations, the way and the corridor; Road, cut at the corridor, for the centre, width, bank, cup and edges.

**Road's cost in the page.**
- checked: `survey.json` `summary.cost`.
  - Ray index: median 137 ms, max 1,149 ms, once per pick.
  - Cross-section: 0.91 ms a station (median; max 2.76).
  - The largest of the 44 has 1,330,225 triangles.
- These are node figures at BelowNormal, while B's whole suite and A's 51 files held both heavy-run slots.

**The time a steered try takes.**
- checked: `o_lay_time_v1.js` → `laytime_out.txt`, 1,000 pieces of our own synthetic shape, 3 tries each:

  | track length | ms a try (median) |
  |---|---|
  | 300 m | 2.5 |
  | 2.1 km | 21.6 |
  | 8.1 km | 107.7 |

  150.4 s in all. Each try builds the whole path again.
- checked: `o_lay_time.js` (fixed, below) → `laytime250_fixed.txt`, 250 pieces: 2.8 → 15.9 ms.
- inferred: reading only the tail holds a try near 3 ms at any length; under 10 s a kilometre. A row of the build checks it (plan §6).

**What is missing** (D's scripts did not travel; plan §8):
- checked: L has no G: drive (`ls /g/` → no such directory).
- checked: at f3cd425 `tools/` holds 4 files, without `read_track.cjs` (`git ls-tree`). It left at 8868531.
- checked: the skill is not on L (no `.claude/` in the builder checkout; a `find` under the user folder found no `fit-pieces.cjs`).
- checked: the evidence copy of `fit-pieces.cjs` (`handback/p-verify-B_2026-10-10_evidence/…/scripts/fit-pieces.cjs`) is a 13-line wrapper that runs `tools/piecewise.cjs`. Its pieces are B-spline curves in space, not builder pieces.

**The cost line** (plan §6):
- checked: 8 of the 36 mutation test files at f3cd425 name `coreshell.js`, and none names `piecewise.cjs` or the reference files (a grep over each file's text).
- checked: `test/piecewise.test.js` holds 17 rows.
- inferred: the file list and the ~27 rows are a plan of the build, not counted from code.

**The registered prediction and its degenerating conditions:** plan §7, written before any build, by this commit.
- P1, reach: at least 95% of each study's made sections.
- P2, count: at most 690, and at most half the steered, on [T3]'s 74.
- P3, time: under 30 s for 1 km.
- D1 to D4, as written there. D2 is the outcome I would most like to be told.

**What the steering does, from the hand-backs:** plan §3 cites each rule's source. inferred as a whole: nothing of it is built or run here.

## The mock

`node o_mock.js <f3cd425 tree> <out>` → `mock_run.json`: 6 pictures, page errors none.
- **The page:** the real page at f3cd425, with a stand-in native side.
- **The shadow is our own shape.** His road is three Extends, read back from the page's own autosave call. Our own corners continue it, made into an AI line by the builder's `encodeAiLine` (1,090 m).
- **The Follow block** is injected into the real reference panel. It wears the panel's classes and the look's tokens, and is marked "mock · not built".
- **The sketch** is drawn from the same two paths.
- **The figures in the mock's words are made up for the picture.** Only the words' shape is the plan's.

**The headless rule** (checked: `mock_run.json`, `machine.json`):
- the shared launcher (`--headless=new`, `--mute-audio`), never focused;
- `document.title` was `zz-headless-test`, set first and kept: read back on the page (`title0`) and on the sketch (`titleSketch`).

**Explorer's tab proxies, before and after:**
- `node consonance/tools/leftovers.js --json` read UNCALIBRATED at all four reads (06:54:51Z and 06:58:24Z around the third render; 06:59:59Z and 07:00:23Z around the fourth): "read 0, and the control made none (0 → 0 → 0)".
- **So 0 seen is not a measured 0.** The tool says why: its control proxy cannot be made on this machine.
- Orphan browsers 0, and long-running processes 0, both times.

**For his eye:**
- `mock_0_window.jpg`: Overhead, his road on the shadow, the shadow going on, Follow ready.
- `mock_2_ghost.jpg`: the ghost, with Lay or Discard.
- `mock_3_marked.jpg`: a class 2 stretch marked inside the ghost.
- `mock_4_stopped.jpg`: a class 3 stop with the core's words.
- `mock_5_sketch.png`: what the preview would draw.

## Corrections, mine

- **The lay-time probe's end read used the wrong field.** `buildPath` returns `{ samples }`, so the read got nothing.
  - The path was still built whole on every try, so the 1,000-piece times stand as the build's.
  - Fixed and re-run at 250 pieces: 2.8 → 15.9 ms against 2.5 → 21.6 ms, under the same kind of load.
  - Both scripts are in the evidence: `o_lay_time_v1.js` as run, `o_lay_time.js` fixed.
- **The side survey first paired the mesh's left edge with the line's left side.** `crossSection`'s side(+1) walks along cross(f, n), the line's right. Fixed before it ran. The registered survey does not use the sides, so it was not affected.
- **The mock took four runs.**
  1. Failed on the same samples field.
  2. Drew the shadow 12 m wide against his road's 31 m, and the sketch's text was invisible.
  3. Framed only his first 300 m.
  4. Kept: zoomed out, and captured as JPEG (1.1 MB of evidence in all, 0.9 MB of it the five page pictures).

## Names, and the machine

**Names** (checked: `node namecheck_l259.js <evidence> <plan>`, then the same over this hand-back and my map line):
- 83 terms against 16 files: 35 hits. Against the hand-back and the map line: 8 hits.
- All 43 are on six common words that are also a layout or file name somewhere: road, track, normal, full, 1000, 2000.
- The six pictures were not read by the check. Five are of the page with our own shape; one is the sketch of it.
- No other author's track was read for the mock.
- The survey read his AC folder read only, and wrote nothing there. Its output names layouts by number only.

**Left on the machine:**
- my scratchpad (the f3cd425 archive, the scripts, the outputs);
- no worktree, no build dir;
- no process of mine running. checked: no `t180l259o-*` profile in `%TEMP%`; `leftovers.js` processes 0 and orphans 0.
- His T-180 app was not running (checked: `tasklist`, before the survey). Nothing was built.

## Evidence

`p-l259-follow-plan-O_2026-11-27_evidence/` (1.1 MB, 22 files):
- **The registration:** `registration.md`, `registration.log`.
- **The survey:** `o_follow_survey.js` → `survey.json`, `survey_out.txt`; `o_follow_survey_sides.js` → `survey_sides.json`.
- **The lay time:** `o_lay_time_v1.js` → `laytime_out.txt`; `o_lay_time.js` → `laytime250_fixed.txt`.
- **The mock:** `o_mock.js` → `mock_run.json` and the six pictures.
- **The machine:** `machine.json` (the four tab-proxy reads, and heavy-run's status before each run).
- **The name check:** `namecheck_l259.js`.

BASE: C:\Consonance\lighthouse 127cc407

NEXT: librarian takes the plan and the mock to him; the build is his word after the mock, and §7's prediction is for a seat that wrote neither the plan nor the build.
