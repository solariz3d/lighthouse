#!/bin/sh
# D637b: markers_sectors_mutation alone, then the 23 other files the require closure names that my D637 runs did not (closure.js). Waits for any timing session.
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad
O=$S/d637b
cd C:/Users/nname/Desktop/worktrees/t180-e637 || exit 9
echo "start $(date -u +%H:%M:%SZ) $(git rev-parse --short HEAD) dirty $(git status --short | wc -l)" > $O/run.log
n=0; while cat C:/Consonance/data/heavy-run*.lock 2>/dev/null | grep -i timing | grep -qvi "not a timing session"; do echo "waiting: timing $(date -u +%H:%M:%SZ)" >> $O/run.log; sleep 60; n=$((n+1)); [ $n -ge 120 ] && { echo gave-up >> $O/run.log; echo ALL-END >> $O/run.log; exit 4; }; done
if tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi acs.exe; then echo "acs.exe is up" >> $O/run.log; echo ALL-END >> $O/run.log; exit 3; fi
node $S/d588/holdrun.js "E D637b markers_sectors_mutation (BelowNormal; not a timing session)" node $S/d485/belownormal.js node --test --test-reporter=tap test/markers_sectors_mutation.test.js > $O/sectors-mut.tap 2>&1
echo "sectors-mut exit $? $(date -u +%H:%M:%SZ)" >> $O/run.log
grep -E "^# (tests|pass|fail)|^not ok" $O/sectors-mut.tap >> $O/run.log
node $S/d588/holdrun.js "E D637b the 23 files the closure adds (BelowNormal; not a timing session)" node $S/d485/belownormal.js node --max-old-space-size=4096 --test --test-reporter=tap --test-concurrency=3 $(cat $O/rest.txt) > $O/rest.tap 2>&1
echo "rest exit $? $(date -u +%H:%M:%SZ)" >> $O/run.log
grep -E "^# (tests|pass|fail|skipped|cancelled)|^not ok" $O/rest.tap >> $O/run.log
if cat C:/Consonance/data/heavy-run*.lock 2>/dev/null | grep -i timing | grep -qvi "not a timing session"; then echo "a timing session holds a lock at the end: ring" >> $O/run.log; fi
echo ALL-END >> $O/run.log
