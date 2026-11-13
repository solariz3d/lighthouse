#!/bin/bash
# Lap R on the rebased tree: build, the rows, then the 16 hand mutants (one slot at a time).
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WSP=$(cygpath -w "$SP")
WT="C:/Users/zackn/Downloads/dreamzone-3-a-l197"
OUT="$SP/chain_lapr"
mkdir -p "$OUT"
WA=$(cygpath -w $WT/build/bin/world_app_tests.exe)
CT=$(cygpath -w $WT/build/bin/chase_tests.exe)

echo "=== build $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L197 rebased build" "$WT" cmd /c "$WSP\\cbuild_l197.bat" > "$OUT/build.txt" 2>&1
grep -v "^heavy-run: waiting" "$OUT/build.txt" | grep -i "error\|FAILED\|lockrun" | head -8 | cut -c1-300
grep -q "exit 0" "$OUT/build.txt" || { echo "BUILD FAILED, stopping"; exit 1; }

echo "=== rows $(date -u +%H:%M:%S)"
: > "$OUT/rows.txt"
for row in an_old_text_with_no_record_format a_new_record_text_says_its_format a_newer_format_an_unknown a_run_played_with_another_speed_model a_new_run_begins_with_the_shipped a_saved_run_and_its_kept_points; do
  echo "--- $row" >> "$OUT/rows.txt"
  node "$SP/lockrun.js" "L197 row $row" "$WT" "$WA" "$row" 2>&1 | grep -v "^heavy-run: waiting" >> "$OUT/rows.txt"
done
echo "--- speed pin" >> "$OUT/rows.txt"
node "$SP/lockrun.js" "L197 pin" "$WT" "$CT" what_a_new_run_starts_with 2>&1 | grep -v "^heavy-run: waiting" >> "$OUT/rows.txt"
grep -E "^ok|^FAIL|tests, " "$OUT/rows.txt" | cut -c1-200

echo "=== mutants $(date -u +%H:%M:%S)"
node "$SP/mutants_lapr.js" > "$OUT/mutants.txt" 2>&1
cat "$OUT/mutants.txt" | cut -c1-300
echo "=== done $(date -u +%H:%M:%S)"
