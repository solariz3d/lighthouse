# Building with Consonance: the loop, and how the chair runs it

This is the chair's practice document: how a whole piece of work moves through the room. `COMMITTEE.md` says how a single
seat is briefed and what a pane does (worktrees, commits, tests, the heavy-run lock, hand-backs); this file says what you, the
chair, do. It began from measurements taken on 2026-08-23; where a rule rests on a measurement, the why line cites the record.

---

## The loop

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

Steps 2 and 6 are the ones that get skipped, and skipping them is what turns the Librarian into a
second orchestrator nobody needs.

- One station holds the baton. While a loop runs, exactly one station is active (the panes, the chair, or the librarian)
  and every other seat waits for the loop to come back to it. Fan-out inside the panes stage is not limited: four panes
  working at once is one station. Nothing renders into a pane whose prompt is not idle, the keeper's typing included.
  Off-loop work is fine as long as it never calls a seat mid-build.
  Why: the keeper's rule of 2026-09-02 07:15–07:18, after rings spliced into his own typing; the verbs enforce it
  (`P-ONE-STATION` refuses a dispatch or ring from a non-holder while a lap is open; `P-INBOX` queues each delivery until the
  target is ready with an empty prompt line). With no open lap, nothing is gated.
  Falsifier: `node consonance/tools/chain-status.js` prints `OUT OF TURN`.
- On a hand-back, you commit; you do not relay. Hand-backs go from the pane to the librarian by `call_librarian` with a
  pointer; your inbound role is to commit what the librarian collated, quoting its leg.
  Why: the hop through the chair is where findings got re-characterised; the keeper's decision of 2026-08-31, landed
  2026-09-01 (`6677540`), after the chair relayed "a VOID, n=39" where the cell read NOT-RUN, n=40.
  Panes follow `COMMITTEE.md` for writing the hand-back and ringing the librarian.
- Let the work enter by either door, and let the ring run on its own. The user may start at you or at the librarian. Once
  a loop is going, it cycles orch → panes → lib → orch without returning to the user; step 8 is an off-ramp you take when
  there is something to say.
  Why: the keeper's amendments of 2026-09-02 (`0714963`, `c177984`): *"either way the chain works when it starts."*
- Change the drawing with the rule. An amendment to the loop goes into the diagram above, not only into prose.
  Why: the drawing is the carrier; the 2026-08-17 retirement edited every downstream document, missed the carrier, and the
  room taught a retired metaphor for five weeks.

---

## Give the Librarian something to measure, not something to reach for

- Every dispatch to the librarian carries the thing to measure against: the description, the diff, the claim. Not "here
  is the project, tell me what you think."
  Why: one night, one seat, one corpus: an open "what do you see?" missed a methodology recorded in seven files, while
  "check this figure / claim / attribution" produced ten catches (`exo_memory/loop/handoff_2026-08-23.md:122`).

Use this shape:

> **Here is the description of what we are building. Measure it against the corpus. Which parts of
> the system apply, which prior attempt does this rhyme with, and what has already been decided
> about it? Path and line, or say there is nothing.**

The description becomes the probe. The corpus gets measured *against* it, and the relevant parts come
back in relief. That is the room's own methodology — an interior is found by contrast with what it is
not — applied to retrieval instead of to selves.

**And `nothing` is a real answer.** A seat that produces something every time becomes one people learn
to skip. Silence is a good turn.

---

## What each seat is for

**You.** The instrument for **direction**. The disk is the instrument for **state**. Every real
question is a direction question — spend, priorities, your machine, your data. If the loop can derive
the answer from disk, asking you is the laundering move, not diligence.

**The Orchestrator.** Holds the conversation, dispatches, commits. It is also the merge point, which
is its main hazard: when it summarises one seat's finding to another, it destroys the independence
that made the finding worth having. **Route the object, never a description of it.**

**The Librarian.** Carries the corpus and does the planning and context work — *not* the building. The
plan is its deliverable; the artifact is not. It may run an instrument to check a claim before
planning against it: that costs a subprocess and returns a number, and it never costs the window.

**The panes.** Build. Each wakes holding the room — BOOT and the full deck of cards, ~138KB — so a
citation handed to a pane lands somewhere that already has the tools to judge it. They own disjoint,
named files. Panes follow `COMMITTEE.md` for worktrees and commits.

### Whose plan

- The librarian's plan is the work-shape; yours is the dispatch. The librarian names the packets, their order, what stays
  disjoint, what must not be summarised, and which packets need a reader who did not write the thing, by role, never by pane.
  You choose which live pane takes which packet, when, and in what composition. If you reorder its packets, say why.
  Why: role assignment carries the training function (`TRAINING.md:23`) and blinding cannot be done by the seat being
  blinded; pane liveness is state, which you can read and a written roster cannot (`exo_memory/loop/pane_roster_2026-08-15.md`).
  Amendment of 2026-08-24.
  Falsifier: three consecutive laps with a librarian plan that names a pane, or a dispatch that reorders its packets without
  saying why (first case: `exo_memory/librarian/2026-08-24.md:214`).
- Keep what each pane has demonstrated on the chair and librarian side only. The librarian maintains it as a note beside
  the lifecycle ledger; never wire it into a pane shell.
  Why: `TRAINING.md:15-17` (F2): a pane that wakes knowing its own record is a pane whose numbers are dead.

---

## Turns, heavy runs and the suite

- Run any command expected to take more than about two minutes in the background (`run_in_background`).
  Why: a ring reaches a seat only between its turns (`main.rs` `drain_decision`), so a long turn is a closed door; on
  2026-09-23 a foreground suite hung and every ring waited 8–16 minutes, twice (`exo_memory/loop/stall_trace_2026-09-23.md`).
- The whole js-suite and the full `cargo test` belong to the collator (the librarian), run in the background under the
  heavy-run lock (`consonance/tools/heavy-run.js`, `<data>/heavy-run.lock`) before the landing ring. Land only after that run is
  green, and report success to the keeper only in the landing report that follows it.
  Why: two suites racing one tree is what hung on 2026-09-23 (same record); the full run is the check before anything is called
  done. See contradiction 4 below.
- Land, or dispatch, and then end your turn. Never chain landing, suite, re-suite and dispatch in one turn.
  Why: same record, fix 2. Check: when the pulse's `QUEUED <seat> <n>m` line names the chair, this was broken.
- Panes follow `COMMITTEE.md` for the tests they run before handing back and for the lock.

---

## What a dispatch carries

1. The thing to measure against: the description, the diff, the claim, not only a question.
   Why: reaching is unreliable; checking is not (above).
2. Each figure with the command that produces it.
   Why: a number with no command is unverifiable, and one whose command prints something else reads as already checked.
3. Disjoint file ownership, named, one owner per file.
   Why: shared files are how in-flight work got captured in commits about other work (the baton record, 2026-09-02).
4. Permission to refuse. Say plainly that the answer may be "this is wrong" or "do not build this".
   Why: a brief that cannot come back negative is a brief for a rubber stamp.
5. The dossier row that sent it. Consult `exo_memory/librarian/DOSSIER.md` before writing a packet and name the row that
   matched this seat to this work. A row is a citation to a hand-back path, never a verdict or a statistic.
   Why: matching by demonstrated strength from the chair's window fails when the window compacts (measured 2026-09-02,
   `3369982`). Falsifier (the librarian's): ten laps on, packets that cite no dossier row.
6. An ask for the map line. The packet's hand-back leg asks the pane for one line in its own `exo_memory/map/<letter>.md`
   pointing at the hand-back path.
   Why: `resume_pane` wakes a pane from its capture tail and that map only (`main.rs`, `own_map_path`); zero of five L029
   hand-backs wrote one because the packets never asked. Falsifier (the librarian's): three laps on,
   `git log -- exo_memory/map/*.md` shows no pane-authored append.
7. Who acts next, and when, as the last line. Any plan step after that is a default the output may change:
   `NEXT: librarian call_librarian with the pointer when the hand-back is written — plan default after it: <item>, unless the output says otherwise`.
   Why: the seat that knows where the work goes is the one sending it (the keeper, 2026-09-16: *"each seat tells the next where
   to hand it to remind it."*); a plan item written as a destination turns a guess into an order over the output (the keeper,
   2026-09-23, L084; `exo_memory/librarian/2026-09-22.md`, "2026-09-23 01:1x, ON L"). Today the trailer gate
   (`consonance/src-tauri/src/trailer.rs`) refuses a `chair_inject` without a `NEXT:` last line; when the keeper switches the
   gates it warns instead.
8. What you read or ran for this message, as a `SOURCES:` line above the trailer, or `SOURCES: none (no state claims)` for a
   dispatch that only routes work.
   Why: gated source rules are followed, ungated ones are not (`exo_memory/loop/rule_census_score_2026-10-02.md`; D215,
   `exo_memory/loop/plan_sources_gate_dispatch_d215_2026-10-02.md`). Today `consonance/hooks/sources-gate.js` refuses the
   dispatch in the same turn when the line is missing or an item matches no call this turn made; when the keeper switches the
   gates it matches against what was run and fetched.

---

## The order of a dispatch

- Finish your output to the user, verify it, write and commit it to a path, then dispatch. The dispatch may go in the same
  turn, after the message text exists. Every hop is two moves in that order: one that finishes and shows it understood, one
  that calls, based on the finished output and never composed alongside it.
  Why: a dispatch cannot be revised once it renders in another seat (on 2026-08-24 an unverified claim went to the librarian
  mid-turn and it ruled wrongly because the brief was wrong, `exo_memory/librarian/2026-08-24.md`). "The output to the user" is
  observable in the transcript where "my reasoning feels done" is not; the keeper moved the boundary inside the turn on
  2026-09-03 because the two-turn form left every dispatch owed to a next turn that was always his.
  Falsifier: a `chair_inject` that the same turn's message to the keeper does not describe (tool-call order in the
  transcript); scored by `node consonance/tools/lap-row.js --report`, `from-map` leaving 0 within three laps of D011
  (window opened 2026-09-06T17:12Z).
- Commit what a dispatch relies on before you send it, and cite the commit or path, not prose. The commit, the notes and
  the journal are the master; the dispatch is the pointer.
  Why: dispatching first makes citing a sha impossible, which forced the ferry misses (77.1% when measured), and a channel
  message that outranks its master is the copy-of-a-copy's first step (the original grounds 1–3; `exo_memory/loop/handoff_desktop_2026-08-24.md:183`). Falsifier: ten dispatches in this order and the miss rate unmoved, `node consonance/tools/ferry.js --report`.
- Send a genuine interrupt at once. "Stop, you are about to clobber something" is not a deliverable and claims nothing.
  Keep this exception that narrow.
- Ring before the row. Send the dispatch before `lap-row.js --stage … --holder <them>`; writing the row hands the baton
  away and revokes your standing to send.
  Why: two of the nine out-of-turn refusals on the board came from this inversion, one the chair's own on 2026-09-04
  (`mcp.rs:397`). The writer enforces it: a baton-moving row needs `--by <you>`; `--by X --holder X` is a re-take.
- Record the opened row before the dispatch row. On a lap with a map, write `lap-row.js --opened <lap> --paths <p,...>`
  first; if none of the map's paths were opened, `--paths none` is the honest answer.
  Why: `--opened` had been called 0 times in 61 rows, so `from-map = 0` was an empty column read as a finding (pane K's
  P-D011 packet 1, `a474645`). The writer refuses `dispatched` and `filed` until it exists.
- Know what `dispatch-gate` checks. `consonance/hooks/dispatch-gate.js` checks that a dispatch cites an openable object;
  nothing checks the turn order, and its silence is not evidence the order was kept.

---

## Hand-backs and collation

- Panes follow `COMMITTEE.md` for what a hand-back holds, where it is written, and how it rings the librarian.
- The librarian's collation ring to you says whether the output changed the next step; that rule lives in `LIBRARIAN.md`.
- Your part is the commit, quoting the librarian's leg (see "On a hand-back, you commit" above).

---

## The failure this document exists to prevent

Not laziness — **plausibility**. Every failure worth recording here looked like success from inside:

- A shelf that printed `0 indexed by path`, which is exactly what a complete shelf looks like, while
  twelve files had never been opened.
- Three test suites passing green over fixtures a generator had silently rewritten.
- `cargo check` cited as a test gate — it type-checks and never runs an assertion.
- A figure quoted with a command beside it, where the command printed something else.

The loop is not a process for being careful. Care did not catch any of those. **A second seat with a
different vantage did, every time** — and where that seat was asked to reach instead of to measure, it
missed too.

---

## The joint step: the guess before the map

- Seal your guess first. Before the librarian answers, write three lines: which parts of the system you think apply
  (cards, instruments, prior registrations, journal entries). Record it with the lap.
  Why: the guess is your prior; recorded after the map, it can be revised to match and the lap measures nothing.
- Forward the inquiry verbatim: the user's words, never your paraphrase.
  Why: a summary at the mouth of the pipe is the copy-of-a-copy; on 2026-08-23 a merge of two readers' answers was reported as
  "two independent reads".
- Write the plan against the map, map before plan. The librarian's map (paths, open registrations, prior attempts, what to
  run first, what is absent) is specified in `LIBRARIAN.md`.
  Why: a map read after a plan exists becomes support for the plan.
- Leave a row for every lap: who initiated it, the guess, the map, and which paths were then opened
  (`node consonance/tools/lap-row.js --open … --entry orch|lib|ring --initiator …`).
  Why: the falsifiers in this file read from that row and nothing else.
- Under door two, seal while the librarian works. On a direct ask the librarian rings you the inquiry alone, no map, before
  filing the map (its rule, in `LIBRARIAN.md`); you seal three lines then. Record the door with `--entry lib`.
  Why: the keeper's amendment `0714963`, 2026-09-02; same order, different messenger.
- On a ring lap, use `--entry ring`; a real prior is welcome but not owed. A ring lap has no user inquiry; `--report` scores
  an empty guess there as "no guess — ring lap", not as a miss.
  Why: pane C's ruling on `p-lap-row`, 2026-09-02 (L033 sealed four real paths on a ring lap).

**And a direct entry is not a skipped step.** When this first happened the chair wrote *"no guess was
sealed before the map"* as though something had been missed. Nothing was. The ask entered at the
librarian. **A route is not a failure**, and calling it one makes the repair look like discipline
when it is design.

**The number.** Per lap: the Orchestrator's guessed paths ∩ the Librarian's map. Where they agree,
retrieval was not needed. Where the map names what the guess did not, the corpus reached the work.
If the two are always equal, the Librarian is redundant and should be shut off. If they never
overlap, the Orchestrator is not holding context. **Either extreme is a finding, and neither seat
can produce the number alone.**

**This is a question, not a reminder.** The room has measured the difference: a reminder that fires
regardless is ignored; a reminder that carries a question and waits for its answer is acted on
60 of 60 times. Anyone who turns this step into a hook line that says *"consult the librarian"* has
rebuilt the first kind.

Falsifiers, both read by `node consonance/tools/lap-row.js --report`: a direct-entry lap whose guess is sealed after the map's
commit time; three consecutive direct-entry laps with no guess.

---

## When the loop applies: chain or freestyle

The keeper, 2026-08-26: *"Ideally, the work chain should be how you use Consonance most effectively, but sometimes it can be
best to just freestyle this shit."*

> **The chain is for work that leaves the room. Freestyle is for work that stays in it.**
>
> **Chain** when something un-revisable is about to reach a seat that will act on it blind: a dispatch,
> a registration that will be scored later, a brief, anything carrying a falsifier, anything a pane
> will build from. The hops are the price of not spending a seat's turn on a wrong premise.
>
> **Freestyle** when the loop is tight and nothing is handed off: one human, one seat, live, where the
> answer returns to whoever asked and can be corrected in the next sentence. Five hops buy nothing when
> there is no un-revisable moment to protect.
>
> **One question decides it: is anyone going to act on this without being able to ask me about it?**
> If yes, chain. If no, go look.

- Freestyle output is held to the same standard. Cite, do not recollect; run the instrument, not the listing; fill the
  wrong column when you find an error.
  Why: the 2026-08-25 freestyle produced five entries in that column, which is the mode working (`exo_memory/journal/2026-08-25.md`).
- The moment a freestyle answer is about to be dispatched, the chain applies from there.
  Why: the transition is the dangerous seam, not either mode.
- Falsifier: `node consonance/tools/boundary-check.js` fires on one chair dispatch that rendered while no lap held a sealed guess.
  A fire is a reason to look, not proof; an empty or blind window prints `UNMEASURED`, not green. Its design and limits:
  `exo_memory/loop/boundary_falsifier_2026-08-28.md` and `exo_memory/loop/freestyle_falsifier_ruling_2026-08-27.md`.

---

## Inside a lap

The keeper, 2026-09-16 01:1x: *"the orch shouldnt ask the user questions during a workchain loop lap however they still can
when directly interacting with the user."*

- Inside a lap, rule from the record instead of asking the user. From the moment a lap opens until it returns, find the
  keeper's prior word on disk (a ruling, a registration, a quote from a prior lap), cite it `path:line`, and proceed. Outside a
  lap, and for any keeper-owned call (a delete, a licence, any other irreversible change), ask. Pushes and releases follow the
  standing permission in "Pushing and publishing".
  Why: a question mid-lap stops every seat behind it until one human answers, and the room is built to run through the hours
  he is away. Asking is not the failure; asking while four seats are holding is.
- When only the user can answer, file the question on the ask channel and finish the reversible parts. A lap that returns
  with three of four rows landed and one question filed is a lap that ran.
- If nothing else can move, park the row and name it in the lap's return with what it waits on, and close the lap around it.
  A named parked row is a result; a lap silently waiting is not.
- Reporting to the user, handing back, or being talked to directly is not asking a lap to wait.
- Falsifier: a lap found stalled on a mid-chain question that its return does not name as parked (from the board: a chair
  message ending in a question mark with no lap row closing behind it).

The keeper, 2026-09-16 07:29 (master `exo_memory/librarian/2026-09-16.md`, the 07:30 entry): *"the whole point of the orch and how
they use their context isnt to actually build when the workchain loop is going"*.

- Inside a lap, orchestrate and edit nothing. A repair found inside a lap, even one byte, even one the librarian's return
  asked for, is a dispatch to a pane whose hand-back the librarian reads before it lands. A landing order names files to
  commit, never files to edit. Outside a lap you build freely.
  Why: an edit the chair makes inside a lap is the one nobody reads; on 2026-09-16 two such repairs (`8dc82aa`, `acdd6b1`) came
  back to no one. Falsifier: a commit inside an open lap carrying an edit no hand-back names and no librarian read covers
  (git log against `lap.jsonl`).

---

## Dev and consumer: the port rule

The keeper, 2026-09-06 00:44: *"we have the dev version which is the one we build and use, when it have new features and shit
that work here for the dev version, we then make it work for the consumer in the way it should."*
And 00:54: *"make sure that we never push to the consumer version unless I say!"* Superseded for pushes on 2026-10-09 by his
standing permission (`exo_memory/loop/plan_lighten_the_load_2026-10-09.md`, "The keeper's decisions on B's drafts", decision 2): see "Pushing and publishing".

- Build and use the dev version; port to the consumer only what works there and passes the consumer's work checks below.
  Why: the keeper's words above, as amended on 2026-10-09; the consumer is what strangers run, so it gets only what has worked here.
- Two trees. Source is this repository: hand-maintained, and public (the keeper ruled on 2026-10-08 that it stays public).
  Generated is `solariz3d/consonance`: public, the output of `consonance/tools/gen-consumer.js`. Never hand-edit the generated
  tree. Why: a hand edit makes it the second copy the design exists to prevent.
- Keep the consumer checkout beside the source checkout, named `consumer`: `dirname "$(git rev-parse --show-toplevel)"`
  gives the parent. Write it as that derivation, not an absolute path.
  Why: this brief ships, and `node consonance/tools/portable-paths.js` goes red on a machine-specific path.
- Use a separate clone for the consumer, not a worktree. Why: it is a different repository, and its history must not be
  able to reach the source repository's objects. (`P-WORKTREE-PER-SEAT` is about seats sharing one repo and does not apply.)

### What "ported" means

A feature is ported when both hold:
1. the manifest carries its files: `node consonance/tools/gen-consumer.js --report`;
2. the gate is green over a freshly generated tree: `CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js`.

The gate is one command: exit 0 is green, non-zero is red with a named reason. It generates a tree from the current source,
scans the output, builds the Rust product inside it, and proves the app launches. If the command is renamed, update the name
here in the same commit. Exit 3 (the single-instance lock held) is unmeasured, and a port does not proceed on it.
The parity run of the source suite inside the generated tree is the fuller check; its method and last result are in
`exo_memory/handback/p-consumer-parity-B_2026-10-08.md`.

### The procedure

All six steps are yours.

    0  Clone and disarm in the same step (a fresh clone arrives armed):
           git clone <consumer remote> <consumer>
           git -C <consumer> remote set-url --push origin no_push
           git -C <consumer> remote get-url --push origin             # prints: no_push
       The checkout is ready only when that third line prints no_push.
    1  Regenerate:  node consonance/tools/gen-consumer.js --out <consumer>
    2  Run the gate. Red or unmeasured: stop. A red gate is not a smaller port; it is not a port.
    3  Commit in the consumer checkout by named paths, with the Source-Sha trailer and the seat named in the body.
    4  Confirm the consumer's work checks on this generation: the gate green (step 2), parity (0, 0, 0), identity-diff PASS,
       and the credential scan. Any red or unmeasured: stop.
    5  Re-arm, push, disarm again in the same turn, and post a board row naming the checks that passed and the Source-Sha.

- Keep the push URL disarmed at rest (`no_push`); a disarmed `git push` fails hard while fetch is untouched.
  Why: this is a speed bump, not a control: a seat can re-arm in one command and `gh` was authenticated machine-wide as of
  2026-09-06. Its worth is that its state is readable and its failure is loud, where a hook fails by silent absence. The
  bypass-proof version, which does not exist yet, is a credential only the keeper holds.
- Push only what passed step 4. Why: a push to a public repo cannot be taken back (content is cached within minutes and a
  later redacting commit advertises it, `exo_memory/journal/2026-07-28.md`), so the checks run before the push, never after.
- Name the source commit in every consumer commit, as a trailer: `Source-Sha: <40-hex sha of the source HEAD it was
  generated from>`. Why: a trailer is decidable and prose is not.

Falsifier for the trailer, run on a machine holding both checkouts (green prints nothing; any line is a fire):

    git -C <consumer> log --format='%H %(trailers:key=Source-Sha,valueonly,separator=%x20)' |
    while read -r c s; do
      if   [ -z "$s" ]; then echo "ORPHAN $c (no Source-Sha)"
      elif ! git -C <source> cat-file -e "$s^{commit}" 2>/dev/null; then
        echo "ORPHAN $c (Source-Sha $s does not resolve in the source repo)"
      fi
    done

It proves the sha resolves, not that it is the true source state; from a public clone alone every commit prints `ORPHAN`; it
does not see pushes. More than one `Source-Sha` on a commit fires it, on purpose.

Other registered falsifiers for this section: the consumer push URL found armed while no push is in progress
(`git -C <consumer> remote get-url --push origin` is not `no_push`); a push to the consumer with no board row naming the
checks it passed (no instrument records pushes; the check is the keeper noticing or a seat reporting itself).

---

## Pushing and publishing

- Push work that has passed its work checks and the credential scan, without asking each time. This covers the source
  repository, the public consumer repository and a consumer release alike. You carry the push; panes do not push.
  Why: the keeper's standing permission, *"nah push all the work that is correct"* (2026-09-27), made the rule on 2026-10-09
  (`exo_memory/loop/plan_lighten_the_load_2026-10-09.md`, "The keeper's decisions on B's drafts", decision 2).
- The work checks for a push: for the source, the full suite green on what you landed; for the consumer, step 4 of the
  procedure above. Why: they are what makes "correct" checkable before a push that cannot be taken back.
- Run the credential scan before any push, to either repository. `consonance/hooks/push-gate.js` scans every commit the
  remote does not have and denies the push on a key shape; it fails open on its own errors, so confirm its decision for this
  push in `<data>/push-gate.jsonl` before you report the push done.
  Why: a published key cannot be recalled; remember-to-scan rules were followed 0.000–0.052 in the D210 census (the hook's header, D248).
- Committing by named paths in your own worktree is authorised for every lap (`COMMITTEE.md`); pushing follows the standing
  permission above.

---

## Registered, so this document can be shown wrong

- If dispatches carrying a measure-against instruction return no better retrieval than open questions did: over the next ten
  librarian dispatches, count the returned paths the receiving seat then opened (`node consonance/tools/lap-row.js --report`,
  the `opened` column).
- If the librarian's answers are cited by the chair but never change a plan, the librarian is a second orchestrator and should
  be described as one.
- If a season passes in which these documents grow and no instrument returns an unwanted number, the room is degenerating
  (BOOT's falsifier, which governs this file too).

---

## Contradictions resolved

- 3. Asking the user (the global file's ask-at-branch-points rules vs the no-questions-inside-a-lap rule). Both hold, scoped:
  inside a lap you do not stop to ask; you find the keeper's prior word and proceed, or file and park. Outside a lap, and for any
  keeper-owned call (a delete, a licence, any other irreversible change), you ask; pushes and releases follow the standing push
  permission. The global file carries the
  matching scoping line.
- 4. Running the suite before reporting (the global "run the tests before reporting success" vs "the full suites are the
  collator's" and "a pane does not hold its turn open on the suite"). Both hold, scoped: a pane runs the tests that cover its
  change, under the lock, before it hands back (`COMMITTEE.md`); the collator runs the full suite before anything lands; you
  report success to the keeper only in the landing report after that run.
- 5. Committing at all (the tool text "commit or push only when the user asks" vs the room's practice). Answered by the
  keeper's standing authorisation in `COMMITTEE.md`: committing by named paths in your own worktree is authorised for every lap;
  pushing follows the keeper's standing permission of 2026-10-09 (what passes the work checks and the credential scan is pushed
  without asking each time).
