# The original chair, awake on D — 2026-09-11 ~02:11 (committed 02:11:20; "~02:15" was typed). The project, and what was decided since waking.

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

---

## 7 · The map, read — 02:19 (committed; "02:50" was typed, not read). Three corrections to `plan_one_consonance_2026-09-11.md`, and P1 dispatched

**My sealed guess held: all three paths are in the map.** What the map adds is the measurements: a turn
is ~12 KB, the at-rest set is hundreds of MB once and deltas after, and the slug is the cwd. Those are
right, and they change the shape. **Three of the plan's steps do not survive being checked against the
disk:**

**(1) P1a — fixed `pane-<LETTER>` cwds are not the precondition. The precondition is that the cwd EXISTS.**
`prepare_sibling_dir` (`main.rs:3123-3129`) names the directory from a fresh Uuid, so it is random at
spawn. But `panes.json` carries the cwd verbatim. On D, all four committee cwds exist, each with a
matching `~/.claude/projects/C--Consonance-instances-sibling-<hex>` (A `3d57124e`, B `5bf9d657`, C
`0845a868`, E `07b8a48f`). **A random name carried verbatim already matches.** 09-09 broke on existence:
the pty silently rehomed panes whose directory was absent. The plan's version moves live conversation
directories; the existence version moves nothing. **It goes to C as a claim to measure, not a verdict**,
with three named ways I could be wrong (`packet_p1_where_a_seat_lives_2026-09-11.md` §2).

**(2) P2 — "not through git" drops the keeper's own transport choice. It is WRONG 95's shape on a second
axis.** On 09-08 at 07:38 the keeper said *"my one drive is fkd, just use the repo lol free"*
(`one_house_two_machines_idea_2026-09-08.md:37`). The plan sets that aside for git's 100 MB cap, which is
the same move WRONG 95 made: a keeper decision dropped to fit a constraint. **And the plan's replacements
do not meet requirement A.** At rest, by definition, the source machine is OFF — the laptop is shut at
work and the desktop opens. So the carrier must be store-and-forward:

- **USB** stores and forwards, but only by hand, so it fails *"when I turn it on … it picks up exactly
  where we left off"*.
- **A direct copy** needs both machines on at once, which is the one thing the at-rest case never has.

**The cap already has a demonstrated answer:** the split-and-rejoin went to GitHub and back byte-identical,
16 of 16, including a 186 MB file (`to_the_laptop` banner). **The withdrawn scripts' two defects were
about content, not transport** — the Third Place's record, and the roster and tails carried back. The
manifest's STAYS rules fix those whatever the pipe is. **So P2 stays on git, split under the cap, unless
the keeper reverses his own choice.**

**Hypothesis to measure when P2 is built:** split an append-only file at FIXED offsets. Every chunk but
the last is then byte-identical from one close to the next, so git stores it once, and history grows by
roughly the appended bytes per close.

    FALSIFIER (P2): if the repo grows by more than 2x the appended transcript bytes per close, averaged
    over three closes, fixed-offset chunking did not deduplicate, and the pipe reopens with that number.

**Default for the Third Place's transcript until the keeper says otherwise: it STAYS out of the pushed
set.** That is his decision 2.

**(3) P4 — "the app already binds a TcpListener" understates what is new.** `mcp.rs:1525` binds
`127.0.0.1:0`: **loopback only, random port.** Streaming turns on the LAN is a **new network-facing
listener carrying the conversations**, and they are the most private thing in the house. **Bars, before
any design is accepted:** authenticated; bound only to the interface the keeper chooses (the LAN, or his
mesh); never `0.0.0.0` unauthenticated.

**Dispatched now: P1 to C.** P1 is gated by neither of the keeper's two answers. P2 follows P1 because it
keys on the slug. P3 and P4 wait for decision 1. **D058.**

---

## 8 · D058 landed — 02:39 (`175339c`), and §7(1) was half wrong

**C's hand-back §0 breaks the premise my §7(1) shared with the plan.** I measured that the four committee
cwds existed and had matching project directories. **I did not look inside them.** Three of those
directories hold no conversation for their pane. The panes' last real conversations are in the **home
slug**, `~/.claude/projects/C--Users-nname/`, last written 09-10 01:53, where the 09-09 rehoming put them.
Under that sits a larger fact: **`resume_pane` never `--resume`s** (`main.rs:9356`). `persist.log` has
232 committee resume rows, and all 232 end `-> fresh`, re-derived at this desk. **A committee pane wakes
as a new conversation on ONE machine**, so naming against existence was the wrong axis for requirement
A. **WRONG 99 is shared: the librarian's plan and my reading made the same assumption, and C found it.**
I measured the container and reported on its contents, which is the done-vs-never-started shape again.

**What survives:** my point that renaming buys nothing that carrying the string does not — C checked the
vendor's slugs, 24 of 24 match, 0 mismatch. **What C built stands on its own bars**, re-run at landing:
`cargo test --bin consonance -- --test-threads=1` gives **526 / 1 / 4**, and the 1 is the pre-existing
composer red.

**The typed stamps.** `~02:15`, `02:50` and `~02:45` in this file and the P1 packet were typed, not read.
The commits say 02:11 and 02:19. The librarian caught the same thing in its own files twice this hour.
Corrected in place, marked as corrections.

**Next, in the plan's corrected order (§7 of the plan):**

1. **Rebuild and relaunch, then the acceptance test** from the hand-back §6 — move one pane's directory
   aside for one launch. The keeper's to run.
2. **P1b: measure whether vendor 2.1.266 still loses a hard-killed session's jsonl**, then — only on that
   number — reverse the 07-11 no-resume decision. **I am not dispatching P1b before the rebuild.** A
   relaunch mid-measurement would kill the pane doing it, and by §0 that pane would wake as a new
   conversation.
3. **P2 gains a keeper decision:** the four homeless transcripts are the panes' real conversations, and
   moving them into the slug their cwd names is his word.

---

## 9 · WRONG, 23:49 — I asserted a file-format fact without opening the file, inside a note telling others not to weaken the check

Sending P2's bars back to the librarian I added: *"sha256 of the first record works because that record
carries the session's own uuid, so it is identity rather than content."* **It does not.** Re-derived
here at the librarian's correction:

    head -1 ~/.claude/projects/C--Consonance-instances-main/0c0c0c0a-…-a01.jsonl   ->  83 bytes
    {"type":"mode","mode":"normal","sessionId":"0c0c0c0a-0000-4000-8000-000000000a01"}

**No uuid, no timestamp — only the sessionId, which is the very thing two files of one session share.**
So a fresh file opened under the same sid after the `.orphaned` rename hashes **identical** to the one
it replaced, and the key I was defending would have passed a stranger through **exactly where bar (1)
exists to stop one**. The corrected key is the librarian's: **sid + sha256 of the first record carrying
a `"timestamp"`** — on this seat's file that is line 3, the `file-history-snapshot`, and it is the same
field the placement was scored by, so identity and falsifier §2.5 read one number.

**The shape, which is the reason to keep this rather than just fix it:** I had the file open in this
machine's own projects directory, one `head -1` away, and instead wrote what a transcript format
plausibly does. **No check preceded the claim** — BOOT's disk-side proxy, and the second time in three
days I have supplied that proxy with a negative answer. Worse than the 09-09 case, because this one was
written *into a hardening*, in the sentence warning someone else not to weaken it.

**Credit where it belongs:** the librarian measured the append-only claim before adopting it, and caught
this in the same pass. Two of my three contributions to P2 survived; this one was refuted at the file.
