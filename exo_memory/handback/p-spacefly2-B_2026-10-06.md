# D252 follow-up: C's "Found" list (pane B, author; FEEL tier, rows and fake hosts only)

**Commit `64fa6cf`** on branch `b-spacefly2`, worktree `C:\Users\nname\Desktop\worktrees\b-spacefly2-wt`, on t180 main `c698f4e` (my D252 plus A's D251 pointer lock). 8 paths, named on the commit. Not pushed.

**No real window was run.** Everything is rows and fake hosts, per the packet: no pointer lock, no OS focus taken.

Source: `exo_memory/handback/p-spacefly-C_2026-10-06.md`, "Found".

## 5: Ctrl held to SNAP a handle drag flew the camera: REAL, fixed
- **Cause**, confirmed by C's reading and by my row. `handles.js` calls `preventDefault()` on `pointerdown`, which suppresses the compatibility `mousedown`. `preview.js`'s `onAnyDown` listened only to `mousedown`. So during a handle drag, Left Ctrl saw no button down, and after the 200 ms hold it descended.
- **Fix** (`app/preview/preview.js`): window-level capture listeners for **`pointerdown` → `onAnyDown`** and **`pointerup` → `buttons = 0`**, beside the `mousedown` one, and removed in dispose. A handle's `preventDefault` cannot stop the `pointerdown` itself.
- **Row, red first:** "a handle drag (pointerdown only, its mousedown suppressed) with Ctrl held past 200 ms to snap…". With a `pointerdown` and no `mousedown`, Ctrl held for 500 ms leaves the camera unmoved. In the other order, a `pointerdown` that joins a Ctrl already descending puts the camera back where Ctrl found it.

## 4: the "lookAt: up is parallel" flood: REPRODUCED in rows, fixed (it predates D252)
**Reproduced** with scratch probes on the test file's own fake host (`spacefly2/overhead_probe*.js`):
- On a placed track, cycling C through every view after Space/Ctrl/E flights threw **0** times: 5 sequences, then 6 more with the pitch at ±89°, sprinted flights, and wheel zoom at both extremes. So cycling alone does not reach it.
- **A move key pressed IN the overhead view does** (`overhead_probe4.js`). W, E, Space and Left Ctrl each took the view over into free at **pitch −90°**, and **every frame threw**, 19–20 of 20. **W does it too, so this is not caused by D252.** inferred: it predates D252; Space and Ctrl only added ways in. I did not run it on a pre-D252 commit.
- **Cause:** `cameras.js` `enterFree` took over a straight-down view with `free.pitch = asin(d[1])`, with no clamp. That is −90°, along the world up the free pose keeps, so `lookAt` has no right vector. `look()` already clamps to ±89°; `enterFree` didn't.

**Fix** (`app/camera/cameras.js` `enterFree`, 6 lines, which is outside preview.js; the packet named no file limit for this item):
- the pitch is held within ±89°;
- a view looking straight down or up gives its heading by its own **up**. For overhead, that is the growth direction up the screen, so leaving overhead faces where the track grows instead of an arbitrary yaw.

**Row, red first:** "a move key from the OVERHEAD view enters free with no frame throwing…". For each of W, Space, E and Left Ctrl, from overhead: 6 frames with no throw, pitch exactly −89°, facing the overhead's up to 1e-6.

**One more probe sequence**, on an EMPTY track (`overhead_probe3.js`: W, then the overhead zoomed to both extremes while cycling): **30 throws per run before the fix, 0 after.** I could not reduce it to a row that fails on the old code. Two versions of an empty-track row passed on the old code, so I removed the row rather than keep one that reproduces nothing. The fixed probe numbers are kept as evidence.

## 1 and 2: cosmetic, fixed
- **1** (`app/install/index.js`): the startup card goes once Export to Assetto Corsa has found and remembered AC (`!r.needsRoot` after the install), or when a folder is picked. **Row, red first:** with a real `card` element, the card is up; Export finds and remembers; the card is gone.
- **2:**
  - `app/index.html`: `.more-menu` hangs from the ⋯ button's **right** edge (`right: 0`), so it opens toward the window, and `.t-install-note` is cut to a 34-character box with an ellipsis.
  - `app/install/index.js`: every note write goes through `say()`, which also sets the note's `title` to the whole text.
  - **Row, red first:** a 170-character note has `title` equal to its text; the stylesheet's `.more-menu` has `right: 0` and no `left: 0`; `.t-install-note` has a max-width and an ellipsis.
  - **Not measured in a window** (no real window, per the packet). inferred: with the menu right-aligned to a ⋯ that sits inside the header, which fits (C measured overflow 0), the menu cannot pass the right edge.

## 3: the seam's non-Unicode leak: fixed
- `src-tauri/src/ac.rs`: `steam_path()` reads `std::env::var_os`, through a new testable `steam_path_from(var, registry)`. **Set** means the seam, whatever it holds: a usable folder, or nothing. A value that is not Unicode gives nothing. **Only unset** reads the registry.
- **Rust row** (Windows): a value built from UTF-16 `C:` plus an unpaired surrogate gives nothing; a relative value gives nothing; neither reads the registry (0 calls); an existing absolute folder is used; unset reads the registry (1 call).
- **Its red was not run separately.** I wrote the fix right after the row, and for a new function the red would have been a compile failure. The leak itself is by reading `env::var`'s `Err` arm, as C found.

## Every line I touched
| file | where |
|---|---|
| `app/camera/cameras.js` | `enterFree` |
| `app/preview/preview.js` | `onAnyUp` beside `onAnyDown`; the add-listener line; the dispose line |
| `app/install/index.js` | `say`, `dropCard`, `pick`, `install.onclick`, `seeIt.onclick`, `remember` |
| `app/index.html` | `.more-menu` (`left` → `right`); a new `.t-install-note` rule |
| `src-tauri/src/ac.rs` | `steam_path`, `steam_path_from`, 1 test |
| tests | `app/test/preview.test.js` (2 rows), `app/test/share-install.test.js` (2 rows) |
| `CHANGELOG.md` | Fixed, 4 entries |

Nothing in `handles.js`, `panel.js` or `coreshell.js`.

## Numbers (all under the heavy-run lock; logs in my scratchpad `spacefly2/`)
**Red on `c698f4e`** (`red.out`): preview 74 pass / 3 fail (the overhead, empty-track and handle rows); share-install 19 / 2 (card, note+menu).

After my row fixes (below), with the source fixes stashed, the old code gives preview 75 / **2 fail**: the overhead and handle rows (`prevbase*.out`). The empty-track row passed there and was removed.

**Green on `64fa6cf`** (`green.out`; preview re-run as `prev4.out` after the row changes):

| file | passing |
|---|---|
| preview | 76/76 |
| camera | 31/31 |
| share-install | 21/21 |
| onboarding | 14/14 |
| core-eqonly | 31/31 |
| keys-anywhere | 6/6 |
| undo-guard | 6/6 |
| core-shell | 28/28 |
| layout-css | 3/3 |
| shell-layout | 3/3 |
| handles | 18/18 |
| core-pieces-ui | 23/23 |
| cargo (whole lib) | 34/34 |

## My slips
- **Two of my new rows were wrong at first.**
  - One never released C, so Left Ctrl rightly refused to fly with another key down.
  - One pressed C five times from build, which comes back round to build, not free.

  I fixed both and re-ran. I also re-ran them on the stashed old code, to show the reds still held. They did for the overhead and handle rows; the empty-track row did not, and I removed it.
- **Removing that row, my cut stopped at a `});` inside it**, which broke the test file's parse. Found by `node --check`; the leftover lines were removed.
- A probe writer and a row generator failed on quote escaping or path spelling before anything ran, and were redone as written files.
- Several `node --check` parses ran outside the lock (parses only, no tests).
- I used `git stash` on my own worktree, on the two source files only, to run the reds; the stash was popped.

## Not established
- No real window at all: the menu's position on screen, the card's look, and pointer lock beside my `pointerdown` listener with a real mouse.
- Whether the empty-track flood path seen in probe3 has a cause other than the straight-down entry. Its numbers went from 30 to 0, but I could not isolate it into a failing row.
- No harness.
