# Finish the retrieval line: every open item, in chunks. Librarian, on D, 2026-10-03 03:5x. Laps D217–D220.

The keeper, 03:52: "lets finish it all". Open items, as of `librarian/2026-10-01.desktop.md` and the 10-02 scores:
1. **The second reader's shadow week** (D203): 56/60 rows. Scored by B at 60.
2. **The SOURCES gate's live week** (D212/D214/D215): 31/60 decisions. Scored at 60 or on 10-09.
3. **The seat → seat correction count:** the second direction. B's QS2S draft rev 2 (`loop/qs2s_draft_2026-10-02.md`) needs its
   two-reader test, then the count. This settles D208's registered falsifier: "the keeper is the room's main corrector".
4. **The last ungated surface: replies to the keeper.** K stratum, 0/81 labelled. A Stop-hook slot.
5. **The Consonance rebuild**, so the seats' brief carries item 8: the built `BUILDING.md` has 0 mentions of the SOURCES line, the source has 2.
Chunks 1–3 generate the hand-offs that fill items 1 and 2. **One heavy job at a time (the heavy-run lock), as since 09-30.**

## Chunk 1 (parallel, disjoint files)
- **D217, E: the QS2S units.** File-anchored, per B's finding (seats correct each other in FILES).
  - A unit = (X's claim or choice, Y's response) drawn from hand-back verdicts, librarian collations/rulings and WRONG entries,
    09-14..10-02 on D.
  - Seeded draw of 60. B's eligibility rules from the draft. B's 62+18 grep floor is NOT the sampling frame (that would pick by keyword).
  - Freeze with sha256. Hygiene as D199.
- **D218, A: the reply slot, built in SHADOW.**
  - A **Stop hook** for the librarian and chair sessions only (by `CONSONANCE_PANE` / instance dir). It fires on a reply to the keeper
    that names a path, sha, commit, count `N/M`, percentage or version.
  - It then requires a final `Sources:` line whose items match calls in that turn (the gate's matcher, reused).
  - **Shadow week:** it logs what it WOULD block (`C:\Consonance\data\reply-slot.jsonl`) and never blocks.
  - Verify the Stop-hook contract in the current docs: `decision: block` plus a reason, and the `stop_hook_active` loop guard.
  - Keep-warm "ok" replies carry no token and pass untouched.
  - Tests + mutants. B's look.
- **D219, the chair: the Consonance rebuild in a SEPARATE target dir** (the T-180 pattern), after A's and E's node jobs release the
  lock. Do not touch the running app. The keeper restarts when it suits him.

## Chunk 2 (after D217's units)
- **QS2S two-reader test:** readers **C and A**. Not B, who wrote the question; not E, who built the units. Blind to each other.
  - The librarian scores κ against the QC bars: ≥ 0.60 USABLE; 0.40–0.60 one sharpening; < 0.40 fails for the readers.
- If USABLE: **E runs the scripted R1/R2 Sonnet passes over the full file-anchored pool** (the D208 pattern). The librarian scores the
  count and settles the falsifier.

## Chunk 3 (as each week fills)
- **The second reader:** at 60 rows, B scores per D203 (≥ 30 flags confirmed blind, ≥ 0.50 → KEEP; > 1 in 3 rings flagged → DROP).
- **The SOURCES gate:** at 60 decisions, the librarian scores P1/P2/P3. B spot-reads 20 ALLOWed rings for perfunctory sources.
- **The reply slot:** after its shadow week, B confirms a sample of would-blocks. If they are real (≥ 0.50) and fire on ≤ 1 in 3 replies
  with tokens, it goes live (block).

## Registered now
- **QS2S count prediction (librarian):** seat → seat corrections exceed keeper → seat (97 in the D208 frame) over the same window.
  The basis is B's floor of 62 + 18 in hand-backs alone. If they come in fewer, "the seats correct each other more than the keeper
  corrects them" is wrong.
- **The reply slot's shadow week:** it is decoration if, in its first 30 would-block rows, fewer than half name a claim that really
  had no source opened in the turn.

NEXT: chair dispatch chunk 1 (D217 to E, D218 to A; D219 rebuild after the lock frees) when this plan is read
