#!/bin/sh
# run454.sh (D454 part 1, B): parity at d454-b 6606832a (daae452e + B part 1 + the seed-test fix), the 09-04 instrument. Source suite, generated suite, cargo on both, the cold sweep.
# Every step under lowio.ps1 (BelowNormal + very low I/O, inherited). js-suite takes the heavy-run lock itself; cargo goes through lockrun.
# Before each step: wait while any lock names a timing session (lighthouse 7a1cf49b).
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad/d454
WT=C:/Users/nname/Desktop/worktrees/lh-d454-b; GEN=$S/gen3
LOW="powershell -NoProfile -ExecutionPolicy Bypass -File $S/lowio.ps1"; LOCK="node C:/Users/nname/Downloads/t180-d413/lockrun.js"
export NODE_OPTIONS=--max-old-space-size=4096 CONSONANCE_HEAVY_WAIT_MS=14400000
gate() { while cat /c/Consonance/data/heavy-run.lock /c/Consonance/data/heavy-run.2.lock 2>/dev/null | grep -qiE 'timing|sculpt-frame|ABAB'; do sleep 30; done; }
step() { echo "$1 start $(date -u +%H:%M:%SZ)"; }
gate; step src-suite; (cd $WT && $LOW node consonance/tools/js-suite.js > $S/src-suite3.out 2>&1); echo "src-suite end $(date -u +%H:%M:%SZ) rc $?"
gate; step gen-suite; (cd $GEN && $LOW node consonance/tools/js-suite.js > $S/gen-suite3.out 2>&1); echo "gen-suite end $(date -u +%H:%M:%SZ) rc $?"
gate; step gen-cargo; (cd $GEN/consonance/src-tauri && CARGO_TARGET_DIR=G:/consonance-scratch/d454-gen-target $LOCK "B D454 cargo test on the generated consumer tree (BelowNormal, very low I/O; not a timing run)" $LOW C:/Users/nname/.cargo/bin/cargo.exe test > $S/gen-cargo3.out 2>&1); echo "gen-cargo end $(date -u +%H:%M:%SZ) rc $?"
gate; step src-cargo; (cd $WT/consonance/src-tauri && CARGO_TARGET_DIR=G:/consonance-scratch/d454-src-target $LOCK "B D454 cargo test on the d454-b source (BelowNormal, very low I/O; not a timing run)" $LOW C:/Users/nname/.cargo/bin/cargo.exe test > $S/src-cargo3.out 2>&1); echo "src-cargo end $(date -u +%H:%M:%SZ) rc $?"
step sweep; E=$S/empty-data; rm -rf $E; mkdir -p $E
for t in "chain-status.js" "board-audit.js" "ferry.js --due" "carrier-drift.js"; do
  (cd $GEN && CONSONANCE_DATA=$E node consonance/tools/$t > $S/sweep.tmp 2>&1; echo "== $t rc $? bytes $(wc -c < $S/sweep.tmp) frames $(grep -c '^    at ' $S/sweep.tmp)"; head -c 300 $S/sweep.tmp; echo) >> $S/sweep3.out
done
echo "sweep end $(date -u +%H:%M:%SZ)"; echo done
