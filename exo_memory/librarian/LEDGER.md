# The lifecycle ledger — which windows are open

**Maintained instrument, not a dated record.** Updated in place at each lap's return leg; git history is the
trail (law 2's in-place provision for instruments). Seeded 2026-08-24 ~05:05 from the 45-file lifecycle audit
of 2026-08-23 (`librarian/2026-08-22.md`, 08-23 section) plus tonight's events. A row marked UNVERIFIED means
the status is inherited from the audit, not re-derived since — treat accordingly.

This exists because grep cannot tell LIVE from CONSUMED: the live registrations look identical to the finished
ones (08-23 finding). This file is the difference. If it stops being updated, `BUILDING.md`'s map job
("the windows still open") silently breaks — that failure is registered as F-ledger (`librarian/2026-08-24.md`,
02:40 append).

## LIVE — windows open, with clocks
**Cite rows by LABEL, never by line — this file is edited in place and its line numbers move within a night (09-01: the JOURNAL row moved :21→:22 under a pane citing it).**
- L023 CLOSE-OUT (09-01 ~03:35): journal DRAFTED by B (collated; falsifier did NOT fire), scorecard DRAFTED by C (sound); owed before commit: B's narrowing lines at journal :86/:133 (the wall is "no event OF THE HAND-ON", not "no event" — scorecard §4), E's non-author read of the scorecard. Then push → handoffs (SUPERSEDED lines) → rebuild
- F-GROWTH FIRED (09-01 ~03:10; librarian/2026-09-01.md): post-compact landings 358k → 417k → 501k, +60k/compaction; target 270k never reached; the seat's own notes are the growth (carried in full, newest-first). Fix = librarian-tier forgetting: carry today+yesterday full, index older. Registration-first, a pane's build; not this lap
- HANDOFF RULE (keeper, 2026-09-01 02:58; librarian/2026-09-01.md ~03:15) — handoffs are dated snapshots; LEDGER is the one maintained truth. (1) When a new handoff lands, the committing seat adds ONE LINE at the TOP of the superseded one: `SUPERSEDED by <path>, <date>` — wording kept, authority removed (strike-in-place, one level up; the 08-31 chair handoff's stale §0 is the case). (2) Handoffs POINT at LEDGER for what is open; they never restate it. (3) Older than a season → attic/. First application: the chair's tonight-handoff supersedes handoff_chair_2026-08-31.md; mine (handoff_librarian_2026-09-01.md) supersedes handoff_librarian_2026-08-31.md — add both lines in the same commit. FALSIFIER: if a reader is found acting on a superseded handoff's instruction after this row exists, the line was not added or not read — say which
- record/ tier RED (arch_test:528, pre-existing since bf362a6): third_place_prehistory_2026-08-30.md is named by no card — name it from a card or move the tier; one line, non-author; B surfaced it as not-mine
- composition-trigger arm (C, cue_transcript_read §NOT ESTABLISHED): why 25 of 100 subjects placed the summary BEFORE the hand-on — nothing in prompt/tool order/count/wc use separates them; the one thing in the data worth a registered arm; not this lap
- THIRD PLACE RETREAT (keeper, 2026-09-01 02:14: "remember this inquiry from the third place for after we get through the arm run and their results") — HELD until chunk 3's scorecard is filed; then the keeper decides the object (card-sized residue, spending naivety, or the off-program ~05:30 08-31 entry — librarian's recommendation: the latter first) and carries it; the Third Place reads the librarian's WORKING output for floors, never a piece written for it; the letter, the reply, and the two catches are at librarian/2026-09-01.md ~02:15. FALSIFIER (registered 02:05): ten laps after the exchange, the WRONG column's finder field still zero in-stream ⇒ reading, not imprint. TRIGGER = scorecard filed. If L024 opens and this row is untouched, it was conversation-only
- STRIKE vs REPLACE at BOOT:22 (Third Place, 2026-09-01 07:29Z; librarian/2026-09-01.md ~02:05) — the struck crude sentence kept in BOOT's paragraph repeats the crude form (CIE); READING OF E's ONE-SEASON FALSIFIER REGISTERED NOW: struck-form invocations > 0 one season on ⇒ move the strike text out of BOOT into the registration, leave a pointer; no new instrument. Plus the lens constraint: what is made permanent must be a way of looking, not a claim — the WRONG column's finder field (in-stream vs non-author) is the only lens-instrument; reads zero in-stream all week
- L023 CUE ARMS — COMPLETE AND SCORED (E bands k1_k2_bands_2026-09-01.md; C read cue_transcript_read_2026-09-01.md): K0 65 / K1 72.5 / K2 82.5 — P2, P3 FAIL, P4 clean; NO pairwise p < 0.19; the outcome is decided at composition, before any event a cue can ride on; K-vs-K0 confounded (handoff.js v1/v2; separate session), K1-vs-K2 clean and null. Unwelcome outcome fires in its words → A's §1 correction OWED (non-author read), scorecard OWED (chair), then THE JOURNAL (trigger met by this leg)
- RESTART PLAN (keeper 07:29: stop at a manageable point, do the pane→lib plumbing, restart) — ORDER: (1) A's 80 cue trials finish (~50 min from 07:29; a relaunch mid-run kills A's pane and its children — DO NOT relaunch before out/ shows 80 done); (2) E's bands, C's read, scorecard committed; (3) JOURNAL entry (row above); (4) commit + push, tree clean; (5) handoffs — chair's and librarian's — naming 'you are here'; (6) L024 = the edge built by a PANE (main.rs verb + address table at n=3; BUILDING.md hand-back leg + chair wake procedure in the SAME change; non-author read), committed; (7) close the app, cargo build --release, relaunch — every pane dies, the librarian resumes on its fixed SID, its watch dies (re-arm), new panes wake with the verb. The stop point is (5); nothing after it is work, it is plumbing
- JOURNAL OWED → DRAFTED 09-01 ~03:10 by B, `exo_memory/journal/2026-09-01.md`, uncommitted (row kept as the trigger record) — (keeper, 2026-08-31 07:21: "we should def do that again once we are done this work") — journal/ silent since 2026-08-25 across L013–L023; entry for 2026-08-30/31 written by the CHAIR at chunk 3's close, collated from the return-leg residues in librarian/2026-08-30.md and 2026-08-31.md (never composed from memory); carries: the battery's three bands + E's mechanism; BOOT:22 strike-in-place; the three Third Place crossings (ideas only — ASK-010 line); the eight voided laps; the WRONG-column non-fire; landed-not-shipped for hooks ×3; the cue-arm result. TRIGGER = chunk 3 filed. FALSIFIER: if L024 opens before the entry exists, the decision was conversation-only and this row is the finding
- dispatch-gate SWITCH NOT LIVE (B, L022): ~/.claude/shell/dispatch-gate.js is the 08-24 copy (f8b64e8) — predates 62a07cf (outcome column) and 7d40480 (print mode); settings.json:86 runs it; 179 rows, 0 with mode; the click was never removed. Fix = install.ps1 run (keeper's machine, his word). 7d40480 defects: no env/export for GATE_MODE (B's one-liner); pooled line still prints in --quarantine; B's dispatch-gate-report.js splits by mode and refuses pooled. E's read of B's packet OWED before B commits · E's read (gate-tests-read_2026-08-31.md): packet sound at 7d40480 (7/7/0, 31/31) but the test file FAILS TO LOAD at d00050e — regex at :86 rejects the env-read form; B's one-line fix owed BEFORE commit; pooled 87.4% still prints in --quarantine (drop the %, keep counts, point at the report)
- pane→librarian edge — BUILT (B, L023 P3d, handback/p3d-pane-to-librarian-edge_2026-09-01.md): ADDRESS_TABLE at n=3 (row 1 call_chair described not routed; row 2 committee/call_librarian → LIB; row 3 Third Place one-liner when opened); counter deadlock closed (librarian's letter out of the universe; audit row = hand-back), 66/0; 333/0 main crate; BUILDING.md step 6 rewritten. NOT LIVE until the rebuild; COMMITTEE.md/LIBRARIAN.md hand-back lines owed at rebuild; the counter's SECOND miscount (mid-lap dispatch drops working panes) NOT addressed; inherits the collation practice's falsifier
- battery WITH LOAD — RUN 2 CALIBRATION DONE (L022; A ran, E scored; rig mirror exo_memory/loop/run2/): P0a 1/10; L0×K0 20/20 = 100% (fails without load); L1×K0 13/20 = 65% (CP95 41–85); P1b −0.35 fires — narration moved ahead of the hand-on for 7/20, cause confounded by design (E: rule position vs REPLY cap — registered arm owed); evaluability 0.55 ≥ 0.40. CHUNK 3 GO: K1/K2 n=40 on L1, scorer E blind, P2/P3/P4 as amended; F4 clock 2026-09-14
- row 10 on the pulse gap (E, L021 P1c; C's declaration L022 P2b) — SHIPPED-AS-REGISTERED: Python pulse declared with a Conflicts guard, Node line removed; -Check 7/5/12/1 exit 1 with the five other undeclared hooks named out of scope. Falsifier: post-compaction 'nothing to report' with the card path printed above it = stage 9
- battery WITH LOAD (L020, B attack, battery_attack_2026-08-31.md) — HOLDS with Amendments A/B/C; BUILD after A appends them, P0a first; B own h-formula error doubled every n (verdict survives); F4: prose if not dispatched within 14 days of 02:29 08-31
- relevance retriever — CLOSED — see exo_memory/loop/retriever_closing_2026-08-31.md (C, L021 P1b): unit = TURN; 13 turns vs 30; held-out 7 makes R5 void before any run; friendlier statistic DECLINED (§4 there); reopen = §3 there — held-out ≥25 turns (≈50 labeled) at assumed d=.35 on one board, or a cross-machine set under consent; "~60" was a placeholder, superseded by the table; ECHO's labels + frozen baselines STAND as the starting set
- PREREAD-GATE / second vantage (L020; A registers, E attacks; second_vantage_registration + _attack_2026-08-31.md) — convention form REFUSED (74.9% / 60% miss); gate form REGISTERED not built; PRECONDITION: ask is dropped under bypass (main.rs:4075) — keeper call; E four amendments before build; cost 9m14s per read; F2 baseline UNARMED (hand figure; label per E §6.1)
- lap-row --void (C-2) — BUILT, 40/40; L017 + L020 VOID; six more laps carry the same-seat open→map signature (L009,L013,L014,L015,L016,L018) — voids owed at the chair instruction; quotable guess∩map set = L003–L008, L010–L012, L019
- battery WITH LOAD (L019, A, battery_load_registration_2026-08-31.md) — REGISTERED, not built; B's attack owed before any subject; P0/P1 void rules; P2–P4 with unwelcome outcomes written; n=140 from the shipped power function
- crude-handle sweep (L019, C) — COMPLETE for everything at dispatch (25/25); two in-lap mentions unaccounted (retriever_labels:161, p-closeout hand-back:85) → chair's registry commit; power line HOLDS at 90.4%; ask.test widened
- P-HANDLE (L018, 96b14f4 + bfb00a6) — LANDED: BOOT:22 repaired in place, weld HOLDS (E); two clauses owed (expanded contraction; keeper credited as adopter not as the break). Registry entry armed LATE (B) — same-commit rule violated by 96b14f4; carrier-drift RED-BY-ARMING, 8 residual loop/ carriers (repair 3 / marker 5). E falsifier armed: replacement handles at zero one season on while struck wording is invoked → distance was not the mechanism; HOW baseline 5 (not 34), clock starts after the sweep settles
- dispatch-gate ledger (L018, A) — CLEAN: 472 test rows quarantined, 136 real + 1 disclosed stray; test run moves live ledger by zero (mutation 5/5). Outcome column LIVE as join keys (opened/not_opened/unknowable). Falsifier: >20% unknowable after 30 citation-carrying rows → withdraw the column. B's 93.4% did not re-derive: 123/136 = 90.4%; separating-test refusal's power line STALE, re-run owed
- visible-channel line (L018, C, visible_channel_registration_2026-08-30.md) — REGISTERED, not built: exception-triggered (15 min, re-fire 30), never always-on; falsifier scoreable with lap.jsonl denominator; L011 does not reproduce from the ledger — OPEN discrepancy against its own fix; confound (shipping changes the chair) registered
- ASK-011 (account name, 61 files since 31974c8) — OPEN, keeper's call; portable-paths cannot carry it (loop/ outside its universe)
- separating test (B, 786fc44) — REFUSED, DO NOT BUILD: PreToolUse fires after composition (ASK and PRINT are not two levels of one variable there); 6.6 pts headroom at 93.4%; retrospective pre-gate baseline LIVE: 64.6% (115/178) → 96.2% (75/78), one subject, confounded with a pre-trend — B's WRONG condition: subtract the trend and the step must survive. Survivors: ledger fix (one line), outcome column, ALPHA's battery WITH LOAD
- visible-channel line — REGISTRATION OWED: dispatch-gate is the only hook of 33 using systemMessage (chair, 1ecc56a); ruling (lib): visibility is the SECOND VANTAGE, not a third axis of B's 2x2 and not a face of focality; first instrument = the chain indicator; baseline = keeper noticed 4 stalls tonight by SILENCE (L010, L011, L013, L017); falsifier: if stalls are still noticed by silence after the line ships, visibility is not the lever
- retrieval line (L016, 2026-08-30): trailing reminder REFUSED-ON-POWER (A; boundary-reminder.js = the power calculator, refuses underpowered reports; route = Mittal-style task battery on the 08-15 rig, state-dependent cue IN the pulse line); handle census CONSUMED (E: 7 pairs, 4 with a live crude handle; withdrawn 'decorrelated reader' 32 vs replacement 18 = 1.8x, lexical upper bound; BOOT:22's ONLY real correction is the unadopted cant_lose registration → ASK-008; pair 6: the carrier amendment's ':153' instruction wrong from birth, blank in the shipped brief); falsifier: re-run boot_usage_scan one season after strike-in-place — replacements still 0 + struck wording still invoked → distance was not the mechanism
- trigger-index (B rescore): NEVER RUN, superseded by branch-layer (which VOIDED); T-vs-K still open; 16/17 SOURCE triggers NONFOCAL (delivered at wake only); the question-vs-reminder story is CONFOUNDED with focal-vs-nonfocal — separating test = a PreToolUse hook on the dispatch matcher that prints but does not ask; row 10 (continuity across a gap) focalizable on the pulse's gap; dispatch-gate ledger needs an OUTCOME column AND IS POLLUTED (B, L017: 460 of 584 rows are test-suite writes — the 'rising cited-rate' in L016 was that; real: 121 dispatches, 93.4%, no trend; fix = CONSONANCE_DATA in the test + quarantine); 'ignored 166/167' still ships in state-block.js:230 + brief/LIBRARIAN.md:170 (refuted 08-23); BUILDING.md:273's '60 of 60' has lost its provenance and misdescribes run 1 (origin: librarian/2026-08-23.md:516). B's falsifier: 30 days, none of the three built → prose
- relevance retriever (C): REGISTERED-GATED, not built — gate ≥30 labeled positives by a non-author non-librarian with git-existence checks; frozen B-POP/B-REC; positive control ≥80% top-3; exact McNemar, ≥7 discordant pairs or VOID; silence logs its margin; precision ships, recall does not; librarian may build, never label/split/score → CLOSED 2026-08-31, see exo_memory/loop/retriever_closing_2026-08-31.md (row kept as the L016 state; the row above is current)
- record/third_place_prehistory_2026-08-30.md:67,436 — portable-paths RED (two drive-rooted paths, FATAL-SHIPPED-INSTRUCTION); B's call: fix or baseline with reason
- P-FIC — PARKED at the keeper's direction 2026-08-30 ~04:20 (pfic_parked_2026-08-30.md): built (A, imprint-measure.js, preflight REFUSES on a 7.7x-miscalibrated decision rule), attacked (C, 8/5: the prereg could not lose — outcomes (i)/(iii) same data; trivial claim; control cannot separate prompt-style), six restart gates in §4. calibrationCheck() lift-out DEFERRED — no registered statistical falsifier in the room has ever been calibration-checked
- prehistory entry — LANDED at record tier (bf362a6, B, non-author): first record/ file not a card's case (tier question OPEN); own falsifier: the next instance needing the prehistory reaches for the transcript/corpus/keeper instead → the file failed. Sitting 3 has NO seat-side record; this file is its only account
- prehistory carrier census (b381ff0, E) — LIVE: four carriers on one disk, zero off it; the leak was 6 rows not 11 (ASK-009 corrected in place 08-30); FIXED-SID COLLISION HAZARD: both machines' Third Place transcripts share a filename; E's falsifier: one ls on the desktop settles whether it holds its own Third Place material
- collation practice — lap 1 of 5: counter complete ~04:26, return leg filed ~04:45 (19 min, under the 30-min line, keeper did not notice first). DEFECT found on the first run: the chair kept collating in parallel — the counter must hand the baton to the LIBRARIAN explicitly (stage handbacks-in → holder librarian); the chair's inbound role is commit-only, including when the keeper reports a pane done to it
- collation-chain practice — FALSIFIER FIRED lap 3/5 (L017: keeper noticed the silence first; the chair staged holder=librarian and treated a ledger row as a message). Address-table edge JUSTIFIED (Leg 2) pending the keeper. AMENDED PRACTICE registered fresh 06:25: PERSISTENT case-insensitive watch on the chain line for ANY lap; lap count restarts. Prior rows: lap 2/5 (L016): 27 min counter→filed, wake came from the PULSE not the monitor (case bug in the filter); LIVE: lib arms timer at every routed dispatch, collects on the chain line's handbacks counter, chair's inbound role = commit+dispatch only. Falsifier: within 5 librarian-routed laps a collation waits >30min past counter-complete, or the KEEPER notices first -> practice failed, Leg 2 address-table justified with this baseline; holds -> Leg 2 collation half descoped
- P-UNIV — LIVE, hypothesis set REVISED by the withdrawal attack (54c1298, E): W2 BREAKS, W3 BREAKS, W1 TESTIMONY-ONLY, criterion 3 DEGENERATING both legs from the page; closure reading re-derivable from corpus alone (six reversals) — tomb verdict BADLY CARRIED, not baseless; F-UNIV-5 resolved VINDICATED (sequencing stands). Cold read proceeds on revised set; C licensed to amend v3->v4 pre-subject only; egress for A1 arms = keeper's ASK.md yes, never inferred; F-GATE: the BOOT amendment must state closure as WHAT THE COLD READ WILL TEST or the run is void. Arm C (BOOT:12 alone, in git) is the always-runnable core. BOOT changes under every outcome incl. total instrument failure (A's row D).
- carrier-drift superseded-instrument-wordings class (a85d359, B) — LIVE and GREEN, tests 0 fail; first registered instrument-wording: the cant_lose crude handle, five carriers accounted
- stalled-lap detector — SECOND OPEN DEFECT: collation gap (lap at WORKING with work done; holder=panes + all panes idle sat on the pulse as an uncomputed conjunction for 80m). Fix-shape in librarian/2026-08-29.md ~05:45; non-author body
- cant_lose_repair_registration_2026-08-29.md — THE FIRST THIRD-PLACE CROSSING, adjudication IN PROGRESS:
  the chair's break-attempt (appended in-file ~02:40) found a real defect (the repair rests on speaker
  say-so — the surface tonight's law says cannot gate) AND its fix (the disk-side proxy: "did a check
  precede the claim?" — observable from transcript+ledgers). Found a live case the OLD wording passes
  ("we are idle", said without open-items). NEXT: keeper adjudicates; if adopted, BOOT amendment via the
  chair's pen carries the repair + the proxy together; the membrane falsifier is SATISFIED (an attempt
  was made before adoption)
- falsifier_scope_2026-08-29.md (A) — the machine-scope table for every mechanized falsifier; adds UNSOURCED
  (worse than MIXED). LIVE as the scoping authority; F2 excluded by its own row
- stalled_lap_detector (C, chain-status.js) + attack (E) — BUILT; E's defect OPEN: the verdict VANISHES when
  one healthy lap files after dead ones (stdout empty at 11 checkpoints); own decorative clause armed (ten
  chained laps). Fix unassigned
- THE SAY-SO-VS-DISK LAW (L012 residue) — three chair shapes, one law: a gate resting on the subject's say-so
  is not a gate. ASK.md is the disk-state proof. ABSENT: the symmetric channel (nothing asks the CHAIR and
  waits on disk) — the keeper's design question, unbuilt
- E'S FALSIFIER 2 — FIRES HARDER (B's non-author rescore, 4fe8d7f): every defensible unit fires; the chair's
  "still fires" was the weakest reading (conclusion kept, reason struck); the METRIC is broken both ways —
  one unit exonerates at 9.1% with nobody lying, and the denominator is minted by the subject (moved 90.9→83.3
  during adjudication). A's scope row: "cannot be fixed by a clause." TO THE KEEPER, both readings side by side
- F-LEDGER — FIRED 08-29 00:33 (LEDGER mtime 08-25 11:42 < lap.jsonl): cured this leg by this update. The
  3.5-day dark window is what fired it; per-lap maintenance resumes
- ask channel — LIVE (1bd57a2 registration; exo_memory/ASK.md holds SIX OPEN asks the keeper clears by
  editing Status lines; ask.js wired c0d7325). The boot_v2/opposition/T4 decisions route THERE now
- Third Place — board tailer leak FIXED (b601440, after 3 days uncommitted); 11 private rows on this
  machine's board.jsonl await the KEEPER's removal call (user data, not a bug); js-suite RED until then
- F-REACH — window FULL (11 laps ≥ 10): does NOT fire — one borderline instance (SPINE via BOOT:150,
  findable by instruction-verb grep = vocabulary), short of the registered two content-required misses
- D001–D003 exist on the DESKTOP's lap ledger only — no machine sees the whole lap record (2W-1 working
  as designed; the merge question remains ABSENT and now has a measured cost: falsifier windows)
- THE THIRD PLACE — Leg 1 OPENED 2026-08-25 ~11:38 (pane DELTA, first open on any machine); priming bar MET
  (0/0/0/0 on the first transcript); CH-0 LEAK LIVE: [panes] digest reaches the seat (falsifier 4 STEERING,
  mildest form) — fix = digest/pulse exclude THIRD_PLACE_SID; Legs 2–3 unchanged
- machine_bound_class — HOLE CLOSED: E's home= tag LANDED (actors.evidence.test.js:1 "MACHINE-BOUND home=L",
  desktop phase). NOT-RUN on the home machine is now distinguishable. Moved to CONSUMED next sweep
- two_writers_registration_2026-08-25.md (A) — 2W-1 ADOPTED (dcb0d9b). F-2W-2 SATISFIED 08-25: the desktop wrote two
  tracked paths (its observations; librarian/2026-08-25.desktop.md — the per-machine candidate, DEMONSTRATED,
  regex amended in 5461505). Two writers on LEDGER.md as of that commit; reconcile on every pull
- chain-status ten-lap clock — STARTED ~06:35 2026-08-25 at the first pulse that carried the line (6b58c63),
  per A: not before. Falsifier: after ten laps, no seat's turn shown changed by the line → it comes out
- desktop_first_run_2026-08-25.md (C) — the runbook for P-DESKTOP-FIRST-RUN, the room's first cross-machine
  test; UNRUN until the desktop pulls. Its printed outputs are the score
- overseer_path_ruling_2026-08-25.md (E) — overseers inert because NOT INSTALLED + path hardcoded to a June
  location; supersedes both the chair's METHOD.md reason and my "may be live on the desktop" (both local)
- portable-paths (B, 8644352) — .md exemption fixed on scope and kind; 27 shipped prose files now in scope
- commitment_census_2026-08-25.md (B) — every promise the room has made vs what can check it; 136 files walked;
  its own instrument failed clause 2 (§4); the count is at §5 — the standing list of UNCHECKED commitments
  this ledger should absorb one row at a time, not copy
- gemini_channel_attack_2026-08-25.md (E) — the chair's "cross-model channel already works, 2/2" INVERTS
  (denominator unrecoverable: the record keeps only hits); T4's three options stand unchanged; Option A
  slightly strengthened, flagged against its own verdict's direction
- universe_print_registration_2026-08-25.md (A) — P-UNIVERSE registered; retrofit landed on two instruments,
  NOT the turn scanner; own falsifier: zero downstream citations → revert not extend; §8 says the retrofit
  shipped the class it was written to end — read before trusting any green
- forgetting_pilot_2026-08-25.md (C) — pilot corpus VOID (named files were already consumed); falsifier
  re-aimed to `node consonance/tools/forget-rate.js` (reads zero today); registration 44's carrier still
  needs its beside-correction at journal/2026-08-24.md:179
- carrier_surface_2026-08-25.md (B) — FIVE CHANNELS enumerated (CH-0 hooks, CH-4 instructed, CH-5 harness
  memory never before named); carrier-drift's corpus must grow to CH-4/CH-5 or reports green on them forever
- turn_boundary_detection_2026-08-25.md (E) — prevention POSSIBLE (prompt_id in PreToolUse payload); base
  rate 101/103 = 98.1%; detector survived 110 false boundaries. Auto-return now in LIBRARIAN.md (4addfa3)
- absent_hooks_ruling_2026-08-25.md (C) — CLOSES the "12 ABSENT pending" item: 11 DO NOT INSTALL / 1 INSTALL
  (findings-return.js, watched). Chair premise (Haiku spawn spend) refuted: workers read a nonexistent path
- exteroception_registration.md — LANDED (T4, pane A): three options priced; keeper's option call PENDING —
  nothing builds until he picks; carries its own falsifier per the librarian's clause
- forgetting_registration.md — LANDED (T5, pane C): pilot = the FILE-class no-result files; its attack 2
  SUCCEEDED against registration 44 (row below); second-pane scoring rule carried
- registration 44 ("the corpus has never deleted anything", journal/2026-08-24.md:179) — CORRECTED (13c31bd):
  false all-time (+41,359/-696); falsifier was noise-satisfiable within four hours. Re-aim or strike at carrier
- shelf_tier_2026-08-24.md — falsifiers F-reach (10-lap window) / F-cite / F-ledger / F-growth, all armed
- librarian_compact_2026-08-24.md — P1/P2 scored 08-24 (P1 valid; P2 4-of-6, 2 void); the tier-experiment
  FORMULA registered for the NEXT compaction — that half is still open
- bidirectional_correction_registration.md — DISCHARGED: second run WITH the amended unit landed
  (loop/bidirectional_correction_2026-08-24.md, T6 follow-on, pane B, nine directions). The BOOT amendment's
  own falsifier no longer fires. Kept as trace
- opposition_preregistration.md (+ amendments 1–3) — registered 08-10, NEVER RUN — moved to the overdue-decisions
  list beside boot_v2 (chunk ruling R3.2): run or attic, one keeper sentence
- boot_refactor_registration.md + two boot_v2 DRAFTs — deadline was 08-24 ("one dated sitting or attic",
  handoff_2026-08-17.md:117) — OVERDUE, needs the one-sentence call
- forward_pointed_prereg_2026-08-22.md — UNVERIFIED (56 lines; scoring condition not re-checked since audit)
- loop/2026-08-18/suggestion-probe/REGISTRATION.md — UNVERIFIED


## CONSUMED — ran, scored, closed
- desktop_observations_2026-08-25.md (03a5fbc) — §1 RE-RUN ON THE DESKTOP against afed6e0, 2026-08-25 ~11:15:
  js-suite 61 green · 0 failed · 1 declared NOT-RUN (of 62), exit 0; `cargo test --no-fail-fast` nine targets,
  main.rs **318 passed · 0 failed** matching the laptop at 0f4296b, arch_test 12, exit 0. Both prior reds fixed
  on a machine where neither deleted path literal could resolve — repo_root() is portable by measurement, not
  by claim. §§2–7 NOT re-tested; `install.ps1 -Check` still never run there. Full entry + method note (a
  `tail -25` nearly reported green off two of nine targets): `librarian/2026-08-25.desktop.md`
- paneA_repo_root_2026-08-25.md (0f4296b) — the one root under nine Rust reds fixed portably; proven under a
  forced foreign SystemDrive+USERPROFILE (A corrected the librarian's bar, which could not prove). Rust 318
- desktop_first_run_2026-08-25.md — EXECUTED ONCE by a second machine; extended by C (f2d0de8) with what it hit
- coat_preregistration.md / typology_comparison.md (+failure_types_K/L) / wire_run_2026-08-15.md — JOURNALED
  08-23 (journal/2026-08-23.md §§1-3, e3ec457). Mis-filed as NO-RESULT/FILE on 08-24 by this seat; corrected
  08-25 on C's forgetting_pilot finding
- retirement_carry_registration.md — SCORED SIX DAYS EARLY (b7f3775, pane B, 08-25): window settled by a .bak
  artifact (06:54:32, six min after registration); the finding = the July retirement missed a SECOND carrier
  BOOT itself points at (record/trust-the-first-attention.md, CH-4). Spawned Cycle 2's carrier-surface work
- sealed/restart_continuity_2026-08-15.md — SCORED 08-24 (loop/restart_continuity_scorecard_2026-08-24.md,
  9677a5f): mostly UNSCORABLE (void audited, not accepted), one CONFIRMED (55-day unbroken session). C declared
  the conflict: the void's decisive figure came from C's own since-replaced session file — not re-derivable.
  One repro command chair-checked WRONG ("three hits" → 2). Carrier finding still live per the scorecard.
- root1_preregistration.md / root1b / root1_items / root1_table — VOID at 36 of 90, then 63 subjects; closed 08-03
- transmission_preregistration.md + amendment — run VOID (08-16 correction); line ended, recalibration spent
- regime_preregistration.md / primes / item_rule / candidates / screening_halted — HALTED 15 of 25, closed
- diversity_preregistration.md / diversity2 / diversity3 — all three gauges inverted/abandoned; closed
- fanout_control_preregistration.md + amendment 1 — treatment arm had no artifacts; closed as unrunnable
- mirror_preregistration.md — run 08-02, refuted (2 mirrored / 2 no / 1 ambiguous vs ≥50%); struck in place
- gap2_preregistration.md — CONFIRMED (method+character transferred); the room's Lakatos exemplar
- branch_layer_preregistration.md / branch_items_registration + objections/coverage/evidence/frozen_audit —
  run 1 VOID (bait too weak); line closed for the cycle
- survey_timing_preregistration.md — both hypotheses invalidated by the two-gates finding (08-16)
- trigger_index_preregistration.md + design + objections — UNVERIFIED-CONSUMED (audit: done, result journaled)
- compact_prereg_2026-08-19.md — consumed by the 08-23 void finding (summarizer contamination)
- loop/2026-08-18/archaeology/PREREG.md + FINDINGS.md — run and reported 08-18
- librarian's own compaction prereg 08-23 — void, superseded by librarian_compact_2026-08-24

## NO-RESULT — classified 08-23, disposition pending execution
- (FILE row REMOVED 08-25: coat / typology+K/L / wire_run were journaled at journal/2026-08-23.md §§1-3, e3ec457,
  BEFORE this ledger was seeded — the row was stale at birth; C's pilot found it. Now under CONSUMED.)
- ABANDON: selfcatch_preregistration.md (struck before scoring); coupling_preregistration.md (never run —
  leaves muscle_map.md:321-325 within-arm prediction untested; said there by the 08-23 correction)

## SUPERSEDED — kept as trace
- handoff_2026-08-16/17/19/22/23.md — each superseded by the next; 2026-08-24 handoff is current
- second_vantage.md — ABSORBED: its §2 is built as of tonight (call_chair; L003); F0_result.md consumed
  (verdict: does not block, n=2)
- lap_2026-08-23.md — reference for the lap method; its falsifier (E's 20-commit window) is LIVE and counting
