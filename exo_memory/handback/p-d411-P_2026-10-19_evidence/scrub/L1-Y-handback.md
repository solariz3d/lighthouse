# D411 hand-back: every click on Settings ▸ Theme ▸ Random picks another look

Commit `5618100` on `<worktree>` (not pushed).

## What changed
- Cause: if Random was already chosen, a click on it arrived as an untick (`toggle(false)`), and the choice helper in `app/menubar/items.js` ignores unticks. Saving `'music'` again would not have helped either: `settings.set` tells listeners only on a change, and settings row 4 pins that.
- `app/index.html`: the theme listener is now a named function, `onTheme`, still registered with `settings.on('theme', onTheme)`. `settingsItems` is passed `randomTheme: () => onTheme('music')`.
- `app/menubar/items.js`: `settingsItems` takes `randomTheme` (default: does nothing). Random's toggle calls it when the theme is already `'music'`, and otherwise saves `'music'` as before. The tooltip now says "picked again each time you choose this".
- The stored value stays `'music'`. `settings.js` and `theme.js` are unchanged.
- `app/test/menubar-page.test.js` row 18: after the existing Glass → Random step, it clicks Random 4 more times. Each time the look must differ from the last, Random must stay ticked, the files of the new look not yet fetched must be fetched, and no other melody's files may be. Both headless Chrome launches in this file now also pass `--mute-audio`.
- `CHANGELOG.md`: an Unreleased ▸ Fixed entry.

## Tests (each file run whole, through hr.js)
- Red on base d582c9e: menubar-page row 18 failed with "choosing Random again picks another look: aqua, after aqua" (17 passed, 1 failed).
- After the fix: menubar-page 18/18, theme-mutation 34/34, export-author 5/5, settings 7/7, theme 11/11. No failures, nothing skipped.

## Not done
- No unit test of `settingsItems`' Random toggle in Node. The headless page row covers it.
- The full suite was not run, only the 5 files above.

## Limits
- checked: (`node hr.js -- node --test app/test/menubar-page.test.js`) My first version of the new check expected the look's two melody files on every repick, and it failed when a repick returned to a look already heard. The player fetches each file only once (`app/sound.js:388`). So a repick to a look heard before fetches nothing, and the test then checks only that no other melody's files are fetched. It cannot confirm the melody switch from network traffic in that case. inferred: the switch still happens, through the same `soundNow.setMelody(pick)` call the checked first-time repicks use.
- checked: (theme-mutation.test.js 34/34) the mutation anchors in `app/index.html` still match. The only harness that anchors these files is theme-mutation. `items.js` has none (`grep -ln "items.js\|index.html" app/test/*mutation*.js`).
- inferred: the first-version red was shown with the same look assertion that the final row still contains first, so the final row is also red on base. I did not rerun the final row on base.
- The working copy of `app/test/menubar-page.test.js` now has LF line endings (from `sed -i`). The committed blob is normalised by `core.autocrlf=true`, so the commit is unaffected.
