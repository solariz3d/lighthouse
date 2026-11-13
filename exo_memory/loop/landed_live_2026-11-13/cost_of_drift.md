# What the installed hook chain costs per turn on D, and what drift adds (2026-11-13, read-only reader)

1. On D, 19 hooks run over 7 events. 12 match the repo. 6 have drifted. One runs straight from the repo path. Only 1 drift
   changes what runs on D: the second reader still reads `call_librarian` rings. That costs 268 reads, 2,799,638 tokens.
2. The claim of 2.48 M tokens over 237 reads is right at 3,955 rows. The stale reads cost about 0.9 M to 1.3 M Fable-input
   units in 10.2 days. That is about 1% of one librarian day per day, on the price assumptions in section 0.
3. The chain's context weight is small. On 11-13 the librarian got 275 chars per user turn (median). All of it came from the
   pulse, plus about 4,800 chars at the one compaction. Re-reading it is about 0.3% to 0.4% of the seat's day.
4. Of the NEITHER list, the pulse lines (STALE, dirty, sync, chain, fused, UNRECEIVED) stopped printing on 11-03 (37c82dbd):
   ~~0 of 88 pulses today~~ [2nd reader: 0 of 86 pulses; 88 is all hook-context rows, the 86 pulses plus 2 SessionStart
   rows (my stream of the librarian transcript, 11-13: UserPromptSubmit `hook_additional_context` 86, SessionStart 2)].
   Two still run: the state block (70 emitted in November) and sources-gate in light mode (1,004
   silent warnings in November, 145 rows today).
5. A recorded pair shows why. On 11-03 the pulse trim (it runs from the repo) was ~~live at once~~ [2nd reader: live at
   the merge into the main checkout, not at its commit. 37c82dbd was committed 14:47:30Z and reached main by the merge
   fe69a9fc at 17:10:05Z (`git reflog`: `HEAD@{2026-11-03 11:10:05 -0600}: merge fe69a9fc`). After 3aed0c72 (14:50:10Z),
   15 of 72 librarian pulses still carried STALE, dirty, NOT in sync and unconfirmed; the last at 17:07:03Z (my stream of
   the librarian transcript, 11-03 to 11-05). bd576735 merged in the same fe69a9fc. The pair holds from 17:10Z, with 2
   of the 268 reads before it]. The second-reader narrowing
   (it runs from an installed copy) is still not live 10 days later. The proposed check is red today on that case.

Seat: a read-only reader in a research swarm, on D, about 19:00-19:20Z. Main checkout HEAD baa0aef9 (2c396481 at start;
nothing under `dev/shell` or `consonance/hooks` changed between them [inferred from `-Check` giving the same 23/10/3 at both
times]). Nothing was installed, registered or edited. I wrote this file and scratch scripts only.
Marks: [read] I opened it (path:line) or ran it (named); [summary] secondary or another swarm file; [inferred] mine;
[ours] a proposal. Times are UTC unless marked local. "Installed" = `C:\Users\nname\.claude\shell\`. "Data" =
`C:\Consonance\data\`. The scratch scripts are in
`C:\Users\nname\AppData\Local\Temp\claude\0d67fc0e125090b2\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\cod\`
(survey.js, keys.js, turns.js, pulse.js, usage.js, lkeys.js, lnov.js, sr_stream.js). Each one streams with readline and
prints numbers, field names, basenames and timestamps only.

## 0. Price assumptions (relative cost only, no dollars)

- These are ASSUMPTIONS about relative cost. They are not any plan's accounting. Per token, relative to the same model's input
  price: output 5, 5-minute cache write 1.25, 1-hour cache write 2, cache read 0.05 on Sonnet 5.5 and 0.025 on Fable 5.2
  [read: `...\bundled-skills\2.1.323\9369bb2b...\claude-api\shared\prompt-caching.md:144`].
- Sonnet 5.5 input is priced at one quarter of Fable 5.2 input. That is the list ratio in the same skill's "Current Models"
  table [read: claude-api SKILL.md, the table]. [2nd reader: no SKILL.md is on disk in that bundle (`ls` of
  `...\2.1.323\9369bb2b...\claude-api\`). The ratio holds from files there: Fable 5.2 "$8 / $40 per MTok"
  (`shared/models.md:78`), Sonnet 5.5 "$2 / $10 per MTok" (`shared/model-migration.md:2104`). Output 5x holds on both.]
- "Fable units" = Fable 5.2 input-token equivalents. This is the unit `00_lean_seats.md` uses (`:6-9`) [read].
- The second reader's worker runs `claude-sonnet-5-5` on every November `ok` row [read: lnov pass over
  `second-reader.jsonl`]. Its cache-write TTL is not recorded, so I give a range: 1.25 (low) to 2 (high) [inferred].

## 1. The registered chain on D, per event, in order

Source: `C:\Users\nname\.claude\settings.json` [read whole]. Every command is `"C:\Program Files\nodejs\node.exe" <file>`.
"-Check" is the file's state in my own `install.ps1 -Check` run (19:15Z, exit 1, 5,031 lines: 23 ok, 10 DRIFT, 3 ABSENT,
the same as this morning) [read: run into scratch `check.txt`; I read `install.ps1:70`, `:398-470`, `:586-600`,
`:750-757` first; every write is in a non-Check branch or after the `-Check` exit at `:757`].

| event | # | hook (path) | timeout | -Check | output reaches |
|---|---|---|---|---|---|
| SessionStart | 1 | installed `hooks\session-start.js` | none | ok | model (additionalContext) |
| SessionStart | 2 | installed `sessionstart-state.js` | 10 | ok | model, compact only (state block) |
| UserPromptSubmit | 1 | installed `hooks\userprompt-submit.js` (the pulse; runs repo `chain-status.js`) | none | ok, registered not declared | model |
| UserPromptSubmit | 2 | installed `findings-return.js` | none | ok | model, only with a DISAGREE row |
| UserPromptSubmit | 3 | REPO `consonance\hooks\ask-surface.js` (runs repo `tools\ask.js`) | none | not managed | model, only with an open ask |
| UserPromptSubmit | 4 | installed `hooks\ready-prompt.js` | 10 | ok | nothing (`{}`) |
| Stop | 1 | installed `hooks\stop.js` | none | ok, excluded but live | nothing (`{}`) |
| Stop | 2 | installed `sourced-stop.js` | none | ok | nothing |
| Stop | 3 | installed `hooks\ready-stop.js` | 10 | ok | nothing (`{}`) |
| Stop | 4 | installed `hooks\reply-slot.js` | 10 | ok | user screen (systemMessage, light) |
| Stop | 5 | installed `hooks\ask-ending.js` | 10 | DRIFT | nothing |
| SessionEnd | 1 | installed `hooks\session-end.js` | none | ok | nothing (`{}`) |
| PreCompact | 1 | installed `hooks\precompact.js` | none | ok | runs checkpoint (not opened) |
| PreCompact | 2 | installed `precompact-preserve.js` | 10 | ok | compaction summary |
| PreToolUse `call_librarian\|call_chair` | 1 | installed `hooks\second-reader.js` | 10 | DRIFT | nothing; spawns a worker |
| PreToolUse `call_librarian\|call_chair\|chair_inject` | 1 | installed `hooks\sources-gate.js` | 10 | DRIFT | nothing in light |
| PreToolUse `Bash\|PowerShell` | 1 | installed `hooks\push-gate.js` | 10 | DRIFT | model only on a deny |
| PreToolUse `Bash\|PowerShell` | 2 | installed `hooks\delete-gate.js` | 10 | DRIFT | model only on a deny |
| PostToolUse `Bash\|PowerShell` | 1 | installed `hooks\release-chime.js` | 10 | DRIFT | nothing (a sound) |

- Output channels [read]. These are the output statements in each file: `userprompt-submit.js:340-343`,
  `findings-return.js:203-204`, `:269-270`, `ask-surface.js:44-47`, `ready-prompt.js:25`, `session-start.js:393-397`,
  `sessionstart-state.js:164-167`, `stop.js:81`, `ready-stop.js:23`, `reply-slot.js:207`, `:239-241`,
  `session-end.js:286`, `precompact-preserve.js:149`, `sources-gate.js:355` (deny only), `push-gate.js:175`,
  `delete-gate.js:204` (all installed copies; ask-surface is the repo copy). `sourced-stop.js:8`, `ask-ending.js:5` and
  `second-reader.js` print nothing [read headers].
- What reaches the model, per the hooks reference. Stdout from UserPromptSubmit and SessionStart is added as context.
  PreCompact stdout goes to the summary. Other events go to the debug log
  [read: code.claude.com/docs/en/hooks.md, curl to scratch `dl\hooks.md:834-836`]. `systemMessage` is a "Warning message
  shown to the user" [read: `:1103`]. A Stop hook reaches the model only by `decision`/`reason` or `additionalContext`
  [read: `:2902-2910`]. A deny's reason is "shown to Claude" [read: `:2007`].
- Matching hooks run in parallel [read: `:407`], so an event's wall time is about its slowest hook [inferred].
- The light branch of the installed sources-gate records a `warn` row and exits with no output
  [read: installed `hooks\sources-gate.js:391`; repo `consonance/hooks/sources-gate.js:393`].
- The installed `reply-slot.js` loads it as a module [read: installed `hooks\reply-slot.js:52`].

## 2. Each hook's own record, November 1-13 (13 days, to about 19:13Z)

Counts come from one readline pass per ledger. Rows are kept when their own time field starts `2026-11` [read: lnov.js].
Names and paths come from each hook's source [read: the `jsonl` names in each installed file, e.g. `second-reader.js:47`,
`sources-gate.js:41`, `ask-ending.js:24`, `reply-slot.js:44`, `sourced-stop.js:98`, `sessionstart-state.js:53`,
`precompact-preserve.js:78`, `push-gate.js:32`, `delete-gate.js:30`, `release-chime.js:32`, `stop.js:28`,
`findings-return.js:93`].

| ledger (hook) | Nov rows | per day | 11-13 | what the rows say | time or size recorded |
|---|---|---|---|---|---|
| `~\.claude\shell\event_log.jsonl` (stop.js) | 3,213 | 247.2 | 269 | all `session_stop` | none |
| `sourced_ledger.jsonl` (sourced-stop) | 2,215 | 170.4 | 240 | sourced 1,923, unsourced 292 | none |
| `reply-slot.jsonl` | 1,454 | 111.8 | 112 | all light; would-block 309; blocked 0 | none (reply 722 chars median) |
| `ask-ending.jsonl` | 1,355 | 104.2 | 116 | all shadow; matched 4 | none |
| `sources-gate.jsonl` | 1,312 | 100.9 | 145 | all light; warn 1,004, allow 308, deny 0 | none |
| `second-reader.jsonl` | 815 | 62.7 | 84 | ok 779, skipped-busy 33, error 3 | worker ms median 6,571, p95 10,943 |
| `sessionstart-state.jsonl` | 210 | 16.2 | 16 | emitted 70 (compact), skipped 140 | emitted chars median 2,997, p95 3,046 |
| `delete-gate.jsonl` | 171 | 13.2 | 2 | allow 171 | none |
| `push-gate.jsonl` | 157 | 12.1 | 0 | allow 155, allow-error 2 | none |
| `precompact.jsonl` (precompact-preserve) | 122 | 9.4 | 23 | auto 83, manual 27 | chars to summary median 1,772 |
| `release-chime.jsonl` | 14 | 1.1 | 0 | chimed 12, debounced 2 | none |
| `return_ledger.jsonl` (findings-return) | 2 | 0.2 | 0 | surfaced rows | none |

[read: lnov.js output, all rows above]. In November, the second reader's `ok` rows sum to: cache write 4,339,331, cache read
1,199,876, output 427,336, input 1,558 [read]. On my assumptions that is 1.9 M to 2.7 M Fable units in 13 days [inferred].

- Not in any ledger: the pulse, session-start.js, ask-surface, ready-prompt, ready-stop, session-end and precompact.js keep
  no run log I found, and none records its own duration [read: the file-name grep above; ready-prompt.js and ready-stop.js
  are 25 and 23 lines].
- push-gate and delete-gate fire on every shell call, but they write a row only for a push or a recursive delete
  [inferred: ~~171 and 157 rows~~ [2nd reader: 157 and 171 rows, in that order (push-gate 157, delete-gate 171, my
  ledger pass); and for push-gate it is read, not inferred: installed `hooks\push-gate.js:183` exits with no row unless
  the command holds `git` and `push`, `:186` on `not-a-push`] against 211 shell calls in one seat on 11-13, section 3].
  So their run count is not
  recorded room-wide.
- Stop fires about 247 times a day across D. That count comes from stop.js's unconditional row [inferred: stop.js writes
  one row per Stop, `stop.js:2-4` as read in `hooks_drift_D_2026-11-13.md:261-263`, summary]. ask-ending logs 104 a day.
  I did not open why it logs fewer. [2nd reader: stop.js's row is unconditional, read at installed `hooks\stop.js:75`
  (append in a try) and `:81`. ask-ending writes a row only when its judge returns one: `if (j) record(...)` at installed
  `hooks\ask-ending.js:79`, and `:77` exits with no row when there is no data dir or transcript path.]
- Timing I took myself, read-only. The pulse's reader `node consonance/tools/chain-status.js` ran in 267, 255 and 259 ms
  and printed 35 B. I checked first that it has no file write: grep found only `execFileSync('git', ... 'status')` at
  `:462` [read]. `node consonance/tools/ask.js --line` ran in 81, 80 and 90 ms and printed 0 B; grep found no write
  [read]. A bare `node -e 0` spawn took 29-36 ms [read].

## 3. One seat's 11-13 (UTC), the librarian's transcript, numbers only

Stream of `C:\Users\nname\.claude\projects\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b.jsonl`
(904,032,974 B), lines whose `timestamp` starts `2026-11-13`, sidechain lines dropped [read: survey.js, turns.js,
pulse.js, usage.js].

- Turns: 73 user turns (not meta, not tool results) plus 13 queued commands = 86 [read]. 341 API calls, 1 compaction.
  Mostly Fable 5.2 (553 of 608 assistant lines; 55 Opus 5.5) [read].
- Hook rows by event [read]:
  - UserPromptSubmit `hook_additional_context`: 86.
  - SessionStart: `hook_additional_context` 2, `hook_success` 3.
  - Stop: `hook_success` 161, `hook_system_message` 19.
  - `stop_hook_summary`: 70, each with 5 hooks.
  - No PreToolUse or PostToolUse hook rows. Those hooks printed nothing [inferred].
- Context added by hooks [read]:
  - The pulse: 86 rows, 19,155 chars, median 276, p95 352, max 368.
  - SessionStart: 2 rows, 4,826 chars. One holds the state block, 1 row by its marker, about 3,921 chars [inferred].
  - findings-return and ask-surface: 0 rows.
- **Per turn: median 277 chars (p95 359), total 23,981, over 84 of 87 turns. Per user turn: median 275.** [read]
- Re-read weight: each added chunk times the API calls after it, up to the compaction. That is 2,924,776 char-calls [read].
  At 2.89-3.7 chars per token it is 0.79 M-1.01 M tokens of cache read, against the seat's 201,891,145 that day
  (0.4%-0.5%) [inferred]. The seat's day in Fable units is about 10.3 M: read 5.05 M, write 3.14 M (~~1-hour assumed~~ [2nd reader: 1-hour
  recorded, not assumed: every cache-write token that day is `ephemeral_1h` (1,539,045 to 19:10Z; `ephemeral_5m` 0), my
  stream of the transcript's `usage.cache_creation`]),
  output 2.12 M [inferred]. The chain's context costs about 33 k-42 k of that, 0.3%-0.4%, with its first write counted
  [inferred].
- Stop hooks, per-hook ms from `stop_hook_summary.hookInfos` (n 71 each). Settings order is stop.js, sourced-stop,
  ready-stop, reply-slot, ask-ending. The transcript names them only as "command hook 1-5" [read; the mapping is
  inferred from the order]. Median/p95 ms: 110/146, 144/217, 101/136, 126/169, 120/184. That is 601 ms of process time per
  turn end, about 150-220 ms of wall time in parallel [inferred]. At 247 Stops a day that is about 2.5 min of ~~CPU~~ [2nd reader: hook process
  wall time; `durationMs` times each process end to end, which is not CPU time] a day on D [inferred].
- reply-slot's light warning reached this seat's screen 19 times, 3,750 chars, median 184 [read]. It does not reach the
  model [read: hooks.md:1103].
- SessionStart, from `hook_success.durationMs` [read]: session-start.js 404 ms on the resume. On the compaction, hooks
  1 and 2 took 364 and 816 ms.
- Tool calls on 11-13 [read]: Bash 209, PowerShell 2, `call_chair` 42, `read_board` 2. So push-gate, delete-gate and
  release-chime each fired about 211 times in this seat alone. second-reader and sources-gate fired 42 times.

## 4. The chain split three ways

### 4a. The installed copy is the repo's (12 registered, plus 1 run from the repo path)

session-start, sessionstart-state, userprompt-submit, findings-return, ready-prompt, stop, sourced-stop, ready-stop,
reply-slot, session-end, precompact, precompact-preserve: all `ok` [read: check.txt]. The libraries they load are `ok` too:
`lib\ambient.js`, `lib\fresh-guard.js`, `lib\ready.js`, `blind.js` [read]. ask-surface.js runs from the repo, so it cannot
drift, but a pull changes it mid-session. `install.ps1:201-203` warns of that case [read]. -Check does not report it as live
(`in_hooks.md` finding 3) [summary]. The pulse's chain reader is also a repo file, run by path
(`userprompt-submit.js:263-265`, installed) [read].

### 4b. Drifted (6 registered, plus the spawned worker): only one costs anything on D

- push-gate, delete-gate, ask-ending, sources-gate, release-chime: the repo change is the data-dir fallback or the default
  repo list. Neither path is taken on D, where `data_dir` and `chime_repos` are set (`hooks_drift_D_2026-11-13.md`
  sections 6-10) [summary]. The drift adds no cost and no change of behaviour on D [inferred from that file].
- **second-reader.js, the one that costs.** The installed copy is git-blob `abcbff60…`, the blob of `aadcc10a`
  (`git hash-object` on the installed file; `git rev-parse aadcc10a:consonance/hooks/second-reader.js`). HEAD's is
  `2d161fbd…`, the blob of `bd576735`, committed 2026-11-03T09:24:54-06:00 [read]. The repo copy writes a `skipped-class`
  row for a `call_librarian` ring and starts no worker (`hooks_drift_D_2026-11-13.md:107-108`) [summary].
- Verified from its ledger by `sr_stream.js`. This is the arithmetic of
  `room_better_2026-11-13/scripts/second_reader_lean/sr.js`, run by readline instead of the whole-file read. Which script
  I re-ran, and why: sr.js is the only script there about hooks or the second reader. kw_count, post_compact, seat_tokens,
  analyze, extract, kw*, race and sub measure keep-warm, compaction and usage [read: each header]. It counts `ok`
  `call_librarian` rows after 2026-11-03T15:25Z [read]:

| rows read | reads | tokens, all kinds | flagged | cache write | cache read | output |
|---|---|---|---|---|---|---|
| first 3,940 | 229 | 2,385,722 | 112 | 1,904,428 | 358,641 | 122,195 |
| first 3,955 (the claim) | 237 | 2,479,021 | 116 | 1,979,853 | 371,721 | 126,973 |
| all 4,024 (to 19:12:53Z) | 268 | 2,799,638 | 133 | 2,229,946 | 422,406 | 146,750 |

- The claim holds as stated: 237 reads, 2,479,021 tokens. It has grown since: 268 reads in 10.16 days, 26.4 a day
  [read; per day inferred].
- In weight: 3.54 M-5.22 M Sonnet input units, which is **0.89 M-1.30 M Fable units, or 87 k-128 k a day**. That is about
  0.8%-1.2% of the librarian's 11-13 per day [inferred, section 0 assumptions]. 80% of the raw token sum is cache writes
  [inferred: 2,229,946 / 2,799,638]. So a raw token count is not comparable with a seat's token count, which is mostly
  cheap cache reads. Weighted, it is still the largest cost of drift I found.
- What the current code still spends on D. In the same window, `call_chair` rings: 282 reads, 1,352,074 tokens, 212
  flagged [read]. Their flags reach no seat on D: the same-turn note `hooks\second-reader-note.js` is ABSENT [read:
  check.txt]. That is the current design half-installed, not drift.
- Seconds: the hook allows at once and the worker runs detached. Worker time is median 6,797 ms, p95 10,571 ms, on those
  268 rows [read]. It is not on the ringing turn's path [inferred from `hooks_drift_D_2026-11-13.md:111`, summary].

### 4c. Output no seat is recorded to have acted on: the NEITHER list and the pulse lines, today

| item (`room_value_result_2026-11-03.md`) | still runs on 11-13? | evidence |
|---|---|---|
| pulse STALE (:42) | computed, not printed | 0 of 88 hook-context rows in the librarian's 11-13 [read: pulse.js]; `37c82dbd` "STALE … still computed but not printed" [read: git show] |
| pulse dirty, sync (`NOT in sync`, `L behind`), chain tail (:42) | not printed | 0, 0, 0 of 88 [read]; same commit |
| pulse "fused" (:42) | not printed | 0 whole-word matches; my first regex matched "refused" once, the trap `p-d627-p3…O_2026-11-03.md:52` names [read: usage.js] |
| pulse UNRECEIVED (~~:55-56~~ [2nd reader: :35, :56; :55 is vantage], O row 1e) | not printed | 0 of 88 [read]; same commit |
| pulse delivery-unconfirmed (:34~~, :56~~ [2nd reader: :56 does not name it]) | not printed | 0 of 88 [read]; `3aed0c72` 2026-11-03 [read] |
| the state block (:42) | **yes**, on every compaction | 70 emitted in November, median 2,997 chars [read: lnov]; 1 in the librarian on 11-13 [read]; "0 turns act on its content" (`p-d627-p3…:30`) [read] |
| sources-gate in light mode (:43) | **yes**, on every ring | warn 1,004 in November, 145 rows on 11-13, no output [read]; light branch `sources-gate.js:391` installed [read] |
| superseded tools, jev-flags, finished experiments (:44) | not hooks on D | jev-flags EXCLUDED, absent [read: check.txt]; the tools are not in settings.json [read] |
| pulse QUEUED, hand-back counts (kept, :18, :56) | yes | QUEUED in 36, hand-back counts in 74 of 88 [read] |

The pulse trim and the second-reader narrowing landed the same morning (3aed0c72 08:50 -06:00, bd576735 09:24 -06:00)
[read]. The pulse's printed line comes from a repo file run by path, and today it carries none of the dropped kinds. The
second reader runs from an installed copy, and today it still makes the reads its narrowing removed. This is a recorded
pair for "landed is not live", with the delivery path as the one difference [inferred].

## 5. The ranked table

Ranked by cost on D: model spend first, then context, then process time. Runs per day are room-wide on D unless marked.
UserPromptSubmit runs about 300 a day: Stop's 247 times the librarian's 86/71 ratio [inferred]. "s/run" is recorded (r),
timed by me (t) or inferred (i). "chars/turn" is context added to the model per turn.

| # | entry | event | runs/day | s/run | chars/turn | evidence a seat acted on its output | recommendation |
|---|---|---|---|---|---|---|---|
| 1 | second-reader.js, stale `call_librarian` half | PreToolUse | 26.4 model reads | 6.8 r (worker, detached) | 0 | its flags reach no seat: "flags reaching no one" (`room_value_result_2026-11-03.md:39`); about 10% real (:28) | **narrow**: sync the repo copy, the 11-03 ruling's form (`plan_room_fixes_2_5_2026-11-03.md:16`, "his veto open"); stop-or-narrow stays the keeper's question |
| 2 | second-reader.js, `call_chair` half (current code) | PreToolUse | 27.8 model reads | 6.8 r | 0 | none found on D: note hook ABSENT | put the note hook (`second-reader-note.js`, 7-10 s per `call_chair`, `hooks_drift_D…:225-227`) or a stop to the keeper |
| 3 | userprompt-submit.js (pulse) | UserPromptSubmit | ~300 (i) | ~0.3 (t: reader 0.26 + spawn) | 275 median | QUEUED stopped a re-send (`p-d627-p3…:25`; `room_value_result…:18`) | **keep**; already trimmed (37c82dbd) |
| 4 | sessionstart-state.js (state block) | SessionStart (compact) | 16.2 runs, 5.4 emitted | 0.4-0.8 (r, one wake) | ~3,000 per compaction | none: "0 turns act on its content" (`p-d627-p3…:30`) | **put retiring to the keeper** (NEITHER, :42); it already runs only on compact |
| 5 | reply-slot.js | Stop | 247 (fires) / 112 rows | 0.13 r | 0 (184 to the screen) | ~~none found~~ [2nd reader: in November none: 309 would-block, 0 blocked. Before light mode the record has acts: "47 replies BLOCKED", verdict KEEP (`handback/p-d619-hooks-tools-C_2026-11-02.md:64`)] | **put to the keeper** with gate mode (section 13 of `00_build_paths.md`) |
| 6 | sourced-stop.js | Stop | 247 / 170 rows | 0.14 r | 0 | indirect: its rows feed vantage, "its 2 acted-on catches" (`room_value_result…:21`) | keep |
| 7 | stop.js | Stop | 247 | 0.11 r | 0 (feeds the pulse's interval line, in 50 of 88) | none found for the interval line (not assessed by O; 17 files name it, unopened) | keep; its D status (excluded but live) is the keeper's (`install.ps1:254-255`) |
| 8 | ask-ending.js | Stop | 247 / 104 rows | 0.12 r | 0 | none: 4 matched of 1,355, shadow only; "CUT candidate" (`p-d619-hooks-tools-C…:68`) | **put retiring to the keeper**, or run its overdue trial review |
| 9 | ready-stop.js / ready-prompt.js | Stop / UPS | 247 / ~300 | 0.10 r / not recorded | 0 | used by the app's READY state, not a seat; ruled "READY PAIR ONLY" (`librarian/2026-09-06.md:603`, summary via in_hooks) | keep |
| 10 | sources-gate.js, light | PreToolUse | 100.9 | not recorded | 0 | none: 1,004 silent warnings (~~`room_value_result…:43`~~ [2nd reader: :43 says 1,783, its all-time count to 11-03; 1,004 is November, from the ledger. In strict mode it denied 425 rings, verdict "KEEP (rule compliance)" (`p-d619-hooks-tools-C…:65`)]) | **put retiring the registration to the keeper**; the file stays, reply-slot loads it (`reply-slot.js:52`) |
| 11 | precompact-preserve.js | PreCompact | 9.4 | not recorded | 1,772 to the summary | falsifier lines kept 3.5% before, 6.4% after (`00_lean_seats.md`, W1 section, summary) | keep (Lap W W2 edits it) |
| 12 | session-start.js | SessionStart | ≤16 | 0.40 r | ~900 at a resume (i) | none found | keep; W3's body line sits beside it |
| 13 | push-gate.js | PreToolUse shell | 211 in one seat (unrecorded room-wide) | ≥0.03 (i, spawn) | 0 | no real catch (`p-d619…:66`); push permission rests on the credential scan (`in_hooks.md`, summary) | ~~keep~~ [2nd reader: put to the keeper. By this table's own rule a row with no real catch goes to him, and the record says so: "CUT candidate by the rule. It is insurance on public pushes, so the keeper decides" (`p-d619-hooks-tools-C…:66`)] |
| 14 | delete-gate.js | PreToolUse shell | same | ≥0.03 (i) | 0 | 2 real denies (`p-d619…:63`) | keep |
| 15 | release-chime.js | PostToolUse shell | same | not recorded | 0 | asked for by the keeper (`install.ps1:192`) | keep |
| 16 | findings-return.js | UPS | ~300 | not recorded | 0 on 11-13 | vantage's acted-on catches (:21) | keep |
| 17 | ask-surface.js (repo path) | UPS | ~300 | 0.08 (t, ask.js) | 0 on 11-13 | none found | ~~keep;~~ [2nd reader: put it to the keeper whole, not only its path. D619 lists it "CUT candidate" (`p-d619-hooks-tools-C…:69`). -Check calls it "Built and unwired ... No ruling yet" and names a precondition, no CONSONANCE_DREAM guard (my -Check run, lines 44-45); `grep -c CONSONANCE_DREAM consonance/hooks/ask-surface.js` is still 0] put its repo-path registration to the keeper (`install.ps1:201-203`) |
| 18 | session-end.js, precompact.js | SessionEnd / PreCompact | not recorded | not recorded | 0 | none found | keep |

Only row 1 is drift. Rows 5, 8, 10, 13, 14 and 15 are drifted files whose drift changes nothing on D (4b). No hook named
here should be retired without his word. The brief's rule, "change how often, never delete", sits at
`briefs/lighthouse_the_room.md:209` today, not `:204` as the task gave it (the line drifted) [read: grep]. I did not read
that item whole. The quoted words are the brief's, and I do not claim they are his verbatim.

## 6. The change, and the check that is red today [ours]

**Why the cost of drift goes unseen.** The only thing that compares the running copy with the repo is `-Check`. It prints
~~its verdicts after 4,950 UNCLAIMED lines~~ [2nd reader: its per-file verdicts FIRST (ok/DRIFT/ABSENT, lines 1-36 of my
run) and its registration block and closing counts after the 4,950 UNCLAIMED lines (UNCLAIMED at line 59, the block at
5011-5031); `hooks_drift_D_2026-11-13.md:24` says the same] (`in_hooks.md` §1, summary; my run: 5,031 lines). No seat runs it at a turn, and a
DRIFT line does not say whether the drift changes behaviour. The one drift that costs looks the same as five that do not
(4b).

**Smallest change, in two parts:**
1. Every ledger row a hook writes carries `src`, the git-blob id of the file that wrote it. That is `sha1('blob ' + len +
   '\0' + bytes)` of `__filename`, computed once per run (one read of a file under 25 KB) [ours]. Start with the
   second reader's hook and worker. They are the pair whose drift has a cost.
   [2nd reader: as worded this misses the recorded case. The `ok` rows are written by the WORKER (installed
   `hooks\second-reader-worker.js:202`, `:223`); the installed hook writes a row only on skip or error (installed
   `hooks\second-reader.js:94-114`). Syncing the worker alone is step 3 of the drift order, "safe to sync alone"
   (`hooks_drift_D_2026-11-13.md:37`, `:322`). After it, every `ok` row would carry HEAD's worker blob and read live while
   the stale hook goes on sending `call_librarian` rings to it. The worker's row must also carry the blob the hook passes
   in the job. And the name `src` is taken: 338 `push-gate.jsonl` rows carry `scanned[].src`, a git ref (my count; installed
   `push-gate.js:129-130`). Use another name.]
   - Every digest carries its function, so the field is `src: "git-blob <40 hex>"`
     (`cards/every-digest-carries-its-function.md`) [read].
2. `consonance/tools/hooks-live.js`, a new read-only tool. For each ledger with `src`, it compares the rows of the last 24 h
   with `git rev-parse HEAD:<repo path>`. It prints one line: `hooks live: <n> of <m> ledgers written by HEAD's copy;
   stale: <name> (<rows> rows since <commit date>)`, and exits 1 on any stale row. For ledgers without `src` it says
   `unstamped`, never ok [ours].

**The check, red today on the recorded case.** Fixture test `hooks-live.test.js`:
- A temp git repo holds the bd576735 blob of `consonance/hooks/second-reader.js` (`2d161fbd…`) at HEAD.
- A temp ledger holds rows stamped with the installed copy's blob (`abcbff60…`, read today) on `call_librarian` with
  status `ok`.
- Expect exit 1 and the name `second-reader.js`.
- On the live ledger today the tool says `unstamped` for every row: red by design, not green.
  [2nd reader: this test is red today only because `hooks-live.js` does not exist. Any unwritten tool is red. Its stamped
  rows are made up: 0 rows of the ten ledgers carry a top-level stamp today (my grep), so on the recorded ledger the tool
  would print `unstamped`, not `stale second-reader.js`. The recorded case reaches it only as a fixture built from its two
  blob ids. DOWNGRADED: a reconstruction of the recorded case, not a run on it.]
- The ledger check needs no new field and is red today: `ok` rows on `call_librarian` after bd576735's commit time
  (2026-11-03T15:24:54Z) number 268 now [read: sr_stream.js].
- After the repo copy is installed, ~~both checks turn green from the next ring~~ [2nd reader: the ledger check as worded
  cannot turn green. It counts rows since 15:24:54Z on 11-03, and those 268 rows stay in the file. Re-run by me: 268 `ok`
  `call_librarian` rows, 0 `skipped-class`, 0 with `toolUseId`, so it is red today for the reason given. Its window must
  start at the sync. Not at the installed file's mtime: that is the repo commit time, not the copy time
  (`hooks_drift_D_2026-11-13.md:54-55`). Use the `.bak-<stamp>` time the sync writes (`install.ps1:461`), or the first
  `skipped-class` row] The new rows are `skipped-class` and carry
  `toolUseId` (`hooks_drift_D…:328`, summary), and their `src` equals HEAD's blob.

**Lap W touch (W3, not redesigned).** Add one field to the body line: `hooks <n>/<m> live` from hooks-live.js's last line,
or `hooks unchecked` when the tool is absent or takes more than 500 ms [ours]. A waking seat is then told at start that a
landed hook is not live. W3's 300-byte bound (`00_lap_w_spec.md:349-353`) leaves room for ~~about 25 bytes~~ [2nd reader: about 55 bytes. The
spec's second reader puts the line at "about 245 B" against "at most 300 B" (`00_lap_w_spec.md:351-353`); a
`hooks 12/19 live` field is 16 B, so it fits either way] [inferred].

**What each part needs:**
- No Rust rebuild.
- Part 1 is a repo edit to two hooks. It is live on D only through `install.ps1 -Only second-reader.js,second-reader-worker.js`.
  That sync is the narrowing itself, so it needs the keeper's word on stop-or-narrow (`hooks_drift_D…:116-121`, summary).
  After it, the next ring uses the new file; no restart [summary: `hooks_drift_D…:315`].
- Part 2 is a new tool and test, run from the repo; no install.
- The W3 field rides W3's own `-Only` install, on D and on L.
- L: the same sync there, by its own `-Check` (15 DRIFT, 9 ABSENT on record, `map/M.md:1030`, summary).
- Seats restarted: none for parts 1-2.
- The keeper's word: the second-reader sync; and each "put to the keeper" row in section 5.
- Tier: prove it. It touches a hook's stored data and the delivery path (`~/.claude/CLAUDE.md`, three tiers).

**Falsifier, registered here.** This proposal did nothing if, at the first landing of a hook change after hooks-live.js
exists, the installed copy is older than HEAD for over 24 h and no line printed `stale`.

## What I did not open

- Machine L. Everything here is D.
- Transcripts other than the librarian's. Room-wide UserPromptSubmit and shell-call counts are inferred from one seat.
- The durations of PreToolUse, PostToolUse, UserPromptSubmit and SessionEnd hooks. Neither the transcript nor any ledger
  records them. I timed only two of the readers they call.
- `hooks\precompact.js` and the checkpoint it fires; `session-end.js` past its output line.
- Why ask-ending logs 104 Stops a day against stop.js's 247.
- The 17 files that name the pulse's "interval, witnessed" line.
- `briefs/lighthouse_the_room.md` item 19 whole (only the phrase at :209); the primaries behind the D619, D627 and D631 lines (read only where cited).
- The second reader's cache-write TTL, hence the range in section 4b.
- Whether `hook_system_message` rows ever reach the model; the docs say they reach the user.
- `consonance/tools/chain-status.js` beyond its output markers and its single git call; `tools/ask.js` beyond `:188-200`.
- No hook was fired, no test was run, and nothing was installed. `install.ps1 -Check` (report only) was the one installer run.

## Second reader

Seat: the adversarial second reader, on D, about 19:20-19:50Z, main checkout HEAD baa0aef9. Read-only. Nothing was
installed, registered, built or committed. One installer run: `install.ps1 -Check`, plain (report only: `:13`, `:757`
exit before any write; `-Only` with `-Check` is refused at `:376-380`). Output went to scratch `r2\check.txt`. My scripts
are in `C:\Users\nname\AppData\Local\Temp\claude\0d67fc0e125090b2\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\r2\`:
`led.js` (ledgers), `tx.js` (the transcript), `sr2.js` (the second reader's ledger). Each streams with readline and prints
numbers only. I also ran `node consonance/tools/chain-status.js` twice for timing (321 and 362 ms; it has no file write,
grep count 0). No test file was run. Line numbers below are the first reader's, before my inserts.

| line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 3 | 19 hooks over 7 events | settings.json:7-143; -Check | OK | "19 hook(s) across 7 event(s)" |
| 3 | 12 match, 6 drifted, 1 from the repo path | my -Check run | OK | 23 ok, 10 DRIFT, 3 ABSENT; 6 DRIFT are registered |
| 4 | 268 reads, 2,799,638 tokens | second-reader.jsonl | OK | sr2.js: 268, 2,799,638, 133 flagged, 4,024 rows |
| 5 | 237 reads, 2,479,021 at 3,955 rows | same | OK | identical at row 3,955; 229 / 2,385,722 at 3,940 |
| 6 | 0.89-1.30 M Fable units | arithmetic on the sums | OK | 885,710 and 1,303,825 |
| 7 | 275 chars per user turn, median | the transcript | OK | pulse median 276; per turn 277 |
| 10 | 0 of 88 pulses | the transcript | WRONG | 86 pulses; 88 adds 2 SessionStart rows |
| 10-11 | state block 70; warn 1,004; 145 today | ledgers | OK | 70 emitted; 1,004 warn; 145 |
| 12 | pulse trim live at once | transcript; git reflog | WRONG | live at merge fe69a9fc 17:10Z; 15 of 72 pulses after 3aed0c72 still showed dropped kinds |
| 28 | cache multipliers at prompt-caching.md:144 | the file | OK | 1.25x, 2x, 0.025x Fable, 0.05x Sonnet |
| 30 | Sonnet input 1/4 of Fable, "SKILL.md" | the bundle | DOWNGRADED | no SKILL.md on disk; models.md:78 $8, model-migration.md:2104 $2 |
| 33 | sonnet-5-5 on every ok row | ledger | OK | 550 of 550 ok rows after 11-03 15:25Z |
| 39 | -Check 23/10/3, 5,031 lines, exit 1 | my run | OK | same; 3.7 s |
| 43-63 | the chain table | settings.json; -Check | OK | order, timeouts and states match |
| 73-76 | hooks reference lines | the first reader's curl copy, `cod\dl\hooks.md` | OK | :407, :834-836, :1103, :2007, :2902-2910 |
| 77-78 | light branch at :391 installed, :393 repo | both files | OK | `if (mode === 'light')` |
| 79 | reply-slot loads sources-gate | installed reply-slot.js:52 | OK | `require('./sources-gate.js')` |
| 91-102 | the ledger table | 12 ledgers, led.js | OK | each within 1 row at 19:13Z (event_log 3,214) |
| 104 | November ok token sums | second-reader.jsonl | OK | cacheCreate 4,342,764 with 1 more row |
| 111 | "171 and 157 rows" | ledgers | WRONG | push-gate 157, delete-gate 171: swapped |
| 113 | stop.js writes one row per Stop | installed stop.js:75, :81 | OK | read, stronger than the summary cited |
| 116 | chain-status 255-267 ms | my 2 runs | OK | 321, 362 ms; "about 0.3 s" holds |
| 127 | 73 + 13 turns, 341 calls, 1 compaction | the transcript | OK | identical |
| 136 | pulse 86 rows, 19,155 chars, p95 352 | the transcript | OK | identical |
| 139 | per turn median 277, total 23,981 | the transcript | OK | 23,077 over turns + ~904 SessionStart before the first |
| 142 | 1-hour write "assumed" | transcript usage | OK | understated: recorded, 5m = 0 |
| 147 | Stop medians 110/144/101/126/120 | the transcript | OK | 111/144/101/126/120, n 72 |
| 148 | "2.5 min of CPU" | hookInfos | DOWNGRADED | durationMs is process wall time |
| 152 | SessionStart 404, 364, 816 ms | the transcript | OK | identical |
| 154 | Bash 209, PS 2, call_chair 42 | the transcript | OK | 201/2/40 at a 19:10Z cut |
| 173-176 | blobs abcbff60 / 2d161fbd; bd576735 time | git | OK | hash-object and rev-parse |
| 171 | data_dir and chime_repos set on D | ~/.consonance.json:7, :19 | OK | both present |
| 196 | call_chair 282 reads, 1,352,074, 212 flagged | ledger | OK | identical |
| 198 | worker 6,797 / 10,571 ms | ledger | OK | identical |
| 205 | 37c82dbd: "still computed but not printed" | git show | OK | commit body |
| 207 | the "refused" trap at :52 | p-d627-p3…:52 | OK | "matched the word refused" |
| 208 | UNRECEIVED at :55-56 | room_value_result | WRONG | :35 and :56 |
| 209 | delivery-unconfirmed at :34, :56 | room_value_result | DOWNGRADED | :34 only |
| 210 | "0 turns act on its content" | p-d627-p3…:30 | OK | verbatim |
| 215 | 3aed0c72 08:50, bd576735 09:24 -06:00 | git log | OK | 08:50:10, 09:24:54 |
| 228 | :39, :28, plan :16 | the files | OK | verbatim |
| 230 | QUEUED stopped a re-send | p-d627-p3…:25 | OK | row 1f |
| 232 | reply-slot: no act found | p-d619…:64 | DOWNGRADED | 47 BLOCKED before light mode, KEEP |
| 235 | ask-ending "CUT candidate" | p-d619…:68 | OK | verbatim |
| 236 | "READY PAIR ONLY" | librarian/2026-09-06.md:603 | OK | present |
| 237 | 1,004 at :43 | room_value_result:43 | WRONG | :43 says 1,783 |
| 240 | push-gate: keep | p-d619…:66 | DOWNGRADED | the record says the keeper decides |
| 241 | delete-gate 2 real denies | p-d619…:63 | OK | verbatim |
| 242 | the keeper asked for the chime | install.ps1:192 | OK | D281 comment |
| 244 | ask-surface: keep | p-d619…:69; check.txt:44-45 | DOWNGRADED | CUT candidate; "unwired" per -Check; no dream guard |
| 249 | rule at :209, not :204 | briefs/lighthouse_the_room.md | OK | grep; the file changed 3 times today |
| 254 | verdicts print after UNCLAIMED | check.txt | WRONG | file verdicts at 1-36; registration after |
| 260-262 | a stamp per writing file covers the case | installed second-reader.js:94-114; worker :202, :223 | WRONG | the worker writes the ok rows; a worker-only sync reads green |
| 270-275 | fixture red today on the recorded case | ledgers | DOWNGRADED | red because the tool is missing; live rows have no stamp |
| 276 | ledger check red today, 268 | second-reader.jsonl | OK | 268 ok, 0 skipped-class, 0 toolUseId |
| 278 | both checks turn green after the sync | the same count | WRONG | the 268 old rows stay; the window must start at the sync |
| 283 | room for about 25 bytes | 00_lap_w_spec.md:349-353 | WRONG | ~245 B of 300: about 55 B |
| 292 | L: 15 DRIFT, 9 ABSENT | map/M.md:1030 | OK | present; another machine, 10:33Z |

**Tally: 60 checked. OK 44, WRONG 9, DOWNGRADED 7, UNSUPPORTED 0.**

**The proposed checks, run.** The ledger probe is red today for the reason given: 268 `ok` model reads of
`call_librarian` rings after bd576735's commit, 266 of them after its merge at 17:10Z, 0 `skipped-class`, 0 `toolUseId`
[read: sr2.js]. It would really fail on the recorded case (L0613, `00_ledger.md:652`). As worded it can never pass. The
`hooks-live.test.js` fixture cannot be run: the tool does not exist, so it is red for that reason alone.

**The design, tested** [ours unless marked].
- Satisfied without fixing it: (1) sync `second-reader-worker.js` alone, as the drift order allows
  (`hooks_drift_D_2026-11-13.md:322`). Every `ok` row then carries HEAD's worker blob, and the stale hook keeps
  sending pane rings to the model. (2) Stamp the two second-reader files only. Seven registered hooks keep no ledger
  (section 2), and quiet ledgers give no verdict in 24 h: push-gate wrote 0 rows on 11-13 and release-chime's last row is
  11-10 [read: led.js]. "n of m ledgers" can read whole while m leaves most of the chain out. (3) The narrowing sync
  itself turns this one case green and says nothing about the next.
- Fires wrongly: (1) on a hold by ruling. If the keeper keeps pane rings read, the hook is stale on purpose and the line
  says `stale` forever. The installer already has a form for this (`Excluded`, `LiveOn`; `install.ps1:236`, `:250`), and
  the tool has none. (2) On harmless drift. push-gate's +1 -1 data-dir line reads `stale` like the costly one, which is
  the very fault section 6 names in -Check. (3) When the main checkout's HEAD is a branch, mid-merge, or on L with
  another HEAD. (4) "unstamped, never ok" on every ledger until all are stamped is a line that is red every turn. The
  record has that failure: the stale-lap pulse line printed 345 times with no act (`librarian/2026-09-16.md:83`, cited
  in this seat's CLAUDE.md, not opened by me) [summary].
- Earlier fixes of this kind that lapsed: the -Check registration block, added 2026-08-25 after drift on 08-17 and 08-18
  (`install.ps1:586-600`) [read]; the 11-03 ruling "The installed hook copy is replaced only at the restart"
  (`plan_room_fixes_2_5_2026-11-03.md:20`) [read], and the copy is still aadcc10a's; "third time" by 08-31 (L0092,
  `00_ledger.md:131`) [read]. I found no earlier ledger stamp (grep of `prior_fixes.md` for stamp, blob, version)
  [read]. So the stamp is new in kind and not yet tried.
- A smaller change that covers more: compare each REGISTERED entry's installed git-blob with HEAD's blob, the byte
  compare -Check already does, restricted to settings.json's list and printed first. It covers the ledgerless hooks and
  the worker-only case. `prior_fixes.md:260-301` designs it as `--range` [summary]. A stamp adds only one thing beyond
  it: proof of which copy RAN. On D that differs from what is installed for only one entry, ask-surface, which runs
  from the repo. If the stamp is kept: the worker records the hook's blob from the job beside its own, the field is not
  named `src`, the check's window starts at the sync, and a ruled hold is declared where the installer declares them.
- Lap W touch: W3's field must read cached output, not run a 24 h ledger scan. sourced_ledger is 7.8 MB and event_log
  20.4 MB today [read: ls], against a 500 ms bound.

**What I could not check.** The re-read weight (2,924,776 char-calls) and its token range. "hand-back counts in 74 of
88". The second reader's cache TTL. The 17 files on the interval line. Anything on L. The hooks reference is the first
reader's curl copy; I did not download it again.

### What I did not open (second reader)
- Machine L; transcripts other than the librarian's; `librarian/2026-09-16.md:83`.
- `in_hooks.md` and `00_lean_seats.md` beyond the lines cited here; their second readers' notes.
- `adversary_R02.md` past :70; `00_build_paths.md` beyond sections 10 and 13 and its second-reader rows 644-666.
- The repo copies of push-gate, delete-gate, ask-ending and release-chime (I relied on `hooks_drift_D_2026-11-13.md` for
  their diffs); `chain-status.js` and `ask.js` beyond a grep for file writes.
