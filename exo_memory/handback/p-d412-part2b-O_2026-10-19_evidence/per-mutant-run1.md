| mutant | 0.4.8 (3841908) | now | verdict | path | s |
|---|---|---|---|---|---|
| K1 the columns outside the window are not fixed | ok | ok | same | narrowed | 1.1 |
| K2 the pieces outside the window are recomputed, not kept | ok | ok | same | narrowed | 1.1 |
| K3 a local close that does not close is handed back, not refused | ok | ok | same | narrowed | 3.0 |
| K4 the roll-rate bar is not read | ok | ok | same | narrowed | 1.0 |
| K5 the window is not named for a person | ok | ok | same | narrowed | 1.4 |
| K6 the default window ignores the fraction (the last piece only) | ok | ok | same | narrowed | 0.9 |
| K7 an empty window is accepted | ok | ok | same | narrowed | 1.0 |
| A6 the refused export keeps the export's own message (ids) | ok | ok | same | narrowed | 1.9 |
| A9 the press writes no copy from before the close | ok | ok | same | narrowed | 2.7 |
| A10 a failed copy still closes | ok | ok | same | narrowed | 3.9 |
| A11 an edit while the copy is written is closed over | ok | ok | same | narrowed | 6.6 |
| B1 a way that does not prove is picked | ok | ok | same | narrowed | 3.7 |
| B2 a way that adds a red is picked | ok | ok | same | narrowed | 3.5 |
| B3 new road is not put last | ok | ok | same | narrowed | 0.7 |
| B4 the most movement is tried first | ok | ok | same | narrowed | 3.6 |
| B5 Finish is tried when the end is already at the start | ok | ok | same | narrowed | 2.9 |
| B6 a bend may reshape the track (no move cap) | ok | ok | same | narrowed | 3.0 |
| B7 a press that finds no way still applies | ok | ok | same | narrowed | 4.2 |
| B8 the press commits the open track | ok | ok | same | narrowed | 2.2 |
| N1 a laid road Close refuses is never taken as laid (the lone straight is lost to a loop again) | ok | ok | same | narrowed | 1.4 |
| N2 a route that is only a straight is not laid under 10 m | ok | ok | same | narrowed | 1.4 |
| F5 the worker's document is not frozen (the residual memo misses) | ok | ok | same | narrowed | 8.1 |
| B9 a tie is not broken by the route order (micro-metres decide) | ok | ok | same | narrowed | 0.7 |
| F1 the near bend is not checked first (every route runs) | ok | ok | same | narrowed | 2.3 |
| F2 the given open-track reds are ignored (it is checked again) | ok | ok | same | narrowed | 7.4 |
| F3 the press hands the worker no reds | ok | ok | same | narrowed | 1.3 |
| F4 a check made with CSP off is used | ok | ok | same | narrowed | 1.2 |
| G1 a ray red on an overlap keeps its own words | ok | ok | same | narrowed | 0.5 |
| G2 every ray red is called an overlap | ok | ok | same | narrowed | 0.4 |
| G3 the text names only the first place of a group | ok | ok | same | narrowed | 0.4 |
| G6 places are never merged | ok | ok | same | narrowed | 0.4 |
| G7 places merge across pieces | ok | ok | same | narrowed | 0.4 |
| G10 places merge only on the same STARTING piece (the rule the real window caught) | ok | ok | same | narrowed | 0.4 |
| G8 touching reds do not merge (no tolerance) | ok | ok | same | narrowed | 0.4 |
| G9 the count is of reds, not places | ok | ok | same | narrowed | 0.4 |
| G4 the piece is read at the range's end | ok | ok | same | narrowed | 0.4 |
| G5 s past the lap does not wrap | ok | ok | same | narrowed | 0.4 |
| L1 every piece is labelled again | ok | ok | same | narrowed | 1.0 |
| L2 the hovered piece is never labelled | ok | ok | same | narrowed | 1.0 |
| L3 a still pointer is not asked again after the track changes | ok | ok | same | narrowed | 1.1 |
| U1 Undo shows the head only (the bug) | ok | ok | same | narrowed | 1.0 |
| U2 the ticks are not put back | ok | ok | same | narrowed | 1.0 |
| S1 Straight does not tick turn "at start" | ok | ok | same | narrowed | 0.9 |
| S2 Straight leaves the boxes ticked | ok | ok | same | narrowed | 0.9 |
| S3 the straight hint never shows | ok | ok | same | narrowed | 0.9 |
| R1 the sign of an angle flipped | ok | ok | same | narrowed | 1.3 |
| R2 zero is signed | ok | ok | same | narrowed | 1.3 |
| R3 bank shown as its end value, not the change | ok | ok | same | narrowed | 1.3 |
| R4 rounding without the binary guard | ok | ok | same | narrowed | 1.2 |
| R5 the head keep-out ignored | ok | ok | same | narrowed | 1.2 |
| R6 labels may overlap | ok | ok | same | narrowed | 1.2 |
| R7 anchors cached by the path object | ok | ok | same | narrowed | 1.4 |
| R8 the layer is not put back in the page | ok | ok | same | narrowed | 1.4 |
| R11 a label never slides off its piece's middle | ok | ok | same | narrowed | 1.2 |
| R13 the head's label may be culled | ok | ok | same | narrowed | 1.2 |
| R14 a head piece with nothing on screen has no label | ok | ok | same | narrowed | 1.2 |
| R15 the road bleeds through the label | ok | ok | same | narrowed | 1.3 |
| R16 the label box has a border and round corners again | ok | ok | same | narrowed | 1.3 |
| R17 the head's fallback place may cover the head | ok | ok | same | narrowed | 1.2 |
| R12 no ring clears a large head keep-out | ok | ok | same | narrowed | 1.2 |
| R9 the panel readout waits for the next state change | ok | ok | same | narrowed | 1.3 |
| R10 the ghost readout is the LAST placed piece, not the candidate | ok | ok | same | narrowed | 1.2 |
| U1 the cup field is not sent to the core | ok | ok | same | narrowed | 1.1 |
| U2 the cup is sent in radians | ok | ok | same | narrowed | 1.2 |
| U3 the panel clamps the cup, hiding the core guard | ok | ok | same | narrowed | 1.2 |
| U4 the cup cell shows the typed target, not the document | ok | ok | same | narrowed | 1.3 |
| U5 (K7-4) the cup cell wired to the bank values | ok | ok | same | narrowed | 1.3 |
| U6 (K7-3) the cup shown in radians | ok | ok | same | narrowed | 1.3 |
| U7 the cup field does not redraw the readout | ok | ok | same | narrowed | 1.2 |
| U8 the brush has no cup channel | ok | ok | same | narrowed | 1.2 |
| U9 the cup field is not on the panel | ok | ok | same | narrowed | 1.3 |
| V1 the at-start boxes are ignored | ok | ok | same | narrowed | 1.3 |
| V2 an untouched field is sent at start | ok | ok | same | narrowed | 1.2 |
| V3 the span is not held to the piece | ok | ok | same | narrowed | 1.2 |
| V4 transition sent as one number for all channels | ok | ok | same | narrowed | 1.4 |
| V5 a field sent on the wrong channel | ok | ok | same | narrowed | 1.3 |
| V6 the panel never passes the boxes | ok | ok | same | narrowed | 1.2 |
| V7 ticking a box does not redraw | ok | ok | same | narrowed | 1.2 |
| C1 a brush frame builds on the last frame, not the drag's base | ok | ok | same | narrowed | 1.6 |
| C2 the drag never ends in the history | ok | ok | same | narrowed | 1.5 |
| C3 the local brush is not the default | ok | ok | same | narrowed | 1.3 |
| C20 sideways is sent as a hill | ok | ok | same | narrowed | 1.3 |
| C21 with E's brush, every channel is sent as rate | ok | ok | same | narrowed | 1.3 |
| C4 a second close runs again | ok | ok | same | narrowed | 1.6 |
| C5 the heading brush may open a closed loop | ok | ok | same | narrowed | 1.5 |
| C7 export runs on an open track | ok | ok | same | narrowed | 1.6 |
| C8 the list shows the piece builder's tracks too | ok | ok | same | narrowed | 1.3 |
| C12 turn is degrees per metre, not per 100 m | ok | ok | same | narrowed | 1.3 |
| C14 the pick takes the farthest station | ok | ok | same | narrowed | 1.3 |
| C15 the pick sees through the back of the camera | ok | ok | same | narrowed | 1.3 |
| C16 the ghost is not what extend builds | ok | ok | same | narrowed | 1.3 |
| C17 export goes to the word exporter | ok | ok | same | narrowed | 1.6 |
| C18 the close does not go round the user's straights | ok | ok | same | narrowed | 1.6 |
| C19 the export is handed no start layout | ok | ok | same | narrowed | 2.7 |
| C22 the widened radius is not shown | ok | ok | same | narrowed | 1.4 |
| L1 the track model ignores the lift | ok | ok | same | narrowed | 1.4 |
| L2 a lift-only change is taken as the same track | ok | ok | same | narrowed | 1.4 |
| L3 the mesh is not keyed by the lift | ok | ok | same | narrowed | 1.5 |
| L4 the export does not lift the path | ok | ok | same | narrowed | 3.8 |
| C23 the radiusUsed E reports is not read | ok | ok | same | narrowed | 2.5 |
| C24 sharp is never passed to E | ok | ok | same | narrowed | 1.2 |
| P1 the export starts at the origin | ok | ok | same | narrowed | 1.9 |
| P2 the preview starts at the origin | ok | ok | same | narrowed | 1.7 |
| P3 the shell does not hand on the start | ok | ok | same | narrowed | 1.8 |
| X1 the edge angle sent in radians | ok | ok | same | narrowed (inferred) | 1.6 |
| X2 the panel clamps the edge, hiding the core guard (KE2-2) | ok | ok | same | narrowed (inferred) | 1.7 |
| X3 the tube field is not sent | ok | ok | same | narrowed (inferred) | 1.6 |
| X4 the edge start sent on the edge channel | ok | ok | same | narrowed (inferred) | 1.6 |
| X5 the bank wrapped to ±180 (S1) | ok | ok | same | narrowed (inferred) | 1.5 |
| X6 (KS1-2) max="180" on the bank input | ok | ok | same | narrowed (inferred) | 1.6 |
| X7 (KE7-1, UI) the edge cell shows the typed target | ok | ok | same | narrowed (inferred) | 1.6 |
| X8 (KE7-2) the edge cell wired to the cup values | ok | ok | same | narrowed (inferred) | 1.9 |
| X9 the edge start shown to one decimal | ok | ok | same | narrowed (inferred) | 1.6 |
| X10 the edge field is not on the panel | ok | ok | same | narrowed (inferred) | 1.5 |
| X11 the new fields do not redraw the readout | ok | ok | same | narrowed (inferred) | 1.6 |
| X12 an untouched edge field is sent as a target | ok | ok | same | narrowed (inferred) | 1.7 |
| X13 the edge has no "at start" | ok | ok | same | narrowed (inferred) | 1.6 |
| X14 the head state drops the cross-section channels | ok | ok | same | narrowed (inferred) | 1.6 |
| X15 the default edge start is the plan's stale 0.70 | ok | ok | same | narrowed (inferred) | 1.5 |
| X16 (X2 ii) the mast stands on world y | ok | ok | same | narrowed (inferred) | 1.4 |
| X17 the mast is not held below the roof | ok | ok | same | narrowed (inferred) | 1.6 |
| X18 the cross and ring reach through the wall | ok | ok | same | narrowed (inferred) | 1.6 |
| X19 an open tube read as closed | ok | ok | same | narrowed (inferred) | 1.6 |
| X20 the roof read sideways | ok | ok | same | narrowed (inferred) | 1.6 |
| X21 the preview never hands the room to the marker | ok | ok | same | narrowed (inferred) | 1.5 |
| X22 the tube-too-narrow red has no words | ok | ok | same | narrowed (inferred) | 1.6 |
| X23 the roll-rate red has no words | ok | ok | same | narrowed (inferred) | 1.6 |
| X24 the readout swallows the refusal's name | ok | ok | same | narrowed (inferred) | 1.6 |
| X25 a typed tube leaves the cup enabled | ok | ok | same | narrowed (inferred) | 1.6 |
| X29 a non-tube head shows the sweep the core keeps internally (RULING 2) | ok | ok | same | narrowed (inferred) | 1.7 |
| X30 the head piece is never read as a tube | ok | ok | same | narrowed (inferred) | 1.7 |
| X31 the tube-too-narrow words keep the first, wrong 9.43 m | ok | ok | same | narrowed (inferred) | 1.6 |
| X27 a new document leaves a field disabled | ok | ok | same | narrowed (inferred) | 1.7 |
| X28 the cup-or-tube rule is never wired | ok | ok | same | narrowed (inferred) | 1.6 |
| A1 the build view looks backward | ok | ok | same | narrowed | 0.6 |
| A2 the build key does nothing from free mode | ok | ok | same | narrowed | 0.6 |
| A3 the switch key skips a mode | ok | ok | same | narrowed | 0.6 |
| A4 chase ignores its lag (sits on the head) | ok | ok | same | narrowed | 0.6 |
| A5 chase lifts along world up, not the road's up | ok | ok | same | narrowed | 0.6 |
| A6 overhead's loop fallback is a fixed north | ok | ok | same | narrowed | 0.6 |
| A7 free mode follows the head like the build view | ok | ok | same | narrowed | 0.7 |
| A8 entering free does not take over the view | ok | ok | same | narrowed | 0.7 |
| A9 the shown pose snaps instead of easing | ok | ok | same | narrowed | 0.6 |
| A10 the renderer re-uploads every array every frame | ok | ok | same | narrowed | 0.7 |
| A11 the renderer never deletes a stale buffer | ok | ok | same | narrowed | 0.8 |
| A12 batches copy the arrays (a sculpt re-uploads everything) | ok | ok | same | narrowed | 0.8 |
| A13 the track model never extends (always a full build) | ok | ok | same | narrowed | 0.7 |
| A14 the model matrix transposed | ok | ok | same | narrowed | 0.7 |
| A15 the backing store ignores devicePixelRatio | ok | ok | same | narrowed | 0.7 |
| A16 the size cap drops the aspect (one side clamped alone) | ok | ok | same | narrowed | 0.6 |
| A17 Ctrl/Alt/Meta ignored by keyAction | ok | ok | same | narrowed | 0.6 |
| A18 the frame loop passes no modifiers (Ctrl+C cycles the camera) | ok | ok | same | narrowed | 0.7 |
| A19 a failed mount is swallowed | ok | ok | same | narrowed | 0.7 |
| A20 the probe skips the perspective divide | ok | ok | same | narrowed | 0.7 |
| A21 the judge accepts a view with nothing drawn | ok | ok | same | narrowed | 0.7 |
| A22 the judge never checks DPR | ok | ok | same | narrowed | 0.7 |
| B1 no key light (only ambient and fill) | ok | ok | same | narrowed | 0.7 |
| B2 one-sided light (an overhang goes dark) | ok | ok | same | narrowed | 0.7 |
| B3 the shader key strength drifts from look.js | ok | ok | same | narrowed | 0.7 |
| B4 the edge lines one vertex in from the edges | ok | ok | same | narrowed | 0.7 |
| B5 the lines not lifted off the surface (they would z-fight) | ok | ok | same | narrowed | 0.7 |
| B6 no ties across the road | ok | ok | same | narrowed | 0.7 |
| B7 the overhead fit ignores the aspect | ok | ok | same | narrowed | 0.7 |
| B8 the overhead fit measures from the box bottom (the top is clipped) | ok | ok | same | narrowed | 0.9 |
| B9 the world box takes one corner of each local box | ok | ok | same | narrowed | 0.9 |
| B10 the ghost is built on the live path (no copy) | ok | ok | same | narrowed | 0.7 |
| B11 placing the word does not retire its ghost | ok | ok | same | narrowed | 0.7 |
| B12 the candidate ignores the font picker | ok | ok | same | narrowed | 0.7 |
| B13 the grid floats above y = 0 | ok | ok | same | narrowed | 0.7 |
| B14 the ghost is never drawn | ok | ok | same | narrowed | 0.7 |
| B16 the head marker does not grow with distance (a speck from overhead) | ok | ok | same | narrowed | 0.7 |
| B15 the head marker is never drawn | ok | ok | same | narrowed | 0.7 |
| P1 a sculpt re-places the path but keeps the old mesh | ok | ok | same | narrowed | 0.9 |
| P2 every change rebuilds the whole track (no per-cell reuse) | ok | ok | same | narrowed | 0.7 |
| P3 the preview reaches for the native side | ok | ok | same | narrowed | 0.7 |
| T1 the editor ignores the value it is given | ok | ok | same | narrowed | 0.7 |
| T2 the panel never calls onChange | ok | ok | same | narrowed | 0.8 |
| L1 ksAmbient is read from ksDiffuse | ok | ok | same | narrowed | 0.7 |
| L2 a missing property reads 1, not 0 | ok | ok | same | narrowed | 0.7 |
| L3 the multilayer R and G scales are swapped | ok | ok | same | narrowed | 0.7 |
| L4 ksPerPixelNM falls to ksPerPixel | ok | ok | same | narrowed | 0.9 |
| L5 the renderer never sets ksSpecular | ok | ok | same | narrowed | 0.7 |
| L6 every sampler gets the white texel | ok | ok | same | narrowed | 0.7 |
| L7 the multilayer scales never reach the shader | ok | ok | same | narrowed | 0.7 |
| L8 textures are never deleted | ok | ok | same | narrowed | 0.7 |
| L9 a shader loses a uniform declaration | ok | ok | same | narrowed | 0.7 |
| L10 an untextured set slot replaces the exported material | ok | ok | same | narrowed | 0.7 |
| L11 the set is ignored | ok | ok | same | narrowed | 0.8 |
| L12 textures are keyed by name, not by the kn5 file | ok | ok | same | narrowed | 0.8 |
| L13 the default look is the word colours | ok | ok | same | narrowed | 0.7 |
| L14 setTextureSet drops the set | ok | ok | same | narrowed | 0.8 |
| L15 a property is read from the wrong material | ok | ok | same | narrowed | 17.4 |
| L16 L does not change the look (the colour per word is unreachable) | ok | ok | same | narrowed | 0.8 |
| L17 the ties never fade (they hatch the road dark at a distance) | ok | ok | same | narrowed | 0.7 |
| K1 a kept chunk ignores the matrices of its cells (a moved piece is drawn where it was) | ok | ok | same | narrowed | 0.8 |
| K2 the cells are never merged (one draw per cell again) | ok | ok | same | narrowed | 0.7 |
| K3 the indices of a merged cell are not moved past the cells before it | ok | ok | same | narrowed | 0.8 |
| K4 normals are baked as points (translated with the cell) | ok | ok | same | narrowed | 0.8 |
| K5 a chunk may outgrow its vertex limit | ok | ok | same | narrowed | 0.8 |
| L18 the canvas is cleared to the fog colour again | ok | ok | same | narrowed | 0.7 |
| N3 a repeated key-down makes the key the newest again | ok | ok | same | narrowed | 0.6 |
| N4 a key-up lets go of every key | ok | ok | same | narrowed | 0.6 |
| N5 the takeover re-fires every frame a key is held (C and B are undone) | ok | ok | same | narrowed | 0.6 |
| E1 an OS key-repeat re-arms the takeover (W1: after C or B, a held W snaps back to free) | ok | ok | same | narrowed | 0.7 |
| E2 deltaX counts without Shift (W2: a sideways trackpad swipe zooms, or moves the lens) | ok | ok | same | narrowed | 0.7 |
| N6 the wheel ignores deltaX (Shift+wheel is dead on a device that reports it there) | ok | ok | same | narrowed | 0.6 |
| N7 the key action is looked up by the physical key name, not fixed at key-down | ok | ok | same | narrowed | 0.6 |
| N8 the overhead never slides to the head (a black view on a curved track) | ok | ok | same | narrowed | 0.7 |
| N9 the overhead slides to the head at half the rate | ok | ok | same | narrowed | 0.6 |
| N10 the overhead slides past the box centre when zoomed OUT | ok | ok | same | narrowed | 0.7 |
| N11 the sprint never ramps (×4 for as long as Shift is held) | ok | ok | same | narrowed | 0.7 |
| N12 the ramp never resets on release (a second press starts at ×20) | ok | ok | same | narrowed | 0.8 |
| N13 a blur does not reset the ramp | ok | ok | same | narrowed | 0.7 |
| N14 the ramp is twice too slow (5 s to full) | ok | ok | same | narrowed | 0.6 |
| N15 the ramp stops at ×10 | ok | ok | same | narrowed | 0.7 |
| N16 Enter blurs a text area too (it is a new line there) | ok | ok | same | narrowed | 0.7 |
| N17 Esc does not blur a field | ok | ok | same | narrowed | 0.6 |
| N18 Enter does not blur a field | ok | ok | same | narrowed | 0.7 |
| N19 a click on the canvas leaves the field focused | ok | ok | same | narrowed | 0.6 |
| N20 a number field swallows the camera keys | ok | ok | same | narrowed | 0.7 |
| N21 a text field lets the camera keys through (typing moves the camera) | ok | ok | same | narrowed | 0.6 |
| N22 Ctrl+wheel dollies instead of zooming the lens | ok | ok | same | narrowed | 0.6 |
| N23 the plain wheel is the lens | ok | ok | same | narrowed | 0.7 |
| N24 the middle click does not reset the lens | ok | ok | same | narrowed | 0.7 |
| N25 the HUD never shows the fov | ok | ok | same | narrowed | 0.7 |
| N26 the lens zooms the wrong way | ok | ok | same | narrowed | 0.6 |
| N27 the lens is not clamped at 10° | ok | ok | same | narrowed | 0.6 |
| N28 the pose ignores the lens | ok | ok | same | narrowed | 0.6 |
| D1 movement is newest-key-only again (a newer key zeroes the other axes: no diagonal) | ok | ok | same | narrowed | 0.7 |
| D2 on one axis the OLDER key wins | ok | ok | same | narrowed | 0.7 |
| D3 both keys of an axis cancel (W and S held: stand still) | ok | ok | same | narrowed | 0.7 |
| D4 a diagonal is not normalised (√2 times a straight line) | ok | ok | same | narrowed | 0.7 |
| D5 a diagonal is normalised to the wrong length (÷ n², not ÷ n) | ok | ok | same | narrowed | 0.6 |
| D6 a newer key on an axis drops the older for good (no handover on release) | ok | ok | same | narrowed | 0.7 |
| D7 a key-up lets go of every key (the other axis stops too) | ok | ok | same | narrowed | 0.7 |
| D8 a repeated key-down makes the key the newer again | ok | ok | same | narrowed | 0.6 |
| D9 the arrow keys stop turning while a movement key is held | ok | ok | same | narrowed | 0.6 |
| T1 any name sets a skin | ok | ok | same | narrowed (inferred) | 0.5 |
| T2 the head rounds the pick | ok | ok | same | narrowed (inferred) | 0.5 |
| T3 the head names the melodies in another order | ok | ok | same | narrowed (inferred) | 0.5 |
| T4 the boot does not follow the player | ok | ok | same | narrowed (inferred) | 0.5 |
| T14 the head ignores a saved theme | ok | ok | same | narrowed (inferred) | 0.5 |
| T15 the head takes any saved text as a theme | ok | ok | same | narrowed (inferred) | 0.5 |
| T16 sigil shows a skin | ok | ok | same | narrowed (inferred) | 0.5 |
| T5 a skin change keeps the old colours | ok | ok | same | narrowed (inferred) | 0.5 |
| T6 the reader watches the wrong attribute | ok | ok | same | narrowed (inferred) | 0.6 |
| T7 a translucent token comes back opaque | ok | ok | same | narrowed (inferred) | 0.6 |
| T8 color(srgb) floats are rounded to bytes | ok | ok | same | narrowed (inferred) | 0.6 |
| T9 solid keeps a skin's alpha | ok | ok | same | narrowed (inferred) | 0.6 |
| T10 a missing token is black, not today's colour | ok | ok | same | narrowed (inferred) | 0.6 |
| T11 an unreadable token is not reported | ok | ok | same | narrowed (inferred) | 0.5 |
| T12 the 3D sky ignores the skin | ok | ok | same | narrowed (inferred) | 0.5 |
| T13 SIGIL's grid token drifts from the literal | ok | ok | same | narrowed (inferred) | 0.5 |
| S1 the sky follows the camera's position | ok | ok | same | narrowed (inferred) | 0.6 |
| S2 the rays turn the other way | ok | ok | same | narrowed (inferred) | 0.6 |
| S3 the shader builds its rays without the basis | ok | ok | same | narrowed (inferred) | 0.6 |
| S4 the sky writes depth | ok | ok | same | narrowed (inferred) | 0.7 |
| S5 the pattern gets no time | ok | ok | same | narrowed (inferred) | 0.7 |
| S6 none still draws a sky | ok | ok | same | narrowed (inferred) | 0.7 |
| S7 going back to none keeps the old sky | ok | ok | same | narrowed (inferred) | 0.7 |
| S8 an unknown style is quietly none | ok | ok | same | narrowed (inferred) | 0.7 |
| S9 --sky-a falls back to black-ish, not the skin's sky | ok | ok | same | narrowed (inferred) | 0.7 |
| S10 the style word keeps its quotes | ok | ok | same | narrowed (inferred) | 0.6 |
| S11 reduced motion still drifts | ok | ok | same | narrowed (inferred) | 0.6 |
| S12 the preview hands the sky no time | ok | ok | same | narrowed (inferred) | 0.6 |
| S13 Skyline names no sky | ok | ok | same | narrowed (inferred) | 0.6 |
| S14 Glass names no sky (D384 widened) | ok | ok | same | narrowed (inferred) | 0.7 |
| S15 the registry leaves prism out (D384 widened) | ok | ok | same | narrowed (inferred) | 0.7 |
| S16 the sky pass does not dither (D398) | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant K1 every segment counts as constant (no chord is ever drawn) | ok | ok | same | whole (inferred) | 6.6 |
| mutant K2 no segment counts as constant (a chord everywhere, even on a constant width) | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant K3 a chord's profile is the one at its START | ok | ok | same | narrowed (inferred) | 1.6 |
| mutant K4 a chord blends from its END profile (no change across the segment) | ok | ok | same | narrowed (inferred) | 1.4 |
| mutant K5 the segment is not marked as a chord (the readers do not evaluate its blend) | ok | ok | same | narrowed (inferred) | 0.8 |
| mutant K6 a chord's blend runs over twice the segment (its end row is not the end profile) | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant K7 a chord's weight is already 1 at its start | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant K8 the next piece and a flight take a chord's START as the last profile | ok | ok | same | whole (inferred) | 6.1 |
| mutant K9 a legacy piece's first row for the seam fade is its END | ok | ok | same | whole (inferred) | 3.8 |
| mutant K10 a legacy piece's last row for the seam fade is its START | ok | ok | same | whole (inferred) | 6.3 |
| mutant K11 the same-cross-section tolerance is 10 m (a width change is called constant) | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant K12 readsBlend leaves the chord out (readAt and the joint check take the target for the whole segment) | ok | ok | same | narrowed (inferred) | 0.8 |
| mutant K13 the water does not evaluate a chord's blend | ok | ok | same | narrowed (inferred) | 0.9 |
| mutant K14 jointSteps looks at cup segments only (a chord joint is not inspected) | ok | ok | same | narrowed (inferred) | 0.8 |
| mutant K15 a constant segment takes the profile at its END, not its middle (today's bytes change) | ok | ok | same | narrowed (inferred) | 0.8 |
| mutant M1 (K1a-1) a cup piece renders the legacy profile (the r cap applies) | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant M2 (K1a-2) only the left edge is cupped | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M3 (K1a-3) c is taken as radians | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M4 (K2-3) a non-cumulative shape: each quarter's own rise, not the running total | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M5 (K2-1) MAX raised to 165 | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M6 (K2-2) no guard on the document | ok | ok | same | narrowed (inferred) | 0.8 |
| mutant M7 the fit's ringing is not clamped after the Extend fit | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M8 Extend does not refuse a typed cup past 150 | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant M9 Extend does not refuse a first-piece cup past 150 | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M10 the brush has no cup channel | ok | ok | same | narrowed (inferred) | 0.9 |
| mutant M10b a cup that ends at a limit is not made flat (the next piece would need a control point past it) | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant M10c the document guard has no tolerance for a solver's float noise at the limit | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M29 (R2) no morph: a cup after a legacy piece starts on the cup shape, not the legacy one | ok | ok | same | narrowed (inferred) | 0.9 |
| mutant M30 (R2) the morph carries no difference (the legacy shape is dropped inside the road) | ok | ok | same | narrowed (inferred) | 0.9 |
| mutant M31 (R2) the morph never fades (the legacy difference stays for the whole piece) | ok | ok | same | narrowed (inferred) | 0.9 |
| mutant M11 (K3-1) c is left out of the joint test between two cup pieces | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M12 (K3-2) c is reset after a flight, like the heading rate | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant M13 (K3-3) c is left out of the closure rows | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant M14 (K3-4) a legacy piece hands over the family's nominal edge, not the one it renders | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M15 the legacy ↔ cup joint is not checked | ok | ok | same | narrowed (inferred) | 0.9 |
| mutant M16 a piece extended after a cup piece is a legacy piece | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M17 (K1b-1) the blend is dropped: each segment steps to its own profile | ok | ok | same | narrowed (inferred) | 1.7 |
| mutant M18 the weight inversion is wrong (z = y, no Newton polish) | ok | ok | same | narrowed (inferred) | 1.9 |
| mutant M19 a segment where c falls does not swap the pair | ok | ok | same | narrowed (inferred) | 1.9 |
| mutant M20 a width change is not a chord: the run keeps the start width | ok | ok | same | narrowed (inferred) | 2.2 |
| mutant M33 (R1) atSegment ignores the distance into the segment | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M34 (R1) the marker layout reads segment.profile | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M35 (R1) validation reads segment.profile | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant M36 (R1) the export sections read segment.profile | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant M37 (R1) the water reads segment.profile | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M38 (R1) the camera's span reads segment.profile | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M39 (R1) the readers evaluate a word document font-transition blend too (its validation and layout change) | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant M40 (R1) the adapter does not mark a cup segment (the readers then take its target for the whole segment) | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant M41 (R3) no reverse morph: a cup that closes onto a legacy start is drawn to its own shape | ok | ok | same | whole (inferred) | 7.8 |
| mutant M42 (R3) the reverse morph never fades in (the tail keeps the cup shape) | ok | ok | same | whole (inferred) | 7.6 |
| mutant M43 (R3) the reverse morph carries no difference (the legacy shape is dropped) | ok | ok | same | whole (inferred) | 7.7 |
| mutant M44 (R3) close() does not hold the cup at the legacy start edge | ok | ok | same | whole (inferred) | 8.9 |
| mutant M45 (R3) close() never refuses a seam it cannot fade | ok | ok | same | whole (inferred) | 17.5 |
| mutant M47 (R3) the mirror: a cup START does not fade out of the legacy END | ok | ok | same | whole (inferred) | 18.0 |
| mutant M50 (R3) a cup followed by a legacy piece inside the track is not faded (only the lap seam is) | ok | ok | same | whole (inferred) | 18.1 |
| mutant M48 (R3) validation does not red a joint step | ok | ok | same | whole (inferred) | 19.5 |
| mutant M49 (R3) jointSteps ignores the lap seam | ok | ok | same | whole (inferred) | 16.4 |
| mutant M21 a legacy piece is rendered as a cup piece at c = 0 | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant M22 a /2 piece is read as a cup piece | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant M23 a legacy piece's text carries a c array | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant M24 (K5-2) the schema is still core/2 | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant M25 a cup brush is allowed to reach a legacy piece | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant M26 (K6-3) the cup feeds the roll | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant M27 (K7-1) cupToDeg reads the wrong station of the document | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant M28 (K7-2) a legacy piece reads the nominal edge (w and r ignored) | ok | ok | same | narrowed (inferred) | 0.6 |
| J1 a core flight's gap is a hole again (gap-in-road) | ok | ok | same | narrowed (inferred) | 1.4 |
| J2 any core gap followed by road counts as a flight, with no pose on it (a planted hole is exempt) | ok | ok | same | narrowed (inferred) | 1.7 |
| J2b a landing behind its take-off is red again | ok | ok | same | narrowed (inferred) | 1.8 |
| J3 a track with a jump is refused again (NOT_YET) | ok | ok | same | narrowed (inferred) | 1.4 |
| J4 the landing is linked across the jump (its start not held) | ok | ok | same | narrowed (inferred) | 1.3 |
| J5 the close's model skips the flight (no displacement, no heading or pitch reset) | ok | ok | same | narrowed (inferred) | 3.0 |
| J6 the net pitch is not counted again from a jump, nor its turn added | ok | ok | same | narrowed (inferred) | 2.0 |
| J7 the landing pitch and the jumps' turns are left out of the net angles | ok | ok | same | narrowed (inferred) | 1.8 |
| J8 the model's pitch is not cut at the flight | ok | ok | same | narrowed (inferred) | 3.0 |
| J8c the model leaves out the landing's sideways offset turning with the take-off | ok | ok | same | narrowed (inferred) | 1.9 |
| J9 a lap that ends in a jump is not refused by name | ok | ok | same | narrowed (inferred) | 1.9 |
| J11 two jumps in a row are accepted by the document (land on road first not enforced) | ok | ok | same | narrowed (inferred) | 1.2 |
| J12 a landing that does not start level at its flight's bank is accepted | ok | ok | same | narrowed (inferred) | 1.2 |
| J13 a landing pitch past vertical is accepted | ok | ok | same | narrowed (inferred) | 1.1 |
| J14 an empty track is not refused by name | ok | ok | same | narrowed (inferred) | 1.2 |
| J15 a landing that is not the head is moved anyway | ok | ok | same | narrowed (inferred) | 1.3 |
| J16 the landing is not where its pose says (a metre further on) | ok | ok | same | narrowed (inferred) | 1.1 |
| J17 an old jump opens at its lip, its ramp forgotten (the roads after it move) | ok | ok | same | narrowed (inferred) | 1.1 |
| J18 the mirror of a saved jump does not cross to the other side | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant P1 a run of one piece is a run of two (to defaults to from + 1) | ok | ok | same | narrowed (inferred) | 1.5 |
| mutant P2 a run that ends before it starts is accepted (on an open track) | ok | ok | same | narrowed (inferred) | 1.4 |
| mutant P3 a run past the end of the track is accepted | ok | ok | same | narrowed (inferred) | 1.4 |
| mutant P4 a run of flights alone is saved | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant P5 a mixed run is saved | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant P6 the start is taken from the last road, not the first | ok | ok | same | narrowed (inferred) | 2.5 |
| mutant P7 a state is stored absolute, not as its change | ok | ok | same | whole (inferred) | 13.3 |
| mutant P8 a rate is stored as a change too (relative to its first point) | ok | ok | same | narrowed (inferred) | 2.0 |
| mutant P10 a state is put back without rounding (float noise comes back) | ok | ok | same | whole (inferred) | 79.3 |
| mutant P11 a shifted run still uses its own start (the shift is ignored) | ok | ok | same | whole (inferred) | 3.8 |
| mutant P12 the unused optional channels are not given their defaults | ok | ok | same | whole (inferred) | 13.0 |
| mutant P14 any schema is accepted | ok | ok | same | narrowed (inferred) | 1.9 |
| mutant P15 an unknown top-level field is dropped, not refused | ok | ok | same | narrowed (inferred) | 2.3 |
| mutant P16 a name with a path in it is accepted | ok | ok | same | narrowed (inferred) | 2.6 |
| mutant P17 a run of any length is accepted | ok | ok | same | narrowed (inferred) | 1.6 |
| mutant P18 a missing start is accepted | ok | ok | same | whole (inferred) | 3.4 |
| mutant P19 a first piece whose change does not start at 0 is accepted | ok | ok | same | whole (inferred) | 5.6 |
| mutant P20 knots out of order are accepted | ok | ok | same | whole (inferred) | 4.3 |
| mutant P21 knots outside the piece are accepted | ok | ok | same | whole (inferred) | 4.5 |
| mutant P22 a channel of the wrong length is accepted | ok | ok | same | whole (inferred) | 4.7 |
| mutant P23 a control point that is not a number is accepted | ok | ok | same | whole (inferred) | 5.0 |
| mutant P24 a piece that is a cup and a tube is accepted | ok | ok | same | whole (inferred) | 5.7 |
| mutant P25 an edge piece may carry e without s | ok | ok | same | whole (inferred) | 5.5 |
| mutant P26 a mixed run in a file is accepted | ok | ok | same | whole (inferred) | 5.3 |
| mutant P27 a start key the run does not carry is accepted | ok | ok | same | whole (inferred) | 3.4 |
| mutant P28 the document's own check of the run is skipped (a broken joint, a cup past its limit) | ok | ok | same | whole (inferred) | 5.4 |
| mutant P29 a flight with no gap is accepted | ok | ok | same | whole (inferred) | 5.7 |
| mutant P30 a run with no road is accepted | ok | ok | same | whole (inferred) | 6.3 |
| mutant P31 numbers are not quantised as they enter | ok | ok | same | narrowed (inferred) | 1.4 |
| mutant P32 a file of any size is read | ok | ok | same | whole (inferred) | 6.2 |
| mutant P33 a text that is not JSON throws something else | ok | ok | same | narrowed (inferred) | 1.5 |
| mutant P34 the canonical text lists the pieces before the start | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant P35 a parsed piece is not frozen | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant P36 a mirror does not turn the other way (kh) | ok | ok | same | whole (inferred) | 7.1 |
| mutant P37 a mirror does not flip the bank | ok | ok | same | whole (inferred) | 6.9 |
| mutant P38 a mirror does not flip the swerve | ok | ok | same | whole (inferred) | 7.4 |
| mutant P39 a mirror flips the climb too | ok | ok | same | whole (inferred) | 7.0 |
| mutant P40 a mirror flips the hill too | ok | ok | same | whole (inferred) | 7.0 |
| mutant P41 a mirror leaves the start bank as it was | ok | ok | same | whole (inferred) | 80.4 |
| mutant P42 a run that already joins the head is recomputed, not added as saved | ok | ok | same | whole (inferred) | 42.8 |
| mutant P43 every failure of the as-saved try falls through to the continuation, not only a joint | ok | ok | same | whole (inferred) | 4.0 |
| mutant P44 a legacy run after a cup or a tube is not refused by name | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant P45 keepStart on a head it does not meet says something else | ok | ok | same | narrowed (inferred) | 2.5 |
| mutant P46 keepStart is ignored (the run continues from the head anyway) | ok | ok | same | narrowed (inferred) | 2.5 |
| mutant P47 the slope of the joint is the head's over a half span, not a third | ok | ok | same | narrowed (inferred) | 2.7 |
| mutant P48 the joint takes the head's value only (no slope) | ok | ok | same | narrowed (inferred) | 2.7 |
| mutant P50 a tube after another kind starts from the head's t (0), not tNext | ok | ok | same | narrowed (inferred) | 1.4 |
| mutant P52 the joint values are taken from the saved start, not the head | ok | ok | same | narrowed (inferred) | 1.8 |
| mutant D1 a closed track can be deleted from | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant D2 a range one past the end is accepted | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant D3 a negative start is accepted | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant D4 a fractional start is accepted | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant D5 the near side keeps one piece too many | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant D6 the far side keeps one piece too many | ok | ok | same | narrowed (inferred) | 1.4 |
| mutant D7 the sides are never tried as they are | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant D8 the re-join carries no slope | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant D9 a tube after another kind is joined at the head's own sweep, not tNext | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant D10 the id counter is wound back | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant D11 a jump first is tried for a re-join | ok | ok | same | narrowed (inferred) | 1.3 |
| mutant D12 the re-join also resets the second-from-last control point (reshapes the far piece) | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant D13 a refusal does not say nothing was deleted | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant D14 the result is not frozen | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant P53 the turn is the integral of the climb | ok | ok | same | narrowed (inferred) | 1.4 |
| mutant P54 the integral's weights are wrong | ok | ok | same | narrowed (inferred) | 1.5 |
| mutant R2 'start' is the whole piece, not the first span | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R3 startRampM is a fixed 20 m even on a short piece | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R4 the extra ramp knots are not added | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R5 the short-ramp channel is left as the least-squares fit (it rings) | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R6 the ideal ramp is not compressed (the curve completes later than R) | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R7 the Greville abscissae are shifted (the hold is not exact and the ramp lags) | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R8 the joint's first two control points are overwritten too (C1 lost) | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R9 the range clamp is dropped (a continued slope can carry the ramp past its target) | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R10 a ramp as long as the piece counts as short (the whole-piece blend is replaced) | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R11 a channel with no target still gets the ramp treatment | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R12 an unknown channel in the map is accepted | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R13 a map value longer than the piece is accepted | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R14 a map value of zero or less is accepted | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R15 the number path no longer refuses a transition past the length | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R16 the number path uses a different default (half the piece) for no transition | ok | ok | same | narrowed (inferred) | 0.3 |
| mutant R17 the ramp control points are not rounded to the channel quantum (the document would not round-trip) | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant W1 normal force: gravity term dropped: applied, and CAUGHT | ok | ok | same | narrowed (inferred) | 2.5 |
| mutant W2 normal force: the cross term not doubled: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.1 |
| mutant W3 no velocity projection onto the tangent plane: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.3 |
| mutant W4 RK4: middle stages weighted 1, not 2: applied, and CAUGHT | ok | ok | same | narrowed (inferred) | 1.8 |
| mutant W5 spill: the −u lip never checked: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.3 |
| mutant W6 spill: the +u lip never checked: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.3 |
| mutant W7 lift-off never flagged: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.3 |
| mutant W8 shock never flagged: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.3 |
| mutant W9 quintic Hermite: a basis coefficient off: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.3 |
| mutant W10 frame slope: equal-spacing central difference: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.2 |
| mutant W11 profile: Y′ without the side's sign: applied, and CAUGHT | ok | ok | same | narrowed (inferred) | 2.6 |
| mutant W12 profile blend: no s-derivative: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.2 |
| mutant W13 spill located at the step's end, not inside it: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.2 |
| mutant W14 projection: Gauss–Newton step reversed: applied, and CAUGHT | ok | ok | same | narrowed (inferred) | 0.1 |
| mutant W15 energy instrument reads nothing: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.1 |
| mutant W16 the pos′ = T refusal disabled: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.2 |
| mutant W18 the pos′ = T check without the h²/12 correction: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.1 |
| mutant W19 a lifted sample's d1 ignored: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.1 |
| mutant W17 closed seam: the wrap sample not appended: applied, and CAUGHT | ok | ok | same | whole (inferred) | 3.2 |
| mutant KE1-1 G = t (the slice is a kink) | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KE1-2 the edge term is signed by the side (right side −e) | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE1-3 e is taken as radians | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE1-4 four intervals for the outer zone | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE1-5 the slice is placed at the full width, not the half-width (the edge is never reached) | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE2-1 the cap is applied to e alone, not the total | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE2-2 no guard on the edge in the document | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE2-3 s has no lower bound | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE2-4 the floor is not checked (a side may turn down past -30°, a lip) | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE2-5 extend does not refuse a target the cap cannot hold | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE2-6 the fit's ringing is not clamped (e) | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE2-7 a legacy piece's total cap ignores its own edge angle (e alone against 150) | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE3-3 the schema is still /3 | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE3-4 every piece's text carries e, s and t | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KE3-5 a /3 file is not read | ok | ok | same | narrowed (inferred) | 0.6 |
| mutant KE3-6 a text with an edge array is not read as an edge piece | ok | ok | same | narrowed (inferred) | 0.4 |
| mutant KE4-1 e is left out of the joint test | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant KE4-2 e is reset after a flight, like the heading rate | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant KE4-3 one blend start for the whole piece (the cup's run trick on a moving slice) | ok | ok | same | narrowed (inferred) | 0.8 |
| mutant KE4-4 no blend: one profile per segment (the stair-step) | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant KE4-5 the mesh ignores the piece's shared row grid (each segment samples its own rows: a zip inside the piece) | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant KE4-6 the chords do not share one fraction array | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant KE5-1 the csp-off steep check is dropped | ok | ok | same | whole (inferred) | 163.0 |
| mutant KE6-2 e is fed into the roll | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KE7-1 edgeToDeg reads the start of the piece | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KE7-3 a plain piece reads the wrong default slice | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT1-1 the tube's edge angle is t, not t/2 | ok | ok | same | narrowed (inferred) | 0.4 |
| mutant KT1-2 a tube HELD in the slot is not refused | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT1-3 the closure is 20 mm short of closing | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT1-4 the slot formula has no factor 2 | ok | ok | same | narrowed (inferred) | 0.4 |
| mutant KT1-5 a sweep past 360 is accepted | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT2-1 no morph into a tube from another kind (a zip with no fade) | ok | ok | same | narrowed (inferred) | 0.7 |
| mutant KT3-1 CUP_MAX is applied to an open tube's t/2 + e | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT3-2 a closed tube takes an edge | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT4-1 a cup and a tube are allowed together (extend) | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT4-2 a tube starts at the wrong edge after another kind (t = edge, not 2·edge) | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT4-4 endState reports t at a non-tube head (twice the edge, the internal value leaks) | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT4-5 a tube after another kind starts from the head's t (0), not from tNext | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KT4-3 a cup after a closed tube is not refused by name | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KS2-1 the roll stays the per-segment smoothstep under a heartline | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KS2-2 the heartline is a constant per segment (a step between segments) | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KS2-3 a closed tube carries heartline 0 | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant KS2-4 the heartline ramp starts at 180 (a step where a tube hands over to a cup) | ok | ok | same | whole (inferred) | 5.1 |
| mutant KS2-5 water over a heartline is an anonymous throw | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KS3-1 the roll rate is read over a 0.5 m chord | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KS3-2 the bar is raised to 2.0 | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant KS3-3 the gravity-frame φ′ is read instead of the frame-intrinsic rate (blind on a climbing turn at constant bank) | ok | ok | same | narrowed (inferred) | 0.9 |
| mutant KS3-4 the amber bar is dropped | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KS3-5 the roll rate is never checked | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KS4-1 the spiral's curvature is not given to the validator (kvec of the integrated curve) | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant KS4-2 a lifted sample keeps only its own fields (spread of a view) | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KV1 tube-too-narrow is never raised | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KV2 the narrowest tube bar is 5 m | ok | ok | same | narrowed (inferred) | 1.0 |
| mutant KV2b the narrowest tube bar is the old 9.43 (the eye on the ceiling) | ok | ok | same | narrowed (inferred) | 1.1 |
| mutant KV3 edge-past-cap is never raised | ok | ok | same | narrowed (inferred) | 1.2 |
| mutant KC1 close does not refuse a seam that joins a tube to another kind | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KC2 close does not refuse an edge active at one end only | ok | ok | same | narrowed (inferred) | 0.5 |
| mutant KC3 close moves e (it joins e at a seam where only one end has it) | ok | ok | same | narrowed (inferred) | 0.8 |
| mutant KB1 an e brush may reach a piece without an edge | ok | ok | same | narrowed (inferred) | 0.5 |
| M1 the unrolled left from up × T (the level left): undefined at a vertical tangent | ok | ok | same | narrowed (inferred) | 0.3 |
| M2 the unrolled left does not follow the heading (it stays the start's) | ok | ok | same | narrowed (inferred) | 0.3 |
| M3 fold check disabled (margin ≤ 0 never fires) | ok | ok | same | narrowed (inferred) | 0.3 |
| M4 chord-error limit removed from the adaptive step | ok | ok | same | narrowed (inferred) | 0.3 |
| M5 normals clamped at 90° (ψ past vertical treated as vertical) | ok | ok | same | narrowed (inferred) | 0.3 |
| M6 zero-length word accepted | ok | ok | same | narrowed (inferred) | 0.3 |
| M7 cell vertex cap removed | ok | ok | same | narrowed (inferred) | 1.3 |
| M8 extendPath keeps the old open end (the seam sample is not re-emitted) | ok | ok | same | narrowed (inferred) | 0.5 |
| M9 extendMesh makes no seam onto the first new piece | ok | ok | same | narrowed (inferred) | 0.6 |
| M10 extendMesh remeshes every piece (right answer, cost grows with the track) | ok | ok | same | narrowed (inferred) | 2.0 |
| M11 sculptMesh never reuses a downstream piece (right answer, cost grows with the track) | ok | ok | same | narrowed (inferred) | 1.8 |
| M12 sculpt reuse ignores the start pitch | ok | ok | same | narrowed (inferred) | 0.4 |
| M13 a moved piece's seam keeps its old placement | ok | ok | same | narrowed (inferred) | 0.7 |
| M14 a moved piece's boundary rows are not recomputed for the seam beside the sculpted piece | ok | ok | same | narrowed (inferred) | 0.7 |
| M15 rebuildPathFrom regrows from the path start instead of segment g (right answer, path cost grows) | ok | ok | same | narrowed (inferred) | 0.4 |
| M16 coplanar triangles never meet (the 2D branch disabled) | ok | ok | same | narrowed (inferred) | 0.3 |
| M17 the same-pass rule dropped (neighbouring cells tested against each other) | ok | ok | same | narrowed (inferred) | 0.4 |
| M18 the BVH skips the last triangle of every leaf | ok | ok | same | narrowed (inferred) | 0.5 |
| M19 the stacked reach is misread (gap scaled ×4) | ok | ok | same | narrowed (inferred) | 0.4 |
| M20 ramps ignored in the mesh (a font jumps at the seam) | ok | ok | same | narrowed (inferred) | 0.3 |
| M21 the width does not ramp (the blend jumps to the new width) | ok | ok | same | narrowed (inferred) | 0.3 |
| M22 a piece never inherits the previous font | ok | ok | same | narrowed (inferred) | 0.3 |
| M23 the ramp ends early (w reaches 1 at half the ramp) | ok | ok | same | narrowed (inferred) | 0.4 |
| M26 the self-check finds cell records by NAME again | ok | ok | same | narrowed (inferred) | 0.3 |
| M27 the self-check groups findings by cell NAME | ok | ok | same | narrowed (inferred) | 0.4 |
| M24 the document blend offset s0 ignored (a transition split across segments restarts) | ok | ok | same | narrowed (inferred) | 0.4 |
| M25 blend: null overridden by the geometry's own inheritance | ok | ok | same | narrowed (inferred) | 0.3 |
| R1 the tail is always regrown (nothing is ever re-placed) | ok | ok | same | narrowed (inferred) | 0.4 |
| R2 a re-placed block keeps its old placement (its views never move) | ok | ok | same | narrowed (inferred) | 0.4 |
| R3 the tail test ignores the start pitch | ok | ok | same | narrowed (inferred) | 0.4 |
| R4 the tail's first-sample indices are not advanced | ok | ok | same | narrowed (inferred) | 0.4 |
| R5 the tail stops regrowing after one block (the rest is re-placed although its inputs differ) | ok | ok | same | narrowed (inferred) | 0.4 |
| R7 an append does not drop the old open end from its block's count | ok | ok | same | narrowed (inferred) | 0.3 |
| R8 a segment's roll is not part of its path handles (a roll edit downstream is taken as unchanged tail) | ok | ok | same | narrowed (inferred) | 0.3 |
| R9 a placed sample turns its y component too (the bank against gravity drifts) | ok | ok | same | narrowed (inferred) | 0.4 |
| K1 CIEDE2000 without its lightness weight SL | ok | ok | same | narrowed (inferred) | 0.3 |
| K2 CIEDE2000 without the a* rescaling G | ok | ok | same | narrowed (inferred) | 0.3 |
| K3 CIEDE2000 without the blue-region rotation term RT | ok | ok | same | narrowed (inferred) | 0.3 |
| K4 the mask reads only one image's alpha | ok | ok | same | narrowed (inferred) | 0.3 |
| K5 an anchor pointing backwards is not turned round | ok | ok | same | narrowed (inferred) | 0.3 |
| K6 yaw turns right, not left | ok | ok | same | narrowed (inferred) | 0.3 |
| K7 meshes AC flags invisible are drawn | ok | ok | same | narrowed (inferred) | 0.3 |
| K8 the kn5 v is flipped on reading (a texture upside down) | ok | ok | same | narrowed (inferred) | 0.3 |
| K9 DXT1 without its 3-colour mode | ok | ok | same | narrowed (inferred) | 0.3 |
| K10 the mip level ignores maxSide | ok | ok | same | narrowed (inferred) | 0.3 |
| K11 no depth test | ok | ok | same | narrowed (inferred) | 0.3 |
| K12 a triangle through the near plane is dropped, not clipped | ok | ok | same | narrowed (inferred) | 0.3 |
| K13 the alpha test ignored | ok | ok | same | narrowed (inferred) | 0.3 |
| K14 no fog | ok | ok | same | narrowed (inferred) | 0.3 |
| K15 a render into the repository is allowed | ok | ok | same | narrowed (inferred) | 0.3 |
| X1 stripes ignore their width | ok | ok | same | narrowed (inferred) | 2.2 |
| X2 stripes ignore their offset | ok | ok | same | narrowed (inferred) | 2.4 |
| X3 stripes point-sampled instead of integrated | ok | ok | same | narrowed (inferred) | 2.1 |
| X4 lane lines ignore their dashes | ok | ok | same | narrowed (inferred) | 2.3 |
| X5 grain cells do not follow the pixels (one sample per pixel) | ok | ok | same | narrowed (inferred) | 1.5 |
| X6 gradient bands point-sampled instead of integrated | ok | ok | same | narrowed (inferred) | 2.3 |
| X7 panel seams not centred on the boundaries | ok | ok | same | narrowed (inferred) | 2.5 |
| X8 the glow falloff ignored (a hard strip) | ok | ok | same | narrowed (inferred) | 2.3 |
| X9 the emissive flag ignored | ok | ok | same | narrowed (inferred) | 2.5 |
| X10 a decal ignores its quarter turn | ok | ok | same | narrowed (inferred) | 2.1 |
| X11 "along" stamps only one copy | ok | ok | same | narrowed (inferred) | 2.1 |
| X12 the noise lattice does not wrap (the texture would not tile) | ok | ok | same | narrowed (inferred) | 2.2 |
| X13 numbers printed by float formatting | ok | ok | same | narrowed (inferred) | 2.2 |
| X14 unknown keys in a layer accepted | ok | ok | same | narrowed (inferred) | 2.2 |
| X15 gradient stops need not ascend | ok | ok | same | narrowed (inferred) | 2.3 |
| X16 no upper limit on the render size | ok | ok | same | narrowed (inferred) | 2.2 |
| X17 the hash is not deterministic | ok | ok | same | narrowed (inferred) | 2.5 |
| X18 the noise amount ignored | ok | ok | same | narrowed (inferred) | 2.4 |

rows: 579 · same verdict: 579 · different: 0 · narrowed: 523 · whole: 56 · path inferred from duration: 372 · in 0.4.8 but not in this run: 0
