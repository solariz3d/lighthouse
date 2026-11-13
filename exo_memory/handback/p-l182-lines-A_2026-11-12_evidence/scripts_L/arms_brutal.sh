#!/bin/bash
# L182 A, second form (after the 2026-11-13 low-memory reap, exo_memory/loop/stall_trace_lowmem_reaper_2026-11-13.md): the same arms, but
#   - it starts only when the heavy-run lock and hold are free (the chair's order: three heavy jobs never share memory),
#   - every sweep waits for memwatch's gate (8192 MB free physical, 6144 MB commit headroom) before it starts, and the wait is logged,
#   - a 15 s memory sampler writes arms182/mem.jsonl for the whole run,
#   - --threads 2.
# One copy only. The byte-identity check was done at the start of the first form and the binary has not changed.
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WT="C:/Users/zackn/Downloads/dreamzone-3-a-l182"
EXE='C:\Users\zackn\Downloads\dreamzone-3-a-l182\chase\build\bin\dz-chase.exe'
MW="C:/Consonance/lighthouse/exo_memory/loop/memwatch_2026-11-13.js"
OUT="$SP/arms182_brutal"
LOCK="C:/Consonance/data/heavy-run.lock"
HOLD="C:/Consonance/data/heavy-run.hold"
mkdir -p "$OUT"

echo "=== waiting for the lock to be free of others $(date -u +%H:%M:%S)"
while [ -f "$HOLD" ]; do sleep 30; done   # yield to an exclusive hold (a landing, a quiet window); the slots themselves are lockrun's business
echo "lock free at $(date -u +%H:%M:%S)"

node "$MW" --watch 15 --log "$OUT/mem.jsonl" > "$OUT/mem_watch.out" 2>&1 &
WATCH=$!
trap 'kill $WATCH 2>/dev/null' EXIT

for spec in "$@"; do
  arm="${spec%%=*}"
  speed="${spec#*=}"
  for first in 1 151; do
    if [ -f "$OUT/${arm}_b${first}_runs.csv" ]; then echo "skip ${arm} block ${first}: done"; continue; fi
    while ! node "$MW" --gate --log "$OUT/mem.jsonl" > "$OUT/gate_last.txt" 2>&1; do
      echo "    memory gate says wait: $(tail -1 "$OUT/gate_last.txt" | cut -c1-160) $(date -u +%H:%M:%S)"
      sleep 60
    done
    echo "=== ${arm} block ${first} ($speed) $(date -u +%H:%M:%S) threads 2"
    node "$SP/lockrun.js" "L182f A brutal arm ${arm} b${first}" "$WT" "$EXE" sweep --seeds 150 --first $first --levels 3 --policies line,flee,cutback --max 600 --threads 2 --slosh --csv "$OUT/${arm}_b${first}" --speed "$speed" > "$OUT/${arm}_b${first}.txt" 2>&1
    echo "    exit $? $(date -u +%H:%M:%S)"
  done
done
echo "ALL DONE $(date -u +%H:%M:%S)"
