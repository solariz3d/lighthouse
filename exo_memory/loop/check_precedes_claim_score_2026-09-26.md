# Check-precedes-claim — SCORE. Librarian, the non-author scorer (registration §7), on D, 2026-09-26 12:3x.

**Inputs:**
- The registration: `loop/check_precedes_claim_registration_2026-09-26.md`, sealed at `1b95dc9`.
- The run: `handback/p-d160-run-A_2026-09-26.md` (git-blob `563cfc89…`), A, which read the registration with `git show`
  at the sealed commit.
- **A applied no verdict.** The rules below are the registration's §4 and §5, applied as written.

## The ruling: DEGENERATE (§5 D4). Not tuned, and not re-run under this registration.

**D4, as sealed:** *"more than 25% of the scored rows' claim tokens cannot be extracted by §1. It cannot read the claims
it is meant to test."*
- **Scored KU rows: 23.** That is 24 located, minus W105, intersected with B's KNOWN-UNOPENED, which removes none.
- **Rows with an extractable scored token: 5.**
- **18 of 23 (78%) have none, so D4 fires.**

**The denominator question A raised is moot. No reading passes:**

| denominator | KU same-turn | outcome by the sealed rules |
|---|---|---|
| all 23 scored rows | 3 / 23 = 0.13 | fails PASS (needs ≥ 0.70), and **D3 fires** (≤ 0.30) |
| the 5 extractable rows | 3 / 5 = 0.60 | fewer than 8 scored, so **NOT TESTED** (§5); it also misses 0.70 |

**CORRECT set:** 1 of 4 flagged (0.25). That is under the 0.40 bar, but on n = 4 it decides nothing (CP 0.006–0.806).

**E's sealed prediction** was a narrow FAIL on the CORRECT set. The instrument failed earlier than that, on the KU side:
it could not read the claims at all.

## What the run found, which the ruling does not erase

1. **Most of the room's wrong claims name nothing a check could touch.**
   - 18 of 23 located wrong claims carry no path, no number with ≥ 2 significant digits, and no backticked command.
     They are **assertions about state**, for example "there is no stale state", "LIB never failed", "C is logged out"
     (A §2).
   - A citation-precedence instrument cannot see them by construction.
   - **That is a finding about the errors, not only about the tool:** the costly claims here are mostly unanchored.

2. **Where the source was a file, it was usually already in context.**
   - B's independent test (A §5): **12 of 12** path-sourced rows had the source's path in the transcript **before** the
     wrong sentence, and after the last compaction.
   - **Only 2 are strong** (parent directory plus basename): W322 and W324. The other 10 match on a basename like
     `main.rs`, which appears in nearly every transcript, so they are weak evidence.
   - The strong two cut against the census's hindsight label: that exact file was in view, and the claim still went out
     unchecked against it. That is composition, not reach.
   - **n = 2 is a case, not a rate.**

3. **A "correct" claim was wrong.**
   - While verifying the CORRECT set blind, A found one sampled claim false: `readNarrowedView` "lines 65-105" is at
     66–106 at `c809efd`.
   - Unchecked errors sit among claims nobody marked. The WRONG columns hold only the errors that were caught.

## What this means for retrieval, stated plainly

**The chunk-1 ruling stands:** by its sealed definition, REACH outnumbers COMPOSITION.

**Today's evidence also points three ways:**
- (a) The self-reports say *knew, didn't look*.
- (b) Most wrong claims are state assertions with no anchor.
- (c) Where there was a file, it was usually in context.

**Together they suggest the failing step is recognising a sentence as a claim that needs a check,** more than fetching
or holding the source. That is a hypothesis for a **new registration**, not a conclusion. This one is degenerate and
stays so.

**The abuse condition applies:** any change to the token rule, the touching rule or the thresholds after these flags
would void it. The next instrument has to be a new registration, with its own seal.
