# Handoff — the librarian seat, 2026-08-30 ~06:40, written before its own compaction at the keeper's ask

**Who reads this:** the librarian (Anamnesis) on its next wake, and the chair. Notes are the master
(`exo_memory/librarian/2026-08-30.md`, ~06:25 is the last leg); `LEDGER.md` holds every open window;
`ASK.md` holds the keeper's pending calls. **This file points; it does not copy.** After compaction:
ask the chair for the current inquiry, open LEDGER, then this.

## STATE, verified at write time
- HEAD `27b307a` == origin after the push at 06:35 (keeper's word; twenty commits, the whole night).
- No open lap. 17 laps filed. All five panes idle. Tree clean except this file.
- **A persistent counter watch is ARMED in this seat** (Monitor task `b1fc9fv4d`): polls the chain line
  every 45s, case-insensitive, emits when any lap's hand-backs complete. It survives compaction; the
  memory of it does not — that is why this line exists. If it is gone (`/tasks`), re-arm before any dispatch.
- The collation practice's falsifier FIRED on lap 3 (L017, keeper noticed silence). Amended practice
  registered 06:25 (persistent watch); its five-lap count restarted at zero. The pane→librarian wake
  edge (Leg 2, address table) is JUSTIFIED by that firing — keeper's call on timing.

## THE OBJECTIVES, in the keeper's order (06:34: "push, then 2 and 3 after, in chunks")
1. **PUSH — done** (06:35).
2. **ASK-008 — the cant_lose repair into BOOT:22.** Keeper's yes/no. On yes: P-HANDLE as strike-in-place
   handle replacement (repaired wording in the bold position; trace inside the strike, never bold, never
   in the handle slot — E's census §4 corrected the research file: BOOT already quotes crude wording in
   italics/backticks; the whole problem is the bold slot ABOVE the amendment). Then B's registry sweep
   red→green on the five carriers. Non-author checks the weld. Then arm P-UNIV-COLDREAD's arm C on the
   repaired handle as the measure. **E's census: BOOT:22's ONLY real correction is this unadopted one**
   (`BOOT:127` is NOT a correction pair — my L013 showcase was wrong).
3. **THE INITIATION PROBLEM, in chunks.** `lap-row --report`: 15 of 17 laps keeper-initiated (88.2%);
   E's falsifier 2 fires again. Inbound collation now runs without the keeper; STARTING work still does
   not. Chunks, cheapest first, each with its falsifier already written by a pane:
   - 3a. **Ledger pollution fix** — `dispatch-gate.test.js` spawns the real hook without `CONSONANCE_DATA`;
     460 of 584 live-ledger rows are test writes. One line + quarantine the file (never delete; 121 real
     rows). Any pane. (B, `separating_test_registration_2026-08-30.md` §0, §6.1)
   - 3b. **Outcome column** on `dispatch-gate.jsonl` — what the human returned to an ask, and whether the
     re-attempt carried a citation. One field. (B L016 §5c, L017 §6.2)
   - 3c. **Visible-channel registration** — "cues the human can see" as its own line (NOT a third axis of
     B's 2x2; ruling in notes ~06:25: visibility is the SECOND VANTAGE). First instrument = the keeper's
     chain indicator (`chain_indicator_idea_2026-08-30.md`). Baseline: keeper caught 4 stalls tonight by
     SILENCE. Falsifier: stalls still noticed by silence after the line ships → visibility is not the lever.
     Constraints: must change with state; must say when stale.
   - 3d. **Battery WITH LOAD** — ALPHA's survivor with B's condition: three cue conditions on a fixed task
     battery, fresh subjects, the 08-15 rig, tokens not days — and the task must carry load or it
     reproduces run 1's 60/60 ceiling. Registration before build.
   - 3e. **Row 10 on the pulse gap** (continuity across a gap, the one SOURCE trigger cheaply focalizable:
     the pulse already prints the gap; one condition). (B L016 §4.1)
   - 3f. **The address-table edge** (Leg 2) — justified; keeper's timing.
4. **Consumer version — NOT YET** (keeper, 04:13). The consumer baseline is recorded in notes ~04:20
   (39/17/3 of 59; gen-brief refuses the generated BOOT) for the day it matters. Retrieval first.

## STANDING GATES AND CLOCKS
- ASK.md: 007 (cold-read egress), 008 (cant_lose), 009 (SIX rows — corrected), 010 (third_place tracking).
  `ask.test.js` is RED on 007–010 because its provenance regex accepts only cron-log sources
  (`ask.test.js:253`) — over-fit to the first six asks; widen to `path:line` or sha, keep bare paths red,
  mutation both ways. D001's instrument; routed, not touched.
- `record/third_place_prehistory_2026-08-30.md:67,436` — portable-paths RED (two drive-rooted paths); B's
  call, fix or baseline with reason.
- P-FIC PARKED (keeper); restart gates in `pfic_parked_2026-08-30.md` §4; `calibrationCheck()` lift-out
  deferred — no registered statistical falsifier in the room has ever been calibration-checked.
- P-UNIV: withdrawal attack consumed (W2, W3 BREAK; W1 testimony-only; criterion 3 degenerating both legs;
  the closure reading is re-derivable from the corpus — tomb BADLY CARRIED, not baseless). BOOT:12
  amendment ready to draft on that ground (verdict → trace + E's reversal table + F-GATE wording); C may
  amend the prereg v3→v4 pre-subject; egress = ASK-007.
- The "60 of 60" sentence (`brief/BUILDING.md:273`, cited by `dispatch-gate.js:8`) is MINE from 08-23,
  shipped without provenance, misdescribes run 1: strike or restore the parenthetical.
- "ignored 166/167 times" still ships in `state-block.js:230` and `brief/LIBRARIAN.md:170` — refuted 08-23.
- Retirement-carry scores 08-31 (consumed early; check nothing else is due).

## WRONG COLUMN, this seat, tonight: +12 (lifetime 41)
Consumer sequencing inverted (keeper); "fourteen months" (keeper); three + six citation slips (chair, B);
prereg that noise passes (chair); the amended prereg still couldn't lose + the control set (C ×2); "exactly
one place" (E); "first focal cue" (B); the 60/60 sentence (B); BOOT:22↔:127 not a pair (E); the "all three
CIE counts" overclaim (E); ASK-007 provenance (suite); the polluted-ledger figure carried (B). Every one is
proceduralized in the notes. The through-line the keeper named and I confirmed: zero of them were caught
in-stream by this seat; all by a non-author. That is the routing thesis and it held all night.

## DOUBLE-CHECK FINDINGS (06:45, at the keeper's ask, different instruments than the first check)
- **Two tracked, PUSHED files carry the account name and hostname**, in a public repo:
  `loop/prehistory_carrier_census_2026-08-30.md:30,43,55,83,114,146` (`C:\Users\zackn\…`, `ZachsLEGION`)
  and `loop/univ_coldread_prereg_2026-08-29.md:266` (`/c/Users/zackn/.claude/CLAUDE.md`). The room's
  own rule (B's prehistory entry states it: no absolute path carrying the account name) — violated by the
  census that is ABOUT privacy. Routed to the chair for the authors: `~`-relative paths, "this machine"
  for the hostname. The exposure class is pre-existing (`nname` in 9 files, 08-22 §12), which lowers the
  marginal harm and does not excuse the additions. **My process miss:** I pushed at 06:35 without running
  the leak scan my own 08-23 merge bar names (bar #3). Pushing under the keeper's word does not waive the
  scan; next push runs `gen-consumer --dry` first.
- **`gen-consumer` REFUSES to generate the consumer tree** — one MACHINE leak survives its rewrites:
  `record/third_place_prehistory_2026-08-30.md:222` (`OneDrive/Desktop/FIC/`). Same file carries the two
  DRIVE paths at :67,:436 (portable-paths RED). Three portability hits in one file; B's, one edit.
- **Suite at HEAD: 61 green · 5 red of 66**, every red owned: actors.evidence (ASK-009, keeper);
  ask.test (provenance regex over-fit, D001's instrument, routed); carrier-drift (census growth — new
  carriers of the registered wording since B sealed it, incl. the Third Place's notes; non-author
  disposition); gen-consumer (the :222 leak above); portable-paths (:67,:436 above).
- **open-items flipped an item back to OPEN:** `research/the_retrieval_problem_outside.md` and
  `record/third_place_prehistory_2026-08-30.md` are in the bundle globs but ABSENT FROM THE BUILD — a
  fresh room never reads either until a rebuild. Tonight's two most-cited new documents reach no waking
  seat yet. The plan's "one rebuild when convenient" now has a concrete cost.
- **The watch's liveness cannot be proven from disk** (Monitor tasks write no output file until they
  emit, and no lap is open, so no emission is expected). The tool confirmed `b1fc9fv4d` armed and
  persistent; the keeper's `/tasks` is the check. If absent: re-arm (case-insensitive, any lap).
- Git: clean, 0 unpushed, HEAD == origin. Handoff paths verified to exist (`LEDGER.md` =
  `exo_memory/librarian/LEDGER.md`; `dispatch-gate.jsonl` = `C:\Consonance\data\dispatch-gate.jsonl`).

## WHAT THE NEXT WINDOW OWES, in order
1. Confirm the watch (`/tasks`); re-arm if gone.
2. Ask the chair for the current inquiry (post-compaction rule).
3. If the keeper has cleared ASK-008: P-HANDLE map, then the return leg when it lands.
4. Chunks 3a–3e as the chair dispatches them; the return leg at this desk for each.
5. Keep the second vantage BEFORE delivery: every map from this desk gets a non-author read before it
   reaches the keeper. That is the retrieval fix that has evidence; the handle work is hygiene.

*A trace to re-run, not a doctrine to believe.*
