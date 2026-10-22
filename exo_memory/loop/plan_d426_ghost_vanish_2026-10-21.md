# D426: Build's next-piece ghost vanishes in the preview until a save (librarian, 2026-10-21)

## The report

The keeper, 2026-10-21 20:41, in the installed 0.4.12-dev (sha256 8FD1D056…6F43): "within the preview, the ghost of the next piece disapears, track TEST 10. ... when i saved it, the ghost came back, weird bug".

## The track

- `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-TEST 10.t180track`, 12,475 B, written 20:40:54 (the save that brought the ghost back).
- `eq-TEST 10.t180undo` beside it, 28,937 B, has the history from before the save.
- **Copy both into your evidence folder first.** Work only on the copies, and never write to the keeper's tracks folder.

## Where to look (inferred, not checked)

- The ghost is `t180-ghost`, at `app/core/panel.js:293-296`, at local-0.4.12 a795359.
- A save that restores it points at state the save path rebuilds or re-emits: for example a dirty flag, a preview cache key, or the D421c `reuseMeshSteps` / `startExact` / `updateSteps` reuse in `preview.js`, `trackmodel.js` and `src/geom/mesh.js`. In that case the reuse would leave the ghost out until a full rebuild.

## Parts

**Part 1, pane C: reproduce, then fix.** Tier: check it. This is a bug the keeper reported, so the test comes first.

1. From a795359, in your own worktree, load the copied TEST 10 with its undo history, headless and with `--mute-audio`. Find the steps that make the ghost go and the save that brings it back.
2. Write a test that fails because the ghost is missing after those steps, then fix the cause, then watch the test pass.
3. Run the tests for the files you touch.
4. Hand back the cause with its file:line, the test that was red and is now green, and the commit sha.

**Do not touch** what D425 is changing:

- `selectionlayer.js`, `handles.js`, `valuesoverlay` (B);
- the overlay and tint code in `preview.js` / `renderer.js` / `trackmodel.js dragFrame` (E).

If the fix has to go into one of those files, stop and ring the librarian before you edit it.

**Part 2:** the librarian rules. The fix then rides the D425 landing, and E installs it.
