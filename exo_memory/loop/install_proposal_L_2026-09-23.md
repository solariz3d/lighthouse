# Install proposal for L — 2026-09-23 (pane A, L103)

**What is going on.** On L, `install.ps1 -Check` flags 10 installed hooks as different from the repo. I checked each one
(`handback/p-l103-drift-A_2026-09-23.md`):
- **None has changes of its own.** Every installed copy is an exact earlier version of its repo file, so installing loses nothing.
- **Six are in use** (listed in `settings.json`). Refreshing them means tonight's fixes reach the seats.
- **Four are not in use** (not listed). They do nothing on L either way.

## What I propose to install — the six in use, in this order

| # | file | what changes when it is refreshed | risk |
|---|---|---|---|
| 1 | `blind.js` (used by board-digest) | when the blind window is cleared, one line is also written to the board (`5973d89`, 09-16) | low. Every function board-digest calls is in both versions |
| 2 | `board-digest.js` | the `[panes]` list also shows panes that have said nothing, as `0 exch · idle since launch` — **E's stall fix from tonight (L096), not live on L until this** | low |
| 3 | `hooks\ready-stop.js` | reads its library path from its own variable, not `CONSONANCE_DATA` (D098) | none visible. That variable is not set in L's panes now, and every seat's ready file is fresh. This guards against it coming back |
| 4 | `hooks\ready-prompt.js` | the same one-line D098 change | the same |
| 5 | `transcript-watch.js` | no more hard-coded `C:\Consonance\data` fallback. It uses `data_dir` from `~/.consonance.json` (which is `C:\Consonance\data`, the same place) and says which it used (L044) | low. Only its message text changes on L |
| 6 | `hooks\session-end.js` | the same D098 change | none visible. **The 2026-08-25 ruling lists this file as "do not install"**, but it was already installed and in use on L when this was measured. That ruling was about copies that were missing then |

**The command** (from `C:\Consonance\lighthouse`). It installs only these files, and leaves `settings.json` alone because all six are
already listed (`install.ps1:875`):

    powershell -NoProfile -ExecutionPolicy Bypass -File dev\shell\install.ps1 -Only blind.js,board-digest.js,ready-stop.js,ready-prompt.js,transcript-watch.js,session-end.js

`-Only` processes files in the installer's own list order, not the order typed. That's fine here, because each file works with
the other's old or new version. **Before it runs, each old copy is saved beside it** as `<file>.bak-<yyyyMMdd-HHmmss>`
(`install.ps1:398`) in `~/.claude/shell`.

**To undo:** copy each `.bak-…` back over its file. For example:

    Copy-Item ~\.claude\shell\board-digest.js.bak-<stamp> ~\.claude\shell\board-digest.js -Force

The hashes before, sha256 first 12 characters:
- `blind.js` fc193f2beb88
- `board-digest.js` a70e6109a5f7
- `ready-stop.js` cca88a728d62
- `ready-prompt.js` 77b534d5eacd
- `transcript-watch.js` f30023611f4c
- `session-end.js` f784ee68dc3b
- `settings.json` 49e5635d8b9dc669

**Afterwards:** `install.ps1 -Check` should show those six as `ok`. The four below stay as DRIFT.

## What I propose NOT to install — the four unused files

`hooks\userprompt-submit.js`, `hooks\stop.js`, `hooks\l2-overseer.js`, `hooks\l3-overseer.js`.

Nothing on L runs them:
- The pulse on L is `userprompt_pulse.py`.
- Your 09-06 ruling ("ready pair only") keeps stop and the two overseers unregistered, and the installer honours it.

Refreshing them would change no behaviour. The ruling also lists all four as "do not install". **One thing has changed:** that
ruling said `userprompt-submit.js` *could not* be installed, because of a Hold flag. That flag was removed on 09-21 (`b718b91`),
so **a plain `install.ps1` run with no flags would now overwrite it.** Use `-Only`, never the plain run, until you decide
about these four.

## What a seat will notice, and when

Hooks are small scripts started fresh on every event. A refreshed file is used **from the next event in every seat, at once, with
no restart**:
- the next message typed (board-digest, transcript-watch, ready-prompt);
- the next finished turn (ready-stop);
- the next session close (session-end).

The only visible changes:
- the `[panes]` list gains lines for silent panes;
- a board line appears when a blind window clears;
- transcript-watch's start message names its data source.

The one mid-session risk is a hook starting in the few milliseconds while its file is being copied. That hook would fail once, and
the next event would be fine.

**The moment I recommend: now, between laps.** Waiting for a restart buys nothing, since nothing here needs one. And the board-digest
fix is the one that makes tonight's stall work visible to you.

## Your call

**Yes** — run the command above now. / **No** — leave all ten as they are. / **Pick** — name the rows you want (for example "1–2
only", or "all but 6").
