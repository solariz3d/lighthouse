# T-180: a refused in-app export leaves the picked empty folder, which Content Manager lists as damaged. Librarian, on D, 2026-10-04 05:1x. Lap D234.

The keeper, via the chair: "when ever I export by myself, the track is errored in content manager before starting, but after you do it its good,
loo for t180 tube v2".

## Checked
- `content\tracks\t180 tube v2` was EMPTY (0 entries, made 05:03). **Removed by the librarian** (`rmdir`, empty only).
- **The keeper's saved `eq-T180 TUBE V2.t180track` (05:03) is NOT a closed loop.** The landed code (`lib-wpre-build`, 43f1879b), through
  the same `createCoreShell` path the app uses, answers in 0.8 s: `MESSAGE: the loop is not closed: close it first (one click), then
  export`. Nothing was written.
- `app/core/coreshell.js` `exportTo` refuses an open loop BEFORE `resolveTarget` (D226) runs. D226 also removes the empty folder only after
  a successful write (A's choice in `p-tubeexp-A`, which B and the librarian accepted). **So EVERY refused or failed export leaves the folder
  the keeper just made in the picker,** and CM lists it as a broken track. That is the "errored in content manager" the keeper sees. My
  exports never hit it, because they target `content\tracks` itself.
- **That D226 choice was mine to rule on, and the keeper's experience shows it was wrong:** an empty folder made for an export that didn't
  happen is exactly what has to go.
- Not explained: the WebView's ~1.5 cores for about 3 minutes before the app closed (the chair's ring). inferred: the preview drawing a big
  tube, not the export (which refuses in under a second). The keeper closed the app at the librarian's ask, to install.

## The lap (A, export tier: targeted tests + those files' mutants; B's quick look)
1. **An empty picked folder directly in `content\tracks` (not `t180b_*`) is removed whatever the export's outcome:** refused (an open
   loop, a red, a narrow grid), failed, or written. Still never one with anything in it (native `remove_dir`, unchanged). In both shells
   (`app/core/coreshell.js`, `app/shell.js`), the open-loop refusal included: resolve the target first, then refuse, then clean up.
2. **The refusal must be seen:** the status line already carries the message. Also make it impossible to miss (the same red box the
   reds use, or an alert), because the keeper read the outcome from CM, not from the app.
- **Tests:** an open loop exported into an empty picked folder → refused, the message shown, and the folder GONE; the same for a red and
  for a refused grid; a non-empty foreign folder is untouched in every case; a successful export is unchanged.

NEXT: chair dispatch D234 to A when this plan is read
