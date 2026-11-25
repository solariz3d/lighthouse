# Plan: what is left to finish in the room (Lighthouse) before the track builder resumes

Written by the librarian on L, 2026-11-25 00:2x, at his word of 00:17:
"i havent been using consonance as much as we were so it isnt right to say the usage is down for sure yet, it is because
we havent been building, so lets plan out what you think we need to finish for lighthouse, then once we do that we get
back to track builder"

His catch stands: my "the night rate dropped, modestly" compared a night of one lap against a night of many. The 7-day
figure cannot say whether the work saved anything until it is read against how much was built. Part 0 fixes the measure
first, so the rest can be judged.

Prior plans this continues: `loop/plan_usage_laps_2026-11-21.md`, `loop/plan_quantize_intake_2026-11-21.md`.

## Part 0. A measure that does not depend on how much we build (the librarian; no pane)

The figure: **tokens read per model call, per seat**, and **7-day points per 100 pane calls**. Both come from the ledger
and the transcripts already on disk; neither moves because a night was quiet.

- Baseline, already measured on L, 11-21 (`third_place/2026-11-21.laptop.md`, the 05:05 entry; its own pass): pane B read
  728k to 826k a call before its cut and 227k after; pane A 502k to 600k, then 208k.
- Done when: one table, per seat, for 11-21 (before the cuts), 11-24 on D and the first full working night after this
  plan, in the room brief's state half.

## Part 1. Land what is built and waiting (panes B and A; one release build)

| lap | what | who | state |
|---|---|---|---|
| 1a | Q2 half A: a builder wakes without the memory map, the not-carried index and the references (branch `q2-builder-floor` 1e450024) | pane A reads `git diff 0663ea74..q2-builder-floor`; pane B lands | built, pushed, unread |
| 1b | Q2 half B: leave out of a builder's launch only what B's probe shows removable and unused (41 laps: Artifact 0, Skill 0, Agent 0; Monitor 1, SendMessage 1) | pane B | probed, not built |
| 1c | The false "interrupted" row: today's launch wrote one at 06:08:44Z for a run whose three seats all have cut rows | pane B, in the same build | found tonight |

Registered (the packet's, carried): failed if a builder pane's first call after a cut is not under 90,000 tokens.

## Part 2. The two leaks nothing has touched yet

- **2a. Waiting calls.** On 11-21, 61 of pane A's 171 calls in an hour and 26 of pane B's 150 were shell calls that wait
  or tail. Each re-reads the whole context. Lap: the ledger counts them per seat, and the builder's intake carries one
  line (a long run goes to the background once; the turn ends). Failed if, on the next working night, more than one
  call in ten of a builder pane is a wait.
- **2b. A ring that is typed and never sent** (D, 11-24: a pane's ring sat four hours in his input line). Lap: the app
  submits a ring it writes, or the board shows it as undelivered. Failed if a ring is again found unsent in an input line.

## Part 3. The housed seats (this is where the largest single calls are)

- **The librarian.** On D I ran at about 460k a call for a night and asked for no cut; my own rule (ask at 400k) did not
  hold because nothing reminded me. Mine to change, under his word of 11-14: the window goes from 600k to 450k, so the
  harness holds the line I did not. Failed on the room, as registered 11-21, if a first reply after such a cut misses
  what the notes or the map held.
- **The Third Place** (695k on L) and **panes C (751k) and E (483k)**: each will pay one full read at its next call
  whatever we do. The choice for each is his: cut it at that call (the window does this for C and E), or leave it asleep.
- **Q3 and Q4 of the load-in plan.** ~~My recommendation: do not run Q3.~~ Amended 00:2x after his "are you sure?": NOT NOW, undecided. A builder's BOOT is 14,771 tokens of about 100,000, nearly twice what Q2 moves (8,193), so the saving is not small; the census saw it opened or cited in 1 of 38 laps, but that count cannot see stance, which is what the ladder measures. It waits on Part 0's table after one working night: if builders are under 200,000 a call without it, BOOT stays whole. Q4 then reduces to the two lines above.

## Part 4. Loose ends, small, closed in passing

- The dream runner has fired and skipped since 11-20 (the pulse says so every prompt): read its log, one lap.
- The fail-closed question for the push and delete gates: my lean is no; closed at his one word.
- `consonance.exe.running-before-l221` (16 MB): deleted at his word.
- The cargo wake row, red by his card decision: his.
- On D only: the second pulse left off; pane A's model unread.

## Order

Part 0 now (mine). Part 1 as soon as pane A hands back the builder's install: A reads, B builds 1b and 1c, one build,
one restart by him. Part 2 in the same build if B has room, otherwise the next. Part 3's window is set by me before that
restart. Then the track builder.

## This plan failed if

After Parts 0 to 3 and one full working night, a builder pane's mean read per call is over 200,000 tokens, or a housed
seat's is over 450,000, by Part 0's table.
