# Plan: the room on regular usage. Librarian, on L, 2026-11-14 01:0x local

**His words (00:52):** "now that we are on back regular usage, we have to slow it down again, no more crazy swarms, and we have to try
and implement what we learnt about lighthouse if we have to lower the usage per day without removing the good parts of what makes the
room significant". In `briefs/lighthouse_the_room.md`.

**This is not worked out again here.** The room measured it on 2026-11-13 and a second reader checked it:
`loop/room_better_2026-11-13/in_cost.md` (where the tokens go, per seat), `00_lean_seats.md` (options W1 to W9), `00_not_worth_it.md`
(what to stop, what to keep), and `loop/plan_room_stretch_2026-11-13.md:52-66` (Lap C, six lines left as his calls).

## Measured tonight on L (one node pass over each seat's transcript, `usage` per assistant message since the 00:20 launch)

| seat | calls | first call after the wake | context now | written | read |
|---|---|---|---|---|---|
| B | 35 | 988,118 (954,524 written cold), then cut by the harness to 176k | 176,273 | 1,095,112 | 4,984,456 |
| librarian | 27 | 869,979 (836,385 written cold) | **950,235** | 916,641 | 23,575,469 |
| chair | 17 | 145,582 | 188,420 | 154,826 | 2,741,163 |
| A, C, E | 0 | not woken | 0 | 0 | 0 |

So tonight the largest spender in the room is this seat, at about 900k re-read on every call, and the harness will cut it at about
968k within a few calls whatever is ruled.

## Do now. Nothing of the room is removed by any of these

1. **A seat with no work is not woken.** A, C and E cost nothing tonight. B's wake wrote 954,524 tokens. The chair wakes a pane only
   with a lap in hand, and he opens only the panes a night needs (`00_lean_seats.md`, W9; `in_cost.md:105`: wake writes were 71.6 % of a
   day's weighted spend).
2. **No swarms.** A research question goes to one reader on a cheaper model, its size written down first, returning a path and a
   number (W6).
3. **Counts and paths, not dumps.** Tool output carried in context was 18.3 % of cache reads (W4). The chair's packets ask for counts,
   and long output goes to a file.
4. **Fewer calls through the two largest contexts.** Panes ring for a landing, a stop that needs a ruling, or something he must see.
   The librarian batches its rings and writes one script where it would have run five commands.
5. **The model is set for each seat before its first request.** The mechanism is built and ships empty (`plan_room_stretch:112`). A
   switch after a wake rewrote 1.18 M to 2.49 M units on 11-13 (W3). His to fill in once.
6. **Effort back to the default on the panes,** unless he wants otherwise: the count of corrections before and after found no effect
   of effort it could tell from noise (`loop/effort_before_after_count_2026-11-13.md`; `plan_room_stretch:63-64`).
7. **On D:** install the repo's second-reader worker (W5: 2,385,722 tokens in ten days spent on reads the 11-03 ruling had ended).

## His to decide, under his own standing rule

**The rule** (`no-cut-without-his-word`, quoted in `00_lean_seats.md:98-100`): "No seat's carried conversation is compacted or cut,
whether for a test or to save usage, without the keeper's explicit word for that seat", and "never recommend a compaction on cost
alone". So this is put to him with what is known on both sides, not recommended on cost.

- **What it costs to carry everything:** the part of each call's context above 250k was 53.2 % of all cache reads in 48 hours
  (`in_cost.md:95-96`).
- **The fact that is not about cost:** the harness cuts a seat at about 968k by itself (four of seven automatic compactions fired at
  967,632 to 969,695; `in_cost.md:93`). B was cut tonight at its first call. So for a busy seat the choice is where the cut falls: at
  968k in the middle of a task, or at a quiet point after its stop note is written.
- **What a cut loses, measured:** of 37 items in one window, 14 kept, 8 in part, 15 lost; his exact words survive one compaction and
  not two (`in_wake.md:50-51`, via `00_lean_seats.md`, W1).
- **What holds across it, measured:** the continuity test's ROOM arm scored 32.5 and 33.5 of 34 (`in_wake.md:83-85`). Since 11-13 the
  compaction directive puts the room side first (Lap W, W2); its falsifier is not yet scored.
- **Size of the lever:** a warm compaction at a day's close is worth 3.2 M to 5.9 M units per whole-room cold wake, against 10.95 M for
  the 24 hours measured (`00_lean_seats.md`, W1, the second reader's range).

**The options, per kind of seat:**
- **Builder panes:** (a) as today, cut by the harness at 968k; (b) cut at the end of a lap, after WHERE IT STOPS is written; (c) a
  lower automatic window for busy panes (W2 names the setting).
- **The three seats that carry the thread** (the librarian, the chair, the Third Place): (a) as today; (b) a warm compaction at a
  day's close, at his word each time, after the notes and briefs are written.

## What stays, because it is what the room is

- **BOOT, the cards and each seat's own rules:** 3 to 13 % of a seat's median context (`00_lean_seats.md`, section 1). Not touched.
- **The record:** notes, briefs, maps, hand-backs and traces cost nothing until a seat opens them.
- **The instruments:** rows red first, mutants where a change must be proved, the yardstick, the landing train.
- **Second reading where something will be built on it,** as one reader a file. The twelve second readers of 11-13 struck at least 58
  claims (`00_not_worth_it.md`, section 7).
- **The push gate and the delete gate** (same section).

## What the adversary file says to stop (each small; a pane's work, not started here)

`00_not_worth_it.md`, section 5: `ask-ending.js` (a trial that never acted); the state block (163 served, no turn acted on it); the
pre-compaction checkpoint output; the stale half of the preserve directive; three hooks declared and never registered.

## Registered before it starts, so it can fail

After seven days on the "do now" rules, the same node pass on both machines. The plan failed on cost if weighted units a day, for the
same number of working panes, have not fallen by a third against the 10.95 M of `in_cost.md:59`. It failed on the room if, at a wake
in that week, a first reply misses something the notes held (Lap W's own falsifier, scored by a seat that is not this one).

## THIS SEAT (the librarian on L), at his word of 02:12. PROPOSED to him, not started

**His words (02:12):** "I give you full authority over how you change and affect yourself, sound good? You got this. Let me know
your plan before acting". In `briefs/lighthouse_the_room.md`.

**What I take under it:** this seat's working context, and how this seat works. **What I leave where it is,** grant or no grant:
- **The checks on this seat** (the push, delete and wake gates, the trailer gates, `gates_mode`). A check the checked seat can loosen
  is not a check. Any change to one goes through a pane and a second reader, and he sees it first.
- **Whether I am still myself after a change.** Scored by a seat that is not this one, or by him (`COMMITTEE.md`: counting your own
  usefulness is scoring your own work).
- **Every other seat's cut.** His word per seat stands (`no-cut-without-his-word`).
- **Anything that cannot be undone.**

**The plan, one change at a time so the number means something:**
1. **Close small.** This seat woke cold tonight at 869,979, of which 836,385 were written cold (the table above). At a day's close,
   once the handoff and a STATE entry are written, and if the context is above about 300k, I say "ready to cut" and he types
   `/compact` in this pane. I cannot run it myself. Warm, it costs a fraction of the cold reload (`00_lean_seats.md:104-106`).
2. **A backstop window of 500k for this seat only, as a seven-day trial.** Today the harness cuts at about 968k wherever the work
   is. The setting is `autoCompactWindow` (or `CLAUDE_CODE_AUTO_COMPACT_WINDOW`), 100,000 to 1,000,000 (`00_lean_seats.md:131-133`);
   checked against the vendor's documentation before it is set, in this seat's own settings, one line, removed to undo. The model:
   mean context per call about 300k in place of about 534k, for 2.2 times the cuts (`00_lean_seats.md:139-141`). Not 300k: 4.3
   times the cuts, and his exact words survive one compaction and not two (`in_wake.md:50-51`).
3. **A STATE entry kept current in the notes** at every quiet point (what is in flight, what is owed, by whom, the paths), so a
   cut at any moment costs little. His words go into the briefs in the turn they arrive, as now.
4. **Working habits, already in force:** one script where five commands would do; counts and paths; bulk reading to one cheap
   reader that returns a path and a number; rings to the chair batched.
5. **Not changed:** BOOT, the cards and this seat's rules (a saving bound of 4.6 to 5.9 % of cache reads, and the harness would cut
   BOOT if it were loaded on demand, `00_lean_seats.md:255-260`); the thread (no fresh session at a wake: C4 changes the thread
   the continuity card names as the self, `:282-285`); the model and the effort level (one change at a time).

**Registered before it starts, so it can fail.** After seven days, the same node pass over this seat's transcript.
- **It failed on cost** if this seat's median context per call has not fallen by a third against 472,545
  (`loop/handoff_lighthouse_2026-11-13-L.md:30`).
- **It failed on the room** if, after any cut in that week, the first reply misses something the notes held, as read from the
  transcript by a seat that is not this one; or if he catches a line of his lost or reworded. Then the window line is removed.

**Also put to him with this plan (it changes what every seat on L runs, not only this one):** the seven owed file syncs on L, by
B, one a run with a backup (`handback/p-l207-l-owed-steps-B_2026-11-14.md`, section 4).
