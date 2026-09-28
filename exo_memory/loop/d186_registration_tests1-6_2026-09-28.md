# D186 REGISTRATION · TESTS 1 AND 6 of the new core (pane B, 2026-09-28, sealed BEFORE either is run)

**Master:** `exo_memory/loop/spec_t180_equation_core_2026-09-28.md` (fd5b06c), "How we know it works":
- **1** "Round trip: load Serpents' and Thunderhead's equations, export, read back. The same track within 5 m / 5°."
- **6** "Speed: extend and sculpt stay under 50 ms per step on a 40 km track."

**Also from:** C's §7 method proposal (`p-d186-app-C`), and the chair's D186 packet (the line = the mesh centreline, as D184 settled;
state the %, the bank measure, the generator and seed, the statistic, and the machine state). Tests 2–5 are registered in
`d185_registration_2026-09-28.md` and its amendments; they are not touched here.

**Sealed with this file** (`exo_memory/loop/d185/`, sha256 in the hand-back): `gen40.js`, and its output `gen40.json`.

---

## TEST 1 · THE ROUND TRIP (C scores it)
**The two tracks and their reads:** Serpents (`serpents_spiral`) and Thunderhead (`thunderhead_raceway`, layout `normal`), read into
the gitignored `reads/` by the skill's `scripts/read.cjs` (READ_PROFILE=1).
- **Every file the test makes lives in `reads/` or in a temporary folder OUTSIDE the repository.** Nothing it writes may appear in
  `git status`. Checked at the end, and a FAIL if not.

**The pipeline, each stage by the landed or landing code, with no hand edits:**
1. **The D184 position fit:** `tools/piecewise.cjs <track folder> <read> [--layout normal] --write <name>` → `reads/<name>.pieces.json`.
2. **Load:** `src/core/document.js` `fromPositionFit(fit, read)`.
3. **Close:** `src/core/close.js` `close(doc)`, ONE call.
4. **Export:** `src/export/fromwords.js` `exportSegments(...)`, through the app's own route (C's `app/core` export path), into a temp
   folder outside the repo.
5. **Read back:** `tools/read_track.cjs <exported folder> …`, the same reader, with READ_PROFILE=1.

**THE COMPARISON:**
- **The line: the MESH CENTRELINE, as D184 settled.** It is `tools/piecewise.cjs` `meshCentreline` on the ORIGINAL (the AC track
  and its read) and on the EXPORTED folder (its kn5 and the read-back), in WORLD coordinates, with **no alignment of any kind.**
  - `fromwords.js` writes world coordinates and re-origins nothing (`grep` found no translation), so none is needed.
  - If the exporter is found to move the track, that is a FAIL to report, not a thing to align away.
- **Line distance:** for every NON-flagged station of the original's centreline, over the WHOLE lap, the distance to the
  exported centreline taken as a polyline (the nearest point on a segment), in 3-D.
- **Bank:** the reader's per-station bank, the `up` field (degrees; the same field P-LIKE's `plike_stats.js` uses as
  `bank_up_deg`). Each original station is compared with the exported station NEAREST it in position.

**PASS, for EACH of the two tracks, ALL of:**
- **line:** ≥ **95%** of the original's non-flagged stations are within **5 m** of the exported centreline;
- **coverage, the other way:** ≥ **95%** of the exported's non-flagged stations are within **5 m** of the original centreline. So a
  rebuild that drops or adds road cannot pass on half the comparison;
- **bank:** ≥ **95%** of the original's stations have |bank_original − bank_exported| ≤ **5°**;
- **nothing written into the repository** (`git status --porcelain` unchanged apart from untracked `reads/`, which is ignored).

**FAIL:** any of these misses on either track, or ANY stage refuses or errors.
- **A stage that refuses is a FAIL, named, not a skip.** For example, `close` refuses a track with a jump (`NOT_YET`); Thunderhead
  has one (E D184 §4), so this case is foreseeable.
- A track whose reads or folder are absent is **SKIPPED, named.** It is never passed, and both tracks must actually run for test 1 to
  PASS.
- **Report:** the % within 5 m (both directions), p95 and max distance, the % bank within 5°, and the stations flagged by the width
  rule, per track.

## TEST 6 · SPEED (C scores it)
**The track and the steps:** `gen40.js`, **seed 186** (mulberry32) → `gen40.json`.
- **The base:** an OPEN track of **106 pieces, 40,132 m**. Pieces are 150–600 m, drawn exactly as `gen_tracks.js`'s. It is built
  with the core's `extend`, piece by piece.
- **EXTEND:** 55 steps at the open end (the first 5 are warm-up and untimed), each 200 m with the listed targets. They run in
  sequence, so the track grows to ~51 km.
- **SCULPT:** 55 brush strokes (the first 5 warm-up). Each is applied to a fresh reference of the BASE track (the document is
  immutable, so no copy cost is timed):
  - s₀ uniform in 5–95% of the base, r uniform in 20–200 m;
  - the DEFAULT mode (`hill`, with E's widen default), delta ±1–8 m, as listed.
  - If the default hill is refused (no `h` channel in the tree scored), the stroke is scored as a FAIL, not replaced.

**WHAT ONE STEP IS (what the user waits for):** measured with `process.hrtime.bigint()` from the call's start until ALL of these are
done:
- the core operation (`extend` or `brush`, including any widening, refinement or re-close it does);
- the adapter's path (`toPath`, or the incremental path the app uses);
- the preview's track-model update, as the app does it (C's `app/core` shell and the preview's incremental update).

Rendering and water are EXCLUDED (C's proposal). Validation is excluded unless the app runs it synchronously inside the step, in
which case it is included and SAID.

**THE STATISTIC:** for EXTEND and for SCULPT separately, over the 50 timed steps:
- **p95 < 50 ms** (the spec's "under 50 ms per step", with the p95 so that one garbage-collection pause does not decide it); AND
- **max < 150 ms** (no single step may freeze the hand for more than ~3 frames).

The median is reported too.

**MACHINE STATE (part of the test):**
- the bench runs **ALONE**: it holds the heavy-run lock for the WHOLE run (one hold, from before the base is built to after the
  last step), with `--max-old-space-size=4096`;
- no app window and no AC running;
- report the CPU model, core count and free memory at start (`os.cpus()`, `os.freemem()`), and the node version.
- **A run that was not inside ONE lock hold is VOID** (not a FAIL); it is re-run.

**PASS:** p95 < 50 ms AND max < 150 ms, for BOTH extend and sculpt.

**FAIL:** either misses, or any step errors or is refused.
- **Report** median / p95 / max for each, and the slowest step's parameters.
- E measured one sculpt at 40 km at 126 ms (D185, E §4.3), and that is stated here BEFORE the run, so a FAIL is not a surprise.

---
**Sealed by B, before C runs either.** The sha256 and the time are in `exo_memory/handback/p-d186-seal16-B_2026-09-28.md`.
