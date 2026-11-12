# L177: the hunter leans INTO the turn, before its heading turns (his item 151). Librarian, on L, 2026-11-12 03:1x local

**His words** (`briefs/dreamzone2_the_game.md` 151): "it still doesnt look good, it will turn, and then lean, not lean into the turn".
**Base:** dreamzone-3 main `c83f8dc` (L173 landed: `handback/p-l173-lean-C_2026-11-12.md`).

## The cause (read by the librarian; the pane checks it)
- **L173 drew the lean from the turn already happening:** the turn rate goes through a 0.36 s spring, a 0.5 rad/s dead zone and a lean spring capped at 100°/s (`game/world/world_app.cpp` WorldApp::ease_poses). A lean built from the heading's change can only follow the turn, and the springs make it later.
- **A runner leans to make the turn.** The lean comes first, and the heading follows.
- **The anticipating signal already exists in the chase.** `chase/chaser.cpp` (~:285-305) sums the turn over the corner ahead (`turn`, out to `kCornerSpan` of path) to choose the braking speed. The lean can be driven by the same number: the corner coming up, at the speed it will be taken.
- **L173's test never measured the timing.** Its bars were jitter only. This plan's bar is the timing.

## The work (C, picture only unless the pane shows it must touch `chase/`)
1. **Register first, red on c83f8dc:** a row that, over his kept run `run-20261112-080014` (the one L173 used) and the bot's run, finds each corner where the heading turns at least 45° within 1 s. It then measures **the lag from the drawn lean's peak to the heading's peak turn rate**.
   - **Pass:** the median lean peak comes **at or before** the turn-rate peak, never later than 0.05 s after it, in both runs.
   - **Kept from L173:** sign changes on straights ≤ 0.5/s, lean rate ≤ 120°/s, and the corners still reach the full drawn lean.
   - The row must fail on c83f8dc. Record its lag in the hand-back.
2. **Fix at the cause.** The lean comes from the corner ahead, carried in the pose: for example, the chase's upcoming-corner turn and the distance to it, handed through `ChaserPose`. If that crosses into `chase/`, the fingerprints must not move (a pose-only field). It builds as the corner nears and releases on the way out. Keep the straight-line steadiness L173 bought.
3. **Show him:** re-make `lean_over_his_run.svg` with the heading's turn rate drawn on the same time axis, so lean-before-turn is visible. Add a lit corner capture if one exists in his run or the bot's; L173's corner was dark.
4. **Land as L173 did:** exclusive hold, ctest, both selftests, stamp, scan, push-gate, push. Hand-back `p-l177-lean-leads-C`.

## Not in this lap, and why (his question, answered)
Booth's Left 4 Dead insight is three things (`handback/p-l169-code-A_2026-11-12.md` I1–I3):
- **momentum** (SLIP): being measured by A in L170 now;
- **look-ahead** on an unstraightened path (L-I1): queued after SLIP;
- **local avoidance** (P6): parked for the lesser chasers' arc.

Those change how the chaser *moves* through a corner. L177 changes how it *shows* the corner it is about to take. They stack: once SLIP and the look-ahead land, the turn itself is a gradient, and the lean should lead it.
