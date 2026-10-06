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

## Second item: one export button, and the AC folder chosen at the first start

**Commit `33cf6ab`** on the same branch `b-spacefly`, on top of `4d58b99`. 7 paths, named on the commit. Not pushed.

**I built the plan's REVISED point 2 (the keeper, 11:39), not the packet's "change folder" link.** The plan's section "Second item REVISED" replaces point 2: *"it shouldnt be there, creates too much clutter, the AC folder, instead, in the EXE startup, the user can choose where the track folder is"*. So the result line carries **no** link. Points 1 and 3 stand as written.

**What it does:**
1. **The header's export area is Export to Assetto Corsa plus a ⋯ menu.** The menu is a `<details id="more">` that drops down over the page and holds:
   - Export…
   - Test export (unfinished)…
   - **Assetto Corsa folder…** (to change it later)
   - See it in Assetto with its setting

   `#export` and `#testexport` keep their ids, so their click bindings are untouched. "AC folder…" is gone from the main screen.
2. **The startup card.** When no folder is remembered (first run, or the remembered one is gone), a one-time card appears in the banner row:
   - with Steam's find: "Assetto Corsa found at <path> (through Steam)", with **Use it** / **Choose another…**;
   - with no Steam find: it asks for the folder that holds content\tracks (**Choose…**).

   The answer is remembered, and later starts say nothing.
   - The card lives in a `#setup` slot that `drawBanner` re-appends on every redraw. Without that, the banner's redraw would wipe it.
   - The native side has a new command, `find_ac_root`, backed by `ac::root_status`. It returns the remembered folder, or else the Steam-found one, and **writes nothing**, so the card asks first.
   - `get_ac_root` keeps D250's find-and-remember: pressing Export without answering the card still finds AC itself. When Steam has none, the existing picker still opens ("not found" behaviour unchanged).
3. **The guide's export step** now targets `#install` and names the one button and the ⋯ menu. `#export` sits inside the closed menu now, so the guide's highlight would have pointed at nothing.

**Lines touched** (A is in handles.js; I touched nothing there or in panel.js/coreshell.js):
- `app/index.html`:
  - the header (`:80-86`): Export… and Test export moved into the menu, plus `#more-install`;
  - the CSS (`.more`, `.more-menu`, after `#banner:empty`);
  - `drawBanner` (the `setupSlot`);
  - the native bridge (`findAcRoot`);
  - the install mount (`more`, `card`).
- `app/install/index.js`: `mount`'s `more` and `card` options, the button renamed "Assetto Corsa folder…", the startup card.
- `app/onboarding/guide.js:41-42`: the export step.
- `src-tauri/src/ac.rs`: `root_status`, plus 1 test.
- `src-tauri/src/lib.rs`: the header comment, `AcRootStatus`, `find_ac_root`, and its registration.
- `CHANGELOG.md`, `app/test/share-install.test.js`: 4 rows.

**No test pinned a moved button by name.** The one button test, "the Export to Assetto Corsa button…", finds that button, which is unchanged. So nothing needed amending.

**Tests: red first, then green (under the lock):**
- **Red on `4d58b99`:** share-install 15 pass, **4 fail** (all 4 new rows). `cargo test ac::` **did not compile** (no `root_status`). Log: `spacefly/tidyred.out`.
- **The rows:**
  - one button on the main row, with Assetto Corsa folder… and See it (+ checkbox) in `more`, and no "AC folder…" anywhere;
  - the card offers Steam's folder, Use it remembers exactly that one, and the card is gone;
  - Choose another… opens the picker and remembers the pick; no Steam find gives a card with Choose…;
  - a remembered folder gives no card;
  - Rust: `root_status` reports the remembered folder (and does not ask Steam), or else the Steam-found one, and writes nothing.
- **Green on `33cf6ab`:**

  | file | passing |
  |---|---|
  | share-install | 19/19 |
  | onboarding | 14/14 |
  | core-eqonly | 31/31 |
  | core-shell | 28/28 |
  | preview | 73/73 |
  | layout-css | 3/3 |
  | shell-layout | 3/3 |
  | cargo (whole lib) | 31/31 |

  Log: `spacefly/tidygreen.out`.

**Real window.** Chrome off-screen at -12000, browser storage only. **No Tauri exists in Chrome, so a FAKE native side was injected before load** (`spacefly/fake.js` via `Page.addScriptToEvaluateOnNewDocument`). It records every call, answers `find_ac_root` with a Steam-found path, keeps everything in memory, and touches no AC and no real folder. Probe `spacefly/wprobe2.js`, output `wprobe2.json`; 0 page errors.

| step | what showed |
|---|---|
| start, nothing remembered | visible header buttons: **New, Save, Export to Assetto Corsa, ⋯**. Banner: "Assetto Corsa found at G:\SteamLibrary\steamapps\common\assettocorsa (through Steam). … Use it / Choose another…" |
| Use it | `set_ac_root` called; the banner is empty; the note reads "Exports go into Assetto Corsa at G:\…\assettocorsa"; no dialog |
| ⋯ opened | the menu lists **Export…, Test export (unfinished)…, Assetto Corsa folder…, See it in Assetto (disabled)** and its setting. It is `position: absolute`, at x 1201–1461, y 41–211, inside the 1818×1100 window |
| Export to Assetto Corsa, unnamed track | the install's own "name the track first…", and no dialog opened |
| header | scrollWidth 1818 = clientWidth 1818, no overflow |

**Not established:**
- No Tauri build. `find_ac_root` was never run against the real registry or a real Steam (by design).
- The card's look in the keeper's hands.
- **No AC launch.**
- Choose another… was not driven in the window, because the fake picker returns nothing. It is tested headless.

**My slips (this item):**
- My first window run counted the closed menu's items as visible: `offsetParent` is not null for a closed `<details>` in this Chrome. I switched to `checkVisibility()` and re-ran.
- My shell heredoc reduced the fake path's doubled backslashes (`\\`) to single ones, so the page showed "G:SteamLibrary…". That was a probe artifact, not the product; I rewrote `fake.js` with the Write tool and re-ran.
- One test-row file and one implementation script were written with heredocs and then checked (escapes verified by grep).

## Update: the startup card tested as the chair asked, plus the 200 ms Ctrl hold, folded into one commit

**Commit `44c7b5f`** (amends my unpushed `33cf6ab`, as the chair asked: "fold it into your item 2 commit"), on `4d58b99`, branch `b-spacefly`. 9 paths. Not pushed. **The second-item section above still describes the UI. What changed since then is below.**

### The startup card on T180_TEST_APP_DATA and a FAKE Steam tree
- **New test seam, `T180_TEST_STEAM_PATH`** (`ac.rs` `test_steam_path` and `steam_path`). It is launch-time, like `T180_TEST_APP_DATA`. An existing absolute folder stands in for the registry's SteamPath.
  - **If it is set but is not a folder, the result is nothing.** A test run never falls through to the real registry, so a run can never find the real AC.
  - `lib.rs`: `get_ac_root` and `find_ac_root` use `ac::steam_path`; the header comment names the seam.
  - Nothing in normal use sets it.
- **New Rust rows:**
  - the three startup states (empty gives the card; remembered is silent; remembered-then-deleted gives the card again with Steam's find);
  - the seam takes only an existing absolute folder (relative and missing are refused).

  The states row passed on the code as it was. The seam row did not compile before `test_steam_path` existed: that is its red.
- **The real app.** Our own debug build (`cargo build`, own target dir), launched four times by `spacefly/card_window.js` (A's launch pattern). Each launch had its own WebView2 profile and DevTools port, `T180_TEST_APP_DATA` set to a fresh folder, and `T180_TEST_STEAM_PATH` set to a fake Steam tree: `steam/` names `lib2/` in a real-format `libraryfolders.vdf`, and `lib2/` holds `steamapps/common/assettocorsa/content/tracks`. The window was off-screen. The run refuses to start while any t180 exe is running. Report: `spacefly/cardrun/report.json`.

  | launch | card | header | ac_root.txt |
  |---|---|---|---|
  | 1. empty app data | "Assetto Corsa found at <fake lib2 AC> (through Steam)…", **Use it / Choose another…** | New, Save, Export to Assetto Corsa, ⋯ | none |
  | 1b. Use it | gone; note "Exports go into Assetto Corsa at <fake AC>" | same | **the fake AC folder** |
  | 2. relaunch | **none (silent)** | same | unchanged |
  | 3. remembered folder deleted | **the card again**, offering Steam's find | same | the deleted path, still unanswered |
  | 4. a Steam with no AC, nothing remembered | "Assetto Corsa was not found through Steam: pick the folder that holds content\tracks…", **Choose…** | same | none |

  0 page errors. **The keeper's app data folder: 10 files, 0 changed** (sha256 snapshot before and after). No AC launch, and no real AC install read.

### The 200 ms Ctrl hold (the chair's ruling on the dip I named)
- **Left Ctrl descends only after it has been held ALONE for `CTRL_HOLD_S` = 0.2 s.**
  - Its key-down now arms `ctrlFly.wait`, and the frame loop counts it down.
  - Only when the wait runs out does Ctrl join `held` and take the view over.
  - **The undo stays as the backstop** for a shortcut slower than 200 ms.
  - `preview.js` lines: the D252 help paragraph, the `ctrlFly` comment, `CTRL_HOLD_S` beside `UP`/`DOWN`, the Left Ctrl branch in `onKey`, and 2 lines at the top of the frame loop.
- **New row, red first** (`preview.test.js`, 73 pass and **1 fail** before the change). Ctrl then Z within 200 ms:
  - not one millimetre after 100 ms of Ctrl alone, or after Z;
  - from the build view, no takeover inside the window;
  - a deliberate 500 ms hold still descends more than 5 m.

  The existing rows needed no change: their Ctrl cases step 200 ms or more before they look.
- **Real window** (Chrome, real keys; `spacefly/wprobe.json`):
  - Ctrl held 600 ms descends **12.25 m**, which is the 400 ms after the hold.
  - **A quick Ctrl+Z, with Ctrl alone for 100 ms: the eye is identical before, at 100 ms and after, and the piece is undone.**
  - The 300 ms Ctrl+Z (the backstop) dips 3.3 m and comes back to the exact eye.
  - Space, Right Ctrl, the focused-button and the name-field rows are unchanged from the table above.

### Numbers (one heavy-run hold; log `spacefly/final.out`)

| file | passing |
|---|---|
| preview | 74/74 |
| keys-anywhere | 6/6 |
| undo-guard | 6/6 |
| camera | 31/31 |
| share-install | 19/19 |
| onboarding | 14/14 |
| core-eqonly | 31/31 |
| core-shell | 28/28 |
| layout-css | 3/3 |
| shell-layout | 3/3 |
| **cargo (whole lib)** | **33/33** |

The run then did the debug build, the card window and the Space/Ctrl window, all exit 0.

### My slips (this update)
- Applying the 200 ms change, **a comment I put mid-line swallowed the rest of that line** (`else ctrlFly = 'spoiled'; }`). preview.js then would not parse, and the first run failed to load `preview.test.js` (plus a `camera.test.js` row that requires it). I moved the comment to the end of the line and re-ran. The numbers above are from the re-run. This is the same slip I made in D242; I now check with `node --check` after any edit that adds a comment mid-line.
- The two `node --check` calls ran outside the lock. They only parse, and run no tests.
- I stopped my first card run (`bor5ju5q1`) before it started, while it was still queued behind A's lock hold, so I could fold in the 200 ms change and run everything once.
