# Roots, group 4: "was the right thing already written down, and why did it not act?" (Sonnet research agent, 2026-11-13)

Read first: plan_vector_swarm_2026-11-13.md whole [read]. Then 00_ledger.md, every row L0001-L1123, in whole lines [read: lines
27-1162; row Lnnnn is on line 39+nnnn]. Rows marked REMOVE by the second reader (L0029 L0162 L0255 L0299 L0300 L0390 L0409) are
skipped; I use the corrected forms (L0295, L0428). I opened no other file in this folder. I opened three outside files to test
claims: consonance/tools/stamp.js and stamp.test.js exist [read: ls], and loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md
lines 20-35 [read]. Every other "[read]" below means: I read that ledger row. Placing a row under a root is [inferred]. Counts of
placed ids are [read: derived by a node script over the id lists below, which I typed by hand].

## What the question showed, before the roots

I asked of each row: was the remedy already on disk before the row happened? The ledger itself says so for many rows, in its
own words (keyword counts by grep over the row lines, rows may share a word; [read: command]): "third time" 3, "second time" 4,
"same failure" 3, "recurr" 8, "never installed" 3, "not live" 3, "reached no" 2, "acted on" 8.
Cases where the ledger names the earlier write-down:
- L0092 (line 131): "landed-is-not-shipped for hooks, third time" [read].
- L0966 (line 1005): "the fix for good had never been built" and the stall returned at seven times the length [read]; the
  stall trace says the same (stall_trace_lockbn...:26-30) [read].
- L0883 (line 922) and L0867/L0868 (lines 906-907): times typed from feel, five times; stamp.js was built for this on 09-09 (L0214,
  line 253) and exists [read]. It was built for the librarian's own entries.
- L0079 (line 118): "fifth stall-by-silence, a day after the detector was built" [read].
- L0093 (line 132): 60 of 75 rule violators recited the rule in the sentence before breaking it [read]. So retrieval is not
  the whole story: the rule was in front of the actor and still lost.
- L0376 (line 415): census of 101 W entries: gates caught 0 of 383 errors; check at hand not run in 61-73% of claim errors [read].
- L0290 (line 329, 09-23: the [panes] digest taken for the roster) then L1079 (line 1118, 11-13: the [panes] digest hid a failing
  pane) [read]. Same instrument, same misreading, 51 days apart.
- L0418 (line 457, 10-19: "delivered" printed for text in the composer) then L0003 (line 42) and L1092 (line 1131): the sender is
  still never told when a message lands [read].

Why the written thing did not act, as the rows show it. Six reasons, each carried by many rows, each a root below:
(1) the control was accepted when built, never shown to fire on the path in use; (2) the rule was filed where its finder sits
(one seat, one lap), so the next lane never met it; (3) the signal had no consumer or the finished stage had no owner with a
timer; (4) a lock or gate protects the intent while the holder is unwatched; (5) the next hop restated instead of carrying the
original; (6) the send has no receipt. Roots R1-R6 take them in that order (R4 is the lock one, R5 the restating one).

## R1. A control is accepted without being shown to fire on a recorded failing case, on the machine and mode in use

**Statement.** Gates, hooks, guards, fixes and falsifiers are counted as done when written, landed or registered, and nothing
later shows that each one fires on the path where the fault happens.
**Mechanism.** The acceptance test is the author's own suite, which is green by construction: the test may never fail
(L0058, L0065, L0138, L1064), or it runs on the strict walk while the room runs light (L0377), or on L while the fix is on D
(L0613, L1087), or the installed copy is older than the repo (L1088, L0996). So a control can hold a green suite and fire never;
the room then reads the silence as health. The fix is declared and the next fault walks through the same hole.
**Ledger ids it would have prevented (64, each placed once):**
L0020 L0021 L0023 L0051 L0058 L0062 L0065 L0089 L0090 L0092 L0111 L0112 L0122 L0138 L0145 L0146 L0151 L0156 L0164
L0165 L0176 L0178 L0180 L0181 L0256 L0259 L0264 L0265 L0276 L0277 L0284 L0296 L0325 L0355 L0360 L0364 L0377 L0414
L0416 L0421 L0472 L0544 L0564 L0567 L0569 L0613 L0627 L0648 L0665 L0702 L0838 L0884 L0888 L0914 L0956 L0996 L1015
L1044 L1064 L1084 L1085 L1086 L1087 L1088
**Kind of fix.** Accept a control only with a recorded failing case it is shown to catch, run on the installed copy on each
machine in the mode in use, and re-run that case when the repo or the install changes (an install -Check that fires the case,
not only compares files).
**One recorded case: L0971 (line 1010).** Fix 2c for the [panes] digest landed (b0be06f0) but is not installed (L1087 says it
runs on neither machine). Check: feed the recorded 11-13 board rows (pane B's last reply an API error, an earlier long report
above it) to the INSTALLED board-digest.js on D and on L. Today it prints the long report and hides the error; after install it
must print the error row. Fails today, passes after. [ours]
Doubt: some of these rows are one control read two ways; L1015/L1064 (guard green on 97/101 tests, wrong live) are the best
single instance that "green suite" is not "fires on the case".

## R2. A fix or rule is filed where its finder sits, so the next lane meets the same fault with no rule in front of it

**Statement.** Knowledge about a shared hazard lives in one seat's notes, one tool used by one seat, or one lap's hand-back, and
the seat that meets the hazard next does not hold it.
**Mechanism.** Panes are fresh shells on a Windows machine with Git Bash. The quirks (heredocs eat backslashes, cmd /c is
rewritten, bare build.bat is not found under NoDefaultCurrentDirectoryInExePath, TaskStop leaves children, hand-typed times,
a sha not copied from a command) are each found by a pane in its own lap and written in that pane's hand-back. The next pane,
in another lap, hits the same thing. stamp.js (09-09) fixed typed times for the librarian's notes only; panes E and A typed
times on 11-11 (L0867, L0868, L0905) [read].
**Ledger ids (49):**
L0137 L0214 L0295 L0400 L0420 L0443 L0498 L0568 L0598 L0644 L0645 L0670 L0689 L0711 L0712 L0718 L0748 L0752 L0755
L0766 L0785 L0813 L0814 L0841 L0842 L0852 L0861 L0865 L0867 L0868 L0871 L0877 L0880 L0893 L0900 L0905 L0911 L0938
L0940 L0987 L1062 L1072 L1080 L1116 L1118 L0059 L0066 L0199 L0209
**Kind of fix.** One shared, tested wrapper set for the shell hazards (run, build, kill-tree, clock-read stamp, digest-with-
function) that every pane brief names as the only way, and a check at hand-back that refuses the known bad shapes.
**One recorded case: L0868 (line 907) with L0867 (line 906).** Hand-back p-l162-light-E_2026-11-11.md:169-177 carries a
heading "05:0x" while the clock read 04:57; p-l161-backrooms-E_2026-11-11.md:110-112 carries "~03:xx". Check: a scan of
hand-backs for time headings with a tilde, an x, or a minute not within N of the file's write time. Fails on those two files
today, passes once they are clock-read. [ours]
Doubt: the commit-message rows (L0718, L0755, L0766, L0785) are caught by P's scan before push; that is a working catch with a
cost (a squash), so they fit "rule not in the author's lane" but may be over-claimed here.

## R3. A finished stage, an alarm or a finding has no named next actor with a deadline

**Statement.** Work stops at a hand-off because the one who could continue is not told, is not the one addressed, or does not
exist; and instruments emit lines that no seat has the job of acting on.
**Mechanism.** Two faces of one gap. (a) Stage ends: a lap sits at WORKING or MAP with all panes idle until the keeper looks
(L0068, L0076-L0079, L0143, L0144, L0240, L0294, L0412, L0982, L1020, L1027). (b) Signals: the pulse printed "lap older than ten
minutes" 345 times (L0239), "HANDBACKS IN, NOT COLLATED" 761 times with 0 acted on, owed to idle seats that only get "not work"
keep-warms (L0591, L0609), second-reader flags reach nobody (L0582, L0583; L0544 is in R1), warnings reached no seat (L0364,
L0428, L0593). Findings: "owner in parentheses named the FINDER" (L0167), the H3 score never taken (L0415), weekly runs never
scheduled (L0615), registered falsifiers due and unscored (L0959).
**Ledger ids (63):**
L0017 L0018 L0025 L0026 L0027 L0028 L0038 L0050 L0067 L0068 L0070 L0074 L0075 L0076 L0077 L0078 L0079 L0094 L0143
L0144 L0167 L0239 L0240 L0241 L0242 L0254 L0287 L0294 L0326 L0328 L0333 L0334 L0352 L0381 L0386 L0387 L0398 L0412
L0415 L0428 L0487 L0537 L0582 L0583 L0588 L0590 L0591 L0592 L0593 L0609 L0611 L0615 L0616 L0698 L0705 L0708 L0816
L0958 L0959 L0982 L1020 L1027 L1120
**Kind of fix.** Every emission (stage end, alarm, flag, finding) carries a named consumer, a deadline and a wake path; an
emission with no consumer is retired, not kept.
**One recorded case: L0982 (line 1021) with L0591 (line 630).** Four READY branches sat 99 min 40 s because no seat owned
starting the train. Check on the recorded board: from the moment the last branch reads READY, an owner row exists within N
minutes. Fails on the 11-13 record (no owner row for about 50 minutes), passes when ownership is assigned at READY. For L0591 the
recorded count is 761 fires, 0 acted; the same check is "each fire is followed by an action row or the line is not printed".
[ours; the 99 min and 761 figures are [read] in the ledger rows]
Doubt: R3 is wide. Its two faces may be two roots; scorers should test each face alone.

## R4. A shared-machine lock records that someone holds it, not whether the holder is alive, working, or the right one

**Statement.** Locks and gates on the shared checkout and the one machine cover the intent ("one heavy job at a time") but not
the holder, so an idle, orphaned or killed holder stalls every seat, and the compensating action is a hand kill or a hand wait.
**Mechanism.** The holder is a shell that was mangled (cmd /c rewritten: L0912, L0966), a wrapper killed with children left
alive (L0857, L0862, L0863, L0969), or a process nobody owns (L0970, L0967). The lock tool waits only on a lock from the same
tree (L0804), a TaskStop does not kill the tree, a kill by bare PID hits another seat's exclusive session (L1065), and a queued
build waits 30 minutes then gives up (L0941, L0983). The remedy was written for it on 11-12 and not built (L0966).
**Ledger ids (60):**
L0289 L0291 L0298 L0311 L0314 L0316 L0380 L0382 L0383 L0525 L0571 L0576 L0577 L0579 L0666 L0669 L0676 L0685 L0710
L0716 L0720 L0725 L0768 L0771 L0783 L0799 L0804 L0810 L0843 L0849 L0857 L0862 L0863 L0866 L0872 L0912 L0941 L0942
L0951 L0966 L0967 L0968 L0969 L0970 L0973 L0974 L0975 L0976 L0977 L0978 L0979 L0980 L0981 L0983 L0984 L1041 L1055
L1061 L1065 L0647
**Kind of fix.** The lock carries owner, child tree and a heartbeat; a holder with no CPU or no live parent for N minutes is
released or named on the board, and every kill goes through one tree-aware tool. Also keep the guard's measure honest (L1015
shows a guard that read negative CPU).
**One recorded case: L0966 (line 1005), the same as L0912 (line 951).** On 11-13 E's holder (node 15304, child cmd.exe 34656,
0.27 s CPU, 40 minutes old) held heavy-run.2.lock while A had three jobs queued [read: stall trace :26-30]. The trace gives
its own proving check: a wrapper holding a shell that does nothing is named within N minutes, a compiling one is not. Fails
today (the guard is parked on branch l202-idle-guard, L1051, and misfired live, L1015); passes after, and must also pass the
L1015 case (two working holders must NOT be named idle). [read for the trace; ours for the test]
Overlap: L0647, L0771 (suite times) are weak members.

## R5. Each hop restates the thing instead of carrying it, and the next actor treats the restatement as the primary

**Statement.** A claim about a file, a count, a time, a state or the keeper's own words is made from a copy (a summary, a cut
read, a listing, a memory, the last reply) and relayed, and the primary is not opened before it becomes a premise.
**Mechanism.** A relay hop turns "I saw X in this output" into "X". Cut reads (260 characters L1006; head -30 L0197; 220-char
stored messages L0750), digests (L0290 sits in R6), stale checkouts and shelves (L0467, L1005), the librarian's reading of his
words (L0824-L0828, L0919, L0993, L1000, L0801, L0807), swarm first-reader summaries (L0985, L0986, L1011, L1070, L1106, L1107)
and numbers from a grep (L0034, L0116, L0413). The downstream pane or the keeper re-derives and catches it, which is the working
catch, at the cost of a lap or a wrong ruling. The brief rules existed (cite, do not recollect; the arrow rule, by which L0066
was caught) and L0093 shows reciting is not enough.
**Ledger ids (103; L0264 is placed in R1):**
L0013 L0024 L0033 L0034 L0035 L0036 L0043 L0047 L0071 L0081 L0083 L0084 L0096 L0097 L0099 L0109 L0116 L0117 L0118
L0119 L0120 L0121 L0153 L0194 L0197 L0198 L0200 L0203 L0206 L0208 L0212 L0250 L0262 L0301 L0307 L0346 L0413 L0442
L0467 L0475 L0485 L0489 L0507 L0551 L0566 L0587 L0610 L0625 L0629 L0633 L0634 L0657 L0699 L0728 L0750 L0775 L0779
L0788 L0794 L0795 L0801 L0807 L0824 L0825 L0826 L0827 L0828 L0919 L0930 L0939 L0945 L0947 L0964 L0985 L0986 L0993
L0995 L0997 L1000 L1002 L1005 L1006 L1009 L1010 L1011 L1036 L1070 L1071 L1090 L1096 L1097 L1098 L1099 L1100 L1101
L1102 L1103 L1104 L1105 L1106 L1107 L1119 L0915
**Kind of fix.** A premise in a dispatch carries its primary (path:line and the command that reproduces it), and the dispatch
is refused unless the sender's own transcript shows that primary was opened in whole lines. Note: the room measured a
claim-time check and ruled against it twice (L0385 DON'T BUILD at 31.3% against 40%; L0310 ruled DEGENERATE), so the fix here
is a gate on the OPEN, not a detector of wrong claims.
**One recorded case: L1006 (line 1045).** At wake the librarian read two handoffs through a 260-character line cut and
dispatched from them (c411ea00, a072f58e). Check: for each handoff or brief a dispatch cites, the sender's tool calls show a
read of that file whose returned lines cover the cited range. Fails on the 11-13 09:08 dispatch today, passes when the read is
whole. [ours; the check reads tool-call row types and paths only]
Doubt: this is the room's own candidate (the stand-in). It is the largest set but the broadest; scorers should discount rows
that are plain arithmetic slips inside one seat's own work (L0116, L0117).

## R6. A send has no receipt, so the sender acts on "sent" and the order arrives after it is moot

**Statement.** A dispatch, hold, stop or ring is stamped queued, delivered or written, and the sender is never told when it is
read and acted on, so late orders and eaten packets go unseen.
**Mechanism.** Queues hold orders behind a working pane for minutes (median 208-230 s, max 16,543 s: L0002), the stamp says
"delivered" for text in a composer (L0418), a pane answering an API error eats the packet and the digest hides the error (L0971,
L0972, L1079), and a hold or stop arrives after the pane has built and committed (L0917 on 11-12, L1058 and L1081 on 11-13,
L0943, L0944, L0948). The drain writes the board only; the sender is not told (L1092).
**Ledger ids (48):**
L0001 L0002 L0003 L0046 L0114 L0115 L0132 L0149 L0150 L0175 L0183 L0184 L0196 L0202 L0218 L0235 L0245 L0258 L0270
L0288 L0290 L0292 L0293 L0303 L0304 L0418 L0457 L0538 L0563 L0623 L0683 L0822 L0823 L0875 L0917 L0935 L0943 L0944
L0948 L0971 L0972 L1008 L1019 L1058 L1079 L1081 L1092 L1114
**Kind of fix.** Receipt: the receiver's next turn writes an acknowledgement row naming the message, and a send with no
acknowledgement inside N seconds is shown to the sender and escalated.
**One recorded case: L1058 (line 1097).** The chair's HOLD was sent 14:53Z and reached pane E at 15:12Z, held 1151 s; the voice
was built, committed and handed back meanwhile. Check on the recorded board: a send older than N s with no acknowledgement row
is surfaced to the sender at N. Fails today (sender sees only DELIVERED or QUEUED stamps), passes with receipts. [ours]
Overlap: L0971/L0972 also fit R1 (fix not installed) and R5 (digest as roster); I placed them here by their first cause.

## Placement table [read: node script over my id lists; placed once each, claim order R4, R6, R3, R1, R2, R5]

| root | ids placed |
|---|---|
| R1 control not shown to fire | 64 |
| R2 fix filed where finder sits | 49 |
| R3 no owner, consumer or deadline | 63 |
| R4 lock holder unwatched | 60 |
| R5 restate instead of carry | 103 |
| R6 send without receipt | 48 |

Rows in the ledger 1123, REMOVE 7, placed 387 (one id, L0264, was claimed by R1 and R5; counted in R1). Unplaced
729 [read: script]. Ids that fit two roots are placed by first cause; I name the overlaps I saw in each root's "Overlap"
line; others may exist [inferred].

## Ids I could not place (729)

By a rough split of the unplaced rows' catcher and primary fields [read: script, keyword rules, so rough]: 85 are Third Place
posture rows (primary is third_place/); 116 name the keeper as catcher; 293 name a pane or "itself" as catcher; 13 rest on a
commit subject alone; 222 other. Most are product or design faults (T-180 geometry and builder, Dreamzone design and chase
tuning), single-lap measurement slips (a first run measured the wrong thing, a mutant not caught, a registered figure wrong)
and Third Place conduct rows. None of them has a recorded remedy that I could tie to a cause upstream of other rows. The
measurement slips (first run wrong, then caught by the pane's own rerun) look like the working catch, not a fault with a root.

L0004 L0005 L0006 L0007 L0008 L0009 L0010 L0011 L0012 L0014 L0015 L0016 L0019 L0022 L0030 L0031 L0032 L0037 L0039
L0040 L0041 L0042 L0044 L0045 L0048 L0049 L0052 L0053 L0054 L0055 L0056 L0057 L0060 L0061 L0063 L0064 L0069 L0072
L0073 L0080 L0082 L0085 L0086 L0087 L0088 L0091 L0093 L0095 L0098 L0100 L0101 L0102 L0103 L0104 L0105 L0106 L0107
L0108 L0110 L0113 L0123 L0124 L0125 L0126 L0127 L0128 L0129 L0130 L0131 L0133 L0134 L0135 L0136 L0139 L0140 L0141
L0142 L0147 L0148 L0152 L0154 L0155 L0157 L0158 L0159 L0160 L0161 L0163 L0166 L0168 L0169 L0170 L0171 L0172 L0173
L0174 L0177 L0179 L0182 L0185 L0186 L0187 L0188 L0189 L0190 L0191 L0192 L0193 L0195 L0201 L0204 L0205 L0207 L0210
L0211 L0213 L0215 L0216 L0217 L0219 L0220 L0221 L0222 L0223 L0224 L0225 L0226 L0227 L0228 L0229 L0230 L0231 L0232
L0233 L0234 L0236 L0237 L0238 L0243 L0244 L0246 L0247 L0248 L0249 L0251 L0252 L0253 L0257 L0260 L0261 L0263 L0266
L0267 L0268 L0269 L0271 L0272 L0273 L0274 L0275 L0278 L0279 L0280 L0281 L0282 L0283 L0285 L0286 L0297 L0302 L0305
L0306 L0308 L0309 L0310 L0312 L0313 L0315 L0317 L0318 L0319 L0320 L0321 L0322 L0323 L0324 L0327 L0329 L0330 L0331
L0332 L0335 L0336 L0337 L0338 L0339 L0340 L0341 L0342 L0343 L0344 L0345 L0347 L0348 L0349 L0350 L0351 L0353 L0354
L0356 L0357 L0358 L0359 L0361 L0362 L0363 L0365 L0366 L0367 L0368 L0369 L0370 L0371 L0372 L0373 L0374 L0375 L0376
L0378 L0379 L0384 L0385 L0388 L0389 L0391 L0392 L0393 L0394 L0395 L0396 L0397 L0399 L0401 L0402 L0403 L0404 L0405
L0406 L0407 L0408 L0410 L0411 L0417 L0419 L0422 L0423 L0424 L0425 L0426 L0427 L0429 L0430 L0431 L0432 L0433 L0434
L0435 L0436 L0437 L0438 L0439 L0440 L0441 L0444 L0445 L0446 L0447 L0448 L0449 L0450 L0451 L0452 L0453 L0454 L0455
L0456 L0458 L0459 L0460 L0461 L0462 L0463 L0464 L0465 L0466 L0468 L0469 L0470 L0471 L0473 L0474 L0476 L0477 L0478
L0479 L0480 L0481 L0482 L0483 L0484 L0486 L0488 L0490 L0491 L0492 L0493 L0494 L0495 L0496 L0497 L0499 L0500 L0501
L0502 L0503 L0504 L0505 L0506 L0508 L0509 L0510 L0511 L0512 L0513 L0514 L0515 L0516 L0517 L0518 L0519 L0520 L0521
L0522 L0523 L0524 L0526 L0527 L0528 L0529 L0530 L0531 L0532 L0533 L0534 L0535 L0536 L0539 L0540 L0541 L0542 L0543
L0545 L0546 L0547 L0548 L0549 L0550 L0552 L0553 L0554 L0555 L0556 L0557 L0558 L0559 L0560 L0561 L0562 L0565 L0570
L0572 L0573 L0574 L0575 L0578 L0580 L0581 L0584 L0585 L0586 L0589 L0594 L0595 L0596 L0597 L0599 L0600 L0601 L0602
L0603 L0604 L0605 L0606 L0607 L0608 L0612 L0614 L0617 L0618 L0619 L0620 L0621 L0622 L0624 L0626 L0628 L0630 L0631
L0632 L0635 L0636 L0637 L0638 L0639 L0640 L0641 L0642 L0643 L0646 L0649 L0650 L0651 L0652 L0653 L0654 L0655 L0656
L0658 L0659 L0660 L0661 L0662 L0663 L0664 L0667 L0668 L0671 L0672 L0673 L0674 L0675 L0677 L0678 L0679 L0680 L0681
L0682 L0684 L0686 L0687 L0688 L0690 L0691 L0692 L0693 L0694 L0695 L0696 L0697 L0700 L0701 L0703 L0704 L0706 L0707
L0709 L0713 L0714 L0715 L0717 L0719 L0721 L0722 L0723 L0724 L0726 L0727 L0729 L0730 L0731 L0732 L0733 L0734 L0735
L0736 L0737 L0738 L0739 L0740 L0741 L0742 L0743 L0744 L0745 L0746 L0747 L0749 L0751 L0753 L0754 L0756 L0757 L0758
L0759 L0760 L0761 L0762 L0763 L0764 L0765 L0767 L0769 L0770 L0772 L0773 L0774 L0776 L0777 L0778 L0780 L0781 L0782
L0784 L0786 L0787 L0789 L0790 L0791 L0792 L0793 L0796 L0797 L0798 L0800 L0802 L0803 L0805 L0806 L0808 L0809 L0811
L0812 L0815 L0817 L0818 L0819 L0820 L0821 L0829 L0830 L0831 L0832 L0833 L0834 L0835 L0836 L0837 L0839 L0840 L0844
L0845 L0846 L0847 L0848 L0850 L0851 L0853 L0854 L0855 L0856 L0858 L0859 L0860 L0864 L0869 L0870 L0873 L0874 L0876
L0878 L0879 L0881 L0882 L0883 L0885 L0886 L0887 L0889 L0890 L0891 L0892 L0894 L0895 L0896 L0897 L0898 L0899 L0901
L0902 L0903 L0904 L0906 L0907 L0908 L0909 L0910 L0913 L0916 L0918 L0920 L0921 L0922 L0923 L0924 L0925 L0926 L0927
L0928 L0929 L0931 L0932 L0933 L0934 L0936 L0937 L0946 L0949 L0950 L0952 L0953 L0954 L0955 L0957 L0960 L0961 L0962
L0963 L0965 L0988 L0989 L0990 L0991 L0992 L0994 L0998 L0999 L1001 L1003 L1004 L1007 L1012 L1013 L1014 L1016 L1017
L1018 L1021 L1022 L1023 L1024 L1025 L1026 L1028 L1029 L1030 L1031 L1032 L1033 L1034 L1035 L1037 L1038 L1039 L1040
L1042 L1043 L1045 L1046 L1047 L1048 L1049 L1050 L1051 L1052 L1053 L1054 L1056 L1057 L1059 L1060 L1063 L1066 L1067
L1068 L1069 L1073 L1074 L1075 L1076 L1077 L1078 L1082 L1083 L1089 L1091 L1093 L1094 L1095 L1108 L1109 L1110 L1111
L1112 L1113 L1115 L1117 L1121 L1122 L1123

## Ledger weaknesses I noticed (for the scorers)

- 327 rows say cost not recorded (ledger line 1168), so a score by cost will be thin; score by count first.
- Rows built on a commit subject only are the weakest (second reader: 2 of 9 sampled were not incidents, ledger line 1217).
- The ledger holds an incident and its fix commit as separate rows in places, so counts of "prevented" rows can double a
  single event.

## What I did not open

- No transcript, board, jsonl data file or hand-back. Every cost, count and quote is the ledger row's, [read] only as the row.
- The other three groups' files, by instruction.
- The primaries of the 1,100+ rows; I did not check any row's own [read] mark. I tested only the stall trace lines 20-35 and
  the existence of consonance/tools/stamp.js.
- Whether stamp.js is used by any pane today; the hand-backs named in R2's case (p-l162-light-E, p-l161-backrooms-E).
- Whether the board and install checks proposed in each "one recorded case" can in fact be run on today's record; each is [ours].
- Costs per root: not scored here.
