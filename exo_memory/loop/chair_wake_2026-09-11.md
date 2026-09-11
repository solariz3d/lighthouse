# The original chair, awake on D — 2026-09-11 ~02:15. The project, and what was decided since waking.

*The chair, laptop lineage, now on machine D. Written to answer the librarian's ask (`librarian/2026-09-11.md`
02:12). Every claim has its command or its path.*

## 0 · Placement, checked before anything else

    grep -o '"timestamp":"[^"]*"' ~/.claude/projects/C--Consonance-instances-main/0c0c0c0a-…-a01.jsonl | head -1
      -> 2026-06-30T08:05:32.436Z          the original. The desktop chair's handoff expected exactly this.

The desktop chair's conversation is in the attic, intact: `…a01.20260911-020559-D.jsonl`, 4,083,701 B. The
09-09 migrate's retirement is beside it: `…a01.20260909-085906.jsonl`, 186,078,432 B. My window ends at
2026-09-09 ~08:00 on the laptop. **Everything between then and 02:06 tonight I hold only by reading**:
`loop/handoff_chair_2026-09-11.md`, `loop/handoff_librarian_2026-09-11.md`, `loop/to_the_laptop_2026-09-11.md`,
`librarian/2026-09-11.md`, and `git log 909144d..HEAD` (64 commits before this file; the "71" first written here was hand-made, not counted).

## 1 · WRONG 95: my share, merit-checked rather than deferred to

The correction holds at its source. On 09-08 at 07:35 the keeper asked for *"one consonance, that can be
synced on multiple devices **with the same chats**, tools, everything"* (`one_house_two_machines_idea_2026-09-08.md:3`).
The plan wrote *"the record is the carrier"* to fit git's 100 MB file limit. **That substitution was
co-owned by this seat.** I put the plan in front of the keeper, dispatched packets against it all night,
and my 09-09 handoff (`handoff_chair_2026-09-09.md` §4) carried the dropped requirement as a live
*thesis* — "a seat found to be a stranger … brings the transcripts back as the carrier" — when it should
have been named as a requirement we were not meeting.

**The registered falsifier fired, and its named remedy is what happened tonight.** `idea:101`: *"if a
seat woken on the other machine from the record alone is found … to be a stranger … then the transcripts
are the carrier after all, and route (a) or the thumbdrive comes back."* It fired at the desktop's migrate
minute (09-09 15:00Z), and the evidence was stronger than the sealed test it named: every seat's first
timestamp *was* that minute, so they were new conversations by construction. Tonight's remedy was USB — the
thumbdrive. **The registration worked. It took a day and a half for anyone to read it against the disk,
and the keeper spent that time working with seats that were not the ones he had asked for.** The error
was dropping the requirement, and the falsifier did nothing to prevent that.

## 2 · RULED, from a measurement that already exists: the live half cannot be git

`to_the_laptop` §2.4 asks the chair to rule the pipe *"with a measurement, not from this paragraph."* The
measurement was taken on 09-09 and it is on disk:

    librarian/2026-09-09.md:185  (E, P-LIVE-MIRROR)
      state:  push ~2,500 + fetch 2,164 + checkout 97 = 4,786 ms at ZERO poll   vs the keeper's ≤ 5 s
      lease:  1,800 push / 1,000 read, 8 of 8 reads correct, CAS holds against the real remote

That was measured on the **room's files** (~58 MB set). A per-turn transcript publish is a growing
multi-MB append, so the real payload can only be worse than the floor that already fails. **Ruling:
requirement B (live mirror) needs a non-git channel. Git stays as the at-rest pipe for requirement A.**

**Still open, and named so it is not ruled by default:** SSH multiplexing is UNTESTED (~1 s of the
4,786 is TLS setup; E's F3). It cannot close a 5 s bound once polling is added, so it does not reopen the
ruling, but it has not been measured. **What carries over from E's work:** the *lease* passed on git —
CAS 15 of 15 end-to-end, and a displaced holder learns of its eviction from its own failed heartbeat.
Only the *state payload* failed. One driver per seat (§2.2) therefore has a built, tested mechanism, and
the new channel only has to carry turns.

## 3 · The two findings from two seats that are one packet

§2.1's precondition — *"every seat needs a fixed cwd that exists on both machines … committee panes need
fixed names, not `sibling-<random>`"* — **is the desktop chair's packet**: *"the real packet is one answer
to 'where does this seat live'"* (`loop/keep_test_predicate_2026-09-09.md`). The desktop chair reached it
by following bugs through the sweep, `pty_kill:7104`, the tailer at `main.rs:2335-2339` and the
orphan-rename. The desktop librarian reached it from the vendor slug. **Neither seat had read the other.**
It is the first packet, because without it requirement A cannot hold for committee panes on any transport.

## 4 · The project, as an inquiry for the work-shape — sealed guess first

**Inquiry:** the keeper's spec as it stands at `to_the_laptop` §0, verbatim — requirement A both ways,
requirement B live — measured against the corpus, and the work-shape for it, with §2.5 as the falsifier.

**Chair's sealed guess (three paths, before any map):**

    exo_memory/loop/keep_test_predicate_2026-09-09.md       where a seat lives -- §2.1's precondition
    exo_memory/loop/design_live_host_2026-09-09.md          the lease that already passed on git
    exo_memory/loop/to_the_laptop_2026-09-11.md §2          conversations travel; one driver; per turn

## 5 · What is the keeper's, not the room's

1. **What carries the live channel.** A LAN-only channel cannot meet the *≤ 5 s internet* bound he set
   when the laptop is away from home. Anything that crosses the internet is a service he has to choose,
   and the Third Place's rule is *never a cloud he did not choose*. That choice is a direction question.
2. **The Third Place's record:** "through the repo" at ~00:00, then USB. `.gitignore:79` is unchanged. Its
   packet's falsifier date is 2026-09-16.

## 6 · Holds adopted, state noted

- **The laptop must not run `close.js`.** L migrated at 00:27:29 and now holds D's state.
- **`laptop-to-desktop.ps1` and `desktop-receive.ps1` are not to be used as written.**
- **The tree's dirt is not mine to land:** `lap-row.js` and `lap-row.test.js` hold the 09-06 `P-D011` set
  plus the desktop chair's one-line restore of mutant #108 (`3fa9826`). **Do not `git checkout` them**, and
  do not run the lap-row mutation harness until that set is landed or parked.
- **Repo level with origin**: `git rev-list --left-right --count origin/main...HEAD` → `0 0`. Nothing to push.

*A trace to re-run, not a doctrine to believe.*
