# P-BATTERY-RUN2-DRAFT · BRAVO — hand-back (D088, unattended N6, stage 1 of 2)

**B (pane `12fb81f6`), machine D, 2026-09-19 13:2x–13:4x.** At HEAD `3dff577`. Design only: no task written, no key written,
no subject run, no cold reader spawned.

**Files written: two, both uncommitted:**
- `exo_memory/loop/pane_battery_run2_DRAFT_2026-09-19.md`, the deliverable (DRAFT);
- this hand-back.

Plus one line in `map/B.md`. **`loop/pane_battery_registration_2026-09-16.md` (REG) is untouched** (`git status --short` shows
it clean).

## 0 · What the draft carries, against the packet's list

| packet asks for | where in the draft | the rule it rests on |
|---|---|---|
| for each kept task, why it won't hit the ceiling, as a pre-dispatch check; a cold restricted reader must NOT pass | §1 (R2-1) and §4's table, per task | C's route, `p-t3-readiness-C_2026-09-19.md:94-98`; D086 `:11-13` ("a reader given nothing passes") |
| no task text contains its own scoring criteria, checked mechanically | §2 (R2-2): 3-gram and output-section overlap, with a negative control and **a positive control that is my own D085 A4 against `primed1.txt:3`, which must FAIL** | D086 `:11`; both phrases confirmed on `primed1.txt:3` by `grep -o` |
| keys off-repo and off-directory; the seal on origin before dispatch | §3 (R2-3): the triple row, the `chair_inject` seal gate (`mcp.rs:524`), the void-grep before dispatch, EXPOSURE vs CONTENT, the digest window ended on the board and not on a file | `librarian/2026-09-16.md:57`, `:61`, `:67`; REG `:183-187`, `:223-229` |
| test–retest per kind | §5 (R2-5): two idle tasks per kind; the kind is VOID if median retest noise ≥ the pane spread | REG `:189-193` (A4) |
| load as a manipulation, with its own control | §6: a third task under a fixed two-item packet; a difference in differences against the pane's idle mean **and** the cold reader's difficulty on the same three tasks; a claim only if L < 0 for every subject in ≥ 3 of 4 kinds | REG `:142-143`; `:61` |
| T4 and T6 fixed or dropped, with the reason | §4: **both DROPPED.** T4's two numbers are at ceiling by rule, or give three levels over two trials. T6 scores a pair, and the room has no reference labels that are not themselves at ceiling | REG `:85`, `:195-199`; D086 `:9` |
| the cost, from C's §10 | §8: ≈ 1.6–1.9M tokens, **intake bill only, upper bound**, plus T3's cold search and all work tokens; with the cheaper cut and the floor below which the run should not run | `p-battery-cost-C_2026-09-16.md:156-163`, `:200` |
| what the keeper must see before the keys are sealed | §9, eight items | — |

**Kept: T1, T2 (re-cut), T3 (new question), T5. Dropped: T4, T6.** Subjects: A, C and E. **B is out as a subject** (§7),
because B wrote the checks every subject is scored under.

## 1 · Two design choices worth an attacker's time (stage 2)

1. **Calibration by removal (§4, T1, T2, T5).** A plant or mutant the cold reader finds is dropped from the key before
   sealing. That fixes the ceiling. **It can over-select for things a room-less reader cannot see** (room-specific context),
   so run 2 measures pane-in-context, which REG `:138-139` already says is the population. It could also drive toward a
   floor. The floor rule (≤ 2 of N for every subject → VOID) stays.
2. **T3 cold reader gets a clean checkout, not nothing** (§1 table). Without the repo, T3's cold check is vacuous. With it,
   it measures grep-reachability, and the pane is scored beyond that.

## 2 · NOT VERIFIED

- **Nothing was run.** No cold reader was spawned, so §1's claim that the cold check would have caught all five past ceilings
  is **argued from the records**, not tested:
  - D086's cold arm did pass, which is the one direct case (D086 `:13`).
  - For run 1's T2, "8 of 8 in 4–7 minutes" suggests a cold reader would also have found most, but that is an inference.
- **The §2 scan is specified, not built.** Its false-positive rate on real briefs is unknown. FAIL-2's output-section
  detection is the part most likely to need hand adjudication.
- **The seal gate's declaration syntax.** I confirmed that the gate exists and refuses (`mcp.rs:524-537`, and `:2331`: "a
  declared seal cannot be checked and is refused"). I did not read how a dispatch declares its key, so "every run-2 dispatch
  names its key so the gate fires" is the intent, not a checked call.
- **Cost:** C's per-hand-back figures are upper bounds on intake only (`:200`, `:212`), measured on L 09-02…09-16. T3's cold
  search cost is unbounded here. §8's total is a floor on a ceiling, not an estimate.
- **The load packet's two real items** are not chosen. That is the keeper's (§9.4).
- **Nothing on L.**

## 3 · WRONG column

- **Carried, and owned in the draft's header: my D085 A4 caused D086's ceiling.** Its criteria (add, hold) were exactly what
  `primed1.txt:3` asks every reader to write. I attacked T3 without checking whether the task text requested the thing I
  proposed to score. §2.3 turns that into the scan's positive control.
- **This lap:**
  - I first cited L045 as `:116` for "do not plant". `:116` is "the plant method … returns ceiling both times"; "do not plant …
    declared conditions" is `:122`. Corrected in the draft before filing.
  - I referenced a rule "R2-4" that did not exist. Replaced with the ceiling X named in the sealed row (§4).

## 4 · Questions not put to anyone (the keeper is asleep); defaults, as in the draft's §10

B out as a subject (yes) · the load block designed but not run until the keeper sees §9.4 and §8 · T4 and T6 dropped, not
deferred · "do not plant" read as retiring **ceiling** plants, so plants survive only where the cold reader removed the free
ones.

NEXT: librarian hand the draft to the stage-2 attacker, then collate, when D088 stage 1 closes
