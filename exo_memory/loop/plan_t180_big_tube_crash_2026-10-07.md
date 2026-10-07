# T-180: the page crashes closing a big tube oval; and a 1000 m tube drag lags. Librarian, on D, 2026-10-07 01:5x. Lap D266.

The keeper, 01:48: "this page is having a problem and crashed, tried to make another tube oval to test and it was perfect and wouldnt close loop".
01:49: "plus when making very long turn like 1000m tube turn it lags when scrubbing cant precise move, i think the preview could be cheaper until
extend is pressed".

## Measured (librarian, on a COPY of his `eq-FINAL TEST.t180track`, saved 01:47: 6 pieces, each a 1000 m tube; t180 `e17a73e`)
- **The core Close is fine:** `close()` whole lap 481 ms, the 20% window 462 ms, the last piece 419 ms, no throw (scratch `finaltest_probe.js`).
- **The Close preview's overlap check is the heavy part** (scratch `finaltest_mem.js`, `app/core/overlapjob.js runJob` on the closed copy):
  | part | time | peak RSS |
  |---|---|---|
  | 'rest' (mesh + self-check + validator) | 10.4 s | **2,176 MB** |
  | 'rays' (mesh + ray-gap search) | 23.3 s | **2,781 MB** |
  | whole (one piece, as before D240's split) | 31.4 s | 2,740 MB |
- D240's warm-worker split runs 'rest' and 'rays' in TWO workers AT ONCE, on top of the page's own preview of a 6 km tube.
- **inferred (to be confirmed):** ~5 GB of JavaScript heap across the page and two workers in one WebView renderer process is past what the
  renderer can hold (V8's pointer-compressed heap cage), so the renderer dies: "This page is having a problem". On ordinary tracks the parts
  are far smaller, which is why D240's 13–14 km tests (no tube) passed.

## The lap
1. **The crash (E, who profiled the check in D240; EXPORT-adjacent since the check feeds Apply):**
   - Confirm the cause in a real WebView (own app data, NO pointer lock/focus-taking while the keeper may be at the PC: ask him first, or
     use a headless WebView2 / an off-screen window only) or by an equivalent memory measurement of page + workers.
   - Fix so this track closes: e.g. run the two parts **one after the other** when the track is big (peak ≈ one part, not two), and/or make the
     check's mesh lean (typed arrays, no per-vertex objects; the tube's cross-section resolution for the check only, never for the export).
     Registered before the fix: **peak memory on this track ≤ 1.5 GB per worker and the page survives Close + Apply; results identical to
     the one-piece check** (the D240 merge rule).
2. **The drag lag on a 1000 m tube (A, who built the ghost/handles):** while a handle or field is being dragged, draw the ghost CHEAP
   (coarser along the piece and around the tube, no underskin), and build the full ghost when the drag stops or Extend is pressed. Measured
   before/after: the frame time of one drag step on a 1000 m tube piece. The placed track and the export are unchanged.
- Rows red first. Then one install.

NEXT: chair dispatch D266 item 1 to E and item 2 to A when this plan is read (after D264 and D265's version bump land; they do not touch these files)
