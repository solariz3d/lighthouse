#!/bin/bash
# L170 A: the reprieve row measure at main 0389b0a (a-m1) and at E's e822f42 (a-m2). Each build and each run holds the heavy-run lock in turn.
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WSP=$(cygpath -w "$SP")
for w in a-m1 a-m2; do
  D="C:/Users/zackn/Downloads/dreamzone-3-$w"
  echo "=== build $w $(date -u +%H:%M:%S)"
  node "$SP/lockrun.js" "L170 A reprieve build $w" "$D" cmd /c "$WSP\\cbuild_$w.bat" > "$SP/rep_build_$w.txt" 2>&1
  echo "    build exit $? $(date -u +%H:%M:%S)"
  EXE="C:\\Users\\zackn\\Downloads\\dreamzone-3-$w\\chase\\build\\bin\\chase_tests.exe"
  echo "=== run $w $(date -u +%H:%M:%S)"
  node "$SP/lockrun.js" "L170 A reprieve measure $w" "$D" "$EXE" measure_reprieve > "$SP/rep_run_$w.txt" 2>&1
  echo "    run exit $? $(date -u +%H:%M:%S)"
done
echo "ALL DONE $(date -u +%H:%M:%S)"
