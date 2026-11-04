#!/bin/sh
# D626: every shell-making test file (grep -rlE createCoreShell test app/test: 72) joined with the touched set (121): 159 files, one slot, BelowNormal.
# 155 at concurrency 4, then the 4 frame-timing files alone at concurrency 1. Waits for any timing session in C:/Consonance/data/heavy-run*.lock first.
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad
O=$S/d626
cd C:/Users/nname/Desktop/worktrees/t180-e624 || exit 9
echo "start $(date -u +%H:%M:%SZ) $(git rev-parse --short HEAD) dirty $(git status --short | wc -l)" > $O/all.log
n=0; while grep -qi timing C:/Consonance/data/heavy-run*.lock 2>/dev/null; do echo "waiting: a timing session holds a lock $(date -u +%H:%M:%SZ)" >> $O/all.log; sleep 60; n=$((n+1)); [ $n -ge 120 ] && { echo "gave up waiting for the timing session" >> $O/all.log; echo ALL-END >> $O/all.log; exit 4; }; done
if tasklist //FI "IMAGENAME eq acs.exe" //NH 2>/dev/null | grep -qi acs.exe; then echo "acs.exe is up: nothing run" >> $O/all.log; echo ALL-END >> $O/all.log; exit 3; fi
node $S/d588/holdrun.js "E D626 every shell-making test file + touched, 155 files (BelowNormal; not a timing session)" node $S/d485/belownormal.js node --max-old-space-size=4096 --test --test-reporter=tap --test-concurrency=4 $(cat $O/main-files.txt) > $O/all-main.tap 2>&1
echo "main exit $? $(date -u +%H:%M:%SZ)" >> $O/all.log
grep -E "^# (tests|pass|fail|skipped|todo|cancelled)" $O/all-main.tap >> $O/all.log
grep -E "^not ok" $O/all-main.tap >> $O/all.log
node $S/d588/holdrun.js "E D626 the 4 frame-timing shell files, one at a time (BelowNormal; not a timing session)" node $S/d485/belownormal.js node --max-old-space-size=4096 --test --test-reporter=tap --test-concurrency=1 $(cat $O/timing-files.txt) > $O/all-timing.tap 2>&1
echo "timing exit $? $(date -u +%H:%M:%SZ)" >> $O/all.log
grep -E "^# (tests|pass|fail|skipped|todo|cancelled)" $O/all-timing.tap >> $O/all.log
grep -E "^not ok" $O/all-timing.tap >> $O/all.log
echo ALL-END >> $O/all.log
