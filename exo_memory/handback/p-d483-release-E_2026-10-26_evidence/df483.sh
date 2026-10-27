#!/bin/sh
# df483.sh (E, D483): drag-frame.test.js and release-frame.test.js alone on the 0.4.22 tip, twice, BelowNormal, under the heavy-run gate (no other suite beside them)
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d483"
cd C:/Users/nname/Downloads/t180-wt-e483 || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000
for i in 1 2; do
  node "$O/belownormal.js" node C:/Users/nname/Downloads/t180-d421-e/gate.js "E D483 frame rows alone, run $i" node --test --test-reporter=tap app/test/drag-frame.test.js app/test/release-frame.test.js > "$O/df483-$i.tap" 2>&1
  echo "run $i $(date -u +%H:%M:%SZ): $(grep -E '^# (pass|fail)' "$O/df483-$i.tap" | tr '\n' ' ')"
  grep -E "^\s*not ok|error: '" "$O/df483-$i.tap" | cut -c1-200
  grep -E "^ok .*row 6" "$O/df483-$i.tap" | cut -c1-120
done
