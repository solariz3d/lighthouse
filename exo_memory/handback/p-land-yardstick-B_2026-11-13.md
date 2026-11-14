# p-land-yardstick: E's toe-speed measure for the yardstick, landed on dreamzone-3 main (B, landing pane), 2026-11-13

Packets: the chair's D675 orders of 17:37 (23:35Z), 23:43Z (wait for E's amended tip) and 23:49Z (land `0eabefc`). Tier: the full proof
at landing. Seat: pane B (12fb81f6, sibling-5bf9d657), landing for E.

## Landed

- **dreamzone-3 main `b08f25e` → `796c16f5a06462a8487c0b075ff85e5972c3eb08`**, a fast-forward.
  - checked: `git ls-remote origin refs/heads/main` read `b08f25e` just before the push, then `796c16f…` after it.
- **The merge `796c16f`** merges `yardstick-toe-e` at **`0eabefc`** into the remote's main, `--no-ff`, in the house style. Its tree equals
  E's `0eabefc` (`git diff --quiet 0eabefc 796c16f`).
- **Ten files, all under `tools/` plus the CHANGELOG** (`git diff --name-only b08f25e 0eabefc`). E's files as E wrote them, edited by no one.
- **Landing tree:** `G:\consonance-scratch\b-yardstick-land`, a worktree on G: as ordered. Its submodules are at their exact pins, checked
  out from his clone's module repositories, read only; his `.git/config` was last written at 14:13, before this.

## The registration read (as the lander, before the merge)

`exo_memory/loop/registration_yardstick_toe_speed_E_2026-11-13.md` against E's hand-back `p-d675-yardstick-toe-E_2026-11-13.md` (:106 on,
and the 23:4xZ addendum). Each is within what the registration allows. None loosens a bar to pass, and each was named before its first run.

1. **Row 3's bars.**
   - "Under each cut-off" is read at a quarter of the cut-off, which is still under it. A forward-and-back Butterworth halves a sine at
     its cut-off, so a reading taken there could never keep 2%.
   - "Twice the cut-off" is TIGHTENED from 30% to 10%, so that the registered "forward only" mutant can fire.
2. **Row 5** gains a check, so that the registered "fixed-rate phase" mutant is caught.
3. **Row 6** moves to `dz-yardstick --simtk` (exit 1 on a miss). That keeps "NOT MEASURED when absent, never a pass", which a data-gated
   suite row could not keep.
4. **Falsifier 2's normaliser** has no counterpart on our body (no ball joint). Both bodies are now read as a share of the shank,
   horizontally: like for like.
5. **Falsifier 4** becomes a suite row, which is stronger.
6. **AMENDMENT 3**, ruled 23:43Z and registered (section 0b) before its code.
   - The compared point is the hunter's at the runner's marker place: 0.195 m forward and 0.044 m down from the ankle, held in the foot's
     frame. The joint is printed beside it, never compared, and the verdict is taken from the compared point.
   - Rows 9 to 11 were red at `e5d435c` and are green at `0eabefc`.
   - Row 10, falsifier 5, reproduces C's figures within 0.0195, against a 0.03 bar.

## The proof on the merged tree (under the ordinary lock, hidden, BelowNormal, offscreen; window 23:50:14Z)

| run | result |
|---|---|
| `build.bat test` (the full build and CTest suite) | **14 of 14 passed**, 0 failed (`suite.txt`; chase 355 s, world_app 590 s) |
| `dz-gym --selftest` | **26 of 26** (`gym.txt`) |
| `dz-world --selftest` | **51 of 52** (`world.txt`): one red, named as LOAD below |
| `yardstick_tests` (E's, by name) | **23 tests, 0 failed** (`yardstick.txt`) |

- **The one red is LOAD, not this landing's.** It is "a fall at terminal speed outruns nothing", with 1 wait of 86.6 ms over 920 chunks,
  one of the load-sensitive rows the order names. It was not retried.
  - At the run's end another seat's world self-test was running: C's, in `Desktop\worktrees\dz3-filter-c`, pid 31388, started 00:14:59Z
    (`tasks_at_end.txt`; `Get-CimInstance`).
  - inferred: that it overlapped the fall row itself. I do not have the row's own time.
  - What makes it not this landing's: the merge touches only `tools/` and the CHANGELOG, which the world self-test does not build from,
    and the same row passed on the kit earlier today (53 of 53, `fcf5c43`).
- **Hashes** (sha256, first 16) of the outputs in `G:\consonance-scratch\b-yardstick-land-out\`:
  - head.txt `3e908105f16c2e6d`
  - suite.txt `4dc68ecdf87e9b3f`
  - gym.txt `3c81a3fd13dcd7ee`
  - world.txt `7051c8850fd63b54`
  - yardstick.txt `6028ca88cfa5e4e8`
  - tasks_at_end.txt `bdb0413803497297`

## The scan, of what the push published

checked: `G:\consonance-scratch\b-yardstick-land-scan.js` on `796c16f`.
- **The push gate's own decision** (`consonance/hooks/push-gate.js`, through the landing train's `scanForPush`, which fails closed): **allow**.
- **The privacy scan** of every added line and message not yet on origin (the merge; its first-parent diff is E's whole change): **0 hits**.
- No hook was touched.

## Not done, by the order, and what is left

- **His `Desktop\dreamzone-3`:** not fast-forwarded, built or edited. checked: `git log -1` shows `31d1c6d`, and `git status` is clean.
- **A first run on `704774c` was stopped at the 23:43Z order,** before any result. Its tree was killed with taskkill /T, its lock was
  released, and nothing from it was pushed.
- **Removed nothing.** The landing left these on G: (not C:):
  - `G:\consonance-scratch\b-yardstick-land` (303 MB with its build);
  - `b-yardstick-land-out\` (the outputs above);
  - `b-yardstick-land-msg.txt`, `-scan.js`, `-wait.txt`, `.cmd`, `.cmd.err.txt`, `.cmd.out.txt`.
- **Nothing new on C:.**

NEXT: the librarian reads this when it is rung; the yardstick measure is on main for C and for him.
