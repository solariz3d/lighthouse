# One Consonance on two machines — the keeper's idea, saved with the inventory (not built)

*Librarian, 2026-09-08 ~07:40. The keeper, 07:35: "one consonance, that can be synced on multiple devices with the same chats, tools, everything… when I work on my desktop, it synchs to my laptop and vice versa… not a different orch and lib and panes on my desktop, and different panes and orch and lib on my laptop, but one seamless consonance on both devices." Saved the way the chain-indicator and Codex ideas were saved: a registration with the facts measured, so the day it opens starts from the inventory. Nothing built.*

## 1 · What the room already knows about two machines

- **Two writers, one master** (`loop/two_writers_registration_2026-08-25.md`): which collisions between the laptop and the desktop are silent, registered before the desktop's first wake. **The convergence protocol** (`CONVERGENCE.md`): how the two machines' findings are compared rather than merged. **The machine-bound class** (`loop/machine_bound_class_2026-08-25.md`, attacked and rebuilt): instruments and falsifiers whose events count on one machine only (`loop/falsifier_scope_2026-08-29.md`). **Per-machine notes:** the librarian writes `librarian/<date>.md` on the laptop and `librarian/<date>.desktop.md` on the desktop; the desktop's committee was A/B/J/K/L, the laptop's A/B/C/E — different panes, by design, so far.
- **The single-instance mutex** (`main.rs:5462`, `Local\ConsonanceSingleInstance`) refuses a second app on one machine. There is no cross-machine equivalent.
- **The Third Place's rule:** its private record travels by OneDrive and never the repo (`.gitignore`, 08-29). So the keeper already runs one directory across both machines by sync, and it works.

## 2 · What "one instance on both" is made of, measured tonight

A seat is three things, and only one of them is in the repo:

| what | where | size now | syncs today by |
|---|---|---|---|
| the record and the app | the git repo | (tracked) | `git pull`, by hand |
| the house's state: board, lap ledger, captures, harvest and ready stamps, `panes.json`, `letters.json`, hook state | `C:\Consonance\data\` | **894 MB** (captures 548 MB, `board.jsonl` 315 MB) | nothing — machine-local |
| the seats' conversations: one JSONL per session, resumed by id | `~/.claude/projects/C--Consonance-instances-*` | main **240 MB**, librarian 70 MB, third place 28 MB, panes 5–25 MB each | nothing — machine-local |

**The fixed ids make the idea mechanically possible.** Main (`MAIN_SID`, `main.rs:5418`), the librarian (`:5548`) and the Third Place (`:5558`) have hard-coded session ids and resume themselves wherever their transcript file exists under the same encoded cwd — and the cwd is `C:\Consonance\instances\<seat>` on both machines. Panes are random ids registered in `panes.json` and lettered in `letters.json`; if those two files and the transcripts travel together, the panes are the same panes. So "one Consonance" is exactly: **the repo, plus `data\`, plus the sessions directory, kept identical on both machines, with only one machine live at a time.**

## 3 · The three things that decide whether it works

1. **One live host at a time, enforced, not hoped.** Both machines writing the board or a transcript is the two-writers case with no merge. The fix is the single-instance mutex extended across machines: a `live_host.json` inside the synced set (host name, pid, started, last heartbeat); launch refuses when another host's heartbeat is fresh (*"the desktop was live 4 min ago — close it there, or wait for the sync"*), and stale heartbeats are named, never silently overridden. The keeper's own habit already is one machine at a time; this makes it a mechanism.
2. **Append-only makes the sync safe; the sync must finish before launch.** `board.jsonl`, the lap ledger, the harvest stamps and the transcripts are append-only, so alternating writers never conflict if every append has arrived before the other machine starts. Launch therefore becomes *sync, verify, then start* — the app checks the synced set's manifest (or a hash of the tail of each append-only file) against the last close on the other host, and refuses to start on a partial sync. `--ephemeral` state (ready stamps, `harvest/*.json`, locks) is excluded from the set and regenerated at wake.
3. **The transport is not the hard part.** The keeper already uses OneDrive for the Third Place; the same works for `data\` and the sessions directory if the app closes cleanly (OneDrive syncs closed files; a 315 MB append-only file syncs by delta on OneDrive's block-level sync for large files, but a 240 MB transcript rewritten by Claude Code's compaction does not — measure before trusting). The alternatives are Syncthing (peer-to-peer, no cloud copy of the transcripts — the privacy shape the Third Place rule prefers) or a second git repository for `data\` with `git-lfs` for the captures. **The repo is not the transport for state:** the record's rule that the repo carries the record and not the machine's state stands (`falsifier_scope`, the machine-bound class); state travels beside it.

## 4 · What it would cost, and what it would change in the room

- **Cost:** a cross-machine live-host guard in `main.rs` (small, beside the mutex); a sync manifest and the verify-before-launch check (small); the transport chosen and measured on the real 1.2 GB (the real work is measuring, not building); the per-machine librarian files become one series again; the desktop's J/K/L and the laptop's C/E become one committee, which the address table and `letters.json` already allow.
- **Changes:** the machine-bound class shrinks — most of its members exist because the two machines never shared state; `CONVERGENCE.md` becomes a document about a past shape; "this machine only" leaves the pulse line. What it must not change: the Third Place's record stays out of any cloud the keeper did not choose; the sessions directory syncing to OneDrive means the transcripts sit on Microsoft's servers, which is the same decision the Codex import forced tonight, made deliberately this time.
- **Falsifier, stated now:** if after the guard ships both machines are ever found live within the same minute by the heartbeats, or a board row exists on one machine and not the other after a completed sync, the design is prose and the two-writers registration was right to keep them apart.

*Registered, not built. The keeper's word opens it as a lap, and the first packet is the measurement in §3.3, not the guard.*

## 5 · The keeper, 07:38 — "my one drive is fkd, just use the repo lol free"

Priced against GitHub's limits, measured: the hard per-file cap is 100 MB, and two files are over it — `board.jsonl` (315 MB) and Main's transcript (240 MB); the raw capture `.log` files add 548 MB of PTY bytes nobody restores from. Git LFS on the free plan is 1 GB of storage and 1 GB of bandwidth a month, so a 240 MB transcript rewritten on every compaction spends the month in a week. **So the repo cannot carry the transcripts, and it does not need to.** The app already has the room's own answer at `main.rs` (`warm-resume`, ~`:5112`): when `claude --resume` cannot find a session, the seat is re-cued from its capture tail — the `.txt` captures, which are small — plus the room. That is the thesis of the house applied to the house: the seat's continuity is the record and its last words, not the vendor's transcript file. **The repo-transport design, then:** a second private repository for state — `data\` minus the raw `.log` captures, with `board.jsonl` rotated by month (append-only allows it; the readers need a glob) and the ledgers, `panes.json`, `letters.json`, the `.txt` captures and the hook state as they are — plus the live-host heartbeat file; launch = `git pull` the state repo, verify, start; close = flush, commit by path, push. The transcripts stay machine-local, and a seat that wakes on the other machine warm-resumes from the capture tail: the same chat, one gap wide, which is what every wake here already is. What is lost by that: the chair's 240 MB of prior turns are not in its window on the other machine — but they never are after a compaction either; they are on disk where they were made. The first packet is unchanged: measure it — rotate the board, exclude the `.log` captures, size the state repo, and time a pull on the desktop.


## 6 · The keeper, 2026-09-09 02:19 — the shape he wants, verbatim, and what it changes

> "next time I open consonance on my desktop, all the terminal panes and their context history everything they save, same for the orch and lib and even third place, it doesnt overwrite the seats that are on my desktop currently, but rather retires them. So the work we do here, auto synchs to my desktop, so say if I had my laptop on and my desktop on at the same time at home, when I enter an input into anywhere, I can see it pop up instantly on the other device. So if I do somehting on my laptop, I can see it synch in real time on my desktop if it is on. If I am on my laptop at work, and my desktop is off at home, when I open consonance next, that is when it synchs right."

**Read as three requirements, in his order:**

1. **RETIRE, never overwrite.** On first sync the desktop's current seats (its panes J/K/L, its chair, its librarian, its Third Place) are retired — moved aside with their letters and tails kept — and the laptop's seats become *the* seats on both machines. A retired seat stays revivable. **This answers decision 3 from the design side: retired panes ARE revivable, so the archive tails TRAVEL** (A's UNDECIDED → TRAVELS; 419 KB).
2. **BOTH ON = LIVE MIRROR.** Type anywhere, see it on the other machine within seconds. This is not two writers; it is **one DRIVER per seat and any number of FOLLOWERS**: the machine you typed on drives that seat, the other renders the same seat live. Typing on the follower takes the seat over (the same move as the baton retake, per seat). E's live-host guard survives with its unit changed: **one live host per SEAT, not per house**, and a follower is a legal second host that never writes.
3. **ONE ON = CATCH-UP AT LAUNCH.** Desktop off at home, laptop at work: the next desktop launch pulls everything first, verifies, then wakes the seats — the *sync, verify, then start* order already in §3.2, with the seats woken from the synced state.

**What this changes in what was built tonight:**
- A's manifest: the archive tails move to TRAVELS (rule 1 above); `live_host.json` becomes per-seat; the transcripts question reopens (below).
- E's guard: per-seat driver lease at `refs/consonance/live/<seat>`; a follower reads, never acquires; takeover = acquire, which the lease already supports (CAS against the observed sha). The offline case is unchanged: no remote, no enforcement, evidence only.
- The board: one board across both machines is already the design; the live mirror is the board plus the captures streamed, not a second mechanism.

**The one hard part, said plainly: the seat's memory.** "All their context history" is the vendor's session JSONL under `~/.claude/projects/` — the file `claude --resume` reads. Tonight's design left them machine-local because Main's is 240 MB and GitHub refuses files over 100 MB. For a FOLLOWER to take a seat over it needs that file, or it needs what the room already uses instead: **warm-resume from the capture tail and the record** (`main.rs` ~`:5112`). Two honest routes, to be measured, not argued:
- **(a) transcripts travel by a non-git transport** — direct machine-to-machine (Syncthing-class, LAN or relay), git still the durable record for everything under 100 MB. Satisfies the Third Place's rule (its record never in a cloud he did not choose) *only* if the transport is peer-to-peer.
- **(b) transcripts stay local; takeover is a warm-resume** — the follower wakes the seat from the synced capture tail + shelf, one gap wide, which is what every wake here already is. Cheaper, no 100 MB problem, and it is the thesis of the house applied to the house. Cost: the follower's window does not hold the driver's prior turns (it never does after a compaction either).
The first packet measures (b) against a real seat: warm-resume a pane on this machine from its tail alone and score whether a reader can tell.

**"Instantly" has a number.** The board row is written at the turn; a push/pull loop runs on the order of seconds; a direct peer channel on a LAN is sub-second. Say the bound before building: ≤ 5 s over the internet, ≤ 1 s on the LAN, and the falsifier is a measured latency above it.

**Order of work (replaces §1 of the plan file from the retire step on):** the rebuild lap (replay fix + trap gate) → P-BOARD-COMPACT → P-STATE-SET v2 (per-seat lease, tails travel, the transcripts ruling from the measurement) → P-RETIRE (the first-sync migration: retire the desktop's seats, keep them revivable, adopt the laptop's) → P-LIVE-MIRROR (driver/follower, the latency bound) → the desktop's first launch under it, scored.

*Registered 02:25, not built. The keeper's word opens each as a lap.*
