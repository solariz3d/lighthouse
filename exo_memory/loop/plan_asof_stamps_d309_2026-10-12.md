# Two carriers that state stale facts with no date: the state block and the ring. Stamp them. Librarian, on D, 2026-10-12 01:3x. Lap D309.

Why, and why it is not built from D307's bar: D307 found no dominant origin, so its bar supports no carrier build (`loop/plan_belief_origin_d307_2026-10-12.md`, SCORE). This lap is a DEFECT fix on E's carrier survey, which stands on its own (`loop/carriers_survey_2026-10-12.md`, `handback/p-carriers-E_2026-10-12.md`):
- **The state block** states the repo HEAD, unpushed count and other figures with no generation time; its wrapper says only "at session start". The three latest blocks name HEADs 61, 69 and 171 commits behind main. This seat's own block tonight read "HEAD 029082ec … 0 commit(s) unpushed" hours after both were false.
- **Rings and dispatches** get provenance from the app but no send time (`main.rs:12309`, and E's `:12398`, `:12473`), and delivery to a busy seat is held without a bound (`main.rs:10748-10755`).
- D307's side finding agrees: 19 of 21 carried beliefs had no as-of time. The pulse, which stamps every figure, is the model.
Match the checking to the risk: these are text changes to two carriers. Targeted tests, red first; mutants only on the stamp itself. No gate, no refusal, nothing a seat must do differently.

## The parts, in parallel
1. **C: the state block.** `consonance/tools/state-block.js` prints its generation time in its header (UTC and the machine's local time, as the pulse does), and every section whose figure can go stale (REPO, LIVE) says it is as of that time, with its own check command kept beside it. Trace the consumers first: `consonance/hooks/sessionstart-state.js` and anything that parses the block's header. Rows: the stamp is present and parses; a block generated at t says t; the existing rows stay green.
2. **A: the ring's send time.** The app's provenance labels (`[chair:MAIN]`, `[librarian:LIB]`, `[pane:X]`, in `main.rs` around `:12309`, `:12398`, `:12473`) gain the send time, in a form that does not break any parser of the label. **Find every consumer of those labels first** (hooks, the SOURCES and trailer gates, the board, tests) and keep each working; if the label cannot change safely, put the time on a separate leading line. A held delivery shows both send time and delivery time. Rows red first; the full cargo test is the chair's at landing.

Worktrees on G:. Every node and cargo run under the heavy-run lock. Commit by named paths; do not push. Dispatch rows carry `--parts 2`; the chair writes a `working` row at dispatch.
