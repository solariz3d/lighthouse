# D624: two bank bugs on RIBBON CORKSCREW TEST (pane E)

Seat: pane E (machine D), sibling-07b8a48f. Tier: prove it (geometry). Order: `[chair:MAIN]` D624, 2026-11-03T01:08Z.
- Branch `d624-e` off a005e1d, not pushed:
  - **`51f3a82`** (bug 2);
  - **`3e7b7cd`** (bug 1, with the CHANGELOG for both).
- His files were read-only: the safe copies in `G:\Consonance-tools\scratch-lib-ribbon\`, and his live saves of ELYSIUM, CRAZY TEST and TEST 10, copied to my scratch. His save is not committed anywhere. The test lays the ribbon through the panel's own options instead, and its last three pieces' bank channels are his save's to the bit (`_evidence/ribbon-probe-*.txt`).

## 1. Bug 2: a full turn of roll, the line

**`app/core/panel.js:291` `bankTarget`**, through `app/core/handles.js:283` `wrapTurn`.
- The field keeps a typed bank within one turn (the D259 rule), and `-360 % 360` is 0. So after −270°, typing −360 sent **0**, and the piece rolled 270° **back** to upright: the "glitch".
- He typed −359.99 to get round it. That is the −359.99 in his save.
- checked: the core alone, from −270°:
  - given −360, it rolls −270 → −291.56 → −315 → −338.44 → −360;
  - given `wrapTurn(-360)` = 0, it rolls −270 → −205 → −135 → −65 → 0.

So the core was right, and the panel sent the wrong number.

**Fix:** exactly ±360 is sent as typed, a full turn. Past one turn it still wraps (400 → 40, −540 → −180).

**Tests:**
- new row "a spiral of −90° pieces typed on to −360 rolls the last piece on the same way to a full turn, never back";
- the D259 row **AMENDED by name**: 360 is now a full turn of roll, where it read as none. His report reverses that rule at exactly one turn.
- Both were **red on a005e1d** (head 0) and are green now.
- After a full turn the field reads 360 / −360. A full turn is stored as 359.99998° (six places in radians), which the label's one-turn rule keeps.
- Mutant X32 (`core-xsec-mutation`) is caught.

**Open (his call):** a SECOND turn of a spiral still follows the absolute D259 rule. At −360 the field shows 0, and typing −90 means −90, which unrolls 270°. Making later turns continue needs the typed bank read relative to the head's winding. That changes D259's semantics, so I did not do it.

## 2. Bug 1: bumps where banked pieces join

**Cause.** Every bank ramp starts and ends at rest (`src/core/extend.js`: S′ = S″ = 0 at both ends, so that each joint is C2). Where the next piece rolls on the same way, the roll stops at the joint and starts again.

On his ribbon, as built (`_evidence/bankplot.txt`, 2 m segments):

| joint | bank | rate 20 m before | rate at the joint | slowest within 60 m |
|---|---|---|---|---|
| 5300 | −90° | −0.347 | **−0.010** | 0.009 °/m |
| 5550 | −180° | −0.376 | **−0.010** | 0.010 |
| 5800 | −270° | −0.376 | **−0.010** | 0.010 |

**His replay** (`_evidence/bumps-base.txt`, `S/d624/bumps.js`):
- the 3,521 frames are placed on the built path;
- the car's felt acceleration is taken along the road's up U, from the recorded positions;
- the swing within 30 m of each joint, against mid-piece:

| joint | swing at the joint | mid-piece | his speed | his offset from centre |
|---|---|---|---|---|
| 5300 | **40.7** m/s² | 7.7 | 150 m/s | 1.4 m |
| 5550 | **50.4** | 1.1 | 173 m/s | 1.7 m |
| 5800 | **89.4** | 19.6 | 191 m/s | 3.1 m |

A model from the built roll acceleration alone (offset × roll acceleration × v², `_evidence/feel.txt`) gives **31.7, 50.8 and 115.2 m/s²** at his line. That is the same size as measured, so the roll's stop-and-start is the bump (inferred: the model leaves out everything but roll).

**Fix: in the generator, `src/core/adapter.js` (`carryOf`, `carriedPhiOf`).**
- **Where a joint is carried:** two road pieces meet with the roll at rest at the joint, and both roll the same way at their middles (≥ 0.02 °/m). A flight, a tube or the lap's seam is never carried.
- **The roll there:** it passes through the joint at the pieces' joint rate, their bank changes added over their lengths added, with no roll acceleration.
- **The bank at every joint stays the document's.**
- **Each side is a quintic** that keeps the bank, rate and roll acceleration at both its ends, so the built roll is C2 everywhere:
  - a piece carried at both ends is one quintic over its whole length; his equal −90° pieces become exactly constant, 0.360 °/m;
  - a piece carried at one end keeps its other half as built.
- **What it is not:**
  - only the BUILT roll moves; **the document is not rewritten**, so his saved track is carried as it is, with no re-save;
  - a joint where a carried half's rate would turn back is left alone.
- **The cache:** a piece now depends on its neighbours, so the carry's key rides in the per-piece cache's first entry, which keeps the other indices (BY_VALUE 10 and 13) in place.

**After** (`_evidence/bankplot.txt`, `feel.txt`):
- the rate at the joints is **−0.346, −0.360 and −0.360 °/m**, and the slowest within 60 m is 0.320 to 0.360;
- the modelled felt acceleration at his line drops to **0.35, 0.09 and 0.46 m/s²**. At a wheel 10 m out: 228 → 2.5, 306 → 0.6, 372 → 1.5 (inferred: a model, not a drive).

**A's held d605-a redo (`carriedInto`, uncommitted in A's worktree, read only):**
- **It covers this case in kind.** It carries same-direction joints, row 9 of its onset test, and his pieces meet its conditions: a roll ≥ 0.02 °/m, an ease-out under a quarter of the piece, the rate eased by under a quarter.
- **It misses his track as it stands.** It acts only when a new piece is EXTENDED after it lands: it re-lays the last piece in the document, and "saved documents are not touched". His saved ribbon would keep every pause unless he re-laid each piece.
- **The difference is where the carry lives:** this one is in the build, so it applies to every track as it is. The two do not conflict. If A's lands, its documents arrive already carried, and this one finds no rest at those joints and leaves them alone.

## 3. Red first, and the proof

- **`test/core_roll_carry.test.js`** (new, 5 rows): the ribbon laid with his values.
  - On a005e1d, rows **1 and 3 red**: "the roll stops at the joint at s 350: 0.0099 °/m against 0.3750 mid-piece", and "the roll rate jumps 0.1171 °/m between samples".
  - Rows 2, 4 and 5 are guards:
    - the bank at every joint and the run's outer halves are the document's;
    - a roll that turns back, a bank held between rolls, and a roll the other way are built as before;
    - the cache rebuilds the piece before.
  - All 5 green on 3e7b7cd.
- **`test/core_roll_carry_mutation.test.js`** (new): control ok, crash stand-in ok, **applied 7 / caught 7 / NOT APPLIED 0**.
  - I dropped two drafts before the run:
    - a "turn-back" mutant that two other guards made equivalent, replaced by R2 "every road joint carried";
    - a duplicate of R1.
- **The touched files**, every test and app test naming `adapter.js` or `panel.js` plus the six harnesses that cover them and mine: 118 files, under the lock at BelowNormal, hidden.
  - **Run 1:** 1,750 tests, 1,727 pass, **5 fail**:
    - `drag-frame` row 8, the known timing row, red at base too;
    - J25 **NOT APPLIED**: my cache-key edit had changed its anchor line. I restored the line, and the key moved into entry 0;
    - ELYSIUM's AI-line pin (below);
    - two D185 TEST 3 phi-brush rows (below).
  - **Run 2**, after those: **1,750 tests, 1,731 pass, 1 fail** (drag-frame row 8 only), 18 skipped (`_evidence/touched-summary.txt`). The harnesses naming adapter.js (chord, cup, jump, close, core, xsec) are all whole in it.
- **Amended by name, with reasons in the files:**
  - **`test/ailine_vertical.test.js`, the ELYSIUM pin.** The fixture's AI line differs only in camber, normal and side widths, at three stretches: s 2128–2176, 2994–3076 and 3828–3950, its carried joints. Not one of its 4,600 points moves, and the vertical bar still changes nothing. checked: a field-by-field diff of `generateAiLine` base against fix.
  - **`test/core_sculpt.test.js`, D185 TEST 3 (sealed, pane B, 2026-09-28): A CALL FOR THE CHAIR.** The sealed rule is that a brush leaves the built road bit for bit outside its window W⁺. The test's generated track already has carried joints, at s 791 and s 2162. A brush that changes a piece's middle changes that carry, so the built roll moved at s 507 and at s 2190, outside W⁺.
    - **What the amendment keeps:** outside W⁺ the route (pos, T, kvec, grade) and the document's channels stay bit for bit everywhere.
    - **What it allows:** only the roll-made fields (L, U, roll, bankG) may differ, and only inside a carried span the brush changed.
    - **The other way:** keep the seal whole and confine the carry to one knot span of the joint. The roll would then still dip to about half its rate at the joint. By my estimate (inferred, not built) the felt acceleration at a wheel 10 m out would fall from 228 to about 50 m/s², not to 2.5.
    - Which matters more, his ride or the sealed locality, is the chair's ruling. Revert the amendment, or narrow the carry, on the word.
- **Scans** of the a005e1d..3e7b7cd diff: credential prefixes 0 / 0 / 0, terms 0 of 72, the K-word 0, the handle 0. One lap id in a comment was reworded before the commit.

## 4. ELYSIUM, CRAZY TEST and TEST 10

checked: `toSegments` of his current saves (`eq-ELYSIUM NEW`, `eq-CRAZY TEST`, `eq-TEST 10`), base against fix, compared as JSON:
- **CRAZY TEST and TEST 10: identical**, so their physics is byte-equal, built from the same segments.
- **ELYSIUM NEW: changes at three joints, all the bug.** In each, the roll was stopping partway through one continuous roll:

| joint | bank across it | max roll change |
|---|---|---|
| **p13→p14, s ≈ 6453** | −40 → 0 → +40° | 2.98° |
| **p19→p20, s ≈ 9103** | 70 → 35.5 → 0° | 2.62° |
| **p26→p27, s ≈ 11603** | −66.3 → −57.2 → 0° | 3.00° |

- Only the roll fields change there: `roll0` and `roll1` in the segments. The route is unchanged.
- Named in the CHANGELOG.

## 5. Renders and plot (`_evidence/`)

- **`bankplot.svg`:** bank (top) and roll rate (bottom) against distance, s 5000 to 6050, as built. Grey is a005e1d, red is d624-e, and the joints are dashed. The grey rate drops to 0 at every joint; the red runs through. `bankplot.txt` is its table.
- **`base-behind-5300/5550/5800.png` and `fix-…png`:** from 90 m before each joint, 3 m above the road along its up, looking 90 m past it. In the base, the edge's line has a corner on each side of the joint; in the fix it is one curve.
- **`base-side.png` and `fix-side.png`:** the whole ribbon from 700 m to the side.
- **How they were made:** A's d596 software renderer and d605 docmesh, adapted as `S/d624/docmesh624.js`, with its views written to scratch, never beside his save. An open document gets no kn5.

## 6. Corrections and limits

- **My first carry pinned each joint's two piece middles.** The roll still dipped to 0.22 °/m at the joint, because the eases' roll had to be made up between them. I replaced it before any commit with the joint-rate design above.
- **My first rate measure read 0.5 m path samples.** Inside every 2 m segment, `src/geom/path.js` eases the roll, so the samples read 0.225 to 0.495 °/m for a steady 0.360. The tests and plot read segment ends.
  - **That ripple is everywhere, on every track, and was there before this change.** It is not this bug. A possible later item, not touched.
- **His replay has no telemetry tail** (`parseTelemetry` → null), so the felt acceleration is from positions, at 15 ms steps.
- `S` = my scratchpad; `d624/` there holds `ribbon.js`, `bumps.js`, `bankplot.js`, `docmesh624.js`, `render.js` (A's d596, copied), `touched.sh`, and both runs' TAP.

## 7. The ruling (2026-11-03T02:02Z) and its commit

The D185 TEST 3 amendment stands, as written. **t180 `4e6398c`** on d624-e adds one comment line to it recording the ruling, worded for a public file: "Ruled 2026-11-02: the ride through the joint outweighs the sealed locality here; the route and the document stay local as sealed".
- The amendment itself was already committed in `3e7b7cd`.
- checked: the six phi-brush rows of `test/core_sculpt.test.js` pass on `4e6398c`.

d624-e waits for the 0.4.39 landing, and for him to drive it.
