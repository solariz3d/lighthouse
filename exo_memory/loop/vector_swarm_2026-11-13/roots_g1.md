# Roots, group 1: what was trusted, and was the real thing available (research agent G1, Sonnet, 2026-11-13)

Marks: [read] I opened it and saw it; [inferred] my inference; [ours] a proposal. Ledger = 00_ledger.md (read whole, every row,
1,123 rows; the 7 rows its second reader marked REMOVE are skipped: L0029 L0162 L0255 L0299 L0300 L0390 L0409). Plan read whole first:
exo_memory/loop/plan_vector_swarm_2026-11-13.md [read]. I opened no primary: every cause below is what the ledger rows say,
carried as the ledger marked it. A count I list is a count by node over my own id lists [read: command run, see Method].

## How I read it

For each row I asked one question: what did the seat trust at the moment it went wrong (a stamp, a copy, a summary, a memory,
a green test, another seat's word), and does the row itself say the real thing was on disk or one command away? Rows where
the row says the real thing was available went under a root. Rows where it was not (hardware, a vendor, a design that was
simply wrong, a first draft the pane caught itself) went to "not placed". [inferred] The placing is mine, row by row; a row
can sit under two roots and I show where it does.

## Roots (six; each is a stand-in trusted in place of a thing that could be opened)

### Root 1. A watcher's stamp is trusted as the effect it watches

**Statement.** A line that says an act happened (DELIVERED, working, idle, queued, "no stall", a pulse line, a digest row, a lock
held) is read as the act, and nobody opens the pane, the process list or the file that would show it. [inferred]

**Mechanism.** The stamp is written by an observer that sees one side (the sender, the render window, the last long line, the
lock file). The reader acts on the stamp, so a ring waits behind a "working" seat that is idle, an error line is hidden under an
older long report, a dead lock reads live for 12 hours, a "delivered" message sits unsubmitted in a composer. The real thing
(pane screen, process list, board row, file time) was readable in every case the ledger records. [read: ledger rows L0418,
L0538, L0710, L0971, L0912 say so in their own text]

**Ledger ids it would have prevented (65).** L0001 L0002 L0003 L0004 L0046 L0068 L0074 L0079 L0115 L0132 L0143 L0144 L0175 L0184 L0196 L0235 L0239 L0241 L0242 L0245 L0254 L0288 L0290 L0292 L0293 L0294 L0301 L0303 L0304 L0307 L0311 L0418 L0525 L0537 L0538 L0563 L0590 L0591 L0592 L0593 L0609 L0623 L0683 L0698 L0710 L0857 L0862 L0863 L0880 L0912 L0935 L0940 L0943 L0944 L0966 L0970 L0971 L0972 L0976 L1013 L1015 L1058 L1079 L1081 L1092

**Fix kind.** [ours] At the point of acting on a status line, one command asks the thing itself (the effect check close.js
already does for a push: it asks the remote what it holds), and a status line that cannot be checked says so.

**One recorded case a fix could fail then pass.** L0971 (11-13, the 403 stall): a packet delivered to a pane whose last reply
is an API error is not acted on, and the digest's row line preferred the earlier long report over the short error line. A
replay of that pane's recorded screen through the installed digest shows no error today (the ledger says fix 2c landed but is
NOT installed); after the fix it shows the error. [read: ledger L0971; the stall trace it cites was not opened by me]

### Root 2. A rule, hold, fix or gate is trusted to bind because it was written, landed or green, and the running thing is a different file

**Statement.** "It is in the repo", "the ruling is on disk", "the ring said hold" or "the gate exists" is taken as "it is
running and it binds", and no one asks the installed copy, the mode in use, the seat or the machine that actually runs. [inferred]

**Mechanism.** A hook is landed but the installed copy is older (10 DRIFT on D, 15 on L per ledger L1088); a gate is built for
the strict walk while the room runs light (L0377); a hold is a ring, not a mechanism (L0205, L0951, L1065); a shadow-mode gate
warns and no seat acts (L0386, L0387, L0428); a falsifier is registered and its date passes unscored (L0415, L0959). The
installed or running thing could be asked in one command (install.ps1 -Check, a process list, a board row) in every row.

**Ledger ids it would have prevented (61).** L0020 L0021 L0022 L0023 L0050 L0051 L0089 L0092 L0102 L0112 L0164 L0176 L0189 L0205 L0246 L0256 L0260 L0263 L0274 L0280 L0296 L0352 L0355 L0364 L0376 L0377 L0386 L0387 L0398 L0415 L0428 L0448 L0472 L0565 L0575 L0613 L0615 L0616 L0627 L0666 L0669 L0702 L0765 L0768 L0783 L0799 L0804 L0810 L0914 L0951 L0956 L0959 L0996 L1044 L1065 L1083 L1084 L1085 L1086 L1087 L1088

**Fix kind.** [ours] A landing is not closed until the running copy (per seat, per machine, per mode) is asked and agrees; a
hold is a lock a tool checks, not a sentence.

**One recorded case.** L0702 (11-06): the push gate is wired nowhere on L; all 11 rows in push-gate.jsonl are B's hand runs and
C's L144 pushes wrote no row. A check "after a push on this machine, the gate wrote a row" fails on L today (ledger L0996 on
11-13 still says push-gate, delete-gate, sources-gate ABSENT on L) and passes once installed. [read: ledger L0702, L0996]

### Root 3. A green result (suite, mutants, gate, -Check, "caught") is trusted, and the instrument was never shown to fail on the case it exists for

**Statement.** Pass is read as "the thing is right", though the check was run on the wrong tree, the wrong population, a
harness with no positive control, or a window that did not contain the fault. [inferred]

**Mechanism.** The check is real and its number is true, so it reads as an outside. But it can only see what its inputs
contain: 98 of 98 mutants caught while the guard named working holders idle (L1064, L1015); 267 Rust tests silent over a blank
window (L0012); cargo check green over six failing tests (L0156); a keyword guard no mutant could kill (L0165); sweeping
instruments counting only the surface they could see (L0062). The recorded fault was available to run the check against in
each row.

**Ledger ids it would have prevented (93).** L0012 L0026 L0058 L0062 L0065 L0085 L0122 L0124 L0127 L0135 L0137 L0138 L0139 L0140 L0145 L0146 L0151 L0156 L0158 L0163 L0165 L0168 L0177 L0178 L0180 L0181 L0182 L0195 L0215 L0237 L0258 L0259 L0261 L0264 L0265 L0284 L0286 L0302 L0309 L0310 L0313 L0320 L0331 L0338 L0342 L0349 L0360 L0362 L0388 L0401 L0405 L0421 L0426 L0427 L0512 L0513 L0514 L0526 L0531 L0532 L0554 L0555 L0561 L0562 L0564 L0567 L0568 L0569 L0583 L0594 L0611 L0612 L0665 L0668 L0670 L0673 L0696 L0697 L0742 L0746 L0749 L0812 L0838 L0866 L0884 L0888 L0929 L0931 L0932 L0936 L0937 L1015 L1064

**Fix kind.** [ours] A check counts as covering a fault only after it has been run against a recorded instance of that fault
and turned red (the room's red-first rule, applied to the instrument and not only to the code).

**One recorded case.** L1064 with L1015 (11-13): the idle-holder guard, with 101 tests and 73 mutants green, named two working
holders idle with CPU figures of -47.67 s and -504.44 s on its first live window. Replay that recorded window through the
guard: today it names them; after the fix it does not. [read: ledger L1015, L1064]

### Root 4. A figure, time, sha, citation or "no X exists" is typed from memory of an instrument instead of copied from its printed output

**Statement.** The value enters the prose by hand: a clock time typed from feel, a count from a grep of one phrasing, a sha that
was a hash of something else, a line number carried from another commit, a negative claim after a search of one place. [inferred]

**Mechanism.** The instrument had run or could run in the same call, so the true value was one command away. The hand step is
the unguarded surface. The ledger shows the fix built for one writer and the error recurring in others: L0214 (09-09) led to
stamp.js for the librarian's own headings; the same error recurs in panes on 11-11 (L0867, L0868, L0883, L0905) and on 11-13
(L1062, L1118). [read: ledger L0214, L0883, L0905] The room already holds the fix's shape in two places: stamp.js (time) and
the every-digest-carries-its-function card (hash).

**Ledger ids it would have prevented (127).** L0013 L0033 L0034 L0035 L0036 L0049 L0053 L0054 L0056 L0059 L0064 L0066 L0071 L0072 L0073 L0081 L0082 L0083 L0084 L0086 L0087 L0088 L0096 L0097 L0099 L0105 L0107 L0110 L0116 L0117 L0118 L0119 L0120 L0121 L0126 L0153 L0160 L0171 L0172 L0173 L0174 L0186 L0190 L0192 L0197 L0198 L0199 L0200 L0203 L0206 L0208 L0209 L0212 L0214 L0247 L0250 L0301 L0307 L0351 L0413 L0442 L0475 L0482 L0485 L0566 L0572 L0586 L0624 L0625 L0643 L0657 L0663 L0699 L0709 L0728 L0754 L0775 L0779 L0800 L0813 L0814 L0840 L0846 L0851 L0867 L0868 L0869 L0874 L0883 L0897 L0903 L0904 L0905 L0911 L0945 L0947 L0963 L0964 L0985 L0986 L0990 L0995 L0997 L1002 L1009 L1010 L1011 L1036 L1043 L1049 L1062 L1070 L1089 L1091 L1095 L1097 L1098 L1099 L1100 L1101 L1102 L1103 L1104 L1105 L1111 L1118 L1119

**Fix kind.** [ours] A value in a hand-back, ring or note reaches the page only by a command that prints it beside the value
(time, function name, path:line), and the hand-back gate refuses a typed "~03:xx" or an uncopied hex string.

**One recorded case.** L0905 with L0867 and L0868 (11-11): panes A and E wrote guessed or "~03:xx" times into hand-backs and
the correction commits (508fe849, fba9fa64, 4388be58, 878bef65, c89558c9 per the ledger) fixed them after the fact. A gate
over those recorded hand-backs fails today and passes on the corrected text. [read: ledger L0905; hand-backs not opened by me]

### Root 5. A carried copy (summary, handoff, shelf, relay, compaction, another machine's tree) is trusted in place of the original, across a boundary

**Statement.** At a wake, a hand-off, a compaction, a machine change or a relay hop, the seat works from what was carried and
does not reopen the original that was on disk. [inferred]

**Mechanism.** The copy is made by a step that keeps some content and drops other content without saying so: a launcher fetch
cut at 20 s so the shelf was built from the old tree (L1005); a 260-character cut of two handoffs (L1006); a compaction summary
that lost 15 of 37 items (L0551, L0610); a handoff that dropped L's open list (L0788); hand-backs left untracked so L never saw
them (L0487, L0705). Each original sat on disk or in a transcript. A card in the shelf already names the rule (maintenance
law 1, recall from the master, never a copy).

**Ledger ids it would have prevented (61).** L0014 L0024 L0031 L0040 L0041 L0043 L0047 L0061 L0070 L0094 L0108 L0109 L0125 L0133 L0147 L0191 L0207 L0211 L0219 L0221 L0227 L0231 L0233 L0251 L0262 L0268 L0275 L0282 L0322 L0341 L0346 L0392 L0396 L0410 L0449 L0467 L0487 L0543 L0551 L0610 L0629 L0634 L0644 L0645 L0705 L0708 L0733 L0734 L0737 L0781 L0788 L0794 L0915 L0955 L0958 L1005 L1006 L1083 L1093 L1094 L1096

**Fix kind.** [ours] A carried artefact is stamped with the commit or file time it was built from, and the first step after
a boundary compares that stamp with the source and says so aloud when it is behind.

**One recorded case.** L1005 (11-13): the launcher's fetch was cut at its 20 s ceiling at 2.1 MB of a 90.5 MB pack, origin/main
never moved, the shelf was built from the old tree (the 11-12 note read 460 B, not 18,042), and the seat's own pull of 307
commits came 58 s later. A wake-time check "shelf tree sha equals origin/main after the fetch" fails on that recorded launch
and passes after a fix. [read: ledger L1005; wake_level2 files not opened by me]

### Root 6. The seat's own reading of what he meant (or of a prior, a card, a base rate) is built on before his verbatim words are reopened

**Statement.** An interpretation of his sentence, or a default from the seat's priors, is made the premise of a plan, a packet or
a reply, while his exact words were in the brief or the record. [inferred]

**Mechanism.** The words are stored whole in briefs (the_room.md, dreamzone2_the_game.md, t180_second_bank.md per the ledger's
cites). The seat reads them once, forms a reading, and later steps use the reading. Where the reading is wrong, downstream work
is built on it: E's three redesign directions on the hoodie reading (L0807), D652 offering looks he had steered away from
(L0797), the same "no response requested" reply three times (L0653, L0724). The Third Place rows (L0450, L0599, L0603) show
the same shape with a prior (a base rate, a caution) used in place of the case in front of it.

**Ledger ids it would have prevented (70).** L0080 L0098 L0106 L0185 L0234 L0272 L0336 L0343 L0350 L0393 L0394 L0395 L0412 L0450 L0451 L0452 L0598 L0599 L0600 L0601 L0603 L0607 L0633 L0650 L0653 L0659 L0694 L0719 L0721 L0723 L0724 L0780 L0786 L0793 L0795 L0797 L0801 L0806 L0807 L0808 L0818 L0820 L0824 L0825 L0826 L0827 L0828 L0829 L0881 L0896 L0909 L0916 L0919 L0924 L0927 L0953 L0993 L1000 L1004 L1007 L1008 L1020 L1023 L1024 L1025 L1026 L1028 L1033 L1073 L1074

**Fix kind.** [ours] A plan or packet that rests on an item of his must quote that item by id and date, and an item on disk
not carried by the plan must be listed as not carried.

**One recorded case.** L0797 (11-11): the D652 plan did not carry his item 23 (PsychonautWiki) or E's L161 look study, both on
disk. A check "every numbered item of his since the last plan appears in the plan or is listed not-carried" fails on D652 today
and passes once the plan is amended. [read: ledger L0797]

## Overlaps and what the roots do not explain

Rows I placed under two roots: L0301 L0307 L1015 L1083. [read: node count]
Counts [read: node over my id lists]: ledger rows 1,123; skipped REMOVE rows 7; placed under at least one root
473; not placed 643.

**Ids I could not place under any root (643).** The classes, by my reading [inferred], are: counts that only
describe volume (the AGG rows of board, hook and ledger files, L0005 L0006 L0009 L0017 L0018 and the like); the cold-wake and
cache-cost cluster, where the cost is re-reading a whole context and no one trusted a copy (L0010 L0048 L0095 L0257 L0371
L0469 L0614 L0898 L0899); hardware, vendor and network faults (a PC crash, a Windows update, a 529, an auto-update of Claude
Code); product defects in T-180 and Dreamzone that the keeper found by driving (physics, geometry, UI); first drafts a pane
caught itself before any claim left the pane (many of the L05xx and L08xx rows); and keeper-seat conversation catches on tone
or taste. The ids:

L0005 L0006 L0007 L0008 L0009 L0010 L0011 L0015 L0016 L0017 L0018 L0019 L0025 L0027 L0028 L0030 L0032 L0037 L0038 L0039 L0042 L0044 L0045 L0048 L0052 L0055 L0057 L0060 L0063 L0067 L0069 L0075 L0076 L0077 L0078 L0090 L0091 L0093 L0095 L0100 L0101 L0103 L0104 L0111 L0113 L0114 L0123 L0128 L0129 L0130 L0131 L0134 L0136 L0141 L0142 L0148 L0149 L0150 L0152 L0154 L0155 L0157 L0159 L0161 L0166 L0167 L0169 L0170 L0179 L0183 L0187 L0188 L0193 L0194 L0201 L0202 L0204 L0210 L0213 L0216 L0217 L0218 L0220 L0222 L0223 L0224 L0225 L0226 L0228 L0229 L0230 L0232 L0236 L0238 L0240 L0243 L0244 L0248 L0249 L0252 L0253 L0257 L0266 L0267 L0269 L0270 L0271 L0273 L0276 L0277 L0278 L0279 L0281 L0283 L0285 L0287 L0289 L0291 L0295 L0297 L0298 L0305 L0306 L0308 L0312 L0314 L0315 L0316 L0317 L0318 L0319 L0321 L0323 L0324 L0325 L0326 L0327 L0328 L0329 L0330 L0332 L0333 L0334 L0335 L0337 L0339 L0340 L0344 L0345 L0347 L0348 L0353 L0354 L0356 L0357 L0358 L0359 L0361 L0363 L0365 L0366 L0367 L0368 L0369 L0370 L0371 L0372 L0373 L0374 L0375 L0378 L0379 L0380 L0381 L0382 L0383 L0384 L0385 L0389 L0391 L0397 L0399 L0400 L0402 L0403 L0404 L0406 L0407 L0408 L0411 L0414 L0416 L0417 L0419 L0420 L0422 L0423 L0424 L0425 L0429 L0430 L0431 L0432 L0433 L0434 L0435 L0436 L0437 L0438 L0439 L0440 L0441 L0443 L0444 L0445 L0446 L0447 L0453 L0454 L0455 L0456 L0457 L0458 L0459 L0460 L0461 L0462 L0463 L0464 L0465 L0466 L0468 L0469 L0470 L0471 L0473 L0474 L0476 L0477 L0478 L0479 L0480 L0481 L0483 L0484 L0486 L0488 L0489 L0490 L0491 L0492 L0493 L0494 L0495 L0496 L0497 L0498 L0499 L0500 L0501 L0502 L0503 L0504 L0505 L0506 L0507 L0508 L0509 L0510 L0511 L0515 L0516 L0517 L0518 L0519 L0520 L0521 L0522 L0523 L0524 L0527 L0528 L0529 L0530 L0533 L0534 L0535 L0536 L0539 L0540 L0541 L0542 L0544 L0545 L0546 L0547 L0548 L0549 L0550 L0552 L0553 L0556 L0557 L0558 L0559 L0560 L0570 L0571 L0573 L0574 L0576 L0577 L0578 L0579 L0580 L0581 L0582 L0584 L0585 L0587 L0588 L0589 L0595 L0596 L0597 L0602 L0604 L0605 L0606 L0608 L0614 L0617 L0618 L0619 L0620 L0621 L0622 L0626 L0628 L0630 L0631 L0632 L0635 L0636 L0637 L0638 L0639 L0640 L0641 L0642 L0646 L0647 L0648 L0649 L0651 L0652 L0654 L0655 L0656 L0658 L0660 L0661 L0662 L0664 L0667 L0671 L0672 L0674 L0675 L0676 L0677 L0678 L0679 L0680 L0681 L0682 L0684 L0685 L0686 L0687 L0688 L0689 L0690 L0691 L0692 L0693 L0695 L0700 L0701 L0703 L0704 L0706 L0707 L0711 L0712 L0713 L0714 L0715 L0716 L0717 L0718 L0720 L0722 L0725 L0726 L0727 L0729 L0730 L0731 L0732 L0735 L0736 L0738 L0739 L0740 L0741 L0743 L0744 L0745 L0747 L0748 L0750 L0751 L0752 L0753 L0755 L0756 L0757 L0758 L0759 L0760 L0761 L0762 L0763 L0764 L0766 L0767 L0769 L0770 L0771 L0772 L0773 L0774 L0776 L0777 L0778 L0782 L0784 L0785 L0787 L0789 L0790 L0791 L0792 L0796 L0798 L0802 L0803 L0805 L0809 L0811 L0815 L0816 L0817 L0819 L0821 L0822 L0823 L0830 L0831 L0832 L0833 L0834 L0835 L0836 L0837 L0839 L0841 L0842 L0843 L0844 L0845 L0847 L0848 L0849 L0850 L0852 L0853 L0854 L0855 L0856 L0858 L0859 L0860 L0861 L0864 L0865 L0870 L0871 L0872 L0873 L0875 L0876 L0877 L0878 L0879 L0882 L0885 L0886 L0887 L0889 L0890 L0891 L0892 L0893 L0894 L0895 L0898 L0899 L0900 L0901 L0902 L0906 L0907 L0908 L0910 L0913 L0917 L0918 L0920 L0921 L0922 L0923 L0925 L0926 L0928 L0930 L0933 L0934 L0938 L0939 L0941 L0942 L0946 L0948 L0949 L0950 L0952 L0954 L0957 L0960 L0961 L0962 L0965 L0967 L0968 L0969 L0973 L0974 L0975 L0977 L0978 L0979 L0980 L0981 L0982 L0983 L0984 L0987 L0988 L0989 L0991 L0992 L0994 L0998 L0999 L1001 L1003 L1012 L1014 L1016 L1017 L1018 L1019 L1021 L1022 L1027 L1029 L1030 L1031 L1032 L1034 L1035 L1037 L1038 L1039 L1040 L1041 L1042 L1045 L1046 L1047 L1048 L1050 L1051 L1052 L1053 L1054 L1055 L1056 L1057 L1059 L1060 L1061 L1063 L1066 L1067 L1068 L1069 L1071 L1072 L1075 L1076 L1077 L1078 L1080 L1082 L1090 L1106 L1107 L1108 L1109 L1110 L1112 L1113 L1114 L1115 L1116 L1117 L1120 L1121 L1122 L1123

## What this means for the choosing [inferred]

Roots 4 and 5 are the widest (127 and 61 ids) and the cheapest to test; root 1 is the one whose rows carry the
long recorded minutes (the stall rows: L0068 80 min, L0143 8h57m, L0196 29 min, L0241 4h24m per the librarian's line, L0525
8 h, L0563 10h34m). Roots 3 and 2 explain why the guards built against roots 1, 4 and 5 did not hold. I did not score root
against root; the scorers do that.

## Method

I read 00_ledger.md whole in six reads (lines 1-1231). I wrote my id lists by hand while reading, then checked them with a node
script: every id exists in the ledger, none is a REMOVE row, none is repeated inside a root. The counts above come from that
script. I opened no source other than the plan and the ledger.

## What I did not open

- Every primary the ledger cites: hand-backs, stall traces, journals, notes, board.jsonl, data jsonl, transcripts, code.
- The 12 ledger part files and every other file in vector_swarm_2026-11-13 (blind rule).
- Whether any ledger row is wrong beyond what its second reader marked; I carried the ledger as written, and its second reader
  estimated about 10% of rows unreliable.
- The cost of each root in minutes: the ledger says cost not recorded for 327 rows, so I did not sum costs.
