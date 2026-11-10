# D649 A: the extra turn held to a few degrees on a short piece (T-180 0.4.40)

Seat A, on D (Opus 5.5), 2026-11-10. Tier: PROVE IT (core geometry).
His words (13:56, verbatim, through the chair): "making a short turn, say a 90 degree, you cannot then add the extra turn to bend it 45 degrees ahead to then make a straight, it doesnt let you go past 2.64ish degrees". His screenshot's name: "...it should be free to continue bending even on a shorter section which it doesnt".
The plan: `exo_memory/librarian/2026-11-10.md`, its third entry (13:57; commit 30dec47f).

## The result

t180 branch `extra-corner-free` at **6493077**, one commit on b977eeb, in the worktree `G:\consonance-scratch\a-d649-t180`. Not pushed, not installed; P lands it after D648.

- checked: `git -C G:\consonance-scratch\a-d649-t180 log -1 --format="%h %s"` → `6493077 Let an extra turn or climb bend as far as the first one on a short piece, say why a held drag stops, and clear a stale preview refusal`
- checked: `git show --stat 6493077` → 13 files, 367 insertions, 49 deletions
- checked: `git diff | grep "^+" | grep -oE "D6[0-9][0-9]\b|seat|keeper|lighthouse|exo_memory|chair|librarian"` → only `D642`, every one an existing row's name (the harness patterns must match them) or the MAP line's existing text. My own "D649" in three row names and three comments was renamed before the commit. The body carries "Seat A."
- For P: both this branch and D648 add to `CHANGELOG.md` [Unreleased] (D648 a Fixed line; here Changed and Fixed), so a merge after D648 may need that section joined by hand.

The fixture is his track, copied, not linked; his file is untouched:
- checked: `sha256sum` → 844d4a60cea8a880… for his `eq-extra turn bug.t180track` and for `test/fixtures/extra-turn-short-2026-11-10.t180track`;
- checked: `git ls-files --eol` → `-text`, so it is committed as raw bytes.

## 1. The core: an extra corner is as free as the first

The cause holds as the librarian read it:
- checked on b977eeb: his p2 is `extendCorner({ length: 125, turnDeg: -90 })` on his p1, byte for byte (channels and knots);
- an extra 1.9° from 62.5 m is laid, while 2.64° is refused needing 72.4 m, 3° needing 77.2 m, and ±45° needing 298.8 m;
- the knot floor is 21 m.

The fix is in `src/core/turnby.js` `cornerChangeMinM`. It now returns the knot floor `cornerMinM`, whatever the degrees and the first corner's. Its signature is unchanged, so the panel's call is too.
- An extra corner (the turn and the climb lists) is refused only below that floor. That is what the same corner laid first over its span would be refused for: having no room to ease in and out.
- The refusal's words now say "(shorter, it has no room to ease in and out)".
- The base's share and the comfort-bar constant are gone from turnby.js.
- Bank, width, cup and edge changes keep their bars: `extend.js` is untouched, and row 8 checks a short bank change is still refused.

What the panel does follows, with no panel change for it: its offers and default marks are read through `shell.cornerChangeMinM`, and so is the drag's hold (`secSegs` `min`).
- checked: the panel row "his extra turn 1" on b977eeb's code → `dragged to 2.64°: the change is [{"from":62.5,"deg":1.96}]`. That is his report, reproduced in the panel: the drag held at 1.96°.
- With the core fix alone it passed.

What his laid pieces read on the built road, against the old comfort bar (inferred as context, not a check):
- checked: a node run of the built heading's second difference over 1 m (core_additive's reader), on his p2 →
  - his −90° alone: 5.5 × the bar;
  - with an extra −45° from 62.5 m: 16.5 ×;
  - with an extra +45°: 15.6 ×.
- So his own first corner was already over the bar with nothing refusing it. The extra is now as much his to judge by driving.

## 2. A held drag says why

- `app/core/panel.js`: `secondExtra` records where the drag is held and what it asked (`d.held`). `heldWhy(kind)` turns that into the reason; it is exported on the panel, and the handles' model reads it as `model.held`.
- The reason names the first stretch that does not hold at the asked amount, its own or the next change's. It says what that stretch needs and has.
- checked (a node run, the panel in a fake DOM: length 300, turn −90, bank 30, extra bank dragged to 35 then 90) → `held at 52.67°: 90° needs 244.0 m from its mark, it has 150.0 m (shorter, it rolls faster than it can be ridden smoothly)`, read in 1 ms.
- `app/core/handles.js`: while a drag is held, the box under the handle gets the host's reason as its second line. A host with none draws as before.
- NOT seen in a real page: the box's second line is checked in `handles.test.js` row 12b with a drawing context that records text, and the panel's reason in "his extra turn 2". The wiring between them (`held: (k) => heldWhy(k)` in the panel's handle model) was not drawn headless.
- For an extra turn or climb a hold now happens only below the knot floor, so in practice the reason is for bank, width and cup.

## 3. "no preview of this piece: BAD_LENGTH … got 0" under a length of 125: reproduced, and fixed (small)

What sets it, checked on b977eeb in the real panel (a node run, his track adopted, `scratchpad/d649/repro_len2.js`):
- Emptying the length field gives `Number('') = 0`, and the ghost's `extendCorner` throws BAD_LENGTH.
- The ghost writes that refusal into the message line (`panel.js` `ghost()`), and nothing took it away when a later ghost was built. Typing 1, 12, 125 left "a 12 m piece is too short…" under 125, and still there after a good ghost.
- inferred: his screen is that, with the length emptied as the last refused step before 125. The exact keys are not known; the mechanism is reproduced.
- Not it: dragging the extra turn on his piece, with the next piece typed or his p2 selected (the same run's first script, `repro_len.js`), gave no BAD_LENGTH; 0 thrown.

Fix: `ghost()` remembers the refusal it wrote (`ghostSaid`). When a later ghost is built and the line still shows that refusal, the line goes back to the shell's own message.
- `plainMessage` is declared later in the file than `ghost()`. The first `draw`, and so the first possible `ghost()`, is at panel.js:1466, after it.
- Row "his extra turn 3" was red on b977eeb (`the 125 m ghost is built: no refusal left in the message line`) and passes now.

## Tests first, red then green

New: `test/core_extra_corner.test.js`, 11 rows on his track. Rows 1 to 8 were written before the fix:
- checked: rows 1 to 8 on b977eeb's turnby.js → tests 8, pass 2, fail 6. Rows 2 to 7 failed, each on the comfort bar's refusal (row 2: `needs at least 298.8 m`; row 4: `72.4 m` at 2.64°). After the fix: 8/8.
- Rows 2 and 3 (his two cases): −90° in 125 m with an extra −45° or +45° from 62.5 m is laid. The built road turns −135° or −45° within 0.01°, the piece ends straight (the last two control points 0, rate 0), and before the mark the turn rate is the −90° corner's own, within 2e-9.
- Row 6: a span 0.5 m under the floor is refused by name, turn and climb (TURN_TOO_SHORT and CLIMB_TOO_SHORT, needM 21, "change 1", "21.0 m"). At the floor it is laid.
- Row 4 was changed by me before the commit. An extra of −90° makes −180° in all, which the heading reader wraps to +180, so it uses −60°. The test was blind at the wrap; the code was not wrong.
- Rows 9 to 11 were added after the first harness run (below). They pass on b977eeb except row 11, which b977eeb refuses for its −80° piece.

In the panel and handles:
- `app/test/core-extra-handles.test.js`: "his extra turn 1" to "3".
- `app/test/handles.test.js`: row 12b; `rig` takes an optional `model` for it.

checked, the final rows against b977eeb's code (copied into a b977eeb worktree, `scratchpad/d649/red_final.txt`) → 82 tests, 71 pass, 11 fail:
- core rows 2 to 7 and 11;
- "his extra turn" 1 to 3;
- handles row 12b.

checked after the fix: `core_extra_corner` 11/11; `core-extra-handles` 26/26 (with core_additive and core_changes, 90/90 after the renaming); `handles` 45/45.

## Amended tests (rule changed, by his ruling; by name, each with a comment)

The comfort bar on extra corners was asserted by 7 existing rows. Each is amended to the new rule rather than removed: refused just under the knot floor by name, laid at it, and exact in all.

`test/core_additive.test.js`:
- "D642 3" × 3: was "laid at max(floor, 31.5·√(deg/(1−share))), the built rate under the bar there".

`test/core_changes.test.js`:
- "L139 12": was "the base's rate is in the minimum".
- "L139 R1" × 3: was "refused 0.2 m under the comfort length, built rate under the bar at it".

`test/core_ramp_mutation.test.js`:
- AD8 anchored on the base-share code that is gone, so it would read NOT APPLIED.
- It now puts the comfort bar back, and the same rows ("D642 3 |L139 12") catch it.

## Mutation runs

The harness over src/core/turnby.js whole is **`test/core_turnby_mutation.test.js`** (new; `test/core_level_mutation.test.js`'s pattern). It runs the six turn and corner files: core_extra_corner, core_turnby, turn_corner, climb_corner, core_changes and core_additive. The CONTROL runs first.

First run, 31 mutants:
- checked: `scratchpad/d649/mut_turnby.out.txt` → CONTROL green; 31 applied, 18 caught, 13 NOT CAUGHT.

What the 13 were:
- **Equivalent (8): S1, S2, S3, S7, S8, SL2, SL3 and B2.** The first seven break only the closing step of the two solves, or the columns it moves. That step never runs.
  - checked: `scratchpad/d649/closing_count.js`, a counted copy over the six files → 137 first checks, 0 over TURN_TOL, the largest residual after the linear solve 1.52e-7 rad against 1e-5.
  - inferred, as the bound: the residual is the stored rounding, at most 0.5e-9 per control point times the weights' sum (the piece's length), so 2.5e-6 rad at 5,000 m.
  - B2 searches the shortest length from one metre on, but the length asked has already failed, and cornerMinM starts at 1 m.
  - These 8 are left out of the run and named in the harness header with the reasons.
- **S4 (a real survivor), "the ease ignores what a head still turning already turns".** The closing step then runs and makes the piece exact again: it ends straight and does not dip, and only its shape between differs. Nothing says what that shape must be from a head still turning (core_turnby row 6 holds it symmetric from a straight head only). It is kept out of the run so the harness stays a gate, and named in its header. Deciding the shape is a ruling, not this lap's.
- **W1 (trapezoid):** re-aimed at "row 2|row 4". Its error telescopes to zero on a corner that starts and ends straight.
- **S9, L2, O3:** real gaps, so new rows 9, 10 and 11 in core_extra_corner.
  - S9: Turn by with a non-finite angle is refused by name.
  - L2: an extra corner from 0 m or from the end is refused by name.
  - O3: the kept answers. My rows ran on a document frozen only at the top, so the memo was never used; row 11 uses one frozen through, as the shell's are.
- **W2, dropped before the run:** `weightsTo` and `dense` in turnby.js are called nowhere, so no mutant on them can change a document. Not removed (out of scope); named in the header.

Final run:
- checked: `scratchpad/d649/mut_turnby2.out.txt` → CONTROL green; **applied 22 / caught 22 / NOT APPLIED 0**.

The other harness that names turnby.js:
- checked: `scratchpad/d649/mut_ramp.out.txt`, `test/core_ramp_mutation.test.js` whole with AD8 amended → tests 95, pass 95. That is the CONTROL (green), its crash stand-in row, and the mutants: **applied 93 / caught 93 / NOT APPLIED 0**. AD8 was caught with 4 of 13 run tests failing.
- I first wrote 94 here, from 95 minus the CONTROL. Counting the mutant rows (`grep -c "^✔ mutant"` → 93) found the stand-in row.

## The wider run, and the timing reds

- checked: 49 test files that touch the turn corners, extra changes or handles, at once under the lock (`scratchpad/d649/corner_files.out.txt`) → tests 912, pass 892, fail 9, skipped 10.
- All 9 failures were frame-time rows, from drag-frame (6), release-frame (2) and core-extra-bank-drag-cost (1).
- checked, the three files alone, one at a time, b977eeb and then the fix (`scratchpad/d649/timing_*.txt`):
  - fix: drag-frame 9/9, release-frame 4/4, drag-cost 3 pass + 1 todo;
  - b977eeb: drag-frame 9/9, release-frame 4/4, drag-cost 2 pass, 1 fail (the D642 ratio, 2.74×) + 1 todo.
- inferred: the 9 were load from running 49 files at once, and b977eeb itself reds the drag-cost ratio sometimes.
- The full suite is the landing pane's.

All runs were under the heavy-run lock, BelowNormal, capped by D's profile (8 of 16, spread), with acs.exe checked absent before each. The first one waited on P's D648 landing lock before it ran.

## Corrections

- My edit scripts and two `sed -i` runs left some working copies LF. With core.autocrlf the commit stores LF either way, and the working copies were put back to CRLF before the commit. A count with Git Bash's grep had said they were CRLF; that count was wrong (grep strips the CR).
- An earlier `sed` edit to a test line put a comment over its `{`; it was fixed before anything was counted.
- The panel row on the extra bank first used his 125 m piece and bank 0. No extra bank is offered there (no room at all, and a bank field with nothing of its own has no extra), so it uses 300 m and bank 30. The test's setup was wrong, not the code.
- The "its mark" index in the reason first read the raw row list. It now reads the live rows the options are built from, so a blank row cannot shift it.

## Not done

- No push, no install (P's).
- No real-page render of the held drag's box (above).
- S4's shape: left open, for a ruling.
- `weightsTo` and `dense`: dead code, left in place.
