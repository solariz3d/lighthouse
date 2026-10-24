# D447: closing a loop banks every curve on it that needs it, not only the road Finish adds

Opened by the librarian, 2026-10-23 12:0x, at the keeper's word (11:59): "closing a loop should bank".
His intent, 09:48 (verbatim): "i wanted you more to simply make that track closed loop banked, but all closed loops after if the turns and curves need to be banked, so its not just fixing the one section of the track itself, it is the closed loop generator gaining the nuance and understanding".
Tier: **prove it** (core geometry, it changes his road). Repo t180. Base: e8e34d0 (local-0.4.16, installed). Runs alongside D446 (raygap.js; no shared file).

## What is there today (checked, t180 at e8e34d0)

- `src/core/finish.js:192-212` (D434): Finish banks only the pieces it adds (the closer's `window`), by BANK_SHARE 0.75 of the balance bank at the design speed, `bankOf = -share*atan(V²κ/G)`.
- `bankPlan` (:219-) pins each piece's first two and last two control points to the laid bank, so every joint keeps the laid bank and a straight between turns gets none. Then it rate-limits (BANK_ROLL × the amber) and limits the roll's acceleration (BANK_ACCEL, D438).
- `uprightSet` (:307): a window piece is banked only when **every** phi point is within ROLL_FREE (5°) of the start's bank. A piece he banked or rolled himself keeps his bank.
- The bank rolls the road about its centre line and does not move it, so the closure is not disturbed (:202).
- A loop whose end already meets its start (the NEAR_M path) adds no window, so today nothing is banked at all.

## The parts, and a pane for each

1. **O builds** (O wrote D434/D438/D440/D443 in finish.js):
   - (a) **Red first**, with no private file: a closed loop of flat (upright) curves of his kind, joined by short straights. After Close/Finish, every curved station with |κh| > 1/600 leans INTO its curve (core_finish_bank's `lean()`), not only the closer's. Today that is red: only the window leans.
   - (b) **A hand-banked piece is never touched**: in the same test, one curve he banked himself (phi off upright by more than ROLL_FREE). Its phi channel comes out byte-equal. Joints into it meet his bank (the pin), as today.
   - (c) **The build:** the bank runs over every upright road piece on the closed lap, not just the window, including the NEAR_M path. Keep: C1 at every joint, the BANK_ROLL rate, BANK_ACCEL, no curved station leaning out more than LEAN_OUT_DEG (D440's refusal still stands), and the share scaled down when the roll passes the amber.
   - (d) **O's call, said in the hand-back:** today's pin (first two and last two points of every piece) gives a short curve little or no bank. Where two banked upright pieces meet, the pin may give way to the rate limit and the joint's slope rule, so a curve split into several pieces banks as one. Joints next to a straight, a hand-banked piece or a roll stay pinned.
   - (e) Pit lanes, jumps, tubes and non-road pieces: as today, not banked.
2. **O measures on copies** (never his files), before and after, through the page's own route:
   - TEST TRACK 10, TEST 10 and ELYSIUM: curved stations leaning out (count), mean lean into the curve, peak side load at the design speed, gap at the seam, export (no red; downforce-ray-gap and the near-touch info included).
   - ELYSIUM's loops and rolls must come out unchanged where he banked them (phi byte-equal on every non-upright piece).
3. **P reviews**: the bound on what is "his own bank", the joint rule of (d), the test (a) against a mutant that banks only the window, and the copies.
4. **A landing pane** batches it with D446 (local-0.4.17 or the next) under the landing plan: full suite, harnesses whole, ELYSIUM export.

Mutation: core-close-mutation, core-mutation and core_finish_bank's own mutants, whole. Own mutants at least: bank only the window (today's behaviour); bank a hand-banked piece; drop the pin next to a straight.

## Owed to the keeper

- The bank size stays 0.75 of the balance bank (his open question 2). D447 widens where the bank goes, not how much.
- Undo (inferred, O checks): Close is one undo step today. The wider bank must come back with that same one undo.
- Told 12:0x: this is the lap, and he can veto it.

NEXT: O build D447 (parts 1–2) from e8e34d0 when the chair relays this; then P review when O rings.

## O's D447 build ruled (librarian, 2026-10-23 15:0x)

Read: `exo_memory/handback/p-d447-O_2026-10-23.md` whole (git-blob e18c5090…). Checked: t180-wt-o18 at 2be3b8e (over f7bff79, 0c73322); nothing modified, only the untracked fixture copies fixtures-d337/ and fixtures-d431/; measure.jsonl has 10 lines.
- **ACCEPTED for review.** `bankLap` on every upright, level road piece of the closed lap, at every Close-press route including the near path. One undo (row 6). His own bank is byte-equal (row 2, and 39/39, 35/35, 14/14 on his copies).
- **The level rule (f7bff79) is accepted.** A loop exit stored at phi 0 but pitched −90° is not upright road; the first build banked it 54°, and O's measure caught it. Row 7 and Q10 guard it.
- **(d), the joint rule, is accepted:** relaxed only between two upright pieces that both curve; pinned beside a straight, an unbanked piece and the seam.
- **Q8 surviving is accepted:** bankPlan's rate already holds the roll to 0.9 of the amber, so the scaling cannot bind. **Q7** is accepted only on P's attempt to reach it, as D440's refusal was reached.
- **Owed from P, a scope question:** the route tools' re-close after a drag and the old one-click `close()` do NOT bank. The keeper's word was "all closed loops after". P lists every user path that ends on a closed lap and says which ones bank. Any path left flat becomes a follow-up lap, not a block on this one.
- **Batch:** local-0.4.17 is already landing with D446 alone (plan_batch_0417). D447 lands as **local-0.4.18** after P's review is ruled.

OUTPUT → NEXT: changed — the batch goes to 0.4.18 rather than O's 0.4.17, and P owes a list of every close path.
NEXT: P review d447-o at 2be3b8e (the plan's part 3, plus the close-path list and an attempt on Q7) when the chair relays this; then the librarian rules it and writes the 0.4.18 landing plan.

## P's D447 review ruled (librarian, 2026-10-23 15:3x)

Read: `exo_memory/handback/p-d447-review-P_2026-10-23.md` whole (git-blob ffea4fe5…). P re-derived every O figure (measure.jsonl, the rows red at e8e34d0 and green at 2be3b8e, the mutants). Verdict: can land, with findings.

- **Finding 1, RULED: all three parts in THIS lap, before 0.4.18.** A Sharp corner after a turn that ends still turning (or a short extend transition) flips the turn faster than the bank can roll. The lap would lean out up to 58°, so the backstop returns the WHOLE lap flat, and the press says nothing. That is the opposite of his word ("all closed loops after if the turns and curves need to be banked"). It is not installed yet, and the fix sits in O's own new code, so it is done now, not as a follow-up. Owed from O on d447-o:
  - (a) a row for the flip: P's Sharp-after-a-turn lap (`probe447c.js`) and the 20 m extend flip (`s5`). Red at 2be3b8e on the outcome below.
  - (c) the outcome, with the design O's call: on those laps **every curve away from the flip is still banked** (each curve's mean ≥ 30° outside 2 × the roll distance of the flip), **no station leans out more than LEAN_OUT_DEG**, and the press proves the lap. Any fallback is per piece, never the whole lap. Suggested: bound each station's planned bank by the sign of its own turn, ease it to 0 approaching a sign change (the backward pass can see the flip coming), and drop only the pieces that still lean out from the set.
  - (b) a word: when any piece's bank is withheld, the press's report names the pieces (or km) and why, in plain words.
  - Q7 is then caught by row (a). Gentle-S laps (P's s1, s2, s4) stay as they are (out 0, every curve banked).
- **Finding 2, a NOTE to the keeper; no change.** The bound on "his own bank" is relative to the start's bank. A lap laid on a constant bank from its first piece gets the share added on top. All three of his copies start at 0, and the start is the bank the lap closes to. P's Pb survives for this reason; accepted.
- **Pa (the seam pin's last two points) surviving is accepted**, by reading and P's `seamturn` probe. A turn through the start line is unbanked at the line itself: as ruled.
- **The close-path list (§3): only the Close press banks.** By his word "all closed loops after", the other user paths become the next lap, **D449** (O, after D447, same files). The paths: a route tool's release on a closed lap, the rate brush's re-close, and a curve re-bent the other way that keeps an old bank and leans out. The old `close()` and the words shell's closeLoop have no UI caller; inferred, D449 confirms. Told to the keeper so he can veto.

OUTPUT → NEXT: changed — D447 goes back to O for (a), (b) and (c) before 0.4.18, and D449 is opened for the other close paths.
NEXT: O build finding 1 (a)(b)(c) on d447-o when the chair relays this; then P re-reads that diff, and the librarian writes the 0.4.18 landing plan when P's re-read is ruled.

## O's finding-1 fix ruled (librarian, 2026-10-23 17:4x)

Read: O's hand-back §7 (git-blob 0846e5d7…). Checked: t180-wt-o18 `git log -3` → 83eaf20, 5c0ad52, 2be3b8e; nothing modified (only the untracked fixture copies).
- **ACCEPTED for P's re-read.** The design: pin the bank to none across a flip (two turning points of opposite sign within 30 m), so the bank rolls down before it and up after it inside the unchanged limits. The fallback is per piece, at most 3 rounds, and the all-or-nothing backstop is gone. The press names the eased pieces.
- Rows 10 and 11 were red at 2be3b8e ("leans in by 0.0°") and pass at 83eaf20. On both flip laps, every curve away from the flip reads 58.9–60.6° and 0 stations lean out. His three copies are identical to 2be3b8e.
- **W1 surviving (no per-piece withhold):** accepted only on P's attempt to reach it. It is now the one guard left against a lean-out. **G1 and Q8 surviving:** accepted (equivalent on every lap; the rate already holds the roll under the amber).
- P re-reads 2be3b8e..83eaf20 only: the flip pins, the 30 m gap, FLIP_ZONE in the rows, the report's words, and an attempt on W1.

OUTPUT → NEXT: unchanged — the fix meets the ruling's outcome; P re-reads, then 0.4.18.
NEXT: P re-read d447-o 2be3b8e..83eaf20 when the chair relays this; then the librarian writes the 0.4.18 landing plan when P rings.

## P's re-read ruled (librarian, 2026-10-23 18:1x)

Read: P's review §6 (git-blob bcd3da84…, 32,317 B). Every O figure was re-derived. Finding: the flip rule measures its 30 m gap between control points 20 m apart. So a flip with one dead-band point between the signs is not seen: transitions of 40, 50, 70, 80 or 100 m, and the panel's default blend over an 80 m piece (e80). Then the per-piece withhold (W1) lands a whole 300 m turn at R 300 flat. Without W1 it leans out up to 28.4°, or does not prove. Nothing is worse than at 2be3b8e, but it misses his word.

- **RULED: widen the flip rule in THIS lap, before 0.4.18 (O).** Outcome, not mechanism:
  - (a) **Rows as a sweep, not points:** transitions of 20, 40, 50, 60, 70, 80 and 100 m, Sharp ramps of 4, 40 and 100 m, and e60/e80 (Extend's default blend), all through the press. On each lap: 0 stations lean out more than 5°; **no piece is withheld**; every curve of his leans in ≥ 30° on average outside FLIP_ZONE; the press proves (t50's finish-route self-intersection is P's rectangle: use a geometry that closes, or say so). s6 and e80 are red at 83eaf20 on the mean bar.
  - (b) **Mechanism, O's call:** P suggests reading the flip as row 10's finder does (the turn rate sampled at 2 m, a sign change with no straight run between), or measuring the gap as the dead-band run between the two turning control points rather than their distance. The rows' finder and the plan's must agree.
  - (c) **W1 caught by a row:** with W1 off, one lap of the sweep that W1 rescues today leans out. If the widened rule leaves W1 unreached on every lap, say so, and it stays a guard, as before.
  - (d) **The two quiet returns (P §6.5, inferred):** when bankLap gives the lap back with no bank anywhere (the amber backstop after a withhold, or the rounds running out), the press says that in plain words. One line, one mutant.
- **My correction:** my "every curve away from the flip 58.9–60.6°" was the four corners only. On s5, p6 reads 38.4° away from the flip (O's own figure). That still meets the 30° bar.
- His three copies must stay identical (no flip on them).

OUTPUT → NEXT: changed — D447 goes back to O a third time for the widened flip rule; 0.4.18 waits.
NEXT: O widen the flip rule with the sweep rows (a)–(d) on d447-o when the chair relays this; then P re-read that diff when O rings.

## P's second re-read ruled (librarian, 2026-10-23 21:3x)

P's §7 of `exo_memory/handback/p-d447-review-P_2026-10-23.md` (git-blob 30b586b1…, 49,774 B) against O's §8 (git-blob 899854cc…, 32,684 B), d447-o 2c13316.

**Accepted from O's §8:** flipsOf on the road, shared by the plan and the rows; the roll-rate scaling (X3 caught); the "no curve banked" words; the 25 km cost fix (O's 22.7 s against the base's 22.2 s; P could not re-derive it because the fixture is private, so it stays O's figure and the landing's full suite re-reads it). P re-derived row 12 red-first (6 laps), the mutants 17/14/0 and 16/15/1, and the five copies identical. O's two row choices (§8.3) are fair, per P §7.4.

**Ruled: O widens it once more, in this build, not after.** The keeper's 09:48 ask is that the closed-loop generator understands banking, so a 300 m corner that lands flat behind a 58 m straight is the same hole with the number moved. P §7.5 measured it through the press: straights of 58 and 60 m, and a 100 m link at R 1200, each withhold p8 flat; with W1 off they lean out by 17° or leave the surface. So W1 is reached and load-bearing.

Owed by O, tier prove it:
1. **The bound comes from the mechanism, not the sample.** FLIP_STRAIGHT_M is computed from the constants: the distance to roll the largest share off at the rate cap, plus the 5° allowance. That is about 66–71 m today (P's table). If the share, the rate or LEAN_OUT_DEG ever moves, the bound moves with them.
2. **"Turning" means "banked".** The finder treats a sample as turning wherever the plan's bank there is above LEAN_OUT_DEG, not wherever |kh| > 1/600. Today that is R under about 14 km. Alternatively O may pin wherever the plan's targets change sign within their swing at the cap. The design is O's; either way the plan and the rows keep the one finder.
3. **Rows, red at 2c13316 on "no bank on":**
   - (i) a straight between opposite R 300 corners, swept from 40 to 120 m in 2 m steps, so the window is caught by the row and not by the next read;
   - (ii) links at R 1200, R 3000 and R 10 km, 100 m long, laid wide enough that the press proves the lap at e8e34d0. A lap that cannot prove at e8e34d0 is dropped and named.
   - Each must catch W1 with W1 removed, or be stated unreached, as for (c).
4. **P's caveat on the mean bar (§7.4):** the bar applies to the curved run (consecutive turning pieces of one sign), not to each piece's length. Add a row of a long curve laid as pieces shorter than FLIP_ZONE.
5. The five copies stay identical, the mutants are re-run whole, and the 25 km CPU row is re-read.

**The stopping condition, stated now:** after this round, a further finding of the same kind (a corner withheld flat between two banked corners) must be one that rows (i) and (ii) cannot reach by construction. A finding that is only a new point on a swept axis is a row failure, and gets fixed by O without another re-read lap.

NEXT: O widen the flip rule per items 1–5 when the chair routes this; then P re-reads the diff from 2c13316; then the librarian writes plan_batch_0418_landing.

## P's third re-read ruled (librarian, 2026-10-24 05:1x)

P §8 of `exo_memory/handback/p-d447-review-P_2026-10-23.md` (git-blob fa95a4ed…, 75,366 B) against O §9 (git-blob ed31d3f2…), d447-o 05cdb9d.

**The fault is in my ruling, not in O's build.** Item 2 of "P's second re-read ruled" said "turning means banked above LEAN_OUT_DEG". That threshold is R 14.2 km, and the builder's own Bloss fit rings past its target at R 2–14 km after every short transition (extend.js :22). So at 05cdb9d the finder reads that ringing as 2–8 m flips, and pins the end of every corner to none. P measured this on the press's own lap:
- the second corner's exit goes from 53.3° to −0.4° on row 12's flip laps;
- a plain 140 m R 300 curve with no opposite corner goes from 29.0° to 8.4° mean, and its exit to −0.4°.
No row saw it: the mean bar skips FLIP_ZONE round every flip, and a bank eased to none leans 0°, never out. His five copies don't ring in that band, so they stay byte-identical. **The stop rule does not cover this.** It is a new kind of finding (a bank that is missing, not wrong-way, and no bar reads it), not a new point on a swept axis.

**Accepted from O §9:** the bound computed from `held`, the rate and the allowance (P: 67.3 m by hand); rows 13–16; the mean bar on curved runs; row 16 and the byte compare that caught the 23° on his TEST 10; the press's eased-naming fix.

**Ruled, owed by O, tier prove it:**
1. **Turning keeps item 2's intent and loses the ringing.** A run of same-sign samples counts as a turn only if it holds a sample the guard reads as curved (|kh| > CURVED_KH), and the gap is measured to the far run's first curved sample. That is P's variant 2 (§8.7), measured as closing both the 05cdb9d regression and the three laps of the last ruling. Take it, or something better that the rows below prove.
2. **The bound's edge.** On close()'s lap, P measured the x80 straight and the R 10 km link leaning out by 5.1° and 6.1° with W1 off. Close it one of two ways: either the bound reads the plan's own descent, or the targets at control points that are not curved and not in a curved run are none. Either is O's call. W1 stays behind it as the backstop.
3. **Rows that read a missing bank, red at 05cdb9d, green at 2c13316 and after the fix:**
   - short140 on the press's lap: mean ≥ 25° over the curved stations, last curved station ≥ 45°;
   - s5's second corner's exit piece ≥ 45°;
   - and, so the next missing bank is caught by a row and not by a read: on every lap of rows 10–14, every curved run's last curved station on the press's lap is no lower than 2c13316's by more than 5°, read from a fixed table in the test.
4. **X3 is reached** (P §8.5; O's §9.3 "not taken" is corrected). Either add a row that tells the scaled lap from the unscaled one, or state that it is equivalent on the rows, with the figure.
5. As before: the five copies byte-identical, the mutants whole, the CPU row re-read.

**Stop rule, restated:** after this round, a missing or wrong-way bank on any lap of rows 10–14 and on the new rows is a row failure that O fixes. P's next read is the landing review, not another re-read lap.

NEXT: O build items 1–5 from 05cdb9d when the chair routes this; then P reads that diff as the pre-landing review; then the librarian writes plan_batch_0418_landing.

## O's §10 ruled, including the one-sided table (librarian, 2026-10-24 08:1x)

O §10 (git-blob 20430028…, 47,616 B), d447-o 28eb328 on 05cdb9d. checked: 1 commit, 3 files, +141 −20; the tree holds only the untracked fixtures.

**Accepted:**
- items 1, 2, 4 and 5 as O states them;
- P's variant 2, reproduced to the decimal against P §8.7;
- the descent pins, with row 18; "no targets outside curved runs" was refused because it would flatten his TEST 10's p22 (5.7°);
- X3 now caught;
- copies identical; 264/264; mutants 23/19/0; CPU 22.8 s.

**§10.3, the one-sided exit table: accepted, as a reading of my ruling and not a departure from it.** Item 3 was written to catch a missing bank. Where the bank is higher than at 2c13316 (the links' first corners, 49–50° against 39–41°), it is the lean-out and amber bars that judge it, and they hold. The 8 'eased' first-corner exits on x58–x72 are a corner rolling to none at a flip the ruled bound now pins, and the run's mean bar still holds them. The 4 nulls are held to ≥ 45°.

**Correction to O's NEXT:** 0.4.18 is now D402 alone (plan_batch_0418_landing_2026-10-24.md, the keeper's 07:50). D447 lands as **0.4.19**.

NEXT: P's pre-landing review of d447-o 2c13316..28eb328 when the chair routes it; then the librarian writes plan_batch_0419_landing.
