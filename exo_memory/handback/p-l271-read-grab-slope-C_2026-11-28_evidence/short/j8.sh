#!/bin/bash
# j8.sh: pane C, L271 section 8. Run under heavy-run (belownormal). The registration is committed FIRST; if that fails, nothing runs.
set -u
S=<scratch>/l271
LH=/c/Consonance/lighthouse
BT=/c/Users/zackn/Downloads/t180-track-builder
WT=C:/Consonance/t180-wt-c-l271s
HB=exo_memory/handback/p-l271-read-grab-slope-C_2026-11-28.md
EV=C:/Consonance/lighthouse/exo_memory/handback/p-l271-read-grab-slope-C_2026-11-28_evidence
L=$S/j8.log
date -u +%FT%TZ > $S/j8.start
echo "start $(date -u +%FT%TZ)" > $L
cd $LH || exit 3
git add -- $HB && git commit -q -m "pane C (L): L271 short re-read registered (R1-R3) before any run, cc4fa71..16a93d1" -m "Pane C (seat 0845a868)." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017jVCxaAah7YfDwfSsgsdXy" -- $HB || { echo "REGISTRATION COMMIT FAILED: nothing run" >> $L; exit 3; }
echo "registered: $(git log -1 --format='%h %cI %s' -- $HB)" >> $L
cd $BT || exit 3
git worktree add -q --detach $WT 16a93d1 >> $L 2>&1 || { echo "WORKTREE ADD FAILED" >> $L; exit 3; }
echo "== R3" >> $L
git log -1 --format='16a93d1 parent %P' 16a93d1 >> $L
git diff --stat cc4fa71 16a93d1 >> $L
git diff --name-only cc4fa71 16a93d1 -- app/core src test >> $L; echo "(names under app/core, src, test above, none expected)" >> $L
git diff -U0 cc4fa71 16a93d1 -- app/test/core-pieces-ui.test.js | grep '^@@' >> $L
git show 16a93d1:app/test/core-pieces-ui.test.js | grep -n "^test(" | grep -A1 "'row 25 (" >> $L
echo "== R1" >> $L
cd $S
node r25c.js $WT $S/r25c.json >> $L 2>&1
echo "== R2" >> $L
node cl8.js $EV >> $L 2>&1
echo "== cleanup" >> $L
st=$(git -C $WT status --short)
if [ -z "$st" ]; then git -C $BT worktree remove $WT >> $L 2>&1 && echo "worktree removed (status clean)" >> $L; else echo "WORKTREE NOT CLEAN, left: $st" >> $L; fi
echo "end $(date -u +%FT%TZ)" >> $L
