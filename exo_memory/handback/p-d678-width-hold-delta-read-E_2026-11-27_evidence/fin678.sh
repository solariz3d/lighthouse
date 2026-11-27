#!/bin/bash
# fin678.sh (pane E, D678 Track 2, R4): fin678.js on the tip, c2591bf and e112a14, one at a time. usage: bash fin678.sh
set -u
cd "$(dirname "$0")"
for p in tip:G:/consonance-scratch/e-d678/wt-tip c259:G:/consonance-scratch/e-d678/wt-after e112:G:/consonance-scratch/e-d678/wt-before; do
  n=${p%%:*}; d=${p#*:}; echo "## $(date -u +%H:%M:%SZ) fin678 $n"; node fin678.js $d fin_$n.json > fin_$n.txt 2>&1; echo "exit $?"
done
echo "## $(date -u +%H:%M:%SZ) done"
