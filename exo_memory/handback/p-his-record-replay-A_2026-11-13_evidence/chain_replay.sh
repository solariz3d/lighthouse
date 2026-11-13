#!/bin/bash
# Replays his run of 2026-11-13 08:23:47Z (brutal, seed 10, build e0184ea) on a scratch worktree at e0184ea and dumps the tracks. His run files are read-only data: the copies in scratch are used.
export MSYS_NO_PATHCONV=1
SP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170"
RP="C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/replay"
WT="C:/Users/zackn/Downloads/dreamzone-3-a-replay"
cat > "$SP/cbuild_replay.bat" <<'BAT'
@echo off
setlocal
cd /d C:\Users\zackn\Downloads\dreamzone-3-a-replay
set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
for /f "usebackq tokens=*" %%i in (`"%VSWHERE%" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do set "VSROOT=%%i"
call "%VSROOT%\VC\Auxiliary\Build\vcvars64.bat" >nul || exit /b 1
set "PATH=%VSROOT%\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin;%VSROOT%\Common7\IDE\CommonExtensions\Microsoft\CMake\Ninja;%PATH%"
cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release || exit /b 1
cmake --build build -j 4 --target replay_dump || exit /b 1
BAT
echo "=== build $(date -u +%H:%M:%S)"
node "$SP/lockrun.js" "A replay_dump build (e0184ea scratch)" "$WT" cmd /c "$(cygpath -w $SP)\\cbuild_replay.bat" > "$RP/build.txt" 2>&1
grep -v "waiting on" "$RP/build.txt" | grep -i "error\|FAILED\|lockrun\|gave up" | head -8 | cut -c1-300
grep -q "exit 0" "$RP/build.txt" || { echo "BUILD DID NOT SUCCEED, stopping"; exit 1; }
EXE=$(find $WT/build -name replay_dump.exe | head -1)
echo "=== replay $(date -u +%H:%M:%S) $EXE"
node "$SP/lockrun.js" "A replay_dump run" "$WT" "$(cygpath -w $EXE)" "$(cygpath -w $RP/runs/run-20261113-082347.txt)" "$(cygpath -w $RP/out)" 0.1 2>&1 | grep -v "waiting on" | cut -c1-300
ls -la "$RP" | grep out_ | cut -c1-120
echo "=== done $(date -u +%H:%M:%S)"
