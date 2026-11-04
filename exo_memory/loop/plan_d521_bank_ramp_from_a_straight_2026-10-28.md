# D521: the bank's ramp out of a straight. Librarian, 2026-10-28 15:2x

The keeper, 15:18, a screenshot of a 100 m flat straight followed by a banked turn, the inner edge at the joint circled: "when banking a turn from a straight we cant have this big bump the banking with the turn should be more smooth but we need to be careful". 15:20: "this is a different problem, not sculpting; this is straight up when you are placing the pieces from a straight into a banked turn". Build, not Sculpt: Extend's ramp.

## What is on disk (checked at t180 origin/main 9069bd4)

- Extend ramps every channel over the WHOLE piece unless the field's "at start" box is ticked; ticked, the channel reaches its target within AT_START_M = 20 m and holds (`app/core/panel.js:47-50, :85`; `src/core/extend.js:18-19, :50-51` startRampM = the first knot span). The ramp is the Bloss smoothstep (`docs/math/04a_bank_ramp.md` §1).
- Its steepest rate is 1.5·|Δφ|/L per metre (04a §2, DERIVED). Real banked tracks change bank at p50 0.254, p90 0.849, p99 2.205 °/m (04a §3, MEASURED over 16 layouts, n 33,127; `src/doc/vocab.js:124` BANK_RATE = 0.849, the p90; `tools/bankrate.cjs`). So a 30° bank "at start" is 1.5·30/20 = 2.25 °/m: faster than the fastest 1% of real tracks. Unticked on a short piece it can be as bad.
- The old vocabulary builder LENGTHENED a word so its bank never exceeded that rate, L ≥ 1.5·|Δφ|/r (04a §4); today's Extend has no such floor (extend.js:226-238: the ramp is the tick's 20 m or the piece, nothing else).
- The bank and the turn ramp independently (one map entry each). Railway practice ramps the cant with the curvature, same function, same length (04a §1, marked UNVERIFIED there: seen in summaries only).

So the probable cause: a bank reached in 20 m (ticked), or over a short piece, rotates the section at 2 °/m and more; the inner edge drops that fast while the turn is still coming in. "Careful" = existing files must render byte for byte (Extend makes NEW pieces; the renderer and the document are untouched), and a piece too short to bank at a real rate must say so, not silently bank slower than asked.

## Parts, one pane, O (the geometry reader; C holds D520)

Part 1, reproduce and measure (check it, read only, numbers first): a fixture 100 m straight → a turn with bank (his figures are unknown: take 30° and 45°, 200 m, turn as the panel's default), with bank "at start" ticked and unticked, turn ticked and unticked. For each: the steepest roll rate along the piece (°/m, measured as bankrate.cjs does) against 0.849 and 2.205, and the inner edge's height profile over the first 60 m (where the fold is). Say which case shows his fold. Figures in the hand-back.

Part 2, the fix (prove it: core extend.js, core_extend tests + one row per bullet; no whole-harness run unless a shipped file beyond extend.js changes): the smallest change that makes the measured case bank like a real track:
- the bank's ramp has a FLOOR: never shorter than 1.5·|Δφ|/BANK_RATE, within the piece (ticked "at start" means "as fast as real banking goes", not 20 m); the panel's tick title says so;
- when the piece is shorter than that floor, the bank ramps over the whole piece and the strip's cue (and the checker, if a row is cheap) says the bank is faster than real tracks, with the length it would need (04a §2's L);
- if Part 1 shows the fold comes from the bank arriving before the turn, the bank's ramp takes the turn's ramp length when both have targets (the railway rule), and O says so with the figures; otherwise this half is dropped.
- Falsifier: an existing saved track (CRAZY TEST, ELYSIUM) must load and export byte for byte: Extend only. Install `.before-d521`, sha256; the keeper places a straight then a banked turn and looks.

Kept out: the renderer; the document's joint rule (C1 stays); Sculpt (D520 is separate).

surfaced: panel.js:47-50/:85, extend.js:18-19/:50-51/:226-238, docs/math/04a_bank_ramp.md §1-§4, vocab.js:124 BANK_RATE, tools/bankrate.cjs.

## Amendment, 15:25: his exact piece, and the cause is the ramp's SHAPE, not its length

Second screenshot (panel visible): length 100 m, turn +11.70°, bank −54.05°, width 31 m, NO "at start" ticks ("bank to gravity 0.00° → −54.05°"). The red circle is at the joint; his words: "start banking where the red circle is at the start of the next piece vs where it does further down is what i mean" and "it should start banking the piece right from the next start of that new piece".

So Part 1's fixture is this piece, and the first two bullets of Part 2 (the 20 m floor) are NOT his case. The cause is the Bloss smoothstep itself (04a §1): S′(0) = 0, so the first fifth of the piece barely banks and the middle rolls fast:
- at 10 m: S(0.1) = 0.028 → 1.5° of 54.05°; at 20 m: S(0.2) = 0.104 → 5.6°; peak rate 1.5·54.05/100 = 0.81 °/m at 50 m (04a §2).
- What he wants: roll from the first metre. A pure linear ramp (0.54 °/m from s = 0) starts with a slope the straight does not have: the joint is not C1 in phi (document.js:388-405 refuses it), and at 127 m/s that is a roll rate of 69 °/s switched on in one step.
- The shape that gives both: a linear ramp with a SHORT rounding at each end (the rate rises from 0 to its plateau over ℓ metres, holds, falls over ℓ: C1 at both joints). With ℓ = 10 m on his piece the plateau is 54.05/90 = 0.60 °/m, the bank is 3° at 10 m and 9° at 20 m (Bloss: 1.5°, 5.6°), and the PEAK rate is lower than today's 0.81. ℓ is the one figure to settle: shorter starts sooner but changes the roll rate faster (ℓ = 5 m is 40 ms at 127 m/s).

Part 1 becomes: render HIS piece (straight 100 m → 100 m, turn 11.70°, bank −54.05°, width 31 m) three ways: today's Bloss, the rounded-linear at ℓ = 5, 10 and 20 m, and the pure linear for reference; per ramp the bank at 10/20/50 m, the peak roll rate and the peak roll-rate change; the inner edge's first 60 m. Pictures to the keeper as an Artifact with the real renders (the visuals rule), the figures in a table; he picks ℓ or says the shape is still wrong. Part 2 then: the chosen ramp in extend.js for phi (and whether kh and kv take it too: O says, with the same pictures; the width and cup keep Bloss unless he asks), prove it in the small, Extend only, saved files byte for byte.

## Amendment, 15:31: no pick, build it

The keeper, 15:31: "i dont know bro, i just want the banking to be more smooth without that bump for shorter turns without having to make a long curve". The pick was mine to make, not his. Decided: the rounded-linear ramp with ℓ = min(10 m, L/4) at each end (10 m on his piece; a quarter of a short piece so the plateau always exists). Part 1's picture page is dropped; O builds Part 2 straight away: the bank's ramp in extend.js takes the new shape (phi only; kh, kv, w, c, e keep Bloss, so every other channel is byte for byte), prove it in the small (core_extend tests + rows: C1 at both joints, the bank at 10/20/50 m on his piece, the peak rate under 04a's 0.849 for his piece), Extend only, saved files byte for byte, install `.before-d521`, sha256. The hand-back carries the figures and his piece's render before/after; he looks in the app.
