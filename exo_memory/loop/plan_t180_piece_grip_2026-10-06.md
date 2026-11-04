# T-180: grip per piece, not one value for the whole track. Librarian, on D, 2026-10-06 18:5x. Lap D261. QUEUED behind D258–D260.

The keeper, 18:46: "every track has different grip or friction values, so you can change how the tires feel on the tracks, more or less grip.
It would be interesting to be able to change which piece has different grip, than the global track being one value, it could be so interesting".

## What exists (read at t180 `cc177c5`, `src/export/trackfiles.js:10-60`, `src/export/layouts.js:43`)
- `data/surfaces.ini` today: the road uses **AC's own `ROAD` surface** ("none are redefined"); a `PIT` surface carries CSP's extended-physics
  flag (`WAV_PITCH=extended-0`); a T-180 track adds CSP's soft-collision block `[COLLISION_PARAMS_...]` with `MESHES=1ROAD?` and
  `FRICTION=0.05` (FINDINGS §4c). Road meshes are named `1ROAD_…` (the leading 1 = physics; the letters after it pick the surface KEY).
- So grip is one value per track, AC's ROAD, today.

## How AC does per-surface grip (to be CONFIRMED in step 1, not assumed)
- Each `[SURFACE_n]` in the track's `surfaces.ini` has a `KEY` and a `FRICTION`; a physics mesh whose name is `1<KEY>…` drives on that
  surface. So per-piece grip = one surface per distinct grip value (e.g. `KEY=GRIPA FRICTION=0.85`) and each piece's road mesh named with its key.
- Open questions step 1 must answer from the keeper's installed tracks and the CSP docs: how AC parses the key out of a mesh name (where it
  stops), whether CSP's soft-collision `MESHES=1ROAD?` pattern must list the new keys (and what `?` matches), and the sensible FRICTION range
  for a T-180 (what the community tracks use).

## The lap
1. **Research (C, after D260; read-only):** answer the three questions with sources: the CSP wiki / AC docs (cited) and the installed
   tracks' `surfaces.ini` files (counted). No guessing.
2. **Core + export (E; EXPORT tier):** a per-piece **grip** value (default 100% = AC's standard road), stored on the piece (not a smooth
   channel: grip changes at piece boundaries), saved in the file, carried by saved pieces and mirror, unchanged by Close and Sculpt. The
   export writes one surface per distinct value and names each piece's road meshes with its key; D260's merged chunks split at grip
   boundaries; the soft-collision block covers every road key. Fixtures 0 of 9 at default grip (byte-identical when every piece is 100%).
3. **UI (A; FEEL):** a **Grip** field in Extend (applies to the new piece) and on selected pieces (Pieces selection → set grip), and a
   preview view that colours pieces by grip, with the value in the hover label.
- **Not changed:** the checker's limits (the Mach 6's measured grip). Lower grip in AC will drive differently than the checker assumes;
  the warning words should say grip is not modelled.
- AC is the test: the keeper drives a track with a low-grip and a high-grip piece.

NEXT: chair queue D261 (C research first, after D260; then E core/export; then A UI) when D258–D260 are in

## The keeper's range decision (librarian, 21:2x)
- **Grip field: 50–150%** (AskUserQuestion, recommended option). 100% = AC ROAD friction 1.0, writes no grip key. Outside 60–110% the words say "untested: drive it" (E's survey: installed range 0.6–1.1, n 753).

## Addition (the keeper, 21:18): a "Grip like…" reference, as "Width like…" (D232)
> "LIKE how we took the width reference of other tracks, perhaps do the same with the friction for users to see which tracks they want to emulate grip"
- A **Grip like…** drop-down beside the Grip field: each known track's measured ROAD friction as a percentage (e.g. 0.96 → 96%), picked to fill the field.
- **Source:** E's survey (`grip/survey.json`, 753 surfaces, 70 track folders): per track, the drivable road key's FRICTION (the ROAD key, or the T-180 road keys E named).
  Lead with the T-180 tracks the width list already uses (Thunderhead, Aurora, Nordic) plus the CSP-collision tracks (Sakura, Hazen Loop, Centrifuge, Serpents Spiral, Rainbow Road), then Kunos's own tracks.
- **The friend's private track is never listed** (E's survey already keeps it unnamed). Only numbers are taken, as with the widths; no author's file is copied.
- Owners: E builds the table (with the source file and key for each row); A adds the drop-down with the Grip field.
