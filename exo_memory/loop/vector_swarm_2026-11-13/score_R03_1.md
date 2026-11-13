# Score R03, scorer 1 (Sonnet research agent, 2026-11-13)

Root R03: a control is accepted without being shown to fire on a recorded real failing case.
Method [read]: I read 00_roots.md (R03 entry only) and every row of 00_ledger.md (L0001 to L1123) in whole lines.
I opened no primary. Each verdict rests on the row wording only [inferred]. Rows marked REMOVE by the second reader
were skipped: L0029 L0162 L0255 L0299 L0300 L0390 L0409 (7 rows). Scored rows: 1116.

Rule I used. YES: a control (test, mutation score, gate, guard, scan, falsifier, instrument, check) existed or was
relied on, and the row shows it blind or wrong on a real case, and a run on one recorded real case (installed copy,
machine, mode in use) before acceptance would have shown it. Includes rows where an existing control caught it at once.
PARTLY: the root would have made it smaller or sooner, or the control was only partly the fault. NO: the incident is a
wrong claim, a stall, a lock, a delivery fault, a keeper catch on taste or reading, or work rework with no control at fault.

## YES and PARTLY rows (mechanism in one line)

| id | verdict | mechanism [inferred] |
|---|---|---|
| L0015 | PARTLY | a scorer run on one recorded trial with a known answer would show it measured the scorer, not behaviour |
| L0026 | PARTLY | run the second-vantage launcher on one real finding first; 6 of 7 UNLAUNCHABLE reported CLOSED |
| L0058 | YES | run the repo-root bar on a recorded failing case (foreign SystemDrive) instead of a same-drive clone that passes vacuously |
| L0062 | YES | run each sweeping instrument on one recorded failing file outside its visible surface |
| L0065 | YES | run the MACHINE-BOUND gate and the temp-clone bar on a recorded failing case; a gate that cannot fail was shipped |
| L0068 | PARTLY | a collation alarm shown to fire on the recorded dead-lap case |
| L0069 | PARTLY | v1 stall verdict vanished; run on the real lap.jsonl, not 11 fixtures |
| L0074 | YES | collation alarm was a conjunction nothing computes; one run on the recorded L013 stall would show it never fires |
| L0079 | PARTLY | stall detector built a day earlier missed L018; run it on the recorded stalls |
| L0085 | PARTLY | prereg that could not lose; preflight on real data caught it |
| L0089 | YES | fire the dispatch-gate on one recorded real dispatch on the installed copy before scoring runs on it |
| L0101 | YES | run the transcript evictor on one recorded over-ceiling pane brief; it evicts nothing by arithmetic |
| L0102 | PARTLY | same no-op evictor seen on a real over-ceiling shell |
| L0112 | PARTLY | wake proof on a real pane would have shown no map carried |
| L0123 | YES | run the corpus budget tool against one recorded real seat (22,382 received vs 2,200,000 printed) before trusting it |
| L0124 | PARTLY | run the indicator on real chain rows; no arrow drawn |
| L0127 | PARTLY | same holder-vocabulary drift |
| L0137 | YES | an inert pattern read as a clean surface; run each oracle on a recorded positive |
| L0138 | YES | a gate reading a record written only when it would pass; run on a recorded failing case |
| L0139 | YES | zero reported by an instrument with no positive control |
| L0140 | PARTLY | sandbox test cannot see a wrong name; run on one recorded real wrong name |
| L0145 | YES | stranger-install wake proofs print the same on a broken install; run on a recorded broken install |
| L0146 | YES | js-suite never run in the consumer tree (42 green, 17 failed, 3 crashed of 63) |
| L0151 | YES | three tests passed for the wrong reason; guard whose removal no test detects |
| L0156 | YES | cargo check green over six failing tests; consumer parity run on the generated tree |
| L0158 | YES | identity rule matched 0 of the 3 files with the city; run the guard on a recorded real leak |
| L0164 | YES | baton-wake saw 10 of 375 deliveries; run on the recorded board |
| L0165 | YES | keyword guard no mutant could kill dropped 2 of 376 real deliveries; replay recorded deliveries |
| L0168 | PARTLY | two survivors tested the constant not the output |
| L0177 | PARTLY | green list-test over an ungated write |
| L0178 | PARTLY | lap-row falsifier had fired since D010 |
| L0180 | YES | guard one row disarms forever; never shown to fire on a recorded case |
| L0181 | PARTLY | landing command runs a different suite; a run of the guard on a recorded case would show red |
| L0188 | PARTLY | guard tested on a seeded defect, not a recorded real one |
| L0195 | YES | matcher green over the very row it was built for; run on the recorded row before landing |
| L0215 | YES | guard in the same function could not fire; reader built before the thing it reads would fail green |
| L0217 | PARTLY | gate wrong until the harness ran it on a real roster |
| L0220 | YES | prefix-hash bar cannot see a far machine's own appends; run on a recorded diverged pair |
| L0222 | YES | same bar passes on a machine that appended its own turns |
| L0237 | YES | anchor gauge had no positive control; it fired the wrong way on real reads |
| L0258 | PARTLY | re-measure void as written |
| L0259 | YES | cfg(test) brace counter wrong both ways hid 2,500 live lines; run on a recorded case |
| L0261 | YES | registrant filter matched 0 of 28 events; run on one recorded event |
| L0264 | YES | bars run --test-threads=1 hide the race; run in the mode in use |
| L0267 | PARTLY | corrupt fixtures scored against for 11 days |
| L0271 | YES | close --check passed where a real close would have published L's ledger; run on a recorded real close |
| L0284 | PARTLY | sweep blind after a rename; the count floor already fired |
| L0286 | PARTLY | carrier-drift scans only .md and .html; run on a recorded struck wording in .js |
| L0296 | YES | -Check passes over a hook silent forever; run the check on a recorded silent hook |
| L0312 | PARTLY | claim-recognition arm flagged 66% of every reply; run on real replies |
| L0318 | PARTLY | installed 0.2.0 and 0.2.1 faults found only by fresh eyes; run on the installed copy |
| L0319 | PARTLY | detector relying on a default stopped detecting |
| L0320 | PARTLY | panel says lap proved while export refuses; run on the installed copy |
| L0325 | PARTLY | real hole in second-reader hook found only by mutation |
| L0327 | PARTLY | install check read a hook under another matcher as correct |
| L0330 | YES | reply-slot test let an uncapped list pass; hook blind on the librarian; replay one recorded librarian ring |
| L0342 | PARTLY | still-frame test passed a warp the keeper rejected |
| L0349 | YES | G3 scrub misses 8 of 16 secret shapes; G1 G2 holes; run each gate on recorded real cases |
| L0352 | PARTLY | ask-ending shadow trial never scored; 22 of 6,983 matched |
| L0360 | YES | dedangle rewrote GUARDED regex to match nothing; run the gate on a recorded guarded case |
| L0362 | YES | stop bar checked docs were true, not that commands work; run on the installed consumer |
| L0368 | PARTLY | identity diff missed what the cold read caught |
| L0373 | PARTLY | light pointer test floor held only in the workshop; parity run on the generated tree |
| L0376 | YES | gates caught 0 of 383 recorded errors; run each gate on its recorded error cases |
| L0377 | YES | shelf-budget build ran on the strict walk only; gates_mode light is the mode in use |
| L0388 | PARTLY | mistake bench validity missed three times |
| L0401 | PARTLY | first builder measurements measured an empty track; run on a known bad track |
| L0405 | YES | fix passed headless but crashed on the keeper's machine; run in the mode and machine in use |
| L0417 | PARTLY | contractProblems check accepted without probing edges |
| L0425 | PARTLY | gate pipeline cannot pass by construction |
| L0426 | PARTLY | launcher measure step wrong five ways |
| L0434 | YES | amended comments swallowed the assertion after them; a test that cannot go red |
| L0460 | YES | V6 row could not be shown red |
| L0464 | PARTLY | visit guard and private-term scan blind to a class |
| L0473 | PARTLY | checker's one car profile does not cover the fleet; run on a recorded sinking car |
| L0481 | PARTLY | checks green, keeper's drive showed wheels sink |
| L0504 | YES | export validation checked none of the six defect classes of the day; run it on the recorded defective export |
| L0510 | PARTLY | matrix compared the old check against a stub that was the new check |
| L0524 | PARTLY | drift check sampled vertices only; uv tolerance hid 10,083 vertices |
| L0527 | PARTLY | touched-set green while 13 outside files were red |
| L0531 | YES | D619 judged 39 tools never seen catching without running one; two of six run returned live defects |
| L0532 | YES | push-gate's 2 denies were planted test keys, not real catches |
| L0538 | YES | pulse alarm fired 2,504 times, 32 of 32 had arrived; run it on a recorded delivered case |
| L0544 | YES | 3 of 32 hooks have a cited real catch; run each on a recorded case |
| L0549 | PARTLY | first joint-bump fix passed checks, keeper still felt it on his ribbon |
| L0554 | YES | old reader surfaced 37 rows, 30 wrong against P's key; run on the keyed rows first |
| L0559 | PARTLY | render_proof threw in 5 of 8 rows; S16 not caught after landing |
| L0561 | YES | pane-status and usage.js never run on a real over-512 MB transcript; they crash or skip silently |
| L0562 | YES | usage.js table omitted about 93% of responses (8,949 of 128,300); one run against a known count shows it |
| L0564 | YES | corrections-gate guards named files only; run it on a recorded correction commit; all 85 landed outside |
| L0567 | PARTLY | instrument listed to keep cannot run on this machine |
| L0568 | YES | deference screen 24.8 per 1k did not survive reading: 33 of 37 false; score it on recorded cases first |
| L0569 | PARTLY | pre-run lock check looked in the wrong directory |
| L0570 | PARTLY | touched set showed nothing; plan erased bumps on his own saves |
| L0575 | YES | count-only private-term scan does not stop a push; run the gate on a recorded private-term push |
| L0582 | PARTLY | second reader shadow flagged real errors in 8 of 80 sampled rings; never scored before running |
| L0583 | YES | vantage reader surfaced 30 of 37 of its own errors; score it on keyed rows before acceptance |
| L0590 | PARTLY | pulse STALE fired 4,577 times for 1 change |
| L0592 | PARTLY | UNRECEIVED line fired 183 times and was false |
| L0611 | YES | catch-ledger meter read two files only and saw no catch for six weeks; run on a recorded hand-back catch |
| L0612 | PARTLY | two collapse meters cannot run |
| L0620 | PARTLY | three transcript tools failed on files past 512 MB (fix commit) |
| L0652 | YES | B's table laid with extend() and measured the quintic, not what the panel lays; run on the panel's real output |
| L0655 | PARTLY | ten UI glitches found only after he drove it |
| L0665 | YES | row passed on the base because the base ignores changes; run on a recorded failing build |
| L0668 | YES | drag-cost row passed on d87ba99's slow panel; run on the recorded slow build |
| L0670 | YES | lighthouse scan dropped file-rule terms on every push; run on a recorded real hit |
| L0673 | PARTLY | registered bar came from a cold-vs-warm bench |
| L0696 | YES | push-gate scans only a push's first refspec; run on a recorded two-branch push |
| L0697 | PARTLY | G1-G10 harness green, keeper's screenshot showed the fault |
| L0702 | YES | push gate wired nowhere on L; run on one real L push on the installed copy |
| L0742 | YES | privacy greps counted 0 because NUL made grep binary; no positive control; run on a recorded leak |
| L0746 | PARTLY | scan checked the name main, not the pushed sha |
| L0749 | PARTLY | registered measure compared bends of different sharpness |
| L0750 | YES | truth check found no cases because messages were stored cut at 220 chars; zero with no positive control |
| L0772 | PARTLY | private-names grep could not run (PRIV_PATTERN empty); run the gate on a recorded hit |
| L0809 | PARTLY | false void death in a landed build; checks green, keeper's play failed |
| L0838 | YES | old nearest-node row green at seed 5 was one draw; old code failed 36 of 40 seeds; run on recorded failing seeds |
| L0855 | PARTLY | old corner row read the vertex and understated the cost |
| L0858 | YES | mutation run CONTROL failed (tree lacked app/preview) so every caught meant nothing; keep a control that must fire |
| L0859 | PARTLY | first burst runs never had the body in frame |
| L0864 | PARTLY | first motion bar let its mutant pass |
| L0866 | YES | harness control could never be green on D because rows read D's own profile; run the control on this machine |
| L0872 | PARTLY | interceptor test not at the level's own dials |
| L0880 | PARTLY | background suite reported completed but ctest was not on PATH |
| L0884 | PARTLY | camera test too weak: 1 of 4 deliberate breaks not caught |
| L0888 | YES | fix written on a theory was hollow; breaking it failed no test |
| L0891 | PARTLY | band chain level error reached three files the keeper heard |
| L0902 | PARTLY | 48-seed falsification was seed noise |
| L0914 | YES | B's no-game-running check always read none; guard never fired through the 11-11 landings |
| L0929 | PARTLY | lean-rate bar set 3% above one run broke on 11 of 24 seeds |
| L0932 | PARTLY | slip estimator read 10 deg on a body with no sideslip |
| L0940 | PARTLY | lockrun wrapper reported exit 0 on a failed build |
| L0942 | PARTLY | lock retry matched one of two give-up messages; a fix run read a stale binary |
| L0956 | YES | B's no-game check used Git's find and always read none; run it with a game running |
| L0996 | YES | push, delete and sources gates never installed on L; run one recorded push on L |
| L1015 | YES | idle-holder guard named working holders idle with negative CPU after 97 of 97 mutants; run on a recorded live window |
| L1044 | YES | push-gate hook absent on the seats; run one recorded push on each seat |
| L1053 | PARTLY | detector counted the hunter's tone as 65 footfalls |
| L1064 | YES | 101 tests and 73 mutants green while the guard was wrong: no row had a child exit inside the window; run on the recorded live window |
| L1080 | YES | landing train verified with a stand-in dz-world.exe; first real run sent change 1 back wrongly |
| L1085 | PARTLY | same-turn note hook never installed on D |
| L1086 | PARTLY | ask-surface runs from a repo path; -Check does not report it live |
| L1098 | PARTLY | F1b called the fix for the recorded case; arithmetic on the recorded case shows 13.6 of 90.5 MB |
| L1099 | PARTLY | spec step would not end the recorded case |
| L1100 | PARTLY | W5 check that would never pass |
| L1101 | PARTLY | W4 W1 W5 checks wrong as written |
| L1103 | YES | first swarm's proving check tested a drain row to Main but the 09-16 case was a door delivery; run on the recorded case |
| L1105 | PARTLY | plan's falsifier scored by the file it tests |
| L1122 | PARTLY | precompact.js is a no-op on L |

## NO rows (every other scored id)

L0001 L0002 L0003 L0004 L0005 L0006 L0007 L0008 L0009 L0010 L0011 L0012 L0013 L0014 L0016 L0017 L0018 L0019 L0020 
L0021 L0022 L0023 L0024 L0025 L0027 L0028 L0030 L0031 L0032 L0033 L0034 L0035 L0036 L0037 L0038 L0039 L0040 L0041 
L0042 L0043 L0044 L0045 L0046 L0047 L0048 L0049 L0050 L0051 L0052 L0053 L0054 L0055 L0056 L0057 L0059 L0060 L0061 
L0063 L0064 L0066 L0067 L0070 L0071 L0072 L0073 L0075 L0076 L0077 L0078 L0080 L0081 L0082 L0083 L0084 L0086 L0087 
L0088 L0090 L0091 L0092 L0093 L0094 L0095 L0096 L0097 L0098 L0099 L0100 L0103 L0104 L0105 L0106 L0107 L0108 L0109 
L0110 L0111 L0113 L0114 L0115 L0116 L0117 L0118 L0119 L0120 L0121 L0122 L0125 L0126 L0128 L0129 L0130 L0131 L0132 
L0133 L0134 L0135 L0136 L0141 L0142 L0143 L0144 L0147 L0148 L0149 L0150 L0152 L0153 L0154 L0155 L0157 L0159 L0160 
L0161 L0163 L0166 L0167 L0169 L0170 L0171 L0172 L0173 L0174 L0175 L0176 L0179 L0182 L0183 L0184 L0185 L0186 L0187 
L0189 L0190 L0191 L0192 L0193 L0194 L0196 L0197 L0198 L0199 L0200 L0201 L0202 L0203 L0204 L0205 L0206 L0207 L0208 
L0209 L0210 L0211 L0212 L0213 L0214 L0216 L0218 L0219 L0221 L0223 L0224 L0225 L0226 L0227 L0228 L0229 L0230 L0231 
L0232 L0233 L0234 L0235 L0236 L0238 L0239 L0240 L0241 L0242 L0243 L0244 L0245 L0246 L0247 L0248 L0249 L0250 L0251 
L0252 L0253 L0254 L0256 L0257 L0260 L0262 L0263 L0265 L0266 L0268 L0269 L0270 L0272 L0273 L0274 L0275 L0276 L0277 
L0278 L0279 L0280 L0281 L0282 L0283 L0285 L0287 L0288 L0289 L0290 L0291 L0292 L0293 L0294 L0295 L0297 L0298 L0301 
L0302 L0303 L0304 L0305 L0306 L0307 L0308 L0309 L0310 L0311 L0313 L0314 L0315 L0316 L0317 L0321 L0322 L0323 L0324 
L0326 L0328 L0329 L0331 L0332 L0333 L0334 L0335 L0336 L0337 L0338 L0339 L0340 L0341 L0343 L0344 L0345 L0346 L0347 
L0348 L0350 L0351 L0353 L0354 L0355 L0356 L0357 L0358 L0359 L0361 L0363 L0364 L0365 L0366 L0367 L0369 L0370 L0371 
L0372 L0374 L0375 L0378 L0379 L0380 L0381 L0382 L0383 L0384 L0385 L0386 L0387 L0389 L0391 L0392 L0393 L0394 L0395 
L0396 L0397 L0398 L0399 L0400 L0402 L0403 L0404 L0406 L0407 L0408 L0410 L0411 L0412 L0413 L0414 L0415 L0416 L0418 
L0419 L0420 L0421 L0422 L0423 L0424 L0427 L0428 L0429 L0430 L0431 L0432 L0433 L0435 L0436 L0437 L0438 L0439 L0440 
L0441 L0442 L0443 L0444 L0445 L0446 L0447 L0448 L0449 L0450 L0451 L0452 L0453 L0454 L0455 L0456 L0457 L0458 L0459 
L0461 L0462 L0463 L0465 L0466 L0467 L0468 L0469 L0470 L0471 L0472 L0474 L0475 L0476 L0477 L0478 L0479 L0480 L0482 
L0483 L0484 L0485 L0486 L0487 L0488 L0489 L0490 L0491 L0492 L0493 L0494 L0495 L0496 L0497 L0498 L0499 L0500 L0501 
L0502 L0503 L0505 L0506 L0507 L0508 L0509 L0511 L0512 L0513 L0514 L0515 L0516 L0517 L0518 L0519 L0520 L0521 L0522 
L0523 L0525 L0526 L0528 L0529 L0530 L0533 L0534 L0535 L0536 L0537 L0539 L0540 L0541 L0542 L0543 L0545 L0546 L0547 
L0548 L0550 L0551 L0552 L0553 L0555 L0556 L0557 L0558 L0560 L0563 L0565 L0566 L0571 L0572 L0573 L0574 L0576 L0577 
L0578 L0579 L0580 L0581 L0584 L0585 L0586 L0587 L0588 L0589 L0591 L0593 L0594 L0595 L0596 L0597 L0598 L0599 L0600 
L0601 L0602 L0603 L0604 L0605 L0606 L0607 L0608 L0609 L0610 L0613 L0614 L0615 L0616 L0617 L0618 L0619 L0621 L0622 
L0623 L0624 L0625 L0626 L0627 L0628 L0629 L0630 L0631 L0632 L0633 L0634 L0635 L0636 L0637 L0638 L0639 L0640 L0641 
L0642 L0643 L0644 L0645 L0646 L0647 L0648 L0649 L0650 L0651 L0653 L0654 L0656 L0657 L0658 L0659 L0660 L0661 L0662 
L0663 L0664 L0666 L0667 L0669 L0671 L0672 L0674 L0675 L0676 L0677 L0678 L0679 L0680 L0681 L0682 L0683 L0684 L0685 
L0686 L0687 L0688 L0689 L0690 L0691 L0692 L0693 L0694 L0695 L0698 L0699 L0700 L0701 L0703 L0704 L0705 L0706 L0707 
L0708 L0709 L0710 L0711 L0712 L0713 L0714 L0715 L0716 L0717 L0718 L0719 L0720 L0721 L0722 L0723 L0724 L0725 L0726 
L0727 L0728 L0729 L0730 L0731 L0732 L0733 L0734 L0735 L0736 L0737 L0738 L0739 L0740 L0741 L0743 L0744 L0745 L0747 
L0748 L0751 L0752 L0753 L0754 L0755 L0756 L0757 L0758 L0759 L0760 L0761 L0762 L0763 L0764 L0765 L0766 L0767 L0768 
L0769 L0770 L0771 L0773 L0774 L0775 L0776 L0777 L0778 L0779 L0780 L0781 L0782 L0783 L0784 L0785 L0786 L0787 L0788 
L0789 L0790 L0791 L0792 L0793 L0794 L0795 L0796 L0797 L0798 L0799 L0800 L0801 L0802 L0803 L0804 L0805 L0806 L0807 
L0808 L0810 L0811 L0812 L0813 L0814 L0815 L0816 L0817 L0818 L0819 L0820 L0821 L0822 L0823 L0824 L0825 L0826 L0827 
L0828 L0829 L0830 L0831 L0832 L0833 L0834 L0835 L0836 L0837 L0839 L0840 L0841 L0842 L0843 L0844 L0845 L0846 L0847 
L0848 L0849 L0850 L0851 L0852 L0853 L0854 L0856 L0857 L0860 L0861 L0862 L0863 L0865 L0867 L0868 L0869 L0870 L0871 
L0873 L0874 L0875 L0876 L0877 L0878 L0879 L0881 L0882 L0883 L0885 L0886 L0887 L0889 L0890 L0892 L0893 L0894 L0895 
L0896 L0897 L0898 L0899 L0900 L0901 L0903 L0904 L0905 L0906 L0907 L0908 L0909 L0910 L0911 L0912 L0913 L0915 L0916 
L0917 L0918 L0919 L0920 L0921 L0922 L0923 L0924 L0925 L0926 L0927 L0928 L0930 L0931 L0933 L0934 L0935 L0936 L0937 
L0938 L0939 L0941 L0943 L0944 L0945 L0946 L0947 L0948 L0949 L0950 L0951 L0952 L0953 L0954 L0955 L0957 L0958 L0959 
L0960 L0961 L0962 L0963 L0964 L0965 L0966 L0967 L0968 L0969 L0970 L0971 L0972 L0973 L0974 L0975 L0976 L0977 L0978 
L0979 L0980 L0981 L0982 L0983 L0984 L0985 L0986 L0987 L0988 L0989 L0990 L0991 L0992 L0993 L0994 L0995 L0997 L0998 
L0999 L1000 L1001 L1002 L1003 L1004 L1005 L1006 L1007 L1008 L1009 L1010 L1011 L1012 L1013 L1014 L1016 L1017 L1018 
L1019 L1020 L1021 L1022 L1023 L1024 L1025 L1026 L1027 L1028 L1029 L1030 L1031 L1032 L1033 L1034 L1035 L1036 L1037 
L1038 L1039 L1040 L1041 L1042 L1043 L1045 L1046 L1047 L1048 L1049 L1050 L1051 L1052 L1054 L1055 L1056 L1057 L1058 
L1059 L1060 L1061 L1062 L1063 L1065 L1066 L1067 L1068 L1069 L1070 L1071 L1072 L1073 L1074 L1075 L1076 L1077 L1078 
L1079 L1081 L1082 L1083 L1084 L1087 L1088 L1089 L1090 L1091 L1092 L1093 L1094 L1095 L1096 L1097 L1102 L1104 L1106 
L1107 L1108 L1109 L1110 L1111 L1112 L1113 L1114 L1115 L1116 L1117 L1118 L1119 L1120 L1121 L1123 

## Totals
- YES: 70
- PARTLY: 80
- NO: 966
- REMOVE (skipped): 7
- Scored: 1116 of 1123 [counts by command over my decision file]

## Cost covered (YES rows only)

- Minutes stated in YES rows: 80 (L0074, the 80-minute collation stall of lap L013) [read: row text].
- Tokens stated in YES rows: 0.
- YES rows with no minutes or tokens recorded: 69 of 70. Their cost fields hold words only (for example
  'a live gate that cannot fail shipped', 'cost not recorded', 'days of diversity-instrument work voided').
- L0068 carries the same 80 minutes as L0074 and is scored PARTLY, so it is not added again.
- Honest limit: the root covers many rows, but the ledger prices almost none of them in minutes or tokens, so the
  covered cost is small by the recorded figure and says little about the cost not recorded.

## Notes
- Several YES rows are one event seen twice (L0101 and L0102; L0914 and L0956; L0220 and L0222; L0702, L0996 and L1044).
- Some YES rows are not strictly this root: L0702, L0996, L1044, L0089 (gate or copy not installed) are also R02.
- The first live failure of a control cannot have a recorded case yet; where the row is a first occurrence I still
  scored YES when a real artefact existed beforehand (a recorded delivery, a recorded stall, a recorded leak).

## What I did not open
- No primary source behind any row; no other scorer's file; no group file; the plan was read for the question only.
- Costs are from the row's own cost field, not re-derived.
