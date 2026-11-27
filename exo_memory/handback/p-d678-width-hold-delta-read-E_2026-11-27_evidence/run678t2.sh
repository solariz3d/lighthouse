#!/bin/bash
# run678t2.sh (pane E, D678 Track 2): every measuring run of the delta read, in order, one process at a time. usage: bash run678t2.sh
set -u
cd "$(dirname "$0")"
WB=G:/consonance-scratch/e-d678/wt-before; WA=G:/consonance-scratch/e-d678/wt-after; WT=G:/consonance-scratch/e-d678/wt-tip
t() { echo "## $(date -u +%H:%M:%SZ) $*"; }
t P1b ripple268 on the tip; node ripple268.js $WT p1_tip.json > p1_tip.txt 2>&1; echo "exit $?"
t d678 on the tip; node d678.js $WT d678_tip.json > d678_tip.log 2>&1; echo "exit $?"
t delta P1 control e112a14 vs c2591bf; node delta678.js d678_before.json d678_after.json > delta_control.txt 2>&1; echo "exit $?"
t delta c2591bf vs tip; node delta678.js d678_after.json d678_tip.json > delta678.txt 2>&1; echo "exit $?"
t f4 tip; node var678.js $WB $WT f4 f4_tip.json > f4_tip.txt 2>&1; echo "exit $?"
t f4 control c2591bf; node var678.js $WB $WA f4 f4_c259.json > f4_c259.txt 2>&1; echo "exit $?"
t var tip; node var678.js $WB $WT var var_tip.json $WA > var_tip.txt 2>&1; echo "exit $?"
t var control c2591bf; node var678.js $WB $WA var var_c259.json > var_c259.txt 2>&1; echo "exit $?"
t chan678 e112a14 vs tip; node chan678.js $WB $WT > chan678_tip.txt 2>&1; echo "exit $?"
t endpos678 e112a14 vs tip; node endpos678.js $WB $WT > endpos678_tip.txt 2>&1; echo "exit $?"
t done
