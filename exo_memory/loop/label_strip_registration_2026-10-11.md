# The label-strip bar, sealed before C's code lands. Pane B, machine D, 2026-10-11, lap D297 part 1

Plan: `loop/plan_retrieval_next_d297_2026-10-11.md`, part 1 (main `5d5740b4`). The build is C's (part 2): strip a leading lap/ledger label before the title is cut, in `index_title`, `consonance/src-tauri/src/main.rs:7518` (`INDEX_TITLE_CHARS = 40` at `:7508`, `LIBRARIAN_INDEX_BUDGET = 30_000` at `:7451`; checked by grep on `5d5740b4`).

**Sealing.** This file is committed alone, by named path, before C commits code. It is not edited after that. A correction goes in a dated section at the foot and counts as a change to the bar.

**Bias.** I proposed the strip (`handback/p-d296read-B_2026-10-11.md` §3, marked inferred there), and I am the judge of legibility. I have a stake in it working. The guard is §2's target, which is set before I see any stripped title, and §4's falsifier, which can fire on my own judgment.

**It stays dormant.** `gates_mode` is light, so no librarian wake sees this (as D296, bar `loop/shelf_budget_registration_2026-10-11.md` §0). Everything below is measured on dumps.

## 1. The instrument and the fixed sample
- **Snapshot:** `G:/consonance-scratch/c-d296/snap`, unchanged. **Dumps:** C re-dumps BASE (main `5d5740b4`, the D296 code, cap 40, no strip) and NEW (C's code) from that snapshot, the D296 way (`dump2.sh`). I read the AS-DUMPED `librarian.strict.md` files, not committed copies.
- **Base check:** C's BASE strict dump must equal D296's `new2/librarian.strict.md` (sha256 `5a846d09…1c994d146230`, 141,253 B) once the one worktree path at line 313 (`G:\worktrees\<name>\exo_memory\map\M.md`) is normalised. checked: `grep -n c-d296` on `base2`/`new2` → that line is the only worktree mention in either strict dump. If BASE differs anywhere else, the snapshot or the base code moved, and the comparison is void until explained.
- **The sample is fixed BY PATH, not re-drawn.** Re-seeding 2961 against a dump that lists different entries would pick different files. These are the 30 entries drawn in D296 (`scratchpad/d296b/check.out`, seed 2961 over the 323 index-tier entries of `new2`):
  1 `loop/readme_draft_notes_2026-09-25.md` · 2 `loop/compaction_corrections_2026-10-05/PREREG.md` · 3 `loop/plan_t180_sharp_turns_2026-10-09.md` · 4 `loop/rule_census_score_2026-10-02.md` · 5 `map/M-2026-08-24.md` · 6 `journal/2026-08-03.md` · 7 `loop/plan_fix_and_list_loop_2026-09-24.md` · 8 `loop/q3_read_Jev_2026-09-27.md` · 9 `loop/plan_clean_up_after_ourselves_2026-10-10.md` · 10 `handback/p-d195-B_2026-09-30.md` · 11 `handback/p-consumer-coldread3-LIB_2026-10-09.md` · 12 `loop/qs2s_units_v2_2026-10-03.md` · 13 `loop/plan_two_lane_suite_2026-10-03.md` · 14 `loop/plan_consumer_drift_awareness_2026-10-09.md` · 15 `loop/plan_label_watch_second_read_2026-10-02.md` · 16 `loop/q3_units_2026-09-27.md` · 17 `loop/echo_variable_idea_2026-09-26.md` · 18 `loop/battery_run2_sealed_rows_2026-09-25.md` · 19 `loop/plan_finish_retrieval_2026-10-03.md` · 20 `loop/plan_consumer_refresh_2026-10-08.md` · 21 `loop/design_speed_measure_2026-10-06.md` · 22 `handback/p-indicator-loop-chain-ui_2026-09-01.md` · 23 `loop/plan_t180_equation_only_pieces_2026-10-04.md` · 24 `loop/plan_loop_friction_2026-10-09.md` · 25 `handback/p-d167-blend-C_2026-09-27.md` · 26 `loop/cross_section_seal_registration_2026-10-03.md` · 27 `handback/p-d177-rigid-C_2026-09-27.md` · 28 `loop/plan_digest_repair_parts_d292_2026-10-11.md` · 29 `loop/plan_t180_back_on_track_2026-09-28.md` · 30 `map/M.md`
- **Judged on 28:** #6 and #15 stay excluded, as in D296 (their full title adds nothing beyond the path, so no cut changes them).
- **The legibility rule is D296's, unchanged:** an entry is LEGIBLE when its shown title, read beside its path, tells the librarian what the file is about or finds, beyond what the path and a lap/ledger label already say. An entry the NEW dump does not list counts as NOT legible.
- **Baseline: 22/28 at cap 40.** The six not legible: #2, #8, #12, #18, #20, #27 (D296 read §3).

## 2. Success, in numbers. All must hold
| # | measure | bar |
|---|---|---|
| T1 | legible at cap 40, the fixed 28 | **22 → ≥ 24/28**, judged on the NEW dump's shown titles |
| T2 | regressions | every one of the 22 that turns not-legible is listed with its old and new title. They count against T1 (T1 is net) |
| T3 | record entries listed (map/journal/loop) | **≥ 267** (D296 NEW). Dropped by the window must not rise above 464 |
| T4 | unmapped hand-backs | **56/56 listed** on the snapshot, 0 mapped, 0 nested (S2 of D296, unchanged) |
| S3 | index-tier bytes | **≤ 30,000**, `LIBRARIAN_INDEX_BUDGET` unchanged |
| S4 | whole CLAUDE.md | **≤ 142,000 B** and **< 150,000 chars** |
| T5 | the cut's mechanics, all index lines | as D296 S5: no path cut; a cut title ends at a word boundary with ` ...`; no cut title over 40 chars; `(no title)` only for a file with no `# ` heading, **never for a title that was all label** (the strip falls back to the full heading when nothing would remain) |
| T6 | the loss rule (§3) | **0 violations in the sample**; every violation in the full index is listed by C and counted |

**Why 24, and not more.** Read the six failures against what a *leading lap/ledger* strip can reach:
- **#27** "D177, packet C (reordered first): rigid downstream edits and one shared path" and **#12** "QS2S units v2, D217 (is seat Y correcting seat X?)": a ledger label, then the claim. A strip doing what the plan says should fix both. That is 24.
- **#2** "PRE-REGISTRATION — …" and **#8** "Q3 read: Jev (typesafe/jev-1.13-20260917, …": the label is a document type or question id, not a lap id. A strip may or may not take it, and #8's remainder opens with a 30-char token, so it may stay illegible even stripped. Possible, not owed.
- **#18** (the loss is at the tail, "NOT FOR LANDING") and **#20** ("Consonance consumer:" is the subject, and §3 forbids losing it): no leading strip fixes them.
- So 24 is what the plan's own mechanism promises, and anything less is inside the noise of one judge on 28 entries (a one-entry swing). 25 or more would mean the strip reached labels beyond lap ids; it is welcome, not required.

## 3. What a stripped label may lose
The librarian finds files by what they are about. The ledger address (which lap, which packet, which pane) is found from the path and the ledger. So:
- **MAY be lost from the shown title:** a ledger/lap id (`D\d+`, `L\d+`, `lap D\d+`, `Lap D\d+`), and the addressing that rides with it inside the label: `packet X`, `pane X`, `part n`, `item n`, `step n`, `Track n`, a version tag (`v2`), and a parenthetical inside the label (`(reordered first)`, `(L025)`, `(lap D225)`).
- **MUST NOT be lost:** a subject word, meaning any stripped word of 3+ letters that is not in the class above and does not appear in the path (case-folded, letters and digits only; a path token of 4+ chars that is a prefix of the word counts, so `PREREG` covers "PRE-REGISTRATION"). Examples: "D210 rule census" (#4: `D210` is ledger and `rule_census_score` carries the rest, so allowed); "Consonance" (#20: not in `plan_consumer_refresh`, NOT allowed); "Battery run 2" (#18: `battery_run2` covers it).
- **The chair's case, "D177, packet C":** it IS in the path. checked: the path is `handback/p-d177-rigid-C_2026-09-27.md`, which carries `d177` and the seat letter `C`. Losing it is allowed on both counts (ledger class, and path). "(reordered first)" is a scheduling note inside the label: allowed.
- **A claim in parentheses is not a label.** In #12 "(is seat Y correcting seat X?)" is the claim; stripping it is a T6 violation, not a strip.
- **Stripping never empties a title.** If nothing would remain, the full heading is cut as before (T5).

## 4. The falsifier: stripping didn't help
Any one of these means the strip did not help legibility, and the build should not land as an improvement:
- **F-a:** legible at cap 40 on the fixed 28 is **≤ 23** (a gain of at most one entry, inside one judge's noise), or
- **F-b:** T6 fires in the sample (a gain bought by losing subject words), or
- **F-c:** T3 fails (record listed < 267): the strip shortened titles but the shelf lists less.
- **Undecided, not success:** 24 reached only by counting an entry I would call marginal. I will mark marginal calls in the read, and if T1 rests on them I say so.
- If T1 holds but T6 fires outside the sample at more than 5% of stripped entries, the read says the rule over-strips and names the pattern.

## 5. What I will compare in C's hand-back
1. BASE equals D296 `new2` after normalising line 313 (§1).
2. `baseline.js` and `check.js` on BASE and NEW (`scratchpad/d296b/`), sha256 against C's, S3/S4/T3/T4 from those runs.
3. The 28 shown titles in NEW, judged entry by entry by the §1 rule, old and new side by side, marginal calls marked.
4. T5 and T6 mechanically over every index line: the stripped prefix is the full heading minus the part the shown title starts with.
5. C's red-first rows on the six named titles (seen red on `5d5740b4`), and the mutants on `index_title`: `applied N / caught N / NOT APPLIED N`.
6. Light dumps unchanged (dormancy), normalised for the worktree name.
