#!/bin/sh
# suite582.sh (C, D578, from suite573.sh): the full suite ONCE on d578-c in Desktop/worktrees/t180-land-582, BelowNormal, under the heavy-run lock
# (lockrun2.js), TAP, SWEEP_SEEDS=60, every mutation harness whole. Waits out any timing lock.
SC="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad"; O="$SC/d582"
cd C:/Users/nname/Desktop/worktrees/t180-land-582 || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000 SWEEP_SEEDS=60
stamp() { date -u +%H:%M:%SZ; }
{
while cat C:/Consonance/data/heavy-run.lock C:/Consonance/data/heavy-run.2.lock 2>/dev/null | sed 's/not a timing session//g' | grep -qiE 'timing|quiet|measure'; do sleep 60; done
echo "no timing lock; head $(git rev-parse --short HEAD) changed=[$(git status --short | wc -l)] SWEEP_SEEDS=$SWEEP_SEEDS $(stamp)"
s=$(date +%s)
node "$SC/d456/belownormal.js" node "$SC/d513/lockrun2.js" "D582 batch landing full suite on $(git rev-parse --short HEAD) (BelowNormal, SWEEP_SEEDS=60)" node --test --test-concurrency=4 --test-reporter=spec --test-reporter-destination=stdout --test-reporter=tap --test-reporter-destination="$O/suite582.tap" "test/*.test.js" "app/test/*.test.js" > "$O/suite582.out" 2>&1; rc=$?
echo "suite exit $rc, $(( $(date +%s)-s )) s: $(sed 's/\x1b\[[0-9;]*m//g' "$O/suite582.out" | grep -E '^ℹ (tests|pass|fail|cancelled|skipped|todo)' | tr '\n' ' ') $(stamp)"
echo "suite non-TODO not ok rows: $(grep -E '^\s*not ok' "$O/suite582.tap" | grep -vc TODO)"
grep -E '^\s*not ok' "$O/suite582.tap" | grep -v TODO | cut -c1-200
echo "fixtures: $(grep -E 'ok .*0 of 9 differ' "$O/suite582.tap" | cut -c1-120)"
echo "mutant rows: applied-and-caught $(grep -iE '^\s*ok .*applied, and caught' "$O/suite582.tap" | sort -u | wc -l), not ok mutant rows $(grep -iE '^\s*not ok .*(mutant|applied)' "$O/suite582.tap" | wc -l), NOT APPLIED mentions $(grep -ic 'not applied' "$O/suite582.tap")"
(cd C:/Users/nname/Desktop/lighthouse && node consonance/tools/leftovers.js) > "$O/leftovers-after.txt" 2>&1
echo "after suite: changed=[$(git status --short | wc -l)] $(stamp)"
echo DONE
} > "$O/suite582.log" 2>&1
