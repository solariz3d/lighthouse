#!/bin/sh
# run271d.sh (pane B, L271 amendment): the tube-wall pictures (page271d.js, headless, leftovers counted before and after), then the touched rows again. Under heavy-run, BelowNormal.
B=<downloads>/t180-b-l271; Q=<scratch>; LH=/c/Consonance/lighthouse
node $LH/consonance/tools/leftovers.js > $Q/leftovers-before-d.txt 2>&1; echo "leftovers before exit $?"
node $Q/page271d.js $B c522ea6 $Q/shotsd; echo "page exit $?"
node $LH/consonance/tools/leftovers.js > $Q/leftovers-after-d.txt 2>&1; echo "leftovers after exit $?"
cd $B && node $Q/light.js $Q/tier3-branch.tap . app/test/zonegrab.test.js app/test/core-pieces-ui.test.js app/test/handles.test.js app/test/sculpt-frame.test.js; echo "tier3 exit $?"
