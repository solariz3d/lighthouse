#!/bin/bash
# run.sh (D675, row C's clean re-run, the chair's 06:28Z order): no waiter. The G: tree to the landed main 99b6045, the
# build under the lock, then row C's twenty runs under the exclusive hold. Every step from a working directory on G:.
set -u
S=/c/Users/nname/AppData/Local/Temp/claude/2b46c68187c81881/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
R=/g/consonance-scratch/c-d675-rowc2; T=/g/consonance-scratch/c-d675-pacing/wt-31d1c6d; W=$(cygpath -w $S/d651)
cd $T || exit 1
git checkout -q --detach 99b6045 && git submodule update --init --depth 1 -q && echo "tree at $(git log --oneline -1 | cut -c1-80); changed $(git status --short | wc -l); $(date -u +%H:%M:%SZ)"
CONSONANCE_HEAVY_WAIT_MS=3000000 MSYS2_ARG_CONV_EXCL='*' node "$W\run.js" rowc2-build cmd /c "$W\build.cmd" "$(cygpath -w $T)" dz-world > $R/build.txt 2>&1
rc=$?; echo "build $rc, $(date -u +%H:%M:%SZ)"; grep -E " error |FAILED" $R/build.txt | head -3; [ $rc = 0 ] || exit 1
echo "exe $(sha256sum build/bin/dz-world.exe | cut -c1-16) $(stat -c %y build/bin/dz-world.exe | cut -c1-19)"
cd $R && ROWC_HEAD=99b6045 CONSONANCE_HEAVY_WAIT_MS=3000000 node "$(cygpath -w /c/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js)" --run --exclusive --cmd "C D675 ROW C CLEAN RE-RUN (TIMING): the filter's cost on main 99b6045 with the timer control, defaults and filter x3, defaults first and last, from G:" -- node "$(cygpath -w $R/bench.js)" > $R/heavy-run.out 2>&1
echo "session exit $?, $(date -u +%H:%M:%SZ)"
grep -v "^.\{13\}   " $R/bench.log
