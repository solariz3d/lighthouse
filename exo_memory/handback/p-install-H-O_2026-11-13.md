# p-install-H: pane H's five hooks installed on D, and landed-live scored against install.ps1 -Check (O), 2026-11-13

Packet: the chair's D675 order of 22:18Z, the step after the six-branch landing (`p-land-six-O_2026-11-13.md`, main fab53587). Tier: PROVE IT (it installs and overwrites). Seat: O. Machine: D.

## The installs, one entry a run (`powershell -File dev\shell\install.ps1 -Only <leaf>`, from the shared checkout at fab53587's code)
- **Before installing:**
  - checked: `git status --short` → the installer and the five sources were clean;
  - checked: `git diff --quiet fab53587 HEAD -- dev/shell consonance/hooks` → equal.
- checked: a bare `-Check` before → precompact-preserve.js, precompact.js and push-gate.js were DRIFT; sessionstart-body.js and wake-gate.js were ABSENT (`S\inst\check-before.txt`).

| # | entry | installer said | exit | settings.json, semantically (`S\land4\semdiff.js`) | installed sha256 = fab53587's |
|---|---|---|---|---|---|
| 2a | precompact-preserve.js | synced | 0 | no change | a9c615063e99 = a9c615063e99 |
| 2b | hooks\precompact.js | synced | 0 | no change | 6f4945a41612 = 6f4945a41612 |
| 2c | sessionstart-body.js | installed | 0 | **+1 hook** in the existing SessionStart group: `sessionstart-body.js` t=10 | 3839476acded = 3839476acded |
| 2d | hooks\wake-gate.js | installed | 0 | **+1 group**: PreToolUse `[mcp__consonance__call_chair]` `hooks\wake-gate.js` t=10 | 25136347edee = 25136347edee |
| 2e | hooks\push-gate.js | synced | 0 | no change | e9bd2ce8b7ab = e9bd2ce8b7ab |

- **All five against the copy taken before 2a** (`S\inst\semdiff-five.txt`):
  - 9 hook groups became 10;
  - ADDED: the SessionStart group with the body line, and the wake-gate group;
  - REMOVED: only the same SessionStart group without the body line.
  - **Exactly the two registrations pane H's hand-back named** (`p-lapw-H-P_2026-11-13.md:170-172`). No other key changed.
- **Backups kept:**
  - each hook's `.bak-20261113-1645xx` sits beside it in `~\.claude\shell`;
  - settings.json has `.bak-20261113-164531` (4,942 B, the pre-install copy) and `.bak-20261113-164546`.
- **Board row posted** when wake-gate.js went live, about 22:46Z.
- **Not established** (pane H's note): whether a seat already running picks up a new registration without a restart. No seat was restarted.

## The new settings baseline (after step 2e), for Lap I's rows
- checked: `stat` and `sha256sum` of `~\.claude\settings.json` → **12,332 B, sha256 8a32afa53882d3ba…** (`S\inst\settings-after.txt`).
- **The jump from 4,942 B is mostly formatting, not content.**
  - checked: `S\inst\minsize.js` → minified, 3,341 B became 3,678 B (+337 B, the two hook entries). The rest is the installer re-writing the file with a 4-space indent and CRLF, where it had a 2-space indent and LF.
  - The parsed values are equal apart from the two additions (semdiff compares every top-level key's JSON).

## landed-live.js --all beside a bare install.ps1 -Check, file by file (D, after the installs)
- checked: `node consonance/tools/landed-live.js --all` → exit 0, at HEAD 615f3c5c; summary "16/24 live" (`S\inst\landed-live-all.txt`).
- checked: `install.ps1 -Check` → exit 1, from the other entries' drift: 9 DRIFT, 1 ABSENT, 2 HELD (`S\inst\check-after.txt`).
- checked: `S\inst\compare.js` (each file's state on both sides, keyed by leaf name) → **39 files; 37 agree or carry no byte claim; 2 do not** (`S\inst\compare.txt`).
  - **24 agree outright:**
    - LIVE beside ok: 16, among them all five of pane H's;
    - OWED or NEW beside DRIFT or ABSENT: 6;
    - HELD beside HELD: 2, dispatch-gate.js and carrier-drift-watch.js, off D until 2026-11-27, untouched.
  - **13 carry no byte claim:** landed-live says EXCLUDED or NOT RUN HERE, so whether the bytes match decides nothing. Three of these are DRIFT on -Check: l2-overseer-worker.js, userprompt_pulse.py and board-digest.js. That is drift in files nothing on D runs.
  - **1 DIFFERS: `reply-slot.js`, landed-live OWED and -Check ok.**
    - Its own bytes match. landed-live owes it because it requires `sources-gate.js`, which is not HEAD's ("requires sources-gate.js, not HEAD's").
    - -Check reads bytes only, and doesn't follow `require`. landed-live is the stricter reading here, and installing sources-gate.js clears both.
  - **1 ON ONE SIDE ONLY: `ask-surface.js`.** landed-live says RUNS FROM REPO (it is registered at the repository path). -Check lists it among the 5 DECLARED UNMANAGED, so it has no row there. That is by design.
- **Not like P's earlier run** (37 of 38, the 38th by line endings only): none of D's differences here is a line-ending case.

## Owed on D after this (landed-live's own OWED and NEW lines; Lap I's rows decide which are installed)
- `second-reader.js`, `second-reader-worker.js`, `sources-gate.js`, `reply-slot.js` (through sources-gate.js), `delete-gate.js`, `ask-ending.js`, `release-chime.js`: OWED.
- `second-reader-note.js`: NEW.

## What L owes (for the handoff)
- **The same five installs on L, one entry a run**, then the same semantic check. Two registrations are added, and nothing else should change.
- **L's -Check must not be read as landed-live's verdict.** reply-slot.js reads ok on bytes and is still owed through `require`.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\e1275915e2cd5544\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: S\inst\{check-before.txt, install-*.txt, semdiff-five.txt, settings-after.txt, landed-live-all.txt, check-after.txt, compare.txt}; sha256sum of the five installed files against git show fab53587:<path>; S\inst\minsize.js
NEXT: librarian read the install table when this ring is read; O goes on to Lap I's rows on D, driven by landed-live's OWED lines, with rows 7 and 8 last and a board row before and after them

## Answers to the chair's 22:49Z questions (delivered 22:54Z, after this file's ring; appended 22:56Z)
1. **Which floor: the REFUSE floor of 20 GB.**
   - "Not met" meant the suite was not refused. It was under the 50 GB WARN line.
   - checked: `S\land6\js-suite.out` → "heavy-run: WARNING: C:\ has 27.6 GB free, under 50 GB" (`heavy-run.js:58-61`).
   - My wording in `p-land-six-O_2026-11-13.md` should have said so.
2. **settings.json: only the two new groups changed in MEANING. The other bytes are re-serialisation.** See "The new settings baseline" above.
   - **Minified size:** 3,341 B became 3,678 B (+337 B, the two hook entries).
   - **The rest:** the installer re-writes the file with a 4-space indent and CRLF, where it had a 2-space indent and LF.
   - **The meaning:** semdiff compares every hook group and every other top-level key's JSON. ADDED 2: the SessionStart group now carrying `sessionstart-body.js`, and the PreToolUse group for `wake-gate.js`. REMOVED 1: the same SessionStart group without the body line. Nothing else.
   - **The copies kept from before, both 4,942 B:**
     - `C:\Users\nname\.claude\settings.json.bak-20261113-164531`, the installer's own;
     - `C:\Users\nname\AppData\Local\Temp\claude\e1275915e2cd5544\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad\inst\settings.before-H.json`, mine.
   - **Since then, Lap I's row 11** added one PostToolUse group (13,069 B, sha256 cacf6209c4a352ef…; `p-lapi-rows-O_2026-11-13.md`).
3. **The disk:** nothing of mine has needed the lock since the suite.
   - The Lap I rows ran one hook test file each (no lock), plus file syncs. Nothing was bypassed and nothing was deleted.
   - checked: `df -h /c` at 22:56Z → 21G available. That is df's rounding, in GiB; heavy-run's figure is its own.

## The chair's two owed lines (23:04Z; appended 23:10Z)
1. **Clause 3's first half, scored: YES, all 16 LIVE entries are matched to a settings.json command on D.**
   - checked: `node p-install-H-O_2026-11-13_scripts/live-cmd.js <landed-live --all output> <settings.json> dev/shell/install.ps1`, run on the table's landed-live run against settings as it stood then (12,332 B, the copy before Lap I's row 1) → **16 of 16** (`S\inst\live-cmd.txt`):
     - **13 hooks run by a command at the installed path** `~/.claude/shell/<To>`. The match is strict on the path, not only the file name.
     - **3 Libs** (ambient.js, fresh-guard.js, ready.js), each required by at least one hook in its install.ps1 `By` list that a command runs.
   - checked: the same after Lap I's rows → landed-live "24/25 live; owed none; new none", and **24 of 24** matched (`S\inst\live-cmd-now.txt`).
2. **The scripts are committed beside this file,** in `exo_memory/handback/p-install-H-O_2026-11-13_scripts/`:
   - `semdiff.js`, the semantic settings diff;
   - `compare.js`, landed-live beside -Check, file by file;
   - `minsize.js`, raw against minified size;
   - `live-cmd.js`, line 1's instrument.
   - checked: grep for drive, home and AppData paths → none.
   - checked: `node consonance/tools/portable-paths.test.js` with them staged → pass 43, fail 0.
   - **L repeats the semantic check** with `node semdiff.js <settings copy before> <settings.json>`.
- **"Not established" is now SETTLED by the chair's reading, not mine:** a running seat picks up a new registration without a restart.
  - The librarian's compaction wake printed the body line.
  - `wake-gate.jsonl` has two allow rows for its session (22:48:15Z, 22:59:35Z).
