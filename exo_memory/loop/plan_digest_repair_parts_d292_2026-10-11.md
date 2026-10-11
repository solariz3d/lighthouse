# The keeper's two answers, built: repair the session digests, and log the part count on every dispatch. Librarian, on D, 2026-10-11 04:0x. Lap D292.

The keeper's answers (2026-10-11 ~04:00, to the two D290 decisions in `loop/plan_retrieval_resume_d290_2026-10-11.md`):
- Digests: **"2, 14kb is nothing lol"**, that is option (B), repair them, and keep them on the wake.
- H2: **"Don't run; log part counts"**. The 66-pane-hour test stays sealed and unrun (`loop/h2_registration_2026-10-11.md`); the free `parts` field goes in.

Two parts. They share no file, so they run in parallel.

## Part 1 — E: repair the dated digests (E measured them, `handback/p-digestwriter-E_2026-10-11.md`)
- **(1) Catch-up:** at SessionStart, write any missing past local day from `event_log.jsonl`. Days that already have a digest stay as they are, unless (2) changes their content; then say which days were rewritten. Cost measured at about 40 ms.
- **(2) Local date:** select rows by the LOCAL date of their timestamp, not by a UTC-prefix string, in `session-end.js` (`:170`) and in the catch-up.
- **(3) Honest count:** the headline says "N turn ends from M sessions" (distinct `session_id`), not "N sessions".
- Both copies stay in step: the live `~/.claude/shell/hooks/` and the repo's `dev/shell/hooks/`, with the installer's sync. A shared hook: run the tests that spawn it (`session-start-light.test.js` and any digest tests) and trace its other readers.
- Rows red first: the 10-02 empty-file case (an early-morning end), a late-evening end (it must not count the next UTC day), a missing day caught up, and the label.
- Hand-back: `exo_memory/handback/p-digestrepair-E_2026-10-11.md`.

## Part 2 — A: a `parts` field on the dispatch row (A proposed it, `loop/loop_friction_A_2026-10-09.md:127`)
- Every lap dispatch records how many parts the plan split the work into (1 for a single pane), so split against single can be read later by part count. It's observational, and B's registration says what it cannot settle (`h2_registration_2026-10-11.md` §8).
- A finds where the `dispatched` row in `lap.jsonl` is written (the app or `lap-row.js`), adds `parts`, and decides how the chair supplies it (from the plan's part list, or a flag on the dispatch). A row with no `parts` stays valid: old rows have none, and readers must not break.
- Rows red first, and the readers of `lap.jsonl` traced (lap-row, the pulse, state-block, any scorer).
- Hand-back: `exo_memory/handback/p-partsfield-A_2026-10-11.md`.

## Both
Worktrees on G:. Heavy runs go through main's `heavy-run.js` by absolute path. Run the ratchets after committing. Commit by named paths, and don't push. After both: the librarian collates; the chair lands, runs one js-suite in a clean worktree on G: (plus cargo test if A touches Rust), and pushes.
