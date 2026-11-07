#!/bin/sh
# touched.sh <label>: the touched and neighbouring tests of D623 under the heavy-run lock, BelowNormal; TAP to out/touched-<label>.tap
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
mkdir -p $S/d623/out
cd C:/Users/nname/Desktop/worktrees/t180-c623 || exit 9
timing() { for f in C:/Consonance/data/heavy-run*.lock; do [ -f "$f" ] || continue; c=$(grep -o '"cmd":"[^"]*"' "$f"); echo "$c" | grep -qi "timing\|sculpt-frame\|ABAB" && ! echo "$c" | grep -qi "not a timing" && return 0; done; return 1; }
while timing || tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi "acs.exe"; do sleep 60; done
node $S/d513/lockrun2.js "D623 touched tests (not a timing session)" node $S/d456/belownormal.js node --test --test-reporter=tap --test-concurrency=4 \
  test/validate*.test.js test/stacked_not_red.test.js test/passclear.test.js app/test/validate-ui*.test.js app/test/redgroups.test.js \
  app/test/core-*.test.js app/test/close-*.test.js app/test/sculpt-tools.test.js > $S/d623/out/touched-$1.tap 2>&1
echo "exit $?" >> $S/d623/out/touched-$1.tap
