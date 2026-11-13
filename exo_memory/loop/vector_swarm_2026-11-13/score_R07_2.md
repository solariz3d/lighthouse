# Score R07, scorer 2: "A stage end, alarm or finding has no named consumer, deadline or wake path"

Scorer 2 (Sonnet research agent), 2026-11-13. Rows scored: 1,116 (1,123 minus 7 marked REMOVE: L0029 L0162 L0255
L0299 L0300 L0390 L0409). I read each row's wording in the merged ledger (event, cost, who caught it); I opened no
primary [read: row text only]. Verdicts are [inferred] from the row text. Rule used: YES needs a one-line mechanism
(a named consumer, a deadline, or a wake path would have ended or surfaced it at once). Lock-queue waits caused by
load, wrong figures, own-work errors, design misses and rework rows are NO: the root does not touch them.

Rows not listed as YES or PARTLY below are NO (listed once at the end by count, not by row, to save space).

## Totals

- YES: 65
- PARTLY: 53
- NO: 998 (of 1,116 scored; 7 REMOVE rows skipped)

[read: counted by a node script over my verdict file and the ledger id list]

## Cost covered (YES rows only)

- 31 of the 65 YES rows state a cost in minutes; 34 YES rows have no cost recorded (or it is not in minutes).
- No YES row states tokens. (L0025 states about 0.5M characters of context, not tokens; not counted.)
- Minutes in the 31 YES rows: 32,004 min as stated. Of that, 27,059 min are five long dwells or record gaps that are not
  a wait someone paid for turn by turn: L0076 5,099 (dwell), L0133 7,560 (126 h lap), L0487 7,200 (up to five days),
  L0788 5,760 (four days of dropped items), L0955 1,440 (a day without a record). Without them: 4,945 min.
- Possible double counts inside it: L0143 and L0144 (537 and 540, same night's baton), L0239 and L0254 (82, same stall),
  L0068 and L0074 (80, same night). Removing the smaller of each pair: about 4,246 min of the 4,945 are distinct.
- Each YES row's minutes are the ledger's own figure [read: ledger row]; I did not re-derive any.

## YES and PARTLY rows (mechanism in one line)

| id | verdict | mechanism |
|----|---------|-----------|
| L0001 | YES | 42 QUEUED rows have no drain row; a named drain consumer with deadline would show/clear each |
| L0002 | YES | queued deliveries wait unbounded; a deadline/wake on queue age bounds the wait |
| L0003 | PARTLY | UNCONFIRMED dispatches have no consumer that re-sends; confirm-or-retry owner shrinks it |
| L0004 | PARTLY | MISSED keep-warm/API Error lines have no seat acting on them |
| L0006 | PARTLY | 173 MISSED rows with no named consumer |
| L0008 | PARTLY | dispatch lodged unsubmitted in idle composers: next actor not woken |
| L0017 | PARTLY | 3293 unsourced turns recorded; no seat/gate consumes the line |
| L0025 | YES | state block emitted 163 times, 0 acted: emitter with no consumer (cost ~0.5M chars) |
| L0038 | PARTLY | prereg results sat in own files; no named consumer filed them in a journal |
| L0046 | YES | board post was a write not a wake; a wake path would deliver the turn [cost 4 min] |
| L0050 | YES | ferry-watch line printed for hours, nobody had the job of acting; 84/109 never ferried |
| L0067 | YES | carrier-drift RED 2050 times, 68 spoke; no consumer for the red |
| L0068 | YES | lap died at WORKING, no one named to collate; deadline/wake would catch it [cost 80 min] |
| L0074 | YES | collation alarm was a conjunction nothing computed; a consumer+deadline fires it [cost 80 min] |
| L0075 | YES | dispatched L014 and armed no timer; stalled collation had no deadline |
| L0076 | YES | lap stalled, noticed only by keeper silence; stall deadline pages a named seat [cost 5099 min] |
| L0077 | YES | same stall-by-silence; deadline pages owner [cost 4.2 min] |
| L0078 | YES | same stall-by-silence [cost 42.5 min] |
| L0079 | YES | lap sat at MAP with 5 idle panes, no wake; stall alarm with owner [cost 29.7 min] |
| L0090 | PARTLY | counter owes the librarian forever: stage-end consumer miscounted |
| L0094 | YES | essay faded because no waking seat was named to carry it |
| L0102 | PARTLY | ceiling red unowned for pane shells |
| L0115 | PARTLY | delivery into finished screen waited full 240 s hold; wake path would deliver sooner |
| L0132 | PARTLY | idle read false 240 s on finished chair screen so delivery forced; a wake path avoids the hold |
| L0133 | YES | lap RETURN-LEG held by chair 126 h, invisible; named owner+deadline alarm catches it [cost 7560 min] |
| L0134 | PARTLY | dead lap pulsed as live; librarian locked out; no consumer for the stall |
| L0136 | PARTLY | finding reached only hand-back, never the finding pane; no named consumer |
| L0143 | YES | baton sat with librarian 8h57m, nothing woke it; wake path P-BATON-WAKE [cost 537 min] |
| L0144 | YES | librarian held baton 9 h unwoken; same wake path missing (may overlap L0143) [cost 540 min] |
| L0149 | YES | handing a baton away destroys sender's standing to announce; hand-off with no wake |
| L0150 | YES | hand-backs refused out of turn; finished hand-back waits on chair's turn (no named path) |
| L0164 | PARTLY | baton-wake hook sees 10 of 375 deliveries; wake instrument misses the path |
| L0167 | YES | two fixes sat two laps: owner named was the finder, no owner row |
| L0175 | PARTLY | 6/10 deliveries forced 240 s, 16 laps unfiled, 39 raised hands needing clicks |
| L0176 | PARTLY | raise_pull failed silently 36 rows; signals with no receiver |
| L0184 | PARTLY | L043 stalled 72 min on chair's composer text; stall alarm with owner would page |
| L0196 | PARTLY | chair sat 29 min on return leg; hand-back refused out of turn |
| L0202 | PARTLY | deliveries forced 240 s; keeper unstuck loop |
| L0218 | PARTLY | 38 UNDELIVERED rows; no consumer |
| L0235 | YES | chair window full ~100 min, rings queued unstamped; a queue-age alarm with owner [cost 100 min] |
| L0239 | YES | pulse printed lap-older-than-10-min 345 times, no station acted: emitter without consumer [cost 82 min] |
| L0240 | YES | chunk 2 not driven open after chunk 1 filed; no named next actor/wake [cost 81 min] |
| L0241 | YES | chair waited on delivered ring till keeper wrote; no wake/deadline (cost may be another fault per plan) [cost 264 min] |
| L0242 | PARTLY | yesterday's unfiled lap held the station; no owner closes unfiled laps |
| L0245 | PARTLY | 26/43 dispatches forced, one ruling never sent; wait path unbounded |
| L0254 | YES | NEXT line naming no station preceded stall (overlaps L0239) [cost 82 min] |
| L0288 | PARTLY | ring queued behind busy librarian, read as idle; sender not told queue state |
| L0292 | YES | STALE stamp held rings 16+ min, 240 s force skipped STALE; queue-age deadline with owner [cost 16 min] |
| L0293 | YES | ring queued silently at librarian; sender told nothing, had to re-ring |
| L0294 | YES | E promised an addendum, wrote it without re-ringing; collator had no wake path [cost 50 min] |
| L0303 | PARTLY | turn blocked 3h28 on AskUserQuestion; only a keep-warm MISSED row signalled, no owner |
| L0304 | PARTLY | Main crashed, header said awake; only a MISSED row signalled, no owner |
| L0326 | PARTLY | 1969 flagged rows, acted-on rate not recorded; no consumer of the flags |
| L0352 | YES | shadow trial never reviewed by its own header 5 weeks; named reviewer+deadline |
| L0355 | YES | push-gate failed open 9 times, nobody recorded acting; consumer of the row catches it |
| L0364 | YES | 1,335 strict-would-refuse rings and 1,783 sources warnings reached no seat; no consumer |
| L0381 | PARTLY | 12 stale open laps; no owner closes laps |
| L0386 | YES | 1023 would-block rows, zero acted; no consumer |
| L0387 | PARTLY | 22 ask-ending flags shadow only, never reviewed |
| L0398 | YES | scheduled jobs disabled 16 days, nobody until a seat looked; no alarm owner |
| L0412 | YES | D348 tied to busy pane C and queued all night with A,B free; owner+deadline on queued work |
| L0415 | YES | registered H3 score never taken, window closed; no named consumer with deadline |
| L0418 | YES | ring sat unsubmitted 38 min, "delivered" printed; consumer ack/wake path catches [cost 38 min] |
| L0428 | YES | 2468 gate warns went through, no seat recorded acting; no consumer |
| L0463 | PARTLY | refused visit line lost silently; no one told why |
| L0487 | YES | 17 finished hand-backs sat untracked up to 5 days; no named owner to ship them [cost 7200 min] |
| L0525 | YES | watcher waited ~8 h for a log never written; deadline on a wait would fire [cost 480 min] |
| L0537 | PARTLY | 68 of 85 open laps done but never filed; no owner closes laps |
| L0543 | PARTLY | entry never rung; two machines unaware 4 days; no named next actor |
| L0544 | PARTLY | second-reader flags reach nobody |
| L0563 | YES | pane B process dead 10h34m, board only saw refused delivery; liveness alarm with owner [cost 634 min] |
| L0582 | PARTLY | second reader flagged real errors; 3,354 rows after its DROP; flags unconsumed |
| L0586 | PARTLY | wrong number never surfaced to the seat; no consumer for the sample's finding |
| L0588 | YES | second reader flagged unverified all-green claim, "unseen"; no consumer of the flag |
| L0590 | YES | pulse STALE fired 4,577 times for 1 change; no consumer |
| L0591 | YES | HANDBACKS IN fired 761 times, 0 acted; E owed 7h1m, C 2h46, collation 76m [cost 663 min] |
| L0592 | YES | UNRECEIVED fired 183 times (false); hand-back "lost" 15 h unchecked [cost 900 min] |
| L0593 | YES | NEXT-trailer note goes to receiver not sender; 935 notes 0 acted |
| L0609 | YES | only QUEUED pulse class moved a seat; owed lines unactionable for idle seats |
| L0613 | PARTLY | second-reader narrowing never reached D; flags reach no one |
| L0615 | YES | recommended weekly runs never scheduled; no owner |
| L0616 | YES | retire list never acted on; no consumer |
| L0623 | YES | E's re-ring refused as UNDELIVERED, loop sat idle until keeper said so; wake/deadline on expected ring |
| L0631 | PARTLY | stick carry waiter gave up at 14:08, nobody told |
| L0653 | PARTLY | keeper's drive report answered "No response requested"; finding without a consumer |
| L0683 | PARTLY | dispatches reached pane C 700-880 s late |
| L0698 | YES | C edited uncommitted while E waited on the commit, both quiet until a look at disk; named hand-off |
| L0703 | PARTLY | pulse printed HANDBACKS IN hourly after collation; emitter with no consumer/clear |
| L0705 | YES | 17 hand-backs sat untracked in repo (same class as L0487); no owner to ship |
| L0708 | YES | HANDOFF.md sat uncommitted until librarian committed; hand-off unreachable from other machine |
| L0710 | PARTLY | dead timing lock stood 12 h; no stale-lock owner |
| L0730 | PARTLY | main red 4 days, 10 red files; no named owner of the red |
| L0756 | PARTLY | known red carried through five landings; no owner |
| L0773 | PARTLY | drag-cost red a fourth time in three days; no owner |
| L0781 | PARTLY | D646 hand-back not on main; record not landed, no owner |
| L0788 | YES | D handoff dropped L's 11-07 open list for 4 days; named consumer of the open list catches it [cost 5760 min] |
| L0816 | YES | A's stop note never arrived; work saved by chance; stage end with no named receiver |
| L0863 | PARTLY | watcher ran nothing ~1 h plus a 2 h waiter; deadline on a wait would fire |
| L0887 | YES | seat worked an hour without seeing librarian's letter saying lap closed; letter not delivered/pointed [cost 60 min] |
| L0917 | PARTLY | stop order held 604 s, C built the withdrawn lap first |
| L0935 | PARTLY | packets reached pane B late and out of order up to 15 min |
| L0943 | PARTLY | chair's stop delivered 10 min late; pane had merged |
| L0944 | YES | stride rulings held in queue 29-49 min after sending; queue-age deadline/wake [cost 29 min] |
| L0955 | YES | sitting ended with no signal, no record for a day; stage end with no named consumer [cost 1440 min] |
| L0959 | YES | registered wake falsifiers due and unscored; no named owner or deadline |
| L0966 | PARTLY | lock stall returned, E's holder idle 40 min; owner for idle holder never built |
| L0971 | YES | packet delivered to pane whose last reply was an API error, eaten; ack/wake path catches |
| L0972 | YES | three panes answered 403 and ended turn waiting; wake/consumer for turn-ends [cost 9 min] |
| L0982 | YES | four READY branches idle 99 min 40 s; no seat owned starting the train [cost 99.67 min] |
| L1005 | PARTLY | fetch cut at 20 s, no line told the seat the pull failed |
| L1008 | PARTLY | stop order reached two panes late |
| L1058 | YES | HOLD reached E 1151 s late, voice built past the hold; queued delivery with deadline/wake [cost 19.2 min] |
| L1079 | PARTLY | [panes] digest hid a failing pane (403 stall); consumer path showed the wrong line |
| L1081 | YES | hold ring took ~21 min chair to E, arrived after the commit it meant to stop [cost 21 min] |
| L1084 | PARTLY | 1,018 NEXT-less rings delivered with a warning, no seat acted |
| L1092 | YES | queued message's sender is never told when it lands; drain writes board only |
| L1114 | PARTLY | hold and lift crossed in C's queue |
| L1120 | YES | dream-watch printed one unactionable line every turn for 27 days, readers skipped it |

## NO rows

998 rows, every other id in 00_ledger.md except the 7 REMOVE rows. The classes I scored NO, with one example each:
wrong figure or citation in a hand-back (L0033); design flaw or rework in a build lap (L0433); a guard or test that was
wrong (L0151); load or lock contention on one machine (L0289, L0973); keeper preference or misreading of his words (L0343);
test flake or crash (L0348); cost of a wake or compaction (L0257, L0469). These may belong to other roots.

## Where I stretched, and where I did not

- I counted the 240 s forced delivery, the QUEUED rows and the late hold rings as PARTLY or YES only where the row shows
  a message sat with no drain, deadline or sender notice. Rows about a lock held by a busy pane are NO.
- Rows L0239 and L0254 are the same stall as L0255 (REMOVE); I kept both, as the ledger does.
- YES for L0241 (264 min): the plan says this figure may belong to a different fault (a door delivery, not a drain row).
  I scored the wait by its row text (a ring delivered, nobody woke the chair) [inferred]; a second scorer may differ.
- Rows I could have called YES and did not, being strict: L0026 (UNLAUNCHABLE second vantage: the instrument fails to run,
  not unconsumed), L0027, L1020/L1027 (a pane given no work: a planning gap, not a lost hand-off).

## What I did not open

The primaries of all rows (I scored from the ledger's row text only); the part files (ledger_*.md); every other
scorer's file and the groups' files; the transcripts and C:/Consonance/data. I did not re-derive any cost figure.
