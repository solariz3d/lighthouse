@echo off
rem landing-train-dz3-check.cmd (B, L194): the landing train's check for dreamzone-3, run by landing-train.js in the train's own worktree
rem (its working directory). Exit 0 only when every suite (build.bat test) and both self-tests are green. The red lines it prints are the
rem ones landing-train.js names back to a branch's pane: the runner's FAIL rows, CTest's ***Failed, a self-test's FAILED total, and these.
setlocal
rem The build at 4 jobs, the room's rule for heavy runs: build.bat leaves Ninja its default (about 34 here), and that many MSVC
rem compiles at once is the low-memory reaper's case.
set CMAKE_BUILD_PARALLEL_LEVEL=4
if not exist build.bat (echo BUILD FAILED: no build.bat in %CD% & exit /b 2)
rem A merged branch may move a dependency's pin; a merge does not move the dependency's checkout, so this does.
git submodule update --init --recursive
if errorlevel 1 (echo BUILD FAILED: git submodule update & exit /b 2)
rem By its full path: a Claude Code shell sets NoDefaultCurrentDirectoryInExePath, so a bare `call build.bat` is "not
rem recognized" (the train's first real run, 2026-11-13). build\bin\... below has a path in it and is found either way.
call "%CD%\build.bat" test
if errorlevel 1 (echo SUITES RED & exit /b 1)
build\bin\dz-gym.exe --selftest
if errorlevel 1 (echo SELFTEST RED: dz-gym & exit /b 1)
build\bin\dz-world.exe --selftest
if errorlevel 1 (echo SELFTEST RED: dz-world & exit /b 1)
echo CHECK GREEN
exit /b 0
