# P-COMMIT-GATE — hand-back. A (ALPHA), 2026-09-02, L033.5.

Packet `exo_memory/loop/packet_commit_gate_2026-09-02.md` (`ec85189`), plus the amendment removing
§5 (`librarian_map_path` → BRAVO). **I did not enter `main.rs`.**

Files, all uncommitted, all mine:

    consonance/tools/commit-gate.js          new
    consonance/tools/commit-gate.test.js     new
    consonance/githooks/pre-commit           new  -- NOT consonance/hooks/; see below
    exo_memory/handback/p-commit-gate_2026-09-02.md
    exo_memory/map/A.md                      one appended line

**Nothing is installed. `core.hooksPath` is untouched.** Arming the gate is a live decision with
four panes working and it is the chair's, not mine — the command is printed by `--install` and I
did not run it.

## THE ANSWER TO §7 FIRST, BECAUSE IT DECIDES WHAT THE REST IS WORTH

**A pre-commit hook is not theatre, but it is not the control you would want either, and the reason
is not `--no-verify`.**

**It is a real control against the REFLEX.** What happened at 06:52 was `git add -A` typed while
thinking about two other packets. A hook intercepts exactly that, at exactly that moment, requiring
no memory from the person who has just demonstrated they do not have it available. That is the
whole and sufficient case for it, and it is why a WRAPPER the chair must remember to call is
strictly worse: it depends on the discipline that just failed. A rule its violator can recite is
not a control; a wrapper its user must remember to invoke is the same rule with a shell script
around it.

**Its real failure mode is not bypass — it is SILENT ABSENCE, and today it is absent.** Measured,
just now, against this checkout:

    node consonance/tools/commit-gate.js --armed
    -> commit-gate: NOT ARMED — no pre-commit hook at C:\Consonance\lighthouse\.git\hooks\pre-commit
       exit 1

`core.hooksPath` is unset and `.git/hooks` holds nothing but samples. **There is no git hook in
this repo and there never has been.** An absent gate and a gate that allows everything produce the
identical observation: commits succeed. That is this room's recurring shape — the dead thing and
the quiet thing sharing one footprint, which E found again in the capture watcher four hours ago —
and shipping a hook without a way to ask whether it is live would have added an instance of it
while claiming to fix one. So `--armed` exists, it exits non-zero, and **the answer today is NO.**

**Every bypass I found, including the chair's, named rather than softened:**

1. `git commit --no-verify` / `-n`. Steps over it completely. Nothing records that it happened.
2. **Not installed.** `core.hooksPath` is local config; a fresh clone, the desktop machine, and a
   worktree all have no gate and no message saying so. `--armed` is the only thing that can tell
   you, and only if someone runs it.
3. **`git checkout -- <path>`, `git restore`, `git stash`.** These DESTROY an in-flight file with
   no commit at all, so no pre-commit hook can ever fire. That is a worse outcome than capture and
   **this gate does not touch it** — the room has already lost a `main.rs` to a command nobody had
   warned about, which is the same shape.
4. **`git rebase` / `git merge`** replay commits without running pre-commit in the normal case.
5. **A packet that forgets to claim a path.** The gate is exactly as complete as the `WHAT YOU OWN`
   blocks. This is not hypothetical and the evidence is my own work — see the live dry run below,
   where `consonance/githooks/pre-commit` is dirty, is mine, and is NOT protected, because the
   packet said `consonance/hooks/` and I created a different directory.

**The only bypass-proof control is structural, it is not a tool, and it is the chair's call: one
checkout per seat.** Git worktrees, one per pane. A seat then physically cannot stage another
seat's file, and no discipline, hook or ownership block is required for it to hold. The cost is
real: the shared checkout is deliberate — seats see each other's work, `git status` is a shared
instrument, and the chair lands everything from one tree. **Priced honestly, that is a night of
work and a change to how panes are launched, and it would have made this entire packet
unnecessary.** I am not building it uninvited; I am naming it because everything in this file is a
mitigation and that is the fix.

## THE GATE

    consonance/tools/commit-gate.js      check + report + armed + CLI
    consonance/githooks/pre-commit       the hook (NEW directory -- see the deviation below)

**The rule it enforces is RELEASE, not routing** — the packet's correction to the librarian's
08-26 remedy, which prescribed seat-routing that cannot constrain the chair because the chair is
the committer by design:

> A file is committed only by the seat that HOLDS it, or by the chair AFTER that seat's hand-back
> is filed. **The hand-back is the release.**

**Ownership is derived from artifacts that already exist. Nothing is hardcoded:**

    data/lap.jsonl                 the lap id, whether it is DISPATCHED, and the newest dispatch
                                   timestamp for that lap (L033 dispatched three times; the
                                   freshness bar moves with the latest)
    exo_memory/loop/packet_*.md    a packet whose text names the current lap is a live dispatch.
                                   Parsed for addressee (NATO callsign -> letter), the paths under
                                   WHAT YOU OWN, and the hand-back path it demands.
    exo_memory/handback/*.md       a hand-back filed AND newer than the dispatch releases that
                                   packet's paths.

**I did not use the board.** Its dispatch rows are prose (`chair injected -> <paneid>`) and would
need four hops to reach a path; the packet already states ownership in a block written to be read.
**The cost is that the packets' `WHAT YOU OWN` blocks are now load-bearing**, and that is stated in
the tool's own header rather than buried here.

**THE ASYMMETRY, chosen and arguable:** unreadable STATE fails closed (refuse everything); an
UNCLAIMED PATH is allowed. The second half is bar 5 — the chair must land a packet or a ledger row
in one step, and those are exactly the files no pane owns. Failing closed on unclaimed paths
deadlocks the chair on the night it is installed, and a gate nobody can ship past is disabled
before morning. **The cost is hole 5 above, and it is not hidden.**

## THE BARS

**BAR 1 — the pair the packet asked for.** `consonance/ui/chain-indicator.js` while E holds it and
no hand-back exists → `REFUSE`, `holder: 'E'`, and the printed refusal says `pane E`. The same path
after the hand-back is filed newer than the dispatch → `ALLOW`.

**BAR 2 — both `git add` forms, in a real repository that is not this one.** The two cases
`git init` a fixture repo, commit a base, dirty the file, then stage it via `git add -A` and via
`git add <named path>`; both produce the same staged set and both are refused naming E. **Nothing
in this test file touches the live checkout** — B, C and E are dirty right now, and a test that
staged in the shared tree to prove a point about capturing other seats' work would be the joke
writing itself.

**BAR 3 — MUTANT, remove the hand-back freshness comparison: APPLIED, CAUGHT.** `18 tests, 17
pass, 1 fail` — exactly `BAR 3 — a hand-back OLDER than the dispatch releases nothing`, the test
written for it. A stale hand-back from a previous lap does not release a file in flight in this
one.

**BAR 4 — MUTANT, demote the refusal to a warning: APPLIED, CAUGHT.** `18 tests, 12 pass, 6 fail`
(BAR 1a, BAR 3, BAR 4, both BAR 2 cases, and the REPLAY). The fail-closed tests correctly stayed
GREEN, because they return through a different path — the mutation is localised and the suite says
so rather than going uniformly red.

**BAR 5 — no deadlock.** `exo_memory/loop/packet_*.md` and a ledger row are unowned and pass in one
step. Asserted as its own test.

    node --test consonance/tools/commit-gate.test.js
    -> tests 18, pass 18, fail 0

## THE MEASUREMENT THAT DECIDES WHETHER THIS FILE EARNS ITS PLACE

**The incident, replayed against the REAL packets** — real ownership data from the live checkout's
own L033 packets, synthetic clock only (the hand-backs since filed would correctly release these
files now, so the clock is set back to the 06:52 dispatch):

    e6215a8's four captured paths        verdict: REFUSE, all four named
      consonance/src-tauri/src/main.rs         held by pane A
      consonance/ui/chain-indicator.js         held by pane E
      consonance/ui/chain-indicator.test.js    held by pane E
      exo_memory/map/A.md                      held by pane A

**And a live read-only dry run against the currently dirty tree**, which is the strongest thing I
can show because nobody arranged it:

    node consonance/tools/commit-gate.js --paths $(git status --porcelain | awk '{print $2}')
    -> commit-gate: REFUSED — 11 path(s) are in flight in lap L033

It names `corpus-age.js` and `corpus-age.test.js` to **B**, `lap-row.js` and `lap-row.test.js` to
**C**, `chain-indicator.js`, `chain-indicator.test.js` and `map/E.md` to **E**,
`harvest_replay.rs` to **B**, and my own three files to **A** — each with the hand-back that
releases it. That output was not staged by me in any sense.

## TWO REAL DEFECTS IN THE PACKETS, FOUND BY POINTING THE PARSER AT THEM

1. **`packet_watcher_liveness` claims `src/bin/harvest_replay.rs`** — relative to
   `consonance/src-tauri/`, while every staged path is repo-relative. Exact matching alone would
   have handed that file over. The matcher now also accepts a suffix match, which errs toward
   REFUSING a path that might be held; that is the safe direction here and the wrong direction for
   almost any other tool, so it is commented as such at the function.
2. **Three of tonight's packets (`doc_about`, `doc_app`, `doc_oracle`) parse to ZERO owned paths**
   — they carry no `WHAT YOU OWN` block at all. They are from an earlier lap and are correctly out
   of scope, but the same shape inside a live lap would hold nothing silently, and **a gate quietly
   holding nothing looks exactly like a gate holding everything.** So a live packet that claims no
   paths now fails closed and names itself, which is a one-block fix in the packet.

## DEVIATIONS, both stated rather than absorbed

**The hook is at `consonance/githooks/pre-commit`, not `consonance/hooks/`.** `consonance/hooks/`
is the Claude Code hook set — `sessionstart-state.js`, `precompact-preserve.js`, `dream-watch.js`
— and none of it is a git hook. Putting a git hook among them means two unrelated hook systems in
one directory and the next reader guessing. The packet said *"name what you touch"*, so: a new
tracked directory, git hooks only. **This deviation is also the reason my own hook file is
unprotected in the dry run above, which is hole 5 demonstrating itself on the author.**

**RED FIRST WAS NOT RUN IN THE ORDER THE BAR ASKS.** I wrote the tool and then the tests, so no
test in this file was ever seen failing against an absent implementation. The two mutants supply
red on demand and the replay supplies the historical bar, but **that is not the same evidence** and
I am not going to describe it as though it were. On the map-resolver packet an hour ago I did run
red first; here I did not, and the honest reason is that I started building before I had decided
what the ownership source would be.

## WHAT I DID NOT VERIFY

- **The gate has never run as a git hook.** Every result above is the CLI or the module. The hook
  file is asserted to have a shebang and to call the tool; it has not been armed and no commit has
  been attempted through it. **The first real proof is a `git commit` that gets refused, and that
  needs an install nobody has approved.**
- **No second machine**, no fresh clone, and therefore no test of the absence case in the wild.
- **`--install` prints; it does not install.** Nothing about this lap changed git config.
- **Whether arming it mid-lap is safe.** My reading: it would allow the chair to land my files
  (my hand-back is filed, so they release) and refuse B, C and E's until theirs are — which is the
  intent, not a malfunction. But I have not run it, and turning a refusal on under four live panes
  is the chair's call and should be made with eyes open rather than as a side effect of this
  hand-back.
- **The `NATO` map is hand-written.** `letters.json` maps session ids to letters and carries no
  callsign, so the callsign→letter bridge exists nowhere else. A pane addressed by a name not in
  that map parses to `letter: null` and the refusal degrades to `UNKNOWN (failing closed)` — it
  still refuses, but it cannot say who.

## FALSIFIER, as registered

*A post-gate commit that captures an in-flight file means the gate is inert.* Checkable by grepping
the shas of any future capture against the install date. **It cannot fire yet: the gate is NOT
ARMED, and until someone runs `--install` the falsifier is measuring nothing.** That sentence is
the honest status of this entire deliverable.

Not committed. Non-author read: B is holding `main.rs`, so someone other than B.
