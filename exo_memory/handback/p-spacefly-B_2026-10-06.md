# D252: Space flies the camera up, Left Ctrl down (pane B, build; FEEL tier)

**Commit `4d58b99`** on branch `b-spacefly`, worktree `C:\Users\nname\Desktop\worktrees\b-spacefly-wt`, on t180 main `eeec787`. 4 paths, named on the commit. Not pushed. No harness run.

## What it does (`app/preview/preview.js`)
1. **Space = up, Left Ctrl = down**, as held keys beside Q/E (which stay), read by the PHYSICAL key: `e.code` `Space` / `ControlLeft`. `heldKey` returns those codes, so the key-up always lets go. **Right Ctrl does not fly.** As with any move key, the first press takes a follow view over into free mode.
2. **Left Ctrl flies only while it is the ONLY key down and no mouse button is.**
   - A new `down` set tracks every physical key down, camera key or not, including keys typed in fields. It is cleared on blur or a hidden window, as `held` is.
   - A window-level capture `mousedown` sets `buttons`; `mouseup` clears it.
   - When anything joins Left Ctrl (another key, the wheel, or a button), `spoilCtrl()` **undoes that press's descent**. It moves back up by exactly the metres Ctrl descended (accumulated in the frame loop), and restores the view if that press had taken it over into free mode. Ctrl then stays spoiled until it is released.
   - A key held BEFORE Ctrl (Shift for Ctrl+Shift+Z, or W) means Ctrl never flies on that press.
   - So Ctrl+Z/Y/S/Backspace, **Ctrl+wheel (still the lens)** and a Ctrl-snapped handle drag never move the camera, and the shortcuts still run: keys.js is unchanged and receives them as before.
3. **Space is taken:** `preventDefault` on keydown and keyup, so a focused button is never clicked. In a **text field it types**, because the existing `swallowsKeys` rule returns first. A number field is not a text field there (unchanged rule), so Space flies in one, and it means nothing in a number anyway.
4. **The help line** (`:18`, plus a D252 paragraph after `:24`) and **the guide** say it. The guide sentence goes in the existing "The grid and the mirror" step (the preview step); a new step would have changed the guide's step tests.

## Every line I touched (A is in handles.js and maybe preview.js for D251)
- **`app/preview/preview.js`, hunks against `eeec787`** (`git diff -U0 eeec787 4d58b99 -- app/preview/preview.js`):

  | lines | what |
  |---|---|
  | `:18` | help line |
  | `+:25-28` | D252 paragraph |
  | `+:72` | `heldKey` |
  | `+:161-171` | `down`, `buttons`, `ctrlFly`, `spoilCtrl` |
  | `+:173` | `onKey`'s first line, `down.add` + spoil |
  | `+:179-186` | the Space and Left Ctrl branches |
  | `:197-202` | `onUp` and `letGo` |
  | `:218-219` | `onRelease` + `onAnyDown` |
  | `:224` | `onWheel` spoils |
  | `:227` | the capture `mousedown` listener |
  | `+:247` | the descent counter in the frame loop |
  | `:319` | dispose: remove the listener |

  **Possible overlap with A:** if D251's pointer lock changes the mouse listeners at `:224-227` or the dispose at `:319`, those are the lines to merge.
- `app/onboarding/guide.js:45`, the grid step's text (one sentence).
- `app/test/preview.test.js`: 6 new rows at the end.
- `CHANGELOG.md`, Added.
- **`app/core/keys.js` is NOT touched**, and neither is `handles.js`.

## Tests: red first, then green (all under the heavy-run lock)
**Rows** (`preview.test.js`, the D252 block at the end):
1. Space flies up like E, 3 m a frame; release stops it.
2. Left Ctrl alone flies down like Q; Right Ctrl does not fly.
3. Ctrl+Z: the descent before Z is undone exactly, in free mode. Nothing moves while both are held or after Z is released. From the build view, the view stays build.
4. A key held before Ctrl means no flight.
5. Ctrl+wheel narrows the lens with the camera unmoved. A button down before Ctrl gives no descent; a button joining Ctrl undoes it.
6. Space is `preventDefault`ed on down and up on a button target. In a text field it is not, and the camera stays.

**Red on `eeec787`:** 69 pass, **4 fail**: rows 1, 2, 3 and 6. **Rows 4 and 5 pass on base**, because base never descends on Ctrl. They are guards for the new behaviour, not reproductions.

**Green on `4d58b99`:**

| file | passing |
|---|---|
| preview | 73/73 |
| keys-anywhere | 6/6 |
| undo-guard | 6/6 |
| core-eqonly | 31/31 |
| onboarding | 14/14 |
| camera | 31/31 |

161/161 in all. Logs are in my scratchpad: `spacefly/red.out`, `green.out`.

## Real window
Chrome off-screen at -12000, browser storage only (stricter than T180_TEST_APP_DATA: no Tauri, no app data). Real key events (CDP `Input.dispatchKeyEvent`, with `code` and `location`). The camera is read through the page's own `t180:view`. Probe `spacefly/wprobe.js`, output `wprobe.json`; 0 page errors.

| step | eye y | view | pieces |
|---|---|---|---|
| two pieces | 7.239 | build | 2 |
| Space held 600 ms | **25.407 (+18.2 m)** | free | 2 |
| Left Ctrl held 600 ms | **7.071 (−18.3 m)** | free | 2 |
| Right Ctrl held 600 ms | 7.071 (unmoved) | free | 2 |
| Ctrl+Z (Ctrl alone for 300 ms first) | after 300 ms of Ctrl −2.265; after Z **7.071, exactly where Ctrl found it** | free | **1 (undone)** |
| Space on the FOCUSED Extend button | 16.407 (rose) | free | **1 (no click)** |
| Space in the name field ("a\|b") | unmoved | free | the field reads **"a b"** |

## Decision for the chair (feel)
**While Ctrl is held alone before Z, the camera visibly dips, then snaps back when Z joins** (−9.3 m over 300 ms in the window). The net move is zero and the undo is exact, but the dip shows. If that reads as a flicker to the keeper, the alternative is a short grace before Ctrl starts descending (e.g. 150 ms), so a quick Ctrl+Z never dips at all. The trade-off is that every Ctrl descent starts 150 ms late. I did not build it; it's one constant away.

## Not established
- No Tauri window and no T180_TEST_APP_DATA app (Chrome stands in).
- No handle drag with Ctrl in the window. The "button down" rule is tested headless only. A's D251 pointer lock may change how handle drags report buttons.
- Space with a `<select>` focused: `swallowsKeys` treats a select as a text field, so Space opens it as before. That is the unchanged rule.
- No harness (per the packet).

## My slips
- My first window run read nothing from the camera. My `view()` returned a Promise and the probe's evaluate does not await it. I changed it to a synchronous read and re-ran; the table is from the re-run.
- One heredoc failed to parse in bash before anything ran; I wrote the script with the Write tool instead.
