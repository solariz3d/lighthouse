# The tell row's run: red first, then green on main and on B's kit, the chute's run included. The kit does not change the tell (pane E, machine D, 2026-11-13)

Packets: the chair, 20:48:30Z (I own the row; re-register it, then one run) and 20:56:58Z (GO). The registration is
`loop/registration_tell_row_E_2026-11-13.md` (6b2ca7b2). Tier: prove it.

**Branch `tell-row-e`, at `5e49c97` on 31d1c6d.** It touches only `game/world/selftest_run.cpp`, and is local and not
pushed. B's kit takes it as it is: cherry-picked onto B's head `6d445e6` it applied cleanly as `535e152`, in a scratch
worktree, never pushed.

## The table

checked: `dz-world --selftest` under heavy-run, BelowNormal, offscreen. Drivers `scratchpad/tellrun.js` and
`tellrun2.js`; outputs `scratchpad/tellrun/`.

| run | case | quiet: band / mix / hunter m / decay s / n | tell's first third: band / hunter m | tell's last third: band / mix / hunter m | row |
|---|---|---|---|---|---|
| **mutant**: the tell silenced in the mixer, never committed | passage | 0.00127 / 0.0969 / 5.8 / 1.20 / 251 | 0.00117 / 14.7 | **0.00116** / 0.0581 / 15.1 | **FAIL**; self-test 51 of 52 |
| `tell-row-e` (main 31d1c6d) | passage | 0.00127 / 0.0969 / 5.8 (2.9 to 11.7) / 1.20 / 251 | 0.00655 / 14.7 | **0.04620** / 0.0958 / 15.1 | ok; 52 of 52 |
| B's kit `6d445e6` + the row | passage | 0.00110 / 0.0737 / 15.2 (3.5 to 24.3) / 1.47 / 234 | 0.00654 / 24.3 | **0.04619** / 0.0922 / 16.5 | ok |
| B's kit `6d445e6` + the row | **chute's run** | 0.00109 / 0.0585 / 15.0 (10.8 to 23.3) / **1.66** / 260 | 0.00649 / 25.5 | **0.04617** / 0.0835 / 21.9 | **ok**; 53 of 53 |

- The tell's own level, at the same points in every run: 0.00 in the quiet, 0.17 in the first third (most 0.33), 0.83 in
  the last (most 1.00).
- On main the chute's case prints **NOT RUN** ("none of the 8 nearest reprieves is reached that way"), as registered:
  main has no chutes.
- **The card, at each run's start and end:**
  - the GPU at 6%, then 29% and 1.9–2.6 GB at the first run's end, where another pane's `dz-world` capture held the
    other slot;
  - then 9% and 8% for the second run;
  - no game process at any of the four readings.
  - Files: `scratchpad/tellrun/gpu*_*.txt`.

## What it answers

1. **The row was at fault, not the kit.** In its own band the tell grows to the same figures, within 0.00003, on main's
   passage, on the kit's passage and on the kit's chute: 0.0462 at its end against 0.0011–0.0013 in the quiet, about
   36- to 42-fold. **The kit does not change the tell.** Of the three registered outcomes, the second ("the kit
   changes the tell") did not happen.
2. **My answer is borne out where it can be checked. The third registered outcome, "my answer was wrong", did not
   happen.**
   - The hunter's distance differs between the windows in every case.
   - On main's passage the hunter is near in the quiet (5.8 m) and far through the tell (15 m). So **the whole mix
     reads 0.0969 in the quiet against 0.0958 at the tell's end. The old row would have failed on main itself in this
     run.** It was reading the hunter.
   - The room's decay at these reprieves is 1.20 s, 1.47 s and **1.66 s on the chute's run**. That is longer than the
     old row's 1 s, and shorter than the 4 s the acoustics allow.
3. **Red first is shown.** With the tell silenced, the row fails, because the band does not grow: 0.00116 against
   0.00127. Everything else in the self-test still passes, so the row sees the tell and only the tell.

## Corrections

- **The first run voided two of its three steps.** Its build step never ran (a `set` with a trailing space and a
  bracketed `if` inside one `cmd /c` line), so the "mutant" ran the clean executable and the kit's worktree had none.
  The passage figures from that run stand: its executable was the committed row's.
- **The second driver refuses a build that does not link `dz-world`,** and it made the two voided steps again.
- **`mixer.cpp` was restored after the mutant and checked equal** (`git diff --quiet`: yes) both times.

## WHERE IT STOPS

- **`tell-row-e` is ready for B's kit to take and for main.** It is not landed and not pushed; a landing word decides.
- inferred: with the row taken, B's kit's tell row is green. The table's kit runs are the row cherry-picked onto
  `6d445e6`.
