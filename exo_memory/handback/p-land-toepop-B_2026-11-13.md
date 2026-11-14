# p-land-toepop: C's fix for the hunter's take-off pop, landed on dreamzone-3 main (B, landing pane), 2026-11-14

Packet: the chair's D675 order of 00:42Z. Tier: the full proof at landing. Seat: pane B (12fb81f6, sibling-5bf9d657), landing for C.

## Landed

- **dreamzone-3 main `796c16f` → `81eb52402226b05286c3608e1660478b3026bba8`**, a fast-forward.
  - checked: `git ls-remote origin refs/heads/main` read `796c16f` just before the push, then `81eb524…` after it.
- **The merge `81eb524`** merges `d675-toepop-c` at **`1477ff8`**, waited for on the remote (pushed at 00:51:27Z, `git ls-remote`, not
  fetched from C's folder), onto main `796c16f`, `--no-ff`.
  - The branch's base is `b08f25e`; the yardstick landing between touched `tools/` only.
  - C's two files equal `1477ff8` (`git diff --quiet 1477ff8 81eb524 -- game/model_rig.cpp game/tests/model_rig_tests.cpp`).
  - Edited by no one.
- **Landing tree:** `G:\consonance-scratch\b-yardstick-land`, the yardstick landing's own tree, on G:. It was already at `796c16f` and
  built, so the build was incremental.

## The proof on the merged tree (under the ordinary lock, hidden, BelowNormal, offscreen; window 01:02:59Z)

| run | result |
|---|---|
| `build.bat test` (the full build and CTest suite) | **14 of 14 passed**, 0 failed (`suite.txt`) |
| `dz-gym --selftest` | **26 of 26** (`gym.txt`) |
| `dz-world --selftest` | **52 of 52** (`world.txt`); the fall at terminal speed GREEN, so no quiet read was owed |
| `game_tests` (C's rows' home, by name) | **189 tests, 0 failed** (`game_tests.txt`), as C's hand-back has it |

- **No load row red;** no game or other world self-test in the process list at the run's start or end (`tasks_start.txt`, `tasks_end.txt`).
- **Hashes** (sha256, first 16) in `G:\consonance-scratch\b-toepop-land-out\`:
  - head.txt `ca77c631e2972c4e`
  - suite.txt `cc2ab51e0124afae`
  - gym.txt `3c81a3fd13dcd7ee`
  - world.txt `0e4652cd2e455169`
  - game_tests.txt `10624d369a06c903`
  - tasks_start.txt `334aa983a28fae86`
  - tasks_end.txt `61ccf315ff1c383e`

## The scan, of what the push published

checked: `G:\consonance-scratch\b-yardstick-land-scan.js` on `81eb524`:
- **The push gate's own decision** (through the landing train's `scanForPush`, which fails closed): **allow**.
- **The privacy scan** of every added line and message not yet on origin: **0 hits**.
- No hook was touched.

## Not done, by the order, and what is left

- **His `Desktop\dreamzone-3`:** not fast-forwarded, built or edited. checked: `31d1c6d`, `git status` empty.
- **Removed nothing.** The landing left on G: only:
  - `G:\consonance-scratch\b-toepop-land-out\`;
  - `b-toepop-land.cmd` and its `.out` / `.err` / wait files;
  - `b-toepop-land-msg.txt`.
  - The landing tree is the yardstick landing's own.
- **The fall-row lap** was set back to wait for this landing: its queued run was stopped before it built anything, and it resumes now.

NEXT: E re-reads R4.5 and R5.3 at 30 m/s on every body now that `81eb524` is on main.
