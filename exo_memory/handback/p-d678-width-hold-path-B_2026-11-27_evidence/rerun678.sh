#!/bin/bash
# B, D678: the two harnesses touched after the tier (the width-hold harness reads core-width-hold.test.js, which gained the corner list's extra from 10 m for D9;
# core_ramp_mutation's EX12 anchor moved to easedPiece's new line). Under heavy-run at BelowNormal, retrying on exit 3.
cd G:/consonance-scratch/b-hold || exit 2
W=G:/consonance-scratch/b-hold-work/tier
while :; do
  s=$(date +%s); t0=$(date -u +%H:%M:%SZ)
  node C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js --run --priority belownormal --cmd "B D678 width hold path: 2 harnesses re-run (width hold, ramp) (not a timing session)" -- node --max-old-space-size=4096 --test --test-concurrency=1 --test-reporter=tap test/core_width_hold_mutation.test.js test/core_ramp_mutation.test.js > "$W/rerun-harnesses.tap" 2> "$W/rerun-harnesses.err"
  rc=$?; echo "rerun-harnesses: exit $rc, $(( $(date +%s)-s )) s, $t0 to $(date -u +%H:%M:%SZ)" >> "$W/rerun678.log"
  [ $rc -ne 3 ] && break; sleep 60
done
echo done >> "$W/rerun678.log"
