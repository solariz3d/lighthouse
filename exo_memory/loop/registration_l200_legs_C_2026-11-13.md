# Registration: L200, the hunter's legs to the yardstick (pane C), written before any code

Pane C (seat 0845a868), 2026-11-13, 11:10Z. The packet: the chair's 10:39:52Z (the ledger's L200), after L195's
variants and before L180 lap 2's rest. The work list is E's L193 table
(`handback/p-l193-yardstick-E_2026-11-13.md:84-138`, 0a61af1b; the full table, with the 2.5 m/s rows and the runners'
mean every 10% of the cycle, `Downloads\dz3-l193-review\table_legs_b90eda9.txt`). Files: `game/model_rig*` and its
tests only; branch `l200-legs` off main. Fingerprints unchanged.

## The bar (E's, registered before anyone tuned to it; :129-135)

Measured by E's tool (`dz-yardstick --data <Fukuchi>` built from origin/l193-yardstick b90eda9 until it lands) on the
hunter's right leg against Fukuchi et al. 2017's runners at 2.5, 3.5 and 4.5 m/s:
- **the knee and the ankle:** RMS from the runners' mean over the cycle no more than the runners' own spread
  (rms/sd <= 1);
- **the hip:** RMS with each curve's own mean removed, no more than the runners' sd (E's amendment, 04:4x local). Its
  mean offset is reported, not gated (the pelvis frames differ: theirs anatomical, ours the body's up).
- **foot down:** reported beside the runners' (40 / 36 / 34% of the cycle); no bar was registered for it, so none is
  invented here.

**Red today, by E's table at b90eda9:** knee 5.2 / 5.3 / 4.6, ankle 5.2 / 5.7 / 7.1, hip 4.4 / 5.1 / 4.5 runner-sds
(plain RMS; the hip's mean-removed figure comes with E's amended tool).

## Rows in the repository, red on main first

The recordings never enter the repository, so the rows in `game/tests/model_rig_tests.cpp` cannot score against them.
They hold landmarks read from the runners' means in E's table (`table_legs_b90eda9.txt`, the "runners range" column
and the every-10% lines), each within one runner-sd, at 2.5, 3.5 and 4.5 m/s:

| landmark | 2.5 | 3.5 | 4.5 | sd (3.5) | main today |
|---|---|---|---|---|---|
| the knee's bend in stance, its most | 41 | 41 | 40 | 8.0 | 4.6 (it does not bend) |
| the knee's bend in swing, its most | 93 | 108 | 117 | 8.0 | 26 / 37 / 47 |
| the ankle's dorsiflexion, its most | 23 | 24 | 23 | 5.8 | 32 / 43 / 54, out of phase |
| the ankle's plantarflexion, its most | -19 | -21 | -25 | 5.8 | -16 / -19 / -22 |
| the hip's whole range | 47 | 59 | 70 | 5.3 | 35 / 44 / 52 |

Flexion is measured from our own standing pose, as E's tool and the lab measure it. Each row is registered red on
main before any leg code.

## What is ours, said now

- **Above 4.5 m/s nothing is covered** (the hunter runs 9 to 13 m/s). The shape there is OURS and is marked so. The stop
  at 6 m/s (`run = speed / 6`, clamped at 1, `model_rig.cpp:688`) is **replaced on purpose**, not left: how the shape
  grows past 4.5 m/s is ours and will say so.
- The curves are procedural: a few named numbers each, each read from the runners' means and cited. **Nothing plays the
  recordings** (E's README: "learn from, never use").

## Falsifier, written now

- The step is degenerating if, to pass E's bar, I need more named numbers than the landmarks above (five per speed) plus
  the timing of each peak, or if the knee and ankle pass while the hip's mean-removed RMS stays above 1 for a reason
  other than the frames. In that case I stop and say so with the number, and E states the hip's bar (the chair's
  packet).
- If the hip cannot reach 1 because of the frames, I do not bend the pose to chase an offset.

## The unwelcome outcome, in the words that would make it true

"The legs score inside the runners' spread and look worse to him than today's." His eye is the bar for the look, so
then they do not land, whatever the tool says.
