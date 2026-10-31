#!/bin/sh
# sweep-final.sh: 0.4.34 (a93ae51): release build; hidden ELYSIUM Export with the accepted 0.4.33 exe (t180-c583 build 3) and with 0.4.34; the files compared.
SC=/c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad; O=$SC/d0434; W=/c/Users/nname/Desktop/worktrees/t180-land-0433
quiet() { while tasklist //FO CSV //NH | grep -qi '"acs.exe"' || cat /c/Consonance/data/heavy-run*.lock 2>/dev/null | sed 's/not a timing session//g' | grep -qi timing; do sleep 30; done; }
cd $W; git log -1 --format="head %h"; quiet
PATH="/c/Users/nname/.cargo/bin:$PATH" timeout 3500 node $SC/d456/belownormal.js node $SC/d513/lockrun2.js land-0434-sweep-release node src-tauri/release.cjs > $O/build-sweep.log 2>&1; echo "build exit $?"
grep -E "private paths" $O/build-sweep.log; T=src-tauri/target/release; sha256sum $T/t180-track-builder.exe "$T/bundle/nsis/T-180 Track Builder_0.4.34_x64-setup.exe" | tee $O/build-sweep.sha
sha256sum /c/Users/nname/Desktop/worktrees/t180-c583/src-tauri/target/release/t180-track-builder.exe | tee $O/exe-0433.sha
cd $SC/d583
for v in 0433 0434; do D=$O/wvs-$v; rm -rf $D; mkdir -p $D; X="C:/Users/nname/Desktop/worktrees/t180-land-0433/src-tauri/target/release/t180-track-builder.exe"; [ $v = 0433 ] && X="C:/Users/nname/Desktop/worktrees/t180-c583/src-tauri/target/release/t180-track-builder.exe"; quiet; echo "== $v $(date +%H:%M)"
  timeout 3000 node $SC/d513/lockrun2.js "land-0434-webview2-$v (hidden desktop; not a timing session)" node wv583.js "$X" "$D" "$SC/d583/doc/eq-ELYSIUM.t180track" open,export > $D.log 2>&1
  grep -vE "^  [0-9]|open loop|heavy-run: WARN|lockrun: holding|SOCKET" $D.log | cut -c1-300; rm -rf $D/profile; done
node samefiles.js $O/wvs-0433/export $O/wvs-0434/export | tee $O/samefiles-0433-0434.txt
node wvsum.js $O/wvs-0434 > $O/wvsum-sweep.txt; cat $O/wvsum-sweep.txt
rm -rf $O/wvs-0433/export $O/wvs-0434/export $O/wvs-0433/steam $O/wvs-0434/steam; echo SWEEP-DONE
