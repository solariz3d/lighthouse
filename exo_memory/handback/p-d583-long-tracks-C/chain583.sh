#!/bin/sh
# chain583.sh: the 50 and 100 km cases in the built app, each under the heavy-run lock, each after any timing lock is gone.
cd "/c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d583"
for r in after-50 before-100 after-100; do v=${r%-*}; k=${r#*-}; D=wv-$r; sleep 15
  while cat /c/Consonance/data/heavy-run*.lock 2>/dev/null | sed 's/not a timing session//g' | grep -qi timing; do sleep 60; done
  rm -rf $D; mkdir $D; X="C:/Users/nname/Desktop/worktrees/t180-land-582/src-tauri/target/release/t180-track-builder.exe"; [ $v = after ] && X="C:/Users/nname/Desktop/worktrees/t180-c583/src-tauri/target/release/t180-track-builder.exe"; echo "== $D $(date +%H:%M)"
  timeout 3300 node "/c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d513/lockrun2.js" "d583-webview2-$r (the built app on a long track; not a timing session)" node wv583.js "$X" "/c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d583/$D" "/c/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d583/doc/eq-STADIUM $k.t180track" open,export,install > $D.log 2>&1
  grep -vE "^  [0-9]|open loop|heavy-run: WARN|lockrun: holding" $D.log | cut -c1-450
  find $D/export $D/steam -type f -printf "%s %P\n" > $D.files.txt; rm -rf $D/export/* $D/steam/steamapps/common/assettocorsa/content/tracks/*
done
