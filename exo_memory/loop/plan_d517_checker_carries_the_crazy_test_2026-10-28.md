# D517: the checker carries what the CRAZY TEST measured. Librarian, 2026-10-28 19:2x

The keeper, 19:15: "YeS" to the lap named at 09:56 (notes 2026-10-18.md, D515 collation): the checker carries D515's rules 1, 2/3 and 5. Source of every number: `exo_memory/handback/p-d515-crazytest-O_2026-10-28.md` §4 (Margins) and §5 (Rules), its evidence `bands.txt`, `peaks.txt`.

## What the checker has today (checked at d522-c b8387c0, `src/validate/`)

- `limits.js` MACH6: suspensionStopG 20 (INFO 'on-the-stops', index.js:374), provenG 90 (AMBER 'load-above-proven', :373), sustainedG 55 over sustainedS 0.5 s (AMBER 'load-sustained', `sustainedLoad` :93-110, D341: ELYSIUM, seven passes held 56-62 g, the eighth at 62 g went through the road 0.4 s after its peak). The load per lateral line is the FULL 3-D curvature of that line (index.js:8-14, f = v²κ⃗/(1 − κ⃗·o) + a_T·T + g·ŷ), so a climb change on a wall is already in κ⃗; what is not modelled is the car leaving the line.
- Every gap and every step over 1 mm is already RED at any load ('gap-in-road', 'downforce-ray-gap', 'joint-step', SRC :114-130). So D515's rule 1 ("above 25 g a step or a gap reaches the chassis") adds no new red: what it adds is the NUMBER and the words.
- Every rule name has a SRC line (index.js:113-138, "a number with no source is a bug", limits.js:1-2); tests per rule under `test/validate_*.test.js`; the mutation harnesses that require src/validate: `test/core_cup_mutation.test.js`, `test/core_jump_mutation.test.js` (checked by grep; E confirms the one that covers index.js's load path).

## The three changes (one lap, pane E, prove it: core maths with thresholds a user cannot see by looking)

1. **Rule 1, the number.** suspensionStopG 20 → 25, source D515 bands.txt: h plateau −19.4 to −20.9 cm from 25 to 50 g, tyre squash flat ~13.5 cm from 10 g; FINDINGS §4's "about 20 g" stays in the comment as the earlier reading. 'on-the-stops' stays INFO; its text says the car has no travel left and that from here a step or a gap reaches the chassis (the reds for those already exist; the info points at them).
2. **Rules 2/3, one new AMBER, 'load-on-the-chassis' (E may rename).** Fires where the predicted load fN_g on the hardest line is at or above **40 g** at the design speed. Why 40: the box reaches the mesh at ~47 g measured (bands), the line-predicted load ran 6.2–9.2 g low at the ten peaks (peaks.txt), 47 − 7 ≈ 40, inside O's 37–40. The text: above here the car rides on its chassis, not its tyres; it has held up to 63 g for 7 s on a continuous soft road with no step and no gap (D515), and 62 g went through the road once (D341); keep the surface continuous here. Not red: the keeper's helix at 63 g was "the most Gs I've ever stably seen". 'load-sustained' at 55 g / 0.5 s stays as it is: D341 and D515 disagree on what 62 g does (through the road in 0.4 s vs 26-28 cm held for 6.25 s; D515 §5 infers the smooth onset is the difference, not shown), and the record keeps both until a lap separates them. As a curvature limit for the strip, if cheap: κn ≤ (40 − cos φ)·g / v² (D515 rule 2's form with 40 in place of 45); at 720 km/h a normal radius of at least 102 m.
3. **Rule 5, one new AMBER, 'wall-swerve' (E may rename).** On bank over 60°, where the in-plane curvature of the line (κg: the climb rate read as a turn, κg ≈ dθ/ds · sin φ, D515 §5) at design speed asks more than **1 g** sideways AND the load into the road on that line is under **1 g**: flag it, "a climb change on a wall is a sideways swerve here and little holds the car on". D515's case: p11, bank 85°, 819 km/h, climb −5.05° → 0° over 100 m, κg −0.7 /km → 3.7 g sideways, the load into the road fell to −1.67 g with the car 8.5 m off the line, and it recovered. The 1 g is O's inferred figure, not a measured failure: AMBER, and the text says so.

## Tests (first, red before green), anchors from D515

- Rule 2 anchor: a banked turn at κn 13.3 /km, bank 85°, 720 km/h (p13's peak) reads ≥ 40 g on the hardest line → amber; the same turn at κn 6 /km → no amber. Boundary at exactly 40.
- Rule 5 anchor: an 85° wall at 819 km/h with the climb going −5.05° → 0° over 100 m → amber; the same wall with the climb held → none; the same climb change on a 30° bank → none (the rule is wall-only).
- Rule 1 anchor: a 23 g line is no longer on the stops; a 26 g line is.
- Mutation: the harness that covers index.js's load path, whole (prove it); E names which and the count. Existing validate_* tests unchanged unless a test pins the old 20 (then it is verifiably wrong and E says so).
- The strip and the validation panel show the new ambers with their text and SRC: E looks once in the real window headless (--mute-audio) or says it did not.

## Parts and tier

- **Part 1 (E, prove it):** the three changes, tests first, limits.js comments with the D515 lines beside each number, SRC lines, CHANGELOG [Unreleased] ("the user", never "keeper"). Branch off land-0429's tip once C has tagged 0.4.29 (so it rides the batch after, not this release). Hand back: red-then-green per anchor, mutants caught, touched test files, no install.
- **Part 2 (E):** install over the 0.4.29 exe on the keeper's machine after my read: builder closed, `.before-d517`, sha256 compare; the keeper opens CRAZY TEST and the helix and sees where the ambers sit. On his yes it rides the next release batch.

Kept out: rule 4 as a rule (loads above 47 g allowed only on the soft block: the block is written on every export already, trackfiles.js:12-29; the gap/step reds already exist); a cup rule and an onset-rate rule (D515 found no data for either); any change to the soft block itself (D525). Falsifier for the lap: if the keeper opens his helix and the new amber covers the whole 56-63 g stretch he drove clean as if it were a fault, the text is wrong, not the number: it must read as a limit known to hold, not a ceiling.

surfaced: limits.js:8-30, index.js:8-14/:93-110/:113-138/:373-374, p-d515 §4 §5, bands.txt, peaks.txt, core_cup_mutation.test.js, core_jump_mutation.test.js.
