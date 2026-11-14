# L185: with C's pop fix merged, R4.5 and R5.3 hold their FIRST registered bar, 30 m/s on every body. The soft-keyed amendment comes out (pane E, machine D, 2026-11-13)

Ruling: the chair's D675, 01:15Z, "READ R4.5 AND R5.3 AT THEIR FIRST REGISTERED BAR: 30 m/s, EVERY body. On
l185-skeleton-steps45 (1b690fd on the remote) WITH 81eb5240 MERGED ... IF THEY HOLD: the 17:01 amendment ... COMES OUT BY
NAME ... Say so in the test's comment, with both readings."

## Which way it went: it HOLDS, and the registered form is restored

dreamzone-3, local branch **`l185-steps45-pop`** in `G:\consonance-scratch\dz3-e-l185pop` (not pushed):

| commit | what |
|---|---|
| `aafb97a5d285f912adf0e3d05ac8e8e9d488fb69` | merge of main `81eb52402226b05286c3608e1660478b3026bba8` into `1b690fd` (clean; CHANGELOG auto-merged) |
| `52da2b525fb2ba97fc0febbc70aadb94ea3fc1b3` | R4.5 and R5.3 back to "no body faster than 30 m/s", every body; the comments carry both readings and the two amendments' history |

checked: `ragdoll_tests` on the merged tree, with the checks at the registered form, under heavy-run behind C's hold
(log `scratchpad/pop_bar_kept.log`) → **10 tests, 0 failed**

| row | on main d002b65 (before the pop fix) | with 81eb524 merged |
|---|---|---|
| R4.5, the 60 s drive | fastest body **30.67 m/s**, ToeR (keyed): over 30 | fastest body **28.60 m/s**, HandL (soft-keyed): under 30 |
| R5.3, the chase with the catch | fastest body **30.41 m/s**, ToeR (keyed): over 30 | fastest body **25.59 m/s**: under 30 |

- **The keyed toes no longer lead.** With the merge, the fastest body in R4.5 is the soft-keyed left hand. C's own figure
  for the toe on that drive (30.67 → 24.97 m/s) is consistent with that: the toe is under the hand's 28.60.
  - inferred: I did not print the toe's own speed in this run; the row prints the fastest body and the fastest
    soft-keyed body, and both are HandL at 28.60.
- **So the 17:01 amendment ("no SOFT-KEYED body faster than 30 m/s") is SUPERSEDED** and recorded as such in the R4.5
  comment, with the first amendment's history. R5.3's comment points there and carries its own two readings.
- **The comments were rewritten after the run;** the checks the run used are the ones committed. Nothing else in the
  rows changed.

## Not done here

- **The branch is not pushed.** `l185-skeleton-steps45` on the remote is still `1b690fd`. Pushing `l185-steps45-pop`, or
  moving it onto `l185-skeleton-steps45`, waits for a word.
- **The timing session's branch arm is `1b690fd`, without the pop fix:** `dz3-e-l185`, untouched by this re-read, which
  was made in its own worktree. Its result (R4.7 and the frame-time table) comes in its own ring.
