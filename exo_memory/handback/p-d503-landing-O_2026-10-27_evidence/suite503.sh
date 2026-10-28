#!/bin/sh
# suite503.sh (O, D503; from A's suite497.sh): the full suite on the rebased d503-o, BelowNormal, one heavy-run slot via gate.js, TAP, SWEEP_SEEDS=60, every harness whole.
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/d503"; WT="C:/Users/nname/Downloads/t180-wt-o503"
cd "$WT" || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000 SWEEP_SEEDS=60
stamp() { date -u +%H:%M:%SZ; }
echo "head $(git rev-parse --short HEAD) changed=[$(git status --short | wc -l)] SWEEP_SEEDS=$SWEEP_SEEDS $(stamp)"
s=$(date +%s)
node "$O/belownormal.js" node C:/Users/nname/Downloads/t180-d421-e/gate.js "O D503 full suite on $(git rev-parse --short HEAD) (BelowNormal, SWEEP_SEEDS=60)" node --test --test-concurrency=4 --test-reporter=spec --test-reporter-destination=stdout --test-reporter=tap --test-reporter-destination="$O/suite503.tap" "test/*.test.js" "app/test/*.test.js" > "$O/suite503.out" 2>&1; rc=$?
echo "suite exit $rc, $(( $(date +%s)-s )) s: $(sed 's/\x1b\[[0-9;]*m//g' "$O/suite503.out" | grep -E '^ℹ (tests|pass|fail|cancelled|skipped|todo)' | tr '\n' ' ') $(stamp)"
echo "suite non-TODO not ok rows: $(grep -E '^\s*not ok' "$O/suite503.tap" | grep -vc TODO)"
grep -E '^\s*not ok' "$O/suite503.tap" | grep -v TODO | cut -c1-200
echo "mutant rows: applied-and-caught $(grep -iE '^\s*ok .*applied, and caught' "$O/suite503.tap" | sort -u | wc -l), not ok mutant rows $(grep -iE '^\s*not ok .*(mutant|applied)' "$O/suite503.tap" | wc -l), NOT APPLIED mentions $(grep -ic 'not applied' "$O/suite503.tap")"
echo "after suite: changed=[$(git status --short | wc -l)] $(stamp)"
