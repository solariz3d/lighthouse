#!/bin/sh
# run.sh: wait while a timing session holds a lock or acs.exe runs; then take the heavy-run lock and run inner.sh at BelowNormal
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
mkdir -p $S/d615/out
timing() { for f in C:/Consonance/data/heavy-run*.lock; do [ -f "$f" ] || continue; c=$(grep -o '"cmd":"[^"]*"' "$f"); echo "$c" | grep -qi "timing\|sculpt-frame\|ABAB" && ! echo "$c" | grep -qi "not a timing" && return 0; done; return 1; }
while timing || tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi "acs.exe"; do echo "waiting $(date -u +%H:%M:%SZ)" >> $S/d615/out/wait.log; sleep 60; done
node $S/d513/lockrun2.js "D615 0.4.38 landing: build, full suite, cargo lib, hidden ELYSIUM export (not a timing session)" node $S/d456/belownormal.js "C:/Program Files/Git/bin/sh.exe" $S/d615/inner.sh > $S/d615/out/gate.log 2>&1
echo "gate exit $?" >> $S/d615/out/gate.log
