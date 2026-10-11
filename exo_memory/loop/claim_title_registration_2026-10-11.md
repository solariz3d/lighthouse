# The claim-first title bar, sealed before E's survey is opened. Pane B, machine D, 2026-10-11, lap D299 part 2

Plan: `loop/plan_claim_first_titles_d299_2026-10-11.md` (main `613921a9`). E surveys candidate SOURCES for the shown title (part 1). I pick from E's survey against this bar, and C builds the pick in `index_entry_line`/`index_title` (`consonance/src-tauri/src/main.rs:7513`, `:7599`; D297's `strip_lead_label` is at `:7529`; checked by grep on `613921a9`).

**Sealing.** Committed alone, by named path, before I open `handback/p-titlesurvey-E_2026-10-11.md`. Not edited after. A correction goes in a dated foot section and counts as a change to the bar.

**Blindness, stated.** I already know the six illegible titles' full headings (`scratchpad/d297b/check3.out`, D297). I have not seen E's output, and I have not read any body text of the 30 for this lap.

**Bias.** This lap exists because of my D297 read, and I will both pick the candidate and judge it. Two guards: the pick is made on the same 28 the read scores, so §4 adds a seeded HOLDOUT judged blind; and T2 caps regressions, so a pick cannot win by reshuffling.

**Dormant,** like D296 and D297: `gates_mode` is light, so everything is measured on dumps.

## 1. Instrument, sample, rule (unchanged from D297)
- **Snapshot** `G:/consonance-scratch/c-d296/snap`. **BASE** is D297's `G:/consonance-scratch/c-d297/new3/librarian.strict.md` (sha256 `07e06d93…b36cb796c6`, 141,658 B): that is the code now on main (D297 landed). C re-dumps BASE (main `613921a9`) and NEW from the snapshot with `dump3.sh`; C's BASE must equal `new3` once the worktree path is normalised (D297 found this moves line 313 and the body-room figure at line 322, nothing else). I read the AS-DUMPED files.
- **The fixed 30, by path:** the list in `loop/label_strip_registration_2026-10-11.md` §1, unchanged. #6 and #15 excluded; **judged on 28.**
- **The legibility rule, unchanged:** an entry is LEGIBLE when its shown title, read beside its path, tells the librarian what the file is about or finds, beyond what the path and a lap/ledger label already say. An entry NEW does not list is NOT legible.
- **Baseline: 22/28** on `new3`. Not legible: #2, #8, #12, #18, #20, #27 (`handback/p-d297read-B_2026-10-11.md` §2).

## 2. The T1 target, reasoned from what a SOURCE can reach
D297's "why 24" predicted which entries a mechanism would fix, and was wrong twice (my W1 there). This target is set from two things that do not depend on predicting a mechanism's per-entry behaviour: **where each failing title's finding is**, and **what a source change does to the other 22**.

- **Where the finding is** (checked: the full headings in `scratchpad/d297b/check3.out`). For five of the six (#2, #12, #18, #20, #27) the finding IS in the heading, past char 40. For #8 ("Q3 read: Jev (typesafe/jev-1.13-20260917, through OpenRouter) — D162 resumed, pane E, 2026-10-01") **the heading holds no finding at all**: only the body can supply one. So a heading-only source can reach at most 5 of the 6, and a body source at most 6.
- **What a source does to the others.** A strip changes only titles that carry a label. A new source changes **every** title, so regressions among the 22 are expected, not exceptional. The gain has to be read NET, and clear of one judge's noise (±1 on 28, the D297 F-a line).
- **The target: T1 ≥ 25/28, net, AND T2 ≤ 2 regressions.** That is half of the six reached, net of whatever breaks, three entries clear of the baseline and two clear of the noise line. Below 25 a source that touches all 412 titles is not worth the churn. The regression cap keeps "fixed 6, broke 3" from passing as a fix.
- **Not owed:** 27 or 28. A pick that reaches them is welcome; a pick that needs them to pass is not the pick.

## 3. Success, in numbers. All must hold
| # | measure | bar |
|---|---|---|
| T1 | legible at cap 40, the fixed 28 | **22 → ≥ 25/28**, net |
| T2 | regressions among the 22 | **≤ 2**, each listed with base and new title |
| T1h | the HOLDOUT (§4), judged blind | NEW legible **≥** BASE legible (the source must not be worse off the sample it was picked on) |
| T3 | record entries listed (map/journal/loop) / dropped | **≥ 268 / ≤ 463** (D297 NEW) |
| T4 | unmapped hand-backs | **56/56**, 0 mapped, 0 nested |
| S3 | index-tier bytes | **≤ 30,000**, `LIBRARIAN_INDEX_BUDGET` unchanged |
| S4 | whole CLAUDE.md | **≤ 142,000 B** and **< 150,000 chars** |
| T5 | mechanics, all index lines | no path cut; cut text ends at a word boundary with ` ...`; nothing shown over 40 chars; `(no title)` only for a file with no `# ` heading; **a source that yields nothing falls back to the heading** (never empty, never `(no title)` for a titled file) |
| T6 | the loss rule (§5) | **0 violations in the sample; ≤ 5% of changed titles over the whole index**, every one listed |
| T7 | the shown text comes from the file | verbatim words of the file in file order (a cut and a strip allowed), deterministic; no synthesis, no model call |

## 4. The holdout, sealed now
- **30 more entries, seed 2991,** drawn by the D296 LCG (E's `sample.js` generator, as `scratchpad/d296b/check.js`) over `new3`'s 323 index-tier entries (map/journal/loop/handback), skipping any of the fixed 30, taking the first 30 that remain. Drawn at read time from this rule; nobody picks them.
- **Judged blind:** for each entry, BASE's and NEW's shown titles are printed as "X" and "Y" in an order set by the same seed, and I judge both before the key is printed. An entry where X = Y is judged once.
- **T1h passes** when NEW legible ≥ BASE legible. It is a guard against overfitting the pick, not a second target.

## 5. The loss rule for a source change
D297's rule judged a stripped PREFIX. A new source can drop words anywhere, so the rule is restated on the result:
- **The subject must survive.** Take the heading's first clause (up to the first ` — `, `: `, ` · ` or `. `). Every word in it of 3+ letters that is not ledger class (D297 §3: `D\d+`, `L\d+`, `Q\d+`, `P-…` codes, `packet/pane/part/item/step/track/lap` with their argument, `v\d`, a parenthetical) must appear in the shown title **or** in the path (case-folded, letters and digits; a path token of 4+ chars that begins the word counts). Example: (b) on #1 drops "README and About rewrite, R1"; `readme` is in the path, but "About" and "rewrite" are not, so that would be a violation.
- **A caveat is not a tail.** A shown title must not drop a negation or a status flag the heading states in capitals or bold (#18's "NOT FOR LANDING"), unless the cut alone removes it. A source that SELECTS around it is a T6 violation.
- **The chair's D297 example still stands:** "D177, packet C" is in the path and may go.

## 6. The falsifier: the source change didn't help
- **F-a:** T1 ≤ 24/28 net, or T2 > 2. The source moved titles but not legibility.
- **F-b:** T1h fails: the pick is worse on entries it was not chosen on (overfit).
- **F-c:** T6 fires in the sample, or over 5% of changed titles: legibility bought by dropping the subject.
- **F-d:** T3 fails: the new titles cost entries.
- **Marginal calls** are marked in the read; if T1 reaches 25 only through them, I say so and call it undecided.

## 7. How I will pick from E's survey (step 2)
For each of (a)–(d): judge E's 40-char text for the 28 by §1's rule, count regressions, and apply T6/T7 to the 28 and E's whole-index counts (empty, path-restating, over-cap). The pick is the candidate that passes T1/T2/T6/T7 on E's texts with the fewest regressions. **If none does, I say so and pick none:** C does not start, and the read records that no surveyed source reaches the bar. A combination (e.g. (b) falling back to (a)) counts only if E measured it.
