#!/bin/bash
# F5 diagnosis: the 12-seed sweep text on a build of plain main WITHOUT the D673 change (the l197 worktree, 47d88d7 = c9d520e + Lap R; chase/ identical to cc8eea8's).
# If its md5 is fa938de4... the reference value 599ab239 moved with main and D673 is neutral; if it is 599ab239 the D673 change moved the chase at run_length_s 0.
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
WT="C:/Users/zackn/Downloads/dreamzone-3-a-l197"
OUT="$SP/chain_f5"
mkdir -p "$OUT"
cat > "$SP/cbuild_l197_chase.bat" <<'BAT'
@echo off
setlocal
cd /d C:\Users\zackn\Downloads\dreamzone-3-a-l197
set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
for /f "usebackq tokens=*" %%i in (`"%VSWHERE%" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do set "VSROOT=%%i"
call "%VSROOT%\VC\Auxiliary\Build\vcvars64.bat" >nul || exit /b 1
set "PATH=%VSROOT%\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin;%VSROOT%\Common7\IDE\CommonExtensions\Microsoft\CMake\Ninja;%PATH%"
cmake --build build -j 4 --target dz-chase || exit /b 1
BAT
echo "=== tip: $(git -C $WT log -1 --format='%h %s' | cut -c1-80); chase/ vs origin/main: $(git -C $WT diff --stat origin/main -- chase | tail -1)"
echo "=== build dz-chase $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "F5 diagnosis dz-chase build" "$WT" cmd /c "$(cygpath -w $SP)\\cbuild_l197_chase.bat" > "$OUT/build.txt" 2>&1
grep -v "waiting on" "$OUT/build.txt" | grep -i "error\|FAILED\|lockrun\|gave up" | head -6 | cut -c1-300
grep -q "exit 0" "$OUT/build.txt" || { echo "BUILD DID NOT SUCCEED, stopping"; exit 1; }
EXE=$(find $WT/build -name dz-chase.exe | head -1)
echo "=== equivalence sweep $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "F5 diagnosis equivalence" "$WT" "$(cygpath -w $EXE)" sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 2 2>/dev/null | sed -n '/^survival, seconds/,/^where chasers caught/p' > "$OUT/equiv_main.txt"
echo "main (no D673) md5 $(md5sum "$OUT/equiv_main.txt" | cut -d' ' -f1), $(wc -l < "$OUT/equiv_main.txt") lines"
echo "d673 md5  $(md5sum "$SP/chain_d673b/equiv.txt" | cut -d' ' -f1)"
echo "hawk(e0184ea base) md5 $(md5sum "$SP/chain_hawk/equiv.txt" | cut -d' ' -f1)   registered 599ab2395194ded75d0d102f84b3195d"
echo "=== done $(date -u +%H:%M:%S)"
