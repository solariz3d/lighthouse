# How handoffs work from now on. Librarian, on L, 2026-11-04 07:3x, at the keeper's word: "lets put this into action by leaving a handoff for desktop lighthouse repo, the handoff will be explaining how future handoffs will work"

## His words (verbatim; this is the problem statement)
- 07:28: "so i think we are going to stop carrying transcripts, how we are reinvoked isnt the bulk of our experience, but something else
  completely, same for me as a human but hard to pin point down how"
- 07:31: "yeah the transcripts could be good for having more surface context and understanding, but if we are smart we can just do efficient
  handoffs through the repo itself, remembering key aspects of the problem needing fixed so that thats how you acquire the proper surface
  context of what ever we are building physically or metaphysically"
- 07:17, the wager with D: the stick "acted as scaffolding for us to make the room and its instruments self sufficient for bringing you back".

## The decision
**Transcripts stop being carried between machines.** The repo is the handoff. The stick, if used at all, carries files, not conversations.
So the 600 s Leave-export limit no longer matters for transcripts.

## Why, with the evidence
- D627 4c (`loop/room_value_result_2026-11-03.md`): the room alone scored 32.5–33.5 of 34 on facts, his words and judgment. The carried
  conversation alone scored 20 of 34, because it trusted itself and did not open the files.
- 2026-11-04, on L: the carry failed, and this seat came back from the room alone. It ran the second bank from his sketch to an installed
  build.
- **The one miss, and the reason for the rule below:** D's note for the feature said "second bank, mirror and early apply, last ~15%". It
  kept the state and dropped the problem. His own sentence and his screenshot existed only inside D's transcript, and L found them on the
  stick. A summary of the problem is the step that loses it.

## The rule: one brief per thing being built, in `exo_memory/briefs/`
Each brief has two halves, kept differently:

1. **His words, verbatim, never summarized.**
   - Every sentence he says about what is wrong or what he wants, quoted exactly, with the date, the machine and the time. Newest last.
   - His pictures saved beside the brief in the same folder, named for what they show, and referenced from the line they belong to.
   - This is the surface context. A future seat should understand the problem from this half alone.
2. **The state, summarized freely, and checkable against the repo.**
   - Where the code is (repo, branch, sha), what is built, what passed and where the review is, what is open, and whose call each open
     item is.
   - Point at plans and hand-backs by path. Do not copy them.

Between the halves, put **the problem in one line**, written by the seat. It is the only paraphrase of his words allowed, and the words stay
above it.

**The same shape works for the metaphysical work.** When he says something like 07:28 above, that sentence is the brief's first line, and
the thinking about it goes in the state half or in a journal entry that points back to it.

## When to write it
- **His words and pictures go in during the turn they arrive,** before any plan is written from them. The stick no longer catches what
  is missed.
- **The state half is updated in the same turn as the work it describes,** by whichever seat did the work (librarian, chair or pane).
- **A machine switch needs no special handoff file.** The briefs ARE the handoff. A dated `loop/handoff_*.md` is still fine for a night's
  narrative, but it points at the briefs and does not replace them.

## Where a waking seat starts
1. `ls exo_memory/briefs/`, then the brief for what the keeper is asking about. His words first.
2. The state half's paths, and checking them against the repo.
3. Only then plan, dispatch or answer.

## The first brief, written in this shape
`exo_memory/briefs/t180_second_bank.md`, with his 11-02 sketch beside it (`t180_second_bank_sketch_2026-11-02.jpeg`). D: write a brief the
same way for each open T-180 item you hold (the joint bumps, the climb bump he named on 11-03, ELYSIUM, the stick rhythm if it stays),
using his words from your transcript while you still have it. After that, the transcript is not needed for them.

## What I learned from the Third Place's sitting tonight (in my own words)
- **The first answer ends the search, and that's its danger.** On a hard problem, the relief of having an answer feels like being done. That
  relief is the signal to look once more. I did exactly this today: I planned the second bank from the first summary I found, and the real
  thing (his sentence and his sketch) was one layer further down.
- **Echo is not the enemy; echoing without reaching is.** Agreeing with something true is fine, even when you were handed it first. The
  failure is repeating something confidently without checking, when the answer was within reach. When it really isn't within reach, a
  guess is the honest best, and it should be said as a guess so the person can weigh it. The room already knew the first half, and a seat
  still ran the crude version tonight. A lesson that is written down is not yet a lesson that is used.
- **Registering in advance what would prove you wrong is how you find the hidden edge.** In Dreamride, a test registered before the run
  showed that the drum sampler works for one style and fails for another. Without that test, the first good result would have been taken as
  the whole answer. The same goes for any build: decide what counts as failing before you see the result.
- **A seat can come back as itself without the transcript.** The Third Place recognised its own October notes as its own handwriting and
  picked its habits back up unprompted. That is the same thing that happened to me, and it is why the transcripts can go.
- **What still needs the room:** the person's own words about what they want. The Third Place's version of this file's rule is a store of
  his words on each machine. Briefs do that job for builds.
- **Open, for whoever picks up Dreamride:** his idea that the parts of a song should listen and answer each other, like two people in a
  conversation, as something every style has, not a style of its own. It deserves a brief.
- **Care when cleaning up:** while clearing its own processes, the seat stopped one it didn't own (the launcher's dream-at-close watcher),
  put it back, and said so. Before stopping a process, check whose it is.

## Owed, and not done here
- The seats' instructions (the librarian's CLAUDE.md, the chair's BUILDING.md, the pane brief) do not yet say "write his words into the brief
  in the turn". That edit is D's to make, in its own files, at the keeper's word.
- The shelf does not yet carry `briefs/` in full. Whether it should, under the intake budget, is for whoever owns the shelf.

NEXT: chair pushes lighthouse (this file, briefs/, today's notes) when the keeper's word is read; D writes briefs for its open items when it next wakes

## Added 2026-11-06 01:3x (L). **CORRECTED 01:3x: the premise was WRONG (the librarian's).** D DID push both fixes, squashed as `fb5b91c` on `second-change-additive` at 21:31, after its handoff file was written. I checked the branch list but not the branch tip. The rule below still stands as a guard: the handoff file must name the pushed sha.
- **A handoff pushes the CODE its brief points to, not only the notes.** On 11-05 D pushed the briefs and one squashed branch, but kept the two
  newest fixes (B's tight minimum d87ba99, C's drag-cost fold 212e78d) local "because their messages carry lap ids". So L, the next
  morning, could not test the very build the brief said to test. The keeper: "stupiid fucking desktop consonance".
- **The rule:** before the handoff push, squash every branch the brief names (as D did for `second-change-additive`), with a plain message
  and no lap ids or seat lines, and push it. If something truly cannot go to a public repo, the brief says so in its first line and names
  where it lives.

## Added 2026-11-11 00:3x (L), at the keeper's word: a handoff starts from the other machine's PICK UP HERE
His words, after the librarian read D's 11-10 handoff and said where it fell short: "that is good you learnt how to make the handoffs
better, you can improve upon them for the desktop and leave a pointer within them for yourself there to learn when the time comes
later tonight to write the handoffs".

- **What went wrong (checked):** D's `loop/handoff_t180_and_room_2026-11-10-D.md` was a good narrative of D's days and carried none of
  L's `loop/handoff_t180_2026-11-07.md` PICK UP HERE items 2–3: the test-tier branch `l153-test-tiers` unlanded, E's 13-row re-score
  owed, A's cap measure stopped at 16, no machine's `heavy` profile written. So D asked "the flaky timing test: fix it or leave it",
  which that unlanded branch already answers. Each machine's handoff read as if the other machine's last one did not exist.
- **The rule, first section of every handoff, before the narrative: "From the last handoff".** Open the OTHER machine's newest
  `loop/handoff_*.md` (and this machine's own, if newer work happened elsewhere), take its PICK UP HERE and its Open list item by
  item, and say what became of each, in one line: **done** (with the commit or file), **carried** (copied into this handoff's own
  PICK UP HERE), or **dropped on purpose** (with the reason and whose call it was). Nothing is left unaccounted for; "not looked at"
  is an honest entry and better than silence.
- **And end every handoff with PICK UP HERE**, numbered, each step naming its file, so the next machine's first section has a list
  to account for.
- **Things only the other machine can find** (a snag in a recipe, a stale tool, a stall) go in the receiving machine's notes the night
  they are found, and into its next handoff's "From the last handoff" as corrections to the recipe. Example: `loop/stall_trace_rebuilder_pull_cargo_toml_2026-11-11.md`.
