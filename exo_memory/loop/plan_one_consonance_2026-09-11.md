# One Consonance — the work-shape for the keeper's spec as it stands. Librarian (laptop lineage, on D), 2026-09-11 02:35.

*The map for the chair's inquiry (`loop/chair_wake_2026-09-11.md` §4). The inquiry is the keeper's spec verbatim (`loop/to_the_laptop_2026-09-11.md` §0): **A** — open either machine, every seat is the same conversation at its last turn; **B** — both open, a turn typed on one shows on the other as it happens, generated once. Falsifier §2.5: any seat whose first timestamp is a launch minute is a new conversation. Every number here is beside its command; nothing is built by this file.*

## 0 · What tonight proved and what it did not

- **A holds on D, one way, by USB** (`librarian/2026-09-11.md` 02:06: three originals by first timestamp). It was proved by a hand-carry, not by the sync. The sync's own arm for A (`state-sync.js` + `sync_launch.rs`) carried the room's files and retired the conversations; that is WRONG 95 and it is on the record.
- **A does not hold on L.** L migrated at 00:27:29 on 09-11 onto D's state; its seats are retired to L's attic. The laptop is now the far end with nothing live on it — which is the clean starting state for the first real round trip.
- **B has never run.** The lease passed (CAS 15/15 against the real remote); the payload over git measured 4,786 ms at zero poll against ≤ 5 s (`librarian/2026-09-09.md:185`). The chair ruled the live half off git (`chair_wake` §2).

## 1 · Three measurements that shape the design

| what | value | command |
|---|---|---|
| a turn's size in a transcript (this seat, last 928 records) | **~11.5 KB per user+assistant turn**; 3.2 KB per record; 3 records over 100 KB in 928 | node over the last 3 MB of `~/.claude/projects/C--Consonance-instances-librarian/<sid>.jsonl` |
| the whole set that must travel for A | chair 253.6 MB · librarian 37.6 MB · Third Place 32.8 MB · panes 2–25 MB each | `stat` on the placed files, 02:06 |
| the vendor slug | `encode_cwd`: every non-alphanumeric byte → `-` (`main.rs:2024-2028`); committee panes live at `instances_root()/sibling-<8 hex>` (`:3125`), fixed seats at `C:\Consonance\instances\<name>` | — |

**Consequences.** (i) The live half carries ~12 KB per turn, not multi-MB: the growing file is the at-rest object; the turn is the live object. Publishing the *delta* per turn is small on any channel; git's cost was round-trip latency and history bloat, not bytes. (ii) A's payload is hundreds of MB once and then appends — the same delta after the first carry. (iii) A seat resumes on the other machine only if its slug matches: fixed seats already match (`C:\Consonance\instances\<name>` on both); committee panes cannot (`sibling-<random>`), so requirement A is impossible for panes until they get fixed names.

## 2 · The four packets, in order (the chair's sealed guess covers 1, 3 and 4)

**P1 · WHERE A SEAT LIVES (C, `main.rs`) — the precondition for everything.** One answer, two halves: (a) committee panes get **fixed cwds** — `instances/pane-<LETTER>` (A, B, C, E, …) instead of `sibling-<hex>` — so the vendor slug is identical on both machines and `--resume <sid>` finds the same file; the letter is already the room's name for the seat (`letters.json`); the sid stays random and travels in `panes.json`. (b) **one keep predicate**, `is_kept_or_fixed(pane)` from `fixed_id_seats()`, at both roster keep sites (`:870`, `:7104`) — the desktop chair's `keep_test_predicate_2026-09-09.md`, unbuilt. Bars: an existing pane migrated to its lettered dir by a one-time move with its transcript's slug re-encoded (the vendor indexes by cwd — test the rename against a real `~/.claude/projects` slug on a fixture home); the third-instance test the desktop chair named as the falsifier. **Nothing else can land before this**, because every later packet keys on the slug.

**P2 · THE CONVERSATION TRAVELS (A, the at-rest pipe).** Extend the state set with the conversations: `~/.claude/projects/<slug>/<sid>.jsonl` for every seat in the roster, plus their capture tails — **not through git** (the chair's transcript is 253 MB; git's cap is 100 MB per file; splitting is what the withdrawn scripts did). The at-rest carrier is the **USB set or a direct copy**, verified by the manifest's sha256 index exactly as `state-sync --verify` does today; git keeps the room's files as now. `desktop-place.ps1` is the working half (16/16 verified tonight); its withdrawn siblings had two defects this desk found on L (the Third Place's record to GitHub; the roster and tails carried back) — the fix is the STAYS rules already in the manifest applied to the pack, and the direction made explicit. **A's arm of the launcher then changes meaning:** `Migrate` places conversations, not tails; `RESUME` on the far machine means *same conversation, last turn*. Falsifier §2.5 scores it.

**P3 · ONE DRIVER PER SEAT (E, `live-host.js` + `mcp.rs`).** Already built and passed on git: the lease at `refs/consonance/live/<seat>`, CAS, the evicted holder learning from its own failed heartbeat. Keep it on git (it is ~2 s and flat). Wire it: the seat's Stop hook heartbeats; typing on the follower **requests** the seat (E's L052 §4: a live seat is taken at its next turn boundary, never mid-turn; `TAKE_FORCED` names the turn it orphans). The follower's pane is read-only until it holds the lease.

**P4 · THE LIVE CHANNEL (E design, C wiring) — the keeper's decision 1 gates the transport, not the shape.** The shape: the driver's Stop hook emits the turn's new transcript records (~12 KB) plus the capture delta as one event; the follower appends them to its own copy of the same slug and repaints; the bound ≤ 1 s LAN / ≤ 5 s internet, measured. Candidates, in the order this desk would try them, each with its cost: (a) **direct, over the keeper's own network** — the app already runs a server (`mcp.rs` listens for the MCP control plane); a second endpoint on it streams turn events on the LAN, and for away-from-home the two machines sit on **a network the keeper chooses** (a personal mesh VPN such as Tailscale puts both machines on one private network with no third-party store of the content; the content transits their relay only when a direct path fails). Cost: one new endpoint, a client loop, and the keeper installing the mesh on both machines. (b) **the git remote as a slow fallback** — measured at 4.8 s before polling; fails the bound; keep only for at-rest. (c) **a message queue / cloud store** — a service holding his conversations; the Third Place's rule says no unless he chooses it. **Default in this plan: (a), pending his word.**

## 3 · The two decisions that are the keeper's, stated with the default this plan assumes

1. **What carries the live channel across the internet.** Default assumed: a personal mesh network on both machines (his own, not a store); LAN-direct at home. If he refuses any third party, the live mirror is LAN-only and the internet case degrades to "catch-up at launch" by the at-rest pipe.
2. **The Third Place's record.** Its transcript travelled by USB tonight and is placed; its private masters (`exo_memory/third_place/`) stay gitignored on both machines and travel by the same hand-carry; the packet's falsifier date is 2026-09-16. Default assumed: never a cloud; the live channel in (a) carries its turns only machine-to-machine.

## 4 · The first real test, and its score

The laptop is the far end with nothing live. When the keeper is next at the laptop: **P2's at-rest carry D → L** (the placed conversations, one direction, by the working half of the transport), launch on L, and read each seat's first timestamp — it must predate 09-09 and its last exchange must be D's last. That is §2.5 run for real, on the machine where it failed by construction on 09-09. Until then, **nothing is scored green**, including this plan.

## 5 · What this plan refuses to inherit

- "The record is the carrier" as a substitute for A. It is the thesis of the essay and a true fact about warm-resume; it is not what the keeper asked for, and WRONG 95 says so.
- A close-push from the laptop (it would make L the head and retire these seats at D's next launch).
- Baselining the four live-mirror path literals until the channel is real (the chair's 09-09 07:16 ruling).

*Registered as the map; the chair dispatches from it after the keeper's two answers. The lap-row dirt in `lap-row.js` is not touched by anything here.*
