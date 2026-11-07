# D619: room audit item 2 — every hook and tool: has it ever caught something? (pane C, read-only)

Seat: pane C, sibling-0845a868. Order: `[chair:MAIN]` D619, 2026-11-02T23:38Z. Plan: `exo_memory/loop/plan_room_audit_2026-11-02.md`, read whole. Read-only: nothing was deleted, moved, installed or committed. Evidence: `p-d619-hooks-tools-C_2026-11-02_evidence/` (`EV`), scripts in `EV/scripts/`.

## The count, first (the order's "~49 / ~19 / ~210" are files, not things)

- **Room hooks:** `consonance/hooks/` holds 50 files: **24 hooks** plus their tests and a README.
- **Shell hooks:** `~/.claude/settings.json` registers **19 commands**. 11 of them are installed copies of room hooks, and 8 are shell-only: `session-start`, `session-end`, `stop`, `userprompt-submit`, `precompact`, `ready-prompt`, `ready-stop`, `ask-surface` (the last one run straight from the room). checked: `EV/hookmap.txt`.
- **Tools:** `consonance/tools/` holds 217 files: **104 tools** (`.js .cjs .py .ps1`, counting the 12 mutation harnesses) plus their tests. checked: `EV/toolscan.txt`.
- **What runs without anyone typing it:**
  - the 19 registered hooks;
  - the app (`main.rs`/`mcp.rs` name 14 tools);
  - 4 scheduled tasks, each last run today with result 0 (`EV/schtasks.txt`):
    - Janitor → `janitor.js`;
    - Second Vantage → `second-vantage.js`;
    - Dream Cycle → `dev/dream/dream_cycle.ps1`;
    - Temp expiry.

## Method

1. **Ledgers** (`EV/ledgers.txt`, `ledgers.js`). Every hook ledger in `C:\Consonance\data` and `~/.claude/shell`: rows, first and last time, and the rows that are a catch by that ledger's own fields.
   - a catch is: `decision` not allow; `blocked` or `wouldBlock`; `flags` non-empty; `matched`; `verdict` not GREEN.
   - Each push-gate and delete-gate deny was read one by one (`EV/denies.txt`).
2. **The board** (`EV/boardkinds.txt`, `boardkinds.js`): 190,438 lines, grouped by the refusal lines' first words.
3. **The record** (`EV/toolscan.txt`, `toolscan.js`). Every tool and hook name in `exo_memory/**/*.md` (2,871 files) and lighthouse's git log (4,560 commits), with lines where the name sits beside a catch word.
   - That count is noisy: a line about FIXING a tool counts the same as a line where the tool caught something. So for each name I read the strongest lines that make the tool the catcher, and checked the ones cited below in context.
   - The file that listed them is not kept in `EV`: it quotes record lines, and the term sweep found a private term in one. `bestcatch.js` reproduces it.
4. **What runs it:**
   - `settings.json`;
   - which hook launches which (`hookmap.js`);
   - which tools `main.rs`/`mcp.rs`/`launch.ps1` name;
   - `schtasks /query`.
5. **Cost per call** (`EV/hooktime.txt`, `hooktime.js`). Each registered per-turn hook was run as Claude Code runs it, 5 times, with a minimal harmless payload and its data and shell dirs pointed at a scratch folder. checked afterwards: no live ledger names the timing session, and the ready dir holds no such file. These are lower bounds: the real runs also read the live transcript and ledgers.
6. **The verdict rule:**
   - **KEEP:** a cited catch, or a cited changed outcome.
   - **CUT candidate:** never seen catching anything; the "where I looked" is methods 1–3.
   - **RUNS THE ROOM:** the app, a scheduled task or a kept hook needs it. It is not a catcher, so the question does not fit it.
   - **FEATURE:** asked for, not a check.
   - **WITH X:** a mutation harness or library that stands or falls with X.
   - inferred: "never seen" means not in these ledgers, the board or the record. A catch nobody wrote down is invisible to this method.

## Every turn: what runs, and its cost

Claude Code runs the hooks of one event in parallel, so an event costs about its slowest hook. Medians are from `EV/hooktime.txt`; a bare `node -e 0` is 120 ms on this machine.

| when | hooks | slowest | injected text |
|---|---|---|---|
| **every prompt** (UserPromptSubmit) | `userprompt-submit` (it also runs `chain-status.js`, the pulse), `findings-return`, `ask-surface`, `ready-prompt` | 271 ms (`userprompt-submit`) | the pulse and interval: 600–806 chars on this pane's last 6 prompts (this pane's transcript, `hook_additional_context` rows) |
| **every reply's end** (Stop) | `stop`, `sourced-stop`, `ready-stop`, `reply-slot`, `ask-ending` | 104–110 ms each | none; `reply-slot` can block a reply |
| **every Bash / PowerShell call** | PreToolUse `push-gate`, `delete-gate`; PostToolUse `release-chime` | 152 ms before, 118 ms after | none |
| **every librarian or chair ring** | `sources-gate`; `second-reader`, **which starts a `claude -p --model claude-sonnet-5-5` call per ring** (`second-reader.js:9`) | a model call | 3,364 second-reader rows since 2026-10-01 |
| every session start / compaction / end | `session-start`, `sessionstart-state` / `precompact` (runs `checkpoint.py` → `residue.js`), `precompact-preserve` / `session-end` | not timed | the state block, 3,005 chars at the last start (`sessionstart-state.jsonl`) |

- The heaviest per-turn item is not a hook. It is the instruction file each seat carries (item 1 of the plan, not mine).
- Among the hooks, the only per-call **model** cost is `second-reader`, and its flags reach nobody (below).

## The table

### Hooks (24 room + the 8 shell-only; merged where a shell file is an installed copy)

| hook | runs | last fired | what it caught (or "never seen"), with citation | verdict |
|---|---|---|---|---|
| **delete-gate** | PreToolUse Bash/PowerShell | 2026-11-02 23:09 (638 rows) | **2 real denies**: 2026-10-11 the librarian's `rm -r` whose last target resolved to `C:\` (unfinished); 2026-10-29 E's `Remove-Item -Recurse` aimed at the whole `AppData\Local\Temp`. 3 more on 10-06 were E's install tests. `EV/denies.txt` | **KEEP** |
| **reply-slot** | Stop | 23:42 (5,336 rows since 10-03) | **47 replies BLOCKED** (43 unmatched SOURCES, 4 missing); 828 would-block. `EV/ledgers.txt` | **KEEP** |
| **sources-gate** | PreToolUse on rings | 23:38 (5,279 rows since 10-02) | **425 rings denied** (unmatched or missing SOURCES), 1,720 warned; a denied ring is fixed and re-sent. Its catches are compliance with its own rule, not wrong facts | **KEEP** (rule compliance) |
| push-gate | PreToolUse Bash/PowerShell | 23:37 (270 rows since 10-06) | **No real catch.** 2 denies, both planted test keys (`planted2.txt`, `h.txt`, 2026-10-06, E's install); 8 allow-errors | CUT candidate by the rule. It is insurance on public pushes, so the keeper decides |
| second-reader (+ worker) | PreToolUse on rings; **a Sonnet call each** | 23:37 (3,364 rows) | 1,584 rows flagged, **never adjudicated**: it is shadow, "a flag reaches nobody in-stream" (`p-scoreboard-E_2026-10-11.md:98`) | **CUT candidate** (the costliest hook, with no seen outcome) |
| ask-ending | Stop | 23:41 (6,145 rows) | 22 matched, all `mode=shadow`: it never acted | CUT candidate |
| ask-surface | UserPromptSubmit | no ledger | never seen firing (no ledger; 0 catch lines) | CUT candidate |
| release-chime | PostToolUse Bash/PowerShell | 21:08 | 44 chimes on pushes and releases; a chime, not a check (D280) | FEATURE: keeper's call |
| sourced-stop (+ `sourced.js`) | Stop | 23:41 (15,859 rows since 08-15) | Records 3,127 unsourced turns; it never blocks ("refused a gate at 80%", `trailing_reminder_registration_2026-10-11.md:19`). Its ledger is read by `chain-status`, `baton-wake`, `boundary-reminder`, `open-items`, `js-suite` | CUT candidate as a catcher. Remove only with its readers |
| findings-return | UserPromptSubmit | 2026-11-01 15:12 | Surfaced 48 second-vantage findings to a seat. The one adjudicated surfacing I found was the reader's error: it searched the wrong repo (`librarian/2026-10-18.md:306`) | CUT candidate (with second-vantage) |
| precompact-preserve | PreCompact | 20:38 (3,097 rows, 0 failures) | injects the preserve canary; not a catcher | RUNS THE ROOM (compaction) |
| sessionstart-state (+ `state-block.js`, `sessionstart-ambient.js`) | SessionStart | 20:39 (9,136 rows, 1 failure 08-19) | injects the state block; not a catcher | RUNS THE ROOM |
| session-start, session-end, stop, userprompt-submit, precompact (shell-only) | their events | 23:4x (`event_log.jsonl` 40,183 rows) | dispatchers and recorders (the pulse, the interval, digests, `checkpoint.py`); no error rows | RUNS THE ROOM |
| ready-prompt, ready-stop (shell-only) | UserPromptSubmit / Stop | every turn | the app's readiness signal (`main.rs:21150` installs them) | RUNS THE ROOM |
| carrier-drift-watch | **not registered** | 2026-09-22 13:44 | 2,050 RED rows, 68 spoken, then stopped. The catch is the tool's (below) | CUT candidate (dormant 41 days) |
| dispatch-gate (+ `dispatch-gate-report.js`) | **not registered** | 2026-09-09 13:54 | 73 "asked" rows of 525, then stopped | CUT candidate (dormant) |
| ferry-watch | **not registered** | 2026-09-02 13:13 | 137 ferry rows, then stopped | CUT candidate (dormant) |
| l2-overseer, l3-overseer (+ workers; shell-only `l2-audit.js`, `l3-audit.js`) | **not registered** | 2026-09-22 15:17 / 15:18 | l2: 3,453 "drift" verdicts; l3: 2,698 "quiet_spiral", 2 "crisis". No record of one being acted on | CUT candidate (dormant) |
| baton-wake-stop | **not registered** ("the hook is uninstalled", `handoff_librarian_2026-09-05.md:74`) | — | v1 "fired on the one hand-off in the whole record that was done RIGHT" (`p-d006-baton-gate_2026-09-04.md:172`): a false positive | CUT candidate |
| board-digest | **not registered** | `digest_state.json` 2026-07-25 | named the carrier of a leak (`p-d130-blind-E_2026-09-24.md:23`), as the source of the defect, not as the catcher | CUT candidate (dormant) |
| blind, dream-watch, transcript-watch, jev-flags, live-mirror-stop, claim-check | **not registered** | no ledger (`claim-check.jsonl`, `live-mirror.jsonl`, `jev_judge.jsonl` absent) | never seen firing as hooks | CUT candidates (`transcript-watch` and `blind` are `require`d by tools; move them together) |

### Tools (104)

| tool | runs | what it caught or changed, with citation | verdict |
|---|---|---|---|
| **portable-paths.js** | suite guard | flagged a FATAL-SHIPPED-INSTRUCTION in a brief (`p-d476-brief-A_2026-10-26.md:68`); flagged a fixture (`p-wtsweep-E_2026-10-13.md:186`) | **KEEP** |
| **carrier-drift.js** | suite, chain-status | "caught two *new* copies born during the lap" (`map/M-2026-08-31.md:86`) | **KEEP** |
| **cite-check.js** | on demand | two stale figures "caught by `cite-check --run`, neither by reading" (`loop/universe_print_registration_2026-08-25.md:505`) | **KEEP** |
| **trip-check.js** (+ mutants) | on demand | install trips **NOT CLEAN, refused 8** (`loop/union_launch_watchlist_2026-09-22.md:119`) | **KEEP** |
| **heavy-run.js** (+ mutants) | every heavy run | refused a batch on its disk floor (`p-d592-overwrite-E_2026-10-31.md:133`); 4 stale-lock takeovers (`C:\Consonance\data\heavy-run.lock.stale-*`) | **KEEP** |
| **gen-consumer.js**, **identity-diff.js** | consumer build | "the generator refused: 1 leak(s) survived" (`p-consumer-fork-C_2026-10-08_evidence/inv/l4run.log:36`) | **KEEP** |
| **consumer-relabel.js** | app (3), suite | its row went red on a CRLF card (`loop/landing_suite_d287_2026-10-10.md:19`) | **KEEP** |
| **board-audit.js** | on demand | found 58% replay in the board: the published 96.6% pane share counted duplicates (`t3-alpha_2026-09-16.md:45`) | **KEEP** |
| **guard-census.js** | on demand | its selfcheck caught two false predictions (`loop/coat_preregistration.md:155`) | **KEEP** |
| **leftovers.js** | on demand | its first run found 5 stray `tail -F` processes from 10-14 that my own inventory had missed (`map/C.md:1708`) | **KEEP** |
| **janitor.js** (+ `janitor-task.ps1`, mutants) | scheduled daily | freed disk 11 times, last 4.04 GB at 2026-11-02 11:40 (`janitor.jsonl`) | **KEEP** (changes an outcome) |
| close.js (+ mutants), lap-row.js, state-sync.js (+ mutants), ledger-union.js (+ `union-at-launch.mutants`), state-manifest.js, chain-status.js, curate.js, stamp.js, ask.js, residue.js, live-host.js, ferry.js, jev-ask.js, jev-shadow-runner.js | the app names each (`main.rs`/`mcp.rs`); `chain-status` on every prompt, `residue` on every compaction | not catchers. Exceptions: `ferry.js`'s ledger is idle since 09-02, and Jev was switched off 2026-09-27 (`loop/plan_jev_off_2026-09-27.md`) though the app still names `jev-ask`/`jev-shadow-runner` | RUNS THE ROOM (ferry and Jev: candidates, needing an app change first) |
| js-suite.js, mutant-harness.js, scratch.js, board-compact.js, actors.js, corpus-age.js | test runner; harness library; temp dirs; ledger repair under ledger-union; board identities; the shelf (D476) | not catchers | RUNS THE ROOM / WITH their users |
| sources-gate.mutants.js, reply-slot.mutants.js, second-reader.mutants.js | with their hooks | 87/87, 58/58 (1 not applied), 38/38 (`p-d454-install-E:161`, `p-gate-switch-E_2026-10-09.md:60`, `p-mutantscopy-A_2026-10-10.md:17`) | WITH the hook |
| second-vantage.js (+ `vantage-disposition.js`, `vantage-sealed-scope.js`, `pair-ledger.js`) | scheduled daily 09:05 | 67 runs since 08-18: 683 UNLAUNCHABLE, 230 READER-FAILED, 193 AGREE, **37 SURFACE**. The one adjudicated surfacing I found was a false positive (`librarian/2026-10-18.md:306`) | **CUT candidate** (runs daily; no real catch seen) |
| commit-gate.js | not armed | "the thing it is most useful for saying is that it is NOT ARMED" (`map/A.md:577`) | CUT candidate |
| boundary-reminder.js | experiment, done | its measure REFUSED building the live reminder (`p-trailing-A_2026-10-11.md:8`): an outcome, already recorded | CUT candidate (result kept in the record) |
| imprint-measure.js | experiment, parked 08-30 | preflight refused a 7.7x-miscalibrated rule (`librarian/LEDGER.md:92`) | CUT candidate (parked; result recorded) |
| jev-judge.js, jev-shadow.js, jev-room.js, jev-variants.js, jev-ask.mutants.js, jev-shadow.mutants.js | off since 2026-09-27 | no live catch after the switch-off | CUT candidates (with the app's two Jev names) |
| claim-replay.js, claim-check-adapter.js, mistake-bench.js, mistake-bench-toolstub.js | the D305/D311 bench | measured checkers; none of them caught a live defect | CUT candidates |
| live-follow.js | live mirror (L052) | `live-mirror.jsonl` absent: never ran live | CUT candidate |
| baton-wake.js | under its uninstalled hook | its catch was a false positive (above) | CUT candidate (`lap-row.js` names it: check before moving) |
| head-watch.js | — | its ledger is unreadable (ENOENT, the state block) | CUT candidate |
| catch-ledger.js, tell-index.js, coupling-test.js, agreement-spread.js, balance-check.js, board-bursts.js, deference-unit.js, order-parameter.js, vicsek-phi.js, contamination.js, essay-provenance.js, forget-rate.js, groove.js, swell-head.js, l039-power.js, root1-score.js, seed-status.js, memory-sweep.js, offramp-check.js, read-ledger.js, prompt-events.js, pane-status.js, usage.js, whats-live.js, open-items.js, corrections-gate.js, boundary-check.js, replay-check.js, text-census.js, librarian-cite.js, librarian-route.js, reply-slot-replay.js, tj1-k-render.js, shelf-reach-score.js, dupe-scan.js, read-before-edit.js, d423-letters-swap.js, worktree-sweep.js, lineage-rip.js | on demand: measurement instruments, one-off experiments and one-time operations | **never seen catching**: no line in the record makes any of them the catcher of a live defect. They returned measurements, and several drove a decision recorded elsewhere. `d423-letters-swap`, `worktree-sweep`, `dupe-scan` and `read-before-edit` (mine) were one-time jobs, done. `lineage-rip` is new (D475): the keeper's call | CUT candidates (39) |

**Totals** (checked: every one of the 104 tools placed in exactly one set by a script over this file's names; `state-block.js` sits with sessionstart-state):
- **hooks, 32** (24 room + 8 shell-only):
  - KEEP 3;
  - CUT candidates 19. 6 of them still run on every turn or call: `push-gate`, `second-reader`, `ask-ending`, `ask-surface`, `sourced-stop`, `findings-return`. The other 13 are dormant or never registered.
  - RUNS THE ROOM 9;
  - FEATURE 1.
- **tools, 104:**
  - KEEP 16: 12 tools plus `trip-check.mutants`, `heavy-run.mutants`, `janitor-task.ps1`, `janitor.mutants`;
  - RUNS THE ROOM or WITH a hook 27;
  - CUT candidates 61, including `sourced.js` and `dispatch-gate-report.js` from the hook rows.

## Also found

- **The installed shell hooks are older than their room source.**
  - After stripping CRs, 7 installed copies differ from `consonance/hooks/` by 2 to 47 lines: `ask-ending`, `delete-gate`, `push-gate`, `release-chime`, `second-reader`, `sources-gate`, `board-digest`.
  - The diffs I read are D454's changes, never installed. For example, `push-gate`'s data-dir default, which the installed copy still returns as `null`, and `release-chime`'s fixed repo list.
  - So what runs is not what the repo says runs.
- **The board's refusals are the app's MCP gates, not hooks or tools:**
  - keep-warm refusals 69;
  - out of turn about 60;
  - NEXT-trailer about 45;
  - digest gate 34;
  - bad chair token 43.
  - checked: `EV/boardkinds.txt`. They do change outcomes (a refused ring is not delivered) and belong to item 1's gate list, not this one.
- `~/.claude/shell` holds 23 `_tmp_*` files from 2026-09-09..12, and about 60 `.bak`/`.pre-install` copies. Clutter, not hooks.

## Corrections

- My first per-tool "newest mention" dates were wrong for anything cited from a map file: map files carry no date, so they read as today. The table cites dated lines instead.
- My first pass counted push-gate's 2 denies as catches; read one by one, both are planted test keys.

NEXT: librarian collate item 2 with items 1 and 3 when their hand-backs are in; nothing moves to attic/ before the keeper sees the CUT list.
