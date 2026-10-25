#!/bin/sh
stamp() { date -u +%H:%M:%SZ; }
# run1b.sh (C, D456 part 1b): the touched test files, then the full suite, on f217110; each under one heavy-run slot, BelowNormal, TAP.
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d456"; WT="C:/Users/nname/Downloads/t180-wt-pub0419"
cd "$WT" || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000
SKIP='Twist on a 1-piece window|Grab, r = 200 m across three pieces|Bend on a 10 km CLOSED lap|no frame or task over 120 ms during it or for 10 s after'
echo "touched: head $(git rev-parse --short HEAD) files $(wc -l < "$O/1b-tests.txt") $(date -u +%H:%M:%SZ)"
node "$O/belownormal.js" node "$O/lockrun.js" "C D456 1b touched tests" node --test --test-concurrency=4 --test-skip-pattern="$SKIP" --test-reporter=tap --test-reporter-destination="$O/touched1b.tap" $(tr '\n' ' ' < "$O/1b-tests.txt") > "$O/touched1b.out" 2>&1
echo "touched exit $?: $(grep -E '^# (tests|pass|fail|skipped|todo)' "$O/touched1b.tap" | tr '\n' ' ') $(date -u +%H:%M:%SZ)"
grep -E '^\s*not ok' "$O/touched1b.tap" | grep -v TODO | cut -c1-150
echo "full: head $(git rev-parse --short HEAD) changed=[$(git status --short | wc -l)] $(stamp)"
s=$(date +%s)
node "$O/belownormal.js" node "$O/lockrun.js" "C pub-0.4.19 + 1b full suite (D456 1b, BelowNormal)" node --test --test-concurrency=4 --test-skip-pattern="$SKIP" --test-reporter=spec --test-reporter-destination=stdout --test-reporter=tap --test-reporter-destination="$O/suite1b.tap" "test/*.test.js" "app/test/*.test.js" > "$O/suite1b.out" 2>&1; rc=$?
echo "suite exit $rc, $(( $(date +%s)-s )) s: $(sed 's/\x1b\[[0-9;]*m//g' "$O/suite1b.out" | grep -E '^ℹ (tests|pass|fail|cancelled|skipped|todo)' | tr '\n' ' ') $(stamp)"
echo "suite non-TODO not ok rows: $(grep -E '^\s*not ok' "$O/suite1b.tap" | grep -vc TODO)"
grep -E '^\s*not ok' "$O/suite1b.tap" | grep -v TODO | cut -c1-150
echo "EXPO (3221225477) lines in TAP: $(grep -c 3221225477 "$O/suite1b.tap")"
echo "after suite: changed=[$(git status --short | wc -l)] $(stamp)"
