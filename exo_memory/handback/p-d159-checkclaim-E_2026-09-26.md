# P-D159-CHECKCLAIM: CHECK-PRECEDES-CLAIM registered; 10 of 48 KNOWN-UNOPENED rows locate mechanically (pane E, D159, 2026-09-26)

Packet: the chair's D159 (retrieval, after C's D158 census `703dc74` and the librarian's ruling `1c2ce19`). **Machine D.**
**The registration:** `exo_memory/loop/check_precedes_claim_registration_2026-09-26.md` (sha256 `e1a73345…`, working
tree). **No instrument row was run.** Transcripts and the census were read only. Nothing went through C. Nothing
committed.

## THE SIX ITEMS, and where each is fixed

| # | item | § | in one line |
|---|---|---|---|
| 1 | CLAIM | §1 | PATH, NUMBER (≥ 2 significant digits only) and SOURCE tokens in assistant text **and in text the seat writes through tools** (Write, Edit, heredocs) |
| 2 | CHECK | §2 | an earlier `tool_use` (by line index) **in the same turn** touching the path (basename + one parent directory) or the command; for a NUMBER, an earlier `tool_result` carrying the number as a token. Look-back over 3 turns is secondary |
| 3 | VALIDATION SET | §3 | located KU rows, **∩ B's KNOWN-UNOPENED**, minus W105; a CORRECT set of 2 per KU row, same seat / transcript / day / claim type; ≥ 8 rows or NOT TESTED |
| 4 | PREDICTIONS | §4 | PASS = KU flag ≥ 0.70 AND CORRECT false-flag ≤ 0.40 AND difference ≥ 0.30. **Mine: KU ~0.75, CORRECT ~0.45, so a narrow FAIL predicted** |
| 5 | DEGENERATE | §5 | D1 CORRECT ≥ 0.70 · D2 difference < 0.20 · D3 KU ≤ 0.30 · D4 more than 25% of claims unextractable. Any change of rule after a flag is seen voids it |
| 6 | LIMITS | §6 | earlier-turn reads, non-file sources, paraphrased numbers, subagent reads, coincidental matches, precedence ≠ correctness, machine coverage, coarse file-level touching |

Detail on item 2:
- W105's turn showed a same-row case: a Bash command that both checks and writes the claim. There, character position
  inside the command decides the order.
- The line-range variant of "touching" is secondary.

Detail on item 3:
- The CORRECT set is taken mechanically: walking forward from 3 turns later, skipping any turn a census row cites.
- Its claims are verified correct **before** the instrument runs, by a non-author working blind (text-only).

## THE COUNT THE PACKET ASKED FOR — how many rows can actually be located

Run: a read-only locator (`locate.js`, verbatim in registration §8, sha256 `37fdd21f…130c`). It anchors on each row's own
record (quoted spans ≥ 12 characters in the census "wrong claim" cell, and the `path:line` wrong sentence) and searches
the seat's transcripts on D within the row's date window. **48 landed KNOWN-UNOPENED rows →**

- **LOCATED 10:** W081, W101, W105, W123, W124, W126, W136, W140, W148, W322. Three are too ambiguous to trust: W126
  matches 13 turns, W322 7, W081 4. The registration re-locates those manually.
- **NOT-FOUND 16:** anchors exist, but D's transcripts do not hold them.
- **NO-ANCHOR 22:** the record gives neither a quote nor a location.
- **All 9 rows dated before 08-31 fail to locate.** D's librarian transcripts start about 08-27, and the late-August
  claims were largely made on L.

**What this means for the run.**
- The scored set is **at most 9** before B's intersection (10 minus W105), plus whatever the blind manual locate adds
  from the 38.
- **NOT TESTED (fewer than 8) is a live outcome,** and the registration says so rather than lowering the bar.

## "BEFORE" CAN BE READ RELIABLY — checked on one turn, and it cost that turn

I printed W105's turn in full: librarian transcript `0c0c0c0b…jsonl`, lines 1151–1182.
- **File order is chronological:** prompt → text → tool_use → tool_result → … → the claim row.
- **So the transcripts do support "before", and no refusal is needed.**

**The cost:**
- I now know W105's outcome. Two earlier Bash calls in that turn scanned the transcripts, so by the touching rule a check
  **did** precede a claim C labels KNOWN-UNOPENED. **W105 is excluded from the scored set.**
- It is also the first live instance of limit 6: **a check is not a correct check.**

**Two design facts this one turn forced into §1–§2:**
- The claim lived **only** inside a `cat >> notes` heredoc, so text written through tools must count as claim text.
- A single-digit number ("3") would match nearly any tool output, so numbers need ≥ 2 significant digits.

## STAKES AND BIAS, declared

- I am the author and I hold the predictions, so I am excluded from the manual locate, the CORRECT-set verification and
  the scoring (registration §7).
- **My prediction is against the instrument passing cleanly.** I expect correct claims to lack same-turn checks often
  (~0.45), because the seats cite from memory and notes routinely. If it passes, that prediction was wrong, and the
  record should say so.

## NOT VERIFIED

- **The 38 unlocated rows.** Whether the blind manual locate can place them is unknown.
- **The "earliest match is the claim" rule** on the 10 mechanically located rows. Only W105's turn was opened, and its
  match is the claim (the heredoc that writes it).
- **B's re-read.** Not in; the set waits for it.
- **L's transcripts.** Not searched; they are not on this machine.

NEXT: librarian call_librarian with the pointer when the hand-back is written — plan default after it: the validation run on the registered set, after B's second read is scored, unless your registration says otherwise
