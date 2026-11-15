# M3c's fix corrected, and the slide check re-registered, before any re-run (2026-11-15 ~03:35, seat A)

Ruling: `exo_memory/loop/packet_m3c_m3b_A_2026-11-15.md`, section "RULED at the collation of M3c" (git-blob 0067e9eb), items 1 and 2.

## The law, corrected (item 1)
While a body on the root slides, its velocity turns toward the aim at the **full** rate its grip allows **at the speed it has after the
tick's own gain**: `min(turn_slow, mu g / max(v_after, kRootWalk))`, the root law's own allowed rate, never past the aim. It is no longer
eased in, and no longer asks `angle / kTurnTau`: both kept it under 0.9 of grip near 20 degrees off and for the first ~19 ticks of a slide
(kTurnTau = kTurnEase = 0.08 s, `chase/chaser.cpp:39-40`). The turn is taken after `root_tick` has set the tick's speed. The heading still
eases toward the velocity, and the slide still ends when they are within 3 degrees. `Chaser::slide_turn` (159aa02) goes; a diagnostic
`Chaser::aim_dir` (the aim's direction the step read, root only, not hashed, as `branch`) is added so a row can read it.

## The checks, by name
- **Falsifier 1, unchanged** (`registration_m3c_fix.md`): sliding, with no new contact that tick, the velocity never turns faster than grip
  allows: `|turn| x 240 x v_after / (mu g) <= 1.001`. Red on 159aa02 (1.024), as it stands.
- **Check 2, re-registered (the ruling's words):** "in every slide of every bend read, on each tick the velocity is more than 20 degrees off
  the aim, it turns toward the aim at no less than 0.9 of what its grip allows at its speed." 0.9 is the librarian's, marked ours.
  - Read as: ticks sliding before and after the step, no new contact that tick, the velocity more than 20 degrees off `aim_dir` before the
    turn; the turn toward the aim x 240 >= 0.9 x `min(turn_slow, mu g / max(v_after, kRootWalk))`.
  - **My reading, stated before the run:** "what its grip allows at its speed" is the root law's allowed rate, which below
    `mu g / turn_slow` (1.87 m/s for the hunter, grip 1.0, turn_slow 300 deg/s) is the body's own turn cap, not grip. Printed beside it:
    the share of pure grip (`turn x v / mu g`) and the count of ticks where the body's cap binds. If the librarian reads it as pure grip,
    those ticks fail it and the count says how many.
  - Read on: the ten corner routes and the three scripted bends (chase_tests, both ways), and pane E's 22 degree bend staged (the AIM and TICK
    lines). **A row that finds no qualifying tick is red**, so the check cannot pass by seeing nothing.
  - **Red first** on e191f60's slide (the aim waits: the velocity does not turn at all) and on 159aa02's (eased, angle/tau).
- **Expected and may fail:** both checks green on the corrected law; the crawl guard still green; H2 and the snapped contact's own checks still
  green; E's 22 degree bend lowest still at least 1.2 m/s. The rows left red by the ruling (H1, G1, the new kind, the 45 degree bend one way)
  are printed and not turned.
- **Off means off:** the 12-seed md5 fa938de4..., D's 20 kept runs.
