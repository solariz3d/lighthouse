#!/bin/sh
# round2.sh: under the heavy-run lock, BelowNormal: the mutants (mutrun.js), then the touched set (as touched.sh, plus the preview's and the panel's own tests)
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
cd C:/Users/nname/Desktop/worktrees/t180-c623 || exit 9
timing() { for f in C:/Consonance/data/heavy-run*.lock; do [ -f "$f" ] || continue; c=$(grep -o '"cmd":"[^"]*"' "$f"); echo "$c" | grep -qi "timing\|sculpt-frame\|ABAB" && ! echo "$c" | grep -qi "not a timing" && return 0; done; return 1; }
while timing || tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi "acs.exe"; do sleep 60; done
node $S/d513/lockrun2.js "D623 round 3: mutants and the touched set (not a timing session)" node $S/d456/belownormal.js "C:/Program Files/Git/bin/sh.exe" -c "
  node $S/d623/mutrun.js C:/Users/nname/Desktop/worktrees/t180-c623 > $S/d623/out/mutrun3.out 2>&1;
  node --test --test-reporter=tap --test-concurrency=4 test/validate*.test.js test/stacked_not_red.test.js test/passclear.test.js app/test/validate-ui*.test.js app/test/redgroups.test.js app/test/core-*.test.js app/test/close-*.test.js app/test/sculpt-tools.test.js app/test/preview.test.js app/test/preview-async.test.js app/test/preview-flowmemo.test.js app/test/preview-late.test.js app/test/preview-lod.test.js app/test/preview-open.test.js app/test/preview-stuck.test.js app/test/preview-undo.test.js app/test/camera.test.js app/test/pick-cull.test.js > $S/d623/out/touched-3.tap 2>&1; echo \"exit \$?\" >> $S/d623/out/touched-3.tap"
