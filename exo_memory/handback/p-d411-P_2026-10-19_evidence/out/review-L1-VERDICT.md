# D411 review: X vs Y

Both arms have the same root cause and the same core fix. A click on a ticked checkbox arrives as `toggle(false)`, and `choice()` drops it. `settings.set('theme','music')` would not notify anyone either. So both name the `settings.on('theme')` listener `onTheme` and let the Settings menu call `onTheme('music')` directly. They differ in how `items.js` routes the click and in their tests.

All runs went through `node review/hr.js --`, in headless Chrome with `--mute-audio` (the base `launchChrome` passes it already).

| | X | Y |
|---|---|---|
| New row 18 red on base (only the test file applied) | yes: "click 1 on Random, already chosen, picks another look: aurora, after aurora" | yes: "choosing Random again picks another look: aurora, after aurora" |
| menubar-page + theme-mutation + settings + theme + export-author | 75/75 pass | 75/75 pass |
| row 18 alone, repeated | 8/8 pass | 8/8 pass |

## X — correct

- **Mechanism.** `choice(key, options, again)` runs `again[value]()` on an untick of the value already set. The trigger is keyed by the stored value (`music`), not by the label. That fits a theme choice that was renamed from Music to Random only last release. Other choices are untouched (probe: `turnClimbAs` and `Glass` untick behave as on base). With no `randomAgain` passed, it does nothing.
- **Edge cases missed:**
  - `toggle(true)` while the theme is already `music` sets `music` again, which notifies no one, so nothing happens. My Node probe of `settingsItems` confirms it. The checkbox can't produce this (a ticked box only ever sends `false`), so it only matters if a menu goes stale. Not a real defect.
  - When a re-pick lands on a melody whose files are already fetched, the test can only check that nothing else was fetched. It can't show that the melody actually switched. The author says so in the hand-back.
  - No Node unit test of `choice()`'s `again`.
- **Tests cut or weakened?** X loosened one existing D401 assertion. It used to require exactly `place_<picked>`/`undo_<picked>` to be fetched; now it requires the picked melody's files not yet fetched on this page, and still nothing else. The loosening is justified because the old assertion is flaky on base. I ran base row 18 six times and one failed with exactly "aurora's melody follows: only its two files are fetched". That happens when Random picks the launch's own melody, which `sound.js` already fetched. X also checks that the stored value stays `"music"` after every click.
- **Not run by the author:** theme-mutation. I ran it: 34/34 pass, so the `index.html` anchors still match.
- **To land:** nothing.

## Y — correct

- **Mechanism.** After building the list, Y re-maps the entry whose **label** is `'Random'`. Its new toggle ignores `on`: if the theme is `music` it calls `randomTheme()`, otherwise it sets `music`. In the probe this is a little more robust than X, since `toggle(true)` while on `music` also re-picks. But matching on the label is brittle: it breaks silently if the label is renamed or localised, and this choice was renamed last release. It is also a second code path wrapped around `choice()` rather than part of it.
- **Edge cases missed:**
  - Same as X: there is no positive melody check when the files are already cached, and no unit test.
  - The pre-existing D401 flake stays in the row Y extended. The exact-two-files assertion before Y's loop is unchanged, so row 18 still fails about one run in three to six, whenever the first Random pick equals the launch melody. It passed 8/8 for me, but by luck; base shows the failure.
  - The stored value is asserted once, after the loop, not after each click (weaker than X, though not a cut).
- **Tests cut or weakened?** None cut. Y adds `--mute-audio` to both `launchChrome` calls in the test file. That duplicates the flag `soundrender.js:65` already passes, and it's outside the task. Harmless noise in the diff.
- **To land:** revert the two `--mute-audio` lines. Ideally also fix the D401 flake (X's `follows` helper) and switch the label match to a value match. That's about 5–10 lines.

## Verdict: land X

X keys the re-pick on the stored value inside the shared `choice()` helper, checks `"music"` after every click, and fixes the flaky D401 melody assertion that Y leaves in the same row.
Y's fix also works, but it matches on the label `'Random'`, adds `--mute-audio` flags that already exist, and keeps a test that fails on some runs.
