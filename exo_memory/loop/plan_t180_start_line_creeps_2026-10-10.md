# T-180: the start line moves forward every time a piece is placed. Librarian, on D, 2026-10-10 05:5x. Lap D284.

The keeper, 05:45: "bug for track builder, dont know why, but every piece i put down, the start line moves up again and again". Installed build: t180
`8639987` (Sharp on top of 0.3.4).

## What the code says (read, not run)
- **Placed by hand** (`spawns` on the doc): `spawnsLayout`, `app/core/coreshell.js:968`. The line is `along` metres into the FIRST piece, clamped to
  that piece's length. Read alone, that should not move when a later piece is added.
- **Automatic** (no `spawns`): `startLayout`, `coreshell.js` ~`:950`, then `Markers.defaultLayout`. Its own header says it goes on the longest straight, and on
  an open track that choice can move as pieces are added.
- **Other suspects:**
  - the path's `start` (`st.resolved.start`) shifting when a piece is appended;
  - `anchorS`/`segStarts` (`src/markers/place.js`) resolving `first.id` against segment ids that change on an append (the adapter splits a piece into
    several segments);
  - the preview layer (`app/core/spawnslayer.js`) drawing from a stale or recomputed s.

Inferred, not checked: which of these fires. The lap measures it.

## The lap (pane B, free; one part)
1. **Reproduce in the app's core shell, with numbers.** Run two cases, both open tracks:
   - (a) with no `spawns` (automatic);
   - (b) with a hand-placed line (`along` 100 on a 400 m first piece).

   In each, add four pieces one at a time: Straight, a broad turn, Turn by and Sharp. After each, record the line's world position and its `along`
   on the first piece. Also open the keeper's own saved tracks as COPIES (the newest few in `%APPDATA%\com.solariz3d.t180-track-builder\tracks`), add
   one Straight, and record the same.
2. **Name the cause** (file:line), then fix it at the cause:
   - A hand-placed line must not move at all when a later piece is added.
   - An automatic line may move only if the longest straight genuinely changed, and if it does, the panel should say "automatic".
3. **Rows:**
   - red first;
   - hand-placed line: world position unchanged within 0.01 m after each of the four appends;
   - automatic line on a track whose longest straight did not change: unchanged;
   - save, reopen, append: unchanged.
4. **Checks:** this is the export's start position, so run the full suite and the core harnesses at landing.

NEXT: chair dispatch D284 to B when this plan is read
