# L151: way 1. The extra bank starts earlier when the piece has an extra turn. Librarian, on L, 2026-11-07 02:3x local

**His word, 08:34Z:** "from the artifact we could try 1 first" (page https://claude.ai/artifact/9jSziTmgXwMLSHoF6fZPoh; L150: `handback/p-l150-{B,C,E}_2026-11-07.md`).
**Base:** t180 main fc3cc63. One branch, `l151-way1`. Not released; installed only after he sees renders.

## The change (C's way 1, `p-l150-C` §3, narrowed by the librarian)
- **Where:** `app/core/panel.js:1305` (`drawn`) and the bank's default in `changeFroms` (`:93`).
- **The rule:** when the piece already has an extra turn, the extra bank's default `from` = the extra turn's mark − 0.12·L. On his 1,000 m piece that is 380 m, as drawn on the page.
  - Clamp it to ≥ the first ramp's end, and to ≤ L − need, as `drawn` does today.
  - A mark he slid (`secPending`) always wins.
- **With no extra turn, nothing changes.** His good save's bank-out from 500 m is on time (λ_doc −1 m, L150) and must stay byte-equal.
- The core is untouched. The additive rule holds, as today.
- Known limit, from C, to say to him: the ramp still runs to the end, so this moves the lag (by about 60 m) and does not remove it. Way 2 is next if it isn't enough.
- **Open question for him, not decided here:** if he adds the extra bank BEFORE the extra turn, the mark is already fixed at 500 m. Way 1 does not move it.

## Pieces, disjoint
- **B (build, on the branch):** the change, plus panel tests:
  - his S case: extra bank default 380 when an extra turn exists;
  - no extra turn: 500, as today;
  - a slid mark is kept;
  - the clamp at a short piece.
  - The byte check: rebuild his good save's p2 through `extendOptions` and get byte-equal (as L150 did).
  - Then B's L150 rows rerun for the S at from 380: λ_doc, λ_onset, and the bank at 579 m.
  - Suite under heavy-run.
- **C (his order, measure only, on fc3cc63, no code):** build the piece in his order, "make the turn, then the banking, then the extra banking", through the real panel path (headless panel or the page). Then the other orders (extra first, bank last). Do the documents differ, and where? This is the testbank2 order finding (11-06, open) with his steps.
- **A (defect, own branch `l151-mirror-refusal`):** B's L150 unasked finding. +34.78 → −34.78 with a 500 m mark is refused (BAD_SECOND, "from at most 628.5, got 500"), while +30 and +40 pass.
  - Trace the cause (`extend.js` `spanHolds` grid, L141's non-monotone cells, inferred).
  - Write a failing test first, then the fix, so the refusal matches its own stated limit.
  - The suite must pass, and no saved byte may move for pieces that were accepted before.
- **E (review, after B and A ring):**
  - a non-author read of both branches, varying what each author fixed;
  - renders of his S on fc3cc63 vs l151-way1, as pictures of the piece (no charts), for his page.
  - E rules on B's rerun: did the lag shrink by about 60 m as C predicted?

**Then:** my page with the renders. He looks first, then install with no launch, built-head set, not released.
**Stop rule:** a red that was green on fc3cc63 stops the lap. Never todo a red to get green.
