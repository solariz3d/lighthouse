# Lighten the load, part 4: the baseline, frozen — seat A, 2026-10-09 (D277). Nothing was changed except new files in the evidence folder.

Plan: `exo_memory/loop/plan_lighten_the_load_2026-10-09.md`, part 4 and H3. **H3 is reverted if (b) after the change is worse than the pre-gate 4.9% by more than its 95% interval.**
This file freezes the "before" side of (a)–(d). Every figure is a line of a program's output, kept in `exo_memory/loop/lighten_baseline_2026-10-09_evidence/` (the folder; call it `EV` below).
Frozen at ledger cut **2026-10-09T17:27:07Z** (the newest `lap.jsonl` row when I ran it; `EV/baseline_cut.txt`).

**Reading order for the keeper:** the four measures in one table, then, under each, what must hold or be built before an "after" can be read.

| | measure | frozen "before" | status |
|---|---|---|---|
| (a) | paperwork re-sends that blur or remove a specific | **21 of 202 refusals (10.4%)**; fixed a claim 8 (4.0%); content changed 78 (38.6%) | measured today. **No "after" can be produced by this method once the gates warn instead of refuse (below).** |
| (b) | unchecked-claim error rate | pre-gate **8/163 = 4.9%** (fixed). Gated-period figure: **not yet run**; window closes 2026-10-10T11:55Z | **registered, NOT armed** (no trigger); harness staged, one defect found and bypassed, one script missing from this tree |
| (c) | round time (dispatch → chair retakes the chain) | last 7 days **median 10.3 min** (IQR 4.0–37.3, n=237); since the reply slot went live 11.9 (IQR 4.0–40.6, n=211) | measured today, method reproduces D276 exactly |
| (d) | composition misses | **UNMEASURED.** A question and a reading procedure exist; no run counts misses; its detection test came back "not tested" | named as unmeasured |

## (a) Paperwork re-sends that blur a specific — re-run of E's D276 method, today

Method: E's scripts, unchanged, in a scratch copy (they write pair files that hold message text, so they were not run in the repo):

    cp -r exo_memory/handback/p-loop-friction-E_2026-10-09_evidence/ <scratch> ; cd <scratch>
    node m1_sources.js ; node m1_replyslot.js ; node m1_trailer.js ; node labels.js         # E's, as sealed
    node labels_A.js                                                                     # mine: E's labels.js plus ONE appended label (below); output EV/a_rerun/labels_A_out.txt

- **One thing had changed since E's run, and E's `labels.js` refused it by design:** `reply: 23 labels for 24 changed pairs`. The new pair is a reply-slot block on the librarian's reply at **2026-10-09T17:20:43Z**,
  after E's 17:07Z cut. I read its word diff (it dropped a sentence about what "several write-ups" say, a "around 100 lines of rules" figure and a "56% faster → much faster" example, and added a sentence about the refusal)
  and labelled it **CLAIM-DROP** (the alternative reading is META). **That label is mine, one reader, unchecked by a second.** With META instead, the blur share is 20/202 = 9.9%. Everything else is E's labels, which I did not re-read.
- Output (`EV/a_rerun/labels_A_out.txt`; `m1_out.json`, `m1_reply_out.json`, `m1_trailer_out.json` beside it): 

| gate | refusals ex probes | content changed | claim changed | claim fixed / re-grounded | claim removed / blurred |
|---|---|---|---|---|---|
| SOURCES | 127 | 42 (33.1%) | 17 | 4 | 13 |
| reply slot | 35 | 24 (68.6%) | 10 | 4 | 6 |
| NEXT trailer | 40 | 12 (30.0%) | 2 | 0 | 2 |
| **pooled** | **202** | **78 (38.6%)** | **29 (14.4%)** | **8 (4.0%)** | **21 (10.4%)** |

E's D276 figure was 20 of 201 (10.0%); the difference is the one new pair. The window is cumulative from 2026-10-02T19:58Z (SOURCES) / 2026-10-03 (reply slot) / 2026-09-16 (trailer) to the cut.

**The hole in the "after" side, stated plainly.** The plan moves the SOURCES match, the reply slot and the NEXT trailer to WARN. A warn lets the message through, so there is no refusal and no refuse-then-re-send pair, and E's method
(which pairs a refusal with the next accepted send from the same session) has nothing to pair. So (a) as defined has a "before" and, once the gates warn, **no "after"** unless at least one paperwork gate keeps refusing. Two honest ways out, neither built:
(1) keep one gate blocking on a sample of seats or days, so pairs keep arriving; (2) change the quantity to one a warn can still show, for example the density of specifics (path:line references, figures, "checked" notes) per accepted hand-off, measured the same way before and after on the transcripts.
For (2) I have no baseline yet; it is a day of work on the same transcript reader.

## (b) The unchecked-claim error rate — staged, and what staging found

**What is fixed (the registration, `exo_memory/loop/remeasure_registration_2026-10-03.md`, commit `55f185fe`, 2026-10-03 06:09 −0600):**
the same harness as R19 (`claim_base_rate_registration_2026-09-27.md` §1–§9 by reference: M = 100 messages, K = 3 claims, arm 1's reader, verifiers B and C blind, the same verdict rules);
window **start 2026-10-03 05:55 local = 2026-10-03T11:55:00Z** (Regina is UTC−6; the commit timestamps in this repo read −0600), end **seven days later = 2026-10-10 05:55 local = 2026-10-10T11:55:00Z**, or when the frame holds ≥ 100 eligible messages, whichever is later.
The ≥ 100 condition is already met (3,305 eligible messages so far), so **the window closes at 2026-10-10T11:55:00Z.** Pre-gate base rate 8/163 = 4.9% (`claim_base_rate_score_2026-09-27.md`); the registration's own N limit applies (a fall cannot be shown at about 160 claims; the rate is printed, a rise is what the harm reading can show).
**"Doubles as the before number" holds only if the change stays off until the window closes.** If the lighter rule layer or the gate switch goes live before 2026-10-10T11:55Z, the window has to be cut at the flip time and the registration's end date no longer holds.

**Is it armed? No trigger exists; it is registered, not armed.** Checked: the registration is committed; `schtasks /query` lists only `Consonance Dream Cycle` and `Consonance Second Vantage` (next runs 2026-10-10 04:30 and 09:05); the registration itself says "Not dispatched until then". I cannot see timers inside the chair's or librarian's sessions.
Someone has to dispatch it after 2026-10-10T11:55Z.

**The harness, checked today:**
- `claimrec/` tests: `asof` 19/0, `claimrec` 17/0, `units` 14/0, `score_q3` 25/0 (`for t in asof claimrec units score_q3; do node exo_memory/loop/claimrec/$t.test.js; done`). `claude.exe --version` is **2.1.292** (R19 ran on 2.1.283); the reader step records the version in its manifest, so drift will show, but the reader's behaviour on a new CLI is untested.
- **Defect found: the sealed frame script cannot read the chair's transcript.** `frame.js` (sha256 `759ae42b…`, reproduced exactly from the registration's §11 block: `EV/frame_sealed.js`) reads each transcript with `fs.readFileSync(f, 'utf8')`. The chair's transcript is **549,537,160 bytes**, over V8's 536,870,888-byte string limit;
  the script's `catch` then files the seat as missing. Run today it prints the chair as `0L/0D` on every day and an all-zero `missing` row (`node EV/frame_sealed.js`). The chair was 667 of the 5,023 frame messages in the original window (13%); in the new window it is 338 of 3,305 (10%).
  A draw script built the same way would silently drop the chair from the sample, with no error.
- **Bypass, built and checked:** `EV/frame_chunked.js` is the sealed rule copied unchanged with one change, reading in 1 MiB chunks cut on the newline byte. Check: it reproduces **all 60 cells of the registration's §11 table (6 seats × 10 days, 09-14 to 09-23, chair included) with 0 differences**, and reports no missing transcript.
  Window so far (to 2026-10-09T17:30Z): `node EV/frame_chunked.js --from 2026-10-03T11:55:00Z --to 2026-10-10T11:55:00Z` → librarian 680, chair 338, A 763, B 556, C 398, E 570, **total 3,305**, every one marked machine D (`EV/out_frame_chunked.txt` is the run to 17:30Z).
  Note the frame is D-only: the original ran on the laptop (L) where both machines' rows were carried; the laptop is not synced (`NOT in sync … L behind`), so any L-written work in the window is not in this frame.
- **Missing: the draw, extract and assign script.** R19's sampler (order by `sha256("L119|"+message.id)`, take 100, extract the claim text, write `claimId = message.id|n`, assign verifiers by `sha256("L119-assign|"+claimId)` parity, overlap by the second byte < 64) was written on the laptop under `C:\Consonance\retrieval\l119\` (my hand-back `p-l119-sample-A_2026-09-27.md` §2–§3 names the rules; its `key\rules.md` sha256 `e73c075c…`).
  **It is not in this repository and that directory does not exist on D** (`ls C:\Consonance\retrieval\` shows `d159`, `d160` only). The registration assigns "E builds the frame and extraction" for the re-measure. It has to be rebuilt from the rules above on `frame_chunked.js`'s reader before the window closes; the exclusion of the 24 located turns is moot for this window only if all 24 lie before 2026-10-03, which I did not check.
- **Commands, once the script exists and the window has closed** (steps 2 and 4 are not staged):
  1. `node EV/frame_chunked.js --from 2026-10-03T11:55:00Z --to 2026-10-10T11:55:00Z`   (staged; counts only)
  2. draw 100 and extract to `<replies>/<message.id>.txt`   (NOT staged: the missing script)
  3. `node exo_memory/loop/claimrec/claimrec.js readers --in <replies> --out <readers>`   (no `--ask`; 09-27 cost about $5.91 and 28 minutes for 100 calls)
  4. B and C verify blind with the as-of helpers, `exo_memory/loop/claimrec/asof.js`   (staged; tests pass)
  5. `node exo_memory/loop/claimrec/score_base_rate.js <B verdicts.json> <C verdicts.json>`   (staged)
- **One more limit to know about:** `asof.js` reads `board.jsonl` whole; the file is 147,099,719 bytes against the 536,870,888-byte string limit (27%), so it is fine now and has the same ceiling.

## (c) Round time — the D276 method on today's ledger

    node EV/round_time_baseline.js --until 2026-10-09T17:27:07.367Z > EV/out_c_baseline.txt          # the D276 script plus --until and a BASELINE block

**Method identity, checked:** the same script with `--until 2026-10-09T17:15:30.143Z` (D276's last row) reproduces D276's headline lines exactly — before 14.4 (n=430), after 12.0 (n=210), difference −2.5 [−6.5, +3.6] (`EV/check_vs_D276.txt` against `loop_friction_A_2026-10-09_evidence/out_A.txt`).

Frozen reference windows (E1 = dispatch → the next chain row, in minutes; `[## BASELINE]` in `EV/out_c_baseline.txt`):

| window | rounds | E1 median (IQR) | E1 over 60 min | mean panes/round | multi-pane share | rounds/day |
|---|---|---|---|---|---|---|
| since the reply slot went live | 213 | 11.9 (4.0–40.6), n=211 | 13% | 1.62 | 38% | 34.2 |
| last 7 days | 239 | **10.3** (4.0–37.3), n=237 | 11% | 1.60 | 38% | 34.1 |
| last 3 days | 91 | 9.3 (2.6–31.8), n=89 | 10% | 1.95 | 52% | 30.3 |
| last 24 hours | 34 | 11.8 (6.7–26.9), n=32 | 3% | 2.68 | 82% | 34.0 |

**What to hold fixed or report beside it when the "after" is read** (the confounders, not adjusted): the multi-pane share and panes per round moved a lot inside this one week (38% → 82%), and round time grows slowly with panes per round (D276: 11.2 min for one pane, 17.0 for four), so a change in how the chair dispatches can move round time by itself.
The same script run on the days after the flip gives the "after"; read it with the multi-pane share and rounds per day printed in the same block. The strict "last hand-back" time stopped being recorded on 2026-09-28, so E1 stays the only comparable measure.

## (d) Composition misses — no instrument counts them

- **What exists:** a design (`exo_memory/loop/composition_instrument_2026-09-22.md`): a fixed-answer question asked of one turn, "does this turn state a doubt, a rule or a reservation, and then resolve it without naming a check that was run?"; a registered, re-scoped reading procedure (`composition_rescope_registration_2026-09-23.md`); a score (`composition_rescope_score_2026-09-23.md`); and a judge tool, `consonance/tools/jev-ask.js`, that can ask a fixed-answer question cheaply.
- **What its one run showed:** the **primary test, does the question detect an unchecked discharge, came back NOT TESTED** (1 positive of 80 for each of two readers, the same item); only the secondary held: two sealed readers applied the step procedure alike, κ 0.806 (agreement 91.25%).
  The score says the next step "if the room wants the primary" is a pool rich in positives. That was not done.
- **So there is no run that returns a count of composition misses per period** that could be taken before and after. The plan's "60 of 75" is a figure from an outside retrieval experiment (`exo_memory/research/the_retrieval_problem_outside.md:85`, "60 of 75 violators recited the rule in the sentence before the call"), not a rate this room measures on itself.
- **Status: UNMEASURED.** H3's (d) should be read as "not measurable until a validated composition instrument exists". Building one means a labelled positive pool from outside this room's own readers (the design's own condition 1) and is not a small task.

## What this file does not establish

- That the before numbers are the right comparison for a change made later: seats, tasks, volume and the claude CLI all drift (CLI 2.1.283 → 2.1.292 since R19; rounds per day 22.6 → 34.1 across the gates).
- The (a) blur label on the one new pair is a single reader's. E's 201 earlier labels were not re-read. Whether the removed specifics were true was not measured by anyone, so "blur" is a count of removals, not of removed errors.
- That the staged (b) harness will run end to end: steps 2 and 4 have no script or have not run in this window; only the frame and the scorer's tests ran.
- Anything about quality of the work produced, or about any one seat.

Nothing was changed in any repository file that existed before this lap. New files only: this file, `p-lighten-baseline-A_2026-10-09.md`, the evidence folder, and my map line.
