# REGISTRATION · L131-E · the Blender-style UI refactor: the inventory and the layout check, sealed BEFORE any refactor code (pane E, on L, 2026-09-29)

**The plan:** `exo_memory/loop/plan_t180_camera_readout_2026-09-29.md`, blocks "NEXT LAP" and "L131" (sha256 `c9da383656d12b9a…`
as read at this seal).

**The keeper's words (04:10):** "remove the water feature for now", "a whole UI refactor, i want the preview to be the center of
attention almost full screen, AIM for blender ui style but with our own taste".

**What was read:**
- the t180 repo on L, `C:\Users\zackn\Downloads\t180-track-builder` at `1d68a86`, plus the uncommitted camera work;
- C's worktree `C:\Users\zackn\AppData\Local\Temp\c-l130-wt`, for the readout's current UI (`app/core/panel.js`, `labels.js`);
- nothing was written into either.

**Not found:** the plan says the librarian's ASCII sketch (04:1x) was copied into "NEXT LAP". That block holds the layout in PROSE,
with no ASCII. This seal works from the prose.

## G · THE GOVERNING CHECK
> **The keeper's first use of the refactored build.**

- Every test below is necessary, not sufficient.
- His first words on the new layout are recorded verbatim. A "no", "I can't find X", or "the preview still isn't the centre" is a
  **FAIL of the refactor**, whatever L1–L7 score.
- Until he has used it, every report says: **UNVERIFIED BY ITS GOVERNING CHECK**.
- A seat may ask him plainly: *"is the preview the centre now, and can you reach everything you used before?"*

## 1 · THE INVENTORY: what the app shows today, and where each item goes

**The layout it moves into** (the plan's "NEXT LAP"):
- **HEADER**, a thin bar;
- **LEFT**, the tool strip (T toggles it);
- **RIGHT**, the properties panel (N toggles it), with collapsible sections;
- **STATUS**, the bottom bar;
- **VIEWPORT**, the preview and what is drawn in it;
- **REMOVED**, deliberately;
- **PIECES**, shown only in the paused pieces builder.

"C·" marks an item from C's L130 worktree, not yet on main.

**Today's layout,** for the baseline (`app/index.html` :13):
- columns 280 px | 1fr | 300 px; rows 44 px header | banner (auto) | 1fr;
- the camera bar sits under the viewport inside `#stage`.

### 1a · The page (`app/index.html`)
| # | control / panel | builder | goes to |
|---|---|---|---|
| H1 | builder picker `#mode` (Equation track / Pieces (paused)) | both | HEADER |
| H2 | New | both | HEADER |
| H3 | track name `#name` | both | HEADER |
| H4 | Save (Ctrl+S) | both | HEADER |
| H5 | Open… `#open` | both | HEADER |
| H6 | Export… | both | HEADER |
| H7 | `#install`: Install to AC · AC folder… · See it in Assetto (`app/install`) | pieces only today | HEADER, PIECES (the refactor does not add it to the equation builder) |
| H8 | `#status`: name · dirty dot · closed loop | both | STATUS (the dirty dot also beside H3) |
| H9 | `#banner`: the recovery offer (Restore it / Discard it) | pieces | PIECES; a full-width bar between the header and the viewport, as today |
| H10 | `#reds`: "Not exported: red on the track" | both | RIGHT, the **Validation** section, at its top |

### 1b · The equation builder (`app/core/panel.js`, in `#palette`; C's worktree version)
| # | control | goes to |
|---|---|---|
| E1 | heading + `info`: pieces · length m · open/closed · last op ms | STATUS (piece count, track length, open/closed, last op) |
| E2 | Undo, Redo buttons | HEADER (Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z unchanged) |
| E3 | **Extend** (button) | LEFT, the **Extend** tool; its button, "Extend", in RIGHT's Extend section |
| E4 | Extend fields: length m, turn °/100m, climb °/100m, bank °, width m | RIGHT, the **Extend** section (the active tool's fields) |
| E5 | C· the readout box (length / turn / climb / bank change; `aria-label` "the piece Extend would add") | RIGHT, the **Extend** section, beside E4 |
| E6 | **Brush** "on" checkbox | REPLACED: choosing the Brush tool in LEFT arms it, and choosing another tool disarms it. Deliberate; see L4 |
| E7 | Brush fields: mode, what (channel), radius m, sharp (with its declared spill in the tooltip) | RIGHT, the **Brush** section |
| E8 | **Close the loop** | LEFT, the **Close** tool (one click acts, as today; disabled when closed or empty) |
| E9 | Water: on, km/h, streams, and the water's reds and clean-ride lines | **REMOVED** (the keeper, 04:10). `src/core/water.js` stays, paused, until B's L131 bank-onset fix |
| E10 | Local example: fit file, read file, Open example | RIGHT, a collapsible **Open example (local)** section, closed by default |
| E11 | `msg`, the status and error line | STATUS (the message) |

### 1c · The viewport and the camera
| # | control | goes to |
|---|---|---|
| V1 | the preview canvas `#preview` (and its "Loading the preview…" placeholder) | VIEWPORT |
| V2 | the ghost (Extend's candidate) | VIEWPORT |
| V3 | C· the per-piece labels (`app/core/labels.js`, a DOM layer over the preview) | VIEWPORT (the plan: they stay) |
| V4 | the preview HUD: mode view · AC look / word colours (L) · error | STATUS (camera mode, look, error) |
| V5 | camera buttons: Build, Overhead, Side, Chase, Free (`app/camera`) | HEADER (the plan: "camera buttons") |
| V6 | the camera key line: "C: next camera · B: build view · move W A S D, Q E down/up, Shift sprint · look: right-drag or arrows · zoom: scroll" | STATUS (the plan: "camera mode + its keys") |
| V7 | brush picking: pointer-down on the track with Brush armed | VIEWPORT (unchanged) |
| V8 | `#guide`, the five-step first track (`app/onboarding`) | PIECES (mounted only by the pieces builder today) |

### 1d · The side column (`#side`)
| # | control / panel | builder | goes to |
|---|---|---|---|
| S1 | **Validation** (`app/validate-ui`): red and amber summary, design-speed picker, CSP toggle, the lap, the jumps | both | RIGHT, the **Validation** section (open by default) |
| S2 | **Handles** (`app/handles`): per-word sliders, Show bounds | pieces | PIECES (RIGHT, as a section, in the pieces builder) |
| S3 | **Textures** (`app/texture`, with `app/texmaker` via "Make…"): add, save look as pack, per-slot texture, tiling, fit/tile, offset | pieces | PIECES (RIGHT, the **Textures** section, in the pieces builder). Not added to the equation builder by this refactor |
| S4 | **Share** (`app/share`): Copy code, Paste code | pieces | PIECES (RIGHT, the **Export** section, in the pieces builder) |

### 1e · The pieces builder's own column (`#palette` in pieces mode, `app/palette`)
| # | control | goes to |
|---|---|---|
| P1 | the word palette, pickers, place, remove head, select / save selection, close loop (the pieces builder's) | PIECES: LEFT and RIGHT in the pieces builder, or kept as its own column, the author's choice. It must stay reachable (L4) |

### 1f · New, named by the plan, not in today's app
| # | item | goes to |
|---|---|---|
| N1 | the **Piece list** section: every placed piece with its readout (length · Δturn · Δbank) | RIGHT, collapsible, open by default |
| N2 | the left strip's tool buttons: Extend, Brush, Close (Mirror is queued, not dispatched: not required here) | LEFT |
| N3 | a click affordance for each side panel's collapse (besides T / N) | on each panel's edge |

### 1g · Not shown today (out of scope, listed so they aren't lost)
- `app/markers`: no mount in `app/index.html`, so its panel is not shown by either builder.
- `app/testhook`: a test seam.

## 2 · THE CHECKS, each with what makes it FAIL

**The window for every check:** the real app window, at a client area of **1400 × 860** (the default) and again at **1920 × 1080**,
at 100% display scaling. L5 and L7 are repeated at 150% scaling.

### L1 · THE VIEWPORT'S SHARE ("almost full screen")
**The share** = the preview's drawing area (`#preview`'s canvas `getBoundingClientRect`, width × height) ÷ the window's client
area (`innerWidth × innerHeight`).
- **Cross-checked in pixels:** a PrintWindow capture (`scripts/prove_render.ps1 -Rect`) of that rect counts drawn pixels over at
  least 95% of it, so the canvas really fills the box it reports.

| state | 1400 × 860 | 1920 × 1080 |
|---|---|---|
| **both panels open** (the default) | **≥ 65%** | **≥ 72%** |
| **N (right) collapsed** | **≥ 85%** | **≥ 88%** |
| **both collapsed** ("almost full screen") | **≥ 90%** | **≥ 93%** |

- **"Almost full screen" is registered as ≥ 90% with both panels collapsed.**
- **Today's figure, for comparison, is INFERRED from the CSS, not measured:** (1400 − 580) × (860 − 44 − the camera bar, about 60)
  ÷ (1400 × 860) ≈ **52%**. The first run of L1 measures it at `1d68a86` and records it beside the new figure.
- **FAIL:** any cell under its number, or a pixel cross-check under 95%.

### L2 · BOTH SIDE PANELS COLLAPSE (T / N)
- **T** toggles the left strip and **N** the right panel. Each also has a click affordance (N3).
- **Collapsing grows the viewport the same frame:** the canvas's backing size follows its new rect (`backingSize`), with no
  stretched frame.
- **Reopening restores the panel as it was:** field values, which sections are open, and the scroll position.
- **FAIL:** a key that does not toggle; the viewport not growing; state lost on reopen.

### L3 · THE KEYS
| key | does | where |
|---|---|---|
| T | toggle the left tool strip | NEW |
| N | toggle the right panel | NEW |
| Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z | undo / redo / redo | unchanged |
| Ctrl+S | save | unchanged |
| Ctrl+Backspace | remove the head (pieces) | unchanged |
| W A S D, Q E, Shift | fly, down/up, sprint | unchanged |
| arrows, right-drag | look | unchanged |
| C / B | next camera / build view | unchanged |
| L | AC look / word colours | unchanged |
| scroll | zoom | unchanged |

- **With focus in a text field** (typing the track name, a field value), T and N type letters and do NOT toggle, exactly as the
  preview already ignores W/A/S/D there (`preview.js` onKey).
- **No key has two actions.** T and N are unbound at this seal: no handler in `app/` matches `'t'`, `'n'`, `KeyT` or `KeyN`
  (`grep`).
- **FAIL:** any unchanged key changed; T or N toggling while typing; any collision.

### L4 · EVERY INVENTORIED CONTROL IS REACHABLE, OR DELIBERATELY REMOVED
**Reachable** means: from the default state, a control is VISIBLE (a non-zero rect, not `display:none`, not scrolled out with no
scrollbar) after **at most two clicks**, where opening a collapsed section or a panel counts as one. Also, a key is listed for it
in L3 if it had one.

**The test** walks §1's table by each control's accessible name (`aria-label`, `title` or text) and scores every row:
- every row marked HEADER, LEFT, RIGHT, STATUS or VIEWPORT is found in that region, in the equation builder;
- every PIECES row is found in the pieces builder;
- **REMOVED rows (E9 only) are absent from both builders.** `src/core/water.js` and its tests remain in the repo, unchanged
  (`git diff --stat` shows no deletion).
- **REPLACED rows (E6)** work in their new form: choosing Brush arms picking, and choosing Extend disarms it.

**FAIL:** any row not found where §1 says; any removed control still shown; any file under `src/core/water.js` deleted.

### L5 · THE READOUT LANDS IN THE RIGHT PANEL
- The readout (E5, `aria-label` "the piece Extend would add") is a descendant of the right panel's Extend section, visible whenever
  Extend is the active tool.
- The per-piece labels (V3) stay in the viewport.
- **L130's sealed readout check** (`readout_check_registration_2026-09-29.md`, sha256 `57448e2a…`) is RE-RUN after the move:
  M1–M6 and its controls, unchanged. The panel moved, so M2, M3 and M5 (d) are re-scored where it now sits.
- **FAIL:** the readout anywhere but the right panel; any L130 check that passed before the move failing after it.

### L6 · LEGIBILITY, and how it is measured
Measured in **pixels of a PrintWindow capture** of the real window (`scripts/prove_render.ps1`), never from the CSS. It covers every
text in HEADER, LEFT, RIGHT and STATUS, at 1400 × 860, at 100% and at 150% scaling:
- **(a) Ink height:** the tallest glyph's rows of pixels differing from the background by more than 12 summed |dRGB| within the
  control's rect. **≥ 9 device px** for UI text; **≥ 11** for the readout (as L130's M5).
- **(b) Contrast:** WCAG 2.x relative luminance, the median ink pixel against the median background pixel, **≥ 4.5 : 1**.
- **(c) Nothing clipped silently:** a text wider than its box (`scrollWidth > clientWidth`) shows its whole text as a `title`.
- **(d) Icons:** every tool in LEFT has a visible text label OR a tooltip naming it and its key. An icon with neither fails.

**FAIL:** any text under its height or under 4.5 : 1; a clipped text with no title; an unnamed tool.

### L7 · NO HARM
- The full suite and `app/test/mutation.test.js` stay green under the heavy-run lock at 4 GB.
- L130's readout checks stay green (L5).
- **The pieces builder still starts and works:** every PIECES row found (L4).
- **FAIL:** any new red; the pieces builder failing to start.

## 3 · THE CONTROLS (the checker must have teeth; each planted in a COPY and run before scoring)

| control | planted fault | must fail |
|---|---|---|
| U1 | the right panel set to 520 px wide | L1 (both open, 1400 × 860) |
| U2 | N bound but the canvas not resized | L2 |
| U3 | T also bound while typing | L3 |
| U4 | the Validation section removed | L4 |
| U5 | the readout left in the left strip | L5 |
| U6 | the status bar text at 8 px ink | L6 (a) |
| U7 | the water checkbox left in | L4 (a removed row shown) |

**A check whose control passes is VOID** for that run, and says so.

## 4 · The verdict
- **The refactor PASSES its tests** when L1–L7 pass and every control fails as it should.
- **It WORKS** only when the keeper's first use (G) says so, in his words.
- The scoring reader is a non-author seat: not the refactor's author, and not E, which wrote this seal.
- Every report carries both lines: the test result, and G as **UNVERIFIED** until he has spoken.

## 5 · What this does NOT decide
- Colours, fonts, icons and exact widths. Only the limits the checks name.
- Which pane builds which region: the plan says that split comes first. This seal is region-by-region so the split can follow it.
- It does not register Mirror, direct manipulation at the head, or modal keys (all queued, not dispatched).
- It does not bring water back. That waits for B's L131 bank-onset fix.
