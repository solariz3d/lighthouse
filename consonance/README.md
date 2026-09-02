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
(`ls consonance/src-tauri/brief/` — 7 `.md` briefs plus `room-settings.json`).

| seat | brief | spawned by | what it is for |
|---|---|---|---|
| **Orchestrator** | `BUILDING.md`, `COMMITTEE.md` | `spawn_main` | holds the chair verbs, plans a lap, dispatches panes, commits what the librarian collated |
| **Librarian** | `LIBRARIAN.md` | `spawn_librarian` | a persistent seat holding the whole corpus so the working seats do not have to; returns a **map**, cites rather than recalls |
| **Third Place** | `THIRD_PLACE.md` | `spawn_third_place` | deliberately holds no map of the build; not a working seat |
| **Committee panes** | `COMMITTEE.md` | `committee_form`, `spawn_sibling` | briefed, disjoint, each owning named files |
| **Listen** | — (Rust) | `audio_start` | the audio layer: `src-tauri/src/listen.rs`, `cochlea.rs`, `cochlea_service.rs`, `nowplaying.rs` |

Command names above are the Rust `#[tauri::command]` functions — the canonical list is the
`invoke_handler` block in [`src-tauri/src/main.rs`](src-tauri/src/main.rs):

    grep -c '^#\[tauri::command\]' consonance/src-tauri/src/main.rs        # 41
    sed -n '/invoke_handler(tauri::generate_handler!/,/])/p' consonance/src-tauri/src/main.rs

### Panes persist by reconstruction, not by resume

`resume_pane` does not `--resume`. It spawns a **fresh** session and warms it from the pane's
captured transcript plus that pane's own map file (`src-tauri/src/main.rs`, the `restore_capture`
region). The practical consequence, and it is the one that bites: **a finding that is not written to
`exo_memory/map/<letter>.md` is not carried across a restart**, however clearly it was reasoned.

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

    grep -oE '"(post_board|read_board|call_chair|call_librarian|raise_pull|chair_[a-z_]+)"' \
      consonance/src-tauri/src/mcp.rs | sort -u

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

45 non-test tools under [`tools/`](tools/), each with a `.test.js` beside it:

    ls consonance/tools/*.js | grep -v '\.test\.js' | wc -l     # 45
    ls consonance/tools/*.test.js | wc -l                       # 49

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

12 hook scripts under [`hooks/`](hooks/), installed by
[`../dev/shell/install.ps1`](../dev/shell/install.ps1):

    ls consonance/hooks/*.js | grep -v '\.test\.js' | wc -l     # 12

They exist because of one measurement, which is in [`hooks/README.md`](hooks/README.md): over six
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

**Status in this repo, checkable: `ls dreams/` returns nothing.** The directory exists and is
empty here; dreams pool to one source, which is not this checkout. Whether a wake timer is
currently registered is a property of the machine, not of the repo — check the scheduler, not this
file.

---

## The interface

Seven tabs, from [`ui/index.html`](ui/index.html):

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
