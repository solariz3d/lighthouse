#!/bin/bash
# L182 A: byte-identity with the dials at their defaults, then the arms (one sweep per arm and block, each under the heavy-run lock, BelowNormal, 4 threads).
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WT="C:/Users/zackn/Downloads/dreamzone-3-a-l182"
EXE='C:\Users\zackn\Downloads\dreamzone-3-a-l182\chase\build\bin\dz-chase.exe'
OUT="$SP/arms182"
mkdir -p "$OUT"
echo "=== byte-identity $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L182 A equivalence" "$WT" "$EXE" sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 4 2>/dev/null | sed -n '/^survival, seconds/,/^where chasers caught/p' > "$OUT/equiv_l182.txt"
md5sum "$OUT/equiv_l182.txt"
if [ "$(md5sum "$OUT/equiv_l182.txt" | cut -d' ' -f1)" != "599ab2395194ded75d0d102f84b3195d" ]; then echo "BYTE-IDENTITY FAILED, no arms run"; exit 9; fi
echo "byte-identity holds"
for spec in "$@"; do
  arm="${spec%%=*}"
  speed="${spec#*=}"
  for first in 1 151; do
    if [ -f "$OUT/${arm}_b${first}_runs.csv" ]; then echo "skip ${arm} block ${first}: done"; continue; fi
    echo "=== ${arm} block ${first} ($speed) $(date -u +%H:%M:%S)"
    node "$SP/lockrun.js" "L182 A arm ${arm} b${first}" "$WT" "$EXE" sweep --seeds 150 --first $first --levels 1 --policies line,flee,cutback --max 300 --threads 4 --slosh --csv "$OUT/${arm}_b${first}" --speed "$speed" > "$OUT/${arm}_b${first}.txt" 2>&1
    echo "    exit $? $(date -u +%H:%M:%S)"
  done
done
echo "ALL DONE $(date -u +%H:%M:%S)"
