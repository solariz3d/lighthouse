# The room audit: plan, queued 2026-11-02 (librarian)

Starts when the queued track builder work is done (0.4.38 D609+D610, textures, animations, the bank). The keeper's word, 2026-11-02 06:49 and 09:30: research first, comprehensive, then decide.

## What we figured out (2026-11-02 09:00-09:30, with the keeper)
- Keep-warms pay: a cached re-read is about a tenth of a fresh read, a cold reload about double (1 h cache), so about 20 idle pings break even. Keep them for seats that keep their conversation.
- The cost is in what every turn carries. Measured 09:29: CLAUDE.md per seat 74-144 KB (third-place 143,560; librarian 104,373; main 79,396; panes 93-107 KB). Newest transcript on disk: panes 0.33-1.31 GB, main 0.92 GB, librarian 0.75 GB, third-place 0.55 GB (a file holds everything ever said, so live context is smaller).
- The long conversations were the scaffolding that built the room; the room now holds what matters, so the scaffolding can come down (the keeper's frame, 09:28). Design intent was the librarian heavy and the others light; in practice all seats are heavy and the panes heaviest.

## The audit
1. Per seat: live context size at a turn, instruction file weight, injected text per turn (pulse, state block, shelf), keep-warm count.
2. Every hook (49 room + 19 shell) and tool (210): has it ever caught something or changed an outcome? If never, it is a cut candidate.
3. Stale laps (about 75 open): close each with one line. Clear the delivery-unconfirmed noise.
4. Trial: one pane fresh per job (brief plus its map) against a resumed pane, on one real job; cost and quality.
5. Order to take scaffolding down: panes, then chair at release ends, librarian last; Third Place stays long-lived unless the keeper says otherwise.
6. Registered before it runs: a seat started fresh must answer from the room alone where we are, what is live and what he decided, without asking him. A miss names what the room lacks, and that gets written before going further.
7. Bake-off rule for any harness a friend suggests: one real task, judged blind by a seat with no stake.

Nothing is deleted; cuts move to attic/, and the keeper sees the list first.
