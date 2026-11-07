#!/bin/sh
# run.sh: under the heavy-run lock, BelowNormal, one slot: texture-page plus the validate-ui files, on d623-c2 (d3cf1ee + the row 9 amendment)
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
cd C:/Users/nname/Desktop/worktrees/t180-c623b || exit 9
while tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi "acs.exe"; do sleep 60; done
FILES="app/test/texture-page.test.js app/test/redgroups.test.js app/test/validate-ui-incval.test.js app/test/validate-ui-jumpdefault.test.js app/test/validate-ui-jumps.test.js app/test/validate-ui-panel.test.js app/test/validate-ui-worker.test.js app/test/validate-ui.test.js"
node $S/d513/lockrun2.js "D623 texture-page row 9 fix: texture-page plus validate-ui, one slot (not a timing session)" node $S/d456/belownormal.js "C:/Program Files/Git/bin/sh.exe" -c "
  node --test --test-reporter=tap --test-concurrency=1 $FILES > $S/d623c/out/after.tap 2>&1; echo \"exit \$?\" >> $S/d623c/out/after.tap"
