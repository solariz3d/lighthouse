# L265, pane A (L, Opus 5.5): Sculpt makes a stretch even. A plan and a mock; nothing built

**The order:** the chair's L265 of 11:00:51Z. His words (`briefs/t180_sculpt_even.md`, 43f860f0) and the packet (`loop/packet_t180_sculpt_even_2026-11-27.md`, 5cbf97f6) were read whole.

**BASE:** builder `landing-1127-l263` c522ea6, read in my detached worktree `Downloads\t180-wt-l265-even` (removed at the end).

**The plan:** `exo_memory/loop/plan_t180_sculpt_even_2026-11-27.md`. Its eight sections answer the packet's eight items in order.

**Verdict: not refused.** No tool that exists makes his turn even, and a level does. The details are in plan §1-2.

## What I found (each claim marked)

- **His example, the baseline. checked** (`even265.json`, plan §1):
  - The setup: a left turn of 4 pieces at 12 m; the outer rim grabbed (zone grab, radius 30 m) and pulled to 16 m.
  - **His one grab:** the width over the turn spreads 12 to 16.04 m, **4.04 m**.
  - **8 grabs by hand, each spot exactly 16:** **2.06 m**, with a 0.25 m ripple through the middle and peaks at the joints.
  - **A wider brush, a selected run, the Width tool:** one bump each (spread 4.04 / 4 / 4).
  - **Smooth at strength 4, 16, 64:** 2.09 / 2.08 / 2.09, so it does not even it.
- **Snapping alone does not answer him. checked:** the 8-grab case is already a perfect snap at every spot, and the road between the spots is still uneven (plan §2c).
- **The pick: bring a selected run TO a value. checked as a prototype**, computed in the probe, not in the builder.
  - The value can be typed, picked from a spot, or dragged with a snapping readout.
  - It brings the turn to **16.0000 m at every metre** from both starts, the inner edge held (spread 0).
  - "Add the same amount" (a flat-topped brush) keeps the scuffs: 2.06 m stays 2.06 m (plan §2).
- **The ends. checked for the two ramp placements** (plan §3):
  - Outside the run, with one knot span of margin: the run is even to its joints, and the neighbours change.
  - Inside the run: the neighbours are untouched, and the even part is shorter.
- **The closed lap. inferred from the code:** every brush holds the lap's first two control points (`sculpt.js` `settle`), so a run across the start line needs its own handling (plan §3).
- **Every value channel takes the same tool. inferred** (the prototype ran on `w` and `l` only).
  - The one-sided hold must be solved through the bank, as the grab does.
  - A bank level must use the unwrapped frame (plan §4).
- **Sources. checked, opened through a fetch:**
  - Unity's Set Height;
  - Unreal's Landscape Flatten;
  - RoadRunner's LaneWidthProfile.
  - Blender's page returned 403 and is not cited.
  - No name, word or project of his was searched (plan §5).
- **The registered test.** Written before any build (plan §6): spread ≤ 0.01 m on both starts, inner edge within 0.01 m, nothing outside the window changed, one undo step, plus a banked row. What would mean it did not fix it is stated beside it.
- **His calls:** 9, listed and not decided (plan §8).
- **The build estimate. inferred:** about 28 rows and one harness; tier prove it.

**Side findings. checked, not asked:**
- The grab overshoots by 1%: asked 16, it reads 16.04.
- One piece's width handle changed its neighbours by up to 0.74 m on 60 m pieces: the 3-span widening.

## The mock

- **The pictures, untracked** (never added) in `p-l265-sculpt-even-A_2026-11-27_evidence/`:
  - `even_before_after.jpg`, the one look;
  - `even_before.jpg`, `even_after.jpg`, `even_before_near.jpg`, `even_after_near.jpg`.
- **What they show:** the real page restored with the turn, before (the 8-grab turn) and after (the prototype's level). Each carries a panel marked "mock · not built" with the width along the turn, and the proposed "Even" control.
- **Its limit, plainly:** the Overhead camera framed the build head, and the turn sits at the bottom edge. The road's edge is not readable in the pictures; the panel's line carries the before and after.
  - A second render with the camera on the turn was not run: the order allowed one probe. It is the chair's call.

## The machine

- **The one probe:** `even265.js`, run 11:08:39Z as `node consonance/tools/heavy-run.js --status && node heavy-run.js --run --priority belownormal --cmd "A L265: …" -- node even265.js <tree> <evidence>`, in the background.
  - checked at 11:08:54Z: its node child, pid 34820, was at BelowNormal with 15.95 s of CPU. It was not a shell.
  - No cmd anywhere in the chain.
  - B's tier held the other slot; B's worktree was not touched.
- **Headless:** the shared launcher (`--headless=new`, `--mute-audio`), never focused.
  - The title `zz-headless-test` was set first, and read back at all 5 reads (`even265.json` `mock.titles`).
  - Tab proxies UNCALIBRATED, read 0 before and after; 0 orphan browsers (`leftovers265_before.txt`, `_after.txt`). Page errors: none.
- **His saves:** not opened. No track names appear anywhere: the mock's track is named "mock turn".
- **The worktree:** checked clean (0 changes), then removed.
- No branch, build, install or release.

**Committed evidence:** `even265.js`, `even265.json`, `leftovers265_before.txt`, `leftovers265_after.txt`. Not committed: the 5 pictures.

SOURCES: exo_memory/loop/plan_t180_sculpt_even_2026-11-27.md; exo_memory/briefs/t180_sculpt_even.md (43f860f0); exo_memory/loop/packet_t180_sculpt_even_2026-11-27.md (5cbf97f6); evidence even265.js, even265.json
NEXT: librarian takes the plan and the mock to him when he next looks; the chair decides whether a second mock render (the camera on the turn) is wanted; the build waits on his calls (plan §8)
