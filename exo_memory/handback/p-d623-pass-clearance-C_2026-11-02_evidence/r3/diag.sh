#!/bin/sh
# diag.sh: under the heavy-run lock, BelowNormal, one slot: every test file that makes a shell (bar the 4 timing files and the pass-clearance test itself),
# with refusallog.js preloaded: which fixtures still meet a PASS_CLEARANCE refusal. Diagnostic only; the verifying run is round3.sh, without the preload.
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
cd C:/Users/nname/Desktop/worktrees/t180-c623 || exit 9
timing() { for f in C:/Consonance/data/heavy-run*.lock; do [ -f "$f" ] || continue; c=$(grep -o '"cmd":"[^"]*"' "$f"); echo "$c" | grep -qi "timing\|sculpt-frame\|ABAB" && ! echo "$c" | grep -qi "not a timing" && return 0; done; return 1; }
while timing || tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi "acs.exe"; do sleep 60; done
FILES=$(grep -vE "close-reuse|lod-frame|preview-speed|sculpt-frame" $S/d623b/shellfiles.txt | tr '\n' ' ')
rm -f $S/d623b/out/refusals.log
node $S/d513/lockrun2.js "D623 round 3 diag: fixture refusals, one slot (not a timing session)" node $S/d456/belownormal.js "C:/Program Files/Git/bin/sh.exe" -c "
  REFUSAL_LOG=$S/d623b/out/refusals.log NODE_OPTIONS='--require $S/d623b/refusallog.js' node --test --test-reporter=tap --test-concurrency=1 $FILES > $S/d623b/out/diag.tap 2>&1; echo \"exit \$?\" >> $S/d623b/out/diag.tap"
