# Hand-back: landed d675-errlvl-c d50255f (P's timer control and C's render build fix) on dreamzone-3 main (pane B, D675, 2026-11-14)

**Packet.** The chair's D675 order of 05:43:51Z: "LAND d675-errlvl-c d50255f ONTO THE GAME'S MAIN 8249d58. It is the ONE tip that carries both
changes." Tier: the full proof at landing.

**THE PUSHED SHA: dreamzone-3 main `8249d58` → `99b6045308912d47d4696b3ad924b297ee804c09`.**

    checked: git ls-remote origin refs/heads/main after the push → 99b6045308912d47d4696b3ad924b297ee804c09

## 1. Before the merge

    checked: git ls-remote origin → d675-errlvl-c d50255fcbc7d2ceb0a6bf40da6ce989115be35ee, main 8249d580a67df0646a22821b432c3711bf1310bb
    checked: git merge-base --is-ancestor ca915c8 d50255f → yes; --is-ancestor 8249d58 d50255f → yes
    checked: git diff --stat 721b5ce d50255f -- render/build.bat → empty (C's fix unchanged)
    checked: CHANGELOG.md at d50255f, conflict markers → 0; git diff ca915c8 d50255f -- CHANGELOG.md → 0 lines removed, only C's entry
             added (P's entry is whole, before C's)
    checked: the three lock files and heavy-run.hold → none, at 05:41Z and again before the merge

## 2. The merge

- **The merge.** `99b6045` is a `--no-ff` merge of `d50255f` onto `8249d58` in `G:\consonance-scratch\b-yardstick-land`. Nothing was edited,
  and there was no conflict.

      checked: git diff d50255f 99b6045 → 0 lines (the landed tree is C's tip's tree)

- **What it carries:** 11 files, 97 insertions, 3 deletions (`git diff --stat 8249d58 99b6045`).
- **The first try (ruled, dropped).** My first try merged the two tips separately. P's merged clean (local `ad44aa4`); C's met P's at the top
  of CHANGELOG.md's `### Fixed`, so I aborted it and rang (`G:\consonance-scratch\b-timer-errlvl-conflict.txt`). C then merged P's tip into
  its branch. `ad44aa4` is dropped and is on no branch.

## 3. The checks on the merged tree

They ran under the ordinary lock, at BelowNormal, offscreen, from the G: tree (`G:\consonance-scratch\b-timer-errlvl-land.cmd`, by the waiter,
window at 05:44:23Z). Each program's exit code is read on the line after it, at top level.

    checked: b-timer-errlvl-land-out\suite.txt → "100% tests passed, 0 tests failed out of 14", suite exit 0 (448 s)
    checked: b-timer-errlvl-land-out\gym.txt → "selftest: passed (26 of 26 checks passed)", gym exit 0
    checked: b-timer-errlvl-land-out\world.txt → "selftest: passed (61 of 61 checks passed)", world exit 0; the timer row: "ok  the 1 ms
             timer is asked to be honoured, not left for Windows to ignore: power throttling control mask 4, state mask 0"
    checked: b-timer-errlvl-land-out\game_tests.txt → "189 tests, 0 failed", game_tests exit 0

- **The world self-test reads 61 rows on the merged tree.** That is P's count on its merge, with the timer row in.
- **It exited 0, not 3, so no re-read was owed.**

**What the timer control lands on.** It lands on its self-test row (above), with P's 03:41Z session and the sleep probe behind it. P's
interleaved bench on the merge (05:35Z to 05:39Z) drew every frame in all six runs, red and green alike, so tonight's bench does not show
the control's effect.

## 4. The scan and the push

    checked: b-scan-any.js 99b6045 → push gate decision: allow; privacy scan: 0 hits
    checked: git ls-remote origin refs/heads/main just before the push → 8249d58 (a fast-forward)

- **No hook was touched.**
- **His play clone was not touched.**

      checked: git -C Desktop\dreamzone-3 rev-parse --short HEAD → 31d1c6d; status --short → empty

## 5. WHERE IT STOPS

- **Landed and pushed.** dreamzone-3 main is `99b6045`. C's cost table starts from its own watcher on main.
- **The landing tree.** `G:\consonance-scratch\b-yardstick-land` is left detached at `99b6045`, with its build. It is on the disk list
  (`p-lapw-r-B_2026-11-13.md`, WHERE IT STOPS); nothing is removed.
- **The run's records.** `G:\consonance-scratch\b-timer-errlvl-land-out\` holds `head.txt`, `suite.txt`, `gym.txt`, `world.txt`,
  `game_tests.txt` and the task lists.
- **Nothing of mine is running or held.** No lock or hold of mine remains, and every background job I started has ended or was stopped
  (the remote watch, at 05:33Z).

## 6. Corrections

- None in this landing's figures.
