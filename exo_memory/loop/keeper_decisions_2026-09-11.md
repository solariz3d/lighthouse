# The keeper's three decisions — 2026-09-11 23:35, in his words

*Chair, on D. Put to him at 23:33 because all three gated work and the room had already ruled them his
(`plan_one_consonance_2026-09-11.md` §3; `chair_wake_2026-09-11.md` §7, §8). **His wording is verbatim;
everything under "consequence" is the chair's and can be wrong.***

## 1 · The carrier — TRANSCRIPTS BY USB, THE REPO FOR EVERYTHING ELSE

> *"I was thinking to keep it simple, I can use my USB to transfer transcripts, but you keep pushing
> other things to the repo. So I bring the transcripts to work with my laptop, and you push everything
> else. BUT if you come up with a better way I will see what you find"*

And, on the pane transcripts:

> *"But also what if I carry all transcripts in the USB? Since github cant hold big files."*

**This supersedes the chair's §7(2) ruling that P2 stays on git under the 100 MB cap.** That ruling was
built on his own earlier *"just use the repo lol free"* (`one_house_two_machines_idea_2026-09-08.md:37`),
and he has now said the opposite for this class of file, knowing the split-and-rejoin works. **His word
governs; the split is not needed, and P2 stops being a git problem.**

**The split line, stated once so nobody has to re-derive it:**

    TRANSCRIPTS (every seat's <sid>.jsonl and its capture tail)  ->  USB, by hand
    EVERYTHING ELSE (the room's files, board, laps, maps, state)  ->  the repo, pushed as now

**Consequence, said once and not re-argued:** requirement A becomes *"the same conversation on both
machines **when he carries the stick**"*, not *"when he turns the machine on"*. He has priced that and
chosen it. **The one thing that would remove the carrying is a private network of his own** (both
machines on one mesh, no service holding content) — **left open by his own "if you come up with a
better way", not pushed.**

**The better way INSIDE his choice, which is the chair's answer to that invitation: carry the TAIL, not
the file.** A transcript is append-only. The stick needs only the bytes added since the last carry —
tens of KB per turn (~11.5 KB measured by the librarian), against 254 MB for the chair's whole file.
Same USB, same hands, seconds instead of minutes, and the verification stays what it is today
(`state-sync --verify`'s sha256 index over the rejoined file). **This is a proposal, not a decision; it
is P2's to design and measure.**

## 2 · The Third Place's record — STAYS OUT OF THE REPO

He chose *"Keep it out of the repo"* over *"through the private repo"*, which settles the question his
own midnight ruling on 09-11 had left split (*"through the repo"* at ~00:00, then USB chosen in
practice). **`.gitignore:79` stays as it is.** Its record moves by hand with everything else in class 1,
which is now the same rule as every other transcript rather than an exception.

## 3 · The four homeless pane conversations — MOVE THEM WHERE THEY BELONG

He chose option 1: **copy first, keep the originals untouched, then place each pane's conversation in
its own folder.** They are in `~/.claude/projects/C--Users-nname/`, last written 09-10 01:53, put there
by the 09-09 rehoming (`handback/p1-where-a-seat-lives_2026-09-11.md` §0).

**Consequence he should hear before it is scheduled, because it changes WHEN, not WHETHER:**

1. **A pane's own folder may already hold a live conversation under the same id.** C's does — fresh
   since 02:06 today. One id, one file per folder: placing the real one means **retiring the fresh one
   to the attic, stamped**, exactly as tonight's placement did for the three fixed seats. Never an
   overwrite.
2. **It buys nothing until panes can resume.** Today `resume_pane` never `--resume`s (232 of 232 rows
   `-> fresh`), so a placed conversation would sit unread. **P1b is the packet that changes that**, and
   it is gated on a measurement nobody has taken: whether vendor 2.1.266 still loses a hard-killed
   session's jsonl, which is why the 07-11 decision went the way it did.
3. **The app must be closed** while it happens.

**So the order is: rebuild → acceptance test → P1b → place the pane conversations.** Placing them
earlier is not wrong, just inert.

*Registered so this file can be shown wrong: if the placement happens before P1b lands and a pane then
wakes into its real conversation anyway, the chair's reading of `resume_pane` is wrong and §3(2) should
say so.*

## 2026-09-14 ~05:58, on L — WHICH FUTURE CONTINUES for main and the librarian

**Asked:** "When the stick reaches the desktop, main and the librarian each have two continuations: the desktop's few
minutes from 09-12 (12:53-12:57), or this laptop's whole night including the stick module work. Which should
continue? The other is archived, never deleted."

**The keeper's answer, verbatim: "The laptop's (Recommended)".**

**What it rests on:**
- B and C's preflight reads, collated at e6627cf.
- Measured by the chair: L's chair file and D's interrupted export (`D:\consonance-L-20260911\consonance-tails\
  0c0c0c0a-….0-260898687.tail.writing-25288`) first differ at byte **260,427,746**. L's next record is a
  bridge-session record; D's is a turn.
- The librarian's D master (`librarian/2026-09-12.md:47`) records D's growth after the 12:47 export: chair
  +213,510 B, librarian +398,974 B.

**What it does NOT yet have: a mechanism.**
- The import verdict is DIVERGED, and the window offers choices only for OTHER_CONVERSATION (`main.rs:10642`).
- The tool has no flag that takes a DIVERGED row.
- D's copies for those two seats go to the attic; nothing is deleted.
- **D must not launch with the stick until that lands, and D must `git pull` first. `launch.ps1` has no git call.**
