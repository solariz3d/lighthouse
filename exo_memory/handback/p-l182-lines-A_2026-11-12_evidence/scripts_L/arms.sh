#!/bin/bash
# L170 A: the arms. One sweep per (arm, block), each under the heavy-run lock, BelowNormal, 4 threads, with the slosh scorer.
# usage: arms.sh "<arm>=<speed text>" ...      (an empty speed text is the control re-run)
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
EXE='C:\Users\zackn\Downloads\dreamzone-3-a-l170\chase\build\bin\dz-chase.exe'
OUT="$SP/arms"
mkdir -p "$OUT"
for spec in "$@"; do
  arm="${spec%%=*}"
  speed="${spec#*=}"
  for first in 1 151; do
    if [ -f "$OUT/${arm}_b${first}_runs.csv" ]; then echo "skip ${arm} block ${first}: done"; continue; fi
    echo "=== ${arm} block ${first} ($speed) $(date -u +%H:%M:%S)"
    node "$SP/lockrun.js" "L170 A arm ${arm} b${first}" "C:/Users/zackn/Downloads/dreamzone-3-a-l170" "$EXE" sweep --seeds 150 --first $first --levels 1 --policies line,flee,cutback --max 300 --threads 4 --slosh --csv "$OUT/${arm}_b${first}" ${speed:+--speed "$speed"} > "$OUT/${arm}_b${first}.txt" 2>&1
    echo "    exit $? $(date -u +%H:%M:%S)"
  done
done
echo "ALL DONE $(date -u +%H:%M:%S)"
