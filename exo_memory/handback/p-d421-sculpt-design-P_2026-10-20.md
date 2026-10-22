pane P (Fable)

# D421 Part 2: the Sculpt mode design (research and plan only; no code, nothing run)

Packet: `exo_memory/loop/plan_d421_sculpt_mode_2026-10-20.md` Part 2 (:36 on), the chair's dispatch of 07:33Z. Read against
t180 `local-0.4.9` at `52558e3` (worktree `C:\Users\nname\Downloads\t180-wt-e25`, clean; checked: `git -C … log -1`,
`git -C … status --short` empty). The long form, with every citation, is `exo_memory/loop/design_d421_sculpt_P_2026-10-20.md`.
This file is the status, the one-page summary for the keeper (§2), the checked/inferred ledger, and what was not done.

## 0. Status

- 07:3x Z. Dispatch read; the plan read whole; the brush, Sculpt, handles, guard, strip, Build menu, keys, core README,
  `sculpt.js`, `close.js` header, `coarse.js` header, the two frame tests' headers and the changelog's D235/D236/D244b/D266/D404
  entries read (the paths and lines are in the design §1).
- 07:5x-08:2x Z. Research fetched: Blender 4.2 manual (Grab, Snake Hook, Smooth, Elastic Deform, Inflate, Pinch, brush Falloff,
  Proportional Editing, curve Control Points), Maya (soft select options, basics, NURBS), Houdini (Edit SOP, Soft Transform),
  Unreal landscape splines, BeamNG road spline tool; GT6 course maker and Blender 2.79's curve-editing note from search
  summaries only (marked so in the design).
- 08:3x Z. Design written (`exo_memory/loop/design_d421_sculpt_P_2026-10-20.md`, 7 sections), this hand-back, the map line, the ring.
- Nothing was run: no test, no browser, no node, no `claude -p`. The overnight hold on runs (the chair, 06:11Z) was respected
  as well as the packet's "Part 2 runs no tests"; the only processes were git log/status, grep, sed and the web fetches.

## 1. The three answers in short (the long form is the design file)

1. **Kept, merged, removed.** Kept: `src/core/sculpt.js` (the falloff brush on control points, C1 joints kept, local by
   construction) as the engine of every tool; the shell's drag (`beginBrush` / `brushTo` whole-delta / `endBrush`, one undo step,
   the D335 ratio); the one-brush-step-per-frame coalescing; the handles overlay; E's "sharp" as an advanced option with its
   declared spill; the D244b centreline guard for the SHAPE tools. Merged: D244b's "sculpt (shape only)" box becomes the mode
   itself. Removed: the brush strip's on / mode / channel selects, the Build menu's "Brush" toggle, the Sculpt box. One new
   core function each for Stretch and Smooth, in `sculpt.js`'s style.
2. **The tool set** (design §3): Grab (the `h` / `l` offsets: the road moves inside the window, nothing after it), Stretch
   (length, keeping the bend by default), Bend (`kh`), Climb (`kv`), Twist (`phi`), Width (`w`), Cup (`c`), Edge (`e`, `er`, `s`),
   Wall rise (`r`), Tube sweep (`t`), Smooth (a Laplacian relax of one channel under the window). Sorted into three families
   by what happens AFTER the window: Shape (guarded, centreline untouched), Local (Grab), Route (Bend, Climb, Stretch: the road
   after moves; a closed lap re-closes on release, never per frame). Not earned: Snake Hook, falloff presets, a 3D-radius brush.
3. **The bar** (design §4): one step = `sculpt()` + the changed pieces' segments + a chord ghost of the window, the D404 way
   (3.5-8 ms recorded for a 1-20 km ghost); the tail re-placed, not rebuilt (D236's `reuseMesh`); on a closed lap the drag shows
   the lap open and the window close runs on release in the existing close worker; the exact road arrives in later frames
   (D407's pattern). Today's recorded closed-tube step (389 ms, D236) is some 60 times the 6.0 ms budget, so the bar is met
   by moving the heavy part out of the frame, not by making it faster. Six test rows named for the build (design §4.4).

## 2. The one page for the keeper

**What it is.** Two modes, and you switch between them.

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │ [ BUILD | SCULPT ]   File ▾  Build ▾  Track ▾  Settings ▾  View ▾  Pieces ▾ │
   ├────────────────────────────────────────────────────────────────────────┤
   │ Sculpt:  (1)Grab (2)Stretch (3)Bend (4)Climb (5)Twist (6)Width (7)Cup   │
   │          (8)Edge (9)Smooth      radius [ 60 m ] [ ] ]      more ▾       │
   │          "Bend: more or less turn here. Moves the road after it."       │
   └────────────────────────────────────────────────────────────────────────┘
```

- **Build** is today's equation mode: Extend, Straight, Jump, Close, the fields, the ghost with its handles. Nothing changes.
- **Sculpt** is for the pieces already put down. Click a tool (or press its number), set a radius, then either drag on the
  road where you want it, or click a piece (or a run of pieces) and drag its handles. One drag is one Undo.
- **Tab** switches. In Sculpt the Extend ghost is hidden and the placing commands are greyed; Undo, Redo, the readout and the
  saved pieces stay. In Build the Sculpt strip is hidden.

**The falloff.** Every tool works inside a window on the road: full in the middle, fading to nothing at the edge, over as
many pieces as the radius covers. It is drawn on the road as a tinted band while you hover and while you drag. The wheel
(or `[` `]`) makes the window wider or narrower, even in the middle of a drag.

```
          strength
          ▲
        1 │      ▄▄▀▀▀▀▀▀▀▄▄
          │   ▄▀             ▀▄
        0 │▄▀─────────┼─────────▀▄──────────▶ along the road
             s0 − r   s0   s0 + r
```

**The tools, by what the hand does.** The joints between pieces stay smooth in every tool (that is the rule the core already
enforces), and nothing crosses a jump.

```
  GRAB    drag up/down or sideways          road:   ───────╭───╮───────────
          the road lifts or swerves under                  │   │   the road AFTER
          the band; the road after it stays        ──────╯   ╰──────────────  stays put
          exactly where it was

  STRETCH drag the end mark along the road  before: ──┤ piece ├──┤ next ├──
          the piece gets longer or shorter; after:  ──┤  piece   ├──┤ next ├──   (everything after slides along;
          the corner keeps its angle (Alt:                                       the corner's angle is kept)
          keeps its tightness instead)

  BEND    drag left/right on the road       before: ────────────────────
          more or less turn under the band; after:  ─────────╮
          everything after swings with it                     ╰───────── (swung)

  CLIMB   drag up/down                      before: ────────────────────
          more or less climb under the band; after: ──────────╱────────── (tilted up; the road after rises)
          for a bump that stays put, Grab

  TWIST   drag the edge marks up/down       section: ─────  →  ╱─────   (the bank, fading out over the band)
  WIDTH   drag the edge marks out/in        section: ──────  →  ─────────
  CUP     drag the edge marks               section: ──────  →  ╰────╯
  EDGE    the edge angle and where it starts (both sides)
  SMOOTH  drag along a wobbly stretch       before: ─╮╭╮╭─   after: ──────   (takes the bumps out of the last
          the band's values are relaxed                                      tool's channel; longer drag = smoother)
  more ▾  wall rise, tube sweep, "exact size" (acts at exactly the radius set; may nudge the road outside by ≤ 0.1 mm)
```

**What moves and what does not (three kinds of tool).**
- *Shape* (Twist, Width, Cup, Edge, wall rise, tube sweep): the line of the road does not move at all; the guard that checks
  this today stays and refuses by name if it ever would (a closed tube past 300° is the known case).
- *Local* (Grab): the road inside the band moves; the road after the band does not.
- *Route* (Stretch, Bend, Climb, and Smooth on turn or climb): the road after the band moves with it; the hint says so.
  On a closed lap the lap is drawn open while you drag and closed again when you let go, by moving only the band's pieces;
  if it cannot close, the drag is dropped and the message says why.

**Smooth at the refresh rate, never a freeze.** While you drag, the band is drawn as a light copy (a few dozen chords, the way
a long handle drag is drawn since D404) and the road after it is just moved, not rebuilt; nothing heavy runs in a frame.
When you let go, the exact road is built in the frames after, with the light copy on show until it arrives, and on a closed lap
the re-close runs in the background worker Close already uses. Past 20 km the drag thins further but never stops answering.

**Four calls for you** (the defaults are built unless you say otherwise): (1) Stretch keeps the corner's angle, Alt keeps the
tightness; (2) a route drag that cannot re-close is dropped, not left open; (3) a closed tube past 300° keeps today's refusal
for width, bank and sweep; (4) the switch sits in the top bar at the left, or as the first Build menu item if it does not fit.

## 3. Checked and inferred

- checked: `git -C C:\Users\nname\Downloads\t180-wt-e25 log -1 --format='%h %s'` → `52558e3 local-0.4.9: merge D416 …`; `status --short` → empty.
- checked: `app/core/coreshell.js:140` → `brushFn = typeof SC.brush === 'function' ? SC.brush : null`, and `sculpt.js:184` exports `brush`; `:359` `brushModes` offers `local` when `brushFn` is set → the height / sideways (Grab) brush is in the build today.
- checked: `src/core/document.js:31` → `CHANNELS` includes `h` and `l`; `:61` `KNOT_M = 20`.
- checked: `coreshell.js:521` → in Sculpt, `mode !== 'rate'` is refused (`SCULPT_CHANNEL`), so Grab is refused inside D244b's Sculpt today; `centreline.js:33` → a changed `h` / `l` is the `offsets` kind.
- checked: `sculpt.js:170-173` → a rate brush on a closed document calls `close()` on every `brush()`; `close.js:253,275` → up to 30 iterations.
- checked: `app/test/drag-frame.test.js:27` → `BUDGET = 6.0`; `:10-14` → rows 1-5; `release-frame.test.js:8-11` → rows 1-4.
- checked: `CHANGELOG.md:36, 269, 294, 348, 349` → the figures quoted in design §4.2 (3.5-8 ms; 510 → 95 ms; 606 → 122 ms; 2,635 → 872 → 389 ms; 2,274 → 360 ms; "about 78 ms").
- checked: `app/core/keys.js:9` → "Letters without Ctrl belong to the panels (the cameras use them)".
- checked: `app/core/buildmenu.js:36` → `{ label: 'Brush', checked: b.brushOn, toggle: b.toggleBrush }`.
- checked: the 15 web sources listed in design §2, fetched 2026-10-20 (two marked search-summary-only).
- inferred: the cost of `sculpt()`, `pieceOffsets`, `checkDoc` and `pathMoved` on a 10 km lap (from the code's loops; not measured; design §4.2 marks each).
- inferred: that a window's chord ghost costs no more than D404's Extend ghost of the same length (the same drawing; the window is at most a few pieces).
- inferred: that the tail of an open lap can be re-placed as a rigid body (its route fields are unchanged by a Route tool; `reuseMesh` places a piece whose segment is unchanged, `CHANGELOG.md:348`); I did not read `trackmodel.js` to confirm the placement path is exposed for that use.

## 4. Not done / limits

- Nothing measured, nothing built, no test written: the packet's Part 2 is research and plan; C's Part 1 measures the freeze.
- The camera's letter keys were not enumerated; the key proposal avoids letters for that reason.
- `app/preview/trackmodel.js` not read line by line (above).
- The design's §4.4 names six test rows; they are owed by whoever builds, red first.
- The deliverable the plan names, `exo_memory/loop/design_d421_sculpt_P_<date>.md`, is written; the one-page summary is here
  (§2) rather than a third file, so the keeper reads one hand-back.

## Corrections

- none yet.

SOURCES: exo_memory/loop/plan_d421_sculpt_mode_2026-10-20.md · C:\Users\nname\Downloads\t180-wt-e25 (app/core/panel.js, coreshell.js, centreline.js, handles.js, buildmenu.js, keys.js; src/core/sculpt.js, document.js, close.js, extend.js, piece.js, adapter.js, README.md; app/preview/coarse.js; app/test/drag-frame.test.js, release-frame.test.js; CHANGELOG.md; app/index.html) · the 15 web pages in design §2 · exo_memory/loop/design_d421_sculpt_P_2026-10-20.md
NEXT: librarian reads the design and this summary, and routes §2 to the keeper for the feel; the build is split across panes by the librarian when the keeper has approved, and C's Part 1 lands first whatever the answer.
