echo "start $(date -u +%H:%M:%SZ)" > /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag2.log
for T in t180-e624 t180-e624-base t180-e624; do
  cd C:/Users/nname/Desktop/worktrees/$T
  node /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d588/holdrun.js "E D626 drag-frame timing session, base against fix, one file alone" node --test --test-reporter=tap --test-concurrency=1 app/test/drag-frame.test.js > /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag-$T.tap 2>&1
  echo "== $T $(date -u +%H:%M:%SZ)" >> /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag2.log
  grep -E "^(not )?ok|^# (pass|fail)" /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag-$T.tap | cut -c1-90 >> /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag2.log
  grep -E "p95|ms" /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag-$T.tap | grep -iE "^\s*# |error" | head -12 | cut -c1-200 >> /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag2.log
done
echo DRAG-END >> /c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d626/drag2.log
