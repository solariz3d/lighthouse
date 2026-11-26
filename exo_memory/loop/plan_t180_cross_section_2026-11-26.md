# Plan: the cross-section class on the track builder (D677), pane B, 2026-11-26

A plan, no code. Asked by the chair at 19:54:19Z. Base: `C:\Users\nname\Downloads\t180-fresh`, landing-1126 `ceb21f5`, read
only. I read the same commit in my own worktree, `G:\consonance-scratch\b-t4-t180` (detached at
`ceb21f58f14f44b5fb16526be591e356468a265a`), so every file:line below is at `ceb21f5`.

[T1] to [T5] are other authors' tracks. This file names none of them and quotes no coordinates. Sections are metres along
the lap.

**My bias.** I wrote class A's description in the [T4] hand-back ("one side falls from the centre at a steady 15°"). Part 1
below finds that description was in the wrong frame, so I have a stake in the re-reading being right. It is inferred from
the read's own numbers, not from a built road. A seat with no stake should run step A0 before anything is built.

## In three lines

- **(a) Do not build a cross-fall.** Re-read in world terms, [T4]'s class A is the normal road, unchanged, with an 18 m
  level shelf joined to one rim. The pit lane already makes that shape. The plan is to lay one and measure it. Nothing new
  is built unless that fails.
- **(b) Build a held one-sided width only as a stored right-width channel** (the `er` pattern). That is a stored-data
  change, so it is his call. The no-data route (width plus a held sideways offset) puts a false corner into the line the
  checker reads.
- **(c) No stored-data change is needed.** The file format already lets a landing start at its own cross-section. Only
  Extend's start after a flight, and the Jump button's default landing, do not. The control: after a bare flight, Extend
  starts at the typed values, as it already does on an empty track.

---

## (a) The falling side: [T4] class A, 30,631–30,963 m (sections 365–369)

### What the read actually holds

The [T4] hand-back table (`exo_memory/handback/p-unmakeable-T4-B_2026-11-26.md:626-630`) gives these sections:
- 365 and 369: 30 m wide, bank about 0, cupped both sides;
- 366–368: 47–49 m wide, "bank R-up" 12.5–15.3°.

The quarter slopes are measured against each station's own plane, not against the world:

    checked: probe.cjs:39-41 → the probe walks along Lr = f × n, so its "left" (side +1) is the builder's RIGHT
    checked: run.cjs:35 → qL: s.qR, qR: s.qL (the swap back to builder sides)
    checked: sections.cjs:44 → bank from the station normal, + = left side up

The same quarter slopes, put in world terms by adding the station's bank on each side:

    checked: node -e (t4.sections.json, medians per section; scratch only) →
      366 bank -14.6: right side -14.5 at 1/4, 1/2, 3/4 and rim; left 9.2 / 15.6 / 25.7, rim 35.0
      367 bank -15.3: right -15.2 at all four;                    left 9.0 / 15.9 / 25.8, rim 36.5
      368 bank -12.5: right -12.6 at all four;                    left 9.5 / 14.1 / 23.9, rim 35.4
      365 bank -1.0:  right 3.1 / 9.4 / 14.5, rim 20.7;           left 3.5 / 9.6 / 14.7, rim 23.2
    checked: node -e (probe.json tilt, the mesh within 2 m of the centre against the station plane) → median -0.47, -0.62, -0.32 on 366-368

| section | right side, in world terms | left side at 1/4, 1/2, 3/4, rim, in world terms |
|---|---|---|
| 366 | +0.1 (level) | -5.4, +1.0, +11.1, +20.4 |
| 367 | +0.1 | -6.3, +0.6, +10.5, +21.2 |
| 368 | -0.1 | -3.0, +1.6, +11.4, +22.9 |

inferred: the sides' slopes add to the station bank as angles in one cross plane. That is exact on level road, and these
three sections are level.

**What this describes.** The right half is level ground. The read's centre is really tilted 14.6° (the probe's centre tilt
is under 1°). The left half falls a little, then climbs to a rim of 20–23°, the rim of 365.

That is the normal 30 m road with an 18 m level shelf joined to its right rim, at the rim's height (30 + 18 = 48). The reader
takes both as one road, so it puts the centre 9 m to the right, on the road's right cup wall. Checked against that picture:
- the read's centre slope is about the wall's slope there (rising rightward);
- its left quarter points fall at 3 m right, 3 m left and 9 m left of the real centre, and the rim 15 m left;
- the read's values there (-5 → +1 → +11 → +21) follow 365's cup. 365 reads +3.5, +9.6, +14.7 and +23.2 at 3.75, 7.5,
  11.25 and 15 m.

inferred, not checked against a built road or a picture. The 330 m sits at the end of the lap, just before the start line.

**So "a side that falls from near the centre" was the read's frame, not the road.** My [T4] hand-back laid it in the read's
frame: it tried negative cups and negative edges to make the right side fall 15° below the station plane (`:45-49` of that
hand-back). In world terms that side is level, and the left side is a cup the builder already makes.

### The control he would see

**None new.** The pit lane (the panel's pit tool, `app/core/pitui.js`; the document's `pitLane`, `src/doc/pitlane.js`):
- side R, offset 0 (the lane's inner edge is the road's edge), width 18;
- leaving over 365 (diverge about 72 m), running 30,703–30,919, rejoining over 369 (merge about 44 m).

The shape matches `src/geom/pitlane.js:12-26`: the lane leaves the road's edge tangentially and lies level in the road's
across-plane, at the height of the edge it leaves. It can leave an edge of 35° or less. This rim reads 20–23°, so Flatten
for the pit (`src/core/pitflat.js`) is not needed.

What blocks it, named:
- **A document has one pit lane** (`src/doc/pitlane.js:8-14`, one object). If [T4] has its own pit lane elsewhere, this
  shelf cannot be a second one. Then the route is (b)'s per-side width plus a per-side cup, two new channels. I would say
  do not build that for one 330 m apron; it is his call.
- **The lane's limits** (`src/doc/pitlane.js:32`): offset 0–200 m, width 2–30 m, diverge and merge 5–2000 m. 18 m and these
  lengths are inside.

### Stored data

None for the pit-lane route. `BAD_CUP` (`src/core/extend.js:941`, `src/core/document.js:498`) and `BAD_EDGE` (`extend.js:948`,
`document.js:443`) stay as they are: no negative cup is needed.

### Red-first rows (step A0 is research, the rest only if A0 holds)

- **A0, the measure, before anything else.** Lay 365–369 as the normal road (bank 0, the cup and rims of 365) plus the
  pit lane above. Probe the BUILT road and lane meshes with the same rays as the read (`probe.cjs`: down each station
  normal, 0.5 m across), not the profile. Compare the quarter slopes and the bank in the read's own station frame. That
  frame is what the read measured. The built road's frame is what my measure compared, and it cannot match a centre 9 m
  off the road's line.
  - *Falsifier, registered here:* on 366–368, any quarter slope or the station bank misses by more than 5° (the [T4]
    packet's tolerance), or the probed width misses by more than 2 m. Then the shelf reading is wrong, and class A stays
    unmade with no route.
- **A1:** the [T4] measure (`run.cjs` `measure`) compares a section against built meshes probed this way whenever a pit
  lane lies beside it. That row is red today: it reads the built profile, so a lane is invisible to it. Scratch scripts
  only, no builder change.

### Tier

- The pit-lane route: no builder code, so no tier. A0 and A1 are research.
- If he chooses the two channels instead: prove it (stored data and geometry), and it inherits every (b) consumer below,
  plus the cup's own: `adapter.js:72-85` (`cupProfile`, symmetric by construction), `document.js:410` (the cup joint),
  `document.js:498`, `extend.js:941-942`.

### Consumers (pit-lane route)

`src/doc/pitlane.js:30-61` (keys, ranges, check), `src/geom/pitlane.js:104` (the lane's edge, read per side from the
profile), `src/export/pitlane.js:115` (the exported lane's edge), `app/core/coreshell.js:308-316` (the lane in the shell),
`app/core/coreshell.js:1174-1182` and `src/core/pitflat.js` (Flatten, not needed here). The validator's lane check is
`laneCheck`, in `src/geom/pitlane.js` per its header at `:7`.

### The unwelcome outcome

The shelf is racing surface that cars use, not an apron. A pit lane in the builder is then the wrong kind of road: it has a
pit speed, boxes and its own checks. In that case the shape is right and the meaning is wrong, and only the two-channel
build is honest.

---

## (b) A one-sided width step: [T5] class 1 (E's hand-back §5, §5b)

### What it is (E's, not mine)

From `exo_memory/handback/p-unmakeable-T5-E_2026-11-26.md:145-157`:
- the road widens 3–3.5 m on one side within about 5 m;
- at 3,171 m it goes from 19.1 to 22.6 m in one station;
- 2964–3239 is banked past 100°.

### The slot for E's Grab result: filled, by E, before this plan

From E's §5b (`:174-239`), order 1, 19:44:28Z:
- **72 sideways runs, 0 made, 0 drags refused.**
- The nearest was 2836–2964, Grab centre r 10 m: 12 drags, width 1.11×.
- On 2964–3239 the centre drags took pitch from 2.45× to 1.36× and no further.
- E's reading: "a drag is a bump, zero outside its window", so a step that persists needs a chain of drags, and their
  falloffs add up.
- Not tried there: Bend, Smooth, other drag policies.

This plan takes E's result as it stands.

### A correction I made to my own draft

I first wrote that the lateral channel `l` cannot step a width on road banked past 90°. It moves along the gravity frame's
horizontal (`src/core/adapter.js:707`, `pos += R·l`, with R horizontal), so it would push the road off its own plane.

That is wrong for the Grab. `app/core/zonegrab.js:150-158` and `follow` at `:163-185` solve the rim press "through the
bank": they send `h` and `l` together, keep the far rim fixed, and scale `w`. E checked a rim press at 60° bank
(`:187-189` of E's hand-back). The block is not the frame.

### Why the no-data route still fails: the line kinks

A held one-sided step without new data means a width step plus a held sideways offset of half the step, solved through the
bank as `follow` does. That moves the road's LINE, and the line is what validation, the loads and the water read
(`adapter.js:678-683`: "so validation, the loads and the water read the road as brushed").

inferred, hand arithmetic, with a smoothstep standing in for the spline:
- a 1.75 m centre shift over 4.6 m gives a peak curvature of 6·1.75/4.6² = 0.50 /m (R 2 m);
- at 460 km/h that is 826 g;
- at 100 km/h, 39 g;
- keeping it under 0.002 /m (R 500 m) needs the shift spread over at least √(6·1.75/0.002) ≈ 72 m, not 5.

The real road's driven line does not kink: only its edge steps. So this route would paint red a corner that is not there.
That is the same false-cause shape as Sharp's radius message (my sharp-vs-rate answer).

### The control he would see (the recommended route, B2)

A **right width** beside the width field, in the shape the right edge already has:
- blank follows the width;
- typed, it splits the sides, from the piece's start or from a mark, with "early" like the others.

The width field then means the left side's, as the edge field became the left edge when the right edge came in on
2026-10-12 (`app/core/panel.js:71-72` `SECOND_NAME`: 'left edge' and 'right edge'). The Grab rim press would write the
pressed side's width instead of `w` plus `h` and `l`. That is an option for later, not in this plan.

**Why a right width and not a sideways shift of the section.** A shift moves both halves and the cup's lowest point off the
line. A right width leaves the narrow side exactly as it was and scales the wide side, keeping its rim angle. That is the
step the read shows.

*What would change my mind:* if [T5]'s step turns out to move the cup's bottom with it, a shift is the honest form.

### Stored data: a change, and it is his call

- A new optional channel, `wr`, kept like `er`: `OPTIONAL` gains it (`src/core/document.js:33`), it is written only when
  some control point differs from `w`, and a new schema is written only then.
- That is the core/5 pattern for `er`: `isSplit` and `SCHEMA_SPLIT` at `document.js:516-517`, chosen in `serialize` at `:523`.
- Today `parse` refuses any schema it does not know by name (`:547`). So a file with a split width would be refused by
  name by an older builder, and every file without one stays byte for byte as today.

### Red-first rows (prove it)

1. A piece with `wr` ≠ `w` round-trips through serialize and parse and writes the new schema. A document with no split
   writes today's schema, byte for byte.
2. `parse` at `ceb21f5` refuses that new schema by name. The row is the old builder's refusal, checked once against
   `ceb21f5`.
3. Of the profile of a piece at w 19.1 and wr 22.6, the left extent is 9.55 m and the right 11.3 m. The PATH is identical,
   sample for sample, to the same piece with wr = w. The line does not move.
4. A 3.5 m one-sided step over 5 m adds no load. The validator's `fN_g` along the path (`src/validate/index.js:368-370`)
   is the same with and without the step. That is red today on the no-data route.
5. Extend: a typed right width splits the sides; blank follows; a mark and "early" behave as for the right edge.
6. `checkDoc` refuses `wr` ≤ 0 by name, as `BAD_WIDTH` does for `w`.
7. The export: the exported mesh's right rim is at wr/2 (`src/export/fromwords.js:101`, `:172`, `:421`;
   `src/export/finalscene.js:347`).
8. E's measure (scratch): compare the built edges' midpoint against the read's centre, because the read's centre IS the
   edges' midpoint. Compare the line only where the sides are equal.

*Falsifier, registered here:* E's 2964–3172 and 3172–3239, laid with a right-width step and nothing else changed, still
miss pitch by more than 1.5×. Then the step was not what kinked the read's pitch, and this build does not make [T5]'s class.

### Tier

Prove it: stored data, a schema, geometry, export.

### Consumers, with file:line

**The document.**
- `src/core/document.js:30` CHANNELS, `:33` OPTIONAL, `:51` and `:443` (the edge start s is a share of each half-width, so
  each side's share follows its own width), `:130` (pieceEnd's legacy cup edge from `w`), `:162-173` (endState and
  afterFlight carry it), `:403-412` (jointProblem: one more C1 channel), `:488-500` (checkDoc), `:514` (pieceText),
  `:516-523` (schema), `:537-547` (parse).

**The core.**
- `src/core/extend.js`: the targets, the `first` start on an empty track (`:981-987`), changeLists (`:968`); every place `w`
  is carried.
- `src/core/sharp.js:95` (Sharp's probe carries `w` from the head; it must carry `wr`).
- `src/core/readout.js:255-256` (the readout's cup edge from `w`).
- `src/core/pitflat.js:17` (SHAPE: not a shape channel, so it is left alone).
- `src/core/piece.js`, `close.js`, `continuity.js`, `sculpt.js`, `finish.js`: each names `er` today (9, 1, 1, 1 and 1 sites
  in a grep for `er`), so each is a site to read for `wr`.

**The geometry.**
- `src/core/adapter.js:47`, `:72`, `:96`, `:123` (profileAt, cupProfile, tubeProfile, baseProfileOf: every one builds both
  sides at w/2; this is the one place the split must be made), `:107-121` (edgeFrame already reads `hr` and `hl`
  separately), `:125` (heartlineOf: a tube's roll axis from `w`; a split tube is a question to refuse, not to answer).
- Downstream of the profile, every reader already takes the two extents separately:
  - `src/geom/profile.js:157`, `:161`, `:166`, `:181`, `:254`, `:287`;
  - `src/geom/pitlane.js:104`, `src/core/water.js:58`, `:139-144`;
  - `src/texture/edge.js:28` (reads the total from the profile);
  - `src/markers/place.js:61`.
  inferred, from the grep: these need no change, only a row each that a split section reads right.

**The app.**
- `app/core/panel.js:71-72`, `:173` (FIELD_CHANNEL), `:205` (extendOptions), `:295` (first), `:366` (the fields show the
  head's end), `:385` (a known track's median width).
- `app/core/zonegrab.js:163-185` (the rim press, later).
- `app/core/handles.js` (the brush channels' names).

**The validator.**
- `src/validate/index.js:41-58` ('bank-cup-edge' assumes an edge starts at ≥ 0.5 of the half-width, `:47-48`. With a split,
  that is each side's own half-width.)

### The unwelcome outcome

The step is an artefact of the read, as E's class 2 is (two surfaces, the probe landing on the lower one). Then the build
makes a shape no track has. E found the step with down-rays at 56–60 m as well (`:150` of E's hand-back), which is some
evidence against. Still, a picture of 3,171 m should come before the build.

---

## (c) A cross-section change across a jump: [T4] class B (jumps 0, 2, 3, 4, 5)

### What the code does today

**The format already allows it.**
- A landing is checked against its flight by `landingProblem` (`src/core/document.js:379-388`). That checks kh, kv, h and l
  (a level start) and phi (the flight's bank), and nothing else.
- `checkDoc` runs it in place of `jointProblem` across a flight (`:499-500`: "a LANDING starts at its flight's pose, not C1
  with the take-off: level, at the flight's bank, the rest its own"). So the cup joint (`:410`) and the width's C1 are not
  checked across the air.
- The adapter starts the landing's cross-section afresh (`src/core/adapter.js:570-572`: "nothing morphs across the air").

**Only two builder paths force a start.**
- **Extend after a bare flight** starts at `D.endState(doc)` with `held = true` (`src/core/extend.js:975`). endState puts the
  take-off's end through `afterFlight` (`document.js:162-173`), which resets kh, kv, h, l and phi and carries w, r, c, e, s
  and er. So the landing begins at the take-off's cross-section and ramps to what was typed.
- **The Jump button's 60 m landing** (`src/core/jump.js:50-53` `landingPiece`, `:55-62` `jumpHere`) takes the family's
  default width and rate, and no cup and no edges.

A correction to my [T4] hand-back: it says only the first path. The Jump button does not carry the take-off's cross-section.
It drops it to the family default. Neither path lets the person type the landing's.

### The control he would see (C1, recommended)

When the track ends in a flight, Extend's typed width, cup, edges and edge start are the landing's START, exactly as on an
empty track. Fields left blank carry the take-off's, as today. The ramp then runs from those start values.

The panel already does this on an empty track (`app/core/panel.js:295`, `out.first`; `:46-50`) and the core reads it
(`extend.js:981-987`). The visible change: after a flight, what is typed is what the landing starts at, with no ramp
from the take-off's width.

**C2, only if he lays jumps with the Jump button and keeps its landing.**
- The landing boxes (`app/core/panel.js:1119-1121`, `LD.BOXES`) gain width, cup and the two edges, sent to `landingPiece`.
  Today the landing's pose is set there and nothing else.
- The extend fields cannot serve, because in `jumpHere` they lay the TAKE-OFF piece (`jump.js:59`).
- Without C2, the route is Jump, delete the default landing, then Extend with the typed values (C1).

### Stored data

None, inferred from `landingProblem` and `checkDoc` above. Row C-1 proves it. If C-1 is red, this becomes a format change
and his call.

### Red-first rows (prove it)

- **C-1 (green today, is the claim):** a document with a flight and a landing whose w, c, e, er and s differ from the
  take-off's end round-trips through serialize and parse unchanged, and `checkDoc` passes. Include a take-off that is cup
  and a landing that is not, and the reverse.
- **C-2 (red today):** Extend after a bare flight with width W typed: the landing's w at s = 0 is W. Today it is the
  take-off's.
- **C-3 (red today):** the same for cup, edge, right edge and edge start, each alone; blank fields carry the take-off's.
- **C-4:** after C1, the landing still starts level at the flight's bank (landingProblem passes). The flight's pose and
  the take-off are byte for byte as before.
- **C-5:** `setLanding` (`jump.js:72-87`) moving the flight still moves only the landing's phi. Its cross-section is kept.
- **C-6:** the export across the gap: no mesh bridges the flight (`adapter.js:570` `profile: null`; `src/export/fromwords.js:421`
  filters `kind !== 'gap'`). The landing's first rim is its own width.
- **C-7 (C2 only):** the Jump button with landing width W lays a landing at W; with the boxes blank, the landing is as today.

*Falsifier, registered here:* any of [T4]'s jumps 0, 2, 3, 4 and 5, laid with C1 at the read's landing cross-section, still
misses the landing's width or quarter slopes past the [T4] tolerances. Then the class is not the carried start, and the
[T4] hand-back's class B is wrong about its cause.

### Tier

Prove it: the core's start state, geometry and the landing's stored values.

### Consumers, with file:line

- **The core:** `src/core/extend.js:968` (head0 and changeLists read the head for each channel's start), `:975-987` (from,
  held, the empty-track start), `:1043` (the s clamp); `src/core/document.js:162-173`, `:379-388`, `:499-500`.
- **The jump:** `src/core/jump.js:50-53`, `:55-62`, `:72-87`.
- **The app:** `app/core/panel.js:78` and `:266` (rampStart reads `first` only on an empty track; after a flight it must
  read it too, or the later changes' marks are laid from the wrong start), `:295`, `:545` (the panel sends `empty`; it would
  send "after a flight" too), `:1119-1121` (C2); `app/core/coreshell.js:408` (jumpFor), `:722-724`.
- **The geometry and export:** `src/core/adapter.js:566-572`; `src/geom/profile.js:302-315` (jointSteps measures only
  road-to-road joints, so the gap is skipped); `src/export/fromwords.js:421`.
- **Sharp:** `src/core/sharp.js:95` builds its probe's start from the head. After a flight it would read the take-off's
  values, a site to check.

---

## Order, if he says go

1. (c) C1: no data change, prove it, one pane.
2. (a) A0 and A1: research, scratch only. If A0 holds, (a) is done with no build.
3. (b) only on his word about the new channel and schema. It is the one stored-data change here.

## Corrections, mine

- [T4] hand-back, class A: "falls from the centre at a steady 15°" was the station frame. In world terms that side is level
  (part (a)). The section rows stay as measured. Their cause line is what this corrects.
- [T4] hand-back, class B: only Extend after a bare flight carries the take-off's cross-section. The Jump button's landing
  resets to the family default (part (c)).
- This plan's own draft: "`l` cannot step a width on high bank" was wrong. The Grab solves through the bank
  (`zonegrab.js:150-158`). The real block is the line kink (part (b)).
