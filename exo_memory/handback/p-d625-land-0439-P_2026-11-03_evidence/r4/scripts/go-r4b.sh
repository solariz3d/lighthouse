#!/bin/sh
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-372c8abc/fbf98f8e-29da-4fb2-8610-c038d6372249/scratchpad/d625
P3=C:/Users/nname/Desktop/worktrees/t180-p625r2
E2=C:/Users/nname/Desktop/worktrees/t180-p625
cd $P3 && node $S/runner-r4b.js 1-e2d $E2 && node $S/runner-r4b.js 1-p4 $P3 && node $S/runner-r4b.js 2-e2d $E2 && node $S/runner-r4b.js 2-p4 $P3; echo "alt exit $?"
