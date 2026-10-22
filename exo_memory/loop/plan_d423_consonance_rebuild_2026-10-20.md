# D423: the Consonance rebuild batch (librarian, 2026-10-20 02:2x local)

The keeper, 17:44 yesterday: "after everything is done we will rebuild". Everything queued before it is done (my notes
02:01, 02:10 and 02:2x). The running Consonance exe was built 2026-10-14, so none of the following is live yet.

## The parts and their panes

| # | what | pane | tier | where |
|---|---|---|---|---|
| 1 | **D415**, deliveries that submit or say NOT SUBMITTED | landed already (0747277b, then 7a1cf49b) | — | main.rs `deliver` / `submit_step` |
| 2 | **`term.js:766` injectAndSend**: the same paste-then-Enter race as D415, on the JS side | C (wrote D415) | prove it (the room's own delivery) | `consonance/ui/term.js:766` |
| 3 | **D338**: Consonance raises its own priority to High and opts out of EcoQoS at start (the keeper sets this by hand today) | C | check it (visible in Task Manager, cheap to undo) | main.rs startup; nothing exists yet (my grep 20:01) |
| 4 | **The O/P ring label**: the call_librarian mount labels the Fable pane (sibling-372c8abc) `[pane:O]` and O (sibling-36313935) `[pane:N]` | O | prove it (a gate's address table) | the address table in mcp.rs / panes.json (the chair's 13:32Z finding, my note 07:32) |
| 5 | **The no-map notice**: a pane with no `exo_memory/map/<letter>.md` gets no map section and no log line. Add a short section saying its first append creates the file, plus a plog line | O | check it | main.rs:5715-5744, the `None` branch of `own_map` (my note 07:47) |

- "A librarian→pane address row" was on my 17:44 list. I can find no record of what it was beyond that line, so it is
  dropped, not guessed at. If the chair holds a record, it says so and the item comes back.
- C's parts and O's parts touch different files (term.js and main.rs startup against mcp.rs and main.rs:5715-5744).
  Both run in parallel, in separate worktrees.

## Landing (O, after both hand back and I've read them)

- Merge both into lighthouse main, and run cargo test whole.
- Also run the js tests that read term.js and the briefs.
- Push after the scans.
- Build the release exe to a staged path. Do NOT replace the running one: it is the process every pane lives in.

## The swap (the keeper's moment)

- Replacing the exe means closing Consonance, which stops every pane.
- So it happens when the keeper chooses, with nothing mid-run.
- O leaves the staged exe and the backup step ready. The keeper closes and reopens Consonance; nothing is launched for
  him and no focus is taken.
- Then I check the new build is the one running, and that a test ring submits by itself.

NEXT: chair routes parts 2-3 to C and parts 4-5 to O now; each calls the librarian; O lands when I've read both.
