# Hand-back: landed replay-world-e 2981be1 (pane E's replay fix) on dreamzone-3 main (pane B, D677)

**Packet.** The chair's D677 order of 06:04Z. Tier: prove it. "His kept runs must still replay the same on the merged tip; name that
count."

**THE PUSHED SHA: dreamzone-3 main `b4fc561` → `13fd3db6fecf0dc06463f0df708981d44047991d`.**

    checked: git ls-remote origin refs/heads/main before → b4fc561; after → 13fd3db6fecf0dc06463f0df708981d44047991d

## 1. The merge

`13fd3db` is a `--no-ff` merge of `2981be1` onto `b4fc561`. It was clean, and the CHANGELOG merged by union.

    checked: CHANGELOG.md conflict markers → 0; git diff b4fc561 13fd3db -- CHANGELOG.md → +8 lines (E's entry, 7 lines and a blank),
             0 removed; E's own commit adds the same 7 → no doubled lines
    checked: git diff --stat b4fc561 13fd3db → 9 files, +105 -8

## 2. The suite, and his kept runs

**How it ran.** Under the ordinary lock, BelowNormal, hidden, G: tree, window 06:34:17Z, ending 07:00:08Z.

    checked: G:\consonance-scratch\b-replay-land-out\suite.txt → "100% tests passed, 0 tests failed out of 14", suite exit 0
    checked: gym.txt → 26 of 26, exit 0; world.txt → "selftest: passed (64 of 64 checks passed)", exit 0
    checked: game_tests.txt → 196, 0 failed, exit 0; world_app_tests.txt → "71 tests, 0 failed", exit 0 (E's 71)
    checked: replays.txt → HIS SEVEN KEPT RUNS OF 2026-11-14 (copies in G:\consonance-scratch\b-lookback-runs, records unchanged), each
             "the same run to the bit (both fingerprints match)", exit 0: 7 OF 7
    checked: tasks_start.txt and tasks_end.txt → no dz-world, dz-gym or StarCitizen

**Pane C's timing session.** C's exclusive hold was written at 06:43:47Z, while this run held its slot. The scan and the push waited
until the hold was gone (07:03Z). An exclusive holder waits for every slot to be free first, so this run did not overlap its windows
(inferred: from heavy-run's own rule, header of consonance/tools/heavy-run.js).

## 3. The scan, the push, his clone

    checked: b-scan-any.js 13fd3db → push gate allow; privacy scan 0 hits
    checked: no dz-world or dz-gym from Desktop\dreamzone-3; merge --ff-only → HEAD 13fd3db; df -B1 /c → 18,587,320,320 bytes (under
             20e9): NOT BUILT; launch.ps1 world -Check → "build needed: game\world\world_settings.h is newer than the last build", exit 0
