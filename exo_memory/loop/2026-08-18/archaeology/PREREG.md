# PRE-REGISTRATION — compaction-summary survival measurement
Written 2026-08-18 ~00:45, BEFORE any row of the target transcript was read by this instance.
Target: C:\Users\zackn\.claude\projects\C--Consonance-instances-main\0c0c0c0a-0000-4000-8000-000000000a01.jsonl
Job: for each of the 7 compaction events, measure how much load-bearing material in the
replaced window survives into the compaction summary.

## Window definition (fixed now)
- A compaction event = a `user` row whose text begins "This session is being continued".
- The window for event N = all rows strictly between event N-1 (exclusive) and event N
  (exclusive). Window 1 runs from file start.
- NOTE, stated up front: the live context at compaction time also contained the PREVIOUS
  summary. Chained content is credited to the earlier event's measurement; each event is
  scored only on the fresh rows since the last compaction. This slightly UNDERSTATES total
  preservation across chains; direction of bias recorded here in advance.
- Rows with `isSidechain: true` or `isMeta: true` are excluded (never in main context).
- Only text blocks from `user` and `assistant` rows are scanned for window material.

## Definition of "load-bearing" (fixed now — four mechanically checkable classes)
1. **SHA** — commit hashes: word-bounded hex tokens 7–40 chars containing at least one
   digit AND at least one a–f. Deduped by 7-char prefix (short vs full sha = same item).
2. **PATH** — file/instrument names: tokens ending in a code/doc extension
   (md, js, rs, ps1, psm1, json, jsonl, py, html, css, toml, yml, yaml, sh, vbs, txt, exe).
   Deduped by lowercased basename. Survival = basename appears anywhere in summary
   (path prefixes legitimately vary).
3. **NUM** — numbers with structure: percentages (`N%`, `N.N%`), ratios (`N/M`), and
   `N of M` counts. Deduped by normalized string; `N of M` and `N/M` are treated as
   equivalent forms for the survival check.
4. **FLAG** — registered-prediction/falsifier sentences: sentences in assistant text
   matching /falsifier|pre-?regist|predict|registered/i, ≥40 chars. Survival = any
   5-consecutive-word shingle of the normalized sentence appears in the normalized
   summary, OR ≥70% of its distinct content words (len ≥4) appear in the summary.

All matching is done on text normalized: lowercase, CRLF→LF, whitespace collapsed.
(Trap acknowledgments: no grep -c anywhere — counting is per-item in script; all
multi-step logic lives in a .js file, not shell pipes; normalization is applied to both
sides before every comparison.)

## What this definition EXCLUDES, and why
- **Tool results and tool_use inputs** — the bulk of the 105MB. A summary summarizes the
  conversation, not raw tool output; scoring it on tool output it was never going to
  carry would manufacture a low number. Load-bearing values that mattered were restated
  in assistant prose, which IS scanned. This is the single biggest judgment call and it
  runs in the direction of being GENEROUS to the summaries.
- **Philosophy / dynamics / persona prose** — not mechanically checkable, and BOOT is
  re-injected every session, so its survival never depended on the summary.
- **"Corrections the chair made to itself" as a class** — requires semantic judgment to
  identify; rejected as unmeasurable. Captured indirectly only when a correction contains
  a sha/path/number/flagged sentence.
- **"Named open items" as a free-text class** — same reason; captured only via FLAG
  keywords.
- **Instrument names without extensions** (e.g. "the board audit") — not reliably
  extractable; instruments are counted only via their file names.
- Bare counts without structure ("18 commits") — too noisy to extract without judgment.

## Known measurement limitations (registered before running)
- FLAG survival is verbatim-ish; a faithful PARAPHRASE of a prediction can score as lost.
  FLAG numbers are therefore a FLOOR on semantic survival. SHA/PATH/NUM don't have this
  problem (a paraphrased sha is not a sha).
- NUM ratio regex will catch some dates (8/18) as noise; dedup limits the damage; noted.
- A sha mentioned once in passing counts the same as one mentioned fifty times (types,
  not tokens). Dedup is the point: the question is whether the ITEM survived.

## FALSIFIER — what result means the premise of the job is wrong
The premise: compaction summaries lose a material fraction of load-bearing content.
**The premise is WRONG and the planned night of work dies if: across the seven events,
the median per-event survival of SHA+PATH+NUM combined is ≥80% AND median FLAG survival
is ≥70%.** If that happens I will say so plainly as the headline finding.
Secondary registered outcome: if survival is low but spot-checks show the lost items were
re-derived in later live rows anyway (self-healing loss), that materially weakens the
premise even below the threshold, and gets reported with the same prominence.

## Verification gates (before any survival number is computed)
- The script must find exactly 7 compaction rows, and their timestamps must match the
  chair's list (2026-07-13T11:02, 07-25T12:56, 07-27T07:17, 07-28T12:55, 08-11T09:49,
  08-16T11:56, 08-17T13:32). Mismatch = stop and report, no measurement.
- Report actual replaced-row counts per window against the "~1,700" claim.
