# T-180: the tube oval won't reach AC, two causes. Librarian, on D, 2026-10-03 16:3x.

The keeper, 16:26: "EVERY TIME i first do the export, it says cant launch the race, track main layout is damaged, same thing happened last
time until you fixed it, look for T-180 TUBE OVAL".

## Checked
1. **CM's "main layout is damaged" is an EMPTY folder.** `content\tracks\T-180 TUBE OVAL` existed, empty, made at 16:25. The keeper makes a
   folder named after the track in the picker, the export guard (`app/export/export.js:34`) refuses to write inside a non-`t180b_` folder, and
   the empty folder is left behind. CM then reads it as a broken track. The same thing happened at 11:40 with `T180 OVAL`. **Removed by the
   librarian (empty, 0 files).**
2. **Even exported correctly, the tube oval REFUSES:** a node export with the builder's own code (`lib-xsec-build`, 90c1a3e) of
   `eq-T-180 TUBE OVAL.t180track` (closed, `t180b.core/4`, 6 pieces of 1000 m, every one a tube `t`) gives
   **"not exported: the start straight's floor is 3.33 m wide, too narrow for a two-column grid"**.
   - `src/markers/layout.js:154`, with `floorHalf` at `:120` measuring where the surface angle stays ≤ FLOOR_MAX_DEG.
   - **inferred:** in a circular tube the angle grows from 0 at the bottom, so the "floor" is only a few metres on any tube, whatever its width.

## The fix (A, export tier: targeted + layout/export tests + those files' mutants; B's quick look; then the librarian exports for the keeper)
- **(a) The folder:** in the export target check, a picked folder that sits DIRECTLY in `content\tracks`, is NOT `t180b_*`, and is EMPTY →
  export into its parent `content\tracks` (the normal `t180b_<name>` folder) and REMOVE that empty folder, so CM never sees it. A non-empty
  foreign folder is still refused, as now. (This replaces the queued export-folder UX item, if A already holds it.)
- **(b) The grid on a narrow floor:** when the floor fits ONE slot but not two columns, fall back to a SINGLE-COLUMN grid (cars nose to tail
  on the centreline) with a warning naming it. Refuse only when not even one slot fits. A tube's start then exports, with cars on its
  bottom line.
- **Tests:** the empty-folder case (exports to the parent, the folder removed, never deleted when non-empty); the tube start (a closed
  tube straight → single-column grid, warning, export succeeds); the existing two-column cases byte-identical.
- **Then:** B's quick look; land; the librarian rebuilds and installs, and exports `T-180 TUBE OVAL` for the keeper.

NEXT: chair dispatch the tube export fix (a + b) to A now, the keeper is blocked, when this plan is read
