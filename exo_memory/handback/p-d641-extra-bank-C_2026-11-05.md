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

BASE: C:\Users\nname\Downloads\t180-fresh d91227f
SOURCES: core-extra-bank-wind.test.js TAP on d91227f and 19ef575; touched-set.out; page-render-before.log and page-render-after.log; ribbon641.js output; opts.json; the probe rows (scripts/opts.test.js)
