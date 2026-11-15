# p-b1b-lean-limits-C: the lean yields to walls, a human body keeps a human lean, the view can ride the head

Pane C (seat 0845a868), on D, the night of 2026-11-14 (ledger D677). The packet: `exo_memory/loop/packet_b1b_lean_limits_C_2026-11-14.md`
(84 lines). The chair's tier is prove it; the packet's is check it; I take the higher. Branch: dreamzone-3 `b1b-lean-limits-c`, on my
`b1-lean-c` a0996d3.

## REGISTERED BEFORE IT RAN ON HIS RUN: the straights method changed, and why (committed ahead of the gate)

**The method I registered first** (in the row's own comment, before code): a dead band on the asked lean in the player's row,
its value the 95th percentile of the asked lean on the flee bot's straights, then gated on his run.

**It failed on its own rule before any code used it.** checked: `G:\consonance-scratch\c-d676\b1\red-rock_on_the_straights.txt`
→ the flee bot's straights (2,843 frames) ask p50 0.53, p90 28.27, p95 45.00, p99 45.00 degrees. Most of a straight asks
almost nothing, with one-tick spikes of the bot's direction changes that reach the cap. So a dead band at p95 is 45 degrees,
past the player's own limit of 15, and would hide every lean. A dead band cannot remove a spike; it only moves the threshold.

**Registered in its place, before anything runs on his run:**

- **The method:** the packet's other allowed method, a smoothing of the simulation's own sideways acceleration (never drawn
  positions), in the player's row: `LeanRow::smooth`, an exponential average with that time constant, tick by tick.
- **Its value:** the smallest of 0.05, 0.1 and 0.2 s that holds the flee bot's straights to 0.5 sign changes a second, with R2
  still under 0.05 s on the bot.
- **How it is chosen:** on the bot alone (`train.sh`, `DZ_LEAN_RUN` unset, so neither row reads his run).
- **The gate:** then on his run 20:29 only, at the bar of 0.5 a second.
- **Unwelcome outcomes, named now:**
  - none of the three holds the bot to 0.5;
  - the one that does breaks R2 on the bot;
  - it passes on the bot and fails on his run.
- **If any of those happens, I report it red and do not search further values.**

The chaser's row stays at 0 (no smoothing): its rocking is the chase's sway, which pane A's weave replaces.
