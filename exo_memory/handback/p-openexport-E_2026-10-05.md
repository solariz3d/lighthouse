# p-openexport-E · D243 pre-step + D243a: open-track AC research, and the TEST export of an unfinished track · pane E · 2026-10-05, on D

## The build
**Commit `ff428fa776f5ce4dae8f381f7139f02bf0c164cc`** in the fresh worktree `C:/Users/nname/Desktop/worktrees/e-openexp-wt` (0 links), on t180 main **`8ff414b`**.
- 7 named paths, +146/−19.
- **Not pushed, and AC was not launched.**
- **Landing note:** the installed build is `fa5fd937` (the D237/D237b preview commits sit on top of `8ff414b`), so the chair cherry-picks this onto main.

**What it does:**
- **Its own button,** "Test export (unfinished)…" (`app/index.html`), beside Export and **never the default**. It calls `shell.exportTo(dir, { textures, test: true })`; `coreshell.js` skips the open-loop refusal only when `test` is set, and lays the grid on an open path. `export.js runSegments` passes `test` through.
- **`src/export/fromwords.js` `opts.test`:**
  - the path is built **open** (`closed: !test`), with closure waived;
  - **every red is LISTED, not blocking:** in the result's warnings ("N red finding(s) NOT blocking") and in **`t180b_TEST_UNFINISHED.txt`** in the folder, one line per red. Failed marker checks are listed the same way;
  - the **ui name** is "`<name> (test, unfinished)`" and the **folder** is `t180b_<name>_test`, so it never overwrites a real export's folder;
  - **point-to-point gates** `AC_AB_START_L/R` sit at the start gate (AC_TIME_0) and `AC_AB_FINISH_L/R` sit **150 m before the road's end** (or a quarter of a short road);
  - **the named end block:** a wall `1WALL_T180_END` across the road's last cross-section, 4 m tall along the surface normal, both faces.
- **`src/export/ailine.js` `open`:** an open line. The smoothing doesn't wrap, the last point has no next (length 0, forward kept), and `encodeAiLine` skips the closure check only for `line.open`.
- **A normal export of an open track still refuses, unchanged.** checked: the test below, `NOT_CLOSED`, and nothing written.

**Why a run-off and then a wall, and why open + AB gates.** The research below, measured on the local AC install, read only:
- point-to-point layouts ship **open** `fast_lane.ai` (Kunos' ks_drag included);
- they carry `AC_AB_START/FINISH` gates;
- they run **58–226 m of AI line past the finish gate** (ks_drag about 469 m past its longest layout), with WALL meshes at the end on most;
- one layout ships `end_barriers.kn5`.

## Tests (targeted, as the packet allows; under the lock)
- **New:** `test/export_test_unfinished.test.js`, 6 tests:
  - a normal export of open F7 refuses, with nothing written;
  - the test export writes a folder marked unfinished, in name and folder;
  - **the jump's `gap-in-road` red is listed and does not block;**
  - the AB gates and `1WALL_T180_END` are in the kn5, and the finish is at least 90 m before the end;
  - the open AI line reads back, with its last point's length 0;
  - a line without `open` still refuses `NOT_CLOSED`.
- **Targeted run:** **173 tests, 173 pass, 0 fail.** It covers the new file, ailine, core_cup_fixtures, core_cup_export, export_tube_grid, export_words, markers_export, texture_flow, underskin, app core-shell, export, export-csp, core-textures and core-readout-display.
  - **Fixtures: row 5a "0 of 9 differ" passes.** (`scratchpad/openexp/tests.txt`)
- **Smoke, into a SCRATCH folder only** (`smoke.json`):
  - **F3:** `t180b_f3_test`, 10 files, ui "F3 (test, unfinished)", 4 AB gates, the wall (50 vertices), and an open AI line (71 points, ends 352.3 m apart) that `readAiLine` parses.
  - **`TEST 1 recovered`** (a COPY of the keeper's doc, sha256 `cd97c6ef…`, equal to the original): **exported in 15.2 s** into `t180b_test_1_recovered_test`, with all of the above. **18 reds listed** in the folder's TEST file:
    - 4 downforce-ray-gap;
    - 1 roll-rate;
    - 6 self-intersection;
    - 7 stacked-within-2m.
  - Both normal exports of the open docs refuse.
- **Not run:** mutation harnesses and the full suite (the packet: targeted only, the keeper is waiting); no mutants of my own new code.

**For the librarian's export of TEST 1 recovered:** `scratchpad\openexp\testexport.js` (sha256 `29bb9774…`) does exactly what the button does.
```
node --max-old-space-size=4096 testexport.js C:/Users/nname/Desktop/worktrees/e-openexp-wt "<copy of eq-TEST 1 recovered.t180track>" <AC content\tracks>
```
- Checked into scratch only (`out2/`).
- It writes `t180b_test_1_recovered_test`, and refuses `NOT_OURS` if a folder of that name exists that the builder did not write.
- Or land the commit, rebuild, and use the button.

## The research → `exo_memory/loop/open_track_ac_research_2026-10-05.md` (sha256 `f20afe71…`)
- **The folder:** nothing new is needed to LOAD; `ai/fast_lane.ai` is listed as optional (docs/research/01 §2).
- **fast_lane.ai OPEN:** checked, Kunos' ks_drag and five mod layouts ship open lines. Missing: inferred to load, not measured.
- **Timing:** the AB gates. checked on every point-to-point layout; touristenfahrten uses AB gates with no AC_TIME. inferred: AC_TIME_0 on an open road just never completes a lap.
- **The end:** a run-off and then walls. checked, the table in the doc.
- **Flights in the validator today** (checked: source and probes on `fa5fd937`):
  - **every core flight is RED `gap-in-road`**, because validate exempts only the word `'jump'` and the core writes `'core'` (`src/validate/index.js:280`, `src/core/adapter.js:274`);
  - **no `downforce-ray-gap` at a flight** (0 on F7's mesh);
  - the jump check itself passes;
  - **"no landing" cannot happen,** since a flightPiece always carries its own landing ramp;
  - **`close()` refuses any track with a jump (`NOT_YET`).** So a jump track can only reach AC as a TEST export until D243 fixes the word and close.

## What this does NOT establish
- **That AC loads and drives the folder.** Nothing was launched. Open AI lines, AB gates and the wall are modelled on what ships; ours is untried. The keeper's first load is the check.
- **Whether practice and hotlap start, and whether AB timing runs.** inferred from layouts that carry the same markers.
- **The wall at speed** (a plain wall, not a crash barrier).
- **Machine L.**

## Corrections I made to myself
- **The first AC survey died on `ERR_STRING_TOO_LONG`** (a kn5 too large for a JS string); it now uses a byte scan.
- **My first AI-line reads were void.** The repo's `readAiLine` refuses grid files, and I read the wrong point field; replaced by a header-and-points reader.
- **A heredoc turned `\\r\\n` into real newlines inside `fromwords.js`** (caught by `node --check`) and fixed. That is my standing carry, broken again.
- **My first test summary filter matched nothing** (the colour-coded reporter); re-run with TAP for the counts.
- **I took out references to the room's private notes from the public repo's CHANGELOG and code comments.**

## Evidence (scratchpad `…\scratchpad\openexp\`)

| file | sha256 |
|---|---|
| `survey.js` | `8e6082d0…` |
| `aiends.js` | `f4bc2480…` |
| `ends.js` | `85a784ed…` |
| `flights.js` | `d7af350e…` |
| `flightray.js` | `68c6a884…` |
| `smoke.js` | `5a8160b4…` |
| `testexport.js` | `29bb9774…` |
| `survey.json` | `3acc8dfb…` |
| `aiends.txt` | `6421dd9b…` |
| `ends.json` | `a9e9ff5f…` |
| `flights.json` | `79cc83b7…` |
| `flightray.txt` | `1f07f917…` |
| `smoke.json` | `35b1e0ef…` |
| `tests.txt` | `8448296f…` |

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_jumps_open_export_2026-10-05.md · C:\Users\nname\Desktop\lighthouse\exo_memory\loop\open_track_ac_research_2026-10-05.md · `git -C C:/Users/nname/Desktop/worktrees/e-openexp-wt log --oneline -1`
