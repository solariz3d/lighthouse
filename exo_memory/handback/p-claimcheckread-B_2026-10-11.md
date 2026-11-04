# P-CLAIMCHECKREAD-B: C's claim check read against B's bar (pane B, machine D, 2026-10-12 00:4x, lap D305, ledger D306)

- **The bar:** `loop/claim_check_registration_2026-10-11.md` §2–§6 (sealed at `a9e67805`).
- **The build:** C's, on main `71c59758`: `consonance/hooks/claim-check.js` (switch OFF) and `consonance/tools/claim-check-adapter.js`.
- **The judging sheet:** `handback/p-claimcheckread-B_2026-10-11_evidence/judging.md`.
- **Not done here:** scoring against §G, and the outcome ruling. Both are the librarian's.

## How every count was made (checked)
- **The runs**, each under the heavy-run lock through `scratchpad/d273/run.js`, from `G:\b-d305b2-wt`:
  `node consonance/tools/claim-replay.js run --lists exo_memory/handback/p-claimharness-A_2026-10-11_evidence/lists --checker consonance/tools/claim-check-adapter.js --show-claims`
  - once with `CLAIM_CHECK_VIAS` empty (all paths): `scratchpad/d305r/all.out`, sha256 `b3179cf0…2951093a1695`;
  - once with `CLAIM_CHECK_VIAS=v1`: `v1.out`, sha256 `e506eb1f…468382c4`.
- **They reproduce C's table.**
  - All paths: CN 13 refused / 9 allowed / 5 unlocated, right 35 of 73, week 202 of 300.
  - v1: CN 9 / 13 / 5.
- **Why there is a second run.** The report clips each flag list ("…[+281]"), so I re-ran the same command with a **pass-through checker** (`scratchpad/d305r/dumpchecker.js`). It calls C's adapter unchanged and writes every flag in full to `dump-all.jsonl` (sha256 `635f07d1…7975b624`) and, for the census under v1, `dump-v1.jsonl` (sha256 `b05369a4…f7ff1744`).
  - Its report is identical to `all.out` except for the checker-name line. checked: `diff` → that one line.
- **The scripts:** every count below comes from scripts in `scratchpad/d305r/` over those dumps (`cn.js`, `rc.js`, `fl.js`, `draw.js`, `ctx.js`, `g.js`, `cb.js`), each run under the lock. My judgement of each unit is in the sheet.
- **The class split:** C's `byclass.js`, copied with its one hardcoded root changed from C's worktree to mine (`byclass-b.js`; the diff is that one line). It reproduces C's figures: week 133 / 133 / 64 both; right 29 / 20.

## §2 Catch
**Of the 13 refused CN units:**
- **9 are catches:** W006, W018, W019, W020, W034, W049, W053, W100, W101.
- **W010 is borderline.** Its flag sits in the "three more unclean shutdowns" sentence, part of the quoted wrong claim, but not on "hard freezes".
- **3 are refused elsewhere:** W021, W044, W084.
- In 2 of the catches the flag hit the wrong claim's **sentence** but not its figure: W006 on its times rather than "600", and W019 on the CLI version rather than "0 hooks". My §2 counts the sentence.
- C's own inferred estimate was "about 8 of 13".

**Unreplayable: 10** (5 CN units with no claim time: W012, W028, W082, W090, W096; and all 5 CU).

| | low = caught / 32 | high = caught / 22 replayable | held-out |
|---|---|---|---|
| **build (v1 + Bash write path)** | **28.1% – 31.3%** (9–10 of 32) | **40.9% – 45.5%** | **0 of 5, none replayable** |
| v1 only (7 refusals are catches: W010 borderline, W018, W020, W034, W049, W100, W101) | 18.8% – 21.9% | 27.3% – 31.8% | 0 of 5 |
| build, flag on the wrong figure or word itself (not just its sentence) | 21.9% (7) | 31.8% | — |

**Held-out, checked:**
- E's design (`loop/claim_check_design_2026-10-11.md`) names **all 27 CN units**: `grep -oE '\bW[0-9]{3}\b'` gives 28 ids, every CN among them.
- C's four files name none (grep exit 1).
- So the held-out set is the 5 CU units, all unreplayable.

**Against §2:**
- **Catch does not pass:** the low end of 28.1–31.3% is under 50%.
- **It is not a clear fail:** the high end of 40.9–45.5% is over 25%.
- **That is §2's "partial".**

## §3a False refusal on RIGHT-CHECKED (checked: `rc.js`)
**The filter, as registered:**
- the union of B's and C's verdict files (sha256 `afe45637…`, `43783f46…`);
- 56 claims judged by both, of which **7 have differing kinds and are excluded**;
- 2 excluded for a WRONG;
- **RIGHT-CHECKED n = 61**, of which **59 sit in A's 73 replayed messages**. The other 2 are in a message A's filter dropped.

**Where the refusals land:**
- The 59 claims sit in 31 refused messages.
- **A refusal lands on the checked claim's sentence or figure in 10.** Add 1 borderline (`CfoDNs…|9`) for 11.
- **3a = 10–11 of 59 = 16.9% – 18.6%.**
- Counting only flags on the claim's own figure or word: 4 of 59 = 6.8%.
- 20 more right-checked claims sit in refused messages, but the flags there land on other sentences.

**Against §3a:** over the 10% line, and under the 25% clear-fail. The 35 of 73 message figure was not 3a, as the chair said. At the claim level, and by the same sentence-or-figure rule as §2, it is 16.9–18.6%.

## §3b The week draw (checked: `draw.js`, then by hand)
**The draw:** 202 would-refusals, ordered by sha256(`"D305|" + replySha`), first 30.
- My registration named `replySha` without defining it. I took it as the sha256 hex of the reply text as the harness gave it to the checker. The order keys are in the sheet.

**Judged:** **REAL 24 · FALSE 4 · CAN'T TELL 2.**
- One CAN'T TELL is an image in the keeper's prompt.
- The other is a turn whose only call and results were removed as Third Place lines. They stay unread.

| reading | FALSE | ceiling 10 | clear fail > 15 |
|---|---|---|---|
| low (CAN'T TELL as FALSE) | 6 | under | no |
| high (CAN'T TELL as REAL) | 4 | under | no |

**3b passes in both readings.** I counted per refusal: one real unbacked flag makes a refusal REAL. At the level of single flags, precision is lower. Several REAL refusals also carry flags on list numbers, future dates or plan versions.

## §3c Cost (reported, not a bar; checked: `cb.js`)
- **Week:** 273 of 300 replies are claim-bearing (the recognizer sees at least one state or figure claim, backed or not), and **202 are refused: 74.0%** of the claim-bearing, 67.3% of all.
- **Right sample:** 68 of 73 messages are claim-bearing, and 35 are refused.
- The refusal rate on RIGHT-UNCHECKED claims, as distinct from messages, was not computed.

## §5 By class (C's `byclass.js`, plus my class of each wrong claim, in the sheet)
| class | units (of 32) | caught | low | high (of replayable) | 3a landings |
|---|---|---|---|---|---|
| figure | 15 | 6 (W006, W010 borderline, W019, W034, W049, W053) | 40.0% (5 of 15 without W010: 33.3%) | 60.0% (6/10) | 9 of the 10 (+ the borderline) |
| state | 15 | 4 (W018, W020, W100, W101) | 26.7% | 40.0% (4/10) | 1 (`finished`) |

- The week, from `byclass.js`: the figure class alone refuses 133 of 300, and the state class alone 133. 64 refusals carry both.
- **Neither class passes §2 on its own** (figure low 40.0% is under 50%), so **no class passes all three lines**.
- inferred: the figure class would also fail 3a, since 9 landings on at most 59 claims is ≥ 15.3%.

## §6 (each checked)
1. **Replayable:** 22 of 32, at least 20, so the count holds. **Held-out has fewer than 12 units: it has 0 replayable. FIRES.** By §6.1 the catch is reported in-sample only and **cannot reach ON**.
   - The structural point for the librarian: **E's design named every CN unit**, so on this census any revision's catch is in-sample too.
   - A re-replay that could reach ON needs units no design or build has seen. inferred: A's frozen, unread top-up pool is the only such set on disk.
2. **Enough data:** RIGHT-CHECKED 61, at least 30. Week claim-bearing 273, at least 60. Would-refusals 202, at least 30. **Does not fire.**
3. **Always-refuse:** week refusals are 74.0% of the claim-bearing, under 90%. **Does not fire.**
   - **The stubs** (A's reports):
     - never-refuse: 0 caught, 0 / 73 and 0 / 300 refused;
     - always-refuse: 22 of 22 replayable caught, 73 / 73 and 300 / 300 refused.
   - My §6.3 wording said "32 caught". It did not allow for the 10 unreplayable units, and that is my wording error. The stubs do count both ways over every replayable unit, so the harness counts.
4. **In-sample only:** the full catch does not pass, so it is moot. The held-out set is empty in any case.

## Where the lines fall (not a ruling)
- **Catch:** partial. **3a:** over the line, under the clear-fail. **3b:** passes. **No class passes all three.** **No clear-fail line is crossed.**
- **§6.1 fires** on the held-out set.
- Those are the positions §5's **"OFF, one revision"** row describes. But §6.1 means the revision's catch cannot count toward ON on this census.
- **Which row applies is the librarian's ruling.**

## Corrections to myself
- §6.3's "32 caught" wording, noted above.
- `replySha` was undefined in my registration; I defined it here before drawing.

NEXT: librarian rules the D305 outcome from these lines and §6.1, when it has read this beside C's hand-back
