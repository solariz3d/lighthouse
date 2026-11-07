#!/bin/sh
# round3.sh: under the heavy-run lock, BelowNormal, ONE test file at a time, no preload: A's four red files, then D623's touched set joined with every file
# that makes a shell (bar the 4 timing files)
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
cd C:/Users/nname/Desktop/worktrees/t180-c623 || exit 9
timing() { for f in C:/Consonance/data/heavy-run*.lock; do [ -f "$f" ] || continue; c=$(grep -o '"cmd":"[^"]*"' "$f"); echo "$c" | grep -qi "timing\|sculpt-frame\|ABAB" && ! echo "$c" | grep -qi "not a timing" && return 0; done; return 1; }
while timing || tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi "acs.exe"; do sleep 60; done
mkdir -p $S/d623b/out
SET=$( (ls test/validate*.test.js test/stacked_not_red.test.js test/passclear.test.js app/test/validate-ui*.test.js app/test/redgroups.test.js app/test/core-*.test.js app/test/close-*.test.js app/test/sculpt-tools.test.js app/test/preview.test.js app/test/preview-async.test.js app/test/preview-flowmemo.test.js app/test/preview-late.test.js app/test/preview-lod.test.js app/test/preview-open.test.js app/test/preview-stuck.test.js app/test/preview-undo.test.js app/test/camera.test.js app/test/pick-cull.test.js; cat $S/d623b/shellfiles.txt) | grep -vE "close-reuse|lod-frame|preview-speed|sculpt-frame|export-isolated" | sort -u | tr '\n' ' ')
echo "$SET" | wc -w > $S/d623b/out/touched-3.count
node $S/d513/lockrun2.js "D623 round 3: export pins, app mutants, touched set, one slot (not a timing session)" node $S/d456/belownormal.js "C:/Program Files/Git/bin/sh.exe" -c "
  node --test --test-reporter=tap --test-concurrency=1 app/test/export-isolated.test.js app/test/export-isolated-page.test.js app/test/mutation.test.js app/test/export-isolated-mutation.test.js > $S/d623b/out/four.tap 2>&1; echo \"exit \$?\" >> $S/d623b/out/four.tap;
  node --test --test-reporter=tap --test-concurrency=1 $SET > $S/d623b/out/touched-3.tap 2>&1; echo \"exit \$?\" >> $S/d623b/out/touched-3.tap"
