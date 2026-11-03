#!/bin/sh
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-372c8abc/fbf98f8e-29da-4fb2-8610-c038d6372249/scratchpad/d625
cd C:/Users/nname/Desktop/worktrees/t180-p625 && node $S/runner.js suite; echo "suite runner exit $?" >> $S/out/go.log; node $S/runner.js timing; echo "timing runner exit $?" >> $S/out/go.log
