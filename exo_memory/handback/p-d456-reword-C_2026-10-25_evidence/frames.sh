#!/bin/sh
# frames.sh (C, D456): drag-frame and release-frame alone, one heavy-run slot, BelowNormal, TAP; on pub-0.4.19, then on c965f5e (the control), then pub again.
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d456"
export CONSONANCE_HEAVY_WAIT_MS=14400000
for pass in pub ctl pub2; do
  case $pass in pub|pub2) WT=C:/Users/nname/Downloads/t180-wt-pub0419;; ctl) WT=C:/Users/nname/Downloads/t180-wt-c456ctl;; esac
  cd "$WT" || exit 9
  echo "$pass head $(git rev-parse --short HEAD) $(date -u +%H:%M:%SZ)"
  node "$O/belownormal.js" node "$O/lockrun.js" "C D456 frame rows alone ($pass)" node --test --test-concurrency=1 --test-reporter=tap --test-reporter-destination="$O/frames-$pass.tap" app/test/drag-frame.test.js app/test/release-frame.test.js > "$O/frames-$pass.out" 2>&1
  echo "$pass exit $?: $(grep -E '^# (pass|fail)' "$O/frames-$pass.tap" | tr '\n' ' ')"
  grep -E '^\s*not ok' "$O/frames-$pass.tap" | cut -c1-120
done
