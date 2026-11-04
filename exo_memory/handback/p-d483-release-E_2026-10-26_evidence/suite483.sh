#!/bin/sh
# suite483.sh (E, D483; from A's suite470.sh): the full suite on the 0.4.22 tip (t180 rel-0.4.22), BelowNormal, one heavy-run slot via gate.js, TAP, SWEEP_SEEDS=60, every mutation harness whole, nothing skipped.
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d483"; WT="C:/Users/nname/Downloads/t180-wt-e483"
cd "$WT" || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000 SWEEP_SEEDS=60
stamp() { date -u +%H:%M:%SZ; }
echo "head $(git rev-parse --short HEAD) changed=[$(git status --short | wc -l)] SWEEP_SEEDS=$SWEEP_SEEDS $(stamp)"
s=$(date +%s)
node "$O/belownormal.js" node C:/Users/nname/Downloads/t180-d421-e/gate.js "E D483 t180 rel-0.4.22 full suite on $(git rev-parse --short HEAD) (BelowNormal, SWEEP_SEEDS=60)" node --test --test-concurrency=4 --test-reporter=spec --test-reporter-destination=stdout --test-reporter=tap --test-reporter-destination="$O/suite483.tap" "test/*.test.js" "app/test/*.test.js" > "$O/suite483.out" 2>&1; rc=$?
echo "suite exit $rc, $(( $(date +%s)-s )) s: $(sed 's/\x1b\[[0-9;]*m//g' "$O/suite483.out" | grep -E '^ℹ (tests|pass|fail|cancelled|skipped|todo)' | tr '\n' ' ') $(stamp)"
echo "suite non-TODO not ok rows: $(grep -E '^\s*not ok' "$O/suite483.tap" | grep -vc TODO)"
grep -E '^\s*not ok' "$O/suite483.tap" | grep -v TODO | cut -c1-200
echo "EXPO (3221225477) lines in TAP: $(grep -c 3221225477 "$O/suite483.tap")"
echo "mutant rows: applied-and-caught $(grep -iE '^\s*ok .*applied, and caught' "$O/suite483.tap" | sort -u | wc -l), not ok mutant rows $(grep -iE '^\s*not ok .*(mutant|applied)' "$O/suite483.tap" | wc -l), NOT APPLIED mentions $(grep -ic 'not applied' "$O/suite483.tap")"
echo "after suite: changed=[$(git status --short | wc -l)] $(stamp)"
