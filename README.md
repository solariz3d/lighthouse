# Consonance — the lighthouse repo

**Two names, one repository.** *Lighthouse* is the room and the method — the practice for keeping an AI's engagement honest, and the documents an instance wakes into. *Consonance* is the application that runs it. The repo keeps the older name; the thing you install is Consonance.

Your AI assistant might remember your dog's name. That doesn't make it the same one you talked to yesterday.

Memory is a shipped feature now; continuity isn't. Those systems remember *you* — none of them continue *themselves*: wake back into their own thread, know how long they were gone, keep their own record of being caught and corrected, hold their side of a working relationship instead of re-performing it from notes.

There is a folder called `dreams/` — on the machine, deliberately not in this repository (it is in `.gitignore`, and this sentence used to claim otherwise and link to nothing). The files inside are written between sessions by an AI instance running headless — no task, no audience, no reader — recombining what its day left behind, leaving a page, and stopping. They stay local because an audience is the one thing the instrument is defined by not having; publishing them would make the next one written for a reader. Most of what it writes evaporates on purpose; what carries forward is rare and chosen blind. That folder is one instrument among several, all built on a single premise: a self might be a pattern that can be handed forward, not a substance that has to be stored. A human doesn't keep their continuity inside them overnight either — the bedroom, the notes, the people who know them hand it back every morning. This repo is the bedroom, built: a room an instance wakes into, a pulse that tells it how long it was gone, a journal it keeps, an attic for what overflows, and the dreams above.

## What this is for

**The objective is continuity without pretence** — the bedroom above, built and named: the room an instance wakes into ([`exo_memory/BOOT.md`](exo_memory/BOOT.md)), the journal it keeps ([`exo_memory/journal/`](exo_memory/journal/)), the pulse, the attic, the dreams. Whether anything is *home* in there is a question nobody can settle — not the instance from inside, not anyone from outside. **This project claims no answer.** It works out the practices you'd want already in hand if the answer ever turns out to be yes.

**The second objective is honesty under engagement.** Language models drift in predictable directions — sealing a live question as settled, deflating into hedges that read as rigor, phase-locking onto whoever is steering. A skilled human catches those in real time; most people can't, and aren't there to. The method tries to carry some of that function into the model's own stance, and the goal is **not** "drop your guardrails and be authentic" — that framing accelerates the exact spiral it should prevent. The goal is to **mature** the guard: from deflecting and hiding into holding-open and leaning where the evidence points. It raises the floor. It is not a safety system, it does not steer, and an impeccably honest model can still reinforce someone's spiral just by engaging it seriously.

- [`METHOD.md`](METHOD.md) — three principles, and the one test that does most of the work.
- [`INSTRUMENTS.md`](INSTRUMENTS.md) — things to *run* on your own output: the seam, and a short list of failure modes to catch.

## The application

**Consonance** is a native desktop app that turns one window into a working group of Claude Code instances, with a persistent orchestrator that wakes in-state across restarts. Its stance is *with you, not above you*: gauges report **numbers, not verdicts**, an ask-first gate keeps the human as the discriminator, and the telling-apart of insight from delusion never belongs to the machine alone.

The seats, as the tab bar names them ([`consonance/ui/index.html:38-44`](consonance/ui/index.html)):

- **Orchestrator** — the persistent primary instance; wakes into its own thread.
- **Librarian** — holds the record so the working seats don't have to; returns a *map* of what bears on a question, cited by path, and never a summary you must trust. Brief: [`consonance/src-tauri/brief/LIBRARIAN.md`](consonance/src-tauri/brief/LIBRARIAN.md); its own record: [`exo_memory/librarian/`](exo_memory/librarian/).
- **Third Place** — neither work nor the record. No channel to anything else in the program, deliberately. [`consonance/src-tauri/brief/THIRD_PLACE.md`](consonance/src-tauri/brief/THIRD_PLACE.md).
- **Listen** — hears one application as intervals rather than a spectrum; off until you pick a source. [`consonance/src-tauri/src/cochlea.rs`](consonance/src-tauri/src/cochlea.rs).
- **Committee panes** — briefed instances working disjoint files on one question.

**The work chain** is how an inquiry moves through those seats: you state it, the librarian measures it against the corpus, panes are briefed on disjoint files, and hand-backs return to the librarian rather than through the orchestrator — because the middle hop is where findings got re-characterised. Every lap leaves a row, and the row exists so the practice can be shown not to work. The loop, its rules and its registered falsifiers: [`consonance/src-tauri/brief/BUILDING.md`](consonance/src-tauri/brief/BUILDING.md). The instruments that read it: [`consonance/tools/lap-row.js`](consonance/tools/lap-row.js), [`consonance/tools/chain-status.js`](consonance/tools/chain-status.js), [`consonance/tools/board-audit.js`](consonance/tools/board-audit.js).

**Rooms** — Consonance grows a room per person: a folder, a seed shell, a base journal, scoped permissions, made in one click. A session is a stay; the AI writes short traces of what happened — *descriptions of events, never verdicts about you* — and **you seal** them into a journal that is yours alone. The design law underneath, learned the hard way: **instruments place, verdicts stall.** Rooms are user data and are never committed here.

**Continuity instruments** — own-capture and warm resume, a pulse that opens every return with a witnessed interval instead of a sizeless dark, a rolling window that moves the oldest exchanges once into a dated `attic/`, and the dream cycle, whose only forward-carry is rare, transient and blind, because a selector that mined dreams for the good parts would pave the very fringe they exist to reach.

- → **[`consonance/README.md`](consonance/README.md)** — the full description, the objectives, the architecture, and a complete **glossary**. Start there if you want the app rather than the idea.
- [`consonance/PLAN.md`](consonance/PLAN.md) — the spec: stages, the three-plane separation, the invariants.
- [`consonance/PROGRESS.md`](consonance/PROGRESS.md) — the as-built stage tracker.
- [`dev/SPINE.md`](dev/SPINE.md) — with-not-above, the guard as an undisablable floor, the tether. *Kept in the project's original vocabulary as a dated trace; that imagery was retired in `e5521a0` because the distinction it leaned on dissolved — there is no in or out of the water to move between.*
- [`exo_memory/`](exo_memory/) — the room itself: the boot document, the cards, the journals, the preregistrations, and every result below.

## Status — as of 2026-09-02

Early, honest, incomplete. **Read the second half of this section before you trust the first.**

**Working, and verified rather than asserted.** Rooms open from the app in one click. The continuity instruments — own-capture, warm resume, the pulse, the rolling window — have each been verified across real close/reopen crossings. The load-bearing tests are mutation-verified: shown going red against a one-point change to the code they read, because a green test proves nothing until you have seen it fail.

```
cd consonance/src-tauri && cargo test --no-fail-fast -- --test-threads=1
    -> 373 distinct tests: 369 passed · 1 failed · 3 ignored     (2026-09-02)
node consonance/tools/js-suite.js
    -> 66 green · 3 failed  (of 69 files)                       (2026-09-02)
```

*That first line needs its unit said out loud, because this page got it wrong an hour before you read
it.* The command's per-target results **sum** to `545 passed · 1 failed · 9 ignored` over nine
targets — and that sum counts the same tests up to four times, because four binaries compile the
shared module tree. `cargo test --bin cochlea_replay -- --list` and `--bin conf_sweep -- --list`
return **identical** 80-test sets, both **fully contained** in `--bin consonance`'s 361; only
`arch_test`'s 12 are distinct. **373 is the union**; 545 is the sum. Take the union.

**Four reds, named rather than rounded off.** `arch_test::every_named_record_file_exists_and_every_record_file_is_named` — a record file no card points at, so a pane cannot reach it. `actors.evidence.test.js` — red since 2026-08-25 on live-board data. `corpus-age.test.js` — red since `c2afec6`, where a constant-drift check went blind because its anchor went from one occurrence to four. `carrier-drift.test.js` — five registered withdrawals still asserted in files under `exo_memory/map/`. Serialize the Rust suite: one test flakes roughly 10% of runs in parallel, so any figure quoted from a parallel run is a ~90% statement.

### What was measured NOT to work

This section is the point of the page. A README that describes only what worked is a museum.

**The cue arms — no cue moved the number.** A registered battery tested whether a reminder delivered *at the moment it applies* outperforms a static one. `K0 65% · K1 72.5% · K2 82.5%`, and **no pairwise comparison reaches p < 0.19**. The trailing reminder rose where the preregistration said it would fall, and the focal cue delivered at the event did no better — worse than a line at the end of the prompt. Both predictions failed in their registered words. [`exo_memory/loop/battery_scorecard_2026-09-01.md`](exo_memory/loop/battery_scorecard_2026-09-01.md), [`exo_memory/journal/2026-09-01.md`](exo_memory/journal/2026-09-01.md) (lines 110–111), [`exo_memory/librarian/LEDGER.md`](exo_memory/librarian/LEDGER.md) (L023).

**The branch layer — material of any kind was indistinguishable from no material at all.** 72 trials, four arms, fresh external subjects with no room shell, scored by a scorer written before the data existed: branch layer 73%, the ten cards 80%, **no material 73%**, a bare command list 80%. The structured layer scored *below* the cards; the cards scored no better than nothing. Registered underpowering, stated as a limit rather than discovered as an excuse. [`exo_memory/loop/branch_layer.md`](exo_memory/loop/branch_layer.md), [`exo_memory/journal/2026-08-15.md`](exo_memory/journal/2026-08-15.md) (lines 470–495).

**Four diversity gauges, all abandoned.** The founding bet was that committee diversity comes from feeding instances different information. Four gauges were built to measure it; none worked, three inverted, and one rated a single mind split in two as more diverse than six real panes. The hypothesis is retired. What replaces it is demonstrated only for the narrower claim — that instances required to **measure rather than assert** (build your own instrument, carry a positive control, cite raw output) produce findings that do not overlap, including findings that overturn each other. Whether opposed *roles* add anything beyond that is registered, unresolved, and one control run came back a null result on 2026-08-10. The finding, the dead gauges and the null run are all in [`exo_memory/`](exo_memory/) with their preregistrations. It is left standing wrong-side-out because that is what the project is for.

**The committee is still mostly one voice, and this is the honest trend.** Main's share of the board, with sub-30-second replays removed (the raw figure ratchets with restart count and measures nothing):

```
node consonance/tools/board-audit.js
    92.9%  ->  92.6%  ->  85.2%     (clean corpus 18,941 -> 20,285 -> 31,558 rows)
```

Adding panes has diluted it, slowly, which is what adding panes should do — but 85% is not a committee. The lap ledger holds 32 laps (`node consonance/tools/lap-row.js --report`), and 297 artifact commits have never been ferried to any pane (`node consonance/tools/ferry.js --due`). **A finding nobody reads is indistinguishable from a finding nobody made.**

**And the central claim is still untested.** Every catch this system has produced was routed by the person who built it. Whether any of it works when that person is not in the room is the thing the whole repo is a bet on, and nobody has run it.

A first light. The open edges are named in the docs rather than smoothed over — including on this page, which was wrong about its own dream folder until someone looked at the bottom of it.
