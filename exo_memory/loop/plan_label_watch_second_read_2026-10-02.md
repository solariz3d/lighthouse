# The label rule's SECOND READ. Librarian, on D, 2026-10-02 05:1x. Lap D206.

The keeper, 05:09: "lets do your recommendation tho for retrieval".

## What it is (registered, not new)
- `loop/label_rule_watch_registration_2026-09-27.md` §1.5: *"**Second read:** the **next** 30 H and 30 K units, the same N."* F1 (§4) fires
  if the labelled share is < 0.50 at the first read **or at the second read (decay)**.
- The first read: H 1/78 = 0.013, K 3/83 = 0.036. F1 fired on both, so the rule is DECORATION
  (`loop/label_watch_score_first_read_2026-10-01.md`).
- **What the second read adds:** the first 30 fell right after exposure (09-27 23:29Z → 09-28, the T-180 overnight). The next 30 test
  whether use grew once the rule had been in the briefs longer. This is the abuse clause's one allowed "more time" read. There is no third.
- **F2/F3 are not re-run.** They live on the §2.3 sample, which is already read (NOT TESTED: too few labels). The second read is (a) only.

## D206: E (the registrar, who built the first read's KEY)
- **Units:** the next 30 H and next 30 K after the first read's last unit in each stratum, in time order, by the same frame and filters as
  phase 2a (A4 machines, §1.1 K filter verbatim, the main transcripts, the hygiene drops) and the same frame end (`b3b6d109`,
  2026-10-01T13:52:26Z).
  - If fewer than 30 remain in a stratum within the window (to 10-11), the stratum reads what there is, and DG-A3 applies (< 20 → NOT TESTED).
- **Extraction:** arm 1's reader (ask `07e7f855…`), K = 3, `parseStatements`, LABEL_RE `/\b(checked|inferred):/` with A6's locator.
  The same code as phase 2a; only the unit list changes.
- **Output:** a KEY section `a2` beside `a` (or a new file `loop/label_watch_key2_2026-10-02.json`), sha256 in the hand-back. Per-claim
  labels only. E reports no tallies; the librarian scores.
- Instrument tier: heavy-run lock, Claude readers only. No B/C phase.

## Scoring (the librarian, fixed now = the watch's)
- Share = labelled / located per stratum. < 0.50 → F1 fires at the second read. UNLOCATED > 20% → DG-A2 (that stratum NOT TESTED).
- **Reported beside E's sealed second-read predictions** (§5: H 0.60, K 0.30) and beside the first read.
- **Outcome:** if F1 fires again, the rule is DECORATION across both reads, and the watch closes. The retrieval line then rests on the
  second reader's shadow week (D203, ends 10-08).

NEXT: chair dispatch D206 to E when this plan is read
