#!/bin/sh
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad
O=$S/d626
cd C:/Users/nname/Desktop/worktrees/t180-e624 || exit 9
echo "start $(date -u +%H:%M:%SZ) $(git rev-parse --short HEAD) dirty $(git status --short | wc -l)" > $O/touched.log
if tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi acs.exe; then echo "acs.exe is up: nothing run" >> $O/touched.log; echo TOUCHED-END >> $O/touched.log; exit 3; fi
node $S/d588/holdrun.js "E D626 bank corners: touched tests and harnesses (BelowNormal; not a timing session)" node $S/d485/belownormal.js node --max-old-space-size=4096 --test --test-reporter=tap --test-concurrency=4 $(cat $O/touched-files.txt) > $O/touched.tap 2>&1
echo "exit $? $(date -u +%H:%M:%SZ)" >> $O/touched.log
grep -E "^# (tests|pass|fail|skipped|todo|cancelled)" $O/touched.tap >> $O/touched.log
grep -E "^not ok" $O/touched.tap >> $O/touched.log
echo TOUCHED-END >> $O/touched.log
