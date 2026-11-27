# D678 Track 1, pane B: the width hold must not move the path

- **Order:** the chair's D678 (2026-11-27T16:57:21Z), Track 1 of `exo_memory/loop/packet_t180_width_hold_path_2026-11-27.md` (room 72f9015c).
- **Tier:** PROVE IT.
- **Base:** `C:\Users\nname\Downloads\t180-fresh`, c2591bf900089bbf7af5098b0017e8252b1af80d (`origin/l264-extend-holds-width-b`).
- **My worktree:** `G:\consonance-scratch\b-hold`, branch `l264-extend-holds-width-b`. Scratch is `G:\consonance-scratch\b-hold-work`.
- **The finding:** E's read, `handback/p-d678-ripple-read-E_2026-11-27.md` §5 F4.

## 0. Registration, written before any run (this section is not edited after the first run; corrections go below it)

### The document's quantum

`src/core/document.js:65` at c2591bf (checked: `sed -n 65p`):
`DEC = { m: 4, kh: 9, kv: 9, phi: 9, w: 4, r: 6, h: 4, l: 4, c: 6, e: 6, s: 6, t: 6, er: 6, wd: 4, rad: 9 }`.

Every stored number is rounded to one step of 10^−DEC:

| what | step |
|---|---|
| the turn kh and the climb kv | 1e-9 rad per m |
| the bank phi | 1e-9 rad |
| the width w, the right width wd, the hill h, the swerve l | 1e-4 m |
| the rise r, the cup c, the edges e and er, the edge start s, the tube t | 1e-6 |
| a length or a knot | 1e-4 m |

**What insertion does to that quantum (inferred, from the code; measured below).**
- `insertKnot` (document.js:710) re-rounds the three control points around each new knot to their step. One insertion moves a curve by at most half a step: the basis sums to 1.
- The hold inserts up to three knots into one span: R/4, R/2 and 3R/4 (sub 4; R itself is already a knot on a plain piece). With sub 8 it inserts seven.
- Their supports overlap, so the arithmetic bounds the move at 1.5 steps (3.5 with sub 8), not at one.
- **So the one-step bar in row 1 is not guaranteed; it is measured.** If rounding alone breaks it, I say by how much and stop, as the packet says.

### The direction as I will build it, with one amendment stated before the build

**The direction:** in `extend`, lay every channel on the piece's own knots exactly as from a level head. The width in that lay is e112a14's fitted hold, a placeholder. Then insert the hold's knots by `D.insertKnots` and lay the width alone on them.
- The width is laid as c2591bf lays it: the held pair as `roadPiece` sets it on those knots, the rest by `rampControl`.
- This is the last step before the bank check, so nothing else is laid on the hold's knots.

**Amendment, Turn by.** Turn by, Climb by and the corner list re-solve the turn after `extend` returns. Their solve reads the piece's knots: `symmetricEase` reads the knot averages, and both the least-norm step and the corner list's insertion read the columns. So inserting inside `extend` would still move their turn.
- For them, `extend` lays the piece without the hold (an internal option).
- The solve runs on the level head's knots.
- The hold is inserted after the solve, and after the corner list's knots.

**Sharp needs no amendment (inferred).**
- Its turn is laid inside `extend` (kh's short ramp, `rampControl` on the piece's own knots).
- Its solve reads the curve, not the knots: `turnWeights` integrates kh at the adapter's 2 m stations.

**Finish (prediction: it fails row 1 under this direction).**
- `finishToStart` lays by `extend` and `extendTurnBy`, then `close()` bends its window by a least-norm step over the window's control points.
- The first new piece still carries the hold's knots when `close` runs, so `close`'s step has more columns there than from a level head.
- Moving the hold past `close` would discard `close`'s own width correction on that piece, because `close` joins the width at the seam (close.js:268). **That is not attempted.**
- If Finish fails, the report is "the direction fails row 1 for Finish, by this much". It is not forced.

### Rows

**Row 1, the path.**
- **Heads:** E's five from `chan678.js`: a level head, E1, E4, E6, and a grab of +4 at end−3, r 5.
- **Callers:** the nine that lay a piece: Extend, Turn by 45, Turn by −90 over 200, a corner of 30 with an extra 20 from 50, Sharp −60 R40 ramp 8, Sharp 90 R150 ramp 4, Sharp −60 R40 ramp 1, Jump's take-off, and Level. All go through the shell with the panel's `extendOptions`, as E laid them.
- **For every held head × caller:**
  - (a) The new pieces' count and lengths equal the level head's.
  - (b) Every channel but w, on every new piece, sampled every 0.01 m, is within one step of that channel's DEC of the same caller from the level head on the same tree, and of e112a14 from the same head.
  - (c) The end point is within 1e-4 m of both: the last sample of `toPath` at step 0.25, as `endpos678.js` reads it.
  - (d) The joint is `null`, and the piece ends at the head's width with slope 0.
- **Finish:** the same, on E's six Finish heads on E's lap (`d678.js`: a level head, a brush of +1.37 at end−5 r20, +5 at end−30 r40, a grab of +2 at end−10 r20, +2 at end−0 r10, and −2 at end−2 r5). It is measured first at c2591bf, as the baseline E did not take, then on the repair.

**Red at c2591bf first:** a row in `app/test/core-width-hold.test.js`. After a width brush, Turn by −90 over 200 ends where it ends from a level head, within 1e-4 m, and its turn is within one step. Red at c2591bf (E: 31.7 cm), then green.

**Row 2, the width: c2591bf's to the digit.**
- The bar: the 8 table rows of `ripple268.js` (E1 to E8, Extend as shown over 100 m), committed in `handback/p-l268-width-hold-ripple-B_2026-11-27_evidence/`.
- Each row's w must have the same knots and the same control points as c2591bf's, exactly, and therefore the same printed line (swing, where, over 1 mm until, the end, the joint, the largest |w″|).
- I also count the script's other sections (lengths, sweep, extra). Those counts are information, not the bar.
- **Predicted to hold (inferred):** on a plain piece the hold's last knot is the first even knot, so inserting R/4, R/2 and 3R/4 gives c2591bf's knot vector exactly.
- **Predicted NOT the same:** Sharp's held width, where c2591bf's merged knot list kept different even knots. Not in the bar; it is reported.

**Row 3, bytes.**
- A level head lays the same bytes as at c522ea6, for the nine callers above.
- His saved tracks and undo steps re-save the same on c522ea6, c2591bf and the repair (`bytes.cjs`; copies only, taken 2026-11-27T05:07:04Z, in `G:\consonance-scratch\b-wr-work`).

### What fails the direction

- **Row 1 not met for the F4 callers** (Turn by, the corner list, Sharp), after the amendment above. Rounding alone breaking it counts, by how much.
- **Or row 2 lost in order to meet it.**
- **Then I say which, and stop.** "The direction fails row 1 for Finish" is a predicted result here, and it is reported, not forced.

**The unwelcome outcome, in the words that would make it true:** "Inserting the hold's knots after the turn is laid still moves the end point of Turn by −90 over 200 by more than 1e-4 m." That would mean the path depends on the knot vector through something other than the curve, such as the adapter's stations.

## 1. Results

(written after the runs)
