# Where head-watch.jsonl is written, and since when not on D (D675): one line, answered (pane P)

Seat: pane P (sibling-372c8abc). Asked by the chair at 00:15Z, "no order": what is meant to write `head-watch.jsonl` on D, and
since when has it not? Read only. Nothing wired or fixed. This file carries the line already rung as prose (queued 00:17Z), so it
has a master.

**The line:** the writer is `consonance/tools/head-watch.js`. It runs as the scheduled task "Consonance Head Watch", registered at
logon and at startup by `dev/headwatch/install_headwatch.ps1`; `install.ps1` never names it.
- **On D:**
  - the task is not registered;
  - no head-watch file exists under `C:\Consonance` or `~/.consonance`.
- **The last row** in D's ledger was written 2026-08-24 06:35.
- **D's transcripts** still read the ledger whole at 2026-09-11 08:23Z, so the file left D after that.
- **The watcher runs on L.**
- `state-manifest.json:85` marks the ledger as machine-bound ("STAYS"), so nothing would carry it to D.

checked: `Get-ScheduledTask -TaskName "Consonance Head Watch"` → NOT REGISTERED. The Consonance tasks registered on D are Dream
Cycle, Janitor and Second Vantage.

checked: `find /c/Consonance /c/Users/nname/.consonance -maxdepth 4 -iname "*head-watch*"` → nothing.

checked: `grep "head-watch ledger 9 row"` over `~/.claude/projects/*/*.jsonl` → the text is "head-watch ledger 9 row(s), last start at
2026-08-24 06:35"; its last occurrence is at 2026-09-11T08:23:55Z, in the librarian's transcript.

checked: `exo_memory/handback/p-gen-lap2-kit-B_2026-11-13.md:58` → pid 24748, 7h 17m,
`C:\Consonance\lighthouse\consonance\tools\head-watch.js`. That is L's tree; D's is `Desktop\lighthouse`.

checked: `dev/headwatch/install_headwatch.ps1:1-71` (the task name at :51; AtLogOn and AtStartup, no time limit, restart on failure);
`consonance/state-manifest.json:85-88`.

inferred: the file left D somewhere between 2026-09-11T08:23Z and now. I did not find the exact date.

inferred: whether the task was unregistered on D, or was never registered here, is not established. The August watcher may have been
the session-child form that the installer's header says died on 2026-08-18.

**Related, for the room-stretch question:** E's D454 hand-back (`p-d454-install-E_2026-10-24.md:81`) already records that the pulse says
"restart detection OFF: no head-watch.jsonl" on a default install. So LIVE's first line on D is one that no installed piece writes.

BASE: none (no repository changed)
SOURCES: Get-ScheduledTask "Consonance Head Watch"; find C:\Consonance ~/.consonance -iname "*head-watch*"; grep over ~/.claude/projects/*/*.jsonl; consonance/tools/head-watch.js:1-40; dev/headwatch/install_headwatch.ps1:1-71; consonance/state-manifest.json:85-88; exo_memory/handback/p-gen-lap2-kit-B_2026-11-13.md:58; exo_memory/handback/p-d454-install-E_2026-10-24.md:81
NEXT: librarian carry the line into the room-stretch question on what the 3,000 characters carry when this is read
