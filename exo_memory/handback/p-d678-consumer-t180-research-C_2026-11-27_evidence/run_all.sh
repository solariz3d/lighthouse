#!/usr/bin/env bash
# run_all.sh: D678 N6's held runs, one after another. Before each, wait until heavy-run --status says the gate is open (no exclusive
# hold, no timing session); each run then takes its own hold, so the slot is released between runs.
W=G:/consonance-scratch/lh-d678-c
S=G:/consonance-scratch/c-d678
gate() { until node "$W/consonance/tools/heavy-run.js" --status >/dev/null 2>&1; do sleep 30; done; }
cd "$S" || exit 1
: > "$S/mutate_gc_chunks.txt"
for r in "0 4 --control" "4 8" "8 12" "12 16" "16 20" "20 24" "24 26"; do
  set -- $r
  gate
  echo "== chunk $1-$(($2-1)) gate open at $(date -u +%H:%M:%SZ)" >> "$S/mutate_gc_chunks.txt"
  start //B //BELOWNORMAL //WAIT node gc_chunk.js "$W" $1 $2 $3 >> "$S/mutate_gc_chunks.txt" 2>&1
  echo "== chunk $1-$(($2-1)) ended $(date -u +%H:%M:%SZ)" >> "$S/mutate_gc_chunks.txt"
done
gate
start //B //BELOWNORMAL //WAIT node mutants_n6b.js "$W" > "$S/mutants_n6b.txt" 2>&1
echo "all ended $(date -u +%H:%M:%SZ)"
