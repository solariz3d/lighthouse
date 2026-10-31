#!/bin/sh
# final.sh: 0.4.34 landing (8ead393): the release build, the hidden built-app runs (ELYSIUM; 50 km), and ELYSIUM's export bytes against d08feea.
SC=/c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad; O=$SC/d0434; W=/c/Users/nname/Desktop/worktrees/t180-land-0433
quiet() { while tasklist //FO CSV //NH | grep -qi '"acs.exe"' || cat /c/Consonance/data/heavy-run*.lock 2>/dev/null | sed 's/not a timing session//g' | grep -qi timing; do sleep 30; done; }
cd $W; git log -1 --format="head %h"; quiet
PATH="/c/Users/nname/.cargo/bin:$PATH" timeout 3500 node $SC/d456/belownormal.js node $SC/d513/lockrun2.js land-0434-release node src-tauri/release.cjs > $O/build-final.log 2>&1; echo "build exit $?"
grep -E "private paths" $O/build-final.log; T=src-tauri/target/release; sha256sum $T/t180-track-builder.exe "$T/bundle/nsis/T-180 Track Builder_0.4.34_x64-setup.exe" | tee $O/build-final.sha
EXE="C:/Users/nname/Desktop/worktrees/t180-land-0433/src-tauri/target/release/t180-track-builder.exe"; cd $SC/d583
for r in elysium 50; do D=$O/wvf-$r; rm -rf $D; mkdir -p $D; T="$SC/d583/doc/eq-STADIUM 50.t180track"; [ $r = elysium ] && T="$SC/d583/doc/eq-ELYSIUM.t180track"; quiet; echo "== $r $(date +%H:%M)"
  timeout 3000 node $SC/d513/lockrun2.js "land-0434-webview2-$r (hidden desktop; not a timing session)" node wv583.js "$EXE" "$D" "$T" open,export,install > $D.log 2>&1
  grep -vE "^  [0-9]|open loop|heavy-run: WARN|lockrun: holding" $D.log | cut -c1-330; rm -rf $D/export $D/steam $D/profile; done
node wvsum.js $O/wvf-elysium $O/wvf-50 > $O/wvsum-final.txt; cat $O/wvsum-final.txt
cd $O; quiet; timeout 900 node $SC/d456/belownormal.js node $SC/d513/lockrun2.js expdigest-0434 node --max-old-space-size=12000 $SC/d0433/expdigest.js $W $SC/d583/doc/eq-ELYSIUM.t180track 2>/dev/null > expdigest-0434.txt
diff $SC/d0433/expdigest-land-582.txt expdigest-0434.txt && echo "ELYSIUM export IDENTICAL to d08feea"; tail -1 expdigest-0434.txt; echo FINAL-DONE
