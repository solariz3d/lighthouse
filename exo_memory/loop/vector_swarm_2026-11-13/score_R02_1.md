# Score R02 by scorer 1: "a done-state is read off the sender's side and the target is not asked"

Scorer 1 of the swarm in `loop/plan_vector_swarm_2026-11-13.md`. I did not propose this root.
Root text read from `00_roots.md:23-43` [read]. Ledger read whole, every row, from `00_ledger.md` (1,123 rows) [read].

## How I scored

- Test for each row: would a real fix of R02 (ask the pane, the process list, the installed copy or the remote what it now
  holds, instead of trusting the sender's stamp) have prevented the row, or caught it at once by an instrument?
- YES needs a one-line mechanism for that row. If I had to stretch the root, the row is NO.
- PARTLY means smaller or caught sooner (a read-back would have shown it, but the fault itself, or most of the cost, comes from
  something else).
- Rows the ledger's second reader marked REMOVE are skipped: L0029 L0162 L0255 L0299 L0300 L0390 L0409 (7 rows) [read].
  So 1,116 rows are scored.
- Marks: all verdicts and mechanisms are [inferred] (my reading of the row text). The counts and cost sums are [read] from a
  node script over my own verdict list; the cost figures are copied from the ledger rows' cost fields.
- I opened no primary source. Every verdict rests on the row wording only. Rows whose wording was thin were scored NO.
- Most NO rows are not close calls. The large NO classes: model and keeper-reading errors, hand-counted figures, tests and
  mutation harnesses that were wrong (that is root R03, a control not shown to fire), design and tuning rework, queue and
  lock contention, alarm fatigue (a line that fires and nobody acts), and cost and compaction measures.

## Table

| id | verdict | mechanism (YES and PARTLY only) |
|---|---|---|
| L0001 | YES | 42 queued deliveries have no drain row and an app restart drops the queue; asking the target pane what it holds finds each one |
| L0002 | NO | |
| L0003 | YES | 167 dispatches are WRITTEN BUT UNCONFIRMED; a read-back from the target confirms or denies receipt |
| L0004 | NO | |
| L0005 | NO | |
| L0006 | NO | |
| L0007 | NO | |
| L0008 | YES | a dispatch sat unsubmitted in an idle pane's composer; asking the pane what its input holds shows it |
| L0009 | NO | |
| L0010 | NO | |
| L0011 | NO | |
| L0012 | PARTLY | patch judged done by green tests; launching the real app and asking it to render would show a blank window at once |
| L0013 | NO | |
| L0014 | NO | |
| L0015 | NO | |
| L0016 | NO | |
| L0017 | NO | |
| L0018 | NO | |
| L0019 | NO | |
| L0020 | YES | installed board-digest.js older than repo; diffing installed copy against repo shows the missing blind.js |
| L0021 | NO | |
| L0022 | YES | PostCompact looked to work because the /compact echo carried the text; asking the model's context what it holds shows the vanish |
| L0023 | YES | files shipped in the list but not registered; reading the installed registration shows it |
| L0024 | NO | |
| L0025 | NO | |
| L0026 | PARTLY | findings reported CLOSED while the reader could not launch; a verdict read back from the target prevents CLOSED without it |
| L0027 | NO | |
| L0028 | NO | |
| L0029 | skip (REMOVE) | |
| L0030 | NO | |
| L0031 | NO | |
| L0032 | NO | |
| L0033 | NO | |
| L0034 | NO | |
| L0035 | NO | |
| L0036 | YES | librarian wrote 'Written to the notes' with no read-back of the notes file |
| L0037 | NO | |
| L0038 | NO | |
| L0039 | NO | |
| L0040 | NO | |
| L0041 | NO | |
| L0042 | NO | |
| L0043 | NO | |
| L0044 | NO | |
| L0045 | NO | |
| L0046 | YES | a board post was taken as a wake; asking the chair whether it had a turn shows the write was not delivered |
| L0047 | NO | |
| L0048 | NO | |
| L0049 | NO | |
| L0050 | NO | |
| L0051 | YES | dispatch-gate ask outcome is dropped under bypass mode; asking whether the call was actually held shows 73 unhonoured asks |
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
| L0067 | NO | |
| L0068 | YES | lap shown WORKING beside idle panes; asking the panes what they hold shows the work done |
| L0069 | NO | |
| L0070 | NO | |
| L0071 | NO | |
| L0072 | NO | |
| L0073 | NO | |
| L0074 | YES | collation alarm read the lap row (holder=panes) beside five idle panes; asking the panes shows idle |
| L0075 | NO | |
| L0076 | NO | |
| L0077 | NO | |
| L0078 | NO | |
| L0079 | YES | pulse said lap at MAP with chair present and panes idle 100-134 min; asking the panes shows idle |
| L0080 | NO | |
| L0081 | NO | |
| L0082 | NO | |
| L0083 | NO | |
| L0084 | NO | |
| L0085 | NO | |
| L0086 | NO | |
| L0087 | NO | |
| L0088 | NO | |
| L0089 | YES | dispatch-gate switch never live, installed copy was the 08-24 file; reading the installed copy shows it |
| L0090 | PARTLY | watch said it survived the restart; the process list would have shown it dead |
| L0091 | NO | |
| L0092 | YES | landed-is-not-shipped for hooks, 'clicks are off' that were not; reading the installed hook shows its state |
| L0093 | NO | |
| L0094 | NO | |
| L0095 | NO | |
| L0096 | NO | |
| L0097 | NO | |
| L0098 | NO | |
| L0099 | YES | existence of a mechanism (MCP instructions) reported as the room's behaviour; asking the pane shows what it does |
| L0100 | NO | |
| L0101 | PARTLY | eviction was taken to bound the shell; measuring the pane's held size would show it never evicts |
| L0102 | NO | |
| L0103 | NO | |
| L0104 | NO | |
| L0105 | NO | |
| L0106 | NO | |
| L0107 | NO | |
| L0108 | NO | |
| L0109 | NO | |
| L0110 | NO | |
| L0111 | PARTLY | capture watcher died silently and stayed assumed alive; asking the process or its liveness shows it dead |
| L0112 | YES | panes woke with no map for weeks; asking a pane at wake what it holds shows no map was carried |
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
| L0133 | PARTLY | lap row said holder chair for 126 h; asking the chair what it holds shows the lap abandoned |
| L0134 | NO | |
| L0135 | NO | |
| L0136 | NO | |
| L0137 | NO | |
| L0138 | NO | |
| L0139 | NO | |
| L0140 | NO | |
| L0141 | NO | |
| L0142 | NO | |
| L0143 | PARTLY | librarian wrote 'waiting on the chair' with no read-back that the chair was ever told |
| L0144 | PARTLY | baton held 9 h unwoken; same event as L0143, a delivery read-back shows nobody was told |
| L0145 | NO | |
| L0146 | NO | |
| L0147 | NO | |
| L0148 | NO | |
| L0149 | NO | |
| L0150 | NO | |
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
| L0164 | PARTLY | hook shipped and taken as live but never installed; reading the installed settings shows it |
| L0165 | NO | |
| L0166 | NO | |
| L0167 | NO | |
| L0168 | NO | |
| L0169 | PARTLY | chair told the board 'K mid-edit' without asking K |
| L0170 | NO | |
| L0171 | NO | |
| L0172 | NO | |
| L0173 | NO | |
| L0174 | NO | |
| L0175 | PARTLY | a held lap row silenced a working station; asking the station shows it working |
| L0176 | YES | raise_pull failed silently for 36 rows; a read-back at the receiver shows the hand never arrived |
| L0177 | NO | |
| L0178 | NO | |
| L0179 | NO | |
| L0180 | NO | |
| L0181 | NO | |
| L0182 | NO | |
| L0183 | NO | |
| L0184 | YES | chair's composer held unsent text for 72 min; asking the chair's composer what it holds shows the dispatch is parked |
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
| L0196 | NO | |
| L0197 | NO | |
| L0198 | PARTLY | told the chair 'you are idle' while it was mid-turn; asking the pane shows its state |
| L0199 | NO | |
| L0200 | NO | |
| L0201 | NO | |
| L0202 | NO | |
| L0203 | NO | |
| L0204 | NO | |
| L0205 | YES | the hold was a ring not a mechanism and a push followed 13 min later; asking the remote or pane what it holds shows the hold is not in force |
| L0206 | NO | |
| L0207 | YES | first MIGRATE returned silently on a missing file and reported success while the librarian woke blank; reading the seat's tail shows it empty |
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
| L0225 | PARTLY | told the keeper a running harness was A's pass; asking the process list shows whose it was |
| L0226 | NO | |
| L0227 | NO | |
| L0228 | NO | |
| L0229 | NO | |
| L0230 | NO | |
| L0231 | YES | the 02:28 close did not save a corrupt ledger; a read-back of the stick after the write shows it at once |
| L0232 | NO | |
| L0233 | NO | |
| L0234 | NO | |
| L0235 | PARTLY | rings queued at a full chair window with no stamp for about 100 min; asking the chair what it holds shows them unread |
| L0236 | NO | |
| L0237 | NO | |
| L0238 | NO | |
| L0239 | NO | |
| L0240 | NO | |
| L0241 | NO | |
| L0242 | NO | |
| L0243 | NO | |
| L0244 | YES | T5 went out with the sealed row not on origin; asking the remote what it holds shows it absent |
| L0245 | NO | |
| L0246 | NO | |
| L0247 | NO | |
| L0248 | NO | |
| L0249 | PARTLY | a windowless zombie app was taken as closed; the process list shows it running |
| L0250 | NO | |
| L0251 | NO | |
| L0252 | NO | |
| L0253 | NO | |
| L0254 | NO | |
| L0255 | skip (REMOVE) | |
| L0256 | YES | INSTALL over v1 keeps the old script; reading the installed copy against the repo shows it |
| L0257 | NO | |
| L0258 | NO | |
| L0259 | NO | |
| L0260 | YES | SPINE says BUILT, running for a directive whose falsifier was ruled decorative; asking the running thing shows what it does |
| L0261 | NO | |
| L0262 | PARTLY | collated a hand-back C had not handed back; asking C shows it had not |
| L0263 | NO | |
| L0264 | NO | |
| L0265 | NO | |
| L0266 | NO | |
| L0267 | NO | |
| L0268 | NO | |
| L0269 | NO | |
| L0270 | NO | |
| L0271 | NO | |
| L0272 | NO | |
| L0273 | NO | |
| L0274 | NO | |
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
| L0288 | YES | A's ring was queued behind the librarian's busy turn and A was read idle from a digest; asking the pane shows it |
| L0289 | NO | |
| L0290 | PARTLY | digest taken for the roster and B thought absent; the live pane list shows B alive |
| L0291 | NO | |
| L0292 | YES | a STALE stamp held two rings 16+ min; asking the receiving pane shows them unread |
| L0293 | YES | A's ring queued silently at the librarian; a read-back to the sender shows queued not delivered |
| L0294 | PARTLY | librarian waited on a ring that was never sent; asking the pane or reading its file shows the addendum written |
| L0295 | PARTLY | a rule was taken as already written in memory; opening the memory shows it absent |
| L0296 | YES | L's 10 hooks older than repo and the digest fix not live on L; reading the installed hooks shows it |
| L0297 | NO | |
| L0298 | NO | |
| L0299 | skip (REMOVE) | |
| L0300 | skip (REMOVE) | |
| L0301 | YES | a ring was called delivered at 20:15 from an unchecked reconstruction; reading the target's receipt shows 3 h 17 m later |
| L0302 | NO | |
| L0303 | PARTLY | the room showed only keep-warm MISSED while the librarian's turn sat on a question; reading the pane shows it |
| L0304 | YES | header said Main is awake after its process crashed; the process list shows it dead |
| L0305 | NO | |
| L0306 | NO | |
| L0307 | NO | |
| L0308 | NO | |
| L0309 | NO | |
| L0310 | NO | |
| L0311 | PARTLY | two tail -F watchers outlived the run and the pane read busy; the process list shows them |
| L0312 | NO | |
| L0313 | NO | |
| L0314 | NO | |
| L0315 | NO | |
| L0316 | NO | |
| L0317 | NO | |
| L0318 | PARTLY | A's CHANGELOG claimed E's diff landed though it never did; reading the repo shows it |
| L0319 | NO | |
| L0320 | NO | |
| L0321 | NO | |
| L0322 | NO | |
| L0323 | NO | |
| L0324 | NO | |
| L0325 | NO | |
| L0326 | NO | |
| L0327 | YES | install.ps1 read a hook under another matcher as already correct; reading the installed settings for the exact matcher shows it |
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
| L0344 | PARTLY | a warm-worker claim about the other worker went unchecked; asking the worker shows its state |
| L0345 | NO | |
| L0346 | NO | |
| L0347 | NO | |
| L0348 | NO | |
| L0349 | NO | |
| L0350 | NO | |
| L0351 | NO | |
| L0352 | NO | |
| L0353 | NO | |
| L0354 | NO | |
| L0355 | PARTLY | push-gate failed open 9 times and the pushes went unscanned; a scan of what the remote holds after the push shows it |
| L0356 | NO | |
| L0357 | NO | |
| L0358 | PARTLY | GATES.md was ruled to ship but its row never landed; reading the repo shows it missing |
| L0359 | NO | |
| L0360 | NO | |
| L0361 | NO | |
| L0362 | YES | stop bar checked that docs were true, not that the built consumer's commands work; running the product shows the failures |
| L0363 | NO | |
| L0364 | PARTLY | gates built for the strict walk emit warnings no seat meets in light mode; asking what a seat received shows no effect |
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
| L0376 | PARTLY | rules on disk were taken as conduct; reading what seats did shows gates caught 0 of 383 |
| L0377 | YES | shelf-budget built on the strict walk while the room runs light; asking the running path shows it unchanged |
| L0378 | NO | |
| L0379 | NO | |
| L0380 | NO | |
| L0381 | PARTLY | 12 laps held open in the ledger though the work was done; reading the repo shows done |
| L0382 | NO | |
| L0383 | NO | |
| L0384 | NO | |
| L0385 | NO | |
| L0386 | NO | |
| L0387 | NO | |
| L0388 | NO | |
| L0389 | NO | |
| L0390 | skip (REMOVE) | |
| L0391 | NO | |
| L0392 | YES | state block carried HEAD figures 61-171 commits behind and '0 unpushed' hours after false; asking the repo and remote shows it |
| L0393 | NO | |
| L0394 | NO | |
| L0395 | NO | |
| L0396 | NO | |
| L0397 | NO | |
| L0398 | YES | scheduled jobs presumed running were disabled for 16 days; asking the scheduler shows disabled |
| L0399 | NO | |
| L0400 | NO | |
| L0401 | NO | |
| L0402 | NO | |
| L0403 | NO | |
| L0404 | NO | |
| L0405 | YES | fix 2 passed headless but still crashed in his real window; asking the real app shows it |
| L0406 | NO | |
| L0407 | NO | |
| L0408 | NO | |
| L0409 | skip (REMOVE) | |
| L0410 | NO | |
| L0411 | NO | |
| L0412 | NO | |
| L0413 | NO | |
| L0414 | NO | |
| L0415 | NO | |
| L0416 | NO | |
| L0417 | NO | |
| L0418 | YES | DELIVERED printed for text sitting in the keeper's composer; asking the pane what its input holds shows it unsubmitted |
| L0419 | NO | |
| L0420 | NO | |
| L0421 | NO | |
| L0422 | NO | |
| L0423 | NO | |
| L0424 | NO | |
| L0425 | NO | |
| L0426 | NO | |
| L0427 | NO | |
| L0428 | NO | |
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
| L0448 | YES | 'Install 0.4.21' not checked; reading the installed exe shows the 10-24 build |
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
| L0463 | PARTLY | a visit line was refused silently; a read-back to the sender shows it did not arrive |
| L0464 | PARTLY | a librarian commit landed one second after the scan and went out unscanned; asking the remote what it holds shows it |
| L0465 | YES | stick 'holds today's state' was claimed; the readback of the ledger tails shows 9 of 9 mismatched |
| L0466 | NO | |
| L0467 | NO | |
| L0468 | NO | |
| L0469 | NO | |
| L0470 | NO | |
| L0471 | YES | install went ahead after the 'game closed' word with acs.exe running; the process list shows it |
| L0472 | YES | a brief edit was read as reaching the seats; asking a seat what it holds shows the bundled old copy until respawn |
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
| L0487 | YES | 17 finished hand-backs sat untracked on D, invisible to L; asking the remote what it holds shows them absent |
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
| L0525 | YES | a test launch that never started was assumed running while a watcher waited for a log; asking the process list shows nothing running |
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
| L0537 | PARTLY | 68 of 85 open laps were done but unfiled; reading the repo against the lap rows shows them finished |
| L0538 | YES | pulse called 31 dispatches delivery-unconfirmed and 32 of 32 had arrived; a receipt check at the target settles it, 2,504 false fires |
| L0539 | NO | |
| L0540 | NO | |
| L0541 | NO | |
| L0542 | NO | |
| L0543 | NO | |
| L0544 | YES | 7 installed hooks older than their room source; reading the installed copy against the source shows it |
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
| L0563 | YES | pane B's claude process exited and nobody asked the process list; found only by a refused delivery |
| L0564 | NO | |
| L0565 | YES | briefs a fresh pane reads were older than the repo's; reading the copy a pane holds shows the drift |
| L0566 | NO | |
| L0567 | NO | |
| L0568 | NO | |
| L0569 | NO | |
| L0570 | NO | |
| L0571 | NO | |
| L0572 | NO | |
| L0573 | NO | |
| L0574 | NO | |
| L0575 | YES | a scan that only prints its count was read as a gate and a private term was pushed; reading what the remote holds shows it at once |
| L0576 | NO | |
| L0577 | NO | |
| L0578 | NO | |
| L0579 | NO | |
| L0580 | NO | |
| L0581 | NO | |
| L0582 | YES | second reader ruled DROPPED yet 3,354 rows were written after; asking the running hook list shows it still fires |
| L0583 | NO | |
| L0584 | NO | |
| L0585 | NO | |
| L0586 | NO | |
| L0587 | NO | |
| L0588 | NO | |
| L0589 | NO | |
| L0590 | NO | |
| L0591 | NO | |
| L0592 | YES | UNRECEIVED fired 183 times and was false for a hand-back nobody checked for 15 h; asking the receiver settles it |
| L0593 | NO | |
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
| L0609 | NO | |
| L0610 | PARTLY | the 0.4.39 push was ordered on the librarian's all-clear before he had tried the changes; asking him shows he had not |
| L0611 | NO | |
| L0612 | NO | |
| L0613 | YES | second-reader narrowing never reached D, the installed copy is from 10-01; reading the installed copy shows it |
| L0614 | NO | |
| L0615 | NO | |
| L0616 | NO | |
| L0617 | NO | |
| L0618 | NO | |
| L0619 | NO | |
| L0620 | NO | |
| L0621 | NO | |
| L0622 | NO | |
| L0623 | YES | librarian waited on E's re-ring that was refused UNDELIVERED; reading the file mtime shows the work was there |
| L0624 | NO | |
| L0625 | NO | |
| L0626 | NO | |
| L0627 | YES | the pane pushed with no push gate because the seat has no PreToolUse hook; reading the installed hook config shows no gate |
| L0628 | NO | |
| L0629 | NO | |
| L0630 | NO | |
| L0631 | PARTLY | stick carry assumed running; waiter gave up at 14:08; asking the waiter or the stick shows it never ran |
| L0632 | NO | |
| L0633 | NO | |
| L0634 | NO | |
| L0635 | NO | |
| L0636 | NO | |
| L0637 | NO | |
| L0638 | NO | |
| L0639 | NO | |
| L0640 | PARTLY | E rang the librarian before its section was on disk; reading the file shows it absent |
| L0641 | NO | |
| L0642 | NO | |
| L0643 | NO | |
| L0644 | NO | |
| L0645 | NO | |
| L0646 | NO | |
| L0647 | NO | |
| L0648 | YES | installer pointed the desktop shortcut back at the app on three installs; reading the shortcut after install shows it |
| L0649 | NO | |
| L0650 | NO | |
| L0651 | NO | |
| L0652 | NO | |
| L0653 | NO | |
| L0654 | NO | |
| L0655 | NO | |
| L0656 | NO | |
| L0657 | YES | the librarian said the hold was held for his word; asking the branch shows it was on the branch |
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
| L0683 | NO | |
| L0684 | NO | |
| L0685 | NO | |
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
| L0698 | YES | E waited on a commit C had not made; reading C's disk shows the edit uncommitted |
| L0699 | YES | librarian wrote D's fixes were on D only; asking the remote shows D had pushed them |
| L0700 | PARTLY | C installed before E's GREEN against a changed order; asking the pane its state against the hold shows it ahead |
| L0701 | NO | |
| L0702 | YES | the push gate is wired nowhere on L; reading the installed hook config shows no gate fired |
| L0703 | NO | |
| L0704 | NO | |
| L0705 | YES | 17 hand-backs sat untracked in the repo; asking the remote what it holds shows them absent |
| L0706 | NO | |
| L0707 | NO | |
| L0708 | YES | Dreamride HANDOFF.md sat uncommitted and unreachable from the other machine; asking the remote shows it absent |
| L0709 | NO | |
| L0710 | YES | a dead timing lock read as live for 12 h; asking the process list shows no session |
| L0711 | NO | |
| L0712 | NO | |
| L0713 | NO | |
| L0714 | NO | |
| L0715 | NO | |
| L0716 | NO | |
| L0717 | NO | |
| L0718 | NO | |
| L0719 | YES | GPU 108 W called idle before asking the process list what was rendering; the process list settles it |
| L0720 | NO | |
| L0721 | NO | |
| L0722 | NO | |
| L0723 | NO | |
| L0724 | NO | |
| L0725 | NO | |
| L0726 | NO | |
| L0727 | NO | |
| L0728 | YES | A read as not started from a worktree's last commit; asking A or the board shows it started 11:46 |
| L0729 | NO | |
| L0730 | NO | |
| L0731 | NO | |
| L0732 | NO | |
| L0733 | NO | |
| L0734 | NO | |
| L0735 | NO | |
| L0736 | NO | |
| L0737 | NO | |
| L0738 | NO | |
| L0739 | NO | |
| L0740 | NO | |
| L0741 | NO | |
| L0742 | NO | |
| L0743 | NO | |
| L0744 | NO | |
| L0745 | NO | |
| L0746 | YES | B pushed the branch name not the scanned sha so an 11th commit went out unscanned; asking the remote what it holds shows it |
| L0747 | NO | |
| L0748 | NO | |
| L0749 | NO | |
| L0750 | NO | |
| L0751 | NO | |
| L0752 | NO | |
| L0753 | NO | |
| L0754 | NO | |
| L0755 | NO | |
| L0756 | NO | |
| L0757 | NO | |
| L0758 | NO | |
| L0759 | NO | |
| L0760 | NO | |
| L0761 | NO | |
| L0762 | NO | |
| L0763 | NO | |
| L0764 | NO | |
| L0765 | YES | P installed main 9aab3ce over 82ae771 so his builder lacked labels; reading the installed build shows which build ran |
| L0766 | NO | |
| L0767 | NO | |
| L0768 | NO | |
| L0769 | NO | |
| L0770 | NO | |
| L0771 | NO | |
| L0772 | NO | |
| L0773 | NO | |
| L0774 | NO | |
| L0775 | NO | |
| L0776 | NO | |
| L0777 | NO | |
| L0778 | YES | handoff said Dreamzone 2 was not pushed; asking the remote shows it was pushed private |
| L0779 | NO | |
| L0780 | NO | |
| L0781 | YES | a D646 hand-back believed landed was not on lighthouse main; asking the remote shows it absent |
| L0782 | NO | |
| L0783 | NO | |
| L0784 | NO | |
| L0785 | NO | |
| L0786 | NO | |
| L0787 | NO | |
| L0788 | NO | |
| L0789 | NO | |
| L0790 | NO | |
| L0791 | NO | |
| L0792 | NO | |
| L0793 | NO | |
| L0794 | PARTLY | L's handoff assumed D held a rebuilder and dreamzone-3; asking D what it holds shows neither |
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
| L0816 | NO | |
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
| L0857 | YES | TaskStop was taken as stopping D665's proof but children kept running during his play; the process list after the stop shows them |
| L0858 | NO | |
| L0859 | NO | |
| L0860 | NO | |
| L0861 | NO | |
| L0862 | YES | TaskStop was taken as stopping the bench but the sh stayed alive; the process list after the stop shows it |
| L0863 | YES | TaskStop left sh running again and the watcher never looked for node; the process list shows no run |
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
| L0880 | YES | a background full-suite run reported completed and had not run because ctest was not on the path; asking what ran shows nothing |
| L0881 | NO | |
| L0882 | NO | |
| L0883 | NO | |
| L0884 | NO | |
| L0885 | NO | |
| L0886 | NO | |
| L0887 | NO | |
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
| L0912 | YES | a lock was read as a working holder but cmd.exe sat idle; asking the holder process shows idle |
| L0913 | NO | |
| L0914 | NO | |
| L0915 | NO | |
| L0916 | NO | |
| L0917 | PARTLY | stop order for L177 was held 604 s in the queue; a read-back of what C held would show the stop not yet received |
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
| L0935 | NO | |
| L0936 | NO | |
| L0937 | NO | |
| L0938 | NO | |
| L0939 | NO | |
| L0940 | YES | lockrun wrapper reported exit 0 after the first full build failed; reading the build output shows the failure |
| L0941 | NO | |
| L0942 | PARTLY | a retry matched one of two give-up messages and a fix run read a stale binary; reading the binary's age shows it |
| L0943 | PARTLY | the chair's stop reached C 10 min late after C had merged; a read-back of C's state would show the stop not received |
| L0944 | PARTLY | stride rulings reached C 29-49 min late; a read-back of C's queue shows them unread |
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
| L0955 | NO | |
| L0956 | NO | |
| L0957 | PARTLY | before/after fingerprints ran on E's stale exe; reading the exe's age shows it |
| L0958 | NO | |
| L0959 | NO | |
| L0960 | NO | |
| L0961 | NO | |
| L0962 | NO | |
| L0963 | NO | |
| L0964 | NO | |
| L0965 | NO | |
| L0966 | YES | a lock holder read as working sat idle 40 min and the 'fix for good' was taken as done but never built; asking the holder and the code shows both |
| L0967 | NO | |
| L0968 | YES | the reaper stop was read as stopping arms182.sh but the sweep child survived; the process list shows it |
| L0969 | PARTLY | the same reap left skeleton.cpp mutated and a lock waiter orphaned; the process list shows the orphan |
| L0970 | YES | the gate message printed a tail and hid an orphaned grep holding the train; the process list shows it |
| L0971 | YES | a packet delivered to a pane whose last reply was an API error was taken as acted on; asking the pane shows it ate the packet |
| L0972 | YES | a second 403 burst: A and C answered the packet with the error and ended waiting; asking the panes shows it |
| L0973 | NO | |
| L0974 | NO | |
| L0975 | NO | |
| L0976 | NO | |
| L0977 | NO | |
| L0978 | NO | |
| L0979 | NO | |
| L0980 | NO | |
| L0981 | NO | |
| L0982 | NO | |
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
| L0995 | YES | install recommendation said board-digest.js alone is safe; reading the installed blind.js shows it lacks sealedGate |
| L0996 | YES | on L 15 hooks DRIFT and 9 are ABSENT; reading the installed settings shows the gates never installed |
| L0997 | NO | |
| L0998 | NO | |
| L0999 | NO | |
| L1000 | NO | |
| L1001 | NO | |
| L1002 | NO | |
| L1003 | NO | |
| L1004 | NO | |
| L1005 | YES | the launcher's fetch was cut at 20 s and taken as done; asking the repo what it holds shows origin/main unmoved |
| L1006 | NO | |
| L1007 | NO | |
| L1008 | PARTLY | a stop order reached two panes late; a read-back of what the panes held shows it not yet received |
| L1009 | NO | |
| L1010 | PARTLY | wrote the critic had not run; asking the Third Place shows it ran since 09:02 |
| L1011 | NO | |
| L1012 | NO | |
| L1013 | PARTLY | keep-warm read pane O as active from a /effort echo; asking the pane's real use shows 13,722 idle minutes |
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
| L1036 | YES | a 29 s compile in the Third Place's clone overlapped P's bench and the all-clear was read off arm states; asking the process list shows it |
| L1037 | NO | |
| L1038 | NO | |
| L1039 | NO | |
| L1040 | NO | |
| L1041 | NO | |
| L1042 | NO | |
| L1043 | NO | |
| L1044 | YES | push-gate hook absent on the seats and installed on L only; reading the installed hooks shows it |
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
| L1058 | PARTLY | the HOLD with his word was held 1151 s in the queue and the voice was built past it; a read-back of E's state shows the hold not received |
| L1059 | NO | |
| L1060 | NO | |
| L1061 | YES | C's pattern kill left world_app_tests.exe running outside the lock; the process list after the kill shows it |
| L1062 | NO | |
| L1063 | NO | |
| L1064 | NO | |
| L1065 | NO | |
| L1066 | NO | |
| L1067 | NO | |
| L1068 | NO | |
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
| L1079 | YES | the [panes] digest hid a failing pane and the fix was not installed; asking the pane shows the error |
| L1080 | NO | |
| L1081 | PARTLY | a hold ring took about 21 min and E had committed the step it said waits; a read-back of E's state shows it |
| L1082 | NO | |
| L1083 | PARTLY | the letter says its filename is in front of the seat at any budget; asking the seat's shelf shows it absent |
| L1084 | YES | a brief says call_chair refuses a ring with no trailer; D runs light so 1,018 were delivered; asking what a ring did shows it |
| L1085 | YES | second-reader-note.js never installed on D; reading the installed hooks shows it |
| L1086 | PARTLY | ask-surface.js runs from a repo path and -Check does not report it live; asking the running hook shows it |
| L1087 | YES | the board-digest fix a3cefeb9 is not on D and the installed copy is from 08-25; reading the installed copy shows it |
| L1088 | YES | installed hooks older than source, 10 DRIFT and 3 ABSENT on D, 15 and 8 on L; reading the installed copies shows it |
| L1089 | NO | |
| L1090 | NO | |
| L1091 | NO | |
| L1092 | YES | a queued message's sender is never told when it lands; a read-back from the target gives it |
| L1093 | PARTLY | nine seats resumed on Opus 5.5 and wrote 5.9 M tokens when Fable was assumed; asking each seat its model shows it |
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
| L1114 | PARTLY | the hold on C's stomp work and its lift crossed in C's queue; a read-back of C's queue shows what it held |
| L1115 | NO | |
| L1116 | NO | |
| L1117 | NO | |
| L1118 | NO | |
| L1119 | NO | |
| L1120 | NO | |
| L1121 | NO | |
| L1122 | YES | precompact.js is installed but a no-op on L; asking the hook's effect at the target shows nothing preserved |
| L1123 | NO | |
## Totals

- YES: 91
- PARTLY: 51
- NO: 974
- skipped (REMOVE): 7
- scored: 1,116 of 1,123 [read: node count]

Share: YES 8.2%, YES plus PARTLY 12.7% of the 1,116 scored [inferred from the counts].

## Cost covered (YES rows only)

- Minutes stated in YES rows: 3,649.7 min (about 60.8 h) over 21 rows [read: node sum of the cost fields].
  Rows and figures: L0046 4; L0068 80; L0074 80; L0079 29.7; L0184 72; L0288 8; L0292 16; L0304 266; L0418 38; L0525 480;
  L0563 634; L0592 900; L0710 720; L0765 45; L0863 180; L0912 6; L0966 40; L0968 12; L0970 30; L0972 9.
  (That is 20 listed minute figures plus L0613's tokens below; the node sum is over the 20 minute rows.)
- Tokens stated in YES rows: 2,385,722 (L0613 only: reads by the second reader after the narrowing that never reached D) [read].
- Stated in days: L0487 5 days (17 hand-backs invisible to L) [read]. Not converted to minutes: it is a dwell, not a work cost.
- YES rows with no cost recorded: 69 of 91. (Rows with a cost: 22 = 20 minute rows, 1 token row, 1 days row.)
- Cautions on the minutes [inferred]:
  - L0068 and L0074 are the same 80-minute night (lap L013 stall and the collation alarm); the sum counts it twice.
  - L0592 (900 min) is "a lost hand-back for 15 h that nobody checked"; it is a dwell of one item, not 15 h of someone's work.
  - L0563 (634), L0525 (480), L0304 (266) and L0710 (720) are dwells of a dead or idle thing, not work minutes.
  - L0863 (180) sums a 1 h watcher run and a 2 h waiter, both with no run.
  - L0003 names 38 min that belong to L0418 (row 39); I did not count them twice.
  - The PARTLY rows with stated costs (L0235 100 min, L0290 60 min, L0303 208 min, L0294 50 min,
    L0311 20 min, L1058 19.2 min, L1081 21 min) are NOT in the sum above.

## What the YES rows have in common [inferred]

Five families carry most of the YES count:
1. Installed copy older than the repo, or never installed (hooks, gates, exe, shortcut, brief copies): L0020 L0023 L0089
   L0092 L0256 L0296 L0327 L0448 L0472 L0544 L0565 L0613 L0627 L0648 L0702 L0765 L0995 L0996 L1044 L1085 L1087 L1088 L1122.
2. Delivery stamp, write or queue taken as received or acted on (DELIVERED, queued, unsubmitted composer, 403 eaten packets):
   L0001 L0003 L0008 L0046 L0176 L0184 L0288 L0292 L0293 L0301 L0418 L0538 L0592 L0971 L0972 L1092.
3. Process or lock state read from a stamp, not the process list (dead lock, TaskStop, killed wrapper, crashed claude):
   L0304 L0525 L0563 L0710 L0857 L0862 L0863 L0912 L0966 L0968 L0970 L1061.
4. A push, landing or hand-back believed on the other side while the remote was not asked: L0205 L0244 L0392 L0487 L0575
   L0657 L0699 L0705 L0708 L0746 L0778 L0781 L1005.
5. A step reported complete that had not run (lap WORKING beside idle panes; build exit 0; suite completed with no run):
   L0068 L0074 L0079 L0880 L0940 L0231 L0465.

## Notes on borderline calls [inferred]

- L0364, L0376, L0377 (gates that exist but do not act in light mode): L0377 is YES (a build made for the strict walk while
  the room runs light is the root's own example); L0364 and L0376 are PARTLY (the measure shows the gate had no effect, but the
  fix there is a design choice about which mode to run).
- L0001-L0003 (queue and unconfirmed counts) are counts across the whole record, scored YES because a target read-back is the
  instrument that would confirm each; the ledger notes the second reader could not reproduce 42 in L0001.
- L0236-class and L0915-class rows about queue latency alone (a message arrives late, nothing wrongly read as done) are NO.
- Rows where the sender's claim was wrong but came from memory or an old note, not from a stamp of a done state (stand-in
  trusted for the thing), are NO here; that is the plan's wider candidate and belongs to other roots such as R01.

## What I did not open

- No primary source: no hand-back, journal, board, jsonl, transcript or git history. I read only `00_roots.md` (R02 entry),
  `00_ledger.md` (every row, and its tail notes), and the plan.
- I did not read any other scorer's file or any group's roots file.
- I did not check any ledger figure; I carried the cost fields as the ledger gave them.
- Rows whose wording says "cost not recorded" were scored on mechanism only; their real cost is unknown.
- Rows scored NO on thin wording might be YES or PARTLY if their primary were opened; I did not open them.
