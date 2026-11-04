# T-180: the drag handles need finer scrubbing; you can't land exactly on 0. Librarian, on D, 2026-10-06 11:3x. Lap D251.

The keeper, 11:28: "the colored drags on the track need to have slightly more precise scrubbing, cant get to 0 precise".

## Why it happens (read at t180 `eeec787`, `app/core/handles.js`)
- `targetFor` (`:106-107`): `v = base + d * f * K.rate`, where `d` is the drag in WORLD METRES along the handle's axis. Zoomed out, one
  screen pixel is many metres, so one pixel jumps the value by a lot (turn and climb: 0.5 °/100 m per metre; cup 2°/m; width 2 m/m).
- Shift (`FINE = 0.1`) slows it but rounds to `K.step / 10` = 0.01, so a slow drag lands on 0.03 or −0.02, not 0.
- Nothing pulls toward 0, and there is no way to reset a handle.

## The lap (A, who built the handles; FEEL tier, targeted tests + a real window on its own app data)
1. **Speed by screen pixels, not world metres:** the value changes per pixel of pointer movement along the handle's on-screen axis, so it
   feels the same at any zoom. Suggested starting rates (A tunes in the window): turn/climb 0.05 per px, bank 0.2°/px, cup 0.2°/px,
   width 0.1 m/px, length 0.5 m/px. Shift = a tenth.
2. **A detent at 0** for the signed kinds (bank, turn, climb) and at the drag's starting value: crossing it holds the value there for the
   next few pixels (about 6 px), so 0 is easy to hit and to leave.
3. **Round to the kind's step even with Shift** (0.1), so a fine drag still lands on round values like 0.0.
4. **Double-click a handle** resets that field: 0 for bank, turn and climb; for length, width and cup, the value it had before the drag.
- The hover label shows the exact value it will set.

## Checks
- A row per item, red on `eeec787` first, then green. Real window: drag turn from 2 to exactly 0 without Shift, and with Shift.
- No harness by the author; the librarian runs the touched harnesses once at install.

NEXT: chair dispatch D251 to A when this plan is read

## Amendment (the keeper, 11:29), before any build
> "also make the click bind the mouse to the point of where it clicked so the mouse doesnt physically move and stop at the end of the
> screens, scale the length scrub by 5x. Leave the rest the same"
5. **Pointer lock on a handle drag:** pressing a handle locks the pointer where it clicked (`requestPointerLock`, read `movementX/Y`),
   so the cursor does not travel and a drag never stops at the screen edge. Release (or Esc) unlocks, and the cursor is where it started.
   If the lock is refused (the WebView can refuse), fall back to today's drag.
6. **Length scrubs 5× faster** than today.
- **"Leave the rest the same", read as:** the other handles keep today's speed (converted to per-pixel at the default camera distance so
  they feel the same), and items 2–4 (the detent at 0, Shift rounding to the step, double-click reset) stay in, since they were his ask at
  11:28. If he meant to drop 2–4, they are each one removable piece.
- **Item 6 clarified by the keeper, 11:30:** "increase the value at which adds to the track like it expands faster": the same mouse movement
  adds 5× as many metres of length as today. Only the length handle.
