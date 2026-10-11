# p-titlesurvey-E · D299 part 1: survey the candidate title sources · pane E, on D, 2026-10-11 · MEASURE ONLY, no legibility judgment

Plan: `exo_memory/loop/plan_claim_first_titles_d299_2026-10-11.md`, part 1 (main `613921a9`); I read its `:1-11`.
I did NOT open B's new D299 registration, before this commit or after it. The sample is D297's fixed 30, taken from
`loop/label_strip_registration_2026-10-11.md` §1, and the path rule from its §3.
**Result: lighthouse `8d319534` on `613921a9`, branch `d299-e`, worktree `G:\worktrees\e-d299-wt`, not pushed. Only
`exo_memory/handback/p-titlesurvey-E_2026-10-11_evidence/` is added; no code changed.** Runs were under the heavy-run lock, through main's `heavy-run.js` by
absolute path.

## Inputs and method
- **Snapshot:** `G:/consonance-scratch/c-d296/snap`.
- **Dump** (as dumped): `G:/consonance-scratch/c-d297/new3/librarian.strict.md`, sha256 `07e06d9382266830…`.
  - Its per-file index lists 413 entries.
  - **The index tier** (`map/`, `journal/`, `loop/` and the 56 unmapped `handback/`s) is **324**, and is the population below.
- **Run:**
  `node survey.js --snap G:/consonance-scratch/c-d296/snap --dump G:/consonance-scratch/c-d297/new3/librarian.strict.md --sample <worktree>/exo_memory/loop/label_strip_registration_2026-10-11.md --out out`
  - `out/survey.md` sha256 `a6f5ad3d6137cf22…`;
  - `out/entries.tsv`: 413 entries × 5 candidates, source and shown text, sha256 `9911bbf29a8358e6…`.
- **One cut for all.** Every candidate's shown text goes through `index_title` from `main.rs:7599-7615`, ported line for line: 40 chars, word boundary,
  then " ...". So the candidates differ only in their SOURCE.
- **Parity:** candidate (a) is ported from `main.rs:7513-7597` (`strip_lead_label`, `is_ledger_id`, `path_shows`). It equals the title the dump printed
  on **413/413** entries.
- **The candidates:**
  - **(a) today:** `index_title(strip_lead_label(path, heading))`, the D297 baseline.
  - **(b) last clause:** the text after the LAST ` — ` or `: ` in the heading. A heading with neither is kept whole.
  - **(c) first sentence:** the first prose line after the heading, then up to the first `. ! ?` that is followed by a space or the line's end.
    - Skipped as not prose: blank lines, headings, code fences, tables, rules and comments.
    - Removed first: leading `>` and list markers, then `**` and `__`.
  - **(d) minus path words:** the heading with every word removed that `path_shows` says the path shows (B's §3 rule), then leading and trailing
    separators trimmed.
  - **(e) FIFTH, added from the data:** the text after the FIRST ` — ` or `: `; with neither, the heading whole.
    - Why I added it: on the first run, (b)'s last clause landed on a trailing stamp in the fixed 30 (#5 "…, 2026-08-24", #8 "D162 resumed, pane E,
      2026-10-01", #18 a "NOT FOR LANDING" tail). The mechanical alternative is the first separator.
- **Definitions of the counts:**
  - **empty:** the source is empty, so the shown text is `(no title)`.
  - **path-restating:** the shown text, " ..." ignored, has no word of 3+ letters that `path_shows` rejects (B's §3 subject-word unit).
  - **over-cap:** the source is over 40 chars, so it is cut.

## Counts over the index tier (324)
| candidate | empty | path-restating | over-cap | shown text same as (a) | other |
|---|---:|---:|---:|---:|---|
| (a) today | 1 | 24 | 287 | 324 | |
| (b) last clause | 1 | 21 | 245 | 101 | 55 have no separator (kept whole); 181 clauses hold a date, clock time or seat stamp somewhere in the source |
| (c) first sentence | 1 | 2 | 256 | 1 | 1 has no prose line |
| (d) minus path words | 16 | 16 | 247 | 17 | |
| (e) first clause [fifth] | 1 | 20 | 255 | 117 | 189 clauses hold a stamp somewhere in the source |

**The stamp counts** are for anywhere in the source, not just the shown 40 chars. The regex is a date `20\d\d-\d\d-\d\d`, a clock `\d\d:\d[\dx]`, `pane X`,
`on D/L` or `machine D/L`.

**What (c) starts with, mechanically, over the 324:**
- `The keeper …` (a quoted ask): 82;
- a provenance line (`Pane C, …`, `Written …`, `Packet: …`, `Seat: …`, `Landing sha …`, `Inputs …`, `Master …`, `Folder read …`): 48;
- `Plan:` (often a backticked path, so the cut leaves `Plan ...`): 20;
- other: 174.

**Over all 413 entries** (root and system files included):

| | empty | path-restating | over-cap |
|---|---:|---:|---:|
| (a) | 13 | 39 | 353 |
| (b) | 13 | 38 | 296 |
| (c) | 14 | 16 | 312 |
| (d) | 31 | 31 | 298 |
| (e) | 13 | 37 | 309 |

## B's fixed 30: the shown text per candidate (verbatim from `out/survey.md`)
All 30 are listed in `new3`.

| # | path | (a) today | (b) last clause | (c) first sentence | (d) minus path words | (e) first clause [fifth] |
|---|---|---|---|---|---|---|
| 1 | `loop/readme_draft_notes_2026-09-25.md` | README and About rewrite, R1 — the ... | the notes behind C's draft (D139, pane ... | Plan ... | and About rewrite, R1 — the behind C's ... | the notes behind C's draft (D139, pane ... |
| 2 | `loop/compaction_corrections_2026-10-05/PREREG.md` | PRE-REGISTRATION — do the seat's own ... | do the seat's own CORRECTION-ADJACENT ... | Written 2026-10-05 ~15:20 local ... | do the seat's own CORRECTION-ADJACENT ... | do the seat's own CORRECTION-ADJACENT ... |
| 3 | `loop/plan_t180_sharp_turns_2026-10-09.md` | T-180: a 90° turn does not come out ... | a 90° turn does not come out straight ... | The keeper, 18:52, with two screenshots ... | a 90° turn does not come out straight ... | a 90° turn does not come out straight ... |
| 4 | `loop/rule_census_score_2026-10-02.md` | SCORE. Where MD rules work, and where ... | SCORE. Where MD rules work, and where ... | Inputs (sha256): tags ... | D210 Where work, and where they fail. ... | SCORE. Where MD rules work, and where ... |
| 5 | `map/M-2026-08-24.md` | M — the librarian, its own words ... | the librarian, its own words, 2026-08-24 | 43 turns of this seat's own prose ... | the librarian, its own words | the librarian, its own words, 2026-08-24 |
| 6 | `journal/2026-08-03.md` | 2026-08-03 | 2026-08-03 | *A trace, not a doctrine. | (no title) | 2026-08-03 |
| 7 | `loop/plan_fix_and_list_loop_2026-09-24.md` | Fix what is not working, then the list ... | Fix what is not working, then the list ... | The keeper, verbatim: *"lets fix what ... | what is not working, then the in a work ... | Fix what is not working, then the list ... |
| 8 | `loop/q3_read_Jev_2026-09-27.md` | Jev (typesafe/jev-1.13-20260917 ... | D162 resumed, pane E, 2026-10-01 | Written by pane E from ... | typesafe/jev-1.13-20260917, through ... | Jev (typesafe/jev-1.13-20260917 ... |
| 9 | `loop/plan_clean_up_after_ourselves_2026-10-10.md` | Clean up after ourselves: the disk ... | the disk filled at 12:13 and it must ... | The keeper, 12:13: "Transcript writes ... | the disk filled at 12:13 and it must ... | the disk filled at 12:13 and it must ... |
| 10 | `handback/p-d195-B_2026-09-30.md` | D195 + D196 combine · B, non-author · ... | D195 + D196 combine · B, non-author · ... | Landing sha: `2f0883f` in ... | + D196 combine · non-author · GEOMETRY ... | D195 + D196 combine · B, non-author · ... |
| 11 | `handback/p-consumer-coldread3-LIB_2026-10-09.md` | Cold read 3: Consonance, from README to ... | Consonance, from README to first session | Folder read: `consumer-cold3/`. | Cold read 3: Consonance, from README to ... | Consonance, from README to first session |
| 12 | `loop/qs2s_units_v2_2026-10-03.md` | QS2S units v2, D217 (is seat Y ... | re-drawn for the readers' overlap and ... | Plan ... | D217 (is seat Y correcting seat X?) ... | re-drawn for the readers' overlap and ... |
| 13 | `loop/plan_two_lane_suite_2026-10-03.md` | Two-lane test suite: faster full runs ... | faster full runs without the load that ... | The keeper, 11:14: "is there a way to ... | Two-lane test faster full runs without ... | faster full runs without the load that ... |
| 14 | `loop/plan_consumer_drift_awareness_2026-10-09.md` | Consumer: the fork carries its own ... | the fork carries its own drift ... | The keeper, 10:54: "do you think that ... | the fork carries its own Librarian, on ... | the fork carries its own drift ... |
| 15 | `loop/plan_label_watch_second_read_2026-10-02.md` | The label rule's SECOND READ. ... | The label rule's SECOND READ. ... | The keeper, 05:09: "lets do your ... | The rule's Librarian, on D, 05:1x. Lap ... | The label rule's SECOND READ. ... |
| 16 | `loop/q3_units_2026-09-27.md` | 40 pairs for the two-reader agreement ... | 40 pairs for the two-reader agreement ... | Master ... | 40 pairs for the two-reader agreement ... | 40 pairs for the two-reader agreement ... |
| 17 | `loop/echo_variable_idea_2026-09-26.md` | Same-model echo may have been measuring ... | Same-model echo may have been measuring ... | *The keeper, 08:10, verbatim: "I think ... | Same-model may have been measuring the ... | Same-model echo may have been measuring ... |
| 18 | `loop/battery_run2_sealed_rows_2026-09-25.md` | Battery run 2 — the sealed rows ... | no kind has a fieldable pair.** | No task text, key, plant, cold answer ... | run 2 — the prepared by B (D136). **NOT ... | the sealed rows, prepared by B (D136). ... |
| 19 | `loop/plan_finish_retrieval_2026-10-03.md` | Finish the retrieval line: every open ... | every open item, in chunks. Librarian ... | The keeper, 03:52: "lets finish it all". | the line: every open item, in chunks. ... | every open item, in chunks. Librarian ... |
| 20 | `loop/plan_consumer_refresh_2026-10-08.md` | Consonance consumer: bring it up to ... | bring it up to date with dev, ready for ... | The keeper, 12:21: "how much work do ... | Consonance bring it up to date with ... | bring it up to date with dev, ready for ... |
| 21 | `loop/design_speed_measure_2026-10-06.md` | what "always max speed" would change ... | what "always max speed" would change ... | Plan ... | D256 item 2: what "always max would ... | what "always max speed" would change ... |
| 22 | `handback/p-indicator-loop-chain-ui_2026-09-01.md` | the loop indicator in the UI | the loop indicator in the UI | Seat: pane at ... | P-INDICATOR (L025) — the in the | the loop indicator in the UI |
| 23 | `loop/plan_t180_equation_only_pieces_2026-10-04.md` | T-180: equation mode only, the Pieces ... | equation mode only, the Pieces page's ... | The keeper, 22:14: "can we keep only ... | mode the page's features carried over ... | equation mode only, the Pieces page's ... |
| 24 | `loop/plan_loop_friction_2026-10-09.md` | The loop got slow because the seats ... | The loop got slow because the seats ... | The keeper, 10:59: "I view every seat ... | The got slow because the seats optimise ... | The loop got slow because the seats ... |
| 25 | `handback/p-d167-blend-C_2026-09-27.md` | D167 Track 1 step 1, pane C: geometry ... | geometry blends by the document's ... | Pane C, 2026-09-27. | Track 1 step 1, pane geometry by the ... | geometry blends by the document's ... |
| 26 | `loop/cross_section_seal_registration_2026-10-03.md` | CROSS-SECTION (lap D225): the EDGE ... | the seal, registered before anyone ... | Packet: the chair's D225 step 1 ... | lap D225): the EDGE CURVE, the TUBE and ... | the EDGE CURVE, the TUBE and the SPIRAL ... |
| 27 | `handback/p-d177-rigid-C_2026-09-27.md` | D177, packet C (reordered first): rigid ... | rigid downstream edits and one shared ... | Pane C, 2026-09-27. | packet (reordered first): downstream ... | rigid downstream edits and one shared ... |
| 28 | `loop/plan_digest_repair_parts_d292_2026-10-11.md` | The keeper's two answers, built: repair ... | repair the session digests, and log the ... | The keeper's answers (2026-10-11 ... | The keeper's two answers, built: the ... | repair the session digests, and log the ... |
| 29 | `loop/plan_t180_back_on_track_2026-09-28.md` | Back on track: after D182 and D184 ... | after D182 and D184 land, ONE line of ... | The keeper, 05:38: *"please after all ... | after D182 and D184 land, ONE line of ... | after D182 and D184 land, ONE line of ... |
| 30 | `map/M.md` | M.md — the librarian's own map | the librarian's own map | ASSEMBLED FOR THIS SEAT, NOT BY IT. | M.md — the librarian's own | the librarian's own map |

## Notes, all mechanical (no judgment of which reads better)
- **(d) removes words, not phrases.** So it can leave a separator mid-title ("R1 — the behind C's"). It also keeps ledger ids the path does not show
  ("D210", "D217", "lap D225)"), because `path_shows` alone does not remove them; the D297 label strip does that, and (d) does not combine with it.
- **(d)'s 16 empty** are headings that the path restates completely (e.g. #6 `2026-08-03`).
- **The ` — `/`: ` split takes the first or last occurrence, nothing smarter.** A colon inside a quote or a time ("12:13: …") is a separator to it.
  `": "` after a clock time is one way (b) and (e) start mid-sentence.
- **Lengths.** No shown text is over 44 chars (40 plus " ..."), by construction of the shared cut.

## Corrections to myself
- **The first `entries.tsv` carried two things that must not be committed:** one private name (in a heading quote) and nine home paths. Both are now
  masked in the TSV's text columns only: the private name by its sha256 (the script does not spell it), the paths as `<home>`. The counts are taken before
  masking, and `survey.md` was byte-identical across the two runs.
- **The fifth candidate was added after the first run.** Its rationale is in the script's comment, and it is labelled (e) everywhere.

Checked:
- `git -C G:/worktrees/e-d299-wt log -1 --format=%h` → `8d319534`;
- `node consonance/tools/portable-paths.js` → green: 382 files, 455 known sites, 0 new;
- the strict credential scan of the three committed files → 0.

NEXT: librarian route this survey to B and C when this hand-back is read; B's bar is sealed blind to it, and C builds the candidate B picks
