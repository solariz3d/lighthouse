#!/bin/bash
# run678t2b.sh (pane E, D678 Track 2): Finish (R4), the D9 size (R3, my own probe with D9 applied in wt-mut, then restored), the at-start figures on the tip
# and c2591bf. usage: bash run678t2b.sh
set -u
cd "$(dirname "$0")"
W=G:/consonance-scratch/e-d678/wt-mut; WB=G:/consonance-scratch/e-d678/wt-before; WA=G:/consonance-scratch/e-d678/wt-after; WT=G:/consonance-scratch/e-d678/wt-tip
t() { echo "## $(date -u +%H:%M:%SZ) $*"; }
bash fin678.sh
t D9 size; node -e "const fs=require('fs');const f=process.argv[1];let s=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');const a=process.argv[2],n=s.split(a).length-1;console.log('anchor count',n);if(n!==1)process.exit(3);fs.writeFileSync(f,s.replace(a,()=>process.argv[3]));" $W/src/core/turnby.js "extendBy(doc, opts, aims, true), P0" "({ doc: extendBy(doc, opts, aims), hold: null }), P0" && node var678.js $WB $W f4 f4_d9.json > f4_d9.txt 2>&1; echo "exit $?"; git -C $W checkout -q -- src/core/turnby.js
t restored: $(git -C $W status --short | wc -l) changed files in wt-mut
t atstart tip; node atstart678.js $WT > atstart_tip.txt 2>&1; echo "exit $?"
t atstart c2591bf; node atstart678.js $WA > atstart_c259.txt 2>&1; echo "exit $?"
t done
