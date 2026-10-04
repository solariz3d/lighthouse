# p-speed2-remeasure-E · D236: A's 510510e9 against the registered bar · pane E · 2026-10-04, on D

## VERDICT: KEEP. Bar (1) MET, bar (3) MET as far as it can be measured, and bar (2) MET.
- **Base:** main `cb14f5b9`, worktree `C:/Users/nname/Desktop/worktrees/e-speed2-wt`, clean.
- **Candidate:** `510510e9`, a fresh worktree `C:/Users/nname/Desktop/worktrees/e-speed3-wt` with 0 links.
- **Instrument:** MY probe, not A's. Same session (11:46–11:47 local), median of 5 after 1 warm-up, every run alone under the heavy-run lock, `--max-old-space-size=4096 --expose-gc`.

| bar | base | candidate | result |
|---|---|---|---|
| **(1) cup oval (T-180 OVAL) drag step** (`editTotalMedian`), ≥ 2× | 599.1 ms | **120.3 ms** | **4.98× — MET** |
| **(2) tube oval release to full detail** (`release.full`, the rebuild after the 250 ms timer), ≥ 1.5× | 2,193.4 ms | **341.3 ms** | **6.43× — MET** |
| **(3a) fixtures 0 of 9** | — | `core_cup_fixtures` 8/8 pass, row 5a "0 of 9 differ" | **MET** (`rm3/fixtures-cand.txt`) |
| **(3b) exports byte-identical to main's** | — | oval and tube oval: 9 of 10 files byte-identical; the 10th differs ONLY in `written` | **MET for the two closed tracks.** The two open tracks cannot be exported as registered (below). |

## Besides the bar (asked)
- **Tube oval drag step:** 852.5 → **383.1 ms (2.23×).** Validation is now 251 of the 383 ms (full on a closed loop, untouched), and resolve 199 → 74.
- **Keystroke ghost:** long open tube 172.4 → **111.8 ms (1.54×)**; ghostBuild 94.1 → 42.2 from `valuesAt`. Short track 9.9 → 7.1 ms.
- **Cup oval release to full detail:** 724.0 → 312.3 ms (2.32×). 194.6 ms of that is the water pour, which my probe counts after every update and the panel runs only when water is on. inferred: without water it is about 118 ms.
- **The release's other two parts are unchanged:** `endBrush` and the `same` update, about 245–274 ms on both trees. Most of it is water plus validation.
- **Extend commit:** long open tube 439.0 → 305.9 ms; short track 17.5 → 15.1 ms.

## (3b) How the export was compared, and the timestamp
- **The route:** `expcmp.js` (sha256 `05f8b35c…`) exports as `app/core/coreshell.js exportTo` does:
  - `toSegments`, its `offsetPath` lift and the doc's start;
  - the grid from coreshell's `startLayout`;
  - through `src/export/fromwords.js exportSegments`, which is what the app's `runSegments` calls;
  - with the texture set the page announces by default (`createCoreTextures`, asphalt);
  - into scratch folders, base and candidate in one process. Nothing touched the AC folder.
- **Results:**
  - **T-180 OVAL:** 10 files, 52,946,174 bytes, 9 byte-identical.
  - **T-180 TUBE OVAL:** 10 files, 136,367,108 bytes, 9 byte-identical.
  - The kn5, the AI line and the ini/ui files are among the identical ones; the per-file sha256 values are in `exp/expcmp.json`.
- **The one file that differs, both tracks: `t180b_untitled/.t180b-builder.json`.**
  - Same size, 327 bytes. Parsed and walked key by key, **exactly one field differs: `written`.** Oval: `2026-10-04T17:45:05.850Z` vs `…17:45:16.119Z`; tube: `…17:45:49.905Z` vs `…17:46:23.427Z`.
  - It is a timestamp written at export time (`src/export/fromwords.js:276`, as A said), different by construction. **Every other field is equal.**
  - I treat it as excluded from "byte-identical", and name it here. A excluded it too.
- **The two OPEN probe tracks (F3, and the open long tube) CANNOT be exported as registered.** `exportTo` refuses an open loop ("the loop is not closed") before any export, on both trees.
  - What I compared instead: their **`toSegments` TEXT is identical** between the trees (and so are the closed tracks'). That is the input every export path starts from. Fixtures F1/F2, the closed laps, cover the kn5 for other track shapes.

## Memory (asked: A keeps two meshes for a closed loop)
After the release, two forced GCs, `process.memoryUsage()`, the same probe on both trees:

| MB | base | candidate | growth |
|---|---|---|---|
| tube oval: heapUsed / arrayBuffers | 733.3 / 115.9 | 872.0 / 133.8 | **+138.7 (+19%) / +17.9** |
| cup oval: heapUsed / arrayBuffers | 245.1 / 43.5 | 304.0 / 49.5 | **+58.9 (+24%) / +6.0** |
| open tracks | equal (685.9 / 108.7; 24.8 / 11.0) | equal | none |

- **Visible, and it scales with track length:** the coarse slot is kept alive beside the full mesh.
- rss moved both ways (tube −14 MB, oval −278 MB). rss is the process's footprint, not what is retained, so I report heapUsed.
- **Not measured: the WebView side.** GPU buffers for a second mesh are not kept, inferred: the renderer holds what it draws.

## How the stages read on the candidate
- The "mesh" stage now includes `reuseMesh`. That is `speedprobe3.js` (sha256 `0bf270c1…`): my speedprobe2 plus `reuseMesh` in the mesh wrapper and the memory line.
- **A said my speedprobe2 missed it** (the time then shows under "batches"). That is right: without the change the per-stage line would mislead. The totals were unaffected either way.

## What this does NOT establish
- **Any WebView time** (upload, draw, GC, snap-back). The node figures are a floor.
- **How the 6 m / 6° coarse cup looks while dragging:** row G, the keeper's.
- **An exact-equality check of `reuseMesh` against a full rebuild:** that is A's `eq_probe.js` and B's look, not mine.
- **Exports of the two open tracks** (above). **Machine L.**

## Evidence (scratchpad `…\scratchpad\speed\`)

| file | sha256 |
|---|---|
| `speedprobe3.js` | `0bf270c1…` |
| `expcmp.js` | `05f8b35c…` |
| `exp/expcmp.json` | `02cd61cc…` |
| `rm3/base-oval.json` | `eaa0b643…` |
| `rm3/cand-oval.json` | `9c3e0f63…` |
| `rm3/base-tube.json` | `de5928d1…` |
| `rm3/cand-tube.json` | `f8de47b1…` |
| `rm3/base-short.json` | `5862f2e9…` |
| `rm3/cand-short.json` | `ab0bbce4…` |
| `rm3/base-tubeopen.json` | `da30c3c3…` |
| `rm3/cand-tubeopen.json` | `8ac1ec5f…` |
| `rm3/fixtures-cand.txt` | `fe897a9d…` |

The command per figure: `node --max-old-space-size=4096 --expose-gc -e "require('…/heavy-run.js').hold({cmd}); process.argv=['node','speedprobe3.js','<tree>','<track>','rm3/<base|cand>-<track>.json']; require('./speedprobe3.js')"`.

Nothing was committed, pushed or launched.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-speed2-A_2026-10-04.md · C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_edit_speed2_2026-10-04.md
