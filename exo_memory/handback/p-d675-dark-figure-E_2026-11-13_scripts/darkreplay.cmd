@echo off
rem darkreplay.cmd: D675 the Dark (pane E): build dz-world in the base tree (0eabefc: b08f25e plus tools/ only) if needed,
rem then replay each of his kept runs (copied to G:, never his folder) on base and branch, each whole output to a file.
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" >nul 2>nul
set B=G:\consonance-scratch\dz3-e-yardstick
set D=G:\consonance-scratch\dz3-e-dark
set O=G:\consonance-scratch\e-dark-replays
cd /d %B% || exit /b 2
set "CMAKE_BUILD_PARALLEL_LEVEL=6"
cmake --build build --target dz-world
if errorlevel 1 exit /b 1
cd /d %D% || exit /b 2
cmake --build build --target dz-world
if errorlevel 1 exit /b 1
type %B%\build\game\generated\build_commit.h
type %D%\build\game\generated\build_commit.h
if not exist %O% mkdir %O%
for %%f in (G:\consonance-scratch\e-dark-runs\run-*.txt) do (
  cd /d %B%
  build\bin\dz-world.exe --replay-run "%%f" > %O%\base_%%~nf.out 2>&1
  cd /d %D%
  build\bin\dz-world.exe --replay-run "%%f" > %O%\branch_%%~nf.out 2>&1
)
echo done
