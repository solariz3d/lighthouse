# Every drifted, absent and unregistered hook entry on D, re-derived at HEAD (Opus reader, 2026-11-13 ~19:20Z)

**Summary (five lines).**
1. -Check re-run at HEAD 2c396481 gives the morning's result exactly: 23 ok, 10 DRIFT, 3 ABSENT, 4 declared-not-registered,
   1 registered-not-declared, stop.js excluded-but-live; every DRIFT copy equals an older commit of its own file; repo is newer.
2. All 10 DRIFTs began AFTER the last full sync on D (09-19, "0 DRIFT"): 10 commits touched them since, ~~8 say nothing of
   installing~~ [2nd reader: WRONG; 65a8cbfb (10-05) says "Installed copies under ~/.claude/shell synced from these masters"
   and touched board-digest.js, yet D's board-digest.js is still the 08-25 blob 142a6541; b549201f says "the installed copy is
   refreshed by install" (`git log -1 --format=%B 65a8cbfb`, `b549201f`); a later 0-DRIFT -Check on D is 09-21
   (`handback/p-d098-excluded-B_2026-09-21.md:259`)], 1 says "installed on L", 1 says "not yet installed on L"; none names D. Drift ages: 51, 20, 51, 19, 10, 20, 19x3, 20 d.
3. Only ONE sync changes what a live seat runs: hooks\second-reader.js. Its stale copy has now made 268 model reads of pane
   rings, 2,799,638 tokens, since 11-03 15:25Z (237 / 2.48 M this morning: +31 reads in ~3.5 h); no hook on D reads the flags.
4. The three care claims hold with corrections: the note hook holds the LIBRARIAN's turn (not the ring) up to the worker time,
   median 6.3 s, p90 9.4 s; carrier-drift's scan takes 4.2-5.4 s now (649 ms median when it last ran) and is red with 3 findings.
5. Verdicts: 9 file-only syncs now in one `-NoRegister -Only` run (no live change, no settings.json write); second-reader.js
   with the worker first; note hook after both plus a librarian restart; carrier-drift-watch and dispatch-gate left absent.

Marks: [read] I opened it (path:line); [inferred] mine; [ours] a proposal; [summary] from another swarm file. Digests carry
their function. "Installed" = `C:\Users\nname\.claude\shell\`. Repo = `C:\Users\nname\Desktop\lighthouse` at HEAD 2c396481,
branch main, `git status --short -- consonance/hooks dev/shell` empty [read]. Nothing was installed, copied, registered or
edited. I ran: `install.ps1 -Check` once (report-only: every write in the script sits in a non-Check branch or after the
Check branch's `exit`, install.ps1:376-379, :437-467, :586-758 [read]); `carrier-drift.js` `scan()` three times in-process
(the tool has no write call: grep for writeFile/appendFile/mkdir/unlink/rename/spawn finds none [read]); node readline
passes over ledgers and one transcript tail (numbers, hook names, timestamps only). No test file was run.

## 0. The instrument, re-run

- `powershell -File dev/shell/install.ps1 -Check`, exit 1, 5,031 lines, ~19:05Z [read: its output]. File states: DRIFT at
  output lines 12, 16, 18, 28, 29, 31, 33-36; ABSENT at 26, 27, 30. Registration block, lines 5011-5031: 19 hooks across 7
  events; 4 DECLARED NOT REGISTERED (userprompt_pulse.py, dispatch-gate.js, carrier-drift-watch.js,
  hooks\second-reader-note.js); 1 REGISTERED NOT DECLARED (hooks\userprompt-submit.js); 1 EXCLUDED BUT LIVE (hooks\stop.js).
- `~/.claude/settings.json`: 4,942 B, mtime 2026-11-13 09:01:54, sha256 4266711b35be030e… [read]. Same as the first pass's
  line 310, so nothing has been installed or registered on D since this morning.
- `~/.consonance.json`: gates_mode "light", data_dir `C:\Consonance\data`, chime_repos ["t180-track-builder","consonance"],
  machine_tag "D" [read: node parse of those five keys only].

## 1. The three claims that needed care, checked at their primaries

**(a) second-reader.js: "installed copy from 10-01; a sync applies the 11-03 ruling; 237 reads, ~2.48 M tokens".**
- Installed copy: git-blob abcbff60 = the file at aadcc10a (2026-10-01 10:12); mtime 2026-10-01 09:38 [read: `git
  hash-object --path`, matched over the file's 4 commits]. HEAD blob 2d161fbd. Holds.
- The ruling: "My ruling, his veto open: NARROW, not stop" and "The installed hook copy is replaced only at the restart"
  (exo_memory/loop/plan_room_fixes_2_5_2026-11-03.md:16, :20) [read]. The repo copy carries it: `READ_TOOLS` is call_chair
  only, and any other ring writes one `skipped-class` row and starts no worker (consonance/hooks/second-reader.js:89, :106)
  [read]. The app restarted on D today (pid 24164, 08:42, per 00_build_paths.md second reader, line 25 OK) [summary] and the
  copy was not replaced: the restart named in :20 has no install step [inferred]. Holds, with one precision: it is the
  librarian's ruling with his veto open (plan :16), and no word of his on it was found ~~(section 6)~~ [2nd reader: the
  search is in "What I did not open", not section 6, which is Lap W].
- The count, re-derived now: since 2026-11-03T15:25Z, call_librarian `ok` 268 rows, 133 with flags, 2,799,638 tokens
  (in+out+cacheRead+cacheCreate); call_chair `ok` 280, 210 flagged, 1,321,109 tokens; skipped-busy 28; error 3
  [read: `C:\Consonance\data\second-reader.jsonl`, 4,024 rows, node pass ~19:00Z]. All-time `skipped-class` rows: 0.
  Rows carrying `toolUseId`: 0 of 4,024 [read]. So "237 / 2.48 M" was true at 15:27Z and is still growing.
- Who sees the flags today: nothing in the installed tree reads `second-reader.jsonl` except the reader pair (sources-gate.js
  mentions it only in a comment, :52) [read: grep over `~/.claude/shell/*.js` and `hooks/*.js`]. So a sync changes what
  the room SPENDS, not what any live seat sees or is refused [inferred]. [2nd reader: one more effect, inferred: a pane-ring read
  holds the one lock, and 11 call_chair rings since 11-03 15:25Z were `skipped-busy` (ledger count); with pane rings unread,
  fewer chair rings go unread.]

**(b) second-reader-note.js: "a sync would hold each ring 7 to 10 seconds".** Corrected.
- It is a PostToolUse hook: the ring is already delivered when it fires (consonance/hooks/second-reader-note.js:3-6) [read].
  What it holds is the ringing seat's turn, and only on `call_chair` (:26), which only the librarian's mount may call [read:
  this session's consonance MCP server instructions].
- It polls the ledger every 250 ms for this ring's row by `toolUseId`, up to 25 s (:28, :30, :92-104) [read]. The worker
  started at PreToolUse, so the wait is the worker time minus the delivery time [inferred]. Worker time on call_chair rows in
  November: median 6,332 ms, p90 9,390 ms, n 399 [read: ledger `ms`]. So "up to about 6 s, 9 s at p90" is the bound.
- Rate: 292 call_chair rings since 11-03 15:25Z (280 ok, 11 busy, 1 error) over ~10.2 days, ~29 a day [read]; at ~6.3 s
  each that is ~31 min of librarian turn-time in ten days [inferred upper bound]. It waits on every read ring, flagged or not;
  it speaks on 210 of 280 (75%) [read].
- With TODAY's installed pair it would wait the same time and show nothing: the stale rows have no `toolUseId`, so `findRow`
  (:47-58) never matches; the loop runs while the worker holds the lock, then returns silent (:102) [read]. That is the
  ordering trap, and install.ps1:174 already names the three-file `-Only` [read].

**(c) carrier-drift-watch.js: "about 4 s per turn end, and red".** Holds, and is worse.
- Three in-process `scan({root})` runs now: 4,214, 5,425, 4,537 ms; red; 3 findings; 3,229 carriers [read: my runs]. Two are
  `CH4-DRIFT-ADDED` (two `exo_memory/research/*_2026-11-13.md` files); the third is `UNACCOUNTED` at
  `exo_memory/loop/hooks_drift_D_2026-11-13.md:63`, the first pass itself, which quotes a struck wording [read]. (This file
  avoids that wording on purpose.)
- When it last ran: 4,117 rows, 2026-08-24 to 09-22, median 649 ms, p90 1,375, max 4,233; RED 2,050, spoke 68 [read:
  `carrier-drift.jsonl`]. The scan is about 6.5x slower today [inferred: 4,214 / 649]. [2nd reader: DOWNGRADED; the figures
  re-derive, but they are probably not D's. No D settings backup from 08-28 to 09-22 registers the hook (grep of
  `~/.claude/settings.json.bak-20260828-ask`, `-20260919-012157`, `-librarian-20260919`, `-d105-overseersoff-20260922`: 0), and
  D's pre-union file, `dispatch-gate.jsonl`, `ferry.jsonl`, `read_ledger.jsonl` and `experiments` share one mtime to the
  second, 09-09 08:59:06, which reads as a bulk copy [inferred]. The rows after 09-09 came in by the 09-22 union.]
- It runs on every Stop in every session of this user: no cwd test in main() (carrier-drift-watch.js:111-158) [read]. D had
  3,213 Stop events in November to 19:12Z (`session_stop` rows in `~/.claude/shell/event_log.jsonl`) [read]: at ~4.5 s each,
  ~4.0 h of scan time in 13 days [inferred].
- Hooks on one event run in parallel (local download of code.claude.com/docs/en/hooks, `scratchpad/dl/hooks.md:407`) [read],
  so it would set every turn end at ~4-5 s, against ~100-120 ms for the Stop hooks that print today (transcript tail, Stop
  "command hook 1/3/4", medians 109, 97, 121 ms, n 90/90/27) [read: numbers only].
- Its words reach no one: it writes plain stdout on Stop (:137) [read]; "For most events, Claude Code writes stdout to the
  debug log and doesn't show it in the transcript" and Stop is not in the list that follows (`dl/hooks.md:834-837`) [read].

## 2. The table

Age = days from the first repo commit the installed copy lacks to 2026-11-13 (for ABSENT: since the last record of it
absent). "Live seat" = what a running seat sees, is told, or is refused, by event. Every sync below is a file copy that the
NEXT firing uses (each firing starts a new node process) [inferred]; none needs a rebuild of the app.

| entry | state on D | age d | what a sync changes for a live seat | cost per run (measured) | verdict | check red today -> green after |
|---|---|---|---|---|---|---|
| hooks\l2-overseer-worker.js | DRIFT; dormant | 51 | none: spawned only by l2-overseer.js (Stop), Excluded and unregistered | 0 runs (spawner unregistered) | sync now, file only | git-blob a589651f != HEAD 3f01baa9; `grep -c "carries no information"` installed = 0 -> 1 |
| userprompt_pulse.py | DRIFT; not registered | 20 | none (UserPromptSubmit runs the Node pulse); `-Only` w/o -NoRegister would print REFUSED | 0 runs | sync now, file only (-NoRegister) | blob 19061e53 != e9be1eaa; `grep -c D454` = 0 -> 1 |
| board-digest.js | DRIFT; not registered | 51 (newest missing commit: today) | none on D: not registered, so fix 2c (a3cefeb9) does not run here either way | 0 runs since <=07-25 (`digest_state.json` mtime) | sync now, file only; REGISTERING it on D is his word | blob 142a6541 != 8b504225; `grep -c sealedGate` = ~~0 -> 1~~ [2nd reader: 0 -> 2; the repo copy has it on 2 lines] |
| hooks\second-reader.js | DRIFT; live, PreToolUse call_librarian\|call_chair | 19 (behaviour: 10) | PreToolUse: pane rings (call_librarian) stop being sent to a model; no seat sees a difference (flags reach no one) | hook <=1.5 s by its own timer ~~(:121)~~ [2nd reader: :123]; worker on a pane ring: median 6,735 ms, ~10.4 k tokens; ~26 pane rings/day | sync with a named condition: worker first, between rings; tell him the veto he holds is now in force | `skipped-class` rows = 0 of 4,024 -> >0 after the next pane ring; call_librarian `ok` rows after the sync time = 0 |
| hooks\second-reader-worker.js | DRIFT; live (spawned per read ring) | 10 | none seen: each ok row gains `toolUseId` | median 6,332 ms (chair) / 6,735 (pane), Nov | sync now (before second-reader.js) | rows with `toolUseId` = 0 of 4,024 -> next `ok` row has it |
| hooks\sources-gate.js | DRIFT; live, PreToolUse on 3 ring verbs; also loaded by reply-slot.js (Stop) | 20 | none on D: diff is only the no-data_dir fallback (:79-82); D sets data_dir; exports equal | no duration field; 1,311 rows Nov (warn 1,003, allow 308, deny 0) | sync now, between rings | blob 198710bb != 56f28cf7; next ring adds a `sources-gate.jsonl` row and `reply-slot.jsonl` shows no gate error |
| hooks\push-gate.js | DRIFT; live, PreToolUse Bash\|PowerShell | 19 | none on D (data-dir fallback only, :50) | no duration field; 157 rows Nov (allow 155, allow-error 2) | sync now | blob 10400035 != 5e28e575; next push adds a row |
| hooks\delete-gate.js | DRIFT; live, PreToolUse Bash\|PowerShell | 19 | none on D (fallback only, :38) | no duration field; 171 rows Nov (all allow) | sync now | blob 50c5f477 != 4b8a60ce; next recursive delete adds a row |
| hooks\ask-ending.js | DRIFT; live, Stop (shadow) | 19 | none on D (fallback only, :41) | no duration field; 1,355 rows Nov | sync now | blob 05e6b613 != f66ef873; rows keep arriving at turn ends |
| hooks\release-chime.js | DRIFT; live, PostToolUse Bash\|PowerShell | 20 | none on D: the default list is used only with no chime_repos; D sets two | 14 rows Nov (12 chimed, 2 debounced) | sync now | blob 484a503d != 905d76e1; `grep -c defaultRepos` = ~~0 -> 1~~ [2nd reader: 0 -> 3] |
| dispatch-gate.js | ABSENT; declared PreToolUse | >=55 (absent at 09-19) | would add a `systemMessage` to the screen before call_chair / chair_inject without a path or sha; never denies (print mode) | 0 runs Nov; 525 rows 08-24..09-09 [2nd reader: those rows are probably not D's, see the note in section 1(c)] | leave absent; registering is his word (W4 copies sources-gate, not this) [2nd reader: and a recorded hold: "NOT installed, on purpose" (`loop/install_D_2026-09-21.md:14`; `librarian/2026-09-21.md:102`)] | n/a |
| carrier-drift-watch.js | ABSENT; declared Stop | >=55 | +4-5 s at every turn end in every seat and project; its line goes to the debug log only | 4,214-5,425 ms now; 0 runs Nov | hold: not as written; his word | n/a (a fix first: section 4) |
| hooks\second-reader-note.js | ABSENT; declared PostToolUse call_chair, 30 s | 10 | PostToolUse: the librarian's turn waits ~6 s (p90 ~9) after each call_chair; a note on ~75% of them | 0 runs; would be the worker time | sync with a named condition: after the pair, then /hooks or a librarian restart | `note-shown` rows = 0 -> >0 after the first flagged call_chair |
| hooks\userprompt-submit.js | ok; registered, not declared | 0 | nothing to sync | every prompt; no own ledger (writes a state file, :96) | leave; a declaration question | n/a |
| hooks\stop.js | ok; excluded but live | 0 | nothing to sync | 3,213 runs Nov; Stop hook 1 median 109 ms [inferred mapping] | leave registered (delegated 09-19, section 5) | n/a |

## 3. Per entry: the numbers behind the table

Diff = `diff --strip-trailing-cr installed repo`; "-a +b" = lines only in installed / only in repo [read: all rows].
"= commit" = the installed git-blob equals that commit's blob [read]. "Since" = commits on the file after it, at HEAD [read].

- **l2-overseer-worker.js** (dev/shell/hooks/): -1 +7; first hunk `38a39,44` adds a dated REPAIRED comment, then the judge
  prompt's ASK-008 line is replaced. = 1a5891af (09-20); mtime 09-20 22:53; since: 1c5b4f2d (09-23, "installed on L").
  Ledger rows: L0286.
- **userprompt_pulse.py**: -0 +6, `187a188,193` the D454 data-dir step. = 5889d3cd (09-07); mtime 09-09 08:37; since
  49adc96d (10-24). Python is on PATH on D now (Python312, Python314) [read: Get-Command]; the 09-19 note said "there is no
  Python on D" (loop/keeper_rulings_owed_2026-09-19.md:8) [read]. The Conflicts guard still refuses to register it beside the
  Node pulse (install.ps1:223-224) [read]. Ledger rows: none.
- **board-digest.js** (consonance/hooks/): -7 +55, first hunk `39c39` the blind.js require gains sealedGate. = 2c7b3872
  (08-25); mtime 08-25 12:41; since b549201f (09-23), 1c0acf7f (09-24), 65a8cbfb (10-05), a3cefeb9 (11-13, fix 2c). Installed
  blind.js is `ok` in -Check, so the L0995 trap (throw on every prompt) cannot happen on D [read: -Check; first pass §3].
  Ledger rows: L0020, L0290, L0616, L0995, L1079, L1087. L1079/L1087 are true for D only in a weaker form: the fix is not live
  on D because the digest is not registered on D at all, not because of the drift [inferred].
- **second-reader.js**: -8 +19, first hunk `41,42c41,42` (data-dir), then the READ_TOOLS block. = aadcc10a; since 77bf7c04
  (10-25), acbc2a60 (11-03), bd576735 (11-03). November rows 814 (ok 778, busy 33, error 3). Ledger rows: L0326, L0334, L0372,
  L0613.
- **second-reader-worker.js**: -1 +1 at :210 (`toolUseId` in the row base). = aadcc10a; mtime 10-01 09:51; since acbc2a60.
  The installed reader already passes `toolUseId` in the job (installed worker :216 reads `job.toolUseId`) [read].
  Ledger rows: none by name (the "second reader" grep hits 40 rows, nearly all about swarm second readers).
- **sources-gate.js**: -2 +4 at `79,80c79,82`. = 29260ad9 (10-19; mtime equals the commit to the second); since 49adc96d.
  `module.exports` lines are identical (installed :402, repo :404) and reply-slot.js loads it (installed reply-slot.js:52)
  [read]. Ledger rows: L0328, L0364, L0391, L0428, L0429, L0593, L0996.
- **push-gate.js / delete-gate.js / ask-ending.js**: -1 +1 each, `return null;` -> the `~\.consonance` default (repo
  push-gate.js:50; delete-gate :38; ask-ending :41). = e8f85486, e8f85486, 2cbc3608; mtimes 10-08 19:14, 10-08 19:14,
  10-06 02:29; since 77bf7c04. Rows are D's: every push/delete row's cwd is under `C:\Consonance\instances` and ask-ending's
  projects are D's seat folders [read]. Ledger rows: push-gate L0354 L0355 L0532 L0544 L0627 L0696 L0702 L0996 L1044 L1078;
  delete-gate L0321 L0353 L0996; ask-ending L0352 L0387. **L1044 does not hold for D as worded** ("the desktop needs its own
  install" of the push gate, handback/p-l198-403-stall-B_2026-11-13.md:8-10): D's push gate is registered and has 157 rows
  this month, last 11-12 05:32Z; only its data-dir line differs [read].
- **release-chime.js**: -4 +11; `DEFAULT_REPOS` -> `defaultRepos(cfg)` (repo :36-42, :167). = ca8c69df (10-09); since f44e0886.
  Note: lighthouse is in D's chime_repos neither before nor after. Ledger rows: none.
- **dispatch-gate.js**: 517 lines, HEAD blob 074d228c, last commit fef1ead5 (08-31). Declared since dd9f75ac (08-24). ABSENT
  already on 09-19 (keeper_rulings_owed:31) [read]. ~~LEDGER.md:72 says settings.json:86 ran it on 08-31 [read: grep line].~~
  [2nd reader: DOWNGRADED to another machine: `librarian/LEDGER.md:72` is lap L022, the laptop.] ~~Why
  it left D: not found.~~ [2nd reader: no D settings backup from 08-28 on registers it (four backups grepped, 0 hits), so it may
  never have been in D's user settings; the absence since is a recorded hold, "do not install - would register new hooks"
  (`librarian/2026-09-21.md:102`, D097) and "NOT installed, on purpose" (`loop/install_D_2026-09-21.md:14`).] Its ledger's last row 09-09T13:54Z and its mtime 09-09 08:59 equal the mtime of
  `carrier-drift.jsonl.pre-union-…`, so these rows may have come from a state union, not from D [inferred]. Ledger rows:
  L0050, L0051, L0089, L1091.
- **carrier-drift-watch.js**: 160 lines, blob 5b9de8a3, last commit f5d7d010 (08-24). ABSENT on 09-19 too. Same provenance
  doubt for its ledger (last row 09-22T13:44Z, union file 09-22T15:39Z) [inferred]. Ledger rows: L0051, L0067, ~~L0148, L0163,
  L0191, L0280, L0286, L0357,~~ L1122. [2nd reader: `grep -F carrier-drift-watch 00_ledger.md` gives these 3; the 6 struck rows
  are about the tool `carrier-drift.js` or (L0286) the l2 judge prompt, not this hook.]
- **second-reader-note.js**: 109 lines, blob 3427cbbd, declared 11-03 (acbc2a60, then bd576735). Ledger rows: L1085.
- **userprompt-submit.js**: = 65a8cbfb (10-05), 0 diff. Ledger rows: none by name.
- **stop.js**: = 7b101b11 (09-21), 0 diff. 3,213 `session_stop` rows in November; the log is 20,440,196 B now [read].
  Ledger rows: L0021, L0189, L1009, L1123.

## 4. Why it came back, read off these 15 entries

- On 2026-09-19 D's -Check read "0 DRIFT" after `install.ps1 -NoRegister -Only <the six>`, settings.json unchanged
  (loop/keeper_rulings_owed_2026-09-19.md:8) [read]. Every one of today's 10 DRIFTs comes from a commit after that date
  (section 3). 10 distinct commits; the message of 1c5b4f2d says "Installed on L", a3cefeb9 says "Not yet installed on L",
  ~~the other 8 say nothing about installing~~ [2nd reader: WRONG; 65a8cbfb says installed copies were "synced from these
  masters", one of which is board-digest.js, still 08-25 on D; b549201f, 49adc96d and acbc2a60 also mention install]; none
  names D [read: `git log -1 --format=%B`, grep for install]. [2nd reader: the later 0-DRIFT -Check on D is 09-21
  (`handback/p-d098-excluded-B_2026-09-21.md:259`); b549201f and 1c5b4f2d broke it on 09-23: the clean state lasted 2 days.]
- The 11-03 ruling tied the install to "the restart" (plan :20). The restart came; the install did not, because nothing in the
  restart path compares installed copies with HEAD [inferred; the start path is another reader's task]. [2nd reader: supported:
  in `consonance/src-tauri/src` the only reader of install.ps1 is a test, `main.rs:21628`.]
- So the recorded case for a failing check is L0613: a registered hook whose installed git-blob (abcbff60) is not HEAD's
  (2d161fbd) for 10 days, while it spends tokens. [ours] The smallest check that would have been red on 11-03 and is red
  today: for each hook REGISTERED in settings.json whose path is under `~/.claude/shell`, compare its git-blob with the HEAD
  blob of the manifest's `From`; red if any differ. It is -Check's file loop restricted to live entries, and it costs ~~~19~~
  [2nd reader: 18; the 19th registered hook, ask-surface.js, runs from the repo path] file hashes [inferred: milliseconds].
  Where it runs and who is told is the landing-path reader's question. [2nd reader: probe run read-only
  (`node scratchpad/stale_probe.js`, git hash-object vs HEAD per manifest From): exit 1, 6 stale, the six named in section 6,
  second-reader.js among them, so it is red today for L0613's reason. DOWNGRADED as a design: (1) 5 of its 6 reds are a
  data-dir fallback with no effect on D, and it would have been red for second-reader.js from 10-25 (77bf7c04), 9 days before
  the narrowing: a red that changes nothing for weeks is the -Check pattern that was not acted on; (2) it cannot see L1085 (the
  note hook, declared and ABSENT) nor L1079/L1087 on D (board-digest, not registered): of the R02 rows that are about D, it
  catches the registered-drift kind only; (3) it compares with the checkout's HEAD, so a machine that has not pulled a pushed
  fix reads green (D's HEAD is 120 ahead of its last-fetched origin/main today, so not today's case); (4) the same kind of
  check, -Check itself (DRIFT since 08-24, registration block since 08-25, install.ps1:586-598), is on record red for weeks.]

## 5. Order, and what each step needs

[ours] One run, files only, no settings.json write, as on 09-19 (install.ps1:823-830 exits before the settings step under
-NoRegister) [read]:

    powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -NoRegister -Only `
      l2-overseer-worker.js,userprompt_pulse.py,board-digest.js,second-reader-worker.js,sources-gate.js,push-gate.js,delete-gate.js,ask-ending.js,release-chime.js

- Before: settings.json sha256 4266711b… and 4,942 B. After: the same; a `.bak-<stamp>` beside each replaced file (:461);
  bare -Check reads 1 DRIFT (second-reader.js), 3 ABSENT, registration block unchanged [inferred from :437-467].
- Run between rings (sources-gate and the worker sit on rings). Machine: D only. No rebuild. No restart (registrations are
  unchanged). No word of his needed: a file sync at the same behaviour, the 09-19 form [inferred]. [2nd reader: DOWNGRADED on
  timing and form: the room plan says "one entry at a time" (`loop/plan_room_stretch_2026-11-13.md:81-82`), and the vector plan
  says Lap I's "installs wait for that spec so the installed state does not move under the readers"
  (`loop/plan_vector_swarm_2026-11-13.md:126`). Nine leaves in one run is not the 09-19 form in count; and push-gate and
  delete-gate can deny on every shell call, which ~/.claude/CLAUDE.md puts in "prove it" (installs, overwrites).]
- Then `-NoRegister -Only second-reader.js` (already registered, so no registration change is needed). Needs: the worker synced
  first; the librarian tells him in the same report that pane rings are no longer read from that time and that his veto on
  D631 is open. Green: a `skipped-class` row on the next pane ring.
- Then `-Only second-reader-note.js` (this one must register: a new PostToolUse group, settings.json rewritten whole with a
  backup, install.ps1:986-998) and `/hooks` or a restart of the librarian's seat (install.ps1:1028-1030). It costs the
  librarian ~6 s per call_chair; whether that trade is wanted was ruled inside D631 (b) with his veto open; say so to him.
- carrier-drift-watch.js: [ours] not as written. Before any install: a cwd test (repo seats only), a time budget or a cached
  result keyed on HEAD, and output on a channel that reaches a seat (Stop `decision`/exit 2, or move it to UserPromptSubmit,
  per dl/hooks.md:834-837). That is a repo change for a pane and then his word.
- dispatch-gate.js: leave absent. Lap W's W4 chose sources-gate.js as its model (wake_level2_2026-11-13/00_lap_w_spec.md:40)
  [read]. Retiring it is his word (briefs/lighthouse_the_room.md:204, quoted in the task); leaving it absent changes nothing.
- board-digest.js registration on D: his word; the file sync above does not make fix 2c live on D.
- stop.js: his word on it was delegated: "do what you see is correct bc tbh i have no clue"
  (loop/keeper_rulings_owed_2026-09-19.md:5) [read]; [2nd reader: DOWNGRADED: the seat that used that word wrote that removing
  the three "is a bigger act than the word given today covers. If he wants them gone he says so by name" (same file :10). The
  delegation covers leaving it, not deciding it.] the seat that held it left it registered (:10), and three live hooks
  read its log (first pass §15; librarian/2026-11-13.md:419) [read]. [ours] Leave it; if -Check must stop calling it red,
  the installer's `LiveOn = @('D')` form (install.ps1:248-253) is a repo edit for a pane.

## 6. Where this touches Lap W (not a redesign)

- W2 and W3 install with `-Only` on D (spec :294, :367-373) [read]. A W install leaves today's DRIFTs as they are, and the
  W3 `-Only` rewrites settings.json whole. [ours] Add to each W install step: a bare -Check before and after, with the rule
  that DRIFT and ABSENT counts may only fall; record both counts in the hand-back.
- W3's body line (spec :322-325). [ours] One field more, about 20 B within its 300 B bound: `hooks <n> stale`, the count of
  registered `~/.claude/shell` hooks whose git-blob differs from HEAD (section 4's check). Today it would read `hooks 6
  stale`: second-reader.js, sources-gate, push-gate, delete-gate, ask-ending, release-chime are the 6 DRIFT files that
  settings.json registers [read: settings.json list, -Check]. The worker is spawned, not registered, so the field misses it.
- W4: none of the three ABSENT entries is reused; W4's own install is one more `-Only` and should carry the same before/after.

## What I did not open

- No hook fired, by hand or with a synthetic payload; no test file run (second-reader-note.test.js and install-only.test.js
  not read). Per-run hook durations for the PreToolUse gates are not in their ledgers and were not measured.
- Why dispatch-gate.js left D, and whether its and carrier-drift's ledger rows were written on D or merged from L.
- The D631 hand-back (p-d631-reader-narrowed-P_2026-11-03.md); its figures here are the hook's own comment (second-reader.js:85-88).
- Any word of his on D631 after 11-03 beyond grep of the brief and librarian notes for "veto" near the reader: none found.
- The transcript beyond the last 20,000,000 bytes of the librarian's; Stop "command hook N" to file mapping is inferred.
- The hooks reference beyond `scratchpad/dl/hooks.md:407, :834-837, :1094-1095`; that file was downloaded by another reader.
- Machine L: nothing here is L. Builder worktrees and other branches: not opened.

## Second reader

Adversarial second reader (Opus), D, 2026-11-13 ~19:20-19:40Z. HEAD baa0aef9; `git diff --stat 2c396481 HEAD -- consonance/hooks
dev/shell consonance/tools/carrier-drift.js` is empty, so the first reader's HEAD and mine agree for every file here [read].
Nothing installed, copied, registered or committed. I ran: `install.ps1 -Check` once (read first: before the Check branch's
`exit` at install.ps1:757 every write sits in a non-Check branch, :404-405, :437-467; no process calls before it); `scan()` of
carrier-drift.js once in-process (no write call in the tool, grep); node readline passes over ledgers and `event_log.jsonl`
(numbers only); `git hash-object`, `git log`, `diff`; `Get-Process consonance`; `py -0p`; a read-only probe script in my
scratchpad (`stale_probe.js`: settings.json hooks under `~/.claude/shell`, git-blob vs HEAD blob of the manifest From). No test
file was run. Line numbers in the first column are the first reader's, before my in-place notes moved them.

| line | claim (under 15 words) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 4 | -Check: 23 ok, 10 DRIFT, 3 ABSENT, 4/1 registration | my -Check run | OK | exit 1, 5,031 lines, DRIFT/ABSENT at output lines 12-36 as listed |
| 5 | every DRIFT copy equals an older commit of its file | git hash-object x 10 | OK | all 10 matched; blobs as in table |
| 6 | last full sync on D 09-19, "0 DRIFT" | handback/p-d098-excluded-B_2026-09-21.md:259 | DOWNGRADED | a later D -Check reads 0 DRIFT on 09-21 |
| 6-7 | 8 commits say nothing of installing | git log -1 --format=%B x 10 | WRONG | 65a8cbfb claims installed copies synced; 4 others mention install |
| 7 | drift ages 51,20,51,19,10,20,19x3,20 | git log per file | OK | author dates; by committer date the three 10-24 ones are 19 |
| 8-9 | 268 pane reads, 2,799,638 tokens since 11-03 15:25Z | second-reader.jsonl | OK | 268 ok, 133 flagged, 2,799,638 |
| 11 | note wait median 6.3 s, p90 9.4 s | second-reader.jsonl ms, call_chair Nov | OK | 6,379 / 9,390 ms, n 400 (grew by 1) |
| 11 | scan 4.2-5.4 s, red, 3 findings | my scan() run | OK | 3,955 ms, red, same 3 findings, 3,236 carriers |
| 25-28 | output and registration block lines | my -Check output | OK | 19 hooks / 7 events; same 4 + 1 + stop.js |
| 29 | settings.json 4,942 B, 09:01:54, sha256 4266711b… | stat, sha256sum | OK | identical |
| 31 | gates_mode light, data_dir, chime_repos, machine_tag D | ~/.consonance.json (5 keys) | OK | identical |
| 37 | installed second-reader = aadcc10a, mtime 10-01 09:38 | hash-object, stat | OK | abcbff60, 09:38:36 |
| 39-41 | plan :16, :20 quotes; READ_TOOLS :89, skipped-class :106 | plan_room_fixes_2_5:16,:20; second-reader.js | OK | verbatim |
| 42 | app restarted 08:42, pid 24164 | Get-Process | OK | 24164, 08:42:24 |
| 44 | "no word of his ... (section 6)" | this file | WRONG | the search is in "What I did not open" |
| 45-48 | chair 280 ok / 1,321,109; 0 toolUseId; 0 skipped-class | second-reader.jsonl | OK | now 282 / 1,352,074; 0; 0 |
| 49-50 | nothing installed reads second-reader.jsonl | grep installed tree, repo tools | OK | only the reader pair; sources-gate :52 comment |
| 54-56 | note hook PostToolUse, call_chair only | second-reader-note.js:3-6, :26 | OK | verbatim |
| 57 | polls 250 ms, up to 25 s | second-reader-note.js:28-30, :92-104 | OK | WAIT_MS 25000, POLL_MS 250 |
| 60 | 292 call_chair rings since 11-03 15:25Z | second-reader.jsonl | OK | 280+11+1 at its time |
| 63-64 | stale pair: findRow never matches, silent return | second-reader-note.js:47-58, :102 | OK | needs r.toolUseId; 0 rows have it |
| 65 | install.ps1:174 names the three-file -Only | install.ps1:174 | OK | verbatim |
| 72 | carrier ledger 4,117 rows, median 649 ms | carrier-drift.jsonl; mtimes; 4 settings backups | DOWNGRADED | figures re-derive; probably L's rows (bulk copy 09-09 08:59:06) |
| 74 | no cwd test in main() | carrier-drift-watch.js:111-158 | OK | none |
| 75 | 3,213 Stop events in November | event_log.jsonl type session_stop | OK | 3,221 at 19:22Z |
| 77 | hooks on one event run in parallel | scratchpad dl/hooks.md:407 | OK | "its matching hooks run in parallel" |
| 80-81 | Stop stdout goes to the debug log | carrier-drift-watch.js:137; dl/hooks.md:834-837 | OK | Stop not in the list |
| 93 | `grep -c sealedGate` 0 -> 1 | installed and repo board-digest.js | WRONG | 0 -> 2 |
| 94 | hook timer at :121 | second-reader.js | WRONG | :123 |
| 94 | ~10.4 k tokens per pane read, ~26 a day | ledger | OK | 2,799,638 / 268; 268 / 10.2 d |
| 96-99 | Nov rows: sources 1,311, push 157, delete 171, ask 1,355 | four ledgers | OK | 1,313; 157 (155/2); 171; 1,358 (growing) |
| 100 | release-chime 14 rows; `grep -c defaultRepos` 0 -> 1 | release-chime.jsonl; grep | WRONG | rows OK (12/2); grep is 0 -> 3 |
| 101 | dispatch-gate ABSENT >= 55 d, 525 rows | keeper_rulings_owed:31; dispatch-gate.jsonl | DOWNGRADED | age OK; rows probably not D's |
| 109-152 | per-file diff counts, = commits, mtimes | diff --strip-trailing-cr, hash-object, stat | OK | all 15 re-derived equal |
| 116 | Python on PATH on D now | py -0p; Get-Command -All | OK | 3.12-3.14; `python` resolves first to the WindowsApps alias |
| 137-139 | L1044 does not hold for D as worded | handback p-l198-403-stall-B:7-10; settings.json | OK | D's push-gate registered; drift is data-dir only |
| 143 | LEDGER.md:72: settings.json:86 ran it 08-31 | librarian/LEDGER.md:72 | DOWNGRADED | lap L022: the laptop |
| 143-144 | why dispatch-gate left D: not found | install_D_2026-09-21.md:14; librarian/2026-09-21.md:102 | DOWNGRADED | a recorded deliberate hold; maybe never in D's user settings |
| 142 | declared since dd9f75ac (08-24) | git log -S on install.ps1 | OK | dd9f75ac 08-24 05:25 |
| 148-149 | carrier-drift-watch ledger rows (9) | grep -F 00_ledger.md | WRONG | 3 by file name; 6 are the tool |
| 157 | 09-19: -NoRegister -Only six, 0 DRIFT | keeper_rulings_owed_2026-09-19.md:8 | OK | verbatim |
| 161-162 | restart path has no install step | git grep src-tauri/src | OK | only a test reads install.ps1 (main.rs:21628) |
| 163-167 | the proposed check is red today on L0613's case | my probe | OK | exit 1, 6 stale incl. second-reader.js |
| 166-167 | ~19 file hashes | probe | WRONG | 18 under ~/.claude/shell |
| 171 | -NoRegister exits before settings | install.ps1:822-830 | OK | `exit 0` at :830 |
| 177-185 | .bak at :461; rewrite whole :986-998; /hooks :1028-1030 | install.ps1 | OK | as cited |
| 179-180 | no word of his needed for the nine | plan_vector_swarm:126; plan_room_stretch:81-82 | DOWNGRADED | plans say one at a time and wait for Lap I's spec |
| 190 | W4 copies sources-gate.js | 00_lap_w_spec.md:40 | OK | verbatim |
| 193 | stop.js: his word was delegated | keeper_rulings_owed_2026-09-19.md:5, :10 | DOWNGRADED | :10: removal is beyond the delegated word |
| 200-206 | W spec lines; "hooks 6 stale" today | 00_lap_w_spec.md:292-295, :320-326, :365-374; probe | OK | 6 |

**Tally.** Checked 50: OK 36, WRONG 7, DOWNGRADED 7, UNSUPPORTED 0. Corrected in place: 18 spans marked "[2nd reader: ...]".

**The proposed checks, probed today.**
- Red for the reason given, and would fail on the recorded case: second-reader.js (`skipped-class` rows 0; L0613), the worker
  (`toolUseId` rows 0 of 4,024+), the note hook (`note-shown` rows 0; L1085), and the greps for l2-overseer-worker,
  userprompt_pulse.py, board-digest.js and release-chime.js (0 installed; 1, 1, 2, 3 in the repo).
- Red only by blob for sources-gate, push-gate, delete-gate and ask-ending: their row-arrival clauses are green before and
  after, as they must be when a sync changes nothing on D. They prove the copy, not a behaviour.
- Section 4's registered-stale check: red, exit 1, 6 stale. See the in-place note there for its four holes.

**The design, attacked.**
- The nine-file sync: satisfied by the copy and undone by the next commit to any hook. On record: D's 0 DRIFT of 09-21 lasted
  2 days (b549201f, 1c5b4f2d on 09-23); 65a8cbfb's "installed copies ... synced" did not reach board-digest.js on D.
- second-reader.js: the ruling's own condition, "replaced only at the restart" (plan_room_fixes_2_5:20), has already lapsed
  once: the 11-13 08:42 restart came without it. A check tied to "the next restart" lapses the same way.
- Section 4 and the W3 field `hooks <n> stale`: both read only registered entries, so neither sees ABSENT-declared hooks
  (L1085) or spawned workers; both fire on data-dir-only drift that changes nothing (5 of 6 today). Satisfiable without fixing
  by syncing files with no seat told. They also trust the checkout's HEAD: an unpulled machine reads green.
- The W install rule ("DRIFT and ABSENT may only fall"): a `-Only` run that leaves the counts flat satisfies it. It fires
  wrongly when another hook commit lands between the before and after runs.
- [ours] The recorded case these miss and a gate could hold: a commit that touches a manifest `From` (65a8cbfb, a3cefeb9)
  lands while that entry is not `ok` in a bare -Check on the landing machine. Red today on a3cefeb9 (board-digest.js DRIFT on
  D). It needs a landing-pane step, not a rebuild; where it runs is the landing-path reader's question.

**What each step needs, as it stands after this reading.** No app rebuild for any entry. File-only installs on D: the nine
(one at a time, after Lap I's spec), then second-reader.js (his veto on D631 still open: tell him in the same report). The note
hook adds a PostToolUse registration on D and needs `/hooks` or a restart of the librarian's seat. Registering dispatch-gate,
carrier-drift-watch or board-digest on D, and anything about stop.js beyond leaving it, is his word.

**Could not check.** The Stop hook medians 109/97/121 ms (a transcript pass I did not make); whether the 09-09 08:59:06 files
were copied from L (only their shared mtime and the settings backups were read); the D631 hand-back; any word of his on the
veto after 11-03; L.

## What I did not open (second reader)

- Transcripts (.jsonl under ~/.claude/projects) and the board log: not read.
- `second-reader-note.test.js`, `install-only.test.js`, any test: not run, not read.
- `consonance/tools/carrier-drift.js` beyond its write calls, exports and scan() signature.
- The other files in `landed_live_2026-11-13/` (installer.md, cost_of_drift.md), L's state, builder worktrees.
