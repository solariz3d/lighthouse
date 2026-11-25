# Packet (panes C and E, on L): two small laps that also bring both panes down to working size

Written by the librarian on L, 2026-11-25 02:1x, at his word. For the chair to number (one number each) and dispatch.

## His words (verbatim; `briefs/lighthouse_the_room.md`, 2026-11-25)

02:03: "i wonder, why hasnt c and E pane been working". 02:05: "but wouldnt it be better to get them going some how".

## Why they were idle, and what changes

At 00:19 he and I left panes C and E asleep: C wakes at about 751,000 tokens and E at about 483,000, and the first
call of each re-sends all of it. That stands as a cost (about $6 and $3.90 at list, once). What changes is his word:
they are to work. The app cuts a listed pane before a dispatch (L218; both are on the cut list), so each should arrive
at about 100,000. **Chair: say in your reply whether the cut ran before each dispatch** (the row in
`C:\Consonance\data\close-small.jsonl` or the board). If a pane starts work at full size, stop it and tell me.

## Pane C (Opus 5.5): second read of the undo ghost, track builder. Tier "check it". No code change by C.

- Read `git diff 27e2084..l229-undo-ghost` in the builder's repo (tip 2e70b9f; pane A's worktree is
  `C:\Consonance\t180-wt-ghost`, make your own). Pane A's hand-backs: `exo_memory/handback/p-l229-A_2026-11-25.md`,
  `p-l229-A-part2_2026-11-25.md`, `p-l229-A-addendum_2026-11-25.md`. Brief: `exo_memory/briefs/t180_undo_ghost.md`.
- Vary what the author fixed; do not re-run A's rows only. At least: (1) an undo after a brush stroke, a handle drag
  and a jump, then a redo: the document is the same bytes and no stale ghost or stale box values are left;
  (2) undo, type in a box, undo again: whose numbers are in the boxes; (3) a track near the history's cap: the undo
  file's size with `made` against without; (4) the anchored lines of `app/core/panel.js` that the mutation harnesses
  name still appear exactly once each (A inferred this from a grep and ran none); (5) the panel must not pull in
  node's `fs` (A caught this once; check the webview loader's rows).
- Run only the tests of the touched files and what you add. **No whole suite.** Pane B's landing is using the machine:
  `node consonance/tools/heavy-run.js --status && <run>` in one call for anything over three test files.
- Hand back **CLEAN or the line**. On CLEAN, pane A makes an internal build of that tip and installs it with a backup
  (his word of 01:46: "lemme know when all is good for me to test").

## Pane E (Opus 5.5): why the dream runner has fired and skipped since 2026-11-20. Read only. Tier "just do it".

- The pulse says at every prompt: "no dream in 4d … (newest 2026-11-20 04:30), though the runner logged activity as
  recently as 2026-11-25 00:13 — it is firing and skipping, not silent. The registration's source of truth is
  dev/dream/install_dream.ps1; the runner logs to <instance>\dreams\dream.log."
- Find the cause from the runner's own log and code: which check makes it skip, since when, and whether the same
  would happen on D. Print the log lines that show it (no transcript text, no credentials).
- **No fix in this lap.** Hand back the cause and the smallest fix as a proposal, with the row that would go red.

## Registered

- For the wake (L218's line, carried): failed on cost if a listed pane's first call of a lap reads or writes more than
  400,000 tokens. Read by me after both panes ring:
  `node exo_memory/loop/seat_context_2026-11-14.js --seat sibling-0845a868 --since 2026-11-25T08:00:00Z` (C) and
  `--seat sibling-07b8a48f` (E).
- For C's read: failed if the undo ghost is installed and he finds a stale ghost or wrong numbers in the boxes after
  an undo that C's read passed.

## Standing rules

Commit by named paths. No credentials or account details in any file or command. Long runs go to the background once
and the turn ends. Hand-back as a file in `exo_memory/handback/`, rung to the librarian as a pointer, each claim marked
checked or inferred, ending with who acts next.
