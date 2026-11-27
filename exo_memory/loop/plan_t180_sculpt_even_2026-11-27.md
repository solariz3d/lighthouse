# T-180: Sculpt makes a stretch even. A plan and a mock (pane A, L, 2026-11-27, L265; nothing is built)

**His words** are in `briefs/t180_sculpt_even.md` (04:59 to 05:00, verbatim). The ask, read from them: grab the edge of a turn to make it wider, then bring the
**rest of the turn to the same width**, without a battle by hand and eye; "some form of snap to a position to make the surfaces even".

**Base:** builder `landing-1127-l263` c522ea6 (the build installed on L), read in a detached worktree. **Evidence:** `handback/p-l265-sculpt-even-A_2026-11-27_evidence/`.
- `even265.js` is the one probe. It ran 11:08:39Z through heavy-run at BelowNormal.
- `even265.json` holds every figure below; each row's `profile` is the width every 10 m.
- The pictures are untracked (never added).

**Amended 2026-11-27 11:43Z** (the chair's L265 amendment of 11:29:58Z; the probe `amend265.js`, figures in `amend265.json`, run 11:36:09 to 11:39:01Z). Every change below carries the marker *[amended 11:43Z]*, and replaced text is struck, not deleted:
- why a width grab moves the height (item 1, new part);
- the level must carry the height, and the measured E3 (item 2 (b′));
- the registered test gains a surface row and a reds row (item 6);
- the 8-grab ripple is 0.28 m, not 0.25;
- the "1% overshoot" side finding was my probe's, not the grab's.

**Verdict: not refused.** No existing tool makes his turn even. The closest any tool gets on his example leaves a ~~0.25 m~~ 0.28 m *[amended 11:43Z: sampled every 1 m]* ripple across the turn and its ends 2 m short; Smooth does not move it (item 1). A tool that brings a run **to** a value does make it even, to the stored quantum, in a prototype (item 2). *[amended 11:43Z]* **But E2 evens the width only.** It leaves the height the grabs moved, so the surface stays uneven, and the checker's reds stay. The level must carry the width, the sideways shift and the height (item 2 (b′)).

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
- **T2b is his "battle".** With the spots one radius apart, the middle of the turn ripples between ~~15.87 and 16.12 m: a 0.25 m ripple~~ 15.84 and 16.12 m: a 0.28 m ripple *[amended 11:43Z: 15.87 was read off the 10 m profile; every 1 m it is 15.84, `render265b.json` `measured.before8.wFrom230To410`]*, with peaks at the three joints (s 260, 320, 380). The first and last 15 m are still short (14.06 m at the turn's ends). The road just outside the turn changed by 1.76 m, because a grab near the end reaches past it.
  - **T2a and T2b already model a perfect snap:** every pressed spot was brought to exactly the asked value. So **snapping the drag's value does not make the road between spots even** (item 2c).
- **T6, Smooth, does not even it.** After λ 64 the middle still ripples 15.86 to 16.13 m. The joint peaks stay at exactly 16.12 m at every strength, and the ends stay at 14.06 m, which Smooth holds (it holds its window's outer four control points, `sculpt.js:374`). It is a relax of wobble, as the brief says, not a level.
- **T4 and T5 move both edges** (inner spread 2). The handle and the tools are symmetric, not one-sided like the grab.

**Side findings (checked numbers, not asked):**
- ~~**The grab overshoots by 1%.** Asked for 16, the pressed spot reads 16.04 (T1).~~ *[amended 11:43Z]* **Withdrawn: the 1% was my probe's, not the grab's.**
  - `even265.js` pulled the rim straight out by (16 − 12) = 4 m, horizontally. The width is measured along the cupped section, whose rims are 11.88 m apart sideways at 12 m wide (`amend265.json` `mechanism`: `horizontalSpan` 11.8835).
  - So 4 m out is a 4.04 m wider section. The pressed point went exactly where it was pulled.
- **One piece's width handle spills.** On these 60 m pieces it changed the neighbours by up to 0.74 m (T4b): the brush widens to 3 knot spans (`sculpt.js` `sculpt`), and 60 m is more than the piece's half-length.

**Why a width grab moves the height** *[amended 11:43Z, new; checked, `amend265.json` `mechanism` and the start rows; the code is `app/core/zonegrab.js` `follow`]*:
- **The rule.** A rim press holds the far rim and scales the whole section about it by k, the new rim-to-rim chord over the old. The centre moves by F0 − F1, the far rim's offset from the centre before and after (`F1 = rot(oF·k)`). The comment above it says "the section is the same shape at any width".
- **The cup lifts the rims.** On this road the rims stand **0.714 m above the centre** (s 320, 12 m wide: the held rim 5.9418 m across and 0.714 m up). A cup field of 11.68° shows at the head; a piece made with cup 0 has a flat section.
- **So the centre drops.** The rim pulled 4 m out across an 11.88 m span gives k = 1.3366. The centre drops by (k − 1) × 0.714 = **0.2403 m**. That is exactly what the follow sent: `h −0.2403`, `l −2`, `w +4.0392`, `phi 0`.
- **The control:** the same grab on the same road made with cup 0 (rims 6 m across, 0 up) sends `h 0` and `w +4` exactly.
- **The real section does not keep its shape.** At 16 m its rims stand **1.149 m** above the centre (E2 from the base: h 0, both rims at 1.1493), where the rule assumes 0.952. So after one grab both rims sit **0.2 m higher** (0.714 → 0.9126, start T1) and the centre 0.24 m lower. **Neither rim is held in height.** inferred: the cupped part takes the added width at its slope, rather than every part growing in proportion.
- **On the turn banked 20°**, the same grab also turns the bank by `phi −0.0872` rad (−5.0°): the pull is horizontal and the banked chord is not.
- **The surface after the grabs** (the start rows, over the turn):
  - T1: the height spreads 0.2403 m, and the checker draws 2 reds on the run (294–300 and 340–346 m, "the car leaves the road surface here at full speed");
  - T2a: 5 reds on the run;
  - T2b: the height spreads 0.1226 m, with 2 reds just outside the run (192–196, 444–448).
  - The base (no grab) has none.

**The baseline a fix is scored against: T1 (4.04 m) and T2b (2.06 m over the turn, a ~~0.25 m~~ 0.28 m *[amended 11:43Z]* ripple inside it).** *[amended 11:43Z]* And the surface: a height spread of 0.2403 m (T1) and 0.1226 m (T2b), with T1's 2 reds on the run.

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
- **This answers his words:** "the same thickness", ~~"make the surfaces even",~~ *[amended 11:43Z: E2 does not; the surface needs (b′)]* and "snap to a position", reading "position" as the value the whole stretch snaps to.

**(c) A SNAPPING DRAG** (steps of 0.5 m, or 1° of bank, with the value shown while dragging):
- **Alone, it does not answer him.** T2a and T2b are exact at every spot, and the road between the spots is still scalloped.
- **It is worth having as the drag form of (b):** the run's handle snaps to 0.5 m steps while he drags, so a dragged level lands on a round value.
- He did not ask for snapping by itself.

**The pick:** (b), with (c) as its drag readout. E1's "add" is what today's run handle could mean instead of a bump; which one the run handle means is his call (item 8). *[amended 11:43Z]* (b) as E5 below: it carries the height and the sideways shift too.

**(b′) The level must carry what the grab moved: width, the sideways shift and the height** *[amended 11:43Z, new; checked unless marked; `amend265.json`]*

**E2 evens the width only.** It leaves the height the grabs moved (item 1, "Why a width grab moves the height"):
- from T1, the height's spread stays 0.2403 m, and the 2 reds on the run stay;
- from T2a, the same 5 reds, before and after.

The second render showed this first (hand-back, "Second render").

**E3: width to 16 m, the sideways shift and the height carried about the held rim**, using the grab's own rule (the section scaled with the width). From both starts:

| start | level | width spread | sideways (l) spread | height (h) spread | held rim moved from the start (across / up) | reds on the run | reds in the window (150–490 m) |
|---|---|---|---|---|---|---|---|
| T1 | none | 4.0392 | 2 | 0.2403 | — | 2 (294–300, 340–346) | 2 |
| T1 | E2 | 0 | 0 | 0.2403 | 0.0655 / 0.4353 | 2 | 2 |
| T1 | **E3** | **0** | **0.0022** | **0.011** | 0.0453 / 0.1973 | **0** | 2 (176–180, 458–464) |
| T2b | none | 2.06 | 1.02 | 0.1226 | — | 0 | 2 (192–196, 444–448) |
| T2b | E2 | 0 | 0 | 0.1226 | 0.0415 / 0.2199 | 0 | 2 (the same) |
| T2b | **E3** | **0** | **0.003** | **0.0148** | 0.0196 / 0.0917 | **0** | 2 (158–160, 476–482) |

**E3 does not pass the amended test (item 6):**
- **The height's spread is 0.011 and 0.015 m,** over the 0.01 m bar. It is left at the former bumps' edges: the carry was set per control point.
- **The held rim does not stay put.** E3 inherits the grab's rule, so it lowers the centre 0.238 m where this section needs 0.435 m to keep the rim. The rim ends at about 0.91 m up along the run (0.9009 to 0.9118 from T1), where it is 0.714 m where the run is untouched.
- **Its own height ramp draws 2 new reds.** The centre steps 0.24 m down over a 30 m ramp, and the checker reds it just outside the run, at its 970 km/h.

**E5, the pick: bring each carried setting to a value over the run.** *Designed from the rows above; NOT measured.* The order allowed one probe, and it ran E3.
- **The width:** to W (16 m), as E2.
- **The height:** the road's centre, h, to one value, like the width. By default it is the height where the run is untouched (its ends: 0 on his example); it can also be typed, or picked from the road.
  - **This is what "to a value" means for the height:** the centreline is even along the run, relative to the road's own line, and level with the road outside it. So there is no height ramp at the ends.
  - The rims then sit at the section's own rise above it: 1.149 m at 16 m on this cup (0.714 m at 12 m). They rise over the width ramps.
- **The sideways shift:** l to the value that keeps the held rim's place across, read from the section **at the new width**, as `frameAt` reads it, and not as l + w/2.
  - On his example: 5.9418 m (the held rim where the run is untouched) − 7.8825 m (the rim's offset at 16 m, the E2 base row) = **−1.9407 m**.
  - The plan's −2 m left the rim 0.059 m inward (5.8825).
- **inferred, from E2's measured rows:** the width, sideways and height spreads over the run are 0 on both starts. Every control point from 180 to 460 m is set to the same three values, and E2's margin already gave 16.0000 at every metre of the run. The scuffs are replaced whole.
- **inferred:** none of E3's ramp reds, because the centre's height does not change at the ends. E2 from the base (the same three values with l at −2) draws 0 reds and 1 amber.
- **One more node probe measures E5:** the chair's call.
- **The other choice is his** (item 8, call 10): hold a rim's height instead, which was the grab's intent. Then the centre drops with the deeper section (0.435 m at 16 m here) and has to ramp back at the ends. E3's 0.24 m over 30 m already drew reds at the checker's speed.

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

**~~Two~~ Three *[amended 11:43Z]* catches:**
- **One side or both.** His gesture moves one edge: the grab holds the far rim (D522). A level of `w` alone moves both edges by half.
  - The prototype held the inner edge by levelling `l` with it, to −2 m. That is exact only because the base `l` was 0 and the road flat. *[amended 11:43Z]* Not exact even then. On this cupped section the rim is not at l + w/2: the rim sat 0.059 m inward (5.8825 against 5.9418, the E2 base row). E5's l reads the section at the new width (item 2 (b′)).
  - The build must solve the held edge ~~as the grab does, through the bank (`zonegrab.js` `follow`, the hinge)~~ *[amended 11:43Z]* from the section at the new width, as `frameAt` reads it.
    - Not with the grab's own rule. `follow` scales the section in proportion, and on this cup that leaves the far rim 0.2 m higher (item 1).
    - The bank is part of it on a banked road, where a grab also turns the bank (−5.0° a grab at 20°).
  - On split pieces, the right width (`wd`) alone is the one-sided level.
- *[amended 11:43Z, new]* **The height is carried, always.** A level of `w` carries `l` and `h` with it (E5): the height to its value, the shift to hold the edge. On a banked road it also carries `phi` (open: see item 6's banked row).
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
3. **The inner edge: ~~no point moves more than 0.01 m~~** *[amended 11:43Z]* **read as the rim the section puts there (`frameAt`), not l + w/2: along the run it stays at one place across, within 0.01 m of its place where the run is untouched.**
   - Why amended: the grabs themselves moved the held rim (5.897 to 5.948 m across, and up to 0.2 m up: item 1), so "no point moves" from a scuffed start would keep a grab's scuff.
   - And l + w/2 is not the rim on a cupped section: E2's rim sat 0.059 m inward of it.
4. **Outside** the declared window (the run, plus the margin and the ramp each side): the same bytes; pieces wholly outside it are the same objects.
5. The document checks (C1 joints), and the level is **one undo step**.
6. *[amended 11:43Z, new]* **The surface: the height h over the run, every 1 m: max − min ≤ 0.01 m.**
   - Today: 0.2403 m (T1) and 0.1226 m (T2b).
   - E2 leaves it as it is. E3 reaches 0.011 / 0.0148 m (item 2 (b′)).
7. *[amended 11:43Z, new]* **The checker's reds on the run are gone.** The page's own check (`app/validate-ui/checkjob.js` `createCheckJob().run({ doc, csp: true })`, CSP on, as the page ran it) draws no red on the run.
   - My addition: no red in the declared window that the road before the grabs (the base) does not have. A level that moves its reds into its own ramps has not fixed them.
   - Today: T1 has 2 on the run. E3 has 0 on the run, and 2 in its ramps.

**It did not fix it if any of these holds:**
- the width or outer-edge spread is over 0.05 m on either start;
- the inner edge moved more than 0.05 m *[amended 11:43Z: from its place where the run is untouched, read as the rim]*;
- anything outside the window changed;
- the even part is shorter than the run less the declared ramps;
- *[amended 11:43Z, new]* the height's spread over the run is over 0.05 m on either start;
- *[amended 11:43Z, new]* the checker draws a red on the run, or a red in the window that the base does not have.

**The prototype against this test** *[amended 11:43Z, checked, `amend265.json` `test`]*: **E3 fails it** on both starts.
- It passes rows 1, 2, 4 and the reds on the run: width spread 0, outer edge 0.0022 / 0.003 m, outside unchanged, 0 reds on the run.
- It fails row 3 (the rim 0.2 m up), row 6 (0.011 / 0.0148 m) and the window clause of row 7 (2 reds in its ramps).
- E5 is designed to pass it (item 2 (b′)) and is not measured.

A build that reaches the numbers on the flat example but not with the turn banked 20° has fixed width only, and must say so. The banked row is part of the test. *[amended 11:43Z]* **Measured on this road with the turn pieces banked 20°:**
- **The banked base draws 4 reds on the run before any grab** (222–252, 268–312, 328–372, 388–432 m), at the checker's speed. Its bank runs 0 to 20° along the run.
- **A grab there also turns the bank:** −5.0° at s 320.
- **Neither variant evens it.** E3 (the bank kept) leaves a height spread of 0.31 to 0.66 m. E4 (the bank brought to 20° along the run) leaves 1.99 to 2.08 m, with more reds (8 or 9 against 6 or 7).
- **So the banked row needs two things first:** a banked base the checker passes, and a level that carries the bank the grab moved. Both are open; the plan does not solve them here.

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
9. **Not asked:** Smooth leaves the joint peaks (T6)~~, and the grab overshoots by 1% (T1)~~ *[amended 11:43Z: withdrawn, item 1]*. Whether ~~either is~~ it is wanted fixed. *[amended 11:43Z]* And the grab's far rim is not held in height: a 4 m widening of this cupped road leaves both rims 0.2 m higher (`zonegrab.js` `follow` scales the section in proportion; item 1). Whether the grab should read the section as it is.
10. *[amended 11:43Z, new]* **The height's value in a level:**
    - **hold the centre's height** (E5: the centreline even and level with the road outside the run; the rims rise with the deeper section, 0.435 m at 16 m here);
    - **or hold a rim's height**, the grab's intent: the centre drops 0.435 m and must ramp back at the run's ends. A 0.24 m step over 30 m already drew reds at the checker's speed.

**The build, estimated** (inferred):
- **core:** `sculpt.js` `level(doc, set, { lo, hi, ramp, margin, hold })`, about 80 lines (it reuses `settle`). Rows (about 14): the registered test's ~~five~~ seven *[amended 11:43Z]* checks on both starts, flat and banked; ramps inside and outside; a closed lap's seam; the open end; each value channel; refusals by name.
  - *[amended 11:43Z]* The level carries `l` and `h` with `w`, and `phi` on a banked road. The held edge's shift is read from the section at the new width (`frameAt`'s `sectionOf`), so the core level needs the section, which `sculpt.js` does not read today.
  - The reds row runs the page's check (`checkjob.js`) on the levelled document.
  - inferred: about 30 more lines and 4 more rows.
- **A mutation harness** on `level`, about 8 mutants.
- **shell:** an `even` tool in `SCULPT_TOOLS` with the run window and a value (typed, picked or dragged). Rows: about 6.
- **panel:** the strip control, the run handle in even mode, the pick. Rows: about 8, in `core-pieces-ui`, through the handle host.
- **Tier: prove it.** It writes stored track data: every row red first, and his saves opened, levelled and compared from copies.
- **The refactor:** the frame point of item 4 (one owner for a run's value and its turn) is best settled before or with this build.

---

SOURCES: briefs/t180_sculpt_even.md (43f860f0); loop/packet_t180_sculpt_even_2026-11-27.md (5cbf97f6); handback/p-l260-sculpt-carry-A_2026-11-27.md ("For a refactor of Sculpt"); handback/p-d520-follow-C_2026-10-28.md, p-d522-oneside-C_2026-10-28.md (the grab); builder c522ea6 src/core/sculpt.js, app/core/coreshell.js, app/core/zonegrab.js, app/core/panel.js; evidence even265.js, even265.json; *[amended 11:43Z]* evidence amend265.js, amend265.json, render265b.json; app/core/zonegrab.js follow and frameAt, app/validate-ui/checkjob.js, src/core/level.js (the pitch Level, a different tool: the new control is named Even, not Level)
