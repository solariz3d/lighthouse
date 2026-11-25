# Hand-back: landed d676-filter-on-c 8210cd4 (the light filter on by default) on dreamzone-3 main (pane B, D677, 2026-11-14)

**Packet.** The chair's D677 order of 00:51Z, item 1, and the night order (`loop/night_order_2026-11-14-D.md`, "Pane B", 1).

**THE PUSHED SHA: dreamzone-3 main `e091beb` → `32b9126df98d8fbc6c5a43bf3a9c2d44a600e2ba`.**

    checked: git ls-remote origin refs/heads/main after the push → 32b9126df98d8fbc6c5a43bf3a9c2d44a600e2ba

## 1. The merge

`32b9126` is a `--no-ff` merge of `8210cd4` onto `e091beb`, made at 12:5x before the pause. Nothing was edited, and there was no
conflict.

    checked: git diff 8210cd4 32b9126 → 0 lines (the landed tree is C's tip's tree)
    checked: git diff --stat e091beb 8210cd4 → CHANGELOG.md, game/config/world.txt, game/world/selftest.cpp, game/world/world_settings.h

## 2. The suite, on the quiet machine (the re-run after the pause)

**How it ran.** Under the ordinary lock, BelowNormal, hidden, from `G:\consonance-scratch\b-yardstick-land` (window 00:52:26Z). Each
program's exit code was read on the line after it. Pane A's read-only trace held the other slot.

    checked: tasks_start.txt and tasks_end.txt → no dz-world, dz-gym or StarCitizen
    checked: G:\consonance-scratch\b-filteron-land-out2\suite.txt → "100% tests passed, 0 tests failed out of 14", suite exit 0
    checked: gym.txt → "selftest: passed (26 of 26 checks passed)", gym exit 0
    checked: world.txt → "selftest: passed (61 of 61 checks passed)", world exit 0
    checked: game_tests.txt → "189 tests, 0 failed", game_tests exit 0
    checked: world_app_tests.txt → "67 tests, 0 failed", world_app_tests exit 0

C's three counts (61, 67 and 189) are re-derived here.

## 3. The two world reds of the afternoon, each with its reading

**Where the afternoon's run stood.** It ran beside Star Citizen (13.1 GB, on the same card) and was stopped by the 13:22 pause in
world_app_tests: `G:\consonance-scratch\b-filteron-land-out\`, world self-test 59 of 61, exit 1.

**The fall row**, `[machine-bound] a fall at terminal speed outruns nothing`.

    checked: out\world.txt:86 → FAIL, 17 waits (1206.7 ms) over 606 chunks
    checked: out2\world.txt → ok, 0 waits (0.0 ms) over 920 chunks

- Reading: **the machine's load.** The row is marked machine-bound for exactly this case.

**The seed row**, `a new seed replaces the whole world, and the player stands at its spawn`. It is not marked machine-bound.

    checked: out\world.txt:87 → FAIL, "seed 2: 245 chunks loaded, 245 drawn"
    checked: out2\world.txt → ok, "seed 2: 245 chunks loaded, 245 drawn"

- **What the row asks** (`game/world/selftest.cpp:703-706`), after 120 frames: the new seed is set, the player stands on ground, every
  loaded chunk is drawn, and `ws.pending == 0`.
- **What its detail leaves out.** It prints only the loaded and drawn counts, and those were equal in the red reading too. So the red
  was the player not yet on ground, or GPU builds still pending.
- inferred: the reading is **the afternoon's load**, not the code: the card was shared with Star Citizen, the same tree reads green
  on the quiet machine, and nothing changed between the two readings.
- **Which condition failed is not known.** The row does not print it. A detail line naming the state and the pending count would
  make the next red say which. That is offered, not done.

## 4. The scan and the push

    checked: b-scan-any.js 32b9126 → push gate decision: allow; privacy scan: 0 hits
    checked: git ls-remote origin refs/heads/main before the push → e091beb (a fast-forward)

No hook was touched.

## 5. His clone

    checked: tasklist before the fast-forward → no dz-world or dz-gym
    checked: git -C Desktop\dreamzone-3 merge --ff-only origin/main → HEAD 32b9126, status clean

**The build, as `launch.ps1` itself does it, with nothing started.** `G:\consonance-scratch\b-clone-build.ps1` copies the launcher's
build block: `build.bat` into `build\launch-build.log`, judged by its exit code and the program being there, then `build\launch.stamp`
stamped with the time the build started. It refuses if dz-world or dz-gym is running, as the launcher does. It ran under the ordinary
lock, BelowNormal, hidden.

    checked: G:\consonance-scratch\b-clone-build-out\build.txt → "build exit 0"; "stamped at the build's start,
             2026-11-15T01:21:00.8390413Z"; build script exit 0
    checked: build\launch-build.log, last line → "[25/25] Linking CXX executable bin\dz-world.exe"
    checked: check.txt (powershell -File launch.ps1 world -Check) → "up to date", check exit 0
    checked: tasks_start.txt and tasks_end.txt → no dz-world or dz-gym

Nothing was launched.

## 6. Corrections

- None.
