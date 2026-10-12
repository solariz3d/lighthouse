# Retrieval: how many of the room's errors were answers already on disk? Librarian, on D, 2026-10-11 21:4x. Lap D301.

The keeper, 21:34: "lets continue work till we figure it out". Retrieval had slid behind cleanup today; this puts it back on the line.

## Why this question
- The reach numbers say what is POINTED AT, not what is MISSED. Light mode leaves 99.74% unpointed by path, strict 67.92% (`handback/p-lightreach-E_2026-10-11.md:27`); same-method reach 96.55% (`handback/p-reach-C_2026-10-11.md`). Those are structure, not use.
- The scoreboard says WHO catches errors: seats after the fact catch nearly all, gates 0 of 383 (`handback/p-scoreboard-E_2026-10-11.md`, §0). It does not say whether the caught error's answer was already on disk.
- **This lap asks the missing link: of the room's caught errors, what share were retrieval misses** (the right answer was on disk before the error, in a file the erring seat did not open)? If that share is small, the room's wrongness is not a retrieval problem and the next step is elsewhere. If it is large, the WHERE of the misses says what to index.
- Two of today's own errors are the shape: my D300 part 3 planned work done in D289 from a stale line (`loop/plan_clean_up_after_ourselves_2026-10-10.md:97`, answer in `handback/p-heavyrunmut-B_2026-10-11.md`); E kept Onuris reads out under a rule the keeper withdrew on 10-06 (`map/A.md:1815`). Both answers sat on disk; both errors came from a stale carrier line.

## Does not touch the H3 trial
Nothing here changes what a live seat loads. Parts 1–3 measure; part 4 builds behind a switch that stays OFF until the ~10-17 decision. Light mode's shelf must come out byte-identical with the switch off.

## The parts
**Wave 1, in parallel:**
1. **B: the registration, sealed before any verdict is read.** Define "retrieval miss", "reasoning error" (the seat had the file open), "new information" (not on disk at the time), and "stale carrier" (a line elsewhere still said the old thing). Set the bar and say what each outcome changes next, at least: miss share < 20% of on-disk-checkable catches → retrieval is not the bottleneck; ≥ 40% → index where the misses live. Register where the misses are expected to live. My guess, sealed here so B is not anchored by it beyond this line: **≥ 40%, and handback/ plus stale carriers hold most of them.**
2. **A: the sample, frozen.** From E's population (`handback/p-scoreboard-E_2026-10-11_evidence/out/rows.tsv`, the WRONG entries and the hand-back corrections, 09-01 → 10-11) plus today's two above, draw 60 catches, seeded and stratified by finder. For each unit, gather mechanically: the erring claim, the correction, the time of each, every path the correction cites with its first-commit time (`git log --diff-filter=A`), and the files the erring seat opened in that turn where a transcript exists. A judges nothing. Freeze it with a digest (function named).
3. **E: the switched-off hand-back index (part 4 in effect, built now).** handback/ is in neither shelf's directory list (`p-lightreach-E:45`; strict `main.rs:7849-7855`, light `LIGHT_SHELF_DIRS` `main.rs:8193`). Add it, indexed and never carried, behind a config switch that defaults OFF. Rows: switch off, both modes' shelves are byte-identical to today's; switch on, hand-backs appear by path within the index budget; the budget's drop count is reported. Mutants on the switch. Report the shelf size with it on.

**Wave 2, after B's bar and A's sample are both committed:**
4. **C: the blind read.** Classify all 60 units by B's definitions, not having seen B's guess-section or my guess above until the table is done. For each miss, name where the answer lived (directory) and whether a stale carrier pointed the wrong way.
5. **Librarian: score against the bar,** with B reading C's table as non-author beside it.

Each pane runs targeted tests under the heavy-run lock; the chair runs the full suite before landing E's code. Worktrees on G:. Commit by named paths; do not push. Dispatch rows carry `--parts 4`, and the chair writes a `working` row at dispatch.

## Wave 1 read (librarian, 21:5x). Ledger D302 (the id offset again: plan D301 = ledger D302).
- **B, part 1** (`loop/retrieval_miss_registration_2026-10-11.md`, git-blob 03f5f19f…; d301-b 5eb0a6b4). Sealed. Bar: high < 20% not the bottleneck; low ≥ 40% index where misses live; between, index the plurality directory and re-measure; a straddle is undecided. B's own guess ~25%, mine ≥ 40%: two sealed predictions, opposite sides of 40%.
- **A, part 2** (`handback/p-misssample-A_2026-10-11.md`, git-blob 5414f731…; d301-a 27fb0eea). 62 units (60 drawn from 1,095 catches, strata keeper 12/17, instrument 12/82, unattributed 5/5, seat 31/991; plus T1, T2), units.json digest 07b840c0…. A's limits stand (only Read counts as opened; 3 of 23 claim hits are probably the correction's quote).
  - **Correction to T1, mine, before C reads:** A took `plan_clean_up_after_ourselves_2026-10-10.md:97` as T1's claim. That line was blamed at 03:02:05Z; its answer, `p-heavyrunmut-B`, was first committed 08:38Z (02:38-06:00). So `:97` was TRUE when written. The erring claim is D300's original part 3 (`plan_queue_sweep_d300_2026-10-11.md` at `700128c8`), planned from `:97` without opening the hand-back. `:97` is the STALE CARRIER, not the claim. C classifies T1 on that reading.
- **E, part 3** (`handback/p-handbackindex-E_2026-10-11.md`, git-blob b4e15731…; d301-e fd122708). MET. Switch `handback_index`, ON only for JSON `true`; off = byte-identical on both shelves (4 dumps, `cmp` IDENTICAL); mutants 15/15; bin 1041/0/6. **The trade, for 10-17:** strict with the switch on lists 143 of 794 mapped hand-backs and pushes 139 `loop/` index lines (about 09-25 → 10-05) out of the full 30,000 B budget; light gains one directory line. Decided with C's result beside it, not now.
OUTPUT → NEXT: changed — T1's claim is re-pointed before C reads it, and E's trade means the 10-17 call is about the budget's ORDER, not only the switch.

## Wave 2 read: NOT MEASURED (librarian, 22:0x). The sample was the wrong population.
`handback/p-missread-C_2026-10-11.md` (git-blob eb70660c…; table `d301-c` 6b211172).
- **C's counts (all 62):** NA 48, X 10, UC 1, RM 3 (S01, T1, T2), ND/RE/OU 0. D = 4 (2 of the drawn 60). **B's §6.1 fires (D < 30): not measured.** Neither B's guess (~25%) nor mine (≥ 40%) is scored.
- **Why, read from C's table:** E's population is CORRECTIONS, and most corrections are not wrong statements: conduct, or defects a seat caught by running something (C's R1, which put 48 of 62 in NA; the keeper stratum 10 of 12 NA). A's thin spot said it: the librarian's WRONG entries, which ARE claims, were 86 of 991 seat rows and 3 were drawn.
- **The second wall is X:** 10 of the 14 non-NA units cite no path, so their on-disk status could not be decided. S29 shows what that hides: the librarian relayed "Onuris is a friend's private project" at 10-07 07:42Z, three hours after `map/A.md:1815` said otherwise. By the rule it is X; by a lookup it is RM, the same answer as T2.
- **What it does show, not as a share:** every decided unit but one is RM (3 RM, 1 UC), and T1 is B's "led wrong by a line it did read" case exactly: my turn's own grep printed the stale `:97` line (C, "The three misses").
- **T1 confirmed as re-pointed:** I had Read the answer 12 h earlier in another turn. The per-turn rule counts that as a miss, which it is: the answer was read and not carried.

## Wave 3: redraw from claims, and look up the X units
**In parallel:**
6. **B: two things, both sealed before the new units exist.**
   - (a) The non-author read of C's table (§6.3), aimed at the 48 NA and 10 X: would B have put each where C did? Report the disagreement count. That decides whether C's R1 is a reading B's §0 meant.
   - (b) An AMENDMENT to the registration. Population = **claims**: every W entry (statements found wrong), not correction rows. Add a **lookup step for X**: if the correction cites no path, search the tree as it was just before the error (`git grep` at the last commit before t_err) for the correct fact; if found, the unit is decided (RM or RE by the transcript); if not, ND. Keep the bar and §6 unchanged. Say plainly whether the lookup biases toward RM, and by how much it could.
7. **A: units for the full W census,** all 101 W entries from `rows.tsv` (no draw, so no allocation choice), plus T1, T2 and S29. Add to each unit the sha of the last commit before t_err, so the lookup can run. Same fields, same limits. Freeze with a named digest.
**Then (wave 4):** 8. **C reads the census blind**, against B's amended §1–§3 and the lookup, not opening this plan or B's §5. 9. **Librarian scores,** B's read beside it.

Land now: C's 6b211172 and its hand-back.
OUTPUT → NEXT: changed — the test came back NOT MEASURED, so the population moves from corrections to claims and a lookup step is added for the units that cite no path.

## B's read (6a) and the ruling on its §3 forecast (librarian, 22:1x), sealed before A's census is frozen
`handback/p-missreadcheck-B_2026-10-11.md` (git-blob 1442d342…; d301-b2 f77ae972). Amendment 1 sealed first (18214714).
- **1 disagreement in 58 NA/X calls** (S28, X vs NA, out of D either way). §6.3 does not fire. C's R1 is what B's §0 says; B owns that conduct errors were not in mind when §0 was written.
- **The forecast:** about 10 of 15 W units in the sample were conduct, so the 101-entry census may give D ≈ 30–37, at §6.1's floor.
- **Ruling 1: the registered question stays as it is.** Conduct errors do not fold in. "Was the rule that would have prevented it on disk?" is a different question (B's S02, S09) and is **registered here as Q2, for a later lap,** not this one.
- **Ruling 2: a top-up, sealed now so it cannot be chosen after the result.** If the W census gives D < 30, A adds the hand-back corrections (`src=H`) whose claim is located by a quoted span (A's existing claim-located method), in seeded rank order, in batches of 20, and C reads each batch by the same rules, until D ≥ 30 or that pool runs out. The report gives D for the W census alone AND with the top-up, and says which one crossed the floor. If the pool runs out below 30, the result is NOT MEASURED a second time, and that stands as a finding: the room's record does not hold 30 decidable wrong claims under these rules.
- **Named blind spot (B §2, S32):** the board is outside git, so a miss of a board post can never be dated and is X by rule. The board is where a seat's current state lives. Not fixed in this lap; it is recorded beside any result.

## Census in, top-up not needed (librarian, 22:3x)
- C's census read (`handback/p-censusread-C_2026-10-11.md`, git-blob a04ca438…; d301-c2 25d25b26, 4005e82d): D = 31–34, so Ruling 2's top-up does not run. Scored after B's §6.3 read.
- A's pool (`p-wcensus-A`, "Top-up pool", d301-a2 d13223eb; 153 of 985 H corrections, 8 batches, digests in A's ring) **stays frozen and unread.** It is there for a re-measure.
- **A's flag on same-turn t_err** (census: of 35 claim-based t_err, 11 same-turn and 12 unlocated): already met in C's read. C re-located the erring turn itself where A's hit was the correction (R10, 9 units) and dropped self-quote hits (R9). The census stands as C read it. For the pool, if it is ever read, same-turn hits get C's R10 first.
