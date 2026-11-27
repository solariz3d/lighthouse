# D678 Track 2, pane E: registration for the delta read c2591bf..1074d5d, written before any run

Order: the chair's D678 Track 2 (2026-11-27T19:11:10Z). Packet: `exo_memory/loop/packet_t180_width_hold_path_2026-11-27.md`,
Track 2 and "Amended 12:4x" ruling 3. Range: `l264-extend-holds-width-b` c2591bf..1074d5d.
- 346e2a0 is B's repair: the hold's knots are laid last.
- 1074d5d is a CHANGELOG sentence only (the Finish try, reverted).

Worktrees, detached, all mine, on G:
- `G:/consonance-scratch/e-d678/wt-tip` = 1074d5d, added for this read.
- `wt-after` = c2591bf.
- `wt-before` = e112a14.

Written after reading the packet, B's hand-back §0 to §3.7, and the diff of the 8 files. Nothing has been run on 1074d5d.

## The bar, as ruling 3 states it, and how I score each part

**R1. The width columns are the same as c2591bf's** for every caller but Sharp R40 ramp 8 and Sharp R150 ramp 4.
- Method: `d678.js` on wt-tip, then a new `delta678.js` joins its rows with my committed `d678_after.json` (c2591bf) by (case, caller).
- "The same" means every one of these is equal (`===`): swing, swingAt, factor, over1mmUntil, over1e9Until, end (v and m), joint, w2B, w2fine, w2fineAt, placedSame, and the refusal text.
- Level-head rows: the piece's bytes are the same.
- For the two Sharps:
  - |Δswing| ≤ 1.1 mm;
  - the end is at the head's width with slope 0;
  - the joint is null;
  - the first piece's length is the level head's length on the tip (B: 40.3629 and 234.3479 m).

**R2. The F4 table reads within one step.**
- Method: my committed `chan678.js` and `endpos678.js`, run with (e112a14, 1074d5d). A new reader, `f4steps678.js`, converts each channel's largest difference into steps of that channel's `D.DEC`, read from the tree.
- The bar:
  - every channel but w is within 1 step of e112a14's from the same head;
  - the first piece's length is the same;
  - the end point is within 1e-4 m;
  - over all 5 heads × 9 callers.
- The same head with its width made level (B's "vsFlat") is reported beside it; it is not the bar.

**R3. The three things B's tier found.**
- **EX12:**
  - its new anchor occurs exactly once in `turnby.js` at 1074d5d (fixed-string count);
  - its mutant, applied by hand on a scratch copy, turns red the rows its pattern names (`row (2|3|11):`, in the harness's own FILES);
  - the unmutated copy is green.
- **D9:**
  - `core-width-hold.test.js`'s corner-list row (extras from 50 and from 10) is green at the tip;
  - with D9's edit applied by hand it is red, on the from-10 case;
  - my own probe gives the size from 10 m (B: 6.73 cm) and from 50 m (B: within a step).
- **drag-ghost row 5:**
  - the file is green at the tip;
  - its new pin 015881f53acdbc5f re-derives from my own hash of the row's documents;
  - B's stated reason holds on my run: the corners' channels but w are e112a14's as curves within a step, each corner's end is within 1e-5 m of e112a14's, and the bytes differ only by the hold's 3 inserted knots per corner.

**R4. Finish as it stands at 1074d5d** (its code is 346e2a0's).
- From my six d678 lap heads:
  - every lap closes;
  - the placed pieces are the same;
  - the first piece's width figures are c2591bf's;
  - the pieces' lengths are the level lap's (942 / 364 / 943).
- I measure the first piece's bank and turn against the level lap's, and against the same head with its width level. B: up to 0.97° of bank, a turn under 2e-7 rad per m, ends within 0.1 mm.
- The CHANGELOG's Finish words at 1074d5d are read against that.

## The one thing I vary that the builder's rows do not: a second field typed with the hold

B's rows type one field at a time (turn, or Sharp's own), so:
- the climb never changes inside a held piece;
- the hold always lays 4 subdivisions (`sub` 4).

1074d5d's CHANGELOG says "the same turn and climb … to within a step". B's §0 bounded the insertion's re-rounding at 1.5 steps with sub 4 and **3.5 with sub 8**, and measured only sub 4 (worst 0.636). A short cross-section ramp typed at the start (a bank at start) makes `sub` 8, so the hold inserts 7 knots into its ramp, not 3.

**Rows,** each through the shell with the panel's `extendOptions`:
- W1: a climb of 4° as a corner (`turnAs: 'corner'`), 100 m.
- W2: a corner of 30 with a climb of 4.
- W3: Extend 100 m with a bank of 8° at start (`atStart.bank`).
- W4: Turn by 45 with a bank of 8° at start.
- W5: Extend 30 m with a bank of 8° at start.
- W6: Sharp −60 R40 ramp 8 with a bank of 8° at start.

**Heads:**
- the level head;
- E1, E4, E6;
- the grab +4 at end−3, r 5;
- each brushed head's width-level twin (its last two w control points set equal).

**Trees:** e112a14, c2591bf, 1074d5d.

**Scored on 1074d5d against e112a14 from the same head:**
- every channel but w within 1 step;
- the same length;
- the end within 1e-4 m;
- the width: joint null, ending at the head's width with slope 0, and over 1 mm off for no more than 20 m (B's bar).

**Reported, not scored:**
- the comparison against the width-level twin;
- the width against c2591bf's.

**Positive control:** the same instrument on c2591bf must show W2's or W4's path moved by more than 1 step from e112a14's. If it reads 0 there, the instrument is blind and the variation proves nothing.

**Predictions:**
- W1 and W2 meet the bar. The climb is solved as the turn is, by the same `extendBy`, then `withHold`.
- Under sub 8 (W3 to W6), the worst re-rounding is above 0.636 steps and under 2. I do not predict which side of 1.
- The width under sub 8 differs from c2591bf's on some rows. Inferred from the code: c2591bf merged the hold's ramp into `rampKnots`, and the shaped bank's knots were filtered against it. The tip inserts the hold after the shaped knots, skipping only knots within 1e-6 m. So a near-coincident knot (closer than 1e-3 m) is possible at the tip and not at c2591bf.

## NOT CLEAN if any one of these holds

1. R1 fails on any row.
2. R2 fails on any head × caller.
3. Any of R3's three does not stand as described above.
4. R4: a lap head that does not close, a placed piece moved, a first piece whose width figures are not c2591bf's, or a CHANGELOG sentence about Finish contradicted inside its scope.
5. The variation, on a caller the ruling names (Turn by, a corner, Sharp): a channel more than 1 step off, or an end more than 1e-4 m off, against e112a14 from the same head. Or, on any caller: a joint problem, the width not ending at the head's level, or over 1 mm past 20 m.
6. A CHANGELOG sentence added in c2591bf..1074d5d contradicted by a run with the app's own tools, inside the scope it states.

On W3 and W5 (Extend), a breach of 1 step that moves no end by more than 1e-4 m is a finding with its size. It is not NOT CLEAN, because the ruling names the path.

## Controls I will run, so that no zero is reported uncalibrated (dossier: p-aura §8)

- **P1:** `delta678.js` on (`d678_before.json`, `d678_after.json`), e112a14 against c2591bf, must report all 540 held rows as differing.
- **P2:** `f4steps678.js` on my committed `chan678.txt` (e112a14 against c2591bf) must read F4's moves (Turn by −90 over 200: about 1.9e5 steps of kh).
- **P3:** the variation's c2591bf control (above).
- **P4:** for R3, each mutant is shown red before its pass counts.
- **P5:** the names key. The scan of my hand-back and evidence reads the names from the key at run time and prints only counts. Its control is the key itself, which must give more than 0.

## Run discipline

- Every measuring run goes through heavy-run at BelowNormal, labelled "(not a timing session)".
- Test files run three at most, under heavy-run.
- No build, no install, no merge, no push of a builder branch. His app is not launched, and no browser is used.
- The scratch copy for mutants is a detached worktree of mine at 1074d5d, restored from git after, with its clean status checked.
