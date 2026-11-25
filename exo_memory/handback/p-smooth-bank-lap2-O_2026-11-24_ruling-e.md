# Pane O, LAP 2: item (e) needs a ruling before it is coded

Seat c88002b1, 2026-11-24. Branch o-smooth-bank 513cd93. Items a–d go on meanwhile; nothing in them waits on this.

## What (e) is, read from the code

`src/core/adapter.js` `bankPlan` reads the built bank every `BANK_DS` = 2 m along a run of road pieces. Wherever the roll's acceleration over those
chords passes `BANK_BAR` = 29.4/(10·170²) = 1.017e-4 rad/m² (0.0058 °/m²), it re-rounds a window there. Where the road turns (|κh| > 1/600), a window may not
move the bank more than `BANK_TURN_KEEP` (4°), and one that would is held. That is why the crossing is built exactly as laid (0.00°, lap 1 §6). On a
straight there is no such hold, so it always re-rounds. So "lay on a straight what the adapter would build there", in the solve, means
**|φ″| ≤ BANK_BAR wherever the flowing piece's road does not turn.**

## Why that is a ruling: the S's own marks cannot meet it

These are lower bounds from the bar alone (a C2 curve cannot jump its acceleration, so it needs more):

| stretch of the banked S | asked | needs at least |
|---|---|---|
| run-in: level at rest to −20° by the first target, on straight road | 80 m (turn A begins at 80) | √(2Δ/a) = **82.9 m** |
| ease-out: 26° at rest to 0 at rest, on straight road | 100 m (EASE_OUT, and the exported "flow" layout) | 2√(Δ/a) = **133.6 m** |

So (e) coded as the plan has it refuses the S's list by name, or the S's marks move: the run-in's first target later than ~83 m, or turn A earlier, and the
ease-out over at least ~134 m. The S's ease-out is a flowing piece too (`bankShape: 'flow'`, no marks), which is why the 9.58° is the solve's to fix.
**Either way, the "flow" layout he is about to drive (G:\consonance-scratch\o-smooth-work\ac\t180b_smooth_s_flow) is not what (e) would lay.**
The chair's dispatch says the reader's findings do not touch those layouts. (e) does.

## The choices as I see them

1. **Code (e) as ruled.** The S's list is refused by name, the test S and the exported "flow" layout move to the room the refusal names, and the layout is
   re-exported beside the old one (both kept, both named). He drives the new one.
2. **Code (e), and let the S keep its marks by making its run-in and ease-out longer in the layout only** (first target and ease-out lengthened, turns
   unmoved). This is the same as 1 with the change named in advance.
3. **Hold (e)**: the straights' re-rounding stays a todo row, and he drives the layouts as exported. The built road there stays inside the marks' range
   (lap 1: run-in built 3.82° off the document, still between 0 and −20).

**My recommendation: 1.** The re-rounding is the adapter's verdict that the asked roll is too fast for a straight, so the honest flowing bank is the one
that says so by name. **What would change my mind:** if he wants to feel the S as laid before anything moves, that is 3 for now and 1 after his drive.

I build a–d now. (e)'s inequality rows share the bounded solve that a–d need, so whichever way this goes, the code is ready to take it.
