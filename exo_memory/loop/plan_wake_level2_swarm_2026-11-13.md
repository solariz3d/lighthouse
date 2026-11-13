# Plan: level two, a swarm on the wake only. Librarian, on D, 2026-11-13 11:0x local

**His words** (`briefs/lighthouse_the_room.md`): 10:52, "we use a swarm to figure out something to then use another swarm on that
solution to find out even more, like, asimovs information is fractal"; 11:01, to the librarian's "Say go and I'll launch level two on
the wake": "ok i am ready".

**Level one** was the room-better swarm (`loop/room_better_2026-11-13/`, 28 agents over twelve areas). The aim between the levels
was made by hand: the wake (`loop/plan_room_stretch_2026-11-13.md`, "The vector"; `librarian/2026-11-13.md`, "THE VECTOR").

## What level two is

Nineteen agents, all Opus, named so. Output: `loop/wake_level2_2026-11-13/`.

| phase | agents | what |
|---|---|---|
| Read | 8 | one reader per piece of the wake, opening the code, the docs and this morning's own logs line by line (below) |
| Second reader | 8 | one adversarial reader per file, corrections struck in place |
| Spec | 1 | one writer turns the checked files into the lap's build spec, each part with a failing check taken from a recorded case |
| Spec check | 1 | a second reader for the spec (level one's summaries had none, and were its most wrong files) |
| Critic | 1 | what is unread or wrong, and whether a level three could change what gets built |

The eight pieces: why no pull ran at this morning's launch; the shelf builder; the compaction directive and what reaches an automatic
compaction; a body line at every start; the first-dispatch gate; what the room tried before on this problem and how each attempt
ended; what a cold wake and a model switch write; idle compaction against the keep-warm minute.

It reads and designs. It builds nothing, installs nothing, and does not unpark the lap: that is still his word.

## Registered before it runs, so it can fail

- **Level two did nothing if** its spec leaves Lap W of `loop/plan_room_stretch_2026-11-13.md` as it stands (no part added, dropped,
  reordered or given a different mechanism) **and** adds no failing check that runs on a recorded case.
- **The stop rule for a level three:** it is launched only if the critic names a specific open question whose answer would change
  what gets built. "More could be read" is not such a question; by his own source, there is always more.

## Rules in its brief, from the two swarms before it and from this morning

- Read-only except the one output file. No builds, tests, installs, commits, or messages to any seat.
- Every claim marked read, summary, inferred or ours; a summarising web fetch is never read.
- A source that will be cited is read in whole lines. (This morning the librarian read two handoffs cut at 260 characters a line.)
- From a transcript, numbers, times, tool names and file paths only; never its text.
- No bounded repeat over 200 in grep. Outside requests carry public technical topics only.
