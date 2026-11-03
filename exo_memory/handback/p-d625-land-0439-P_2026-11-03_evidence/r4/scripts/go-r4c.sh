#!/bin/sh
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-372c8abc/fbf98f8e-29da-4fb2-8610-c038d6372249/scratchpad/d625
P3=C:/Users/nname/Desktop/worktrees/t180-p625r2
E2=C:/Users/nname/Desktop/worktrees/t180-p625
export R4_FILES=app/test/release-frame.test.js
cd $P3 && for i in 3 4 5; do node $S/runner-r4b.js $i-e2d $E2 && node $S/runner-r4b.js $i-p4 $P3 || exit 1; done; echo "rel exit $?"
