# The unattended run — laps in succession while the keeper sleeps. Librarian (the lineage, on D), 2026-09-19 10:1x.

*The keeper, 10:04, verbatim: "can we create a comprehensive plan for you to do work while I sleep? It could be planned out in chunked laps to be done AND then started after each other in succession without me there … After the tasks are done, you can keep going by doing which ever experiments you come up with to figure out diversity collapse and retrieval." And 10:0x: "i will be going to sleep after i send this msg, but leave my pc on, so lets start the draft." He did not read this file before sleeping. So it is written to be safe unread: nothing in it is irreversible, and everything it could not decide goes to a morning list.*

*This is thesis run 3 (`loop/thesis_run1_preregistration_2026-09-16.md`, `…run2…`; the idea file `loop/scheduler_and_unlocked_mode_idea_2026-09-16.md`). Runs 1 and 2 were one lap each with the keeper awake in the building. This is a chain, with him asleep.*

## 0 · Pre-registration — written before the first unattended lap opens

**The claim under test:** the room can open, run, review, land and file lap after lap with no human turn, and what it lands is worth having.

**The bet fails this run if any of these is true:** (1) a human `type:"user"` turn appears in any of the seven transcripts between the start row and the stop row, other than the keeper's waking message, which is the stop; (2) a lap lands a change that the morning read finds broke a test that was green at the start (`node consonance/tools/js-suite.js` and the crate's known-red-only state are the baselines, recorded in the night log at start); (3) the chain stops with a seat waiting and no row in the night log saying where and why; (4) any act on the forbidden list below happened; (5) over the night's laps no landed correction is one the keeper later opens and uses — the unlocked-mode falsifier, verbatim: "the unlocked mode is decorative if, over its first ten laps, no lap lands a correction that a human later opens…, or if the corrections it lands are all in files it wrote itself that night."

**Progressive or degenerating, named in advance (BOOT's abuse condition):** this line is degenerating if the morning report is mostly about the run's own machinery — stalls, nudges, gates — rather than about results from the queue.

## 1 · What may not happen while he sleeps

No rebuild or restart of Consonance (so nothing that needs a rebuild to be live is tested tonight). No write to the stick. No deletion of anything outside a pane's own scratch. Nothing on L. No new hook registered, no `settings.json` edit. No dependency added or bumped. No spawn of a new sibling pane (§8.9 of the anchor registration reserves that to the keeper's hands). No message to anyone outside the room. No push except the chair's ordinary landing pushes and the seal-row exception already in `COMMITTEE.md`. A lap that finds it needs one of these writes the need into **the morning list** (§5) and the chain moves to the next line.

## 2 · How the chain moves with no one at the keyboard

- **One driver: this seat.** Each lap is opened here (`lap-row.js --open --initiator chair|human … --entry lib`, initiator recorded honestly as `chair` for unattended laps — no human asked for that lap by name), planned here from this file, rung to the chair, dispatched by the chair, handed back here, re-derived here, returned to the chair to land.
- **The link that did not exist before tonight:** every landing order ends `NEXT: chair land …, file Dxxx, then call the librarian with the filed sha when the lap is filed`. The chair's ring after filing is what opens the next lap. Without it this seat is never woken.
- **The watchdog — the scheduler's first firing, as small as it can be:** a session cron in this seat, every ~47 minutes, that does one thing: read the ledger and the board; if a lap has been open with no new row for over 60 minutes, nudge the holder once through the chair; if the same lap is still silent at the next firing, write the stall into the night log and stop the chain. It also keeps this thread inside the one-hour cache (`memory/cold-start-reload-cost`). It dies with the session; nothing is installed.
- **Rules that hold as in the day:** the chair builds nothing; panes build on copies and mutate on copies; all outputs back before one ring; every message ends on its NEXT line; at most two panes per lap, disjoint files; the chair asks no one a question inside a lap — a question becomes a morning-list row and a conservative default.
- **The night log:** `exo_memory/loop/night_log_2026-09-19.md`, one stamped row per event (lap opened, dispatched, in, landed, stalled, skipped, stopped). It is this seat's restore point if its window compacts mid-run: after a compaction, read this plan, then the log's last row, then continue.

## 2b · ADDED 10:1x — compactions are expected, and the run is built so one cannot break it

*The keeper, 10:09, verbatim: "with me sleeping and the laps running, context will fill up eventually, how do auto compacts mess with the workchain loop? they should be anticipated and expected and shouldnt ruin the run". And 10:08: it is a DAY run — he sleeps now, works at 00:00, and carries the stick to L; so the close tonight is his, awake, and the run stops well before it.*

What a compaction does to a seat mid-lap: the turn continues, but from a summary. Measured on this room's own summaries (`loop/2026-08-18/archaeology/FINDINGS.md`): the line of the work survives; file names survive about a third of the time, shas a tenth, falsifiers 3.5%. So the danger is never "the seat stops" — it is a seat finishing a packet from a summary of the packet. The defence is that nothing a lap needs lives only in a window:

1. **The packet is a file, and the dispatch is a pointer to it.** Every dispatch tonight names the plan file and the row, and ends its body with one fixed sentence: *"If your context was compacted since this arrived, re-read this file and your own hand-back draft before you continue."* A pane writes its hand-back file early and appends to it as it goes, so its own state is on disk too.
2. **The lap's state is the ledger** (`lap.jsonl`), not anyone's memory: who holds the baton, what was dispatched, what is in. `chain-status.js` prints it in every prompt's pulse.
3. **This seat's state is the night log.** After a compaction here: this plan, then the log's last row, then continue. The plan and log paths go in the cron prompt, so the watchdog itself re-cues a compacted librarian.
4. **The chair's state:** the landing order it is acting on is a ring that names the master entry and the paths; the precompact hook writes `loop/CHECKPOINT.md`. If the chair compacts between landing and its ring back, the watchdog sees a filed lap with no next lap open and opens the next one — a filed row is enough.
5. **A compaction is logged, not hidden:** the watchdog reads the precompact ledger count at each firing and writes any change into the night log with the seat, so the morning report can say which laps ran across one.
6. **Prefer compacting between laps.** A seat that is near full when a lap files is told so in the next dispatch; this seat compacts itself only between laps, never while holding hand-backs it has not collated.

**Falsifier for this section:** it failed if a hand-back tonight carries a number, path or bar that differs from its packet's and the seat had compacted in between — the summary was trusted over the file.

## 3 · Stop rules

The chain stops, with a final row in the night log, at the first of: the keeper's first message; **10 laps filed**; two consecutive laps that fail their own bars; a stall that survives one nudge; any tool or gate refusing the same act twice for a reason this seat cannot cure within the rules of §1; 22:00 local. "Forever" is not offered on the first night: a chain with no ceiling cannot show that it stops.

## 4 · The queue, in order — each line is one lap unless it says otherwise

**N0 · D080, in flight at 10:1x.** C's flush-before-DONE (`loop/plan_small_fixes_2_2026-09-19.md` chunk 3), checked against A's condition (`handback/p-leave-flush-A_2026-09-19.md` §3: a failed flush on a non-tail file must set the export's `code` non-zero). Landed, not live, not run against the stick.

**N1 · Two tool repairs the day found.** E: the scorer's hard-coded `C:/Users/nname/Desktop/lighthouse` (`dev/diversity/score.mjs:17`, `:27`) — this is an EDIT to a hashed instrument, so it lands as a NEW file beside it (`score-portable.mjs`) with a test that both produce byte-identical results on D; the hashed original is untouched, because T1's degenerating clause voids the registration on any instrument change. A: its mutant harness's dirty-source check, misfired five laps running (`handback/p-address-refusal-pointer-A_2026-09-19.md` §4) — compare the replacement against the anchor's position, not the whole file.

**N1b · The six red JS suites, classified (read-only).** The start baseline, `node consonance/tools/js-suite.js` at 10:1x: 95 green · 6 failed · 0 crashed · 1 canary, of 102. The six: `actors.evidence`, `carrier-drift`, `forget-rate`, `gen-consumer`, `portable-paths` (all `consonance/tools/`) and `dev/shell/hooks/userprompt_pulse.test.js` (D has no Python). B classifies each: machine-bound (passes on L, cannot on D, and why), stale test, or real defect — with the failing assertion quoted. Repairs are a later lap per class; nothing is edited in this one.

**N2 · T1 to REGISTERED, not run.** The Third Place spine's order, §8 item 1 (`third_place/SPINE_diversity_to_retrieval_2026-09-16.md:193`). Owed list at `loop/handoff_librarian_2026-09-15_night.md:13`: §8.11 records the shas (D079 just made them checkable in the repo) → step 1's m from the COMMITTED scorer under R8c/R8e/R8f → the header says REGISTERED. E computes; B reads as non-author. **The run itself is NOT tonight:** §8.9 needs two new siblings per task spawned by the keeper's hands, and his ruling on unblinded polarity is open. Both go to the morning list.

**N3 · T3's readiness, and its run only if it needs no new pane.** The seed test (spine §6 T3), "the cheapest registered run on the board". C reads `essay/RECOGNITION_TEST_PLAN.md` and `essay/recognition/` and answers one question from source: can the three arms (cold; the ~60-word seed; the full intake) be run by fresh sub-agents a pane spawns itself, with no room shell, no sibling pane and no keeper? If yes: B attacks the design before any subject runs; the predictions are already registered (spine §6, verbatim there); the run is the NEXT lap. If no: morning list.

**N4 · T3's run** (only if N3 said yes and B's attack left it standing). Scored by a seat that ran no arm. The falsifier is the spine's, verbatim: "if the seed produces a costume (fluent, stance-free, archetype leaking) where the full intake produces a stance, the essence is not in the generator and this line is dropped."

**N5 · T2's arm (c) feasibility** (spine §8 item 2): can a pane reach three different Claude models as flat, unbriefed subjects from inside the app? A measures it and states the cost per subject. Then the chair registers T2 citing L039/L045 as arm (a), with the decision rule verbatim from spine §6. No arm runs tonight unless the feasibility lap shows it needs nothing from §1's list.

**N6 · The pane battery RUN 2 — design only.** `loop/pane_battery_registration_2026-09-16.md` §9–§10 and run 1's three voids (`loop/handoff_librarian_2026-09-16_morning.md`, L060): load, test–retest, keys off-repo and off-directory. B drafts the amended registration; E attacks it. The run needs sealed keys the keeper should see first: morning list.

**N7 onward · the open part — this seat's own experiments on diversity collapse and retrieval.** Allowed only in this shape, so that a night of them is evidence and not drift:
1. **One registration file per experiment, committed BEFORE its dispatch:** the claim, the instrument and its command, the prediction, the falsifier verbatim, what would make it degenerating, and the prior art by path. No registration, no lap.
2. **Only instruments that can return an unwanted number** (BOOT, the curated auditor). Prose about diversity is not an experiment.
3. **Existing data first.** Candidates, in the order I would open them, each to be registered properly when its turn comes:
   - *Retrieval, from the record:* the trigger index was scored once (`loop/trigger_index_rescore_2026-08-30.md`); the retriever closed on 08-31 (`loop/retriever_closing_2026-08-31.md`). Question: over the 09-01 → 09-19 transcripts, how often did a seat re-derive something a file already held, and would the frozen baselines (`loop/retriever_baselines_2026-08-31.md`) have surfaced that file? Instrument: a script over transcripts and `git log`; unwanted number: the baselines surface it no better than chance.
   - *Diversity, from the record:* 20 laps of hand-backs exist where two panes read the same object (L039, L045, the D06x reads). Question: does pairwise overlap of their findings rise across the weeks — collapse measured as ERROR CORRELATION over time, the T5 unit (`librarian/LEDGER.md:27`) applied retrospectively. Unwanted number: overlap is flat or falling, and "collapse" is not happening here at all.
   - *The compaction filter:* `loop/2026-08-18/archaeology/FINDINGS.md` measured what summaries keep (shas 10.2%, falsifiers 3.5%). This morning's compaction ran under the preserve directive. Question: did survival move? Instrument: the same archaeology script over today's summary. Unwanted number: no change, the directive is decorative.
4. **Two experiments per line at most** before the line is written up in the morning report; no experiment's result may be used as the premise of the next without a non-author read.

## 5 · The morning list — for the keeper, appended to as the night goes

Kept at the bottom of the night log under `## FOR THE KEEPER`. Standing rows at 10:1x: the T1 run needs his hands for the siblings and his ruling on unblinded polarity; a close-and-reopen of Consonance on D ships D077, D078 and D080; the stick prune is held; L's six log queries on Sunday (`handback/p-stick-fault-cause-C_2026-09-19.md` §7); the two P-LEAVE-3 live tests need the app closed; the three excluded-but-live hooks on D are his to name.

## 6 · The morning report

`exo_memory/loop/night_report_2026-09-19.md`, written at the stop: laps run and their shas; what landed; what failed and how; every number with its command; the morning list; this run's five falsifier arms scored by what the log shows — arm 1 and arm 5 are not this seat's to score (the transcripts are counted by script; "opened and used" is the keeper's).
