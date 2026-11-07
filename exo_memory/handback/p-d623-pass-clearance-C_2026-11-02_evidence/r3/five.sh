#!/bin/sh
# five.sh: under the heavy-run lock, BelowNormal, one slot, NO preload: the 5 files the diagnostic found red, on a005e1d (base) and on the working d623-c tree
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
timing() { for f in C:/Consonance/data/heavy-run*.lock; do [ -f "$f" ] || continue; c=$(grep -o '"cmd":"[^"]*"' "$f"); echo "$c" | grep -qi "timing\|sculpt-frame\|ABAB" && ! echo "$c" | grep -qi "not a timing" && return 0; done; return 1; }
while timing || tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi "acs.exe"; do sleep 60; done
F="app/test/guides.test.js app/test/undo-reopen.test.js test/core_gridturn.test.js test/core_segcache.test.js test/core_segcache_lift.test.js"
node $S/d513/lockrun2.js "D623 round 3: five files on base and d623-c, one slot (not a timing session)" node $S/d456/belownormal.js "C:/Program Files/Git/bin/sh.exe" -c "
  cd C:/Users/nname/Desktop/worktrees/t180-c623-base && node --test --test-reporter=tap --test-concurrency=1 $F > $S/d623b/out/five-base.tap 2>&1; echo \"exit \$?\" >> $S/d623b/out/five-base.tap;
  cd C:/Users/nname/Desktop/worktrees/t180-c623 && node --test --test-reporter=tap --test-concurrency=1 $F > $S/d623b/out/five-c.tap 2>&1; echo \"exit \$?\" >> $S/d623b/out/five-c.tap"
