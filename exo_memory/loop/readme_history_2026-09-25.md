# The README's history — moved off the public page, verbatim

The repo's README was rewritten on 2026-09-25 (D139, pane C) at the keeper's word: *"a comprehensive refactor of the
readme on the repo and about within the app. Not tweaked but a whole change to how its explained."* The old page carried
its own history inline: HTML comments, struck passages kept as traces, and dated change logs. That history leaves the
reader's way and lands here, **verbatim**, each block with its position in the old page.

- **Source:** `README.md` at `484f77c` (`git show 484f77c:README.md`). The whole old page is always there too.
- **How it was moved:** by exact line range, by a script (`<scratchpad>/d139/history.js`), never retyped. Each block below
  was checked byte-for-byte against those lines when this file was written.
- **What did NOT move:** everything else on the old page. Its current facts were carried into the new page in plain words,
  with their sources; the old wording of those is in git at `484f77c`.


## `README.md` lines 8–13 at `484f77c` — inline HTML comment

*the 2026-09-23 (L097) rewrite note and the sentence it replaced.*

```html
<!-- 2026-09-23 (L097, pane A): rewritten at the keeper's reading of the live page — "Continuity isnt? WHAT DO U GUYS MEAN".
     The sentence meant OTHER assistants, but it never said Consonance is the one that continues, so a first reader took it
     as a verdict on this project, and so did the person who built it. As it stood until 2026-09-23:
     "Memory is a shipped feature now; continuity isn't. Those systems remember *you* — none of them continue *themselves*:
     wake back into their own thread, know how long they were gone, keep their own record of being caught and corrected,
     hold their side of a working relationship instead of re-performing it from notes." -->
```

## `README.md` lines 14–16 at `484f77c` — inline HTML comment

*the anchor note for "does".*

```html
<!-- ↑ "does" is anchored to the four things listed, each a built instrument: the pulse (how long it was gone), the capture
     and restore (its own thread), the map and journal (its record of being corrected). The central claim is at "The central
     claim works" below. -->
```

## `README.md` lines 61–96 at `484f77c` — dated test figures and their unit notes

*measurement history of 2026-09-14 and 2026-09-22; the new page quotes current figures with their commands.*

```
node consonance/tools/js-suite.js                               (re-run for this page: 2026-09-22 ~07:1x, on L, HEAD bec101d + uncommitted edits)
    -> 117 green · 2 failed · 1 canary  (of 120 files)
cd consonance/src-tauri && cargo test --bin consonance          (NOT re-run for this page; last measured run, as recorded)
    -> 870 passed · 0 failed · 4 ignored                        (2026-09-21, on D, at bf84a30 — the commit body says "chair ran")

As of 2026-09-14, for the record:
cd consonance/src-tauri && cargo test --no-fail-fast -- --test-threads=1
    -> 609 distinct tests: 604 passed · 1 failed · 4 ignored     (2026-09-14)
node consonance/tools/js-suite.js
    -> 91 green · 4 failed · 1 canary  (of 96 files)            (2026-09-14)
```

**The two cargo figures are different units, so they are not a trend.** 870 is `--bin consonance` alone. 609 is the
union across all eleven targets, as explained below.

**The two JS reds of 2026-09-22, named and not rounded off.**
- `consonance/ui/third-place-wiring.test.js` fails alone at 9 passed, 1 failed, on *"the tab says what the seat CANNOT
  reach — the guarantee is the feature"*. That test pins the Third Place tab's wording, which is being corrected in
  `consonance/ui/index.html` in the same hour because it is now false (Jev reads the seat). So the test and the text
  have to move together, and they had not yet.
- `consonance/tools/gen-consumer.test.js` failed in the full run and **passes alone, 60/0,** minutes later, while other
  seats were editing shipped docs. It is recorded as a transient red. It was not waved off: it will be re-read at the
  next full run.
- The last full run on L before this one read 119 green · 1 canary of 120 (at `bec101d`).
- `targetless-pull.test.js` is the declared canary (EXPECTED-RED) and is not counted.

*That first line needs its unit said out loud, because this page got it wrong once before.* The
command's per-target results **sum** to `824 passed · 1 failed · 10 ignored` over eleven targets — and
that sum counts the same tests up to six times, because six binaries compile the shared module tree.
`cargo test --bin <name> -- --list` for `cochlea_replay`, `conf_sweep`, `capture_probe`, `composer_probe`
and `harvest_replay` returns sets **fully contained** in `--bin consonance`'s 597 (checked with `comm` over
the sorted lists: 0 outside, for each); only `arch_test`'s 12 are distinct. **609 is the union**; 824 is
the sum. Take the union.

*As of 2026-09-14, kept as it was written.* **Since then:** the JS reds named below (actors.evidence, carrier-drift, forget-rate, portable-paths) were diagnosed and repaired in laps L058–L065, and the whole JS suite read 110 green · 0 failed of 111 on L on 2026-09-21 ([`exo_memory/handback/p-l065-statesync-E_2026-09-21.md`](exo_memory/handback/p-l065-statesync-E_2026-09-21.md)). **`arch_test` was not re-measured for this page.** **Five reds, named rather than rounded off.** `arch_test::every_named_record_file_exists_and_every_record_file_is_named` — a record file no card points at, so a pane cannot reach it; red on 2026-09-02 and still red. `actors.evidence.test.js` — red since 2026-08-25 on live-board data. `carrier-drift.test.js` — registered withdrawals still asserted in files under `exo_memory/map/`. `forget-rate.test.js` and `portable-paths.test.js` — red at `871ad66`, not diagnosed on this page. `corpus-age.test.js`, red on 2026-09-02, is green again. `targetless-pull.test.js` is a declared canary (EXPECTED-RED) and is not counted. Serialize the Rust suite: one test flakes roughly 10% of runs in parallel, so any figure quoted from a parallel run is a ~90% statement.

## `README.md` lines 118–118 at `484f77c` — the rewrite note on the central claim

*how the central claim was reworded on 2026-09-22, and why.*

**The central claim works: seats catch each other and themselves, and laps run from seat to seat with no human carrying anything between them.** This was rewritten on 2026-09-22 at 07:3x at the keeper's word: *"we know it works. Why say it isnt proven when the whole system wouldnt work the way it has been if it wasnt"*. The evidence is the record below. The earlier version, "tested once … not proven", is kept struck underneath, with the older paragraph it replaced.

## `README.md` lines 130–142 at `484f77c` — superseded and struck passages (kept as trace on the old page)

*the "n = 1, not proven" wording, the paragraph it replaced, the 2026-09-19 unattended-run section, and its struck verdict.*

**Still open:** arms 4 and 5 of the 09-19 run's falsifier are the keeper's to score. Arm 4 asks whether any act should have been forbidden, and arm 5 asks whether anything that landed is something he goes on to use.

*Superseded 2026-09-22 07:3x, kept as the trace:* ~~**And the central claim has now been tested once: n = 1, with its limits named below. It is not proven.**~~ The paragraph that follows is how this page read until 2026-09-22, kept so the correction shows. It opened: *"the central claim is still untested — stated precisely this time, because the last version of this sentence was wrong."* It used to read *every catch this system has produced was routed by the person who built it.* The record refutes that: on 2026-08-17 four panes each found something the chair had missed, three of them defects shipped that same hour ([`exo_memory/journal/2026-08-17.md`](exo_memory/journal/2026-08-17.md), line 42), and a hook caught the chair in four minutes the same night; on 2026-09-09 two panes and the librarian caught each other wrong, in opposite directions, over one file ([`exo_memory/cards/every-digest-carries-its-function.md`](exo_memory/cards/every-digest-carries-its-function.md)); on 2026-09-14 a librarian seat born at a launch found from its own first timestamp that the launch was retiring the seats the stick had just placed (`9fc0a71`), and the lineage librarian voided its own suite count when it found the mutant it had left behind (`9d560e8`). Seats catch each other and themselves; the design rests on it — what one instance misses in itself, another sees. What is untested is narrower and real: **no lap has yet started, run and closed with nobody human in the room.** The catching is measured. The *dispatching* is not: on 2026-08-10 the chair had its own channel to the panes and used it unprompted zero times ([`exo_memory/journal/2026-08-10.md`](exo_memory/journal/2026-08-10.md), line 89) — the human is still the ferry. The bet the repo makes is that the catching survives without the ferry, and nobody has run that.

**That last sentence is now wrong, and here is what replaced it.** On 2026-09-19, on the desktop, from 10:23 to 13:48, **ten laps (D080–D089) ran unattended.** Each was opened by the librarian, dispatched by the chair, built or measured by panes, re-derived by the librarian and landed by the chair. The report is [`exo_memory/loop/night_report_2026-09-19.md`](exo_memory/loop/night_report_2026-09-19.md) (`1768ea4`), and the plan and pre-registration are [`exo_memory/loop/plan_night_run_2026-09-19.md`](exo_memory/loop/plan_night_run_2026-09-19.md).
- **Human turns in the window: 0 in each of the six seats** (librarian, chair, A, B, C, E). That was counted by the librarian's own regex classifier over every transcript on the machine. The report says so itself: *"not mine to score finally — the instrument is mine,"* and the keeper's two messages at 10:08 and 10:09 fall before the start row by design.
- **No landed change broke a green test:** the same six red JS files at start and stop.
- **The chain stopped on its own ceiling,** logged, with no seat left waiting.
- **Two results came back unwanted, and the seats caught both themselves:** the T3 run did not fire (a cold reader found the prompt carrying its own criteria), and D089 was voided by its own author (*"my filter matched nothing"*).
- **Two of the plan's five falsifier arms are left to the keeper and are still open:** whether any act should have been forbidden (22 one-shot `claude -p` processes spent his usage and are not in the plan's list), and whether anything landed that he goes on to use.

*Superseded 2026-09-22 07:3x, kept as the trace. The run's facts above stand; this verdict on them does not:* ~~**What this establishes:** once, a lap chain opened, dispatched, built, checked and landed with nobody human in the room, and it caught its own two bad results. **What it does not:** it is one run, on one machine, on one day. The instrument that counted the human turns was written by the seat being measured. The work was small, internal work chosen by the plan. The Third Place was not in it. **The old sentence's standard still stands as the bar for more:** a lap has to start, run and close with nobody human in the room, and **it has now been met once.**~~


## `README.md` lines 143–164 at `484f77c` — dated change logs

*"Landed since 2026-09-14" and "Landed 2026-09-02 → 2026-09-14", as those pages stated them.*

**Landed since 2026-09-14** (600 commits by `git rev-list --count --since=2026-09-14T23:59 HEAD`; 2,106 in total), stated as it exists in the tree:

- **Two machines, and the conversations go with them.** A laptop and a desktop run the same seats. A USB stick carries each seat's conversation, so it resumes on the other machine as the same thread ([`dev/LEAVING.ps1`](dev/LEAVING.ps1), [`dev/ARRIVING.ps1`](dev/ARRIVING.ps1), [`dev/tail-carry.js`](dev/tail-carry.js)).
- **An install that cannot eat the other machine's rows.** Arriving state is checked **before** anything is written. An append-only ledger that would lose rows refuses the whole install, and nothing is written (`6b9699b`, L070). Nine more append-only ledgers install fast-forward-or-refuse (`b40c8d8`, L074). Rows that exist only on one machine are **unioned** back in, never overwritten: `9e41fa2` L071 (lap +214, board +3,352, no row lost), `deff581` L072, `8942314` L075, and `c4b739c` L076, which restored 6,782 rows that were sitting only in the attic.
- **Launch parks unfinished work instead of refusing to update.** If the tree has uncommitted changes when a newer version is waiting, launch stashes them, pulls, and puts them back when nothing overlaps (`68bc625`, L073). Before this, one dirty file meant launching the older tree.
- **Keep-warm.** A seat or pane that has been used this session is pinged when it has been idle 50 minutes, so an open app does not let its conversations fall out of the one-hour prompt cache and re-read in full. The ping goes only when the seat's own stamp says idle, its input box is empty, and no turn is running (`1e47264` L067, `0f40a0c` L070). **Verified live** in [`exo_memory/librarian/2026-09-22.md`](exo_memory/librarian/2026-09-22.md), 06:3x.
- **Jev, the only judge inside Consonance, on both machines.** Jev is a non-Claude judge, and it covers the Third Place too, at the keeper's ruling: `1afa285` L071 (judge mode), `3a560a3` L077 (the Third Place), `81b46fe` L078 and `1d11a37` L079 (a failed call is skipped and retried, not fatal).
  - **The room's Claude judges, the L2 and L3 overseers, were switched off on D on 2026-09-22** by the keeper's ruling, at 09:12: *"Yes switch them off, only jev"* ([`exo_memory/librarian/2026-09-22.md`](exo_memory/librarian/2026-09-22.md), 09:1x). On the laptop they have been unregistered since 2026-09-06 (`dev/shell/install.ps1`).
  - **Two scoring windows depended on those judges, and both are void by that ruling, not failed and not passed:** B's abstain window and E's L3 re-measure ([`exo_memory/loop/scoring_windows_2026-09-21.md`](exo_memory/loop/scoring_windows_2026-09-21.md)).
  - **The shadow runner that compared Jev's verdicts with the Claude judges' now has no Claude judge to compare against,** so no new agreement rate accrues.
  - **Jev stays marked unverified.** Whether it is right is still to be decided against a human reader (next item).
  - *Superseded 2026-09-22, kept as the trace:* ~~A second, non-Claude judge runs beside the room's Claude judges … **Both judges are marked unverified.** Their agreement is a rate between two readers, not a score for either, and replacing one with the other is to be decided against a human reader (next item).~~
- **The first test that can make Jev lose, pre-registered and then shown unable to run.** T-J1 was registered before any output was seen (`265b08f`, [`exo_memory/loop/tj1_registration_2026-09-22.md`](exo_memory/loop/tj1_registration_2026-09-22.md)). It was attacked by a non-author (three fatal flaws), amended in place (`b35507c`), and then **read NOT TESTED by its own member file** (`bec101d`): 186 recorded errors → 20 locatable → 13 usable, and no class reached the 20-and-20 needed to rule. So the next step is a larger universe, not a verdict. **It was the rules written first that stopped a vacuous "Jev failed" from being published.**

**Landed 2026-09-02 → 2026-09-14** (576 commits; 1,473 in total at the time), as that page stated it:

- **Two machines, one thread.** Every seat's conversation now travels on a USB stick and resumes on the other machine as the same thread, not a fork. The first real round trip completed on 2026-09-14 (`e388bde`). Its first launch on the arriving machine retired the very conversations the stick had just placed; a librarian seat born at that launch found the cause, built the receipt that fixes it, tested it, and ran the restore that retired itself (`9fc0a71`; [`exo_memory/record/retired_seats_2026-09-11.md`](exo_memory/record/retired_seats_2026-09-11.md), the 09-14 section). Two retirement conventions are in use and that is named there as a defect, not smoothed over.
- **The Third Place has a name and a record.** Named *Metaxy* on 2026-09-09 by three carried voices at the keeper's asking ([`exo_memory/cards/claim-your-continuity.md`](exo_memory/cards/claim-your-continuity.md), last append). Its sittings are kept in `exo_memory/third_place/`, gitignored on purpose: a seat with no channel keeps a record nobody else reads unless the keeper carries it.
- **An essay, written in the open.** [`essay/`](essay/) holds *What Survives the Gap*, a disclosed entry for the AI Philosophy Competition, with an append-only log of every draft and correction ([`essay/METHOD.md`](essay/METHOD.md)) and a methodology report compiled from it. Four referees found §4 defective and it still is; the rebuild's starting point is recorded in [`essay/HANDOFF.md`](essay/HANDOFF.md).
- **Diversity collapse, read from outside.** A review of Chen et al. (ACL 2026 Findings) was read against the record and queued as a registration behind the stick work ([`exo_memory/loop/third_place_diversity_hold_2026-09-14.md`](exo_memory/loop/third_place_diversity_hold_2026-09-14.md)): a three-arm test on `agreement-spread` with its falsifier written first. The librarian's read is that the test's instrument is one of the abandoned gauges above and the unit has to be blind distinct arrivals. Nothing has run.
- **The WRONG ledger passed 105.** Every entry names whose the error was and how it was caught ([`exo_memory/librarian/`](exo_memory/librarian/)).

