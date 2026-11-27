#!/bin/bash
# B, D678 Track 1: the tier on the repair, under heavy-run at BelowNormal (retrying while heavy-run gives up waiting, exit 3): the 194 files that execute
# extend.js (L262's rule; turnby.js requires extend.js), then the 9 mutation harnesses that name extend.js or turnby.js (core_turnby_mutation added 17:5x: turnby.js changed too). TAP to this folder; one line per run to tier678.log.
cd G:/consonance-scratch/b-hold || exit 2
W=G:/consonance-scratch/b-hold-work/tier
run() { # name cmd-label args...
  local name=$1 label=$2; shift 2
  while :; do
    local t0=$(date -u +%Y-%m-%dT%H:%M:%SZ) s=$(date +%s)
    node C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js --run --priority belownormal --cmd "$label" -- "$@" > "$W/$name.tap" 2> "$W/$name.err"
    local rc=$?; echo "$name: exit $rc, $(( $(date +%s)-s )) s, $t0 to $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$W/tier678.log"
    [ $rc -ne 3 ] && return $rc
    sleep 60
  done
}
run tier-rows "B D678 width hold path: the 194 files that execute extend.js (not a timing session)" node --test --test-concurrency=4 --test-reporter=tap $(cat $W/rows-files.txt)
run tier-harnesses "B D678 width hold path: the 9 mutation harnesses naming extend.js or turnby.js (not a timing session)" node --max-old-space-size=4096 --test --test-concurrency=1 --test-reporter=tap $(cat $W/harness-files.txt)
echo done >> "$W/tier678.log"
