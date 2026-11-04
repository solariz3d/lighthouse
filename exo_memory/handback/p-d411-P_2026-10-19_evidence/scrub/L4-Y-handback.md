# D411 hand-back: a missing file of an unpicked melody costs nothing

Commit `c2b4c8b` on `<worktree>` (not pushed).

## What changed
- `app/sound.js`
  - New `filesOf(melody)`: the files one melody plays (drag_tick, loop_closed, place_<m>, undo_<m>).
  - `loadSamples` still fetches all ten files. If a fetch or decode fails for a file the picked melody doesn't play, that file is left out of the set and nothing is logged. If a file the picked melody does play fails, the whole load is still rejected and logged, and the synth plays, as before.
  - Engine `useSamples` now refuses a set only when a file of its own melody is missing, and it keeps only those files.
- `app/test/sound-samples.test.js`
  - New **row 12**, red on the base: with the launch picking aqua, a 404 on `undo_glass` logged "samples did not load" and the engine was never given the samples. Now nothing is logged, and the set includes the tick, the loop close and aqua's place and undo. The real aqua engine plays those from their samples. A 404 on `undo_aqua` (the picked melody) still drops the samples and logs the 404.
  - **Row 6 amended**, with a comment: it deleted `undo_glass` from the set given to a default (aqua) engine and expected a refusal. Under the new rule that is allowed, so the row now deletes `undo_aqua`. The rule it checks ("a set with one missing is refused, naming it") still holds.
  - `player()` helper: added an optional `pick` so a test can fix the melody.

## Tests run (all through hr.js)
- Base, before the fix: `node --test app/test/sound-samples.test.js` gave 13 tests, 12 passed, 1 failed (row 12, "nothing to log").
- After the fix: `node --test app/test/sound-samples.test.js app/test/sound.test.js` gave 30 tests, 30 passed, 0 failed.
- `node --test app/test/handle-step.test.js` (it drives `createSound`) gave 6 tests, 6 passed.

## Not done / Limits
- All ten files are still fetched and decoded at launch. Rows 4 and 9 deliberately pin "each file once", so I kept that. A failed unpicked file now costs only its own request, with no effect on what plays. Fetching only the picked melody's four files would save bandwidth, but rows 4 and 9 would need amending.
- An unpicked file that fails is dropped without being logged, so a broken file of another melody won't be visible until a launch picks that melody.
- I didn't run `sound-bands.test.js`, which uses headless Chrome. It hands the engine all ten files through `soundrender.js`, so it doesn't exercise the changed path.
