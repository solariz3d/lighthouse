#!/bin/sh
# tier271.sh (pane B, L271): the touched rows on the branch, then R4 (his saves, from copies) on c522ea6 and on the branch. Run under heavy-run, BelowNormal.
set -u
B=<downloads>/t180-b-l271; Q=<scratch>/l271; BT=<downloads>/t180-b-l271-base
cd $B && node $Q/light.js $Q/tier-branch.tap . app/test/zonegrab.test.js app/test/core-pieces-ui.test.js app/test/handles.test.js app/test/sculpt-frame.test.js; echo "tier exit $?"
git -C <downloads>/t180-track-builder worktree add --detach $BT c522ea6 >/dev/null 2>&1 && echo "base tree $(git -C $BT rev-parse --short HEAD)"
node --max-old-space-size=4096 <scratch>/l264/bytes264.js $BT $Q/tracks $Q/bytes-base.json
node --max-old-space-size=4096 <scratch>/l264/bytes264.js $B $Q/tracks $Q/bytes-branch.json
cmp $Q/bytes-base.json $Q/bytes-branch.json && echo "R4 SAME" || echo "R4 DIFFERS"
git -C <downloads>/t180-track-builder worktree remove $BT && echo "base tree removed"
