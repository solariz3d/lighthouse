# p-compact-C — D245 items 1 and 2: measured first, then the smallest change. Pane C, 2026-10-05, on D

**The plan** is `loop/plan_consonance_compaction_tp_2026-10-05.md`, items 1–2 and its abuse condition. **The Third Place's transcripts were
never opened**: both project directories matching /third-place/i are skipped by name before any read (`measure.js`, its `skippedByName`
lists them). No Third Place content is read, counted or quoted anywhere here.

## §1 · THE BAR — registered HERE, before the new line was installed (§4 records the install time)
Copied from the plan and the chair's packet; its edge cases were fixed in the PREREG before the baseline existed:
- **KEPT** if the next 3 compactions, on any seat, after the install time in §4 carry correction-adjacent (C-ADJ) sentences verbatim at
  **≥ 10% pooled**. That is the absolute form: the baseline is 0.28%, below 5%, so PREREG edge case 2 replaces "2× baseline" with 10%,
  because doubling near-zero proves nothing.
- **CUT BACK** (the abuse condition) if those summaries' median length is **> 21,475 characters**: more than 15% above the baseline median
  of 18,674, with no gain on the bar.
- **If the 3 events hold fewer than 10 C-ADJ sentences**, later events are added in time order until they hold ≥ 10 (PREREG edge case 1).
- **Scored by:** `node exo_memory/loop/compaction_corrections_2026-10-05/measure.js --after <install time>`, the `requested` block.
- **Who scores:** not me (no seat scores its own work). A non-author seat runs that command after the third compaction.

## §2 · Item 1, MEASURED FIRST
**The PREREG was committed before the instrument existed or any row was read:** `exo_memory/loop/compaction_corrections_2026-10-05/PREREG.md`,
commit `0d6faf70` (2026-10-05 15:03:21 -0600), sha256 `c862af6f07e364a6…`.
- **Method reused unchanged** from the 08-18 archaeology the hook's header cites (`loop/2026-08-18/archaeology/`): the window rule,
  `rowTexts`, `norm`, the sentence split and `flagSurvives` are copied into `measure.js`.
- **New:** the class.
  - A reply's first 300 normalised chars are classed CORRECTION or AGREEMENT by registered keyword openings; a bare "ok" is neither.
  - C-ADJ = the sentences (≥ 40 chars) of the assistant turn that reply answered.
  - CONTROL = every other assistant sentence in the window.
  - PRIMARY survival: verbatim (`norm(sentence)` is a substring of `norm(summary)`); the archaeology's fuzzy rule beside it.

**Result** (`node exo_memory/loop/compaction_corrections_2026-10-05/measure.js`; output kept as `baseline_2026-10-05.json`, sha256
`8a20bfa1c2d68f46…`; 878 project dirs, 2 skipped by name, 2,828 transcripts):

| set | events | with C-ADJ | C-ADJ sentences | **verbatim** | fuzzy | CONTROL sentences | control verbatim | control fuzzy | summary median |
|---|---|---|---|---|---|---|---|---|---|
| **BASELINE** (after 2026-08-19, under today's directive) | 102 | 28 | 1,759 | **5 (0.28%)** | 104 (5.91%) | 78,653 | 30 (0.04%) | 4,234 (5.38%) | 18,674 chars |
| all events | 137 | 61 | 4,698 | 6 (0.13%) | 160 (3.41%) | 126,949 | 53 (0.04%) | 5,166 (4.07%) | 18,393 chars |

- **Reply classes in the baseline:** 52 CORRECTION, 41 AGREEMENT, 6,103 neither.
- **The premise holds.** Its registered kill line was ≥ 50% verbatim; it is 0.28%.
- **The registered SECONDARY outcome FIRES, as prominently as it was registered:** C-ADJ survives verbatim *more* often than CONTROL (0.28% against
  0.04%, about 7×; fuzzy 5.91% against 5.38%). The summarizer already leans toward these sentences a little. Both rates are near zero, which
  is why the line is still added, but the case is "almost nothing is kept verbatim" more than "these are singled out to be dropped".
- **Class precision, spot-checked** (`compactC/spot.js`, a seeded 15 of each, read in my terminal only and written NOWHERE):
  - AGREEMENT ≈ 14 of 15 real;
  - CORRECTION ≈ 7 of 15: the opener `wait` mostly starts a question or an instruction, not a correction.
  - This is the noise the PREREG registered. The bar is scored with the same instrument on both sides, so it biases both the same way; it
    does not tune either.

## §3 · The change (smallest; the master and the installed copy byte-identical)
`consonance/hooks/precompact-preserve.js`:
- **Item 1, every seat:** ONE new line, item 6 of the directive: *"6. VERBATIM and quoted, every sentence of the assistant's that the user
  answered with a correction or an agreement."*
- **Item 2, the Third Place's seat only:** a 5-line section 0, *"What is alive for them right now"*, placed ABOVE every task-shaped item. The
  cwd test is board-digest's path-normalised `tpNorm` (master `board-digest.js:303-304`, B's follow-up), so `…\third-place\.`, a trailing
  separator, forward slashes and lower case are the seat. Lookalikes (`third-placement`, `third_place`, `my third-place`, a bare relative
  `third-place`) are not.
- `main()` passes `payload.cwd`; `isThirdPlaceCwd` is exported. The dream gate is unchanged and still exits first.

**Byte-identical for every other seat except the item-6 line (checked):**
- the old directive's sha256 per trigger, taken from the installed hook BEFORE the change: manual `0a5872ed…`, auto `3bdc67c8…`, none
  `1e99447c…`;
- the new build-seat directive with the item-6 line removed has exactly those hashes, for 8 build cwds × 3 triggers, and the stdout shape
  `{additionalContext, suppressOutput: true}` is unchanged. This is test 1 below.

**Backups, byte-identical, made before any edit:** `exo_memory/handback/p-compact-C_2026-10-05_backups/`, `precompact-preserve.installed.js`
and `.master.js`, both sha256 `575176c2cc19f384…` (`cmp` with the live files, then). Rollback: copy `precompact-preserve.installed.js` over
`~/.claude/shell/precompact-preserve.js`.

**Tests** (`consonance/hooks/precompact-preserve.test.js`, 3 new; each run under the lock):
- **Red** on the old hook (the backup in a scratch copy with the new test file): **2 of the 3 new tests fail** (item 1 byte-identity, item 2
  section). The third, "the dream gate still wins", is a guard and passes on both.
- **Green:** **14 / 14** (11 old + 3 new). `dream-gate.test.js` (it spawns every hook) **1 / 1**.

## §4 · Installed
- **Install time: 2026-10-05T21:09:40Z** (`date -u` immediately after the copy). The bar's `--after` is this time.
- **Order:** the bar (this file, §1) was committed as `2a65fb8d` at 15:09:40 -0600 = 21:09:40Z, in the same command and BEFORE the copy, so the stamps share a second; git's order is the evidence.
- **How:** `cp consonance/hooks/precompact-preserve.js ~/.claude/shell/precompact-preserve.js`, then `cmp` → identical. Installed sha256 `641c1b7b833e933e…`; it was `575176c2…` (= the backup) right before.
- The settings entry was not touched (`~/.claude/settings.json:87` already runs the installed path).

## §5 · Corrections, mine
- **The PREREG's own header says "~15:20 local (21:20Z)"; it was written and committed at 15:03:21 local.** The commit stamp is the
  authoritative time, and the registered file was not edited after the fact.
- **The first baseline run reported CONTROL's count as `null`.** `surv()` read `.size` and CONTROL was an Array. It was fixed to a Set, which
  is arithmetic only (C-ADJ was a Set all along and its numbers did not move), and re-run; the numbers above are the re-run.
- **My first capture of the old output** read `trigger: unknown` where I sent `manual`: shell quoting broke the JSON. It was redone through
  `node` from the backup's exported `instruction()`. A first Third Place check failed the same way (bash ate the backslashes), and a file
  with `String.raw` fixed it. One test literal was `String.raw` ending in a backslash, a syntax error that ran nothing; it is now an
  ordinary string.

## §6 · Not verified
- **The backups are byte-identical in the WORKING TREE** (`cmp`, above). Committed (`8273e0db`), git stores them LF-normalised (`core.autocrlf`; it warned). A checkout restores CRLF. For a byte-exact rollback, use the working-tree file or re-add the CRs.
- **Whether the summarizer obeys item 6 or section 0.** That is what the bar measures over the next compactions.
- **A live Third Place compaction** (not observed, by rule).
- **The other seats' uncommitted hook edits** in `consonance/hooks/` (`board-digest.js`, `ask-surface.js`, `sessionstart-state.js`) were
  not touched, and my commit names only my paths.
