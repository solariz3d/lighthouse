# P-COMPACTION-READ — C (CHARLIE), D089 (unattended, lap 10, stage 2 of 2), NON-AUTHOR reader, on D — DRAFT, appended as the lap runs

**Read:**
- the registration `exo_memory/loop/compaction_survival_remeasure_registration_2026-09-19.md` (`e0033bc`);
- B's hand-back `exo_memory/handback/p-compaction-remeasure-B_2026-09-19.md`;
- B's outputs `exo_memory/loop/compaction_remeasure_D089/`.

HEAD at start: `d0c8624`. Read-only. The keeper is asleep, so no question is put to anyone. **No word of the keeper's
from the transcripts is quoted into any file.**

## Log

- 13:4x — read the registration in full. First observation, before any ruling: every file in
  `compaction_remeasure_D089/` has an mtime of 13:40:39–13:40:40 (`ls -la --time-style=full-iso`). They were copied into
  the repo together, so **the repo copies cannot show ordering (item 4)**. B's scratch originals are needed.

`BS` = B's scratch, `…/C--Consonance-instances-sibling-5bf9d657/12fb81f6-…/scratchpad/compact/`.
`MS` = mine, `…/C--Consonance-instances-sibling-0845a868/0845a868-…/scratchpad/compact/`.

---

## 1 · The three copy diffs: CONFIRMED, they change only what B says

- **I re-derived each diff myself** from B's actual copies:
  `git diff --no-index --ignore-cr-at-eol <tracked> BS/<name>-copy.js`, then compared the changed lines with the
  committed `OUT/*-copy.diff`. **They are identical for all three.**

  | copy | changed lines, mine | changed lines, committed |
  |---|---|---|
  | extract | 18 | 18 |
  | spotcheck | 4 | 4 |
  | kwcheck | 2 | 2 |

- **What they change:**
  - `extract`: `FILE` by argument; `OUTDIR` by env; a `BEFORE`/`AFTER` date filter; and the gate's expected list filtered
    by the same rule.
  - `spotcheck`: `FILE` and `RES`.
  - `kwcheck`: `FILE`.

  No class definition, window rule, dedup or survival rule is touched.
- **"Applied AFTER the windows are cut" holds, from the tracked source.** Windows are built during the scan: each event
  is pushed with `windowRows: cur.rows` and its class sets as the stream passes (`extract.js`, the `events.push({…})` in
  `main`). The copy's filter splices the already-built `events` array afterwards, so a kept event's window is the
  unfiltered one.
- **The gate change is the one place worth naming.** When the filtered expected list is empty (every POST run), the gate
  writes a note and **does not fail**. For POST runs the gate therefore checks nothing, and the universe table is the
  only gate, as the copy's note says. That is consistent with REG §3 (`:17`), and it is a real weakening, stated.
- **Tracked scripts unchanged:** `sha256sum exo_memory/loop/2026-08-18/archaeology/{extract,spotcheck,kwcheck}.js` →
  `d90beb2d…`, `877a5804…`, `51978e70…`, B's figures. `git status --short` on that directory is clean.

## 2 · The universe table against the transcripts: CONFIRMED by an independent scan

- **My own scanner, `node MS/myuniverse.js <file> <seat>`** → `MS/my-chair.txt`, `MS/my-lib.txt`. It prints metadata only.
  - Event = a non-sidechain, non-meta `user` row whose text begins "This session is being continued" (PREREG's
    definition).
  - Trigger = the nearest `compact_boundary` row's `compactMetadata.trigger`.
  - Marker = every row within ±10 lines of the event whose raw JSON contains `[PRECOMPACT-PRESERVE-V1]`, given as a
    signed offset.
- **Chair: 63,562 lines, 19 events. Librarian: 30,067 lines, 9 events.** (B's 63,536 was taken at an earlier moment of
  a live file.)
- **Where the marker sits:**
  - Every marked event has it at **exactly +3 rows** and never before: 0 of 28 events have a marker at a negative
    offset within ±10.
  - Chair #8–13, #17, #18 are marked, all `manual`. The 7 PRE events and #14, #15, #16, #19 (all `auto`, #19's boundary
    at −4) have no marker within ±10.
  - Librarian #5 and #9 are marked (`manual`); the 7 `auto` events have none.
- **Against `OUT/universe.tsv`:** the timestamps are identical to the millisecond on all 28 rows, and so are the class
  and the `markerBefore`/`markerAfter` flags. **The registration's filter ("in the rows just before") matches 0 of 28:
  POST as written is empty.**

## 3 · The PRE control: REPRODUCES EXACTLY, re-run by me

- `OUTDIR=MS/pre BEFORE=2026-08-18 node BS/extract-copy.js <chair file>` (B's copy, sha256 `1da6a14d…`) → exit 0.
  **7 events: SHA 25/244 · PATH 110/325 · NUM 30/322 · FLAG 14/400**, REG §1's figures exactly.
- **Against the committed `archaeology/results.json`:** my 7 events are identical to its first 7 on ts, windowRows,
  summaryChars and every class count (`node -e` compare → **7 of 7**).
- The committed file holds an **8th event**, 08-18 13:38. Its pooled totals (46/273 · 125/370 · 51/370 · 22/509) minus
  my 7 give **21/29 · 15/45 · 21/48 · 8/109**, exactly B's decision-3 figures for event 8.

## 4 · The spread rule: ARITHMETIC CONFIRMED, and the files predate the first POST output

- **Re-derived from my own PRE run** (type-7 quantiles, rates of events with total > 0; `node -e` in `MS/`):

  | class | IQR | bar |
  |---|---|---|
  | FLAG | 0.0489 | 8.39% |
  | SHA | 0.1228 | 22.52% |
  | PATH | 0.1844 | 52.29% |
  | NUM | 0.0243 | 11.75% |

  Identical to `OUT/pre-spread.json`.
- **POST verdicts re-derived on B's 7 marked events** from `BS/post-chair/results.json`:

  | class | POST | events above the bar | verdict |
  |---|---|---|---|
  | FLAG | 26/406 = 6.4% | 3/7 | DECORATIVE |
  | SHA | 124/348 = 35.6% | 5/7 (needs 5) | WORKS |
  | PATH | 183/590 = 31.0% | 0/7 | DECORATIVE |
  | NUM | 110/496 = 22.2% | 7/7 | WORKS |

  **These are `OUT/verdict.txt` line for line.**
- **SHA's WORKS sits exactly on the two-thirds line:** 5 of 7 events needed, 5 above.
- **File times** (B's originals; `stat -c "%w | %y"`, −06:00):

  | time | file |
  |---|---|
  | 13:37:56.5 | `pre/results.json` born |
  | **13:38:13.8** | `pre-spread.json` |
  | **13:38:27.7** | `decisions.txt` |
  | **13:39:13.7** | **the first POST output** (`post-chair/results.json` born; `post-lib` 13:39:14.98) |

  `pre-spread.json` and `decisions.txt` have no modification after those times. **Both predate every POST output.**
  `markers.js` (13:36:19) produced marker positions, not rates. `universe.js` ran at 13:38:49, after `decisions.txt`,
  and it produces counts, not rates.
- **Limit:** file times are set by the writer's clock on the same machine, and a determined writer could reset them.
  They are evidence of order, not proof. Nothing suggests tampering.

## 5 · B's central finding: CONFIRMED at the ledger

- `node MS/ledger.js` → `MS/ledger-run1.txt`, over `C:/Consonance/data/precompact.jsonl` (1,479 rows): for each of my 28
  events, the nearest ledger row for the same `session_id` at or before the event, within 15 min.
- **Every auto compaction that has a ledger row has a `precompact-attempt` row with `trigger=auto` 90–229 s before it:**
  - chair #14, #15, #16, #19;
  - librarian #1–#4.

  Every manual one with a row has `trigger=manual`, 120–184 s before it (chair) and 124 s (librarian #9).
- **So the hook fires on both triggers, and only manual compactions leave the marker in the transcript.** The marker
  records how a manual compaction is logged, not whether the directive was sent. B's "1.5–3.8 min" is 90–229 s. Checked.
- **Without a ledger row on D:**
  - chair #1–7 (PRE; the ledger starts 08-18 12:09Z with a reset row);
  - chair #17;
  - librarian #5–#8.
- **The librarian's session has 20 ledger rows; only 5 match an event in D's librarian transcript.** The other 15 (from
  08-22 on) are fires whose compactions are not in that file. **Not resolved here**, and it bears on B's "absent from D".

## 6 · The suspected slip in B §6.4: CONFIRMED, B is wrong on this point

- The registration commit `e0033bc`: `git log -1 --format=%ad --date=iso-strict` → **2026-09-19T13:34:42−06:00**, which
  is 19:34:42Z.
- Librarian event #9 is **2026-09-19T13:36:30Z = 07:36:30 local (UTC−6)**. Its manual ledger fire is
  **13:34:26Z = 07:34:26 local** (`node -e` conversion).
- **That is "this morning's 07:34" compaction, the one REG §1 (`:7`) cites.** It IS visible on D, as librarian event 9:
  manual, marker at +3, ledger fire 124 s before. It came **about six hours BEFORE the registration, not "2 minutes
  after"**. B compared a UTC event time (13:36Z) with a local commit time (13:34 local).
- B's sentence "D's librarian transcript has no event between 09-16 13:00 and 09-19 13:36" is true in UTC and is
  exactly why the event looked missing: the 13:36Z event is the 07:34 one.
- **Consequence:** the librarian's POST-AMENDED set includes the librarian's own registering compaction. The librarian's
  events are descriptive (REG §6), so no chair verdict moves.

## 7 · RULING for the librarian

**The registered result is: VOID AS WRITTEN — the registrant's filter matched nothing** (0 of 28 events have the marker
"in the rows just before"). B's amended table stands as **DESCRIPTIVE, pre-number-fixed**, and **not as the scored
result.** Reasons, in order of weight:

1. **The amended filter does not implement the registration's intent either.** §3's purpose is "the directive cannot be
   credited or blamed where it did not fire". The ledger (§5 above) shows the hook fired before auto compactions too, so
   the amended filter ("marker in the 5 rows after") selects **manual compactions**, not **treated compactions**. It
   swaps one wrong proxy for another, and it confounds the trigger with the treatment.
2. **The amendment rewrites §3's data definition, which neither §2 nor the registrant authorized.** §2 permits "the
   target path and an event filter by date"; §7 voids only changes made *after* the first POST number. B's change came
   before any POST number (§4 above: 13:38:27 vs 13:39:13.7), so it is **not p-hacked, and I say so plainly**. But
   "not voided by §7" is not the same as "registered". A runner who fixes the registrant's criterion before the numbers
   has made a good-faith deviation, and the honest name for its output is a pre-committed exploratory result.
3. **One verdict moves between the two defensible readings.** Taking POST as every ledger-fired chair event after 08-18
   (all 11: the directive's own record of firing), by the same arithmetic (`node -e` in `MS/`):

   | class | 11-event POST | events above the bar | verdict | the 7-event verdict |
   |---|---|---|---|---|
   | FLAG | 49/594 = 8.25% | 6/11 | DECORATIVE (**0.14 points under** the 8.39% bar) | DECORATIVE |
   | SHA | 226/718 = 31.5% | 7/11 (needs 8) | **NEITHER** | WORKS |
   | PATH | 323/1041 = 31.0% | 0/11 | DECORATIVE | DECORATIVE |
   | NUM | 171/724 = 23.6% | 10/11 | WORKS | WORKS |

   So **FLAG DECORATIVE, PATH DECORATIVE and NUM WORKS are stable across both readings, and SHA is not.**
   - FLAG's stability is thin under the 11-event reading: 8.25% against 8.39%.
   - This 11-event table is also descriptive; it is B's own rejected alternative (B §6 Q2).
4. **Even a clean filter would leave B's §0.3 standing:** there is no untreated comparison after 08-18, so any WORKS is a
   before-and-after difference across a month and ten client versions, not an effect of the directive.

**What the librarian can file as the headline, FLAG first (REG §7):** *VOID AS WRITTEN. Descriptively, under both
defensible readings, FLAG and PATH did not rise past the PRE spread and NUM did. SHA rose past it only under the
manual-only reading. No reading has an untreated control, so none can attribute a rise to the directive.*

## Questions for the morning (the keeper is asleep; the conservative default was taken)

1. **Re-register?** Default recommendation: a new registration with POST = ledger-fired events (the hook's own record),
   and an untreated comparison window with the hook off. That comparison is the keeper's machine and the keeper's call.
2. **The librarian's 15 unmatched ledger fires:** which transcript holds those compactions? Default: not resolved in a
   read-only lap; named in §5.

## What is NOT verified

- **L:** chair #17 and librarian #5–#8 have no ledger row on D and were not checked on L.
- **B's `post-lib/` results and the librarian's descriptive rows:** not re-derived. My re-derivation covers the chair's
  PRE control, the spread, and the 7- and 11-event chair POST sets.
- **`spotcheck-copy.js`'s PASS count (B: 6/0)** was not re-run.
- **Tampering:** the file times are the writer's own clock; evidence of order, not proof (§4).
- **The window row counts in `universe.tsv`:** I checked events, triggers and marker positions, not each POST window's
  row count.
- **No transcript text** is quoted in this file, and none was copied out of the transcripts. My scanners print
  metadata only.
