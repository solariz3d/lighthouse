#!/bin/bash
# B, D678 ruling 1, F-3: row3_678.js (level heads and his copies, Extend and Turn by) and finbytes678.js (Finish on his copies), the try against 346e2a0,
# under heavy-run at BelowNormal, retrying on exit 3.
W=G:/consonance-scratch/b-hold-work; C=G:/consonance-scratch/b-wr-work/tracks
cd $W || exit 2
for step in row3 finbytes; do
  case $step in row3) prog="node row3_678.js G:/consonance-scratch/b-hold G:/consonance-scratch/b-hold-346e2a0 $C";; finbytes) prog="node finbytes678.js G:/consonance-scratch/b-hold G:/consonance-scratch/b-hold-346e2a0 $C";; esac
  while :; do
    s=$(date +%s); t0=$(date -u +%H:%M:%SZ)
    node C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js --run --priority belownormal --cmd "B D678 ruling 1: Finish bytes, $step, the try against 346e2a0 (not a timing session)" -- $prog > r1try/f3_$step.txt 2> r1try/f3_$step.err
    rc=$?; echo "$step: exit $rc, $(( $(date +%s)-s )) s, $t0 to $(date -u +%H:%M:%SZ)" >> r1try/f3run.log
    [ $rc -ne 3 ] && break; sleep 60
  done
done
echo done >> r1try/f3run.log
