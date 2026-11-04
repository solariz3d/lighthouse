#!/usr/bin/env bash
# D096 mutants for the arch guard, on SCRATCH COPIES of BOOT and POINTERS.md: the live master is never
# mutated (a seat waking mid-run would read the mutant). The built arch_test binary resolves
# ../../exo_memory/* against its cwd, so it is run from a scratch tree of the same shape.
set -u
R=C:/Users/nname/Desktop/lighthouse
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d096
EXE=$(ls -t $R/consonance/src-tauri/target/debug/deps/arch_test-*.exe | head -1)
T="$S/mt"
run() { # $1 label; BOOT and POINTERS already staged in $T
  local out; out=$(cd "$T/consonance/src-tauri" && "$EXE" the_master_keeps_one_pointer_line 2>&1)
  local r; r=$(echo "$out" | grep -oE "[0-9]+ passed; [0-9]+ failed" | head -1)
  local verdict=CAUGHT; echo "$r" | grep -q " 0 failed" && verdict=SURVIVED
  printf '%-58s %-22s %s\n' "$1" "$r" "$verdict"
}
stage() { rm -rf "$T"; mkdir -p "$T/consonance/src-tauri" "$T/exo_memory/journal";
  cp $R/exo_memory/BOOT.md "$T/exo_memory/BOOT.md"; cp $R/exo_memory/journal/POINTERS.md "$T/exo_memory/journal/POINTERS.md"; }
B="$T/exo_memory/BOOT.md"; P="$T/exo_memory/journal/POINTERS.md"
stage; run "control (the landed state)" | sed 's/CAUGHT$/(control must pass)/;s/SURVIVED$/ok/'
stage; git -C $R show HEAD:exo_memory/BOOT.md > "$B"; run "M1 the tail back in the master (HEAD's BOOT)"
stage; grep -v '^\*\*Latest entry:\*\*' "$B" > "$B.x" && mv "$B.x" "$B"; run "M2 the one pointer line removed"
stage; sed -i 's#journal/POINTERS\.md#journal/INDEX.md#g' "$B"; run "M3 the line names a different file"
stage; rm "$P"; run "M4 the index file missing"
stage; sed -i 's#\*\*Latest entry:\*\* journal/2026-08-17\.md (#**Latest entry:** journal/2026-08-18.md (#' "$P"; run "M5 the index lost the leading paragraph"
stage; printf '\n**Previous:** journal/2026-09-06.md (a pointer written the old way)\n' >> "$B"; run "M6 a new pointer appended the old way (new_entry.py pre-D096)"
stage; printf '\n**Latest entry:** journal/2026-09-06.md (a second latest line)\n' >> "$B"; run "M7 a second Latest line (gen-brief's exactly-one)"
echo "--- gen-brief under M2 (no Latest line) must THROW:"
stage; grep -v '^\*\*Latest entry:\*\*' "$B" > "$S/BOOT.M2.md"; bash "$S/genbrief.sh" "$S/BOOT.M2.md" m2 2>&1 | grep -E "no '\*\*Latest entry|gen-brief exit" | head -2
