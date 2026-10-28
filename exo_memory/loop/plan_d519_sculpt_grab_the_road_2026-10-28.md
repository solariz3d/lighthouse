# D519: Sculpt, grab the road itself. Librarian, 2026-10-28 11:2x

The keeper, 11:14, after trying Sculpt on the installed 0.4.27 line: "it does work as intended, but i dont think intended was what I meant, the features are good, but i want to be able to grab the track from points on sculpt that directly let you manipulate the track, from the cupping, the edges of one side, everything. Sort of like manipulating a real 3D object in other programs."

His two answers to the librarian's questions (11:2x, AskUserQuestion):
- a grab in the MIDDLE of the road **bulges it locally** (the offset channels; nothing downstream moves), not a re-route;
- grab points: **both**: handles at the road's control points on the selected run, AND grab anywhere on the surface with the radius as the softness.

## What exists (checked at t180 origin/main ff1d624)

- Sculpt is a MODE with TOOLS chosen first (keys 1-9), then a press on the road and a drag: `app/core/panel.js:385-400` (D421 part 3; TOOLS: grab = height with Alt sideways, stretch = length, bend = kh, climb = kv, twist = phi, …). The brush is `src/core/sculpt.js` (D185: one channel over a window, smootherstep falloff, on the B-spline control points); the shell's `beginSculpt({ channel, piece, sharp, tool, keepRate, from, to })`, `sculptTo(delta)`, `endSculpt()`, `sculptInfo()` (`app/core/coreshell.js:550-588`).
- The channels a piece carries: `kh kv phi w r h l c e s t er` (`src/core/document.js:31`): bank, width, wall rise, height offset h, sideways offset l, cup c, edge angle e, right edge er, edge start s, tube t. The offsets h and l move the surface WITHOUT re-routing the line (document.js:30, "VALUE channels the adapter applies after it"): that is the keeper's local bulge, and Sculpt's Grab already drives them (`brush-grab` height, `brush-side` sideways, `handles.js:97-100`).
- Every brush channel has its name, unit and colour in one table: `app/core/handles.js:78-92` BRUSH_CHANNELS (D425 part 4, P's design `exo_memory/handback/p-d425-sculpt-cues-P_2026-10-21.md` §1-§5: the five cues, the band, the glyph, the strip's value line).
- Control points: one knot span per ≤ 20 m (`document.js:61` KNOT_M, `:80` evenKnots), so a 5,000 m piece has about 250 control points per channel. The dots must be thinned.
- The pick: `t180-pick` (labels.js:137, panel.js:469) answers the station under the pointer. Whether it also gives the ACROSS-road offset of the hit is for Part 1 to check (`app/preview/preview.js`, the handler of 't180-pick'); if not, the layer derives it from the segment's L vector and the hit point.

So the gap is not a missing capability. Every channel the keeper wants to grab is already brushable. The gap is: (1) the TOOL step: today the user picks what will change before touching the road; he wants the place he touches to decide; (2) nothing on the road to grab: no dots.

## The design to settle (Part 1), the librarian's starting proposal

**Zones.** At the picked station, the across-road position u of the hit, in halves of the road's width (0 the centre, ±1 the edges, + the left):
- |u| ≥ 0.85, the EDGE band: the touched side's edge. Drag up/down = that side's edge angle (`e` on the left, `er` on the right); drag out/in across the road = width `w` (both marks move, as Build's do). Alt = bank `phi` (one edge up, the other down).
- 0.4 ≤ |u| < 0.85, the CUP zone: drag up/down = cup `c`.
- |u| < 0.4, the CENTRE: drag up/down = height (`brush-grab`); Alt = sideways (`brush-side`). Never a re-route (bend, climb, stretch stay as tools on their keys).
- The band widths and the Alt pairings are Part 1's to change; the rule is that the thing under the cursor names the channel, and the strip's value line says it before the press (hover), as D425's cues do.

**Dots.** On the selected run (D421 part 3, `sculptModel` panel.js:547): three rows of hollow marks, left edge, centre, right edge, in the channel's colour, at control-point stations thinned to about one per 100 m (and never more than N per screen; Part 1 picks N), each hoverable (name + value as Build's) and draggable: a dot drag is the same brush with s0 at the dot and the current radius, so a dot is a visible handle onto the same change, not a second mechanism. Dots never hit-test over the brush band when the user presses between them (grab anywhere stays).

**Unchanged.** The radius control and its wheel/[ ] keys; the falloff band; the undo step per drag; the strip; the keys 1-9 tools (Grab becomes the zone-aware grab; the others keep their one channel).

## Parts

- **Part 1, design, check it, read only, one page (pane P, the other Fable seat and D425's designer, if running; else pane O).** The zone table with the figures; the across-offset source (checked); the dots' stations, density and look; what the hover cue and the value line say for each zone; what Alt and Shift do; the test list for Part 2 (the zone map and the dot stations are pure functions: `zoneAt(u, mods)` → { channel, axis }, `dotStations(run, screenPx)`). One falsifier: a zone the keeper would reach for that the table does not name.
- **Part 2, build (pane C, after D518 lands), check it:** implement Part 1 in `app/core/handles.js` (the dots as hollow BRUSH-style kinds placed from the run), `app/core/panel.js` (Grab reads the zone; hover cue), the pick's across-offset if missing (`app/preview/preview.js`), tests for the two pure functions and one handles row per zone; the skin test (nothing moves); node --test on the touched test files only; no core change expected. If the core needs one (a channel the brush cannot reach as the design asks), C raises the tier to prove it and says so.
- **Part 3, install (C):** builder closed, `.before-d519`, sha256 compare; the keeper judges on CRAZY TEST's helix (grab an edge, the cup, the middle). On his yes it rides the next release batch.

Kept out: re-routing from a grab (his answer); new channels; the Build handles (D509 settled them). Falsifier for the whole lap: if, with Part 2 installed, the keeper still reaches for a tool key before touching the road, the design missed what "grab" meant.

surfaced: panel.js:385-400, handles.js:75-100, sculpt.js:1-30, coreshell.js:550-588, document.js:31/:61/:80, p-d425 §1-§5, labels.js:137.
