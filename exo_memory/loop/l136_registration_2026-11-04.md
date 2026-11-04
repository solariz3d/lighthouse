# L136 registration: the built bank arrives on time. Pane E, on L, 2026-11-04, before any code

**What this file is:** the pass bar and degenerating signature for L136. It is registered BEFORE B writes code, against
t180 `0df08db6f8b5162805df599c66151743ee4274f0`. B builds against this file's commit; E scores B's tip against it.
**Plan (master):** `exo_memory/loop/plan_l136_bank_arrives_on_time_2026-11-04.md`. It grows from
`exo_memory/handback/p-l135-E_2026-11-04.md` §"re-check 380d44c", R2.

**Verdict on the plan: AMENDED.** Measured on 0df08db, rule 2 as written cannot make any late row of the settle table
arrive on time without crossing the start joint. Rule 4 keeps joints pinned. And the plan's claim that his sketch's
second ramp "is under the bar" is wrong. Five amendments follow (A–E). The plan's own wording is kept verbatim beside
each one.

## How it was measured

- **Worktree:** `git -C C:\Users\zackn\Downloads\t180-track-builder worktree add --detach <scratch>/l136-E 0df08db`.
  - `find -type l` → 0. Read-only. No build, no push, no AC launch. C's installed builder was not touched.
- **The measure:** `node --max-old-space-size=4096 <scratch>/l136measure.js <scratch>/l136-E 0df08db` → `<scratch>/l136measure-0df08db.json`.
  - It holds the heavy-run lock and runs at BelowNormal priority.
  - checked: `sha256 f9c95e7a855e8172…` for the json, `sha256 7fe6cbe611f8b392…` for the script.
- **The sketch:** `node --max-old-space-size=4096 <scratch>/l136sketch.js <scratch>/l136-E` → `<scratch>/l136sketch.txt` (`sha256 8626d6e3a970f7fd…` for the script).
- **`<scratch>`** is `C:\Users\zackn\AppData\Local\Temp\claude\8e9709f509cfea85\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad`.
  - The scripts are copied beside this file in the commit as `l136_registration_scripts/`, so the scorer re-runs the same code.

**Definitions** (the script's header is the master):

| term | meaning |
|---|---|
| arrive | the document's ramp end: the first s after which the document's bank stays within 0.05° of the piece's end value |
| built | the adapter path's roll at arrive (`A.toPath`, nearest sample) |
| off | \|built − target\| |
| startBuilt | where the built roll first leaves its start bank by more than 0.5°, in metres from the piece's start |
| settle | distance from arrive until the built roll stays within 0.5° of the target |
| peak | the largest 2 m second difference of the built roll over the piece ± 50 m, in °/m² |
| BANK_BAR | 29.4/(10·170²) rad/m² = 0.005829 °/m² |
| floor | 2·√(Δ/BANK_BAR) |

## M1 · The settle table on 0df08db

**Setup:** a 1,000 m flat, then one 1,000 m piece banking Δ over T, then a 200 m straight. The ramp starts AT the
joint, at s = 0 of the piece.

| case | arrive m | built ° | off ° | startBuilt m | settle m | peak °/m² | floor m |
|---|---|---|---|---|---|---|---|
| ease 10° over 60 m | 64.75 | 6.36 | 3.64 **late** | 21.5 | 27 | 0.00453 | 82.8 |
| ease 10° over 120 m | 111 | 9.95 | 0.05 | 23.5 | 0 | 0.00459 | 82.8 |
| ease 10° over 300 m | 275.25 | 9.95 | 0.05 | 57 | 0 | 0.00065 | 82.8 |
| ease 30° over 60 m | 69.5 | 7.48 | 22.52 **late** | 24 | 101.5 | 0.00446 | 143.5 |
| ease 30° over 120 m | 115.75 | 20.42 | 9.58 **late** | 24.5 | 53.5 | 0.00464 | 143.5 |
| ease 30° over 300 m | 283 | 29.95 | 0.05 | 38.5 | 0 | 0.00195 | 143.5 |
| ease 60° over 60 m | 71.5 | 8.45 | 51.55 **late** | 23.5 | 163 | 0.00500 | 202.9 |
| ease 60° over 120 m | 119.75 | 23.23 | 36.77 **late** | 26.5 | 126.5 | 0.00463 | 202.9 |
| ease 60° over 300 m | 286.75 | 59.95 | 0.05 | 30 | 0 | 0.00389 | 202.9 |
| rounded 10° over 60 m | 57 | 5.23 | 4.77 **late** | 20.5 | 34.5 | 0.00440 | 82.8 |
| rounded 10° over 120 m | 116 | 9.79 | 0.21 | 18 | 0 | 0.00523 | 82.8 |
| rounded 10° over 300 m | 294.25 | 9.95 | 0.05 | 20 | 0 | 0.00538 | 82.8 |
| rounded 30° over 60 m | 58.25 | 6.04 | 23.96 **late** | 19 | 110.5 | 0.00434 | 143.5 |
| rounded 30° over 120 m | 117.5 | 23.84 | 6.16 **late** | 20.5 | 37 | 0.00537 | 143.5 |
| rounded 30° over 300 m | 296 | 29.73 | 0.27 | 18 | 0 | 0.00532 | 143.5 |
| rounded 60° over 60 m | 59.25 | 5.93 | 54.07 **late** | 16 | 281 | 0.00391 | 202.9 |
| rounded 60° over 120 m | 118.25 | 25.63 | 34.37 **late** | 20 | 122.5 | 0.00457 | 202.9 |
| rounded 60° over 300 m | 297 | 58.91 | 1.09 **late** | 20 | 8 | 0.00556 | 202.9 |

- **checked** (`l136measure-0df08db.json` `.table`):
  - Every peak is under BANK_BAR.
  - 11 of 18 rows are late (off > 0.5°).
  - **In every late row but one, T < floor.** The exception is rounded 60°/300 m.
- **checked** (`l136sketch.txt`): bankPlan returns a built fn on piece 1 in every late 60/120 m case and none for 10°/120 m.
- **checked:** the built road starts leaning 16–57 m AFTER the joint in every row. It never starts before it.
  - inferred: this is the pinned joint (adapter.js "no window crosses one, so a joint keeps the bank"); not traced line by line.

## M2 · His RIBBON CORKSCREW (`test/core_joint_feel.test.js` HIS), 9 banking pieces

| piece | L m | bank ° | arrive | built | off | settle | peak |
|---|---|---|---|---|---|---|---|
| p1 | 750 | 0 → −28.47 | 211.25 | −28.42 | 0.05 | 0 | 0.00575 |
| p2 | 750 | −28.47 → 12.01 | 215.25 | 11.96 | 0.05 | 0 | 0.00536 |
| p3 | 750 | 12.01 → 55 | 745 | 54.97 | 0.03 | 0 | 0.00536 |
| p6 | 350 | 55 → 0 | 346.5 | 0.01 | 0.01 | 0 | 0.00550 |
| p7 | 750 | 0 → −7 | 194.25 | −6.95 | 0.05 | 0 | 0.00560 |
| p8 | 250 | −7 → −90 | 247.25 | −88.96 | 1.04 | 2 | 0.00560 |
| p9 | 250 | −90 → −180 | 247.5 | −179.1 | 0.9 | 1.5 | 0.00207 |
| p10 | 250 | −180 → −270 | 247.5 | −269.1 | 0.9 | 1.5 | 0.00280 |
| p11 | 250 | −270 → −359.99 | 247.5 | −359.99 | 0 | 0 | 0.00566 |

- p8–p10 are carried joints. The roll keeps going through the joint into the next piece, so "arrive" there is not a
  ramp end.

## M3 · ELYSIUM (`test/fixtures/elysium-2026-10-22.t180track`), 23 banking pieces

- Every piece has off ≤ 0.06°, except three carried joints:
  - p12 (−40 → 0, 150 m): 0.8°
  - p18 (70 → 35.5): 0.77°
  - p25 (−66.3 → −57.2): 0.94°
- **Peaks OVER BANK_BAR today:**

| piece | change | length | peak °/m² |
|---|---|---|---|
| p9 | 0 → −40 | 100 m | 0.02075 |
| p12 | | | 0.00818 |
| p13 | | | 0.00798 |
| p14 | | | 0.00798 |
| p28 | | | 0.00678 |
| p29 | | | 0.00678 |
| p40 | −234 → −180 | 87 m | 0.12901 |

- The full rows are in the json, `.shapes`.

## M4 · The close-banks lap, open (`test/core_close_banks_lap` lap(), corner 3 banked by hand)

| piece | change | arrive | built | off | peak |
|---|---|---|---|---|---|
| p5 | 0 → −20 over 100 m | 92.75 | −19.92 | 0.08 | **0.01149, over** |
| p7 | −20 → 0 over 100 m | 92.75 | −0.08 | 0.08 | **0.01149, over** |

## M5 · His sketch piece

**Built:** `extendOptions({ length 750, turn 270, climb −6, bank −28.47 early, width 30, cup 15 early, turnAs corner,
thenBank 0, bankFrom '' })` → `extendCorner`, after a 1,000 m flat, then a 200 m straight.
- checked: `second = { phi: { from 637.5, target 0 } }`.

**The first ramp arrives on time.** The document reaches −28.47 at 211.25 m; the built road is −28.419 there and
settles at 0 m.

**The second ramp, built against the document (°):**

| s m | 637.5 | 660 | 680 | 700 | 720 | 740 | 750 |
|---|---|---|---|---|---|---|---|
| built | −28.47 | −26.45 | −19.91 | −10.84 | −3.31 | −0.17 | 0.00 |
| document | −28.47 | −27.01 | −20.83 | −11.11 | −3.17 | −0.13 | 0.00 |

- It arrives on time (0.00 at 750). It tracks its document within 0.92°.
- The built road leaves the hold by 0.5° at 650.5 m.
- **Peak roll acceleration: 0.01244 °/m² at 726 m. That is OVER BANK_BAR, 2.1×.**
- The second ramp is 112.5 m for 28.47°. Its floor is 139.8 m, so the DOCUMENT itself is steeper than the bar allows.
  - inferred: the corner at 750 m sits on the piece-end joint, which is pinned, so its window cannot grow to the bar.
- Max |built − document| over the whole piece is 5.091° at 52 m (in the cupped, turning first ramp).

## The amendments, each with its reason

**(A) Rule 2 cannot apply at a ramp that starts at a joint, and every Extend ramp does.**
- Rolling Δ rest to rest under BANK_BAR needs the floor. A window that ENDS at T therefore STARTS at T − floor.
- In every late table row except rounded 60/300, T − floor < 0. That is before the piece's start joint, and rule 4 keeps
  joints pinned.
- **So, as written, rule 3 (fall back, report `late`) fires on 10 of the 11 late rows, and only rounded 60°/300 m can
  improve.**
- **B's planned test "60° over 120 m arrives within 0.5° at 120 m" is impossible** without the window crossing the start
  joint into the hold before it.
- Crossing it moves the previous piece's built bank near its end, and that changes what "a joint keeps the bank" means.
  That is the keeper's design call, not B's and not mine.
- Registered as two branches. **The default is J.**
  - **Bar J (joints stay pinned):**
    - Rule-1-fits means T ≥ floor within the piece.
    - Every late row with T < floor reports `late: m > 0` in its bankPlan entry, and its built road is unchanged from
      0df08db within 0.05° (the centred fallback).
    - rounded 60°/300 m arrives within 0.5°.
    - B's test 1 becomes "60° over 120 m reports `late`, and its road is unchanged".
  - **Bar X (only if the keeper rules that a window may cross a START joint whose previous piece holds the start bank
    for ≥ floor):**
    - Every table row arrives within 0.5° at arrive.
    - The flat before it is moved only inside [joint − floor, joint].
- **The unwelcome outcome under J, said now:** the change visibly fixes almost nothing the keeper drives. 10 of 11 late
  rows only gain a `late` report. If J is what lands, the lap's honest name is "the late bank is now reported", not "the
  bank arrives on time".

**(B) "Every ramp end" excludes carried joints.**
- Ribbon p8, p9, p10 and ELYSIUM p12, p18, p25 roll through the joint at off 0.77–1.04° today.
- Their pass is: off no worse than its 0df08db value + 0.05°.

**(C) "No window exceeds BANK_BAR" is false today on four registered shapes.**
- ELYSIUM p9, p12–14, p28, p29 and p40; the close-banks lap; his sketch. All of these are at pinned joints or short
  pieces.
- Taken literally, it fails B before B writes a line.
- **Amended:** no registered case's peak rises above max(BANK_BAR, its 0df08db peak) + 1e-5 °/m².

**(D) The plan's "his sketch piece builds as before (its 80 m+ second ramp is under the bar)" is wrong by measurement.**
- The second ramp is over the bar (0.01244) and already on time.
- **The rules collide on it.**
  - Rule 2 would start its leaving window about 27 m before `from` (750 − 139.8 = 610.2 m). That moves a built hold
    that was right at `from` (−28.469). This is the signature's "built road off its document in a hold that was right
    before", and it breaks L135's guarantee.
  - Rule 3 firing on it is the signature's own third clause.
- **Amended:** a corner that is already within 0.5° at arrive is left as today, with no new window and no `late`.
- **The sketch's pass:** built roll equal to 0df08db within 0.05° over all of piece 1, and no `late` entry for piece 1.

**(E) "D626 rows" has no anchor in the repo.**
- checked: `grep -r D626` over the t180 worktree → 0 hits.
- Pinned to these files:
  - `test/core_joint_feel.test.js`
  - `test/core_bank_corners.test.js`
  - `test/core_bank_corners_mutation*`
  - `test/core_joint_c2.test.js`
- "Unchanged" means `git diff 0df08db <tip> -- <those files>` is empty and they pass.

## THE PASS BAR (scored on B's tip, by re-running the two scripts unchanged)

**The plan, verbatim:** "after the change, the built bank at every ramp end is within 0.5° of the target wherever rule 1
fits. No window exceeds BANK_BAR. Every D626 row is unchanged. A hold of ≥ 2× the floor is untouched outside its
windows."

**As registered (Bar J unless the keeper rules X), every one must hold:**
1. **The table:**
   - Every row with T ≥ floor has off ≤ 0.5°. That includes rounded 60°/300 m (1.09° today).
   - Every row with T < floor either has off ≤ 0.5° (Bar X only) or carries `late: m > 0` and is unchanged within 0.05°.
   - The 7 on-time rows stay ≤ 0.5°.
2. **Ribbon, ELYSIUM and the lap:** every non-carried row stays off ≤ 0.5°; carried rows per (B).
3. **Peaks:** per (C), on every registered row.
4. **The D626 files:** per (E).
5. **Holds:** for every registered piece with a hold ≥ 2× its floor, the built roll over [hold start + floor, hold end −
   floor] equals 0df08db within 0.05°.
6. **The sketch:** per (D).
7. **B's mutation row** (the window centred again): applied 1 / caught 1.

## THE DEGENERATING SIGNATURE (any one marks the lap as degenerating)

**The plan, verbatim:** "any new joint-bump row failing; any built road off its document in a hold that was right before;
the fallback (3) firing on the keeper's own sketch piece (750 m, −28.47° early, second bank to 0)."

**Added by this measurement:**
- Any registered peak rising above its (C) bound.
- `late` reported on any row that was on time on 0df08db.
- A test renamed or loosened, rather than added, to get to green.

## This registration's own falsifier

- If re-running `l136measure.js` on 0df08db does not reproduce `sha256 f9c95e7a…` for the json, every figure here is
  void and must be re-registered before scoring.
- If B's tip passes this bar and the keeper, driving the registered shapes, still feels the bank arrive late, then the
  bar measured the wrong quantity. inferred candidate: the late start (startBuilt 16–57 m), not the end.

## NOT verified

- **The pinned-joint mechanism behind (A) and (D):** inferred from adapter.js's comment and the startBuilt figures, not
  traced through `bankPlan` line by line.
- **Turn or climb on a table row:** not measured. Only the sketch carries them.
- **The full suite:** not run. This is measurement only, with no tests.
- **ELYSIUM rows p13/p14/p28/p29:** their "change" column is in the json and not repeated here.
- **The arrive figure of 64.75 m on "ease 10° over 60 m"** lies past T. It is the 0.05° criterion on the ease's tail, as
  measured; not investigated further.

## Corrections

- My own working note before the measurement said the sketch's second ramp "leans late". The table in M5 shows the
  built road at or slightly AHEAD of its document through 700 m, and on time at 750 m. Its fault is the peak, not
  lateness.
