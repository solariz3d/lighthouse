# p-l215-gatesopen-A: -GatesOpen now only takes the key off

Pane A, machine L, 2026-11-21 ~05:10 local. The chair's order of 10:59Z, item (a): fix B's finding in `p-l215-read-B_2026-11-21.md` (lines 31-39): `-GatesOpen` given alone ran a full install. Marked checked or inferred.

## Result
1. **Fixed on branch `l215-gatesopen-only`** (worktree `C:\Consonance\lh-wt-l215b`, cut from room main ca914d09), `dev/shell/install.ps1` +4/-1, `dev/shell/install-failclosed.test.js` +17. `-GatesOpen` now empties the file sync, the registration list and the agent sync, and does not create the destination folder, so it touches only `onFailure` in settings.json. No status line, no env key, no copied file, no registration. (checked: row 7)
2. **`-GatesOpen -Only <x>` is refused** with a message naming -GatesOpen. B's suggested line (`-GatesOpen -Only <gates>`) would now scope a sync that no longer exists, and the opening never honoured -Only; so the line to document is just `pwsh dev/shell/install.ps1 -GatesOpen`. (checked: row 8)
3. **Red first:** rows 7 and 8 added to `install-failclosed.test.js` against the old script: 2 of 8 failed (row 7: settings.json differed from the seed; row 8: exit 0). After the fix 8 of 8.
4. **Mutants: applied 3 / caught 3 / NOT APPLIED 0** (each removed one of the three lines: the empty-sets line, the `-Only` refusal, the no-create-dest guard; each fails exactly 1 row).
5. **Neighbours green:** `install-holds` 7/7, `install-fresh-home` 5/5, `dream-gate` 1/1. `install-manifest` not run (no such file in this tree; B named it on the merged tree).
6. **Row 7 is on a scratch home** (`USERPROFILE` pointed at a scratch folder). Installed nothing; `-FailClosed` was run only inside those scratch homes, never on this machine's own settings.

## Not done
-GatesOpen on this machine's real settings: not run (nothing is closed, B's note). Row 3's "changes nothing else" still holds: after an install and a close, the open leaves everything but the key as it was.

BASE: C:\Consonance\lighthouse ca914d09
SOURCES: exo_memory/handback/p-l215-read-B_2026-11-21.md:31-39; node --test dev/shell/install-failclosed.test.js (8 pass, 0 fail)
NEXT: pane B read dev/shell/install.ps1 and the rows 7-8 on branch l215-gatesopen-only and land it, when the librarian has routed this
