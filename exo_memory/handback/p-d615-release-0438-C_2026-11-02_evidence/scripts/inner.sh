#!/bin/sh
# inner.sh (under the heavy-run lock, BelowNormal): build 0.4.38, the full suite, cargo lib, then the built app hidden on ELYSIUM (open, Export to AC), heap per isolate
export PATH="/c/Users/nname/.cargo/bin:$PATH"
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d615
O=$S/out; W=C:/Users/nname/Desktop/worktrees/t180-c615
export CARGO_TARGET_DIR=G:/Consonance-tools/scratch-C-d615/target
cd $W || exit 9
echo "start $(date -u +%H:%M:%SZ) head $(git rev-parse --short HEAD) tree $(git rev-parse --short HEAD^{tree})" > $O/run.log
mkdir -p src-tauri/dist   # the repo CLAUDE.md: build.rs fills an empty dist
node src-tauri/release.cjs > $O/build.out 2>&1; echo "build exit $? $(date -u +%H:%M:%SZ)" >> $O/run.log
T=$CARGO_TARGET_DIR/release; sha256sum $T/t180-track-builder.exe "$T/bundle/nsis/T-180 Track Builder_0.4.38_x64-setup.exe" >> $O/run.log 2>&1
ls -l "$T/bundle/nsis/T-180 Track Builder_0.4.38_x64-setup.exe" $T/t180-track-builder.exe >> $O/run.log 2>&1
grep -i "private" $O/build.out >> $O/run.log
node --test --test-reporter=tap --test-concurrency=4 "test/*.test.js" "app/test/*.test.js" > $O/full.tap 2>&1; echo "full exit $? $(date -u +%H:%M:%SZ)" >> $O/run.log
(cd $W/src-tauri && cargo test --lib > $O/cargo.out 2>&1; echo "cargo exit $? $(date -u +%H:%M:%SZ)" >> $O/run.log)
D=G:/Consonance-tools/scratch-C-d615/wv; rm -rf $D $O/winenum.stop; mkdir -p $D
if tasklist //FI "IMAGENAME eq acs.exe" //NH | grep -qi acs.exe || tasklist //FI "IMAGENAME eq t180-track-builder.exe" //NH | grep -qi t180-track; then echo "hidden skipped: acs or the builder is running" >> $O/run.log; else
  powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File $S/wv/winenum-loop.ps1 -Out $O/winenum.txt -Stop $O/winenum.stop &
  cp G:/Consonance-tools/scratch-A-d609/his/elysium.t180track $D/../eq-ELYSIUM.t180track
  node $S/wv/wv583.js "$T/t180-track-builder.exe" "$D" G:/Consonance-tools/scratch-C-d615/eq-ELYSIUM.t180track open,install > $O/hidden.log 2>&1; echo "hidden exit $? $(date -u +%H:%M:%SZ)" >> $O/run.log
  touch $O/winenum.stop; sleep 4
  node $S/wv/wvmax.js $D > $O/wvmax.txt 2>&1
  cp $D/wv583.json $D/wv583-samples.csv $O/ 2>/dev/null
  K=$D/steam/steamapps/common/assettocorsa/content/tracks/t180b_elysium/t180b_elysium.kn5
  ls -l $D/steam/steamapps/common/assettocorsa/content/tracks/t180b_elysium/ > $O/kn5cmp.txt 2>&1
  node --max-old-space-size=8192 $S/kn5cmp.js G:/SteamLibrary/steamapps/common/assettocorsa/content/tracks/t180b_elysium/t180b_elysium.kn5 "$K" >> $O/kn5cmp.txt 2>&1
  sha256sum "$K" >> $O/kn5cmp.txt
  mkdir -p G:/Consonance-tools/scratch-C-d615/kept && cp "$K" G:/Consonance-tools/scratch-C-d615/kept/ 2>/dev/null
fi
echo "done $(date -u +%H:%M:%SZ)" >> $O/run.log
