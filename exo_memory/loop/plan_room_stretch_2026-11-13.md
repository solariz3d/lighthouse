# Plan: the room stretch on D, 2026-11-13. The order, collated from the room-better swarm

Librarian, on D, 09:5x local. For him to say yes or no to, part by part. Nothing here is dispatched yet except where it says so.

**His words that set it** (`briefs/lighthouse_the_room.md`): 07:12 on L, "continued work on lighthouse/consonance on the desktop
when we get home"; 09:36 on D, "really make sure you attack the right and most needed vector".

**What it is collated from** (all in `loop/room_better_2026-11-13/` unless named):
- twelve reader files, each with a second reader; `00_critic.md` (read whole by me);
- `00_build_paths.md`, `00_lean_seats.md`, `00_not_worth_it.md`, each now with a second reader's corrections struck in place
  (119, 21 and 61 lines checked; 6, 3 and 6 wrong);
- `in_wake.md` and `out_memory_at_wake.md`, read whole by me;
- `loop/hooks_drift_D_2026-11-13.md`; `loop/effort_before_after_count_2026-11-13.md`;
- the room-work list in `loop/handoff_lighthouse_2026-11-13-L.md`.

## The swarm's registered falsifier, scored by me (`loop/plan_room_better_swarm_2026-11-13.md`, "Registered before it runs")

- "names no fault that is not already in the L handoff": **did not fire.** Checked by me at the primary: the shelf was built
  before the pull (`stat` of this seat's `CLAUDE.md`: 08:42:42; `git reflog`: the pull at 08:43:40; 0 hits for a HEAD stamp);
  the notes cap is 24,000 bytes (`main.rs:8928`). Re-derived by a second reader, not by me: the cold wake's share of spend, and
  idle compaction meeting the keep-warm minute. None of these is in the L handoff.
- "names no mechanism to remove": **did not fire, weakly.** After its second reader, one item stands (D's stale second-reader
  copy, and that is a sync). Its strongest call, removing `stop.js`, was wrong: three live hooks read what it writes.

## The vector: the wake (the first minute after a seat starts, resumes or compacts)

Why this one: `librarian/2026-11-13.md`, the 09:4x entry "THE VECTOR". In short: the shelf was a machine-shift stale; busy days
never fit the cap; a resume carries no state; every compaction summary ends "pick up the last task"; the record answers when a
seat looks (about 33 of 34 on 11-03) and the worst arm never opened a file; three wakes in three days were turned only by his
question. On cost, a second reader's re-derivation: the cold wake alone was 46.4 % of the last day's weighted spend, 69.1 % with
the model switch (an assumption about relative price, not the plan's accounting).

## Lap W, the wake. PARKED AT HIS WORD since 11-12; needs his word to start

| part | what | where | proving check, red on a recorded case first |
|---|---|---|---|
| W1 | The shelf is built after the pull; it carries a line with the HEAD it was built from and how far origin is ahead. The seat's newest note's first screen and one pinned file come ahead of the 24,000-byte cap | `consonance/src-tauri/src/main.rs` (`corpus_shelf`, `:8928-8993`); the launch path | today's case: intake 08:42:42, pull 08:43:40; a 65,000-byte note is named and not carried |
| W2 | The compaction directive gains the room-side class (the 11-12 plan's (a)): his words about the room or the seat, letters, catches about the seat, open questions, each with its path. Its two stale lines are corrected | `consonance/hooks/precompact-preserve.js` (`:111-113`, `:131`) | `grep -c 'any of the five above'` is 1 today |
| W3 | A body line at every start, resume included: machine, model, effort if it can be read, context size, HEAD, the shelf's age. One line, not the 3,000-character state block (whose worth is unproven either way) | `consonance/hooks/sessionstart-state.js` or the shelf's header | a resume today prints none (136 resume rows skipped since 11-01) |
| W4 | A gate: a seat's first dispatch after a wake is refused until it has opened its own newest note and the other machine's newest handoff. Cues have failed here (K2); gates have held (the NEXT trailer) | a PreToolUse hook on `call_chair`, reading the session's own tool calls | this morning's transcript: a dispatch at 14:46Z with neither file opened |
| W5 | Why no pull ran at this morning's launch: find the launch path used, then fix it or make it say so | `consonance/launch.ps1` (the pull block), the four paths it names as not covered | 307 commits behind at 08:43 |

- **Its falsifier is already registered** (`loop/plan_retrieval_at_the_wake_2026-11-12.md:49-52`): after it ships, the first reply
  to an open, non-work question after each of the next two wakes is read from the transcript. If either names nothing of the room
  beyond the handoff without a further prompt, it failed as an input change.
- **Rebuild and restart:** W1 is Rust, so it needs one rebuild of Consonance and one restart. The app's code has not changed since
  the 11-08 build, so nothing else rides on that restart yet. Before it: count queued messages with no delivery row, and check no
  lock is held (`00_critic.md`, check 2).
- **Proposed panes** (his word first): W2, W3, W4 to P after its mutant run (hooks and node tests, no build lock); W1 and W5 to B,
  which built the room's tools on L, between its kit builds.

## Lap C, what the wake costs. Each line is his call

1. **The model is chosen before a seat's first request**, not after it wakes. Today's switch of two seats rewrote their contexts
   (1.18 M to 2.49 M units, depending on which model was meant).
2. **Idle compaction against his no-cut word.** The harness compacts a seat about 55 minutes after its last call; 29 of 40
   compactions since 11-03 were idle ones. Either every seat's keep-warm ping moves before minute 54, or idle compaction is turned
   off in settings, or he rules that the default stands.
3. **Keep-warm woke a seat idle for nine and a half days** (one reply, 642,636 tokens written). The skip rule is fixed.
4. **A warm compaction at the close of a day, or a fresh seat from its handoff,** instead of resuming 500k to 930k cold. Per seat,
   at his word only (`memory no-cut-without-his-word`).
5. **D's second-reader hook** is the 10-01 copy. Syncing it applies this seat's ruling of 11-03 (pane rings are no longer second
   read), which saves about 2.4 M tokens per ten days on D and stops 237 reads that flagged 116. His veto was left open then.
6. **His 09:02 lean, xhigh for the librarian, the chair and the Third Place.** The owed count found no effect of effort on the
   panes that it could tell from noise, and no clean case exists for the three. If he keeps it, it is pinned where a restart keeps it.

## Lap D, delivery and stalls. Second

1. **The idle-holder guard** (`origin/l202-idle-guard` 901d3c39): P is running its 73 unrun mutants now. Landing it is a separate
   word, because it goes live for every seat.
2. **A stop order that outranks the queue.** New today, in no swarm file: the hold rung at 14:51Z reached E after 21 minutes and C
   after 30, each after the work it was meant to pause (`librarian/2026-11-13.md`, the two delivery traces).
3. **The API-error class.** `00_build_paths.md` section 1, steps 1 and 2, are not buildable as written (its second reader: the
   fixture covers neither recorded case). What is on disk already: fix 2c (landed, not installed) and
   `loop/api_error_watch_2026-11-13.js`. A `StopFailure` hook is tested with one forced error before anything rests on it.
4. Later, each with its section in `00_build_paths.md`: an owner for starting the train (2); the memory gate's message that hides
   its cause (5, `landing-train.js:194`); the collator waiting on a ring (3).

## Hygiene, small

- **Eight hook syncs on D that change nothing D does** (`loop/hooks_drift_D_2026-11-13.md`, section (c)), one entry at a time,
  `-Only` with `-NoRegister` where the entry is not registered (the 09-19 precedent), `settings.json`'s sha equal before and after.
- **`stop.js` stays.** The three ABSENT hooks are not installed.

## Not building (from `00_not_worth_it.md`, after its second reader)

A priority queue on the lock; a second train on D; dead-letter counts; idempotency keys. No recorded cost stands behind them.

## Amendment, 10:4x (librarian): Lap D item 1 is not ready

P ran the guard's 73 unrun mutants on D (73 of 73 caught; 101 of 101 rows) and in that same run the guard named two working holders
idle, with negative CPU figures, and posted both lines to the board (`handback/p-l202-check-P_2026-11-13.md`, section 4). A child
that used CPU and exited leaves the sum (`heavy-run.js:442`, `:358-362`). 901d3c39 does not land. The fix is P's, red first on
that case; another pane lands it.
