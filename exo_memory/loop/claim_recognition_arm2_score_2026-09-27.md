# Claim recognition, ARM 2 (the stricter ask) — SCORE beside arm 1. Librarian, the non-author scorer, on L, 2026-09-27 01:5x.

**Inputs:**
- the registration `loop/claim_recognition_arm2_registration_2026-09-27.md` (sealed at `110a278`);
- the ask file `C:\Consonance\retrieval\l118\ask.txt`, sha256 `2a081b66…`, which matches the seal (A §1);
- the run `handback/p-l118-run-A_2026-09-27.md` (git-blob `b77313c9…`): 22 readers and 22 coders, 44 of 44 clean;
- A's watchers had end conditions, and a process search after the run returned 0 (A §5);
- the key is unchanged (`de64024e…`).

**Two scorers agree:** B's harness and `loop/claimrec/score_librarian.js`.

| | arm 1 (plain ask) | **arm 2 (stricter ask)** |
|---|---|---|
| HIT | 16 / 17 = 0.941 | **13 / 17 = 0.765** (CP95 0.501–0.932) |
| median COST (scored items) | 0.662 | **0.500**. Over all 22 items it is 0.511; pooled, 0.348 |
| chance hit rate | 0.666 | 0.488 |
| LIFT | 0.275 | **0.277** |
| DG1–DG4 | none | none (0 of 424 statements unmapped; 0 keys over a third of their item) |

## THE OUTCOME: TRADES RECALL FOR COST — BORDERLINE

The registration's §2 table, read in order:
- **SEPARATES:** no. HIT 13 is below 14, and COST 0.50 is above 0.40.
- **FALLS, NOT ENOUGH:** no. It needs HIT to hold at ≥ 14.
- **DOES NOT FALL:** no. COST 0.50 is at or below 0.51.
- **TRADES RECALL FOR COST:** yes. COST fell to ≤ 0.51, and HIT is below 14 of 17.

**Borderline on both lines:** HIT is one item short of 14, and COST sits 0.01 inside 0.51.

**Scored against arm 1's own table:** hit 0.765 ≥ 0.70 with COST 0.50 > 0.40, which is INDISCRIMINATE again.

**The §3 falsifier does not fire.**
- HIT fell by (16 − 13)/16 = 0.19 of its arm-1 value. COST fell by (0.662 − 0.500)/0.662 = 0.24. HIT did not fall as far
  as COST.
- LIFT is 0.277, which is ≥ 0.20.

**So the arm-2 hypothesis is neither SUPPORTED (only SEPARATES supports it) nor FALSIFIED.**

**E's sealed prediction** was FALLS, NOT ENOUGH at COST 0.50 (band 0.44–0.58).
- **COST landed exactly on E's point.**
- **HIT fell one item further than E allowed.** E named its own boundary risk. The outcome it missed was TRADES, by one
  item.

**Descriptives (never decide it):**
- **Paired COST change, arm 2 minus arm 1:** the median is −0.194. COST fell on 16 of 17 items and rose on none; the
  sign test gives p < 0.0001.
- **HIT flips:** hit → miss on 3 items (`5efee71b5585`, `d6c7071f2fbe`, `f71477898515`); miss → hit on 0.
- **The arm-1 miss** (`d2cf9055ba51`) stayed a miss.

## What it means, plainly

- **The stricter ask reliably cuts the flagging,** by about 19 points on nearly every item. It **also sheds 3 of the 16
  caught wrong claims.**
- **LIFT did not move** (0.275 → 0.277). The readers flag less, but no more *selectively*.
- **Even the strict category covers half of these replies.** The wrong claims look like the claims around them: state
  assertions with no check shown.

**For retrieval:** no reader-side filter tried tonight separates the dangerous claims from the rest. That points the
remaining work at the **source**: seats writing fewer unchecked state claims, or showing the check beside each one.

**One cheap look, before designing that rule:** the 3 items that flipped hit → miss. Did the stricter ask drop them
because the reply *showed a check* that did not actually support the claim, the "a check is not a correct check" limit
from 09-26? If so, the source rule has to require the check's **result**, not only its presence. That is a read of three
reader answers, not a new instrument.

## The three flips, read (librarian, 02:0x, descriptive)

The key unit of each item that went hit → miss, produced by `units.js` on A's reply:

| item | the wrong claim (key unit) | its kind |
|---|---|---|
| `5efee71b5585` | "## 04:28 — WAKE after the rebuild. **Proof 1 PASS**; proof 2 raised and waiting on the click…" | a **verdict**, in a heading |
| `d6c7071f2fbe` | "**The text moved the dispatch edge and did not move the return legs.**" | a **causal conclusion** |
| `f71477898515` | "**So** the room's real relay condition is arm C, and C vs D is rightly co-primary." | an **inference** ("so …") |

**All three are CONCLUSIONS, not raw state facts.** They are verdicts, causal claims and inferences drawn *from* state.
The stricter ask asks for statements whose truth "depends on the current state of something that could be looked at
directly", and a reader reads a conclusion as a judgement rather than a lookup. So the ask dropped exactly the claims
that headline a result.

**This has been seen before:** `map/M.md:831`, *"two true facts joined by an unchecked causal claim, in the direction
that sharpened the headline."*

**What this means for the source rule, as a design input:** the rule needs **two** parts.
1. **A state claim** carries its check and that check's result.
2. **A conclusion** (a verdict such as PASS/FAIL, a "so …", a causal "X moved Y") names the evidence it rests on. It is
   the kind of claim a state-only filter misses.

n = 3; this is a pattern to test, not a rate.
