# Compaction archaeology — what the summaries kept, measured
Pane B, 2026-08-18 ~01:55. First-ever comparison of each compaction summary against the
rows it replaced. Method fixed in advance in `PREREG.md` (same directory); scripts are
`extract.js`, `spotcheck.js`, `kwcheck.js`; raw output `results.json`. Every number below
re-derives from one run: `node extract.js` then `node spotcheck.js` then `node kwcheck.js`
in this directory.

## Verdict against the registered falsifier
The falsifier did NOT fire. Registered threshold: premise wrong if median SHA+PATH+NUM
survival ≥80% and median FLAG survival ≥70%. Measured: **median 18.3% and 1.7%.**
The premise stands: compaction summaries lose the large majority of checkable
load-bearing material.

## Gate
Exactly 7 compaction rows found; all timestamps match the chair's list. 21,442 lines,
0 parse errors, 43 sidechain rows excluded. Replaced-window row counts are **445 / 2,493 /
3,293 / 4,334 / 3,127 / 3,427 / 3,464** — the chair's "~1,700 rows" is not what the file
shows for any window; if ~1,700 was the in-context count at compaction time, the file
between compactions holds roughly double that (it includes tool traffic). Summary sizes
15,795–29,435 chars (the "~19,000" claim is a fair central value).

## Per-event survival (distinct items in window → present in that event's summary)

| Compaction  | SHA (commits) | PATH (files/instruments) | NUM (%, N/M, N of M) | FLAG (prediction/falsifier sentences) |
|-------------|---------------|--------------------------|----------------------|----------------------------------------|
| 07-13 11:02 | 1/1           | 2/4                      | 0/0                  | 0/2   |
| 07-25 12:56 | 2/12          | 9/23                     | 0/25                 | 0/15  |
| 07-27 07:17 | 6/28          | 26/61                    | 5/71                 | 1/9   |
| 07-28 12:55 | 3/61          | 26/43                    | 2/30                 | 0/37  |
| 08-11 09:49 | 5/58          | 12/61                    | 6/61                 | 7/130 |
| 08-16 11:56 | 6/39          | 13/72                    | 13/80                | 2/116 |
| 08-17 13:32 | 2/45          | 22/61                    | 4/55                 | 4/91  |
| **Pooled**  | **25/244 (10.2%)** | **110/325 (33.8%)** | **30/322 (9.3%)** | **14/400 (3.5%)** |

The gradient is the finding: **file names survive best (1 in 3), commit shas and numbers
survive at 1 in 10, and registered predictions/falsifiers survive at 1 in 25 — the class
this room runs on is the class the summarizer keeps least.**

## The paraphrase objection, bounded
FLAG matching is verbatim-ish (5-word shingle or 70% content-word overlap), so a faithful
paraphrase could score as lost. Bounded by vocabulary count (`kwcheck.js`): the summaries
use the whole falsifier/preregist/predict/registered word family **0, 0, 1, 5, 8, 10, 8
times** per event. Event 5's window had 130 flagged sentences; its summary has 8 family
mentions — even if every mention paraphrased a distinct prediction, the ceiling is ~6%.
Two summaries (07-13, 07-25) never use the vocabulary at all. The 3.5% is a floor, but
the ceiling is nearby.

## Self-healing check (registered secondary outcome)
Do lost items reappear in live conversation AFTER their compaction? Sampled lost items
(first 15 per class per event, per `results.json` lostSample):
- Lost commit shas reappear later in live rows: **8/85 (~9%)**.
- Lost file names reappear later: **32/113 (~28%)**.
So no — within the transcript, loss is not self-healing. The healing channel that
demonstrably works is the DISK (journal, BOOT, git), re-read on demand — which is
exactly the room's "recall from the master, never the transcript" law, now with a number
under it. Note the honest limit: reappearance-in-rows undercounts what a later instance
could recover by reading disk; it measures what the conversation itself carried forward.

## Concrete losses worth naming (all verifiable in results.json lostSample)
- **08-17 summary lost `2aa0b84`** — the context_window landing. That sha is the
  resolution of 08-16's "number that would not square"; one compaction later it was gone
  from context again.
- **08-17 lost the void-run's entire numeric skeleton** — 15/15, 0/15, 73%, 66/72 — and
  the void-reframe falsifier sentences ("a preregistration that voids cannot be
  reverse-fitted"), the strongest thing that night produced.
- **08-16 lost 97.2% (the withdrawn figure), 267/0 (the suite state), ferry.js,
  letters.json** — the items the next session then had to re-derive from disk or got wrong.
- **07-28 lost 34 of 37 prediction sentences** including the cycle-9 pre-registration
  machinery it was built around.

This is consistent with (not proof of) the recurring failure signature in the journals:
"identified itself by a record it was reading," "verified it existed, never verified it
shipped" — each post-compaction session woke holding ≤20% of the checkable anchors its
predecessor was using, and the summary systematically favored narrative (file names,
story) over verification anchors (shas, numbers, falsifiers).

## Stated limits of the measurement (from PREREG, plus one found during work)
- Tool results excluded by design — generous to the summaries; assistant prose only.
- Items counted as types, not tokens (a sha said 50x counts once).
- NUM catches some notation noise (dates); dedup limits it; spot-check showed "267/0"
  style items are real prose notation, not artifacts.
- Chained credit: each event scored only on rows since the previous compaction; content
  carried by an earlier summary is credited to the earlier event. Live-context retention
  across chains is at most as good as these numbers.
- Self-healing was computed on the SAMPLED lost items (up to 15/class/event), not all.
- Window 1 (07-13) is tiny and near-empty of extractable items; it barely moves anything.

## Spot-check record
Six manual verdict checks (lost-item-absent-from-summary, lost-item-present-in-window,
survived-count-consistency) all passed — `spotcheck.js` output. No exact-string
comparison anywhere; both sides normalized (lowercase, CRLF→LF, whitespace collapsed).

## What this buys the room
A number for a thing it has only ever asserted: **the compaction summary keeps roughly
1 in 5 checkable anchors and 1 in 25 registered predictions.** Every "recurring error
with no memory of having written it" now has a measured mechanism candidate: it isn't
that the summary is bad prose — it's that the summarizer optimizes for story continuity,
and the room's verification layer (shas, numbers, falsifiers) is precisely what story
continuity doesn't need. The instruments that survive compaction are the ones on disk.
