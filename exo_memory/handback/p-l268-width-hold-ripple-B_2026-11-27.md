# L268, pane B (L): the ripple out of the width hold, and a true CHANGELOG

**Order:** the chair's 12:52:38Z order. Packet `exo_memory/loop/packet_t180_width_hold_ripple_2026-11-27.md` (room 8f154624), read whole. E's read `handback/p-l264-read-E_2026-11-27.md` §2 and §3, read.
**BASE:** `l264-extend-holds-width-b` e112a14 (my own L264 commit). Worktree `<Downloads>\t180-b-l268` on that branch.

## REGISTERED BEFORE ANY FIX (committed before the code changes; its commit time is the registration's)

**The instrument:** `ripple268.js` (in the evidence folder).
- It builds the heads of E's table (§2 (a)) as E built them, with E's own measure (`e264.js` `measure`):
  - the app's brush through `createCoreShell`'s default `brushFn`;
  - Sculpt's grab by `beginFollow`;
  - the number-transition head of drag-ghost row 5;
  - one Extend of 100 m as shown, through the panel's `extendOptions`.
- **Checked:** on e112a14 it gives E's eight swings to the tenth of a millimetre: 3.7, 25.8, 343.5, 560.5, 204.7, 718.3, 446.9 and 311.1 mm (`try.json`; the run is repeated as the "before").

The eight rows:

| row | the head |
|---|---|
| E1 | the brush, +1.37 at end−5, r 20 |
| E2 | the brush, +1.37 at end−10 |
| E3 | the brush, +5 at end−19 |
| E4 | the brush, +5 at end−30, r 40 |
| E5 | grab, w +1.37 at end−5 |
| E6 | grab, w +2 at end−10 |
| E7 | grab, w −2 at end−20, r 30 |
| E8 | a number transition (drag-ghost row 5's head) |

**"The ripple is gone"** (the librarian's bar, made a number). On **every one of the eight rows**, the width is under 1 mm off the head's width from the ramp's end on:
- the last station (every 0.1 m of the 100 m piece) at which |w − head| > 1 mm lies **at or before R**;
- R is the hold's ramp, `startRampM(100)` = 20 m.

**Guards, each of which must also hold** (any one failing means not done):
1. **No kink:** on every row the document's own `jointProblem` is null, and the new piece's first two width control points carry the head's value and slope.
2. The new piece **ends exactly at the head's width, level**, on every row.
3. **The overshoot stays:** on every row the swing has the sign of the head's slope (past the head's width, the way it was heading) and is not zero.
4. **A level head lays e112a14's piece byte for byte** (the unbrushed road). **A typed width** (22 whole piece, 22 early, 20.46) lays e112a14's piece byte for byte.
5. **His roads do not move** (from copies). His saved tracks and undo steps save the same as on e112a14, and one Extend of 100 m at each open head lays e112a14's piece byte for byte. The pieces already laid never move.

**Measured and reported beside the bar, not judged by it:**
- the swing before and after;
- the last distance over 1 mm before and after;
- the largest |w″| (how hard the edge bends) before and after;
- the same eight heads on 10 m and 400 m pieces;
- E's whole sweep;
- a Turn by corner from the steepest head;
- **which bytes of the other channels move, and by how much as a curve:** every other channel sampled every metre, on both trees, compared.

**Stop rule (the order's item 4).** If the bar cannot be met without a kink, or the change moves any of his roads (guard 5), the code stays as e112a14 and only the CHANGELOG is done.

## RESULTS

*(pending: the fix has not been written when this section is committed)*
