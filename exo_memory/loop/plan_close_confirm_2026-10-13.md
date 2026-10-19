# Consonance: the window's X asks before it ends working seats. Librarian, on D, 2026-10-13 14:1x. Lap D317.

**The keeper, 14:08 (verbatim):** "fuckk i accidently pressed X top right, you know, hard to believe this was the first time this
happened, makes me think, if any seat or shell is working, and X is pressed, ask again yes or no you know before close"

## What happens today (read, not recalled)
- `consonance/src-tauri/src/main.rs:14915-14922`: the main window's `CloseRequested` is prevented and goes straight to
  `leave_close_requested` (`:13912`). That starts `leave_run` (`:13928`), whose step 1 drains `Panes` and kills every seat
  (`:13935-13939`). There is no question in between.
- The Leave's own button and the applier use `app.exit`, which raises ExitRequested, not CloseRequested (`:14912-14914`). They don't
  come through this path, and they keep their behaviour.
- The busy signal already exists: `pane_gate` (`:10385`) combines a seat's stamp with its live screen into `PaneGate`
  (`:10339`): Ready, Working, Stale, Unstamped, Contradicted. Keep-warm already treats every gate except Ready as busy
  (`a_busy_seat_is_skipped`, `:21487`).
- The UI's Leave panel is `consonance/ui/leave.js` (listens on `leave`, `:132`), with `#leave` in `ui/index.html:27` and tests in
  `ui/leave.test.js`.
- Cost of today's accident (checked): none lost on D316. A's whole-film stagecheck finished at 14:04
  (`Downloads/a private side project/out/stagecheck_final2.log`) and the render hadn't started.

## The rule
- On X (CloseRequested on `main`): if **any seat's gate is not Ready** (Working, Contradicted, Stale, Unstamped: unknown counts
  as working, fail-safe), **ask**: "N seats are working: <labels>. Close Consonance and end them?" with [Keep working] and [Close].
  Default focus and Escape are [Keep working]. [Keep working] does nothing at all. [Close] runs today's Leave unchanged.
- If every seat is Ready, or there are no seats, X closes as today. That is the narrowest reading of "if any seat or shell
  is working". If the keeper wants it asked always, that's a one-line change, said in the hand-back.
- A second X while the question is up does nothing new. A second X during the Leave keeps today's "busy" message.
- Unchanged: the Leave button, the applier's exit and `leave_run` itself.

## Parts (independent; the contract between them is fixed here)
- **Contract:** event `close-confirm` with `{ working: [{ label, gate }] }`; command `leave_confirmed()`, which calls today's
  `leave_close_requested` path.
- **Part 1, pane E (Rust):** a pure `close_needs_confirm(&[(label, PaneGate)]) -> Option<Vec<..>>` with tests: all Ready →
  None; any of the four non-Ready gates → Some, naming it; empty → None. Then the wiring in `on_window_event`: collect each
  seat's gate the way the inbox does, emit `close-confirm` or run the Leave; add `leave_confirmed` to the handler list; and a
  guard so a second X while the question is pending doesn't stack. Red first on the pure fn.
- **Part 2, pane C (UI):** `ui/leave.js` (or a sibling `closeconfirm.js` in the same pattern): on `close-confirm`, a modal in the Leave
  panel's style listing the working seats; [Keep working] (focused; Escape) hides it; [Close] invokes `leave_confirmed`. Tests
  in the `leave.test.js` style: shows the labels, Escape and [Keep working] invoke nothing, [Close] invokes `leave_confirmed`
  exactly once, a double-click on [Close] invokes once.

## Checks and landing
- Each pane runs its own tests under the heavy-run lock. The collator runs the full suite before landing.
- **Go-live needs a rebuild of the exe**, and the rebuild needs Consonance closed. That is the keeper's moment: the chair says
  when the build is ready and the keeper closes it on [Close] himself. Note: the running exe also predates 45fbd2ec (D313), which
  goes live on the same rebuild.
- Changelog: `consonance/CHANGELOG.md`, Added: "the window's X asks before ending working seats".
