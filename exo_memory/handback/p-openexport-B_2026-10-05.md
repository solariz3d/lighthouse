# D243a: non-author look at E's ff428fa, "Test export (unfinished)" (pane B)

**Packet:** the chair's D243a (items 1–4), EXPORT tier for `src/export/fromwords.js`.
**Tree:** a fresh worktree `C:\Users\nname\Desktop\worktrees\b-openexp-wt` at `ff428fa` (0 links), read only. Nothing committed, nothing pushed, AC not launched.
- Every run was under the heavy-run lock, one job at a time, `--test-concurrency=1`, with the serial shim on the mutant runs.
- Scripts and outputs are in my scratchpad `openexp/`: `rcheck.js`, `oprobe.js`, `emut.js`, `wallpos.js`, `run.out`, `out/oprobe.json`.

## Verdict: GREEN, land ff428fa, with two follow-ups for E (neither blocks the keeper exporting TEST 1 recovered)

1. **The Test button on a CLOSED track puts a wall across the lap at its seam** (§2). It's harmless (its own `_test` folder) but surprising.
2. **The button's path has no test above fromwords** (§5): mutants S1 and X1 survive.

**A merge warning for the chair's plan** ("land D239, then D242, then D243a"): D239 moves the open-loop refusal into `coreshell.buildExport` (`fb44284`). E's bypass edits the old line in `exportTo`, so it will **not** carry over automatically. After D239, `buildExport` must take `opts.test` and lay the grid open, or the Test button will refuse every open track with "the loop is not closed".

## 1. A normal export of an open track still refuses; the test path is reachable only by the button

- **checked (`oprobe.js`, the real core shell plus the real exporter, writing into scratch only):** a normal `exportTo` of the open TEST 1 copy gives "the loop is not closed: close it first (one click), then export", with 0 writes.
- **checked (grep over `app/`):** `test: true` is set in exactly ONE place, `app/index.html:218` (the "Test export (unfinished)…" button's handler).
  - Export (`index.html:208`) and Install (`:316`) pass `{ textures }` only.
  - `coreshell.js:199` bypasses the refusal only when `opts.test`.
  - `export.js:100` defaults `test = false` and forwards it only when true.
  - `fromwords.js` takes `o.test === true` strictly.
- **checked (mutants):** E1 (test mode as the default) is caught by "a NORMAL export of an open track still refuses". S2 (the shell letting a normal open export through) is caught by core-shell's D234 / export tests.

## 2. Test mode waives closure, and the reds become warnings; the name says so

- **checked:** in test mode, every validation red is listed instead of refusing:
  - in the message: "TEST EXPORT (unfinished): 18 red finding(s) NOT blocking, listed in t180b_TEST_UNFINISHED.txt";
  - and in that file: a header plus one line per red, with s ranges.
- The ui name is **"TEST 1 recovered (test, unfinished)"**. The folder is `t180b_test_1_recovered_test`, so it never overwrites a real export.
- **It waives more than closure, by design:** failed marker checks (`placeAll` and `checkMarkers`) are also listed instead of refusing. This is in E's code (`fromwords.js` `if (!test) throw … testReds.push(\`markers: …\`)`) and is consistent with "reds become warnings". Noting it because the packet said closure only.
- **Finding 1, the CLOSED-track case (owner E): reachable, measured.** Nothing stops the Test button on a closed loop, and `fromwords` builds the path OPEN whenever `test` is set. Meanwhile `coreshell.startLayout` lays the grid on the closed path (`open: !!opts.test && !doc().closed`). On the CLOSED TEST 1 copy (`test1.t180track`, sha256 `9e6f7be8…`):
  - it exports (37 reds listed);
  - the end wall's centre is at **(0, 2.6, −0.2), the lap's seam (s = 0)**: 999.3 m from AC_TIME_0_L, 989.2 m from the grid's AC_START_0, and 148.4 m past AC_AB_FINISH_L (`wallpos.js`);
  - so a car leaving the grid drives nearly the whole lap and meets a wall where the loop joins.
  - Fix, either way: refuse the Test button on a closed track ("this track is closed: use Export"), or build closed with no wall and no AB gates.

## 3. The end block, and E's research claims: checked or inferred?

- **The end block, checked on the open TEST 1:** `1WALL_T180_END` has 50 vertices, its centre is **148.4 m past AC_AB_FINISH_L**, which matches TEST_RUNOFF_M 150 along the road, and 1,125.3 m from the start gate. The AB start sits on AC_TIME_0 (same position).
- **E's checked claims, re-measured by me** (`rcheck.js`, a byte read of the AC install, nothing written):
  - Kunos' `ks_drag` drag1000 and drag200 `fast_lane.ai` are **OPEN**: 1,539 points, last point **2,468.8 m** from the first. E: 2,468.8 m. ✓
  - The Nordschleife control is closed: 1.5 m. E: 1.5 m. ✓
  - `pk_hakone_touge_pub` `pits_uphill.kn5` / `pits_downhill.kn5` carry AC_AB_START/FINISH_L/R plus AC_TIME_0_L. ✓
  - `ks_drag.kn5` carries only AC_START_0 and AC_HOTLAP_START_0, with no AB and no TIME. ✓ (E's "the exception").
  - Not re-measured: E's run-off and wall table.
- **E's inferred claims are labelled inferred in E's research doc, correctly:**
  - that AC loads and drives an open folder;
  - that practice and hotlap start, and AB timing runs, with our markers;
  - that a missing `fast_lane.ai` would load;
  - the wall at speed.
  - **None was tried; AC was not launched.** The keeper's first load is the check.

## 4. A test export of a COPY of `eq-TEST 1 recovered.t180track` into SCRATCH works, and lists the rolled-section overlaps

- **The copy:** sha256 `cd97c6efed45c8586f28652b…`, equal to the keeper's file and to E's. 46 pieces, open.
- **Through the core shell's `exportTo(dir, { test: true })`**, which is exactly what the button calls: written in 17.3 s, 8 files, `messageKind: ok`.
- **18 reds listed:** 4 downforce-ray-gap, 1 roll-rate, 6 self-intersection, 7 stacked. The same count as E's.
- **The rolled turn** (E's diagnosis: p17–p21, s ≈ 5,820–6,614, landing on its own coils and on p3) **is listed:**
  - self-intersection: 5,948–5,950, 6,018–6,050, 6,476–6,484, 6,608–6,612;
  - stacked: 5,930–5,984, 6,018–6,052, 6,462–6,554, 6,606–6,614;
  - ray: 5,950–5,952, 6,482–6,490;
  - and its partner on p3: stacked 1,406–1,476.
- The red lines are the validator's ids with sources (D242's plain-word grouping is not on this tree).

## 5. Tests and mutants

**Targeted: 12 files, 134 of 134 top-level tests pass** (`run.out`):
- E's `export_test_unfinished` 6;
- `ailine` 18;
- **`core_cup_fixtures` 8, including row 5a "0 of 9 differ"**;
- `core_cup_export` 11, `export_words` 20, `markers_export` 4, `export_tube_grid` 7, `underskin` 8, `texture_flow` 7;
- app `core-shell` 26, `export` 18, `export-csp` 1.

**Mutants of E's lines (`emut.js`, mine, against E's test file plus core-shell): control clean, 16 of 16 applied, 12 caught.**
- **Caught:** E1–E11 (test mode as the default; reds blocking; no TEST file; ui name; folder; finish at the end; no wall; no AB gates; AI line closed; encode never refusing; the open line's last point keeping a length), and S2.
- **Survived:**
  - **S1** (the shell refuses the test export of an open loop) and **X1** (`export.js` drops `test`): **no test exercises the button's path above fromwords** (owner E). If either broke, the Test button would refuse silently and nothing would go red. A core-shell test of `exportTo(dir, { test: true })` on an open lap would catch both.
  - **E12** (the open line's smoothing wraps round its ends): only speeds within the smoothing window at each end are affected. Minor gap.
  - **E13** (the normal export's `checkMarkers` never blocking): **pre-existing.** The throw it removes predates ff428fa. No test exercises a failing marker check.

**Existing harnesses touching fromwords:**
- `test/core_cup_mutation.test.js`: 51/51.
- `app/test/core-mutation.test.js` control plus P1–P3 (P1 anchors `fromwords.js`): 4/4.

## What this does NOT establish
- AC loading or driving the folder (E's inferred claims above).
- The real window: the button was driven through the core shell headless, not clicked.
- The full suite (not run, per the packet's tier).

## Corrections to myself
- My first `oprobe.js` stub wrote `files` as a map, but it is `[{ path, bytes }]`. The probe died (`ERR_INVALID_ARG_TYPE`); fixed and re-run under the lock.
- My first wall reader read `positions`, but readKn5's field is `pos`.
- My guessed `pk_hakone` AI path was wrong (missing), so I can't confirm or refute E's 226 m figure.
