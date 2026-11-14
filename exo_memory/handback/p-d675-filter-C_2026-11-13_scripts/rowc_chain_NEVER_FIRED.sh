#!/bin/bash
# chain.sh (D675, row C's clean re-run): wait for the game's main to carry P's timer control, move the G: tree there, build
# it under the lock, then run row C's twenty runs under the exclusive hold. Every step from a working directory on G:.
set -u
S=/c/Users/nname/AppData/Local/Temp/claude/2b46c68187c81881/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
R=/g/consonance-scratch/c-d675-rowc2; T=/g/consonance-scratch/c-d675-pacing/wt-31d1c6d; W=$(cygpath -w $S/d651)
cd $T || exit 1
for i in $(seq 1 360); do
  git fetch -q origin
  if git grep -q "PROCESS_POWER_THROTTLING_IGNORE_TIMER_RESOLUTION" origin/main -- game/world/main.cpp; then break; fi
  [ $i = 360 ] && { echo "no timer control on main after 6 h"; exit 1; }
  sleep 60
done
M=$(git rev-parse --short=7 origin/main); echo "main $M carries the timer control, $(date -u +%H:%M:%SZ)"; git log --oneline -3 origin/main
git checkout -q --detach origin/main && git submodule update --init --depth 1 -q && echo "tree at $(git log --oneline -1 | cut -c1-70); changed $(git status --short | wc -l)"
CONSONANCE_HEAVY_WAIT_MS=10800000 MSYS2_ARG_CONV_EXCL='*' node "$W\run.js" rowc2-build cmd /c "$W\build.cmd" "$(cygpath -w $T)" dz-world > $R/build.txt 2>&1
echo "build $?"; grep -E " error |FAILED" $R/build.txt | head -3
git grep -n "PROCESS_POWER_THROTTLING_IGNORE_TIMER_RESOLUTION" HEAD -- game/world/main.cpp | head -2
cd $R && ROWC_HEAD=$M CONSONANCE_HEAVY_WAIT_MS=10800000 node "$(cygpath -w /c/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js)" --run --exclusive --cmd "C D675 ROW C CLEAN RE-RUN (TIMING): the filter's cost on main $M with the timer control, defaults and filter x3, defaults first and last, from G:" -- node "$(cygpath -w $R/bench.js)" > $R/heavy-run.out 2>&1
echo "session exit $?"
grep -v "^.\{13\}   " $R/bench.log
