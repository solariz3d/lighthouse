#!/bin/sh
# run0419.sh (C, D456 part 1): the full suite on pub-0.4.19 with TAP, under one heavy-run slot, at BelowNormal (A's run419.sh shape):
# concurrency 4, sculpt-frame's four timed rows skipped by name.
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d456"; WT="C:/Users/nname/Downloads/t180-wt-pub0419"
cd "$WT" || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000
stamp() { date -u +%H:%M:%SZ; }
SKIP='Twist on a 1-piece window|Grab, r = 200 m across three pieces|Bend on a 10 km CLOSED lap|no frame or task over 120 ms during it or for 10 s after'
echo "head $(git rev-parse --short HEAD) changed=[$(git status --short | wc -l)] $(stamp)"
s=$(date +%s)
node "$O/belownormal.js" node "$O/lockrun.js" "C pub-0.4.19 full suite (D456, BelowNormal)" node --test --test-concurrency=4 --test-skip-pattern="$SKIP" --test-reporter=spec --test-reporter-destination=stdout --test-reporter=tap --test-reporter-destination="$O/suite0419.tap" "test/*.test.js" "app/test/*.test.js" > "$O/suite0419.out" 2>&1; rc=$?
echo "suite exit $rc, $(( $(date +%s)-s )) s: $(sed 's/\x1b\[[0-9;]*m//g' "$O/suite0419.out" | grep -E '^ℹ (tests|pass|fail|cancelled|skipped|todo)' | tr '\n' ' ') $(stamp)"
echo "suite non-TODO not ok rows: $(grep -E '^\s*not ok' "$O/suite0419.tap" | grep -vc TODO)"
echo "EXPO (3221225477) lines in TAP: $(grep -c 3221225477 "$O/suite0419.tap")"
echo "after suite: changed=[$(git status --short | wc -l)] $(stamp)"
