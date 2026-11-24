# T-180: smooth banked turns, a plan (pane O, 2026-11-24, at his go; nothing is built)

## The ask, in his words
- **02:46**, relayed by the chair: "lets try improve the track builder so it can do those type of smooth banked turns". This is his go on
  the builder change.
- What "those" means is the brief's 2026-11-24 sections (`briefs/t180_banked_s_and_wall_hairpin.md`, lighthouse `ea34736e`). Two quotes:
  - **00:44:** "you see how the first banking starts for the turn, then the second banking connects with the extra turn smoothly and so
    nice".
  - **01:10:** "the scaling for the turn isnt big enough … there are bumps, whereas on [reference track A] the car can smoothly flow without
    ramping".
- The evidence is my two hand-backs: `handback/p-dbl90-O_2026-11-24.md` and `handback/p-dbl90-flow-O_2026-11-24.md` (git-blob fb9a2b81).
- **Tier: PROVE IT.** Each row is written and seen RED before its code. The mutation runs cover every core file touched, and the full suite
  runs once at landing.

## What was measured, and so what this plan is for
- **The cause of the bumps is one property, and it is in the core** (flow hand-back §3).
  - Every bank change the core lays starts and ends at zero roll rate. `src/core/extend.js` says so in three places:
    - `roundedLinear` :55 and `rampShape` :78, "S′ = S″ = 0 at both ends" (:51, :75);
    - the quintic `smoother`, :42;
    - the second bank, "C2 at `from` and ending with slope 0", :15.
  - Following a long, varying roll therefore needs many marks, and every mark is a stop:
    - fitted to the curve, 9 stops;
    - five marks, 1 stop, but 7.7° off the curve;
    - five pieces, a stop at every joint.
- **The turn's size is probably NOT a core limit.** The fitted piece reached 89° over 60 m and 91° over 64 m through today's corners.
  - That took 11 extra turns, which no one types.
  - The earlier builds were small because their numbers put each turn into about 28 m.
  - Part 1 measures this before anything is built for it.
- **The as-built check is not the fix.** Loosening it (the librarian's option A, 01:2x) lets the panel lay the jolting version.
  - If the bank is laid smooth enough that the adapter builds it as laid, the check passes without loosening (Part 3).

## The bars (from the real road, as the flow lap measured it; summary numbers only)
Each bar is measured on the BUILT road (`A.toPath`, step 0.5 m), by the instrument of Part 0, with the same chord for the real road and the
build.

| bar | the real road | the build passes when |
|---|---|---|
| turn A size | 92°; middle 80 % over 60 m; mean radius about 47 m | angle within 3°; middle 80 % over at least 51 m; radius at least 40 m (0.85 × real) |
| turn B size | 91°; 48 m; about 38 m | angle within 3°; at least 41 m; radius at least 32 m |
| roll rate across the S | **0.67 °/m**, the mean over the crossing's steepest 30 m (the chair's figure, from my first table). On the builder's own 20 m chord its peak is 0.85 | 30 m mean at most 0.67 + 0.03; 20 m peak at most 0.89 (0.85 + 5 %); 8 m peak at most 1.08 (the real road's own, an upper bound because of the read's noise) |
| no stops in a roll | none | **zero stops**, as defined in Part 0, inside every run where the bank goes one way |
| the shape | bank gap 3.9° and plan gap 1.7 m reached by the fit (check skipped) | bank within 4° and centre within 5 m of the real road along d 340–712 (the track-equations bar). **Local only** (§ Acceptance) |

**Not a bar, and said:** height. The real road rises about 4 m and falls about 10 m through the S, and every build is level. He has not
asked for it. Laying it is a separate ask.

## The parts, in order

### Part 0: the instrument (test code only)
**Why first.** The builder's checker reads roll over a 20 m chord and passed the fitted piece clean, nine stops and all (flow hand-back §2).
Every later row needs an instrument that sees a stop.

**What.** `test/roll_profile.js`, a helper beside `test/inner_run.js`, with no app code:
- the built bank every 0.5 m;
- its rate over any chord;
- **a stop:** a local minimum of |rate| over a 4 m chord that falls under half the chord-20 rate of the target profile, wherever that
  profile rolls faster than 0.15 °/m. Stops within 6 m count as one. This is `stops2.js` from the flow evidence, made a module.
- **the turn:** heading from 8 m chords on the plan; the turn's middle 80 %; its span; its mean radius (span ÷ angle).

**Tests first** (`test/roll_profile.test.js`). Known answers:
1. A bank linear in s has zero stops, and its rate equals the slope on every chord.
2. Two rounded ramps laid end to end by today's `extend`, the same way: exactly one stop, within 2 m of their joint.
   - This is the bug as a known answer. It must stay red against any instrument that cannot see it.
3. A road laid at a constant turn rate of 1/50 m reads a radius of 50 ± 0.5 m.
4. A 90° `extendCorner` reads 90 ± 0.2°.
5. Empty or short input (a path under one chord long) throws by name. It never returns 0 stops.
6. A held bank, with no roll anywhere, has zero stops and is not counted as one.

### Part 1: measure the turn's size with today's fields (no code)
- **What.** One synthetic S in round numbers, named "the banked S" in the repo:
  - 300 m straight;
  - turn A 90° left;
  - a short straight;
  - turn B 90° right;
  - eased out.
  - The shape comes from the bars above, not from any read. Other authors' tracks and his words stay out of the game's repository.
- **How it is laid:**
  - with today's `extendCorner` and one extra turn;
  - as two corner pieces;
  - with the bank off.
- **What is read:** each turn's angle, span and radius, from Part 0.
- **Pre-registered, before the run:**
  - If both turns reach the size bars with the panel's own fields, **Part 4 is not built.** He is handed the numbers that make it (the
    lengths and marks).
  - If they do not, Part 4 is written from what this measured, and goes back to the chair before any code.
- **My expectation (unmeasured, stated so it can be wrong):** two corner pieces reach it, and one piece with one extra turn does not.
  - The reason is that the extra turn's change starts halfway (`app/core/panel.js` L140 round 2, :1362), which squeezes turn B's span.

### Part 2: the flowing bank (core, `src/core/extend.js`)
**The contract** (so the panel and the core can be worked at once):

    extend(doc, { …, targets: { phi }, transition: { phi }, bankShape: 'flow', through: { phi: [{ at, target }, …] } })

- **The bank PASSES THROUGH each mark.** It does not START a ramp there.
  - The marks are the first target at its transition (or at the piece's end without one), then each `through` mark.
  - Each `at` is in metres from the piece's start, strictly increasing, and at least `KNOT_GAP_M` (5 m) apart.
  - Each target is in radians, absolute.
- **The bank is ONE curve over the piece:**
  - it starts at the previous piece's end value and slope (extend's rule, the header :1-4), with curvature 0 there (`c2Ends`);
  - it passes each target at its mark exactly (to the stored precision);
  - it ends at the last target with slope 0, so the next piece continues as today.
  - Between the marks it carries its rate: no mark is a rest.
- **How (my approach):**
  - the bank's control points on the piece's own knots, plus a knot at each mark where none is within `KNOT_GAP_M`;
  - solved to minimise the roll acceleration ∫ φ″² ds under those equality constraints, as one linear (KKT) solve;
  - the same least-norm algebra `turnby.js` and `close.js` already use (ref 04 §3).
  - A cubic B-spline with simple knots is C2 by construction, so the rate cannot stop at a mark unless the targets ask for it, for example
    at a peak.
  - **What would change my mind:** if row 5 below (no overshoot) fails on the banked S, add a first-derivative term (tension,
    ∫ λφ′² + φ″²) with λ chosen by that row, and say so. Do not reach for a C1 monotone spline: the cross-section channels must be C2
    (`test/core_joint_c2.test.js`).
- **Refusals by name:**
  - `through` with `changes.phi` or `second.phi` in the same call: BAD_TARGET, "a flowing bank's marks and a bank change are one or the
    other".
  - `through` on any channel but `phi`: BAD_TARGET.
  - Marks out of order, under 5 m apart, or outside (0, length]: BAD_SECOND, with the allowed range.
  - A cup with a tube is refused as today.
- **Not in this part:** a joint that carries the rate into the next piece. Every piece still ends at rest. One piece holds the whole S, so
  this costs nothing here. Carrying a rate across a joint changes what every later piece continues, and that is a separate call.

**Tests first** (`test/core_bank_flow.test.js`). Each is seen red on the base before the code:
1. **Passes through:** on the banked S, the bank is within 0.05° of each target at each mark, on the document and on the built road.
2. **No stops** (Part 0's definition) inside every run where the targets go one way. A turn of direction is allowed only at a mark whose
   target is a local peak.
3. **The roll-rate bars** of the table hold on the banked S: 30 m mean, 20 m peak, 8 m peak.
4. **C2 at the joints:**
   - value, rate and roll acceleration continuous at the piece's start;
   - rate 0 and roll acceleration 0 at its end;
   - read as `core_bank_ramp`'s C2 row reads them (the rate shrinks like the square of the distance to the end).
5. **No overshoot:**
   - between two marks whose targets go one way, the bank stays inside their range plus 0.25°;
   - nowhere does it pass the largest |target| by more than 0.5°.
6. **Mirror:** `insert(…, { mirror })` (`src/core/piece.js`) negates every target, and the bank is the exact negative.
7. **Save and open:** `D.serialize` and then `D.parse` gives the same bytes, and the reopened piece lays the same bank.
8. **The refusals above**, each by its code and a word of its message.
9. **The bug's row kept:** the same S laid with today's `changes.phi` (rounded) still shows its stops.
   - That is not a defect this part fixes. It is the proof that the instrument and the new shape differ.
   - It stays green by asserting the stops exist, so a later change to the old shape is seen.

### Part 3: built as laid, and the as-built check unloosened (tests; code only if one fails)
- **Tests first** (in `test/core_bank_flow.test.js`):
  1. `A.bankPlan` builds the banked S as laid: built minus document at most 0.1° along the whole piece.
     - The flow lap found 5.1° of re-rounding on today's opening ramp; that is the row this replaces.
  2. `checkBankAsBuilt` (extend.js :803) passes the flow piece unchanged. Its 0.5° over 250 m is not loosened.
  3. `extendCorner` (turnby.js :165), with the check ON, lays the whole banked S in one piece: two corners and a flowing bank, no refusal.
- **If row 1 fails, the adapter is NOT changed in this lap.** A change to `bankPlan` moves the built bank of saved tracks, and so their
  exports.
  - The finding goes to the chair with the numbers.
  - The fix is then in Part 2's solve (a lower roll acceleration), never in the adapter, unless he says otherwise.

### Part 4: the turn's size, ONLY if Part 1 says the panel's fields cannot make it
- It is specified from Part 1's measurement, with tests first:
  - the size bars on the banked S, laid by the panel's fields;
  - every existing row of `core_turnby`, `core_extra_corner` and their mutation files unchanged.
- The likely place is the extra turn's start share (panel.js :1362). That is the panel's, not the core's, so it is a CHECK-IT change
  unless it reaches `turnby.js`.

### Part 5: the panel (`app/core/panel.js`), so he can lay it by hand
- **A box on the bank field, "flow".** When it is ticked:
  - each extra bank row reads "bank … ° at … m" (passes through), not "then … ° from … m";
  - `extendOptions` (:186) gives `bankShape: 'flow'` and `through.phi`;
  - the ghost shows each mark on the road (the second bank's tick, `secondtick.js`, one per mark).
- **Unticked,** everything is today's, to the byte.
- **Tests first:**
  1. The `extendOptions` mapping: the flow box with three marks gives the contract's call exactly.
  2. **Unticked gives today's call:** sha256 of the serialized document matches, over a matrix of the fields (the `UNMOVED` rows'
     method, `test/core_bank_ramp.test.js` :76-96, extended).
  3. The flow box and its marks survive save, close and reopen (the panel's re-open, `m.second`, :495-509).
  4. Mirror negates the marks.
- The box's look and wording are CHECK IT: seen, not tested.

### Part 6: what this plan says NOT to build
- **Loosening the as-built check** (option A of 01:2x). Part 3 shows it is not needed, and loosened it admits the jolting S.
- **A stop row in the builder's own checker.** It would change what his existing tracks read in the checker: a visible change to saved
  work, and his call.
  - This lap keeps the stop instrument in the tests (Part 0).
  - Whether the checker gets it is put to him with the numbers.
- **Re-laying saved tracks as flow** (a `smoothRamps`-style command). It moves saved tracks. It is only on his explicit word, later.
- **Making flow the default bank.** He drives both first, then says.
- **Height through the S.** It is not in his ask or the bars.
- **A joint that carries the rate** (Part 2, not in this part).

## What must not move in existing tracks, and how it is measured
**The principle.** A saved document stores control points, not the words that laid it, and does not reshape on load
(`src/core/smoothramps.js` header). The adapter (`bankPlan`) is not touched. So nothing existing should move. Each layer below is measured
anyway, before and after, from two worktrees on G: (the base and the branch). Nothing is written in his folder.

1. **His saved tracks.**
   - The set: the 26 core tracks in `%APPDATA%\com.solariz3d.t180-track-builder\tracks\` (`eq-*.t180track`), copied to G:.
   - Reported by index and hash only, never by name.
   - The test fixtures `test/fixtures/F1…F9.core2.json` are added to the set.
   - For each:
     - `D.serialize(D.parse(text))` has the same sha256 on base and branch;
     - the built path (`A.toPath(doc, { step: 0.5 })`: every sample's s, pos, T, L, U and bank, as Float64 bytes) has the same sha256 on
       base and branch.
2. **The export.**
   - For the fixtures and the 26 tracks, the exporter the export tests use writes its files (kn5, the ini files, the AI line) to G:.
   - The sha256 of every file is equal on base and branch.
   - Any difference fails the landing and is reported by file, not explained away.
3. **New pieces laid without flow.** The existing hash rows (`UNMOVED` in `core_bank_ramp`, `GOLD` in `core_bank_swell`, and the sha rows of
   `core_changes`) stay green WITHOUT EDITS. An edit to an expected hash in those files is a red flag for the reviewer, and is allowed only
   with the reason written beside it.
4. **Other callers of `extend`** (Close, Finish, `smoothRamps`, and `extendCorner` without flow):
   - their existing rows pass unedited;
   - plus one new row each: the same document's sha256 on base and branch.

The tool for 1 and 2 is a one-file script in the lap's evidence (not the game's repository, since it reads his tracks). Its output is the
table of indices and "same / differs".

## Landing (PROVE IT)
1. **Mutation runs** over every core file touched, each with a CONTROL, on the `core_turnby_mutation.test.js` model (exact-string
   mutants in a temporary copy; caught means a test failed):
   - a new `test/core_bank_flow_mutation.test.js` over Part 2's code in `extend.js`: the constraint rows, the solve, the knot insertion,
     the refusals and the end conditions;
   - the existing `core_bank_ramp` and `core_ramp_mutation` re-run, since `extend.js` changes;
   - `turnby.js`'s mutation file, only if Part 4 touches it;
   - the panel's mapping mutants, if `extendOptions` changes.
   - Survivors are listed with the reason each is equivalent, or a row is added.
   - The runs go under the heavy-run lock.
2. **The full suite** (`npm test`), once, by the landing pane, at landing.
3. **The unmoved check** above: all same.
4. **Acceptance against the real road, local only.**
   - The banked S re-laid with the flow box, with marks chosen to match the real road's bank, is scored by the flow lap's `fit.js`
     EVAL_DOCS mode against the read on D.
   - Report summary numbers only: the five bars of the table, against the real road.
   - The read and the fitted marks never leave D.

## What he will be handed to drive
1. **The builder** with the flow box, on t180 main when it lands; the T-180 Rebuilder installs it on his next launch.
2. **A short card of numbers:**
   - for the banked S: the lengths, the two corners and the flowing bank's marks;
   - so he can lay it himself from an empty track in the panel and see the ghost's marks.
   - It is the generic S, not the reference track's layout.
3. **One track to drive, two layouts.** The same S laid two ways, exported to AC:
   - "today": the rounded bank with today's marks;
   - "flow": the flowing bank.
   - Back to back in the same car, so the bump is felt, not read.
   - The track file sits on G: until he opens it. Copying it into his tracks folder is his click.
4. **The page:**
   - the bank-and-roll chart of both layouts (builds only, so it can be committed);
   - the overlay against the real road, kept local as before, and putting it on the page is his call;
   - the renders with the builder's mesh, from his screenshot's view.
5. **What he is asked to judge:** "can the car flow without ramping".
   - **The falsifier, registered now:** if he feels a bump in the flow layout where Part 0 reads no stop, the instrument is wrong. That is
     the next lap, before anything else is built on it.
