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

## Second render, 2026-11-27 11:24Z (the chair's L265 same lap, 11:14:05Z)

**The pictures, untracked** in the evidence folder:
- `even2_8grabs_{start,middle,close,higher,far}.jpg`;
- `even2_4grabs_{start,middle,close,higher,far}.jpg`.

Each picture puts before and after side by side at the page's own pixels: two 900 × 1000 shots, not scaled. Each shot has a small "mock · not built" panel at its top right, and the header gives the camera's height and px per metre. **Look first at `even2_4grabs_far.jpg`, then `even2_8grabs_higher.jpg`.**

**The chair's condition. checked by eye, with the scale beside each** (`render265b.json` `frames`):
- **The 8-grab before (the plan's T2b): its scallops are not visible at true scale from any overhead camera I tried:** 15, 35, 75 and 151 m up, at 55, 23.6, 11.0 and 5.5 px a metre.
  - The ripple is 0.28 m (corrected below). That is 1.5 px at 151 m up.
  - At 15 m up it is 15 px, but the frame is 17 m tall, shorter than one 30 m hump.
  - Before and after look the same.
  - The prediction written before the run (`prediction265b.md`) said this. It held.
- **The 4-grab before (the plan's T2a, one snapped grab per piece): its 4 m scallops are plain** at 74 and 150 m up, and the after is even. The prediction held.
- Nothing is exaggerated. **The camera was placed by his own controls:**
  - the focus a click on a red sends (s + 45 m);
  - a right-drag down to the free camera's −89°;
  - wheel notches, 4 m each.
  - The page's pointer lock was switched off so the drag reads the plain pointer, which is the preview's own fallback.

**Its limits. checked:**
- **The left column did not clear away.** It covers the left 255 px of each 900 px shot. At 35 and 15 m up, the road's inner half is behind it. The outer edge is in view in every framing.
- **The start framings do not show the pinch at the turn's start:** it lies under the column.
- **Before and after are not shot from the same spot.** The focus follows the road's centre line, which moves when the width moves.
  - 8-grab pair: 0.24 to 0.25 m apart (6 px at 35 m up).
  - 4-grab pair: 2.9 to 4.4 m apart (24 px at 150 m up). The after's road sits slightly off the before's; the scallops do not depend on it.
- **A third render could fix both** (hide the column; read one pose from the before and set it for the after). It was not run, because the order allowed one. The chair's call.

**Found, not asked. checked** (`hcheck265b.js` → `hcheck265b.txt`; `even265.json` `grabs[].follow`):
- **Every grab also lowers the road's centre by 0.24 m where it pulls:** `h −0.2403` in each follow.
- **The level prototype sets only w and l, so it leaves those dips:**
  - after the 4-grab level, h is still −0.24 at the piece middles and 0 at the joints (spread 0.24 m);
  - after the 8-grab level, h runs −0.12 to −0.25 over the turn.
- **The page's checker draws the same 5 reds before and after on the 4-grab turn,** at 200–210, 250–270, 310–330, 370–390 and 430–438 m. inferred: they come from the height dips, since the width is even after.
- **So the registered test (plan §6) can pass on width while the surface stays uneven.** It measures width and edges only, and his words were about the surfaces. Either the level carries the height the grab moved, or the test gains a surface row (h spread over the run). This is for the chair; the plan is not changed.

**A correction to my own figure. checked:**
- The plan (the verdict, §1 T2b, the baseline line) and this hand-back quote the 8-grab middle ripple as 0.25 m (15.87 to 16.12). That was read off the 10 m profile.
- Sampled every 1 m it is **15.84 to 16.12, 0.28 m** (`render265b.json` `measured.before8.wFrom230To410`).
- The committed rows themselves re-derive unchanged (`check.same: true` for T2b, T2a and E2 after T2b).

**The machine:**
- **The one probe:** `node consonance/tools/heavy-run.js --status && node consonance/tools/heavy-run.js --run --priority belownormal --cmd "A L265 second render: …" -- node render265b.js <tree> <evidence> <raw>`, run 11:23:28 to 11:24:31Z.
  - Both slots were free at the start. No cmd anywhere in the chain.
  - checked at 11:23:31Z: its node child, pid 17908, was at BelowNormal with 1.91 s of CPU.
- **Headless:** the shared launcher, never focused. The title read zz-headless-test at every read. Page errors: 0.
- **Leftovers:** tab proxies UNCALIBRATED, 0 before and after; 0 orphan browsers (`leftovers265b_before.txt`, `_after.txt`).
- **The height check** was a sub-second node read, not through heavy-run.
- **The worktree** `t180-wt-l265b-even` at c522ea6: checked clean, then removed. B's worktree was not touched.

**Committed evidence:** `render265b.js`, `render265b.json`, `prediction265b.md`, `hcheck265b.js`, `hcheck265b.txt`, `leftovers265b_before.txt`, `leftovers265b_after.txt`. Not committed: the 10 pictures.

SOURCES: evidence render265b.json, prediction265b.md, hcheck265b.txt; even265.json (d7342b61); the chair's L265 same-lap order 11:14:05Z
NEXT: librarian shows him even2_4grabs_far.jpg, saying the 8-grab scallops are not visible at true scale; the chair decides on a third render and on a surface row for the registered test

## The plan amended: the surface, 2026-11-27 11:43Z (the chair's L265 amendment, 11:29:58Z)

**The plan is amended in place.** Every change is marked *[amended 11:43Z]* and replaced text is struck (26 markers). Plan only; nothing built. The probe is `amend265.js`, with every figure in `amend265.json`.

**Why a width grab moves the height. checked** (plan item 1, new part; `zonegrab.js` `follow`; `amend265.json` `mechanism`):
- **The rule:** a rim press holds the far rim and scales the section about it by k.
- **On this road the rims stand 0.714 m above the centre** (the cup).
- **So the centre drops (k − 1) × 0.714 = 0.2403 m.** That is exactly the follow's `h −0.2403`.
- **The control:** with cup 0 the same grab sends `h 0`.
- **Found:** the real section does not scale in proportion. Its rims stand 1.149 m up at 16 m, where the rule assumes 0.952. So after a grab both rims sit 0.2 m higher; neither is held in height.
- **Banked 20°:** the grab also turns the bank −5.0°.

**The level carrying width, the sideways shift and the height (E3), rerun on both starts. checked** (plan item 2 (b′)):

| start | width spread | sideways spread | height spread | reds on the run | reds in the window |
|---|---|---|---|---|---|
| T1, before | 4.0392 | 2 | 0.2403 | 2 | 2 |
| T1, E3 | 0 | 0.0022 | 0.011 | 0 | 2 (176–180, 458–464) |
| T2b, before | 2.06 | 1.02 | 0.1226 | 0 | 2 (192–196, 444–448) |
| T2b, E3 | 0 | 0.003 | 0.0148 | 0 | 2 (158–160, 476–482) |

**E3 fails the amended test,** on three counts:
- the height's spread is over the 0.01 m bar;
- the held rim moves 0.2 m up: it uses the grab's proportional rule;
- its 0.24 m height ramp draws 2 reds just outside the run.

**The pick is E5, NOT measured.** It brings the width, the centre's height and the sideways shift to values; the shift is read from the section at the new width (−1.9407 m on his example).
- inferred: spreads 0, and no ramp reds, from E2's measured rows.
- **It needs one more probe:** the order allowed one, and it ran E3. The chair's call.

**What "to a value" means for the height** (plan (b′), and call 10): the centre's height h is brought to one value along the run. By default that is the height where the run is untouched; it can also be typed or picked. The rims sit at the section's rise above it. Holding a rim's height instead is his call.

**The registered test** (plan item 6) gains:
- **row 6, the surface:** the height's spread over the run ≤ 0.01 m;
- **row 7:** the checker's reds on the run are gone. My addition: no red in the window that the base lacks.
- **Row 3 is amended:** the held edge is read as the rim the section puts there, held at its place where the run is untouched.

**The banked row. checked, open:**
- the banked base already draws 4 reds on the run before any grab;
- neither E3 nor E4 evens it (height spread 0.31 to 2.08 m).
- The plan says so and does not solve it.

**Corrections, carried into the plan, struck and marked:**
1. **The 8-grab ripple is 0.28 m, not 0.25 m** (the 10 m profile missed 15.84).
2. **"The grab overshoots by 1%" is withdrawn.** My probe pulled the rim 4 m horizontally, and the width is measured along the cupped section, which spans 11.88 m sideways at 12 m. checked: `horizontalSpan` 11.8835, k 1.3366.
3. **The plan's E2 "held the inner edge" by l + w/2.** The rim itself moved 0.059 m inward (5.8825 against 5.9418): the earlier edges were a proxy, flat-section numbers.

The earlier sections of this hand-back keep their wording, as dated traces. Their "0.25 m" and "1%" are corrected here.

**The machine:**
- **The one probe:** `node consonance/tools/heavy-run.js --status && node consonance/tools/heavy-run.js --run --priority belownormal --cmd "A L265 amendment: …" -- node amend265.js <tree> <out>`, run 11:36:09 to 11:39:01Z, node only, no page.
  - Both slots were free. No cmd in the chain.
  - checked at 11:36:13Z: its node child, pid 38184, was at BelowNormal with 4.64 s of CPU.
- **The worktree** `t180-wt-l265c-even` at c522ea6: checked clean, then removed. E's worktree was not touched.
- **No pictures.**

SOURCES: exo_memory/loop/plan_t180_sculpt_even_2026-11-27.md (amended 11:43Z); evidence amend265.js, amend265.json; builder c522ea6 app/core/zonegrab.js (follow, frameAt), app/validate-ui/checkjob.js; the chair's L265 amendment 11:29:58Z
NEXT: chair allows or refuses one more node probe for E5 when it reads the amended plan; if allowed, A measures E5 from T1 and T2b and appends its spreads and reds

## E5 measured on three starts, 2026-11-27 11:52Z (the chair's L265 order of 11:46:31Z; the librarian's leg widened it to the banked start)

The probe is `e5_265.js` (amend265.js's code unchanged, plus E5 and a new main), with every figure in `e5_265.json`. The plan's items 2 (b′), 6 and 8 are amended in place, marked *[amended 11:52Z]*. Plan only; no build, no page.

**E5:** the width to 16 m; the centre's height to its value where the run is untouched; the sideways shift so the held (inner) rim sits at λ, read from the section at 16 m.

| start | width spread | sideways spread | height spread | held rim off λ | held rim moved from the start (across / up) | reds on the run | reds in the window, not in the base |
|---|---|---|---|---|---|---|---|
| T1 (flat) | 0 | 0 | 0 | 0 | 1.4868 / 0.4353 | 0 | 0 |
| T2b (flat) | 0 | 0 | 0 | 0 | 1.4868 / 0.3425 | 0 | 0 |
| banked 20°, T1 | 0 | 0.8688 | 0 | 0.0276 | 2.1356 / 1.0728 | 4 (the base's own) | 2 (444, 460 m) |
| banked 20°, T2b | 0 | 0.7159 | 0 | 0.0114 | 2.1419 / 0.6372 | 4 (the base's own) | 1 (478–480 m) |

**Flat. checked:**
- **The spreads and the reds:** E5 evens both starts (width, sideways and height spreads 0; 0 reds, 0 ambers; outside unchanged). The levelled road reads the same from both starts as from the base.
- **The rims stand 0.435 m higher on the run,** as designed for holding the centre's height.
- **But row 3 fails in substance:** the held edge was not held where the turn had it.
  - λ was read at the window's outer start, s 150. There the first piece's built section is 14.97 m wide while its width channel reads 12 (21.5 m at s 100, 12.00 m from s 200; `frame150.js` → `frame150.txt`; cause not found).
  - So λ was 7.3838 m, not 5.9418 m, and the inner rim went 1.44 m inward.
  - The probe's own row 3 check passed only because it measured against that λ.
- **inferred, not measured:** with λ read on the run's own section, l is −1.9407 m. That is E2's measured geometry with the height levelled; E2 from the base drew 0 reds.

**Banked 20°. checked, and not designed further** (the librarian's leg):
- **E5 does not even it.** It passes width, height and outside. It fails the outer edge (0.951 / 0.729 m), the held rim (0.0276 / 0.0114 m off λ) and the reds.
- **What does not hold, and why:**
  - **The base's bank runs 0 to 20° along the run.** So with the bank kept there is no single cross-section to level to, and the rims' places move with it.
  - **The 4 reds on the run are the banked base's own,** there before any grab, at the checker's 970 km/h.
  - **E5 does not carry the bank, so the grab's bank turn stays.** From T2b the run's bank peaks at 17.80° where the base reaches 20.00°. From T1, every figure reads exactly as E5 from the banked base with no grab, so these failures are not the grab's doing. The grab turned the bank 5.0° there; E5 leaves that turn in place.

**My error, named:**
- I read "where the run is untouched" at the window's outer edge without checking that the section there was the run's own.
- The plan's amended row 3 and E5's definition now say to read it on the run's own section.
- The flat pass is therefore not shown to him as a working pick until λ is read there and measured.

**The machine:**
- **The one probe:** `node consonance/tools/heavy-run.js --status && node consonance/tools/heavy-run.js --run --priority belownormal --cmd "A L265 E5 probe: …" -- node e5_265.js <tree> <out>`, run 11:48:06 to 11:50:29Z, node only.
  - Both slots were free. No cmd in the chain.
  - checked at 11:48:09Z: its node child, pid 26084, was at BelowNormal with 3.97 s of CPU.
- **`frame150.js`:** a sub-second node read of the base's frames, after the probe, to explain λ. Not through heavy-run.
- **The worktree** `t180-wt-l265d-even` at c522ea6: checked clean, then removed.
- **No pictures.**

SOURCES: evidence e5_265.js, e5_265.json, frame150.js, frame150.txt; exo_memory/loop/plan_t180_sculpt_even_2026-11-27.md (amended 11:52Z); the chair's order 11:46:31Z and the librarian's ring 11:46Z
NEXT: chair decides whether E5 is measured once more with λ read on the run's own section before it is shown to him; the banked row stays open for his call 11
