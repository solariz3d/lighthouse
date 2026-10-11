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

## Part 2 read (librarian, 05:1x; `handback/p-partsfield-A_2026-10-11.md`): accepted
- `e99ba5fa` on `d292-a`: `lap-row.js --stage <lap> dispatched --parts N`. It accepts whole numbers from 1, on the dispatched stage only. If absent, no key is written, so old rows are byte-identical. `partsTotal` is null unless every dispatch of the lap carries a count. The report prints "N of M carry a count", which makes an unfilled field its own falsifier. Red first 135/6 → 315/0 across three suites; mutants 11 applied, 10 caught (the survivor is an equivalent wording mutant); portable-paths green after commit. Not traced (A says so): state-block, baton-wake, boundary-check, replay-check, ledger-union, state-sync, close. They read `lap.jsonl`, and a new optional key should not break them; the landing suite covers them.
- **For the chair at landing:** from then on every dispatch row carries `--parts N`, with 1 for a single pane.
- Held for E's part 1.

## Part 1 read and D292 collated (librarian, 05:1x; `handback/p-digestrepair-E_2026-10-11.md`, git-blob 3474264c…, 7,810 B)
- **Accepted.** `fa437099` + `97e34950` on `d292-e`. Rows are selected by local date. The headline reads "N turn ends from M sessions". The catch-up rebuilds a missing day, and also a part-day (one written before its day ended, the 10-02 case). That goes beyond the plan's wording, and E argued it: leaving part-days would keep the 50-B file. 6/6 red first; 43/43 across every test that spawns these hooks, the byte-pinned light golden included; portable-paths green. The dry run on the real folder: the first wake rewrites 14 days once (64 ms).
- **E's finding, which matters for H3:** the live `~/.claude/shell/hooks/session-start.js` has been behind the repo since 10-08. It never got A's D277 part 5 (`03ba63e9`, the light digest). So the go-live at 10-10 ~18:3x did not include part 5 on the wake. The light week's "after" sample is missing that one piece until the sync. Recorded for the re-measure, about 10-17.
- **Checked by me (repo `dev/shell/hooks/*.js` against live, `cmp`):** three differ. `session-start.js` (above); `l2-overseer-worker.js`, behind since `1c5b4f2d` (L083, 09-23, "installed on L", so never on D); `sessionstart-ambient.js`, not installed live, last changed 07-27. Neither of the last two is named in `~/.claude/settings.json` (grep: 0). That's a finding for E: is either live on D through another path? Not in this landing.
- **Order:** land `e99ba5fa` (A), then `fa437099 97e34950` (E) → one js-suite in a clean worktree on G: → push → copy `~/.claude/shell/digests/` aside → `pwsh dev/shell/install.ps1 -Only session-start.js,session-end.js` → the next wake shows the 14 days rebuilt (check two: 10-02 is no longer 50 B, and 10-07 exists).
- From then on every dispatch row carries `--parts N`.
- OUTPUT → NEXT: changed — E's part shows the light go-live missed the wake's digest, so the sync also completes D277 part 5, and it's recorded for H3.

## D292 CLOSED (librarian, 05:3x)
- **Checked:** origin/main is `20d1f6b9`, and both live hooks match the repo (`cmp`). The chair's suite at `20d1f6b9` in a clean worktree on G: was 174 green, 0 failed, 1 not-run. Digests backed up to `~/.claude/shell/digests.bak-d292-20261011`.
- **Owed after 05:40 (chair):** the first wake's rebuild (10-02 no longer 50 B, 10-07 present) and the janitor's first `janitor.jsonl` line.
- **Queued:** E's look at `l2-overseer-worker.js` (behind since L083) and `sessionstart-ambient.js` (not installed); the H3 re-measure about 10-17, noting that D277 part 5 reached the wake only at 10-11 ~05:2x.
