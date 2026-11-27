# T-180: Sculpt makes a stretch even. A plan and a mock (pane A, L, 2026-11-27, L265; nothing is built)

**His words** are in `briefs/t180_sculpt_even.md` (04:59 to 05:00, verbatim). The ask, read from them: grab the edge of a turn to make it wider, then bring the
**rest of the turn to the same width**, without a battle by hand and eye; "some form of snap to a position to make the surfaces even".

**Base:** builder `landing-1127-l263` c522ea6 (the build installed on L), read in a detached worktree. **Evidence:** `handback/p-l265-sculpt-even-A_2026-11-27_evidence/`.
- `even265.js` is the one probe. It ran 11:08:39Z through heavy-run at BelowNormal.
- `even265.json` holds every figure below; each row's `profile` is the width every 10 m.
- The pictures are untracked (never added).

**Verdict: not refused.** No existing tool makes his turn even. The closest any tool gets on his example leaves a 0.25 m ripple across the turn and its ends 2 m short; Smooth does not move it (item 1). A tool that brings a run **to** a value does make it even, to the stored quantum, in a prototype (item 2).

---

## 1. His example, measured (checked)

**The setup** (checked, `even265.json` `setup`), built through the core shell (`app/core/coreshell.js`), as the app drives it:
- **The road:** a 200 m straight lead, then **a left turn of 4 pieces** (60 m, 30° each: 120° over 240 m, from s 200 to 440), then a 150 m straight exit.
- **Its shape:** 12 m wide everywhere, flat.
- **His gesture:** the zone grab on the **outer (right) rim** (`app/core/zonegrab.js` `frameAt` and `follow`; `coreshell.js` `beginFollow`). The rim is pulled straight out until the pressed spot reads 16 m.
  - The grab radius is 30 m, the strip's default (`panel.js:807`).
  - The far rim stays put, as D522 made it.

**What is measured:** every 1 m over the turn:
- the width `w`;
- the inner (left) edge, `l + w/2`;
- the outer edge, `l − w/2`.

The **spread** is max − min over the turn. **Outside** is the largest change from the base anywhere off the turn.

| | what was done | width over the turn (m) | width spread | outer edge spread | inner edge spread | outside |
|---|---|---|---|---|---|---|
| T0 | the base | 12 to 12 | 0 | 0 | 0 | 0 |
| **T1** | **his gesture:** one grab at the turn's middle, pulled to 16 m | 12 to 16.04 | **4.04** | 4.02 | 0.02 | 0 |
| T2a | by hand: 4 grabs, one at each piece's middle, each to 16 m | 12 to 16.04 | 4.04 | 4.02 | 0.02 | 0 |
| **T2b** | **by hand: 8 grabs every 30 m (one radius apart), each to 16 m** | 14.06 to 16.12 | **2.06** | 2.05 | 0.01 | 1.76 |
| T3 | a wider brush: one grab with radius 120 m (the whole turn) | 12 to 16.04 | 4.04 | 4.02 | 0.02 | 0 |
| T4 | a selected run: the 4 pieces selected, their width handle to 16 m | 12 to 16 | 4 | 2 | 2 | 0 |
| T4b | one piece at a time: each piece's width handle to 16 m | 12.88 to 16.00 | 3.12 | 1.56 | 1.56 | 0.74 |
| T5 | the Width tool, radius 60 m (the tools' default), +4 m at the middle | 12 to 16 | 4 | 2 | 2 | 0 |
| T6 | **Smooth** after T2b, width then lateral, over the turn, strength 4 / 16 / 64 | 14.06 to 16.15 | **2.09 / 2.08 / 2.09** | 2.08 / 2.07 / 2.08 | 0.01 | 1.76 |

**What the profiles show** (every 10 m, `even265.json`):
- **T1, T3, T4 and T5 are one bump each.** The middle reaches 16, and the turn's ends stay at 12. A wider brush (T3) or a selected run (T4) only makes the bump wider; it is never flat. This matches the brief's reading of `sculpt.js:1-2` (Δ·f, one falloff) and `coreshell.js:535` (a run is only the window).
- **T2a is four separate bumps.** Spots 60 m apart with a 30 m radius each go back to 12 m between them: the scalloped edge.
- **T2b is his "battle".** With the spots one radius apart, the middle of the turn ripples between 15.87 and 16.12 m: a 0.25 m ripple, with peaks at the three joints (s 260, 320, 380). The first and last 15 m are still short (14.06 m at the turn's ends). The road just outside the turn changed by 1.76 m, because a grab near the end reaches past it.
  - **T2a and T2b already model a perfect snap:** every pressed spot was brought to exactly the asked value. So **snapping the drag's value does not make the road between spots even** (item 2c).
- **T6, Smooth, does not even it.** After λ 64 the middle still ripples 15.86 to 16.13 m. The joint peaks stay at exactly 16.12 m at every strength, and the ends stay at 14.06 m, which Smooth holds (it holds its window's outer four control points, `sculpt.js:374`). It is a relax of wobble, as the brief says, not a level.
- **T4 and T5 move both edges** (inner spread 2). The handle and the tools are symmetric, not one-sided like the grab.

**Side findings (checked numbers, not asked):**
- **The grab overshoots by 1%.** Asked for 16, the pressed spot reads 16.04 (T1).
- **One piece's width handle spills.** On these 60 m pieces it changed the neighbours by up to 0.74 m (T4b): the brush widens to 3 knot spans (`sculpt.js` `sculpt`), and 60 m is more than the piece's half-length.

**The baseline a fix is scored against: T1 (4.04 m) and T2b (2.06 m over the turn, a 0.25 m ripple inside it).**

## 2. Ways to make a stretch even

Three designs were tried as **prototypes**, computed inside `even265.js` and never in the builder. Each is a flat-topped window: weight 1 over the stretch, a smootherstep ramp (the brush's own falloff, `sculpt.js` `smootherstep`) to 0 beyond it, and the joints settled as `sculpt.js` `settle` does (value, then slope).

| | design | on the base (from T0) | on the scuffed turn (from T2b) |
|---|---|---|---|
| **E1** | **add the same amount** over the run (+4 m) | spread **0** | spread **2.06**, unchanged (18.06 to 20.12) |
| **E2** | **bring the run to a value**: 16 m, inner edge held | spread **0**, outer and inner edge spreads 0 | spread **0** (16.0000 every 1 m), edges 0 |
| (c) | **snap the drag** to steps | T2a/T2b: every spot exact, the road between them still 4.04 / 2.06 | — |

**(a) E1, a flat-topped ADD** (the run changes by the same amount along its whole length, with a ramp at each end):
- What he does: select the run and drag its handle. Every metre of it moves by the drag.
- The road becomes:
  - from an even start, an even turn (spread 0);
  - from a scuffed start, **the same scuffs, 4 m wider**.
- The cost: a falloff option for the brush (core), and a run handle that uses it.
- **It does not make an uneven stretch even.** It answers "widen this whole turn by 4 m", which he did not quite ask.

**(b) E2, a LEVEL: bring the run TO a value.** It is checked even from both starts, to 0.0000 m at 1 m sampling.
- **What he does:** select the run (or the turn), then give the value in one of three ways:
  - **type it:** width 16.00 m;
  - **pick it from the road:** "make it all like here", one click on a spot;
  - **drag the run's handle:** the readout shows the value the whole run goes to.
- **The road becomes** exactly that value along the run. The far edge is held (item 4), and there is a short ramp at each end (item 3).
- **The cost:** a pure core function beside `sculpt` and `smooth` (it reuses `settle`), a Sculpt tool in the shell's table (`SCULPT_TOOLS`, `coreshell.js:166`) with a run window, and a strip control.
- **This answers his words:** "the same thickness", "make the surfaces even", and "snap to a position", reading "position" as the value the whole stretch snaps to.

**(c) A SNAPPING DRAG** (steps of 0.5 m, or 1° of bank, with the value shown while dragging):
- **Alone, it does not answer him.** T2a and T2b are exact at every spot, and the road between the spots is still scalloped.
- **It is worth having as the drag form of (b):** the run's handle snaps to 0.5 m steps while he drags, so a dragged level lands on a round value.
- He did not ask for snapping by itself.

**The pick:** (b), with (c) as its drag readout. E1's "add" is what today's run handle could mean instead of a bump; which one the run handle means is his call (item 8).

## 3. The ends, the joint, a closed lap and the open end

Measured with E2, two ways (`even265.json`, the E2 and E2i rows):
- **Ramps outside the run (E2):** 30 m ramps beyond each end, plus one knot span (20 m) of margin.
  - checked: the run is **even to its joints**, 16.0000 m from its first metre to its last.
  - The two neighbours change over 50 m each (outside: 4 m at most, which is the ramp).
  - Why the margin: settle carries a joint's slope into the next piece (value, then slope), so the run's first span is flat only if the width is already flat at the joint. Without the margin, the first span after the joint would still be ramping.
- **Ramps inside the run (E2i):** the neighbours are untouched (2 of 6 pieces are the same objects). The even part starts about 45 m in (at the 10 m profile, 15.99 m at 40 m and 16 m from 50 m), and the joints keep the old width.
  - This is today's Sculpt rule for one piece (its joints untouched, `coreshell.js` `beginSculpt`).
  - From T2b its first and last 30 m stay a blend of the old scuffs and the value: whole-run spread 1.97, with the turn's ends still at 14.06. It is even only between the ramps.
- **The ramp's shape:** the smootherstep the brush already uses (C2 inside a piece), with C1 joints by `settle`. Its length is a setting; 30 m is a first guess.
- **A closed lap:**
  - inferred, from the code, not measured: every brush holds the **lap's first piece's first two control points** (`sculpt.js` `settle`, the unlinked start; `smooth` the same).
  - So a level across the start line would leave the old value at the seam: a dip.
  - The build must either move the seam's points on both sides together, or refuse a run across the start line by name.
- **The open end:** inferred: a run ending at the head has no ramp after it, and the head takes the value. The next Extend then starts from that width, which the width field already shows (the panel reads the head).

## 4. Which settings

**The same tool, unchanged, for every value channel.** The level is channel-blind: it sets control points to a value. The channels are those `sculpt.js` `MODES.value` lists: width `w`, the right side `wd` (split pieces, since L263), bank `phi`, cup `c`, the edges `e`, `er` and `s`, the wall rise `r`, and the tube sweep `t`.
- checked: the prototype ran on `w` and `l`.
- inferred: the rest follow from the same code path.

**Two catches:**
- **One side or both.** His gesture moves one edge: the grab holds the far rim (D522). A level of `w` alone moves both edges by half.
  - The prototype held the inner edge by levelling `l` with it, to −2 m. That is exact only because the base `l` was 0 and the road flat.
  - The build must solve the held edge as the grab does, through the bank (`zonegrab.js` `follow`, the hinge). On split pieces, the right width (`wd`) alone is the one-sided level.
- **Bank past a turn.** A level of `phi` must take its value in the head's own turn (D677 (2) carries past ±360 and ±720): "level to 400°" is 400, not 40. This is the shown-versus-unwrapped frame from `handback/p-l260-sculpt-carry-A_2026-11-27.md`, "For a refactor of Sculpt", point 2. inferred: a level built before that frame has one owner would add a sixth place that decides "one turn".

**A route tool's "even"** is a different tool, not this one:
- **Bend (`kh`):** even means a constant turn rate over the run, a circular arc. Levelling `kh` to its mean keeps the turn's total angle (∫kh ds), but it moves everything after the turn and re-closes a closed lap.
- **Climb (`kv`):** even means a constant pitch rate, or an even grade with `kv` set to 0.
- inferred: both are worth naming and not building here.

## 5. Sources (opened, cited; no name, word or project of his in a search)

Searches were generic: "Unity terrain Set Height tool flatten manual", "Unreal Engine landscape sculpt mode Flatten tool documentation", "Blender manual proportional editing falloff constant", "RoadRunner lane width tool taper documentation". The pages were opened through a fetch:
- **Unity Manual, Set Height** (https://docs.unity3d.com/6000.2/Documentation/Manual/terrain-SetHeight.html):
  - It sets an area to "a specific value".
  - "press Shift (macOS: Control) and click on the Terrain to sample the height at the cursor position".
  - Flatten Tile and Flatten All set the whole tile, and "flatten all features on the tile".
  - **Ours:** a typed level, and "pick it from the road".
- **Unreal Engine, Landscape Flatten Tool** (https://dev.epicgames.com/documentation/unreal-engine/landscape-flatten-tool-in-unreal-engine):
  - It "pushes or pulls all other parts of the heightmap to the level that is currently under the mouse when activated".
  - Flatten Target "Sets the target height toward which to flatten".
  - The modes raise only, lower only, or both.
  - Use Slope Flatten "flattens along the Landscape's existing slope".
  - A Terrace interval gives steps.
  - **Ours:** the level picked under the press; raise-only and lower-only are possible later options; the terrace is the snap.
- **MathWorks RoadRunner, LaneWidthProfile** (https://www.mathworks.com/help/roadrunner/ref/lanewidthprofile.html):
  - A lane's width is "a sequence of parametric spans". Each node "contains information about the lane width and the slope of the width at that point", interpolated smoothly between nodes. "The interpolation process enables you to create gradual transitions in lane width", "including lane tapers and merges".
  - **Ours:** our B-spline control points with C1 joints (value and slope, `settle`) are that same model. A level is nodes at one width with slope 0, and the ramp is the taper.
- **Not cited:** Blender's Proportional Editing page returned HTTP 403, so its Constant falloff is not cited.

## 6. The registered test, before any build

**On his example as built in item 1** (`even265.js`, the same road), from **both** starts: T1 (his one grab) and T2b (the battle by hand). Level the turn (the 4 pieces) to 16 m, holding the inner edge:
1. **The width over the run, every 1 m: max − min ≤ 0.01 m.** It is 4.04 m (T1) and 2.06 m (T2b) today. The prototype reaches 0.0000.
2. **The outer edge over the run: spread ≤ 0.01 m.** It is 4.02 / 2.05 m today.
3. **The inner edge: no point moves more than 0.01 m.**
4. **Outside** the declared window (the run, plus the margin and the ramp each side): the same bytes; pieces wholly outside it are the same objects.
5. The document checks (C1 joints), and the level is **one undo step**.

**It did not fix it if any of these holds:**
- the width or outer-edge spread is over 0.05 m on either start;
- the inner edge moved more than 0.05 m;
- anything outside the window changed;
- the even part is shorter than the run less the declared ramps.

A build that reaches the numbers on the flat example but not with the turn banked 20° has fixed width only, and must say so. The banked row is part of the test.

## 7. The mock (for his eye)

`even265.js` part 2 rendered the real page, served from the c522ea6 tree in headless Chrome.
- **How:** the shared launcher (`--headless=new`, `--mute-audio`), the title `zz-headless-test` set first and read back at all 5 reads, and a Tauri stand-in whose `open_autosave` returned the turn. "Restore it" was clicked, then Overhead.
- **The looks:**
  - **before**, the T2b turn;
  - **after**, the prototype E2 levelled from T2b.
  - Each has a panel marked **"mock · not built"**, with the width along the turn as a line (16 and 12 m marked) and the figures. The after panel also shows the proposed control: "**Even** width 16.00 m over the selected run (4 pieces) · ramps 30 m beyond each end · hold the inner edge ☑ · Even it · or pick the value from the road".
- **One look:** `even_before_after.jpg`, the two side by side. Also `even_before.jpg`, `even_after.jpg`, `_near` versions. All untracked.
- **The mock's limit, said plainly:** the Overhead camera framed the build head, so the turn sits at the bottom edge of every picture. The road's edge cannot be read in them; the before and after are carried by the mock panel's line.
  - A second render, with the camera on the turn, would show the edge itself. The order allowed one probe, so it was not run. It is the chair's call.

## 8. His calls (listed, not decided)

1. **Bring to a value, or add evenly?** And what does dragging a **selected run's** handle mean: today a bump (T4), proposed "the whole run goes to this value"?
2. **Where the ramps go:** outside the run, so the run is even to its joints and the neighbours change over about 50 m; or inside, so the neighbours are untouched and the even part is shorter.
3. **The ramp's length**, 30 m as a first guess: a field like the Sharp tool's "sharp ramp m".
4. **One side or both:** hold the far edge, as the grab does, when the level starts from a rim? On split pieces, level the right width alone?
5. **Snap while dragging:** on or off, and which steps (0.5 m width, 1° bank, 1° cup).
6. **Which settings first:** width, then bank?
7. **A closed lap's start line inside a run:** move it, or refuse.
8. **The route "even"** (Bend to a constant radius): a separate tool, later, or never.
9. **Not asked:** Smooth leaves the joint peaks (T6), and the grab overshoots by 1% (T1). Whether either is wanted fixed.

**The build, estimated** (inferred):
- **core:** `sculpt.js` `level(doc, set, { lo, hi, ramp, margin, hold })`, about 80 lines (it reuses `settle`). Rows (about 14): the registered test's five checks on both starts, flat and banked; ramps inside and outside; a closed lap's seam; the open end; each value channel; refusals by name.
- **A mutation harness** on `level`, about 8 mutants.
- **shell:** an `even` tool in `SCULPT_TOOLS` with the run window and a value (typed, picked or dragged). Rows: about 6.
- **panel:** the strip control, the run handle in even mode, the pick. Rows: about 8, in `core-pieces-ui`, through the handle host.
- **Tier: prove it.** It writes stored track data: every row red first, and his saves opened, levelled and compared from copies.
- **The refactor:** the frame point of item 4 (one owner for a run's value and its turn) is best settled before or with this build.

---

SOURCES: briefs/t180_sculpt_even.md (43f860f0); loop/packet_t180_sculpt_even_2026-11-27.md (5cbf97f6); handback/p-l260-sculpt-carry-A_2026-11-27.md ("For a refactor of Sculpt"); handback/p-d520-follow-C_2026-10-28.md, p-d522-oneside-C_2026-10-28.md (the grab); builder c522ea6 src/core/sculpt.js, app/core/coreshell.js, app/core/zonegrab.js, app/core/panel.js; evidence even265.js, even265.json
