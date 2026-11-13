#!/bin/bash
# A: the checks that gate the D673 overtime work and the L182 hawk work, one after another under the heavy-run lock (one slot at a time).
#  1. d673: the whole chase_tests (F5: every existing row green with run_length_s 0; the eight overtime rows)
#  2. d673: the 12-seed byte-identity sweep text (md5 must be 599ab2395194ded75d0d102f84b3195d)
#  3. hawk: the whole chase_tests
#  4. hawk: the 12-seed byte-identity sweep text
#  5. hawk: `dz-chase room` on the control: THE BLIND CHECK (L182c): at least one shuttle cell and one circle cell flagged (exploit or near-exploit)
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
OUT="$SP/chain2"
mkdir -p "$OUT"
D673="C:/Users/zackn/Downloads/dreamzone-3-a-d673"
HAWK="C:/Users/zackn/Downloads/dreamzone-3-a-l182h"
win() { cygpath -w "$1"; }
WANT=599ab2395194ded75d0d102f84b3195d

echo "=== 1 d673 chase_tests $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "D673 full chase_tests" "$D673" "$(win $D673/chase/build/bin/chase_tests.exe)" > "$OUT/d673_chase_tests.txt" 2>&1
grep -v "^heavy-run: waiting" "$OUT/d673_chase_tests.txt" | grep -E "^FAIL|tests, |lockrun" | head -8

echo "=== 2 d673 byte-identity $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "D673 equivalence" "$D673" "$(win $D673/chase/build/bin/dz-chase.exe)" sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 2 2>/dev/null | sed -n '/^survival, seconds/,/^where chasers caught/p' > "$OUT/d673_equiv.txt"
echo "d673 md5 $(md5sum "$OUT/d673_equiv.txt" | cut -d' ' -f1) (want $WANT), $(wc -l < "$OUT/d673_equiv.txt") lines"

echo "=== 3 hawk chase_tests $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L182b full chase_tests" "$HAWK" "$(win $HAWK/chase/build/bin/chase_tests.exe)" > "$OUT/hawk_chase_tests.txt" 2>&1
grep -v "^heavy-run: waiting" "$OUT/hawk_chase_tests.txt" | grep -E "^FAIL|tests, |lockrun" | head -8

echo "=== 4 hawk byte-identity $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L182b equivalence" "$HAWK" "$(win $HAWK/chase/build/bin/dz-chase.exe)" sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 2 2>/dev/null | sed -n '/^survival, seconds/,/^where chasers caught/p' > "$OUT/hawk_equiv.txt"
echo "hawk md5 $(md5sum "$OUT/hawk_equiv.txt" | cut -d' ' -f1) (want $WANT), $(wc -l < "$OUT/hawk_equiv.txt") lines"

echo "=== 5 hawk blind check: dz-chase room, control $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "L182c blind check room control" "$HAWK" "$(win $HAWK/chase/build/bin/dz-chase.exe)" room --csv "$OUT/room_ctl" --threads 2 > "$OUT/room_ctl.txt" 2>&1
grep -v "^heavy-run: waiting" "$OUT/room_ctl.txt" | cut -c1-200
echo "=== done $(date -u +%H:%M:%S)"
