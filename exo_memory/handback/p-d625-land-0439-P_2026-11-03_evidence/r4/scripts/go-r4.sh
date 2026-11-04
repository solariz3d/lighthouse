#!/bin/sh
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-372c8abc/fbf98f8e-29da-4fb2-8610-c038d6372249/scratchpad/d625
cd C:/Users/nname/Desktop/worktrees/t180-p625r2 && node $S/runner-r4.js suite; echo "suite runner exit $?" >> $S/out-r4/go.log; node $S/runner-r4.js timing; echo "timing runner exit $?" >> $S/out-r4/go.log
