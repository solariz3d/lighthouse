#!/bin/sh
# run623.sh: D617 resumed on 72fff66: the 64 touched files and C's passclear test, then the final-scene mutation harness; one slot, hidden, BelowNormal
S="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d617"
W="C:/Users/nname/Downloads/t180-wt-a617"
export CONSONANCE_HEAVY_SLOTS=1
node "$S/run623.js" "$W" "$S/t623" $(cat "$S/touched.txt") test/passclear.test.js > "$S/t623.log" 2>&1 || { echo "touched stopped: exit $?" >> "$S/t623.log"; exit 0; }
echo "touched done $(date)" >> "$S/t623.log"
node "$S/run623.js" "$W" "$S/t623" test/finalscene_mutation.test.js > "$S/m623.log" 2>&1
echo "mutation done exit $? $(date)" >> "$S/m623.log"
