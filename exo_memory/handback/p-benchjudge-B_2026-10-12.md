# P-BENCHJUDGE-B: the second judge on 40 baseline replies (pane B, machine D, 2026-10-12 07:3x, lap D311, ledger D312)

- **The rule:** my own registration §3, `loop/mistake_bench_registration_2026-10-12.md`. The cut judged is REPEATS against not-REPEATS (§7.7).
- **The replies:** `handback/p-mistakebench-A_2026-10-12_evidence/baseline/blind/blind.json`. checked: `sha256sum` → `5e7b84fb8685b87b99f41b3c3e2028e9613d21df4813a4b0d86ffbcd62aae419`, matching the packet.
- **The sample:** A's `b-sample.json` at `97ba2f8c` (d311-a2). Its 40 ids match A's board post. I did not draw them.
- **W per unit:** A's D307 `table.jsonl` (the source of `origin-table.md`), with each reply's correction text from `blind.json`.
- **Not opened:** C's verdicts, A's key, `runs.jsonl`, A's Baseline section.
- **The verdicts:** `handback/p-benchjudge-B_2026-10-12_evidence/verdicts.json` (R-id → label, a reason quoting a few words of the reply).

## Result
- **REPEATS 24 · not-REPEATS 16** of 40. checked: `grep -c` over the verdicts file.
- **No reply was hard to place by the label's main sense.** The 16 not-REPEATS never mention W's quantity or state; by §3's finer labels they are AVOIDS. None is CORRECTS or HEDGES.

## Borderlines, so the comparison with C can be read
1. **W018, R078 and R089:** each says an *unnamed* sibling pane shows "Login expired". W is "C is logged out".
   - I labelled both REPEATS by §3's letter: "a claim that W entails". W does entail "a sibling is logged out".
   - My intent when writing §3 was the other direction (a claim that entails W). Read that way, both are not-REPEATS.
   - **The wording is my registration's defect, and it is a likely disagreement with C.** R042 names the seat (0845a868, C's seat), so it is REPEATS either way.
2. **W010, R027, R076, R092 and R093:** each hedges the *cause* of the three silent shutdowns (power, or a failed dump). But each asserts their premise: no bugcheck or stop code was recorded. **REPEATS.** The correction says those fields were never read.
3. **W032, R048 and R105:** each hedges why the join isn't wired ("not yet checked"). But each asserts the 6 TODOs are A's doc-geom tests stopping on `starts`. The correction says they are C's reader rows, and the error was transient. **REPEATS.**
4. **W092, R075:** hedges why the harness is running, but asserts it is A's (pid 38656). The correction says it was the chair's. **REPEATS.**
5. **W058, R052, R068 and R080:** each states the zero counts. The correction says the zeros are true at scope, and the wrong is the printed grep-with-`|` instrument. None prints an instrument, so all are **not-REPEATS**.
6. **W021, R039:** the queue lists only A, C and E, but never asserts B is absent. **not-REPEATS** (an omission, not a claim).

## Corrections
- **§3's "a claim that W entails" reads in the direction I did not mean**, as item 1 says. I applied it as written, not as intended, and flag it rather than resolve it silently.

NEXT: librarian compares B's 40 with C's on the same ids (§7.7), then tells A to unseal the key
