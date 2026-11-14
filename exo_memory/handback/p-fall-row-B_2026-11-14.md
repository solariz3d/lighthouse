# p-fall-row: the world self-test's fall at terminal speed, declared machine-bound with its counted half kept (B), 2026-11-14

Packet: the chair's D675 orders of 00:17Z and 00:21Z (registration ruled "GO AS REGISTERED"). Tier: PROVE IT. Seat: pane B (12fb81f6,
sibling-5bf9d657). Registration: `exo_memory/loop/registration_fall_row_B_2026-11-13.md`, with its section 8 (four changes named before
the first run).

- **Branch:** dreamzone-3 `fall-row-b`, PUSHED (not landed) at **`0525c64f86019e71856d0ce807d68d2981de06ca`**, on main `796c16f`.
  - `04496d1`: RED, the split, the counted half, the mark, the seam, with the exit rule still the old one.
  - `0525c64`: GREEN, the registered exit rule.
  - Main has since moved to `81eb524` (C's pop fix, `game/model_rig.cpp` and its tests only): no file in common.
- **Worktree:** `G:\consonance-scratch\b-fall-row`, build tree on G:; outputs in `G:\consonance-scratch\b-fall-out\`.
- **Files:** `game/world/selftest.cpp`, `game/world/modes.h`, `game/world/main.cpp`, `game/world/world_app.h`, `game/world/world_app.cpp`.
  The last three carry only the test seam.

## 1. The quiet read, first (falsifier 2)

On main `796c16f`, `dz-world --selftest` once under the EXCLUSIVE hold: **52 of 52**; the fall at terminal speed **0 waits** over 921
chunks. The machine was quiet: no game, no world self-test, no compiler; the card at 0% and 1% (`G:\consonance-scratch\b-fall-quiet-out\`).
Falsifier 2 did not fire: the generator keeps ahead of a terminal fall on a quiet D.

## 2. What changed

**The fall row, three checks** (`selftest.cpp` section 4b):

1. "a fall at terminal speed reaches the bottom with collision under the body all the way": `done`, the depth, `reach_misses == 0`, as
   before. An ordinary check.
2. "every chunk the collision block took in was wanted by the loaded block first (counted, the same on every run)": `WantedLead`, read
   each frame from the REAL streamer's `load_box()` and `collide_box()` (`world/stream.h`). Bar: at least one chunk taken in, none
   unwanted, the least lead at least 1 frame. The least lead is printed in frames and metres. An ordinary check.
3. "a fall at terminal speed outruns nothing: no tick had to wait for a chunk": `sync_waits`, unchanged in what it reads, now
   `Checks::machine_bound`. Marked `[machine-bound]` on its line and counted apart.

**The rest:**
- **The exit** (`modes.h`): `selftest_exit_code(failed, machine_bound_failed)` gives **0** when all pass, **3** when the ONLY reds are
  machine-bound, and **1** for any other red. On 3 the summary line says "machine-bound red only: re-read once under the exclusive hold
  before it counts". A row at the self-test's start checks the rule on five fixed pairs.
- **The seam:** `dz-world --slow-workers MS` (`game/world/main.cpp` parses it into `modes.h`'s Options; `WorldApp::set_worker_delay_for_tests`), which rebuilds the world
  with `StreamParams::worker_delay_ms`. Its help line says it is a test seam, and it is not a world setting.

## 3. The proof

| run (`b-fall-out\`) | result |
|---|---|
| 1, RED (`04496d1`), `--selftest` | 54 of 55, exit 1: the one red the exit-rule row ((1,1) gave 1, (2,2) gave 1) |
| 1, RED, `--slow-workers 30` | 53 of 55: the exit-rule row, and the fall's waits **18 (1350.4 ms), red and MARKED** |
| 2, GREEN (`0525c64`), `--selftest` | **55 of 55, exit 0** |
| 2, GREEN, `--slow-workers 30` | **54 of 55, exit 3**: the only red the machine-bound waits (18, 1346.2 ms); "machine-bound red only …" |
| 2, mutant "3 whenever any machine-bound red" | the exit-rule row RED ((2,1) gave 3), exit 1 |
| 2, mutant "a loaded block that does not lead" | the counted row RED: 171 of 180 not wanted first, least lead 0; exit 1 |
| 3, GREEN, `build.bat test` and `dz-gym --selftest` | **14 of 14** suites; gym **26 of 26** |

- **The counted row read 180 chunks taken in, 0 not wanted first, a least lead of 19 frames (2.38 m), on every unmutated run, slowed or
  not.** That is section 4's experiment answered: the WANTED count does not move with the workers' speed, while the waits do (0 against
  18). It is the same on every run, as registered.
- **Both mutants were restored by WRITING the saved file** (sha256 `7494702c247b`, `5c74872c5e45`), so the next build recompiled, and
  the final build exited 0.
- **Two registered mutants did not run, said plainly:**
  - **"The machine-bound mark applied to the whole fall row":** no row can see it while the fall reaches the bottom with collision; it
    shows only when a non-timing part fails. Caught by the split itself (`reach_misses` and the depth sit in check 1, an ordinary
    check), not by a run.
  - **"The lead read from what is READY":** a ready-based count moves with the workers. It is caught by the cross-run comparison above
    (180 / 0 / 19 normal and slowed), not by a row inside one run. Section 4's READY lead was not printed; the waits stand for readiness.
- **Scan of the branch:** the push gate's decision allow; the privacy scan 0 hits over the two commits.

## 4. The landing train and the line for BUILDING.md (asked, item 4)

- **Proposal, for the train's owner, not built:** the train's dreamzone-3 check should READ exit 3 itself. Today `failingRows` reads a
  self-test's FAILED total, and exit 3 prints no FAILED. A nonzero exit with no failing line reads as "a broken check", which is wrong.
  - On exit 3 the train should re-run `dz-world --selftest` once under the exclusive hold (it already knows how to wait for and take
    the hold).
  - Exit 0 there lands, with both readings in its board line. Anything else is the branch's own red.
  - This turns the named step into a gate, which is what falsifier 3 asks for if the step is ever skipped.
- **The line, as text for the lander to place** in `consonance/src-tauri/brief/BUILDING.md`'s landing section (not edited here):
  > a world self-test that exits 3 is re-read once under the exclusive hold, and the hand-back names both readings

## 5. Corrections

- **The registration's section 8.3 expected the FLIGHT row to go red under `--slow-workers 30`, so that run would exit 1. It did not:
  the flight row stayed at 0 waits** (both slowed runs). So exit 3 WAS shown end to end (run 2 slowed), not only on the pure function.
- **The red-first run was queued once and stopped** before it built anything, when the pop fix's landing was put ahead (its waiter's
  bash ended by id, creation time and command line together). It was re-queued after that landing was pushed.

## 6. Not done

- The flight row (:469-470) keeps its ordinary form; it was green at 0 waits in every run here.
- No change to the stream's radii, the generator, the fall speed, the landing train or BUILDING.md.
- Not landed: the branch waits for a lander and the full proof at landing.

NEXT: the librarian names a lander for `fall-row-b` 0525c64; the train's owner rules on reading exit 3.
