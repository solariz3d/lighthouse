# Retrieval, now: the scoreboard, the reach, and the one experiment never run. Librarian, on D, 2026-10-11 07:4x. Lap D294.

The keeper, 07:47: "lets do it now tf". Retrieval had no real progress since 10-03 (QS2S closed NOT USABLE, `loop/plan_finish_retrieval_2026-10-03.md:88`). The last day was plumbing (D287–D292).

**What the line is for**, in the record's own words (`map/M.md:340-348`, 08-31): a seat that reaches for the right check at the moment it applies, without being told. The scoreboard named then: **who catches the errors — the keeper, a seat after the fact, or an instrument in-stream** — and the finder should shift toward the instrument. That scoreboard has never been run since the gates went in (SOURCES gate 10-02, reply slot 10-03, trailers). Retrieval is two problems (`map/M.md:935`): REACH (the right file never fetched) and COMPOSITION (reached, then lost while writing).

Three parts, no shared file, run in parallel. B is the non-author reader of all three hand-backs before I score.

## Part 1 — E: the scoreboard (MEASURE ONLY)
- Every catch on the record 09-01 → 10-11, classified by FINDER: keeper / seat after the fact (second reader, pane reading a hand-back, a seat's own later correction) / instrument in-stream (a gate refusal that changed what was sent, a test or ratchet red before landing).
- Sources: `consonance/tools/catch-ledger.js` reads only `muscle_map.md` + `journal/*.md`, and the journal stops at 09-22. So add: the librarian notes' WRONG entries (`exo_memory/librarian/*.md`), hand-backs' "corrections to myself" sections (`exo_memory/handback/`), and the gate logs in `C:\Consonance\data\` (`sources-gate.jsonl`, `reply-slot.jsonl`, `dispatch-gate.jsonl`, `second-reader.jsonl`, `push-gate.jsonl`, `delete-gate.jsonl`). A gate refusal counts as a catch only if the resent message differs in a claim, not only in the trailer (B's D276 split: `loop/loop_friction_B_2026-10-09.md`).
- Output: a table by week × finder, every row walking back to a line. Extend catch-ledger.js if that is the cheap path (tests red first); otherwise a script in the evidence folder.
- Hand-back: `exo_memory/handback/p-scoreboard-E_2026-10-11.md`.

## Part 2 — C: REACH, re-measured (MEASURE ONLY)
- On 08-22: corpus 26,265 lines, **0.62% in context at wake, 25.7% reachable via a pointer, 74.3% unpointed** (`journal/2026-08-22.md:631-636`). Find the method that produced it (that journal section and its commit), and re-run the SAME method on today's corpus and today's wake (the shelf now carries 13 files in full, indexes 298 and drops 515 from the index window — this session's own SessionStart).
- Report the same four numbers, plus what moved them, and what share of the dropped 515 was opened in the last 14 days (the read ledger, `C:\Consonance\data\read_ledger.jsonl`, if it records it).
- If the old method is not recoverable, say so and state the method used, rather than present a new number as comparable.
- Hand-back: `exo_memory/handback/p-reach-C_2026-10-11.md`.

## Part 3 — A: the cheapest experiment, never run (`research/the_retrieval_problem_outside.md:268-271`, item 4)
- Registered 08-30: a TRAILING reminder at the end of context restored 90–100% compliance in the paper; mechanize it in the hook, score over twenty dispatches against the 98.1% turn-boundary violation baseline. 09-01 note: "the hook test itself is unrun".
- First: establish whether it ever ran since 09-01 (grep the record; the NEXT-trailer gate may have replaced the turn-boundary rule — if so, the 98.1% baseline no longer applies and A says what the live equivalent is).
- If unrun and still meaningful: register the bar in a sealed file BEFORE code (`exo_memory/loop/trailing_reminder_registration_2026-10-11.md`), then build it in SHADOW (logs, never changes what is sent) in the existing pulse hook, red first, tests that spawn the hook, and trace its readers. It is a shared hook: the light-mode wording stays short.
- Hand-back: `exo_memory/handback/p-trailing-A_2026-10-11.md`.

## Registered now, before any part runs (librarian)
- **P1 (scoreboard):** of catches 10-03 → 10-11, instrument in-stream is **≥ 25%**; of catches 09-01 → 09-30 it is **< 10%**. If the later share is under 25%, "the gates moved catching in-stream" is wrong.
- **P2 (reach):** today's unpointed share is **≥ 74.3%** (the corpus grew and the index window drops 515 entries). If it is lower, the shelf's windowing did not cost reach, and I was wrong.

## Both / all
Worktrees on G:. Heavy runs through main's `heavy-run.js` by absolute path. Ratchets after committing. Commit by named paths, don't push. Every dispatch row carries `--parts 3`. After all three: B reads the three hand-backs, the librarian collates and scores P1/P2; the chair lands anything A built, one js-suite in a clean worktree on G:, push.

NEXT: chair dispatch D294 parts 1–3 to E, C and A (`--parts 3`) when this plan is read

## All three back (librarian, 08:1x). Read, NOT scored: B reads first, per the plan.
- **E** (`handback/p-scoreboard-E_2026-10-11.md`, git-blob f576df8b…, 12,689 B; `c8f43c74` + `d76c3b56`): gates **0 catches in 383 refusals** (174 re-sends changed; the usual change was a figure DROPPED, not corrected). Tests/mutants/ratchets ~19% of hand-back catches (audited estimate), no rising trend by week. WRONG column: keeper 14 of 101, instrument 0. One wrong claim of mine went through SOURCES intact (10-10 15:43) and the chair caught it. On its face P1 fails; scored after B.
- **C** (`handback/p-reach-C_2026-10-11.md`, git-blob 289f2608…, 8,686 B; `3479af25`): the 08-22 method recovered from the chair's transcript and re-checked on tree 33e11457 (reachable 6,754, exact). Today, same method: unpointed **96.55%**. On the shelf's own unit: the index window costs 23.7 points, and **handback/ is not in the shelf walk at all (`main.rs:7660-7665`), 45.9 points**. Of the 515 dropped, 7 were Read in 14 days. On its face P2's number holds and its reason was the smaller cause; scored after B.
- **A** (`handback/p-trailing-A_2026-10-11.md`; `dc45c56c` registration first, `1b4cb7c0` shadow): never ran; refused on design in L016 (08-30). Live baseline from the chair's transcript: 95.2% of 1,091 dispatch turns write > 500 chars after the dispatch. **For B:** the registered bar (≥ 90% wouldFire → refused) can be scored now from A's own replay of 1,091 historical turns, without waiting 20 live dispatches; if B agrees, the shadow need not be installed (it also has no log cap, A §4).
- **What changes next, pending B:** (1) the paperwork gates catch no wrong claims; their retrieval value is nil on this record, which bears on the H3 week. (2) The biggest reach hole is concrete and buildable: the shelf never indexes handback/. A next lap could index the hand-backs of open and recent laps only (the index budget is tight; 515 entries already drop).
- OUTPUT → NEXT: changed — the reach hole is handback/, not the window, and the gates show 0 catches, so the next build is the shelf walk, not more gates.

## SCORE (librarian, 08:2x), with B's non-author read beside the three (`handback/p-d294read-B_2026-10-11.md`, git-blob c956e917…, 19,165 B; `4dffbea2`)
- **P1: FAILS. Mine, wrong.** Instrument in-stream share 10-03 → 10-11 is far below 25% on every reading: WRONG column 0 of 101 (all weeks); the week of 10-05 reads 4.5% lexically; gates 0 confirmed catches in 383 refusals (B re-derived E's rows.tsv byte-identical, and ruled all 3 borderline pairs NOT catches). "The gates moved catching in-stream" is wrong. B's bound, taken whole: any prevention is below about 1 error in 383 refusals (≈0.4–1.0 of the 20 dropped figures by base rate; the one checked was TRUE), and deterrence is unmeasured. So my "retrieval value is nil" at `:36` was too strong; the honest form is B's §4 sentence.
- **P2: the number HOLDS, the reason does NOT.** Same method, unpointed 96.55% ≥ 74.3% (B re-derived it). But my stated reason, the index window, plays no part in the same-method number: it moved because the dated record grew 11.6× and the pointer list 1.6×.
- **My OUTPUT → NEXT at `:36` is corrected by B (§2.3), and I take it:** "handback/ is the biggest hole" ranked by lines absent from the shelf, zero hops. One hop out, 751 of 1,007 hand-backs (76.8% of their lines) are named in `map/*.md`, every map is indexed, and the librarian Read 69 hand-backs in 14 days against 0 of the 515 dropped. The dropped 515 are the files no route reaches. And the two compete for one index budget (≈143 B an entry; 515 entries = 73,810 B already cut). **Build order: (1) the index budget itself, (2) the 256 hand-backs no map names, (3) not all of handback/.** Next lap: `loop/plan_shelf_index_budget_d296_2026-10-11.md`.
- **A's trailing reminder: REFUSED under its own bar,** scored by B from the replay: since 10-01, 326/341 = 95.6% wouldFire (Wilson 92.9–97.3%) ≥ 90%. The scoring switch (first 20 shadow rows → the replay since 10-01) was decided before any shadow row existed (the hook was never installed); it goes in the registration's dated foot once `dc45c56c` lands. What it decides is narrow (B §3.2): the state-dependent reminder adds no selectivity. A constant reminder's compliance effect is untested here. **`1b4cb7c0` does not land.**
- C's citation is `main.rs:7684-7689` (the `order` list), not `:7660-7665` (B). C's dropped set re-derives only on the original checkout (mtime filter); noted for whoever re-runs it.
- **Land:** E `c8f43c74 d76c3b56`, C `3479af25`, A `dc45c56c` (registration only), B `4dffbea2`, plus the four hand-backs and the three map lines. Evidence and docs only; no code. A js-suite is not needed for evidence-only commits; the ratchets are.
- OUTPUT → NEXT: changed — B's one-hop count reverses my ranking: the next build is the shelf index budget, then the unmapped hand-backs, not all of handback/.

## D294 CLOSED on landing.
