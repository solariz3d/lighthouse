#!/bin/bash
# Lap R on the tip that lands: build, then the six rows and the pin. No mutants (they follow, in units, after the landing).
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WSP=$(cygpath -w "$SP")
WT="C:/Users/zackn/Downloads/dreamzone-3-a-l197"
OUT="$SP/chain_lapr_tip"
mkdir -p "$OUT"
WA=$(cygpath -w $WT/build/bin/world_app_tests.exe)
CT=$(cygpath -w $WT/build/bin/chase_tests.exe)
echo "tip: $(git -C $WT log -1 --format='%h %s' | cut -c1-90)"
echo "=== build $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L197 tip build" "$WT" cmd /c "$WSP\\cbuild_l197.bat" > "$OUT/build.txt" 2>&1
grep -v "^heavy-run: waiting" "$OUT/build.txt" | grep -i "error\|FAILED\|lockrun" | head -8 | cut -c1-300
grep -q "exit 0" "$OUT/build.txt" || { echo "BUILD FAILED, stopping"; exit 1; }
echo "=== rows $(date -u +%H:%M:%S)"
: > "$OUT/rows.txt"
for row in an_old_text_with_no_record_format a_new_record_text_says_its_format a_newer_format_an_unknown a_run_played_with_another_speed_model a_new_run_begins_with_the_shipped a_saved_run_and_its_kept_points; do
  echo "--- $row" >> "$OUT/rows.txt"
  node "$SP/lockrun.js" "L197 tip row $row" "$WT" "$WA" "$row" 2>&1 | grep -v "^heavy-run: waiting" >> "$OUT/rows.txt"
done
echo "--- speed pin" >> "$OUT/rows.txt"
node "$SP/lockrun.js" "L197 tip pin" "$WT" "$CT" what_a_new_run_starts_with 2>&1 | grep -v "^heavy-run: waiting" >> "$OUT/rows.txt"
grep -E "^ok|^FAIL|tests, " "$OUT/rows.txt" | cut -c1-200
echo "=== done $(date -u +%H:%M:%S)"
