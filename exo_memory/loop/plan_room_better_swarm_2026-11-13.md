# Plan: a swarm to learn how to make the room better. Librarian, on L, 2026-11-13 07:3x local, for the desktop to run

**His words (07:12 and 07:13):** "We will do the swarm and continued work on lighthouse/consonance on the desktop when we get home";
"i meant the swarm to learn more about how to make lighthouse better". In `briefs/lighthouse_the_room.md`.
**Status:** written and parse-checked on L. NOT run. The desktop launches it at his word there.
**Script:** `loop/room_better_swarm_2026-11-13.workflow.js`. Launch from the repository root with the Workflow tool, `scriptPath` set to
it, and `args` set to `{"model":"opus"}` or `{"model":"sonnet"}`.

## What it does (28 agents)

| phase | agents | what |
|---|---|---|
| Inside | 7 | one reader per area of the room's own record: stalls, delivery, hooks, the wake, cost, the lock, promises not kept |
| Outside | 5 | one reader per problem: memory at the wake, reliable delivery, merge queues, prompt regression tests, multi-agent cost |
| Second reader | 12 | one adversarial reader per file; corrections struck in place |
| Apply | 3 | build paths by recorded cost; lean seats; the adversary's file (what is not worth doing) |
| Critic | 1 | what is unread, thin or contradicted, and what the swarm got wrong |

Output: `loop/room_better_2026-11-13/` (twelve reader files, `00_build_paths.md`, `00_lean_seats.md`, `00_not_worth_it.md`,
`00_critic.md`).

## Why this shape (from the night of 11-13)

- **Inside before outside.** Most of the time lost on 11-13 went to faults whose lasting fix was already written and never built
  (`loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`). The first thing to learn is what the room already knows and did not do.
- **Every file gets a second reader.** The first swarm's second readers marked 82 lines wrong (`loop/buildpaths_INDEX_2026-11-13.md`,
  section 6).
- **One file argues against.** A room that only works on itself grows documents (BOOT, the falsifier under the curated auditor).
- **Lean seats is its own file,** split into changes to working context and changes to the documents that carry a seat's
  character. The measurement behind it: `loop/handoff_lighthouse_2026-11-13-L.md`, "Where this seat's tokens go".

## His calls before it runs (D)

1. **The model.** Opus read more carefully on 11-13; it costs more. The desktop starts a new week at about 16:00 local.
2. **The size.** 28 agents as written. The Inside and Second reader phases can be cut to the four costliest areas (stalls,
   delivery, wake, cost) for about half.

## What the librarian on D does with it

- Spot-check a sample of its [read] marks against the files, as on 11-13.
- Collate `00_build_paths.md` against the room-work list in the handoff, and put the order to him.
- **Registered before it runs, so it can fail:** the swarm did nothing if `00_build_paths.md` names no fault that is not already in
  `loop/handoff_lighthouse_2026-11-13-L.md`, and `00_not_worth_it.md` names no mechanism to remove.

## Rules written into its brief from tonight's failures

- No bounded repeat over 200 in grep (two runaway greps took the memory gate down on L).
- A summarising web fetch is never marked read.
- Outside searches never carry the room's name, his name or his words.
- The cost reader prints numbers only and never transcript text.
