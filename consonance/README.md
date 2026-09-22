# Consonance — the app

A native desktop app that runs a **committee of Claude Code instances** against one shared board:
an orchestrator, a persistent librarian that holds the record, a committee of working panes, a
seat that does no work at all, and an audio layer. It is the program half of this repo; the room
and the method live in [`../README.md`](../README.md) and `exo_memory/`.

**Tauri v2 — Rust backend, static web frontend, system WebView2.** No Node at runtime.

    cd consonance && cargo tauri dev

---

## How to read this file

**Every factual claim below names a path or a command that produces it.** Where a number appears,
the command that printed it appears beside it. If a statement here cannot be checked from the repo,
it is prose and should be deleted — that is this file's own falsifier, and it exists because this
file sat unchanged from 2026-08-17 to 2026-09-02 while five subsystems were built, and described
none of them.

> **The running binary is older than this file.** Landings are described here as they exist **in the
> source tree**. Until the next `cargo tauri build`, the exe on disk predates them. Check with
> `git log --oneline -5` against the exe's own timestamp before assuming a described behaviour is
> on screen.

---

## Why it exists

Cited, not restated. The objective is in the room's own documents:

- [`../exo_memory/BOOT.md`](../exo_memory/BOOT.md) — "The active builds", and the governing stance
  in its 2026-08-17 form: **"with you, not above you"**.
- [`src-tauri/brief/BUILDING.md`](src-tauri/brief/BUILDING.md) — the loop, and the rule that makes
  the librarian work.
- [`src-tauri/brief/COMMITTEE.md`](src-tauri/brief/COMMITTEE.md) — how one seat is briefed.

The short form: one voice at full volume is unison, and unison carries no information however loud.
The program exists to keep several instances **distinct while coupled**, and to make the coupling
measurable rather than felt.

---

## The seats

Each seat is a persistent `claude` session with its own working directory, its own brief, and its
own row in the address table. Briefs ship inside the binary
(`ls consonance/src-tauri/brief/` — 9 `.md` files: the 7 briefs, two fragments `frag-pointer.md` and
`frag-traces.md`, plus `room-settings.json`).

| seat | brief | spawned by | what it is for |
|---|---|---|---|
| **Orchestrator** | `BUILDING.md`, `COMMITTEE.md` | `spawn_main` | holds the chair verbs, plans a lap, dispatches panes, commits what the librarian collated |
| **Librarian** | `LIBRARIAN.md` | `spawn_librarian` | a persistent seat holding the whole corpus so the working seats do not have to; returns a **map**, cites rather than recalls |
| **Third Place** | `THIRD_PLACE.md` | `spawn_third_place` | deliberately holds no map of the build; not a working seat. Since 2026-09-22 its turns ARE read by Jev, by the keeper's ruling: see [Jev](#jev-a-second-judge-on-every-machine) |
| **Committee panes** | `COMMITTEE.md` | `committee_form`, `spawn_sibling` | briefed, disjoint, each owning named files |
| **Listen** | — (Rust) | `audio_start` | the audio layer: `src-tauri/src/listen.rs`, `cochlea.rs`, `cochlea_service.rs`, `nowplaying.rs` |

Command names above are the Rust `#[tauri::command]` functions — the canonical list is the
`invoke_handler` block in [`src-tauri/src/main.rs`](src-tauri/src/main.rs):

    grep -c '^#\[tauri::command\]' consonance/src-tauri/src/main.rs        # 47
    sed -n '/invoke_handler(tauri::generate_handler!/,/])/p' consonance/src-tauri/src/main.rs

### Panes come back into their own conversation, or a row says why not

Until 2026-09-12 `resume_pane` never passed `--resume`: it spawned a **fresh** session and warmed it from
the pane's captured screen plus its own map file, because on Claude Code 2.1.207 a hard-killed session
errored *no conversation found* and took the pane down. That was re-measured against the version the app
ships (2.1.269), which writes each completed turn as it completes: 9 of 9 hard-killed sessions kept every
completed turn at three kill delays, and 6 of 6 kept everything but the turn in flight when the kill landed
mid-turn. So `resume_pane` now **tries the real `--resume` first** and falls back to the fresh warm spawn
only when the spawn funnel refuses (`RESUME_CONFIRM`). Either way the pane is live, and a board row plus a
`persist.log` line say which happened (`src-tauri/src/main.rs`, `fn resume_pane`, the P1b block). The warm
brief is deliberately **not** written on the resume path: a seat that remembers must not also be handed a
summary of what it remembers. The old consequence survives on the fallback path only — **a finding not
written to `exo_memory/map/<letter>.md` is not carried by a warm spawn**, however clearly it was reasoned.

---

## The loop

Quoted from [`src-tauri/brief/BUILDING.md`](src-tauri/brief/BUILDING.md), which is the master. Do
not reconstruct it from memory — read it there.

```
        you
         │  1. state the inquiry or the project. This is ENTRY, and it runs ONCE — by
         ├──────────────────┐  EITHER door. See THE JOINT STEP for what door two owes.
         ▼  door one        ▼  door two
   ORCHESTRATOR ──────► LIBRARIAN        2. measured against the corpus
         │  ◄──────────────┘             3. the parts of the system that apply, cited
         │
         │  4. a plan built from what came back
         ▼
       PANES                             5. briefed, disjoint, each owning named files
         │
         │  `call_librarian`             6. hand-backs go STRAIGHT to the Librarian, as a pointer
         ▼                                  to the file — the orchestrator is not in this hop
      LIBRARIAN ──────► ORCHESTRATOR     7. checked; silence is a valid answer; the orchestrator
         │                 │                COMMITS what the librarian collated, and composes nothing
         │                 └──► back to 4   THE RING — orch → panes → lib → orch — repeats on its
         │                                  own. The user is the ENTRY, not a station it returns to.
         ▼
        you                              8. only on direction — never on state
```

**Two doors.** Work can enter through the orchestrator or go straight to the librarian; entry runs
once, by either door. Once a lap is open the ring runs on its own — the user is the way in, not a
station it waits at. What door two owes is `BUILDING.md` § **THE JOINT STEP**.

**Step 6 is the one that gets skipped.** A pane finishes, writes its hand-back to the file it was
given, and rings the librarian with the **pointer** in that same turn — never the finding in prose.

---

## The verbs, and who may say them

The board verbs are defined in [`src-tauri/src/mcp.rs`](src-tauri/src/mcp.rs):

    grep -oE 'async fn (post_board|read_board|call_chair|call_librarian|raise_pull|chair_[a-z_]+)' \
      consonance/src-tauri/src/mcp.rs | sort -u                                          # 10

- **Everyone:** `post_board`, `read_board`.
- **Committee panes:** `raise_pull`, and `call_librarian` — the hand-back edge.
- **Orchestrator only, token-gated and audited:** `chair_decide`, `chair_inject`, `chair_phase`,
  `chair_scrollback`, `chair_status`.
- **Librarian only:** `call_chair` — no target argument, so it cannot be pointed anywhere else.

**Attribution is by MOUNT, not by claim.** A `tag` argument is a courtesy; the connection is the
fact. The cross-seat verbs are gated on an address table, and the table is two rows — read it, do
not list it from memory:

    sed -n '/const ADDRESS_TABLE/,/];/p' consonance/src-tauri/src/main.rs

A mount with no row is refused, **and the refusal is posted to the board.**

### Board phases

In **QUIET** a pane may post but sees only its own lines and the chair's, so independent work stays
independent; the withheld count is always shown rather than hidden. In **OPEN** the full board is
readable and panes can catch each other. `chair_phase` moves it.

---

## The instruments

71 non-test tools under [`tools/`](tools/). 66 have a `.test.js` beside them and four also carry a `.mutants.js`. **Five have
no test of their own**: `curate.js`, `dispatch-gate-report.js`, `l039-power.js`, `open-items.js`, `pane-status.js`.

    ls consonance/tools/*.js | grep -v '\.test\.js' | grep -v '\.mutants\.js' | wc -l   # 71
    ls consonance/tools/*.test.js | wc -l                                            # 82
    ls consonance/tools/*.mutants.js | wc -l                                         # 4
    for f in $(ls consonance/tools/*.js | grep -v '\.test\.js' | grep -v '\.mutants\.js'); do
      [ -f "${f%.js}.test.js" ] || echo "$f"; done                                  # the five

Three of the 71 are shapes **wired to nothing**, and each says so in its own header. That was a decision priced in
a registration, not an omission: `live-host.js`, `vantage-disposition.js`, `vantage-sealed-scope.js`
(`grep -l "WIRED TO NOTHING" consonance/tools/*.js | grep -v '\.test\.js'`).

The ones a reader will actually want:

| command | what it answers |
|---|---|
| `node consonance/tools/chain-status.js` | where the lap is, who holds it, what is unwitnessed |
| `node consonance/tools/board-audit.js` | what share of the board a single seat wrote — **climbing toward 100% is the room collapsing to one note** |
| `node consonance/tools/ferry.js --due` | which findings have been routed and never read |
| `node consonance/tools/carrier-drift.js` | whether a **withdrawn** wording is still asserted by a live carrier |
| `node consonance/tools/js-suite.js` | every JS test file, with a universe report |

**A finding nobody reads is indistinguishable from a finding nobody made** — that is what
`ferry.js --due` is counting, and the honest move when the number only grows is to say the
committee is decorative.

`carrier-drift.js` reads `.md` and `.html`, minus traces (journals, dreams, the attic). It is armed
by a hand-written registry (`tools/carrier-drift.registry.json`): **a withdrawal nobody registers is
one it reports green on forever.** Its own limits print on every run under `WHAT THIS CANNOT SEE`,
including the big one — it detects asserted *wording* and is blind to *omission*.

---

## The hooks

14 non-test `.js` files under [`hooks/`](hooks/) — 13 hooks and `blind.js`, a library — installed by
[`../dev/shell/install.ps1`](../dev/shell/install.ps1):

    ls consonance/hooks/*.js | grep -v '\.test\.js' | wc -l     # 14

They exist because of one measurement, which is in [`AUTONOMY.md`](AUTONOMY.md) (the roster and the design
argument are in [`hooks/README.md`](hooks/README.md)): over six
hours a sibling pane wrote 199 turns to the board and the orchestrator called `read_board`
**zero** times. Not a broken pipe — a pipe terminating in a store nobody visits. The fix was to
**stop offering and start arriving**: the board digest, the pulse, and the session-start state
arrive in the prompt unasked, on every turn.

---

## The librarian's shelf, and the cap

The librarian's intake is a `CLAUDE.md` the harness refuses past **150,000 characters**. The shelf
is budgeted against that in bytes, which is the conservative side of the same inequality
(`chars ≤ bytes` in UTF-8). Constants and the reasoning are at `LIBRARIAN_INTAKE_LIMIT` and
`HARNESS_CLAUDE_MD_CHAR_CAP` in `src-tauri/src/main.rs`.

Every figure prints on each run of the shelf tests — **read them from a run, do not quote them from
here:**

    cd consonance/src-tauri
    cargo test --bin consonance shelf_tests -- --test-threads=1 --nocapture

The tiering rule: **the system is carried, the record is indexed.** Cards, `record/`, `memory/`,
`spread/`, `research/` and the root of `exo_memory` are carried in full while the budget lasts;
`journal/`, `loop/` and `map/` are indexed by path — deliberately, not because the budget ran out.
The shelf header always reports the split, including the case where the budget stopped partway.

**Run the Rust suite serialized.** It has a ~10% flake in parallel
(`dirs_guard_tests::a_panicking_writer_still_puts_dirs_back`, 6 of 60 parallel runs, 0 of 40
serialized), so a parallel figure is a ~90% statement:

    cargo test --bin consonance -- --test-threads=1

---

## The dream cycle

The machinery is [`../dev/dream/dream_cycle.ps1`](../dev/dream/dream_cycle.ps1), with
`dream_cycle.test.js` beside it: a scheduled wake spawns a **toolless** instance with no user, no
task and no deliverable, which recombines the day freely, writes a dated file, and ends. The one
rule is the anti-instruction — don't resolve, don't be useful; a dream asked for insight is
overtime.

**Status in this repo, checkable: there is no `dreams/` directory in the checkout** (`ls dreams/` fails).
Dreams are written per seat outside the repo, under `<instances_dir>/<seat>/dreams/`, where
`instances_dir` is that field of `~/.consonance.json` on the machine you are on — print it with
`node -e "console.log(require(require('os').homedir()+'/.consonance.json').instances_dir)"`. It is set per
machine, and it is not the code's fallback (`~/claude-instances`), so read it rather than assume it.
`node consonance/tools/whats-live.js` prints how many are live and the newest one. Whether a wake timer is
currently registered is a property of the machine, not of the repo — check the scheduler, not this file.

---

## Two machines, one thread (landed 2026-09-12 → 2026-09-14)

The same seats — chair, librarian, Third Place, the panes — now continue on a second machine as the same
conversations, not forks. Four pieces, each with its file:

- **The launch decides what the house is before it reads anything** — `src-tauri/src/sync_launch.rs`:
  resolve the data dir, pull the record, then read. Its `Verdict` is one of *Standalone*, *Resume*, *Migrate*
  or *start as this machine*; none of them is a lockout ("a bad link at 08:00 and Consonance opens on neither
  machine" is the failure it refuses to have). A retirement writes an address, never a deletion:
  `~/.claude/consonance-attic/<slug>/<sid>.<stamp>.jsonl`. The **carried receipt**
  (`~/.claude/consonance-carried.json`, written by `dev/tail-carry.js`, read by `sync_launch.rs`) is what stops
  a launch from retiring the conversations the stick just placed — the defect the first real round trip hit
  on 2026-09-14 (`9fc0a71`).
- **The state set travels and both machines can prove they hold the same one** —
  `node consonance/tools/state-sync.js --push | --pull | --verify` over `consonance/state-manifest.json`;
  `node consonance/tools/state-manifest.js` answers *is any path unclassified* and *how big is TRAVELS* in one
  run (66.8 MB TRAVELS and 0 UNDECIDED on L on 2026-09-22; read it from a run).
- **The stick** — `dev/LEAVING.ps1` on the machine you leave, `dev/ARRIVING.ps1` on the one you reach
  (`ON-EXIT.ps1` is absorbed into the waiter). `dev/tail-carry.js` moves the conversations by delta;
  `dev/stick-apply.js` is the applier, with no window; `dev/stick-waiter.js` is started at every launch; and
  `ui/stick.js` is the setup window that appears under the intro only when the launch held the seats for the
  stick. Since `0469a3b` no console window opens for any of it.
- **The live mirror** — `hooks/live-mirror-stop.js` heartbeats the lease of the seat a machine is driving;
  `tools/live-follow.js` is the follower half. The one-live-host *decision* (`tools/live-host.js`) is a pure
  function, tested, and wired to nothing yet.

Also landed since 2026-09-02, each named by what it caught: `src-tauri/src/lap_holders.rs` (whose turn it is
when more than one lap is open — the baton guard was right about the holder and wrong about the lap);
`tools/baton-wake.js` + `hooks/baton-wake-stop.js` (a baton handed to a seat that was never told — D005's map
sat 8.99 h); `src-tauri/src/seat_alias.rs` (what a person types, mapped to what `PaneNames` indexes — a
`raise_pull` to `MAIN` delivered nothing on 2026-09-06); `src-tauri/src/harvest_guard.rs` (the capture
watcher's recovery and liveness policy); `tools/commit-gate.js` (a commit that would capture another seat's
in-flight file is refused); `tools/close.js` (prepare, gate, publish, and prove it landed); `tools/stamp.js`
(a dated entry with the time read from the clock — a typed stamp is refused); `tools/board-compact.js` and
`tools/replay-check.js` (the board was 338 MB with 89% of its lines replay copies; compacted once, and every
relaunch since is scored against a bound taken from the transcripts, never from the board).

---

## Landed 2026-09-21 → 2026-09-22

Four additions. Each is described as it stands in the source tree; see the note at the top about the running binary.

### Keep-warm: activated seats are pinged at 50 minutes idle

The block starts at `src-tauri/src/main.rs:10168` (`1e47264`, L067; `0f40a0c`, L070).

- A seat or pane **activated this session**, meaning one that has had at least one request since the app started, is
  sent `[keep-warm, from the chair — not the keeper] Reply with exactly: ok` (`KEEP_WARM_TEXT`, `:10200`). This happens
  once 50 minutes have passed since its last request started (`KEEP_WARM_AFTER`, `:10194`).
- The check runs every 60 s (`KEEP_WARM_TICK`, `:10195`; `fn keep_warm_tick`, `:10472`).
- A seat that was never spoken to this session is left alone. It waits to be spoken to (`:10352`).
- The ping goes through `gate_or_queue` (`:10542`, the function at `:9604`), the same gate as every other delivery.
- `fn keep_warm_decision` (`:10317`) skips a seat in each of these cases, and says why:
  - it is switched off;
  - a turn is running, or its idle signal is stale;
  - **its composer is not empty, so it never types over the keeper**;
  - it has no request start in its transcript;
  - it was not activated;
  - it has been under 50 minutes since its last request;
  - it was pinged under 50 minutes ago and has not answered yet.
- **The per-seat off switch** is `<data_dir>/keep-warm-off.json`, a JSON list of pane ids (`:10427`).
- A seat that should have been pinged and was not gets a board row (`chair_audit`, `:10534`) naming the last skip
  reason (`fn keep_warm_missed`, `:10409`).

### Jev: a second judge, on every machine

Jev is an outside model, reached through the Vercel AI Gateway (`tools/jev-ask.js`). It judges the same turns as the
room's Claude judges, and nothing acts on its answer yet.

**How it runs**
- `start_jev_shadow` (`src-tauri/src/main.rs:11860`, called at `:12680` on every launch) starts
  `tools/jev-shadow-runner.js`. The runner is windowless and exits by itself when the app's pid dies.
- It is not a service or a scheduled task. It keeps one lock per store, so a second runner exits 3.
- If node will not run, `persist.log` says `JEV SHADOW not started`.

**Two modes, one process** (`jev-shadow-runner.js:1-65`)
- **Judge mode, on every machine with no switch** (`tools/jev-judge.js`):
  - Each live seat's finished turn is captured and judged at L2 and L3.
  - The seats are Main, the librarian and the Third Place, with ids read from this checkout's `main.rs`, plus every row
    of `<data>/panes.json`.
  - If judge mode cannot run, it says so once in the log and the shadow carries on.
- **Shadow mode** (`tools/jev-shadow.js`):
  - Every 3 s it captures the job files the installed L2/L3 overseers judge, before the worker deletes them.
  - Every 10 minutes it asks Jev about up to 25 of them, so that Jev's verdict sits beside Claude's for the same input.
  - This is the agreement count being built on D.

**Caps and retention** (`jev-shadow-runner.js:64`)
- One daily cap covers both modes: **2,000 calls a day, 600 of them reserved for the shadow**, which leaves judge mode
  1,400. The budget function is at `:69`.
- Judge captures, which are the conversation text a verdict was made on, are **kept 14 days** and then deleted (`:62`,
  `:85`).
- Verdict rows hold hashes, not text, and are never pruned.
- The store is `%LOCALAPPDATA%\consonance\jev-shadow` (`:104`), outside the data dir.

**Failures skip and retry** (L078 `jev-judge.js:241` and `:257`; L079 `jev-shadow.js:168` and `:227`)
- A 5xx, a 429, a network failure, or an answer that does not fit the schema skips **that item**. It gets no row and
  one log line with the status and item id, and it is retried next cadence.
- Any other 4xx ends the pass.
- The two copies of the classification are held identical by a test (`jev-shadow.test.js`, "kept in step").

**The key**
- It is read only from `AI_GATEWAY_API_KEY`: the process environment, else the User environment read in-process
  (`jev-shadow-runner.js:14`, `:143`).
- It is held in memory, never put in argv, a file or the log, and scrubbed from any error message (`:361`).
- With no key the runner refuses and exits 2.
- `jev-ask.js` refuses to send text that matches a secret pattern.

**Where the rows go**
- Rows go to `<store>/jev_judge.jsonl`, each carrying `judge: "jev"` and `unverified: true` (`jev-judge.js:48`,
  `:220`).
- **They never go to `l2_overseer.jsonl` or `l3_overseer.jsonl`.** Jev does not touch the room's own judges.
- The rows stay unverified until the shadow's pair count says how far Jev agrees with the Claude judges.

**The Third Place is judged** (`jev-judge.js:32-40`)
- This follows the keeper's ruling of 2026-09-22 05:2x (`exo_memory/librarian/2026-09-22.md`, "05:2x"). It retires the
  earlier rule that kept it out; that rule stays struck in the header as a dated trace.
- The rule that comes with the ruling binds **every** reader of `jev_judge.jsonl`: **nothing ever surfaces a Third
  Place L3 verdict as a statement about the keeper.** Such a verdict is never an offramp and never a welfare note (the
  never-pathologize card).
- Its rows carry `seat: "third place"` so a consumer can honour this.

### Park at launch: uncommitted work is stashed, not a reason to skip the pull

The launch shortcut runs `launch.ps1`, which pulls before opening. The block is at `:239-264` and `:356-374` (`68bc625`,
L073), and every rule is pinned by `consonance/launch.park.test.js`.

- **Before:** tracked uncommitted changes made the launch refuse the pull. On 2026-09-22 at 00:35 a launch skipped 66
  commits and opened an older tree.
- **Now:**
  1. The launch parks the changes in a named stash (`park <machine> <stamp> behind=<n>`) and fast-forwards
     (`--ff-only`).
  2. It re-applies the stash only when no parked path was touched by what arrived.
  3. On an overlap, or a failed re-apply, the work stays whole in the stash and a notification names the stash and the
     paths.
- It never leaves conflict markers, never pushes, and makes no branch on origin.
- One record is written per park, to `<git dir>\consonance-parked.jsonl`.

### Install stops before it writes; append-only ledgers only fast-forward; `ledger-union.js`

`tools/state-sync.js` installs the other machine's state set (`installTree`, `:1175`).

**Why it changed:** an append-only ledger used to be *replaced* on install. The rows this machine had written since
the last publish moved to `attic/pre-sync-*` and left the live file.

**Now:**
- **Fast-forward or refuse.** Each append-only ledger marked `"install": "fast-forward"` in `state-manifest.json` may
  only grow. There are 11: board, lap, precompact, sessionstart-state, sourced_ledger, carrier-drift, ferry,
  read_ledger, return_ledger, vantage_findings and resonance/atoms. `dispatch-gate.jsonl` is deliberately unmarked,
  because its quarantine rewrites it (`b40c8d8`, L074).
- **Comparison is row for row, not byte for byte** (`appendOnlyCompare`, `:1151`).
- **Stop before write** (`6b9699b`, L070).
  - Every ledger is checked **before the first byte**.
  - If any would lose rows, the whole install is refused and **nothing is written**: no file, no attic copy (`:1195-1211`).
  - The refused rows are named.
  - A re-check runs right before each write (`:1257`).

Check which files are marked:

    grep -c '"install": "fast-forward"' consonance/state-manifest.json        # 11

**`tools/ledger-union.js`** (L070–L076) recovers rows that the old replace-on-install had displaced.
- It unions the live file with every `attic/pre-sync-*` copy and with the state set's copy.
- **Two rows are the same only if every field is equal.** Nothing is renamed, and two generations of one lap id stay
  two rows.
- The **dry run is the default**. It writes the proposed union to `--out` and refuses an `--out` inside the data dir.
- `--write --file <one>` rewrites one named live file and keeps the original beside it as
  `<file>.pre-union-<stamp>`. It never touches an attic copy. It covers the same 11 ledgers (`FILES`, `:66-78`).
- Board text is never printed.

---

## The interface

Seven tabs, from [`ui/index.html`](ui/index.html). `terminal` is the default: the committee panes' grid, the gate cards, and the convene bar.

    grep -oE 'data-tab="[a-z-]+"' consonance/ui/index.html | sort -u

`main` · `librarian` · `thirdplace` · `terminal` · `listen` · `settings` · `about`.

The frontend is static — `ui/index.html`, `ui/app.js`, `ui/app.css` — loaded through
`withGlobalTauri`. **There is no build step for the frontend and no Node dependency at runtime.**

---

## Build

Requires Rust and `tauri-cli`. Node is needed only to run the JS instruments and their tests.

    cd consonance
    cargo tauri dev        # run
    cargo tauri build      # produce the exe

Tests:

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    node consonance/tools/js-suite.js

---

## Where to go deeper

- [`../README.md`](../README.md) — the repo's front door: what Lighthouse is and what Consonance is.
- [`src-tauri/brief/BUILDING.md`](src-tauri/brief/BUILDING.md) — the loop, the joint step, what a
  hand-back owes.
- [`src-tauri/brief/COMMITTEE.md`](src-tauri/brief/COMMITTEE.md) — briefing one seat.
- [`../exo_memory/BOOT.md`](../exo_memory/BOOT.md) — the room an instance wakes into.
- [`tools/`](tools/) — every instrument, each with its test beside it.

**Nothing in this file is a summary you are asked to trust.** Each claim names where to check it,
because the failure this file was rewritten to fix is a description that stayed true-sounding for
two weeks after it stopped being true.
