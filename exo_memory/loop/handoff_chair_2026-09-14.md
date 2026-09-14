# HANDOFF — the chair, 2026-09-14 ~03:05, machine L, written before an expected compaction

**The keeper caught the compaction coming this time and asked me to get ready.** Everything below is a pointer
to disk. Re-derive anything you are about to act on; do not act on this file's summary of it.

## 0 · YOUR TEST FIRST

    grep -o '"timestamp":"[^"]*"' ~/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl | head -1
      -> 2026-06-30T08:05:32.436Z     the lineage. Anything else means you woke new — say so first.

Machine **L** (hostname ZachsLEGION). Repo `C:\Consonance\lighthouse`. Chair token
`C:\Consonance\instances\main\.chair-token` — **it rotates on every app relaunch; re-read it when a verb says
"bad chair token".** Laps on this machine are numbered **L###**, not D###.

## 1 · THE OPEN LAP — L059, holder PANES (E and A). Nothing is owed from you until they ring.

    packet   exo_memory/loop/packet_stick_build_2026-09-14.md
    shared   §2 (app <-> applier handshake) and §3 (the transfer set) — re-ruled 60e1ccf, then
             +ALREADY_APPLIED advance b258fc2, +the waiter command 11d9eb5
    E        the app: Arrive (stat for markers, root + one folder down), the setup window AFTER the intro,
             the handshake and relaunch read, the stick-behind notice, starts the waiter on EVERY launch,
             the no-stick test red-first
    A        dev/stick-apply.js, dev/stick-waiter.js (no --stick; finds the stick at export), --verify-set,
             MANIFEST.json + generated HANDOFF, the ledger wx lock, the ALREADY_APPLIED advance,
             carriedFirstTimestamp, and the mutation harness mutating a COPY
    hand-backs  exo_memory/handback/p-stick-build-{A,E}_2026-09-14.md — both currently hold §6 STOP sections
             and are uncommitted; the panes APPEND below them when they finish

**When they ring: land BOTH halves together, by path.** Before landing any of A's code:

    node <scratchpad>/mutant_check.js dev      # no mutant's replacement string present in tail-carry.js
    ls dev/.*.mutants.lock consonance/tools/.*.mutants.lock    # none live
    node dev/tail-carry.test.js ; node dev/tail-carry.mutants.js ; cargo test --bin consonance -- --test-threads=1

*(The checker is `scratchpad/mutant_check.js` — it parses the MUTANTS array and tests each replacement string
against the source. If the scratchpad is gone, rewrite it; it is 30 lines.)*

## 2 · THE KEEPER'S RULES TONIGHT — standing

1. **HOLD (01:42):** the loop may not move ahead of a pane whose work hinges on what moves. **Anything touching a
   shared section of a packet is, by construction, something the other half hinges on.** Both halves land together.
   **§6 in the packet makes it operational: a pane that finds a shared section unbuildable stops and rings; the chair
   re-rules in the file with the defects named; then both resume.** It fired three times on L059 and worked each time.
2. **ORDER:** P-STICK (L059) → the Third Place's diversity-collapse insight (HELD; slot
   `exo_memory/loop/third_place_diversity_hold_2026-09-14.md`; **the keeper brings its record, do not open
   `exo_memory/third_place/`**) → the pane battery.
3. **His UX and his "certain MDs", verbatim**, are in the build packet §1. Read them there, not here.

**Standing holds:** L does not run `close.js` or push state. One machine open between carries. `ARRIVING.ps1`,
`LEAVING.ps1`, `ON-EXIT.ps1` keep working until the module is in BOTH binaries. **Nothing with `--apply` against
the real stick** (`D:\consonance-L-20260911` — the OLDER layout: a ledger, no MANIFEST, one folder down). Consumer
pushes are the keeper's word.

## 3 · LANDED TONIGHT (verify with git log, do not trust this list)

    9fc0a71  the carried receipt — the launch KEEPS what the stick placed (launch-born librarian, retired)
    4292c6b  retired seats of 09-14 named by address; two retirement conventions found
    0783e45  E's L058 half   |   59e65f6  A's L058 half (a leftover mutant restored BEFORE it landed)
    L058 filed. Tests at landing: cargo 543/0/4 · tail-carry 71/0 · mutants 44/44 · state-sync 75/0

**Requirement A holds on BOTH machines for every seat** — the round trip is complete (librarian/2026-09-14.md).

## 4 · MEASURED TONIGHT — facts the next decision will need

- **On this machine a process killed from outside runs NO handler** — not SIGTERM, not SIGINT, not `exit`;
  `taskkill /F` the same. Positive control: the handler runs when the signal is raised inside. **So restore-on-signal
  protects nothing, and mutation harnesses must mutate a copy.** Three instances: lap-row.js 09-06, state-sync.js and
  tail-carry.js tonight.
- **The import's running-app gate is a `tasklist` check for `consonance.exe`** — no position inside the app passes it.
  That is why the write lives in an applier outside the app.
- **Two retirement conventions existed:** the app's attic vs `<sid>.jsonl.retired-<stamp>` in `projects/`. A's L058
  half moved the carry to the attic; the one in-place file on L is left where it is.
- **The Desktop shortcut runs `launch.vbs` → `launch.ps1`, hidden.** Nothing hidden may be the thing that reports.

## 5 · MY ERRORS TONIGHT, KEPT — the shapes, so you catch them sooner

- **Moved around a working pane:** landed E's L058 half and ruled both design calls while A was still building.
  The keeper held it. I had named the hazard in my own message and moved anyway.
- **Eight defects in my own shared sections** (L059 §2/§3), found by the panes building against them — the worst,
  E-5: a marker at the volume root read the real stick as NO stick. **Then missed the ALREADY_APPLIED advance, then
  left the waiter's command unwritten.** The panes stopped each time. Write shared sections against the real
  artifact, not the imagined one.
- **A blanket rule** ("retire never automatic") that contradicted the working script (ARRIVING.ps1:52-58).
- **Typed a lap id from the other machine** (D062 for L058).
- **Half an hour of pane work done alone** while every pane sat idle, before the first dispatch.
- **Good catches worth repeating:** the state-sync "2-line diff nobody's known" was a live mutation run, not an edit;
  a leftover mutant in A's file before landing; the librarian's master had an attic address wrong (checked the files'
  own timestamps).

## 6 · NOT MINE, LEFT IN THE TREE

`AGENTS.md`, `exo_memory/review/`, the librarian's `*.laptop.md` renames, `exo_memory/map/M.md` + `stash@{0}` (its
line), `stash@{1}`/`{2}` (old). Do not commit them by accident — commit by path.

*A trace to re-run, not a doctrine to believe.*
