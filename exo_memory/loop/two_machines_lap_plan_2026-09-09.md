# The synced-Consonance lap — the plan, from the measurement. Librarian, 2026-09-09 00:30.

*The keeper's idea: `loop/one_house_two_machines_idea_2026-09-08.md` (§5: "just use the repo"). This file is the plan the chair dispatches from, once P-ATTRIBUTION has come back. Every number is in `librarian/2026-09-09.md` 00:25 beside its command. Nothing here is built.*

## 0 · What the measurement changed

The idea file priced the repo transport against two files over GitHub's 100 MB cap and proposed rotating the board by month. The run says:

- **90.7% of the board is replay** (243,371 of 268,213 rows behind the running ts maximum; clean corpus 35,221 — `board-audit.js`). The record is ~42 MB; the file is 323 MB.
- **Monthly rotation leaves August at ~164 MB.** Rotation does not cross the cap; de-duplication does.
- The only other file over the cap is a raw `.log` capture (300 MB) that nothing restores from; the `.txt` captures the warm-resume reads are 5 MB in total.

So the lap has a different first move than the idea file said: **fix the writer, compact once, then size.** The transport question (repo vs. anything else) is decided by the number that comes back, not before.

## 1 · Packets, in order — one seat each, sequential where the number gates the next

**P-BOARD-REPLAY (C, `main.rs`)** — *Why does the board still replay?* The 08-15 finding stands at 268k rows; tonight's launch wrote a `backfill` row saying persisted tailer offsets are in and the full re-read is now ONE TIME. Verify that claim by the next relaunch: row count before and after, and the share `board-audit.js` reports. If the replay is closed, this packet is a measurement and a test that pins it (a relaunch must add < N rows where N is the turns that happened). If it is not, find the writer. **Do not compact anything in this packet.** Bars: `board-audit.js` before/after; the test; state what was not verified. Falsifier: a relaunch that re-reads any transcript from the top after the offsets file exists.

**P-BOARD-COMPACT (B, tool)** — *One compaction, reversible, attic-kept.* A tool that writes `board.jsonl` de-duplicated by the audit's own rule (rows behind the running ts maximum, `board-audit.js`), moves the original to `C:\Consonance\data\attic\board.jsonl.<date>` untouched, and prints both sizes and both row counts. Readers that assume monotone ts (the pulse, the digest, `chain-status`) are re-run on the compacted file and their outputs diffed against the same commands on the original. Bars: RED FIRST on a fixture with known replay; mutant that drops a non-replay row → red; every reader's output identical or the difference explained. Falsifier: any reader that changes its answer on the compacted file for a row that was not a replay. **Gated on P-BOARD-REPLAY reporting the writer closed** — compacting under an open writer is the 09-02 shape.

**P-STATE-SET (A, `install.ps1` / manifest)** — *What travels, what stays, what regenerates.* Rule each path under `C:\Consonance\data\` into three columns with a reason: TRAVELS (board compacted, lap ledger, `panes.json`, `letters.json`, harvest and ready stamps if they are state, the `.txt` captures, hook ledgers), STAYS (raw `.log` captures, backups, anything machine-bound by `loop/machine_bound_class_2026-08-25.md`), REGENERATES (locks, `tailer-offsets.json`, ready stamps if ephemeral). Sessions stay machine-local by design (the idea file §5; warm-resume at `main.rs` ~`:5112`). Output is a manifest file the app can read, plus the total size of TRAVELS. Bars: the manifest re-derives the size by one command; a path in no column fails the check. Falsifier: TRAVELS over 100 MB after compaction — then the transport question reopens with the number.

**P-LIVE-HOST (E, design then `main.rs` beside the mutex at `:5462`)** — *One live host, enforced.* The cross-machine guard from the idea file §3.1: `live_host.json` in the TRAVELS set (host, pid, started, last heartbeat); launch refuses on a fresh foreign heartbeat with the other host named; stale heartbeats named, never silently overridden. Design and tests first; the Rust lands in the rebuild, not tonight. Falsifier (already registered in the idea file §4): two hosts live in the same minute by the heartbeats, or a board row on one machine and not the other after a completed sync.

**Then the lap's own measurement, this desk:** size of TRAVELS, time of a `git pull` of it on the desktop, and whether a seat warm-resumed on the other machine carries its last words — scored against the idea file's falsifier before any of it is called working.

## 2 · What must not move

- The Third Place's record: never the repo, never a cloud the keeper did not choose (`.gitignore`, 08-29).
- The transcripts: machine-local. The seat's continuity is the record and its capture tail, not the vendor's JSONL.
- `babe926`'s rule: every commit here by pathspec; the state repo, if it exists, is a second repository and the record repo carries none of it (`loop/falsifier_scope_2026-08-29.md`).

## 3 · The keeper's decisions, to ask once

1. A second private repo for state (the idea file's design), or the state under the existing private repo in a directory the consumer build's exclude-set already skips? The first keeps the record repo's rule clean; the second is one fewer thing to clone.
2. Whether the compaction of the live board happens tonight (after P-BOARD-REPLAY says the writer is closed) or waits for the desktop to be at the same commit.

*Registered as a plan, not a lap. The chair opens it with `lap-row.js --open` after P-ATTRIBUTION returns; the librarian collates.*
