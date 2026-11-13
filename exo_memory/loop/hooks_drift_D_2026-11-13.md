# The room's hooks on D: each drifted, absent and odd entry, read one by one (2026-11-13, read-only)

Seat: a read-only reader spawned from the librarian's seat, on D. Written about 09:40 local (15:40Z).
Nothing was installed, copied, registered or edited. The only file written is this one.

Marks: [read] = I opened it and saw it (path:line given). [inferred] = reasoned from what I read.
[ours] = a proposal. Digests carry their function. "Installed" = `C:\Users\nname\.claude\shell\`.
"Repo" = `C:\Users\nname\Desktop\lighthouse\`, at 7b81451e when I began and 8962d13c when I ended.
None of the 17 files examined changed in between [read: `git diff --stat 7b81451e HEAD -- <files>`, empty].

Prior art, so this is not worked out twice:
- `exo_memory/handback/p-d-update-P_2026-11-13.md` section 4: this morning's -Check [read].
- `exo_memory/loop/room_better_2026-11-13/in_hooks.md`: ledger counts and rulings per hook, today 09:02 [read :36-76,
  :106-146]. It has no per-hook diff or dependency check. This file adds those.
- `exo_memory/handback/p-d619-hooks-tools-C_2026-11-02.md:127-130`: 7 hooks older than source, found 11-02 [read].
- `exo_memory/loop/room_audit_result_2026-11-02.md:33-36`: recommendation A (stop the second reader) and D (bring the
  installed hooks up to source, "after A and B") [read].
- `exo_memory/loop/plan_room_fixes_2_5_2026-11-03.md:41`: "The seven hooks D619 found older than their source are NOT
  reinstalled in this pass" [read].
- `exo_memory/map/M.md:1029-1033`: on L, one entry at a time with `-Only`, then `-Check` [read].

My -Check run (same command as the morning report, exit 1) gave the same result: 23 ok, 10 DRIFT, 3 ABSENT, 4 declared
and not registered, 1 registered and not declared, 3 excluded and absent, 1 excluded but live [read: its output,
5,031 lines, file states at lines 1-36, registration block at 5011-5031].

## (a) Summary table

Lines changed are installed -> repo, line endings normalised (`diff --strip-trailing-cr`); both sides are CRLF, so the
raw count is the same [read]. "Newer side" is the repo for all ten.

| hook (installed path) | status on D | newer side | lines | depends on | verdict |
|---|---|---|---|---|---|
| hooks\l2-overseer-worker.js | DRIFT; dormant (its spawner is not registered) | repo, 1 commit | +7 -1 | nothing new | safe to sync alone; no live effect |
| userprompt_pulse.py | DRIFT; not registered (the Node pulse runs instead) | repo, 1 commit | +6 -0 | nothing new | safe to sync alone; `-Only` will print REFUSED for its registration, as designed |
| board-digest.js | DRIFT; not registered on D | repo, 4 commits | +55 -7 | `sealedGate` from blind.js: the installed blind.js has it | safe to sync alone; no live effect on D |
| hooks\second-reader.js | DRIFT; live on every ring | repo, 3 commits | +19 -8 | nothing new | do not sync without the owner's ruling: no dependency blocks it, but it stops the reading of pane rings |
| hooks\second-reader-worker.js | DRIFT; live (spawned per ring) | repo, 1 commit | +1 -1 | nothing new | safe to sync alone (one field added to the ledger row) |
| hooks\sources-gate.js | DRIFT; live on every ring; denies in strict mode, warns in light (D is light) | repo, 1 commit | +4 -2 | nothing new; reply-slot.js loads it, exports unchanged | safe to sync alone; no behaviour change on D |
| hooks\push-gate.js | DRIFT; live on every shell call | repo, 1 commit | +1 -1 | nothing new | safe to sync alone; no behaviour change on D |
| hooks\delete-gate.js | DRIFT; live on every shell call | repo, 1 commit | +1 -1 | nothing new | safe to sync alone; no behaviour change on D |
| hooks\ask-ending.js | DRIFT; live on every Stop (shadow) | repo, 1 commit | +1 -1 | nothing new | safe to sync alone; no behaviour change on D |
| hooks\release-chime.js | DRIFT; live after every shell call | repo, 1 commit | +11 -4 | nothing new | safe to sync alone; no behaviour change on D |
| dispatch-gate.js | ABSENT; would register PreToolUse | repo only | 517 new | git on PATH; `room_path`; data dir | do not sync without the owner's ruling |
| carrier-drift-watch.js | ABSENT; would register Stop | repo only | 160 new | the repo's own `consonance/tools/carrier-drift.js`, loaded each turn | do not sync without the owner's ruling; see its cost |
| hooks\second-reader-note.js | ABSENT; would register PostToolUse | repo only | 109 new | the REPO versions of second-reader.js and second-reader-worker.js | must be synced together with those two (after them); the owner's ruling first |
| hooks\userprompt-submit.js | ok (bytes match); registered, not declared | same | 0 | lib\fresh-guard.js; reads the log stop.js writes | nothing to sync; a registration question only |
| hooks\stop.js | ok (bytes match); excluded but live | same | 0 | lib\ambient.js | nothing to sync; do not unregister without reading its section |

Loss risk (task 5): none found. Every drifted installed copy is byte-equal to an older commit of the same file. See
section 16.

## (b) One section per hook

Installed mtimes are the repo file's own time at the moment of the copy, not the time of the install [inferred: the
installed sources-gate.js mtime 2026-10-19 18:30:22 equals commit 29260ad9's time to the second].
"Equals commit" below means: `git hash-object --path=<repo path> <installed file>` gave a git-blob id that is the
file's blob at that commit [read: my run].

### 1. hooks\l2-overseer-worker.js  (repo: dev/shell/hooks/l2-overseer-worker.js)

- Installed: mtime 2026-09-20 22:53, equals commit 1a5891af (2026-09-20). Repo: 1c5b4f2d, 2026-09-23 [read].
- Change, +7 -1: one sentence in the judge's prompt is replaced, and a 6-line comment says why [read: repo :39-44, :55].
  Old: "if you can't lose by saying it, suspect it." New: "If you'd have said it whether or not it were true, it
  carries no information. Then go find out separately whether it's true."
- Requires only fs, path, os, child_process [read: repo :11-14].
- It runs only when hooks\l2-overseer.js spawns it [read: installed hooks/l2-overseer.js:43]. That hook is excluded
  and not in settings.json [read: -Check line 5023; settings.json list]. So the worker does not run on D [inferred].
- Verdict: safe to sync alone. No live effect.

### 2. userprompt_pulse.py  (repo: dev/shell/hooks/userprompt_pulse.py)

- Installed: mtime 2026-09-09 08:37, equals commit 5889d3cd (2026-09-07). Repo: 49adc96d, 2026-10-25 [read].
- Change, +6 -0: the data-dir resolver gains a third step, `~\.consonance`, for a user with an empty `data_dir`
  [read: repo :188-193]. On D `data_dir` is `C:\Consonance\data` [read: ~/.consonance.json], so the step is never
  reached here [inferred].
- Imports json, os, datetime, sys, subprocess; runs `node <repo>/consonance/tools/chain-status.js` [read: repo
  :23-25, :312-331]. Nothing new.
- Not registered on D. The pulse that runs on D is hooks\userprompt-submit.js [read: settings.json list].
- `-Only userprompt_pulse.py` also tries to register it [read: install.ps1:15, :223-224]. The Conflicts guard then
  prints REFUSED and adds nothing, because userprompt-submit.js is live on the same event [read: install.ps1:927-944].
- Verdict: safe to sync alone. No live effect. Lowest value of the ten.

### 3. board-digest.js  (repo: consonance/hooks/board-digest.js)

- Installed: mtime 2026-08-25 12:41, equals commit 2c7b3872 (2026-08-25). Repo: a3cefeb9, 2026-11-13 04:29 [read].
- Change, +55 -7, four commits [read: `git log`, repo lines given]:
  - b549201f: every pane in `panes.json` gets a row; a silent one reads "0 exch · idle since launch" (:405-419,
    :491-493).
  - 1c0acf7f: the sealed gate; a sealed reader's digest is muted (:325-337). This is the `sealedGate` require (:39).
  - 65a8cbfb: the Third Place cwd is normalised before its test (:304-307).
  - a3cefeb9: one line at the top names each pane whose newest line is an API error (:90-91, :524-534).
- Dependency: `require('./blind.js')` now needs `sealedGate` [read: repo :39]. The installed blind.js is identical
  to the repo's (`cmp`) and exports it [read: consonance/hooks/blind.js:323; `node -e` on the installed file printed
  "sealedGate: function"]. A missing `sealed.json` is handled [read: blind.js:225-229]. So the failure once found
  for this pair cannot happen on D today.
- Not registered on D: no settings.json entry, no `$register` entry [read]. Its state file
  `C:\Consonance\data\digest_state.json` was last written 2026-07-25 [read: ls; the name is at repo :316]. So it has
  not run on D for months [inferred].
- Verdict: safe to sync alone. No live effect on D. Today's L198 fix does not run on D either way; whether the digest
  should run on D at all is a separate call (in_hooks.md, option 5).

### 4. hooks\second-reader.js  (repo: consonance/hooks/second-reader.js)

- Installed: mtime 2026-10-01 09:38, equals commit aadcc10a (2026-10-01). Repo: bd576735, 2026-11-03 [read].
- Change, +19 -8, three commits:
  - 77bf7c04: data-dir default `~\.consonance` [read: repo :41-42]. No effect on D.
  - acbc2a60 + bd576735: the model call runs on `call_chair` rings only. A `call_librarian` ring writes one
    `skipped-class` row and starts no worker [read: repo :82-89, :106]. Every row now carries `toolUseId` (:105-125).
- Requires fs, os, path, crypto, child_process; spawns `second-reader-worker.js` beside it [read: repo :23-32]. The
  job it sends is the same shape the installed worker already reads (the old hook sent `toolUseId` too) [read: diff].
- It still allows at once and prints nothing [read: repo :3-6].
- What the sync changes on D, measured: since 2026-11-03T15:25Z the installed copy made 237 `ok` model reads of
  `call_librarian` rings, 116 of them with flags, and 248 of `call_chair` rings, 189 with flags [read:
  `C:\Consonance\data\second-reader.jsonl`, 3,955 rows, counted about 09:35 local]. After the sync the 237-kind
  stop; pane rings go unread.
- The ruling: "My ruling, his veto open: NARROW, not stop" and "The installed hook copy is replaced only at the
  restart" [read: plan_room_fixes_2_5_2026-11-03.md:16, :20]. The copy was not replaced [read: the hash above]. The
  hook's own falsifier: revisit if "an error in a pane's ring (call_librarian, now unread) is found that nothing else
  caught" [read: repo :86-88]. An older open recommendation says stop it entirely [read: room_audit_result:33].
- Verdict: no dependency blocks a sync alone. It is the only drifted file whose sync changes what a live hook does.
  Do not sync without the owner's ruling (the veto was left open, and narrow / stop / leave are all on the table).

### 5. hooks\second-reader-worker.js  (repo: consonance/hooks/second-reader-worker.js)

- Installed: mtime 2026-10-01 09:51, equals commit aadcc10a. Repo: acbc2a60, 2026-11-03 [read].
- Change, +1 -1: the ledger row gains `toolUseId` [read: repo :210]. Nothing else.
- Requires fs, os, path, crypto, child_process [read: repo :22-26]. The installed second-reader.js already passes
  `toolUseId` in the job [read: the `<` side of the diff, old :109].
- Today 0 of 3,955 ledger rows carry `toolUseId` [read: my count]. That is what the note hook (section 13) needs.
- Verdict: safe to sync alone.

### 6. hooks\sources-gate.js  (repo: consonance/hooks/sources-gate.js)

- Installed: mtime 2026-10-19 18:30, equals commit 29260ad9 (2026-10-19). Repo: 49adc96d, 2026-10-25 [read].
- Change, +4 -2, all inside `dataDir()`: with no `data_dir` it now returns `~\.consonance`, not null [read: repo
  :79-82]. On D `data_dir` is set, so the gate behaves the same [inferred].
- Requires fs, os, path, crypto [read: repo :33-36].
- hooks\reply-slot.js loads it with `require('./sources-gate.js')` [read: installed reply-slot.js:52] and uses ten of
  its exports. The export list is word-for-word the same in both copies [read: installed :402, repo :404].
- It is the only hook that can deny a ring [read: install.ps1:306-308]. D runs `gates_mode` light [read:
  ~/.consonance.json], where it warns and delivers (commit 29260ad9, the installed copy). Since 2026-11-06 its ledger
  on D reads warn 410, allow 231, deny 0 [read: `sources-gate.jsonl`, my count].
- A bad copy would touch every ring and, through reply-slot, every librarian and chair stop. The repo copy parses
  (`node --check`) [read].
- Verdict: safe to sync alone. Sync it between rings, and watch the next ring (section c).

### 7, 8, 9. hooks\push-gate.js, hooks\delete-gate.js, hooks\ask-ending.js  (repo: consonance/hooks/)

- Installed: push-gate and delete-gate mtime 2026-10-08 19:14, equal commit e8f85486; ask-ending mtime 2026-10-06
  02:29, equals 2cbc3608. Repo: all three at 77bf7c04, 2026-10-25 [read].
- Change, +1 -1 each: `return null;` becomes `return path.join(os.homedir(), '.consonance');` in the data-dir
  resolver [read: repo push-gate.js:50, delete-gate.js:38, ask-ending.js:41]. `os` and `path` were already required
  [read]. No effect on D, where `data_dir` is set [inferred].
- push-gate and delete-gate fire on every Bash and PowerShell call in every seat [read: settings.json matcher
  `Bash|PowerShell`]. Both can deny. ask-ending fires on every Stop and only logs [read: install.ps1:315].
- Their ledgers are alive: `push-gate.jsonl` 2026-11-11 23:32, `delete-gate.jsonl` 2026-11-11 20:59,
  `ask-ending.jsonl` 2026-11-13 09:28 [read: ls of C:\Consonance\data].
- Verdict: each is safe to sync alone.

### 10. hooks\release-chime.js  (repo: consonance/hooks/release-chime.js)

- Installed: mtime 2026-10-09 20:00, equals commit ca8c69df (2026-10-09). Repo: f44e0886, 2026-10-25 [read].
- Change, +11 -4: with no `chime_repos` in the config, the default is now the room's own repository name, taken from
  `room_path`, not the fixed list t180, consonance, lighthouse [read: repo :14-15, :36-42, :167].
- On D `chime_repos` is `["t180-track-builder","consonance"]` [read: ~/.consonance.json], so the default is never
  used here [inferred]. Note that lighthouse is not in D's list today, with either copy.
- The export `DEFAULT_REPOS` is renamed `defaultRepos` [read: repo :224]. No installed file requires release-chime.js
  [read: grep of the installed tree].
- Verdict: safe to sync alone. No behaviour change on D.

### 11. dispatch-gate.js  (ABSENT; repo: consonance/hooks/dispatch-gate.js, 517 lines)

- What it does: before a `chair_inject` or `call_chair`, it looks in the text for a path that exists in the repo or a
  sha git knows. With one, it allows silently. With none, it writes an `asked` row and speaks [read: :129-130,
  :245-270].
- Event: PreToolUse, matcher `mcp__consonance__chair_inject|mcp__consonance__call_chair` [read: install.ps1:293-294].
  No group with that matcher exists in settings.json today, so `-Only` would add a new group and rewrite the file
  (with a backup) [read: settings.json list; install.ps1:885-892, :986-998].
- What it can do: it cannot deny. Its default mode is `print`: a `systemMessage` only [read: :125, :259-268]. Mode
  `ask` (env `CONSONANCE_GATE_MODE=ask`) adds a permission prompt. Its header says bypass-permissions mode drops the
  ask [read: :29-31]. The hooks reference calls `systemMessage` a "Warning message shown to the user" [read via a
  summarising fetch of code.claude.com/docs/en/hooks, 2026-11-13]. So in print mode the line reaches the screen, not
  the model [inferred].
- Why print is the default: "18 asked rows on the live ledger, every one a click he had to make" [read: :107-108].
- Requires fs, os, path, child_process; runs `git status --porcelain` and `git cat-file -t` in the repo, 4 s timeout
  each [read: :38-41, :197-199, :230-232]. Needs `room_path` (present) or it says INERT [read: :218-223].
- History on D: `C:\Consonance\data\dispatch-gate.jsonl` ends 2026-09-09 [read: ls]. No copy or backup of the file
  is in the installed tree [read: ls]. Why it left D I did not find (nor did in_hooks.md:143).
- Overlap: sources-gate.js already reads the same two verbs for an unbacked claim [read: install.ps1:306-309]; see
  section 6 for what it does in light mode.
- Verdict: do not sync without the owner's ruling. It is a new registration, and the click it once cost was the
  reason it was turned down to print.

### 12. carrier-drift-watch.js  (ABSENT; repo: consonance/hooks/carrier-drift-watch.js, 160 lines)

- What it does: at every turn end it loads `<repo>/consonance/tools/carrier-drift.js` and runs `scan` over the repo.
  It prints a few lines only on a new red, and writes a ledger row on every firing [read: :111-158].
- Event: Stop, no matcher, 10 s timeout [read: install.ps1:299, :960]. It has no cwd test, so it would run in every
  session of this user, in any project [read: :111-158].
- What it can do: print, and write `carrier-drift.jsonl` and `carrier-drift.state.json`. It always exits 0. It cannot
  block [read: :159-160].
- Requires: the tool is loaded from the repo's working tree by `room_path` [read: :112-118]. A pull changes what runs.
- Three things the owner should have before deciding:
  - Cost now: the scan took 3,961, 4,218 and 4,117 ms in three runs today (3,153 carriers) [read: my runs of
    `scan({root})`, read-only]. When it last ran the median was 649 ms, p90 1,375, max 4,233 [read:
    `carrier-drift.jsonl`, 4,117 rows, 2026-08-24 to 2026-09-22]. So about 4 s of one core per turn end, per seat.
  - It is RED today: 2 findings, both `CH4-DRIFT-ADDED`, in two `exo_memory/research/*_2026-11-13.md` files [read: the
    same run]. The first seat to stop would "speak".
  - Its line may reach no one. It prints plain text on Stop [read: :137]. The hooks reference says: "For most events,
    Claude Code writes stdout to the debug log and doesn't show it in the transcript", and Stop is not among the
    events whose stdout becomes context [read via a summarising fetch, 2026-11-13]. A Stop hook reaches the model by
    `decision`, exit 2, or `hookSpecificOutput.additionalContext` [read: the page's "Stop decision control" text].
    So as written it would be a 4 s ledger writer [inferred; not tested live]. Its ledger says spoke 68 times; whether
    any of the 68 was seen is not recorded [read].
- Verdict: do not sync without the owner's ruling, and not as it stands.

### 13. hooks\second-reader-note.js  (ABSENT; repo: consonance/hooks/second-reader-note.js, 109 lines)

- What it does: after a `call_chair` ring is delivered, it waits for the second reader's row for that ring and shows
  the ringing seat the flagged sentences as a note [read: :1-7, :83-104].
- Event: PostToolUse, matcher `mcp__consonance__call_chair`, timeout 30 s [read: install.ps1:322-323]. Only the
  librarian's seat can call that verb, so only that seat is touched [inferred from the board rules in this session].
- What it can do: add `additionalContext`. "A NOTE, NEVER A BLOCK": no decision, never a non-zero exit [read: :6-7].
  The ring is already delivered when it fires [read: :3-4].
- It is synchronous. It polls up to 25 s for the row [read: :28, :91-103]. Worker time on D: median 6,797 ms, p90
  9,943 ms [read: my count over the ledger]. So each `call_chair` would hold the librarian's turn about 7 to 10 s.
- How often it would speak on D: 189 of the last 248 `ok` `call_chair` rows have flags [read: my count]. About 3 in 4.
- Requires fs, os, path [read: :22-24], and two things from its neighbours:
  - a `skipped-class` or `ok` row carrying `toolUseId`. Only the REPO second-reader.js and worker write that field
    [read: sections 4 and 5]. The installed pair writes none (0 of 3,955 rows).
  - With the installed pair it would find no row, wait while the worker holds the lock, then give up silently or
    write `note-timeout` [read: :101-102]. A wait with nothing shown.
- The installer says the same: "Install with -Only second-reader.js,second-reader-worker.js,second-reader-note.js"
  [read: install.ps1:174].
- Verdict: must be synced together with second-reader.js and second-reader-worker.js, after them. It is a new
  registration, so the owner's ruling first. in_hooks.md:113 found no word of his on it.

### 14. hooks\userprompt-submit.js  (registered, not declared; the file is `ok`)

- What it does now, on every prompt in every seat [read: installed file]:
  - prints one `[pulse]` line: date and time, the thread's age, a NEW DAY mark (:229-247);
  - adds the chain line by running `<repo>/consonance/tools/chain-status.js`, 3 s timeout; not for the Third Place
    (:255-272, :319);
  - adds "The interval, witnessed" when over 60 s passed since the last turn end here (:187-200, :68);
  - surfaces new non-stable L3 verdicts (:102). The L3 overseer is excluded, so none arrive [inferred].
  - It never blocks. A fresh pane gets nothing (:311).
- Why "not declared": the Node pulse's `$register` line was removed on 2026-08-31, because on L the file was never
  installed. The comment foresaw D: "If the desktop runs the Node pulse its -Check will now say REGISTERED, NOT
  DECLARED for it, which is the true state" [read: install.ps1:210-222].
- Why it runs on D: "the [pulse] beacon goes live on D", 2026-09-21, installed with
  `-Only session-start.js,l2-overseer-worker.js,userprompt-submit.js` [read: loop/install_D_2026-09-21.md:3-4, :11].
- Its file is managed and matches the repo (65a8cbfb, 2026-10-05) [read: -Check line 7; `cmp`].
- A stale comment: install.ps1:100-112 still calls this entry a HOLD. No entry carries a `Hold` flag any more; the
  flag is read at :447 and set nowhere [read: grep]. Commit b718b91d says "install.ps1 Hold removed" [read]. So a
  differing installed copy would now be overwritten, with a `.bak` [inferred from :457-467].
- Verdict: nothing to sync. The red line is the true state by the installer's own words. [ours] Either accept it, or
  give `$register` a per-machine way to declare the Node pulse on D.

### 15. hooks\stop.js  (excluded by ruling, but live; the file is `ok`)

- What it does now, on every turn end in every seat: appends one `session_stop` row (time, cwd, transcript path,
  session id, a sky snapshot) to `~\.claude\shell\event_log.jsonl`, and prints `{}`. It never blocks [read: installed
  hooks/stop.js:2-4, :59-81].
- Three live hooks read what it writes [read: installed files]:
  - hooks\userprompt-submit.js:156-200: the "interval, witnessed" line in the pulse;
  - hooks\session-start.js:143-156, :323-330: the "night table" boundary, the last stop here by another session;
  - hooks\session-end.js:186-198, :259: the daily digest's turn count.
  If stop.js were unregistered, these would go on reading a log that no longer grows [inferred]. Nothing would error.
- The ruling as written, 2026-09-06 06:55: "the three passengers (`hooks\stop.js`, the l2/l3 overseers) stay
  unregistered" [read: exo_memory/librarian/2026-09-06.md:603].
- What the installer says of D: the ruling is "the LAPTOP lineage's", and on D the three "had been live since June"
  [read: install.ps1:245-248]. The 09-21 answer named the overseers only: "stop.js is NOT covered ... On D it still
  reports EXCLUDED BUT LIVE, which is the true, open state" [read: install.ps1:254-255]. The overseers were later
  taken off D by hand (D105, 09-22) [read: install.ps1:259-266]. No ruling I found names stop.js on D.
- Repo history: 58b94f98 (imported 08-17), b4c29779 (dream gate), 1114eb7e, 7b101b11 (09-21) [read: `git log`].
- Verdict: nothing to sync. Do not unregister it to make -Check green. [ours] If the owner wants it live on D, the
  installer already has the form: `LiveOn = @('D')` on the entry (install.ps1:248-253, "left in place and now
  unused", :265). -Check on D would then read "LIVE HERE BY RULING". That is a repo edit, for a pane.

### 16. Installed copies newer than the repo, with logic the repo lacks (task 5)

- None among the 36 managed entries.
  - The 10 DRIFT copies each equal an older commit of their own file (the hashes in sections 1-10) [read].
  - The other 23 present copies are byte-equal to the repo [read: -Check `ok`].
  - The repo's working tree is clean under `dev/shell` and `consonance/hooks` [read: `git status --short`].
- Code that exists only on this machine, and that no sync can overwrite, because the installer writes only to a
  manifest entry's own `To` path [read: install.ps1:443, :461, :466]:
  - `l2-audit.js`, `l3-audit.js` (2026-06-24), in no repo file list [read: `git ls-files`]; not registered.
  - 13 `_tmp_*` and `_ja*` scratch scripts; 11 `*.pre-install-2026-09-21*` copies under hooks\; 3,179 files under
    `mcp\` and 1,744 under `duration\` [read: -Check's UNCLAIMED list, grouped]. I opened none of them.
- No registered hook points at a machine-only file [read: settings.json list].

### Seen in passing (not asked; each is one line of evidence)

- `ask-surface.js` runs on D from the repo path, on every prompt [read: settings.json]. in_hooks.md finding 3 has it.
- `event_log.jsonl` is 20,332,311 bytes, 42,258 rows. session-start.js:146 reads the whole file at a new session's
  start (not on compact or resume, :328-330). userprompt-submit.js:69 still says "the log is ~2MB" [read].
- The installer's closing text (install.ps1:1036-1080) describes L, not D [read].

## (c) A proposed order of single-entry syncs [ours]

Run from the repo root, one entry per run, at a moment when no ring is in flight:

    powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Only <leaf>

The same four checks after every step:
1. The run prints `-Only: 1 of 36 manifest entr(ies) ...` and `synced   <path>` [read: install.ps1:399, :467].
2. A `<file>.bak-<stamp>` now sits beside the installed file [read: install.ps1:461]. That is the rollback: copy it back.
3. A bare `-Check` shows that entry `ok`, one DRIFT fewer, and the registration block unchanged.
4. For steps 1-8, `settings.json` is untouched: sha256 4266711b35be030e…, 4,942 bytes, mtime 2026-11-13 09:01 [read].
   The run should say "registration: already correct" [read: install.ps1:984]. A REPOINT or ADD line there is a red.
   The installer resolves node to `C:\Program Files\nodejs\node.exe`, the path already registered [read], so none
   is expected.

A synced file is used at the hook's next firing [inferred: each firing starts a new `node <path>`]. A new
registration needs `/hooks` opened or a restart [read: install.ps1:1028-1030].

| # | `-Only` | why here | proof it worked | what would show it broke |
|---|---|---|---|---|
| 1 | `l2-overseer-worker.js` | dormant; proves the procedure on a file nothing runs | check 1-4; `grep -c "carries no information"` on the installed file gives 1 | nothing live can break |
| 2 | `board-digest.js` | not registered on D | check 1-4 | nothing live can break |
| 3 | `second-reader-worker.js` | additive; needed before step 10 | the next `ok` row in `second-reader.jsonl` has a `toolUseId` | no new `ok` row after a ring; `error` rows; `second-reader.lock` older than 3 minutes |
| 4 | `ask-ending.js` | fires most often, cannot block | `ask-ending.jsonl` goes on gaining rows at turn ends (its mtime tracks them today) | the ledger stops growing; rows with `decision: error`; a Stop hook error on screen |
| 5 | `release-chime.js` | cannot block | at the next push to main on a listed repo, `release-chime.jsonl` gains a row | no row after such a push |
| 6 | `delete-gate.js` | can deny; fires on every shell call | any shell call runs clean; the next recursive delete adds a `delete-gate.jsonl` row | "PreToolUse:Bash hook error" on shell calls |
| 7 | `push-gate.js` | can deny; guards pushes | the next `git push` adds a `push-gate.jsonl` row and goes through | a hook error on shell calls; a push denied with no file and line named |
| 8 | `sources-gate.js` | it sits on every ring; do it between rings | the next ring is delivered and `sources-gate.jsonl` gains its row; the next `reply-slot.jsonl` row has no gate error | any ring denied (light mode has denied none since 11-06); `reply-slot.jsonl` rows with an `error` naming the gate; either ledger stops |
| 9 | `second-reader.js` | ONLY on the owner's word (section 4) | a pane's ring writes a `skipped-class` row; a `call_chair` ring still writes an `ok` row, both with `toolUseId` | `call_chair` rings skipped too; `error` rows |
| 10 | `second-reader-note.js` | ONLY on the owner's word, and only after 3 and 9 | the run prints `ADD PostToolUse second-reader-note.js` and a backup path; after `/hooks` or a restart of the librarian's seat, a flagged ring writes `note-shown` and the note appears in that turn | `note-timeout` rows; `call_chair` taking 25 s; no `note-shown` after a flagged ring |

Left out of the order, with the reason:
- `userprompt_pulse.py`: it does nothing on D. If it is synced for tidiness, expect the REFUSED line (section 2). An
  ADD line there would mean two pulses: restore `settings.json` from the backup the run names.
- `dispatch-gate.js`, `carrier-drift-watch.js`: a ruling each, and for the second a fix first (section 12).
- `userprompt-submit.js`, `stop.js`: the files are in sync. Their question is registration, by hand, not by `-Only`.

After step 8 with nothing else done, -Check on D would read: 2 DRIFT (second-reader.js, userprompt_pulse.py),
3 ABSENT, and the same registration block [inferred].

An alternative I did not test: `-Only <leaf> -NoRegister` copies the file and exits before the settings step [read:
install.ps1:823-830]. No test covers that pair of flags [read: grep of the `*.test.js` files].

## (d) What I did not open

- No test was run: not the hooks' `*.test.js`, not the mutation harness, not `install-only.test.js`. `node --check`
  on the 12 repo .js copies is the only execution of them (all parse). The Python file was read, not parsed.
- No hook was fired, by hand or with a synthetic payload. Every "what happens on D" line above is from reading the
  file and its ledger, except the carrier-drift scan, which I ran read-only three times.
- Hook bodies outside the changed hunks and the lines cited: second-reader-worker.js (only :210 and its requires),
  sources-gate.js, push-gate.js, delete-gate.js, release-chime.js, dispatch-gate.js :130-185 and :272-517.
- `consonance/tools/carrier-drift.js` (run, not read) and `chain-status.js` (not opened).
- Machine L. Everything here is D.
- The primary notes behind D105, D203, D212, D248, D281 and D454: read only as quoted in install.ps1 or a commit
  subject. For D631 I read plan_room_fixes_2_5 :15-20 and :33-41, not the hand-back.
- Whether the owner has since answered recommendation A or the D631 veto: I searched librarian/2026-11-03.md, 11-04
  and M.md for the terms and found nothing. A wider search was not made.
- The hooks reference: three fetches of code.claude.com/docs/en/hooks today. Two came back as a small model's
  quotations, one as raw text (the Stop section). I did not read the PreToolUse section in raw form, and found no
  sentence there about bypass mode and `ask`; that point rests on the hook's own header.
- The 4,950 unclaimed files in the installed tree, beyond their names.
- Whether `C:\Consonance\data\dispatch-gate.jsonl` and `carrier-drift.jsonl` rows were written on D or came from L by
  a state sync (a `carrier-drift.jsonl.pre-union-2026-09-22…` file sits beside them).

SOURCES: dev/shell/install.ps1 (read whole) and its -Check output; ~/.claude/settings.json; ~/.consonance.json;
installed ~/.claude/shell/{hooks/stop.js, hooks/userprompt-submit.js, hooks/session-start.js, hooks/session-end.js,
hooks/reply-slot.js, hooks/l2-overseer.js, blind.js}; the 13 repo sources named above (diff, git log, git
hash-object, node --check); C:\Consonance\data ledgers (second-reader.jsonl, carrier-drift.jsonl, ls);
exo_memory/handback/p-d-update-P_2026-11-13.md; loop/room_better_2026-11-13/in_hooks.md;
loop/plan_room_fixes_2_5_2026-11-03.md; loop/room_audit_result_2026-11-02.md; loop/install_D_2026-09-21.md;
librarian/2026-09-06.md:603; map/M.md:1029-1033; code.claude.com/docs/en/hooks (fetched 2026-11-13)
NEXT: librarian put the per-hook calls (sections 4, 11, 12, 13, 15) to the keeper when this file is read
