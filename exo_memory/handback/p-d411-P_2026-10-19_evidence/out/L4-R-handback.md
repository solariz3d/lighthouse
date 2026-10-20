# D411 L4-R hand-back: load only the picked melody's samples

Commit `1510e93` on `d411-L4-R` (not pushed).

## What changed
- `app/sound.js`: a new one-line `filesOf(m)` lists the four files melody `m` plays: drag_tick, loop_closed, place_<m> and undo_<m>. `loadSamples` now fetches only `filesOf(melody)`, not all ten `SAMPLES.slots`. `useSamples` now refuses a set only if it lacks one of its own melody's files, and it keeps only those files. A missing file from a melody that was not picked is never fetched, so it costs nothing. A failure on any of the four files that are fetched still falls back to the synth and logs once, as before.
- `app/test/sound-samples.test.js`:
  - New **row 12** (red on the base, green now). For each of the four melodies, only its four files are fetched. A 404 on another melody's file leaves no log, and the samples are used. An engine accepts a set that has none of the other melodies' files.
  - `player()` takes an optional `pick`, which is passed through to `createSound`.
  - **Amended by name, with an `AMENDED (D411)` comment on each:**
    - **row 4** and **row 9** checked that all ten files were fetched. That was the old behaviour on purpose. They now expect the launch's melody's four files.
    - **row 6** deleted `undo_glass` from the set given to an aqua engine. That file is no longer required there. It now deletes `undo_aqua`, so the rule is unchanged: a set missing a file the engine plays is refused, naming it.

## Tests run (all through hr.js)
- The red row on the base: `node --test --test-name-pattern="row 12" app/test/sound-samples.test.js` failed, fetching 10 files where it expected 4.
- `node --test app/test/sound-samples.test.js app/test/sound.test.js app/test/theme.test.js app/test/theme-mutation.test.js app/test/menubar-page.test.js`: 68 tests, 68 pass, 0 fail.
- `node --test app/test/sound-bands.test.js` (headless Chrome with `--mute-audio`, run by soundrender.js): 12 tests, 12 pass, 0 fail.
- Two earlier runs, of the five files and of sound-bands, were stopped at their background time limits. They were waiting on the lock behind other sessions' heavy runs and produced no results. Both were run again in full; the results above are from those runs.

## Not done
- No change to `SAMPLES.slots`. It still lists all ten files. soundrender.js and rows 6, 9 and 10 read it as "the shipped files", and the engine's lookups use it. Changing it was not needed.
- No new export of `filesOf`. The tests write out the four files themselves.

## Limits
- checked (the sound-samples run above): with a melody picked, a 404 on another melody's file still lets the samples play (row 12).
- checked (`grep -rln "sound.js" app/test test tools scripts`): the tests that use sound.js are handle-step, menubar-page, sound-bands, sound-samples, sound, soundrender (a helper) and theme. The only mutation harness found that anchors sound.js-related code is `theme-mutation.test.js`, which anchors index.html; it passed 13 mutations plus its control. handle-step.test.js matched only on its own `SAMPLES` path constant, so I did not run it.
- inferred: soundrender.js still gives `useSamples` all ten buffers. That still works, because the extra buffers are ignored, and sound-bands passed.
- inferred: the real app was not launched. The change is to the fetch list only, and row 12 covers it with a fake fetch.
