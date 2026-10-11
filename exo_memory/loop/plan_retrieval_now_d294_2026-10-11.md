# Retrieval, now: the scoreboard, the reach, and the one experiment never run. Librarian, on D, 2026-10-11 07:4x. Lap D294.

The keeper, 07:47: "lets do it now tf". Retrieval had no real progress since 10-03 (QS2S closed NOT USABLE, `loop/plan_finish_retrieval_2026-10-03.md:88`). The last day was plumbing (D287–D292).

**What the line is for**, in the record's own words (`map/M.md:340-348`, 08-31): a seat that reaches for the right check at the moment it applies, without being told. The scoreboard named then: **who catches the errors — the keeper, a seat after the fact, or an instrument in-stream** — and the finder should shift toward the instrument. That scoreboard has never been run since the gates went in (SOURCES gate 10-02, reply slot 10-03, trailers). Retrieval is two problems (`map/M.md:935`): REACH (the right file never fetched) and COMPOSITION (reached, then lost while writing).

Three parts, no shared file, run in parallel. B is the non-author reader of all three hand-backs before I score.

## Part 1 — E: the scoreboard (MEASURE ONLY)
- Every catch on the record 09-01 → 10-11, classified by FINDER: keeper / seat after the fact (second reader, pane reading a hand-back, a seat's own later correction) / instrument in-stream (a gate refusal that changed what was sent, a test or ratchet red before landing).
- Sources: `consonance/tools/catch-ledger.js` reads only `muscle_map.md` + `journal/*.md`, and the journal stops at 09-22. So add: the librarian notes' WRONG entries (`exo_memory/librarian/*.md`), hand-backs' "corrections to myself" sections (`exo_memory/handback/`), and the gate logs in `C:\Consonance\data\` (`sources-gate.jsonl`, `reply-slot.jsonl`, `dispatch-gate.jsonl`, `second-reader.jsonl`, `push-gate.jsonl`, `delete-gate.jsonl`). A gate refusal counts as a catch only if the resent message differs in a claim, not only in the trailer (B's D276 split: `loop/loop_friction_B_2026-10-09.md`).
- Output: a table by week × finder, every row walking back to a line. Extend catch-ledger.js if that is the cheap path (tests red first); otherwise a script in the evidence folder.
- Hand-back: `exo_memory/handback/p-scoreboard-E_2026-10-11.md`.

## Part 2 — C: REACH, re-measured (MEASURE ONLY)
- On 08-22: corpus 26,265 lines, **0.62% in context at wake, 25.7% reachable via a pointer, 74.3% unpointed** (`journal/2026-08-22.md:631-636`). Find the method that produced it (that journal section and its commit), and re-run the SAME method on today's corpus and today's wake (the shelf now carries 13 files in full, indexes 298 and drops 515 from the index window — this session's own SessionStart).
- Report the same four numbers, plus what moved them, and what share of the dropped 515 was opened in the last 14 days (the read ledger, `C:\Consonance\data\read_ledger.jsonl`, if it records it).
- If the old method is not recoverable, say so and state the method used, rather than present a new number as comparable.
- Hand-back: `exo_memory/handback/p-reach-C_2026-10-11.md`.

## Part 3 — A: the cheapest experiment, never run (`research/the_retrieval_problem_outside.md:268-271`, item 4)
- Registered 08-30: a TRAILING reminder at the end of context restored 90–100% compliance in the paper; mechanize it in the hook, score over twenty dispatches against the 98.1% turn-boundary violation baseline. 09-01 note: "the hook test itself is unrun".
- First: establish whether it ever ran since 09-01 (grep the record; the NEXT-trailer gate may have replaced the turn-boundary rule — if so, the 98.1% baseline no longer applies and A says what the live equivalent is).
- If unrun and still meaningful: register the bar in a sealed file BEFORE code (`exo_memory/loop/trailing_reminder_registration_2026-10-11.md`), then build it in SHADOW (logs, never changes what is sent) in the existing pulse hook, red first, tests that spawn the hook, and trace its readers. It is a shared hook: the light-mode wording stays short.
- Hand-back: `exo_memory/handback/p-trailing-A_2026-10-11.md`.

## Registered now, before any part runs (librarian)
- **P1 (scoreboard):** of catches 10-03 → 10-11, instrument in-stream is **≥ 25%**; of catches 09-01 → 09-30 it is **< 10%**. If the later share is under 25%, "the gates moved catching in-stream" is wrong.
- **P2 (reach):** today's unpointed share is **≥ 74.3%** (the corpus grew and the index window drops 515 entries). If it is lower, the shelf's windowing did not cost reach, and I was wrong.

## Both / all
Worktrees on G:. Heavy runs through main's `heavy-run.js` by absolute path. Ratchets after committing. Commit by named paths, don't push. Every dispatch row carries `--parts 3`. After all three: B reads the three hand-backs, the librarian collates and scores P1/P2; the chair lands anything A built, one js-suite in a clean worktree on G:, push.

NEXT: chair dispatch D294 parts 1–3 to E, C and A (`--parts 3`) when this plan is read
