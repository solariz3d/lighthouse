# D411 L4 review: X vs Y

I ran everything through `node review/hr.js --`. Suite: sound-samples, sound, handle-step, theme, theme-mutation, menubar-page, handles, core-readout-display and sound-bands (sound-bands is headless Chrome with --mute-audio, from the launcher).
- **X: 175/175 pass.**
- **Y: 175/175 pass.**
- **Red on base** (each diff's tests with the base `app/sound.js`): X fails rows 4, 9 and 12; Y fails row 12 only. Both new rows are genuinely red, then green.
- **Probe:** `review/probe/p.js`. It uses a real `createSound` with pick 0 (aqua), a fake fetch and a recording engine. Results:

| probe (aqua picked) | X | Y |
|---|---|---|
| 404 on undo_glass | 4 fetched, samples used, no log | 10 fetched, samples used, no log |
| network error (rejected fetch) on undo_glass | 4 fetched, used | used (9 files) |
| decode fails on place_skyline | 4 fetched, used | used (9 files) |
| 404 on all 6 unpicked files | used | used |
| fetch of undo_glass **never settles** (stalled request) | **used** | **samples never used; synth for the whole session, nothing logged** |
| 404 on undo_aqua (picked) | synth, logged once | synth, logged once |

## X: fetch only the picked melody's four files
- **Correct?** Yes. `filesOf(melody)` drives both `loadSamples` and `useSamples`. Files of a melody that wasn't picked are never requested, so a missing one costs no request, no decode, no log and no fallback. A failure on any of the four files it does play still falls back once and logs, as before (row 5 still pins this).
- **Missed edge cases:** none in behaviour. In every probe the picked set loads. It also stops downloading and decoding 6 WAVs per launch. That's fine, because the melody is drawn once per launch and never switched at runtime (`index.html` only reads `sound.melody`).
- **Tests:**
  - **Rows 4 and 9:** amended by name with `AMENDED (D411)` comments, which the task allows. They still pin an exact URL list with each file fetched once, now the melody's four. That is narrowed to the new behaviour, not weakened.
  - **Row 6:** now deletes `undo_aqua` instead of `undo_glass`. It still checks "refused, naming it".
  - **Row 12:** loops over all four melodies. It checks the fetch list, that nothing is logged and the contents of the set, and that a real engine accepts a set without the other melodies' files.
  - No test was cut.
- **To land:** one whitespace nit. `const rateOf =(file, midi)` lost its space, so restore it. Optional: row 9's message "the player loads exactly the files the slots name" is now slightly stale. The required change is one character.

## Y: still fetch all ten, tolerate failures of unpicked files
- **Correct?** It fixes the 404 case the task names. Its tests are honest and its row 12 is good: it checks a real engine plays from the samples, and checks that a failure in the picked melody still falls back.
- **Missed edge cases:**
  1. **A stalled or slow request for an unpicked file still holds up the picked melody.** It still goes through `Promise.all`. If it never settles, the samples never arrive, nothing is logged, and the synth plays for the whole session (see the probe row). If it is merely slow, every sample waits for it. So a file of an unpicked melody that won't load still costs something.
  2. **It doesn't meet "cost nothing" literally.** It still makes 6 unneeded requests and decodes per launch (the hand-back admits this).
  3. Failures of unpicked files are swallowed with no log at all (the hand-back admits this too).
  4. `useSamples` is handed up to 10 buffers and throws 6 away.
- **Tests:** none cut. Row 6 is amended the same way as X, with a comment. Rows 4 and 9 still pin "all ten fetched", which keeps the old cost in place on purpose. Row 12 covers only aqua with an undo_glass failure.
- **To land:** fixing case 1 properly means fetching only `filesOf(melody)`. That means rewriting `loadSamples` and amending rows 4 and 9, which turns it into X. A timeout instead would add new machinery for files that are never played.

## Verdict: land X
X removes the cause: it never touches the other melodies' files, so a 404, a network error, a bad decode or a stalled request on them costs nothing. It amends rows 4 and 9 cleanly and only needs a whitespace fix.
Y handles a 404 but still waits on all ten fetches, so a stalled unpicked file keeps the picked melody on the synth for the whole session. Fixing that would mean rewriting it into X.
