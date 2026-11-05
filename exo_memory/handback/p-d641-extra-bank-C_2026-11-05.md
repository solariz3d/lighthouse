# D641: "the extra banking breaks": the extra bank's drag had no stop (pane C)

Seat: pane C (sibling-0845a868). Tier: CHECK IT, under the bug-report rule (red first).
t180 worktree `Desktop/worktrees/t180-d641-c`, branch `d641-c` off `d91227f`. **Fix `19ef575`.** Not installed, not pushed, no release; the installed
exe was not touched.

## The cause (it is not the librarian's inference exactly, and not a fold in the road)

- **The drag.** On a long drag:
  - The **base** bank handle stops by itself. The road rolls under the handle and turns its on-screen axis away, so the drag stalls. From +65.3 it
    settled at −124.3 and +235.1.
  - The **extra** bank handle has no stop. It stands at 0.60 of the piece, where its own change (starting at 0.50) has hardly rolled the road, so its axis
    never turns.
  - Its value runs to the bank kind's ±720. The field wraps it back within one turn, so on screen the bank winds through −329°, **jumps round to −9.89° in
    one step**, and winds on again.
  - His HUD's −294.70 is one point on that wind. It is exactly +65.30 − 360, his bank to gravity at the piece's end.
  - checked: `_evidence/page-render-before.log`, the real page on d91227f, one 2,400 px drag: … −290.90 ; −329.15 ; **−9.89** ; −39.08 … −202.34.
- **The road at −294.70 is not broken.** It is a smooth twist past a full turn. "Folds over" is how a 31 m road rolling more than a full turn looks.
  - checked: on the core's own path (adapter `toPath`, 2 m samples) at his HUD state, the frame's up turns at most 1.32° between samples, and no edge
    runs backward (0 reversals).
  - Base −294.70 alone: 0.41°. Extra −100: 0.61°; −200: 0.98°. (`scripts/fold-probe.test.js`, which drives the panel and measures the path; the per-state
    figures also print in `ribbon641.js`'s output, quoted below.)
- **Which first bank he had is not in the HUD.** I used +65.3 throughout, his bank to gravity at the end. The red row reproduces with any base: −294.70
  is reached from whatever it starts at.

## Red first (the bug-report rule)

`app/test/core-extra-bank-wind.test.js`, 2 rows (down and up).
- **The harness:** B's drive.js harness (the real core shell, panel and handles on a fake stage), with one change: the ghost is the real core's piece
  (`TB.extendCorner` of the panel's own options through `toPath`), so the road rolls under a handle as it does in the app.
- **His HUD's piece:** 2040.48 m, a +90 corner, cup 15.5, width 31, bank +65.3.
- **The drag:** one long quick drag on the extra bank handle (300 steps of 8 px).
- **The asserts:** the bank stays within one turn, no step jumps more than 30°, and the drag ends held at its stop.
- checked: on d91227f → **pass 0 / fail 2**: "the biggest step was 359.7°" (down) and "358.0°" (up) (`_evidence/red-d91227f.summary`, `.failure.txt`).
- checked: on 19ef575 → **pass 2 / fail 0** (`_evidence/green-19ef575.summary`).

## The fix (`19ef575`: `app/core/handles.js` `extraKind`, the extra-handle code; plus the new rows and the MAP line)

- **What changed:** the extra bank's kind holds at **±360°** (the base bank's range: within one turn, a full turn allowed, as the 2026-11-02 rule wants)
  instead of the bank kind's ±720, which the field then wrapped back round.
- **What is unchanged:** every other extra kind, the base bank handle, the core and the stored data.
- **Its effect:** the drag now winds no further than one turn and stops there, with no jump. On the real page the same drag reads … −326.11 ; **−360.00**
  ; −360.00 … to the end (`_evidence/page-render-after.log`).
- **What it does NOT do, said plainly:**
  - −294.70 is inside one turn, so a long drag can still reach his state on purpose. It is held at −360, not refused.
  - If he wants the extra bank kept to less (say half a turn from where it starts), that is his call. I did not invent a tighter rule.

## Checks (the touched set)

- **Which files:** every app test file that names `core/handles`, plus the new file and `core-second-bank-panel`: 14 files.
- **How they ran:** under the heavy-run lock, BelowNormal, one slot.
- checked: `_evidence/touched-set.out` → **14 files, 302 pass, 0 fail**.
- **Line endings:** `handles.js`, the new test and `MAP.md` keep CRLF on every line (checked: CR count = line count).
- **The map:** one clause added to `MAP.md`'s `handles.js` line. Not fixed (outside this packet): `MAP.md` still says `app/test/` holds 127 test files; there are 142.

## Renders (headless, before any install)

- **The page** (`_evidence/renders-page/`, script `scripts/render641.js`): the builder's own page in headless Chrome.
  - Settings: `--headless=new`, `--mute-audio`, titled `zz-headless-test`, every child process hidden (`winhide.js`), BelowNormal, under the lock.
  - The drag was real mouse events on the extra bank handle.
  - `after-1-long-drag-stop-free.png`: the HUD reads −360.00° and the extra bank row −360; `before-1-…`: the same drag on d91227f.
  - **The page camera would not frame the 2 km piece.** The focus event takes only placed stations, and in headless Chrome the free camera's keys did not
    move it (focus emulation on). So the page shots show the HUD and the panel, not the road's shape.
- **The road** (`_evidence/renders-road/`, script `scripts/ribbon641.js`): the fixed piece drawn from the core's own path, the same path the preview meshes.
  - A ribbon of the road's 31 m width: the top light blue, the underside orange, in 40 m bands.
  - Software raster, no browser, no window; the cup is not drawn.
  - Four states, each a wide view and follow cams rolled with the road at 85% and 97% of the piece:
    - `his-hud-minus294.7`: frame turn at most 1.32° per 2 m;
    - `level-0`: 0.25°;
    - `more-plus90`: 0.21°;
    - `drag-stop-minus360`: 1.56°.
  - Each is a smooth roll with no fold.
  - Their options are the panel's own, dumped through the real panel (`opts.json`, `scripts/opts.test.js`).
- **Export:** I tried the Export button's path first. It refuses an open loop ("close it first"), and closing it would add pieces, so I drew the path instead.
- **Chrome processes:** 15 were running before my first run and 0 after the last. I started and killed only my own. The others were not mine, and I did
  not touch them.

## Corrections, mine

- **One rule broken:** I edited `render641.js` once with an inline `node -e` carrying nested quotes, against my own no-inline rule. It applied cleanly;
  every later edit used the Edit tool.
- **A canvas click** in a render script selected the placed piece and reset the Extend fields. That run's shots were thrown away, and the click was
  replaced by a blur.
- **The worktree at d91227f** (`Desktop/worktrees/t180-d641-base`, detached, made for the before run) was removed after it.

## Order 3 (the chair, 15:15Z), step 1: his HUD piece rendered from the REAL mesh, and whether the fold is real

**The fold is not real geometry.** It is a 31 m road twisting through more than a full turn, seen nearly edge-on in perspective. No fix is needed for a
fold.

- **The mesh:** the preview's own ghost mesh (`app/preview/trackmodel.js` `ghostFor` of `shell.candidate`, the cup included), in world space through
  each batch's model matrix as `renderer.js` `bakePoints` does. It was drawn after the placed 1,000 m straight. Script `scripts/mesh641.js`; the options
  are the panel's own (`opts-his-hud.json`, `scripts/opts3.test.js`).
- **Both readings of his HUD were checked**, because the HUD cannot tell them apart:
  - The HUD's big BANK is `bankToDeg − bankFromDeg`, the piece's whole bank change (`app/core/labels.js:41`), not the bank field.
  - checked: `opts-his-hud.json` → the field at −294.70, and the field at +65.3 with the extra at −294.70, both read bank −294.70, bank to gravity
    0.00 → +65.30, turn +90.00.
  - So E's N2 ("the piece's OWN bank field") is one of two readings, not established by the HUD.
- **The checks on the mesh, both readings** (checked: `mesh-checks.log`), over 126,604 triangles:
  - **Turned inside out:** 0 faces against the road's own up.
  - **Creased back:** 0 neighbouring faces more than 90° apart. The worst neighbour step is 1.1° (field) and 2.0° (extra).
  - **Crossing itself:** the centreline never comes back near itself. Its nearest approach between stations more than 100 m apart along it is 101.8 m,
    which is just the arc.
- **The renders** (`renders-mesh/`): the top is blue and the underside orange.
  - `*-his-angle.png` is from behind and above the piece's start, as his Free view was.
  - Field −294.70: one long twist over the whole piece, with one place where the ribbon goes edge-on.
  - +65.3 then extra −294.70: the full roll is packed into the second half. The ribbon goes edge-on twice near the front, which is the "folds over
    itself near the front" look.
  - inferred: his picture matches the extra reading better, as his own words say ("the extra banking breaks"). That comes from how it looks, not from proof.
- **The checker:** E reports no red on his typed state. I did not re-run it.

## Orders 2 and 4 (the chair, 15:12Z and 15:33Z): items (a)–(f) on d641-c

**Branch `d641-c` head `df62d6f`:** `19ef575` (the accepted extra-bank hold), `1b98cc4` ((a)–(d) and (f); it took the hold out while order 3's "HOLD
any winding bound" stood), and `df62d6f` (the hold back, at order 4: only the BASE bank's winding waits for his ruling). Not installed, not pushed.

**Red first:**
- checked: on the old source (`19ef575`'s `panel.js` and `handles.js`, stashed for the run) → R4 (1.6×), R5, R6 and R7 not ok
  (`widened-red-old-source.summary`). The failures are E's own figures: 26.5 / 17.0 px to the width handle, from 4.16 m, and 90.97°
  (`widened-red-old-source.failures.txt`).
- checked: (f) not ok before its fix, the field reading −654.7 (`f-red-before.txt`).
- checked: on `df62d6f` → `core-extra-handles-glitches` + `core-extra-bank-wind`: **21 pass, 0 fail, 0 todo** (`widened-green-df62d6f.summary`).
- checked: the touched set on `df62d6f` (every app and core test file naming `core/panel` or `core/handles`, the mutation harnesses left out at "check
  it": 63 files, `touched-set-files.txt`), under the heavy-run lock, BelowNormal, one slot → **63 files, 821 pass, 0 fail** (`touched-set-df62d6f.out`).
  The tree stayed at `df62d6f` from start to end. An earlier run of the same set passed 821/0 but had the tree changed under it, so it is not counted.

| item | row | the fix (all in the extra-handle code) |
|---|---|---|
| (a) width and cup clear 36 px | R4 (1.6×), E's cameras | `handles.js clearExtras`: when no step back clears, it steps forward too. The ones that cleared going back keep their place |
| (b) the edges | R7 | built: `panel.js offersAt` offers a field with no extra handle (the edges) ONE later change, as the extra handles give the others |
| (c) N1 | R5 | `panel.js secondExtra`: a change the drag just made falls back on the value it starts from (the offer's base), so an unfit first value is held where it fits from its own start (150, 7.33°), not moved to 4.16 m |
| (d) the S | R6 | `panel.js` snap list: a corner's extra also snaps to minus the first corner, so the S lands on +90 and ends straight (heading −6.9e−15°, `opts-widened.json`) |
| (e) the reversal past 180° | none (it does not reproduce) | see below |
| (f) typed −654.70 | (f) row | `panel.js`: on commit (the field's change event, never while typing) a bank past one turn is rewritten to the value laid, as an emptied field already shows its 0 |

**(a) is met at 1.6× and NOT at 2.4×. Saying so plainly:**
- At 2.4× the piece is about 304 px on screen. Eight places (three of base handles, five extras) do not fit 36 px apart in the order they stand along
  the road.
- Stepping both ways the best is 32.9 px (to the extra climb), below the 34 px where two glyphs touch. A 4× finer step did worse.
- I wrote no row at a made-up bar. Clearing 2.4× needs a design call: fewer or smaller handles on a piece that small on screen.
- The plot `renders-widened/handles-1x-1.6x-2.4x.png` shows it: at 2.4× the extra width has stepped far forward to its best spot, which no longer reads as
  "just ahead of the width handle".

**(e) does not reproduce as a reversal on the real ghost** (checked: `e-long-drag-real-ghost-df62d6f.txt`, `scripts/e-probe.test.js`, one long quick
drag each way from +65.3 at his HUD's piece):
- **The base bank handle** moves one way only and STALLS at −124.3 and +235.1. The road's roll turns its axis away, and it never comes back.
- **The extra bank** moves one way only to ±360 and holds.
- E's "+1,700 px came back as +111.87" is the wrap: 111.87 + 360 = 471.87, past a turn and wrapped back. That is the fault `19ef575` fixes and R1 pins.
- The base stalling about 180° from where it starts is the base bank's own winding behaviour, held for his ruling. I changed nothing there.

**Renders** (`renders-widened/`):
- `S-one-piece-*`: his S as one piece, the −90 corner and the snapped +90 extra, ending straight.
- `N1-300m-flick-*`: E's flick on 300 m, held at 7.33° from 150. The frame turns at most 0.69° per 2 m.
- `handles-1x-1.6x-2.4x.png`: the handle plot above.
- The road renders are drawn from the core's path. The plot is from the real panel and handles.

**Corrections:**
- **R4's first camera** was R3's farther pose, not E's. I moved it to E's cameras (`drive-full.js :129`) before trusting either result.
- **One `sed -i`** stripped the CRs from the glitches test file. I restored CRLF on every line and checked that the diff is additions only.
- **Two inline `node -e` edits** to scratch scripts broke my own no-inline rule. Both applied cleanly.

BASE: C:\Users\nname\Downloads\t180-fresh d91227f
SOURCES: core-extra-bank-wind.test.js TAP on d91227f and 19ef575; touched-set.out; page-render-before.log and page-render-after.log; ribbon641.js output; opts.json; the probe rows (scripts/opts.test.js)
