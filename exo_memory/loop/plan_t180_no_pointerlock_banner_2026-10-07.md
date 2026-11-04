# T-180: no "tauri.localhost — to show your cursor, press Esc" banner when a handle is grabbed. Librarian, on D, 2026-10-07 14:3x. Lap D270.

The keeper, 14:32: "when you first click the points on the track, there is this window that says tauri.localhost to show your cursor press ESC. i DONT want that".

## Why it appears (read at t180 `0014555`)
- D251 (the keeper's amendment: "make the click bind the mouse to the point of where it clicked") grabs a handle with the browser's Pointer Lock:
  `app/core/handles.js:232-242` (`stage.requestPointerLock()` / `exitPointerLock`).
- WebView2 is Chromium. On pointer lock Chromium shows its own notice naming the origin ("tauri.localhost … press Esc"). The page cannot style or hide it.

## The lap (A, who built the handles and D251's lock; FEEL tier, rows and fake hosts; real-window checks only with the keeper's say-so)
1. **First, find out (and cite):** is there a WebView2 or Chromium setting that suppresses the notice for an embedded app? Look at Tauri v2's
   `additionalBrowserArgs` and WebView2's own settings, using current docs. If one exists and is not a security switch, use it. Done.
2. **Otherwise, keep the feel and drop the browser lock:** grab the handle WITHOUT `requestPointerLock`.
   - Use `setPointerCapture` on the stage so the drag keeps its events.
   - Hide the cursor during the drag (CSS `cursor: none`) and keep reading `movementX/Y`.
   - On release, the cursor reappears at the handle (or where the press was), as with the lock.
   - If the cursor hitting the screen edge cuts a long scrub short, Tauri v2's native window cursor calls can fix it: `setCursorGrab`,
     `setCursorVisible`, `setCursorPosition` (a native call, which draws no browser banner), with the capability permissions they need. Say which
     route you took and why.
   - Whatever the route: no Chromium notice; same precision (the D251 scale) and the same 5× length scrub; Esc still cancels a drag.
- Rows: a grab calls no `requestPointerLock`; the drag still scales as D251's rows say; release restores the cursor. Red first. CHANGELOG under
  [Unreleased]. Then install on the shortcut.

NEXT: chair dispatch D270 to A when this plan is read
