@echo off
rem darkfilm.cmd: D675 the Dark's capture (pane E). The TEMPORARY block (otdark.js) into both trees, both built, both
rem filmed to G:, the block removed, both rebuilt so their stamps are clean again. Base: 0eabefc (b08f25e plus tools/ only).
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" >nul 2>nul
set S=C:\Users\nname\AppData\Local\Temp\claude\8e9709f509cfea85\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad
set B=G:\consonance-scratch\dz3-e-yardstick
set D=G:\consonance-scratch\dz3-e-dark
set O=G:\consonance-scratch\e-dark-film
set "CMAKE_BUILD_PARALLEL_LEVEL=6"
if not exist %O%\base mkdir %O%\base
if not exist %O%\branch mkdir %O%\branch
node %S%\otdark.js %B% || exit /b 1
node %S%\otdark.js %D% || goto undo
cd /d %B% && cmake --build build --target dz-world || goto undo
type %B%\build\game\generated\build_commit.h
cd /d %D% && cmake --build build --target dz-world || goto undo
type %D%\build\game\generated\build_commit.h
cd /d %B% && build\bin\dz-world.exe --config game/config --capture-frame %O%\base
cd /d %D% && build\bin\dz-world.exe --config game/config --capture-frame %O%\branch
:undo
node %S%\otdark.js %B% undo
node %S%\otdark.js %D% undo
cd /d %B% && cmake --build build --target dz-world
type %B%\build\game\generated\build_commit.h
cd /d %D% && cmake --build build --target dz-world
type %D%\build\game\generated\build_commit.h
git -C %B% status --short
git -C %D% status --short
echo done
