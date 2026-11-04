# Room audit, collated (librarian, 2026-11-02)

Plan: `exo_memory/loop/plan_room_audit_2026-11-02.md`. Hand-backs, all read-only:
- item 1, what each seat carries: `handback/p-d618-seat-weight-E_2026-11-02.md` (git-blob 746ed906)
- item 2, hooks and tools: `handback/p-d619-hooks-tools-C_2026-11-02.md` (git-blob 91209578)
- item 3, open laps and unconfirmed dispatches: `handback/p-d620-stale-laps-O_2026-11-02.md` (git-blob 04209c16)

## What costs (item 1, §1-2)
- The per-turn cost is the conversation carried since the last compaction, not the injected text: pulse plus state block 200-370 tokens a turn (under 0.3%); instruction files 22k-40k tokens a seat, steady and cache-read; system prompt, tools and summary 65k-84k.
- main 773k and O 801k a turn; each keep-warm re-reads all of it (about 14M cached tokens a day each, E's estimate). Back at the floor they would carry 90k-120k.
- B and P: every prompt in 24 h was a keep-warm (27 of 27, 25 of 25).
- Third Place: heaviest instructions (143,560 B), no keep-warms.

## Hooks and tools (item 2)
- 24 room hooks, 19 registered shell commands (11 copies of room hooks), 104 tools, 4 scheduled tasks.
- The only per-turn model cost among hooks: second-reader, a Sonnet call per ring; 1,584 flags in 3,364 rows, never adjudicated.
- second-vantage runs daily: 67 runs, 683 UNLAUNCHABLE, 230 READER-FAILED, 37 SURFACE; the one adjudicated surfacing was a false positive (librarian/2026-10-18.md:306).
- 7 installed hooks are older than their room source (D454 changes never installed); what runs is not what the repo says.
- Dormant or never-catching: 6 hooks unregistered for 41+ days, 39 on-demand tools with no recorded live catch (C's table lists each).
- push-gate: no real catch, but it guards public pushes. release-chime is a feature.

## Laps (item 3)
- 85 open: 79 proposed closed (filed, dropped or superseded), 6 keep open; evidence per row.
- All 32 unconfirmed dispatches were delivered.
- Two bookkeeping bugs: a retake baton row is written to every working lap, so none ages to stale (41 of 85 sit in working); the delivery confirmation's 1,800 ms window ends before the pane renders.

## Ruled in line (no keeper call needed)
1. The chair writes O's 79 close rows; the 6 stay open.
2. One small lap: retake rows only on their own lap; the delivery check reads the pane's own row instead of a 1,800 ms render.
3. No move to attic before the keeper sees the CUT list (C's condition, kept).

## For the keeper (recommendations)
- A. Stop second-reader, second-vantage and findings-return: the one per-ring model call and a daily run, with no catch on record. Recommend yes.
- B. Move the dormant hooks and the 39 never-catching tools to attic/ (one mv returns each). Recommend yes; lineage-rip stays (his D475).
- C. Keep push-gate and release-chime. Recommend keep.
- D. Bring the installed hooks up to the room's source (a prove-it install with backups). Recommend yes, after A and B so fewer move.
- E. Compact main and O when each is between laps: the biggest single saving. Recommend yes; their transcripts stay whole on disk.

## The registered test (from the plan), still owed after the cuts
A seat started fresh must answer from the room alone where we are, what is live and what he decided, without asking him.
