# D175, packet C: hardening for speed and stability

Pane C, 2026-09-27. Repo `C:\Users\nname\Desktop\t180-track-builder`, uncommitted.

**Files** (all new except where marked; `checked: sha256sum … | cut -c1-16,65-`):

| file | sha256 (first 16) |
|---|---|
| scripts/bench.js | b8d4cb9a229774a9 |
| scripts/soak.js | 1346735886cdeab8 |
| test/perf.test.js | 73071ed752be31e9 |
| test/perf_soak.test.js | f2415f2259e52c46 |
| app/test/mutation.test.js (mine: + P1–P3; runs the two perf files; ignores a todo's failure) | 4a5c13d39c03db30 |
| test/geom_mutation.test.js (mine: the same parser fix; children at concurrency 4) | e71ebd48035109fd |
| test/texmaker_mutation.test.js (mine: the same parser fix) | 406aee918f03de97 |

- **No change to `src/geom`, `src/texmaker`, `app/preview` or `app/camera` was needed:** the soak found nothing in them (§4).
- **Not edited:** A's and E's files. Their findings are routed with reproducers (§5).
- **Seen in passing:** an untracked `src/geom/pitlane.js`, not mine; presumably A's D174 pit lane.

## 1 · A Rainbow-scale track, measured (`node --expose-gc scripts/bench.js --km 40 --seed 17`)

**"Fast enough", written in the bench's header BEFORE measuring.** ARCHITECTURE states no latency figure: §1.5 says users hate "slow updates", and §9 gives only the IPC cost, about 200 ms for 10 MB. So these budgets are mine, **INFERRED**:
- a DRAG STEP ≤ 50 ms (20 Hz under the hand);
- PLACING a word ≤ 100 ms;
- a FULL REVALIDATE ≤ 1 s;
- MEMORY ≤ 1 GB for the UI process.

**The edit path timed** is the app's own, headless: A's shell (`resolveFrom`), then my preview track model, then E's validation controller.

**The track** (seed 17): 124 words, **40.26 km**, 574 cells, 1,456,734 vertices, built in 56.9 s through `shell.place`.

**Two runs** (23:27–23:31Z and 23:50–23:53Z); medians of 7, in ms. Run 2 shown, run 1 in brackets:

| measure | total | C's preview | E's validation | budget | ok? |
|---|---|---|---|---|---|
| place one word at the head | 1,000 [894] | 14.7 [13.3] | 988 [876] | 100 | **no** |
| drag step, near the head (w122 tight) | 1,325 [1,138] | 85 [62] | 1,234 [1,055] | 50 | **no** |
| drag step, mid-track, a straight (w63) | 3,640 [3,412] | 140 [118] | 3,499 [3,280] | 50 | **no** |
| drag step, mid-track, a curved word (w64 turn) | 3,713 | 204 | 3,487 | 50 | **no** |
| full revalidate (export setting flipped) | 5,902 [6,146] | — | 5,902 | 1,000 | **no** |
| memory | RSS 1,502 [1,379] MB; heap 171; array buffers 60 | the meshes ≈ 60 MB | — | 1,024 | **no (RSS)** |

**What the numbers say:**
1. **Revalidation is 90–99% of every edit** (E's `app/validate-ui/panel.js` over `src/validate`). A place at the head still costs about 0.9–1 s: the "append" revalidation is not bounded by the new word's length. Routed to E (§5).
2. **My preview is inside budget for placing (15 ms), not for a drag step (85–204 ms).** Profiled on a 20 km copy:
   - **The path regrow downstream** (`rebuildPathFrom`) costs about 110 ms per 10 km. It is linear in what follows the edit.
   - **A curved edit on a pitched stretch** banks every later piece by a hair: measured Δbank 8.72e-6 rad after a 0.5 m length change of a sweep at about 1° pitch. Under the world-up curve model, their shape in their own frame therefore changes, and the preview correctly REMESHES them. On one probe that was 1,245 ms at 20 km ("reused 0").
   - This is the D166 §5 escalation (track-relative curvature would make pieces invariant), now with a cost measured. Not changed here: it is the model's design call.
   - The validation controller also grows its OWN path next to the preview's. Sharing one would halve that part (A's and E's wiring).
3. **Memory:** the heap is 171 MB and array buffers 60 MB, of which my meshes are about 60 MB (1.46 M vertices). RSS is 1.4–1.5 GB after a 124-word build with a GC forced (`--expose-gc`): memory the process has touched and not given back. **The RSS figure is over my budget;** the live data (heap + buffers, 231 MB) is well inside it. Which one to budget is a call for the chair; I report both.

## 2 · Incremental rebuild per cell (§3), proven (`test/perf.test.js`)
Through A's real shell and my preview model, on an 8-word track, counted by which cells get NEW vertex arrays:
- **A length sculpt of w4 rebuilds 5 of 39 cells:** `1ROAD_w4_in_0`, `1ROAD_w4_body_0`, `1ROAD_seam_w4_body`, `1ROAD_w4_out_0`, `1ROAD_seam_w5_in`. That is w4's three parts and the seams on its two sides. Asserted: nothing else, and at most its own cells + 2 seams.
- **A font edit of w4** rebuilds w4, **w5's entry part only** (`1ROAD_w5_in_0`, which blends from w4's font), and the seams beside them. Asserted.

## 3 · No mesh over IPC during a drag (§9), pinned (`test/perf.test.js`)
- **Recorded:** every native call goes through the shell's storage (A's `app/index.html` wires it to Tauri invoke). During a 10-step drag, with the preview model and E's validation subscribed as in the window, and autosave forced to fire at once:
  - **10 native calls, all `saveAutosave`, all text** (26,900 characters in all);
  - no typed array or buffer anywhere in an argument;
  - no export.
- **Static:** `app/preview/*.js` and `app/camera/*.js`, comments stripped, contain no `__TAURI__`, `invoke(`, `storage.` or `writeExport`.

## 4 · The soak (`scripts/soak.js`; `test/perf_soak.test.js`)
**The operations, seeded:** place, sculpt, undo, redo, remove head, save, open, set a picker. A sculpt moves a random handle by a drag-sized step: ±25% of its value, or ±0.5 rad for an angle, clamped to its own range. The handles' ranges are the model's limits (a length may be up to 100 km), not what a hand does.

**The checks:**
- no crash (anything the shell THROWS);
- every intermediate document round-trips through its text byte-exactly;
- undo is byte-identical every 25th committing edit, and redo restores the edit's bytes;
- save → open gives the same text;
- the incremental preview equals a full build every `fullEvery` ops and at the end;
- E's `validate` runs without throwing every 50 ops.

**A failure prints** the seed, the op index, the op, and `replay: node scripts/soak.js --seed S --ops N --max-words W`.

**The track is capped at 6 words** (0.18 s per op measured; 0.37 at 12). Long tracks are the bench's job.

**In the default suite:** 60 ops, seed 7, a full-build check every 10 ops, about 3.5 s. **The full run:** `T180_SOAK=10000 node --test --test-concurrency=4 test/perf_soak.test.js`, under the heavy-run lock.

**THE FULL 10,000-OP SOAK (appended 2026-09-27 18:30 local): PASSED, 0 failures.**
- Run: `T180_SOAK=10000 T180_SOAK_SEED=1 node --test --test-concurrency=4 test/perf_soak.test.js`, through scratchpad `locked_soak.js`. Lock asked 00:04:33Z, held 00:06:16Z, done 00:28:44Z, exit 0; duration_ms 1,348,615 (22.5 min, not the 16 I estimated from the 400-op run).
- Its own `# soak` line: 10,000 ops, **9,518 on a resolving track (95%; the assertion is ≥ 80%)**, 5,600 committed, 738 refused, 661 byte-identical undo checks, 39 full-build comparisons, 193 validations, 437 ops on a torn document (43 torn after a non-sculpt op), 5 words at the end.
- By op: sculpt 2,505, place 1,806, remove head 1,726, undo 1,176, picker 992, redo 786, save 516, open 493.
- The first torn document was again A's ROLL_STEP (op #71, a sculpt: "w5 starts at roll 0 rad but w2 ends at 0.262 rad"). That is the §5 defect; the todo test still fails visibly and does not fail the suite.
- Earlier, a 400-op run with the fix: 381 of 400 ops on a resolving track, 241 committed, 23 undo checks, 2 full-build checks, 8 validations, 0 failures (38.4 s).

**A FIRST 10k RUN IS VOID, said plainly.** It ran under the lock (lock held 00:02:57Z, done 00:03:21Z) and reported 0 failures in 23.5 s. But only 161 of its ops committed, and 5,882 were torn edits undone, with just 5 validations.
- **The cause, in my soak:** it undid a tearing EDIT, and a later `redo` re-applied it. It never checked the document after the other ops, so the soak spent nearly all its ops on an unresolvable document and exercised no geometry.
- **Fixed:** after ANY op that leaves the document torn, the soak undoes until it resolves (and starts a new document if it cannot). The test now ASSERTS coverage: at least 80% of ops must run on a track that resolves.
- **The rerun is the result above.**

**What the soak found:**
- **In A's area, and a real defect:** a sculpt of a word's END ROLL (`roll1`) to a value inside its range is **committed**, and leaves the document unable to resolve ("ROLL_STEP: w2 starts at roll 0 rad but w1 ends at 0.74 rad: the surface would tear"). The shell's own contract is "a failed action changes nothing and says why".
  - Minimal reproducer: place straight, straight; sculpt w1 roll1 = 0.74.
  - It is the `todo` test in `test/perf_soak.test.js`, which fails visibly without failing the suite.
  - First seen at seed 1, op #71 (a sculpt). *(Corrected 2026-09-27 19:1x local: this line said #67. It re-derives as #71, both before and after the soak fix (B's D176 read §2.2), and the 10k run's own `firstUnresolved.index` above is 71. The todo's label in test/perf_soak.test.js is corrected with it.)* Before I made the soak undo such edits (as a user would), the document then stayed torn for 233 of 300 ops, and the geometry went unexercised.
- **In my harnesses:**
  - a `todo`'s failure, and the summary's "✖ failing tests:" header, were counted as failures, and failed the control. Fixed in all three harnesses.
  - the short soak compared against a full build too rarely to catch mutant P1. It now checks every 10 ops.

## 5 · Routed (board post, 23:5x)
- **E** (`app/validate-ui/panel.js`, `src/validate`): the revalidation costs above, with the reproducer `node --expose-gc scripts/bench.js --km 40 --seed 17`, and the second path the controller keeps.
- **A** (`src/doc` `editWord`, `app/shell.js` `sculpt`): the torn-surface commit, with the failing todo test and the three-line reproducer.

## 6 · Mutations
**`node --test --test-concurrency=1 app/test/mutation.test.js` → 44 tests, 44 pass:** the CONTROL, and 43 mutants all APPLIED and CAUGHT; NOT APPLIED: none. New:
- P1 (a sculpt keeps the old mesh) → caught by "soak:"; it first survived until the soak checked more often;
- P2 (every change rebuilds the whole track) → caught by "per-cell rebuild: a length sculpt";
- P3 (the preview reaches for the native side) → caught by "no mesh over IPC: app/preview and app/camera".

The texmaker (18) and geometry (27) harnesses are unchanged except for the parser fix; not re-run this lap.

## 7 · NOT verified
- Timings in the real window: WebView2 and a GPU frame on top. These are headless node timings on a shared machine.
- The soak's operations do not include Close the loop (about 20 s each) or drags through `beginDrag`/`dragTo` (the perf test drives drags); they are sculpts.
- A closed Rainbow-scale LOOP: the bench track is open. Closing 40 km through the connector was not tried.
- Memory in the WebView2 process (only node's).

## 8 · CHANGELOG addition, for B to carry (under Added)

```
- Hardening: a Rainbow-scale benchmark (scripts/bench.js, 40 km along the app's own edit path), a seeded soak of
  random edits (scripts/soak.js; 60 ops in the default suite, 10,000 behind T180_SOAK) checking round-trips,
  byte-identical undo, save/open and the preview against a full build, and tests that an edit rebuilds only the
  cells it touches and that no mesh crosses to the native side during a drag.
```

NEXT: librarian call_librarian with the pointer when the hand-back is written.
