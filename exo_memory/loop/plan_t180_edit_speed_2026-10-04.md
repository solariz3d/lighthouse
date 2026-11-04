# T-180: changes render slowly while editing; and the scroll bar sits on the value fields. Librarian, on D, 2026-10-04 07:4x. Lap D235.

The keeper, 07:43: "the equation changes to the track work so good, but I wonder, is there a way to make the changes render faster while you
change it from one to the next? Sometimes it lags and is so slow". His screenshot is named "scroll bar in the way of the click for changing
values" (`C:\Users\nname\Pictures\Screenshots\scroll bar in the way of the click for changing values.png`): in the Extend column the
value fields run to the column's right edge, under the scroll bar, so a click there grabs the bar. The "width like…" select is cut off too.

## Checked (main ee3df097, worktree `lib-refused-build`)
- The left column scrolls as one: `app/index.html:31` `#left { … overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; }`,
  `#side > section { padding: 10px; … }` (`:41`). Even with the gutter reserved, the core panel's fields reach the gutter in the screenshot.
- The only debounce in the core panel is the water's (`app/core/panel.js:213`, 120 ms). Everything else (the ghost, the readout, the
  preview mesh) recomputes on every change. Not measured where the time goes.
- **Related, from 05:06–05:10 (chair's ring):** the WebView burned about 1.5 cores for ~3 min with a big tube open. Inferred to be the
  preview, not measured.

## The lap, in two parts
**Part 1, MEASURE FIRST (E, instrument tier, read-only, under the heavy-run lock):** for one edit, the time per stage:
- resolve/adapter;
- `buildMesh` (the preview's scene);
- the preview's batch rebuild and upload (`app/preview/preview.js batchesFor`);
- the ghost;
- the readout/validation;
- the texture flow (D228);
- the water, if on.
Measure on three tracks: a short open one (3 pieces), T-180 OVAL, and a closed tube oval (the heaviest). Measure in node where a stage runs
in node. Name the stages that only the real WebView can time. **Output:** `loop/edit_speed_profile_2026-10-04.md`, a table of ms per stage
× track. **No fix in part 1.**

**Part 2, FIX BY THE NUMBERS (A, FEEL tier: targeted tests + the keeper's hands):** after E's table, and only for the stages it shows are
heavy. Candidates, to be chosen by the numbers and not in advance:
- coalesce rapid edits (recompute once per animation frame or after a short pause, the ghost first, the full mesh after);
- rebuild only the pieces an edit changed;
- a coarser preview mesh while dragging or typing, and full detail on release;
- move the heavy step off the UI thread (a Web Worker), if one stage dominates.
- **KEEP / DROP, registered now:** keep a change only if E's re-measure shows the edit-to-draw time on the tube oval at least 2× faster,
  AND the export is byte-identical (the fixtures, 0 of 9 differ), since the preview path must never change what's exported.

**The scroll bar (A, now, in parallel with part 1; FEEL tier):**
- The core panel's fields and selects stop short of the scroll bar: a right padding at least the gutter's width, or fields sized to the
  column's content box.
- The "width like…" select is fully visible.
- Check in a real window at the keeper's size (the screenshot is 1818 px wide).
- Then B's quick look.

NEXT: chair dispatch D235 part 1 (the profile) to E and the scroll-bar fix to A when this plan is read
