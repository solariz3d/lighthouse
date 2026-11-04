# D421 Part 2: Sculpt as its own mode (pane P, Fable; research and design only, nothing built, nothing run)

Written against t180 `local-0.4.9` at `52558e3` (worktree `C:\Users\nname\Downloads\t180-wt-e25`, clean), the packet
`exo_memory/loop/plan_d421_sculpt_mode_2026-10-20.md` Part 2, and the keeper's words of 01:32: "You can sculpt the pieces you
already put down, so its a mode you switch, so the equation track mode, then there will be sculpt or brush whatever, tweaking and
bending the track like say stretching it or manipulating it in many ways, look into 3d modeling i guess to get it to work right".

The one-page summary for the keeper is in the hand-back, `exo_memory/handback/p-d421-sculpt-design-P_2026-10-20.md` §2. This
file is the long form behind it. Every figure here is the changelog's or a test's bar, cited; I measured nothing (Part 2 runs no
tests, and the overnight hold on runs stood when this was written).

## 0. The one sentence

The engine for a Sculpt mode already exists in `src/core/sculpt.js` (a falloff brush on one channel's B-spline control points,
joints kept C1, local by construction) and in the shell's drag (`beginBrush` / `brushTo` / `endBrush`, one drag one undo step).
What is missing is the MODE: a switch, a tool set named by what the hand does instead of by channel, a window that can be the
selection, route tools that re-close a lap on release instead of every frame, and a preview that degrades instead of freezing.
Nothing in the core has to be rewritten; the brush strip and the "sculpt (shape only)" box are what go.

## 1. What exists today, and what is kept, merged or removed

Read: `app/core/panel.js:372-410` (the brush: arm, mode, channel, radius, sharp, the Sculpt box, the pointer drag coalesced to
one `brushTo` a frame), `:412-470` (the handles host: Extend's ghost handles, Sculpt's piece handles), `:553-568` (the brush
strip), `:473-478` (the Sculpt box's handler); `app/core/coreshell.js:355-384` (`brushModes`, `sculptChannels`, `setSculpt`,
`beginSculpt`, `sculptInfo`), `:329-353` (`brushed`, the D335 ratio), `:511-560` (`beginBrush`, `brushTo`, `endBrush`,
`sculptOnce`); `src/core/sculpt.js` whole (184 lines); `app/core/centreline.js` whole (the guard); `app/core/handles.js:1-67`;
`app/core/buildmenu.js` whole; `app/core/keys.js:1-40`; `src/core/README.md:1-120`; `app/preview/coarse.js:1-25`;
`app/test/drag-frame.test.js:1-30`; `app/test/release-frame.test.js:1-12`; `CHANGELOG.md` lines 36 (D404), 269 (D266 item 2),
294 (D244b), 348 (D236), 349 (D235).

| today | what it is | verdict |
|---|---|---|
| `src/core/sculpt.js` `sculpt()` | Δ·f(d/r) added to one channel's control points whose whole support lies in the window; smootherstep falloff (C2); a road-road joint inside the window moved as the document builds it (value, then slope); a joint only half covered left alone; a window narrower than 3 knot spans widened and the widening reported | **KEEP, as the engine of every tool.** This is proportional editing on spline control points with the "surface" distance metric (along the road), which is the right metric for a track (§2.5). |
| `sculpt.js` `brush()` modes `hill` / `swerve` (the `h` / `l` offset channels, E, D186) | a height or sideways bump that leaves the track past the window untouched by construction; the peak scaled so the road moves by the Δ asked | **KEEP: this is the Grab tool** (§3.1). It is offered today as "height / sideways (local)" in the mode select; it is refused inside D244b's Sculpt because the guard counts the offsets as route. |
| `brush()` mode `rate` (`kh`, `kv`) | turn or climb harder from here on; on a CLOSED lap re-closes the whole lap with `close()` on every step | **KEEP the brush, CHANGE when the re-close runs**: never per step (§4). These are Bend and Climb (§3.3, §3.4). |
| `brush()` mode `value` (`phi`, `w`, `r`, `c`, `e`, `s`, `t`, `er`) | the shape channels | **KEEP: Twist, Width, Cup, Edge, Wall rise, Tube sweep** (§3.5). |
| `sharp` (E's opt-in, ruling 2: refine the knots first; may nudge the track outside the brush by up to 0.1 mm) | | **KEEP, folded under "more", off by default, same words.** The declared spill is the reason it is not the default; nothing changes there. |
| the shell's drag: `beginBrush` fixes mode, channel, s0, r on the base document; `brushTo(delta)` applies the WHOLE delta to the base (no accumulated rounding); `endBrush` commits; `D.beginDrag` / `dragTo` / `endDrag` make it one undo step; the D335 ratio so the piece's middle reads the value asked | | **KEEP unchanged.** Every tool below is a `beginBrush` with a tool name resolved to (mode, channel) in the shell, so the mutation harness anchors in `endBrush` (C2) and `panel.js` (V5) stay where they are. |
| `panel.js` pointer drag coalesced: one `brushTo` per animation frame with the latest position, the release applies the last waiting one (D235) | | **KEEP.** Add the wheel during a drag (radius, §3.0) to the same frame. |
| D244b `sculpt` state: Sculpt ON = the brush offers only the shape channels; `beginSculpt` = a value brush centred on the ONE selected piece and as wide as it, so the joints are untouched; the centreline guard at every step (`routeMovedDetail`, cheap, exact) and at the end (`pathMoved`, both paths built, bit for bit); a drag that moved it is dropped whole | | **MERGE into the mode as the SHAPE family's guard** (§3.5). The guard stays exactly as it is for shape tools. It is NOT applied to Grab, Bend, Climb, Stretch or Smooth-on-a-route-channel, because the keeper now asks for bending and stretching in this mode; those tools say in their hint that they move the road after the window. |
| the handles overlay (`app/core/handles.js`): marks on the one selected piece for bank, width, cup; a drag is `beginSculpt` / `sculptTo` / `endSculpt` | | **KEEP, and let the selection be a RUN** (§3.6): the handles stand on the run's middle piece and the window is the run. |
| the brush strip (`panel.js:553-568`): on, mode, what, radius, sharp, sculpt (shape only) | the engineer's view: a mode select ("height / sideways (local)" or "rate (one channel)") and a channel select with the raw channel list | **REMOVE, replaced by the Sculpt strip**: a tool picker named by the hand's action, radius, and "more" (exact size, wall rise, tube sweep). The "on" box, the mode select, the channel select and the Sculpt box go. |
| the Build menu's "Brush" toggle (`buildmenu.js:36`) | | **REMOVE**: the mode switch replaces it (§5). |
| `sculptOn.onchange` (`panel.js:473-478`): clears the ghost, forces mode `rate`, disables the mode select | | **REMOVE with the box**; the mode switch does the same (hide the Extend ghost, §5). |
| `t180-pick` (the preview answers a click with the road's s) | | **KEEP**: the freehand brush (click anywhere on the road) stays beside the handles. |

What is NOT touched: `src/core/document.js` (the joint rule, `beginDrag`), `src/core/close.js`, `src/core/adapter.js`, the export.
The one core addition the design needs is a `stretch(doc, piece, newLength)` (§3.2) and a `smooth(doc, channel, s0, r, strength)`
(§3.7), both in `src/core/sculpt.js`'s style: pure, checked, frozen, untouched pieces the same objects.

## 2. The research (cited; each source fetched by me on 2026-10-20 unless marked "search summary only")

### 2.1 Blender's sculpt brushes (Blender 4.2 LTS manual)

- **Grab** (`https://docs.blender.org/manual/en/4.2/sculpt_paint/sculpting/tools/grab.html`): "only moves the vertices that are
  under the brush radius at the start of the stroke." Options: Grab Active Vertex (full strength on the active vertex, for
  low-poly models), Grab Silhouette (only one side of the curvature). With the falloff shape Projected it "can grab infinitely
  deep into the viewport" and the stroke may start in empty space.
  *For us:* the window fixed at the drag's start is exactly `beginBrush` (s0, r fixed on the base document). That is the right
  semantics for a one-undo-step drag: the thing you grabbed stays the thing you are holding.
- **Snake Hook** (`.../snake_hook.html`): "pulls vertices along with the brush's movement", "to create long, snake-like forms";
  it "picks up and releases geometry during the stroke"; Magnify above 0.5 counteracts the thinning; Deformation: Radius Falloff
  or Elastic (deforms the whole mesh).
  *For us:* not earned. A hook whose window travels with the pointer is Grab with a moving centre; on a lap-distance window it
  would pick up new pieces mid-drag, so one drag would no longer be one base plus one delta, and D335's ratio would change
  under the hand. Stretching the road is a length change, not a hook (§3.2).
- **Smooth** (`.../smooth.html`): "Smooths the positions of the vertices to either polish surfaces or remove volume from larger
  shapes"; Shift from any brush; Deformation Laplacian (default) or Surface (keeps volume); Iterations per step; "the strength
  of the smoothing is relative to the density of the mesh".
  *For us:* earned (§3.7): a Laplacian relax of one channel's control points under the window, joints held. Shift-while-dragging
  as Blender does is not proposed (Shift is the fine-step modifier on our handles, `handles.js` `targetFor`).
- **Elastic Deform** (`.../elastic_deform.html`): Grab, Bi-scale Grab, Tri-scale Grab ("more localized to the center of the
  brush"), Scale ("Displaces vertices away from the active vertex"), Twist ("Vertices are rotated around the active vertex");
  Volume Preservation is a Poisson ratio. (The page does not name Kelvinlets; the 2019 feature is based on them, but I did not
  fetch a source that says so, so it is not claimed here.)
  *For us:* Twist IS our bank channel and Scale IS our width; the bi- and tri-scale falloffs are what a smaller radius gives on a
  one-dimensional window. Nothing new to build; the names "Twist" and "Width" are taken from here.
- **Inflate** (`.../inflate.html`): "vertices are moved in the direction of their own normals"; a Direction setting inflates or
  deflates. **Pinch** (`.../pinch.html`): "Pulls geometry towards the center of the brush", Ctrl magnifies.
  *For us:* Inflate along the normal is a hill (`h`, Grab's up-down); Pinch at the road's edges is the Cup channel (`c`), which
  already turns the edges up. Not separate tools.
- **Falloff** (`https://docs.blender.org/manual/en/4.2/sculpt_paint/brush/falloff.html`): presets Custom, Smooth, Smoother,
  Sphere, Root, Sharp, Linear, Sharper, Inverse Square, Constant ("a sharp edge at the border of the brush"); Falloff Shape
  Sphere or Projected ("the depth along the view is ignored"); Front-Face Falloff.
  *For us:* `sculpt.js` uses one C2 curve, Perlin's smootherstep (ref 10 §1 on the shelf), which is Blender's "Smoother" in
  shape. One curve, no preset menu: a track has one dimension to fall off along, and the radius already sets how wide the
  bump is. Constant (a hard edge) is refused by the joint rule anyway (a joint half covered is left alone).

### 2.2 Blender's proportional editing and curve editing

- **Proportional Editing** (`https://docs.blender.org/manual/en/4.2/editors/3dview/controls/proportional_editing.html`): "The
  farther away an unselected element is, the less it will be affected"; the radius is changed DURING the transform "with
  WheelUp/WheelDown, or PageUp/PageDown"; falloffs Constant, Random, Linear, Sharp, Root, Sphere, Smooth, Inverse Square;
  Connected Only (Alt-O): "the proportional falloff spreads via connected geometry" (one finger without the others); Projected
  from View. The 4.2 page's Object and Edit Mode sections cover meshes; the 2.79 manual's curve-editing introduction says
  proportional editing is also available for transformation actions in curve Edit Mode (search summary only:
  `https://docs.blender.org/manual/en/2.79/modeling/curves/editing/introduction.html`).
  *For us:* two things earned. (1) The wheel changes the radius while the drag is open (§3.0): `brushTo` already re-applies the
  whole delta to the base, so a new r is one more field of the brush state, re-run from the same base. (2) "Connected only" is
  what `sculpt.js` already does at a flight: the C1 link breaks across a jump, so a brush never spreads across the air.
- **Curve control points** (`https://docs.blender.org/manual/en/4.2/modeling/curves/editing/control_points.html`): Tilt (Ctrl-T,
  "how the normals twist around each control point"), Clear Tilt, Set Handle Type, Recalculate Handles, Smooth ("reduces the
  distance between the selected control point(s) and their neighbors"), **Smooth Curve Tilt / Radius / Weight** ("interpolates
  the Tilt value for the selected control points").
  *For us:* a curve's Tilt is our bank; its Radius (Shrink/Fatten) is our width; "Smooth Curve Tilt" is Smooth on the `phi`
  channel. Blender keeps these per-channel smooths as separate operators; we get them as one Smooth tool with the channel
  taken from the tool that was last used (§3.7).

### 2.3 Maya soft selection

- `https://help.autodesk.com/cloudhelp/2023/ENU/Maya-Modeling/files/GUID-7EC09146-E5E8-449E-83D7-BFE7C780C32D.htm`: Falloff Mode
  Volume ("Extends a spherical radius around your selection"), Surface ("a circular region that conforms to the contours of the
  surface"), Global (reaches other meshes), Object; Falloff Radius ("Determines the area of deformation"); Falloff Curve ("Lets
  you modify the shape of the falloff").
- `https://help.autodesk.com/cloudhelp/ENU/MayaCRE-Basics/files/GUID-FF7C8670-97C7-4C13-9A6F-3B0A8F881EC9.htm`: "It works by
  maintaining a falloff from the selected components to the components around your selection"; hold B and drag to resize the
  radius; "The falloff area is represented by a color gradient"; "Soft Selection does not create history nodes".
- `https://download.autodesk.com/global/docs/maya2014/en_US/files/GUID-A52BBAE8-742A-4B74-A87D-6F935DA542C4.htm`: it "works on
  both NURBS surfaces and NURBS curves", to make "smooth slopes or contours without transforming each CV manually".
  *For us:* the Surface mode is ours (distance along the road). The colour gradient is earned (§3.0: the falloff drawn on the
  road as a band that fades). B-drag for the radius is the same need the wheel meets.

### 2.4 Houdini: the Edit SOP and Soft Transform

- Edit SOP (`https://www.sidefx.com/docs/houdini/nodes/sop/edit.html`): "transform or sculpt faces/edges/points on a
  curve/surface interactively"; cumulative, one node stores every edit; Soft Radius = "Distance within which other points/faces
  follow the points/faces you edit directly"; Distance Metric Edge ("following a path along edges"), Surface, Radius ("The 3D
  distance to the closest point in the group"); Soft type Linear, Quadratic ("direct edits affect distant points/faces more than
  with Cubic"), Cubic, Metaball; Tangent Angles shape the cubic; a Sculpt mode with push, pull and smooth brushes.
- Soft Transform (`https://www.sidefx.com/docs/houdini/nodes/sop/softxform.html`): "Moves the selected point, with smooth rolloff
  to surrounding points"; the same metrics and kernels; Visualize Falloff writes a `vis_falloff` attribute (Never / Always /
  When Viewport Tool Is Active).
  *For us:* the metric is the point that matters. A 3D-radius brush on a track catches the OTHER leg of a hairpin and the
  straight that runs beside a return leg; the edge metric (distance along the curve) does not. `sculpt.js` measures along
  lap distance, so it is already the right one; the design keeps it and says why. "Visualize when the tool is active" is the
  same band as Maya's gradient.

### 2.5 Road and track editors that edit a placed path

- Unreal landscape splines (`https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-splines-in-unreal-engine`):
  control points moved with the ordinary transform tools; tangents dragged ("alters how curved the segment of the spline is");
  per point Half-Width, Side Falloff, End Falloff; the terrain "is raised or lowered to fit the spline, with a smooth
  cosine-blended falloff on either side"; Raise / Lower per segment. The falloff is from the road into the ground, not from a
  moved point into its neighbours: dragging a point moves that point only.
- BeamNG road spline tool (`https://documentation.beamng.com/world_editor/tools/road_spline_tool/overview`): nodes dragged with
  the mouse, rib handles "dragged in and out with the mouse to control the width of the road"; undo and redo; no falloff.
- Gran Turismo 6 course maker (search summary only, `https://www.gran-turismo.com/gb/gt6/manual/coursemaker/application03.html`):
  anchor points, a line tool for curved or straight, camber as ONE global setting for every corner.
  *For us:* the road editors I found move one node at a time and put their falloff in the terrain or in nothing. None has a
  soft-selected drag of a placed path. The 3D modelling tools do, and the keeper's instinct ("look into 3d modeling") is the
  right one: the track is a curve with channels, and Blender's curve Edit Mode with proportional editing, Maya's soft select on
  a NURBS curve and Houdini's Edit SOP on a curve are the three worked precedents. Ours differs in one way they do not have to
  care about: our curve is defined by its RATES (turn and climb per metre), so moving a point is not a position edit but a rate
  edit, and everything after it follows. That is why the tools below are sorted into three families.

## 3. The tool set, mapped onto the piece channels

A road piece is one clamped cubic B-spline per channel on one knot vector (`src/core/README.md`): `kh` turn rate, `kv` climb rate,
`phi` bank, `w` width, `r` wall rise, `h` height offset, `l` sideways offset, `c` cup, `e` / `s` / `er` edge, `t` tube sweep;
and `length` per piece. Knots every 20 m (`document.js` `KNOT_M`), so a 10 km lap has about 500 control points per channel.

Three families, by what happens to the road AFTER the window:

- **Shape**: the centreline does not move at all; the D244b guard stays on and refuses by name (`SCULPT_MOVES_CENTRELINE`).
- **Local**: the road inside the window moves; the road after it does not (the offset channels are zero outside the window).
- **Route**: the road after the window moves (a rate or a length changed). On a closed lap the lap is re-closed ON RELEASE
  (§4.3), never per step; a drag that cannot re-close is dropped whole, like a guard refusal, and says so.

Every tool: the hand, the channel, the falloff over the neighbours, the family. `r` is the radius; the window is `[s0 − r, s0 + r]`
along the road, or the selected run (§3.6). All of them are one `beginBrush` with a tool name, one `brushTo` per frame, one `endBrush`:
one undo step.

### 3.0 Common to every tool

- **Where the hand goes.** Two ways in, both existing: click-and-drag on the road itself (the `t180-pick` s becomes s0, the
  radius from the strip), or drag a handle on the selected run (the window is the run). The tool decides what a drag means.
- **The falloff shown.** While a tool is chosen and the pointer is over the road, the band `[s0 − r, s0 + r]` is tinted on the road,
  full at the centre fading to nothing at the edge (Maya's gradient, Houdini's visualise-when-active). While a drag is open the
  band is fixed where the drag began. Cheap: a per-sample weight on the selection layer's existing highlight.
- **The radius during a drag.** The wheel (Blender's wheel / Page Up-Down) widens or narrows r by one knot span a notch; the
  brush is re-run from the same base with the new r (the whole-delta rule makes this free of accumulation). `[` and `]` do the
  same from the keyboard.
- **Modifiers**, as the handles have them today (`handles.js`): Shift fine, Ctrl snap to round numbers, double-click a handle
  resets a zero-rested channel to 0.
- **What is said.** The strip shows the tool's one-line hint and, during a drag, the value at the centre and the widening note
  when the window was widened (ruling 2's "always shown"). A route tool's hint ends "moves the road after it".

### 3.1 Grab (Local): the hand moves the road up / down or left / right under a falloff

- Channels: `h` (up / down) and `l` (sideways), `brush()` modes `hill` and `swerve`, which exist (E, D186).
- The hand: drag up or down on the road to lift or sink it; hold the sideways key (or drag the sideways handle) to move it
  left or right. The peak lands where the pointer is (the ratio rule scales the bump so the road moves by the Δ asked).
- Falloff: smootherstep over `[s0 − r, s0 + r]`, over as many pieces as the window covers; a joint inside the window is moved
  as the document builds it; the first and last two control points of the window's outer pieces are untouched, so the road
  outside is bit for bit what it was (`sculpt.js` "Local by construction").
- Why this is not Climb: a hill through the climb rate lengthens the road and moves everything after it back (measured in
  D186: 22 cm for a 5 m hill over r = 100 m). Grab is the hill that stays put.
- Guard: the D244b guard would refuse it (`offsets` kind). In the new mode Grab is a Local tool and is not guarded; the hint
  says "the road after the window stays where it is".

### 3.2 Stretch (Route): the piece gets longer or shorter

- Channel: none; the piece's `length`, and its knot vector with it (`evenKnots(L)` spreads the interior knots at fractions of
  L, so the same control points on a longer piece keep the same SHAPE per metre).
- The hand: the length handle at the selected piece's far end (it exists on the Extend ghost today, `handles.js` `length`,
  dragged forward to lengthen); or a drag along the road with the Stretch tool. Everything after the piece slides along with
  its end.
- The two readings, and the default. Rates are per metre, so a stretched piece with the same `kh` control points turns MORE
  (a 90° corner over 100 m becomes 135° over 150 m). Default: **keep the bend**: `kh` and `kv` control points scaled by L0 / L1
  so the corner's total turn and climb are what they were and the piece is simply longer; Alt keeps the rates instead
  (a tighter track). The other channels are values, not rates, and need no scaling.
- The seams: the end slope of each channel is 3(P1 − P0) / h with h the first knot span (ref 03 §1), which changes with L, so
  the NEXT piece's second control point must be re-derived from the new end slope exactly as `sculpt.js` does at a joint
  (value, then slope), or `checkDoc` refuses the document. That is the one new piece of core: `stretch(doc, i, L1)`, which
  rescales, re-derives the following joint, quantises, checks.
- A closed lap: re-close on release (§4.3). A stretch of the LAST piece of an open track is the same thing the Extend length
  handle does today on the ghost, now on a placed piece.
- No falloff over neighbours (the piece is the unit). A run selected: every piece in the run scaled by the same factor.

### 3.3 Bend (Route): more or less turn under a falloff

- Channel: `kh`, `brush()` mode `rate`. The hand: drag left or right on the road; the road turns harder (or straighter) at the
  centre, fading to the window's edge, and everything after swings with it.
- Falloff: as Grab. Joints inside the window moved value-then-slope; the lap's heading past the window changes by ∫Δkh ds.
- On a closed lap: today every step re-closes the whole lap (`brush()` calls `close()` with the window protected); that is the
  seconds-class step the plan names (`panel.js:398`, D235). New: during the drag the lap is shown OPEN with the tail swinging
  and the gap drawn; on release the window close (§4.3).
- Corner mode: the handles today read turn as a corner's degrees (D331); Bend with a run selected is the same number: the run's
  total turn, dragged, with the change spread under the falloff.

### 3.4 Climb (Route): more or less climb under a falloff

- Channel: `kv`, as Bend, vertical. Hint: "tilts the road here; everything after goes up or down with it. For a hill that stays
  put, use Grab." The crest limit (`level.js`, the validator's lift-off at 970 km/h) is the validator's, not the brush's; the
  readout shows it red as it does today.

### 3.5 Twist, Width, Cup, Edge, Wall rise, Tube sweep (Shape)

- Channels: `phi` (Twist: the bank), `w` (Width), `c` (Cup), `e` / `er` / `s` (Edge angle, right edge, edge start), `r` (Wall
  rise), `t` (Tube sweep); `brush()` mode `value`. The hands are today's Sculpt handles (bank on both edges, width on both
  edges, cup) plus the brush on the road for the rest. Twist keeps D259 (within one turn, sign kept) and D335 (lands on the
  value asked).
- Guard: the D244b centreline guard, unchanged, every step and at the end. The known refusal stays: a closed tube past 300° of
  sweep turns about its own heartline (width / 2π), so its width, bank and sweep feed the route and are refused by name with
  `plainWhy`'s sentence. (Design choice for the keeper: those three could instead be offered as ROUTE tools on such a tube, with
  the release re-close; I propose not, because the tube's roll axis moving is not what "twist" means to the hand.)
- Wall rise and Tube sweep are under "more" in the strip: used less, and the sweep has a cap (`TUBE_MAX` 360).
- Not earned as separate tools: Inflate (a hill), Pinch (the cup), Elastic Scale (the width), Elastic Twist (the bank).

### 3.6 The window: a radius on the road, or the selected run

- Freehand: `t180-pick` gives s0; r from the strip; the window `[s0 − r, s0 + r]` crosses joints and pieces freely (never a
  flight: the C1 link breaks there, `sculpt.js`, which is Blender's "connected only" for free).
- A run selected (the D240 selection, `selectPiece` with `from..to`): the window is the run, centred on its middle, r = half its
  length, and the handles stand on the middle piece. This generalises `beginSculpt` (today ONE piece) to a run; `sculptInfo`
  gains `from`, `to`. On a closed lap a run across the start line is the selection's `longWay` rule, as for delete.
- Both windows go through the same `sculpt()`, so a run is exactly a freehand brush of that size with its centre on the run's
  middle; the ratio (D335) is read at the middle as today.

### 3.7 Smooth (Shape on a shape channel; Local on h / l; Route on kh / kv)

- What it does: a Laplacian relax of ONE channel's control points under the window, cᵢ ← cᵢ + λ·f(dᵢ)·((cᵢ₋₁ + cᵢ₊₁) / 2 − cᵢ),
  λ from the drag's length (so a longer drag smooths more, as Blender's strength and iterations do), f the same falloff, the
  window's outer four control points held so the joints and the road outside are untouched, joints inside moved value-then-slope.
  Pure, O(window), one pass per step from the base (the whole-delta rule: λ is the delta).
- The channel: the one of the tool used last (Bend → smooth the turn, Twist → smooth the bank, Grab → smooth the hill), shown
  in the strip and changeable there. Blender keeps these as separate operators (Smooth, Smooth Curve Tilt, Smooth Curve
  Radius); one tool with a remembered channel is the same thing with fewer buttons.
- Why it is earned: every other tool adds a bump; nothing today takes one out except Undo. A wobble left by three overlapping
  Bends has no cure.
- Family follows the channel: on `kh` / `kv` it moves the road after the window (Route, release re-close); on `h` / `l` Local;
  on the shape channels guarded. The hint changes with the channel.

### 3.8 Not proposed, with the reason

- Snake Hook (§2.1): a travelling window breaks one-base-one-delta.
- Falloff presets: one C2 curve; the radius is the knob.
- A 3D-radius brush: catches the far leg of a hairpin (§2.4).
- Grab Silhouette, Projected falloff, Front-Face Falloff: mesh-sculpting concerns; a track has one axis to fall off along.
- Random falloff (Blender): a track is not a terrain.

## 4. Performance: the budget, the costs known, and how it degrades

### 4.1 The bar

One step fits one frame of the display: 6.9 ms at 144 Hz, 6.0 ms at the keeper's 165 Hz (`app/test/drag-frame.test.js`
`BUDGET = 6.0`, the librarian's ruling of 2026-10-19, D404). The release is also bounded: nothing a pointer-up causes may take
more than 6.0 ms at 1,000 m, and past the ordinary range (20 km) nothing may take more than 120 ms and the exact road must be
whole within 10 s (`app/test/release-frame.test.js` rows 1 and 2, D407). At 20 km a drag may adapt but must keep at least 20
rebuilds a second (drag-frame row 4). These are the rows a Sculpt step inherits, with the same tests' machinery (headless Chrome,
muted, frames uncapped, every look).

### 4.2 What a step costs today, as recorded (node, the keeper's saved tracks; nothing re-measured here)

| piece of the step | where | cost recorded | source |
|---|---|---|---|
| `sculpt()` on the control points | `src/core/sculpt.js` | not measured separately; O(window) plus `pieceOffsets` and `checkDoc`, both O(pieces); the D186 hand-back's ratio run is a second `sculpt()` per drag, cached per base | inferred from the code |
| `toSegments` of the whole document | `src/core/adapter.js` | "about 78 ms" on a long tube before the cache; the per-piece cache (`segCache`, 2026-10-14) returns unchanged pieces' segments, so the cost is now ∝ pieces changed | `CHANGELOG.md:349`, `adapter.js:4-9` |
| the mesh, closed cup oval, one drag step | preview | 606 → 122 ms (D236) | `CHANGELOG.md:348` |
| the mesh, closed tube oval, one drag step | preview | 2,635 → 872 ms (D235) → 389 ms (D236); its validation 254 ms stays full | `CHANGELOG.md:348-349` |
| the release to full detail, closed tube oval | preview | 2,274 → 360 ms (D236) | `CHANGELOG.md:348` |
| a rate brush on a CLOSED lap: `close()` every step | `sculpt.js` `brush()` → `close.js` | Gauss-Newton, up to 30 iterations, a dense Jacobian over every free control point of the lap; "a closed tube's brush step takes seconds" | `close.js:238-275`, `panel.js:398` (D235) |
| the Extend ghost during a handle drag, 1,000 / 2,000 / 5,000 / 20,000 m | preview | p95 3.5-4 / 4-5 / 5 / 8 ms after D404 (was 20 / 40 / - / 600) | `CHANGELOG.md:36` |
| letting go of a handle, 1,000 / 5,000 / 20,000 m | preview | 60 / 280 / 1,058 ms in the handler before D407; now nothing over 6.0 ms at 1 km and 120 ms at 20 km | `release-frame.test.js:1-12` |
| the guard's end check `pathMoved` | `centreline.js` | `buildPath` at 2 m: 5,000 samples on a 10 km lap, then a bit-for-bit compare; not measured | inferred |

So on a closed tube today the step itself is some 60 times the budget even after D235 and D236, and a Bend or Climb on a closed
lap carries a full-lap `close()` in it. The bar cannot be met by making the step faster; it is met by not doing the step's heavy
part inside the frame.

### 4.3 The degrade ladder (the D404 and D407 pattern, applied to a placed stretch of road)

1. **The core step stays in the frame; the mesh does not.** Per frame: `sculpt()` (or `stretch`, `smooth`), the cheap guard,
   `toSegments` of the CHANGED pieces only (the cache gives the rest), and a CHORD GHOST of the window: the brushed pieces drawn
   from a few dozen chords and stations, as D404 draws the Extend ghost ("cut into a few dozen steps and path stations however
   long the piece is, never turning more than about 1.7 degrees in one step"). The placed mesh of the window's pieces is hidden
   under the ghost for the drag; every other piece's mesh is untouched. D404's figures for that ghost are the budget's evidence:
   3.5-8 ms from 1 km to 20 km of piece. A window is at most a few pieces, so a window's ghost is in that range or under it.
2. **A Route tool on an OPEN lap:** the road after the window moves as a rigid body (its route fields are unchanged; only its
   start pose changes), so the tail's mesh is re-PLACED, not rebuilt, as `reuseMesh` already places a piece "when its segment is
   the one it was meshed from" (D236). One matrix per tail piece per frame.
3. **A Route tool on a CLOSED lap:** during the drag the lap is drawn open, the tail swung by the rigid move of step 2 and the
   gap drawn as a line from the end to the start; nothing is closed per frame. On release, the window close (`close(doc,
   { window })`, D242: only the window's pieces may move, every other piece bit-identical) runs in the close worker that Close's
   preview already uses (`closerunner.js` / `closeworker.js`, D339), with the open lap on show meanwhile and the result landing
   in a later frame; refused by name (`CLOSE_WINDOW`) → fall back once to the whole-lap close with the window protected
   (today's rate-brush rule); refused again → the drag is DROPPED whole and the message says so. The pointer-up handler itself
   starts the job and returns (release-frame row 1).
4. **The release is the exact road, arriving later:** the exact segments and mesh (with `reuseMesh` for a closed lap), the end
   guard (`pathMoved`) and the readout run in the frames after the pointer-up, the coarse road on show until then and never a
   blink (release-frame row 3). The exact mesh of a big closed tube is the 360 ms of D236; it may take several frames or go to
   a worker; it never runs in the handler.
5. **Past the ordinary range** (a 20 km lap, a huge tube): the chord ghost thins further and the drag keeps at least 20 rebuilds
   a second, as drag-frame row 4 lets the Extend drag do.
6. **Never:** `close()` per step; the overlap check during a drag (it has its own worker and is for previews); a full `toSegments`
   per step.

### 4.4 The rows the build owes (named now so they can be red first)

`app/test/sculpt-frame.test.js`, drag-frame's machinery: (1) Twist on a 1-piece window of a 12-piece track, p95 work frame
≤ 6.0 ms in every look; (2) Grab, r = 200 m across three pieces of a 10 km open lap, p95 ≤ 6.0 ms; (3) Bend on a 10 km CLOSED
lap: p95 ≤ 6.0 ms during the drag (lap drawn open) and the release's handler ≤ 6.0 ms, the re-closed exact road whole within
10 s; (4) Twist on a closed tube (the oval): p95 ≤ 6.0 ms during the drag, the exact mesh whole within 10 s, no frame over
120 ms; (5) the release is the exact road: after letting go, the stations are every 2 m again and the document equals the one a
`sculptOnce` of the same delta gives, bit for bit; (6) Stretch: the next piece's joint stays C1 (`checkDoc` passes) and the
lap's length changes by exactly the stretch.

## 5. The mode switch

- **Where:** a two-way switch, **Build | Sculpt**, in the top bar at the left of the menus (the bar is 44 px with 10-28 px to
  spare above 900 px wide, `app/index.html:131-138`; a 2-word segmented control fits where "TRACK BUILDER" folds away under
  1320). Fallback if it does not fit: the first item of the Build menu, "Sculpt mode", checked.
- **Keys:** Tab toggles the mode (Blender's Tab), with the focus not in a text field (`keys.js`'s `inText` rule); Esc drops an open
  drag (the base restored, as the guard's refusal does); `[` and `]` the radius; digits 1-9 pick the tool in Sculpt (1 Grab,
  2 Stretch, 3 Bend, 4 Climb, 5 Twist, 6 Width, 7 Cup, 8 Edge, 9 Smooth). Letters are not used: "Letters without Ctrl belong to
  the panels (the cameras use them)" (`keys.js:9`). Ctrl+Z / Ctrl+Y as today.
- **In Sculpt:** the banner row shows the Sculpt strip (tool, radius, the hint, "more ▾": exact size (sharp), wall rise, tube
  sweep, the channel for Smooth); the Extend ghost and its handles are hidden (`ghostModel` already returns null while
  `st.sculpt`); the left column shows the selected run's values read-only, Undo / Redo, and the readout; the Build menu's
  commands that place or close (Straight, Level, To floor, Turn by, Turn to grid, Sharp corner, Jump, Close the loop) are
  disabled with their reason "in Sculpt"; Pieces ▾ save and insert stay (a sculpted run is worth saving).
- **In Build:** the Sculpt strip is hidden; a Sculpt drag cannot be open (switching mid-drag is refused as `setSculpt` refuses it
  today, "finish the brush drag first"); the selection is kept across the switch (it is a document selection, not a mode's).
- **What the switch is in the shell:** `st.sculpt` as today, set by the switch instead of the box; `beginBrush` takes a `tool`
  and resolves it to (mode, channel, family); the guard applies by family.

## 6. Open calls for the keeper (each has a default in the summary)

1. Stretch keeps the bend (default) or the rate (Alt).
2. A route tool on a closed lap that cannot re-close: drop the drag (default) or leave the lap open as the rate brush does today.
3. The three closed-tube channels past 300° (width, bank, sweep): refused as today (default) or offered as route tools.
4. The switch in the bar (default) or as the first Build menu item.

## 7. What I did not do, and what is inferred

- Ran nothing: no test, no browser, no node. Every number above is the changelog's, a test header's, or a source code comment's,
  cited by path and line. The cost of `sculpt()`, `pieceOffsets`, `checkDoc` and `pathMoved` on a 10 km lap is inferred from the
  code and marked so; C's Part 1 measurement will put numbers on the freeze.
- Did not enumerate the camera's letter keys; the key proposal avoids letters because `keys.js:9` says they are taken.
- Did not read `app/preview/trackmodel.js` (`ghostFor`, `reuseMesh`'s caller) line by line; the ladder's steps 1-2 lean on the
  changelog's description of D404 and D236 and on `coarse.js:1-25`.
- The Blender 2.79 curve-editing sentence and the GT6 page are search summaries, not pages I fetched; marked so above.
