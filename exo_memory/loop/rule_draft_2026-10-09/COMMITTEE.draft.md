# The committee — how more than one voice works here

Consonance can run several instances at once against one shared board. This describes the practice.
It is deliberately short: the *verbs* arrive from the control plane itself, and repeating them here
would give you two copies of one list to drift apart.

This file is the one home for everything a pane does. `BUILDING.md` holds what the chair does and
`LIBRARIAN.md` what the librarian does; where they touch pane work, they point here.

## Why more than one

A chord needs two notes. One voice at full volume is not a committee that needs better bookkeeping —
it is unison, and unison carries no information no matter how loud it is.

That failure is measurable rather than theoretical, and the measurement is available:

    node consonance/tools/board-audit.js

It reports what share of the board a single seat wrote. A share climbing toward 100% is the room
collapsing to one note. The number that matters is not how much was said; it is whether the other
voices stayed *distinct* while staying *coupled*. Both poles score zero — voices that never touch
carry nothing joint, and voices that merely agree carry nothing new.

## The loop, in one card

- Read the loop in `BUILDING.md` (the master: its loop and joint-step sections) before you reconstruct any of it from memory.
  Why: a paraphrase of a route is how a route rots.

The drawing rides here because a pane reads this file first. Work enters at the orchestrator or goes straight to the
librarian (two doors, 2026-09-02, `0714963`, `c177984`), and once a lap is open the cycle repeats on its own.

```
        you
         │  1. state the inquiry or the project. This is the entry, and it runs once, by
         ├──────────────────┐  either door. See the joint step for what door two owes.
         ▼  door one        ▼  door two
   Orchestrator ──────► Librarian        2. measured against the corpus
         │  ◄──────────────┘             3. the parts of the system that apply, cited
         │
         │  4. a plan built from what came back
         ▼
       Panes                             5. briefed, disjoint, each owning named files
         │
         │  `call_librarian`             6. hand-backs go straight to the Librarian, as a pointer
         ▼                                  to the file; the orchestrator is not in this hop
      Librarian ──────► Orchestrator     7. checked; silence is a valid answer; the orchestrator
         │                 │                lands what the librarian collated, and composes nothing
         │                 └──► back to 4   The ring (orch → panes → lib → orch) repeats on its
         │                                  own. The user is the entry, not a station it returns to.
         ▼
        you                              8. only on direction, never on state: an off-ramp the loop
                                            takes when there is something to say, never a stop it
                                            waits at.
```

## The two seats

- The orchestrator holds the chair verbs and can deliver work into a committee pane. Every use
  and every refusal is written to the board.
- A committee pane raises work upward instead, and never uses chair verbs.

- Take the exact verb names and the gate from the control plane, not from this file.
  Why: one list, one place; `call_librarian` is named below only because there the route is the rule.

## Your work: worktree, tests, commits

- Work in your own worktree, the one your packet names, or one you add with `git worktree add` outside the shared
  checkout; own only the files your packet names.
  Why: a shared index let a commit carry another seat's staged files at `38ae5c2` (2026-09-04,
  `exo_memory/handback/p-d007-smallfixes_2026-09-04.md` §10), and K registered per-seat worktrees as the answer.
- Copy live data into a worktree; do not link it. If a link is unavoidable, remove it yourself before you hand the
  tree over, and say so in the hand-back.
  Why: removing a worktree can delete a junction's target; t180's `reads/` was emptied that way, cause inferred
  (2026-09-28, `exo_memory/handback/p-d184-read-B_2026-09-28.md` §7).
- Write a test that fails first, then make it pass. When a test goes red after your change, fix the implementation.
  Why: a test never seen red proves nothing; the room's work checks caught 132 defects in one day and its paperwork 0
  (`exo_memory/loop/loop_friction_B_2026-10-09.md`).
- Amend an existing test only when its rule changed, by name, with a comment saying why, and say so in the hand-back.
  Why: a weakened test is a check silently removed; the worked case is `join.test.js:83`, ruled wrong and replaced by a
  stronger check (`exo_memory/handback/p-d170-read-B_2026-09-27.md`).
- Run the tests that cover your change, under the heavy-run lock, before you hand back. `consonance/tools/js-suite.js`
  and the mutant harnesses take the lock themselves; wrap any other node or cargo test run with
  `require('./consonance/tools/heavy-run.js').hold({ cmd })`. The collator runs the full suite.
  Why: concurrent suites on one tree hung and starved every seat's rings for 8–16 minutes
  (`exo_memory/loop/stall_trace_2026-09-23.md`; the lock is L098).
- Run anything expected to take more than about two minutes in the background, and hand back what you verified rather
  than holding your turn open on a suite.
  Why: a ring reaches a seat only between its turns, so a long turn is a closed door (`main.rs` `drain_decision`;
  `exo_memory/loop/stall_trace_2026-09-23.md`).
- Commit by named paths in your own worktree: `git commit -- <paths>`, never `-a`, `-A` or a bare `git commit`.
  The chair lands your commits on main.
  Why: a commit then carries only what its author named; `git commit` takes the whole index without any `add`
  (amendment 2026-08-26, tightened 2026-09-04 after `38ae5c2`; drafted in `exo_memory/loop/commit_rule_amendment_DRAFT_2026-08-25.md`).
- Name yourself, the seat, in the commit body.
  Why: every commit is authored `solariz3d` and `Co-Authored-By` names the model, not the thread; the body is the only
  attribution surface that works (cycle 8 F2, `muscle_map.md`).
- The keeper's standing authorisation: in this room, committing by named paths in your own worktree is authorised on
  every lap. Pushing is not: a push needs the keeper's word, for that push, and the chair carries it (`BUILDING.md`).
  Why: *"no unattended process publishes — a human, awake, saying yes"* (`journal/2026-07-28.md:189`). Committing is not
  publishing.
- Refer to a credential by its name or length, never its value, in a hand-back, a commit, a board post or a reply.
  Why: the source repository is public (`BUILDING.md`, "Dev and consumer: the port rule") and `gh` is authenticated machine-wide, so a quoted
  key is a published key.

*Falsifier (registered 2026-08-26, fired at `38ae5c2`, re-registered 2026-09-04 by K): a commit found carrying another
seat's in-flight file. Checkable from git history.*

## The hand-back: a file, a map line, a ring

- Write the hand-back to the file your packet names, or, when it names none, to
  `exo_memory/handback/<packet-name>_<YYYY-MM-DD>.md`, repo-relative.
  Why: the librarian reads that directory; a hand-back written elsewhere is a hand-back never written (two packets named
  no file on 2026-09-01).
- Re-derive every figure from a command printed beside it, never quoted from the brief.
  Why: a number whose source is gone is a hand-made figure the next reader cannot check.
- Report mutation runs as `applied N / caught N / NOT APPLIED N`.
  Why: a mutant that did not apply proves nothing and must not count as a pass.
- Show the check beside a claim about state, or mark it `inferred:` — in a reply to the keeper as in a hand-back:

      checked: <command or path:line> → <result>
      inferred: <the claim>

  `inferred:` is owed where a claim would otherwise read as checked (a figure, a verdict such as "fixed" or "green", a
  "so …"); future, intent and opinion take no label. An inferred figure still names where to check it. If you act on an
  inferred claim, check it first.
  Why: unchecked claims were wrong 8 of 163, checked 1 of 72; usually right, not yet known to be
  (`exo_memory/loop/claim_base_rate_score_2026-09-27.md`; adopted 2026-09-27, L121).
- Record corrections plainly when there are any, including the ones you made to yourself.
  Why: a record of only surviving claims reads as though nothing was ever wrong.
- Append one line to your own map, `exo_memory/map/<your letter>.md`, in the shape `exo_memory/map/README.md` states:
  the finding as a sentence that could be wrong, its evidence, and the hand-back path. A pointer, not a copy.
  Why: a pane is respawned fresh from its capture tail plus that file (`main.rs` `own_map_path`), so a finding that
  reaches only the hand-back never reaches the next waking of you; 0 of 5 hand-backs wrote one on 2026-09-02.
  *Falsifier (the librarian's, 2026-09-02): `git log -- exo_memory/map/*.md` shows no pane-authored append three laps on.*
- Then ring the librarian with `call_librarian`, in the same turn, carrying the pointer: the path and just enough to
  say which packet it answers, never the finding in prose.
  Why: the file is the master and the call the pointer; the chair-relay hop re-characterised a finding on 2026-09-01
  (`6677540`), and a summary in the call is the same copy.
- List what you read or ran for this message on a `SOURCES:` line above the last line, or
  `SOURCES: none (no state claims)`.
  Why: it lets the reader open what you opened. Today `consonance/hooks/sources-gate.js` refuses the ring when an item
  matches no call completed this turn; fix the line and re-send, nothing is lost. When the keeper switches the gates, it
  checks the line against what you ran instead.
- End the hand-off with who acts next, and when, e.g. `NEXT: librarian collate the chunk when all four hand-backs
  are in`. You do not owe the `OUTPUT → NEXT` line; the collator writes that.
  Why: *"each seat tells the next where to hand it to remind it"* (the keeper, 2026-09-16); a missing line is delivered
  with a warning, never refused, because a refused `call_librarian` would drop the pointer (`mcp.rs`).

## The order: finish, file, then pass it on

- Finish your output, file it, then pass it on, in the same turn, without waiting to be told.
  Why: a dispatch is un-revisable — once it renders in another seat's pane that seat reasons from it at once; on
  2026-08-24 an unverified claim sent early cost a wrong ruling in a second seat (`exo_memory/librarian/2026-08-24.md`).
  Measured to 2026-08-25: 101 of 103 dispatching turns sent before their answer was finished
  (`exo_memory/loop/turn_boundary_detection_2026-08-25.md`). Assume you are about to break it.
- Finishing is not stopping: when something is owed to another seat, the turn that finishes carries it.
  Why: the human is not the trigger, and a pane that finishes silently looks exactly like a pane that stalled.
- A genuine interrupt goes at once — *stop, you are about to clobber something*.
  Why: it claims nothing and delivers nothing, so there is nothing to finish first (`BUILDING.md`, the order of a dispatch).

## Briefing a seat — this is where the quality comes from

A pane returns what the brief made possible. Six things, each of which has failed here when it was skipped:

1. Route the object, not a description of it — the sha, the file, the raw output.
   Why: a summary of a finding is a copy; the seat needs the artifact so it can disagree with the description.
2. Register the falsifier before the work starts.
   Why: written down first, it can fire; written after, it is a story about what happened.
3. Name the unwelcome outcome in advance, in the words that would make it true.
   Why: it makes it *sayable* before anyone knows which way it goes.
4. Say "default to refuted."
   Why: a seat told the conclusion finds support for it; a seat told to attack it finds the support *or* kills it.
5. Match the seat to what it has actually done, not to what it is called.
   Why: a name is not a record; the record is the hand-backs (`exo_memory/librarian/DOSSIER.md`).
6. State your own bias where you know it.
   Why: a brief that hides the briefer's stake gets a scored result that quietly measures the briefer.

## Scoring

- Have a seat with no stake score your work. Not as modesty — as measurement. Whoever holds a stake in an outcome
  cannot be the instrument that reads it, and the person best placed to notice that is not the one holding the stake.

The corollary bites hardest on the seat that hands out the work: a chair that scores its own
transcript is running the experiment and reading the dial.

## The failure this practice keeps hitting

Work gets routed and never read. That is not a discipline problem, it is a routing problem, and it
has an instrument:

    node consonance/tools/ferry.js --due          # what is unread
    node consonance/tools/ferry.js --record <sha> <pane>   # the operation

A finding nobody reads is indistinguishable from a finding nobody made. If the unread count only
ever grows, the committee is decorative and the honest move is to say so rather than let the number
accumulate as a reproach.

## The check

*Is the interval still there?* Two seats that never disagree have collapsed into one; two that never
converge were never coupled. Disagreement held inside a working relationship is the functioning
state, not a problem to resolve — and a pane that only ever confirms is worth less than no pane,
because it reads like corroboration.

## Contradictions resolved

1. Who commits (the old `COMMITTEE.md:113` "Nothing committed … the seat holding the shared checkout commits" and
   `:210` "Do not commit; the chair commits with attribution", against the amendments at `:116-163` and `:240-243`).
   The 2026-08-26 amendment wins: you commit by named paths in your own worktree, and the chair lands on main. Why: it
   is the practice every lap since has used, and a seat should not read a rule and its repeal in one file.
4. When tests run (the global instructions' "run the tests that cover the change before reporting success" against
   `BUILDING.md:178-189`, "the whole suite is the collator's"). Both stand, scoped: you run the tests that cover your
   change, under the lock, before you hand back; the collator runs the full suite before it lands or reports success to
   the keeper. The chair half lives in `BUILDING.md`.
5. Committing at all (Claude Code's tool text, "commit or push only when the user asks", against the room). The
   keeper's standing authorisation, stated above, is the answer: committing by named paths in your own worktree is
   authorised on every lap; pushing is not, and still needs his word. `BUILDING.md` and the global instructions point here.
