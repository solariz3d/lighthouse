# D411 hand-back: Random picks again on every click

Commit `f0f1664` on `d411-L1-N` (not pushed).

## What changed
- **Cause:** a click on the Random tick while it was already ticked arrives as `toggle(false)`, which `choice()` ignored. And `settings.set` only tells listeners about a change, so setting `music` again would not have helped.
- `app/menubar/items.js`: `choice(key, options, again)` runs `again[value]()` when the value already set is chosen again. `settingsItems` takes `randomAgain` and passes it as `{ music: randomAgain }`.
- `app/index.html`: the theme listener is now a named `onTheme`. It is registered with `settings.on('theme', ...)` as before, and Settings gets `randomAgain: () => onTheme('music')`. Each click picks one of the other looks and its melody follows. The stored value stays `'music'`.
- `CHANGELOG.md`: a Fixed entry under Unreleased.
- `app/test/menubar-page.test.js` row 18: after Glass → Random, three more clicks on Random while it is chosen. Each must give a look different from the last, keep Random ticked, have the melody follow, and leave the stored value as `"music"`.

## Tests (all through hr.js)
- Red on base `d582c9e`: `node --test app/test/menubar-page.test.js` gave 18 tests, 17 passed, 1 failed: row 18, "click 1 on Random, already chosen, picks another look: skyline, after skyline".
- First green attempt: 23 tests, 22 passed, 1 failed. The failure was D401's existing check "aurora's melody follows: only its two files are fetched". app/sound.js fetches each file only once per page, so a melody that already played fetches nothing. Row 18 now expects only the files this page has not fetched yet, and still allows no other melody's files.
- Final run, `node --test app/test/menubar-page.test.js app/test/export-author.test.js` (both files whole): **23 tests, 23 passed, 0 failed, 0 skipped**.

## Not done / Limits
- I did not re-run the base with the final row 18. The look check that failed there is unchanged; only the melody file expectation changed.
- When a melody's files are already in, the test can only check that no other melody's files were fetched. The page has no hook that shows which melody is playing. If all three re-picks land on melodies already loaded, none of the three clicks gets a positive network check.
- No unit test for `choice()`'s `again`. It is covered only through the headless page test.
- Only these two test files were run, not the full suite.
