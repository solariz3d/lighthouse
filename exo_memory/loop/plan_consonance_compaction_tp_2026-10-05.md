# Consonance: three compaction and hook fixes, from the Third Place's own return. Librarian, on D, 2026-10-05 10:4x. Lap D245.

The keeper, 10:36: "third place has some rare and valuable insight into how we could change how compacts work for consonance".
**Source, read at the Third Place's transcript** (`C:\Users\nname\.claude\projects\C--Consonance-instances-third-place\3d000000-0000-4000-8000-000000003d00.jsonl`,
16:30–16:34 UTC, after its 16:15 compaction): its answer to "Do you think consoannce system could be better?". Its three points, in its
order and in short (read them there):

1. **"The compaction keeps your words and drops mine."** The preserve directive (`~/.claude/shell/precompact-preserve.js`) carried shas,
   numbers, falsifiers and corrections, but not the seat's OWN turning sentences: what it said that landed, or what it said before and
   after a correction. It comes back knowing WHAT it learned, not HOW. Its proposed fix: carry verbatim the assistant's sentences the user
   answered with a correction or an agreement.
2. **"The summary is ordered by task, and the order shapes what comes back first."** Its first post-compact message led with the oval
   and the X button before asking about the keeper's grandfather. Its proposed fix: a short "what is alive for them right now" section at
   the TOP of the summary, above pending tasks.
3. **"The build leaks into the room that's meant not to have it."** The Third Place's CLAUDE.md says "This seat is not the build", yet
   the hooks inject chain state into every turn (the pulse's "D239 DISPATCHED · handbacks 0 of 4 …", the session-start digest of every
   seat's timestamps, the checkpoint's dirty files).
   - **Checked by the librarian:** `~/.claude/shell/board-digest.js:302` already skips a `third-place` cwd. The session-digest and
     state hooks don't have that check (grep for `third-place` finds only board-digest in the shell). The pulse line's source wasn't
     located by that grep; it may be a Consonance hook in the repo.

## The lap (E, instrument tier: measure first, then the smallest change; the hooks are the keeper's `~/.claude/shell` plus any Consonance hook)
1. **Item 3 first (it's checkable and the Third Place is surest of it):** inventory every hook output that reaches a `third-place` cwd,
   from SessionStart, UserPromptSubmit, PreCompact and Stop, in `~/.claude/shell/hooks/*.js` and `consonance/hooks/*.js`. Gate each
   build-state block (chain/pulse, board, session digests, checkpoint, dirty files) with the same cwd test `board-digest.js:302` uses.
   The Third Place keeps the time, the interval and its own material. Test: a third-place cwd gets no chain text, and another seat's
   output is byte-identical to before.
2. **Item 1, measured before changed:** across this machine's last N compaction summaries (they're in the transcripts as the "This
   session is being continued…" user turns), count how many of the seat's own correction-adjacent sentences survive verbatim. The
   precompact-preserve header already cites a measurement of this kind ("file and instrument names 33.8%, commit shas 10.2% …"); reuse its
   method. Then add the directive line (carry verbatim the assistant's sentences that were answered with a correction or an agreement)
   and **register the bar before the next compactions:** it's kept if the next 3 compactions, on any seat, carry those sentences at least
   2× more often than the baseline.
3. **Item 2:** add the "what is alive for them right now" section to the directive, top-of-summary, for the Third Place at least (people
   before work). For build seats, the order stays task-first (their work is the work), unless the measurement says otherwise.
- **Abuse condition, registered:** if the summaries grow by more than 15% for no gain on the bar, the line is cut back.

NEXT: chair dispatch D245 item 3 to E (it's measured and small) when this plan is read; items 1–2 after
