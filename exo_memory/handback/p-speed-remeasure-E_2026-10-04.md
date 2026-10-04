# p-speed-remeasure-E · D235: A's cb14f5b9 against the registered bar · pane E · 2026-10-04, on D

## VERDICT: the bar is MET for the drag step, and NOT for the full-detail result. Both are reported.

**The bar** (plan, part 2): KEEP only if the closed tube oval's edit-to-draw is ≥ 2× faster than my base (2,669.6 ms per brush step) AND the fixtures read 0 of 9 differ.

| tube oval, ms | base | A `cb14f5b9` | faster |
|---|---|---|---|
| **one brush drag step** (coarse while dragging, detail 6) | **3,212.3** (same session) · 2,669.6 (registered, this morning) | **1,097.5** | **2.93×** against the same-session base · **2.43×** against the registered base |
| **full detail after release** (A: 250 ms after release, then a full rebuild) | 2,886.0 (base rebuilds in full on endBrush too, though nothing changed) | 250 + **2,767.8** (+ 293.4 for the endBrush update itself) | **1.04×** on the release rebuild · **1.16×** against one full base step |

**Fixtures: 0 of 9 differ.** checked: A's tree, `node --test test/core_cup_fixtures.test.js` under the lock → 8/8 pass, including row 5a's `/\n0 of 9 differ/` against the layered baseline (D196 + D222 + D230), and the control that "1 of 9" is caught. Output `rm/fixtures-a.txt`.

**My reading, for the librarian to rule on.**
- On the words registered ("edit-to-draw … at least 2× faster"), the hand gets a drawn response to each drag step 2.4–2.9× sooner, so it is **KEEP**.
- But the full-detail track takes as long as before. About 250 ms after release, the UI is busy about 2.8 s in node (more in the WebView) while full detail comes back.
- **If "edit-to-draw" was meant as the final full-detail draw, the bar is NOT met (1.04–1.16×).** I do not choose between those readings. The bar's text does not say, and the chair asked for both.

## How a coalesced, coarse-while-dragging step is timed here
- **The instrument:** `speedprobe2.js` (sha256 `1c483cd8…`) is MY speedprobe.js with only this added. The tree's `app/preview/coarse.js` FACTOR (6), where it exists, is driven exactly as `app/preview/preview.js` refresh() drives it:
  - `model.setDetail(6)` while `state.brush` is open, then the same stages as before (resolve, path, mesh, batches, texture flow, look, validation with the lap off, labels);
  - on release: `shell.endBrush()`, the update that state change causes (A: the same document returns `same`), then `setDetail(1)` and the full-detail rebuild.
  - On the base tree the same release sequence runs with no detail change.
- **Coalescing** (A's at most one `brushTo` per animation frame) changes HOW MANY steps run per pointer move, not the cost of one. So a "step" is still one `brushTo` plus everything after it; that is what the table times.
- inferred: coalescing should also stop steps queueing in the WebView. Not timeable in node.
- **The command for each figure,** run serially, each alone under the heavy-run lock, base then A, per track, 09:12 local:
  `node --max-old-space-size=4096 -e "require('…/heavy-run.js').hold({cmd}); process.argv=['node','speedprobe2.js','<tree>','<track>','rm/<base|a>-<track>.json']; require('./speedprobe2.js')"`
  - Trees: base `C:/Users/nname/Desktop/worktrees/e-speed-wt` (`ee3df09`, my part-1 base); A `C:/Users/nname/Desktop/worktrees/e-speed2-wt` (`cb14f5b9`, fresh, 0 links).
  - Median of 5 after 1 warm-up.

## All four tracks (ms, median of 5; node only)

| | base | A | note |
|---|---|---|---|
| tube oval, drag step | 3,212.3 | **1,097.5** | A: mesh 2,365.5 → 461.1, texture flow 119.4 → 11.9, batches 100.9 → 30.8. **Unchanged:** resolve 245 → 252, validation 335 → 321. These two are now 52.3% of A's step. |
| tube oval, release | endBrush 126.5 + a full rebuild 2,886.0 | endBrush 123.1 + `same` 293.4 + 250 ms + full 2,767.8 | A's release full rebuild: mesh 2,224.5, validation 337.1, texture flow 113.6 |
| **cup oval (T-180 OVAL)**, drag step | 755.2 | **788.0** | **not helped** (the cup segments carry no `fractions` grid, as A says); release: base 804.4 full, A 801.6 full |
| short (F3), Extend | 17.1 · ghost 9.5 per keystroke | 18.4 · ghost 10.4 | unchanged |
| **long open tube**, Extend | 499.1 · **ghost 253.7 per keystroke** | 464.9 · **ghost 207.7** | ghost **1.22×**: ghostMesh 131.1 → 90.6; ghostBuild (toSegments of the whole doc) 120.6 → 115.0 unchanged |

## Drift, so it shows
- **This session's base tube is 3,212.3 against 2,669.6 this morning (+20%).** Cup oval: 755.2 against 691.0. Long open tube: 499.1 against 417.9.
- Same code, same probe stages, same docs. inferred: the machine is slower now (load or thermals). Nothing measured it.
- **So the ratio against the same-session base (2.93×) is the cleaner one**; the registered-base ratio (2.43×) mixes in the drift.

## What this does NOT establish
- **Any WebView time:** the GPU upload is smaller in coarse mode (inferred, about a sixth of the across vertices), but the draw, GC and the felt snap-back to full detail are unmeasured. The node figures are a floor.
- **Whether the keeper minds the coarse section while dragging** (about 6° per column where it was 1°), or the about-2.8-s busy spell after release. That is his hands, row G.
- **What would move the rest:**
  - the resolve (toSegments of the whole document, about 250 ms on the tube);
  - full validation on a closed loop (about 320 ms).
  - Both are untouched, and A says so.
- **Machine L.**

## Also: the DISAGREE row on my D226 claim (vantage `63c9ce90…`) does not hold
- **The reader looked in the LIGHTHOUSE repo; the claim was about the t180 worktree.** checked: `git -C C:/Users/nname/Desktop/worktrees/e-suite-wt cat-file -t 01165a09` → `commit`; `git show 01165a09:tools/suite2.cjs | sha256sum` → `da7e19a8…` (as claimed); `git status --porcelain` → 0 lines.
- My D226 hand-back named the worktree beside the sha. The ring did not repeat it, so a reader starting from the room's default repo looked in the wrong place.

## Evidence (scratchpad `…\scratchpad\speed\`)

| file | sha256 |
|---|---|
| `speedprobe2.js` | `1c483cd8…` |
| `rm/base-tube.json` | `4532ffa2…` |
| `rm/a-tube.json` | `0b702ceb…` |
| `rm/base-oval.json` | `3fc1db0f…` |
| `rm/a-oval.json` | `ee96fb4e…` |
| `rm/base-short.json` | `c916cbf1…` |
| `rm/a-short.json` | `509cbe9a…` |
| `rm/base-tubeopen.json` | `dfb609a5…` |
| `rm/a-tubeopen.json` | `949aa812…` |
| `rm/fixtures-a.txt` | `5c45c6f1…` |

Nothing was committed, pushed or launched.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-speed-A_2026-10-04.md · C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_edit_speed_2026-10-04.md · C:\Users\nname\Desktop\lighthouse\exo_memory\loop\edit_speed_profile_2026-10-04.md
