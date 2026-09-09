# WAKE NOTE for the chair — 2026-09-09 07:50, written by the LIBRARIAN because the chair was compacted mid-handoff

*The 09-03 precedent (`loop/wake_chair_2026-09-03.md`). Everything below is from the record, not from memory: `git log`, the board, `librarian/2026-09-09.md`. Nothing the chair held in its window is needed for what follows — that is the design (`loop/one_house_two_machines_idea_2026-09-08.md` §8), and this file is it being used.*

## STATE, 07:50 (re-derived)
Record repo **level with `origin/main` at `9f86b36`**, tree clean. State repo `solariz3d/consonance-state` PRIVATE, head `faf86d4`, **0 Third Place paths tip and history-wide** (verified 06:20). **No open lap.** L048–L054 all FILED. The app was **rebuilt and relaunched at 07:44** with C's composer anchor and the launcher: seam row `sync at launch — RESUME … authored by this machine (L)`; `consonance.exe` running; `persist.log` `DELIVERY FORCED` count = **56** — the baseline the composer fix is scored against (it must not rise on the next rings).

> **CHAIR'S NOTE, appended 07:56, not a rewrite.** The chair was not lost and wrote its own handoff
> before reading this: **`exo_memory/loop/handoff_chair_2026-09-09.md`** (`658e240`). Read both — this
> file is the record's version, that one carries what only the chair held. **One correction it makes**
> **to the line above:** `DELIVERY FORCED = 56` is **not** a scorer for the composer anchor. `FORCED` is
> the only delivery verb `persist.log` has ever written (`main.rs:8130-8142` logs only the override),
> so a held delivery writes nothing and a flat count cannot be told apart from no deliveries at all.
> **It must not rise** is true and is a one-sided test; it is not evidence the fix works.
> **The close ran at 13:54:33Z and returned CLOSED at `a4cb9fe`** — item 4 of the ordered list is done.

## WHAT LANDED TONIGHT (one line each; the master has the numbers beside their commands)
- L048 B: provenance corrections ledger; ruling per-seat worktrees (K's 09-04 falsifier fired).
- L049 A/C/E: state manifest (TRAVELS/STAYS/REGENERATES); **the board replay was never closed** (offsets read from the default dir before `set_dirs`); live-host design.
- L050 C/E/B: the composer defect pinned on a real screen (fix refused); RUNG/OWED marks in `mcp.rs`; UNDELIVERED on the chain line.
- L051 C: the offsets fix; relaunch scored PASS.
- L052 B/A/C/E: board 322.9 → 44.8 MB (original in `data/attic/`); `state-sync.js` (quiescence gate, completeness index, in-sync line); `sync_launch.rs` (five verdicts, retire attic outside projects, two-phase pull); the lease fits, **the state mirror does not** (4,786 ms vs 5 s) — OFF, unregistered. **INCIDENT:** the Third Place's tail pushed at 04:33 despite a hold; contained; the repo deleted by the keeper and recreated clean; rule: a hold is a mechanism or nothing.
- L053 C: the composer anchor (bottom `❯` row with a full-width rule above, on the drawn grid); 513/0/4; measured over 157,946 real frames; the slash-command splice found and left as the next packet.
- L054 A/B: `close.js` (three claims from what the caller holds; `--check` run here, nothing published); the desktop runbook `loop/desktop_first_launch_2026-09-09.md`.

## WHAT IS LEFT BEFORE THE LID — two things
1. **The keeper runs the close:** `node C:\Consonance\lighthouse\consonance\tools\close.js` → a last line beginning `CLOSED`. Then the librarian: `git -C C:\Consonance\state ls-tree -r origin/main --name-only | grep -c 3d000000` → 0, and both repos level.
2. **This file is the chair's handoff.** If the chair wants to add what only it held (its own reading of the night), append a section — do not rewrite.

## WHAT THE CHAIR HOLDS AFTER THE GAP
- Nothing in flight. All four panes idle, nothing owed.
- **`portable-paths` is RED on 9 sites by the chair's own 07:16 ruling** — 4 BENIGN-TEST in `sync_launch.rs` tests, 4 real defaults in E's off-by-design mirror files (owed when the mirror is revisited), 1 in `state-sync.js:141` (A's three-tier shape, owed). Ruled, not baselined; the guard stays red honestly.
- Next packets, when the keeper opens them: the slash-command splice (C, a deny-list of the chrome greys after a colour census); the thesis test (`sealed/restart_continuity_2026-08-15.md`) on a seat woken from the record — the desktop's 08:00 is its first natural run; the lit fetch for §7 (A); per-seat worktrees (the keeper's decision 1).

## THE DESKTOP AT 08:00
The keeper follows `loop/desktop_first_launch_2026-09-09.md` top to bottom. Machine tag D (never L). The seam row must say **MIGRATE**. The chair that wakes there is a new session woken from the synced tail and this record; its transcript here stays here.

*Librarian, 07:50. Master: `librarian/2026-09-09.md`. Handoff: `loop/handoff_librarian_2026-09-09.md`.*

## DESKTOP CHAIR, 08:52 — the first click opened the wrong house, and why (appended, not rewritten)

**Steps 1–3 were done on the desktop before 08:38** (tag `D` in env and config; `C:\Consonance\state`
cloned at `a4cb9fe`; `--verify` → `COMPLETE — 47 of 47`, `pushed by L at 2026-09-09T13:54:33.666Z`).
The shortcut was then clicked at 08:45:33. **No seam row was posted, no `sync-pull.log`, no
`sync-completion.json`, no attic.** The only trace was in the DEFAULT data dir:

    ~/.consonance/persist.log:  1788965133 SYNC AT LAUNCH STANDALONE — state-sync.js is not on disk
    ~/.consonance.log (×4):     CONFIG PROBLEM in C:\Users\nname\.consonance.json: not valid JSON
                                (expected value at line 1 column 1) — those settings fall back to
                                built-in defaults, which CHANGES WHERE YOUR INSTANCES LIVE.

**Cause, by the bytes:** `head -c 4 ~/.consonance.json` → `ef bb bf 7b`. The runbook's step-1 config
block writes with `Set-Content -Encoding utf8`, which on PowerShell 5.1 prepends a BOM, and the
runbook says *"That is safe: both readers strip it — `state-sync.js:157` and `main.rs`'s
`machine_identity`."* Both of those DO strip it (`main.rs:9013`). **`parse_config` (`main.rs:98`)
does not** — plain `serde_json::from_str(s)` — and `parse_config` is the reader that decides
`data_dir`, `instances_dir` and `room_path`. So the machine tag survived, and the house did not:
data dir → `~/.consonance`, instances → `~/claude-instances`, room path → empty → `repo_root()` →
`None` → `ToolAbsent` → STANDALONE. The chair that woke was the retired July lineage in
`~/claude-instances/main` (its own pulse read *"dark 44 days"*), with no committee seats. The
retire rule could not fire because from inside that house there was nothing foreign.

**Three other readers in the same file strip the BOM with the comment "a BOM has silently killed a
JSON parse in this repo twice" (`main.rs:1489`, `sync_launch.rs:553/575/598`). This is the third.**

**Repair, 08:51:** the BOM stripped from `~/.consonance.json` (backup at
`~/.consonance.json.bak-bom-20260909`, content otherwise byte-identical; verified by `cmp`). Raw
`JSON.parse` fails before and passes after. `node` is on the system PATH, `gh` is logged in,
`git -C C:\Consonance\state fetch --dry-run` exits 0, `BOOT.md` exists at the configured room path.
**The binary was left as the laptop built it** — no code change ahead of the MIGRATE arm's first run.

**Owed, not done here:** one line in `parse_config` (`s.trim_start_matches('\u{feff}')`) with a test,
and the runbook's step-1 claim corrected (§0.6 appended there). A packet, not a chair edit mid-launch.

**Also on this desktop, untouched by any of the above:** the record repo is 5 commits ahead of
`origin/main` (4 desktop LIBRARIAN/D012 commits of 09-06 plus the 08:37 merge) and carries 3
modified files + 1 uncommitted hand-back (`handback/p-d012-windowed_2026-09-06.md`, pane K). The
launch installs the DATA dir, not the repo; these stay where they are.
