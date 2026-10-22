pane P (Fable)

# D425 Part 1: what each Sculpt tool shows on the road (design only; no code, nothing run)

Packet: `exo_memory/loop/plan_d425_sculpt_cues_2026-10-21.md` Part 1 (:17-29), the chair's dispatch of 12:56Z. Tier: check it.
Read against t180 `local-0.4.12` at `a795359` in `C:\Users\nname\Downloads\t180-wt-land412` (checked: `git -C … log -1 --format='%h %s'` →
`a795359 local-0.4.12: one [Unreleased] for D421c, …`). The keeper's words, 06:55 (relayed by the chair): "it works, but each tool needs UI much
like the original builder placing pieces to indicate to the user how it works".

§6 is the one page for the keeper. §1-§5 are the design proper; §7 the ledger and what was not done.

## 0. What the road shows today, by line

- **Build's ghost:** `app/core/panel.js:293-296` `ghost()` sends `t180-ghost` with the candidate piece on hover of Extend and on every field edit; the
  renderer draws it see-through in the accent violet (`app/preview/renderer.js:204` `COLOURS.ghost = [0.73, 0.66, 1.0]`, `:205` `GHOST_ALPHA = 0.42`),
  with the road lines at 0.8 (`:427-428`). Its handles: `app/core/handles.js:28-47`, one row a kind, each a filled mark with a double arrow along the
  drag's on-screen axis, in the kind's colour (length white, width `#ff5a5a`, bank `#4d86ff`, cup `#3ddc6e`, turn `#b968ff`, climb `#ffd23d`), the
  name and value in a box on hover and while dragged (`:208-221`, `format()` at `:185`).
- **Sculpt before the press:** `panel.js:385-394` the TOOLS table, each with a text `hint`; `:655-662` `showTool()` writes it into `sculptHint` on the
  strip. On the road: nothing. The pointer over the road is already picked every move for the labels (`app/core/labels.js:166-168`, `:223`, one
  `t180-pick` per pointer move), so a hover cue has its station for free.
- **Sculpt during the drag:** the falloff BAND exists already, cyan `#4dd2ff`, 14 px wide, alpha 0.55 × the brush weight, fixed where the drag began:
  `app/core/selectionlayer.js:40-51` `bandLine`, drawn at `:70-75` whenever `st.sculpt && st.brush` (B, D421 part 3; "No hover band before a drag",
  `p-d421-sculptmode-B_2026-10-20.md:158`). So the plan's "Sculpt shows nothing on the road before the press" is exact: the band is drag-only.
  The window of a route tool is drawn as a chord ghost in the road's own materials (`app/preview/trackmodel.js:195-207`), the road after it moved
  as one piece (`:208-214`), and on a closed lap a line across the gap in the marker orange `[1, 0.55, 0.15]` (`:217`). The value: the strip's
  `valueLine` ("bank +12.00° at the centre · brush widened to …", `panel.js:667-672`, `:748`). The big values overlay over the 3D view (D267,
  `app/core/valuesoverlay.js`) is hidden in Sculpt, since the readout it shows is Build's (`panel.js:270-278`, the D421c skip).
- **Two facts that decide the owners (§3):** (i) while a drag is open the shared track the page layers read is the one from BEFORE the drag
  (`app/preview/preview.js:201` "a drag's frame moves nothing the shared track's readers keep"; `:406` `track: () => shared()`), so a page layer
  cannot draw anything on the road AFTER a route window during the drag, as it has moved on screen and the layer's stations have not; (ii) the
  tool's window needs no shell call: for a radius tool it is `[s0 − r, s0 + r]` on the picked station (`coreshell.js:379-381`), for Stretch the
  piece under the station (`:471-475`, `centreOf`), and a run's is the run (`:382-386`); the page has the station from the pick and the piece from
  `labels.js pieceAt(track.segments, s)`.

## 1. The vocabulary: five cues every tool is built from

The keeper's reference is Build placing a piece: a see-through ghost of what will happen, and handles that say where to drag and show the number.
Sculpt gets the same five things, in the same colours, with one difference the keeper should know: Build's ghost is the NEW piece; Sculpt's
"ghost" is the stretch of EXISTING road the brush can reach.

1. **The reach** `[ … ]`: the band, on hover as well as during the drag. The cyan band that today appears at the press is drawn as soon as the
   pointer is over the road in Sculpt, centred on the picked station, `r` wide each side, at half its drag alpha (0.28 × the weight), and the two
   END MARKS `[` `]` at `s0 − r` and `s0 + r`: short ticks across the road in the band's cyan, so the edge of the reach is a line, not a fade. The
   wheel and `[` `]` resize the band under the pointer before the press (today they change the field only; the band shows it). At the press the band
   fixes where it is and goes to full alpha, as now. For Stretch the reach is the whole piece under the pointer, drawn the selection way (the piece's
   centreline, `selectionLines`) in the band's cyan, with the two marks at its two joints: Stretch moves a piece, not a radius, and the band would lie.
   For a selected run (the handles' path) the reach is the run, as the selection already draws it in orange: nothing new.
2. **The glyph**: ONE Build handle at the brush's centre, on the road, in the tool's colour (§5), with Build's double arrow along the drag's on-screen
   axis: ↕ for a `y` tool, ↔ for Bend (its axis is the pointer's x, `panel.js:386` `axis: 'x'`, as the turn handle's `screen: 'x'` is). The arrow's
   two heads carry a word each at the near end only on hover ("lift / sink", "harder / straighter", "longer / shorter"), the handles' own hover box
   style (`handles.js:208-213`). The glyph is NOT draggable: a press anywhere in the band opens the tool as today (the glyph's canvas keeps
   `pointer-events: none`, `handles.js:197`), so nothing changes in how the hand works, and a handle press is never confused with a brush press.
3. **Alt's other axis**, where a tool has one: Grab is the only tool with a second axis (`panel.js:386` `side: grab-side`, lateral, x). On hover with
   Alt held the glyph turns to ↔ in the sideways colour and the word pair becomes "left / right"; without Alt a small "Alt ↔" tag sits under the
   glyph. Stretch's Alt is not an axis but a rule (keep the rate instead of the bend): its tag reads "Alt: keep rate".
4. **What moves**: the road after the window, tinted. For a ROUTE tool (Stretch, Bend, Climb) the road from the window's end to the lap's end is
   drawn with a faint wash of the tool's colour (the renderer's overlay at alpha 0.18 on the road lines, §3), on hover and during the drag; on a
   CLOSED lap the seam piece, the last road piece before the start line, gets the same wash hatched (every other chord), and the first road piece a
   lighter hatch, because the release tries the window, then the window + the last piece, then + the first, then the whole lap
   (`coreshell.js:417-421`, D421c's seam ruling). For a LOCAL or SHAPE tool nothing outside the band is tinted, and the hover box's second line says
   "the road after stays" (Grab) or "the road does not move" (Twist, Width, Cup, Edge, Wall rise, Tube sweep), the words of `familyWords`
   (`panel.js:382`).
5. **The value**: three places, one number. (i) The glyph's hover box during the drag shows the handles' `format` of the drag's value at the centre,
   "bend +0.12 °/100 m", the same words and unit as the strip's value line (`panel.js:667-672`), 14 px bold, on the road by the pointer. (ii) The strip's
   value line gains, in this order: the tool's word pair for the drag's direction, the value at the centre (as now), the radius and the widened note
   (as now), and the pieces in the window with the seam pieces named ("pieces 9-11 · release may move 49, 0"). (iii) The big values overlay (D267) comes
   back in Sculpt with four cells: TOOL, VALUE at the centre, RADIUS, MOVES ("road after" / "stays"): the keeper asked for the numbers "in a better
   spot to be seen" once already (D267), and in Sculpt the spot is empty today.

## 2. The ten tools

Each row: the reach (a), the glyph and its direction (b), Alt (b), what moves (c), the value and its unit (d), and the colour (e). `r` is the
radius field; `s0` the picked station; "band" is cue 1; "after" is cue 4's wash.

| tool (key) | reach on hover | glyph: drag → effect | Alt | what moves | value shown | colour |
|---|---|---|---|---|---|---|
| Grab (1) | band `[s0−r, s0+r]` | ↕ up = lift, down = sink | ↔ sideways (with Alt at the press) | the band only; "the road after stays" | height +1.20 m (Alt: sideways +0.90 m) | white (position, as the length mark and the landing's forward); Alt: orange `#ffb020`, the landing's sideways |
| Stretch (2) | the piece under the pointer, its two joints marked | ↕ up = longer, down = shorter, the glyph at the piece's FAR joint (where Build's length mark sits, `handles.js:38`) | tag "Alt: keep rate" | after + seam hatch on a closed lap | length +15.00 m (the piece 215 m → 230 m) | white, as Build's length |
| Bend (3) | band | ↔ left = harder left, right = harder right (`axis x`) | — | after + seam hatch | turn rate +0.12 °/100 m | violet `#b968ff`, as Build's turn |
| Climb (4) | band | ↕ up = tilt up, down = tilt down | — | after + seam hatch | climb rate +0.08 °/100 m | yellow `#ffd23d`, as Build's climb |
| Twist (5) | band | ↕ up = bank more (left edge up), down = less | — | stays | bank +12.00° | blue `#4d86ff`, as Build's bank |
| Width (6) | band | ↕ up = wider, down = narrower; the glyph is Build's PAIR at the two edges (`sides [1, −1]`, `sign 'out'`) so it reads as Build's width | — | stays | width +2.00 m | red `#ff5a5a`, as Build's width |
| Cup (7) | band | ↕ up = edges up, down = flatter; the pair at 0.3 of the half-width, Build's cup marks | — | stays | cup +5.00° | green `#3ddc6e`, as Build's cup |
| Edge (8) | band | ↕ up = edge angle more, down = less; ONE mark on the edge the strip's "which edge" names (left, right), or at the edge start for "edge start" | — | stays | edge angle +5.00° / right edge / edge start +0.05 | green, hollow mark (an edge is the cup's cousin; hollow says "no Build handle of its own") |
| Smooth (9) | band at 3 × the tools' radius (`panel.js:650-652`) | ↕ up = smoother; one head only (a Smooth drag is clamped at 0, `panel.js:449`) | — | by the channel smoothed: after for turn or climb rate, stays otherwise | smoothing the bank, strength 0.40 | the colour of the channel it smooths, hollow |
| Wall rise (more ▾) | band | ↕ up = wall higher, down = lower; the pair at the two edges, standing UP (axis U) so it reads as a wall, not a width | — | stays | wall rise +0.50 m | red, hollow (a wall stands at the width's edge) |

Tube sweep (more ▾) is not in the ten the plan names; it takes Cup's row with one mark at the tube's tip and the sweep in degrees, green hollow, so the
"more ▾" pair reads alike. A click with no drag selects (as now) and shows no glyph change.

**The hover box's second line, per family** (cue 4 in words, always the hint's own words, `panel.js:382` `familyWords`): route "moves the road after it";
local "the road after it stays where it is"; shape "the road itself does not move". The strip's hint keeps the long sentence; the road carries the short one.

## 3. Owners and files

The plan names two owners, E (the preview overlay) and B (the page and the strip). The split falls out of §0's two facts: anything drawn on the
road AFTER a route window during a drag must be E's, because only the preview knows where that road is now; everything before the press, and the
band, the glyph and the words, are page layers B already owns.

| cue | item | owner | file | what changes |
|---|---|---|---|---|
| 1 reach | the hover band and the end marks | B | `app/core/selectionlayer.js` | `mount`'s frame takes a `hover` source as well as `st.brush`: `{ s0, r }` from the panel's last pick and the radius field; `bandLine` as is, alpha halved; two ticks at `s0 ± r` (two more projections). Stretch: `selectionLines` on the picked piece's id. |
| 1 reach | the hover's station and radius | B | `app/core/panel.js` | the Sculpt `down`/`move` block keeps the last pick (`t180-pick` on move, as labels do) and publishes `{ s0, r, tool }` to the layers through one `t180:sculpt-hover` reply event, the pattern of `t180:ghost-request`. |
| 2 glyph | the handle at the centre, its arrow, its hover box, the Alt tag | B | `app/core/handles.js`, `panel.js` `handlesHost.model` | a third model mode `brush`: one kind at `s0` (two for Width, Cup, Wall rise), `base` = the drag's value or 0, not draggable (`hitTest` skips mode `brush`); `frameKey` already keys on the model's numbers, so a still camera redraws nothing. |
| 3 Alt | the Alt state on hover | B | `panel.js` | `move` reads `e.altKey` into the hover reply; the glyph follows. |
| 4 moves | the wash on the road after, hover | E | `app/preview/preview.js` `overlayOf`, `renderer.js` | on hover of a route tool with no drag open: the road lines from the window's end to the lap's end as an overlay entry in the tool's colour at 0.18, from the shared path's samples (one line pair per 2 m station past the window: up to 5,000 pairs on 10 km, built once per hover station, cached by (station, track)). |
| 4 moves | the wash during the drag | E | `trackmodel.js` `dragFrame` `compose`, `renderer.js` | the batches that carry `xform` (the moved road, `:230`) are drawn with a tint uniform in the tool's colour: no new geometry, one uniform per chunk; the gap line stays orange. |
| 4 moves | the seam hatch on a closed lap | E | `preview.js` `overlayOf` | the last road piece's (and the first's) stations as a hatched overlay entry (every other 2 m pair), hover and drag; the pieces by id from the shared segments. |
| 5 value | the hover box's number | B | `handles.js` `format` | the brush kinds added to `KINDS` with their units (`°/100 m`, `°`, `m`, bare for edge start and Smooth's strength), the strip's `UNIT` table (`panel.js:666`) moved to one place both read. |
| 5 value | the strip's value line | B | `panel.js:748` | the direction words first, the pieces and the seam pieces last; `st.brush.pieces` exists (`coreshell.js:488`), the seam indices are the last and first road pieces of `st.history.present`. |
| 5 value | the big overlay in Sculpt | B | `app/core/valuesoverlay.js`, `panel.js:278` | `entries` takes a Sculpt list (tool, value, radius, moves); `set` is called from the subscriber only when the text changed. |

No shell change is needed for any cue: the window rule is the page's to repeat (`[s0 − r, s0 + r]`, or the piece), and the widened radius `rUsed`
is known only after the first step, so the hover band shows `r` and the drag band shows `rUsed`, as the band does today. If the librarian wants the
hover band exact where the brush would widen it (a radius under three knot spans, `sculpt.js:103-107`), that is one pure export from
`sculpt.js widened` through a shell query, O's file, and a later cut.

## 4. The frame cost at rows 3 and 4a

The bars (`app/test/sculpt-frame.test.js:34` `BUDGET = 6.0`; row 3 at `:213`, row 4a at `:220` with `tube360`): row 3's p95 is 6.9 / 7.3 ms quiet-judged
and row 4a's 4.1 ms (`p-d421c-landing-B_2026-10-21.md` §4, the two tables). A row's WORK FRAMES begin at the press (`sculpt-frame.test.js:170-177`:
timing is switched on after the hover's `mouseMoved` and before `mousePressed`), so:

- **Everything on hover (cues 1-4 before the press) costs the bars nothing**, provided it is gone by the press frame: the panel's `down` clears the hover
  reply in the same handler that opens the drag, so the first work frame already draws the drag's own cues.
- **What the drag frame gains, per step**, with today's cost beside it (every figure here is `inferred:` from the code's loops, none measured; the
  instrument is A's tracer, `p-d421c-profile-A_2026-10-20.md`, and the two rows themselves):
  - the glyph: one handle placed and drawn when its value changed (`handles.js frameKey` includes `drag.value`-like keys; here the brush's delta), one
    `placeHandles` of one kind and a 2D draw of about 30 path commands: ≈ 0.05 ms. Width, Cup and Wall rise draw two.
  - the hover box's text: one `measureText` and a `fillText`: ≈ 0.02 ms.
  - the wash on the moved road (E, during the drag): a uniform per chunk, no geometry: ≈ 0 ms of script; the fragment work is the same pixels already drawn.
  - the seam hatch: an overlay entry built ONCE at the press from the base track (the seam pieces do not move during a Bend; they are before and after
    the window on a lap drawn open, and the lap's last piece is moved with the road after, so its hatch takes the same `xform` as its batch: E draws
    it as part of the tinted chunk rather than as an overlay line while the drag is open): ≈ 0 ms per step.
  - the strip's value line and the big overlay: two DOM text updates per step; the value line is updated every step today; the overlay adds one
    `replaceChildren` of four spans: ≈ 0.05-0.1 ms.
  - **Sum: about 0.1-0.2 ms a step, before any saving.** Against row 4a's 1.9 ms of room that is safe; against row 3, which is already over, "must not get
    worse" is read as: within the run-to-run spread of the row (0.4 ms between its two runs, 6.9 and 7.3), and E's Part 3 measures it.
- **The saving that pays for it, B's file, same cut:** `selectionlayer.js:65-69` runs `bandLine` on EVERY frame while a drag is open: a `filter` over all
  5,001 stations of a 10 km lap, a `sort` of the near ones, and up to 160 projections, with the camera still and the band fixed. Key it as `handles.js`
  keys its layout (pose, `s0`, `r`, the track) and the filter runs once per drag, not per frame: `inferred:` 0.2-0.4 ms a frame back on row 3 (my D421
  review called the band "trivial beside the ghost", `p-d421-review-P_2026-10-20.md:75`; that is still true, and it is also about the size of what
  this design adds). Row 4a's band is 60 stations of a 300 m oval; its saving is small, and so is its cost.
- **What must NOT enter the drag frame:** a per-step rebuild of the hover band's station list, a per-step `t180-pick` (the drag's station is fixed at the
  press), any overlay line list built per step from the moved road (the chord ghost already costs the frame its geometry; the wash is a uniform
  precisely so that it adds none), and any DOM update whose text did not change.
- **Rows 2 and 4b** are not named in the packet and take the same cues; row 4b (Twist on tube280, 5.5 ms) has the least room after 4a, and Twist adds
  only the glyph.

## 5. How it matches Build

- **Colours**, one table, nothing new for a channel Build already has a handle for (`handles.js:28-47`): white for length and position (Stretch, Grab),
  red width (Width, Wall rise hollow), blue bank (Twist), green cup (Cup, Edge hollow, Tube sweep hollow), violet turn (Bend), yellow climb (Climb);
  Alt-Grab the landing's sideways orange; the reach band stays the cyan it has, the seam hatch the marker orange of the gap line, the wash the tool's
  own colour at 0.18. Every colour is a `tokens.js` read with today's literal as its fallback, as the layers do (`handles.js:21`, `selectionlayer.js:15`).
- **The ghost**: Build's ghost is "the piece that will be placed, see-through, in the accent violet at 0.42". Sculpt's counterpart is the reach: the
  cyan band on the existing road. The design keeps them DIFFERENT on purpose: violet means "new road, not placed yet", cyan means "placed road the
  brush can reach". The one place Sculpt shows a true ghost, the route window's chord ghost during a drag, is drawn in the road's own materials today
  (`trackmodel.js:207`), and stays so: it is the road, moving.
- **The handles read the same way**: a filled mark with a double arrow is "drag me along this arrow, this is the value"; in Sculpt the same mark says
  "drag ANYWHERE in the band along this arrow", so the arrow is the message and the mark is the pointer's anchor. Hollow marks are Sculpt-only kinds.
  The hover box is `handles.js format`'s, two decimals, the unit written, so "bend +0.12 °/100 m" on the road and "turn rate +0.12 °/100 m" in the strip
  are the same number: the design asks B to use ONE name per channel in both, the strip's `CHANNEL_NAMES` (`panel.js:36`), so the road does not say
  "bend" while the strip says "turn rate".
- **Esc, Undo, the click**: unchanged. The cues draw; they never take a press.

## 6. The one page for the keeper

**What you asked for.** Each Sculpt tool now shows on the road, before you press, what it will do, the way Build shows the ghost of the next piece
and its handles. Hover the road in Sculpt and you see three things:

```
          [ ────────────── reach ────────────── ]          the cyan band: how far the brush reaches (the radius),
                            ▲                              with a [ and a ] at its two ends; the wheel resizes it
                         ┌──┴──┐  harder ◄──■──► straighter   the handle: Build's own mark and arrow, in the tool's colour,
   ═══════════════════════════╪═══════════════════════════════╗   pointing the way you drag and what each way does
                                                              ║
   (Bend, Climb, Stretch)  the road AFTER the band is washed  ║   what moves: for Bend, Climb and Stretch everything after
   in the tool's colour; on a closed lap the piece before     ║   the band swings with it, so it is tinted; for Grab, Twist,
   the start line is hatched: that is what may move to close  ║   Width, Cup, Edge and Wall only the band moves and the
   the lap again when you let go                              ╝   road after it is left plain
```

While you drag, the band fixes where it is, the handle shows the number as it changes ("bend +0.12 °/100 m"), and the same number is in the strip
under the bar and, large, over the 3D view where Build's numbers sit.

**The tools, in one line each** (the arrow is the drag; the colour is Build's for the same thing):

```
  1 Grab     ↕  lift / sink           white      the band moves, the road after stays     (Alt: ↔ sideways, orange)
  2 Stretch  ↕  longer / shorter      white      the piece under you; the road after slides along   (Alt: keep the rate)
  3 Bend     ↔  harder / straighter   violet     the road after swings
  4 Climb    ↕  tilt up / down        yellow     the road after rises or falls
  5 Twist    ↕  bank more / less      blue       the road does not move
  6 Width    ↕  wider / narrower      red        the road does not move      (a mark at each edge, as Build's width)
  7 Cup      ↕  edges up / flatter    green      the road does not move
  8 Edge     ↕  angle more / less     green ○    the road does not move      (the mark on the edge you picked)
  9 Smooth   ↑  smoother              its channel's colour ○    the band's wobble goes
  Wall rise  ↕  higher / lower        red ○      the road does not move      (a mark at each edge, standing up)
```

**What it costs.** Nothing while you hover. While you drag, one handle and one line of text more per step, about a tenth of a millisecond, and the
band's bookkeeping, which runs every frame today, is made to run once per drag, which gives that back and more. The 165 Hz bar stays the bar; E
measures it before it lands.

**One call for you:** the band's colour. It is cyan today and the design keeps it, so "cyan = placed road the brush reaches" and "violet = a new
piece not placed yet" stay two different things. If you would rather every ghost be violet, say so and the band takes the accent.

## 7. Checked, inferred, not done

- checked: `git -C C:\Users\nname\Downloads\t180-wt-land412 log -1 --format='%h %s'` → `a795359 local-0.4.12: …`.
- checked: `app/core/panel.js:293-296` (`ghost()`), `:385-394` (TOOLS), `:382` (`familyWords`), `:426-473` (the Sculpt press, move, release), `:646-672`
  (the strip, `showTool`, `valueWords`, `UNIT`), `:748` (the value line), `:35` (`PER_PX`), `:36` (`CHANNEL_NAMES`), `:270-278` (the readout skip in Sculpt).
- checked: `app/core/handles.js:28-47` (the kinds and colours), `:185-190` (`format`), `:195-233` (`mount`, the draw, the hover box, `frameKey`).
- checked: `app/core/selectionlayer.js:1-13` (the header: `bandLine` is D421 part 3's), `:40-51`, `:53-90` (the frame: band when `st.sculpt && st.brush`).
- checked: `app/preview/renderer.js:204-205`, `:424-428`, `:438-441` (ghost colour and alpha; the overlay pass); `app/preview/trackmodel.js:149-240`
  (`dragFrame`: the chord ghost, the rigid move `X`, the gap line's colour, `compose`); `app/preview/preview.js:201`, `:406`, `:467-475` (`overlayOf`),
  `:477-489` (`pickAt`: every station, nearest within 40 px); `app/preview/index.js:81-95` (the events).
- checked: `app/core/coreshell.js:133-150` (`SCULPT_TOOLS`, `familyOf`), `:379-387` (`toolWindow`), `:471-475` (Stretch's piece), `:417-421` (the seam
  tries), `:488` (`brush.pieces`, `span`, `closedBase`); `src/core/sculpt.js:20-21`, `:103-107` (the falloff, `widened`).
- checked: `app/core/labels.js:166-168`, `:223` (the pick on pointer move), `:130` (`pieceAt`); `app/core/valuesoverlay.js` whole.
- checked: `app/test/sculpt-frame.test.js:34`, `:170-191` (the work frames start after the hover's `mouseMoved`), `:213`, `:220`.
- checked: `exo_memory/handback/p-d421c-landing-B_2026-10-21.md` §4 → row 3 p95 8.1 / 7.4 in the stage and 6.9 / 7.3 quiet-judged; row 4a 4.1; row 4b 5.5.
- checked: `exo_memory/handback/p-d421-sculptmode-B_2026-10-20.md:44-48`, `:158` → the band is B's, drag-only; `p-d421-review-P_2026-10-20.md:75`.
- inferred: every millisecond in §4 (the glyph, the text, the overlay update, the band's per-frame filter and sort). None was measured; E's Part 3 and B's
  Part 4 measure on rows 3 and 4a, and A's tracer gives the split.
- inferred: that a tint uniform on the moved chunks costs the renderer no new geometry; `renderer.js:200-203` `chunkModel` shows the moved chunk is drawn
  under its `xform` from its baked arrays, which is why a per-chunk uniform is the right place; the shader's own change is E's to size.
- **Not done: no screenshots.** The packet allows them from the installed build, headless with `--mute-audio`. I took none: the standing rule from D411
  is never to launch the installed builder, the keeper was in it at 06:55, and the design needs none to be ruled on; §0 cites the line that draws each
  thing instead. If the librarian wants pictures for the keeper, E's Part 3 produces them from its own build, where the cues exist.
- Not done: nothing run (no test, no node, no browser); the tier is check it and the part is design only.
- Not read: `app/preview/look.js` beyond its ghost line, `app/preview/batches.js`, the shaders; the wash's shader change is sized by E.

## Corrections

- none yet.

SOURCES: exo_memory/loop/plan_d425_sculpt_cues_2026-10-21.md · exo_memory/handback/p-d421-sculpt-design-P_2026-10-20.md · exo_memory/handback/p-d421c-landing-B_2026-10-21.md · exo_memory/handback/p-d421-sculptmode-B_2026-10-20.md · exo_memory/handback/p-d421-review-P_2026-10-20.md · exo_memory/handback/p-d421c-profile-A_2026-10-20.md · C:\Users\nname\Downloads\t180-wt-land412 (app/core/panel.js, handles.js, selectionlayer.js, labels.js, valuesoverlay.js, coreshell.js, keys.js; app/preview/preview.js, trackmodel.js, renderer.js, index.js, guideslayer.js; src/core/sculpt.js; app/test/sculpt-frame.test.js; app/index.html; CHANGELOG.md)
NEXT: librarian rules on the design (Part 2) and routes the keeper's one call (§6, the band's colour) and veto; then E takes Part 3 (§3's E rows) and B Part 4 (§3's B rows), E measuring rows 3 and 4a before anything lands.
