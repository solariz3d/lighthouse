#!/bin/bash
# The hawk branch's gates, one after another (one slot at a time): rebuild with the room's level argument; its rows; the 12-seed byte-identity sweep (md5 must be
# 599ab2395194ded75d0d102f84b3195d); then THE BLIND CHECK: `dz-chase room` on the control at level 1 (where his exploits were seen, as registered) and the same at level 3
# (brutal, what ships), both reported. No hawk arm is scored by the search until the level-1 check has been read.
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WSP=$(cygpath -w "$SP")
HAWK="C:/Users/zackn/Downloads/dreamzone-3-a-l182h"
OUT="$SP/chain_hawk2"
mkdir -p "$OUT"
win() { cygpath -w "$1"; }
WANT=599ab2395194ded75d0d102f84b3195d

echo "=== build $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L182b hawk rebuild (room level)" "$HAWK" cmd /c "$WSP\\cbuild_l182h.bat" > "$OUT/build.txt" 2>&1
grep -v "waiting on" "$OUT/build.txt" | grep -i "error\|FAILED\|lockrun\|gave up" | head -6 | cut -c1-300
grep -q "exit 0" "$OUT/build.txt" || { echo "BUILD DID NOT SUCCEED (see build.txt), stopping"; exit 1; }

echo "=== hawk rows (l182b) $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L182b rows" "$HAWK" "$(win $HAWK/chase/build/bin/chase_tests.exe)" l182b 2>&1 | grep -v "waiting on" | grep -E "^ok|^FAIL|tests, |    (circle|shuttle)" | cut -c1-220


for L in 1 3; do
  echo "=== blind check, room control, level $L $(date -u +%H:%M:%S)"
  node "$SP/lockrun.js" "L182c blind check level $L" "$HAWK" "$(win $HAWK/chase/build/bin/dz-chase.exe)" room --level $L --csv "$OUT/room_ctl_L$L" --threads 2 > "$OUT/room_ctl_L$L.txt" 2>&1
  grep -v "waiting on" "$OUT/room_ctl_L$L.txt" | cut -c1-200
done
echo "=== done $(date -u +%H:%M:%S)"
