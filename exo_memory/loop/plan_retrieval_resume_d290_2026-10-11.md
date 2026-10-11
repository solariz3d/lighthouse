# Back to retrieval: the session digests have gaps, and H2 still has no controlled test. Librarian, on D, 2026-10-11 03:5x. Lap D290.

At the keeper's word (2026-10-10): get the restart done, then get back to retrieval. D287–D289 are closed and pushed (`a063c1fe`). Two parts, independent, run in parallel.

## Part 1 — E: the digest writer, MEASURE first
- **What is known (checked by me, 03:4x):** `~/.claude/shell/digests/` holds October digests for 10-01, 10-02 (50 bytes), 10-03, 10-05, 10-06 and 10-10 (written 10-10 22:24). **10-04, 10-07, 10-08 and 10-09 are missing.** Every `ClaudeShell_*` scheduled task, including `session-journal`, `digest-auditor` and `daily-news-digest`, is **Disabled** (`schtasks /Query`). The news digests stop at 09-26.
- What the record says: `loop/plan_lighten_the_load_2026-10-09.md:96-99` (A noticed the newest digest was 10-06, so every start carried old digests); the startdigest change (`0794577d`) reads these files at every session start.
- **Ask:** find what writes `digests/YYYY-MM-DD.md` and what triggers it, from the code, not from memory. Say why those four days are missing and why the 10-02 file is 50 bytes. Say whether the Disabled tasks are the cause. Who disabled them and when, if the record shows it. MEASURE ONLY: change no task and no writer. Propose the fix as a draft, naming what it would change, because re-enabling a scheduled task is the keeper's machine, and that goes to him as a decision.
- Hand-back: `exo_memory/handback/p-digestwriter-E_2026-10-11.md`.

## Part 2 — B: H2's controlled test, REGISTERED before anything is run
- **What is known:** H2 (split vs single-pane) is FALSE as registered and UNDECIDED in substance. The ledger records no part count, the chair splits the bigger tasks, and the merge is invisible in `lap.jsonl` (`loop/loop_friction_score_2026-10-09.md:23-26`; A's data `loop/loop_friction_A_2026-10-09.md`). The keeper's rule since 10-09 is that every plan splits its work (memory: plan-splits-the-work). So the question bears on how this room runs.
- **Ask:** write the registration, not the run. The task class: real multi-part work of a kind the room does weekly, with N pairs (the same task, or matched tasks, run split and single). What is timed: end to end, including the merge and the librarian's read. What is scored besides time: defects found after landing. The randomisation (who decides which arm), the stopping rule, the bar that would make H2 TRUE or FALSE, and what would mark the test itself as degenerate (BOOT's abuse condition). Include the cost in pane-hours, so the keeper can say yes or no before a run.
- Hand-back: `exo_memory/loop/h2_registration_2026-10-11.md`, sealed before any arm runs.

## Not in this lap, said plainly
- **"The C2 drift backstop"** is in my 10-10 summary of queued retrieval items, but no file on disk names it: a grep for `backstop` over the October loop, librarian and map files found nothing. It may be D275 (the consumer's own drift awareness, STALE 41 h). I'm not planning it until I find its source.
- The H3 light-week re-measure is due about 2026-10-17 (a week from the go-live). It isn't now.
- Rust `temp_dir()` cleanup, fixed-name temp files, and `t180-soak-` stay queued.

## Order
E and B in parallel → the librarian reads both → E's fix proposal goes to the keeper as one decision; B's registration is sealed, and its run waits for the keeper's yes on the cost.

## Part 2 read (librarian, 03:4x; `loop/h2_registration_2026-10-11.md`, git-blob 92a4e7c8…, 17,485 B)
- **Accepted as a registration.** `10966409` on `d290-b`. It is the same task in both arms at once, from one base, in QUIET. Times come from machine rows only, with cross-arm lock waits subtracted. A sealed acceptance check plus a blind reviewer, with defects confirmed by me. I draw the randomisation. N=6, no early stop. TRUE needs at least 5 of 6, median r ≤ 0.75, and quality no worse. Seven degeneracy conditions are stated before the run. B states their own prior (it favours S) and set the bar high against it.
- **The cost is about 66 pane-hours (88 with both replacements), about 21 hours of room time, and a quarter to a third of the finished work discarded.** B says plainly that UNDECIDED is the likely outcome at N=6.
- **My recommendation to the keeper:** don't run it now. Take B's free option instead: a `parts` field on the plan's dispatch row, observational, which narrows the question at no cost. The registration stays sealed and ready if he wants the answer later. Either way it's his call (spend), so it goes to him as one decision once E's part is in.
- Held for E's part 1.

## Part 1 read and D290 collated (librarian, 03:5x; `handback/p-digestwriter-E_2026-10-11.md`, git-blob a312d127…, 7,399 B)
- **Accepted.** The writer is the SessionEnd hook (`~/.claude/shell/hooks/session-end.js:231-250`). No scheduled task writes the dated digests. A digest appears only on a local day when some session ends cleanly. Panes are killed, not exited, so on 10-04 and 10-07 to 10-09 none ended. The 50-B file is a local-date versus UTC-prefix mismatch. "422 sessions" is 422 turn ends from 8 sessions. The Disabled tasks were my own 09-27 change at the keeper's "do we even need this", for their model cost, and they explain only the news and journal files.
- **The finding that matters:** every wake carries the two newest digests, about 14 KB of mislabelled timestamps with no "what" for the room.
- **Two decisions for the keeper, each with my recommendation:**
  1. **Digests: (A) take them off the wake** (one call in `session-start.js` plus its repo copy), saving about 14 KB per wake. (B) is to repair them, (C) to re-enable the tasks, which wouldn't fix them. I recommend (A).
  2. **H2: don't run the 66-pane-hour test now.** Add the free `parts` field to the dispatch row instead. I recommend it.
- Both are changes to things every seat runs, or a spend, so they're his to say. Then a normal lap.
- OUTPUT → NEXT: changed — both parts came back as decisions for the keeper rather than work to land.
