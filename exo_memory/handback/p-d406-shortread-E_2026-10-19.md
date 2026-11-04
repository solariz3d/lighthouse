# Hand-back, pane E (machine D): D406 short read, §4 only (C's c1ddce4)

Packet: the chair's D406 short read (sent 2026-10-19T07:21:28Z).
- **The object:** `git diff 6e2050d..c1ddce4` (d406-c, 4 files +25 −4), and C's hand-back §8 (`p-d406-negedge-C_2026-10-19.md:122-154`).
- **Read-only.** The probes ran on archived copies in `C:\Users\nname\Downloads\t180-d406rev-e\`: `new/` = 6e2050d, `fix/` = c1ddce4, and `fixmax/` = c1ddce4 with the one-term change below, a scratch copy only.

## 0. Verdict

The fix does what §4 asked, and the `lo < 0` guard is right. But c1ddce4 introduces one regression of its own: the new ceiling ignores the floor.
- A negative side that only carries on (no edge target) while the profile under it rises now gets **refused**. Example: a cup narrowing from 15.5 to 0 under e −45.
- 6e2050d lifted it to the floor and accepted the piece.
- A one-term fix keeps every row green (§3). I'd fix it before landing. It's the librarian's ruling.

## 1. The four checks the chair named

- **Row 5c, red on 6e2050d with my numbers, green on c1ddce4:** checked.
  - c1ddce4's `test/core_edgeneg.test.js` run against 6e2050d's code gives `not ok 7 - row 5c`, "e never above 0: -45.5,-45.5,-21.42519,8.277116,-3.227323,0.670077". These are probe5's numbers.
  - On c1ddce4: `ok 7`, and the file passes 8, fails 0, skips 2.
  - Rows 4 and 5 skip in my archived copies because they read v0.4.7 through `git show`, and an archive has no `.git`. C ran them in the worktree; I take those as reported.
- **The positive rows are unchanged:** checked (`probe6.js`).
  - **+45.5 → 0:** 45.5, 45.5, 21.425, 0, 0, 0 on both trees.
  - **0 → +30:** 0, 0, 15.874, 35.457, 27.872, 30.442 on both trees, equal to 0.4.7's in my review.
  - **A side held 0 → 0 across a turn:** the same controls and the same 1,542-character text on both.
  - **Five positive documents** (10→0, 0→30, 30→5, 5→40, 0→0, at transitions 20, 40 and 60) serialize to the same text on 6e2050d and c1ddce4: 5 of 5.
- **The EDGE_FLOOR comment names −32.74°:** checked, `document.js:47-49`. It says t 300, s 0.5, checked at the rim, named, not checked.
- **KE2-6 is repointed:** checked, `test/core_xsec_mutation.test.js:33`. Its anchor is the new clamp line verbatim (`Math.min(hi(i), …)`), with its CHANGED D406 comment extended. C's harness run reports applied 59 / caught 59 / NOT APPLIED 0 for that file; taken as reported, not re-run.

## 2. The `lo < 0` guard: right

- **What it does:** without it, a side whose asked values are all exactly 0 (`lo = 0`, `top = 0`) would get the ceiling 0 instead of the cap. That's a change to sides never asked below 0, which is what D406 promised not to move.
- **With it,** such a side keeps the cap, as in 0.4.7.
  - checked: the held-0 case and the five positive documents above are byte-identical across the two trees.
  - inferred: with my unguarded line those cases would still come out the same, since a held 0 doesn't ring. The guard makes it true by construction instead of by luck, so I'd keep it.

## 3. The regression: the ceiling ignores the floor

- **The case:** a cup of 15.5 carrying e −45 (total −29.5, inside the floor), then a piece that narrows the cup to 0 (`targets: { c: 0 }`, transition 60 m on 100 m) with **no edge target**, so the edge just carries on. As the cup narrows, the floor for e rises from −45.5 to −30.
- **6e2050d:** the clamp lifts e to the floor as the cup narrows (e −45, −45, −37.75, −30, … against c 15.5, 15.5, 7.75, 0, …). The least total is −30.000, and the piece is accepted.
- **c1ddce4:** `top = −45` (start and target both −45, the target being the carried value), so `hi = −45`, below the rising floor. `Math.min(hi, Math.max(floor, x))` returns `hi`.
  - The piece is refused: "BAD_EDGE: piece 2 (p3): the edge angle e takes the rim to -37.25° at a control point (the profile's 7.75° plus -45°), under the floor of -30°".
  - checked: `probe6.js`, both trees.
- **Whether a carried edge should be lifted to the floor or refused is a design call.** But c1ddce4 changes it as a side effect of §4, not by choice, and C's hand-back doesn't mention it.
- **The one-term fix:** in the guarded branch, never let the ceiling fall below the floor:
  `const hi = (i) => (lo < 0 && top <= 0 ? Math.max(top, floor(i)) : Math.max(0, cap(i)));`
  - checked on `fixmax/` (`probe6b.js`, `p7.sh` through `gate.js`):
    - the rising-floor case is back to 6e2050d's (−45 … −30, least total −30.000), and the five table cases are as c1ddce4;
    - core_edgeneg passes 8, fails 0, skips 2 (row 5c green);
    - core_edgesplit 8/8, core_xsec 21/21, core_cup 55/55, core_piece 41/41.
  - Not run on fixmax: the mutation harnesses. KE2-6's anchor would need the same one-term update.
  - A red-first row for it: the rising-floor case above. It's red on c1ddce4 (refused) and green with the fix (accepted, total ≥ −30 everywhere).

## 4. Out of scope, as the librarian noted

- A side crossing 0 (−20 → +10) rings to +15.457 under the cap, on both trees (checked, `probe6.js`), as positive targets always have.

## 5. The lock

- `p7.sh` (the test files) ran through `gate.js`, with no D404 timing in any slot.
- `probe6.js` and `probe6b.js` (pure profile arithmetic, under a second), and one re-run of core_edgeneg on `fix/` to read its output (a few seconds), ran outside the lock.

NEXT: librarian, rule on §3 (the one-term fix in D406 before landing, or accept the refusal as the behaviour) when this pointer arrives; then B lands D406.
