# Chunk 3: the gate's live week and the second reader's shadow week, SCORED (mechanical parts). Librarian, on D, 2026-10-03 04:4x.

Ledgers: `C:\Consonance\data\sources-gate.jsonl` (89 rows) and `C:\Consonance\data\second-reader.jsonl` (90 rows, 87 `ok`). Computed by
node in the librarian's 04:4x turn. **Probes excluded mechanically:** a gate row whose pointer mentions "probe" is dropped (6 rows: A's,
B's and the bogus-token dispatch).

## The SOURCES gate (D212/D214/D215), live since 2026-10-02 19:58Z
- 83 real decisions: allow/matched 74, deny/unmatched 7, allow/none 2. By tool: call_librarian 32, call_chair 26, chair_inject 25.
- Grouped into hand-offs (per seat + tool, a deny run ending in an allow): **76 hand-offs.**
- **P1: 74/76 = 97.4% reached ALLOW with a real (non-`none`) SOURCES line within two tries.** Bar ≥ 90%: **PASS.**
- **P2: 7 deny→allow recoveries, median 0.23 min, max 0.64 min; 0 unresolved deny runs, 0 lost hand-backs.** Bars < 2 min median, no stall
  > 15 min, 0 lost: **PASS.**
- **`none`: 2 of 76 (2.6%).** The dodge falsifier (> 30%) does not fire, on dispatches or overall.
- **P3 (reported): the second reader's flag share fell from 63.0% of rings (17/27, pre-gate) to 43.3% (26/60, post-gate).** The gate
  removes exactly what the second reader flags (the stated confound).
- **Still owed:** B's spot-read of 20 ALLOWed rings for perfunctory sources (the abuse falsifier: > 5 of 20 means form-only).

## The Sonnet second reader (D203), shadow since 2026-10-01 16:12Z
- 87 `ok` rows; **43 with flags = 49.4% of rings flagged** (89 flags in all).
- **Its sealed DROP clause FIRES:** *"DROP: CONFIRMED < 0.50, OR flags on > 1 in 3 rings (nagging)."* 49.4% > 33.3%. Post-gate alone,
  43.3% still > 33.3%.
- **By its own registration, it does not go live as a visible flag.** It is reported as fired, not tuned and re-run.
- **B's precision read is still worth running, as information and not as the decision:** are the flags real unopened sources? If they
  are mostly real, the problem was frequent, and the gate is now catching it at the moment of sending. If they are mostly false, the
  reader was noise.

## Where this leaves the retrieval line (pending B's two reads)
- **The gate works** by its registered bars: followed 97%, no stalls, nothing lost.
- **The after-the-fact second reader is dropped** by its own falsifier: it nags. The gate does its job at the moment of sending, with a
  hard check instead of a model's judgment.
