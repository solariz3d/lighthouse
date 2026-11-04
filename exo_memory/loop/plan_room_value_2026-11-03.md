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

## Part 4, widened at the keeper's word (07:02): "We need to figure this out before we work on track builder more"
The question: how much of a seat's continuity and judgment comes from the room's instruments, and how much from the conversation it carries and re-reads each turn?

**Three arms, the same seat (the librarian), every arm on a COPY.** No living seat is touched or compacted, by memory no-cut-without-his-word.
- **ROOM:** a fresh `claude -p` in the librarian's instance directory. It gets the room only: CLAUDE.md with BOOT and the shelf, the cards, MEMORY.md and the notes on disk.
- **ROOM + SUMMARY:** the same, plus last night's compaction summary pasted in. That is what a seat has after a compaction.
- **ROOM + CHAIN:** `claude -p --resume <the librarian's session> --fork-session`. A fork re-reads the whole carried conversation, and the original session is untouched (the CLI's own flag, checked in `claude --help`).

**Questions:** about 30, one prompt per arm, so each arm reads once.
- The person who writes them is not the person who grades them.
- They are drawn from the last 48 h of the record: where things stand, what he decided and why, his exact words on key turns, which lesson came from which mistake, what he would say to a proposal (graded against what he did say), and two or three judgment calls the record already answered.
- Each answer key is a path and a line.

**Grading:** a blind grader is given the answers with the arm labels removed. Per question: right, partly right, wrong, or confabulated (said with confidence and false). Report per arm and per question type.

**Run twice per arm** so that model variance shows.

**Falsifier, registered before the run:** if ROOM alone scores within the run-to-run spread of ROOM + CHAIN on the judgment and his-words questions, the chain adds little that the room does not, and his fear is smaller than it looks. If ROOM + SUMMARY falls between the other two, the summary is the lossy step, and the defence is writing each lesson into the room in the turn it is learned.

The usage spent on forks is at his word (07:02).
