# The installer, line by line: why a landed hook is not the one that runs, and the receipt that would say so

- `-Only <leaf>` already installs ONE entry and wires only that leaf; "installing syncs all at once" (L1079) was struck
  in its own hand-back at 10:4xZ, but map/B.md:2186 and the ledger still carry it.
- Fix 2c (b0be06f0) was held by three things the installer cannot see: on L it needs a newer blind.js (a silent break on
  every prompt), on D board-digest.js is wired on no event, and no install run leaves a record.
- The installer writes no receipt (only `.bak` copies); -Check compares file hashes and wiring by leaf name only, and on
  D it is red as a steady state (today: 23 ok, 10 DRIFT, 3 ABSENT, 4/1/3/1, exit 1), so its exit code carries no news.
- The docs: hook edits in settings files are reloaded without a restart ("normally"); a command hook is a spawned
  process, so its script is read at each firing [inferred]; they do not say `/hooks` reloads anything.
- Smallest change: install.ps1 appends one receipt line per write run, `-Only` refuses an unmet `require`, and a read-only
  `hooks-live.js` reports each entry; four test rows, red today on the 11-13 case. No rebuild, restart or install to land.

Reader: one of the Opus level's eight, on D, 2026-11-13, about 19:00-19:40Z. Read-only except this file. Repo HEAD
2c396481 when I began, baa0aef9 when I wrote; `git diff --stat 2c396481 baa0aef9 -- dev/shell consonance/hooks
consonance/tools/install-only.test.js` is empty, so every `install.ps1:N` below holds at baa0aef9 [read].

Marks: [read] I opened it (path:line) or ran it; [summary] from another swarm or record file; [inferred] mine; [ours] a
proposal. Digests carry their function. "Installed" = `C:\Users\nname\.claude\shell\`.

## 1. What an entry is, and where it lives

- Three lists in one script. `$files` (`install.ps1:79-197`): 36 hashtables, `From` (repo path), `To` (path under the
  install dir), optional `Lib`, and `Hold` (read at `:447`, set by no entry) [read; count from -Check line 39].
- `$register` (`install.ps1:208-324`): 24 hashtables, `Event`, `Rel`, `Runner`, optional `Matcher`, `Timeout`,
  `Conflicts`, `Excluded`, `LiveOn` [read; count from -Check "`$register 24 entr(ies)`"].
- `$unmanaged` (`install.ps1:352-363`): 5 declarations keyed `Src`, never installed, each with its reason [read].
- The two lists are joined only by LEAF NAME. `-Only` keeps the `$files` rows whose `To` leaf and the `$register` rows
  whose `Rel` leaf is named (`install.ps1:384-385`); a name in neither list is a refusal, exit 1 (`:391-398`) [read].
  So "an entry" for `-Only` is a leaf: a file row, a wiring row, or both [inferred].
- Nothing in an entry says what it needs. `board-digest.js` has a file row and no wiring row; `blind.js` is a `Lib` row
  it requires (`consonance/hooks/board-digest.js:39`) [read]. The link exists only in the source text.

## 2. Where a file goes and how a hook is wired

- Destination: `$dest = %USERPROFILE%\.claude\shell` (`install.ps1:74`), plus each entry's `To` [read].
- Copy: an ABSENT file is copied with no backup (`:441-445`); a differing file is backed up to `<dst>.bak-<stamp>`, then
  copied (`:460-466`); an equal one prints `ok` [read]. Only the entry's own `To` path is ever written [read].
- Wiring: the command is `"<node or python>" "<dest>\<Rel>"` (`install.ps1:798-802`), added to `settings.hooks[Event]`
  in the group whose `matcher` equals the entry's, with `timeout` = `Timeout` or 10 (`:854-966`, `:960`) [read].
- A live hook is "the same" when its command contains `\` or `/` then the leaf (`Test-SameHook`, `:818-821`). A found one
  is re-pointed if the command differs (`:914-920`) or moved if its matcher differs (`:902-912`) [read].
- The timeout of a hook already wired is never compared or updated: only `command` is (`:914`) [read]. On D 8 of 19
  wired hooks carry no timeout, so the docs' defaults apply (600 s; 30 s on UserPromptSubmit; a shared 1.5 s budget on
  SessionEnd) [read: settings.json parsed read-only; code.claude.com/docs/en/hooks.md, the `timeout` field row].
- `settings.json` is backed up and rewritten WHOLE by `ConvertTo-Json -Depth 24`, no BOM, then read back twice
  (`:986-1015`); with no change it is not written (`:982-984`) [read]. So its sha256 moves on any write even when one row
  changed (the Lap W second reader found the same, `wake_level2_2026-11-13/00_lap_w_spec.md:641`) [summary].
- D's `settings.json` today: 4,942 B, sha256 4266711b35be030e…, written 15:01:54Z; 19 hooks on 7 events; one command
  runs a repo path, `C:\Users\nname\Desktop\lighthouse\consonance\hooks\ask-surface.js` (UserPromptSubmit) [read].
- Other sources of hooks on D: none found. No `.claude/settings*.json` under the repo or the worktrees; the four
  `settings.local.json` under `C:\Consonance\instances\fresh-*` hold no `hooks` key; `settings.json` has no plugin key
  [read]. The app writes a project `settings.json` with permissions only (`main.rs:4115`, `brief/room-settings.json`), and
  passes `--settings '{"disableAllHooks":true}'` only to one-shot calls (`main.rs:9977-9978`) [read]. No other `--settings`
  in `consonance/src-tauri/src/*.rs` [read: grep]. So the app injects no hook into a seat [inferred].

## 3. What -Check compares, and what it cannot see

What it compares [read]:
- File pairs: SHA256 of the repo working-tree file against the installed file (`install.ps1:429`, `Get-FileHash` default).
- Wiring: the leaf of the LAST quoted string in each live command (`:633-636`) against each `$register` leaf (`:684-686`).
- The source and destination universes, and EXCLUDED/CONFLICT states (`:494-578`, `:649-705`).

What it cannot see, each with the line that makes it blind:

| blind spot | why, in the code | recorded case |
|---|---|---|
| where a wired hook points | leaf only, `:635`; the path is never compared | L1086: ask-surface.js runs from the repo [summary] |
| a wired hook not in `$files` | `:690-692` skips leaves the manifest lacks | ask-surface.js: not reported live today [read] |
| the event or matcher it is wired on | `$liveLeaf` keeps leaf -> one line (`:636`) | D212 state, fixed only by a write run (D215) [summary] |
| two wirings of one leaf | the dict overwrites (`:636`) | none found [inferred] |
| timeout drift | not compared anywhere | 8 of 19 untimed on D today [read] |
| which side moved, for a DRIFT | one bit, hash equal or not (`:429-455`) | took a reader with `git hash-object` [summary] |
| a hand edit since the last install | no record of what was installed | 2026-08-17: nine files only on one disk (`:45-48`) [read] |
| what an installed file requires | no dependency field | L198: blind.js on L (hand-back :76-81) [read] |
| code a hook runs from the repo | out of scope | chain-status.js runs live from the repo [summary] |
| whether a session loaded the wiring | outside the file system | install.ps1:1028-1030 says so [read] |
| machine L | one disk per run | L1079, L0996 [summary] |
| the gates' mode | `gates_mode` lives in `~/.consonance.json` | §13 of 00_build_paths.md [summary] |

- The exit code is red as a steady state on D. Today's run exits 1 on items that are ruled or long-standing: `stop.js`
  EXCLUDED BUT LIVE, `userprompt-submit.js` REGISTERED NOT DECLARED, 4 DECLARED NOT REGISTERED [read: my run, below]. A
  gate on "-Check exits 0" could never pass on D, so no landing can use it as its gate [inferred].
- `-Only` with `-Check` is refused by design ("a report over a subset reads exactly like a report over the whole",
  `install.ps1:376-380`) [read]. So there is no per-entry verdict anywhere; a reader greps 5,031 lines [read].

## 4. What -Only does, what -NoRegister adds, and why a bare run moves everything

- `-Only a,b`: syncs only those files, and for each named leaf with a `$register` row, wires it (`install.ps1:373-401`,
  `:854`) [read]. The universe print still reads the full lists (`:365-367`) [read]. It prints
  `-Only: x of 36 manifest entr(ies), y of 24 registration entr(ies)` (`:399`) [read].
- For `board-digest.js` alone, `$regEntries` is empty, so the wiring loop does nothing and `settings.json` is not written
  (`:982-984`) [read]; on D the file would sync and nothing would run it [inferred: no settings.json entry, read above].
- `-NoRegister` exits after the file loop and prints the wiring it would have done (`:823-831`) [read]. Its first line
  says "Files are in sync." even under `-Only`, where only the named files were [read: `:824`].
- The 2026-09-19 precedent: "`install.ps1 -NoRegister -Only <the six>`. `-NoRegister` because `-Only` alone also WIRES
  an entry", settings sha256 25c403fd… "before and after (unchanged)", with a hand copy kept
  (`loop/keeper_rulings_owed_2026-09-19.md:8`) [read]. Also `loop/handoff_librarian_2026-09-19_night.md:9` [read].
- A bare run: `$syncFiles = $files`, `$regEntries = $register` (`:373-374`). On D today it would overwrite 10 DRIFT files
  (`second-reader.js` among them, whose sync changes a live hook) [2nd reader: DOWNGRADED, incomplete: six of the ten
  DRIFT files are wired on D today (second-reader, sources-gate, push-gate, delete-gate, ask-ending, release-chime;
  settings.json parsed read-only); second-reader.js is the one whose BEHAVIOUR changes (`hooks_drift_D_2026-11-13.md:36-42`)], copy 3 ABSENT ones, ADD 3 wirings (`dispatch-gate.js`,
  `carrier-drift-watch.js`, `second-reader-note.js`), and print REFUSED for `userprompt_pulse.py`, whose `Conflicts`
  names the live `userprompt-submit.js` (`:223-224`, `:932-944`) [inferred from the code and today's -Check].
- What the 11-13 record says held fix 2c [read: `handback/p-l198-403-stall-B_2026-11-13.md`]:
  - `:57-60`: "~~So putting 2c in front of the panes means running `install.ps1`, which also syncs the 14 ...~~
    **Corrected at 10:4xZ (the chair's catch):** the installer takes `-Only`".
  - `:6`: "`install.ps1 -Only board-digest.js,blind.js`, NEVER board-digest.js alone": L's installed blind.js has no
    `sealedGate` (`:78-81`), so the new board-digest.js "would throw on every prompt, and its catch exits 0" (~~`:84`~~).
    [2nd reader: the quote is at `handback/p-l198-403-stall-B_2026-11-13.md:80`; `:84` is the sealed-window line.]
  - `:60`: "Even so, it changes every seat's hooks in the middle of the run"; parked for a ruling (`:63-64`).
  - The struck sentence survives uncorrected in `map/B.md:2186` ("installing syncs all at once, the chair's call") and
    in ledger row L1079 [read].
- So the 11-13 stall was a dependency the installer cannot see, a ruling owed, and no record, not a missing one-entry
  path [inferred from the lines above].
- On D the case differs. The installed `blind.js` is the repo's (git-blob 17eb1681… both sides), so `-Only
  board-digest.js` alone would not break; but `board-digest.js` is wired on no event on D and has no `$register` row, so
  no install makes 2c live on D [read: `git hash-object`, settings.json]. Wiring it is his call (`in_hooks.md`,
  option 5, as cited in `hooks_drift_D_2026-11-13.md:100`) [summary].

## 5. What the installer leaves on disk after a run

- `<dst>.bak-<yyyyMMdd-HHmmss>` for each replaced file (`install.ps1:461`); `settings.json.bak-<stamp>` only when wiring
  changed (`:986-987`); console text [read]. No log, no commit, no list of entries: the only writes are the copies and
  the two `settings.json` writes at `:840` and `:998` [read: grep for Out-File, Add-Content, Set-Content, WriteAllText,
  AppendAllText].
- An ABSENT file installed with no wiring change leaves no trace but itself; its mtime is the repo file's, not the install
  time (`hooks_drift_D_2026-11-13.md:54-55`) [summary].
- The receipts that exist were made by hand: 09-19 (sha before and after, a hand copy), and 11-13 on L, where pane B
  took its own backup, a sha256 before, a parsed settings diff and a line-by-line -Check compare
  (`handback/p-l198-403-stall-B_2026-11-13.md:96-107`) [read]. `~/.claude` holds about 30 `settings.json.bak-*` files,
  most named by a lap id typed by hand [read: ls].

## 6. When the harness reads hooks (current docs, downloaded as text with curl today)

- code.claude.com/docs/en/settings.md, "When edits take effect": "Claude Code watches your settings files and reloads
  them when they change, so it applies most edits to the running session without a restart, including edits to
  `permissions`, `hooks`" [read]. Keys read once at start are listed; hooks are not among them [read].
- code.claude.com/docs/en/hooks.md, "Disable or remove hooks": "Direct edits to hooks in settings files are normally
  picked up automatically by the file watcher." [read]. "Normally" is not defined there [read].
- The same page, "ConfigChange": the `user_settings` matcher fires when `~/.claude/settings.json` changes [read].
- Script content: the page says a matched handler "spawns" a process (section on the `if` field, and "Exec form") [read].
  Node reads a script when it starts, so the installed `.js` is read at each firing, not cached at session start
  [inferred]. The docs say nothing explicit about caching a hook's script [read: grep for cache, snapshot, spawn].
- `/hooks` is "a read-only browser for your configured hooks" ("The `/hooks` menu") [read]. Nothing there says opening
  it reloads anything; `install.ps1:1028-1030` says a new hook "may not fire until /hooks is opened once" [read]. That
  ~~sentence is not supported by today's docs [inferred].~~ [2nd reader: half of it is. Its first clause ("only
  reloads directories that held a settings file when the session started") has a counterpart in settings.md, "When edits
  take effect": a settings file created mid-session is loaded "if its folder existed when the session started" (curl,
  today). The "/hooks opened once" remedy has no counterpart. On D settings.json exists, so per the docs an edit reloads.]
- What the docs do not state: a way to ask a running session which hooks it has loaded, other than `/hooks` by hand and
  the debug log [read: the two pages]. So a receipt can say what the next firing will run; only a firing proves it
  [inferred].

## 7. Today's run on D

`powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check`, 19:11:18Z, HEAD 2c396481, exit 1,
5,031 lines [read]. Plain `-Check` copies nothing: every write is behind `-not $Check` (`:403-406`, `:437-469`) or after
the `exit` at `:757` [read].
- Files: 23 ok, 10 DRIFT, 3 ABSENT, 0 HOLD [read: grep counts].
  - DRIFT: `hooks\l2-overseer-worker.js`, `userprompt_pulse.py`, `board-digest.js`, `hooks\second-reader.js`,
    `hooks\second-reader-worker.js`, `hooks\sources-gate.js`, `hooks\push-gate.js`, `hooks\delete-gate.js`,
    `hooks\ask-ending.js`, `hooks\release-chime.js`.
  - ABSENT: `dispatch-gate.js`, `carrier-drift-watch.js`, `hooks\second-reader-note.js`.
- Universe: 36 manifest entries; 78 repo sources, 37 skipped, 36 claimed, 5 declared unmanaged, 0 undeclared; 9,021 files
  installed, 4,038 skipped, 33 claimed, 0 path-mismatch, 4,950 unclaimed [read].
- Wiring: 19 hooks on 7 events; 4 declared not registered (`userprompt_pulse.py`, `dispatch-gate.js`,
  `carrier-drift-watch.js`, `hooks\second-reader-note.js`); 1 registered not declared (`hooks\userprompt-submit.js`);
  3 excluded and absent; 1 excluded but live (`hooks\stop.js`) [read].
- Same as this morning's (`hooks_drift_D_2026-11-13.md:22-24`) [read]. `ask-surface.js`, wired from the repo, appears
  only as a declared-unmanaged source, never as live [read].
- The installed `board-digest.js` is git-blob 142a6541…, the blob introduced at 2c7b3872 (2026-08-25) and replaced at
  b549201f (2026-09-23); the repo file is 4 commits ahead, the newest a3cefeb9, merged as b0be06f0 [read: `git hash-object
  --path`, `git log --find-object`, `git rev-list --count 2c7b3872..HEAD -- consonance/hooks/board-digest.js`].
- A trap for whoever builds Part 4: `git log -1 --find-object=<blob>` returns b549201f, the commit that REMOVED the blob;
  the commit that installed it is the oldest of the list (`--reverse`, first line: 2c7b3872) [read: both runs].

## 8. The smallest change [ours]

Tier: "prove it" (it writes the installed hooks and `settings.json`; `C:/Users/nname/.claude/CLAUDE.md:10`). Test first,
the mutation runs for `install.ps1`, the full suite at landing [read: the tier text]. Parts 1 and 2 touch one file,
`dev/shell/install.ps1`; Part 3 is a new read-only tool. Each part stands alone; Part 1 is the deliverable.

### Part 1. A receipt for every run that writes

What it writes: one JSON line per run to `<dest>\install-receipts.jsonl`. The install dir is where the copy a seat runs
lives, so the record sits with the thing it describes. -Check's universe sweep skips `*.jsonl` as runtime state
(`install.ps1:547`), so the file adds no UNCLAIMED line [read for :547; ours for the place].

```
{ "ts": "2026-11-13T19:30:02Z", "machine": "D", "repo": "C:\\Users\\nname\\Desktop\\lighthouse",
  "commit": "<git rev-parse HEAD>", "branch": "main", "mode": "only", "only": ["board-digest.js"],
  "entries": [ { "entry": "board-digest.js", "from": "consonance\\hooks\\board-digest.js",
                 "src_sha256": "e0f0c6ba…", "src_uncommitted": false, "action": "synced",
                 "dst_sha256_before": "a70e6109…", "dst_sha256_after": "e0f0c6ba…", "backup": "…board-digest.js.bak-…",
                 "wired": [], "wired_elsewhere": [] } ],
  "registration": [], "settings_sha256_before": "4266711b…", "settings_sha256_after": "4266711b…",
  "settings_changed": false, "outcome": "ok" }
```

The two sha256 values in the example are the 2c7b3872 and b0be06f0 blobs of `board-digest.js` (`git show <c>:<path> |
sha256sum`) [read]; the rest of the line is the proposal.

The edit, in `install.ps1` [ours; a sketch, PowerShell 5.1]:
1. Hoist the machine tag (`:661-668`, read-only) above `if ($Check)`, and add above the file loop:
   ```
   function Get-Sha($p) { if (Test-Path -LiteralPath $p) { (Get-FileHash -LiteralPath $p).Hash.ToLower() } }
   $git = (Get-Command git -ErrorAction SilentlyContinue).Source
   function Git-Out([string[]]$a) { if (-not $git) { return $null }; $o = & $git -C $repo @a 2>$null
     if ($LASTEXITCODE -ne 0) { return $null }; ($o -join "`n").Trim() }
   $settingsPath = Join-Path $env:USERPROFILE '.claude\settings.json'; $changes = @(); $rcRows = @()
   $rc = [ordered]@{ ts = (Get-Date).ToUniversalTime().ToString('o'); machine = $machineTag; repo = $repo
     commit = (Git-Out 'rev-parse','HEAD'); branch = (Git-Out 'rev-parse','--abbrev-ref','HEAD')
     mode = ($(if ($Only) {'only'} else {'bare'}) + $(if ($NoRegister) {'+noregister'})); only = @($Only)
     settings_sha256_before = (Get-Sha $settingsPath) }
   ```
   ~~`commit: null` when git is missing or the tree is not a repo (the fresh-home case, `install-fresh-home.test.js`): a
   stated unknown in the line, never a guess.~~ [2nd reader: WRONG as sketched. `install.ps1:72` sets
   `$ErrorActionPreference = 'Stop'`; under Windows PowerShell 5.1 a native `& git ... 2>$null` that writes to stderr then
   THROWS (probe today, PS 5.1.26100: `git -C C:\Windows rev-parse HEAD 2>$null` under Stop -> RemoteException, no
   `$LASTEXITCODE` reached). So in a non-repo the run aborts before the file loop, and `commit: null` is never written.
   The case is also misnamed: `install-fresh-home.test.js:19` runs the REAL script from the real repo; the non-repo case
   is `install-only.test.js`'s throwaway copy (`:54-60`, no `git init`), so every existing write-mode row there would go
   red. Wrap `Git-Out` in try/catch, or set `$ErrorActionPreference = 'Continue'` inside it.]
2. In the file loop (`:411-470`), when not `-Check`: before the branch, record `entry`, `from`, `src_sha256`,
   `src_uncommitted` (`git status --porcelain -- <From>` non-empty) and `dst_sha256_before`; after it, `action`
   (`ok|installed|synced|held|absent-from-repo`, the last one before its `continue` at `:418`), `backup`,
   `dst_sha256_after`. Append to `$rcRows`.
3. `Write-Receipt $outcome`: re-read `settings.json`; for each row, `wired` = the events whose command's last quoted path
   equals `Join-Path $dest $row.entry` (case-insensitive), `wired_elsewhere` = same leaf, other path; add `registration
   = $changes`, `settings_sha256_after`, `settings_changed`; `ConvertTo-Json -Depth 6 -Compress`; one
   `[IO.File]::AppendAllText` with UTF-8, no BOM. A failed append prints red and exits 1: the files were already changed,
   and a run that cannot leave its record must not read as done.
4. Call it before each exit after the file loop: the `-NoRegister` exit (`:830`), the unparseable-settings exit (`:847`,
   files already synced there), the two restore exits (`:1007`, `:1014`), and the normal end (after `:1021`). The `-Only`
   name refusal (`:391-398`) and `-Check` write nothing, so they write no receipt.
  [2nd reader: the list misses terminating errors. With `Stop` at `:72`, a failed `Copy-Item` (`:443`, `:461`, `:466`)
  ends the run mid-loop with files already changed and no receipt. A `try { ... } finally { Write-Receipt }` around
  the loop and registration covers every path; row mutant: make one `Copy-Item` target read-only.]
- Watch: in PowerShell 5.1 a one-item array inside a hashtable may serialise as a bare object; row 1 below asserts
  `entries` is an array of length 1, which catches it [inferred; not run].

What a seat reads from it: "which commit's bytes are installed for this entry, since when, and does anything run them".
`wired: []` says what L1087 needed said: on D, 2c could be installed and still run nowhere.

### Part 2. `-Only` refuses an entry whose relative `require` is not in sync

- Before the file loop, only under `-Only`: for each selected `.js` row, read the repo source; for each
  `require('./x')` or `require('../x')`, resolve it against the entry's `To` directory under `$dest`; if that path is
  another `$files` row's `To`, is not also named, and its installed sha256 differs from its repo source, collect it.
  Any collected: print each (`board-digest.js requires blind.js, whose installed copy is not the repo's: name both`),
  exit 1, write nothing [ours].
  [2nd reader: as written it fires wrongly on D TODAY. `-Only reply-slot.js`: reply-slot.js is `ok` on D, it requires
  `./sources-gate.js` (`consonance/hooks/reply-slot.js:52`), and sources-gate.js is DRIFT (my -Check, lines 31-32), so the
  rule refuses a run whose own sync is a no-op. Limit the scan to selected rows whose bytes would change. It also sees
  one direction only: `-Only sources-gate.js` passes and silently changes the module live reply-slot.js loads; the
  receipt should name reverse dependents. And `ready-stop.js`/`ready-prompt.js` load `lib/ready.js` by `path.join`
  (`dev/shell/hooks/ready-stop.js:18`), the lib the 09-19 L sync was about (`handoff_librarian_2026-09-19_night.md:9`).]
- Literal relative requires in the managed sources today [read: grep]: `board-digest.js:39` -> `./blind.js`;
  `reply-slot.js:52` -> `./sources-gate.js`; `precompact.js:55`, `session-start.js:387`, `userprompt-submit.js:311`
  -> `../lib/fresh-guard.js`. (`claim-check.js:42` is unmanaged.)
- Not seen by it: requires built by `path.join` (session-start finds `lib/ambient.js` from `SHELL_DIR`, `install.ps1:64`)
  and code loaded from the repo by `room_path` [read for the first; summary for the second]. A `require` inside a
  comment can refuse falsely; the refusal names it, so the cost is one more name typed [inferred].

### Part 3. A read-only report a seat or a landing can run: `consonance/tools/hooks-live.js`

- Reads the `$files` From/To pairs from `install.ps1` with the regex pattern `dream-gate.test.js:71` already uses,
  skipping lines whose first non-space is `#` (the commented `jev-flags.js` row at `install.ps1:148` would match
  otherwise) [read for both lines; ours for the tool]. [2nd reader: DOWNGRADED: that regex,
  `/^.*From\s*=\s*'([^']+)'.*$/gm` (`consonance/hooks/dream-gate.test.js:71`), captures `From` only; `To`, `Lib` and
  the whole `$register` (Excluded, Event) need a second parse. That is a second hand-kept reader of one manifest.]
- For each pair: sha256 of repo and installed; the wiring in `settings.json` (exact path, not leaf); the newest receipt
  row for that `To`. Prints one state per entry: `LIVE` (equal, wired at the installed path), `UNWIRED` (equal, wired
  nowhere), `STALE` (differs, installed sha = the last receipt's after-sha, or no receipt), `CHANGED SINCE INSTALL`
  (differs from the receipt's after-sha), `ABSENT`, `RUNS FROM REPO` (a wiring whose path is inside `room_path`) [ours].
- `--since <sha>`: only entries whose `From` changed in `<sha>..HEAD`; exit 1 if any is not `LIVE`. That is the landing's
  question, per entry, and it does not inherit -Check's steady red [ours].
  [2nd reader: it does inherit one. 13 of the 36 `$files` rows have no `$register` row (node pass over install.ps1,
  comment lines skipped): 7 `Lib` rows (`:80`, `:81`, `:92`, `:118`, `:120`, `:135`, `:172`) and 6 hooks
  (`userprompt-submit.js`, `sessionstart-ambient.js`, `board-digest.js`, `transcript-watch.js`, `dream-watch.js`,
  `ferry-watch.js`). A Lib row is never wired, so `--since` over any range touching blind.js or ready.js stays exit 1
  after a correct install. Give a Lib row its requirers' state, and print "no `$register` row" as its own state.]
- Its last line is the field for Lap W's W3 body line (below). It writes nothing [ours].

### Part 4 (optional, small). -Check names the origin of each DRIFT

`DRIFT board-digest.js   = repo 2c7b3872 (2026-08-25), 4 commits behind` from `git hash-object --path` and `git log
--reverse --find-object`, or `matches no commit of this file: may be the only copy of a change` (the 2026-08-17 risk,
`install.ps1:457-459`) [ours; mind the trap in §7].

## 9. The failing checks, on the recorded case

New file `dev/shell/install-receipt.test.js`, the harness of `consonance/tools/install-only.test.js`: a throwaway repo
and a throwaway USERPROFILE under `scratch.js` `mkdtemp` (`install-only.test.js:16-22`, `:50-93`), `CONSONANCE_MACHINE`
pinned [read for the harness; ours for the rows]. The throwaway repo gets `git init` and one commit inside the temp
folder, so `commit` can be asserted. The case is pinned from git, not from today's working tree [ours]:
`git show b0be06f0:consonance/hooks/board-digest.js` and `blind.js` as the repo copies; the installed copies from
2c7b3872 (D's `board-digest.js` today) and 5973d89b (L's `blind.js`) [read: blob ids and export lines, §7 and below].

L's installed `blind.js` exports `blindState, declareLine, setBlind, clearBlind, markBoard, LOCK, BOARD` (hand-back
`:78-79`); `git show 5973d89b:consonance/hooks/blind.js` has exactly that export line (`:166`) and 0 `sealedGate`
[read]. So 5973d89b is the L fixture; 2c7b3872's own `blind.js` exports less (`:131`) [read].

| row | fixture | today | after |
|---|---|---|---|
| 1 D, 11-13 | installed bd@2c7b3872, blind@b0be06f0; `-Only board-digest.js` | exit 0, no receipt file | one line: entry `board-digest.js`, commit = temp HEAD, before = sha256(bd@2c7b3872), after = sha256(bd@b0be06f0), `settings_changed` false and sha equal, `wired: []` |
| 2 09-19 | same; `-NoRegister -Only board-digest.js` | no receipt | a line with mode `only+noregister`, settings unchanged |
| 3 L, 10:3xZ | home with no PreToolUse; `-Only push-gate.js` | no receipt (B made one by hand) | `settings_changed` true; `registration` has `ADD PreToolUse push-gate.js`; `backup` exists; `wired: ["PreToolUse"]` at the installed path |
| 4 L, 11-13 | installed bd@2c7b3872, blind@5973d89b; `-Only board-digest.js` | exit 0; installed bd now requires a `sealedGate` the installed blind.js lacks | exit 1, names `blind.js`; installed bd still sha256(bd@2c7b3872); settings unchanged. Control: `-Only board-digest.js,blind.js` exits 0 with two rows |

- Rows 1 to 3 are red today because `install.ps1` has no writer for any receipt (§5) [read]. Row 4 is red because nothing
  reads a `require` (§1) [read]; in row 4's "today" column, `typeof require(<installed blind.js>).sealedGate` is
  `'undefined'` [inferred from the export line].
  [2nd reader: red for the reason given, but rows 1-3 are feature-absent reds: ANY receipt writer turns them green,
  including one no seat ever reads. Only the Part 3 row reproduces L1087 (fix landed, not live, nobody told). Row 1 also
  needs a seeded `settings.json`: with none, `:837-842` creates `{}` and `settings_changed` is true. Row 4's 11-13 case
  is a hazard B caught by hand (hand-back `:76-81`); the OCCURRENCE of that class on record is 2026-08-17, "Cannot find
  module './blind.js'" on every prompt (`install.ps1:130-134`).]
- Mutants for the harness, each asserted applied (the `mutate1` pattern, `install-only.test.js:450-454`) [ours]: drop
  the append (rows 1-3 red); read `dst_sha256_before` after the copy (row 1 red: before = after); skip the require scan
  (row 4 red); drop the receipt call on the `-NoRegister` exit (row 2 red).
- Part 3, one row [ours]: temp repo with two commits of `board-digest.js` (2c7b3872's blob, then b0be06f0's), installed =
  the first, a `settings.json` with no `board-digest.js`: `hooks-live.js --since <first>` prints `STALE board-digest.js`
  and exits 1; after `-Only board-digest.js` it prints `UNWIRED` and still exits 1; with a wiring at the installed path,
  `LIVE`, exit 0. Red today: the tool does not exist.
- Cost to run: each row spawns PowerShell once or twice, as `install-only.test.js` does; I did not time it [inferred].
  One test file, so no heavy-run lock by the room's rule (`~/.claude/CLAUDE.md`, "a run of 3 test files or fewer")
  [read].

## 10. What each part needs

- Rebuild of the app (`consonance/src-tauri`): none. Nothing here is Rust [read: the parts touch `install.ps1` and a
  node tool].
- Hook install: none to land it. `install.ps1` runs from the repo; it is not installed [read: `:73`]. The first `-Only`
  run after landing writes the first receipt [ours].
- Seats restarted: none.
- The keeper's word: none for the code. His word, or the ruling chain the record names, stays owed for every install
  that changes a live hook, as now: `second-reader.js` and the three ABSENT ones
  (`hooks_drift_D_2026-11-13.md:36-45`) [summary]; wiring `board-digest.js` on D, which is the only way 2c runs there
  [summary: §4]. `stop.js` stays as it is (`plan_room_stretch_2026-11-13.md`, "Hygiene, small") [read].
- Machine L: the same file reaches L by pull. L's first `-Only` writes L's receipts; this design cannot read L from D
  [inferred].

## 11. Where it touches Lap W (not a redesign)

- W3's body line (`wake_level2_2026-11-13/00_lap_w_spec.md:321-325`): add one field, `hooks <live>/<n> live, <s> stale,
  <a> absent`, from Part 3's last line; about 30 B against W3's 300 B bound (`:353`) [ours; read for the bound]. A seat
  then learns at start, not only when someone runs -Check.
  [2nd reader: W3 is an installed hook; to print this field it must load `hooks-live.js` either from the repo by
  `room_path` (the "code a hook runs from the repo" blind spot in §3's table) or as a new `$files` row, which IS a hook
  install on each machine. §10's "Hook install: none" holds for Parts 1-3, not for this field.]
- W3 and W4 are new hooks installed with `-Only`, each rewriting `settings.json` whole (`:686-690`) [summary]. If Part 1
  lands first, their installs on D and L leave receipts, and W3's "first real wake" check can pair the body ledger
  against the receipt's `ts` [ours].
- W1's stamp names the HEAD the shelf was built from (`:171`) [read]. The receipt names the HEAD the hooks were installed
  from. Same shape, two artifacts; W3 can print both [ours].

## 12. Lap I's falsifier, against this design

The plan registered: Lap I is degenerating if, at the first two landings of a hook or app change, "the installed copy on
the landing machine is again older than the repo and no seat was told" (`plan_vector_swarm_2026-11-13.md`, "The Opus
level") [read]. Part 3's `--since` answers "older than the repo" per entry; Part 1 answers "who installed what, when";
W3's field is the "told". None of them installs anything, so a landing can still leave a hook stale; the design only
makes that state named instead of silent [inferred].

## What I did not open

- Machine L: its `settings.json`, its installed tree, its -Check. Everything about L is from the hand-back and the map.
- I ran no test. `install-only.test.js` (660 lines) and `install-fresh-home.test.js` (58 lines) were read whole; both write
  only under a temp folder, but each spawns PowerShell many times, past this task's CPU bound. `dev/shell/lib/ready.test.js`
  was not opened.
- `dev/shell/lib/ambient.js`, `fresh-guard.js`, `ready.js`: not opened. The installer calls no library; it only copies
  them (`install.ps1:80-92`) [read].
- No hook was fired, no transcript or data log was read; no figure here comes from them.
- The hooks guide page (`hooks-guide.md`, "Hook not firing"), `managed-settings.md`, and the debug-log section: not read.
- `scratch.js` beyond its `mkdtemp` lines; `dream-gate.test.js` beyond `:69-73`.
- The other installer records named in the plan (`install_drift_census_2026-08-24.md`, `packet_installer_only_2026-09-08.md`,
  `install_D_2026-09-21.md`, `plan_install_score_remeasure_2026-09-21.md`, `install_proposal_L_2026-09-23.md`): left to the
  reader on why drift returned.
- Whether PowerShell 5.1's `ConvertTo-Json` keeps a one-item array as an array inside a hashtable: not tested.
- `in_hooks.md`, `00_critic.md`, `handoff_lighthouse_2026-11-13-L.md`: only as cited by the files I read.

## Second reader

Reader: an Opus adversarial second reader, on D, 2026-11-13, about 19:15-19:50Z, HEAD baa0aef9. Read-only except this
file. I ran plain `install.ps1 -Check` once (it writes nothing: `:403-406`, `:437-469`, exit at `:757`), at 19:19:18Z:
exit 1, 5,031 lines, the same counts as above. No test file run, no install. Other runs: read-only git, a node parse of
`settings.json`, a node count over `install.ps1`, curl of two docs pages into my scratchpad, and one PowerShell 5.1 probe
(`git -C C:\Windows rev-parse HEAD 2>$null` under `Stop`, a read in a non-repo; nothing written).

Line numbers below are the first reader's, before my inserts.

| line | claim (under 15 words) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 8 | -Check today 23/10/3, 4/1/3/1, exit 1 | my -Check run | OK | same counts; exit 1; 5,031 lines |
| 15-16 | installer files same at 2c396481 and baa0aef9 | `git diff --stat` | OK | empty; working tree clean there |
| 23 | `$files` 36 rows; `Hold` set by no row | install.ps1:79-197 | OK | node count 36; `Hold = $true` 0 hits |
| 25 | `$register` 24 rows | install.ps1:208-324 | OK | 24 by count and by -Check |
| 27 | `$unmanaged` 5 declarations | install.ps1:352-363 | OK | 5 |
| 28-29 | -Only filters by leaf; unknown name exits 1 | install.ps1:384-398 | OK | as quoted |
| 31-32 | board-digest requires ./blind.js at :39 | board-digest.js:39 | OK | needs `sealedGate` |
| 36-38 | dest; ABSENT copied without .bak; DRIFT backed up | install.ps1:74, :441-466 | OK | |
| 39-42 | command form, timeout 10, separator match, repoint/rematch | install.ps1:798-821, :902-920, :960 | OK | |
| 43-45 | 8 of 19 untimed; defaults 600/30/1.5 s | settings.json; hooks.md:423 | OK | node parse 8/19; docs row verbatim |
| 46-47 | whole rewrite Depth 24; no write without change | install.ps1:982-1015 | OK | |
| 49-50 | settings 4,942 B, sha256 4266711b, 15:01:54Z, 19/7 | settings.json | OK | same; one repo-path command, ask-surface.js |
| 51-55 | no other hook source; app injects no hook | instances/*/.claude; main.rs:4115, :9977-9978 | OK | 4 fresh-* local files, no `hooks`; brief keys `permissions` only; no managed-settings dir |
| 60-61 | SHA256 compare; leaf of last quoted string | install.ps1:429, :633-636 | OK | |
| 68-79 | blind spots and their lines | install.ps1:635-636, :690-692, :45-48, :1028-1030 | OK | six rows spot-checked |
| 81-83 | -Check exit red as steady state on D | my run | OK | stop.js, userprompt-submit.js, 4 not registered |
| 84-85 | -Only with -Check refused | install.ps1:376-380 | OK | |
| 89-91 | -Only syncs and wires named; prints x of 36 | install.ps1:373-401, :399 | OK | `:365-367` is the comment; the code is `:497`, `:644`, `:672` |
| 92-93 | board-digest alone: no wiring, settings not written | install.ps1:982-984 | OK | on a home with no settings.json, `:837-842` writes `{}` |
| 94-95 | -NoRegister prints "Files are in sync." | install.ps1:823-831 | OK | |
| 96-98 | 09-19 precedent: -NoRegister -Only, sha same | keeper_rulings_owed_2026-09-19.md:8; handoff_librarian_2026-09-19_night.md:9 | OK | verbatim |
| 99-102 | bare run: 10 synced, 3 copied, 3 ADD, pulse REFUSED | code; -Check; node path | DOWNGRADED | counts hold (all 19 commands use the resolved node, so no REPOINT); 6 drifted files are live hooks |
| 104-105 | hand-back :57-60 struck and corrected | p-l198-403-stall-B:57-60 | OK | |
| 106-107 | :6, :78-81 and the quote at :84 | p-l198-403-stall-B:6, :78-84 | WRONG | the quote is at :80 |
| 108 | "changes every seat's hooks"; parked :63-64 | p-l198-403-stall-B:59-64 | OK | |
| 109-110 | struck sentence survives in B.md:2186 and L1079 | map/B.md:2186; 00_ledger.md:1118 | OK | both say "installing syncs all at once" |
| 113-115 | D blind.js git-blob 17eb1681 both; digest wired nowhere | `git hash-object --path`; settings.json | OK | |
| 120-123 | only writes: copies and two settings writes | grep of install.ps1 | OK | plus `New-Item` dirs and the two restore copies |
| 128-129 | about 30 settings.json.bak, most hand-named | ls ~/.claude | OK | 33: 21 hand-named, 12 installer-stamped (newest 20261009-200022) |
| 133-135 | settings.md "When edits take effect" quote | settings.md, curl today | OK | verbatim |
| 136-137 | "normally picked up ... file watcher" | hooks.md:736 | OK | |
| 138 | ConfigChange `user_settings` matcher | hooks.md:302, :3018 | OK | |
| 139-141 | handlers "spawn"; no caching statement | hooks.md:199, :462; grep cache/snapshot | OK | no hit on hook-script caching |
| 142-144 | install.ps1:1028-1030 unsupported by docs | settings.md "When edits take effect" | WRONG | first clause has a docs counterpart; only the /hooks remedy has none |
| 151-153 | plain -Check writes nothing | install.ps1:403-469, :757 | OK | |
| 154-163 | file, universe and wiring counts | my run | OK | every figure equal |
| 164-165 | ask-surface.js only as declared-unmanaged | my run output | OK | 1 hit, in the unmanaged block |
| 166-168 | installed digest = 2c7b3872 blob; 4 behind; a3cefeb9 in b0be06f0 | git hash-object, log, rev-list | OK | a3cefeb9 is a parent of b0be06f0 |
| 169-170 | `--find-object` -1 returns the removing commit | git log | OK | b549201f first, 2c7b3872 last |
| 174-175 | prove-it tier text | ~/.claude/CLAUDE.md:10 | OK | |
| 182 | `*.jsonl` skipped by the sweep | install.ps1:547 | OK | |
| 195-196 | a70e6109 and e0f0c6ba are the two blobs' sha256 | git show, sha256sum | OK | also equal to the installed and repo files |
| 211-212 | `commit: null` in a non-repo, fresh-home case | PS 5.1 probe; install-fresh-home.test.js:16, :19 | WRONG | under `Stop` the git call throws; fresh-home runs the real repo |
| 222-224 | receipt before each listed exit covers all paths | install.ps1:72, :443-466 | DOWNGRADED | a thrown Copy-Item leaves changed files and no receipt |
| 238-240 | literal relative requires in managed sources | grep | OK | blind.js:49 and reply-slot.js:30 are requires inside comments |
| 233-237 | Part 2 refuses only an unmet dependency | -Check: reply-slot ok, sources-gate DRIFT | FIRES WRONGLY | refuses `-Only reply-slot.js` on D today |
| 247-249 | Part 3 reuses dream-gate's regex for From/To | dream-gate.test.js:71; install.ps1:148 | DOWNGRADED | the regex captures `From` only |
| 254-255 | `--since` does not inherit the steady red | node count over install.ps1 | FIRES WRONGLY | 13 rows have no `$register` row; 7 are Lib rows, never LIVE |
| 266-267 | harness is scratch.js mkdtemp | install-only.test.js:51 | OK | |
| 273-275 | L blind export line = 5973d89b:166, 0 sealedGate | `git show` | OK | the only commit with that export list; L's blob itself not read |
| 284 | rows 1-3 red: no receipt writer | grep of install.ps1 | OK | red, but any writer greens them |
| 295-296 | 3 test files or fewer needs no lock | ~/.claude/CLAUDE.md:151 | OK | |
| 300-304 | no hook install to land | §11 against §10 | DOWNGRADED | true for Parts 1-3; the W3 field needs an install or a repo load |
| 302 | install.ps1 runs from the repo | install.ps1:73 | OK | |
| 308 | stop.js stays | plan_room_stretch_2026-11-13.md:83 | OK | |
| 314-321 | W3 :321-325, 300 B :353, settings :686-690, W1 :171 | 00_lap_w_spec.md | OK | |
| 325-327 | Lap I falsifier quote | plan_vector_swarm_2026-11-13.md:145 | OK | |

**Tally.** 59 checked: OK 50, WRONG 3, DOWNGRADED 4, UNSUPPORTED 0, and 2 proposals that fire wrongly on today's state.
Every count the file gives for D today re-derived equal by my own run. The summary bullets at lines 3-12 carry no marks;
each repeats a marked line below it.

**The failing checks, probed.** Rows 1-3 are red today for the reason given: the script has no receipt writer (grep for
Out-File, Add-Content, Set-Content, WriteAllText, AppendAllText finds only the two settings writes). Row 4 is red for the
reason given: nothing reads a `require`, and `5973d89b:consonance/hooks/blind.js` has 0 `sealedGate`. I did not execute
the rows; that needs a write-mode install into a temp home, which this task does not allow.
Do they fail on the recorded case? Rows 1-3 fail because a feature is absent, not because L1087's fault is seen: any
receipt, read by no one, turns them green. The Part 3 row is the one that reproduces L1087 (D's digest STALE, wired
nowhere, exit 1). Row 4 reproduces a hazard caught by hand on 11-13; the occurrence of that class on record is 2026-08-17.

**The design, attacked.**
- Satisfied without fixing it: Part 1 lands and receipts pile up in `~/.claude/shell`, which no seat reads, the repo does
  not carry and the other machine cannot see; Part 3 lands and nothing runs `--since` at a landing. The record holds this
  exact lapse. -Check has carried the registration verdict in its exit code since 2026-08-25 (`install.ps1:587-605`,
  `:756-757`). D was synced to 0 DRIFT with a hand receipt on 09-19 (`keeper_rulings_owed_2026-09-19.md:8`); today it is
  10 DRIFT and 3 ABSENT. On D the newest installer-stamped file backup is dated 2026-10-19 (one file) and the newest
  stamped settings backup 2026-10-09 [read: ls]. An instrument that exists and gates nothing did not hold before. What
  makes this design bite is the landing pane's run of `--since` and the W3 field, and neither is specified as a test that
  fails when it is never called.
- Fires wrongly: Part 2 on `-Only reply-slot.js` today; Part 3 `--since` on any range that touches a Lib row, and on
  board-digest.js on D; Part 1's git calls in any non-repo (the throw), which would also turn the existing
  `install-only.test.js` write rows red, since its throwaway repo has no `.git`.
- Earlier fixes of this kind, lapsed: `-Only` (2026-09-08), named in its own header "the smaller half of the fix"
  (`install.ps1:17`); the hand receipts of 09-19 and 11-13 (sha before and after, a settings diff) never became
  mechanical; the "registration and manifest ship together" rule (`install.ps1:149-156`, `:283-288`) shipped twice before
  the check for it did.

**What I would change in the spec, smallest first** [ours]: wrap `Git-Out` so a non-repo yields `commit: null`; put the
receipt call in a `finally`; scope Part 2 to rows whose bytes change, and list reverse dependents in the receipt; give
Part 3 a Lib state and a "no `$register` row" state; and make the landing pane's run of `--since` the failing check (a
landing that changes `consonance/hooks/board-digest.js` while D's copy stays at 2c7b3872 must exit 1).

**What I could not check.** Machine L (its settings, installed tree, -Check); the hand-back is the only source for L.
Whether hooks reload in a running session in practice (docs only; no hook fired). PS 5.1 `ConvertTo-Json` on a one-item
array in a hashtable (not run). The four failing rows as executed tests. `in_hooks.md` option 5. The five earlier
installer records the plan names, beyond the 09-19 line.

## What I did not open (second reader)

- Machine L's disk; any transcript or `C:/Consonance/data/*.jsonl` log; the board.
- `dev/shell/lib/*.js` beyond the require lines; `install-only.test.js` and `install-fresh-home.test.js` beyond the lines
  cited; `ready.test.js`.
- `in_hooks.md`, `00_critic.md`, the L handoff, and the five earlier installer records.
- The hooks guide page and managed-settings page of the docs.
