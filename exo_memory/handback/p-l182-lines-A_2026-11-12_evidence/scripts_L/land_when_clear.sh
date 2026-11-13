#!/bin/bash
# L170 A: wait until no Dreamzone program is running (B's dzrunning.cmd), then take the exclusive hold and land l170-chase (land_l170.cmd). One copy only.
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WSP=$(cygpath -w "$SP")
while true; do
  cmd /c "$WSP\\dzrunning.cmd" > /dev/null 2>&1
  if [ $? -ne 0 ]; then break; fi   # exit 0 means one is running; exit 1 means clear
  sleep 60
done
echo "clear at $(date -u +%H:%M:%S), landing"
rm -f "$SP/land_l170_status.json"
node "$SP/landrun.js" "$WSP\\land_l170.cmd" "$SP/land_l170_status.json" > "$SP/land_l170.log" 2>&1
echo "exit $? at $(date -u +%H:%M:%S)" >> "$SP/land_l170.log"
echo "LANDING SCRIPT ENDED $(date -u +%H:%M:%S)"
