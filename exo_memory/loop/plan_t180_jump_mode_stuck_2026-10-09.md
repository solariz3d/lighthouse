# T-180: after placing a Jump, the panel stays in landing mode instead of going back to the normal equation controls. Librarian, on D, 2026-10-09 13:2x. Lap D278.

The keeper, 13:26: "after placing jump piece, it doesnt go back to regular track manipulation with the base equation, it stays the heading, sideways,
and height".

## Read at t180 `d1bf901` (0.3.3)
- `app/core/panel.js:354-359`: the landing's number boxes (heading, sideways, height: `app/core/landing.js` `BOXES`) are "shown only while a landing
  is the head". `landingBox.style.display = shell.landing() ? '' : 'none'`.
- So right after Jump the landing IS the head, which is by design so it can be tuned. The bug is that it does not RETURN: the keeper ends up stuck with
  the landing controls where the base-equation Extend controls (length, turn, climb, bank…) and the road handles should be.
- inferred candidates, to be told apart, not assumed:
  (a) `shell.landing()` keeps returning the landing after a road piece is extended past it (the "head" test reads the last flight, not the last piece);
  (b) the panel never re-renders the Extend block, or hides it, while a landing exists anywhere;
  (c) there is no way to extend a road piece after a landing at all, so the head stays the landing forever;
  (d) the drag handles stay the landing's after the head moves on.

## The lap (A, who built the jump UI and the handles; FEEL tier, plus a core read if the cause is (a) or (c))
1. **Reproduce headless:** a straight, Jump, then try to continue (Extend with normal values, and the drag handles). Record which block is shown, what
   `shell.landing()` returns, and whether the new piece is placed.
2. **Name the cause** among (a)–(d), or something else, with the line.
3. **Fix:** the landing boxes and handles show only while the landing is the head; once a road piece follows it, the normal Extend controls and road
   handles are back, and they work. Selecting the landing again (if selection exists) may bring its boxes back.
- Rows red first: after Jump then Extend, the landing box is hidden, the Extend block is shown and works, the handles are the road's; the landing's
  own tuning still works while it is the head. Targeted tests. Then install.

NEXT: chair dispatch D278 to A when this plan is read
