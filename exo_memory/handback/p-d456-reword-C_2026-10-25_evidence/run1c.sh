#!/bin/sh
# run1c.sh (C, D456 part 1c): the squashed tip's touched test files (1b's 96 plus the validator, validate-ui, fromwords, seal and tube files), one heavy-run slot, BelowNormal, TAP.
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d456"; WT="C:/Users/nname/Downloads/t180-wt-pub0419"
cd "$WT" || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000
SKIP='Twist on a 1-piece window|Grab, r = 200 m across three pieces|Bend on a 10 km CLOSED lap|no frame or task over 120 ms during it or for 10 s after'
echo "touched: head $(git rev-parse --short HEAD) files $(wc -l < "$O/1c-tests.txt") changed=[$(git status --short | wc -l)] $(date -u +%H:%M:%SZ)"
node "$O/belownormal.js" node "$O/lockrun.js" "C D456 1c touched tests" node --test --test-concurrency=4 --test-skip-pattern="$SKIP" --test-reporter=tap --test-reporter-destination="$O/touched1c.tap" $(tr '\n' ' ' < "$O/1c-tests.txt") > "$O/touched1c.out" 2>&1
echo "touched exit $?: $(grep -E '^# (tests|pass|fail|skipped|todo)' "$O/touched1c.tap" | tr '\n' ' ') $(date -u +%H:%M:%SZ)"
grep -E '^\s*not ok' "$O/touched1c.tap" | grep -v TODO | cut -c1-150
echo "EXPO (3221225477) lines: $(grep -c 3221225477 "$O/touched1c.tap"); after: changed=[$(git status --short | wc -l)]"
