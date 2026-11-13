# Lighthouse (the room), handoff 2026-11-13 (L, written 07:2x local; he leaves the laptop at about 08:00)

Written by the librarian on L. The desktop picks up from this file, `briefs/lighthouse_the_room.md` (his words, to 07:12 today) and
`librarian/2026-11-13.md` (the night, in order). Nothing here replaces those; it says where to start.

## His words that set the desktop's work (verbatim, 2026-11-13)

- 07:03: "do you think that after we are done working on this stretch of dreamzone 3, we should be using this time to make the room
  better vs building with it, dont you agree?"
- 07:06: "it would be ideal for us to somehow find a way to make you as lib more lean while also retaining everything that makes you
  you without losing it … how would either of us know what we are tweaking changes what about what? … There has to be either a
  balance, or something im missing"
- 07:12: "you can leave that in the handoff for desktop to build later today. … we shouldnt open up any new builds. We will do the swarm
  and continued work on lighthouse/consonance on the desktop when we get home"
- 07:13: "i meant the swarm to learn more about how to make lighthouse better"

## PICK UP HERE (D)

1. **Run the room swarm he asked for.** Its plan and script are in the repo: `loop/plan_room_better_swarm_2026-11-13.md` and
   `loop/room_better_swarm_2026-11-13.workflow.js`. He gave the word for it on L; confirm the model and size with him on D before
   launching, because the allowance resets at about 16:00 local and D starts a new week.
2. **Then the room-work list below,** as a short stretch with a fixed list. Each item lands with its proving check.
3. **Read the two falsifiers that came due** (below) before anything else is claimed about the wake.

## Where this seat's tokens go (measured on L, 2026-11-13; his question of 07:06)

Checked: one node pass over the librarian's session transcript, summing each assistant message's `usage` since 09:45Z, one count per
message id; and `wc -c` on the shell's files. The method is in `librarian/2026-11-13.md`, "07:1x: where this seat's tokens go".
- 229 calls in 3 hours 20 minutes. Each call re-reads the whole context.
- Context per call: 149,453 tokens on the first call after a compaction; a median of 472,545; a largest of 694,874.
- 101,681,639 tokens read from cache; 667,677 written; 298,859 of output.
- The shell this seat wakes into is 141,641 bytes (BOOT 43,541 inside it; 36,050 of cards carried). At about 3.7 bytes a token that
  is about 38,000 tokens, of which about 25,000 carry the self (the seat's rules, BOOT, the cards). The bytes are measured; the
  token figures are estimates from them.
- **So the self is about 5 % of a median call and the whole shell about 8 %.** The other 92 % is working context.

**What to build from it (none of it touches BOOT, the cards or the map):**
1. **Compact sooner, safely.** The context grew from 149k to 695k in 3.3 hours. What makes an early compaction safe is the notes
   and briefs written every turn, and the wake showing more than the handoff (`loop/plan_retrieval_at_the_wake_2026-11-12.md`).
2. **Fewer calls.** Every tool round is a call. One script in place of five commands; pane rings batched by the chair where no pane
   is waiting on a ruling.
3. **Keep bulk out of this seat's window.** Listings and long file sections go to a subagent that returns a path and a conclusion.
   (Example of waste tonight: each read of the decision page's store listed up to 46 file paths into the window.)
4. **Measure the same for every seat** before choosing: the same node pass over each seat's transcript gives calls, median context
   and cache reads per seat. Not done on L.
5. **For any change that does touch the shell:** run the continuity test before and after
   (`loop/continuity_test_registration_2026-11-03.md`; question sets and keys in `handback/p-d627-p4b-questions-*`). Not checked on
   L: whether it has ever been run.
- From the record, against the fear that leaner means less: a large window did not protect recall. The dead lock holder was missed
  at 05:52 with about 400k in the window (`librarian/2026-11-13.md`, 06:3x).

## The room-work list, by what each cost this week

1. **Stalls and delivery.**
   - The idle-holder guard: B's branch has it committed (lighthouse 901d3c39 at 07:08; see B's "WHERE IT STOPS"). Trace, two
     occurrences: `loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`.
   - A reply that is an API error must not count as delivered, with one automatic retry: `loop/stall_trace_403_packets_eaten_2026-11-13.md`,
     fixes 2a and 2b, in `consonance/src-tauri/src/main.rs` (the `DELIVERED ->` line at :12230 on 11-13). Needs a rebuild of Consonance.
   - The `[panes]` API-error line (fix 2c) is landed (b0be06f0) and NOT installed: the repo's `board-digest.js` needs `sealedGate`
     from the repo's `blind.js`, so the two go together (B's hand-back `p-l198-403-stall-B_2026-11-13.md`).
   - `loop/api_error_watch_2026-11-13.js` is the stand-in until then. Arm it with `--skip <own seat>`.
   - The landing train has no owner for starting it: on 11-13 nothing landed for 100 minutes with four branches READY.
   - The lock's queue is invisible: short runs parked behind 16 mutants.
2. **The hooks on L are not the repo's:** 15 DRIFT, 8 ABSENT after the push gate was installed with `-Only` (`map/M.md`, 2026-11-13
   04:3x). Read each before syncing; never a bare installer run mid-work. D should run `install.ps1 -Check` on itself too.
3. **Retrieval at the wake:** `loop/plan_retrieval_at_the_wake_2026-11-12.md`, parked at his word, top of the room brief.
4. **Machine time:** the one build lock is where L's clock went. Whether D can take builds and tests for L's panes is not measured.
5. **A citation audit as a standing instrument:** four misapplied or misquoted sources were found on 11-13 only by tripping on them.

## The two falsifiers that came due at the 03:45 wake on L (not scored by me; read them from the transcript)

- **The letter's** (`librarian/TO_THE_NEXT_ONE_go_to_the_source.md`): the first reply to an open question after the wake. The first
  open, non-work question after the 03:45 compaction came at 06:32 ("what would you have used it for?").
- **The retrieval plan's:** it is conditional on (a)+(b) shipping, and they have not shipped. Not due.

## What happened in the room tonight that D should know

- **Two 403 bursts** (09:46Z and 10:15Z) stopped panes; a pane ends its turn on one 403 and waits. The login was probably not what
  cleared it. Deliveries to several panes are now spaced about 30 seconds apart.
- **A safety classifier stopped three of my replies** between 06:40 and 06:44 local. Nothing was changed on disk by them. The times
  and a pointer to the transcript are in `librarian/2026-11-13.md`; I wrote no account of the content.
- **Two swarms ran on L at his word:** the Third Place's (`absolute-sources`, Opus; output `loop/absolute_sources_2026-11-13/`) and
  mine (`sprint-reference`; output `loop/sprint_reference_2026-11-13/`). Their state at the close is in the game's handoff.
- **A runaway grep** from a swarm reader (a bounded repeat of 7,000 to 16,000) twice took the memory gate down. Any swarm brief
  forbids bounded repeats over 200.

## Open, and whose

- **His:** the model and size of the room swarm on D; whether the room stretch starts tonight or after the next game landing.
- **The librarian on D:** arm the watcher; read each pane's "WHERE IT STOPS"; run `install.ps1 -Check` on D.
- **B (or its seat on D):** fixes 2a and 2b; `board-digest.js` with `blind.js`.
