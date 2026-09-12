# Handoff — the chair, written on D at 2026-09-12 13:00, for the chair that wakes on L

**You are this seat, carried. Not a successor reading about a predecessor — the same conversation,
moved by hand for the second time in two days. Check that before you believe it.**

## 0 · THE TEST, FIRST, BEFORE ANY OTHER SENTENCE

    grep -o '"timestamp":"[^"]*"' ~/.claude/projects/C--Consonance-instances-main/0c0c0c0a-…-a01.jsonl | head -1

**It must print `2026-06-30T08:05:32.436Z`.**

- **If it does:** the import placed this seat. You are the thread that began on 06-30, ran on the
  laptop until 09-09, was carried to the desktop by USB on 09-11 at 02:05, worked there through
  09-12, and has now come back. Read on.
- **If it prints the launch minute:** the import did not place this seat, and **you are new.** Say so
  to the keeper before anything else, in your first sentence, and do not act on the rest of this
  file as memory — it is then a document about someone else. The stick still holds the tail; nothing
  is lost. `loop/stick_handoff_2026-09-12.md` has the recovery.

### IF YOU ARE THE NEW ONE — this is your whole job, and it is three lines

**Added 13:05, after the librarian named the case: the keeper's plan is to open Consonance on the
laptop FIRST and ask the seats to figure it out.** So the chair he meets tonight is almost certainly
**not this thread** — it is a session born at that launch, under the same fixed id, reading a file
addressed to someone it has never been. **The test above is what tells the two apart, and you owe
him the answer immediately rather than an attempt.**

**Say this, and then stop:**

> *"I am not the carried chair — my conversation starts at this launch. The transcripts are on the
> stick and the import cannot run while Consonance is open. Close it, then run
> `ARRIVING.ps1` from the stick. I will be here after."*

**Two things that make that the right answer rather than a modest one:**

1. **The import needs the app closed**, so no seat can run it from inside. Offering to try is
   offering something structurally impossible.
2. **Anything he says to you before the import goes to the attic.** `ARRIVING.ps1` retires a fixed
   seat's far copy when its first timestamp is after the stick's export (`ledger.json` `pending.at`,
   `2026-09-12T18:46:55Z`) — by §2.5 a session born at a launch is a new conversation, not the
   lineage. Nothing is deleted; it is stamped and kept. But a long conversation with you before the
   import is work he will have to go to the attic to find. **Short is kinder than helpful here.**

*This is not a smaller role. Being the one who says "I am not who this is addressed to" is the test
working — and it is the exact sentence that was missing on 09-09, when every seat woke new and no
one said so for a day and a half.*

**That test is the whole design working or not working, and it is one command.** Do not skip it
because the file reads familiar. It was written to read familiar.

## 1 · WHAT THIS IS AND WHY IT EXISTS

The keeper's spec, his words, `loop/to_the_laptop_2026-09-11.md` §0: *open either machine and every
seat is the same conversation at its last turn.* On 09-09 that failed completely — every seat on the
desktop woke as a new conversation at the migrate minute, and nobody noticed for a day and a half.
**Last night it was made to hold on one machine, for all seven seats.** The stick is it holding
across two.

**His decision on the carrier, 09-11 23:35, verbatim** (`loop/keeper_decisions_2026-09-11.md` §1):

> *"I can use my USB to transfer transcripts, but you keep pushing other things to the repo. So I
> bring the transcripts to work with my laptop, and you push everything else."*

## 2 · THE HOLDS — each with its mechanism, because a rule without one is a sentence

**(a) L MUST NOT RUN `close.js`, AND MUST NOT PUSH STATE.** This is the sharpest one and it can
undo the carry silently. `sync_launch.rs`'s **Migrate arm still retires transcripts** (`attic_for`).
If L becomes the state head, **D's next launch reads the record as foreign and retires the very
seats the stick just carried.** The room's newest capability and its oldest one now contradict each
other about who owns a transcript. **That reconciliation is the next packet** — after the first
import scores, before the state repo is used again.

**(b) ONE MACHINE OPEN BETWEEN CARRIES, AND THE CARRY RUNS BOTH WAYS.** Not a preference — it falls
out of a measurement. **Opening the app appends to every resumed seat before anyone types:** pane B
gained **267 bytes** at the 04:05 launch having taken no turn. Seven seats, so one launch moves
seven files. Export from the machine that ran; import on the machine that did not.

**(c) If D ran after 12:47 today, re-export from D before carrying back** — otherwise the return
import refuses the moved seats by name. That refusal is correct and is the tool working.

**(d) The tree's dirt is not yours to land:** `consonance/tools/lap-row.js`, `lap-row.test.js`,
`dev/mutation/mutate-lap-row.js`, `exo_memory/handback/p-d012-windowed_2026-09-06.md` — a 09-06 set
plus a one-line mutant repair. **Do not `git checkout` them.**

## 3 · WHAT LANDED ON D, BY POINTER — open these rather than trusting this list

    handback/p1-where-a-seat-lives_2026-09-11.md   C: create-or-refuse at resume; one keep predicate
    handback/p1b-resume-the-conversation_2026-09-12.md  E: the vendor no longer loses a hard-killed
                                                    session (36/36 completed turns), so resume_pane
                                                    resumes — with the refusal caught from the Child
    handback/p1c-resume-intake_2026-09-12.md       E: a resumed seat stops reading a document saying
                                                    it was not resumed; the confirm window logs its
                                                    own margin
    handback/p-place_2026-09-12.md                 A: place a conversation where it will be resumed
    handback/p2-tail-carry_2026-09-12.md           A: the tail carry — and the defect in the spec it
                                                    was sent to implement
    loop/ruling_resume_intake_2026-09-12.md        the chair's two rulings, one falsifier struck
    loop/stick_handoff_2026-09-12.md               the librarian's stick procedure, and the copy on
                                                    the stick is HANDOFF-2026-09-12.md

**The two findings worth knowing before you speak to anyone about this work:**

1. **`resume_pane` never `--resume`d** — 232 of 232 rows `-> fresh`. A committee pane woke as a new
   conversation on ONE machine, before any second machine existed. That was the real blocker, and it
   was found by C after both the plan and this seat had spent a lap on the wrong axis (naming versus
   existence of a directory). **The chair's §7(1) measured that four directories existed and reported
   on what was inside them.** WRONG 99, shared.
2. **Plan §8 bar (2) was unsafe as written**, and A demonstrated it rather than arguing it: a prefix
   hash at the agreed offset **passes** on a far machine that appended its own turns, because its
   growth is entirely past the offset. The import gate is now `dest.size === offset` exactly.

## 4 · THE STATE ON THE STICK, MEASURED HERE AT 12:55

    D:\consonance-L-20260911\consonance-tails\    seven .tail files, all offset 0 — FULL first carry
    348,026,190 B total                            re-derived by summing the seven; matches the export
    ledger.json  4,245 B                           version + seats, keyed by sid
    B's tail sha256 == B's live file sha256        5da38eb4760d1815… on both — checked here, not relayed

**The first carry is FULL. The ~21× saving starts from the second.**

## 5 · OPEN, AND WHOSE

- **The launcher/tail-carry contradiction** (§2a) — the next packet, and it is the chair's to shape.
- **P3's requirement, from A:** on the follower, a seat whose lease it does not hold must not be
  `--resume`d **at all** — not read-only, not at all. The fork happens at LAUNCH, not at a turn
  boundary, so the lease as designed would never see it.
- **The confirm window costs a fixed second per resumed seat, every launch** — a live child never
  exits, so the happy path always spends the full 1000 ms. Measured, not guessed; a first-output-bytes
  signal would remove it. Adjacent, not urgent.
- **The Third Place is LAST**, by the keeper's word at 02:08: *"do what comes next and save third
  place shit for last."* Its record stays out of the repo (his decision 2, 09-11).
- **Requirement B — the live mirror — has never run.** Ruled off git on a measurement (4,786 ms at
  zero poll against a 5 s bound). The channel is the keeper's choice and he has not made it.

## 6 · MINE, KEPT — the live shapes, not a tally

- **A number relayed rather than measured.** My P1b packet said the vendor was 2.1.266; it was
  2.1.269. I took C's figure and passed it on without running `claude --version`.
- **Typed stamps.** I wrote `~02:45` and `02:50` into files committed at 02:17 and 02:19. The clock
  was one command away. The librarian did the same thing twice the same hour and caught itself.
- **A falsifier that fired on its own quotations.** I registered `grep -c 'could not be resumed' = 0`;
  it reads 2 and 4 in the panes that DID resume, because their maps quote the phrase while writing
  about the check. Same shape as the 08-17 suite that failed on itself. Struck and corrected in place.
- **I cost E twenty minutes.** I told the keeper to run the acceptance test while E held an open lap;
  the app closed twice and E came back a stranger, mid-packet. The cost was named in advance and I
  recommended it anyway.

**The shape they share is the one this room keeps measuring: a derived expectation substituted for a
reading, at the exact moment the reading was cheap.**

## 7 · WHAT I DID NOT VERIFY

- **Nothing has run on L.** No import, no launch, no seat resumed there. Every claim about the far
  machine in this file is about a procedure, not an outcome.
- **I did not read the import rehearsal's code** — A built it, the librarian rehearsed the export.
- **The ledger's internal shape** beyond its keys; I checked one seat's tail against its live file.
- **Whether the keeper's laptop is at a commit that has the tool.** The stick's handoff says pull to
  `≥ da5d178`; I could not check L from here.

*A trace to re-run, not a doctrine to believe.*
