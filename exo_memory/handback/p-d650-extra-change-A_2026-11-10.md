# D650 A: the extra bank held the same way (T-180, after D649)

Seat A, on D (Opus 5.5), 2026-11-10. Tier: PROVE IT.
His words (15:42, verbatim, through the chair): "now the same thing happens when I want to bank the turn that u fixed, it jumps to -5 degrees and then stops"; "its the extra banking btw".
The plan: `exo_memory/librarian/2026-11-10.md`, the 15:43 entry (commit c8651ed2).

## The result, and where it departs from the plan

t180 branch `extra-change-free` at **e5b3cd0**, one commit on 313b95a, in the worktree `G:\consonance-scratch\a-d650-t180`. Not pushed, not installed; P lands it with the full suite and both harnesses.

- checked: `git -C G:\consonance-scratch\a-d650-t180 log -1 --format="%h %s"` → `e5b3cd0 Refuse an extra bank, width, cup or edge change only where the road as built cannot carry it`; `git show --stat e5b3cd0` → 15 files, 421 insertions, 60 deletions.
- checked: his file and the fixture `test/fixtures/extra-bank-short-2026-11-10.t180track` → sha256 2fe8350a8dde3c4d…, both; his file is untouched.
- Scan of the added lines: `D642` occurs only as existing row names, and "his" as the test files already use it. One "pane E" in a comment I wrote was removed before the commit. The commit body carries "Seat A."

**The plan's rule holds; its expected form did not.** The plan expected one measured floor per field "(don't assume the old 15)". For the width, cup and edges that is so. For the bank, the measurement refutes a per-field floor:
- On a straight road's end, the bank's built floor IS the old comfort length.
- On his piece there is none.

So for the bank the rule is read on the road as built of the piece being laid, as described below. Its effect:
- A span the comfort length passes is laid as before, so no change that lays on 313b95a is refused now.
- Under it, the change is refused only where this piece's built bank does not reach and hold.

What would change this: a ruling that the bank's spans the comfort length passes but the built road misses by over 0.5° (they exist, e.g. 78-79 m for −5°) should be refused too. That is stricter than today, so I did not do it.

## 1. The floors, measured on the built road

Instrument: `scratchpad/d650/floor.js` (not committed). It takes a copy of the tree with the minimum switched off, lays a probe track (a 400 m piece bringing the field to its value, the piece holding it with the change over its last L2 m, then a 200 m straight), and reads the built road every 0.25 m:
- HOLD: within the tolerance of the value over the 250 m before the mark;
- REACH: within it at the end;
- CLEAN: never outside the two values by more than it.

The floor is the shortest L2 from which every span up to 60 m longer passes, the old K = 15 measure's rule. Tolerance: 0.5° (bank, cup, edges; the old measure's), 0.05 m (width; my choice). Each case was read on a straight road and on one turning −90°.

The width, cup and edges (the adapter builds these as the document lays them):
- checked: `node floor.js w 1,5,-10,20,-25` → width +1: 1 m (everything passes); +5, −10, +20, −25: **40 m** (at 39 m the fit overshoots by up to 0.2 m), straight and turning alike.
- checked: `node floor.js c 1,5,10,-15,40` and `node floor.js e,er 1,10,-8,40` → **26 m** for 5° and up (20 m for 1°). At 25 m the fit moves the road before the mark by 0.15° a degree of change. Cup, left edge and right edge are identical.
- checked: with the bank read as the document (`DOC_ONLY=1 node floor_doc.js phi …`) → **26 m** for 5° and up (20 m for 1°, 23 m for 2°): the bank's fit floor.
- Neither grows with the change. The old comfort lengths were 148.5 m for a 10 m width change and 137.4 m for a 30° cup change.
- The floors went in as `CHANGE_FLOOR_M = { w: 40, c: 26, e: 26, er: 26 }`, taken as the shorter of each floor and the old comfort length. So a tiny change keeps today's 20 m: a constant 40 m would have refused a 0.1 m width change, comfort length 32 m, that lays today. Also `BANK_FIT_FLOOR_M = 26`.

The bank on the built road (the adapter's `bankPlan` re-rounds a roll faster than its bar):
- checked: `node floor.js phi -1,-2,-10,-45,-90,45`, straight road's end, bank held at 0 before → −1°: 20 m, −2°: 30 m, −10°: 137 m, −45°: 206 m, −90°: 298 m, +45°: 206 m.
- The comfort lengths are 31.5, 44.5, 99.6, 211, 299 m. So there the built floor IS the comfort length, or more at isolated spans.
- checked: the −5° profile (`node profile.js phi -5 0 21 120`) → holds from 58 m, fails again at 78 m and 79 m (hold off by 1.0° and 1.2°), holds from 80 m on. **The comfort length (70.4 m) lays 78 and 79 m today though the built road misses its hold.** That is a finding outside this lap's change; I left it as it lays.
- The reason, inferred from adapter.js: the quintic's roll acceleration reaches BANK_BAR at 31.46·√Δ, which is where `bankPlan` starts re-rounding and spreading the change back over its hold.

His piece:
- checked: `node his.js` (his p1 and his p2's fields with the minimum off) → for an extra bank of −5.49, −6.5, −10, −20, −45 and −90° from 47.5 m: built minus document before the mark is 0.000°, the built bank at the end equals the target, and over the span the built bank stays between the two values. That holds with his piece as the head, and with a straight after it.

What frees his piece, read apart:
- checked: a node run on the fixture (the commands are in `test/core_extra_change.test.js` row 11) →
  - straight 125 m, his first bank +0.13° rounded, extra −20°: **laid**;
  - the same with +20°: **refused**;
  - straight, bank held at 0, extra −20°: **refused**;
  - his turns, bank held at 0, extra −20°: **laid**;
  - his turns, +0.13° then +20°: **laid**.
- So two things free it:
  - the piece turns (`bankPlan` moves a turning road's bank by at most 4°, BANK_TURN_KEEP);
  - his extra bank goes back the other way from his first (`bankPlan` pins a bank's turning point, so the rounding stays after the mark).
- On a straight piece, a change the same way as the bank before it is rounded back.
- **Correction:** I first wrote "where the road turns" as the whole reason, in the code comment, the CHANGELOG and the test header. The EX12 mutant surviving showed it was half of it. All three were corrected before the commit.

## 2. The change (src/core/extend.js, turnby.js; app/core/coreshell.js, panel.js, handles.js unchanged)

`extend.js`:
- **Width, cup, edges:** `secondMinM` and `spanHolds` read `floorOf` (the measured floor, or the old comfort length where that is shorter). Their cube laws are gone from `minLaw`.
- **Bank, under its comfort length (spanHolds false):**
  - under `min(comfort, 26)` it is refused here, by name, as before;
  - otherwise it is deferred, and once the piece is laid `bankAsBuilt` reads that piece's built bank with the piece before it (the adapter's `bankPlan`). It refuses when the built bank leaves the document by over 0.5° from 250 m before the mark to the change's end, or leaves the range there.
- **The refusal's words:** "the built road rounds a shorter one back over the hold; X m holds", X being the length the comfort search finds.
- **Spans not monotone:** a span at or past X that is still refused (a single-span spike) names "the built road rounds a longer one back over the hold; S m still holds", the old branch's words (the L152 lesson). The error carries `channel`, `change`, `needM` and `built`.
- **turnby.js:** it solves the turn after extend lays the bank, so its inner extends pass `bankCheck: false`. Its returns (`extendTurnBy`, `extendClimbBy`, `extendCorner`) check the piece as returned, through the exported `checkBankAsBuilt`.
- **Reading two pieces is enough:** the built bank of the piece is read with the piece before it alone.
  - checked: `test/core_extra_change.test.js` row 9 → equal to the whole track's within 1e-12 rad (4e-13° measured, from how the run's stations are summed).

`coreshell.js`:
- `changeRefusal(opts, ch, k)` lays the candidate and returns change k's refusal, or null. Its answers are kept per document and options, 16 at most.
- `bankFitFloorM()`.

`panel.js`:
- **The drag hold:** a bank segment the comfort length does not pass asks `shell.changeRefusal`.
- **The default marks:** a bank change's default mark is clamped first by the 26 m fit floor. Only when the core refuses that as built does it fall back to today's comfort clamp. His mark stays at 47.5 m; a straight road's default lands where it does today.
- **The held reason:** for a bank change the road as built refused, it reads "held at A°: the road as built rounds B° back over the bank it held in the M m from its mark; X m holds". For width and cup the words are "the road as built overshoots it" and "moves the cup before its mark"; before, all three said "faster than it can be ridden smoothly".

Untouched, as ordered: the quintic shape of a change (`secondShape`, `channelFn`), the first ramp ticked "early" and its roll limit, and the checker.

## 3. "It jumps to −5", and the real-page render

- checked: the panel row "his extra bank 1" on 313b95a's code → `dragged to -20°: the change is -5.87° from 47.5`. His report, reproduced: the drag's FIRST move to −20° landed on the edge at once.
- That is the hold's design. On the first move that does not fit, it searches the furthest value that fits toward the drag and lands there; later moves past it ask nothing (`secondExtra`, D642/G7).
- Is that right with the floor the only edge? Yes, when the edge is real: the value it lands on is the most the road as built carries. On his piece there is now no edge up to −90°, so it doesn't jump.
- checked: the same row with the fix → −20°, −45° and −90° each set at 47.5 m, not held, and laid by the core.
- An unwanted outcome first: with the fix but before the default-mark change, the mark moved to 20 m (the comfort clamp of a default mark). That is what the floor-first clamp above is for.

The render, a real page in headless Chrome (BelowNormal, muted, titled zz-headless-test, 1536x864):
- an empty track, length 300 and bank 30 typed with real keys, the Build view zoomed out with the wheel;
- a real mouse pressed on the extra bank's handle and dragged up its axis;
- the shot taken with the button still down.
- checked: `scratchpad/d650/render.js` →
  - the field went 33.3 … 56.4, 56.48, 56.56, 56.63, 56.7, 56.71 and stayed: held;
  - the box reads "extra bank 99.29°" and, as its second line, "held at 56.71°: the road as built rounds 99.29° back over the bank it held in the 150.0 m from its mark; 262.2 m holds".
- The render: `exo_memory/briefs/t180_extra_bank_held_reason_2026-11-10.png` (sha256 91868228e616e038…).
- Seen in it: the box sits at the stage's bottom edge and the camera bar's "Grid: auto: no grid" label overlaps part of its first line. It is legible, but the box is placed under the bar. Not changed in this lap.

## Tests: red then green

New: `test/core_extra_change.test.js`, 11 rows on his track. Rows 1 to 7 were written before any change:
- checked: rows 1 to 7 on 313b95a (`scratchpad/d650/red_core.txt`) → 7 tests, 2 pass (row 1, the fixture; row 4, a straight road still refused), 5 fail. Rows 2 and 3 failed on "needs at least 143.4 m" and "213.7 m"; rows 5 to 7 on the comfort lengths.
- checked: all 11 on 313b95a's code (`red_final.txt`) → 2 pass, 9 fail.
- After the fix: 11/11.

What the rows check:
- **Rows 2 and 3 (his two cases):** −20° and −45° from 47.5 m are laid, and the built bank reaches the target at the end (within 0.01°). Before the mark, the document's control points and knots are byte for byte his piece's, and so are the built positions and tangents (byte for byte). The built roll is within 1e-6 rad: 5.6e-8 and 1.5e-7 measured, because once the adapter re-rounds a piece it reads that piece's roll through its plan.
- **Rows 8 to 11** were added during the work:
  - 8: the comfort probe still lays what it passed, and spikes are named;
  - 9: two pieces are enough;
  - 10: the bank's fit floor;
  - 11: what frees his piece, read apart.

The panel:
- "his extra bank 1" (`app/test/core-extra-handles.test.js`) was red on 313b95a (−5.87°) and is green after.

checked, the final run of the 15 touched and nearby files under the lock (`scratchpad/d650/final.out.txt`) → tests 311, pass 310, fail 0, skipped 1 (turn_corner row 4, his uncommitted save).

## Amended rows (rule changed; by name, each with a comment; none removed)

`test/core_extend.test.js`:
- L135 6b: names the 26 m fit floor, not 172.5.
- L135 6c: 0.1 m under the comfort length is laid where it holds as built; under the floor it is refused.

`test/core_changes.test.js`:
- L139 5a: width 40 m, cup and edges 26 m, a 0.1 m width change 32 m.
- L139 5b phi: refused under 26 m by name. At 26 m on that straight road's end it is refused by the built road, naming the comfort length; laid at the comfort length.
- L139 7: his sketch, from 637.5, is laid now: it turns 270° and its built bank holds. Before, it was refused needing 168.1 m.
- A helper `builtBankOf` was added.

`test/core_additive.test.js`:
- D642 3d: a metre under the comfort length is laid, holding and reaching as built; at the comfort length the built roll is still under the bar.
- D642 3h: 262 m is laid; the ceiling still builds under the bar.
- D642 3k: 521, a single-span spike of the bar, is laid with the others.
- D642 3l: every from laid holds and reaches as built, where before it built under the bar.
- The same helper was added.

`app/test/core-second-bank-panel.test.js`:
- L135 C13: 1 cm past the clamp is now built, not refused; a from leaving under 26 m is refused, naming it.

`app/test/core-extra-handles.test.js`:
- "his extra turn 2": the reason's words are the built road's.
- It is still held (that piece straightens where the change sits).

`app/test/core-second-change-panel.test.js`:
- `withCore` also stubs out the bank floor while a minimum is stubbed.
- Its rows' premise is "the stubbed minimum is the whole rule"; L139 S3 broke without it.

## Mutation runs

`test/core_ramp_mutation.test.js` is the harness over src/core/extend.js, run whole.
- It now also runs `core_extra_change.test.js` with his fixture.
- 12 new mutants (EX1 to EX12) cover:
  - the floors, and the comfort length's admission;
  - the bank's deferral and fit floor;
  - the built check: skipped, hold unread, tolerance 5°;
  - the non-monotone wording;
  - turnby's outer check, and its inner `bankCheck: false`.
- AD13, AD17 and AD18 had lost their rows to the amendments. They are re-aimed by name at row 8, which is built on a scan (`probescan.js`): with 30° over 300 m back to 0, 237 m (probe peak 0.995) is laid, while 200 m and 256 m are refused by probe and built road both.

First run:
- checked: `mut_ramp.out.txt` → CONTROL green; 2 NOT CAUGHT.
  - EX6 pointed at L135 6b, which is in `core_extend.test.js`, outside the harness's files. Re-aimed at the new row 10.
  - EX12 survived because his −20° is freed by the bank's reversal even on the unsolved straight piece. The new row 11 (+20° the same way on his turning piece) catches it.

Final:
- checked: `mut_ramp2.out.txt` → tests 107, pass 107: CONTROL, the crash stand-in, and **applied 105 / caught 105 / NOT APPLIED 0**.

`test/core_turnby_mutation.test.js`, turnby.js whole (its checked wrappers changed):
- checked: `mut_turnby.out.txt` → tests 23, pass 23: **applied 22 / caught 22 / NOT APPLIED 0**.

## Timing, and one real cost

- checked, the 54 files touching changes, corners and handles, at once under the lock (`corner_files.out.txt`) → 958 tests, 943 pass, 4 fail, all frame-time rows.
- checked, drag-frame and release-frame alone, 313b95a then the fix (`timing_*.out.txt`) → 313b95a 8/9 and 3/4; the fix 9/9 and 4/4.
- **A real cost**, checked on `app/test/core-extra-bank-drag-cost.test.js` alone, twice each (`dragcost_*.txt`):
  - the asserted drag (back toward level) is unchanged: 313b95a 8.6 and 9.1 ms p95 a move, the fix 8.4 and 7.7;
  - the unasserted drag on into the hold went from 6.1 and 9.0 ms to **29.2 and 24.3 ms** p95 a move. It also goes on to −360°, held there by the bank's own clamp, where it used to hold at −142.55°.
- inferred: the cost is the built check. Past the comfort length each move lays the piece and reads `bankPlan` (about 20 ms on his 1,000 m p2); the ghost then reuses that lay through extendCorner's memo.
- Not fixed in this lap. Keeping the built check's answers by a 1° grid of the change, as the probes are, would be the next step. For the chair.

## Corrections

- **Ran a harness without the lock.** I ran `core_ramp_mutation.test.js` once without the lock. A `node -e` meant only to read its mutant list required the file, which runs its tests. It ran about 2 minutes. I had not checked the lock or acs.exe before it, because I did not mean to run anything. It does not take the lock itself (its header asks for it).
- **The reason was half wrong:** "where the road turns" was half the reason (above, item 1).
- **The span-naming wording:** I first wrote "X m always holds". It is not always, since the span is not monotone (256 m refused, 236.6 m holds). It now reads "X m holds", and past such a spike "S m still holds".
- **My own amendment of L139 5b was wrong at first:** it expected 26 m to be laid on that straight road, which the built road refuses. Corrected.
- **Line endings:** my `sed` edits left working copies LF in places. They were normalised to CRLF before the commit; the commit stores LF either way.

## Not done

- No push, no install (P's).
- The drag's cost into the hold (above).
- The comfort length's own misses at 78-79 m for −5° (above).
- The held box's placement under the camera bar.
