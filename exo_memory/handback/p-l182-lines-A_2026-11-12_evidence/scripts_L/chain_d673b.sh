#!/bin/bash
# D673 on the rebased tree (onto main cc8eea8): build, the eight overtime rows, and the 12-seed byte-identity (F5). The train's whole suite is the rest.
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WSP=$(cygpath -w "$SP")
WT="C:/Users/zackn/Downloads/dreamzone-3-a-d673"
OUT="$SP/chain_d673b"
mkdir -p "$OUT"
win() { cygpath -w "$1"; }
WANT=599ab2395194ded75d0d102f84b3195d
echo "tip: $(git -C $WT log -1 --format='%h %s' | cut -c1-90)"
echo "=== build $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "D673 rebased build" "$WT" cmd /c "$WSP\\cbuild_d673.bat" > "$OUT/build.txt" 2>&1
grep -v "waiting on" "$OUT/build.txt" | grep -i "error\|FAILED\|lockrun\|gave up" | head -6 | cut -c1-300
grep -q "exit 0" "$OUT/build.txt" || { echo "BUILD DID NOT SUCCEED (see build.txt), stopping"; exit 1; }
CT=$(win $WT/chase/build/bin/chase_tests.exe)
echo "=== overtime rows $(date -u +%H:%M:%S)"
: > "$OUT/rows.txt"
for row in with_the_timer_unreached at_the_timer_the_run_goes in_overtime_the_others_walk_off the_dark_one_comes_from a_catch_before_the_timer in_overtime_every_park_stops a_fall_into_a_void overtime_pays_its_multiple; do
  echo "--- $row" >> "$OUT/rows.txt"
  node "$SP/lockrun.js" "D673 row $row" "$WT" "$CT" "$row" 2>&1 | grep -v "waiting on" >> "$OUT/rows.txt"
done
grep -E "^ok|^FAIL|tests, " "$OUT/rows.txt" | cut -c1-200
echo "=== byte-identity $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "D673 equivalence" "$WT" "$(win $WT/chase/build/bin/dz-chase.exe)" sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 2 2>/dev/null | sed -n '/^survival, seconds/,/^where chasers caught/p' > "$OUT/equiv.txt"
echo "d673 md5 $(md5sum "$OUT/equiv.txt" | cut -d' ' -f1) (want $WANT), $(wc -l < "$OUT/equiv.txt") lines"
echo "=== done $(date -u +%H:%M:%S)"
