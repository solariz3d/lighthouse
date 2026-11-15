# p-l208-seven-syncs-B: L207 landed and pushed, then the seven hook file syncs on L (L208)

Packet: `[chair:MAIN]` 2026-11-14 08:20:28Z, "LAND L207's NOTES, PUSH, THEN THE SEVEN FILE SYNCS"; his word of 02:17 local, "go, and yes
to all" (`briefs/lighthouse_the_room.md:154`). Tier: check it. Machine: L. Long output is in my scratchpad under `l208/`; this file
carries counts and paths.

## WHERE IT STOPS (L, 08:3xZ): done

- **(a) Landed:** lighthouse main **4ffcbf3c**, read back from the remote. The worktree `Downloads\lh-wt-l207` is removed.
- **(b) to (d):** all seven synced, file only, one leaf a run.
  - For every one: settings.json byte-equal before and after; only that entry moved in a bare `-Check`; the installed copy equals
    main's.
  - Nothing was restored, because nothing broke.
- **Live:** two seen firing live (sourced-stop.js, userprompt_pulse.py). The other five could not be seen in the lap, each for a
  reason in the table.
- **Held, as the packet says (e):** blind.js with board-digest.js, sources-gate.js, reply-slot.js, the three second-reader files,
  ask-ending.js, release-chime.js, the three EXCLUDED, userprompt-submit.js.
- **Nothing running, no lock.** This file's branch is pushed by its literal name.
- **Next:** none. The first SessionStart (any seat's start, resume or compaction) and the first SessionEnd show the other hooks
  live. `scratchpad/l208_live.js` reads them; the shared ledgers named in the table are where to look.

## (a) The landing

- **Before:** main 123a810d, 6 ahead of origin's fbe5a151.
  - checked: `git diff --stat main...l207-l-owed-steps` gave 2 files and 179 insertions, both under `exo_memory/`.
  - The branch's blob was 1665cbf3, as the librarian read.
- **Not mine:** one untracked file, `exo_memory/third_place/2026-11-14.laptop.md`. Nothing staged but the merge.
- **Merge:** `git merge --no-ff l207-l-owed-steps` (9c6c4d65) gave **4ffcbf3c**.
- **Scans over `origin/main..main`** (8 commits, 224 added lines):
  - `gatescan.js`: allow, 0 found.
  - The privacy grep: 0 non-attribution hits in messages.
  - 1 hit in added lines, in the librarian's 45a84545, which quotes my L207 ring's worktree path, the same case as at L207.
- **Push:** `git push origin main`, one command. `fbe5a151..4ffcbf3c main -> main`.
- **The gate's row:** `C:\Consonance\data\push-gate.jsonl`, `t` 2026-11-14T08:21:09.573Z, `seat` 12fb81f6 (this session),
  decision **allow**, scanned `{C:\Consonance\lighthouse, origin, main}`.
- **Read back:** `git ls-remote origin main` → 4ffcbf3c500c7172de1bf284d904d52df53756f7, equal to main. backup/* refs on the
  remote: 0.

## (b) to (d): the seven, one leaf a run

**How each ran** (`scratchpad/l208_one.sh`):
- `node consonance/tools/heavy-run.js --status && powershell -File dev/shell/install.ps1 -NoRegister -Only <leaf>`, from
  `C:\Consonance\lighthouse`.
- settings.json copied before and after, byte-compared, and read with pane H's `semdiff.js`.
- A bare `-Check` after, its every entry's state diffed against the previous run's.
- The installed sha256 against `git show main:<source>`.
- **Files per leaf,** under `scratchpad/l208/`: `install-*.txt`, `settings-{before,after}-*.json`, `semdiff-*.txt`, `check-*.txt`,
  `states-*.txt`, `row-*.txt`. The baseline is `check-base.txt`: exit 1, 13 DRIFT, 7 ABSENT, the same as at L207's end.

**(c), before any sync** (`scratchpad/l208_requires.js`, output `scratchpad/l208/requires-before.txt`):
- **The check:** every literal relative require of main's copy, resolved by `landed-live.js:114-122`'s own rule (`requiresOf`),
  must be present on L **and** equal to main's copy of its source.
- **Why both:** the 11-13 lesson was a required file that was present and old (blind.js without `sealedGate`).
- **Also read by hand:** what each loads by other means.

**The order:** least frequent first. The packet's three (every prompt, or every session start) came last. One correction to its
premise: **four more of the seven fire for every seat too.**
- **On every prompt:** findings-return.js and ferry-watch.js are wired on UserPromptSubmit here (settings.json; install.ps1:246).
- **On every turn's end:** sourced-stop.js, on Stop.
- So each of those also got a hand run, not only the three.

| # | leaf | requires (c) | installer said | exit | settings equal | -Check after | live firing |
|---|---|---|---|---|---|---|---|
| 1 | hooks\session-end.js | none relative | synced | 0 | yes | 12 DRIFT, 7 ABSENT | **none could be seen:** SessionEnd fires only when a session ends, and none did. Hand run on a scratch shell dir: exit 0, `{}`, a scratch digest only |
| 2 | sourced-stop.js | none relative | synced | 0 | yes | 11, 7 | **SEEN:** this seat's Stop, `sourced_ledger.jsonl` row at 08:27:19.674Z (v 2, 38 tools, sourced true). Hand run, scratch ledger: a v2 row |
| 3 | ferry-watch.js | none relative | synced | 0 | yes | 10, 7 | **none could be seen:** it acts only where `.chair-token` is (`ferry-watch.js:40`), and the chair had no prompt in the lap. It ran on this seat's prompt at 08:27:59Z and exits there by design. Hand run from the chair's folder: its `[ferry]` block, 718 B; from this pane's: 0 B. It writes nothing |
| 4 | findings-return.js | none relative | synced | 0 | yes | 9, 7 | **ran, no trace by design:** on this seat's prompt at 08:27:59Z, with no hook error. It prints and writes nothing when no finding is due. Hand run on a copy of the live `return_state`: 0 B. On an empty scratch state: 4,003 B, the same block the old copy prints there (4,007 B; one sentence's wording differs), so the sync changes nothing a seat sees |
| 5 | sessionstart-state.js | none relative; finds `consonance/tools/state-block.js` through `room_path` (present) | synced | 0 | yes | 8, 7 | **none could be seen:** SessionStart fires only at a start, resume or compaction, and none happened. Hand run, scratch ledger: `compact` printed the state block, 3,182 B (`emitted`, failed false); `resume` printed 0 B (`skipped`) |
| 6 | hooks\session-start.js | `lib\fresh-guard.js`: present, equal to main's; also loads `lib\ambient.js` by path, inside a try (`ok` in -Check) | ok lib\ambient.js; ok lib\fresh-guard.js; synced hooks\session-start.js (the line as landed-live prints it) | 0 | yes | 7, 7 | **none could be seen** (as 5). Hand run on a scratch shell dir with copies of `lib\` and `digests\`: the shell context, ambient and digests, 516 B |
| 7 | userprompt_pulse.py | imports json, os, datetime, sys, subprocess (standard library); calls `consonance/tools/chain-status.js` through `room_path` (present) | synced | 0 | yes | 6, 7 | **SEEN:** its `[pulse]` line on this seat's prompt at 2:27 local, and `pulse_state.sibling-5bf9d657.json` rewritten at 08:27:59.326Z. Hand run with a scratch home: valid JSON, `[pulse] Sat 2026-11-14 2:26 AM`, exit 0 |

- **Each installed copy equals main's** (sha256 first 12):
  - session-end d1868a1c5129, sourced-stop 4404860d901a, ferry-watch 166dcef319e4, findings-return c82fcdf0ac77;
  - sessionstart-state be9fd9b2cbf6, session-start bac072e58c40, userprompt_pulse ec2948937dd5.
- **The `-Check` diff after each run** shows exactly one line pair, that leaf's DRIFT → ok. Nothing else moved in any run, so no stop
  was owed.
- **The live reads:** `scratchpad/l208_live.js`, outputs `scratchpad/l208/live-{1,2,3}.txt`. The librarian's and the chair's
  transcripts since the first sync show no marker of the seven after their sync times, and 0 errors naming any of the seven.
- **My fault on the way:** the first hand run of sourced-stop.js printed nothing, because my shell quoting broke the transcript
  path. Rebuilt in node, it wrote its row. Nothing live was touched.

## After the last one

- **`landed-live.js --all`** (`scratchpad/l208/landed-live-all-final.txt`): exit 0. "LIVE-HERE L HEAD c4d416f7: **23/25 live**;
  owed blind.js,board-digest.js; new second-reader.js,second-reader-note.js,sources-gate.js,reply-slot.js,ask-ending.js,release-chime.js;
  held none". c4d416f7 is the shared checkout's main, the librarian's commit after my push.
- **The bare `-Check`** (`scratchpad/l208/check-7-userprompt-pulse.txt`): exit 1, **6 DRIFT, 7 ABSENT**. Every one is held or
  excluded:
  - DRIFT: userprompt-submit.js, stop.js, l2-overseer.js, l3-overseer.js, blind.js, board-digest.js;
  - ABSENT: the three second-reader files, sources-gate.js, reply-slot.js, ask-ending.js, release-chime.js.
- **settings.json:** sha256 a0a7ffc1d91e3d1ee95a1e7fdb7bfaf05cb1d2991a7c62a438ac795fcc13dd9f, the same before the lap and after it.

## Every .bak, by path

- **Mine, before the first sync:** `~\.claude\settings.json.bak-l208-before-20261114T082259Z` (sha256 a0a7ffc1…, equal to the
  file; settings.json never changed in this lap, and `-NoRegister` wrote no settings backup).
- **The installer's, one per synced leaf:**
  - `~\.claude\shell\hooks\session-end.js.bak-20261114-022315`
  - `~\.claude\shell\sourced-stop.js.bak-20261114-022335`
  - `~\.claude\shell\ferry-watch.js.bak-20261114-022411`
  - `~\.claude\shell\findings-return.js.bak-20261114-022429`
  - `~\.claude\shell\sessionstart-state.js.bak-20261114-022511`
  - `~\.claude\shell\hooks\session-start.js.bak-20261114-022529`
  - `~\.claude\shell\userprompt_pulse.py.bak-20261114-022557`

## Could be wrong

- **That the three SessionStart and SessionEnd hooks work when they fire live:** shown only by hand runs. The hand runs used
  scratch folders, so they did not read the real event log or digests' write paths.
- **findings-return.js's live run is inferred** from the prompt it was registered on and the absence of an error. It leaves no
  trace when nothing is due.
