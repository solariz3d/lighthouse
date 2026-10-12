# A check at the point of claim: a state or figure claim goes out only when the same turn ran something that could show it wrong. Built behind a switch for the 10-17 decision. Librarian, on D, 2026-10-11 23:4x. Lap D305.

The keeper, 21:34: "lets continue work till we figure it out". D303 (ledger D304) found the room's largest error cause: **a check was at hand and not run, 61.4–72.7% of decidable claim errors, CN 27 against 9 missed lookups,** with no source type holding half, so the habit is the cause and B's bar says enforce at the point of claim, not add a rule (`loop/plan_unchecked_claims_d303_2026-10-11.md`, SCORE, :32-62).

## Why the existing gates do not do this
- SOURCES (`consonance/GATES.md` §1) checks that a listed path was OPENED this turn. The reply slot (§2) checks that a Sources line EXISTS. Neither asks whether the claim's own figure or state appears in anything the turn ran. Gate catches: 0 in 383 refusals (`handback/p-scoreboard-E_2026-10-11.md` §0).
- The CN units are claims like "fills the window before I open a file", "prints unconditionally", a count read off a digest and never checked. Their check sources: compute 10, fs 8, log 4, board 4, process 4, other-repo 2 (`handback/p-causeread-E_2026-10-11.md` §1).
- Prior art to build from, not redo: claim recognition `exo_memory/loop/claimrec/` (L115–L119, a recognizer with model readers); the reply slot's replay over 340 past replies (`loop/reply_slot_replay_2026-10-03.md`), the model for a replay test; E's `find.js` and `turn.js` (`handback/p-causeread-E_2026-10-11_evidence/`), which already locate an erring turn and print its tool calls and results.

## Does not touch the H3 trial
Built and replayed only. It ships behind a switch that defaults OFF; the keeper's 10-17 decision switches it on, or not, with this lap's replay beside H3's score.

## The parts
**Wave 1, in parallel:**
1. **B: the bar, sealed before any replay.** Replayed over the census, what share of the CN (27) and CU (5) units must the check stop (it would have refused the claim as made)? What false-refusal rate is acceptable on claims that were RIGHT, drawn from the 10-10 re-measure's verdict files (`loop/remeasure_score_2026-10-10.md`), and on a week of live replies, using the reply slot's own "more than 1 in 3 still blocked" rule as the ceiling? Name what each outcome changes. B's guess in its own section.
2. **E: the design, a document, no code.** (a) Which sentences count as a state or figure claim: figures (counts, percentages, digests, versions, times) and state words (running, landed, pushed, green, open, filed, done, absent). (b) The match rule per source type: a figure claim is backed when the figure appears in a tool result of the same turn, or follows by a shown computation; a state claim is backed when a command in the turn read that state (git for landed/pushed, a process list for running, the board for a seat's status, the file for fs). (c) What a refusal says and how a seat answers it. Same shape as SOURCES: open or run, then re-send, or drop the claim, or mark it `inferred:`. Work the census's CN units as examples.
3. **A: the replay harness.** Given a checker (a function: turn → refuse/allow with the claim it flagged) and a set of turns, report caught/missed on the census units and refusals on the right-claim sample. Plug-in interface so C's build drops in. Use E's `find.js`/`turn.js` to locate each unit's turn. Freeze the unit and sample lists with named digests. A stub checker (always refuse, never refuse) proves the harness counts both ways.

**Wave 2, after all three are committed:**
4. **C: the build, behind a switch that defaults OFF,** as a hook beside `reply-slot.js` / `sources-gate.js`, reading `claim_check` from `~/.consonance.json` like `handback_index`. Rows red first; mutants. Then A's harness on C's checker → the numbers against B's bar.
5. **Librarian: score.** B reads the replay as non-author.

Worktrees on G:. Every node and cargo run under the heavy-run lock. Commit by named paths; do not push. Dispatch rows carry `--parts 4`; the chair writes a `working` row at dispatch.
