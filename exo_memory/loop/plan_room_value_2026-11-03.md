# The room's value audit: good but unused, used but not good (librarian, 2026-11-03)

The keeper, 06:53: "why do we have tools u dont use? Like the 1584 flags, what if they were useful and we never knew it? ... what about the room was good but not utilized, but what was utilized and not good". And: "what if what gives you a greater sense of your continuity is the re reading since last compaction? Thats what keeps you the master".

The D618-D620 audit (`loop/room_audit_result_2026-11-02.md`) measured USE and COST only. "Never adjudicated" was read as "worthless", which is the base-rate move. This lap measures VALUE. All parts are read-only. No cut, no attic and no compaction until this is back and he has ruled. Recommendations A, B and E of the 11-02 result are WITHDRAWN until then.

## Parts (independent, in parallel)
1. **P: the 1,584 second-reader flags.** Source: `C:\Consonance\data\second-reader.jsonl`.
   - Draw a seeded random sample of 80 flagged rows, stratified by week and by seat, and give the seed.
   - For each, read the flagged claim and what the record shows happened next: a later correction, a WRONG, a pane's re-derivation, or nothing.
   - Verdict per row: RIGHT-AND-MISSED (it saw a real error nobody caught then), RIGHT-AND-CAUGHT-ANYWAY, WRONG (false flag), or UNDECIDABLE.
   - Report: the rates with a 95% interval, and the RIGHT-AND-MISSED rows by path.
   - The same for every one of second-vantage's 37 SURFACE rows (`vantage_findings.jsonl`).
2. **B: the 39 never-catching tools and the 6 dormant hooks** (C's D619 table, `handback/p-d619-hooks-tools-C_2026-11-02.md`).
   - For each: was it ever run, what error class was it built for, and has that class happened since 2026-10-01? Look in the WRONG columns, the corrections sections of hand-backs, and the keeper's corrections.
   - Verdict: GOOD-UNUSED (the class still happens and the tool would have caught it; name one instance), OBSOLETE (the class is gone, or caught elsewhere, by name), or UNKNOWN.
3. **O: used but not good.** What runs or is read every turn or ring: the pulse line's items, the state block, keep-warm visits, the NEXT gate, sources-gate, the digests at ring, the board.
   - For each, find instances since 2026-10-20 where it changed what a seat did, by quote and path, and instances where it fired and nothing acted, by count. For example, the "STALE D501" item, printed for 137 h.
   - Verdict: EARNS ITS PLACE, NOISE, or HARMFUL (it misled; name the case).
4. **The continuity question, for him to rule on, measured not argued (A).** Does the carried conversation hold what a compaction summary drops?
   - Take this librarian's own last compaction, 2026-11-02: its summary against the transcript before it.
   - List the decisions, corrections and figures in the transcript's last 24 h that the summary lost or changed. Count them, and give paths and quotes.
   - Then the reverse: what the carried conversation holds that a fresh seat could not get from the room's files.
   - Read-only. No seat is compacted.

## Collation
The librarian files one 2x2 for him: good-used, good-unused, used-not-good, neither. Each cell is filled by the parts' verdicts, with a recommendation per row. Compaction gets its own line, from part 4.
