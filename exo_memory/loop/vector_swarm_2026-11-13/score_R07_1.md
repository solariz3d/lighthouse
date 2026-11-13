# Score R07 (scorer 1): a stage end, alarm or finding has no named consumer, deadline or wake path

Scorer 1 of 2 for R07. I did not propose it. Marks: [read] I opened it; [inferred] mine; [ours] a proposal.

## Method

[read] I read the R07 entry in 00_roots.md and the plan, then all 1123 rows of 00_ledger.md, one by one.
[read] The seven rows the ledger's second reader marked REMOVE are skipped: L0029 L0162 L0255 L0299 L0300 L0390 L0409.
So 1116 rows were scored. I judged each from the row's own text and its cited primary as the row quotes it.
I did not open the primaries behind rows that were plainly outside this root (a wrong figure, a test red, a keeper's
catch on tone, a design fault). I did not run commands on the board or jsonl files.

Rule I held to: YES needs one stated mechanism (a named consumer, a deadline, a wake path or a notice to the sender
would have prevented it, or made an instrument flag it at once). Rows I would have had to stretch the root to cover are NO.
Delivery-delay rows (a ring held in a queue) are PARTLY at most: the next actor is told, only late, and a deadline
would shorten the wait. [inferred] A reader who thinks a delay is not "no wake path" should move those PARTLY rows to NO.

## Table: every ledger id (rows not listed with a mechanism are NO)

| id | verdict | mechanism, one line |
|---|---|---|
| L0001 | PARTLY | a queued message with no drain row would carry a named drain/wake owner so drops are seen |
| L0002 | PARTLY | a deadline on a queued delivery would bound the wait |
| L0003 | PARTLY | an unconfirmed dispatch would have a named confirmer, so 167 are not left silent |
| L0004 | NO | |
| L0005 | NO | |
| L0006 | NO | |
| L0007 | NO | |
| L0008 | PARTLY | an unsubmitted dispatch left in a composer would have a wake/consumer check |
| L0009 | NO | |
| L0010 | NO | |
| L0011 | NO | |
| L0012 | NO | |
| L0013 | NO | |
| L0014 | NO | |
| L0015 | NO | |
| L0016 | NO | |
| L0017 | YES | the sourced=false ledger would have a named seat whose job is to act on 3293 flagged turns |
| L0018 | NO | |
| L0019 | NO | |
| L0020 | NO | |
| L0021 | NO | |
| L0022 | NO | |
| L0023 | NO | |
| L0024 | NO | |
| L0025 | YES | the state block, emitted 163 times with 0 acted on, would have a consumer or be cut at the source |
| L0026 | NO | |
| L0027 | NO | |
| L0028 | NO | |
| L0029 | skip (REMOVE) | |
| L0030 | NO | |
| L0031 | NO | |
| L0032 | NO | |
| L0033 | NO | |
| L0034 | NO | |
| L0035 | NO | |
| L0036 | NO | |
| L0037 | NO | |
| L0038 | NO | |
| L0039 | NO | |
| L0040 | NO | |
| L0041 | NO | |
| L0042 | NO | |
| L0043 | NO | |
| L0044 | NO | |
| L0045 | NO | |
| L0046 | YES | a board post that is a write with no wake path would get a wake, no keeper relay |
| L0047 | NO | |
| L0048 | NO | |
| L0049 | NO | |
| L0050 | YES | ferry-watch's every-prompt alarm (84 of 109 unferried) would have a named consumer |
| L0051 | NO | |
| L0052 | NO | |
| L0053 | NO | |
| L0054 | NO | |
| L0055 | NO | |
| L0056 | NO | |
| L0057 | NO | |
| L0058 | NO | |
| L0059 | NO | |
| L0060 | NO | |
| L0061 | NO | |
| L0062 | NO | |
| L0063 | NO | |
| L0064 | NO | |
| L0065 | NO | |
| L0066 | NO | |
| L0067 | YES | 2050 carrier-drift REDs (1982 silent) would have a named consumer for the alarm |
| L0068 | YES | lap L013 end-of-stage (work done, nobody collated) would name the collator and a deadline |
| L0069 | NO | |
| L0070 | NO | |
| L0071 | NO | |
| L0072 | NO | |
| L0073 | NO | |
| L0074 | YES | a collation alarm that computed nothing for 80 min would be wired to a consumer (same episode as L0068) |
| L0075 | YES | an armed timer/named next actor for the L014 dispatch would stop the stalled collations |
| L0076 | YES | a stalled lap noticed only by silence would have a deadline and consumer |
| L0077 | YES | same, stall noticed only by silence |
| L0078 | YES | same |
| L0079 | YES | same, panes idle with chair present |
| L0080 | NO | |
| L0081 | NO | |
| L0082 | NO | |
| L0083 | NO | |
| L0084 | NO | |
| L0085 | NO | |
| L0086 | NO | |
| L0087 | NO | |
| L0088 | NO | |
| L0089 | NO | |
| L0090 | NO | |
| L0091 | NO | |
| L0092 | NO | |
| L0093 | NO | |
| L0094 | PARTLY | a named consumer for the essay (a pointer) would have stopped the fade |
| L0095 | NO | |
| L0096 | NO | |
| L0097 | NO | |
| L0098 | NO | |
| L0099 | NO | |
| L0100 | NO | |
| L0101 | NO | |
| L0102 | PARTLY | an unowned red (panes over ceiling) would get a named owner |
| L0103 | NO | |
| L0104 | NO | |
| L0105 | NO | |
| L0106 | NO | |
| L0107 | NO | |
| L0108 | NO | |
| L0109 | NO | |
| L0110 | NO | |
| L0111 | NO | |
| L0112 | NO | |
| L0113 | NO | |
| L0114 | NO | |
| L0115 | NO | |
| L0116 | NO | |
| L0117 | NO | |
| L0118 | NO | |
| L0119 | NO | |
| L0120 | NO | |
| L0121 | NO | |
| L0122 | NO | |
| L0123 | NO | |
| L0124 | NO | |
| L0125 | NO | |
| L0126 | NO | |
| L0127 | NO | |
| L0128 | NO | |
| L0129 | NO | |
| L0130 | NO | |
| L0131 | NO | |
| L0132 | NO | |
| L0133 | YES | lap D003 sat RETURN-LEG with holder chair for 126 h; a named consumer and deadline would catch it |
| L0134 | PARTLY | the same D003 lap, indicator pulsing urgent for a dead lap, guard locking the librarian out |
| L0135 | NO | |
| L0136 | NO | |
| L0137 | NO | |
| L0138 | NO | |
| L0139 | NO | |
| L0140 | NO | |
| L0141 | NO | |
| L0142 | NO | |
| L0143 | YES | baton with the librarian, nothing woke it; a wake path on the baton |
| L0144 | YES | same episode as L0143 (P-BATON-WAKE absent) |
| L0145 | NO | |
| L0146 | NO | |
| L0147 | NO | |
| L0148 | PARTLY | a gate red 27 h would have a named consumer, but the root cause was a parser bug |
| L0149 | YES | a baton hand-off can't be announced because the sender is refused out of turn; a wake path for the sender |
| L0150 | YES | hand-backs refused out of turn left panes waiting; a delivery path for the finished hand-back |
| L0151 | NO | |
| L0152 | NO | |
| L0153 | NO | |
| L0154 | NO | |
| L0155 | NO | |
| L0156 | NO | |
| L0157 | NO | |
| L0158 | NO | |
| L0159 | NO | |
| L0160 | NO | |
| L0161 | NO | |
| L0162 | skip (REMOVE) | |
| L0163 | NO | |
| L0164 | PARTLY | the wake instrument sees 10 of 375 deliveries; the consumer exists but is blind |
| L0165 | NO | |
| L0166 | NO | |
| L0167 | YES | "named owner" named the finder, so two one-line fixes sat two laps; a real named consumer |
| L0168 | NO | |
| L0169 | NO | |
| L0170 | NO | |
| L0171 | NO | |
| L0172 | NO | |
| L0173 | NO | |
| L0174 | NO | |
| L0175 | PARTLY | 39 raised hands each needing a click, 16 laps unfiled |
| L0176 | YES | raise_pull failed silently 36 rows, 4 approved hands lost; a consumer/ack would show it |
| L0177 | NO | |
| L0178 | NO | |
| L0179 | NO | |
| L0180 | NO | |
| L0181 | NO | |
| L0182 | NO | |
| L0183 | NO | |
| L0184 | PARTLY | a stall behind unsent text in the chair composer would have a deadline |
| L0185 | NO | |
| L0186 | NO | |
| L0187 | NO | |
| L0188 | NO | |
| L0189 | NO | |
| L0190 | NO | |
| L0191 | NO | |
| L0192 | NO | |
| L0193 | NO | |
| L0194 | NO | |
| L0195 | NO | |
| L0196 | YES | a hand-back refused out of turn left the pane told to wait; a named consumer/deadline for the return leg |
| L0197 | NO | |
| L0198 | NO | |
| L0199 | NO | |
| L0200 | NO | |
| L0201 | NO | |
| L0202 | NO | |
| L0203 | NO | |
| L0204 | NO | |
| L0205 | NO | |
| L0206 | NO | |
| L0207 | NO | |
| L0208 | NO | |
| L0209 | NO | |
| L0210 | NO | |
| L0211 | NO | |
| L0212 | NO | |
| L0213 | NO | |
| L0214 | NO | |
| L0215 | NO | |
| L0216 | NO | |
| L0217 | NO | |
| L0218 | NO | |
| L0219 | NO | |
| L0220 | NO | |
| L0221 | NO | |
| L0222 | NO | |
| L0223 | NO | |
| L0224 | NO | |
| L0225 | NO | |
| L0226 | NO | |
| L0227 | NO | |
| L0228 | NO | |
| L0229 | NO | |
| L0230 | NO | |
| L0231 | NO | |
| L0232 | NO | |
| L0233 | NO | |
| L0234 | NO | |
| L0235 | PARTLY | rings queued 100 min against a full chair window with no stamp; a queue-age alarm with a consumer |
| L0236 | NO | |
| L0237 | NO | |
| L0238 | NO | |
| L0239 | YES | pulse printed lap-older-than-10-min 345 times with no station owning it |
| L0240 | YES | after chunk 1 filed nobody was named/woken to open chunk 2; the keeper became the ferry |
| L0241 | YES | chair waited on an already-delivered ring; a deadline on the wait would have fired (cost belongs partly to another fault per plan) |
| L0242 | YES | yesterday's unfiled lap D064 still held the station; an unfiled lap needs a consumer/deadline |
| L0243 | NO | |
| L0244 | NO | |
| L0245 | PARTLY | 26 of 43 dispatches forced by timeout, one ruling never sent until found |
| L0246 | NO | |
| L0247 | NO | |
| L0248 | NO | |
| L0249 | NO | |
| L0250 | NO | |
| L0251 | NO | |
| L0252 | NO | |
| L0253 | NO | |
| L0254 | YES | a NEXT line naming no station preceded the stall; a required named consumer |
| L0255 | skip (REMOVE) | |
| L0256 | NO | |
| L0257 | NO | |
| L0258 | NO | |
| L0259 | NO | |
| L0260 | NO | |
| L0261 | NO | |
| L0262 | NO | |
| L0263 | PARTLY | the over-cap finding sat in a footnote of a hand-back; a named consumer for findings |
| L0264 | NO | |
| L0265 | NO | |
| L0266 | NO | |
| L0267 | NO | |
| L0268 | PARTLY | a correction sat 4 h in the librarian's file while another seat cited the stale table |
| L0269 | NO | |
| L0270 | NO | |
| L0271 | NO | |
| L0272 | NO | |
| L0273 | NO | |
| L0274 | YES | a 13-day unwatched forget-rate red; a named watcher |
| L0275 | NO | |
| L0276 | NO | |
| L0277 | NO | |
| L0278 | NO | |
| L0279 | NO | |
| L0280 | NO | |
| L0281 | NO | |
| L0282 | NO | |
| L0283 | NO | |
| L0284 | NO | |
| L0285 | NO | |
| L0286 | NO | |
| L0287 | NO | |
| L0288 | PARTLY | a ring queued behind a busy turn and read as idle; a visible queued state |
| L0289 | NO | |
| L0290 | NO | |
| L0291 | NO | |
| L0292 | YES | STALE-stamped rings held 16+ min since the 240 s force did not cover STALE; a deadline for every queued ring |
| L0293 | YES | a ring queued silently at the librarian; sender gets a queued notice so no re-ring |
| L0294 | YES | E wrote the addendum without ringing; a hand-off needs its notice step |
| L0295 | NO | |
| L0296 | NO | |
| L0297 | NO | |
| L0298 | NO | |
| L0299 | skip (REMOVE) | |
| L0300 | skip (REMOVE) | |
| L0301 | NO | |
| L0302 | NO | |
| L0303 | YES | keep-warm MISSED row was the only signal for a blocked seat; a consumer for MISSED |
| L0304 | YES | header said Main awake after a crash; only a keep-warm MISSED row signalled; a consumer for it |
| L0305 | NO | |
| L0306 | NO | |
| L0307 | NO | |
| L0308 | NO | |
| L0309 | NO | |
| L0310 | NO | |
| L0311 | NO | |
| L0312 | NO | |
| L0313 | NO | |
| L0314 | NO | |
| L0315 | NO | |
| L0316 | NO | |
| L0317 | NO | |
| L0318 | NO | |
| L0319 | NO | |
| L0320 | NO | |
| L0321 | NO | |
| L0322 | NO | |
| L0323 | NO | |
| L0324 | NO | |
| L0325 | NO | |
| L0326 | YES | second-reader's 4399 flags on 1969 rows had no named consumer, acted-on rate not recorded |
| L0327 | NO | |
| L0328 | NO | |
| L0329 | NO | |
| L0330 | NO | |
| L0331 | NO | |
| L0332 | NO | |
| L0333 | NO | |
| L0334 | NO | |
| L0335 | NO | |
| L0336 | NO | |
| L0337 | NO | |
| L0338 | NO | |
| L0339 | NO | |
| L0340 | NO | |
| L0341 | NO | |
| L0342 | NO | |
| L0343 | NO | |
| L0344 | NO | |
| L0345 | NO | |
| L0346 | NO | |
| L0347 | NO | |
| L0348 | NO | |
| L0349 | NO | |
| L0350 | NO | |
| L0351 | NO | |
| L0352 | YES | a shadow trial with no review date or reviewer ran 5 weeks (22 of 6983) |
| L0353 | NO | |
| L0354 | NO | |
| L0355 | YES | push-gate failed open 9 times and no one was named to act on the row |
| L0356 | NO | |
| L0357 | NO | |
| L0358 | NO | |
| L0359 | NO | |
| L0360 | NO | |
| L0361 | NO | |
| L0362 | NO | |
| L0363 | YES | the digest emitted to 1381 session starts and none used it; a consumer or a cut |
| L0364 | YES | 1335 trailer rings 'strict would refuse', 1783 sources warnings reached no seat; no consumer |
| L0365 | NO | |
| L0366 | NO | |
| L0367 | NO | |
| L0368 | NO | |
| L0369 | NO | |
| L0370 | NO | |
| L0371 | NO | |
| L0372 | NO | |
| L0373 | NO | |
| L0374 | NO | |
| L0375 | NO | |
| L0376 | NO | |
| L0377 | NO | |
| L0378 | NO | |
| L0379 | NO | |
| L0380 | NO | |
| L0381 | YES | 12 stale open laps had no owner or deadline |
| L0382 | NO | |
| L0383 | NO | |
| L0384 | NO | |
| L0385 | NO | |
| L0386 | YES | reply-slot 1023 would-block rows, nobody acting |
| L0387 | PARTLY | ask-ending 22 shadow flags with no reviewer |
| L0388 | NO | |
| L0389 | NO | |
| L0390 | skip (REMOVE) | |
| L0391 | NO | |
| L0392 | NO | |
| L0393 | NO | |
| L0394 | NO | |
| L0395 | NO | |
| L0396 | NO | |
| L0397 | NO | |
| L0398 | YES | five scheduled jobs sat disabled 16 days with no consumer of their output |
| L0399 | NO | |
| L0400 | NO | |
| L0401 | NO | |
| L0402 | NO | |
| L0403 | NO | |
| L0404 | NO | |
| L0405 | NO | |
| L0406 | NO | |
| L0407 | NO | |
| L0408 | NO | |
| L0409 | skip (REMOVE) | |
| L0410 | NO | |
| L0411 | NO | |
| L0412 | PARTLY | a task tied to a busy pane queued all night; a deadline would have moved it |
| L0413 | NO | |
| L0414 | NO | |
| L0415 | YES | a registered score and revert rule had no one to take it when the window closed |
| L0416 | NO | |
| L0417 | NO | |
| L0418 | YES | a ring sat unsubmitted 38 min printed as delivered; a wake/confirm path |
| L0419 | NO | |
| L0420 | NO | |
| L0421 | NO | |
| L0422 | NO | |
| L0423 | NO | |
| L0424 | NO | |
| L0425 | NO | |
| L0426 | NO | |
| L0427 | NO | |
| L0428 | YES | 2468 sources-gate warns went through, no seat named to act |
| L0429 | NO | |
| L0430 | NO | |
| L0431 | NO | |
| L0432 | NO | |
| L0433 | NO | |
| L0434 | NO | |
| L0435 | NO | |
| L0436 | NO | |
| L0437 | NO | |
| L0438 | NO | |
| L0439 | NO | |
| L0440 | NO | |
| L0441 | NO | |
| L0442 | NO | |
| L0443 | NO | |
| L0444 | NO | |
| L0445 | NO | |
| L0446 | NO | |
| L0447 | NO | |
| L0448 | NO | |
| L0449 | NO | |
| L0450 | NO | |
| L0451 | NO | |
| L0452 | NO | |
| L0453 | NO | |
| L0454 | NO | |
| L0455 | NO | |
| L0456 | NO | |
| L0457 | NO | |
| L0458 | NO | |
| L0459 | NO | |
| L0460 | NO | |
| L0461 | NO | |
| L0462 | NO | |
| L0463 | PARTLY | a refused visit line told no one why; a named consumer for refusals |
| L0464 | NO | |
| L0465 | NO | |
| L0466 | NO | |
| L0467 | NO | |
| L0468 | NO | |
| L0469 | NO | |
| L0470 | NO | |
| L0471 | NO | |
| L0472 | NO | |
| L0473 | NO | |
| L0474 | NO | |
| L0475 | NO | |
| L0476 | NO | |
| L0477 | NO | |
| L0478 | NO | |
| L0479 | NO | |
| L0480 | NO | |
| L0481 | NO | |
| L0482 | NO | |
| L0483 | NO | |
| L0484 | NO | |
| L0485 | NO | |
| L0486 | NO | |
| L0487 | YES | 17 finished hand-backs sat untracked on D with no named receiver on L |
| L0488 | NO | |
| L0489 | NO | |
| L0490 | NO | |
| L0491 | NO | |
| L0492 | NO | |
| L0493 | NO | |
| L0494 | NO | |
| L0495 | NO | |
| L0496 | NO | |
| L0497 | NO | |
| L0498 | NO | |
| L0499 | NO | |
| L0500 | NO | |
| L0501 | NO | |
| L0502 | NO | |
| L0503 | NO | |
| L0504 | NO | |
| L0505 | NO | |
| L0506 | NO | |
| L0507 | NO | |
| L0508 | NO | |
| L0509 | NO | |
| L0510 | NO | |
| L0511 | NO | |
| L0512 | NO | |
| L0513 | NO | |
| L0514 | NO | |
| L0515 | NO | |
| L0516 | NO | |
| L0517 | NO | |
| L0518 | NO | |
| L0519 | NO | |
| L0520 | NO | |
| L0521 | NO | |
| L0522 | NO | |
| L0523 | NO | |
| L0524 | NO | |
| L0525 | YES | a watcher waited 8 h for a log that never came, no deadline |
| L0526 | NO | |
| L0527 | NO | |
| L0528 | NO | |
| L0529 | NO | |
| L0530 | NO | |
| L0531 | NO | |
| L0532 | NO | |
| L0533 | NO | |
| L0534 | NO | |
| L0535 | NO | |
| L0536 | NO | |
| L0537 | YES | 68 of 85 open laps were done and never filed; no named closer |
| L0538 | PARTLY | the pulse's delivery-unconfirmed alarm fired 2,504 times, 32 of 32 false, no one owning it |
| L0539 | NO | |
| L0540 | NO | |
| L0541 | NO | |
| L0542 | NO | |
| L0543 | YES | an entry never rung to the other machine; no named next actor |
| L0544 | PARTLY | second-reader flags reach nobody |
| L0545 | NO | |
| L0546 | NO | |
| L0547 | NO | |
| L0548 | NO | |
| L0549 | NO | |
| L0550 | NO | |
| L0551 | NO | |
| L0552 | NO | |
| L0553 | NO | |
| L0554 | NO | |
| L0555 | NO | |
| L0556 | NO | |
| L0557 | NO | |
| L0558 | NO | |
| L0559 | NO | |
| L0560 | NO | |
| L0561 | NO | |
| L0562 | NO | |
| L0563 | PARTLY | a seat process death had no signal or named watcher until a refused delivery 10 h 34 min later |
| L0564 | NO | |
| L0565 | NO | |
| L0566 | NO | |
| L0567 | NO | |
| L0568 | NO | |
| L0569 | NO | |
| L0570 | NO | |
| L0571 | NO | |
| L0572 | NO | |
| L0573 | NO | |
| L0574 | NO | |
| L0575 | NO | |
| L0576 | NO | |
| L0577 | NO | |
| L0578 | NO | |
| L0579 | NO | |
| L0580 | NO | |
| L0581 | NO | |
| L0582 | YES | the dropped second-reader's flags (2 real errors never caught) reached no named consumer |
| L0583 | NO | |
| L0584 | NO | |
| L0585 | NO | |
| L0586 | YES | a flagged units error never surfaced to the seat; a named consumer for flags |
| L0587 | NO | |
| L0588 | YES | a flagged false 'all green' claim left standing, unseen; a consumer |
| L0589 | NO | |
| L0590 | YES | pulse STALE 4,577 fires for 1 change, state block 163 fires 0 acted; no consumer |
| L0591 | YES | HANDBACKS IN NOT COLLATED fired 761 times, 0 acted; a named consumer and deadline |
| L0592 | YES | UNRECEIVED pulse fired 183 times, false, and a 'lost' hand-back unchecked 15 h |
| L0593 | YES | 935 trailer notes to the receiver, 0 acted on; sources warnings reached no seat |
| L0594 | NO | |
| L0595 | NO | |
| L0596 | NO | |
| L0597 | NO | |
| L0598 | NO | |
| L0599 | NO | |
| L0600 | NO | |
| L0601 | NO | |
| L0602 | NO | |
| L0603 | NO | |
| L0604 | NO | |
| L0605 | NO | |
| L0606 | NO | |
| L0607 | NO | |
| L0608 | NO | |
| L0609 | YES | 9 of 10 pulse classes moved no seat; owed lines have no consumer |
| L0610 | NO | |
| L0611 | NO | |
| L0612 | NO | |
| L0613 | PARTLY | second-reader flags reaching no one, plus a narrowing that never reached D |
| L0614 | NO | |
| L0615 | YES | the weekly census and open-items runs recommended had no schedule or owner |
| L0616 | YES | the retire list was never acted on; no named consumer |
| L0617 | NO | |
| L0618 | NO | |
| L0619 | NO | |
| L0620 | NO | |
| L0621 | NO | |
| L0622 | NO | |
| L0623 | YES | E's ring was refused UNDELIVERED and the loop sat idle; a notice/wake to the sender |
| L0624 | NO | |
| L0625 | NO | |
| L0626 | NO | |
| L0627 | NO | |
| L0628 | NO | |
| L0629 | NO | |
| L0630 | NO | |
| L0631 | PARTLY | the stick-carry waiter gave up at 14:08 with no one told |
| L0632 | NO | |
| L0633 | NO | |
| L0634 | NO | |
| L0635 | NO | |
| L0636 | NO | |
| L0637 | NO | |
| L0638 | NO | |
| L0639 | NO | |
| L0640 | NO | |
| L0641 | NO | |
| L0642 | NO | |
| L0643 | NO | |
| L0644 | NO | |
| L0645 | NO | |
| L0646 | NO | |
| L0647 | NO | |
| L0648 | NO | |
| L0649 | PARTLY | a standing known red carried through landings with no owner |
| L0650 | NO | |
| L0651 | NO | |
| L0652 | NO | |
| L0653 | NO | |
| L0654 | NO | |
| L0655 | NO | |
| L0656 | NO | |
| L0657 | NO | |
| L0658 | NO | |
| L0659 | NO | |
| L0660 | NO | |
| L0661 | NO | |
| L0662 | NO | |
| L0663 | NO | |
| L0664 | NO | |
| L0665 | NO | |
| L0666 | NO | |
| L0667 | NO | |
| L0668 | NO | |
| L0669 | NO | |
| L0670 | NO | |
| L0671 | NO | |
| L0672 | NO | |
| L0673 | NO | |
| L0674 | NO | |
| L0675 | NO | |
| L0676 | NO | |
| L0677 | NO | |
| L0678 | NO | |
| L0679 | NO | |
| L0680 | NO | |
| L0681 | NO | |
| L0682 | NO | |
| L0683 | PARTLY | dispatches arrived 700-880 s late with no deadline or ack |
| L0684 | NO | |
| L0685 | PARTLY | E's waiters sat behind a memory gate with no one told |
| L0686 | NO | |
| L0687 | NO | |
| L0688 | NO | |
| L0689 | NO | |
| L0690 | NO | |
| L0691 | NO | |
| L0692 | NO | |
| L0693 | NO | |
| L0694 | NO | |
| L0695 | NO | |
| L0696 | NO | |
| L0697 | NO | |
| L0698 | YES | C edited without committing while E waited; no wake path for the commit |
| L0699 | NO | |
| L0700 | NO | |
| L0701 | NO | |
| L0702 | NO | |
| L0703 | PARTLY | the pulse printed HANDBACKS IN NOT COLLATED hourly after it was collated; no closer |
| L0704 | NO | |
| L0705 | YES | 17 hand-backs sat untracked, no named receiver (same event as L0487) |
| L0706 | NO | |
| L0707 | NO | |
| L0708 | PARTLY | a handoff file sat uncommitted until the librarian committed it |
| L0709 | NO | |
| L0710 | YES | a timing lock with no expiry stayed 12 h; a lease deadline |
| L0711 | NO | |
| L0712 | NO | |
| L0713 | NO | |
| L0714 | NO | |
| L0715 | NO | |
| L0716 | NO | |
| L0717 | NO | |
| L0718 | NO | |
| L0719 | NO | |
| L0720 | NO | |
| L0721 | NO | |
| L0722 | NO | |
| L0723 | NO | |
| L0724 | NO | |
| L0725 | NO | |
| L0726 | NO | |
| L0727 | NO | |
| L0728 | NO | |
| L0729 | NO | |
| L0730 | PARTLY | main red 4 days with no owner for the red |
| L0731 | NO | |
| L0732 | NO | |
| L0733 | NO | |
| L0734 | NO | |
| L0735 | NO | |
| L0736 | NO | |
| L0737 | PARTLY | a wording change owed with no consumer |
| L0738 | NO | |
| L0739 | NO | |
| L0740 | NO | |
| L0741 | NO | |
| L0742 | NO | |
| L0743 | NO | |
| L0744 | NO | |
| L0745 | NO | |
| L0746 | NO | |
| L0747 | NO | |
| L0748 | NO | |
| L0749 | NO | |
| L0750 | NO | |
| L0751 | NO | |
| L0752 | NO | |
| L0753 | NO | |
| L0754 | NO | |
| L0755 | NO | |
| L0756 | PARTLY | a known red row carried through five landings |
| L0757 | NO | |
| L0758 | NO | |
| L0759 | NO | |
| L0760 | NO | |
| L0761 | NO | |
| L0762 | NO | |
| L0763 | NO | |
| L0764 | NO | |
| L0765 | NO | |
| L0766 | NO | |
| L0767 | NO | |
| L0768 | NO | |
| L0769 | NO | |
| L0770 | NO | |
| L0771 | NO | |
| L0772 | NO | |
| L0773 | PARTLY | a timing row red a fourth time in three days with no owner for the fix |
| L0774 | NO | |
| L0775 | NO | |
| L0776 | NO | |
| L0777 | NO | |
| L0778 | NO | |
| L0779 | NO | |
| L0780 | NO | |
| L0781 | PARTLY | a hand-back branch not on main, a record not landed, no named lander |
| L0782 | NO | |
| L0783 | NO | |
| L0784 | NO | |
| L0785 | NO | |
| L0786 | NO | |
| L0787 | NO | |
| L0788 | YES | L's 11-07 open list had no named receiver in D's handoff and was dropped |
| L0789 | NO | |
| L0790 | NO | |
| L0791 | NO | |
| L0792 | NO | |
| L0793 | NO | |
| L0794 | NO | |
| L0795 | NO | |
| L0796 | NO | |
| L0797 | NO | |
| L0798 | NO | |
| L0799 | NO | |
| L0800 | NO | |
| L0801 | NO | |
| L0802 | NO | |
| L0803 | NO | |
| L0804 | NO | |
| L0805 | NO | |
| L0806 | NO | |
| L0807 | NO | |
| L0808 | NO | |
| L0809 | NO | |
| L0810 | NO | |
| L0811 | NO | |
| L0812 | NO | |
| L0813 | NO | |
| L0814 | NO | |
| L0815 | NO | |
| L0816 | YES | A's stop note never arrived and overtime work sat uncommitted; a stage end needs its note consumer |
| L0817 | NO | |
| L0818 | NO | |
| L0819 | NO | |
| L0820 | NO | |
| L0821 | NO | |
| L0822 | NO | |
| L0823 | NO | |
| L0824 | NO | |
| L0825 | NO | |
| L0826 | NO | |
| L0827 | NO | |
| L0828 | NO | |
| L0829 | NO | |
| L0830 | NO | |
| L0831 | NO | |
| L0832 | NO | |
| L0833 | NO | |
| L0834 | NO | |
| L0835 | NO | |
| L0836 | NO | |
| L0837 | NO | |
| L0838 | NO | |
| L0839 | NO | |
| L0840 | NO | |
| L0841 | NO | |
| L0842 | NO | |
| L0843 | NO | |
| L0844 | NO | |
| L0845 | NO | |
| L0846 | NO | |
| L0847 | NO | |
| L0848 | NO | |
| L0849 | NO | |
| L0850 | NO | |
| L0851 | NO | |
| L0852 | NO | |
| L0853 | NO | |
| L0854 | NO | |
| L0855 | NO | |
| L0856 | NO | |
| L0857 | NO | |
| L0858 | NO | |
| L0859 | NO | |
| L0860 | NO | |
| L0861 | NO | |
| L0862 | NO | |
| L0863 | PARTLY | a watcher ran an hour and a 2 h waiter with no run and no deadline result |
| L0864 | NO | |
| L0865 | NO | |
| L0866 | NO | |
| L0867 | NO | |
| L0868 | NO | |
| L0869 | NO | |
| L0870 | NO | |
| L0871 | NO | |
| L0872 | NO | |
| L0873 | NO | |
| L0874 | NO | |
| L0875 | NO | |
| L0876 | NO | |
| L0877 | NO | |
| L0878 | NO | |
| L0879 | NO | |
| L0880 | NO | |
| L0881 | NO | |
| L0882 | NO | |
| L0883 | NO | |
| L0884 | NO | |
| L0885 | NO | |
| L0886 | NO | |
| L0887 | YES | a letter saying lap L160 was closed had no wake path, the seat worked an hour without it |
| L0888 | NO | |
| L0889 | NO | |
| L0890 | NO | |
| L0891 | NO | |
| L0892 | NO | |
| L0893 | NO | |
| L0894 | NO | |
| L0895 | NO | |
| L0896 | NO | |
| L0897 | NO | |
| L0898 | NO | |
| L0899 | NO | |
| L0900 | NO | |
| L0901 | NO | |
| L0902 | NO | |
| L0903 | NO | |
| L0904 | NO | |
| L0905 | NO | |
| L0906 | NO | |
| L0907 | NO | |
| L0908 | NO | |
| L0909 | NO | |
| L0910 | NO | |
| L0911 | NO | |
| L0912 | PARTLY | an idle lock holder had no owner or lease deadline |
| L0913 | NO | |
| L0914 | NO | |
| L0915 | NO | |
| L0916 | NO | |
| L0917 | PARTLY | a stop order held 604 s in the queue with no deadline |
| L0918 | NO | |
| L0919 | NO | |
| L0920 | NO | |
| L0921 | NO | |
| L0922 | NO | |
| L0923 | NO | |
| L0924 | NO | |
| L0925 | NO | |
| L0926 | NO | |
| L0927 | NO | |
| L0928 | NO | |
| L0929 | NO | |
| L0930 | NO | |
| L0931 | NO | |
| L0932 | NO | |
| L0933 | NO | |
| L0934 | NO | |
| L0935 | PARTLY | packets reached a pane up to 15 min late and out of order |
| L0936 | NO | |
| L0937 | NO | |
| L0938 | NO | |
| L0939 | NO | |
| L0940 | NO | |
| L0941 | NO | |
| L0942 | NO | |
| L0943 | PARTLY | the chair's stop delivered 10 min late after C had merged |
| L0944 | PARTLY | rulings held in queue 29 to 49 min before reaching C |
| L0945 | NO | |
| L0946 | NO | |
| L0947 | NO | |
| L0948 | NO | |
| L0949 | NO | |
| L0950 | NO | |
| L0951 | NO | |
| L0952 | NO | |
| L0953 | NO | |
| L0954 | NO | |
| L0955 | PARTLY | a sitting ended without a signal and no record was made until a day later |
| L0956 | NO | |
| L0957 | NO | |
| L0958 | NO | |
| L0959 | YES | registered falsifiers came due with no named scorer or date |
| L0960 | NO | |
| L0961 | NO | |
| L0962 | NO | |
| L0963 | NO | |
| L0964 | NO | |
| L0965 | NO | |
| L0966 | YES | the lock stall recurred 40 min because the fix for it had no named builder |
| L0967 | NO | |
| L0968 | NO | |
| L0969 | NO | |
| L0970 | NO | |
| L0971 | PARTLY | packets delivered to a pane whose last reply was an API error were not acted on |
| L0972 | PARTLY | A, C and B each ended the turn waiting after a 403 error reply |
| L0973 | NO | |
| L0974 | NO | |
| L0975 | NO | |
| L0976 | NO | |
| L0977 | NO | |
| L0978 | NO | |
| L0979 | NO | |
| L0980 | NO | |
| L0981 | NO | |
| L0982 | YES | four READY branches sat because no seat owned starting the train; a named owner |
| L0983 | NO | |
| L0984 | NO | |
| L0985 | NO | |
| L0986 | NO | |
| L0987 | NO | |
| L0988 | NO | |
| L0989 | NO | |
| L0990 | NO | |
| L0991 | NO | |
| L0992 | NO | |
| L0993 | NO | |
| L0994 | NO | |
| L0995 | NO | |
| L0996 | NO | |
| L0997 | NO | |
| L0998 | NO | |
| L0999 | NO | |
| L1000 | NO | |
| L1001 | NO | |
| L1002 | NO | |
| L1003 | NO | |
| L1004 | NO | |
| L1005 | NO | |
| L1006 | NO | |
| L1007 | NO | |
| L1008 | PARTLY | a stop order reached two panes late through the queue |
| L1009 | NO | |
| L1010 | NO | |
| L1011 | NO | |
| L1012 | NO | |
| L1013 | NO | |
| L1014 | NO | |
| L1015 | NO | |
| L1016 | NO | |
| L1017 | NO | |
| L1018 | NO | |
| L1019 | NO | |
| L1020 | NO | |
| L1021 | NO | |
| L1022 | NO | |
| L1023 | NO | |
| L1024 | NO | |
| L1025 | NO | |
| L1026 | NO | |
| L1027 | NO | |
| L1028 | NO | |
| L1029 | NO | |
| L1030 | NO | |
| L1031 | NO | |
| L1032 | NO | |
| L1033 | NO | |
| L1034 | NO | |
| L1035 | NO | |
| L1036 | NO | |
| L1037 | NO | |
| L1038 | NO | |
| L1039 | NO | |
| L1040 | NO | |
| L1041 | NO | |
| L1042 | NO | |
| L1043 | NO | |
| L1044 | NO | |
| L1045 | NO | |
| L1046 | NO | |
| L1047 | NO | |
| L1048 | NO | |
| L1049 | NO | |
| L1050 | NO | |
| L1051 | NO | |
| L1052 | NO | |
| L1053 | NO | |
| L1054 | NO | |
| L1055 | NO | |
| L1056 | NO | |
| L1057 | NO | |
| L1058 | PARTLY | a HOLD sat 1151 s in the queue while the work was built past it |
| L1059 | NO | |
| L1060 | NO | |
| L1061 | NO | |
| L1062 | NO | |
| L1063 | NO | |
| L1064 | NO | |
| L1065 | NO | |
| L1066 | NO | |
| L1067 | NO | |
| L1068 | PARTLY | a swarm writer was not told to read the keeper's picks (did not bite) |
| L1069 | NO | |
| L1070 | NO | |
| L1071 | NO | |
| L1072 | NO | |
| L1073 | NO | |
| L1074 | NO | |
| L1075 | NO | |
| L1076 | NO | |
| L1077 | NO | |
| L1078 | NO | |
| L1079 | PARTLY | the digest hid a failing pane so a 403 stall was invisible; the alarm had no reader |
| L1080 | NO | |
| L1081 | PARTLY | a hold ring took 21 min and arrived after the step was committed |
| L1082 | NO | |
| L1083 | NO | |
| L1084 | NO | |
| L1085 | NO | |
| L1086 | NO | |
| L1087 | NO | |
| L1088 | NO | |
| L1089 | NO | |
| L1090 | NO | |
| L1091 | NO | |
| L1092 | YES | a queued message's sender is never told when it lands; a notice path to the sender |
| L1093 | NO | |
| L1094 | NO | |
| L1095 | NO | |
| L1096 | NO | |
| L1097 | NO | |
| L1098 | NO | |
| L1099 | NO | |
| L1100 | NO | |
| L1101 | NO | |
| L1102 | NO | |
| L1103 | NO | |
| L1104 | NO | |
| L1105 | NO | |
| L1106 | NO | |
| L1107 | NO | |
| L1108 | NO | |
| L1109 | NO | |
| L1110 | NO | |
| L1111 | NO | |
| L1112 | NO | |
| L1113 | NO | |
| L1114 | NO | |
| L1115 | NO | |
| L1116 | NO | |
| L1117 | NO | |
| L1118 | NO | |
| L1119 | NO | |
| L1120 | YES | dream-watch printed one unactionable line every turn for 27 days with no consumer |
| L1121 | NO | |
| L1122 | NO | |
| L1123 | NO | |

## Totals

[read, by node count over the table above] Ledger ids 1123; skipped as REMOVE 7; scored 1116.

- YES: 68
- PARTLY: 48
- NO: 1000

## Cost covered (YES rows only)

[inferred] Costs are taken as the ledger states them; I did not re-derive any. Same-episode rows are shown twice in the
YES list, so I give a raw sum and a de-duplicated sum.

Minutes stated, 27 YES rows: raw 18,055 min. De-duplicated 17,356 min, after dropping L0074 (same 80 min as L0068),
L0143 (same stall as L0144, whose 540 min I kept) and L0254 (same 82 min as L0239).
Two rows are 72% of it: L0133 (126 h, a lap abandoned 5 days) 7,560 min and L0076 (a dwell, "not a cost split")
5,099 min. Without those two, 4,697 min. [inferred] Those figures are dwell, not minutes of anyone's work.

Stated in days, not added to minutes, 6 YES rows: L0274 13 days (an unwatched red), L0398 16 days (inferred from dates by
the ledger), L0487 up to 5 days, L0543 4 days, L0788 4 days, L1120 27 days (a line every turn). Sum 69 days of dwell
or exposure.

Tokens in YES rows: none. L0025 states about 0.5 M characters of context (163 wakes x 3,012 characters), not tokens.

YES rows with no cost recorded: 34 of 68 (27 minutes rows + 6 days rows + 1 characters row = 34 with a cost).

## Which YES rows are the strongest, and which are soft

[inferred] Strongest, with a measured number: L0068/L0074 (80 min, a lap finished and nobody collated), L0143 (8 h 57 min,
a baton nothing woke), L0239/L0254 (82 min, a pulse line printed 345 times, a NEXT line naming no station),
L0982 (99 min 40 s, no seat owned starting the train), L0591 and L0592 (761 and 183 pulse fires, 0 acted),
L0303 and L0304 (a blocked or dead seat shown only by a keep-warm MISSED row).
Soft: the instrument-emission rows (L0017, L0067, L0326, L0364, L0386, L0428, L0590, L0593) fit the root's wording
exactly but carry no cost, so they add to the count and not to the minutes. L0241 (264 min) is the figure the plan says
belonged to a different fault; I kept it as the ledger states it. L0076 and L0133 are the two that decide the minute total.

## What I did not open

- No primary was opened for the NO rows. I decided them from the ledger row text.
- I did not open the groups' files, the other scorer's file, or any transcript, board or data jsonl.
- I did not re-derive any cost; each is the ledger's figure.
- I did not check the R07 root's claimed ledger ids (g3's 35, g4's 63) against my verdicts. I scored from the rows.
