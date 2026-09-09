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


## 4 · BUILD ORDER, 03:05 — everything buildable before the desktop is reachable at 08:00, in dispatch order

*The keeper, 03:00: "There is no way for me to test it until after 8AM today when I go home from work, but this doesnt stop us from trying to build it." The spec is §6–§8 of `loop/one_house_two_machines_idea_2026-09-08.md`; the writer is closed by measurement (`replay-check --score` PASS, 03:00). Four panes, five packets; the desktop test at 08:00 is the score, not a step.*

**P-BOARD-COMPACT (B) — first, because every size below depends on it.** As §1 wrote it, now ungated: compact `board.jsonl` by the behind-the-max rule (A's projection: 52.8 MB TRAVELS), original to `C:\Consonance\data\attic\board.jsonl.<date>` (STAYS per the manifest), every reader (`board-audit`, `chain-status`, the pulse, the digest, `board-digest.js`) diffed before/after on a copy, red-first on a fixture with known replay, mutant that drops a non-replay row → red. **Then `node consonance/tools/state-manifest.js` for the number.** Hand-back carries the size.

**P-STATE-REPO (A) — the transport, on this machine.** Assumption stated (keeper decision 2, recommended): **a second private repository, `solariz3d/consonance-state`**, cloned at `C:\Consonance\state\`; the record repo carries none of it (`falsifier_scope`). A builds the sync set from the manifest's TRAVELS column as a checked-out tree: the board (compacted), the ledgers, `panes.json`/`letters.json`, the `.txt` tails, hook state, `live_host.json` when E writes it — by **hard link or copy-on-close from `data\`**, whichever the writers tolerate (measure: the board is append-only; the ledgers are append-only; the tails are rewritten). `install_id` forbidden there (the manifest's `forbidden` list already says so). Deliverables: `consonance/tools/state-sync.js` with `--push` (commit by path, push) and `--pull` (fetch, fast-forward, verify the manifest's completeness check, write `sync-completion.json` STAYS), tests on a fixture repo, and **the "in sync" line: one commit hash per machine, printed by `chain-status.js` in place of `this machine only`**. Creating the GitHub repo needs the keeper's `gh` — the chair asks once; A builds against a local bare repo until then.

**P-SYNC-AT-LAUNCH + P-RETIRE (C, `main.rs`) — the desktop's first launch, made correct before it happens.** Launch order becomes *pull, verify, then start* (idea file §3.2): `state-sync.js --pull` before `set_dirs` reads anything, refuse to start on a partial pull, and post one seam row to the board (the `backfill` announcement's slot). **The retire rule, and it is the case the desktop will hit at 08:00:** Main, the librarian and the Third Place have hard-coded session ids, so on the desktop `claude --resume` would find the DESKTOP's old transcripts for those ids and resume *them* — the seat that was retired, not the one that synced. So: when the pulled state's `live_host.json`/`letters.json` say the seats last lived on another host, **move this machine's transcripts for those ids to `~/.claude/projects/…/attic/` (revivable), and wake each seat by warm-resume from the synced tail + shelf** (`main.rs` ~`:5112`). The `seed_*`-before-`set_dirs` class (C's L051 §6) is closed in the same packet, since the pull must run after the resolver too. Tests: pure where possible; the retire decision from fixture files.

**P-LIVE-MIRROR (E) — both on.** Wire E's design (`loop/design_live_host_2026-09-09.md`) per seat: the lease at `refs/consonance/live/<seat>` (probe the custom-ref push against the real remote once A has one; fallback a branch); a Stop hook that runs `state-sync.js --push` after each turn (the state moves at turn cadence — measure the round trip, which fills `publishMs`); a follower loop (`--pull` on an interval, the board and tails re-read by the app); typing on a follower = acquire the seat's lease, then the seat is driven there. The bound before building: ≤ 5 s internet, ≤ 1 s LAN; the falsifier is a measured latency above it, or two drivers of one seat in the same minute.

**P-THESIS-TEST (A, after P-STATE-REPO; the chair spawns) — the test that decides §8, run tonight on THIS machine.** Simulate the desktop: spawn a fresh pane whose transcript is hidden, wake it by warm-resume from a synced tail + the record alone, and score it with the sealed restart-continuity test (`loop/restart_continuity_scorecard_2026-08-24.md`, subject `sealed/restart_continuity_2026-08-15.md`; scorer a seat that did not build it — this desk or the Third Place). PASS = the record is the carrier; FAIL = the transcripts come back as the carrier (§8's registered falsifier) and the thumbdrive route reopens before 08:00 is wasted.

**08:00, the desktop, the score (the keeper's, with one command list):** `git pull` both repos → launch → the seam row says pulled-and-verified → the seats wake and the tapticker reads "no turns yet" → type in one pane and watch the laptop, if it is on. What is scored: the retire rule fired (old transcripts in attic), the seats' first words come from the synced record, the latency against the bound.

**Not in tonight's set:** the composer anchor (its own packet, C, after this); per-seat worktrees (decision 1); the consumer.


## 5 · THE ROUND TRIP BY 08:00, 06:30 — what is built, what is missing, and the two packets that close the gap

*The keeper, 06:25: "when I close my laptop, and rebuild the newest consonance on my desktop at home, you and everyone else will be right where we left off on the laptop, and then … Sunday morning … all the work we have done on the desktop automatically comes back … to the laptop, repeat."*

**The trip, leg by leg, against what exists at `faf86d4`/HEAD:**

| leg | what must happen | built? |
|---|---|---|
| 1. laptop CLOSE | the record repo pushed (handoffs, notes) — routine; **the state set pushed** (`state-sync.js --push`) | record: routine. **State: NOTHING pushes at close.** E's Stop hook is off and unregistered by design; the only push tonight was run by hand. |
| 2. desktop LAUNCH | pull both repos → verify → install → **Migrate**: retire the desktop's chair/lib/Third Place transcripts to the attic, wake all seats from the synced tails | built (C's `sync_launch.rs`, five verdicts) — **never run on a machine whose record was authored elsewhere** |
| 3. desktop WORK | the seats work; the board, ledgers, tails accrue on the desktop | as now |
| 4. desktop CLOSE | the state set pushed from the desktop | same gap as leg 1 |
| 5. laptop LAUNCH (Sunday) | pull → verify → install → Migrate the other way: retire THIS machine's three transcripts, wake from the desktop's tails | built, symmetric by `pushed_by` ≠ `machine`; never run |

**So the whole round trip rests on one missing piece: the push at close.** Everything else is C's launcher running its `Migrate` arm for the first time, which the desktop test at 08:00 IS.

**P-CLOSE-PUSH (A, tool; C already holds `main.rs` for L053 — so the app-close wiring waits):** `node consonance/tools/state-sync.js --push` becomes the last act of a close, two ways: (a) a `consonance/tools/close.js` (or `--close` flag) that runs the push, prints the in-sync line, and REFUSES to say "closed" if the push did not land or the privacy check did not run — the keeper runs it before shutting the lid, tonight by hand; (b) the app's own close path calls it once C is free — a later packet, not tonight. The push must refuse when a capture is mid-rewrite (A's settle gate does) and say DEFERRED, then retry once, so a close never leaves a torn tail as the record.

**P-DESKTOP-RUNBOOK (B, file):** `loop/desktop_first_launch_2026-09-09.md`, the exact commands in order, copied by the keeper at home: (1) `~/.consonance.json`: `machine_tag` must not be `L` — set `D`; `data_dir`; `state_dir` if the clone is not at `C:\Consonance\state`; (2) `git -C C:\Consonance\lighthouse pull` and rebuild; (3) `git clone https://github.com/solariz3d/consonance-state.git C:\Consonance\state`; (4) **compact the desktop's own board first** (`board-compact.js --apply`) — a 300 MB board would be refused at the first push and stop the sync dead; (5) launch → read the seam row: expected **MIGRATE** with the moved files named; (6) `chain-status.js` prints two hashes; (7) at the desktop's close, the close command from P-CLOSE-PUSH. And the failure table: `LOCAL HOUSE` = the pull did not verify, read `sync-pull.log`; `RESUME` on the desktop = the machine tags collide, fix `machine_tag`; `RETIRE FAILED for <seat>` = a handle on the transcript, close the seat and relaunch.

**What is NOT in the round trip and stays off:** the both-on live mirror (E's bound; the hook unregistered; `CONSONANCE_MIRROR_STATE` unset). The keeper's "automatically" is met at LAUNCH and at CLOSE, not per turn — which is exactly §8's design (the record is the carrier; sync = same commit).

**The dry run before the lid closes, this desk scores it:** run the close command here → `in sync: L <sha>` → `git -C C:\Consonance\state ls-tree -r origin/main | grep -c 3d000000` = 0 → the record repo level. That is the laptop's leg 1 done for real, and the desktop's 08:00 is leg 2.
