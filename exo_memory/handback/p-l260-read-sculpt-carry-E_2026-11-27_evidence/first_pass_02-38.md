# L260 ±720 completion read, pane E: first pass on 7b3926e..e7b9128, written before A's "Amendment 02:38" section was opened

Read before this: the order ("Amendment, 02:38", packet line 81) and the diff (5 files, +84/−16).

## What the code does
- `handles.js`: `targetFor` clamps to `rangeOf(K, ctx)`, which is the kind's range unless the model's ctx says `range: false` (then ±Infinity). The wheel's
  clamp (`:628`) reads the same through `m.ctx(h.kind)`. The arrow keys move `drag.base` and call `apply`, so they go through `targetFor` too.
- `panel.js` `sculptModel`: `ctx` adds `range: false` for `bank` only. Only Sculpt's bank handle is lifted; the ghost's bank handle (ghostModel's ctx) and
  the extra handles keep theirs; Sculpt's width and cup keep theirs.
- Rows 720a-720d (drag through the handle host; a step that is not 0.45° the drag's way fails, so a first step against the drag fails), 720e (a wheel notch
  at 730), 720g (a guard: the ghost's bank handle from a typed 710 stops at 720 and writes 0). Harness: B10-B13; its FILES now take core-pieces-ui, so its
  `tree()` copies more of the app.

## Read against the order
1. One of E's two ways is chosen (no range), as the brush has none. Item 1 holds by reading.
2. The ghost's bank handle is not changed (720g, and B13 for a mutant that would change it).
3. Red first: rows for E's 710, 730 out and in, and the mirror; a row fails if the first step moves against the drag. A says red at 7b3926e; to check.
4. The CHANGELOG names three holds: the ghost crossing from inside one turn, the extra ±360, and the ghost's ±720. To check that there is no other.
5. The refactor list: to read in A's section.

## The wheel and the arrow keys (the chair's question): inside the order, by reading
They are the same handle's inputs and clamp on the same line. At 7b3926e a wheel notch or an arrow on a 730 piece moved the road to 720 at once: the
defect the order names, by another input. Inside ±720 the lift changes nothing for them, because nothing reached the range. So freeing them completes the
order and is not a new behaviour, provided it does not reach the ghost's wheel and arrows (its ctx has no `range: false`). To check by running.

## The timing red (core-extra-bank-drag-cost row 1): by reading, not the change
It is a ratio of two p95s of the SAME extra-bank drag (the bank's ramp moving against early), read in one process. Both pass through the new `rangeOf`, so
the change adds the same few nanoseconds to both. inferred: load. Not timed by me under load; owed on a quiet machine, at both commits.

## Pre-registered: NOT CLEAN if
- a touched row red at e7b9128, the harness's control red, or a mutant NOT APPLIED counted as caught;
- my 730 case (or 710, or the mirror) still jumps or holds at ±720 through the handle host, by drag, arrow or wheel;
- the ghost's bank handle (drag, arrow or wheel) changed, or any handle other than Sculpt's bank lost its range;
- the CHANGELOG names a hold that is not there, or misses one that is.
