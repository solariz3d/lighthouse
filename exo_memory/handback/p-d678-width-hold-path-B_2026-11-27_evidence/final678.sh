#!/bin/bash
# B, D678: every row instrument again on the final code (the reset line removed after the first runs). Scripts only, read-only on the trees.
cd G:/consonance-scratch/b-hold-work || exit 2
E="C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d678-ripple-read-E_2026-11-27_evidence"
log() { echo "$(date -u +%H:%M:%SZ) $*" >> final678.log; }
log start
node row1_678.js G:/consonance-scratch/b-hold G:/consonance-scratch/b-hold-e112a14 finish > final_row1.txt 2>&1; log "row1 exit $?"
node heads678.js G:/consonance-scratch/b-hold > final_heads.txt 2>&1; log "heads exit $?"
node fin678.js G:/consonance-scratch/b-hold > final_fin.txt 2>&1; log "fin exit $?"
node ripple268w.js G:/consonance-scratch/b-hold final_r268.json > final_r268.txt 2>&1; log "ripple268w exit $?"
node row3_678.js G:/consonance-scratch/b-hold G:/consonance-scratch/b-hold-c522ea6 G:/consonance-scratch/b-wr-work/tracks > final_row3.txt 2>&1; log "row3 exit $?"
node G:/consonance-scratch/b-wr-work/bytes.cjs G:/consonance-scratch/b-hold G:/consonance-scratch/b-wr-work final_bytes.json > final_bytes.txt 2>&1; log "bytes exit $?"
node sharphold678.js G:/consonance-scratch/b-hold > final_sharphold.txt 2>&1; log "sharphold exit $?"
node closew678.js G:/consonance-scratch/b-hold > final_closew.txt 2>&1; log "closew exit $?"
E678_LENGTHS=10,15,20,30,50,100,200 node "$E/short678.js" G:/consonance-scratch/b-hold 1 > final_short.txt 2>&1; log "short exit $?"
node "$E/d678.js" G:/consonance-scratch/b-hold final_d678.json > final_d678.log 2>&1; log "d678 exit $?"
node "$E/cmp678.js" d678_c259.json final_d678.json > final_cmp678.txt 2>&1; log "cmp678 exit $?"
node resetstep678.js G:/consonance-scratch/b-hold > final_resetstep.txt 2>&1; log "resetstep exit $?"
log done
