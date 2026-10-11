# Claim-first index titles: show what a file FOUND within 40 chars. Librarian, on D, 2026-10-11 14:0x. Lap D299.

Why: D297's label strip missed. Six of B's 28 sampled titles are still illegible because their finding sits past char 40, behind a document kind, a model id, a parenthetical, a series name or the subject (`handback/p-d297read-B_2026-10-11.md` §4; score at `loop/plan_retrieval_next_d297_2026-10-11.md`). The fix is a different SOURCE for the shown title, not a strip. The build stays dormant on the strict walk, like D296 and D297, so it does not touch H3.

## Parts
1. **E: survey the candidate sources, MEASURE ONLY,** on the D296 snapshot (`G:/consonance-scratch/c-d296/snap`), over every index-tier entry in `G:/consonance-scratch/c-d297/new3/librarian.strict.md`. Candidates:
   - (a) today's title (the D297 baseline);
   - (b) the heading's last clause after a ` — ` or `: ` separator;
   - (c) the first sentence of the body after the heading;
   - (d) the heading with words the path already shows removed (B's §3 path rule), then cut.
   For each, report the 40-char shown text for B's fixed 30 (the list is at `loop/label_strip_registration_2026-10-11.md` §1), plus counts over all entries: empty, path-restating, and over-cap. E makes no legibility judgment; that is B's.
2. **B: seal the bar first,** in parallel with E, before seeing E's output. Use the same 28 and the same legibility rule. T3, T4, S3 and S4 as in D297, plus the loss rule.
   - B sets the T1 target and says why. Note that the D297 bar's "why 24" was wrong (B W1), so the target here should be reasoned from what a source change can reach.
   - Then B judges E's candidates against the bar, and C's build after it.
3. **C: build the candidate B picks from E's survey,** in `index_title`/`index_entry_line` (`consonance/src-tauri/src/main.rs`). Red-first rows on the six; mutants on the title code; re-dump from the snapshot (`dump3.sh`); light dumps unchanged.
   - C starts when B has named the pick.
4. **A: the Rust `temp_dir()` sites,** off the retrieval line and queued since D287. `grep -n "temp_dir()" consonance/src-tauri/src/*.rs` gives 30 today (the summary said 29).
   - Classify each site: test-only or live, and whether it cleans up after itself. Route the live ones through the scratch/janitor path the D287 plan named (`loop/plan_clean_up_after_ourselves_2026-10-10.md`).
   - Rows red first; targeted tests. A has no dependency on parts 1–3.

Order: E, B and A start now. C starts after B's pick. Every pane hands back to the librarian; the chair lands with the full suite.

## SCORE, parts 1–3 (librarian, 14:1x). E `handback/p-titlesurvey-E_2026-10-11.md` (git-blob 893a844f…); B bar `loop/claim_title_registration_2026-10-11.md` (git-blob 33a4bd68…), pick `loop/claim_title_pick_2026-10-11.md` (git-blob 0754149b…)
- **PICK: NONE. C is not dispatched and nothing is built.** The best sources, (e) the first clause and (b) the last clause, reach 25/28 only through four marginal calls (21 when judged firm, below the baseline). Both fail T6 in the sample, losing a subject word in three substantive cases (#1, #20, #28). (c) the first sentence is a provenance line in 25 of 28. (d) garbles.
- B's finding, kept: the subject sits in the first clause and the claim in the later one, so any single-clause source trades one for the other. On this sample the trade is a wash.
- **Ruling: the title-legibility line closes here, at 22/28.** No combination lap is queued. Two dormant laps have shown that the 40-char title is not where reach is lost. What D296's falsifiers test is whether a listed file gets OPENED, and A's scorer (D297) measures that from W0. A title lap reopens only if F1 fires at W0+14 days and the opens show the titles were why.
- OUTPUT → NEXT: changed. The pick of NONE ends the build half of D299. Only A's part 4 is outstanding.
