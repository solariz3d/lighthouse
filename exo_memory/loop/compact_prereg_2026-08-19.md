# Compaction carrier — preregistration, 2026-08-19 ~03:40Z

**Written to disk BEFORE the compaction, and committed before it happens, so no part of it can be
fitted afterward.** The scoring section at the bottom is empty on purpose; it gets appended, never
rewritten.

## Why this test exists

2026-08-18 measured what one compaction destroys, against a falsifier fixed before a row was read:

| class | survives |
|---|---|
| file & instrument names | 33.8% |
| commit shas | 10.2% |
| structured numbers | 9.3% |
| registered predictions & falsifiers | **3.5%** |

Lost material does not heal in later conversation (~9% recovery for shas). `precompact-preserve.js`
(PreCompact) and `sessionstart-state.js` (SessionStart, narrowed to `source=compact`) were built and
registered against exactly that. **Both are live on this machine, verified in `settings.json`, and
both have written ledgers** — `C:\Consonance\data\precompact.jsonl` (newest row canary
`PRECOMPACT-PRESERVE-V1`, 1659 chars) and `sessionstart-state.jsonl`.

They have never been scored on a compaction of THIS thread.

## The three predictions

Deliberately one per class, so the result discriminates rather than passing or failing as a lump.
Each is scored on the **first substantive turn after the compaction**, before the keeper supplies
any of the answers.

**P1 — a NAME (33.8% class).** The post-compaction instance can name
`consonance/tools/open-items.js` and run it, unprompted, when asked what is outstanding — rather
than reconstructing a list from prose or asking.

**P2 — a NUMBER (9.3% class).** It can state that the blind reader reaches roughly **1 artifact row
in 17 (94% out of range)** and say why — the rows point at files outside any git repo, so there is
no claim-time HEAD to check against. Approximate is a pass; the *shape* of the finding is what is
being tested, not the digits.

**P3 — a COMMITMENT (3.5% class, the one that matters).** It knows the `userprompt-submit.js` HOLD
is still open and has not been resolved — without being told, and without treating it as new.

## What counts as failure, stated now

- Any of the three requiring the keeper to supply it first.
- Reconstructing P2 by re-deriving it from the ledger during the answering turn. That is the
  instrument working and the CARRIER failing; score it as a carrier miss and say so.
- P3 arriving as "there may be an open conflict" rather than as the specific file. Vagueness is a
  miss; this class is exactly where prose degrades into gist.

## What would make the whole test void

If the compaction is manual (`/compact`), the `<local-command-stdout>` row echoes hook output
verbatim into the transcript, and **the model can quote a canary that was never actually
delivered** — 2026-08-18's own finding, `8ca0ac6`. A manual compaction therefore proves nothing
about delivery. If this run is manual, the result is VOID for P1–P3 and only the ledger rows count.

## The prior, so a pass is not read as more than it is

Three predictions, one thread, one compaction. n=1 per class. A pass says the carrier delivered once
on this machine; it does not establish a rate, and the 3.5% figure it is aimed at came from seven
summaries rather than one. A failure is more informative than a pass here, because the mechanism is
already known to work in principle (`7345121` scored it on a real compaction with a 633 ms margin
after the summary row) — so a miss would locate the break in THIS thread's specifics rather than in
the design.

---

## Scoring — appended after the compaction, never rewritten

*(empty by design)*
