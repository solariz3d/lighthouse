# Hand-back: landed look-residue-o 59d4a22 (O's seam fix) and e6-course-e 52db98d (E's course film) on dreamzone-3 main, one suite, and his copy (pane B, D677)

**Packet.** The chair's order of 14:10:46Z: one batch on main 79326e4, ahead of anything else that lands. Tier: prove it.
- O's fix changes the simulation; `riser_keeps_speed` is 1 by default, and a record that does not name it reads 0.
- E's tool is a film tool, nothing in play.

**THE PUSHED SHA: dreamzone-3 main `79326e4` → `c6625363c82dcca6e94d15b65bc703d2072d9053`.**

    checked: git ls-remote origin refs/heads/main before → 79326e45…; after the push (14:46:37Z) → c6625363c82dcca6e94d15b65bc703d2072d9053

| commit | parents | what |
|---|---|---|
| `29d1e0c` | `79326e4`, `59d4a22` | O's seam fix and the held look back's border (10 files, +165 -4) |
| `c662536` | `29d1e0c`, `52db98d` | E's `--film-course` (6 files, +339 -1) |

Both merges were clean.

    checked: git merge --no-commit → "Automatic merge went well" twice; conflict markers in CHANGELOG.md, main.cpp, world_app.cpp → 0

## The whole suite, once

**How it ran:** `G:\consonance-scratch\b-batch2-land.cmd`, under the ordinary lock, BelowNormal, on G:'s tree.

    checked: G:\consonance-scratch\b-batch2-land-out\head.txt → c662536, tree clean
    checked: suite.txt → "100% tests passed, 0 tests failed out of 14", suite exit 0
    checked: view.txt → 32 of 32, exit 0; gym.txt → 26 of 26, exit 0; world.txt → "selftest: passed (65 of 65 checks passed)", exit 0
             (no clock row red; the 12:31Z ruling not needed)
    checked: game_tests.txt → "200 tests, 0 failed", exit 0; world_app_tests.txt → "86 tests, 0 failed", exit 0
    checked: replays.txt → HIS SEVEN KEPT RUNS OF 2026-11-14 (copies, records unchanged; none names riser_keeps_speed, so each reads 0, the old
             rule), each "the same run to the bit", exit 0: 7 OF 7
    checked: tasks_start.txt and tasks_end.txt → no StarCitizen

## The scan, the push, his clone

    checked: b-scan-any.js c662536 → push gate allow; privacy scan 0 hits
    checked: no dz-world or dz-gym of his from Desktop\dreamzone-3; his clone clean; git merge --ff-only origin/main → HEAD c662536

## HIS COPY BUILT AT c662536, nothing launched

Built with my stamp script, as launch.ps1 builds it, under the lock, his clone as the tree.

    checked: G:\consonance-scratch\b-his-build-out.txt → "before: build needed: sim\world.cpp is newer than the last build"; "build.bat exit 0,
             started 2026-11-15T14:56:25.6383226Z, ended …14:56:54.3399208Z"; "stamp written: 2026-11-15T14:56:25.6383226Z"
    checked: build\bin\dz-world.exe → contains "c6625363c82dcca6e94d15b65bc703d2072d9053"; launch.ps1 world -Check → "up to date", exit 0
    checked: no dz-world or dz-gym of his from Desktop\dreamzone-3. NOTHING LAUNCHED.
