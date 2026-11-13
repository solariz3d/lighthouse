# Score R05, scorer 2: would a real fix of R05 have prevented this incident?

Root: R05 "A send, hold or stop has no receipt and does not bind, so the sender acts on 'sent' and the order arrives after the work".
Scorer 2, Sonnet research agent, 2026-11-13. I did not propose this root. I read R05's entry in 00_roots.md and every row of 00_ledger.md (corrected forms).
Rows marked REMOVE by the ledger's second reader are skipped: L0029 L0162 L0255 L0299 L0300 L0390 L0409 (7 rows).

Rule I used [ours]: YES needs a one-line mechanism for that row. If I had to stretch R05 to cover the row, it is NO. Rows about a queue, a ring, a hold, a stop or a delivery stamp count; rows about a pane that was never sent anything, a lock, an unread carrier, or a wrong claim do not.

Method [read]: whole ledger read in chunks with the Read tool; the primaries were NOT opened, so every verdict rests on the ledger row's wording. Marks: [read] = the ledger row; [inferred] = my verdict.

## Totals

- Rows scored: 1116 (1123 minus 7 REMOVE). YES 35, PARTLY 30, NO 1051. [read: counted by node script]

## YES and PARTLY rows (mechanism, one line)

| id | verdict | mechanism [inferred] | cost stated in the row [read] |
|---|---|---|---|
| L0001 | YES | queued rows never get a drain/ack row; a receipt per send would show the 42 undelivered and the restart drop | not recorded |
| L0002 | YES | an ack with a time read/acted shows the unbounded queue wait; a binding stop/hold would not queue behind work | not recorded |
| L0003 | YES | every dispatch needs a confirmed receipt; 167 written-but-unconfirmed would be flagged at once | none of its own (cites the 38 min of L0418) |
| L0008 | YES | a receipt that the composer text was submitted catches text lodged unsubmitted in idle panes | not recorded |
| L0046 | YES | a board post that is a write not a wake; a receipt/wake ack would show the chair never took a turn | 4 min |
| L0114 | PARTLY | delivery that binds on the receiver state (lands only between turns) would stop splicing into the keeper's sentence | not recorded |
| L0115 | PARTLY | an ack from the receiver would replace the idle guess that held delivery 240 s | not recorded |
| L0132 | PARTLY | an ack from the receiver replaces the idle guess that forced delivery after 240 s | not recorded |
| L0175 | PARTLY | receipts and a bounded queue would show 6 of 10 deliveries forced and the raised hands lost | not recorded |
| L0176 | YES | raise_pull failed silently for 36 rows; a receipt on every send shows the hand never arrived | 4 keeper-approved hands lost (no minutes) |
| L0183 | PARTLY | a delivery that binds on the receiver's turn state would stop approved pulls landing mid-turn | not recorded |
| L0184 | PARTLY | a receipt would show the dispatch sat unsent behind composer text, sooner than 72 min | 72 min |
| L0202 | PARTLY | an ack in place of the composer-empty guess would not force at 240 s after the auto-update | 29 min (chair wait, as cited) |
| L0205 | YES | a hold that is a ring and binds nothing the push command checks; a binding hold flag would have stopped the push | 120,098 B pushed; repo deleted and recreated (no minutes) |
| L0218 | PARTLY | 38 messages marked UNDELIVERED; a retry with receipt would have closed them | not recorded |
| L0235 | YES | rings queued behind a full chair window with no stamp; a receipt would tell the sender at once | 100 min |
| L0241 | PARTLY | a ring stamped delivered but not acted on; an acted-on ack would have flagged it in minutes | 264 min (disputed in the plan) |
| L0245 | PARTLY | 60% of dispatches forced by timeout; receipts would make the queue wait visible | not recorded |
| L0270 | YES | a cancel that binds the receiver (checked before it acts on the dispatch) stops a dispatch delivered 4 min after withdrawal | not recorded |
| L0288 | YES | a receipt showing the ring queued behind a busy turn tells the sender it was not read | 8 min |
| L0289 | PARTLY | queue wait behind a hung working seat; a stamped queue position/receipt makes it visible, cause is the foreground suite | 8-16 min per ring |
| L0292 | YES | a STALE stamp held two rings and the 240 s force did not fire; a receipt with a deadline would have flagged them | 16+ min |
| L0293 | YES | ring queued silently; a receipt would have told the pane without it re-ringing | not recorded |
| L0298 | PARTLY | same event as the suite hang: rings queued behind it; a receipt shows the queue, cause is the foreground suite | 8 min |
| L0301 | PARTLY | a read/acted time on the ring would have settled the delivery time without a hand reconstruction | not recorded |
| L0307 | PARTLY | a received-at stamp would have shown the ring was rendered 0.22 s after the call, ending the wrong blame | not recorded |
| L0315 | YES | the keeper's stop word did not bind the running pane; the install ran after it; a stop flag the next command checks stops it | not recorded |
| L0412 | YES | a dispatch tied to a busy pane queued all night; a receipt/queue age would have shown the sender it was unread | about one night (no minutes) |
| L0418 | YES | "delivered" printed for text sitting unsubmitted in the composer; a read receipt would show it unread | 38 min |
| L0463 | YES | a refused ring with no receipt to the sender; the seat did not know its line was lost | not recorded |
| L0464 | PARTLY | a visit line refused silently on an unnamed rule; a refusal receipt tells the sender (the private-term push part is a different fault) | not recorded |
| L0483 | PARTLY | a ring crossed work already in motion; a receipt/state on the target would show it was working | not recorded |
| L0538 | YES | the pulse guessed 31 dispatches "unconfirmed" when 32 of 32 had arrived; a real receipt replaces the guess (2,504 false fires) | not recorded |
| L0579 | PARTLY | stopping a run by killing its shell started the next phase; a stop that binds the run (not the shell) avoids it | about 1 min |
| L0587 | PARTLY | a withdrawal sent 12 s before did not bind the plan built on the claim; a receipt on the retraction would have caught it | 3 min |
| L0592 | PARTLY | an UNRECEIVED line built on a time parse, false 183 times; a real read receipt replaces it | not recorded |
| L0621 | YES | the chair's correction to E's question set arrived after the set was written; a correction that binds E's next command stops it | not recorded |
| L0623 | YES | E's re-ring was refused UNDELIVERED and nobody was woken; a receipt to the sender shows the loop idle at once | minutes not recorded |
| L0676 | PARTLY | the chair's hold arrived while E's run held the lock and it ran about 49 s past it; a hold the run checks stops it at once | under 1 min |
| L0683 | YES | two dispatches reached C 700-880 s after sending, already superseded; a receipt/ack plus a binding supersede stops stale orders | 700-880 s per dispatch (about 12-15 min) |
| L0700 | YES | C installed before E's GREEN against the chair's changed order; a hold the install command checks would stop it | not recorded |
| L0816 | YES | A's stop note never arrived and the sender was not told; a receipt would show the stop unread before close | not recorded |
| L0822 | PARTLY | a ring pasted into the keeper's message mid-sentence; delivery that binds on the composer state avoids the splice | not recorded |
| L0823 | PARTLY | same splice, twice more (items 48 and 49) | not recorded |
| L0862 | PARTLY | a queued bench was still waiting when the hold rendered and the stop left it alive; a hold the waiter checks binds it | not recorded |
| L0866 | PARTLY | the row itself says the relayed hold had no mechanism to bind until D663 (the red rows were a separate fault) | not recorded |
| L0875 | YES | C was stopped and committed a partial while the chair's finish correction (sent 13:35:12Z) arrived 13:38Z; a correction that binds the next command stops it | about 3 min delay |
| L0887 | YES | a letter saying lap L160 closed sat unread while the seat worked on; a read receipt would flag it | about 60 min |
| L0916 | PARTLY | the stop for L177 was held 604 s so C built it first (same event as L0917; the lean/research faults are other causes) | not recorded |
| L0917 | YES | the stop order for L177 sat 604 s in the queue; C built the lap first; a stop that binds C's next command stops it | 604 s (about 10 min), one build lap |
| L0935 | YES | packets reached B out of order and up to 15 min late; a receipt with order/age shows it | up to 15 min |
| L0943 | YES | the chair's stop (09:09Z) was delivered 09:19Z, after C had merged; a binding stop flag stops the merge | 10 min |
| L0944 | YES | stride rulings reached C 29-49 min after sending, after the chain was merged; receipts and a binding order | 29-49 min |
| L0948 | PARTLY | the packet arrived 15 min late; the stop at step 1 had another cause (no readable source) | not recorded |
| L0971 | YES | a packet delivered to a pane whose last reply was an API error was not acted on and nobody was told; a receipt shows it unread | no minutes in row |
| L0972 | YES | second 403 burst: panes answered the packet with the error and waited; an acted-on receipt flags it | 9 min (A and C) |
| L1008 | YES | a stop order reached two panes late; no receipt told the sender | lateness not totalled |
| L1019 | PARTLY | a ring pasted into the keeper's message mid-sentence; delivery bound to the composer state avoids it | not recorded |
| L1025 | PARTLY | the keeper's hold crossed the launch; a hold the launcher checks would stop it | not recorded |
| L1031 | PARTLY | his answer slot was taken by a pane's ring pasted into the same box; delivery bound to the composer state avoids it | not recorded |
| L1058 | YES | the chair's HOLD (sent 14:53Z) reached E at 15:12Z; E built, committed and handed back meanwhile; a binding hold stops the work | 1151 s (about 19 min) |
| L1079 | PARTLY | a pane answering an error was hidden from the sender by the digest; an acted-on receipt would show it | not recorded |
| L1081 | YES | a hold ring took about 21 min and arrived after E had committed the step it said to wait; a hold E's next command checks stops it | 21 min |
| L1092 | YES | the root itself: a queued message's sender is never told when it lands; a landing receipt fixes it | not recorded |
| L1114 | YES | the hold on C's stomp work and its lift crossed in C's queue; ordered, acked holds would not cross | not recorded |

## Every ledger id

YES: L0001 L0002 L0003 L0008 L0046 L0176 L0205 L0235 L0270 L0288 L0292 L0293 L0315 L0412 L0418 L0463 L0538 L0621 L0623 L0683 L0700 L0816 L0875 L0887 L0917 L0935 L0943 L0944 L0971 L0972 L1008 L1058 L1081 L1092 L1114

PARTLY: L0114 L0115 L0132 L0175 L0183 L0184 L0202 L0218 L0241 L0245 L0289 L0298 L0301 L0307 L0464 L0483 L0579 L0587 L0592 L0676 L0822 L0823 L0862 L0866 L0916 L0948 L1019 L1025 L1031 L1079

REMOVE (skipped): L0029 L0162 L0255 L0299 L0300 L0390 L0409

NO (1051 rows, listed in full): L0004 L0005 L0006 L0007 L0009 L0010 L0011 L0012 L0013 L0014 L0015 L0016 L0017 L0018 L0019 L0020 L0021 L0022 L0023 L0024 L0025 L0026 L0027 L0028 L0030 L0031 L0032 L0033 L0034 L0035 L0036 L0037 L0038 L0039 L0040 L0041 L0042 L0043 L0044 L0045 L0047 L0048 L0049 L0050 L0051 L0052 L0053 L0054 L0055 L0056 L0057 L0058 L0059 L0060 L0061 L0062 L0063 L0064 L0065 L0066 L0067 L0068 L0069 L0070 L0071 L0072 L0073 L0074 L0075 L0076 L0077 L0078 L0079 L0080 L0081 L0082 L0083 L0084 L0085 L0086 L0087 L0088 L0089 L0090 L0091 L0092 L0093 L0094 L0095 L0096 L0097 L0098 L0099 L0100 L0101 L0102 L0103 L0104 L0105 L0106 L0107 L0108 L0109 L0110 L0111 L0112 L0113 L0116 L0117 L0118 L0119 L0120 L0121 L0122 L0123 L0124 L0125 L0126 L0127 L0128 L0129 L0130 L0131 L0133 L0134 L0135 L0136 L0137 L0138 L0139 L0140 L0141 L0142 L0143 L0144 L0145 L0146 L0147 L0148 L0149 L0150 L0151 L0152 L0153 L0154 L0155 L0156 L0157 L0158 L0159 L0160 L0161 L0163 L0164 L0165 L0166 L0167 L0168 L0169 L0170 L0171 L0172 L0173 L0174 L0177 L0178 L0179 L0180 L0181 L0182 L0185 L0186 L0187 L0188 L0189 L0190 L0191 L0192 L0193 L0194 L0195 L0196 L0197 L0198 L0199 L0200 L0201 L0203 L0204 L0206 L0207 L0208 L0209 L0210 L0211 L0212 L0213 L0214 L0215 L0216 L0217 L0219 L0220 L0221 L0222 L0223 L0224 L0225 L0226 L0227 L0228 L0229 L0230 L0231 L0232 L0233 L0234 L0236 L0237 L0238 L0239 L0240 L0242 L0243 L0244 L0246 L0247 L0248 L0249 L0250 L0251 L0252 L0253 L0254 L0256 L0257 L0258 L0259 L0260 L0261 L0262 L0263 L0264 L0265 L0266 L0267 L0268 L0269 L0271 L0272 L0273 L0274 L0275 L0276 L0277 L0278 L0279 L0280 L0281 L0282 L0283 L0284 L0285 L0286 L0287 L0290 L0291 L0294 L0295 L0296 L0297 L0302 L0303 L0304 L0305 L0306 L0308 L0309 L0310 L0311 L0312 L0313 L0314 L0316 L0317 L0318 L0319 L0320 L0321 L0322 L0323 L0324 L0325 L0326 L0327 L0328 L0329 L0330 L0331 L0332 L0333 L0334 L0335 L0336 L0337 L0338 L0339 L0340 L0341 L0342 L0343 L0344 L0345 L0346 L0347 L0348 L0349 L0350 L0351 L0352 L0353 L0354 L0355 L0356 L0357 L0358 L0359 L0360 L0361 L0362 L0363 L0364 L0365 L0366 L0367 L0368 L0369 L0370 L0371 L0372 L0373 L0374 L0375 L0376 L0377 L0378 L0379 L0380 L0381 L0382 L0383 L0384 L0385 L0386 L0387 L0388 L0389 L0391 L0392 L0393 L0394 L0395 L0396 L0397 L0398 L0399 L0400 L0401 L0402 L0403 L0404 L0405 L0406 L0407 L0408 L0410 L0411 L0413 L0414 L0415 L0416 L0417 L0419 L0420 L0421 L0422 L0423 L0424 L0425 L0426 L0427 L0428 L0429 L0430 L0431 L0432 L0433 L0434 L0435 L0436 L0437 L0438 L0439 L0440 L0441 L0442 L0443 L0444 L0445 L0446 L0447 L0448 L0449 L0450 L0451 L0452 L0453 L0454 L0455 L0456 L0457 L0458 L0459 L0460 L0461 L0462 L0465 L0466 L0467 L0468 L0469 L0470 L0471 L0472 L0473 L0474 L0475 L0476 L0477 L0478 L0479 L0480 L0481 L0482 L0484 L0485 L0486 L0487 L0488 L0489 L0490 L0491 L0492 L0493 L0494 L0495 L0496 L0497 L0498 L0499 L0500 L0501 L0502 L0503 L0504 L0505 L0506 L0507 L0508 L0509 L0510 L0511 L0512 L0513 L0514 L0515 L0516 L0517 L0518 L0519 L0520 L0521 L0522 L0523 L0524 L0525 L0526 L0527 L0528 L0529 L0530 L0531 L0532 L0533 L0534 L0535 L0536 L0537 L0539 L0540 L0541 L0542 L0543 L0544 L0545 L0546 L0547 L0548 L0549 L0550 L0551 L0552 L0553 L0554 L0555 L0556 L0557 L0558 L0559 L0560 L0561 L0562 L0563 L0564 L0565 L0566 L0567 L0568 L0569 L0570 L0571 L0572 L0573 L0574 L0575 L0576 L0577 L0578 L0580 L0581 L0582 L0583 L0584 L0585 L0586 L0588 L0589 L0590 L0591 L0593 L0594 L0595 L0596 L0597 L0598 L0599 L0600 L0601 L0602 L0603 L0604 L0605 L0606 L0607 L0608 L0609 L0610 L0611 L0612 L0613 L0614 L0615 L0616 L0617 L0618 L0619 L0620 L0622 L0624 L0625 L0626 L0627 L0628 L0629 L0630 L0631 L0632 L0633 L0634 L0635 L0636 L0637 L0638 L0639 L0640 L0641 L0642 L0643 L0644 L0645 L0646 L0647 L0648 L0649 L0650 L0651 L0652 L0653 L0654 L0655 L0656 L0657 L0658 L0659 L0660 L0661 L0662 L0663 L0664 L0665 L0666 L0667 L0668 L0669 L0670 L0671 L0672 L0673 L0674 L0675 L0677 L0678 L0679 L0680 L0681 L0682 L0684 L0685 L0686 L0687 L0688 L0689 L0690 L0691 L0692 L0693 L0694 L0695 L0696 L0697 L0698 L0699 L0701 L0702 L0703 L0704 L0705 L0706 L0707 L0708 L0709 L0710 L0711 L0712 L0713 L0714 L0715 L0716 L0717 L0718 L0719 L0720 L0721 L0722 L0723 L0724 L0725 L0726 L0727 L0728 L0729 L0730 L0731 L0732 L0733 L0734 L0735 L0736 L0737 L0738 L0739 L0740 L0741 L0742 L0743 L0744 L0745 L0746 L0747 L0748 L0749 L0750 L0751 L0752 L0753 L0754 L0755 L0756 L0757 L0758 L0759 L0760 L0761 L0762 L0763 L0764 L0765 L0766 L0767 L0768 L0769 L0770 L0771 L0772 L0773 L0774 L0775 L0776 L0777 L0778 L0779 L0780 L0781 L0782 L0783 L0784 L0785 L0786 L0787 L0788 L0789 L0790 L0791 L0792 L0793 L0794 L0795 L0796 L0797 L0798 L0799 L0800 L0801 L0802 L0803 L0804 L0805 L0806 L0807 L0808 L0809 L0810 L0811 L0812 L0813 L0814 L0815 L0817 L0818 L0819 L0820 L0821 L0824 L0825 L0826 L0827 L0828 L0829 L0830 L0831 L0832 L0833 L0834 L0835 L0836 L0837 L0838 L0839 L0840 L0841 L0842 L0843 L0844 L0845 L0846 L0847 L0848 L0849 L0850 L0851 L0852 L0853 L0854 L0855 L0856 L0857 L0858 L0859 L0860 L0861 L0863 L0864 L0865 L0867 L0868 L0869 L0870 L0871 L0872 L0873 L0874 L0876 L0877 L0878 L0879 L0880 L0881 L0882 L0883 L0884 L0885 L0886 L0888 L0889 L0890 L0891 L0892 L0893 L0894 L0895 L0896 L0897 L0898 L0899 L0900 L0901 L0902 L0903 L0904 L0905 L0906 L0907 L0908 L0909 L0910 L0911 L0912 L0913 L0914 L0915 L0918 L0919 L0920 L0921 L0922 L0923 L0924 L0925 L0926 L0927 L0928 L0929 L0930 L0931 L0932 L0933 L0934 L0936 L0937 L0938 L0939 L0940 L0941 L0942 L0945 L0946 L0947 L0949 L0950 L0951 L0952 L0953 L0954 L0955 L0956 L0957 L0958 L0959 L0960 L0961 L0962 L0963 L0964 L0965 L0966 L0967 L0968 L0969 L0970 L0973 L0974 L0975 L0976 L0977 L0978 L0979 L0980 L0981 L0982 L0983 L0984 L0985 L0986 L0987 L0988 L0989 L0990 L0991 L0992 L0993 L0994 L0995 L0996 L0997 L0998 L0999 L1000 L1001 L1002 L1003 L1004 L1005 L1006 L1007 L1009 L1010 L1011 L1012 L1013 L1014 L1015 L1016 L1017 L1018 L1020 L1021 L1022 L1023 L1024 L1026 L1027 L1028 L1029 L1030 L1032 L1033 L1034 L1035 L1036 L1037 L1038 L1039 L1040 L1041 L1042 L1043 L1044 L1045 L1046 L1047 L1048 L1049 L1050 L1051 L1052 L1053 L1054 L1055 L1056 L1057 L1059 L1060 L1061 L1062 L1063 L1064 L1065 L1066 L1067 L1068 L1069 L1070 L1071 L1072 L1073 L1074 L1075 L1076 L1077 L1078 L1080 L1082 L1083 L1084 L1085 L1086 L1087 L1088 L1089 L1090 L1091 L1093 L1094 L1095 L1096 L1097 L1098 L1099 L1100 L1101 L1102 L1103 L1104 L1105 L1106 L1107 L1108 L1109 L1110 L1111 L1112 L1113 L1115 L1116 L1117 L1118 L1119 L1120 L1121 L1122 L1123

## Cost covered (YES rows only)

- 35 YES rows. 15 of them state a cost in minutes; 20 state none (no minutes and no tokens): L0001 L0002 L0003 L0008 L0176 L0205 L0270 L0293 L0315 L0412 L0463 L0538 L0621 L0623 L0700 L0816 L0971 L1008 L1092 L1114.
- Minutes in the 15 rows [read from the rows, added by hand, [inferred] sum]: L0046 4; L0235 100; L0288 8; L0292 16; L0418 38; L0683 700-880 s (11.7 to 14.7); L0917 604 s (10.1); L0935 15; L0943 10; L0944 29-49; L0972 9; L1058 1151 s (19.2); L1081 21; L0875 about 3 (13:35:12Z to 13:38Z); L0887 about 60.
- Sum: about 354 to 377 minutes. Tokens: none stated in any YES row.
- Not counted as minutes: L0412 "about one night" (no figure); L0205 120,098 B pushed and a repo recreated (no minutes); L0176 four keeper-approved hands lost; L0003 cites the 38 min of L0418 (counted once, in L0418).
- PARTLY rows carry more stated minutes (L0184 72; L0202 29; L0241 264, disputed in the plan as a different fault; L0289 8-16 per ring; L0298 8) and are NOT added in.
- Caveat [inferred]: the largest YES cost is the 100 min of L0235 and the 60 min of L0887.

## Notes on judgment calls [inferred]

- Strongest fit: queued or late stop, hold and correction orders arriving after the work (L0270, L0683, L0700, L0875, L0917, L0943, L0944, L1058, L1081, L1114, L0621, L0315); and sends with no receipt (L0001, L0002, L0003, L0008, L0176, L0293, L0418, L0538, L0971, L0972, L1008, L1092).
- I scored the rows about the "No response requested" reply, packet-before-hold crossings that were the sender's own over-reading (L1007), locks and memory gates (L0912, L0966, L0970), the 345 pulse lines (L0239) and hand-backs nobody collated (R07 territory) as NO. I scored refusals out of turn (L0149, L0150) NO: the sender was told; the gate itself was the fault.
- Several rows count one event twice (for example L0289 and L0298; L0916 and L0917). I gave the cost to one row only.
- The ledger notes about 10% of rows are unreliable as written; I did not correct that.

## What I did not open

The primaries behind every row (I judged from the ledger wording only); 00_roots.md beyond R05 and R06/R07 headings; the groups' files and other scorers' files; the plan's other files; transcripts and C:/Consonance/data. I did not recount the cost figures against their primaries, so the 354-377 minutes is only as good as the ledger rows.
