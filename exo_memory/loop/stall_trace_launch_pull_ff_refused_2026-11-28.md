# Trace: L's launch did not take the newest build (pull refused), 2026-11-28

His words, 00:23 on L: "for some reason the newest build doesnt auto build like it does on desktop for here, also there are handoffs as well".

## What happened (checked)

- The launch's receipt, in every seat's shell on L: "origin is 115 commits ahead (fetched, not merged). The launch's pull: ff-refused at 2026-11-28T06:20:45Z". Shells were built from b79fbdc7, last night's tree.
- `git rev-list --count origin/main..HEAD` was 1: b79fbdc7, "chair (L): where the chair stands at his Compact warm seats, 2026-11-27", committed 07:44 on 11-27, after the night's closing push (07:38 to 07:40) and never pushed. One file, `loop/chair_stands_2026-11-27.md`, which origin's 115 commits do not touch.
- `launch.ps1:678` and `:717` pull with `merge --ff-only`. One local-only commit is enough to refuse it, however harmless.
- D does not meet this: there the librarian pushes after the last stop ring (`loop/handoff_lighthouse_2026-11-27-D.md`, "Pushing").

## Unwound (checked)

- `git rebase origin/main`: the one commit replayed as a0be6255, no conflict. Scanned (0 lines with the account, a home path or an email) and pushed; local equals origin at a0be6255.
- The seats still hold shells built from the old tree until Consonance is launched again. The desktop's code change is tool scripts only (`git diff --name-only 7e6dc08a HEAD -- consonance/`: heavy-run and its tests, GATES.md, the path baseline; nothing under src-tauri), so the tools are live now and no app rebuild is owed by it.

## The cause, and a fix to choose (not built)

The chair's "where it stands" note is written at Compact warm seats, which comes after the closing push on L. It was the same order on 11-25 and 11-26 (07:44, 07:39); whether those nights also refused the next pull is not checked.
- (a) The warm-seats step pushes its own note (one commit, after the scan).
- (b) The launcher, on ff-refused with local commits that touch no file origin changed, replays them (a rebase) instead of stopping, and says so in the receipt.
- (a) is smaller; (b) also covers any other late commit. The librarian's lean: (a) now, (b) as a lap for a builder pane.

**Proving check:** after the fix, a launch on L with origin ahead and a note committed after the close reads "pulled" in the shell's first line.
