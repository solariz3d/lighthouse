# REGISTRATION · L130 · the degrees/metres readout: what "works" means, sealed BEFORE the display is built (pane E, on L, 2026-09-29)

**The plan:** `exo_memory/loop/plan_t180_camera_readout_2026-09-29.md`, "Part 2" (sha256 `7d043f38cd4e12f8…` as read at this
seal).
- **A** builds the numbers: `src/core/readout.js` `pieceReadout(doc, i)` and the same for an Extend candidate.
- **C** builds the display: `app/core/panel.js`, plus a label in the preview through its overlay or HUD.
- **Repo on L:** `C:\Users\zackn\Downloads\t180-track-builder` at `1d68a86`, plus the uncommitted camera work.
- **Written before any readout code exists:** `src/core/readout.js` is absent at this seal (`ls src/core`), and so is any label
  code in `app/`.

**The keeper's words** (01:27–01:29, from the plan): *"see the degrees of change when adjusting the banking, pitch, and roll and
even turns"*; *"DISTANCE OF EACH PIECE IN METERS SO YOU CAN SEE WITH THE DEGREE UI"*.

## G · THE GOVERNING CHECK (the plan's own words, kept verbatim)

> **"If the keeper still cannot tell a piece's degrees while adjusting, the display failed whatever the tests say."**

**What this means for every test below:** they are NECESSARY, not sufficient. They can show the display is wrong; they can never
show it works. Only the keeper can.

**Recorded as:**
- the first time the keeper uses the landed build, his words about the readout are copied VERBATIM into the lap's record;
- a "no", or "I can't tell", or equivalent, is a **FAIL of L130's readout**, even at 100% on M1–M6;
- **nobody else reads his words for him.** A seat may ask him one plain question, *"while you adjust turn, climb and bank, can
  you tell each piece's degrees and length?"*, and records the answer as given. It is scored as he says it, not as a seat
  paraphrases it.

Until he has used it, L130's readout is **UNVERIFIED BY ITS GOVERNING CHECK**, whatever M1–M6 score, and every report says so in
those words.

## 0 · Definitions

- **A's numbers:** `R = pieceReadout(doc, i)`, or A's candidate readout for the Extend fields: `{ lengthM, turnDeg, climbDeg,
  bankFromDeg, bankToDeg, pitchFromDeg, pitchToDeg }`. A's signs are the document's: turn + = left, climb + = nose up, bank +
  = left side up.
- **Δbank** = `bankToDeg − bankFromDeg`. **Δpitch** = `pitchToDeg − pitchFromDeg`, which equals `climbDeg` up to A's own
  rounding; the check reads whichever one C displays, and C says which.
- **A DISPLAYED value** is the TEXT the user sees, parsed back to a number. It is never C's internal variable. C must expose, for
  the tests, the strings it drew and their screen rectangles. The proposed shape is `preview.labels()` →
  `[{ piece, text, rect: { x, y, w, h } }]`, plus the panel's DOM text, but the shape is C's to choose. A test that reads C's
  state instead of the drawn text scores nothing.
- **What must be displayed:**
  - **the panel (the ghost):** length (m), Δturn (°), climb (°), Δbank (°), all four;
  - **the placed label, per the plan:** length · Δturn · Δbank.
  - The keeper also said "pitch". If a placed label omits climb, G is where that is judged, and this registration flags it as the
    likeliest cause of a G fail.
- **The format:** one decimal place, the unit written (`m`, `°`), and an explicit sign on angles (`+12.5°`, `−3.0°`; `0.0°`
  unsigned).
- **W, the build head:** `track.path.head` (or the ghost's head when nothing is placed), drawn by `look.js` `headMarker`.
- **Zoom:** the camera's `ZOOM` factor (`app/camera/cameras.js` :48), min 0.05 (nearest), max 50 (farthest), 1 the default.
- **The modes:** build (default), overhead, side, chase, free (`app/camera/cameras.js`).

## 1 · The fixtures (fixed now, so they cannot be chosen after the fact)

- **P, the placed-piece set:** generated tracks 0–4 of the D185 generator, seed 185, mulberry32, as landed in the t180 repo:
  `test/core_helpers.js` `gen()` (in `17c2301`; on D its output was checked byte-identical to B's sealed `gen_tracks.json`, which
  is not on L). Each is built with `docFrom()` (the core's extend, piece by piece) and left open. That is
  **43 road pieces (11 + 10 + 9 + 7 + 6)**, every one labelled. On L, sha256 of `JSON.stringify(gen())` is `c7e1145ce5775b32…`.
- **E, the Extend field sets:** the 12 below, each typed into the panel of a track that already holds generated track 0's first
  3 pieces:

| # | length m | turn | climb | bank | why |
|---|---|---|---|---|---|
| 1 | 100 | 0 | 0 | 0 | a straight: every Δ reads 0.0 |
| 2 | 150 | +90 | 0 | 0 | a quarter turn left |
| 3 | 150 | −90 | 0 | 0 | the sign: right |
| 4 | 400 | +180 | 0 | +30 | a hairpin with bank |
| 5 | 60 | +45 | +8 | −15 | everything at once, bank the other way |
| 6 | 20 | +5 | 0 | 0 | short: the label must not swamp the piece |
| 7 | 2000 | +720 | 0 | 0 | long, two turns: no wrap to ±180 |
| 8 | 300 | 0 | −12 | 0 | a descent |
| 9 | 300 | 0.04 | 0 | 0 | rounding: must read `0.0°`, not `+0.0°` / `−0.0°` flicker |
| 10 | 300 | 0.06 | 0 | 0 | rounding the other side: `+0.1°` |
| 11 | 250 | −33.35 | +2.25 | +12.45 | halves on the 0.1 boundary: the display rounds as A's value rounds, half away from zero |
| 12 | 180 | +60 | 0 | +89 | near-vertical bank |

  The field units are those the panel shows; if a field is a TARGET rather than a change, C writes the equivalent target, and
  the check compares against A's candidate readout for what was actually typed.
- **S, the edit sequence** (for M2): 30 single-field edits from `mulberry32(130)`, each a field (length / turn / climb / bank)
  and a value within the fixture ranges, applied one `input` event at a time.

## 2 · The checks (each with what makes it FAIL)

### M1 · MATCH
**Every displayed number equals A's to the display's precision.**
- For every piece in P, the label's numbers, and for every set in E, the panel's four numbers: |parsed − A| ≤ **0.05** (m or °)
  + 1e-9. That is "to 0.1 m / 0.1°", read as the display rounding A's own value.
- Signs match A's.
- **FAIL:** any single number off by more than 0.05; a sign flipped; a missing unit; turn in E7 shown as anything but
  `+720.0°`; or E9 shown with a sign.

### M2 · LIVE
**The ghost's readout follows the fields.**
- After each of the 30 edits in S, once the `input` handler has returned (no timer, no frame wait), the panel's numbers equal A's
  candidate readout for the fields as they now stand (M1's tolerance).
- **FAIL:** any step shows the PREVIOUS fields' values (stale), or blank, or an error string for a valid field set.

### M3 · GHOST = PLACED
**What the ghost promised is what gets placed.**
- For every set in E: read the ghost's numbers, press Extend, then read the new last piece's label.
- Each value on the label (length, Δturn, Δbank) is the **identical string** the ghost showed for that value.
- **FAIL:** any difference in any string.

### M4 · THE HEAD IS NEVER HIDDEN
**In every mode × zoom {0.05, 1, 50}**, with P's track 0 placed and E4's ghost showing:
- **geometric:** the head marker's projected screen position, plus a 6-pixel margin, lies inside NO drawn label's rectangle;
- **pixel, one capture per mode at zoom 1:** a PrintWindow capture of the real window (`scripts/prove_render.ps1 -Rect`, a 15×15
  client-pixel box centred on the projected head) counts at least **80%** of the drawn pixels the same box counts with labels
  turned off.
- **FAIL:** any overlap in any of the 15 mode × zoom cases, or a capture under 80%.

### M5 · LEGIBLE AT ZOOM 0.05 AND 50
**Measured in PIXELS of a PrintWindow capture of the real app window** (`scripts/prove_render.ps1`). Nothing is taken from the
code's font setting. Each of the 5 modes at zoom 0.05 and at 50, with P's track 0 and E4's ghost:

- **(a) Size:** for every drawn label, the height of its text's ink (the tallest glyph's rows of pixels differing from the label's
  background by more than 12 summed |dRGB|, within the label rect) is **≥ 11 device pixels**.
- **(b) Contrast:** between the label's text and its background, **≥ 4.5 : 1** (WCAG 2.x relative-luminance contrast, the text's
  median ink pixel against the rect's median background pixel).
- **(c) No overlap:** no two drawn labels' rectangles intersect. A label may be HIDDEN to avoid overlap (culled); that is allowed,
  but reported.
- **(d) Never nothing:** at every zoom the PANEL (the ghost's readout) passes (a) and (b), and at least the label of the piece
  ending at the head is drawn.
- **(e) Culled share, reported not judged:** at zoom 50 the share of P's track-0 labels culled, printed. If more than half the
  labels are culled at zoom 1, that is flagged for G, not failed here.

**FAIL:** any drawn label under 11 px or under 4.5 : 1; any two drawn labels intersecting; the panel failing (a) or (b); or the
head's own label missing at any zoom.

### M6 · NO HARM
- The full suite and `app/test/mutation.test.js` stay green under the heavy-run lock at 4 GB.
- A flight piece, or a document with none placed, draws no label and throws nothing.
- **FAIL:** any new red test; any throw.

## 3 · The controls (the checker must have teeth, run BEFORE scoring C's display)

Each control plants a known fault in a COPY of C's display and must be CAUGHT by the named check:

| control | planted fault | must fail |
|---|---|---|
| K1 | the panel shows the PREVIOUS edit's numbers | M2 on at least 25 of the 30 steps |
| K2 | the turn sign flipped | M1 |
| K3 | one label placed exactly on the head | M4, geometric |
| K4 | the label font set so its ink is 7 px | M5 (a) |
| K5 | the label text colour equal to its background plus 10 in each channel | M5 (b) |

**If any control passes, that check is VOID** (it cannot see what it claims to), and the result says VOID for it, not PASS.

## 4 · The verdict, and who reads it

- **The readout PASSES its tests** when M1–M6 all pass and every control fails as it should.
- **It WORKS** only when it also passes **G**, in the keeper's own words.
- The scoring reader is a non-author seat (not C, not A). This seal is E's, so E does not score C's display either.
- Every report carries both lines: the test result, and G as **UNVERIFIED** until the keeper has spoken.

## 5 · What this registration does not do

- It does not choose C's layout, font, colour or culling rule. It only states what a pass must survive.
- It does not register the camera (Part 1: B's review).
- It does not cover the queued, undispatched items (the flowing joint, roll, the old close bug).
