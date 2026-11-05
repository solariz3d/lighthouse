# D642 parts 2b and 3: the panel passes the base through to the minimums, and his three cases rendered on B's additive model (pane C)

Seat: pane C (sibling-0845a868). Tier: CHECK IT. t180 worktree `Desktop/worktrees/t180-d642-c3`, branch `d642-c3` off `d642-b 69f6096`.
**Commit `923e0a3`.** Not installed, not pushed; the installed exe untouched.

## Red first

- checked: on `69f6096` → exactly B's eight panel-laid rows **not ok** (`red-69f6096.summary`): `core_changes` L139 R2 ×2, `core-second-change-panel`
  K1 and O5, `core-extra-handles-glitches` G7, G8, G9 and D641 R5.
- checked: on `923e0a3` → those files plus `core-second-bank-panel`: **80 pass, 2 fail** (`green-923e0a3.summary`). The 2 are R2 ×2 (below).
- checked: the touched set (every app and core test naming `core/panel` or `core/handles`, plus `core_additive`, the next-ghost row and
  `ghost-relaid-tail`; 66 files, `touched-set-files.txt`), under the heavy-run lock, BelowNormal, one slot, the tree unchanged from start to end →
  **66 files, 846 pass, 2 fail**, the same 2 (`touched-set-923e0a3.out`).

## The pass-through (B's §3, line by line; where I differ from it, said)

- **`coreshell.js` `secondMinM` and `cornerChangeMinM`:** forward the fourth argument, as B proposed.
- **`panel.js`, one helper `baseOfRamp` for every place the panel asks for a minimum:**
  - `extendOptions`, both branches (B's `:216`, `:222`);
  - the mounted panel's `shellMinM` / `shellCornerMin` / `cornerMin` (`:373`);
  - `secSegs` (`:1229`) and `offersAt` (`:1258`, and the `need` beside it).
  - So the offers, the mark clamps, the hold and the options all agree. A corner's base is the first corner's degrees, and its length is the piece's.
- **Where I differ from B's text, and why** (the core decides):
  - B's text says "and the head is known". The core reads the ramp's start the way `extend.js changeLists` `startV` does: on an EMPTY track the first
    piece starts AT its typed values (`out.first`), so it has no ramp and no base. Otherwise it reads the head's value.
  - A first version of mine read a missing head as 0 everywhere. That made three `core-second-bank-panel` rows (C5, C11, C13), laid on an empty track,
    ask a minimum the core does not, and the core did not refuse where the panel expected (C13: 1 cm past the clamp was laid).
  - The panel now takes the start the core's way (`rampStart`: `first`, else the head, else 0). With that, C5 and C11 pass as they were. My amendments
    to them were reverted.
- **Amended by name (the rule changed), each with a comment:**
  - `core-second-change-panel` L139 O5. It read the old squeeze: +60 at the first mark. Under his ruling the first corner spans the piece. The row now
    compares the snake with the same +60 corner laid alone: equal up to the first mark (300 m), back by its own −60 at the second (600 m), and still
    ending +60 and straight.
  - `core-second-bank-panel` L135 C13's two pure `extendOptions` calls: `empty: true`, as the panel itself sends on the empty track the row is on.

## NOT green, and it is the core: R2 ×2

- **The panel's part is right:** the panel lays his 11-05 piece's bank change at 477.42 m, exactly 750 less the core's own minimum with the base
  (272.6 m), the latest the core allows.
- **The core's minimum is too short there:** at that mark the built road reads **1.174 × the bar**, against the row's 1.05.
- checked: on the core alone, no panel (`r2-core-alone.out`, `scripts/core-alone.js`): from 477.42 (272.6 m) → 1.174; from 450 (300 m) → 1.049;
  320 m and longer → under 1.0.
- So `secondMinM` with the base share is about 30 m short for this case (66.14° then 0, cup 15.5, a −90 corner, 750 m). **That is B's**
  (`src/core/extend.js` `secondMinM` / `BASE_SHARE_MAX`), and it keeps the ramp harness's CONTROL red.

## His three cases on the result (show first; before any install)

All three go through the real panel (`scripts/cases.test.js`): length 1000, turn −90 (a corner), bank 88.45, cup 15.5, width 31, after the placed
1,000 m straight.
- **(1)** alone.
- **(2)** the extra turn 0.
- **(3)** his turntest2 p2: the extra turn +180 from 500, and the extra bank brought back the other way to −88.45. The panel laid it from 500, not held
  short.

| | checked |
|---|---|
| (2) is (1) | `case1-equals-case2.log`: the laid piece byte for byte IDENTICAL, the built path segments IDENTICAL |
| the checker | `checker.log`: red 0, amber 0 in all three (his p2 as saved read red at 1,550–1,960 m) |
| the real mesh | `mesh-checks.log` (the preview's own ghost mesh, cup included, world space): inverted 0, creases 0 in all three; worst neighbour step 0.6° / 0.6° / 1.9° |

**The renders** (`renders/`): the top blue, the underside orange.
- `*-wide.png` and `*-his-angle.png`: the piece from above, and from behind his Free view.
- `*-follow-85.png`: a follow cam rolled with the road at 85% of the piece.
- In (3) the top stays up the whole way: the second half is banked for its own turn, with no inversion.

**The consequences to see** (`renders/bank-along-the-piece.png`):
- The plot: (1) blue, (2) dashed white on top of it, (3) orange; the mark is the yellow dashed line, level the grey line.
- **What the chair asked to show:** in (3) the bank is 44.23° at the mark (500 m) and keeps rising to **47.18° at 550 m** before the extra takes it
  back (`bank-plot.log`). That is "adds on top": the first ramp is still rising under the extra.
- **A second one, not named before:** near the end (3) goes past its own target, to **−90.96° at 950 m**, then back to −88.45° at the end. The first
  ramp is still rising toward +88.45 right to the end, under an extra whose change finished earlier.
  - checked: `cases.json` case 3 `bank`, every 10 m.
  - It is the same model seen from the other end, and both are for his eye.

## Not done

- The R2 minimum (B's).
- E's review.
- The install.

BASE: C:\Users\nname\Downloads\t180-fresh 69f6096
SOURCES: red-69f6096.summary; green-923e0a3.summary; touched-set-923e0a3.out (runtests.js, 66 files); r2-core-alone.out (core-alone.js); case1-equals-case2.log (same12.js); checker.log (checker.js); mesh-checks.log (mesh641.js); bank-plot.log and cases.json (plotbank.js, cases.test.js)
