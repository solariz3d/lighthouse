# Packet (one builder pane, on L): no cut between laps when the next job continues the same work; count re-reads after a cut

Written by the librarian on L, 2026-11-25 03:1x, at his word. For the chair to number and dispatch **after pane B's
glow lap (L233) has landed**: this touches `consonance/src-tauri/src/main.rs` and `cut_at_handback.rs`, which L233
holds. Tier "prove it" for the rule, "check it" for the counter.

## His words (verbatim; `briefs/lighthouse_the_room.md`, 2026-11-25)

- 03:05: "does the builders compacting sooner really save more work if they compact every loop, losing context from the
  previous loop? In a way I know it saves context from less tokens being read, but it loses the last lap of what it done
  directly within its context? Thoughts?"
- 03:09: "but what if the panes work goes over the context limit? Can we make it so it has a natural limit, but can work
  beyond it if the runs need it?"
- 03:14: "I have no clue if you should, but we could try it. When it comes to these type of metrics I will admit I do not
  have the same level of accurate intuition as my philosophical outlooks on how everything else in nature relates to the
  rest"

## Already done by the librarian (03:1x)

Each builder's `instances/<sibling>/.claude/settings.local.json` `autoCompactWindow` 300000 -> 600000 (A 3d57124e,
B 5bf9d657, C 0845a868, E 07b8a48f; backups `settings.local.json.bak-20261125-before-600k`). So mid-lap, Claude Code's
own cut now fires at 600k, not 300k; the app's between-laps dial stays 300,000. Read at the next launch.

## What to build

1. **The exception.** The app's L218 cut (`cut_at_handback.rs`; at hand-back, and before a dispatch when cold and over
   the dial) is skipped when the next job continues the same work. Find how the app can know that from what the chair
   already sends (the lap id in the dispatch text, e.g. "L229" in "L229 addendum 3", against the pane's last lap id),
   and say why that signal is reliable. If it is not, propose the smallest explicit marker the chair would add. Red
   first: a row where the same lap id skips the cut, a new lap id cuts as today, a pane over 600k (the hard window) is
   never helped by the exception.
2. **The counter.** After a cut, count the files the pane re-reads in its first lap that it had already read before the
   cut (from the transcript's tool calls: Read and the shell's cat/sed/grep on a path). A tool or a row in
   `consonance/tools/usage-ledger.js`, read-only. Print it for tonight's two cuts (pane C 08:08Z, pane E) as its first
   measure.

## Registered (the trial, before it runs)

- **The 600k window:** failed if, over the first full working night after it, more than one builder call in five reads
  over 300,000 (panes living above the line, not passing through it), by
  `node exo_memory/loop/seat_context_2026-11-14.js --seat <each builder> --since <the launch>`; then back to 300,000.
  Also failed at once if any builder reaches 600,000.
- **The exception:** failed if, over the same night, a pane that skipped a cut by it then made more re-reads, by the
  counter, in its next lap than the cut panes made in theirs.

## Standing rules

Commit by named paths on a branch; a second pane reads the diff before it lands. No whole suite here; the landing's.
`node consonance/tools/heavy-run.js --status && <run>` for anything heavy. Hand back to the librarian, each claim
checked or inferred, ending with who acts next.
